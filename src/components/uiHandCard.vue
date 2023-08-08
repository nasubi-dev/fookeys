<script setup lang="ts">
import { ref } from "vue";
import type { Card } from "@/types";
import { onClickOutside } from '@vueuse/core'
import { onLongPress } from '@vueuse/core'

defineProps<{ card: Card }>();

const el = ref()
const dropDown = ref(false);
const htmlRefHook = ref<HTMLElement | null>(null)

const onLongPressCallbackHook = () => {
  dropDown.value = true
  console.log("longPress");
}
onLongPress(
  htmlRefHook,
  onLongPressCallbackHook,
  { modifiers: { prevent: true } }
)
onClickOutside(el, () => {
  dropDown.value = false
})

</script>
<template>
  <div>
    <div v-if="dropDown" ref="el" class="bg-white rounded">
      {{ dropDown }}
      <h5>{{ card.name }}</h5>
      <p>{{ card.description }}</p>
    </div>
    <div ref="htmlRefHook" class="overCard">
      <img :src="`/img/companys/${card.company}.png`" onselectstart="return false;" onmousedown="return false;" />
      <div class="overText">
        <p class="waste">{{ card.waste }}</p>
        <div class="info flex justify-start">
          <p>{{ "🍖" + card.hungry }} </p>
          <div v-if="card.atk">
            <p>{{ "⚔:" + card.atk }}</p>
          </div>
          <div v-if="card.def">
            <p>{{ "🛡:" + card.def }}</p>
          </div>
          <div v-if="card.tech">
            <p>{{ "🏹:" + card.tech }}</p>
          </div>
          <div v-if="card.priority">
            <p>{{ "🦶: " + card.priority }}</p>
          </div>
          <div v-if="card.heal">
            <p>{{ "💖:" + card.heal }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>