# country-kit

ISO 3166-1 country data for TypeScript: alpha-2/3 codes, names, ITU-T E.164 calling codes, UN M49 regions, IANA ccTLDs, ISO 4217 currencies, Unicode flag emoji, and Wikipedia SVG flags.

[![npm version](https://img.shields.io/npm/v/country-kit.svg)](https://www.npmjs.com/package/country-kit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/country-kit)](https://bundlephobia.com/package/country-kit)
[![license](https://img.shields.io/npm/l/country-kit.svg)](https://github.com/thevipinmishra/country-kit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

Use it for a country select, phone prefix, flag, TLD, or currency lookup. `CountryCode` is a union of all 249 assigned alpha-2 codes. The published package has no runtime dependencies.

Docs: [playground](https://country-kit.vercel.app/), [examples](https://country-kit.vercel.app/examples/), [API](https://country-kit.vercel.app/api/), [changelog](https://country-kit.vercel.app/changelog/).

## Upgrading from 1.x

npm still publishes 1.1.0. This repo is 2.0.0.

**Who this hits.** Anyone using `getCallingCode` for NANP territories (Anguilla, Puerto Rico, and others that used to return country code plus area code) or `isValidCallingCode` with those concatenated values.

**What broke.** `getCallingCode('AI')` is `+1` (1.x returned `+1264`). `isValidCallingCode('+1264')` is false. Invalid lookups return `undefined` and do not call `console.error`.

**Migrate.** Use `getDialCode` or `nanpAreaCodes` in a phone picker. Keep `callingCode` when you want the ITU-T E.164 country code. Full notes: [changelog](https://country-kit.vercel.app/changelog/), [`packages/country-kit/README.md`](./packages/country-kit/README.md).

## Data sources

| Field | Standard | Notes |
| --- | --- | --- |
| `code`, `alpha3`, `name` | ISO 3166-1 | All **249** officially assigned codes. `name` is the ISO English short name. |
| `numeric`, `region`, `subregion` | UN M49 | Numeric codes are identical to ISO 3166-1 numeric. Antarctica and Taiwan have no UN region. |
| `callingCode` | ITU-T E.164 | Country calling codes only (1-3 digits). NANP members are `+1`. Area codes live on `nanpAreaCodes`. |
| `nanpAreaCodes` | NANP | Area codes for territories that share `+1`. |
| `tld` | IANA | Country-code TLD (`GB` is `.uk`). |
| `currencies` | ISO 4217 | Alphabetic currency codes. |
| `flag` | Unicode UTS #51 | Derived from the alpha-2 code via regional indicator symbols. |
| SVG flags | flag-icons / Wikimedia | Wikipedia SVG drawings, MIT, optional `country-kit/flags` entry. |

Kosovo (`XK`) is omitted. It is a user-assigned code, not an ISO 3166-1 assigned code.

The published package lives in [`packages/country-kit`](./packages/country-kit).

## Installation

```bash
npm install country-kit
# pnpm add country-kit
# yarn add country-kit
```

## Quick start

```typescript
import { getCountry, getFlagSvgUrl, searchCountries } from 'country-kit';
import { getFlagSvg } from 'country-kit/flags';

const us = getCountry('US');
// name: 'United States of America' (ISO)
// commonName: 'United States'
// callingCode: '+1' (ITU-T E.164)

searchCountries('uk');      // United Kingdom
searchCountries('Vietnam'); // Viet Nam
getFlagSvgUrl('JP');        // version-pinned Wikipedia SVG
getFlagSvg('JP');           // inline <svg> markup
```

See [`packages/country-kit/README.md`](./packages/country-kit/README.md) for the full API and copy-paste examples (signup select, phone prefix, TLD lookup, shipping zones, validation). Live widgets: [country-kit.vercel.app/examples](https://country-kit.vercel.app/examples/).

## License

ISC. See [LICENSE](./LICENSE).
