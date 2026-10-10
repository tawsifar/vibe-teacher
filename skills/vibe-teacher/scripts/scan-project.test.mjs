// Tests for scan-project.mjs. Run: node --test skills/vibe-teacher/scripts/scan-project.test.mjs
// The example fixtures live in the repo's examples/ folder; tests that need them
// are skipped when the skill is installed on its own.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { scanProject, maskSecret, isIgnoredBy } from './scan-project.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const examples = path.resolve(here, '..', '..', '..', 'examples');
const expressApp = path.join(examples, 'sample-express-app');
const nextApp = path.join(examples, 'sample-next-app');
const noFixtures = !fs.existsSync(expressApp);
const FAKE_KEY = 'sk-FAKE-EXAMPLE-0000000000000000';

function tempProject(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vibe-scan-'));
  for (const [rel, content] of Object.entries(files)) {
    const full = path.join(dir, ...rel.split('/'));
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  return dir;
}

test('maskSecret never reveals more than 3 + 3 characters', () => {
  assert.equal(maskSecret(FAKE_KEY), 'sk-…000');
  assert.equal(maskSecret('short'), 's…');
  assert.ok(!maskSecret('abcdefghijklmnop').includes('defghijklm'));
});

test('isIgnoredBy understands common .env patterns', () => {
  assert.equal(isIgnoredBy('node_modules\n', '.env'), false);
  assert.equal(isIgnoredBy('.env\n', '.env'), true);
  assert.equal(isIgnoredBy('.env*\n!.env.example\n', '.env.example'), false);
  assert.equal(isIgnoredBy('*.env\n', 'config/prod.env'), true);
  assert.equal(isIgnoredBy('/.env\n', '.env'), true);
});

test('detects Express and its routes', { skip: noFixtures }, () => {
  const facts = scanProject(expressApp);
  assert.ok(facts.frameworks.some((f) => f.name === 'express'));
  assert.ok(facts.entryPoints.includes('server.js'));
  const post = facts.routes.find((r) => r.method === 'POST' && r.path === '/api/todos');
  assert.ok(post, 'POST /api/todos should be found');
  assert.equal(post.file, 'server.js');
  assert.ok(post.line > 0);
});

test('finds the planted fake key and masks it', { skip: noFixtures }, () => {
  const facts = scanProject(expressApp);
  const hit = facts.secrets.find((s) => s.file === 'server.js' && s.type === 'openai-style-key');
  assert.ok(hit, 'planted key in server.js should be found');
  assert.ok(hit.line > 0);
  assert.ok(!hit.preview.includes(FAKE_KEY));
  assert.ok(hit.preview.length <= 7);
  assert.ok(!JSON.stringify(facts).includes(FAKE_KEY), 'full key must never appear in output');
});

test('flags .env that is not in .gitignore', { skip: noFixtures }, () => {
  const facts = scanProject(expressApp);
  assert.ok(facts.env.envFiles.includes('.env'));
  assert.equal(facts.env.envInGitignore, false);
  assert.equal(facts.env.hasEnvExample, false);
});

test('reports missing tests and fetch without error handling', { skip: noFixtures }, () => {
  const facts = scanProject(expressApp);
  assert.equal(facts.quality.hasTests, false);
  assert.ok(facts.risks.some((r) => r.type === 'fetch-without-error-handling' && r.file === 'public/app.js'));
});

test('detects Next.js app router API routes', { skip: noFixtures }, () => {
  const facts = scanProject(nextApp);
  const names = facts.frameworks.map((f) => f.name);
  assert.ok(names.includes('next') && names.includes('react'));
  assert.ok(facts.routes.some((r) => r.method === 'GET' && r.path === '/api/hello'));
});

test('ignores node_modules and other build folders', () => {
  const dir = tempProject({
    'index.js': 'console.log("hi")\n',
    'node_modules/evil/index.js': `const k = "${FAKE_KEY}";\n`,
    'dist/bundle.js': `const k = "${FAKE_KEY}";\n`,
  });
  const facts = scanProject(dir);
  assert.equal(facts.summary.files, 1);
  assert.equal(facts.secrets.length, 0);
  assert.ok(!facts.tree.some((l) => l.includes('node_modules')));
});

test('ignores placeholder values and .env.example files for generic secrets', () => {
  const dir = tempProject({
    'config.js': 'const apiKey = "your-api-key-here";\nconst password = process.env.PASSWORD;\n',
    '.env.example': 'API_KEY="replace-me-please"\n',
    '.gitignore': '.env\n',
  });
  const facts = scanProject(dir);
  assert.equal(facts.secrets.length, 0);
  assert.equal(facts.env.hasEnvExample, true);
  assert.equal(facts.env.envInGitignore, true);
});

test('works with Windows-style and trailing-separator paths; output uses forward slashes', () => {
  const dir = tempProject({ 'src/routes/api.js': "router.get('/api/items', (req, res) => res.json([]));\n" });
  const facts = scanProject(dir + path.sep);
  const route = facts.routes.find((r) => r.path === '/api/items');
  assert.ok(route);
  assert.equal(route.file, 'src/routes/api.js');
  assert.ok(!facts.root.includes('\\'));
  if (process.platform === 'win32') {
    const backslashed = scanProject(dir.replace(/\//g, '\\'));
    assert.equal(backslashed.routes[0].file, 'src/routes/api.js');
  }
});

test('detects Python frameworks and decorator routes', () => {
  const dir = tempProject({
    'requirements.txt': 'Flask==3.0.0\nrequests\n',
    'app.py': "from flask import Flask\napp = Flask(__name__)\n\n@app.route('/login', methods=['POST'])\ndef login():\n    return 'ok'\n",
  });
  const facts = scanProject(dir);
  assert.ok(facts.frameworks.some((f) => f.name === 'flask'));
  assert.ok(facts.routes.some((r) => r.path === '/login' && r.method === 'POST'));
  assert.ok(facts.entryPoints.includes('app.py'));
});

test('flags long functions and large files', () => {
  const body = Array.from({ length: 60 }, (_, i) => `  const v${i} = ${i};`).join('\n');
  const filler = Array.from({ length: 320 }, (_, i) => `// line ${i}`).join('\n');
  const dir = tempProject({ 'big.js': `function huge() {\n${body}\n}\n${filler}\n` });
  const facts = scanProject(dir);
  assert.ok(facts.quality.longFunctions.some((f) => f.name === 'huge' && f.lines > 50));
  assert.ok(facts.quality.largeFiles.some((f) => f.file === 'big.js'));
});

test('CLI prints valid JSON and fails kindly on a missing folder', { skip: noFixtures }, () => {
  const script = path.join(here, 'scan-project.mjs');
  const out = execFileSync(process.execPath, [script, expressApp], { encoding: 'utf8' });
  const facts = JSON.parse(out);
  for (const key of ['root', 'summary', 'tree', 'frameworks', 'entryPoints', 'routes', 'env', 'secrets', 'quality', 'warnings']) {
    assert.ok(key in facts, `missing key ${key}`);
  }
  assert.throws(
    () => execFileSync(process.execPath, [script, path.join(examples, 'does-not-exist')], { stdio: 'pipe' }),
    (err) => err.status === 1 && /Folder not found/.test(String(err.stderr)),
  );
});
