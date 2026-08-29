import { useState } from 'react';
import {
  getCallingCode,
  getDialCode,
  searchCountries,
  type Country,
} from 'country-kit';
import { FlagThumb } from './FlagThumb';

export default function PhoneField() {
  const [query, setQuery] = useState('Anguilla');
  const [national, setNational] = useState('4971234');
  const matches = searchCountries(query, { limit: 5 });
  const [picked, setPicked] = useState<Country | undefined>(matches[0]);
  const country = picked ?? matches[0];
  const prefix = country ? (getDialCode(country.code) ?? '') : '';
  const e164 = country ? (getCallingCode(country.code) ?? '') : '';

  return (
    <div className="ck-widget">
      <label className="ck-label" htmlFor="react-phone-q">
        Find a country
      </label>
      <input
        id="react-phone-q"
        className="ck-input"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setPicked(undefined);
        }}
        placeholder="Anguilla, +1, United States…"
      />
      <ul className="ck-hits">
        {matches.length ? (
          matches.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                className={`ck-hit ${country?.code === item.code ? 'is-active' : ''}`}
                onClick={() => setPicked(item)}
              >
                <FlagThumb code={item.code} className="h-5 w-7 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{item.commonName}</span>
                <span className="font-mono text-xs text-[var(--muted)]">
                  {item.dialCode}
                </span>
              </button>
            </li>
          ))
        ) : (
          <li className="ck-empty">
            No countries match. Try a name, ISO code, or calling prefix such as +1.
          </li>
        )}
      </ul>
      <div className="ck-row mt-4">
        <p className="shrink-0 font-mono text-lg">{prefix || '—'}</p>
        <input
          className="ck-input"
          inputMode="tel"
          value={national}
          onChange={(event) => setNational(event.target.value.replace(/\D/g, ''))}
          placeholder="National number"
          aria-label="National number"
        />
      </div>
      {country ? (
        <dl className="ck-dl">
          <dt>Display</dt>
          <dd>
            {prefix}
            {national || '…'}
          </dd>
          <dt>E.164 country</dt>
          <dd>{e164}</dd>
          <dt>NANP</dt>
          <dd>{country.nanpAreaCodes?.join(', ') ?? '—'}</dd>
        </dl>
      ) : null}
    </div>
  );
}
