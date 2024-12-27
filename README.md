# country-kit

A lightweight TypeScript library providing comprehensive country data including ISO codes, names, calling codes, and flag emojis.

[![npm version](https://img.shields.io/npm/v/country-kit.svg)](https://www.npmjs.com/package/country-kit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/country-kit)](https://bundlephobia.com/package/country-kit)
[![license](https://img.shields.io/npm/l/country-kit.svg)](https://github.com/yourusername/country-kit/blob/main/LICENSE)

## Features

- 🌍 Complete ISO 3166-1 country data
- 🔍 Type-safe lookups
- 📞 International calling codes
- 🎌 Flag emojis for all countries
- 📦 Zero dependencies
- 🚀 Tree-shakeable
- 💻 Full TypeScript support

## Installation

```bash
npm install country-kit
# or
yarn add country-kit
# or
pnpm add country-kit
```

## Usage

```typescript
import { 
  getCountryName,
  getCountryByCode,
  getCallingCode,
  getAlpha3Code,
  getCountryFlag,
  getAllCountries
} from 'country-kit';

// Get country name from ISO code
console.log(getCountryName('US')); // 'United States of America'

// Get complete country information
console.log(getCountryByCode('GB'));
// {
//   code: 'GB',
//   name: 'United Kingdom of Great Britain and Northern Ireland',
//   alpha3: 'GBR',
//   callingCode: '+44',
//   flag: '🇬🇧'
// }

// Get calling code
console.log(getCallingCode('FR')); // '+33'

// Get ISO 3166-1 alpha-3 code
console.log(getAlpha3Code('JP')); // 'JPN'

// Get country flag emoji
console.log(getCountryFlag('IN')); // '🇮🇳'

// Get all countries
const allCountries = getAllCountries();
```

## API Reference

### Functions

#### `getCountryName(code: CountryCode): string | undefined`
Returns the country name for a given ISO 3166-1 alpha-2 country code.

#### `getCountryByCode(code: CountryCode): Country | undefined`
Returns complete country information including name, alpha-3 code, calling code, and flag.

#### `getCallingCode(code: CountryCode): string | undefined`
Returns the international calling code (with + prefix) for a given country code.

#### `getAlpha3Code(code: CountryCode): string | undefined`
Returns the ISO 3166-1 alpha-3 code for a given alpha-2 country code.

#### `getCountryFlag(code: CountryCode): string | undefined`
Returns the flag emoji for a given country code.

#### `getAllCountries(): Country[]
Returns an array of all countries with their complete information.

### Types

```typescript
type CountryCode = string; // ISO 3166-1 alpha-2 code

interface Country {
  name: string;
  code: CountryCode;
  alpha3: string;
  callingCode: string;
  flag: string;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.
