import { useState } from 'react';
import { getCountryByTld } from 'country-kit';
import { FlagThumb } from './FlagThumb';

const samples = ['https://www.gov.uk/help', 'bbc.co.uk', 'ada@bund.de', 'https://npmjs.com'];

function hostFrom(value: string) {
  const trimmed = value.trim();
  const withoutScheme = trimmed.includes('@')
    ? (trimmed.split('@').pop() ?? '')
    : trimmed.replace(/^https?:\/\//i, '');
  return withoutScheme.split(/[/?#]/)[0].replace(/^www\./i, '');
}

export default function HostLookup() {
  const [value, setValue] = useState('https://www.gov.uk/help');
  const host = hostFrom(value);
  const label = host.split('.').pop();
  const tld = label ? `.${label.toLowerCase()}` : '';
  const country = tld ? getCountryByTld(tld) : undefined;

  return (
    <div className="ck-widget">
      <label className="ck-label" htmlFor="react-host">
        Website or email
      </label>
      <input
        id="react-host"
        className="ck-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {samples.map((sample) => (
          <button
            key={sample}
            type="button"
            className="ck-chip"
            onClick={() => setValue(sample)}
          >
            {sample}
          </button>
        ))}
      </div>
      <div className="mt-4 text-sm">
        {!host ? (
          <p className="text-[var(--muted)]">Enter a host or email.</p>
        ) : country ? (
          <div className="ck-row">
            <FlagThumb code={country.code} />
            <div className="min-w-0">
              <p className="font-semibold">{country.commonName}</p>
              <p className="font-mono text-xs text-[var(--muted)]">
                {tld} → {country.code}
              </p>
            </div>
          </div>
        ) : (
          <p>
            <span className="font-mono">{host}</span> ends in{' '}
            <span className="font-mono">{tld}</span>, not a country-code TLD.
          </p>
        )}
      </div>
    </div>
  );
}
