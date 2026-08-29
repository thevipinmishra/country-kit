#!/usr/bin/env node
/**
 * Rebuilds src/data/flag-svgs.json from lipis/flag-icons (MIT).
 * Those SVGs are the Wikipedia / Wikimedia country flags, the usual
 * public-source set for ISO 3166-1 alpha-2 codes.
 *
 * Usage: node scripts/generate-flags.mjs
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FLAG_ICONS_VERSION = '7.5.0';
const pkgRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const iso = JSON.parse(
  fs.readFileSync(
    path.join(pkgRoot, 'scripts/sources/iso-3166-1.json'),
    'utf8',
  ),
);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'flag-icons-'));
const tarball = path.join(tmp, 'flag-icons.tgz');
execFileSync('curl', [
  '-fsSL',
  '-o',
  tarball,
  `https://registry.npmjs.org/flag-icons/-/flag-icons-${FLAG_ICONS_VERSION}.tgz`,
]);
execFileSync('tar', ['-xzf', tarball, '-C', tmp]);

function minify(svg) {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/> </g, '><')
    .trim();
}

const flagsDir = path.join(tmp, 'package/flags/4x3');
const flags = {};
for (const row of iso) {
  const code = row['alpha-2'];
  const file = path.join(flagsDir, `${code.toLowerCase()}.svg`);
  if (!fs.existsSync(file)) {
    throw new Error(`flag-icons is missing ${code}.svg`);
  }
  flags[code] = minify(fs.readFileSync(file, 'utf8'));
}

fs.writeFileSync(
  path.join(pkgRoot, 'src/data/flag-svgs.json'),
  `${JSON.stringify(flags)}\n`,
);
fs.copyFileSync(
  path.join(tmp, 'package/LICENSE'),
  path.join(pkgRoot, 'scripts/sources/flag-icons.LICENSE'),
);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(
  `Wrote ${Object.keys(flags).length} SVG flags (flag-icons@${FLAG_ICONS_VERSION})`,
);
