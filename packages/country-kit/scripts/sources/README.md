# Official data sources

These files are used by `scripts/generate-data.mjs` to build `src/data/countries.json`.

| File | Standard | Source |
| --- | --- | --- |
| `iso-3166-1.json` | ISO 3166-1 + UN M49 | [lukes/ISO-3166-Countries-with-Regional-Codes](https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes) (UN Statistics Division M49 names, codes, and regions) |
| `legacy-calling-codes.json` | ITU-T E.164 (seed) | Previous country-kit values, normalized to official country codes during generation |

Calling codes are **ITU-T E.164 country calling codes**, not national destination codes. NANP territories all use `+1`; their NPA (area) codes are stored separately.

Unicode flag emojis are not stored: they are derived from ISO 3166-1 alpha-2 codes via regional indicator symbols (Unicode CLDR / UTS #51).
