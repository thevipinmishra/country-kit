<script setup lang="ts">
import { computed, ref } from 'vue';
import { getCountry, isValidCallingCode, isValidCountryCode } from 'country-kit';

const samples = ['US', 'usa', '840', 'GB', 'XK', 'XX'];
const raw = ref('USA');
const payload = computed(() => {
  const country = getCountry(raw.value);
  return {
    isValidCountryCode: isValidCountryCode(raw.value),
    resolved: country
      ? { code: country.code, commonName: country.commonName }
      : null,
    isValidCallingCode: isValidCallingCode(
      raw.value.startsWith('+') ? raw.value : `+${raw.value}`,
    ),
  };
});
</script>

<template>
  <div class="ck-widget">
    <label class="ck-label" for="vue-validate">Code from a query param</label>
    <input id="vue-validate" v-model="raw" class="ck-input font-mono" />
    <div class="mt-3 flex flex-wrap gap-2">
      <button
        v-for="sample in samples"
        :key="sample"
        type="button"
        class="ck-chip font-mono"
        @click="raw = sample"
      >
        {{ sample }}
      </button>
    </div>
    <pre class="ck-json">{{ JSON.stringify(payload, null, 2) }}</pre>
  </div>
</template>
