<script setup>
import { computed } from 'vue'
const props = defineProps({
  lgcard: Object,
})
const imageUrl = computed(() =>
  new URL(`../assets/assets-projet/CarteLoupGarou/${props.lgcard.image}`, import.meta.url).href
)

</script>

<template>
  <span class="carte-loupgarou" :style="{ backgroundImage: `url('${imageUrl}')` }">
    <div class="overlay">
      <span class="nomdescartes">{{ lgcard.name }}</span>
    </div>
  </span>
</template>

<style scoped>

.carte-loupgarou {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 130px;
  width: 130px;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px 4px rgba(204, 148, 7, 0.308);
  font-size: 1rem;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.carte-loupgarou:hover {
  transform: scale(1.08) translateY(-8px);
  box-shadow: 0 8px 32px 0 #fff700cc, 0 2px 16px 0 #000a;
  z-index: 2;
  cursor: pointer;
}

.overlay {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  background: linear-gradient(to top, rgba(25,25,21,0.7) 5%, transparent 80%);
  padding-bottom: 10px;
  height: 100%;
}

.nomdescartes {
  color: #fff;;
  font-weight: bold;
  text-shadow: 1px 1px 6px #192232, 0 0 10px #ffae0099;
  margin-bottom: 8px;
  font-size: 1rem;
}

</style>