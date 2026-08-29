#!/usr/bin/env node
/**
 * Generates src/data/countries.json from official ISO 3166-1 / UN M49 data
 * plus ITU-T E.164 country calling codes.
 *
 * ISO names, alpha-2, alpha-3, numeric, and regions come from the UN M49 /
 * ISO 3166 dataset. Calling codes are E.164 country codes (1–3 digits).
 * NANP area codes are not country calling codes and are stored separately.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(root, '..');
const sources = path.join(root, 'sources');

/** @type {Record<string, string[]>} ITU-T E.164 is +1; values are NANP NPAs */
const NANP_AREA_CODES = {
  AG: ['268'],
  AI: ['264'],
  AS: ['684'],
  BB: ['246'],
  BM: ['441'],
  BS: ['242'],
  CA: [],
  DM: ['767'],
  DO: ['809', '829', '849'],
  GD: ['473'],
  GU: ['671'],
  JM: ['876', '658'],
  KN: ['869'],
  KY: ['345'],
  LC: ['758'],
  MP: ['670'],
  MS: ['664'],
  PR: ['787', '939'],
  SX: ['721'],
  TC: ['649'],
  TT: ['868'],
  UM: [],
  US: [],
  VC: ['784'],
  VG: ['284'],
  VI: ['340'],
};

/**
 * Additional E.164 country codes that apply to the same ISO 3166-1 entry.
 * Saint Helena, Ascension and Tristan da Cunha (SH) covers both +290 and +247.
 */
const EXTRA_CALLING_CODES = {
  SH: ['+247'],
};

/** Everyday English names when they differ from the ISO 3166-1 short name. */
const COMMON_NAMES = {
  BO: 'Bolivia',
  BQ: 'Caribbean Netherlands',
  BN: 'Brunei',
  CD: 'DR Congo',
  CG: 'Republic of the Congo',
  CI: 'Ivory Coast',
  CV: 'Cape Verde',
  CZ: 'Czechia',
  FK: 'Falkland Islands',
  FM: 'Micronesia',
  GB: 'United Kingdom',
  IR: 'Iran',
  KP: 'North Korea',
  KR: 'South Korea',
  LA: 'Laos',
  MD: 'Moldova',
  NL: 'Netherlands',
  PS: 'Palestine',
  RU: 'Russia',
  SH: 'Saint Helena',
  SY: 'Syria',
  TW: 'Taiwan',
  TZ: 'Tanzania',
  US: 'United States',
  VA: 'Vatican City',
  VE: 'Venezuela',
  VG: 'British Virgin Islands',
  VI: 'U.S. Virgin Islands',
  VN: 'Vietnam',
  TR: 'Turkey',
};

/** Extra search terms (lowercase). Official and common names are indexed separately. */
const ALIASES = {
  AE: ['uae', 'emirates'],
  BO: ['bolivia'],
  BN: ['brunei'],
  CD: ['drc', 'congo-kinshasa', 'democratic republic of congo'],
  CG: ['congo-brazzaville'],
  CI: ["cote d'ivoire", 'ivory coast'],
  CV: ['cape verde'],
  CZ: ['czech republic'],
  FK: ['malvinas'],
  FM: ['micronesia'],
  GB: ['uk', 'great britain', 'britain', 'england', 'scotland', 'wales'],
  IR: ['iran', 'persia'],
  KP: ['north korea', 'dprk'],
  KR: ['south korea', 'korea'],
  LA: ['laos'],
  MD: ['moldova'],
  MM: ['burma'],
  NL: ['holland'],
  PS: ['palestine'],
  RU: ['russia'],
  ST: ['sao tome'],
  SY: ['syria'],
  SZ: ['swaziland'],
  TL: ['east timor'],
  TR: ['turkey'],
  TW: ['taiwan', 'roc'],
  TZ: ['tanzania'],
  US: ['usa', 'america', 'united states'],
  VA: ['vatican', 'holy see'],
  VE: ['venezuela'],
  VG: ['bvi', 'british virgin islands'],
  VI: ['usvi', 'us virgin islands'],
  VN: ['vietnam'],
};

const iso = JSON.parse(
  fs.readFileSync(path.join(sources, 'iso-3166-1.json'), 'utf8'),
);
const seedCalling = JSON.parse(
  fs.readFileSync(path.join(sources, 'legacy-calling-codes.json'), 'utf8'),
);

if (iso.length !== 249) {
  throw new Error(`Expected 249 ISO 3166-1 assigned codes, got ${iso.length}`);
}

function toE164(code, raw) {
  if (NANP_AREA_CODES[code]) return '+1';
  if (!raw) {
    throw new Error(`Missing calling code seed for ${code}`);
  }
  // Collapse accidental NANP concatenations like +1264
  if (raw.startsWith('+1') && raw.length > 2 && NANP_AREA_CODES[code]) {
    return '+1';
  }
  return raw;
}

const countries = iso
  .slice()
  .sort((a, b) => a['alpha-2'].localeCompare(b['alpha-2']))
  .map((row) => {
    const code = row['alpha-2'];
    const name = row.name;
    const callingCode = toE164(code, seedCalling[code]);
    const extra = EXTRA_CALLING_CODES[code] ?? [];
    const callingCodes = [
      callingCode,
      ...extra.filter((c) => c !== callingCode),
    ];
    const nanpAreaCodes = NANP_AREA_CODES[code];
    const region = row.region || null;
    const subregion = row['sub-region'] || null;

    const record = {
      code,
      name,
      commonName: COMMON_NAMES[code] ?? name,
      alpha3: row['alpha-3'],
      numeric: String(row['country-code']).padStart(3, '0'),
      callingCode,
      callingCodes,
      region,
      subregion,
      aliases: ALIASES[code] ?? [],
    };

    if (nanpAreaCodes && nanpAreaCodes.length > 0) {
      record.nanpAreaCodes = nanpAreaCodes;
    }

    return record;
  });

const codes = countries.map((c) => c.code);
const missingSeed = codes.filter((c) => !seedCalling[c] && !NANP_AREA_CODES[c]);
if (missingSeed.length) {
  throw new Error(`Missing calling-code seed for: ${missingSeed.join(', ')}`);
}

const extraSeed = Object.keys(seedCalling).filter((c) => !codes.includes(c));
if (extraSeed.length) {
  throw new Error(
    `Calling-code seed has unknown ISO codes: ${extraSeed.join(', ')}`,
  );
}

const outDir = path.join(pkgRoot, 'src/data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'countries.json'),
  `${JSON.stringify(countries, null, 2)}\n`,
);

const union = codes.map((c) => `'${c}'`).join('\n  | ');
fs.writeFileSync(
  path.join(pkgRoot, 'src/country-code.ts'),
  `/** ISO 3166-1 alpha-2 codes assigned by the ISO 3166 Maintenance Agency. */\nexport type CountryCode =\n  | ${union};\n\nexport const COUNTRY_CODES = ${JSON.stringify(codes)} as const satisfies readonly CountryCode[];\n`,
);

console.log(`Wrote ${countries.length} countries to src/data/countries.json`);
