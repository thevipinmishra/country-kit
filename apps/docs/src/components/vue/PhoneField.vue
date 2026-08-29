<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  getCallingCode,
  getDialCode,
  getFlagSvgUrl,
  searchCountries,
  type Country,
} from 'country-kit';

const query = ref('Anguilla');
const national = ref('4971234');
const picked = ref<Country | undefined>();
const matches = computed(() => searchCountries(query.value, { limit: 5 }));
const country = computed(() => picked.value ?? matches.value[0]);
const prefix = computed(() =>
  country.value ? (getDialCode(country.value.code) ?? '') : '',
);
const e164 = computed(() =>
  country.value ? (getCallingCode(country.value.code) ?? '') : '',
);

function onQuery(value: string) {
  query.value = value;
  picked.value = undefined;
}
</script>

<template>
  <div class="ck-widget">
    <label class="ck-label" for="vue-phone-q">Find a country</label>
    <input
      id="vue-phone-q"
      class="ck-input"
      :value="query"
      placeholder="Anguilla, +1, United States…"
      @input="onQuery(($event.target as HTMLInputElement).value)"
    />
    <ul class="ck-hits">
      <li v-for="item in matches" :key="item.code">
        <button
          type="button"
          class="ck-hit"
          :class="{ 'is-active': country?.code === item.code }"
          @click="picked = item"
        >
          <span class="flag-frame h-5 w-7 shrink-0">
            <img :src="getFlagSvgUrl(item.code)" alt="" />
          </span>
          <span class="min-w-0 flex-1 truncate">{{ item.commonName }}</span>
          <span class="font-mono text-xs text-[var(--muted)]">{{ item.dialCode }}</span>
        </button>
      </li>
      <li v-if="!matches.length" class="ck-empty">
        No countries match. Try a name, ISO code, or calling prefix such as +1.
      </li>
    </ul>
    <div class="ck-row mt-4">
      <p class="shrink-0 font-mono text-lg">{{ prefix || '—' }}</p>
      <input
        class="ck-input"
        inputmode="tel"
        :value="national"
        placeholder="National number"
        aria-label="National number"
        @input="national = ($event.target as HTMLInputElement).value.replace(/\D/g, '')"
      />
    </div>
    <dl v-if="country" class="ck-dl">
      <dt>Display</dt>
      <dd>{{ prefix }}{{ national || '…' }}</dd>
      <dt>E.164 country</dt>
      <dd>{{ e164 }}</dd>
      <dt>NANP</dt>
      <dd>{{ country.nanpAreaCodes?.join(', ') ?? '—' }}</dd>
    </dl>
  </div>
</template>
