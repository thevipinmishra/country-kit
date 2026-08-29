# Official data sources

These files are used by `scripts/generate-data.mjs` and `scripts/generate-flags.mjs`.

| File | Standard | Source |
| --- | --- | --- |
| `iso-3166-1.json` | ISO 3166-1 + UN M49 | [lukes/ISO-3166-Countries-with-Regional-Codes](https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes) (UN Statistics Division M49 names, codes, and regions) |
| `legacy-calling-codes.json` | ITU-T E.164 (seed) | Previous country-kit values, normalized to official country codes during generation |
| `iso-extras.json` | ISO independent, IANA TLD, ISO 4217, capitals | [datasets/country-codes](https://github.com/datasets/country-codes), with corrections in `generate-data.mjs` |
| `flag-icons.LICENSE` | SVG flags | [lipis/flag-icons](https://github.com/lipis/flag-icons) (Wikipedia/Wikimedia SVGs, MIT) |

Calling codes are **ITU-T E.164 country calling codes**, not national destination codes. NANP territories all use `+1`; their NPA (area) codes are stored separately.

## Extras corrections

`iso-extras.json` is a snapshot. A few rows are overridden at generate time so the published dataset stays current:

| Code | Field | Snapshot | Published | Why |
| --- | --- | --- | --- | --- |
| `TR` | `currencies` | `[]` | `TRY` | Turkish lira is ISO 4217 `TRY` |
| `KZ` | `capital` | Nur-Sultan | Astana | Official rename (2022) |
| `BL` | `tld` | `.gp` | `.bl` | IANA ccTLD for Saint Barthélemy |
| `MF` | `tld` | `.gp` | `.mf` | IANA ccTLD for Saint Martin (French) |
| `GS` | `currencies` | `[]` | `GBP` | Sterling is used on South Georgia |
| `GB` | `tld` | `.uk` | `.uk` | IANA exception; `.gb` is unused |

Antarctica (`AQ`) and Palestine (`PS`) keep an empty `currencies` list: ISO 4217 does not assign them a code.

Unicode flag emojis are derived from ISO 3166-1 alpha-2 codes via regional indicator symbols (UTS #51). SVG flags are generated with `pnpm generate:flags`.
