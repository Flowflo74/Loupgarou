<template>
  <div>
    <button class="bouton" @click="openDialog" :disabled="!props.pouvoirMoineDispo">
      <img
        class="position-logo"
        :src="props.pouvoirMoineDispo ? '/logospouvoirs/healthpotion2.png' : '/logospouvoirs/potionviecroix2.png'"
        :title="props.pouvoirMoineDispo ? 'Utiliser le pouvoir du Moine' : 'Pouvoir déjà utilisé'"
        :style="{ opacity: props.pouvoirMoineDispo ? 1 : 0.5 }"
      />
    </button>

    <dialog ref="moineDialog">
      <form @submit.prevent="validate">
        <p>Le Moine choisit qui sauver</p>
        <div>
          <label for="moineSaveName" class="font-semibold w-24">Personne à sauver :</label>
          <select id="moineSaveName" v-model="moineSaveName" required>
            <option value="" disabled>Choisir un joueur</option>
            <option v-for="joueur in props.joueurs" :key="joueur.nom" :value="joueur.nom">
              {{ joueur.nom }}
            </option>
          </select>
        </div>
        <div style="margin-top:1rem; display:flex; gap:.5rem; justify-content:center;">
          <button type="button" @click="closeDialog">Annuler</button>
          <button type="submit">Valider</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  joueurs: { type: Array, default: () => [] },
  pouvoirMoineDispo: { type: Boolean, default: true }
});
const emit = defineEmits(["moine-save"]);

const moineDialog = ref(null);
const moineSaveName = ref("");

function openDialog() {
  if (!props.pouvoirMoineDispo) return;
  moineSaveName.value = "";
  if (moineDialog.value && typeof moineDialog.value.showModal === 'function') {
    moineDialog.value.showModal();
  } else {
    // fallback : focus la sélection si dialog natif non supporté
  }
}
function closeDialog() {
  if (moineDialog.value && typeof moineDialog.value.close === 'function') {
    moineDialog.value.close();
  }
}
function validate() {
  // si required, le navigateur empêche l'appel si rien n'est choisi
  emit("moine-save", moineSaveName.value);
  closeDialog();
}
</script>

<style scoped>
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
button.bouton {
  background-color: transparent;
  border: none;
  cursor: pointer;
}
dialog {
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