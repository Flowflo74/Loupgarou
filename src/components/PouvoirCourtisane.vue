<template>
  <div>
    <button class="bouton" @click="openDialog">
      <img class="position-logo" src="/public/logospouvoirs/pouvoircourtisane.png" alt="pouvoircourtisane" title="Qui est la courtisane ?">
    </button>
    <dialog ref="courtisaneDialog">
      <button class="close-btn" @click="closeDialog" title="Fermer">&times;</button>
      <div v-if="!nomCourtisane">
        <label for="nomcourtisane" class="font-semibold w-24">La courtisane est :</label>
        <select
        id="nomcourtisane"
        v-model="nomCourtisane"
        class="flex-auto">
        <option value="" disabled>Choisir un joueur</option>
        <option v-for="joueur in props.joueurs" :key="joueur.nom" :value="joueur.nom">
          {{ joueur.nom }}
        </option>
      </select>
      </div>
      <div v-else>
        <strong>courtisane : {{ nomCourtisane }}</strong>
      </div>
      <p>Que fait la courtisane dévouée ?</p>
      <div class="choix-courtisane">
        <label>
          <input type="radio" value="chez-elle" v-model="choixCourtisane" />
          Elle reste chez elle
        </label>
        <label>
          <input type="radio" value="autre" v-model="choixCourtisane" />
          Elle va chez quelqu’un d’autre
        </label>
        <input
          v-if="choixCourtisane === 'autre'"
          type="text"
          v-model="nomPersonne"
          placeholder="Nom de la personne"
          class="input-nom"
        />
      </div>
      <button @click="validate">Valider</button>
    </dialog>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from "vue";

const courtisaneDialog = ref(null);
const choixCourtisane = ref("chez-elle");
const nomPersonne = ref("");
const emit = defineEmits(["courtisaneduvillage"]);
const props = defineProps({
  joueurs: Array,
  nomCourtisane: String
});
const nomCourtisane = ref(props.nomCourtisane || "");

function openDialog() {
  choixCourtisane.value = "chez-elle";
  nomPersonne.value = "";
  courtisaneDialog.value.showModal();
}
function closeDialog() {
  courtisaneDialog.value.close();
}
function validate() {
  emit("courtisane-choix", {
    choix: choixCourtisane.value,
    personne: choixCourtisane.value === "autre" ? nomPersonne.value : null,
    nomcourtisane: nomCourtisane.value
  });
  courtisaneDialog.value.close();
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
.choix-courtisane {
  margin: 1.2rem 0;
  text-align: left;
}
.input-nom {
  display: block;
  margin: 0.8rem auto 0 auto;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #888;
  font-size: 1rem;
  background: #181818;
  color: #fff;
  width: 80%;
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
</style>