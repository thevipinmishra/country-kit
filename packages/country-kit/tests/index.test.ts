import { describe, expect, test } from 'vitest';
import {
  getCountryName,
  getCountryByCode,
  getCallingCode,
  getAlpha3Code,
  getCountryFlag,
  getAllCountries,
  countryData,
  countries,
  countryCodes,
  countryNames,
  isValidCallingCode,
  getCountriesByCallingCode,
  searchCountries,
  isValidCountryCode,
  type CountryCode
} from 'country-kit';

// Test constants
const TEST_DATA = {
  US: {
    code: 'US',
    name: "United States of America", // Matches exact name from countryData
    alpha3: 'USA',
    callingCode: '+1',
    flag: '🇺🇸'
  },
  GB: {
    code: 'GB',
    name: "United Kingdom of Great Britain and Northern Ireland", // Matches exact name from countryData
    alpha3: 'GBR',
    callingCode: '+44',
    flag: '🇬🇧'
  }
};

describe('Country Data Structure', () => {
  test('data consistency across exports', () => {
    const dataLength = Object.keys(countryData).length;
    expect(countryCodes.length).toBe(dataLength);
    expect(Object.keys(countries).length).toBe(dataLength);
    expect(countryNames.length).toBe(dataLength);
    expect(dataLength).toBe(249); // Total number of countries
  });

  test('country data format', () => {
    for (const code of ['US', 'GB']) {
      const data = countryData[code];
      expect(data).toMatchObject({
        name: expect.any(String),
        alpha3: expect.stringMatching(/^[A-Z]{3}$/),
        callingCode: expect.stringMatching(/^\+\d+$/),
        flag: expect.any(String)
      });
    }
  });
});

describe('Country Code Validation', () => {
  test.each([
    ['US', true],
    ['GB', true],
    ['us', true],
    ['gb', true],
    ['XX', false],
    ['', false],
    ['USA', false]
  ])('isValidCountryCode(%s) -> %s', (code, expected) => {
    expect(isValidCountryCode(code)).toBe(expected);
  });
});

describe('Country Information Retrieval', () => {
  test.each(['US', 'GB'])('gets correct data for %s', (code) => {
    const data = TEST_DATA[code as keyof typeof TEST_DATA];
    expect(getCountryName(code as CountryCode)).toBe(data.name);
    expect(getCallingCode(code as CountryCode)).toBe(data.callingCode);
    expect(getAlpha3Code(code as CountryCode)).toBe(data.alpha3);
    expect(getCountryFlag(code as CountryCode)).toBe(data.flag);
    
    expect(getCountryByCode(code as CountryCode)).toEqual({
      ...data
    });
  });

  test('handles invalid country code', () => {
    const invalidCode = 'XX' as CountryCode;
    expect(getCountryName(invalidCode)).toBeUndefined();
    expect(getCallingCode(invalidCode)).toBeUndefined();
    expect(getAlpha3Code(invalidCode)).toBeUndefined();
    expect(getCountryFlag(invalidCode)).toBeUndefined();
    expect(getCountryByCode(invalidCode)).toBeUndefined();
  });
});

describe('Calling Code Functions', () => {
  test.each([
    ['+1', true],
    ['+44', true],
    ['+123', true],
    ['1', false],
    ['++44', false],
    ['+12345', false],
    ['', false]
  ])('isValidCallingCode(%s) -> %s', (code, expected) => {
    expect(isValidCallingCode(code)).toBe(expected);
  });

  test('getCountriesByCallingCode returns correct countries', () => {
    const plusOne = getCountriesByCallingCode('+1');
    expect(plusOne.some(c => c.code === 'US')).toBe(true);
    expect(plusOne.some(c => c.code === 'CA')).toBe(true);
    expect(plusOne.every(c => c.callingCode === '+1')).toBe(true);
  });

  test('getCountriesByCallingCode handles invalid codes', () => {
    expect(getCountriesByCallingCode('+999')).toEqual([]);
    expect(getCountriesByCallingCode('44')).toEqual([]);
  });
});

describe('Search Function', () => {
  test('basic search functionality', () => {
    const results = searchCountries('united');
    expect(results.length).toBeGreaterThan(1);
    expect(results.some(c => c.code === 'US')).toBe(true);
    expect(results.some(c => c.code === 'GB')).toBe(true);
  });

  test('search options', () => {
    // Test limit option
    const limitResults = searchCountries('united', { limit: 1 });
    expect(limitResults).toHaveLength(1);

    // Test exact match
    const exactMatch = searchCountries('United States of America', { exact: true });
    expect(exactMatch).toHaveLength(1);
    expect(exactMatch[0].code).toBe('US');

    // Test code search
    const withCodes = searchCountries('us', { includeCodes: true });
    expect(withCodes.some(c => c.code === 'US')).toBe(true);

    const withoutCodes = searchCountries('us', { includeCodes: false });
    expect(withoutCodes.some(c => c.code === 'US')).toBe(false);
  });

  test.each([
    '',
    '   ',
    undefined,
    null
  ] as any[])('handles invalid input: %s', (input) => {
    expect(searchCountries(input)).toEqual([]);
  });
});

describe('getAllCountries', () => {
  test('returns complete country list', () => {
    const allCountries = getAllCountries();
    expect(allCountries).toHaveLength(countryCodes.length);
    expect(allCountries[0]).toMatchObject({
      code: expect.any(String),
      name: expect.any(String),
      alpha3: expect.stringMatching(/^[A-Z]{3}$/),
      callingCode: expect.stringMatching(/^\+\d+$/),
      flag: expect.any(String)
    });
  });
});
