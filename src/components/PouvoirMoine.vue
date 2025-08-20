<template>
  <div>
    <button class="bouton" @click="openDialog" :disabled="!potionVieDispo">
      <img
        class="position-logo"
        :src="potionVieDispo ? '/logospouvoirs/lifepotion.png' : '/logospouvoirs/potionviecroix.png'"
        :title="potionVieDispo ? 'Utiliser le pouvoir du Moine' : 'Pouvoir déjà utilisé'"
        :style="{ opacity: potionVieDispo ? 1 : 0.5 }"
      />
    </button>
    <dialog ref="moineDialog">
      <p>Le Moine choisit qui sauver</p>
      <div>
        <label for="moineSaveName" class="font-semibold w-24">Personne à sauver :</label>
        <input
          id="moineSaveName"
          v-model="moineSaveName"
          type="text"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <button @click="validate">Valider</button>
    </dialog>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const props = defineProps({
  potionVieDispo: Boolean
});

const moineDialog = ref(null);
const moineSaveName = ref("");
const emit = defineEmits(["moine-save"]);

function openDialog() {
  if (props.potionVieDispo) {
    moineSaveName.value = "";
    moineDialog.value.showModal();
  }
}
function validate() {
  emit("moine-save", moineSaveName.value);
  moineDialog.value.close();
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
</style>