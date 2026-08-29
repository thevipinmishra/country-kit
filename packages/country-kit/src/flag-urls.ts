export const FLAG_ICONS_VERSION = '7.5.0';

export type FlagRatio = '4x3' | '1x1';
export type FlagSource = 'flag-icons' | 'flagcdn';

export interface FlagUrlOptions {
  /** Aspect ratio. Default `4x3`. */
  ratio?: FlagRatio;
  /**
   * `flag-icons` is the Wikipedia/Wikimedia SVG set (MIT, version-pinned).
   * `flagcdn` is Flagpedia’s CDN of the same public flags.
   */
  source?: FlagSource;
}

const normalize = (code: string): string => code.trim().toLowerCase();

/**
 * URL of the public SVG (or PNG, via flagcdn) for an ISO 3166-1 alpha-2 code.
 * Does not validate that the code is assigned — use {@link getFlagSvgUrl} in the
 * main package for that.
 */
export const buildFlagUrl = (
  code: string,
  options: FlagUrlOptions = {},
): string => {
  const cc = normalize(code);
  const ratio = options.ratio ?? '4x3';
  const source = options.source ?? 'flag-icons';

  if (source === 'flagcdn') {
    if (ratio === '1x1') {
      return `https://flagcdn.com/w160/${cc}.png`;
    }
    return `https://flagcdn.com/${cc}.svg`;
  }

  return `https://cdn.jsdelivr.net/gh/lipis/flag-icons@${FLAG_ICONS_VERSION}/flags/${ratio}/${cc}.svg`;
};
