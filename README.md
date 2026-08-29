# country-kit

Official ISO 3166-1 country data for TypeScript — codes, names, ITU-T E.164 calling codes, UN M49 regions, and Unicode flag emojis.

[![npm version](https://img.shields.io/npm/v/country-kit.svg)](https://www.npmjs.com/package/country-kit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/country-kit)](https://bundlephobia.com/package/country-kit)
[![license](https://img.shields.io/npm/l/country-kit.svg)](https://github.com/thevipinmishra/country-kit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## Why country-kit?

- **Official data**: ISO 3166-1 assigned codes and English short names, UN M49 numeric/region codes, ITU-T E.164 country calling codes
- **Type-safe**: `CountryCode` is a union of all 249 assigned alpha-2 codes
- **Zero dependencies**: static dataset, works in the browser and Node.js
- **Practical extras**: common names, search aliases, NANP area codes, Unicode flags

## Data sources

| Field | Standard | Notes |
| --- | --- | --- |
| `code`, `alpha3`, `name` | ISO 3166-1 | All **249** officially assigned codes. `name` is the ISO English short name. |
| `numeric`, `region`, `subregion` | UN M49 | Numeric codes are identical to ISO 3166-1 numeric. Antarctica and Taiwan have no UN region. |
| `callingCode` | ITU-T E.164 | Country calling codes only (1–3 digits). NANP members are `+1`, not `+1` plus an area code. |
| `nanpAreaCodes` | NANP | Area codes for territories that share `+1`. |
| `flag` | Unicode UTS #51 | Derived from the alpha-2 code via regional indicator symbols. |

Kosovo (`XK`) is **not** included: it is a user-assigned code, not an ISO 3166-1 assigned code.

The published package lives in [`packages/country-kit`](./packages/country-kit).

## Installation

```bash
npm install country-kit
```

## Quick start

```typescript
import { getCountry, searchCountries } from 'country-kit';

const us = getCountry('US');
// name: 'United States of America' (ISO)
// commonName: 'United States'
// callingCode: '+1' (ITU-T E.164)

searchCountries('uk');      // United Kingdom
searchCountries('Vietnam'); // Viet Nam
```

See [`packages/country-kit/README.md`](./packages/country-kit/README.md) for the full API.

## License

ISC — see [LICENSE](./LICENSE).
