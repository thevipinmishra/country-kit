import { countryCodes, countryData } from ".";
import { Country, CountryCode } from "./types";

/**
 * Validates if the provided string is a valid ISO 3166-1 alpha-2 country code
 * @param {string} code - The country code to validate (case insensitive)
 * @returns {boolean} Returns true if the code is a valid ISO 3166-1 alpha-2 country code, false otherwise
 * @example
 * isValidCountryCode('US') // returns true
 * isValidCountryCode('XX') // returns false
 * isValidCountryCode('') // returns false
 */
export const isValidCountryCode = (code: string): boolean => {
  if (!code || typeof code !== 'string') return false;
  return countryCodes.includes(code.toUpperCase());
};

// Helper function to create flag emoji from country code
/**
 * Creates a flag emoji from a two-letter country code using Unicode regional indicator symbols
 * @param {string} code - Two-letter country code (case insensitive)
 * @returns {string} Unicode flag emoji representation
 * @example
 * getFlag('US') // returns '🇺🇸'
 * getFlag('gb') // returns '🇬🇧'
 */
export const getFlag = (code: string): string => {
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  /**
 * Retrieves the country name for a given ISO 3166-1 alpha-2 country code
 * @param {CountryCode} code - The ISO 3166-1 alpha-2 country code (case insensitive)
 * @returns {string | undefined} The country name if found, undefined if the code is invalid
 * @example
 * getCountryName('US') // returns 'United States'
 * getCountryName('GB') // returns 'United Kingdom'
 * getCountryName('XX') // returns undefined and logs error
 */
export const getCountryName = (code: CountryCode): string | undefined => {
  if (!isValidCountryCode(code)) {
    console.error(`Invalid country code: ${code}`);
    return undefined;
  }
  return countryData[code.toUpperCase()].name;
};

/**
 * Retrieves complete country information for a given ISO 3166-1 alpha-2 country code
 * @param {CountryCode} code - The ISO 3166-1 alpha-2 country code (case insensitive)
 * @returns {Country | undefined} Object containing country information if found, undefined if the code is invalid
 * @example
 * getCountryByCode('US')
 * // returns {
 * //   code: 'US',
 * //   name: 'United States',
 * //   alpha3: 'USA',
 * //   callingCode: '+1',
 * //   flag: '🇺🇸'
 * // }
 */
export const getCountryByCode = (code: CountryCode): Country | undefined => {
  if (!isValidCountryCode(code)) {
    console.error(`Invalid country code: ${code}`);
    return undefined;
  }
  const upperCode = code.toUpperCase() as CountryCode;
  const data = countryData[upperCode];
  
  if (!data) return undefined;
  
  return {
    code: upperCode,
    name: data.name,
    alpha3: data.alpha3,
    callingCode: data.callingCode,
    flag: data.flag
  };
};

/**
 * Search options for country search
 */
export interface CountrySearchOptions {
  /** Maximum number of results to return */
  limit?: number;
  /** Whether to match exactly (default: false) */
  exact?: boolean;
  /** Whether to search by country codes (alpha-2, alpha-3) as well (default: true) */
  includeCodes?: boolean;
}

/**
 * Searches for countries by name or code using a case-insensitive match
 * @param {string} query - Search query string to match against country names and codes
 * @param {CountrySearchOptions} options - Search configuration options
 * @returns {Country[]} Array of country objects matching the search query
 * @example
 * searchCountries('united') // returns countries with 'united' in their name
 * searchCountries('us', { includeCodes: true }) // returns United States
 * searchCountries('united', { exact: true }) // returns exact matches only
 * searchCountries('united', { limit: 2 }) // returns max 2 results
 */
export const searchCountries = (
  query?: string | null,
  options: CountrySearchOptions = {}
): Country[] => {
  if (!query?.trim()) return [];

  const {
    limit,
    exact = false,
    includeCodes = true
  } = options;

  const normalizedQuery = query.toLowerCase().trim();
  const allCountries = getAllCountries();
  const matches = new Set<Country>();

  for (const country of allCountries) {
    if (matches.size === limit) break;

    if (exact) {
      if (country.name.toLowerCase() === normalizedQuery) {
        matches.add(country);
      } else if (includeCodes && (
        country.code.toLowerCase() === normalizedQuery ||
        country.alpha3.toLowerCase() === normalizedQuery
      )) {
        matches.add(country);
      }
      continue;
    }

    if (country.name.toLowerCase().includes(normalizedQuery)) {
      matches.add(country);
    } else if (includeCodes && (
      country.code.toLowerCase().includes(normalizedQuery) ||
      country.alpha3.toLowerCase().includes(normalizedQuery)
    )) {
      matches.add(country);
    }
  }

  return Array.from(matches);
};

/**
 * Retrieves the international calling code for a given country code
 * @param {CountryCode} code - The ISO 3166-1 alpha-2 country code (case insensitive)
 * @returns {string | undefined} The calling code with '+' prefix if found, undefined if the code is invalid
 * @example
 * getCallingCode('US') // returns '+1'
 * getCallingCode('GB') // returns '+44'
 * getCallingCode('XX') // returns undefined and logs error
 */
export const getCallingCode = (code: CountryCode): string | undefined => {
  if (!isValidCountryCode(code)) {
    console.error(`Invalid country code: ${code}`);
    return undefined;
  }
  return countryData[code.toUpperCase()]?.callingCode;
};
  
  /**
   * Retrieves the ISO 3166-1 alpha-3 code for a given alpha-2 country code
   * @param {CountryCode} code - The ISO 3166-1 alpha-2 country code (case insensitive)
   * @returns {string | undefined} The ISO 3166-1 alpha-3 code if found, undefined if the code is invalid
   * @example
   * getAlpha3Code('US') // returns 'USA'
   * getAlpha3Code('GB') // returns 'GBR'
   * getAlpha3Code('XX') // returns undefined and logs error
   */
  export const getAlpha3Code = (code: CountryCode): string | undefined => {
    if (!isValidCountryCode(code)) {
      console.error(`Invalid country code: ${code}`);
      return undefined;
    }
    return countryData[code.toUpperCase()]?.alpha3;
  };
  
  /**
   * Retrieves the flag emoji for a given country code
   * @param {CountryCode} code - The ISO 3166-1 alpha-2 country code (case insensitive)
   * @returns {string | undefined} Unicode flag emoji if found, undefined if the code is invalid
   * @example
   * getCountryFlag('US') // returns '🇺🇸'
   * getCountryFlag('GB') // returns '🇬🇧'
   * getCountryFlag('XX') // returns undefined and logs error
   */
  export const getCountryFlag = (code: CountryCode): string | undefined => {
    if (!isValidCountryCode(code)) {
      console.error(`Invalid country code: ${code}`);
      return undefined;
    }
    return countryData[code.toUpperCase()]?.flag;
  };
  
  /**
   * Retrieves an array of all available countries with their complete information
   * @returns {Country[]} Array of country objects containing complete information for all supported countries
   * @example
   * getAllCountries()
   * // returns [
   * //   {
   * //     code: 'AD',
   * //     name: 'Andorra',
   * //     alpha3: 'AND',
   * //     callingCode: '+376',
   * //     flag: '🇦🇩'
   * //   },
   * //   ...
   * // ]
   */
  export const getAllCountries = (): Country[] => 
    countryCodes.map(code => ({
      code,
      ...countryData[code]
    }));

/**
 * Groups all countries by their geographical region/continent
 * @returns {Record<string, Country[]>} Object with region names as keys and arrays of countries as values
 * @example
 * getCountriesByRegion()
 * // returns {
 * //   'Europe': [{ code: 'AD', name: 'Andorra', ... }, ...],
 * //   'Asia': [{ code: 'AF', name: 'Afghanistan', ... }, ...],
 * //   ...
 * // }
 * @todo Implementation pending - requires additional region data
 */
export const getCountriesByRegion = (): Record<string, Country[]> => {
  // Implementation would require adding region data to countryData
  // This is a placeholder for suggested functionality
  return {};
};

/**
 * Validates if a string matches the format of an international calling code
 * @param {string} callingCode - The calling code to validate (must start with '+' followed by 1-4 digits)
 * @returns {boolean} True if the calling code format is valid, false otherwise
 * @example
 * isValidCallingCode('+1') // returns true
 * isValidCallingCode('+44') // returns true
 * isValidCallingCode('44') // returns false
 * isValidCallingCode('+12345') // returns false
 */
export const isValidCallingCode = (callingCode: string): boolean => {
  return /^\+\d{1,4}$/.test(callingCode);
};

/**
 * Finds all countries that share a specific calling code
 * @param {string} callingCode - The calling code to search for (must include '+' prefix)
 * @returns {Country[]} Array of countries that use the specified calling code
 * @example
 * getCountriesByCallingCode('+1')
 * // returns [
 * //   { code: 'US', name: 'United States', ... },
 * //   { code: 'CA', name: 'Canada', ... },
 * //   ...
 * // ]
 */
export const getCountriesByCallingCode = (callingCode: string): Country[] => {
  if (!isValidCallingCode(callingCode)) return [];
  
  return getAllCountries().filter(country => 
    country.callingCode === callingCode
  );
};