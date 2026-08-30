---
title: Changelog
description: "country-kit version history: 1.0.0 through 2.0.0. E.164 calling codes, generated ISO dataset, flags, and lookups."
---

Package history for `country-kit`. Same text as [`packages/country-kit/CHANGELOG.md`](https://github.com/thevipinmishra/country-kit/blob/main/packages/country-kit/CHANGELOG.md).

## 2.0.0 - 2026-08-29

### Added

- `commonName`, `numeric`, `callingCodes`, `dialCode`, `region`, `subregion`, `independent`, `tld`, `capital`, `currencies`, and `nanpAreaCodes` on `Country`
- `getCountry`, `getCountryByAlpha3`, `getCountryByNumeric`, `getCountryByTld`, `getDialCode`, `getCountryCommonName`, `getNumericCode`, `getCountryTld`, `getCountryCapital`, `getCountryCurrencies`
- `getIndependentCountries`, `getCountrySelectOptions`, `getCountriesByCurrency`, `getCountriesBySubregion`, `listRegions`, `listSubregions`, `listCurrencies`
- `getFlagSvgUrl` (jsDelivr, flag-icons 7.5.0) and the optional `country-kit/flags` entry for inline SVG
- `getCountriesByRegion(region)` overload; the no-argument form still returns `{ [region]: Country[] }`

### Changed

- Dataset is generated from ISO 3166-1 and UN M49. Names, calling codes, and coverage follow those sources. Kosovo (`XK`) is not an assigned ISO 3166-1 code and is not included.
- `getCallingCode` returns the ITU-T E.164 country calling code only (1-3 digits). NANP territories that previously returned a concatenated NPA now return `+1`. Anguilla is `+1`, not `+1264`. Use `getDialCode` or `nanpAreaCodes` for a phone-input prefix.
- `isValidCallingCode` accepts `+` plus 1-3 digits. `isValidCallingCode('+1264')` is `false`. `+1` is `true`.
- Invalid lookups return `undefined`. They no longer call `console.error`.

```typescript
import { getCallingCode, getDialCode, isValidCallingCode } from 'country-kit';

getCallingCode('AI');        // was '+1264' in 1.x; now '+1'
getDialCode('AI');           // '+1264'
isValidCallingCode('+1264'); // false
isValidCallingCode('+1');    // true
```

## 1.1.0 - 2024-12-28

### Added

- `searchCountries`, `isValidCountryCode`, `isValidCallingCode`, `getCountriesByCallingCode`, `getCountriesByRegion()`
- Type exports: `Country`, `CountryCode`, `CountryData`, `CountrySearchOptions`

### Changed

- Unknown alpha-2 lookups log with `console.error`
- `homepage` field in package.json

## 1.0.3 - 2024-12-27

### Changed

- NANP calling codes stored as `+1264` (no hyphen), not `+1-264`

### Fixed

- `getCountryFlag` returns `undefined` for unknown codes instead of calling `getFlag` on a missing code

## 1.0.2 - 2024-12-27

### Changed

- Version bump only

## 1.0.1 - 2024-12-27

### Changed

- README license badge and Node / browser note
- package.json metadata

## 1.0.0 - 2024-12-27

### Added

- ISO 3166-1 alpha-2/3 codes, English short names, calling codes, Unicode flag emoji
- `getCountryByCode`, `getCountryName`, `getCallingCode`, `getAlpha3Code`, `getCountryFlag`, `getAllCountries`, `getFlag`
