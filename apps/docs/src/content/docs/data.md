---
title: Data
description: "Where country-kit data comes from: ISO 3166-1, UN M49, ITU-T E.164, IANA ccTLDs, ISO 4217, and flag-icons SVGs."
---

Identifiers come from published standards. Flag artwork is not an ISO field. SVGs come from flag-icons (Wikipedia/Wikimedia).

| Field | Source |
| --- | --- |
| `code`, `alpha3`, `name` | ISO 3166-1 assigned English short names (249 codes) |
| `numeric`, `region`, `subregion` | UN M49 (numeric codes match ISO 3166-1 numeric) |
| `callingCode` | ITU-T E.164 country calling codes (1-3 digits) |
| `nanpAreaCodes` / `dialCode` | NANP NPAs for phone UIs. Separate from E.164 country codes |
| `independent` | ISO 3166 independent-territory flag (195 yes) |
| `tld` | IANA ccTLD. GB is .uk; .gb is unused |
| `currencies` | ISO 4217 alphabetic codes. Empty for Antarctica and Palestine |
| `capital` | Conventional English capital (not an ISO field) |
| flag emoji | Unicode UTS #51 regional indicator symbols |
| SVG flags | flag-icons 4×3 and 1×1 SVGs (MIT), Wikipedia/Wikimedia, v7.5.0 |

## Calling codes vs dial prefixes

NANP members share the E.164 country code `+1`. Area codes such as Anguilla `264` are stored on `nanpAreaCodes`. `dialCode` concatenates the primary NPA so a phone input can show `+1264`.

Saint Helena, Ascension and Tristan da Cunha (`SH`) has two E.164 codes: `+290` and `+247`. Kazakhstan and Russia share `+7`.

## TLD exceptions

Most assigned alpha-2 codes map to `.` plus the lowercase code. The United Kingdom is the documented IANA exception: `GB` → `.uk`. Saint Barthélemy is `.bl`; Saint Martin (French) is `.mf`.

## Not included

- Kosovo (`XK`): user-assigned, not ISO 3166-1 assigned
- ISO 3166-2 subdivisions
- CLDR localized names
- Timezones, languages, GeoJSON

## Generate

```bash
pnpm --filter country-kit generate        # ISO / UN / extras
pnpm --filter country-kit generate:flags  # Wikipedia SVGs from flag-icons
```

Sources are in `packages/country-kit/scripts/sources/`. The generator rejects duplicate TLDs, unknown ISO extras, and currency codes that are not three letters.
