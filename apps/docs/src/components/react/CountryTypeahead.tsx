import { useState } from 'react';
import { searchCountries } from 'country-kit';
import { FlagThumb } from './FlagThumb';

export default function CountryTypeahead() {
  const [query, setQuery] = useState('uk');
  const matches = searchCountries(query, { limit: 6 });
  const [code, setCode] = useState(matches[0]?.code);
  const selected = matches.find((item) => item.code === code) ?? matches[0];

  return (
    <div className="ck-widget">
      <label className="ck-label" htmlFor="react-ship">
        Ship to
      </label>
      <input
        id="react-ship"
        className="ck-input"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setCode(undefined);
        }}
        autoComplete="off"
      />
      <ul className="ck-hits">
        {matches.length ? (
          matches.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                className={`ck-hit ${selected?.code === item.code ? 'is-active' : ''}`}
                onClick={() => setCode(item.code)}
              >
                <FlagThumb code={item.code} className="h-5 w-7 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{item.commonName}</span>
                <span className="font-mono text-xs">{item.code}</span>
              </button>
            </li>
          ))
        ) : (
          <li className="ck-empty">
            No countries match. Try a name, ISO code, TLD, or currency.
          </li>
        )}
      </ul>
      <p className="mt-3 text-sm text-[var(--muted)]">
        {selected
          ? `Persist ${selected.code} · show "${selected.commonName}"`
          : 'No match. Try a name, ISO code, or TLD.'}
      </p>
    </div>
  );
}
