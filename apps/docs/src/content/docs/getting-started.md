---
title: Getting started
description: "Install country-kit, look up a country, and use CountryCode in TypeScript."
---

`country-kit` is a TypeScript dataset of the 249 assigned ISO 3166-1 codes. Look up a country, search by name or TLD, read a calling code, or fetch a flag URL. No runtime dependencies.

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

Node 18 or newer. ESM and CommonJS.

## First lookup

```typescript
import { getCountry } from 'country-kit';

const us = getCountry('US');
us?.commonName;   // 'United States'
us?.name;         // 'United States of America'
us?.callingCode;  // '+1'
us?.tld;          // '.us'
```

`getCountry` accepts an alpha-2 code (`US`), alpha-3 (`USA`), or numeric / UN M49 code (`840` or `84`). Unknown values return `undefined`.

```typescript
import { searchCountries } from 'country-kit';

searchCountries('uk')[0]?.code;       // 'GB'
searchCountries('Vietnam')[0]?.code;  // 'VN'
searchCountries('.uk')[0]?.code;      // 'GB'
searchCountries('TRY')[0]?.code;      // 'TR'
```

Try queries on the [playground](/).

## Country record

`name` is the ISO 3166-1 English short name. `commonName` is the everyday label for a select or heading.

```typescript
interface Country {
  code: CountryCode;          // 'AD' | 'AE' | … 249 assigned
  name: string;
  commonName: string;
  alpha3: string;
  numeric: string;            // UN M49, 3 digits
  callingCode: string;        // ITU-T E.164
  callingCodes: readonly string[];
  dialCode: string;
  region: string | null;
  subregion: string | null;
  independent: boolean;
  tld: string | null;
  capital: string | null;
  currencies: readonly string[];
  flag: string;
  nanpAreaCodes?: readonly string[];
}
```

Kosovo (`XK`) is not in the dataset. It is user-assigned, not ISO 3166-1 assigned. Field sources: [data](/data/).

## Calling code vs dial prefix

NANP members share the E.164 country code `+1`. `dialCode` adds the primary area code so a phone input can show `+1264` for Anguilla.

```typescript
import { getCallingCode, getDialCode } from 'country-kit';

getCallingCode('AI'); // '+1'
getDialCode('AI');    // '+1264'
getCallingCode('US'); // '+1'
getDialCode('US');    // '+1'
```

Show `dialCode` in a picker. Store `callingCode` when you want the ITU-T country code.

## Flags

The core package stores a version-pinned CDN URL. Import `country-kit/flags` only if you need inline SVG markup.

```typescript
import { getCountryFlag, getFlagSvgUrl } from 'country-kit';
import { getFlagSvg } from 'country-kit/flags';

getFlagSvgUrl('JP');                  // 4x3 SVG on jsDelivr
getFlagSvgUrl('JP', { ratio: '1x1' });
getCountryFlag('JP');                 // '🇯🇵'
getFlagSvg('JP');                     // '<svg …>'
```

Browse every flag on [flags](/flags/).

## TypeScript

`isValidCountryCode` is a type guard for the `CountryCode` union. `getCountry` also accepts alpha-3 and numeric codes.

```typescript
import { getCountry, isValidCountryCode, type CountryCode } from 'country-kit';

function parseCountry(raw: string): CountryCode | undefined {
  if (isValidCountryCode(raw)) return raw;
  return getCountry(raw)?.code;
}

parseCountry('GB');   // 'GB'
parseCountry('USA');  // 'US'
parseCountry('XK');   // undefined
```

## Next

Copy-paste widgets are on [Examples](/examples/). The full function list is on [API](/api/). Browse all 249 records in [Explorer](/explorer/). The 1.x calling-code change is in the [changelog](/changelog/).
