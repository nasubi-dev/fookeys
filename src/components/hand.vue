<script setup lang="ts">
import type { Hand } from "@/types";

defineProps<{
  hand: Hand;
}>();
</script>

<template>
  <div>
    <ul class="text-xs">
      <div v-for="card in hand" :key="card.id">
        <li>
          ID:{{ card.id }} name:{{ card.name }} company:{{ card.company }} waste:{{ card.waste }} hungry:{{
            card.hungry
          }}
          <div v-if="card.pow">
            {{ "pow:" + card.pow }}
          </div>
          <div v-if="card.def">
            {{ "def:" + card.def }}
          </div>
          <div v-if="card.tech">
            {{ "tech:" + card.tech }}
          </div>
          <div>------</div>
        </li>
      </div>
    </ul>
  </div>
</template>
