# Changelog

Versions **1.0.0** through **1.1.0** are on npm. **2.0.0** is the version in this repo and has not been published yet (`npm view country-kit version` is still 1.1.0).

There was no changelog file before this one. Entries below come from git history and npm.

## 2.0.0

Unreleased on npm. Git: 2026-08-29 (`e3f0df7`, `7a78965`).

### Breaking

- **E.164 calling codes.** `getCallingCode` returns the ITU-T country code only (1-3 digits). NANP territories that used to return a concatenated NPA now return `+1`. Anguilla is `+1`, not `+1264`. Use `getDialCode` or `nanpAreaCodes` for a phone-input prefix.
- **`isValidCallingCode`.** Accepts `+` plus 1-3 digits. `isValidCallingCode('+1264')` is `false`. `+1` is `true`.
- **Invalid lookups.** Helpers return `undefined`. They do not call `console.error`.
- **Dataset.** Country records are generated from ISO 3166-1 / UN M49 instead of the hand-maintained table. Names, calling codes, and coverage follow those sources. Kosovo (`XK`) is not an assigned ISO 3166-1 code and is not in the dataset.

### Added

- `commonName`, `numeric`, `callingCodes`, `dialCode`, `region`, `subregion`, `independent`, `tld`, `capital`, `currencies`, `nanpAreaCodes` on `Country`
- `getCountry`, `getCountryByAlpha3`, `getCountryByNumeric`, `getCountryByTld`, `getDialCode`, `getCountryCommonName`, `getNumericCode`, `getCountryTld`, `getCountryCapital`, `getCountryCurrencies`
- `getIndependentCountries`, `getCountrySelectOptions`, `getCountriesByCurrency`, `getCountriesBySubregion`, `listRegions`, `listSubregions`, `listCurrencies`
- `getFlagSvgUrl` (jsDelivr, flag-icons 7.5.0) and optional `country-kit/flags` for inline SVG
- `getCountriesByRegion(region)` overload; the no-argument form still returns a `{ [region]: Country[] }` map

### Upgrade from 1.1.0

```ts
import { getCallingCode, getDialCode, isValidCallingCode } from 'country-kit';

getCallingCode('AI'); // was '+1264' in 1.x; now '+1'
getDialCode('AI');    // '+1264'

isValidCallingCode('+1264'); // was true in 1.x if you stored concatenated NPAs; now false
isValidCallingCode('+1');    // true
```

`npm install country-kit` still installs 1.1.0 until 2.0.0 is published.

## 1.1.0 - 2024-12-28

Published. Git: `879dc0f` through `fa2ea80`.

- `searchCountries`, `isValidCountryCode`, `isValidCallingCode`, `getCountriesByCallingCode`, `getCountriesByRegion()`
- Invalid alpha-2 lookups logged with `console.error`
- Type exports (`Country`, `CountryCode`, `CountryData`, `CountrySearchOptions`)
- Docs site and package homepage

## 1.0.3 - 2024-12-27

Published. Git: `df5cd2d`, `f0e1f23`.

- NANP calling codes stored as `+1264` (no hyphen), not `+1-264`
- `getCountryFlag` returns `undefined` for unknown codes instead of calling `getFlag` on a missing code

## 1.0.2 - 2024-12-27

Published. Version bump only.

## 1.0.1 - 2024-12-27

Published.

- README license badge, Node and browser note
- package.json metadata

## 1.0.0 - 2024-12-27

Published. First release.

- ISO 3166-1 alpha-2/3 codes, English short names, calling codes, Unicode flag emoji
- `getCountryByCode`, `getCountryName`, `getCallingCode`, `getAlpha3Code`, `getCountryFlag`, `getAllCountries`, `getFlag`
