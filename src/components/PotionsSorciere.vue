<template>
  <div class="potions-sorciere">
    <img
      class="position-logo"
      :src="props.potionVieDispo ? '/logospouvoirs/healthpotion.png' : '/logospouvoirs/potionviecroix.png'"
      :title="props.potionVieDispo ? 'Utiliser la potion de vie' : 'Potion de vie déjà utilisée'"
      @click="!props.potionVieDispo || emit('use-vie')"
    />
    <button class="bouton" @click="openDialog">
    <img
      class="position-logo"
      :src="props.potionMortDispo ? '/logospouvoirs/deathpotion.png' : '/logospouvoirs/potionmortcroix.png'"
      :title="props.potionMortDispo ? 'Utiliser la potion de mort' : 'Potion de mort déjà utilisée'"
      @click="!props.potionMortDispo || emit('use-mort')"
    /></button>
    <dialog ref="testDialog">
    <p>La sorcière choisi sa victime</p>
    <div>
      <label for="nomvictimesor" class="font-semibold w-24">La victime de la sorcière est</label>
      <input
        id="victimSorName"
        v-model="victimSorName"
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
import { ref, defineProps, defineEmits } from "vue";


const props = defineProps({
  potionVieDispo: Boolean,
  potionMortDispo: Boolean
});

const testDialog = ref(null);
const victimSorName = ref("");
const emit = defineEmits(["use-vie", "use-mort", "sor-victim-selected"]);

function openDialog() {
  victimSorName.value = ""; // Réinitialise le champ à chaque ouverture
  testDialog.value.showModal();
}
function validate() {
  emit("sor-victim-selected", victimSorName.value);
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
</style>