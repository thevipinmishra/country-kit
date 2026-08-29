import type { CountryCode } from './country-code';

export type { CountryCode };

/** ISO 3166-1 / UN M49 region name, or null when the UN does not assign one. */
export type CountryRegion =
  | 'Africa'
  | 'Americas'
  | 'Asia'
  | 'Europe'
  | 'Oceania'
  | (string & {});

export interface Country {
  /** ISO 3166-1 alpha-2 code */
  code: CountryCode;
  /** ISO 3166-1 English short name (official) */
  name: string;
  /** Everyday English name for UI labels */
  commonName: string;
  /** ISO 3166-1 alpha-3 code */
  alpha3: string;
  /** ISO 3166-1 numeric code (UN M49), zero-padded to 3 digits */
  numeric: string;
  /** ITU-T E.164 country calling code, with + prefix */
  callingCode: string;
  /** All E.164 country calling codes that apply to this ISO entry */
  callingCodes: readonly string[];
  /**
   * Practical international prefix for phone inputs.
   * For NANP territories this is +1 plus the primary NPA (e.g. +1264).
   */
  dialCode: string;
  /** UN M49 region, or null (Antarctica, Taiwan) */
  region: string | null;
  /** UN M49 sub-region, or null */
  subregion: string | null;
  /** ISO 3166 independent territory (true for sovereign states) */
  independent: boolean;
  /** IANA country-code TLD, including the leading dot (`".uk"` for GB) */
  tld: string | null;
  /** Common English capital city name, when one exists */
  capital: string | null;
  /** ISO 4217 alphabetic currency codes used in the territory */
  currencies: readonly string[];
  /** Unicode flag emoji derived from the alpha-2 code */
  flag: string;
  /** Optional NANP area codes when the E.164 country code is `+1` */
  nanpAreaCodes?: readonly string[];
}

/** Stored record plus computed flag / dial code, keyed by alpha-2. */
export interface CountryData {
  name: string;
  commonName: string;
  alpha3: string;
  numeric: string;
  callingCode: string;
  callingCodes: readonly string[];
  dialCode: string;
  region: string | null;
  subregion: string | null;
  independent: boolean;
  tld: string | null;
  capital: string | null;
  currencies: readonly string[];
  flag: string;
  aliases: readonly string[];
  nanpAreaCodes?: readonly string[];
}

export interface CountryRecord {
  code: CountryCode;
  name: string;
  commonName: string;
  alpha3: string;
  numeric: string;
  callingCode: string;
  callingCodes: string[];
  region: string | null;
  subregion: string | null;
  independent: boolean;
  tld: string | null;
  capital: string | null;
  currencies: string[];
  aliases: string[];
  nanpAreaCodes?: string[];
}

export interface CountrySearchOptions {
  /** Maximum number of results to return */
  limit?: number;
  /** Whether to match exactly (default: false) */
  exact?: boolean;
  /** Whether to search by country codes (alpha-2, alpha-3, numeric) as well (default: true) */
  includeCodes?: boolean;
}

export interface CountryListOptions {
  region?: string;
  subregion?: string;
  independent?: boolean;
  sortBy?: 'name' | 'commonName' | 'code' | 'dialCode';
}

export interface CountrySelectOption {
  value: CountryCode;
  label: string;
  dialCode: string;
  flag: string;
  flagSvgUrl: string;
}
