import { useMemo, useState } from 'react';
import { getCountry, getCountrySelectOptions } from 'country-kit';
import { FlagThumb } from './FlagThumb';

export default function ResidenceSelect() {
  const options = useMemo(
    () => getCountrySelectOptions({ independent: true }),
    [],
  );
  const [code, setCode] = useState('FR');
  const country = getCountry(code);

  return (
    <div className="ck-widget">
      <label className="ck-label" htmlFor="react-residence">
        Country of residence
      </label>
      <div className="ck-row">
        <FlagThumb code={code} />
        <select
          id="react-residence"
          className="ck-select"
          value={code}
          onChange={(event) => setCode(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {country ? (
        <dl className="ck-dl">
          <dt>Store</dt>
          <dd>{country.code}</dd>
          <dt>ISO name</dt>
          <dd>{country.name}</dd>
          <dt>TLD</dt>
          <dd>{country.tld ?? '—'}</dd>
          <dt>Currency</dt>
          <dd>{country.currencies.join(', ') || '—'}</dd>
        </dl>
      ) : null}
    </div>
  );
}
