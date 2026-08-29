import {
  allCountries,
  countriesByAlpha2,
  countriesByAlpha3,
  countriesByNumeric,
  countryCodeSet,
  countryData,
} from './data';
import { buildFlagUrl, type FlagUrlOptions } from './flag-urls';
import { getFlag as buildFlag } from './flags';
import type {
  Country,
  CountryCode,
  CountryListOptions,
  CountrySearchOptions,
  CountrySelectOption,
} from './types';

const CALLING_CODE_PATTERN = /^\+[1-9]\d{0,2}$/;

const normalizeCode = (value: string): string => value.trim().toUpperCase();

const normalizeNumeric = (value: string): string => {
  const digits = value.trim();
  if (!/^\d{1,3}$/.test(digits)) return '';
  return digits.padStart(3, '0');
};

/**
 * Type guard for assigned ISO 3166-1 alpha-2 codes.
 */
export const isValidCountryCode = (code: string): code is CountryCode => {
  if (!code || typeof code !== 'string') return false;
  return countryCodeSet.has(normalizeCode(code));
};

/**
 * Returns the ISO 3166-1 English short name for an alpha-2 code.
 */
export const getCountryName = (code: string): string | undefined => {
  return countryData[normalizeCode(code)]?.name;
};

/**
 * Returns the everyday English name for an alpha-2 code.
 */
export const getCountryCommonName = (code: string): string | undefined => {
  return countryData[normalizeCode(code)]?.commonName;
};

/**
 * Returns complete country information for an ISO 3166-1 alpha-2 code.
 */
export const getCountryByCode = (code: string): Country | undefined => {
  return countriesByAlpha2.get(normalizeCode(code) as CountryCode);
};

/**
 * Returns complete country information for an ISO 3166-1 alpha-3 code.
 */
export const getCountryByAlpha3 = (alpha3: string): Country | undefined => {
  if (!alpha3 || typeof alpha3 !== 'string') return undefined;
  return countriesByAlpha3.get(normalizeCode(alpha3));
};

/**
 * Returns complete country information for an ISO 3166-1 numeric / UN M49 code.
 * Accepts `"840"`, `"084"`, or `"84"`.
 */
export const getCountryByNumeric = (numeric: string): Country | undefined => {
  if (!numeric || typeof numeric !== 'string') return undefined;
  const padded = normalizeNumeric(numeric);
  if (!padded) return undefined;
  return countriesByNumeric.get(padded);
};

/**
 * Looks up a country by alpha-2, alpha-3, or numeric code.
 */
export const getCountry = (id: string): Country | undefined => {
  if (!id || typeof id !== 'string') return undefined;
  const trimmed = id.trim();
  return (
    getCountryByCode(trimmed) ??
    getCountryByAlpha3(trimmed) ??
    getCountryByNumeric(trimmed)
  );
};

/**
 * Returns the ITU-T E.164 country calling code (for NANP this is always `+1`).
 */
export const getCallingCode = (code: string): string | undefined => {
  return countryData[normalizeCode(code)]?.callingCode;
};

/**
 * Returns the practical international prefix for phone inputs.
 * NANP territories include the primary area code (e.g. Anguilla `+1264`).
 */
export const getDialCode = (code: string): string | undefined => {
  return countryData[normalizeCode(code)]?.dialCode;
};

/**
 * Returns the ISO 3166-1 alpha-3 code for an alpha-2 code.
 */
export const getAlpha3Code = (code: string): string | undefined => {
  return countryData[normalizeCode(code)]?.alpha3;
};

/**
 * Returns the ISO 3166-1 numeric code for an alpha-2 code.
 */
export const getNumericCode = (code: string): string | undefined => {
  return countryData[normalizeCode(code)]?.numeric;
};

/**
 * Returns the flag emoji for an assigned ISO 3166-1 alpha-2 code.
 */
export const getCountryFlag = (code: string): string | undefined => {
  const upper = normalizeCode(code);
  if (!countryCodeSet.has(upper)) return undefined;
  return countryData[upper]?.flag ?? buildFlag(upper);
};

/**
 * CDN URL for the Wikipedia/Wikimedia SVG flag (flag-icons, MIT).
 */
export const getFlagSvgUrl = (
  code: string,
  options?: FlagUrlOptions,
): string | undefined => {
  if (!isValidCountryCode(code)) return undefined;
  return buildFlagUrl(code, options);
};

const sortCountries = (
  list: Country[],
  sortBy: CountryListOptions['sortBy'] = 'commonName',
): Country[] => {
  const key = sortBy;
  return list.sort((a, b) => {
    const left = a[key] ?? '';
    const right = b[key] ?? '';
    return String(left).localeCompare(String(right));
  });
};

const filterCountries = (
  list: readonly Country[],
  options: CountryListOptions = {},
): Country[] => {
  const region = options.region?.toLowerCase().trim();
  const subregion = options.subregion?.toLowerCase().trim();
  const filtered = list.filter((country) => {
    if (region && country.region?.toLowerCase() !== region) return false;
    if (subregion && country.subregion?.toLowerCase() !== subregion)
      return false;
    if (
      typeof options.independent === 'boolean' &&
      country.independent !== options.independent
    ) {
      return false;
    }
    return true;
  });
  return sortCountries(filtered, options.sortBy);
};

/**
 * Returns assigned ISO 3166-1 countries, optionally filtered and sorted.
 */
export function getAllCountries(): Country[];
export function getAllCountries(options: CountryListOptions): Country[];
export function getAllCountries(options?: CountryListOptions): Country[] {
  if (!options) return allCountries.slice();
  return filterCountries(allCountries, options);
}

export const getIndependentCountries = (): Country[] =>
  getAllCountries({ independent: true });

export const getCountryTld = (code: string): string | null | undefined => {
  const data = countryData[normalizeCode(code)];
  return data ? data.tld : undefined;
};

export const getCountryCapital = (code: string): string | null | undefined => {
  const data = countryData[normalizeCode(code)];
  return data ? data.capital : undefined;
};

export const getCountryCurrencies = (
  code: string,
): readonly string[] | undefined => {
  return countryData[normalizeCode(code)]?.currencies;
};

const normalizeTld = (tld: string): string => {
  const trimmed = tld.trim().toLowerCase();
  if (!trimmed) return '';
  return trimmed.startsWith('.') ? trimmed : `.${trimmed}`;
};

/**
 * Looks up a country by IANA country-code TLD (`".uk"`, `"uk"`, or `".UK"`).
 * The United Kingdom is `.uk`, not `.gb`.
 */
export const getCountryByTld = (tld: string): Country | undefined => {
  if (!tld || typeof tld !== 'string') return undefined;
  const needle = normalizeTld(tld);
  if (!needle) return undefined;
  return allCountries.find((country) => country.tld === needle);
};

/**
 * Countries that use an ISO 4217 alphabetic currency code.
 */
export const getCountriesByCurrency = (currency: string): Country[] => {
  if (!currency || typeof currency !== 'string') return [];
  const needle = currency.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(needle)) return [];
  return allCountries.filter((country) => country.currencies.includes(needle));
};

export const listCurrencies = (): string[] => {
  return Array.from(
    new Set(allCountries.flatMap((country) => [...country.currencies])),
  ).sort();
};

/**
 * Ready-made `<select>` options: flag emoji, common name, and dial prefix.
 */
export const getCountrySelectOptions = (
  options?: CountryListOptions,
): CountrySelectOption[] => {
  return getAllCountries(options ?? { sortBy: 'commonName' }).map(
    (country) => ({
      value: country.code,
      label: `${country.flag} ${country.commonName}`,
      dialCode: country.dialCode,
      flag: country.flag,
      flagSvgUrl: buildFlagUrl(country.code),
    }),
  );
};

const scoreCountry = (
  country: Country,
  query: string,
  includeCodes: boolean,
): number => {
  const name = country.name.toLowerCase();
  const common = country.commonName.toLowerCase();
  const record = countryData[country.code];
  const aliases = record?.aliases ?? [];

  if (includeCodes) {
    if (country.code.toLowerCase() === query) return 100;
    if (country.alpha3.toLowerCase() === query) return 95;
    if (
      country.numeric === query ||
      country.numeric.replace(/^0+/, '') === query
    ) {
      return 90;
    }
    if (
      country.callingCode.replace('+', '') === query ||
      country.callingCode.toLowerCase() === query
    ) {
      return 88;
    }
    if (
      country.dialCode.replace('+', '') === query ||
      country.dialCode.toLowerCase() === query
    ) {
      return 87;
    }
  }

  if (country.tld) {
    const tld = country.tld.toLowerCase();
    if (query === tld) return 92;
    if (query.length > 2 && query === tld.slice(1)) return 92;
  }

  if (common === query || name === query) return 80;
  if (aliases.includes(query)) return 75;
  if (country.currencies.some((currency) => currency.toLowerCase() === query)) {
    return 72;
  }
  if (country.capital?.toLowerCase() === query) return 70;
  if (common.startsWith(query) || name.startsWith(query)) return 60;
  if (country.capital?.toLowerCase().startsWith(query)) return 55;
  if (common.includes(query) || name.includes(query)) return 40;
  if (query.length >= 3 && aliases.some((alias) => alias.includes(query)))
    return 35;
  if (query.length >= 3 && country.capital?.toLowerCase().includes(query))
    return 32;

  if (includeCodes) {
    if (
      country.code.toLowerCase().includes(query) ||
      country.alpha3.toLowerCase().includes(query)
    ) {
      return 30;
    }
  }

  return 0;
};

/**
 * Searches countries by official name, common name, aliases, and optionally codes.
 * Results are ranked so exact code / name matches appear first.
 */
export const searchCountries = (
  query?: string | null,
  options: CountrySearchOptions = {},
): Country[] => {
  if (!query?.trim()) return [];

  const { limit, exact = false, includeCodes = true } = options;
  const normalizedQuery = query.toLowerCase().trim();

  const scored = allCountries
    .map((country) => ({
      country,
      score: scoreCountry(country, normalizedQuery, includeCodes),
    }))
    .filter(({ country, score }) => {
      if (score === 0) return false;
      if (!exact) return true;
      return (
        country.name.toLowerCase() === normalizedQuery ||
        country.commonName.toLowerCase() === normalizedQuery ||
        (includeCodes &&
          (country.code.toLowerCase() === normalizedQuery ||
            country.alpha3.toLowerCase() === normalizedQuery ||
            country.numeric === normalizedQuery))
      );
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.country.commonName.localeCompare(b.country.commonName),
    );

  const matches = scored.map(({ country }) => country);
  return typeof limit === 'number' ? matches.slice(0, limit) : matches;
};

/**
 * Validates the format of an ITU-T E.164 country calling code (`+` plus 1–3 digits).
 * This does not check whether the code is assigned; use {@link getCountriesByCallingCode}.
 */
export const isValidCallingCode = (callingCode: string): boolean => {
  return CALLING_CODE_PATTERN.test(callingCode);
};

const normalizeCallingQuery = (value: string): string | undefined => {
  if (!value || typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  const withPlus = trimmed.startsWith('+') ? trimmed : `+${trimmed}`;
  if (!/^\+\d{1,4}$/.test(withPlus)) return undefined;
  return withPlus;
};

/**
 * Finds countries that use an E.164 country calling code.
 * NANP lookups accept both `+1` and a composite such as `+1264` (Anguilla).
 */
export const getCountriesByCallingCode = (callingCode: string): Country[] => {
  const normalized = normalizeCallingQuery(callingCode);
  if (!normalized) return [];

  return allCountries.filter((country) => {
    if (country.callingCodes.includes(normalized)) return true;
    if (
      normalized.startsWith('+1') &&
      normalized.length === 5 &&
      country.nanpAreaCodes?.includes(normalized.slice(2))
    ) {
      return true;
    }
    return false;
  });
};

export function getCountriesByRegion(): Record<string, Country[]>;
export function getCountriesByRegion(region: string): Country[];
export function getCountriesByRegion(
  region?: string,
): Record<string, Country[]> | Country[] {
  if (typeof region === 'string') {
    const needle = region.toLowerCase().trim();
    return allCountries.filter(
      (country) => country.region?.toLowerCase() === needle,
    );
  }

  const grouped: Record<string, Country[]> = {};
  for (const country of allCountries) {
    if (!country.region) continue;
    grouped[country.region] ??= [];
    grouped[country.region].push(country);
  }
  return grouped;
}

export function getCountriesBySubregion(subregion: string): Country[] {
  const needle = subregion.toLowerCase().trim();
  return allCountries.filter(
    (country) => country.subregion?.toLowerCase() === needle,
  );
}

export const listRegions = (): string[] => {
  return Array.from(
    new Set(
      allCountries
        .map((country) => country.region)
        .filter((r): r is string => Boolean(r)),
    ),
  ).sort();
};

export const listSubregions = (): string[] => {
  return Array.from(
    new Set(
      allCountries
        .map((country) => country.subregion)
        .filter((r): r is string => Boolean(r)),
    ),
  ).sort();
};
