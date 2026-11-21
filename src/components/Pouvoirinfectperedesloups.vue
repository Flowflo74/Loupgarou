<template>
  <button class="bouton" :disabled="!props.pouvoirInfectDispo || !props.victimeLoups || props.choixDejaFait" @click="openDialog">
    <img
      class="position-logo"
      :src="props.pouvoirInfectDispo ? '/logospouvoirs/infectlg.png' : '/logospouvoirs/infectcroix2.png'"
      :title="props.choixDejaFait ? 'Choix de cette nuit enregistré' : props.victimeLoups ? 'Choisir si la victime doit être infectée' : 'En attente du choix des Loups-garous'"
    />
  </button>
  <dialog ref="infectDialog">
    <button class="close-btn" @click="closeDialog" title="Fermer">&times;</button>
    <div v-if="!props.nomInfect">
      <p>Qui est l'infect père des loups ?</p>
      <label for="nom-infect">L'infect père des loups est</label>
      <select id="nom-infect" v-model="nomInfectLocal" required>
        <option value="" disabled>Choisir un joueur</option>
        <option v-for="joueur in joueursEligibles" :key="joueur.nom" :value="joueur.nom">
          {{ joueur.nom }}
        </option>
      </select>
    </div>
    <p>
      {{ props.victimeLoups }} a été ciblé par les Loups-garous.
      {{ props.nomInfect || "L'infect père des loups" }} souhaite-t-il l'infecter plutôt que de la dévorer ?
    </p>
    <div class="choix-infection">
      <label><input v-model="infecter" type="radio" value="oui"> Oui</label>
      <label><input v-model="infecter" type="radio" value="non"> Non</label>
    </div>
    <button :disabled="!infecter || (!props.nomInfect && !nomInfectLocal)" @click="validate">Valider</button>
  </dialog>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  joueurs: { type: Array, default: () => [] },
  nomInfect: { type: String, default: '' },
  victimeLoups: { type: String, default: '' },
  pouvoirInfectDispo: { type: Boolean, default: true },
  choixDejaFait: { type: Boolean, default: false }
});
const emit = defineEmits(['infect-choice']);
const infectDialog = ref(null);
const nomInfectLocal = ref('');
const infecter = ref('');
const joueursEligibles = computed(() => props.joueurs);

function openDialog() {
  if (!props.pouvoirInfectDispo || !props.victimeLoups) return;
  nomInfectLocal.value = props.nomInfect || '';
  infecter.value = '';
  infectDialog.value?.showModal();
}
function validate() {
  if (!infecter.value || (!props.nomInfect && !nomInfectLocal.value)) return;
  emit('infect-choice', {
    nomInfect: props.nomInfect || nomInfectLocal.value,
    victime: props.victimeLoups,
    infecter: infecter.value === 'oui'
  });
  infectDialog.value?.close();
}
function closeDialog() {
  infectDialog.value?.close();
}
</script>

<style>
.position-logo { width: 75px; height: 75px; margin-right: 10px; cursor: pointer; transition: transform 0.15s; }
.position-logo:hover { transform: scale(1.15); }
button.bouton { background: transparent; border: none; cursor: pointer; }
button.bouton:disabled { cursor: not-allowed; opacity: 0.5; }
dialog { border: none; border-radius: 16px; padding: 2rem 2.5rem; background: #232323; color: #fff; box-shadow: 0 8px 32px #000a; min-width: 320px; text-align: center; }
dialog::backdrop { background: rgba(0,0,0,0.55); }
dialog label { display: block; margin-bottom: 0.7rem; font-size: 1.1rem; color: #ffae00; }
dialog select { min-width: 190px; padding: 0.45rem; margin: 0.5rem; }
.choix-infection { display: flex; justify-content: center; gap: 1.5rem; }
.choix-infection label { display: flex; align-items: center; gap: 0.4rem; }
dialog button { margin-top: 1rem; padding: 0.5rem 1.2rem; border-radius: 8px; border: none; background: #ffae00; color: #232323; font-weight: bold; font-size: 1rem; cursor: pointer; }
dialog button:disabled { opacity: 0.5; cursor: not-allowed; }
.close-btn { position: absolute; top: 10px; right: 14px; margin: 0; padding: 0.2rem 0.5rem; background: transparent; border: none; font-size: 1.15rem; color: #ffae00bb; cursor: pointer; }
.close-btn:hover { color: #fff; }
</style>
