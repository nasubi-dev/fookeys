<script setup lang="ts">
import { toRefs } from "vue";
import { e, s, i } from "@/log";
import { enemyPlayerStore } from "@/main";
import { storeToRefs } from "pinia";
import allCharacters from "@/assets/allCharacters";
import infoImg from "@/assets/img/ui/info.png";

const { enemyPlayer } = storeToRefs(enemyPlayerStore);
const { idGame, character, gifts, status, hand, donate, field, sumFields } = toRefs(enemyPlayer.value);
</script>
<template>
    <div>
        <div class="overCard">
            <img :src="infoImg" />
            <div class="overText flex justify-start">
                <p>{{ allCharacters[character].name }}</p>
                <p>{{ field.map((card) => card.name) }}</p>
                <div class="flex justify-start">
                    <p>{{ "0️⃣" + sumFields.num }}</p>
                    <p>{{ "🍃" + sumFields.waste }}</p>
                    <p>{{ "🍖" + sumFields.hungry }} </p>
                    <p>{{ "⚔:" + sumFields.atk }}</p>
                    <p>{{ "🛡:" + sumFields.def }}</p>
                    <p>{{ "🏹:" + sumFields.tech }}</p>
                    <p>{{ "🦶: " + sumFields.priority }}</p>
                    <p>{{ "💖:" + sumFields.heal }}</p>
                </div>
            </div>
        </div>
    </div>
</template>