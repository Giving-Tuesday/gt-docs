import { execFileSync } from 'node:child_process';
import { cpSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const EXTERNAL_DIR = 'src/content/external';
const sources = JSON.parse(readFileSync('external-sources.json', 'utf-8'));

for (const { name } of sources) {
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`Invalid source name "${name}". Use lowercase letters, digits, and hyphens.`);
}

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf-8' });
}

function isPublished(root, file) {
  return (
    file.endsWith('.md') &&
    !file.split('/').some((part) => part.startsWith('.')) &&
    lstatSync(join(root, file)).isFile()
  );
}

function fetchMarkdown({ repo, ref, path = '' }) {
  const checkout = mkdtempSync(join(tmpdir(), 'external-'));
  git(['clone', '--quiet', '--depth=1', '--filter=blob:none', '--sparse', ...(ref ? ['--branch', ref] : []), repo, checkout]);
  git(['sparse-checkout', 'set', '--no-cone', path ? `/${path}/**/*.md` : '*.md'], checkout);
  const root = join(checkout, path);
  const files = git(['ls-files', '--', path || '.'], checkout)
    .split('\n')
    .map((file) => file.slice(path ? path.length + 1 : 0))
    .filter((file) => isPublished(root, file));
  return { root, files, cleanup: () => rmSync(checkout, { recursive: true, force: true }) };
}

for (const entry of readdirSync(EXTERNAL_DIR)) {
  if (entry !== '.gitkeep') rmSync(join(EXTERNAL_DIR, entry), { recursive: true });
}

for (const source of sources) {
  const { root, files, cleanup } = fetchMarkdown(source);
  if (files.length === 0) throw new Error(`${source.name}: no .md files found in ${source.repo} at "${source.path ?? ''}"`);
  for (const file of files) {
    const target = join(EXTERNAL_DIR, source.name, file);
    mkdirSync(dirname(target), { recursive: true });
    cpSync(join(root, file), target);
  }
  cleanup();
  console.log(`${source.name}: ${files.length} files from ${source.repo}`);
}
