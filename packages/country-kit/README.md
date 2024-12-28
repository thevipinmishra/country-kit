# country-kit

> A comprehensive TypeScript library providing accurate ISO 3166-1 country data, including country codes, names, calling codes, and Unicode flag emojis.

[![npm version](https://img.shields.io/npm/v/country-kit.svg)](https://www.npmjs.com/package/country-kit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/country-kit)](https://bundlephobia.com/package/country-kit)
[![license](https://img.shields.io/npm/l/country-kit.svg)](https://github.com/thevipinmishra/country-kit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## Why country-kit?

country-kit is designed to be the go-to solution for handling country-related data in modern JavaScript/TypeScript applications. It provides:

- 🎯 **Accuracy**: Complete ISO 3166-1 compliant country data
- 🔒 **Type Safety**: Full TypeScript support with precise types
- 🪶 **Lightweight**: Zero dependencies, tree-shakeable
- 🚀 **Performance**: Optimized for both browser and Node.js
- 🌍 **Comprehensive**: Includes names, codes, calling codes, and flags

## Features

- 📚 **Complete ISO 3166-1 Coverage**: Full support for alpha-2, alpha-3 codes, and country names
- 🎯 **Strict Validation**: Robust input validation and error handling
- 🔒 **Type Safety**: Comprehensive TypeScript types and interfaces
- 🪶 **Tree-Shakeable**: Import only what you need
- ⚡ **Optimized**: Fast lookups and efficient data structures
- 🌐 **Unicode Flags**: Correct flag emoji handling
- 📞 **Calling Codes**: Accurate international dialing codes

## Installation

```bash
# npm
npm install country-kit

# yarn
yarn add country-kit

# pnpm
pnpm add country-kit
```

## Quick Start

```typescript
import { getCountryByCode, searchCountries } from 'country-kit';

// Get country details
const us = getCountryByCode('US');
console.log(us);
// {
//   code: 'US',
//   name: 'United States of America',
//   alpha3: 'USA',
//   callingCode: '+1',
//   flag: '🇺🇸'
// }

// Search countries
const results = searchCountries('united', { limit: 2 });
console.log(results);
// Returns matching countries like United States, United Kingdom
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

#### `getAllCountries(): Country[]`
Returns an array of all countries with their complete information.

#### `searchCountries(query: string, options?: CountrySearchOptions): Country[]`
Searches for countries by name or code using case-insensitive matching.

Options:
- `limit?: number` - Maximum number of results to return
- `exact?: boolean` - Whether to match exactly (default: false)
- `includeCodes?: boolean` - Whether to search by country codes (alpha-2, alpha-3) as well (default: true)

#### `isValidCountryCode(code: string): boolean`
Validates if a string is a valid ISO 3166-1 alpha-2 country code.

#### `isValidCallingCode(callingCode: string): boolean`
Validates if a string matches the format of an international calling code (must start with '+' followed by 1-4 digits).

#### `getCountriesByCallingCode(callingCode: string): Country[]`
Returns an array of countries that share the specified calling code.

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

## Examples

### Country Selection in Forms

```typescript
import { getAllCountries, isValidCountryCode } from 'country-kit';

const countries = getAllCountries();
const formattedOptions = countries.map(country => ({
  value: country.code,
  label: `${country.flag} ${country.name} (${country.callingCode})`
}));
```

### Phone Number Formatting

```typescript
import { getCallingCode, isValidCallingCode } from 'country-kit';

function formatPhoneNumber(countryCode: string, number: string) {
  const callingCode = getCallingCode(countryCode);
  return callingCode ? `${callingCode} ${number}` : number;
}
```

## Contributing
We welcome contributions to country-kit! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to:
- Update the documentation
- Add/update tests as needed
- Follow the existing code style
- Run the test suite before submitting

## License

This project is licensed under the ISC License - see the [LICENSE](https://github.com/thevipinmishra/country-kit/blob/main/LICENSE) file for details.

---

Made with ❤️ by [Vipin Mishra](https://github.com/thevipinmishra)
