<template>
  <button class="bouton" @click="openDialog">
    <img class="position-logo" src="/src/assets/assets-projet/logoperso/pouvoirflute.png" alt="pouvoirflute" title="Qui a charmé le flutiste ?">
  </button>
  <dialog ref="testDialog">
    <button class="close-btn" @click="closeDialog" title="Fermer">&times;</button>
    <p>Qui a été charmé par la douce mélodie ?</p>
    <form @submit.prevent="validate">
      <div class="liste-charmes">
        <label
          v-for="joueur in props.joueurs"
          :key="joueur.nom"
          class="charm-label"
        >
          <input
            type="checkbox"
            :value="joueur.nom"
            v-model="charmesLocaux"
          />
          {{ joueur.nom }}
          <span v-if="charmesLocaux.includes(joueur.nom)" class="charm-icon">🎶</span>
        </label>
      </div>
      <button type="submit">Valider</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const props = defineProps({
  joueurs: Array,
  charmes: Array
});
const emit = defineEmits(["update-charmes"]);
const testDialog = ref(null);
const charmesLocaux = ref([]);

function openDialog() {
  charmesLocaux.value = [...props.charmes];
  testDialog.value.showModal();
}
function closeDialog() {
  testDialog.value.close();
}
function validate() {
  emit("update-charmes", [...charmesLocaux.value]);
  testDialog.value.close();
}
</script>

<style>
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
dialog label {
  display: block;
  margin-bottom: 0.7rem;
  font-size: 1.1rem;
  color: #ffae00;
}
dialog input[type="text"], dialog select {
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
.liste-charmes {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  align-items: flex-start;
  margin: 1rem 0;
}
.charm-label {
  font-size: 1.15rem;
  color: #ffae00;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.charm-icon {
  font-size: 1.3rem;
  margin-left: 0.3rem;
}
</style>