import { countryCodes, countryData } from ".";
import { Country, CountryCode } from "./types";

// Helper function to create flag emoji from country code
export const getFlag = (code: string): string => {
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  /**
 * Gets the country name for a given country code
 * @param {CountryCode} code - The ISO 3166-1 alpha-2 country code
 * @returns {string | undefined} The country name if found, undefined otherwise
 * @example
 * getCountryName('US') // returns 'United States of America'
 * getCountryName('GB') // returns 'United Kingdom of Great Britain and Northern Ireland'
 */
export const getCountryName = (code: CountryCode): string | undefined => 
    countryData[code.toUpperCase()]?.name;

/**
 * Gets the complete country information for a given country code
 * @param {CountryCode} code - The ISO 3166-1 alpha-2 country code
 * @returns {Country | undefined} An object containing the country's code, name, alpha3 code, calling code, and flag if found, undefined otherwise
 * @example
 * getCountryByCode('US')
 * // returns { 
 * //   code: 'US',
 * //   name: 'United States of America',
 * //   alpha3: 'USA',
 * //   callingCode: '+1',
 * //   flag: '🇺🇸'
 * // }
 */
export const getCountryByCode = (code: CountryCode): Country | undefined => {
    const data = countryData[code.toUpperCase()];
    if (!data) return undefined;
    
    return {
      code,
      name: data.name,
      alpha3: data.alpha3,
      callingCode: data.callingCode,
      flag: data.flag
    };
  };
  
  /**
   * Gets the calling code for a given country code
   * @param {CountryCode} code - The ISO 3166-1 alpha-2 country code
   * @returns {string | undefined} The calling code (with + prefix) if found, undefined otherwise
   * @example
   * getCallingCode('US') // returns '+1'
   * getCallingCode('GB') // returns '+44'
   */
  export const getCallingCode = (code: CountryCode): string | undefined => 
    countryData[code.toUpperCase()]?.callingCode;
  
  /**
   * Gets the ISO 3166-1 alpha-3 code for a given country code
   * @param {CountryCode} code - The ISO 3166-1 alpha-2 country code
   * @returns {string | undefined} The alpha-3 code if found, undefined otherwise
   * @example
   * getAlpha3Code('US') // returns 'USA'
   * getAlpha3Code('GB') // returns 'GBR'
   */
  export const getAlpha3Code = (code: CountryCode): string | undefined => 
    countryData[code.toUpperCase()]?.alpha3;
  
  /**
   * Gets the flag emoji for a given country code
   * @param {CountryCode} code - The ISO 3166-1 alpha-2 country code
   * @returns {string | undefined} The flag emoji if found, undefined otherwise
   * @example
   * getCountryFlag('US') // returns '🇺🇸'
   * getCountryFlag('GB') // returns '🇬🇧'
   */
  export const getCountryFlag = (code: CountryCode): string | undefined => 
    countryData[code.toUpperCase()]?.flag;
  
  /**
   * Gets an array of all countries with their complete information
   * @returns {Country[]} An array of country objects containing code, name, alpha3 code, calling code, and flag
   * @example
   * getAllCountries()
   * // returns [
   * //   { code: 'AD', name: 'Andorra', alpha3: 'AND', callingCode: '+376', flag: '🇦🇩' },
   * //   { code: 'AE', name: 'United Arab Emirates', alpha3: 'ARE', callingCode: '+971', flag: '🇦🇪' },
   * //   ...
   * // ]
   */
  export const getAllCountries = (): Country[] => 
    countryCodes.map(code => ({
      code,
      ...countryData[code]
    }));