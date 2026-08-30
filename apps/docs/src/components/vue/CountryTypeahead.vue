<script setup lang="ts">
import { computed, ref } from 'vue';
import { getFlagSvgUrl, searchCountries } from 'country-kit';

const query = ref('uk');
const code = ref<string | undefined>();
const matches = computed(() => searchCountries(query.value, { limit: 6 }));
const selected = computed(
  () => matches.value.find((item) => item.code === code.value) ?? matches.value[0],
);

function onQuery(value: string) {
  query.value = value;
  code.value = undefined;
}
</script>

<template>
  <div class="ck-widget">
    <label class="ck-label" for="vue-ship">Ship to</label>
    <input
      id="vue-ship"
      class="ck-input"
      :value="query"
      autocomplete="off"
      @input="onQuery(($event.target as HTMLInputElement).value)"
    />
    <ul class="ck-hits">
      <li v-for="item in matches" :key="item.code">
        <button
          type="button"
          class="ck-hit"
          :class="{ 'is-active': selected?.code === item.code }"
          @click="code = item.code"
        >
          <span class="flag-frame h-5 w-7 shrink-0">
            <img :src="getFlagSvgUrl(item.code)" alt="" />
          </span>
          <span class="min-w-0 flex-1 truncate">{{ item.commonName }}</span>
          <span class="font-mono text-xs">{{ item.code }}</span>
        </button>
      </li>
      <li v-if="!matches.length" class="ck-empty">
        No countries match. Try a name, ISO code, TLD, or currency.
      </li>
    </ul>
    <p class="mt-3 text-sm text-[var(--muted)]">
      {{
        selected
          ? `Persist ${selected.code} · show "${selected.commonName}"`
          : 'No match. Try a name, ISO code, or TLD.'
      }}
    </p>
  </div>
</template>
