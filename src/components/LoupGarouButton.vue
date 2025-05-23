<template>
              <!-- teeeeeeest -->
              <button @click="openDialog">Ouvrir la pop-up</button>
              <dialog ref="testDialog">
                <p>Ceci est un test de pop-up</p>
                <div>
                  <label for="nomvictime" class="font-semibold w-24"
                    >La victime est
                  </label>
                  <input
                    id="victimName"
                    v-model="victimName"
                    type="text"
                    class="flex-auto"
                    autocomplete="off"
                  />
                </div>
                <button @click="testDialog.close()">Valider</button>
              </dialog>
              <!-- fin du bouton de test -->
</template>

<script setup>
import { ref } from "vue";

const testDialog = ref(null);
function openDialog() {
  testDialog.value.showModal();
}
</script>
