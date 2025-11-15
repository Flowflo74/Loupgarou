<template>
  <div class="joueurs-block">
    <h2>Liste des joueurs</h2>
    <form v-if="!isDay" @submit.prevent="addJoueur">
      <input
        v-model="nouveauJoueur"
        type="text"
        placeholder="Nom du joueur"
        class="input-joueur"
        autocomplete="off"
      />
      <button type="submit">Ajouter</button>
    </form>
    <ul class="liste-joueurs multi-colonnes">
      <li v-for="(joueur, idx) in props.joueurs" :key="idx">
        <template v-if="isDay">
          <span>{{ joueur.nom }}</span>
          <div class="vote-counter">
            <button @click="removeVote(idx)" :disabled="joueur.votes === 0">-</button>
            <span class="votes">{{ joueur.votes }}</span>
            <button @click="addVote(idx)">+</button>
          </div>
          <button @click="removeJoueur(idx)" title="Supprimer" class="remove-btn">✖</button>
        </template>
        <template v-else>
          {{ joueur.nom }}
          <button @click="removeJoueur(idx)" title="Supprimer" class="remove-btn">✖</button>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
const props = defineProps({ joueurs: Array, phase: String });
const emit = defineEmits(["update-joueurs"]);
const nouveauJoueur = ref("");

const isDay = computed(() => props.phase === "day");

function addJoueur() {
  if (nouveauJoueur.value.trim()) {
    emit("update-joueurs", [
      ...props.joueurs,
      { nom: nouveauJoueur.value.trim(), votes: 0, mort: false }
    ]);
    nouveauJoueur.value = "";
  }
}
function removeJoueur(idx) {
  const newList = props.joueurs.slice();
  newList.splice(idx, 1);
  emit("update-joueurs", newList);
}
function addVote(idx) {
  props.joueurs[idx].votes++;
}
function removeVote(idx) {
  if (props.joueurs[idx].votes > 0) props.joueurs[idx].votes--;
}
</script>

<style scoped>

.joueurs-block {
  text-align: center;
  max-width: 80%;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #23243a;
  border-radius: 16px;
  box-shadow: 0 4px 24px #000a;
  color: #ffae00;
}
.input-joueur {
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid #888;
  margin-right: 1rem;
  margin-block: 1rem;
  font-size: 1rem;
  background: #181818;
  color: #fff;
}
.liste-joueurs {
  margin-top: 1.2rem;
  padding: 0;
  list-style: none;
}
.liste-joueurs.multi-colonnes {
  column-count: 2;
  column-gap: 1.5rem;
  padding: 0;
  width: auto;
  max-width: 700px; /* ou 100% pour responsive */
  margin: 0 auto;
  min-width: 320px;
}
.liste-joueurs.multi-colonnes li {
  break-inside: avoid;
  margin-bottom: 0.8rem;
  width: 100%;
}
.liste-joueurs li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-transform: uppercase;
  background: #181818;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #fff;
  min-width: 220px;
}
.liste-joueurs li span {
  display: inline-block;
  min-width: 120px; /* largeur fixe pour le nom */
  text-align: left;
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: 500;
  word-break: break-word;
}
.liste-joueurs button {
  background: none;
  border: none;
  color: #ffae00;
  font-size: 1.1rem;
  cursor: pointer;
  margin-left: 1rem;
}
.liste-joueurs button:hover {
  color: #fff700;
}
.vote-counter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
  min-width: 120px; /* largeur fixe pour le compteur */
  justify-content: flex-end;
}
.vote-counter button {
  background: #ffae00;
  border: none;
  color: #23243a;
  font-weight: bold;
  font-size: 1.1rem;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  transition: background 0.2s;
}
.vote-counter button:disabled {
  background: #888;
  color: #ccc;
  cursor: not-allowed;
}
.vote-counter .votes {
  min-width: 24px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff700;
}
.remove-btn {
  background: none;
  border: none;
  color: #ffae00;
  font-size: 1.3rem;
  cursor: pointer;
  margin-left: 1rem;
  transition: color 0.2s;
}
.remove-btn:hover {
  color: #fff700;
}
@media (max-width: 900px) {
  .liste-joueurs.multi-colonnes {
    column-count: 2;
    max-width: 98vw;
  }
}
@media (max-width: 600px) {
  .liste-joueurs.multi-colonnes {
    column-count: 1;
    max-width: 100vw;
  }
}
</style>