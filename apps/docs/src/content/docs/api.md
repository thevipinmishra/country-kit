---
title: API
description: "country-kit TypeScript API: getCountry, searchCountries, calling codes, TLDs, currencies, flags, data maps, and Country types."
---

Two entry points. `country-kit` is the dataset and lookups. `country-kit/flags` adds inline SVG markup.

```typescript
import { getCountry, getFlagSvgUrl, searchCountries } from 'country-kit';
import { getFlagSvg } from 'country-kit/flags';

const japan = getCountry('JP');
getFlagSvgUrl('JP');     // CDN SVG
getFlagSvg('JP');        // inline SVG markup
searchCountries('uk');   // United Kingdom
searchCountries('.uk');  // same, via IANA TLD
```

Codes are trimmed and case-folded. Invalid lookups return `undefined`.

## Lookup

| Function | Description |
| --- | --- |
| `getCountry(id)` | Alpha-2, alpha-3, or numeric (`US`, `USA`, `840`). |
| `getCountryByCode(code)` | ISO 3166-1 alpha-2 only. |
| `getCountryByAlpha3(alpha3)` | ISO 3166-1 alpha-3. |
| `getCountryByNumeric(numeric)` | UN M49 / ISO numeric; `"84"` pads to `"084"`. |
| `getCountryByTld(tld)` | IANA ccTLD. `".uk"` and `"uk"` both resolve to GB. |
| `getCountryName(code)` | ISO English short name. |
| `getCountryCommonName(code)` | Common name (`United States`). |
| `getAlpha3Code` / `getNumericCode` | Code conversions from alpha-2. |
| `getCallingCode(code)` | ITU-T E.164 country code (`AI` → `+1`). |
| `getDialCode(code)` | Phone-input prefix (`AI` → `+1264`). |
| `getCountryTld` / `getCountryCapital` / `getCountryCurrencies` | IANA TLD, capital, ISO 4217 codes. |
| `getCountryFlag(code)` | Unicode flag emoji, or `undefined` if the code is not assigned. |
| `getFlag(code)` | Emoji from the letters. Does not check that the code is assigned. |
| `getFlagSvgUrl(code, options?)` | CDN URL. See [Flags](#flags). |

## Lists and search

| Function | Description |
| --- | --- |
| `getAllCountries(options?)` | Filter by `region`, `subregion`, `independent`; `sortBy` `name` \| `commonName` \| `code` \| `dialCode`. |
| `getIndependentCountries()` | ISO independent = yes (195). |
| `getCountrySelectOptions(options?)` | `{ value, label, dialCode, flag, flagSvgUrl }` for a select. |
| `searchCountries(query, options?)` | Names, aliases, codes, TLDs, currencies, capitals. Empty or blank query → `[]`. |
| `getCountriesByCallingCode(code)` | E.164 match; `+1264` resolves NANP NPAs. |
| `getCountriesByCurrency(code)` | ISO 4217 alphabetic code (`EUR`, `usd`). |
| `getCountriesByRegion()` | Map of UN M49 region → countries. |
| `getCountriesByRegion('Europe')` | Countries in that region. |
| `getCountriesBySubregion(subregion)` | UN M49 sub-region. |
| `listRegions` / `listSubregions` / `listCurrencies` | Distinct region names and currency codes. |

`searchCountries` options: `limit`, `exact` (default `false`), `includeCodes` (default `true`). Results are ranked so exact code and name matches appear first.

## Validation

| Function | Description |
| --- | --- |
| `isValidCountryCode(code)` | Type guard for assigned alpha-2 codes. |
| `isValidCallingCode(code)` | E.164 format: `+` and 1-3 digits. |

```typescript
isValidCountryCode('US');    // true
isValidCountryCode('USA');   // false (use getCountry)
isValidCallingCode('+44');   // true
isValidCallingCode('+1264'); // false
```

## Flags

```typescript
import { FLAG_ICONS_VERSION, getFlagSvgUrl } from 'country-kit';

getFlagSvgUrl('JP');
// https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.5.0/flags/4x3/jp.svg

getFlagSvgUrl('JP', { ratio: '1x1' });
getFlagSvgUrl('US', { source: 'flagcdn' });           // https://flagcdn.com/us.svg
getFlagSvgUrl('US', { source: 'flagcdn', ratio: '1x1' }); // PNG
```

`FlagUrlOptions`: `ratio` is `4x3` (default) or `1x1`. `source` is `flag-icons` (default, jsDelivr, version-pinned) or `flagcdn`. Unknown codes return `undefined`.

```typescript
import { getFlagSvg } from 'country-kit/flags';

getFlagSvg('JP'); // 4x3 SVG markup, or undefined
```

`country-kit/flags` also re-exports `getFlagSvgUrl`, `FLAG_ICONS_VERSION`, and the flag types.

## Data maps

| Export | Description |
| --- | --- |
| `COUNTRY_CODES` | Tuple of all 249 assigned alpha-2 codes. |
| `countryCodes` | Same list as `readonly string[]`. |
| `countryNames` | ISO English short names, same order. |
| `countryData` | Record keyed by alpha-2, including `aliases`. |
| `countries` | `{ [code]: name }` map. Deprecated; use `getCountryName` / `getAllCountries`. |
| `FLAG_ICONS_VERSION` | Pinned flag-icons version (`7.5.0`). |

## Select options

```typescript
import { getCountrySelectOptions } from 'country-kit';

const options = getCountrySelectOptions({ independent: true });
// { value: 'FR', label: '🇫🇷 France', dialCode: '+33',
//   flag: '🇫🇷', flagSvgUrl: 'https://…/fr.svg' }
```

## Calling code vs dial prefix

```typescript
import { getCallingCode, getDialCode } from 'country-kit';

getCallingCode('AI'); // '+1'     ITU-T E.164
getDialCode('AI');    // '+1264'  +1 and Anguilla NPA
```

US and Canada stay `+1` (no single NPA). Saint Helena (`SH`) has `callingCodes` `+290` and `+247`.

## Types

```typescript
interface Country {
  code: CountryCode;          // 'AD' | 'AE' | … 249 assigned
  name: string;               // ISO English short name
  commonName: string;
  alpha3: string;
  numeric: string;            // UN M49, 3 digits
  callingCode: string;        // ITU-T E.164
  callingCodes: readonly string[];
  dialCode: string;
  region: string | null;
  subregion: string | null;
  independent: boolean;
  tld: string | null;         // '.uk' for GB
  capital: string | null;
  currencies: readonly string[];
  flag: string;
  nanpAreaCodes?: readonly string[];
}
```

Also exported: `CountryData` (adds `aliases`), `CountryRecord`, `CountryListOptions`, `CountrySearchOptions`, `CountrySelectOption`, `CountryRegion`, `FlagUrlOptions`, `FlagRatio`, `FlagSource`.

## 2.0 changes

- `getCallingCode('AI')` is `+1`. Use `getDialCode` for `+1264`.
- `isValidCallingCode('+1264')` is false. Pass `+1` through `+999` only.
- Bad lookups return `undefined` and do not call `console.error`.

Dates and older patches: [changelog](/changelog/).
