<script setup lang="ts">
import { computed, ref } from 'vue';
import { getCountryByTld, getFlagSvgUrl } from 'country-kit';

const samples = ['https://www.gov.uk/help', 'bbc.co.uk', 'ada@bund.de', 'https://npmjs.com'];
const value = ref('https://www.gov.uk/help');

function hostFrom(input: string) {
  const trimmed = input.trim();
  const withoutScheme = trimmed.includes('@')
    ? (trimmed.split('@').pop() ?? '')
    : trimmed.replace(/^https?:\/\//i, '');
  return withoutScheme.split(/[/?#]/)[0].replace(/^www\./i, '');
}

const host = computed(() => hostFrom(value.value));
const tld = computed(() => {
  const label = host.value.split('.').pop();
  return label ? `.${label.toLowerCase()}` : '';
});
const country = computed(() => (tld.value ? getCountryByTld(tld.value) : undefined));
</script>

<template>
  <div class="ck-widget">
    <label class="ck-label" for="vue-host">Website or email</label>
    <input id="vue-host" v-model="value" class="ck-input" />
    <div class="mt-3 flex flex-wrap gap-2">
      <button
        v-for="sample in samples"
        :key="sample"
        type="button"
        class="ck-chip"
        @click="value = sample"
      >
        {{ sample }}
      </button>
    </div>
    <div class="mt-4 text-sm">
      <p v-if="!host" class="text-[var(--muted)]">Enter a host or email.</p>
      <div v-else-if="country" class="ck-row">
        <span class="flag-frame h-8 w-11 shrink-0">
          <img :src="getFlagSvgUrl(country.code)" alt="" />
        </span>
        <div class="min-w-0">
          <p class="font-semibold">{{ country.commonName }}</p>
          <p class="font-mono text-xs text-[var(--muted)]">{{ tld }} → {{ country.code }}</p>
        </div>
      </div>
      <p v-else>
        <span class="font-mono">{{ host }}</span> ends in
        <span class="font-mono">{{ tld }}</span> — not a country-code TLD.
      </p>
    </div>
  </div>
</template>
