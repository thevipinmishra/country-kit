# country-kit

ISO 3166-1 country data for TypeScript: alpha-2/3 codes, names, ITU-T E.164 calling codes, UN M49 regions, IANA ccTLDs, ISO 4217 currencies, Unicode flag emoji, and Wikipedia SVG flags.

[![npm version](https://img.shields.io/npm/v/country-kit.svg)](https://www.npmjs.com/package/country-kit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/country-kit)](https://bundlephobia.com/package/country-kit)
[![license](https://img.shields.io/npm/l/country-kit.svg)](https://github.com/thevipinmishra/country-kit/blob/main/LICENSE)

249 assigned ISO 3166-1 codes. `CountryCode` is a union of those alpha-2 values. No runtime dependencies.

Docs: [getting started](https://country-kit.vercel.app/getting-started/), [playground](https://country-kit.vercel.app/), [examples](https://country-kit.vercel.app/examples/), [API](https://country-kit.vercel.app/api/), [changelog](https://country-kit.vercel.app/changelog/).

## Install

```bash
npm install country-kit
```

```bash
pnpm add country-kit
```

```bash
bun add country-kit
```

Requires Node 18 or newer. ESM and CommonJS both work.

## Quick start

```typescript
import { getCountry, getFlagSvgUrl, searchCountries } from 'country-kit';
import { getFlagSvg } from 'country-kit/flags';

const us = getCountry('US');
// name: 'United States of America' (ISO English short name)
// commonName: 'United States'
// callingCode: '+1'  (ITU-T E.164)
// dialCode: '+1'

searchCountries('uk');      // United Kingdom
searchCountries('Vietnam'); // Viet Nam
getFlagSvgUrl('JP');        // version-pinned Wikipedia SVG
getFlagSvg('JP');           // inline <svg> markup
```

Full API and copy-paste examples (select, phone prefix, TLD, currency, validation) live in [`packages/country-kit/README.md`](./packages/country-kit/README.md) and on [the examples page](https://country-kit.vercel.app/examples/).

## What you get

- ISO 3166-1 assigned codes and English short names, UN M49, ITU-T E.164, IANA ccTLDs, ISO 4217
- Common names, search aliases, NANP area codes, Unicode flags
- `getFlagSvgUrl` in the core package; optional `country-kit/flags` for inline SVG
- Tree-shakeable (`sideEffects: false`)

There is no React or Vue package. Import the same functions from React, Vue, or Node.

## Upgrading from 1.x

`getCallingCode` returns the ITU-T E.164 country code only. NANP territories that used to return country code plus area code now return `+1`.

```typescript
getCallingCode('AI');        // '+1'     (was '+1264' in 1.x)
getDialCode('AI');           // '+1264'
isValidCallingCode('+1264'); // false
isValidCallingCode('+1');    // true
```

Invalid lookups return `undefined` and do not call `console.error`. Use `getDialCode` or `nanpAreaCodes` in a phone picker. Notes: [changelog](https://country-kit.vercel.app/changelog/).

## Data

The published package is [`packages/country-kit`](./packages/country-kit). Kosovo (`XK`) is omitted because it is user-assigned, not ISO 3166-1 assigned. Sources and field notes: [data](https://country-kit.vercel.app/data/).

## License

ISC. See [LICENSE](./LICENSE).
