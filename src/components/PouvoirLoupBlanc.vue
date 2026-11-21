<template>
  <button class="bouton" type="button" @click="openDialog" :disabled="!loupBlancVivant">
    <img class="position-logo" src="/logospouvoirs/Grandmechantloup.png" alt="Pouvoir du Loup Blanc" title="Choisir une victime" />
  </button>
  <dialog ref="dialogLoupBlanc">
    <button class="close-btn" type="button" @click="closeDialog" title="Fermer">&times;</button>
    <form @submit.prevent="validate">
      <div v-if="!props.nomLoupBlanc">
        <label for="nomLoupBlanc">Qui est le Loup Blanc ?</label>
        <select id="nomLoupBlanc" v-model="nomLoupBlancLocal" required>
          <option value="" disabled>Choisir un joueur</option>
          <option v-for="joueur in joueursLoupsVivants" :key="joueur.nom" :value="joueur.nom">
            {{ joueur.nom }}
          </option>
        </select>
      </div>
      <p>Le Loup Blanc choisit seul une victime cette nuit.</p>
      <label for="victimeLoupBlanc">La victime est</label>
      <select id="victimeLoupBlanc" v-model="victime" required>
        <option value="" disabled>Choisir un joueur</option>
        <option v-for="joueur in victimesEligibles" :key="joueur.nom" :value="joueur.nom">
          {{ joueur.nom }}
        </option>
      </select>
      <button type="submit">Valider</button>
    </form>
  </dialog>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  joueurs: { type: Array, default: () => [] },
  nomLoupBlanc: { type: String, default: '' },
  nomsLoups: { type: Array, default: () => [] }
});
const emit = defineEmits(['loup-blanc-selected']);

const dialogLoupBlanc = ref(null);
const nomLoupBlancLocal = ref('');
const victime = ref('');
const joueursVivants = computed(() => props.joueurs.filter(joueur => !joueur.mort));
const joueursLoupsVivants = computed(() =>
  joueursVivants.value.filter(joueur => props.nomsLoups.includes(joueur.nom))
);
const nomSelectionne = computed(() => props.nomLoupBlanc || nomLoupBlancLocal.value);
const victimesEligibles = computed(() =>
  joueursVivants.value.filter(joueur => joueur.nom !== nomSelectionne.value)
);
const loupBlancVivant = computed(() =>
  !props.nomLoupBlanc || joueursVivants.value.some(joueur => joueur.nom === props.nomLoupBlanc)
);

function openDialog() {
  if (!loupBlancVivant.value) return;
  nomLoupBlancLocal.value = props.nomLoupBlanc || '';
  victime.value = '';
  dialogLoupBlanc.value?.showModal();
}

function validate() {
  if (!nomSelectionne.value || !victimesEligibles.value.some(joueur => joueur.nom === victime.value)) return;
  emit('loup-blanc-selected', {
    nomLoupBlanc: nomSelectionne.value,
    victime: victime.value
  });
  dialogLoupBlanc.value?.close();
}

function closeDialog() {
  dialogLoupBlanc.value?.close();
}
</script>

<style scoped>
.bouton {
  background: transparent;
  border: 0;
  cursor: pointer;
}
.bouton:disabled { cursor: not-allowed; opacity: 0.45; }
.position-logo {
  width: 75px;
  height: 75px;
  margin: 0 3px;
  transition: transform 0.15s;
}
.bouton:hover:not(:disabled) .position-logo { transform: scale(1.12); }
dialog {
  position: fixed;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
  min-width: min(320px, calc(100vw - 2rem));
  box-sizing: border-box;
  border: 1px solid rgba(255, 174, 0, 0.5);
  border-radius: 16px;
  padding: 2rem 2.5rem;
  background: #232323;
  color: #fff;
  box-shadow: 0 8px 32px #000a;
  text-align: center;
}
dialog::backdrop { background: rgba(0, 0, 0, 0.55); }
dialog form { display: grid; gap: 0.8rem; }
dialog label { color: #ffae00; font-weight: 700; }
dialog select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #888;
  border-radius: 8px;
  background: #181818;
  color: #fff;
}
dialog form > button {
  justify-self: center;
  margin-top: 0.5rem;
  padding: 0.55rem 1.2rem;
  border: 0;
  border-radius: 8px;
  background: #ffae00;
  color: #232323;
  font-weight: 700;
  cursor: pointer;
}
.close-btn {
  position: absolute;
  top: 8px;
  right: 12px;
  border: 0;
  background: transparent;
  color: #ffae00;
  font-size: 1.4rem;
  cursor: pointer;
}
</style>
