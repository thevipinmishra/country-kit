import { useState } from 'react';
import { getCountry, isValidCallingCode, isValidCountryCode } from 'country-kit';

const samples = ['US', 'usa', '840', 'GB', 'XK', 'XX'];

export default function CodeValidator() {
  const [raw, setRaw] = useState('USA');
  const country = getCountry(raw);
  const payload = {
    isValidCountryCode: isValidCountryCode(raw),
    resolved: country
      ? { code: country.code, commonName: country.commonName }
      : null,
    isValidCallingCode: isValidCallingCode(raw.startsWith('+') ? raw : `+${raw}`),
  };

  return (
    <div className="ck-widget">
      <label className="ck-label" htmlFor="react-validate">
        Code from a query param
      </label>
      <input
        id="react-validate"
        className="ck-input font-mono"
        value={raw}
        onChange={(event) => setRaw(event.target.value)}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {samples.map((sample) => (
          <button
            key={sample}
            type="button"
            className="ck-chip font-mono"
            onClick={() => setRaw(sample)}
          >
            {sample}
          </button>
        ))}
      </div>
      <pre className="ck-json">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
}
