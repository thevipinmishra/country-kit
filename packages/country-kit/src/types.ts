export type CountryCode = string; // ISO 3166-1 alpha-2 code

export interface Country {
  /** ISO 3166-1 alpha-2 code */
  code: CountryCode;
  /** Official country name */
  name: string;
  /** ISO 3166-1 alpha-3 code */
  alpha3: string;
  /** International calling code (with + prefix) */
  callingCode: string;
  /** Unicode flag emoji */
  flag: string;
}

export interface CountryData {
  /** Official country name */
  name: string;
  /** ISO 3166-1 alpha-3 code */
  alpha3: string;
  /** International calling code (with + prefix) */
  callingCode: string;
  /** Unicode flag emoji */
  flag: string;
}

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