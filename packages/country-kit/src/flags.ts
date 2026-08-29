const REGIONAL_INDICATOR_OFFSET = 127397; // 'A'.charCodeAt(0) → 🇦

/**
 * Builds a flag emoji from an ISO 3166-1 alpha-2 code using Unicode
 * regional indicator symbols (UTS #51).
 */
export const getFlag = (code: string): string => {
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split('')
      .map((char) => REGIONAL_INDICATOR_OFFSET + char.charCodeAt(0)),
  );
};
