#!/usr/bin/env node
// Validates the VIBE Teacher skill against the Agent Skills spec and repo conventions.
// Zero dependencies. Run: node scripts-dev/check-skill.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillDir = path.join(repo, 'skills', 'vibe-teacher');
const errors = [];
const warnings = [];
const ok = (msg) => console.log(`  ✔ ${msg}`);
const fail = (msg) => errors.push(msg);

const ALLOWED_KEYS = new Set(['name', 'description', 'license', 'metadata', 'compatibility', 'allowed-tools']);
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SKIP_DIRS = new Set(['node_modules', '.git']);

// ---------------------------------------------------------------- frontmatter

function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n') && !raw.startsWith('---\r\n')) {
    fail('SKILL.md must start with "---" at byte 0 (no BOM, no blank line).');
    return null;
  }
  const lines = raw.split(/\r?\n/);
  const end = lines.indexOf('---', 1);
  if (end === -1) { fail('SKILL.md frontmatter has no closing "---".'); return null; }
  const fmLines = lines.slice(1, end);
  const data = {};
  let current = null;
  for (const line of fmLines) {
    if (!line.trim()) continue;
    const top = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    const nested = /^\s{2,}([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (top && !line.startsWith(' ')) {
      current = top[1];
      data[current] = top[2] === '' ? {} : unquote(top[2]);
    } else if (nested && current && typeof data[current] === 'object') {
      data[current][nested[1]] = unquote(nested[2]);
    } else {
      fail(`Unrecognised frontmatter line: "${line}"`);
    }
  }
  return { data, fmText: fmLines.join('\n'), body: lines.slice(end + 1) };
}

function unquote(v) {
  const t = v.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) return t.slice(1, -1);
  return t;
}

// ---------------------------------------------------------------- checks

function checkSkill() {
  console.log('SKILL.md');
  const file = path.join(skillDir, 'SKILL.md');
  if (!fs.existsSync(file)) { fail('skills/vibe-teacher/SKILL.md is missing.'); return null; }
  const raw = fs.readFileSync(file, 'utf8');
  if (raw.charCodeAt(0) === 0xfeff) fail('SKILL.md starts with a BOM; remove it.');
  const parsed = parseFrontmatter(raw);
  if (!parsed) return null;
  const { data, fmText, body } = parsed;

  for (const key of Object.keys(data)) if (!ALLOWED_KEYS.has(key)) fail(`Frontmatter key "${key}" is not allowed by the spec.`);
  ok(`frontmatter keys: ${Object.keys(data).join(', ')}`);

  const name = data.name;
  if (typeof name !== 'string' || !NAME_RE.test(name) || name.length > 64) fail(`Invalid name "${name}".`);
  if (name !== path.basename(skillDir)) fail(`name "${name}" must equal folder name "${path.basename(skillDir)}".`);
  if (/^(claude|anthropic)/.test(name || '')) fail('name must not start with "claude" or "anthropic".');
  ok(`name "${name}" matches folder`);

  const desc = data.description;
  if (typeof desc !== 'string' || desc.length < 1 || desc.length > 1024) fail(`description must be 1–1024 chars (got ${desc?.length}).`);
  else ok(`description length ${desc.length}/1024`);

  if (/[<>]/.test(fmText)) fail('Frontmatter must not contain < or >.');
  else ok('no angle brackets in frontmatter');

  if (data.metadata && typeof data.metadata !== 'object') fail('metadata must be a map.');
  if (data.metadata) for (const [k, v] of Object.entries(data.metadata)) if (typeof v !== 'string') fail(`metadata.${k} must be a string.`);

  if (body.length >= 500) fail(`SKILL.md body is ${body.length} lines; must be under 500.`);
  else ok(`body ${body.length} lines (< 500)`);
  if (body.length >= 400) warnings.push(`SKILL.md body is ${body.length} lines; target is under 400.`);

  // referenced paths exist
  const text = body.join('\n');
  const refs = new Set();
  for (const m of text.matchAll(/\]\(([^)\s#]+)\)/g)) if (!/^https?:/.test(m[1])) refs.add(m[1]);
  for (const m of text.matchAll(/\b((?:references|assets|scripts)\/[A-Za-z0-9_./-]+\.(?:md|mjs|json))/g)) refs.add(m[1]);
  let missing = 0;
  for (const ref of refs) {
    if (!fs.existsSync(path.join(skillDir, ref))) { fail(`SKILL.md references missing file: ${ref}`); missing++; }
  }
  if (!missing) ok(`${refs.size} referenced paths exist`);

  // every reference file is reachable from SKILL.md
  const refDir = path.join(skillDir, 'references');
  for (const f of fs.readdirSync(refDir)) {
    if (!text.includes(`references/${f}`)) warnings.push(`references/${f} is not linked from SKILL.md.`);
    const sub = path.join(refDir, f);
    if (fs.statSync(sub).isDirectory()) fail(`references/ must be one level deep (found folder ${f}).`);
  }
  return data;
}

function walkJson(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkJson(full, out);
    else if (e.name.endsWith('.json')) out.push(full);
  }
  return out;
}

function checkJson(skill) {
  console.log('JSON files');
  const parsed = {};
  for (const file of walkJson(repo)) {
    const rel = path.relative(repo, file).split(path.sep).join('/');
    try { parsed[rel] = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { fail(`${rel} is not valid JSON: ${e.message}`); }
  }
  ok(`${Object.keys(parsed).length} JSON files parse`);

  const plugin = parsed['.claude-plugin/plugin.json'];
  const market = parsed['.claude-plugin/marketplace.json'];
  if (!plugin) return fail('.claude-plugin/plugin.json missing or invalid.');
  if (!market) return fail('.claude-plugin/marketplace.json missing or invalid.');
  if (plugin.name !== 'vibe-teacher') fail('plugin.json name must be "vibe-teacher".');
  if (!market.name || !market.owner?.name || !Array.isArray(market.plugins)) fail('marketplace.json needs name, owner.name and plugins[].');
  const entry = market.plugins?.find((p) => p.name === plugin.name);
  if (!entry) fail('marketplace.json has no entry matching plugin.json name.');
  else {
    if (!entry.source) fail('marketplace plugin entry needs "source".');
    if ('version' in entry) fail('Do not set "version" in the marketplace entry (only in plugin.json).');
    const src = path.join(repo, entry.source);
    if (!fs.existsSync(path.join(src, 'skills', 'vibe-teacher', 'SKILL.md'))) fail(`marketplace source "${entry.source}" does not contain skills/vibe-teacher/SKILL.md.`);
  }
  if (skill?.metadata?.version && plugin.version !== skill.metadata.version) {
    fail(`Version mismatch: plugin.json ${plugin.version} vs SKILL.md metadata ${skill.metadata.version}.`);
  } else ok(`versions agree (${plugin.version})`);

  const triggers = parsed['evals/trigger-queries.json'];
  if (triggers) {
    const pos = triggers.filter((t) => t.should_trigger === true).length;
    const neg = triggers.filter((t) => t.should_trigger === false).length;
    if (pos < 10 || neg < 10) fail(`evals/trigger-queries.json needs 10+ positive and 10+ negative (got ${pos}/${neg}).`);
    else ok(`trigger evals: ${pos} positive, ${neg} negative`);
  }
}

function checkTemplates() {
  console.log('Templates & scripts');
  const need = ['welcome', 'lesson', 'file-table', 'file-card', 'flow', 'stack-card', 'score-card', 'fix-plan',
    'security-report', 'features', 'quiz', 'glossary-card', 'notes-journal', 'readme-badge'];
  for (const t of need) if (!fs.existsSync(path.join(skillDir, 'assets', 'templates', `${t}.md`))) fail(`Missing template ${t}.md`);
  ok(`${need.length} templates present`);
  const scanner = path.join(skillDir, 'scripts', 'scan-project.mjs');
  if (!fs.existsSync(scanner)) fail('scripts/scan-project.mjs missing.');
  const src = fs.readFileSync(scanner, 'utf8');
  const imports = [...src.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);
  const external = imports.filter((i) => !i.startsWith('node:') && !i.startsWith('.'));
  if (external.length) fail(`Scanner must have zero dependencies; found imports: ${external.join(', ')}`);
  else ok('scanner has zero dependencies');
}

function checkSecretsInFixtures() {
  console.log('Fixture safety');
  const realKey = /\bsk-(?!FAKE)[A-Za-z0-9_-]{20,}|\bAKIA(?!FAKE)[0-9A-Z]{16}\b|\bghp_[A-Za-z0-9]{36}\b/;
  const scan = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (SKIP_DIRS.has(e.name)) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) scan(full);
      else if (fs.statSync(full).size < 1024 * 1024) {
        const text = fs.readFileSync(full, 'utf8');
        if (realKey.test(text)) fail(`Possible real-looking secret in ${path.relative(repo, full)}; use an obviously FAKE value.`);
      }
    }
  };
  scan(path.join(repo, 'examples'));
  ok('example secrets are clearly fake');
}

const skill = checkSkill();
checkJson(skill);
checkTemplates();
checkSecretsInFixtures();

for (const w of warnings) console.log(`  ⚠ ${w}`);
if (errors.length) {
  console.error(`\n✖ ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('\n✅ All skill checks passed.');
