<template>
  <div class="loup-garou-app" :class="phase === 'day' ? 'day-theme' : 'night-theme'">

    <header>
      <h1>Interface Loup-Garou v1</h1>

    </header>

    <section v-if="phase === 'selection'" class="selection-phase">
      <p class="selection-perso">Sélectionne les personnages de la partie</p>

      <button class="btn-lancer-partie" @click="startGame" :disabled="!selectedCards.length">
        Lancer la partie
      </button>

      <div class="cartes-selectionnees">
        <p class="label">Cartes sélectionnées</p>
        <ul>
          <li v-for="(card, index) in selectedCards" :key="index" @click="removeCard(index)">
            <LoupGarouCard :lgcard="card" />
          </li>
        </ul>
      </div>
      <div class="cartes-container">
        <div class="cartes-list-2col">
          <div class="cartes-colonne">
            <p class="label">Villageois</p>
            <ul>
              <li v-for="card in villageoisCards" :key="card.name + '-v'" @click="addCard(card)">
                <LoupGarouCard :lgcard="card" />
              </li>
            </ul>
          </div>
          <div class="cartes-colonne">
            <p class="label">Loups-garous & Solitaires</p>
            <ul>
              <li v-for="card in [...loupGarouCards, ...solitaireCards]" :key="card.name + '-lgsol'"
                @click="addCard(card)">
                <LoupGarouCard :lgcard="card" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Préparation : première nuit -->
    <section v-if="phase === 'prep'" class="phase-nuit">
      <h2>Préparation de la première nuit</h2>
      <ul class="appel-list">
        <li v-for="card in prepCards" :key="card.name + '-prep'" class="appel-row">
          <LoupGarouCard :lgcard="card" />
          <div class="appel-info">
            <p class="dire"><strong>Meneur :</strong> {{ card.dire }}</p>
            <p class="description">{{ card.description }}</p>
          </div>
          
          <!-- Logo pouvoir ancien -->
          <template v-if="card.name === 'Ancien'">
            <PouvoirAncien @ancienduvillage="setAncien" />
          </template>

          <!-- Logo pouvoir Enfant Sauvage -->
          <template v-if="card.name === 'Enfant Sauvage'">
            <PouvoirEnfantSauvage @mentorduvillage="setMentor" />
          </template>

          <!-- Logos pouvoir cupidon -->
          <template v-if="card.name === 'Cupidon'">
            <PouvoirCupidon @inlove1="setAmoureux" />
          </template>

        </li>
      </ul>
      <button class="btn-next-phase" @click="nextPhase">Commencer la nuit</button>
    </section>

    <!-- Nuit active (appel des rôles) -->
    <section v-if="phase === 'night'" class="phase-nuit">
      <h2>🌙 Nuit {{ nightCount }}</h2>
      <ul class="appel-list">
        <li v-for="card in nightCards" :key="card.name + '-night'" class="appel-row">
          <LoupGarouCard :lgcard="card" />
          <div class="appel-info">
            <p class="dire"><strong>Meneur :</strong> {{ card.dire }}</p>
            <p class="description">{{ card.description }}</p>
          </div>

          <!-- Logos potions pour la Sorcière -->
          <template v-if="card.name === 'Sorciere'">
            <PotionsSorciere
            @sor-victim-selected="victimSorName = $event" 
            :potion-vie-dispo="potionVieDispo" :potion-mort-dispo="potionMortDispo"
              @use-vie="potionVieDispo = false" @use-mort="potionMortDispo = false" />
          </template>

          <!-- Logos tête de lg pour la victime -->
          <template v-if="card.name === 'Loup-garou'">
            <div class="position-logo victimelg">
              <!-- teeeeeeest -->
              <LoupGarouButton @victim-selected="victimLGName = $event" />
              
            </div>
          </template>

          <!-- Logo bouclier pour le salva -->
          <template v-if="card.name === 'Salvateur'">
            <PouvoirSalva @protected-person="personneProteger = $event" />
          </template>

          <!-- Logo renard pour le pouvoir du renard -->
          <template v-if="card.name === 'Renard'">
            <PouvoirRenard :choixrenard="choixrenard" @use-flair="choixrenard = false" />
          </template>

          <!-- Logo pour le pouvoir de la servante -->
          <template v-if="card.name === 'Servantedevouee'">
            <PouvoirServante @servante-choix="choixServante = $event" />
          </template>
          <!-- logo pour pour le pouvoir du joueur de flute -->
          <template v-if="card.name === 'Joueur de flute'">
            <div class="position-logo Joueur de flute">
              <img v-if="pouvoirflute" class="position-logo Joueur de flute"
                src="../assets/assets-projet/logoperso/pouvoirflute.png"
                title="Le joueur de flute peut choisir 1/2 joueurs à charmer" @click="pouvoirflute = false" />
            </div>
          </template>

        </li>
      </ul>
      <button class="btn-next-phase" @click="nextPhase">Passer au jour</button>
    </section>

    <!-- Phase : élimination de la nuit -->
    <section v-if="phase === 'night-elim'" class="phase-nuit-elim">
      <h2>💀 Qui a été éliminé cette nuit ? 💀</h2>
      <p class="vote">Annonce la ou les victimes de la nuit</p>

      <div class="annonces-row">
        <div v-if="nomAncien" class="annonce-block ancien-annonce">
          <strong>L’Ancien du village est :</strong> {{ nomAncien }}
        </div>

        <div v-if="nomMentor" class="annonce-block mentor-annonce">
          <strong>Le mentor du village est :</strong> {{ nomMentor }}
        </div>

        <div v-if="nomAmoureux1" class="annonce-block amoureux-annonce">
          <strong>Les amoureux sont :</strong> {{ nomAmoureux1 }} ➕ {{ nomAmoureux2 }}
        </div>
        <div v-if="choixServante" class="annonce-block servante-annonce">
          <strong>Servante dévouée :</strong>
        <span v-if="choixServante.choix === 'chez-elle'">Elle est restée chez elle.</span>
        <span v-else>Elle est allée chez {{ choixServante.personne }}.</span>
        </div>

        <div v-if="personneProteger" class="annonce-block protected-annonce">
          <strong>La personne protégée est :</strong> {{ personneProteger }}
        </div>
        <div v-if="victimLGName" class="annonce-block victim-annonce">
          <strong>Victime des Loups-garous :</strong> {{ victimLGName }}
        </div>
        <div v-if="victimSorName" class="annonce-block victim-annonce">
          <strong>Victime de la Sorcière :</strong> {{ victimSorName }}
        </div>
      </div>
      <ul class="village-list">
        <li v-for="(card, index) in selectedCards" :key="'nightelim-' + index" class="remaining-card">
          <img src="../assets/assets-projet/autres/tomberip2.png" alt="Exclure" class="exclusion-logo"
            @click="removeCard(index)" />
          <LoupGarouCard :lgcard="card" />
        </li>
      </ul>
      <button class="btn-next-phase" @click="nextPhase">Passer au vote du village</button>
    </section>

    <!-- Jour -->
    <section v-if="phase === 'day'" class="phase-jour">
      <h2>🌕 Jour {{ dayCount }}</h2>
      <p class="vote">Vote du village : Qui a été éliminer par le village ?</p>
      <div class="annonces-row">
      <div v-if="nomAncien" class="annonce-block ancien-annonce">
          <strong>L’Ancien du village est :</strong> {{ nomAncien }}
        </div>
      <div v-if="nomAmoureux1" class="annonce-block amoureux-annonce">
        <strong>Les amoureux sont :</strong> ❤ {{ nomAmoureux1 }} ➕ {{ nomAmoureux2 }} ❤
      </div>
      </div>
      <ul class="village-list">
        <li v-for="(card, index) in selectedCards" :key="'vote-' + index" class="remaining-card">
          <img src="../assets/assets-projet/CarteLoupGarou/exclusion.png" alt="Exclure" class="exclusion-logo"
            @click="removeCard(index)" />
          <LoupGarouCard :lgcard="card" />
        </li>
      </ul>
      <button class="btn-next-phase" @click="nextPhase">Nuit suivante</button>
    </section>

    <!-- Résultat -->
    <section v-if="phase === 'end'" class="phase-end">
      <h2>{{ winnerMessage }}</h2>
      <img :src="winnerImage" class="winnerimage" />
      <button class="nouvellepartie" @click="nouvellepartie">Nouvelle partie</button>
    </section>

    <!-- Footer persistent -->
    <footer v-if="phase !== 'end'" class="footer">
      <router-link to="/"><button class="btn-retour-accueil">Accueil</button></router-link>
      <p>AMELINE-BOLLES Florian x L'école de la station</p>
    </footer>

    <div v-if="transitioning" class="transition-overlay">
      <span>{{ transitionText }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import data from '@/data/cartes.json'
import LoupGarouCard from '@/components/LoupGarouCard.vue'
import LoupGarouButton from '@/components/LoupGarouButton.vue'
import PotionsSorciere from '@/components/PotionsSorciere.vue'
import PouvoirRenard from '@/components/PouvoirRenard.vue'
import PouvoirSalva from '@/components/PouvoirSalva.vue'
import PouvoirCupidon from '@/components/PouvoirCupidon.vue'
import PouvoirAncien from '@/components/PouvoirAncien.vue'
import PouvoirEnfantSauvage from '../components/PouvoirEnfantSauvage.vue'
import PouvoirServante from '../components/PouvoirServante.vue'

// Etat
const allCards = data
const selectedCards = ref([])
const phase = ref('selection')
const dayCount = ref(0)
const nightCount = ref(0)
const visible = ref(false)
const winnerMessage = ref('')
const winnerImage = ref('')
const victimLGName = ref('')
const victimeSorName = ref('')
const nomAncien = ref('')
const transitioning = ref(false);
const transitionText = ref("🌞 Le village se réveille...")
// Computed
const prepCards = computed(() =>
  selectedCards.value
    .filter(c => c.onlyFirstNight)
    .sort((a, b) => a.order - b.order)
)
const nightCards = computed(() =>
  selectedCards.value
    .filter(c => c.isCallable)
    .sort((a, b) => a.order - b.order)
)
const villageoisCards = computed(() =>
  allCards.filter(c => c.categorie === 'Villageois')
)
const loupGarouCards = computed(() =>
  allCards.filter(c => c.categorie === 'Loup-garou')
)
const solitaireCards = computed(() =>
  allCards.filter(c => c.categorie === 'Solitaire')
)

// Actions
function addCard(card) {
  // Autorise les doublons
  selectedCards.value.push({ ...card })
}
function removeCard(index) {
  const removed = selectedCards.value[index]
  selectedCards.value.splice(index, 1)

  // Victoire de l'Ange uniquement s'il est éliminé au premier jour (après la première nuit)
  if (
    phase.value === 'day' &&
    removed.name === 'Ange' &&
    dayCount.value === 1
  ) {
    phase.value = 'end'
    winnerMessage.value = "L'Ange a été éliminé lors du premier jour et remporte la partie !"
    winnerImage.value = '/victoire/victoireange.jpg'
  }
}

function startGame() {
  if (!selectedCards.value.length) return
  phase.value = 'prep'
}

function nextPhase() {
  if (phase.value === 'night') {
    transitionText.value = "🌞 Le village se réveille...";
    transitioning.value = true;
    setTimeout(() => {
      phase.value = 'night-elim';
      transitioning.value = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
    return;
  }
  if (phase.value === 'day') {
    transitionText.value = "🌙 La nuit tombe...";
    transitioning.value = true;
    setTimeout(() => {
      nightCount.value += 1;
      phase.value = 'night';
      visible.value = false;
      victimLGName.value = '';
      personneProteger.value = '';
      victimSorName.value = '';
      transitioning.value = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
    return;
  }
  switch (phase.value) {
    case 'prep':
      nightCount.value = 1;
      phase.value = 'night';
      visible.value = false;
      break;
    case 'night-elim':
      dayCount.value += 1;
      phase.value = 'day';
      visible.value = true;
      break;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Watch for victory
watch(
  selectedCards,
  cards => {
    if (!['night', 'day', 'prep'].includes(phase.value)) return
    const hasWolf = cards.some(c => ['Loup-garou', 'Solitaire'].includes(c.categorie))
    const hasVillager = cards.some(c => c.categorie === 'Villageois')
    if (hasWolf && !hasVillager) {
      phase.value = 'end'
      winnerMessage.value = 'Les Loups-garous remportent la partie !'
      winnerImage.value = '/victoire/victoirelg.jpg'
    } else if (!hasWolf && hasVillager) {
      phase.value = 'end'
      winnerMessage.value = 'Les Villageois remportent la partie !'
      winnerImage.value = '/victoire/victoirevillage.jpg'
    }
  },
  { deep: true }
)

function nouvellepartie() {
  selectedCards.value = []
  phase.value = 'selection'
  dayCount.value = 0
  nightCount.value = 0
  visible.value = false
  potionVieDispo.value = true
  potionMortDispo.value = true
  choixrenard.value = true
}

// ça c'est pour les logos à côté des cartes
const potionVieDispo = ref(true)
const potionMortDispo = ref(true)
const choixvictimelg = ref(true)
const choixsalvateur = ref(true)
const choixrenard = ref(true)
const pouvoirflute = ref(true)
const nomMentor = ref('');

// test pour la popup
const testDialog = ref(null)
function openDialog() {
  testDialog.value.showModal()
}
const victimeLGName = ref('');
const personneProteger = ref('');
const victimSorName = ref('');
const nomAmoureux1 = ref('');
const nomAmoureux2 = ref('');

function setAmoureux({ nomAmoureux1: n1, nomAmoureux2: n2 }) {
  nomAmoureux1.value = n1;
  nomAmoureux2.value = n2;
}
function setAncien({ nomAncien: n }) {
  nomAncien.value = n;
}
function setMentor({ nomMentor: n }) {
  nomMentor.value = n;
}
</script>

<style scoped>
/* Thèmes Jour / Nuit */
.day-theme {
  background: url('../assets/assets-projet/dabo/1.png') center/cover no-repeat;
}

.night-theme {
  background: url('../assets/assets-projet/dabo/1.png') center/cover no-repeat;
}

/* Containers */
.selection-phase .cartes-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  gap: 2rem;
}

.cartes-list {
  flex: 1;
}

.cartes-list-2col {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}

.cartes-colonne {
  flex: 1 1 0;
  min-width: 220px;
}

.cartes-colonne .label {
  text-align: center;
  margin-bottom: 1rem;
  padding-top: 1rem;
  font-size: x-large;
}

.cartes-colonne ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  justify-content: center;
}

.cartes-selectionnees {
  width: 100%;
  margin-bottom: 2rem;
  text-align: center;
}

.cartes-selectionnees ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
}

.cartes-selectionnees .label {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  padding-top: 0;
}

/* Phases */
.phase-nuit,
.phase-jour,
.phase-end {
  padding: 1rem;
}

h1 {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 0 8px #12003cc7;
  color: #ffae00;
}

h2 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 0 8px #fff70099;
}

/* Listes d'appel */
.appel-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
}

.appel-row {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 0.5rem;
  align-items: center;
  display: flex;
  gap: 0.5rem;
  width: 750px;
  margin: 0 auto;
}

.appel-info {
  flex: 1;
}

.dire {
  font-weight: bold;
  color: #ffae00;
  margin-bottom: 0.25rem;
  font-size: 1.2rem;
}

.description {
  font-style: italic;
  font-size: small;
}

/* liste des cartes restantes du village */
.village-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  padding: 0;
  margin: 0 auto;
}

.remaining-card {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.exclusion-logo {
  width: 50px;
  cursor: pointer;
  transition: transform 0.15s;
}

.exclusion-logo:hover {
  transform: scale(1.15) rotate(-10deg);
  filter: drop-shadow(0 0 8px #ffae00cc);
}

/* Boutons */
.nouvellepartie,
.btn-lancer-partie,
.btn-next-phase,
.btn-phase-jour,
.btn-retour-accueil {
  display: block;
  font-family: inherit;
  margin: 1rem auto;
  padding: 0.75rem 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  letter-spacing: 1px;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s, box-shadow 0.2s, background 0.3s;
}

.btn-lancer-partie {
  background: linear-gradient(90deg, #ffae00, #ffec70 100%);
  color: #fff;
}

.btn-next-phase {
  background: #192232;
  color: #ffae00;
}

.btn-phase-jour {
  background: linear-gradient(90deg, #ffec70, #ffae00);
  color: #192232;
}

.btn-retour-accueil {
  display: inline-block;
  background: transparent;
  border: 2px solid #ffae00;
  color: #ffae00;
}

.nouvellepartie {
  background: linear-gradient(90deg, #ffec70, #ffae00);
  color: #192232;
}

.nouvellepartie:hover,
.btn-lancer-partie:hover,
.btn-next-phase:hover,
.btn-phase-jour:hover,
.btn-retour-accueil:hover,
.btn-lancer-partie:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 30px 0 #fff70099;
  background: linear-gradient(90deg, #ffec70 0%, #ffae00 100%);
  color: #192232;
}

.selection-perso,
.vote {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 2rem;
  text-shadow: 0 0 8px #fff70099;
}

.phase-end {
  text-align: center;
}

.winnerimage {
  width: 300px;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(255, 174, 0, 0.5);
  transition: transform 0.2s, box-shadow 0.2s;
}

/* Footer */
.footer {
  text-align: center;
  padding: 1rem;
}

.annonces-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
  margin: 1.2rem auto 3rem auto;
}

.annonce-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 140px;
  max-width: 220px;
  background: rgba(30, 30, 30, 0.85);
  border-radius: 12px;
  box-shadow: 0 2px 10px #0006, 0 0 0 2px #ffae0033 inset;
  padding: 0.7rem 1.1rem 0.7rem 1.1rem;
  position: relative;
  text-align: center;
  font-size: 1.15rem;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: #fff;
  overflow: hidden;
  transition: transform 0.12s, box-shadow 0.12s;
}
.annonce-block:hover {
  transform: translateY(-2px) scale(1.025);
  box-shadow: 0 4px 16px #ffae0066, 0 0 0 2px #ffae0033 inset;
}

/* Bandeau coloré en haut, plus fin */
.annonce-block::before {
  content: '';
  display: block;
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  border-radius: 12px 12px 0 0;
}
.victim-annonce::before    { background: linear-gradient(90deg, #f40303, #ff6a00); }
.protected-annonce::before { background: linear-gradient(90deg, #659904, #b6ff00); }
.amoureux-annonce::before  { background: linear-gradient(90deg, #ec03f4, #ff17dc); }
.ancien-annonce::before    { background: linear-gradient(90deg, #1d4c04, #ffae00); }
.mentor-annonce::before {
  background: linear-gradient(90deg, #00c3ff, #ffae00);
}
.servante-annonce::before {
  background: linear-gradient(90deg, #00e6b8, #ffae00);
}

/* Emoji pour chaque type */
.victim-annonce strong::before    { content: "💀 "; }
.protected-annonce strong::before { content: "🛡️ "; }
.amoureux-annonce strong::before  { content: "💘 "; }
.ancien-annonce strong::before    { content: "👴 "; }
.mentor-annonce strong::before    {content: "🧑 "; }
.servante-annonce strong::before {
  content: "🧹 ";
}

/* Texte */
.annonce-block strong {
  display: block;
  margin-bottom: 0.3rem;
  font-size: 1.1rem;
  color: #ffae00;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px #000a;
}

.transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(25,34,50,0.85);
  color: #ffae00;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  font-weight: bold;
  z-index: 1000;
  opacity: 0;
  animation: fadeIn 1s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>