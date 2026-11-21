<template>
  <div
    class="carte-loupgarou"
    :class="{ 'carte-pouvoir-indisponible': pouvoirIndisponible }"
    :style="{ '--carte-image': `url('${imageUrl}')` }"
  >
    <div class="carte-overlay">
      <span v-if="pouvoirIndisponible" class="carte-indisponible-badge">Pouvoir indisponible</span>
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
    <div v-if="lgcard.name === 'Salvateur' && props.nomSalvateur" class="carte-nom-nom">
    {{ props.nomSalvateur }}</div>
    <div
      v-if="(lgcard.name === 'Loup-garou' || (lgcard.name === 'Chien-Loup' && props.campChienLoup === 'Loup-garou')) && nomsLoupsAffiches.length"
      class="carte-noms-loups"
    >
      <span v-for="(nom, index) in nomsLoupsAffiches" :key="`${nom}-${index}`" class="loup-nom-rouge">{{ nom }}</span>
    </div>
<div v-if="lgcard.name === 'Joueur de flute' && props.nomFlute" class="carte-nom-flute">
  {{ props.nomFlute }}</div>
  <div
  v-if="lgcard.name === 'Chien-Loup' && props.nomChienLoup"
  :class="['carte-nom-nom', props.campChienLoup === 'Loup-garou' ? 'loup-nom-rouge' : '']">
  {{ props.nomChienLoup }}
</div>
  <div
  v-if="lgcard.name === 'Sectaire' && props.nomSectaire" class="carte-nom-flute">
  {{ props.nomSectaire }}
</div>
<div v-if="lgcard.name === 'Courtisane' && props.nomCourtisane" class="carte-nom-nom">
  {{ props.nomCourtisane }}
</div>
<div v-if="lgcard.name === 'Infect pere des loups' && props.nomInfect" class="carte-nom-nom loup-nom-rouge">
  {{ props.nomInfect }}
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
  nomSalvateur: String,
  nomsLoups: Array,
  nomFlute: String,
  nomCorbeau: String,
  nomSectaire: String,
  mentorIsDead: Boolean,
  nomQuitousse: String,
  nomChienLoup: String,
  campChienLoup: String,
  nomCourtisane: String,
  nomInfect: String
})
const rolesPouvoirIndisponible = ['Grand Mechant Loup', 'Comedien', 'Avocat', 'DonQuiTousse'];
const pouvoirIndisponible = computed(() => rolesPouvoirIndisponible.includes(props.lgcard?.name));
const nomsLoupsAffiches = computed(() => {
  const noms = [...(props.nomsLoups || [])];
  if (props.campChienLoup === 'Loup-garou' && props.nomChienLoup && !noms.includes(props.nomChienLoup)) {
    noms.push(props.nomChienLoup);
  }
  return noms;
});
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
  background-image: var(--carte-image);
  background-size: cover;
  background-position: center;
  filter: none;
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

.carte-pouvoir-indisponible {
  filter: grayscale(1);
  opacity: 0.62;
}

.carte-pouvoir-indisponible:hover {
  border-color: #b9b9b9;
  box-shadow: 0 8px 24px #000a;
}

.carte-indisponible-badge {
  position: absolute;
  top: 8px;
  left: 50%;
  z-index: 1;
  width: max-content;
  max-width: calc(100% - 12px);
  padding: 3px 6px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgba(20, 20, 20, 0.82);
  color: #e2e2e2;
  font-size: 0.58rem;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
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

.carte-noms-loups {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  padding: 3px 8px;
  margin-bottom: 2px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.48);
}

.carte-noms-loups .loup-nom-rouge {
  padding: 0;
  margin: 0;
  line-height: 1.15;
  overflow-wrap: anywhere;
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