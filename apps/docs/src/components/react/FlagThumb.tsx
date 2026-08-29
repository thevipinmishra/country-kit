import { getFlagSvgUrl } from 'country-kit';

export function FlagThumb({
  code,
  className = 'h-8 w-11 shrink-0',
}: {
  code: string;
  className?: string;
}) {
  const url = getFlagSvgUrl(code);
  return (
    <span className={`flag-frame ${className}`}>
      {url ? <img src={url} alt="" /> : null}
    </span>
  );
}
