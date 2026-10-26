#!/usr/bin/env node
// Checks every plugin in this repository the way CoderHelm reads it.
//
//   node scripts/check.mjs            check every plugins/<name>/
//   node scripts/check.mjs <dir>...   check only these plugin folders
//   node scripts/check.mjs --drift    compare tools/ with the published copies
//
// For each plugin folder:
//
// 1. plugin.yaml against the manifest's JSON Schema, vendored at
//    tools/plugin-manifest.v1.json (the copy docs.coderhelm.com publishes;
//    --drift proves it still matches).
// 2. The CoderHelm validator, vendored at tools/validate-plugin.mjs: the
//    checks the platform makes when it reads a plugin.
// 3. A few checks the platform makes that the validator does not: no
//    `$schema` key (the platform refuses unknown fields), each trigger's
//    `agent` names an agent file, and built-in tools are ones plugin runs
//    offer.
// 4. Repository rules: the plugin has a README.md, and nothing uses arrow
//    glyphs.
// 5. For a manifest with optional lines ("#| field: value"), the same checks
//    again with every optional line turned on.
//
// It also checks the layout: no plugin.yaml at the top (CoderHelm would read
// the top as one more plugin), and every folder under plugins/ is a plugin
// with a unique id.

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import YAML from 'yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCHEMA_FILE = path.join(ROOT, 'tools/plugin-manifest.v1.json');
const VALIDATOR_FILE = path.join(ROOT, 'tools/validate-plugin.mjs');
const MANIFEST_FILES = ['plugin.yaml', 'plugin.yml', '.coderhelm/plugin.yaml'];

export const PUBLISHED = {
  schema: 'https://docs.coderhelm.com/schema/plugin-manifest.v1.json',
  validator: 'https://docs.coderhelm.com/tools/validate-plugin.mjs',
  docsSchema: 'https://raw.githubusercontent.com/CoderHelm/coderhelm/main/docs/schemas/plugin-manifest.schema.json',
};

// Built-in tools a plugin run offers (services/common/src/plugins/run.rs).
const RUN_BUILTINS = ['search_knowledge'];
const ARROWS = /[\u2190-\u21FF\u27F0-\u27FF\u2900-\u297F\u2B00-\u2B2F]/;
const OPTIONAL = /^#\| ?/;

const schema = JSON.parse(fs.readFileSync(SCHEMA_FILE, 'utf8'));
const validateSchema = new Ajv2020({ allErrors: true, strict: false }).compile(schema);

function manifestFile(dir) {
  return MANIFEST_FILES.map((f) => path.join(dir, f)).find((f) => fs.existsSync(f));
}

function textFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...textFiles(p));
    else if (/\.(md|ya?ml|txt|json)$/.test(e.name)) out.push(p);
  }
  return out;
}

function agentNames(dir, manifest) {
  const names = new Set();
  for (const pattern of manifest.agents ?? ['agents/*.md']) {
    const re = new RegExp(`^${pattern.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*')}$`);
    for (const f of textFiles(dir)) {
      const rel = path.relative(dir, f).split(path.sep).join('/');
      if (!re.test(rel)) continue;
      names.add(path.basename(f, '.md'));
      const m = fs.readFileSync(f, 'utf8').match(/^---\n[\s\S]*?^name:\s*(\S+)/m);
      if (m) names.add(m[1]);
    }
  }
  return names;
}

/** Every problem with one plugin folder; `label` names it in messages. */
function checkFolder(dir, label) {
  const errors = [];
  const file = manifestFile(dir);
  if (!file) return { errors: [`${label}: no plugin.yaml`], manifest: null };
  let manifest;
  try {
    manifest = YAML.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return { errors: [`${label}: plugin.yaml is not valid YAML: ${e.message}`], manifest: null };
  }

  // 1. The schema.
  if (!validateSchema(manifest)) {
    for (const e of validateSchema.errors) {
      if (e.keyword === 'oneOf' || e.keyword === 'if') continue;
      const extra = e.keyword === 'additionalProperties' ? ` (${e.params.additionalProperty})` : '';
      errors.push(`${label}: schema: ${e.instancePath || '(top level)'} ${e.message}${extra}`);
    }
  }

  // 2. The CoderHelm validator.
  const run = spawnSync(process.execPath, [VALIDATOR_FILE, dir], { encoding: 'utf8' });
  if (run.status !== 0) {
    const lines = (run.stdout + run.stderr).split('\n').filter((l) => l.startsWith('error'));
    errors.push(...(lines.length ? lines : [run.stdout + run.stderr]).map((l) => `${label}: validator: ${l.replace(/^error\s+/, '')}`));
  }

  // 3. Platform checks the validator doesn't make.
  if (manifest && typeof manifest === 'object') {
    if ('$schema' in manifest) errors.push(`${label}: \`$schema\` is refused by CoderHelm (unknown field); use a "# yaml-language-server: $schema=..." comment instead`);
    const agents = agentNames(dir, manifest);
    for (const t of manifest.triggers ?? []) {
      if (t.agent && !agents.has(t.agent)) errors.push(`${label}: trigger ${t.on} names agent \`${t.agent}\`, but no agent file has that name`);
    }
    for (const t of manifest.tools ?? []) {
      if (t.kind === 'builtin' && !RUN_BUILTINS.includes(t.name)) errors.push(`${label}: built-in tool \`${t.name}\` isn't offered in plugin runs (only ${RUN_BUILTINS.join(', ')})`);
    }
  }
  return { errors: [...new Set(errors)], manifest };
}

/** A plugin folder: itself, and its fully optional variant when it has one. */
function checkPlugin(dir) {
  const label = path.relative(ROOT, dir) || '.';
  const { errors, manifest } = checkFolder(dir, label);

  // 4. Repository rules.
  if (!fs.existsSync(path.join(dir, 'README.md'))) errors.push(`${label}: no README.md`);
  for (const f of textFiles(dir)) {
    fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      if (ARROWS.test(line)) errors.push(`${path.relative(ROOT, f)}:${i + 1}: arrow glyph; use plain words`);
    });
  }

  // 5. Optional lines turned on.
  const file = manifestFile(dir);
  const text = file ? fs.readFileSync(file, 'utf8') : '';
  if (text.split('\n').some((l) => OPTIONAL.test(l))) {
    const copy = fs.mkdtempSync(path.join(os.tmpdir(), 'plugin-full-'));
    fs.cpSync(dir, copy, { recursive: true });
    fs.writeFileSync(path.join(copy, path.relative(dir, file)), text.split('\n').map((l) => l.replace(OPTIONAL, '')).join('\n'));
    errors.push(...checkFolder(copy, `${label} (optional lines on)`).errors);
    fs.rmSync(copy, { recursive: true, force: true });
  }
  return { label, errors, manifest };
}

function layout() {
  const errors = [];
  for (const f of MANIFEST_FILES) {
    if (fs.existsSync(path.join(ROOT, f))) errors.push(`${f} at the top: CoderHelm would read the whole repository as one more plugin`);
  }
  const base = path.join(ROOT, 'plugins');
  const dirs = fs.readdirSync(base, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => path.join(base, e.name));
  for (const e of fs.readdirSync(base, { withFileTypes: true })) {
    if (!e.isDirectory() && e.name !== 'README.md') errors.push(`plugins/${e.name}: only plugin folders belong in plugins/`);
  }
  return { errors, dirs };
}

async function fetchText(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} answered ${r.status}`);
  return r.text();
}

const sha = (t) => createHash('sha256').update(t).digest('hex');

async function drift() {
  const problems = [];
  const vendoredSchema = JSON.parse(fs.readFileSync(SCHEMA_FILE, 'utf8'));
  for (const [name, url] of [['published schema', PUBLISHED.schema], ['docs repository schema', PUBLISHED.docsSchema]]) {
    const live = JSON.parse(await fetchText(url));
    if (JSON.stringify(live) !== JSON.stringify(vendoredSchema)) problems.push(`tools/plugin-manifest.v1.json differs from the ${name} (${url})`);
    else console.log(`ok       tools/plugin-manifest.v1.json matches the ${name}`);
  }
  const live = await fetchText(PUBLISHED.validator);
  const mine = fs.readFileSync(VALIDATOR_FILE, 'utf8');
  if (sha(live) !== sha(mine)) problems.push(`tools/validate-plugin.mjs differs from ${PUBLISHED.validator} (published ${sha(live).slice(0, 12)}, vendored ${sha(mine).slice(0, 12)})`);
  else console.log(`ok       tools/validate-plugin.mjs matches the published validator (${sha(mine).slice(0, 12)})`);
  for (const p of problems) console.log(`error    ${p}`);
  if (problems.length) {
    console.log('\nRefresh them with: npm run refresh-tools, then run npm run check and commit tools/.');
    process.exit(1);
  }
}

async function refresh() {
  fs.writeFileSync(SCHEMA_FILE, await fetchText(PUBLISHED.schema));
  fs.writeFileSync(VALIDATOR_FILE, await fetchText(PUBLISHED.validator));
  console.log('tools/ refreshed from docs.coderhelm.com');
}

const args = process.argv.slice(2);
if (args[0] === '--drift') await drift();
else if (args[0] === '--refresh') await refresh();
else {
  const { errors: layoutErrors, dirs } = layout();
  const targets = args.length ? args.map((a) => path.resolve(a)) : dirs;
  let failed = layoutErrors.length;
  layoutErrors.forEach((e) => console.log(`error    ${e}`));
  const ids = new Map();
  for (const dir of targets) {
    const { label, errors, manifest } = checkPlugin(dir);
    const id = manifest?.namespace ? `${manifest.namespace}-${manifest.name}` : manifest?.name;
    if (id && ids.has(id)) errors.push(`${label}: id \`${id}\` is also used by ${ids.get(id)}`);
    if (id) ids.set(id, label);
    if (errors.length) {
      failed += errors.length;
      errors.forEach((e) => console.log(`error    ${e}`));
    } else {
      console.log(`ok       ${label} (${manifest.name} ${manifest.version})`);
    }
  }
  if (failed) {
    console.log(`\n${failed} error${failed === 1 ? '' : 's'}.`);
    process.exit(1);
  }
}
