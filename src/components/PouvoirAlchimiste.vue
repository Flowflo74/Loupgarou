<template>
  <div class="potion-alchimiste">
    
    <button class="bouton" @click="openDialog" :disabled="!props.potionMortDispo">
      <img
        class="position-logo"
        :src="props.potionMortDispo ? '/logospouvoirs/deathpotion.png' : '/logospouvoirs/potionmortcroix.png'"
        :title="props.potionMortDispo ? 'Utiliser la potion de mort' : 'Potion de mort déjà utilisée'"
        :style="{ opacity: props.potionMortDispo ? 1 : 0.5 }"
        @click="!props.potionMortDispo || emit('use-mort')"
      />
    </button>
    <dialog ref="testDialog">
      <p>L'alchimiste choisit sa victime</p>
      <div>
        <label for="victimAlchimiste" class="font-semibold w-24">La victime est</label>
        <input
          id="victimAlchimiste"
          v-model="victimAlchimiste"
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
  potionMortDispo: Boolean
});

const testDialog = ref(null);
const victimAlchimiste = ref("");
const emit = defineEmits(["use-mort", "alch-victim-selected"]);

function openDialog() {
  victimAlchimiste.value = ""; // Réinitialise le champ à chaque ouverture
  testDialog.value.showModal();
}
function validate() {
  emit("alch-victim-selected", victimAlchimiste.value);
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