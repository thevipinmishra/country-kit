export const snippets = {
  residence: {
    react: `import { useMemo, useState } from 'react';
import { getCountry, getCountrySelectOptions } from 'country-kit';

export function ResidenceSelect() {
  const options = useMemo(
    () => getCountrySelectOptions({ independent: true }),
    [],
  );
  const [code, setCode] = useState('FR');
  const country = getCountry(code);

  return (
    <select value={code} onChange={(e) => setCode(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
  // persist country.code — not the label
}`,
    vue: `<script setup lang="ts">
import { computed, ref } from 'vue';
import { getCountry, getCountrySelectOptions } from 'country-kit';

const options = getCountrySelectOptions({ independent: true });
const code = ref('FR');
const country = computed(() => getCountry(code.value));
</script>

<template>
  <select v-model="code">
    <option v-for="o in options" :key="o.value" :value="o.value">
      {{ o.label }}
    </option>
  </select>
</template>`,
  },
  phone: {
    react: `import { getCallingCode, getDialCode, searchCountries } from 'country-kit';

const [match] = searchCountries('Anguilla', { limit: 1 });
getDialCode(match.code);    // '+1264'  show in the picker
getCallingCode(match.code); // '+1'     ITU-T E.164 country code`,
    vue: `<script setup lang="ts">
import { getCallingCode, getDialCode, searchCountries } from 'country-kit';

const [match] = searchCountries('Anguilla', { limit: 1 });
getDialCode(match.code);    // '+1264'
getCallingCode(match.code); // '+1'
</script>`,
  },
  search: {
    react: `import { searchCountries } from 'country-kit';

const results = searchCountries(query, { limit: 6 });
// 'uk' / '.uk' → United Kingdom
// 'Vietnam'    → Viet Nam
order.shipTo = results[0].code;
order.label = results[0].commonName;`,
    vue: `<script setup lang="ts">
import { computed, ref } from 'vue';
import { searchCountries } from 'country-kit';

const query = ref('uk');
const results = computed(() => searchCountries(query.value, { limit: 6 }));
</script>`,
  },
  flag: {
    react: `import { getCountryFlag, getFlagSvgUrl } from 'country-kit';

<img src={getFlagSvgUrl('JP')} alt="Japan" />
<img src={getFlagSvgUrl('JP', { ratio: '1x1' })} alt="" />
getCountryFlag('JP'); // '🇯🇵'`,
    vue: `<script setup lang="ts">
import { getCountryFlag, getFlagSvgUrl } from 'country-kit';
</script>

<template>
  <img :src="getFlagSvgUrl('JP')" alt="Japan" />
  <img :src="getFlagSvgUrl('JP', { ratio: '1x1' })" alt="" />
</template>`,
  },
  tld: {
    react: `import { getCountryByTld } from 'country-kit';

function countryFromHost(value: string) {
  const host = value.includes('@')
    ? value.split('@').pop()!
    : value.replace(/^https?:\\/\\//, '').split(/[/?#]/)[0];
  return getCountryByTld('.' + host.split('.').pop());
}

countryFromHost('https://www.gov.uk'); // GB
countryFromHost('https://npmjs.com');  // undefined`,
    vue: `<script setup lang="ts">
import { getCountryByTld } from 'country-kit';

const country = getCountryByTld('.uk'); // GB, not .gb
</script>`,
  },
  validate: {
    react: `import { getCountry, isValidCountryCode, type CountryCode } from 'country-kit';

function parseCountry(raw: string): CountryCode | undefined {
  if (isValidCountryCode(raw)) return raw;
  return getCountry(raw)?.code; // 'USA' / '840' → 'US'
}

parseCountry('XK'); // undefined (not ISO assigned)`,
    vue: `<script setup lang="ts">
import { getCountry, isValidCallingCode, isValidCountryCode } from 'country-kit';

isValidCountryCode('GB');    // true
isValidCountryCode('XK');    // false
getCountry('USA')?.code;     // 'US'
isValidCallingCode('+44');   // true
isValidCallingCode('+1264'); // false
</script>`,
  },
} as const;
