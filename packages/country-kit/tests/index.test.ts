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
  FLAG_ICONS_VERSION,
  getAllCountries,
  getAlpha3Code,
  getCallingCode,
  getCountriesByCallingCode,
  getCountriesByCurrency,
  getCountriesByRegion,
  getCountriesBySubregion,
  getCountry,
  getCountryByAlpha3,
  getCountryByCode,
  getCountryByNumeric,
  getCountryByTld,
  getCountryCapital,
  getCountryCommonName,
  getCountryCurrencies,
  getCountryFlag,
  getCountryName,
  getCountrySelectOptions,
  getCountryTld,
  getDialCode,
  getFlag,
  getFlagSvgUrl,
  getIndependentCountries,
  getNumericCode,
  isValidCallingCode,
  isValidCountryCode,
  listCurrencies,
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
    expect(searchCountries('.uk')[0].code).toBe('GB');
    expect(searchCountries('TRY')[0].code).toBe('TR');
    expect(searchCountries('Paris')[0].code).toBe('FR');
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

describe('Official extras', () => {
  test('IANA TLD, independence, capital, and ISO 4217 currency', () => {
    expect(getCountryTld('GB')).toBe('.uk');
    expect(getCountryTld('US')).toBe('.us');
    expect(getCountryCapital('FR')).toBe('Paris');
    expect(getCountryCurrencies('JP')).toEqual(['JPY']);
    expect(getCountryByCode('US')?.independent).toBe(true);
    expect(getCountryByCode('PR')?.independent).toBe(false);
    expect(getIndependentCountries()).toHaveLength(195);
    expect(getIndependentCountries().every((c) => c.independent)).toBe(true);
    expect(getCountryCurrencies('TR')).toEqual(['TRY']);
    expect(getCountryCapital('KZ')).toBe('Astana');
    expect(getCountryTld('BL')).toBe('.bl');
    expect(getCountryTld('MF')).toBe('.mf');
    expect(getCountryByTld('.uk')?.code).toBe('GB');
    expect(getCountryByTld('uk')?.code).toBe('GB');
    expect(getCountryByTld('.bl')?.code).toBe('BL');
    expect(getCountriesByCurrency('EUR').length).toBeGreaterThan(20);
    expect(getCountriesByCurrency('usd').some((c) => c.code === 'US')).toBe(
      true,
    );
    expect(listCurrencies()).toContain('JPY');
  });

  test('getAllCountries filters and select options', () => {
    const europe = getAllCountries({ region: 'Europe' });
    expect(europe.every((c) => c.region === 'Europe')).toBe(true);
    expect(europe.length).toBeGreaterThan(40);

    const options = getCountrySelectOptions({ independent: true });
    expect(options[0]).toMatchObject({
      value: expect.any(String),
      label: expect.stringMatching(/./),
      dialCode: expect.stringMatching(/^\+/),
      flagSvgUrl: expect.stringContaining('.svg'),
    });
    expect(options).toHaveLength(195);
  });
});

describe('SVG flags', () => {
  test('CDN URLs are version-pinned Wikipedia SVGs', () => {
    expect(getFlagSvgUrl('US')).toBe(
      'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.5.0/flags/4x3/us.svg',
    );
    expect(getFlagSvgUrl('gb', { ratio: '1x1' })).toContain(
      '/flags/1x1/gb.svg',
    );
    expect(getFlagSvgUrl('XX')).toBeUndefined();
  });

  test('inline SVG markup is an official 4×3 flag', async () => {
    const { getFlagSvg } = await import('country-kit/flags');
    const svg = getFlagSvg('JP');
    expect(svg).toMatch(/^<svg /);
    expect(svg).toContain('viewBox');
    expect(getFlagSvg('xx')).toBeUndefined();
    expect(getFlagSvg('')).toBeUndefined();
  });
});

describe('Edge cases', () => {
  test('getFlag and FLAG_ICONS_VERSION', () => {
    expect(getFlag('US')).toBe('🇺🇸');
    expect(getFlag('jp')).toBe(getCountryFlag('JP'));
    expect(FLAG_ICONS_VERSION).toBe('7.5.0');
  });

  test('getFlagSvgUrl accepts flagcdn', () => {
    expect(getFlagSvgUrl('US', { source: 'flagcdn' })).toBe(
      'https://flagcdn.com/us.svg',
    );
    expect(getFlagSvgUrl('US', { source: 'flagcdn', ratio: '1x1' })).toBe(
      'https://flagcdn.com/w160/us.png',
    );
  });

  test('lookups trim whitespace and reject empty input', () => {
    expect(getCountry('  us  ')?.code).toBe('US');
    expect(getCountryByAlpha3(' usa ')?.code).toBe('US');
    expect(isValidCountryCode('  gb  ')).toBe(true);
    expect(getCountry('')).toBeUndefined();
    expect(getCountryByAlpha3('')).toBeUndefined();
    expect(getCountryByNumeric('')).toBeUndefined();
    expect(getCountryName('XX')).toBeUndefined();
    expect(getCountryTld('XX')).toBeUndefined();
    expect(getCountryCapital('XX')).toBeUndefined();
    expect(getCountryCurrencies('XX')).toBeUndefined();
    expect(getDialCode('XX')).toBeUndefined();
  });

  test('TLD lookup edges', () => {
    expect(getCountryByTld('  .UK  ')?.code).toBe('GB');
    expect(getCountryByTld('.gb')).toBeUndefined();
    expect(getCountryByTld('')).toBeUndefined();
    expect(getCountryByTld('...')).toBeUndefined();
  });

  test('currency and calling-code edges', () => {
    expect(getCountriesByCurrency('')).toEqual([]);
    expect(getCountriesByCurrency('US')).toEqual([]);
    expect(getCountriesByCurrency('euro')).toEqual([]);
    expect(getCountriesByCallingCode('44').some((c) => c.code === 'GB')).toBe(
      true,
    );
    expect(getCountriesByCallingCode('+')).toEqual([]);
    expect(getCountriesBySubregion('Atlantis')).toEqual([]);
    expect(getCountriesByRegion('Atlantis')).toEqual([]);
  });

  test('Antarctica, Taiwan, and Palestine special cases', () => {
    expect(getCountry('AQ')?.region).toBeNull();
    expect(getCountry('TW')?.region).toBeNull();
    expect(getCountry('AQ')?.currencies).toEqual([]);
    expect(getCountry('PS')?.currencies).toEqual([]);
    expect(getCountry('AQ')?.independent).toBe(false);
  });

  test('getAllCountries filters, sorts, and copies', () => {
    const copy = getAllCountries();
    copy.pop();
    expect(getAllCountries()).toHaveLength(249);

    const byCode = getAllCountries({ sortBy: 'code' });
    expect(byCode[0].code).toBe('AD');

    const territories = getAllCountries({ independent: false });
    expect(territories.every((c) => !c.independent)).toBe(true);
    expect(territories.some((c) => c.code === 'PR')).toBe(true);

    const northern = getAllCountries({ subregion: 'Northern Europe' });
    expect(northern.some((c) => c.code === 'GB')).toBe(true);
    expect(northern.every((c) => c.subregion === 'Northern Europe')).toBe(true);
  });

  test('searchCountries exact and includeCodes', () => {
    expect(searchCountries('US', { exact: true })[0].code).toBe('US');
    expect(searchCountries('united', { exact: true })).toEqual([]);
    expect(searchCountries('USA', { exact: true })[0].code).toBe('US');
    expect(listRegions()).toEqual([
      'Africa',
      'Americas',
      'Asia',
      'Europe',
      'Oceania',
    ]);
    expect(countries.US).toBe(getCountryName('US'));
    expect(getCountrySelectOptions()[0].value).toMatch(/^[A-Z]{2}$/);
  });
});
