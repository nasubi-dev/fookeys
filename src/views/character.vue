<script setup lang="ts">
import { usePlayerStore } from "@/store";
import type { Characters } from "@/types";
import { updatePlayerField } from "@/server/useMatchMaking";
import Select from "@/components/select.vue";
import nasubi from "@/assets/nasubi.png";

const playerStore = usePlayerStore();

const updateCharacter = async (character: number) => {
  await updatePlayerField(playerStore.id, "character", character);
};

const characters: Characters = [
  {
    name: "character 1",
    description: "test test test test",
    image: nasubi,
    company: "test",
    action: () => updateCharacter(1),
  },
  {
    name: "character 2",
    description: "test test test test",
    image: nasubi,
    company: "test",
    action: () => updateCharacter(2),
  },
  {
    name: "character 3",
    description: "test test test test",
    image: nasubi,
    company: "test",
    action: () => updateCharacter(3),
  },
  {
    name: "character 4",
    description: "test test test test",
    image: nasubi,
    company: "test",
    action: () => updateCharacter(4),
  },
  {
    name: "character 5",
    description: "test test test test",
    image: nasubi,
    company: "test",
    action: () => updateCharacter(5),
  },
  {
    name: "character 6",
    description: "test test test test",
    image: nasubi,
    company: "test",
    action: () => updateCharacter(6),
  },
  {
    name: "character 7",
    description: "test test test test",
    image: nasubi,
    company: "test",
    action: () => updateCharacter(7),
  },
  {
    name: "character 8",
    description: "test test test test",
    image: nasubi,
    company: "test",
    action: () => updateCharacter(8),
  },
];
</script>

<template>
  <Select :cards="characters" />
</template>
