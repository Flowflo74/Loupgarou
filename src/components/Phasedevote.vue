<template>
  <section class="vote-block" aria-labelledby="titre-vote">
    <header class="vote-header">
      <div>
        <h2 id="titre-vote">🗳️ Scrutin du village</h2>
        <p class="vote-intro">Attribuez les voix aux joueurs vivants.</p>
      </div>
      <div class="vote-stats" aria-live="polite">
        <span><strong>{{ joueursVivants.length }}</strong> vivants</span>
        <span><strong>{{ totalVotes }}</strong> voix attribuées</span>
      </div>
    </header>

    <p v-if="joueursVivants.length === 0" class="vote-message">
      Aucun joueur vivant ne peut être soumis au vote.
    </p>
    <ul v-else class="liste-vote">
      <li
        v-for="joueur in joueursVivantsTries"
        :key="joueur.nom"
        :class="{
          leader: !resultatVote && joueur.votes > 0 && joueur.votes === meilleurScore,
          elimine: resultatConfirme && resultatVote?.elimine?.includes(joueur.nom)
        }"
      >
        <div class="joueur-vote-identite">
          <span class="joueur-vote-nom" :class="`nom-camp-${props.campDesJoueurs[joueur.nom] || 'inconnu'}`">{{ joueur.nom }}</span>
          <span v-if="!resultatVote && joueur.votes > 0 && joueur.votes === meilleurScore" class="badge-leader">En tête</span>
          <span v-if="resultatConfirme && resultatVote?.elimine?.includes(joueur.nom)" class="badge-elimine">Éliminé</span>
        </div>
        <div class="vote-counter" :aria-label="`${joueur.votes} voix pour ${joueur.nom}`">
          <button
            type="button"
            :aria-label="`Retirer une voix à ${joueur.nom}`"
            :disabled="Boolean(resultatVote) || joueur.votes <= 0"
            @click="modifierVoix(joueur.nom, -1)"
          >−</button>
          <span class="votes" aria-live="polite">{{ joueur.votes }}</span>
          <button
            type="button"
            :aria-label="`Ajouter une voix à ${joueur.nom}`"
            :disabled="Boolean(resultatVote)"
            @click="modifierVoix(joueur.nom, 1)"
          >+</button>
        </div>
      </li>
    </ul>

    <p v-if="!resultatVote && meilleurScore > 0" class="leader-message" aria-live="polite">
      En tête : {{ leaders.join(', ') }} — {{ meilleurScore }} {{ meilleurScore === 1 ? 'voix' : 'voix' }}
    </p>

    <div v-if="resultatVote" class="resultat-vote" aria-live="polite">
      <template v-if="resultatVote.elimine.length === 1">
        <h3 v-if="!resultatConfirme">Résultat à confirmer</h3>
        <h3 v-else>Vote confirmé</h3>
        <p><strong>{{ resultatVote.elimine[0] }}</strong> est en tête avec {{ resultatVote.score }} voix.</p>
        <p v-if="!resultatConfirme" class="rappel-majorite">La personne en tête est éliminée après confirmation, même sans majorité absolue.</p>
        <p v-else class="confirmation-message">{{ resultatVote.elimine[0] }} a été marqué(e) comme mort(e).</p>
      </template>
      <template v-else-if="resultatVote.elimine.length > 1">
        <h3>{{ resultatConfirme ? 'Égalité confirmée' : 'Égalité au vote' }}</h3>
        <p>{{ resultatVote.elimine.join(' et ') }} sont à égalité avec {{ resultatVote.score }} voix.</p>
        <p v-if="!resultatConfirme">Selon la règle actuelle, tous les joueurs à égalité seront éliminés après confirmation.</p>
        <p v-else class="confirmation-message">Les joueurs à égalité ont été marqués comme morts.</p>
      </template>
      <template v-else>
        <h3>{{ resultatConfirme ? 'Vote confirmé' : 'Aucune voix' }}</h3>
        <p v-if="!resultatConfirme">Aucun vote n'a été attribué : personne ne sera éliminé.</p>
        <p v-else class="confirmation-message">Personne n'est éliminé(e) ce jour.</p>
      </template>

      <button
        v-if="!resultatConfirme"
        type="button"
        class="btn-valider-vote"
        @click="confirmerVote"
      >
        {{ resultatVote.elimine.length === 1 ? `Confirmer l’élimination de ${resultatVote.elimine[0]}` : resultatVote.elimine.length > 1 ? `Confirmer l’élimination des ${resultatVote.elimine.length} joueurs à égalité` : 'Confirmer le résultat (sans élimination)' }}
      </button>
    </div>

    <button
      v-else
      type="button"
      class="btn-valider-vote"
      :disabled="joueursVivants.length === 0"
      @click="preparerResultat"
    >
      Vérifier le résultat du vote
    </button>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  joueurs: { type: Array, default: () => [] },
  campDesJoueurs: { type: Object, default: () => ({}) }
});
const emit = defineEmits(["update-joueurs", "vote-confirme"]);

const resultatVote = ref(null);
const resultatConfirme = ref(false);

const joueursVivants = computed(() => props.joueurs.filter(joueur => !joueur.mort));
const joueursVivantsTries = computed(() => [...joueursVivants.value].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')));
const totalVotes = computed(() => joueursVivants.value.reduce((total, joueur) => total + (Number(joueur.votes) || 0), 0));
const meilleurScore = computed(() => Math.max(0, ...joueursVivants.value.map(joueur => Number(joueur.votes) || 0)));
const leaders = computed(() => meilleurScore.value > 0
  ? joueursVivants.value.filter(joueur => (Number(joueur.votes) || 0) === meilleurScore.value).map(joueur => joueur.nom)
  : []);

function modifierVoix(nom, variation) {
  if (resultatVote.value) return;
  const joueursMisAJour = props.joueurs.map(joueur => {
    if (joueur.nom !== nom || joueur.mort) return joueur;
    return { ...joueur, votes: Math.max(0, (Number(joueur.votes) || 0) + variation) };
  });
  emit("update-joueurs", joueursMisAJour);
}

function preparerResultat() {
  const score = meilleurScore.value;
  resultatVote.value = {
    score,
    elimine: score > 0 ? [...leaders.value] : []
  };
  resultatConfirme.value = false;
}

function confirmerVote() {
  if (!resultatVote.value || resultatConfirme.value) return;
  const nomsElimines = resultatVote.value.elimine;
  emit("update-joueurs", props.joueurs.map(joueur => ({
    ...joueur,
    mort: joueur.mort || nomsElimines.includes(joueur.nom),
    votes: 0
  })));
  emit("vote-confirme", { elimines: nomsElimines, score: resultatVote.value.score });
  resultatConfirme.value = true;
}

function reinitialiserVote() {
  resultatVote.value = null;
  resultatConfirme.value = false;
}
</script>

<style scoped>
.vote-block {
  width: min(900px, calc(100% - 2rem));
  margin: 1.5rem auto 2rem;
  padding: clamp(1rem, 3vw, 2rem);
  box-sizing: border-box;
  border: 1px solid #ffae0066;
  border-radius: 18px;
  background: linear-gradient(145deg, #23243a, #171a2b);
  box-shadow: 0 8px 28px #0008;
  color: #fff;
}
.vote-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.vote-header h2 {
  margin: 0;
  color: #ffae00;
  font-size: clamp(1.4rem, 3vw, 2rem);
}
.vote-intro {
  margin: 0.45rem 0 0;
  color: #d4d7e4;
}
.vote-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
}
.vote-stats span {
  padding: 0.45rem 0.7rem;
  border: 1px solid #ffffff22;
  border-radius: 999px;
  background: #101321;
  white-space: nowrap;
  color: #e4e6ef;
}
.vote-stats strong { color: #ffdc5e; }
.liste-vote {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 310px), 1fr));
  gap: 0.65rem;
  list-style: none;
  margin: 1.25rem 0;
  padding: 0;
}
.liste-vote li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  min-width: 0;
  padding: 0.75rem 0.9rem;
  border: 1px solid #ffffff18;
  border-radius: 12px;
  background: #111522;
  transition: border-color 0.18s, background 0.18s, transform 0.18s;
}
.liste-vote li.leader {
  border-color: #ffae00;
  background: #342a15;
  box-shadow: 0 0 0 1px #ffae0044;
}
.liste-vote li.elimine {
  border-color: #f05b5b;
  background: #421e27;
}
.joueur-vote-identite {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}
.joueur-vote-nom {
  overflow-wrap: anywhere;
  font-weight: 700;
  text-transform: uppercase;
}
.nom-camp-loups {
  color: #ff4b55;
  text-shadow: 0 0 10px rgba(255, 55, 65, 0.32);
}
.nom-camp-solitaires {
  color: #c77dff;
  text-shadow: 0 0 10px rgba(174, 91, 255, 0.34);
}
.badge-leader, .badge-elimine {
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}
.badge-leader { background: #ffae00; color: #171a2b; }
.badge-elimine { background: #e34242; color: #fff; }
.vote-counter { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; }
.vote-counter button {
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: 50%;
  background: #ffae00;
  color: #23243a;
  font-size: 1.35rem;
  font-weight: 800;
  cursor: pointer;
}
.vote-counter button:hover:not(:disabled) { background: #ffe06a; transform: scale(1.05); }
.vote-counter button:disabled { background: #555969; color: #aeb1bb; cursor: not-allowed; }
.votes { min-width: 1.5rem; color: #ffdc5e; font-size: 1.35rem; font-weight: 800; }
.leader-message, .vote-message { text-align: center; color: #ffdc5e; font-weight: 700; }
.resultat-vote {
  margin-top: 1.25rem;
  padding: 1rem;
  border: 1px solid #ffae0080;
  border-radius: 12px;
  background: #101321;
  text-align: center;
}
.resultat-vote h3 { margin: 0 0 0.5rem; color: #ffdc5e; }
.resultat-vote p { margin: 0.45rem 0; }
.rappel-majorite { color: #c4c8d6; font-size: 0.9rem; }
.confirmation-message { color: #a9e67b; font-weight: 700; }
.btn-valider-vote, .btn-recommencer-vote {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-height: 46px;
  margin-top: 0.75rem;
  padding: 0.7rem 1.3rem;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, #ffae00, #ffe06a);
  color: #23243a;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.18s, filter 0.18s;
}
.btn-valider-vote:hover:not(:disabled), .btn-recommencer-vote:hover { transform: translateY(-1px); filter: brightness(1.08); }
.btn-valider-vote:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-recommencer-vote { margin-left: 0.5rem; background: #363b51; color: #fff; }
button:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
@media (max-width: 640px) {
  .vote-header { align-items: stretch; flex-direction: column; }
  .vote-stats { justify-content: flex-start; }
  .liste-vote { grid-template-columns: 1fr; }
  .resultat-vote button { width: 100%; margin-left: 0; }
}
</style>
