<script setup lang="ts">
import { toRefs } from "vue";
import { gameStore } from "@/main";
import { storeToRefs } from "pinia";
import infoImg from "@/assets/img/ui/info.png";
import UiMission from "@/components/uiMissionsMission.vue";

const { missions } = storeToRefs(gameStore);

</script>

<template>
  <div>
    <div v-for="mission in missions" :key="mission.id">
      <div class="overCard">
        <img :src="infoImg" />
        <div class="overText">
          <UiMission :mission="mission" />
        </div>
      </div>
    </div>
  </div>
</template>
