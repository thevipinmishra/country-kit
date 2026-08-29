# country-kit

Official ISO 3166-1 country data for TypeScript — codes, names, ITU-T E.164 calling codes, UN M49 regions, IANA ccTLDs, ISO 4217 currencies, Unicode flag emojis, and Wikipedia SVG flags.

[![npm version](https://img.shields.io/npm/v/country-kit.svg)](https://www.npmjs.com/package/country-kit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/country-kit)](https://bundlephobia.com/package/country-kit)
[![license](https://img.shields.io/npm/l/country-kit.svg)](https://github.com/thevipinmishra/country-kit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## Why country-kit?

- **Official data**: ISO 3166-1 assigned codes and English short names, UN M49 numeric/region codes, ITU-T E.164 country calling codes, IANA ccTLDs, ISO 4217 currencies
- **Type-safe**: `CountryCode` is a union of all 249 assigned alpha-2 codes
- **Zero dependencies**: static dataset, works in the browser and Node.js
- **Practical extras**: common names, search aliases, NANP area codes, Unicode flags, and Wikipedia SVG flags

Docs: [playground](https://country-kit.vercel.app/), [examples](https://country-kit.vercel.app/examples/), [API](https://country-kit.vercel.app/api/).

## Data sources

| Field | Standard | Notes |
| --- | --- | --- |
| `code`, `alpha3`, `name` | ISO 3166-1 | All **249** officially assigned codes. `name` is the ISO English short name. |
| `numeric`, `region`, `subregion` | UN M49 | Numeric codes are identical to ISO 3166-1 numeric. Antarctica and Taiwan have no UN region. |
| `callingCode` | ITU-T E.164 | Country calling codes only (1–3 digits). NANP members are `+1`, not `+1` plus an area code. |
| `nanpAreaCodes` | NANP | Area codes for territories that share `+1`. |
| `independent` | ISO 3166 | Independent-territory flag (195 yes). |
| `tld` | IANA | Country-code TLD. **`GB` is `.uk`**, not `.gb`. |
| `currencies` | ISO 4217 | Alphabetic currency codes. Empty when none is assigned (Antarctica, Palestine). |
| `capital` | Conventional English | Not an ISO field; kept for UI labels. |
| `flag` | Unicode UTS #51 | Derived from the alpha-2 code via regional indicator symbols. |
| SVG flags | Wikimedia / flag-icons | Wikipedia SVG drawings, MIT, pinned to flag-icons 7.5.0. |

Kosovo (`XK`) is **not** included: it is a user-assigned code, not an ISO 3166-1 assigned code.

Regenerate the dataset with `pnpm generate` after updating files in `scripts/sources/`. Rebuild inline SVGs with `pnpm generate:flags`.

## Installation

```bash
npm install country-kit
# yarn add country-kit
# pnpm add country-kit
```

## Quick start

```typescript
import { getCountry, searchCountries } from 'country-kit';

const us = getCountry('US');
// {
//   code: 'US',
//   name: 'United States of America',  // ISO short name
//   commonName: 'United States',
//   alpha3: 'USA',
//   numeric: '840',
//   callingCode: '+1',                 // ITU-T E.164
//   dialCode: '+1',
//   region: 'Americas',
//   tld: '.us',
//   currencies: ['USD'],
//   flag: '🇺🇸'
// }

searchCountries('uk');        // United Kingdom (alias)
searchCountries('Vietnam');   // Viet Nam
searchCountries('.uk');       // United Kingdom (IANA TLD)
searchCountries('TRY');       // Türkiye (ISO 4217)
```

## API

### Lookup

| Function | Description |
| --- | --- |
| `getCountry(id)` | Alpha-2, alpha-3, or numeric code |
| `getCountryByCode(code)` | ISO 3166-1 alpha-2 |
| `getCountryByAlpha3(alpha3)` | ISO 3166-1 alpha-3 |
| `getCountryByNumeric(numeric)` | ISO 3166-1 numeric / UN M49 (`"840"` or `"84"`) |
| `getCountryByTld(tld)` | IANA ccTLD (`".uk"` or `"uk"` → GB) |
| `getCountryName(code)` | Official ISO English short name |
| `getCountryCommonName(code)` | Everyday English name |
| `getAlpha3Code(code)` | Alpha-3 |
| `getNumericCode(code)` | Numeric, zero-padded |
| `getCallingCode(code)` | E.164 country calling code (`+1` for all NANP) |
| `getDialCode(code)` | Phone-input prefix (`+1264` for Anguilla, `+1` for the US) |
| `getCountryFlag(code)` | Flag emoji |
| `getFlagSvgUrl(code, options?)` | Version-pinned Wikipedia SVG URL (`ratio`: `4x3` \| `1x1`) |
| `getCountryTld` / `getCountryCapital` / `getCountryCurrencies` | IANA TLD, capital, ISO 4217 |
| `getAllCountries(options?)` | Optional `region`, `subregion`, `independent`, `sortBy` |
| `getIndependentCountries()` | ISO independent = yes |
| `getCountrySelectOptions()` | Select-ready `{ value, label, dialCode, flag, flagSvgUrl }` |

### Search and grouping

| Function | Description |
| --- | --- |
| `searchCountries(query, options?)` | Ranked search over official names, common names, aliases, codes, TLDs, currencies, and capitals |
| `getCountriesByCallingCode(code)` | E.164 match; `+1264` also resolves NANP NPAs |
| `getCountriesByCurrency(code)` | ISO 4217 alphabetic code (`EUR`, `usd`) |
| `getCountriesByRegion()` / `getCountriesByRegion('Europe')` | UN M49 region |
| `getCountriesBySubregion(subregion)` | UN M49 sub-region |
| `listRegions()` / `listSubregions()` / `listCurrencies()` | Distinct names / codes |

Search options: `limit`, `exact`, `includeCodes` (default `true`).

### Validation

```typescript
isValidCountryCode('US');   // true  (type guard for CountryCode)
isValidCallingCode('+44');  // true  (E.164 format: + and 1–3 digits)
isValidCallingCode('+1264'); // false (that is +1 plus a NANP area code)
```

### Types

```typescript
type CountryCode = 'AD' | 'AE' | /* … 249 assigned alpha-2 codes … */;

interface Country {
  code: CountryCode;
  name: string;            // ISO 3166-1 English short name
  commonName: string;
  alpha3: string;
  numeric: string;
  callingCode: string;     // ITU-T E.164
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

## Examples

Live widgets for each of these live on the [examples page](https://country-kit.vercel.app/examples/).

### Signup: country of residence

Persist the ISO alpha-2 code. Show the common name. Hide territories.

```typescript
import { getCountry, getCountrySelectOptions } from 'country-kit';

const options = getCountrySelectOptions({ independent: true });

select.innerHTML = options
  .map((o) => `<option value="${o.value}">${o.label}</option>`)
  .join('');

const country = getCountry(select.value);
profile.countryCode = country?.code;       // 'FR'
profile.displayName = country?.commonName; // 'France'
```

### Checkout: phone prefix

`dialCode` is what a phone picker should show. `callingCode` is the ITU-T E.164 country code.

```typescript
import {
  getCallingCode,
  getCountriesByCallingCode,
  getDialCode,
  searchCountries,
} from 'country-kit';

const [match] = searchCountries('Anguilla', { limit: 1 });
getDialCode(match.code);    // '+1264'  prefix in the UI
getCallingCode(match.code); // '+1'     store as E.164 country code

getCountriesByCallingCode('+1264'); // [Anguilla]
getCountriesByCallingCode('+1');    // US, CA, AI, …
```

### Address typeahead

```typescript
import { searchCountries } from 'country-kit';

const results = searchCountries(query, { limit: 6 });
// 'uk' / '.uk' → United Kingdom
// 'Vietnam'    → Viet Nam
// 'TRY'        → Türkiye
// 'Paris'      → France

order.shipTo = results[0].code;
order.shipToLabel = results[0].commonName;
```

### Profile flag

```typescript
import { getCountry, getCountryFlag, getFlagSvgUrl } from 'country-kit';
import { getFlagSvg } from 'country-kit/flags'; // optional, larger entry

const user = getCountry(profile.countryCode);
<img src={getFlagSvgUrl(user.code)} alt={`Flag of ${user.commonName}`} />;
<img src={getFlagSvgUrl(user.code, { ratio: '1x1' })} alt="" />;
getCountryFlag(user.code); // '🇯🇵'
// Offline: element.innerHTML = getFlagSvg(user.code);
```

### Country from a hostname or email

```typescript
import { getCountryByTld } from 'country-kit';

function countryFromHost(value: string) {
  const host = value.includes('@')
    ? value.split('@').pop()!
    : value.replace(/^https?:\/\//, '').split(/[/?#]/)[0];
  return getCountryByTld('.' + host.split('.').pop());
}

countryFromHost('https://www.gov.uk'); // United Kingdom (GB, not .gb)
countryFromHost('ada@bund.de');        // Germany
countryFromHost('https://npmjs.com');  // undefined (.com is not a ccTLD)
```

### Billing: where a currency is used

```typescript
import { getCountriesByCurrency, listCurrencies } from 'country-kit';

listCurrencies(); // ['AED', 'AFN', …]
const euro = getCountriesByCurrency('EUR');
pricing.enabledMarkets = euro.map((c) => c.code);
```

### Shipping zone

```typescript
import { getAllCountries, getIndependentCountries, listRegions } from 'country-kit';

listRegions(); // Africa, Americas, Asia, Europe, Oceania

const europe = getAllCountries({
  region: 'Europe',
  independent: true,
  sortBy: 'commonName',
});

getIndependentCountries(); // 195 sovereign states
```

### Validate a webhook / query param

```typescript
import {
  getCountry,
  isValidCallingCode,
  isValidCountryCode,
  type CountryCode,
} from 'country-kit';

function parseCountry(raw: string): CountryCode | undefined {
  if (isValidCountryCode(raw)) return raw;
  return getCountry(raw)?.code; // 'USA' / '840' → 'US'
}

parseCountry('GB');            // 'GB'
parseCountry('XK');            // undefined (not ISO assigned)
isValidCallingCode('+44');     // true
isValidCallingCode('+1264');   // false (NANP area code, not E.164)
```

## Breaking changes in 2.0

- **Calling codes follow ITU-T E.164.** NANP territories such as Anguilla are `+1`, not `+1264`. Use `dialCode` or `nanpAreaCodes` when you need the area code for a phone picker.
- **`isValidCallingCode`** accepts only 1–3 digit country codes (E.164), not concatenated NPAs.
- **`Country`** includes `commonName`, `numeric`, `callingCodes`, `dialCode`, `region`, `subregion`, `independent`, `tld`, `capital`, and `currencies`.
- Invalid lookups no longer write to `console.error`.

## Package layout

```
src/
  index.ts              public exports (does not include inline SVGs)
  api.ts                lookup, search, validation
  data.ts               indexes (Maps / Sets) over the dataset
  flags.ts              Unicode regional-indicator flags
  flag-urls.ts          version-pinned CDN URLs
  svg-flags.ts          country-kit/flags entry (inline SVG)
  types.ts
  country-code.ts       generated CountryCode union
  data/countries.json   generated from scripts/sources
  data/flag-svgs.json   generated Wikipedia SVGs (optional entry)
scripts/
  generate-data.mjs
  generate-flags.mjs
  sources/              ISO 3166-1 / UN M49 / extras / flag-icons license
```

Import `country-kit/flags` only when you need inline SVG markup. The core bundle stays a compact JSON dataset plus lookup functions.

## License

ISC — see [LICENSE](https://github.com/thevipinmishra/country-kit/blob/main/LICENSE).

SVG flags are MIT (flag-icons / Wikipedia). See `scripts/sources/flag-icons.LICENSE`.
