<script setup lang="ts">
import { computed, ref } from 'vue';
import { getCountry, getCountryFlag, getFlagSvgUrl } from 'country-kit';

const raw = ref('JP');
const country = computed(() => getCountry(raw.value));
const wide = computed(() =>
  country.value ? getFlagSvgUrl(country.value.code) : undefined,
);
const square = computed(() =>
  country.value ? getFlagSvgUrl(country.value.code, { ratio: '1x1' }) : undefined,
);
</script>

<template>
  <div class="ck-widget">
    <label class="ck-label" for="vue-flag-code">ISO alpha-2</label>
    <input
      id="vue-flag-code"
      v-model="raw"
      class="ck-input max-w-[6rem] font-mono uppercase"
      maxlength="3"
    />
    <div v-if="country" class="mt-4 flex min-w-0 items-center gap-3">
      <span class="flag-frame h-12 w-16 shrink-0">
        <img v-if="wide" :src="wide" alt="" />
      </span>
      <img
        v-if="square"
        :src="square"
        alt=""
        class="h-12 w-12 shrink-0 rounded-full border border-[var(--line)] object-cover"
      />
      <div class="min-w-0">
        <p class="truncate font-semibold">
          {{ country.commonName }} {{ getCountryFlag(country.code) }}
        </p>
        <p class="truncate font-mono text-xs text-[var(--muted)]">{{ wide }}</p>
      </div>
    </div>
    <p v-else class="mt-4 text-sm text-[var(--muted)]">
      Not an assigned ISO 3166-1 code. Try JP or US. XK is not included.
    </p>
  </div>
</template>
