import flagSvgsJson from './data/flag-svgs.json';
import {
  FLAG_ICONS_VERSION,
  type FlagUrlOptions,
  buildFlagUrl,
} from './flag-urls';

const FLAG_SVGS = flagSvgsJson as Record<string, string>;

const normalize = (code: string): string => code.trim().toUpperCase();

/**
 * Inline SVG markup for an ISO 3166-1 alpha-2 code (4×3 Wikipedia/Wikimedia
 * flag from [flag-icons](https://github.com/lipis/flag-icons), MIT).
 */
export const getFlagSvg = (code: string): string | undefined => {
  if (!code || typeof code !== 'string') return undefined;
  return FLAG_SVGS[normalize(code)];
};

/**
 * Version-pinned CDN URL for the same official SVG (or a 1×1 variant).
 */
export const getFlagSvgUrl = (
  code: string,
  options?: FlagUrlOptions,
): string | undefined => {
  if (!getFlagSvg(code)) return undefined;
  return buildFlagUrl(code, options);
};

export {
  FLAG_ICONS_VERSION,
  type FlagRatio,
  type FlagSource,
  type FlagUrlOptions,
} from './flag-urls';
