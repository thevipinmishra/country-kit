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
