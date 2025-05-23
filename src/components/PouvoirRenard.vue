<template>
    <div class="pouvoir-renard">
                <img
                  class="position-logo renard"
                  :src="props.choixrenard ? '/logospouvoirs/flairrenardlogo.png' : '/logospouvoirs/renardcroix.png'"
                  :title="props.choixrenard ? 'Choisir la personne à flairer' : 'Flair déjà utilisé'"
                  @click="!props.choixrenard || emit('use-flair')"
                  /> 
    </div>           
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps({
  choixrenard: Boolean,
});
const emit = defineEmits(["use-flair"]);
</script>

<style>
  .position-logo {
  width: 75px;
  height: 75px;
  margin: 0 3px;
  cursor: pointer;
  transition: transform 0.15s;
}
.position-logo:hover {
  transform: scale(1.15);
}

</style>