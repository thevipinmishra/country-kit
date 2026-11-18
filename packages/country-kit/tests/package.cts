import countryKit = require('country-kit');
import flags = require('country-kit/flags');

export const country: countryKit.Country | undefined =
  countryKit.getCountry('US');
export const flag: string | undefined = flags.getFlagSvg('US');
const options: flags.FlagUrlOptions = { ratio: '1x1' };
export const flagUrl: string | undefined = flags.getFlagSvgUrl('US', options);
