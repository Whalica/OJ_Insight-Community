import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const contentRoot = path.join(root, 'content');
const allowedTypes = new Map([['problem-set', 'problem-sets']]);
const supportedPlatforms = new Set(['codeforces', 'atcoder', 'luogu', 'nowcoder', 'qoj', 'leetcode', 'other']);
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function entriesIn(dir, prefix = '') {
  let items;
  try { items = await readdir(dir, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const files = [];
  for (const item of items.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
    if (item.isDirectory()) {
      if (!validFolder(item.name)) throw Error(`${prefix}${item.name}: invalid folder name`);
      files.push(...await entriesIn(path.join(dir, item.name), `${prefix}${item.name}/`));
    } else if (item.isFile() && item.name.endsWith('.json')) {
      files.push(`${prefix}${item.name}`);
    }
  }
  return files;
}

function validFolder(name) {
  return name.length > 0 && name.length <= 80 && name.trim() === name && name !== '.' && name !== '..' && [...name].every((char) => /[\p{L}\p{N} _.-]/u.test(char));
}

function validate(entry, relativePath, knownIds) {
  if (entry.schema !== 'com.ojinsight.community-entry' || entry.schemaVersion !== 1) throw Error(`${relativePath}: unsupported community schema`);
  if (!idPattern.test(entry.id) || knownIds.has(entry.id)) throw Error(`${relativePath}: invalid or duplicate id`);
  knownIds.add(entry.id);
  if (!allowedTypes.has(entry.type) || !relativePath.startsWith(`content/${allowedTypes.get(entry.type)}/`)) throw Error(`${relativePath}: type and directory differ`);
  for (const key of ['title', 'summary', 'license']) if (typeof entry[key] !== 'string' || !entry[key].trim()) throw Error(`${relativePath}: missing ${key}`);
  if (typeof entry.author?.name !== 'string' || !entry.author.name.trim()) throw Error(`${relativePath}: missing author name`);
  if (!Array.isArray(entry.categories) || entry.categories.some((value) => typeof value !== 'string' || !value.trim())) throw Error(`${relativePath}: invalid categories`);
  if (entry.content?.schema !== 'com.ojinsight.problem-set' || entry.content.schemaVersion !== 1 || entry.content.title !== entry.title) throw Error(`${relativePath}: invalid problem-set content`);
  if (!Array.isArray(entry.content.problems) || entry.content.problems.length === 0) throw Error(`${relativePath}: empty problem set`);
  const problems = new Set();
  entry.content.problems.forEach((row, index) => {
    const problem = row?.problem;
    const key = `${problem?.platform}:${problem?.problemKey}`;
    if (row.position !== index || !supportedPlatforms.has(problem?.platform) || typeof problem?.problemKey !== 'string' || !problem.problemKey.trim() || problems.has(key)) throw Error(`${relativePath}: invalid or repeated problem ${index + 1}`);
    problems.add(key);
    if (typeof problem.url !== 'string' || !/^https:\/\//.test(problem.url)) throw Error(`${relativePath}: invalid problem URL ${index + 1}`);
  });
  return { id: entry.id, type: entry.type, title: entry.title, summary: entry.summary, author: entry.author, categories: entry.categories, license: entry.license, path: relativePath, problemCount: entry.content.problems.length };
}

const catalog = { schema: 'com.ojinsight.community-catalog', schemaVersion: 1, entries: [] };
const knownIds = new Set();
for (const directory of allowedTypes.values()) {
  for (const file of await entriesIn(path.join(contentRoot, directory))) {
    const relativePath = `content/${directory}/${file}`;
    if (relativePath.length > 512 || path.posix.basename(file).length > 120) throw Error(`${relativePath}: path too long`);
    const raw = await readFile(path.join(root, relativePath), 'utf8');
    if (Buffer.byteLength(raw) > 512_000) throw Error(`${relativePath}: file too large`);
    const entry = JSON.parse(raw);
    if (`${entry.id}.json` !== path.posix.basename(file)) throw Error(`${relativePath}: filename must match id`);
    catalog.entries.push(validate(entry, relativePath, knownIds));
  }
}
const output = `${JSON.stringify(catalog, null, 2)}\n`;
const catalogPath = path.join(root, 'catalog.json');
if (process.argv.includes('--write')) await writeFile(catalogPath, output);
else if (process.argv.includes('--check')) {
  if ((await readFile(catalogPath, 'utf8')).replace(/\r\n/g, '\n') !== output) throw Error('catalog.json is stale; run node tools/catalog.mjs --write');
} else process.stdout.write(output);
