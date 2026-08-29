import { useState } from 'react';
import { getCountry, getCountryFlag, getFlagSvgUrl } from 'country-kit';
import { FlagThumb } from './FlagThumb';

export default function ProfileFlag() {
  const [raw, setRaw] = useState('JP');
  const country = getCountry(raw);
  const square = country ? getFlagSvgUrl(country.code, { ratio: '1x1' }) : undefined;

  return (
    <div className="ck-widget">
      <label className="ck-label" htmlFor="react-flag-code">
        ISO alpha-2
      </label>
      <input
        id="react-flag-code"
        className="ck-input max-w-[6rem] font-mono uppercase"
        maxLength={3}
        value={raw}
        onChange={(event) => setRaw(event.target.value)}
      />
      {country ? (
        <div className="mt-4 flex min-w-0 items-center gap-3">
          <FlagThumb code={country.code} className="h-12 w-16 shrink-0" />
          {square ? (
            <img
              src={square}
              alt=""
              className="h-12 w-12 shrink-0 rounded-full border border-[var(--line)] object-cover"
            />
          ) : null}
          <div className="min-w-0">
            <p className="truncate font-semibold">
              {country.commonName} {getCountryFlag(country.code)}
            </p>
            <p className="truncate font-mono text-xs text-[var(--muted)]">
              {getFlagSvgUrl(country.code)}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--muted)]">
          Not an assigned ISO 3166-1 code. Try JP or US. XK is not included.
        </p>
      )}
    </div>
  );
}
