import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  COUNTRY_CODES,
  type CountryCode,
  countries,
  countryCodes,
  countryData,
  countryNames,
  getAllCountries,
  getAlpha3Code,
  getCallingCode,
  getCountriesByCallingCode,
  getCountriesByRegion,
  getCountriesBySubregion,
  getCountry,
  getCountryByAlpha3,
  getCountryByCode,
  getCountryByNumeric,
  getCountryCommonName,
  getCountryFlag,
  getCountryName,
  getDialCode,
  getNumericCode,
  isValidCallingCode,
  isValidCountryCode,
  listRegions,
  listSubregions,
  searchCountries,
} from 'country-kit';
import { describe, expect, test } from 'vitest';

const TEST_DATA = {
  US: {
    code: 'US',
    name: 'United States of America',
    commonName: 'United States',
    alpha3: 'USA',
    numeric: '840',
    callingCode: '+1',
    dialCode: '+1',
    flag: '🇺🇸',
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom of Great Britain and Northern Ireland',
    commonName: 'United Kingdom',
    alpha3: 'GBR',
    numeric: '826',
    callingCode: '+44',
    dialCode: '+44',
    flag: '🇬🇧',
  },
};

describe('Country Data Structure', () => {
  test('data consistency across exports', () => {
    const dataLength = Object.keys(countryData).length;
    expect(countryCodes.length).toBe(dataLength);
    expect(COUNTRY_CODES.length).toBe(dataLength);
    expect(Object.keys(countries).length).toBe(dataLength);
    expect(countryNames.length).toBe(dataLength);
    expect(dataLength).toBe(249);
  });

  test('country data format', () => {
    for (const code of ['US', 'GB']) {
      const data = countryData[code];
      expect(data).toMatchObject({
        name: expect.any(String),
        commonName: expect.any(String),
        alpha3: expect.stringMatching(/^[A-Z]{3}$/),
        numeric: expect.stringMatching(/^\d{3}$/),
        callingCode: expect.stringMatching(/^\+[1-9]\d{0,2}$/),
        flag: expect.any(String),
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
    ['USA', false],
  ])('isValidCountryCode(%s) -> %s', (code, expected) => {
    expect(isValidCountryCode(code)).toBe(expected);
  });
});

describe('Country Information Retrieval', () => {
  test.each(['US', 'GB'])('gets correct data for %s', (code) => {
    const data = TEST_DATA[code as keyof typeof TEST_DATA];
    expect(getCountryName(code as CountryCode)).toBe(data.name);
    expect(getCountryCommonName(code)).toBe(data.commonName);
    expect(getCallingCode(code as CountryCode)).toBe(data.callingCode);
    expect(getDialCode(code)).toBe(data.dialCode);
    expect(getAlpha3Code(code as CountryCode)).toBe(data.alpha3);
    expect(getNumericCode(code)).toBe(data.numeric);
    expect(getCountryFlag(code as CountryCode)).toBe(data.flag);

    expect(getCountryByCode(code as CountryCode)).toMatchObject(data);
  });

  test('handles invalid country code', () => {
    const invalidCode = 'XX' as CountryCode;
    expect(getCountryName(invalidCode)).toBeUndefined();
    expect(getCallingCode(invalidCode)).toBeUndefined();
    expect(getAlpha3Code(invalidCode)).toBeUndefined();
    expect(getCountryFlag(invalidCode)).toBeUndefined();
    expect(getCountryByCode(invalidCode)).toBeUndefined();
  });

  test('looks up by alpha-3, numeric, or mixed identifier', () => {
    expect(getCountryByAlpha3('usa')?.code).toBe('US');
    expect(getCountryByNumeric('840')?.code).toBe('US');
    expect(getCountryByNumeric('4')?.code).toBe('AF');
    expect(getCountry('USA')?.code).toBe('US');
    expect(getCountry('840')?.code).toBe('US');
    expect(getCountry('gb')?.code).toBe('GB');
  });
});

describe('Calling Code Functions', () => {
  test.each([
    ['+1', true],
    ['+44', true],
    ['+123', true],
    ['1', false],
    ['++44', false],
    ['+1234', false],
    ['+12345', false],
    ['', false],
  ])('isValidCallingCode(%s) -> %s', (code, expected) => {
    expect(isValidCallingCode(code)).toBe(expected);
  });

  test('getCountriesByCallingCode returns official E.164 matches', () => {
    const plusOne = getCountriesByCallingCode('+1');
    expect(plusOne.some((c) => c.code === 'US')).toBe(true);
    expect(plusOne.some((c) => c.code === 'CA')).toBe(true);
    expect(plusOne.some((c) => c.code === 'AI')).toBe(true);
    expect(plusOne.every((c) => c.callingCode === '+1')).toBe(true);
    expect(plusOne.length).toBeGreaterThan(20);
  });

  test('NANP area codes are not stored as country calling codes', () => {
    expect(getCallingCode('AI')).toBe('+1');
    expect(getDialCode('AI')).toBe('+1264');
    expect(getCountryByCode('AI')?.nanpAreaCodes).toContain('264');
    expect(
      getCountriesByCallingCode('+1264').some((c) => c.code === 'AI'),
    ).toBe(true);
  });

  test('shared and multi-code territories', () => {
    expect(getCallingCode('KZ')).toBe('+7');
    expect(getCallingCode('RU')).toBe('+7');
    expect(
      getCountriesByCallingCode('+7')
        .map((c) => c.code)
        .sort(),
    ).toEqual(['KZ', 'RU']);
    expect(getCountryByCode('SH')?.callingCodes).toEqual(['+290', '+247']);
    expect(getCountriesByCallingCode('+247').some((c) => c.code === 'SH')).toBe(
      true,
    );
  });

  test('getCountriesByCallingCode handles invalid codes', () => {
    expect(getCountriesByCallingCode('+999')).toEqual([]);
    expect(getCountriesByCallingCode('abc')).toEqual([]);
  });
});

describe('Search Function', () => {
  test('basic search functionality', () => {
    const results = searchCountries('united');
    expect(results.length).toBeGreaterThan(1);
    expect(results.some((c) => c.code === 'US')).toBe(true);
    expect(results.some((c) => c.code === 'GB')).toBe(true);
  });

  test('ranks exact codes and common names first', () => {
    expect(searchCountries('US')[0].code).toBe('US');
    expect(searchCountries('UK')[0].code).toBe('GB');
    expect(searchCountries('Vietnam')[0].code).toBe('VN');
    expect(searchCountries('South Korea')[0].code).toBe('KR');
  });

  test('search options', () => {
    const limitResults = searchCountries('united', { limit: 1 });
    expect(limitResults).toHaveLength(1);

    const exactMatch = searchCountries('United States of America', {
      exact: true,
    });
    expect(exactMatch).toHaveLength(1);
    expect(exactMatch[0].code).toBe('US');

    const exactCommon = searchCountries('United States', { exact: true });
    expect(exactCommon[0].code).toBe('US');

    const withCodes = searchCountries('us', { includeCodes: true });
    expect(withCodes.some((c) => c.code === 'US')).toBe(true);

    const withoutCodes = searchCountries('us', { includeCodes: false });
    expect(withoutCodes.some((c) => c.code === 'US')).toBe(false);
  });

  test.each(['', '   ', undefined, null] as Array<string | undefined | null>)(
    'handles invalid input: %s',
    (input) => {
      expect(searchCountries(input)).toEqual([]);
    },
  );
});

describe('Regions', () => {
  test('groups countries by UN M49 region', () => {
    const regions = getCountriesByRegion();
    expect(Object.keys(regions).sort()).toEqual(listRegions());
    expect(regions.Europe?.length).toBeGreaterThan(40);
    expect(
      getCountriesByRegion('Europe').every((c) => c.region === 'Europe'),
    ).toBe(true);
    expect(
      getCountriesBySubregion('Northern Europe').some((c) => c.code === 'GB'),
    ).toBe(true);
    expect(listSubregions()).toContain('Southern Asia');
  });
});

describe('getAllCountries', () => {
  test('returns complete country list', () => {
    const allCountries = getAllCountries();
    expect(allCountries).toHaveLength(countryCodes.length);
    expect(allCountries[0]).toMatchObject({
      code: expect.any(String),
      name: expect.any(String),
      commonName: expect.any(String),
      alpha3: expect.stringMatching(/^[A-Z]{3}$/),
      numeric: expect.stringMatching(/^\d{3}$/),
      callingCode: expect.stringMatching(/^\+[1-9]\d{0,2}$/),
      flag: expect.any(String),
    });
  });
});

describe('ISO 3166-1 accuracy', () => {
  const source = JSON.parse(
    readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        '../scripts/sources/iso-3166-1.json',
      ),
      'utf8',
    ),
  ) as Array<{
    name: string;
    'alpha-2': string;
    'alpha-3': string;
    'country-code': string;
    region: string;
    'sub-region': string;
  }>;

  test('matches the official assigned ISO 3166-1 set', () => {
    expect(source).toHaveLength(249);
    const byCode = new Map(getAllCountries().map((c) => [c.code, c]));

    for (const row of source) {
      const country = byCode.get(row['alpha-2'] as CountryCode);
      expect(country, row['alpha-2']).toBeDefined();
      expect(country?.name).toBe(row.name);
      expect(country?.alpha3).toBe(row['alpha-3']);
      expect(country?.numeric).toBe(
        String(row['country-code']).padStart(3, '0'),
      );
      expect(country?.region).toBe(row.region || null);
      expect(country?.subregion).toBe(row['sub-region'] || null);
    }
  });
});
