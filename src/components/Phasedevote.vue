<template>
  <div class="vote-block">
    <h2>Vote du village</h2>
    <ul class="liste-vote">
      <li v-for="(joueur, idx) in joueursVivants" :key="joueur.nom">
        <span>{{ joueur.nom }}</span>
        <div class="vote-counter">
          <button @click="removeVote(idx)" :disabled="joueur.votes === 0">-</button>
          <span class="votes">{{ joueur.votes }}</span>
          <button @click="addVote(idx)">+</button>
        </div>
        <button @click="eliminerJoueur(idx)" class="remove-btn" title="Éliminer ce joueur">✖</button>
      </li>
    </ul>
    <button class="btn-valider-vote" @click="validerVote">Valider le vote</button>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({ joueurs: Array });
const emit = defineEmits(["update-joueurs"]);

const joueursVivants = computed(() => props.joueurs.filter(j => !j.mort));

function addVote(idx) {
  joueursVivants.value[idx].votes++;
  emit("update-joueurs", props.joueurs);
}
function removeVote(idx) {
  if (joueursVivants.value[idx].votes > 0) {
    joueursVivants.value[idx].votes--;
    emit("update-joueurs", props.joueurs);
  }
}
function eliminerJoueur(idx) {
  joueursVivants.value[idx].mort = true;
  joueursVivants.value[idx].votes = 0;
  emit("update-joueurs", props.joueurs);
}
function validerVote() {
  const maxVotes = Math.max(...joueursVivants.value.map(j => j.votes));
  const elimines = joueursVivants.value.filter(j => j.votes === maxVotes && maxVotes > 0);
  elimines.forEach(j => {
    j.mort = true;
    j.votes = 0;
  });
  emit("update-joueurs", props.joueurs);
}
</script>

<style scoped>
.vote-block {
  text-align: center;
  max-width: 700px;
  margin: 2rem auto;
  background: #23243a;
  border-radius: 16px;
  box-shadow: 0 4px 24px #000a;
  color: #ffae00;
  padding: 2rem 1rem;
}
.liste-vote {
  list-style: none;
  padding: 0;
  margin: 2rem auto;
}
.liste-vote li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #181818;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #fff;
}
.vote-counter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
.btn-valider-vote {
  margin-top: 2rem;
  background: #ffae00;
  color: #23243a;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 25px;
  padding: 0.7rem 2.2rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.btn-valider-vote:hover {
  background: #fff700;
  transform: scale(1.08);
}
</style>