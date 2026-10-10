#!/usr/bin/env node
// Runs the scanner CLI on the example apps and checks the JSON shape.
// Run: node scripts-dev/smoke-scan.mjs

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scanner = path.join(repo, 'skills', 'vibe-teacher', 'scripts', 'scan-project.mjs');
const KEYS = ['root', 'summary', 'tree', 'packageManagers', 'frameworks', 'entryPoints', 'scripts',
  'routes', 'env', 'secrets', 'risks', 'quality', 'warnings'];

let failed = false;
for (const app of ['sample-express-app', 'sample-next-app']) {
  const out = execFileSync(process.execPath, [scanner, path.join(repo, 'examples', app)], { encoding: 'utf8' });
  const facts = JSON.parse(out);
  const missing = KEYS.filter((k) => !(k in facts));
  if (missing.length) { failed = true; console.error(`✖ ${app}: missing keys ${missing.join(', ')}`); continue; }
  console.log(`✔ ${app}: ${facts.summary.sourceFiles} source files, ${facts.summary.totalLines} lines, ` +
    `frameworks [${facts.frameworks.map((f) => f.name).join(', ')}], ${facts.routes.length} routes, ` +
    `${facts.secrets.length} secret warning(s), .env ignored: ${facts.env.envInGitignore}`);
}
if (failed) process.exit(1);
