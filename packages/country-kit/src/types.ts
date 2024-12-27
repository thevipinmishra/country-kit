export type CountryCode = string;

export interface Country {
  name: string;
  code: CountryCode;
  alpha3: string;
  callingCode: string;
  flag: string;
}
