import { getCountry, type Country } from 'country-kit';
import {
  getFlagSvg,
  getFlagSvgUrl,
  type FlagUrlOptions,
} from 'country-kit/flags';

export const country: Country | undefined = getCountry('US');
export const flag: string | undefined = getFlagSvg('US');
const options: FlagUrlOptions = { ratio: '1x1' };
export const flagUrl: string | undefined = getFlagSvgUrl('US', options);
