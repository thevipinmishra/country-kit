import { COUNTRY_CODES, type CountryCode } from './country-code';
import countriesJson from './data/countries.json';
import { getFlag } from './flags';
import type { Country, CountryData, CountryRecord } from './types';

const records = countriesJson as CountryRecord[];

export const toDialCode = (
  record: Pick<CountryRecord, 'callingCode' | 'nanpAreaCodes'>,
): string => {
  const npa = record.nanpAreaCodes?.[0];
  return npa ? `${record.callingCode}${npa}` : record.callingCode;
};

export const toCountry = (record: CountryRecord): Country => ({
  code: record.code,
  name: record.name,
  commonName: record.commonName,
  alpha3: record.alpha3,
  numeric: record.numeric,
  callingCode: record.callingCode,
  callingCodes: record.callingCodes,
  dialCode: toDialCode(record),
  region: record.region,
  subregion: record.subregion,
  flag: getFlag(record.code),
  ...(record.nanpAreaCodes ? { nanpAreaCodes: record.nanpAreaCodes } : {}),
});

export const countryRecords: readonly CountryRecord[] = records;

export const countryData: { [key: string]: CountryData } = Object.fromEntries(
  records.map((record) => [
    record.code,
    {
      name: record.name,
      commonName: record.commonName,
      alpha3: record.alpha3,
      numeric: record.numeric,
      callingCode: record.callingCode,
      callingCodes: record.callingCodes,
      dialCode: toDialCode(record),
      region: record.region,
      subregion: record.subregion,
      flag: getFlag(record.code),
      aliases: record.aliases,
      ...(record.nanpAreaCodes ? { nanpAreaCodes: record.nanpAreaCodes } : {}),
    },
  ]),
);

/** @deprecated Use getCountryName / getAllCountries. Kept for backwards compatibility. */
export const countries: { [key: string]: string } = Object.fromEntries(
  records.map((record) => [record.code, record.name]),
);

export const countryCodes: readonly string[] = COUNTRY_CODES;
export const countryNames: readonly string[] = records.map(
  (record) => record.name,
);

export const countryCodeSet = new Set<string>(COUNTRY_CODES);

export const allCountries: readonly Country[] = records.map(toCountry);

export const countriesByAlpha2 = new Map<CountryCode, Country>(
  allCountries.map((country) => [country.code, country]),
);

export const countriesByAlpha3 = new Map<string, Country>(
  allCountries.map((country) => [country.alpha3, country]),
);

export const countriesByNumeric = new Map<string, Country>(
  allCountries.map((country) => [country.numeric, country]),
);
