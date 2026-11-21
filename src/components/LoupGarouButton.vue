<template>
  <!-- teeeeeeest -->
  <button class="bouton" @click="openDialog">
    <img class="position-logo" src="../assets/assets-projet/logoperso/victimelg.png" title="Choisir la victime"></button>
  <dialog ref="loupDialog">
    <button class="close-btn" @click="closeDialog" title="Fermer">&times;</button>
    <template v-if="props.isFirstNight">
      <p>Qui sont les loups-garous&nbsp;?</p>
      <p v-if="props.chienLoupName" class="chien-loup-camp">
        Chien-Loup (camp des Loups-garous) : <strong>{{ props.chienLoupName }}</strong>
      </p>
      <div v-for="i in nombreLoupsAIdentifier" :key="i" style="margin-bottom: 0.7rem;">
        <label :for="'loup-' + i">Loup-garou {{ i }}</label>
        <select
          :id="'loup-' + i"
          v-model="loupsLocaux[i-1]"
          required
        >
          <option value="" disabled>Choisir un joueur</option>
          <option
            v-for="joueur in joueursEligibles"
            :key="joueur.nom"
            :value="joueur.nom"
            :disabled="loupsLocaux.includes(joueur.nom) && loupsLocaux[i - 1] !== joueur.nom"
          >
            {{ joueur.nom }}
          </option>
        </select>
      </div>
      <hr style="margin:1.2em 0;">
    </template>
    <p>Les loups-garous choisissent leur victime</p>
    <div>
      <label for="victimLGName" class="font-semibold w-24">La victime est</label>
      <select
        id="victimLGName"
        v-model="victimLGName"
        class="flex-auto"
        required
      >
        <option value="" disabled>Choisir un joueur</option>
        <option
          v-for="joueur in joueursEligibles"
          :key="joueur.nom"
          :value="joueur.nom"
        >
          {{ joueur.nom }}
        </option>
      </select>
    </div>
    <button @click="validate">Valider</button>
  </dialog>
</template>

<script setup>
import { ref, computed, defineEmits } from "vue";

const props = defineProps({
  joueurs: Array,
  nbLoups: Number,
  isFirstNight: Boolean,
  chienLoupName: String
});
const emit = defineEmits(["loups-selected", "victim-selected"]);
const loupDialog = ref(null);
const victimLGName = ref("");
const loupsLocaux = ref([]); // tableau des noms choisis
const joueursEligibles = computed(() =>
  props.joueurs.filter(joueur => joueur.nom !== props.chienLoupName)
);

const nombreLoupsAIdentifier = computed(() =>
  Math.max(0, props.nbLoups - (props.chienLoupName ? 1 : 0))
);

function openDialog() {
  victimLGName.value = "";
  if (props.isFirstNight) {
    loupsLocaux.value = Array(nombreLoupsAIdentifier.value).fill("");
  }
  loupDialog.value.showModal();
}
function validate() {
  if (props.isFirstNight) {
    emit("loups-selected", [...loupsLocaux.value, ...(props.chienLoupName ? [props.chienLoupName] : [])]);
  }
  emit("victim-selected", victimLGName.value);
  loupDialog.value.close();
}
function closeDialog() {
  loupDialog.value.close();
}
</script>

<style>
.position-logo {
  width: 75px;
  height: 75px;
  margin-right: 10px;
  cursor: pointer;
  transition: transform 0.15s;
}
.position-logo:hover {
  transform: scale(1.15);
}
button.bouton {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

dialog {
  border: none;
  border-radius: 16px;
  padding: 2rem 2.5rem;
  background: #232323;
  color: #fff;
  box-shadow: 0 8px 32px #000a;
  min-width: 320px;
  text-align: center;
}

dialog::backdrop {
  background: rgba(0,0,0,0.55);
}

dialog label {
  display: block;
  margin-bottom: 0.7rem;
  font-size: 1.1rem;
  color: #ffae00;
}

dialog input[type="text"] {
  width: 80%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #888;
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
  background: #181818;
  color: #fff;
}

dialog button {
  margin-top: 1rem;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  border: none;
  background: #ffae00;
  color: #232323;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
dialog button:hover {
  background: #ffd966;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 14px;
  background: transparent;
  border: none;
  font-size: 1.15rem;
  color: #ffae00bb; /* couleur plus douce et semi-transparente */
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
  z-index: 2;
  opacity: 0.7;
}
.close-btn:hover {
  color: #fff;
  background: #ffae0022;
  opacity: 1;
}
</style>