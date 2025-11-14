<template>
  <button class="bouton" @click="openDialog">
    <img class="position-logo" src="/logospouvoirs/pouvoirchienloup.png" alt="Pouvoir du Chien-Loup" />
  </button>
  <dialog ref="chienLoupDialog">
    <button class="close-btn" @click="closeDialog" title="Fermer">&times;</button>
    <form @submit.prevent="validate">
      <div>
        <label for="nomChienLoup">Qui est le Chien-Loup ?</label>
        <select id="nomChienLoup" v-model="nomChienLoup" required>
          <option value="" disabled>Choisir un joueur</option>
          <option v-for="joueur in joueurs" :key="joueur.nom" :value="joueur.nom">{{ joueur.nom }}</option>
        </select>
      </div>
      <div v-if="nomChienLoup" style="margin-top:1em;">
        <label>Quel camp rejoint-il ?</label>
        <div>
          <label>
            <input type="radio" value="Villageois" v-model="camp" required />
            Villageois
          </label>
          <label style="margin-left:1.5em;">
            <input type="radio" value="Loup-garou" v-model="camp" required />
            Loup-garou
          </label>
        </div>
      </div>
      <button type="submit" style="margin-top:1.2em;">Valider</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
const props = defineProps({ joueurs: Array });
const emit = defineEmits(["chienloup-init"]);

const nomChienLoup = ref("");
const camp = ref("");
const chienLoupDialog = ref(null);

function openDialog() {
  chienLoupDialog.value.showModal();
}
function closeDialog() {
  chienLoupDialog.value.close();
}
function validate() {
  emit("chienloup-init", { nomChienLoup: nomChienLoup.value, camp: camp.value });
  chienLoupDialog.value.close();
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
  border: none;
  border-radius: 16px;
  padding: 2rem 2.5rem;
  background: #232323;
  color: #fff;
  box-shadow: 0 8px 32px #000a;
  min-width: 320px;
  text-align: center;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 14px;
  background: transparent;
  border: none;
  font-size: 1.15rem;
  color: #ffae00bb;
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
dialog::backdrop {
  background: rgba(0,0,0,0.55);
}
</style>