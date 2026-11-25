<template>
  <div>
    <button class="bouton" @click="openDialog" :disabled="!pouvoirServDispo || !props.cibles.length">
      <img
        class="position-logo"
        :src="pouvoirServDispo ? '/logospouvoirs/pouvoirservante.png' : '/logospouvoirs/servantedevcroix.png'"
        :title="!pouvoirServDispo ? 'Pouvoir déjà utilisé' : props.cibles.length ? 'Choisir une cible des Loups-garous ou du Loup Blanc' : 'Aucune cible désignée par les Loups-garous ou le Loup Blanc'"
        :style="{ opacity: pouvoirServDispo ? 1 : 0.5 }"
      />
    </button>
    <dialog ref="servanteDialog">
      <p v-if="!props.nomServante">Qui est la Servante dévouée ?</p>
      <div v-if="!props.nomServante">
        <label for="nomServante" class="font-semibold w-24">La Servante dévouée est :</label>
        <select id="nomServante" v-model="nomServanteLocale" class="flex-auto" required>
          <option value="" disabled>Choisir un joueur</option>
          <option v-for="joueur in props.joueurs" :key="joueur.nom" :value="joueur.nom">
            {{ joueur.nom }}
          </option>
        </select>
      </div>
      <p>La Servante dévouée souhaite-t-elle prendre la place de <strong>{{ props.cibles[0] }}</strong>, la cible des Loups-garous ?</p>
      <div class="servante-reponses">
        <button type="button" @click="repondre(true)" :disabled="!peutRepondre">Oui</button>
        <button type="button" @click="repondre(false)" :disabled="!peutRepondre">Non</button>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { computed, ref, defineEmits, defineProps } from "vue";

const servanteDialog = ref(null);
const nomServanteLocale = ref("");
const props = defineProps({
  joueurs: { type: Array, default: () => [] },
  cibles: { type: Array, default: () => [] },
  nomServante: { type: String, default: "" },
  pouvoirServDispo: Boolean
});
const emit = defineEmits(["servante-save", "servante-identified"]);
const peutRepondre = computed(() =>
  Boolean(props.cibles.length && (props.nomServante || nomServanteLocale.value))
);

function openDialog() {
  if (props.pouvoirServDispo && props.cibles.length) {
    nomServanteLocale.value = props.nomServante;
    servanteDialog.value.showModal();
  }
}

function repondre(prendreLaPlace) {
  if (!peutRepondre.value) return;
  const nom = props.nomServante || nomServanteLocale.value;
  if (!props.nomServante) emit("servante-identified", nom);
  emit("servante-save", {
    nomServante: nom,
    cibleSauvee: props.cibles[0],
    prendreLaPlace
  });
  servanteDialog.value.close();
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