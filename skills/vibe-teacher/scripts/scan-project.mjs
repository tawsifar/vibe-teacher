#!/usr/bin/env node
// VIBE Teacher fact collector.
// Zero dependencies. Reads a project folder and prints JSON facts that the
// skill uses to teach, score and warn. It never modifies anything and never
// prints a full secret value.
//
// Usage: node scan-project.mjs [projectRoot] [--max-files 5000]

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const VERSION = '0.1.0';

const IGNORE_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', 'out', 'coverage', 'venv', '.venv',
  'env', '__pycache__', '.vercel', '.turbo', '.svelte-kit', '.nuxt', '.output', '.cache',
  '.parcel-cache', '.idea', '.vscode', 'vendor', 'target', '.pytest_cache', '.mypy_cache',
  '.expo', 'bower_components', '.angular', '.gradle', 'Pods',
]);

const SOURCE_EXT = new Set([
  '.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.mts', '.cts', '.vue', '.svelte', '.astro',
  '.py', '.html', '.htm', '.css', '.scss', '.sass', '.less', '.rb', '.go', '.php', '.java',
  '.kt', '.rs', '.swift', '.dart', '.cs', '.sql', '.sh', '.ps1',
]);
const CODE_EXT = new Set([
  '.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.mts', '.cts', '.vue', '.svelte', '.astro', '.py',
]);
const JS_EXT = new Set(['.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.mts', '.cts', '.vue', '.svelte', '.astro']);
const SKIP_SECRET_FILES = new Set([
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lock', 'poetry.lock', 'uv.lock',
  'Pipfile.lock', 'composer.lock', 'Cargo.lock',
]);

const MAX_FILE_BYTES = 1024 * 1024;
const MAX_TREE_LINES = 200;
const MAX_LIST = 200;

const SECRET_PATTERNS = [
  { type: 'private-key', re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g },
  { type: 'openai-style-key', re: /\bsk-[A-Za-z0-9_-]{20,}/g },
  { type: 'aws-access-key', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { type: 'github-token', re: /\bghp_[A-Za-z0-9]{36}\b/g },
  { type: 'google-api-key', re: /\bAIza[0-9A-Za-z_-]{35}/g },
  { type: 'slack-token', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}/g },
  {
    type: 'generic-secret',
    re: /\b(?:api[_-]?key|apikey|secret|password|passwd|token|access[_-]?key)\w*\s*[:=]\s*['"]([^'"\s]{8,})['"](?!\s*\+)/gi,
    group: 1,
  },
];
const PLACEHOLDER = /^(?:your|change|replace|xxx|todo|example|placeholder|dummy|test|\*+|<|\$\{|process\.env|os\.environ|import\.meta)/i;

const RISK_PATTERNS = [
  { type: 'eval', re: /\beval\s*\(|new Function\s*\(/, ext: JS_EXT },
  { type: 'eval', re: /\b(?:eval|exec)\s*\(/, ext: new Set(['.py']) },
  { type: 'innerHTML', re: /\.innerHTML\s*=|dangerouslySetInnerHTML/, ext: JS_EXT },
  { type: 'open-cors', re: /\bcors\(\s*\)|origin\s*:\s*['"]\*['"]|Access-Control-Allow-Origin['"]?\s*[,:]\s*['"]\*['"]/, ext: JS_EXT },
  { type: 'open-cors', re: /allow_origins\s*=\s*\[\s*['"]\*['"]|CORS\(\s*app\s*\)/, ext: new Set(['.py']) },
  {
    type: 'sql-string-building',
    re: /(?:query|execute|raw)\s*\(\s*(?:`[^`]*\$\{|['"][^'"]*\b(?:SELECT|INSERT|UPDATE|DELETE)\b[^'"]*['"]\s*\+|f['"][^'"]*\b(?:SELECT|INSERT|UPDATE|DELETE)\b)/i,
    ext: CODE_EXT,
  },
  { type: 'debug-mode', re: /debug\s*=\s*True|app\.run\([^)]*debug\s*=\s*True/, ext: new Set(['.py']) },
];

// ---------------------------------------------------------------- helpers

export function maskSecret(value) {
  const v = String(value ?? '');
  if (v.length <= 8) return v.slice(0, 1) + '…';
  return `${v.slice(0, 3)}…${v.slice(-3)}`;
}

const toPosix = (p) => p.split(path.sep).join('/');

function isBinary(buf) {
  const n = Math.min(buf.length, 8000);
  for (let i = 0; i < n; i++) if (buf[i] === 0) return true;
  return false;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function globToRegex(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') { re += '.*'; i++; } else re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}$`);
}

// Minimal .gitignore check: is relPath (posix, relative to the gitignore dir) ignored?
export function isIgnoredBy(gitignoreText, relPath) {
  let ignored = false;
  const base = relPath.split('/').pop();
  for (const raw of gitignoreText.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    let negate = false;
    if (line.startsWith('!')) { negate = true; line = line.slice(1); }
    if (line.endsWith('/')) continue; // directory-only rule
    const anchored = line.includes('/');
    const pattern = line.replace(/^\//, '');
    const re = globToRegex(pattern);
    const hit = anchored ? re.test(relPath) : re.test(base) || re.test(relPath);
    if (hit) ignored = !negate;
  }
  return ignored;
}

function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

// ---------------------------------------------------------------- walk

function walk(root, maxFiles, warnings) {
  const files = [];
  const treeLines = [];
  let truncated = false;
  let skippedLarge = 0;

  function visit(dir, depth, prefix) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      warnings.push(`Could not read folder ${toPosix(path.relative(root, dir)) || '.'}: ${err.code || err.message}`);
      return;
    }
    entries = entries
      .filter((e) => !(e.isDirectory() && IGNORE_DIRS.has(e.name)) && !e.isSymbolicLink())
      .sort((a, b) => (a.isDirectory() === b.isDirectory() ? a.name.localeCompare(b.name) : a.isDirectory() ? -1 : 1));

    entries.forEach((entry, idx) => {
      const full = path.join(dir, entry.name);
      const rel = toPosix(path.relative(root, full));
      const last = idx === entries.length - 1;
      const showInTree = depth < 3 && treeLines.length < MAX_TREE_LINES;
      if (entry.isDirectory()) {
        if (showInTree) treeLines.push(`${prefix}${last ? '└── ' : '├── '}${entry.name}/`);
        visit(full, depth + 1, prefix + (last ? '    ' : '│   '));
        return;
      }
      if (!entry.isFile()) return;
      if (files.length >= maxFiles) { truncated = true; return; }
      let size = 0;
      try { size = fs.statSync(full).size; } catch { return; }
      const info = { rel, full, ext: path.extname(entry.name).toLowerCase(), name: entry.name, size, lines: 0, text: null };
      if (size > MAX_FILE_BYTES) {
        skippedLarge++;
      } else {
        try {
          const buf = fs.readFileSync(full);
          if (!isBinary(buf)) {
            info.text = buf.toString('utf8');
            info.lines = info.text.length ? info.text.split(/\r?\n/).length : 0;
          }
        } catch { /* unreadable: keep as non-text */ }
      }
      files.push(info);
      if (showInTree) {
        const count = info.text !== null ? ` (${info.lines})` : '';
        treeLines.push(`${prefix}${last ? '└── ' : '├── '}${entry.name}${count}`);
      }
    });
  }

  visit(root, 0, '');
  if (truncated) warnings.push(`Scan stopped at ${maxFiles} files. Results cover only part of the project.`);
  if (skippedLarge) warnings.push(`${skippedLarge} file(s) over 1 MB were skipped.`);
  if (treeLines.length >= MAX_TREE_LINES) treeLines.push('… (tree shortened)');
  return { files, treeLines };
}

// ---------------------------------------------------------------- detectors

const FRAMEWORK_DEPS = {
  express: 'express', next: 'next', react: 'react', vite: 'vite', vue: 'vue', nuxt: 'nuxt',
  svelte: 'svelte', '@sveltejs/kit': 'sveltekit', '@angular/core': 'angular', '@nestjs/core': 'nestjs',
  fastify: 'fastify', koa: 'koa', hono: 'hono', prisma: 'prisma', '@prisma/client': 'prisma',
  mongoose: 'mongoose', 'drizzle-orm': 'drizzle', sequelize: 'sequelize',
  '@supabase/supabase-js': 'supabase', '@supabase/ssr': 'supabase', firebase: 'firebase',
  'firebase-admin': 'firebase', tailwindcss: 'tailwind', typescript: 'typescript', electron: 'electron',
  astro: 'astro', 'react-native': 'react-native', expo: 'expo',
};
const PY_FRAMEWORKS = {
  flask: 'flask', fastapi: 'fastapi', django: 'django', sqlalchemy: 'sqlalchemy',
  supabase: 'supabase', 'firebase-admin': 'firebase', streamlit: 'streamlit', pydantic: 'pydantic',
};
const CONFIG_HINTS = [
  [/^next\.config\.[cm]?[jt]s$/, 'next'], [/^vite\.config\.[cm]?[jt]s$/, 'vite'],
  [/^tailwind\.config\.[cm]?[jt]s$/, 'tailwind'], [/^angular\.json$/, 'angular'],
  [/^svelte\.config\.[cm]?js$/, 'svelte'], [/^nuxt\.config\.[cm]?[jt]s$/, 'nuxt'],
  [/^firebase\.json$/, 'firebase'], [/^manage\.py$/, 'django'], [/^schema\.prisma$/, 'prisma'],
  [/^astro\.config\.[cm]?[jt]s$/, 'astro'], [/^firestore\.rules$/, 'firebase'],
];

function detectStack(files) {
  const frameworks = new Map();
  const add = (name, evidence) => { if (!frameworks.has(name)) frameworks.set(name, evidence); };
  const packageJsons = [];
  const packageManagers = new Set();

  for (const f of files) {
    if (f.name === 'package.json' && f.text) {
      const pkg = readJson(f.full);
      if (!pkg) continue;
      packageJsons.push({ rel: f.rel, pkg });
      const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
      for (const dep of Object.keys(deps)) {
        if (FRAMEWORK_DEPS[dep]) add(FRAMEWORK_DEPS[dep], `${f.rel} dependency "${dep}"`);
      }
    }
    if ((f.name === 'requirements.txt' || f.name === 'pyproject.toml' || f.name === 'Pipfile') && f.text) {
      const lower = f.text.toLowerCase();
      for (const [dep, name] of Object.entries(PY_FRAMEWORKS)) {
        if (new RegExp(`(^|[\\s"'\\[,])${dep.replace('-', '[-_]')}([\\s=<>~!\\[;"',]|$)`, 'm').test(lower)) {
          add(name, `${f.rel} lists "${dep}"`);
        }
      }
    }
    for (const [re, name] of CONFIG_HINTS) if (re.test(f.name)) add(name, `config file ${f.rel}`);
    if (f.rel.startsWith('supabase/') && f.name === 'config.toml') add('supabase', `config file ${f.rel}`);

    const pm = {
      'package-lock.json': 'npm', 'yarn.lock': 'yarn', 'pnpm-lock.yaml': 'pnpm', 'bun.lockb': 'bun',
      'bun.lock': 'bun', 'requirements.txt': 'pip', 'poetry.lock': 'poetry', 'uv.lock': 'uv',
      Pipfile: 'pipenv', 'pyproject.toml': 'pip',
    }[f.name];
    if (pm) packageManagers.add(pm);
  }
  if (packageJsons.length && ![...packageManagers].some((p) => ['npm', 'yarn', 'pnpm', 'bun'].includes(p))) {
    packageManagers.add('npm');
  }
  if (!frameworks.size && files.some((f) => f.ext === '.html')) {
    add('static-html', 'HTML files and no framework found');
  }
  return {
    frameworks: [...frameworks].map(([name, evidence]) => ({ name, evidence })),
    packageJsons,
    packageManagers: [...packageManagers],
  };
}

const ENTRY_CANDIDATES = [
  'server.js', 'server.ts', 'index.js', 'index.ts', 'app.js', 'app.ts', 'main.js', 'main.ts',
  'src/index.js', 'src/index.ts', 'src/main.js', 'src/main.ts', 'src/main.jsx', 'src/main.tsx',
  'src/index.jsx', 'src/index.tsx', 'src/App.jsx', 'src/App.tsx', 'src/server.js', 'src/server.ts',
  'server/index.js', 'server/index.ts', 'server/server.js', 'backend/server.js', 'backend/index.js',
  'app/page.jsx', 'app/page.tsx', 'app/page.js', 'app/layout.jsx', 'app/layout.tsx',
  'src/app/page.tsx', 'src/app/page.jsx', 'pages/index.js', 'pages/index.jsx', 'pages/index.tsx',
  'index.html', 'public/index.html', 'main.py', 'app.py', 'manage.py', 'wsgi.py', 'asgi.py',
  'app/main.py', 'src/main.py',
];

function detectEntryPoints(files, packageJsons) {
  const have = new Set(files.map((f) => f.rel));
  const entries = new Set();
  for (const { rel, pkg } of packageJsons) {
    const dir = path.posix.dirname(rel) === '.' ? '' : `${path.posix.dirname(rel)}/`;
    if (typeof pkg.main === 'string') entries.add(path.posix.normalize(dir + pkg.main));
    const start = pkg.scripts?.start || pkg.scripts?.dev || '';
    const m = /\b(?:node|nodemon|tsx|ts-node|bun)\s+(?:--\S+\s+)*([\w./-]+\.[cm]?[jt]s)/.exec(start);
    if (m) entries.add(path.posix.normalize(dir + m[1]));
  }
  for (const c of ENTRY_CANDIDATES) if (have.has(c)) entries.add(c);
  return [...entries].filter((e) => have.has(e));
}

function detectRoutes(files) {
  const routes = [];
  const push = (r) => { if (routes.length < MAX_LIST) routes.push(r); };
  const jsRoute = /\b(app|router|server|api|route[rs]?)\.(get|post|put|patch|delete|all)\(\s*['"`]([^'"`]+)['"`]/g;
  const pyRoute = /@(\w+)\.(route|get|post|put|patch|delete)\(\s*['"]([^'"]+)['"](?:[^)]*methods\s*=\s*\[([^\]]*)\])?/g;

  for (const f of files) {
    if (f.text === null || !CODE_EXT.has(f.ext)) continue;
    // Next.js app router: app/**/route.(js|ts)
    const appRoute = /(?:^|\/)app\/((?:.*\/)?)route\.[cm]?[jt]sx?$/.exec(f.rel);
    if (appRoute) {
      const urlPath = '/' + appRoute[1].replace(/\/$/, '').replace(/\([^)]*\)\/?/g, '');
      const methods = [...f.text.matchAll(/export\s+(?:async\s+)?(?:function|const)\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/g)];
      for (const m of methods.length ? methods : [{ 1: 'ANY', index: 0 }]) {
        push({ method: m[1], path: urlPath, file: f.rel, line: lineOf(f.text, m.index), kind: 'next-app-router' });
      }
      continue;
    }
    // Next.js pages router: pages/api/**
    const pagesApi = /(?:^|\/)pages\/(api\/.*)\.[cm]?[jt]sx?$/.exec(f.rel);
    if (pagesApi) {
      push({ method: 'ANY', path: '/' + pagesApi[1].replace(/\/index$/, ''), file: f.rel, line: 1, kind: 'next-pages-api' });
      continue;
    }
    if (JS_EXT.has(f.ext)) {
      for (const m of f.text.matchAll(jsRoute)) {
        if (!m[3].startsWith('/') && m[3] !== '*') continue;
        push({ method: m[2].toUpperCase(), path: m[3], file: f.rel, line: lineOf(f.text, m.index), kind: 'express-style' });
      }
    }
    if (f.ext === '.py') {
      for (const m of f.text.matchAll(pyRoute)) {
        let method = m[2] === 'route' ? 'GET' : m[2].toUpperCase();
        if (m[4]) method = m[4].replace(/['"\s]/g, '').toUpperCase() || method;
        push({ method, path: m[3], file: f.rel, line: lineOf(f.text, m.index), kind: 'python-decorator' });
      }
      if (f.name === 'urls.py') {
        for (const m of f.text.matchAll(/\b(?:re_)?path\(\s*r?['"]([^'"]*)['"]/g)) {
          push({ method: 'ANY', path: '/' + m[1], file: f.rel, line: lineOf(f.text, m.index), kind: 'django-urls' });
        }
      }
    }
  }
  return routes;
}

function detectSecrets(files) {
  const secrets = [];
  for (const f of files) {
    if (f.text === null || SKIP_SECRET_FILES.has(f.name)) continue;
    const isExample = /\.(example|sample|template|dist)$/i.test(f.name);
    const lines = f.text.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (line.length > 2000) return; // minified line: skip
      const seen = new Set();
      for (const { type, re, group } of SECRET_PATTERNS) {
        re.lastIndex = 0;
        for (const m of line.matchAll(re)) {
          const value = group ? m[group] : m[0];
          if (type === 'generic-secret' && (isExample || PLACEHOLDER.test(value))) continue;
          if (seen.has(value) || [...seen].some((s) => s.includes(value) || value.includes(s))) continue;
          seen.add(value);
          if (secrets.length < MAX_LIST) secrets.push({ file: f.rel, line: i + 1, type, preview: maskSecret(value) });
        }
      }
    });
  }
  return secrets;
}

function detectRisks(files) {
  const risks = [];
  for (const f of files) {
    if (f.text === null || !CODE_EXT.has(f.ext)) continue;
    const lines = f.text.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (line.length > 2000) return;
      for (const { type, re, ext } of RISK_PATTERNS) {
        if (ext.has(f.ext) && re.test(line) && risks.length < MAX_LIST) risks.push({ file: f.rel, line: i + 1, type });
      }
    });
    // fetch()/axios calls in a file with no error handling at all
    if (JS_EXT.has(f.ext) && /\b(?:fetch|axios\.\w+)\s*\(/.test(f.text) && !/\bcatch\b/.test(f.text)) {
      const idx = f.text.search(/\b(?:fetch|axios\.\w+)\s*\(/);
      risks.push({ file: f.rel, line: lineOf(f.text, idx), type: 'fetch-without-error-handling' });
    }
  }
  return risks;
}

function detectEnv(root, files) {
  const envFiles = files.filter((f) => /^\.env(\..+)?$/.test(f.name)).map((f) => f.rel);
  const exampleRe = /\.(example|sample|template|dist)$/i;
  const realEnv = envFiles.filter((r) => !exampleRe.test(r));
  const hasEnvExample = envFiles.some((r) => exampleRe.test(r));

  const gitignores = new Map(files.filter((f) => f.name === '.gitignore' && f.text !== null)
    .map((f) => [path.posix.dirname(f.rel), f.text]));
  const ignoredByAny = (rel) => {
    // check every .gitignore from the root down to the file's folder
    let dir = path.posix.dirname(rel);
    while (true) {
      const text = gitignores.get(dir);
      const relToDir = dir === '.' ? rel : rel.slice(dir.length + 1);
      if (text && isIgnoredBy(text, relToDir)) return true;
      if (dir === '.') return false;
      dir = path.posix.dirname(dir);
    }
  };
  const envInGitignore = realEnv.length ? realEnv.every(ignoredByAny) : ignoredByAny('.env');

  let envTrackedByGit = null;
  let trackedEnvFiles = [];
  if (realEnv.length) {
    try {
      const out = execFileSync('git', ['ls-files', '-z', '--', ...realEnv], {
        cwd: root, stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8', timeout: 10000,
      });
      trackedEnvFiles = out.split('\0').filter(Boolean).map((p) => {
        // git prints paths relative to cwd
        return toPosix(p);
      });
      envTrackedByGit = trackedEnvFiles.length > 0;
    } catch {
      envTrackedByGit = null; // git missing or not a repository
    }
  } else {
    envTrackedByGit = false;
  }
  return { envFiles, envInGitignore, envTrackedByGit, trackedEnvFiles, hasEnvExample };
}

function findLongFunctions(f) {
  const out = [];
  const lines = f.text.split(/\r?\n/);
  if (f.ext === '.py') {
    lines.forEach((line, i) => {
      const m = /^(\s*)(?:async\s+)?def\s+(\w+)/.exec(line);
      if (!m) return;
      const indent = m[1].length;
      let end = i;
      for (let j = i + 1; j < lines.length; j++) {
        if (!lines[j].trim()) continue;
        if (lines[j].search(/\S/) <= indent) break;
        end = j;
      }
      if (end - i + 1 > 50) out.push({ file: f.rel, name: m[2], line: i + 1, lines: end - i + 1 });
    });
    return out;
  }
  const startRe = /(?:function\s+(\w+)\s*\(|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*=>|\w+\s*=>)|^\s*(?:async\s+)?(\w+)\s*\([^)]*\)\s*\{)/;
  lines.forEach((line, i) => {
    const m = startRe.exec(line);
    if (!m) return;
    const name = m[1] || m[2] || m[3];
    if (['if', 'for', 'while', 'switch', 'catch', 'return'].includes(name)) return;
    let depth = 0;
    let opened = false;
    for (let j = i; j < lines.length && j < i + 2000; j++) {
      const clean = lines[j].replace(/(['"`])(?:\\.|(?!\1).)*\1/g, '').replace(/\/\/.*$/, '');
      for (const ch of clean) {
        if (ch === '{') { depth++; opened = true; } else if (ch === '}') depth--;
      }
      if (opened && depth <= 0) {
        if (j - i + 1 > 50) out.push({ file: f.rel, name, line: i + 1, lines: j - i + 1 });
        return;
      }
      if (!opened && j > i + 2) return; // arrow function without braces
    }
  });
  return out;
}

function detectQuality(files, packageJsons) {
  const rels = files.map((f) => f.rel);
  const testRe = /(?:\.(?:test|spec)\.[cm]?[jt]sx?$|(?:^|\/)(?:__tests__|tests?)\/.+\.(?:[cm]?[jt]sx?|py)$|(?:^|\/)test_[^/]+\.py$|_test\.py$)/;
  const testFiles = rels.filter((r) => testRe.test(r));
  const allDeps = Object.assign({}, ...packageJsons.map(({ pkg }) => ({ ...pkg.dependencies, ...pkg.devDependencies })));
  const pyText = files.filter((f) => ['pyproject.toml', 'requirements.txt', 'requirements-dev.txt', 'setup.cfg'].includes(f.name))
    .map((f) => f.text || '').join('\n').toLowerCase();

  const has = (re) => rels.some((r) => re.test(r));
  const hasLinter = has(/(?:^|\/)(?:\.eslintrc(?:\.\w+)?|eslint\.config\.[cm]?[jt]s|biome\.jsonc?|\.ruff\.toml|ruff\.toml|\.flake8|\.pylintrc)$/)
    || 'eslint' in allDeps || '@biomejs/biome' in allDeps || packageJsons.some(({ pkg }) => pkg.eslintConfig)
    || /\bruff\b|\bflake8\b|\bpylint\b/.test(pyText);
  const hasFormatter = has(/(?:^|\/)(?:\.prettierrc(?:\.\w+)?|prettier\.config\.[cm]?js|biome\.jsonc?)$/)
    || 'prettier' in allDeps || '@biomejs/biome' in allDeps || /\bblack\b|\bruff\b/.test(pyText);
  const hasCI = has(/^\.github\/workflows\/.+\.ya?ml$|^\.gitlab-ci\.yml$|^\.circleci\/|^azure-pipelines\.yml$|^bitbucket-pipelines\.yml$/);
  const readme = files.find((f) => /^readme(\.\w+)?$/i.test(f.rel));
  const readmeHasSetup = !!readme?.text && /npm (?:install|i|run|start)|yarn|pnpm|pip install|poetry install|uv (?:sync|run)|getting started|installation|setup|how to run|quick ?start/i.test(readme.text);

  const largeFiles = [];
  const longFunctions = [];
  let todoCount = 0;
  let consoleLogCount = 0;
  for (const f of files) {
    if (f.text === null || !SOURCE_EXT.has(f.ext)) continue;
    if (f.lines > 300 && largeFiles.length < MAX_LIST) largeFiles.push({ file: f.rel, lines: f.lines });
    if (CODE_EXT.has(f.ext) && !testRe.test(f.rel)) {
      for (const fn of findLongFunctions(f)) if (longFunctions.length < MAX_LIST) longFunctions.push(fn);
    }
    todoCount += (f.text.match(/\b(?:TODO|FIXME|HACK)\b/g) || []).length;
    if (JS_EXT.has(f.ext) || f.ext === '.html') consoleLogCount += (f.text.match(/console\.log\s*\(/g) || []).length;
  }
  const hasTestScript = packageJsons.some(({ pkg }) => {
    const t = pkg.scripts?.test;
    return typeof t === 'string' && !/no test specified/.test(t);
  }) || /\bpytest\b/.test(pyText);

  return {
    hasTests: testFiles.length > 0, testFiles: testFiles.slice(0, MAX_LIST), hasTestScript,
    hasLinter, hasFormatter, hasCI, hasReadme: !!readme, readmeHasSetup,
    largeFiles, longFunctions, todoCount, consoleLogCount,
  };
}

// ---------------------------------------------------------------- main API

export function scanProject(rootInput = '.', { maxFiles = 5000 } = {}) {
  const root = path.resolve(rootInput);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    throw new Error(`Folder not found: ${root}`);
  }
  const warnings = [];
  const { files, treeLines } = walk(root, maxFiles, warnings);

  const languages = {};
  let totalLines = 0;
  let sourceFiles = 0;
  for (const f of files) {
    if (f.text === null || !SOURCE_EXT.has(f.ext)) continue;
    sourceFiles++;
    totalLines += f.lines;
    languages[f.ext] = (languages[f.ext] || 0) + f.lines;
  }

  const { frameworks, packageJsons, packageManagers } = detectStack(files);
  const scripts = {};
  for (const { rel, pkg } of packageJsons) if (pkg.scripts) scripts[rel] = pkg.scripts;

  return {
    scanner: { name: 'vibe-teacher/scan-project', version: VERSION },
    root: toPosix(root),
    summary: {
      files: files.length,
      sourceFiles,
      totalLines,
      languages,
      teachInLessons: sourceFiles > 25 || totalLines > 3000,
    },
    tree: [path.basename(root) + '/', ...treeLines],
    packageManagers,
    frameworks,
    entryPoints: detectEntryPoints(files, packageJsons),
    scripts,
    routes: detectRoutes(files),
    env: detectEnv(root, files),
    secrets: detectSecrets(files),
    risks: detectRisks(files),
    quality: detectQuality(files, packageJsons),
    warnings,
  };
}

function printHelp() {
  console.log(`VIBE Teacher project scanner ${VERSION}

Usage: node scan-project.mjs [projectRoot] [--max-files 5000]

Prints JSON facts about a project (files, stack, routes, env setup,
masked secret warnings, quality signals). Read-only. No dependencies.`);
}

function main(argv) {
  let rootArg = '.';
  let maxFiles = 5000;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') { printHelp(); return 0; }
    if (a === '--max-files') {
      maxFiles = Number(argv[++i]);
      if (!Number.isInteger(maxFiles) || maxFiles < 1) {
        console.error('Oops: --max-files needs a positive whole number, for example --max-files 2000');
        return 1;
      }
    } else if (a.startsWith('--')) {
      console.error(`Oops: unknown option ${a}. Try --help.`);
      return 1;
    } else rootArg = a;
  }
  try {
    process.stdout.write(JSON.stringify(scanProject(rootArg, { maxFiles }), null, 2) + '\n');
    return 0;
  } catch (err) {
    console.error(`Oops: could not scan the project. ${err.message}`);
    return 1;
  }
}

const invokedDirectly = process.argv[1]
  && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (invokedDirectly) process.exitCode = main(process.argv.slice(2));

export const SKILL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
