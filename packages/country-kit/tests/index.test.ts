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
  countryNames
} from 'country-kit';

// Test data constants
const validCode = 'US';
const invalidCode = 'XX';
const lowerCaseCode = 'us';

describe('Country Data Structure', () => {
  test('countryData should contain all necessary country information', () => {
    expect(countryData).toBeDefined();
    expect(Object.keys(countryData).length).toBeGreaterThan(0);
    
    // Check structure of a known country
    const usData = countryData['US'];
    expect(usData).toEqual({
      name: 'United States of America',
      alpha3: 'USA',
      callingCode: '+1',
      flag: '🇺🇸'
    });
  });

  test('countries object should contain all country names', () => {
    expect(countries).toBeDefined();
    expect(Object.keys(countries).length).toBe(Object.keys(countryData).length);
    expect(countries['US']).toBe('United States of America');
  });

  test('countryCodes array should contain all country codes', () => {
    expect(countryCodes).toBeDefined();
    expect(countryCodes.length).toBe(Object.keys(countryData).length);
    expect(countryCodes).toContain('US');
  });

  test('countryNames array should contain all country names', () => {
    expect(countryNames).toBeDefined();
    expect(countryNames.length).toBe(Object.keys(countryData).length);
    expect(countryNames).toContain('United States of America');
  });
});

describe('getCountryName', () => {
  test('should return correct country name for valid code', () => {
    expect(getCountryName(validCode)).toBe('United States of America');
  });

  test('should handle lowercase country codes', () => {
    expect(getCountryName(lowerCaseCode)).toBe('United States of America');
  });

  test('should return undefined for invalid code', () => {
    expect(getCountryName(invalidCode)).toBeUndefined();
  });
});

describe('getCountryByCode', () => {
  test('should return complete country information for valid code', () => {
    const country = getCountryByCode(validCode);
    expect(country).toEqual({
      code: 'US',
      name: 'United States of America',
      alpha3: 'USA',
      callingCode: '+1',
      flag: '🇺🇸'
    });
  });

  test('should handle lowercase country codes', () => {
    const country = getCountryByCode(lowerCaseCode);
    expect(country?.code).toBe('us');
  });

  test('should return undefined for invalid code', () => {
    expect(getCountryByCode(invalidCode)).toBeUndefined();
  });
});

describe('getCallingCode', () => {
  test('should return correct calling code for valid code', () => {
    expect(getCallingCode(validCode)).toBe('+1');
  });

  test('should handle lowercase country codes', () => {
    expect(getCallingCode(lowerCaseCode)).toBe('+1');
  });

  test('should return undefined for invalid code', () => {
    expect(getCallingCode(invalidCode)).toBeUndefined();
  });
});

describe('getAlpha3Code', () => {
  test('should return correct alpha3 code for valid code', () => {
    expect(getAlpha3Code(validCode)).toBe('USA');
  });

  test('should handle lowercase country codes', () => {
    expect(getAlpha3Code(lowerCaseCode)).toBe('USA');
  });

  test('should return undefined for invalid code', () => {
    expect(getAlpha3Code(invalidCode)).toBeUndefined();
  });
});

describe('getCountryFlag', () => {
  test('should return correct flag emoji for valid code', () => {
    expect(getCountryFlag(validCode)).toBe('🇺🇸');
  });

  test('should handle lowercase country codes', () => {
    expect(getCountryFlag(lowerCaseCode)).toBe('🇺🇸');
  });

  test('should return undefined for invalid code', () => {
    expect(getCountryFlag(invalidCode)).toBeUndefined();
  });
});

describe('getAllCountries', () => {
  test('should return array of all countries with complete information', () => {
    const allCountries = getAllCountries();
    
    // Check array properties
    expect(Array.isArray(allCountries)).toBe(true);
    expect(allCountries.length).toBe(Object.keys(countryData).length);
    
    // Check structure of a specific country
    const us = allCountries.find(c => c.code === 'US');
    expect(us).toEqual({
      code: 'US',
      name: 'United States of America',
      alpha3: 'USA',
      callingCode: '+1',
      flag: '🇺🇸'
    });
    
    // Check that all entries have required properties
    allCountries.forEach(country => {
      expect(country).toHaveProperty('code');
      expect(country).toHaveProperty('name');
      expect(country).toHaveProperty('alpha3');
      expect(country).toHaveProperty('callingCode');
      expect(country).toHaveProperty('flag');
    });
  });
});
