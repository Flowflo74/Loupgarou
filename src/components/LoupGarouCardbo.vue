<template>
  <div class="carte-loupgarou" :style="{ backgroundImage: `url('${imageUrl}')` }">
    <div class="carte-overlay">
    <div v-if="lgcard.name === 'Ancien' && props.nomAncien" class="carte-nom-nom">
    {{ props.nomAncien }}</div>
    <div v-if="lgcard.name === 'Chasseur' && props.nomChasseur" class="carte-nom-nom">
    {{ props.nomChasseur }}</div>
    <div v-if="lgcard.name === 'Juge' && props.nomJuge" class="carte-nom-nom">
    {{ props.nomJuge }}</div>
    <div v-if="lgcard.name === 'Deux Soeurs' && props.nomSoeur1 && props.nomSoeur2" class="carte-nom-nom">
    {{ props.nomSoeur1}} & {{ props.nomSoeur2}}</div>
    <div v-if="lgcard.name === 'Montreur d ours' && props.nomOurs" class="carte-nom-nom">
    {{ props.nomOurs }}</div>
    <div v-if="lgcard.name === 'Enfant Sauvage' && props.nomEnfantSauvage"
     :class="['carte-nom-nom', props.mentorIsDead ? 'loup-nom-rouge' : '']">
  {{ props.nomEnfantSauvage }}
</div>
     <div v-if="lgcard.name === 'Voyante' && props.nomVoyante" class="carte-nom-nom">
    {{ props.nomVoyante }}</div>
    <div v-if="lgcard.name === 'Loup-garou' && props.nomLoup" class="carte-nom-nom loup-nom-rouge">
     {{ props.nomLoup }}</div>
<div v-if="lgcard.name === 'Joueur de flute' && props.nomFlute" class="carte-nom-flute">
  {{ props.nomFlute }}</div>
  <div
  v-if="lgcard.name === 'Sectaire' && props.nomSectaire" class="carte-nom-flute">
  {{ props.nomSectaire }}
</div>
<div v-if="lgcard.name === 'DonQuiTousse' && props.nomQuitousse" class="carte-nom-tousse">
   {{ props.nomQuitousse }} </div>
  <div v-if="lgcard.name === 'Corbeau' && props.nomCorbeau" class="carte-nom-nom">
  {{ props.nomCorbeau }}</div>
    <span class="carte-nom">{{ lgcard.name }}</span>
  </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  lgcard: Object,
  nomAncien: String,
  nomChasseur: String,
  nomJuge: String,
  nomSoeur1: String,
  nomSoeur2: String,
  nomOurs: String,
  nomEnfantSauvage: String,
  nomVoyante: String,
  nomLoup: String,
  nomFlute: String,
  nomCorbeau: String,
  nomLoup: String,
  nomSectaire: String,
  mentorIsDead: Boolean,
  nomQuitousse: String
})
const imageUrl = computed(() =>
  new URL(`../assets/assets-projet/imagecartelgbo/${props.lgcard.image}`, import.meta.url).href
)
</script>

<style scoped>

.carte-loupgarou {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 160px;
  width: 110px;
  margin: 12px;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 #000a, 0 0 0 2px #ffae0033 inset;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  transition: transform 0.18s, box-shadow 0.18s;
  border: 2.5px solid #ffae00cc;
  cursor: pointer;
}

.carte-loupgarou:hover {
  transform: scale(1.08) translateY(-10px) rotate(-2deg);
  box-shadow: 0 8px 32px 0 #fff700cc, 0 2px 16px 0 #000a;
  border-color: #fff700;
  z-index: 2;
}

.carte-overlay {
  width: 100%;
  padding-bottom: 12px;
  padding-top: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  background: linear-gradient(to top, rgba(25,25,21,0.82) 0%, transparent 100%);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.carte-nom {
  color: #ffb700;
  font-family: "NokaBold", sans-serif;
  font-weight: bold;
  text-shadow: 0 2px 8px #000a, 0 0 10px #ffae0099;
  font-size: 1.08rem;
  letter-spacing: 1px;
  background: rgba(0,0,0,0.18);
  border-radius: 8px;
  padding: 4px 10px 2px 10px;
  margin-bottom: 2px;
  box-shadow: 0 2px 8px #0004;
}

.carte-nom-nom {
 background: rgba(0, 0, 0, 0.22);
  color: #ffffff;
  font-family: "NokaBold", sans-serif;
  font-weight: bold;
  padding: 2px 10px 2px 10px;
  border-radius: 12px;
  font-size: 1rem;
  margin-bottom: 2px;
  text-align: center;
}

.carte-nom-flute {
  background: rgba(80, 0, 120, 0.22);
  color: #c77dff;
  font-family: "NokaBold", sans-serif;
  font-weight: bold;
  padding: 2px 10px;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 2px;
  text-align: center;
  box-shadow: 0 2px 8px #a100ff44;
}

.carte-nom-tousse {
  background: rgba(187, 144, 3, 0.22);
  color: #dd8a04;
  font-family: "NokaBold", sans-serif;
  font-weight: bold;
  padding: 2px 10px;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 2px;
  text-align: center;
  box-shadow: 0 2px 8px #a100ff44;
}

.loup-nom-rouge {
  color: #ff3030;
  font-weight: bold;
  font-size: 1.08em;
  text-shadow: 0 1px 6px #000, 0 0 10px #ff303099;
}

</style>