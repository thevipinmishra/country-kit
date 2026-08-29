<script setup lang="ts">
import { computed, ref } from 'vue';
import { getCountry, getCountrySelectOptions, getFlagSvgUrl } from 'country-kit';

const options = getCountrySelectOptions({ independent: true });
const code = ref('FR');
const country = computed(() => getCountry(code.value));
const flag = computed(() => getFlagSvgUrl(code.value));
</script>

<template>
  <div class="ck-widget">
    <label class="ck-label" for="vue-residence">Country of residence</label>
    <div class="ck-row">
      <span class="flag-frame h-8 w-11 shrink-0">
        <img v-if="flag" :src="flag" alt="" />
      </span>
      <select id="vue-residence" v-model="code" class="ck-select">
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    <dl v-if="country" class="ck-dl">
      <dt>Store</dt>
      <dd>{{ country.code }}</dd>
      <dt>ISO name</dt>
      <dd>{{ country.name }}</dd>
      <dt>TLD</dt>
      <dd>{{ country.tld ?? '—' }}</dd>
      <dt>Currency</dt>
      <dd>{{ country.currencies.join(', ') || '—' }}</dd>
    </dl>
  </div>
</template>
