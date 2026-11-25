<template>
  <div class="pouvoir-renard">
    <button
      type="button"
      class="bouton-renard"
      :disabled="!props.choixrenard"
      @click="openDialog"
    >
      <img
        class="position-logo renard"
        :src="props.choixrenard ? '/logospouvoirs/flairrenardlogo.png' : '/logospouvoirs/renardcroix.png'"
        :title="props.choixrenard ? 'Utiliser le flair du Renard' : 'Le Renard a perdu son pouvoir'"
        :alt="props.choixrenard ? 'Utiliser le pouvoir du Renard' : 'Pouvoir du Renard perdu'"
      />
    </button>

    <dialog ref="renardDialog" class="renard-dialog">
      <button type="button" class="renard-fermer" @click="closeDialog" aria-label="Fermer">&times;</button>
      <p class="renard-question">Le Renard désigne un joueur.</p>
      <label for="renard-cible">Choisir un joueur vivant :</label>
      <select id="renard-cible" v-model="joueurChoisi">
        <option value="" disabled>Choisir un joueur</option>
        <option v-for="joueur in joueursVivants" :key="joueur.nom" :value="joueur.nom">
          {{ joueur.nom }}
        </option>
      </select>

      <template v-if="joueurChoisi">
        <p class="renard-question">Y a-t-il un Loup-garou parmi ce joueur ou ses voisins directs&nbsp;?</p>
        <div class="renard-reponses">
          <button type="button" @click="repondre(true)">Oui</button>
          <button type="button" @click="repondre(false)">Non</button>
        </div>
      </template>
    </dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  choixrenard: Boolean,
  joueurs: { type: Array, default: () => [] }
});
const emit = defineEmits(['use-flair']);

const renardDialog = ref(null);
const joueurChoisi = ref('');
const joueursVivants = computed(() => props.joueurs.filter(joueur => !joueur.mort));
const groupeFlair = computed(() => {
  const cercle = props.joueurs;
  const index = cercle.findIndex(joueur => joueur.nom === joueurChoisi.value);
  if (index < 0 || !cercle.length) return [];

  return [...new Set([
    cercle[(index - 1 + cercle.length) % cercle.length].nom,
    cercle[index].nom,
    cercle[(index + 1) % cercle.length].nom
  ])];
});

function openDialog() {
  if (!props.choixrenard || !joueursVivants.value.length) return;
  joueurChoisi.value = '';
  renardDialog.value?.showModal();
}

function closeDialog() {
  renardDialog.value?.close();
}

function repondre(presenceLoup) {
  if (!joueurChoisi.value) return;
  emit('flair-result', presenceLoup);
  closeDialog();
}
</script>

<style scoped>
.bouton-renard {
  padding: 0;
  border: 0;
  background: transparent;
}

.bouton-renard:disabled {
  cursor: default;
}

.renard-dialog {
  position: fixed;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
  width: min(90vw, 440px);
  padding: 1.5rem;
  border: 1px solid #d6a943;
  border-radius: 12px;
  background: #171717;
  color: #f5f0e6;
  box-shadow: 0 12px 40px #0009;
}

.renard-dialog::backdrop {
  background: #0009;
}

.renard-dialog label,
.renard-dialog select {
  display: block;
  width: 100%;
}

.renard-dialog select {
  margin-top: 0.4rem;
  padding: 0.55rem;
}

.renard-fermer {
  float: right;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 1.6rem;
  cursor: pointer;
}

.renard-question {
  font-weight: 700;
}

.renard-voisins {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  list-style: none;
}

.renard-voisins li {
  padding: 0.35rem 0.6rem;
  border: 1px solid #777;
  border-radius: 999px;
}

.renard-voisins .renard-cible {
  border-color: #d6a943;
  color: #ffd56a;
}

.renard-reponses {
  display: flex;
  gap: 0.75rem;
}

.renard-reponses button {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid #d6a943;
  border-radius: 6px;
  background: #302817;
  color: inherit;
  cursor: pointer;
}

.renard-aide {
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>
