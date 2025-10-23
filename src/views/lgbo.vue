<template>
    <h1>Loup-Garou de BreakOut v0.1</h1>
    <Boutonfullscreen />
    
    <section v-if="phase === 'selection'" class="selection-phase">
      <p class="selection-perso">Sélectionne les personnages de la partie</p>
      <button class="btn-lancer-partie" @click="startGame" :disabled="!selectedCards.length">
        Lancer la partie
      </button>
      <!-- Liste des joueurs -->
<Listedesjoueurs
  :joueurs="joueurs"
  :phase="phase"
  @update-joueurs="updateJoueurs"
/>
      <!-- Cartes -->
      <div class="cartes-selectionnees">
        <p class="label">Cartes sélectionnées</p>
        <ul>
          <li v-for="(card, index) in selectedCards" :key="index" @click="removeCard(index)">
            <LoupGarouCard :lgcard="card"
             />
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
          <div class="carte-loupgarou" :style="{ backgroundImage: `url('${imageUrl}')` }">
          <div v-if="card.name === 'Ancien' && nomAncien" class="carte-nom-haut"></div> 
          </div>

          <LoupGarouCard :lgcard="card" 
          :nomAncien="card.name === 'Ancien' ? nomAncien : undefined"
/>
          <div class="appel-info">
            <p class="dire"><strong>Meneur :</strong> {{ card.dire }}</p>
            <p class="description">{{ card.description }}</p>
          </div>
          
          <!-- Logo pouvoir ancien -->
          <template v-if="card.name === 'Ancien'">
            <PouvoirAncien :joueurs="joueurs" @ancienduvillage="setAncien" />
          </template>
          <!-- Logo pouvoir juge -->
          <template v-if="card.name === 'Juge'">
            <PouvoirJuge :joueurs="joueurs" @jugeduvillage="setJuge" />
          </template>
          <!-- Logos potion pour les soeurs -->
          <template v-if="card.name === 'Deux Soeurs'">
            <Pouvoirdeuxsoeurs :joueurs="joueurs" @soeurs="setSoeurs" />
            </template>
          <!-- Logos pouvoir cupidon -->
          <template v-if="card.name === 'Cupidon'">
            <PouvoirCupidon :joueurs="joueurs" @inlove1="setAmoureux" />
          </template>
          <!-- Logo pouvoir chasseur -->
          <template v-if="card.name === 'Chasseur'">
            <PouvoirChasseur :joueurs="joueurs" @chasseurduvillage="setChasseur" />
          </template>
          <!-- Logo pouvoir enfant sauvage -->
          <template v-if="card.name === 'Enfant Sauvage'">
            <PouvoirEnfantSauvage :joueurs="joueurs" @mentorduvillage="setMentor" />
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

          <!-- Logo pouvoir courtisane -->
          <template v-if="card.name === 'Courtisane'">
            <PouvoirCourtisane :joueurs="joueurs" @courtisaneduvillage="setCourtisane" />
          </template>

          <!-- Logos potions pour la Sorcière -->
          <template v-if="card.name === 'Sorciere'">
            <PotionsSorciere
            :joueurs="joueurs"
            @sor-victim-selected="victimSorName = $event" 
            :potion-vie-dispo="potionVieDispo" :potion-mort-dispo="potionMortDispo"
              @use-vie="potionVieDispo = false" @use-mort="potionMortDispo = false" />
          </template>

          <!-- Logo potion pour l'Alchimiste -->
          <template v-if="card.name === 'Alchimiste'">
            <PouvoirAlchimiste
            :joueurs="joueurs"
            :pouvoir-alchi-dispo="pouvoirAlchiDispo"
            @alch-victim-selected="handleAlchimisteVictim"/>
          </template>

          <!-- Logo potion pour le moine -->
          <template v-if="card.name === 'Moine'">
            <PouvoirMoine
              :joueurs="joueurs"
              :pouvoir-moine-dispo="pouvoirMoineDispo"
              @moine-save="handleMoineSave"/>
          </template>

          <!-- Logos tête de lg pour la victime -->
          <template v-if="card.name === 'Loup-garou'">
            <div class="position-logo victimelg">
              <LoupGarouButton :joueurs="joueurs" @victim-selected="victimLGName = $event" />
            </div>
          </template>

          <!-- Logo tête de lg pour l'infecté --> 
          <template v-if="card.name === 'Infect pere des loups'">
              <Pouvoirinfectperedesloups :joueurs="joueurs" @infect-selected="victiminfectLGName = $event" />
          </template>

           <!-- Logo Grand méchant loup --> 
          <template v-if="card.name === 'Grand Mechant Loup'">
              <PouvoirGrandmechantloup :joueurs="joueurs" @victim2-selected="victimGrandLGName = $event" />
          </template>

          <!-- Logo bouclier pour le salva -->
          <template v-if="card.name === 'Salvateur'">
            <PouvoirSalva :joueurs="joueurs" @protected-person="personneProteger = $event" />
          </template>

          <!-- Logo renard pour le pouvoir du renard -->
          <template v-if="card.name === 'Renard'">
            <PouvoirRenard :choixrenard="choixrenard" @use-flair="choixrenard = false" />
          </template>

          <!-- logo pour pour le pouvoir du joueur de flute -->
          <template v-if="card.name === 'Joueur de flute'">                 
            <PouvoirFlute
            :joueurs="joueurs"
            :charmes="joueursCharmes"
            @update-charmes="setCharmes"/>
            </template>

          <!-- Logo potion pour la servante dévouée -->
          <template v-if="card.name === 'Servante devouee'">
            <PouvoirServantedevouee
              :joueurs="joueurs"
              :pouvoirServDispo="pouvoirServDispo"
              @servante-save="handleServanteSave"/>
          </template>


        </li>
      </ul>
      <button class="btn-next-phase" @click="nextPhase">Passer au jour</button>
    </section>

    <!-- Phase : élimination de la nuit -->
    <section v-if="phase === 'night-elim'" class="phase-nuit-elim">
      <h2>💀 Qui a été éliminé cette nuit ? 💀</h2>
<!-- Annonces classiques -->
      <div class="annonces-row">
        <div v-if="nomAncien" class="annonce-block ancien-annonce">
          <strong>L’Ancien du village est :</strong> {{ nomAncien }}
        </div>

        <div v-if="nomMentor" class="annonce-block mentor-annonce">
          <strong>Le mentor de <span class="highlight">{{ nomEnfantSauvage }}</span> est </strong> {{ nomMentor }}
        </div>

        <div v-if="nomAmoureux1" class="annonce-block amoureux-annonce">
          <strong>Les amoureux sont :</strong> {{ nomAmoureux1 }} ➕ {{ nomAmoureux2 }}
        </div>
        <div v-if="personneProteger" class="annonce-block protected-annonce">
          <strong>La personne protégée est :</strong> {{ personneProteger }}
        </div>
        <div v-if="MoineSave" class="annonce-block protected-annonce">
          <strong>La personne sauvé est :</strong> {{ MoineSave }}
        </div>

<!-- Annonces des Victimes -->
        <div class="annonces-row annonces-row-elim">
        <div v-if="victimLGName" class="annonce-block victim-annonce">
          <strong>Victime des Loups-garous :</strong> {{ victimLGName }}
        </div>
        <div v-if="victiminfectLGName" class="annonce-block victim-annonce">
         {{ victiminfectLGName }}<strong> a été infecté !</strong>
        </div>
        <div v-if="victimGrandLGName" class="annonce-block victim-annonce">
          <strong>Victime du grand méchant loup :</strong> {{ victimGrandLGName }}
        </div>
        <div v-if="victimSorName" class="annonce-block victim-annonce">
          <strong>Victime de la Sorcière :</strong> {{ victimSorName }}
        </div>
        <div v-if="victimAlchimiste" class="annonce-block victim-annonce">
          <strong>Victime de l'Alchimiste :</strong> {{ victimAlchimiste }}
        </div>
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
      <Phasedevote
  v-if="phase === 'day'"
  :joueurs="joueurs"
  @update-joueurs="updateJoueurs"
/>
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
          <img src="/public/logospouvoirs/eliminationvote.png" alt="Exclure" class="exclusion-logo"
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
      <Boutonrejouer v-if="phase === 'jour' || phase === 'end'" @rejouer="rejouer" />
    </section>

    <!-- Footer persistent -->
    <footer v-if="phase !== 'end'" class="footer">
      <router-link to="/"><button class="btn-retour-accueil">Accueil</button></router-link>
      <p>AMELINE-BOLLES Florian x L'école de la station</p>
    </footer>

</template>

<!-- /////////////////////////////////////////////////////////// -->

<script setup>
import { ref, computed, watch } from 'vue'
import data from '@/data/cartesbo.json'
import LoupGarouCard from '@/components/LoupGarouCardbo.vue'
import LoupGarouButton from '@/components/LoupGarouButton.vue'
import PotionsSorciere from '@/components/PotionsSorciere.vue'
import PouvoirRenard from '@/components/PouvoirRenard.vue'
import PouvoirSalva from '@/components/PouvoirSalva.vue'
import PouvoirCupidon from '@/components/PouvoirCupidon.vue'
import PouvoirAncien from '@/components/PouvoirAncien.vue'
import PouvoirAlchimiste from '@/components/PouvoirAlchimiste.vue'
import PouvoirMoine from '@/components/PouvoirMoine.vue'
import Boutonfullscreen from '@/components/Boutonfullscreen.vue'
import Listedesjoueurs from '../components/Listedesjoueurs.vue'
import Boutonrejouer from '@/components/Boutonrejouer.vue'
import Phasedevote from '@/components/Phasedevote.vue'
import PouvoirChasseur from '../components/PouvoirChasseur.vue'
import PouvoirEnfantSauvage from '../components/PouvoirEnfantSauvage.vue'
import PouvoirCourtisane from '../components/PouvoirCourtisane.vue'
import Pouvoirdeuxsoeurs from '../components/Pouvoirdeuxsoeurs.vue'
import PouvoirJuge from '../components/PouvoirJuge.vue'
import PouvoirServantedevouee from '../components/PouvoirServantedevouee.vue'
import PouvoirFlute from '@/components/PouvoirFlute.vue'
import Pouvoirinfectperedesloups from '@/components/Pouvoirinfectperedesloups.vue'
import PouvoirGrandmechantloup from '@/components/PouvoirGrandmechantloup.vue'


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
const victiminfectLGName = ref('')
const victimGrandLGName = ref('')
const nomAncien = ref('')
const nomJuge = ref('')

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
/// Lancer une nouvelle partie
function startGame() {
  joueursInitial.value = joueurs.value.map(j => ({ ...j }));
  phase.value = 'prep';
}
///Phases de jeu
function nextPhase() {
  switch (phase.value) {
    case 'prep':
      nightCount.value = 1
      phase.value = 'night'
      visible.value = false
      break
    case 'night':
      phase.value = 'night-elim'
      break
    case 'night-elim':
      dayCount.value += 1
      phase.value = 'day'
      visible.value = true
      break
    case 'day':
      nightCount.value += 1
      phase.value = 'night'
      visible.value = false
      victimLGName.value = ''
      personneProteger.value = ''
      victimSorName.value = ''
      break   
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// On regarde pour la victoire
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



// ça c'est pour les logos à côté des cartes
const pouvoirServDispo = ref(true)
const potionMortDispo = ref(true)
const choixrenard = ref(true)
const pouvoirflute = ref(true)
const joueursCharmes = ref([]);
const nomSoeur1 = ref('');
const nomSoeur2 = ref('');
const personneProteger = ref('');
const victimSorName = ref('');
const nomAmoureux1 = ref('');
const nomAmoureux2 = ref('');
const nomEnfantSauvage = ref('');
const nomCourtisane = ref('');
const choixCourtisane = ref('');
const potionVieDispo = ref('');
const pouvoirMoineDispo = ref('');
const pouvoirAlchiDispo = ref('');
const MoineSave = ref('');
const victimAlchimiste = ref('');


function setAmoureux({ nomAmoureux1: n1, nomAmoureux2: n2 }) {
  nomAmoureux1.value = n1;
  nomAmoureux2.value = n2;
}
function setAncien({ nomAncien: n }) {
  nomAncien.value = n;
}
function setChasseur({ nomChasseur: n }) {
  nomAncien.value = n;
}
function setSoeurs({ nomSoeur1: n1, nomSoeur2: n2 }) {
  nomSoeur1.value = n1;
  nomSoeur2.value = n2;
}
function setMentor({ nomEnfantSauvage: n1, nomMentor: n2 }) {
  nomEnfantSauvage.value = n1;
  nomMentor.value = n2;
}
function setJuge({ nomJuge: nom }) {
  nomJuge.value = nom;
}
function setCourtisane({ nomCourtisane: nom }) {
  choixCourtisane.value = { choix, personne };
  if (!nomCourtisane.value) nomCourtisane.value = nom;
}

function setCharmes(nomsCharmes) {
  joueursCharmes.value = nomsCharmes;
}

function handleMoineSave(joueur) {
  pouvoirMoineDispo.value = false;
  MoineSave.value = joueur;
}

function handleAlchimisteVictim(joueur) {
  pouvoirAlchiDispo.value = false;
  victimAlchimiste.value = joueur;
}
function handleServanteSave(joueur) {
  pouvoirServDispo.value = false;
}

const joueurs = ref([]);
const joueursInitial = ref([]);
function updateJoueurs(list) {
  joueurs.value = list;
}

function rejouer() {
  joueurs.value = joueursInitial.value.map(j => ({ ...j }));
  phase.value = 'selection';
}
</script>

<!-- ///////////////////////////////////////////////////////// -->
 
<style scoped>

@font-face {
  font-family: "NOKAPOLICE";
  src: url("/public/police/Nokapolice.otf") format("opentype");
  font-weight: normal;
  font-style: normal;
}

.loup-garou-app, body {
  font-family: "NOKAPOLICE", Arial, sans-serif;
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

.cartes-colonne ul li {
  flex: 1 1 22%; 
  max-width: 25%;
  min-width: 120px; 
  box-sizing: border-box;
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
  font-family: inherit;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  margin: 1rem auto;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s, box-shadow 0.2s, background 0.3s;
}

.btn-retour-accueil:hover {
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
  margin-top: 5rem;
  background: rgba(25, 34, 50, 0.92);
  border-top: 2px solid #ffae00;
  box-shadow: 0 -2px 16px #000a;
  padding: 1.5rem 0 1rem 0;
  font-size: 1.1rem;
  color: #ffffff;
  text-align: center;
  width: 100%;
}

.annonces-row {
 display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  justify-content: center;
  margin: 1rem auto;
  width: 100%;
  max-width: 900px;
}

.annonces-row-elim {
  margin-top: 1.5rem;
  border-top: 2px ridge #ffae00;
  padding-top: 1.2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  justify-content: center;
  width: 100%;
  max-width: 900px;
}

@media (max-width: 700px) {
  .annonces-row,
  .annonces-row-elim {
    flex-direction: column;
    align-items: stretch;
    max-width: 98vw;
  }
  .annonce-block {
    width: 100%;
    min-width: 0;
    max-width: 100vw;
  }
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
  font-size: 1rem;
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

/* Emoji pour chaque type */
.victim-annonce strong::before    { content: "💀 "; }
.protected-annonce strong::before { content: "🛡️ "; }
.amoureux-annonce strong::before  { content: "💘 "; }
.ancien-annonce strong::before    { content: "👴 "; }

/* Texte */
.annonce-block strong {
  display: block;
  margin-bottom: 0.3rem;
  font-size: 1.05rem;
  color: #ffae00;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px #000a;
}

.carte-nom-haut {
  position: relative;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  text-align: center;
  font-size: 1.2rem;
  color: #ffec70;
  font-weight: bold;
  z-index: 10;
  letter-spacing: 1px;
  padding: 4px 8px;
  background: rgba(25, 34, 50, 0.82); /* Fond sombre semi-transparent */
  border-radius: 8px;
  text-shadow:
    0 2px 8px #000,
    0 0 2px #fff,
    0 0 10px #ffae0099;
  box-shadow: 0 2px 8px #0008;
  pointer-events: none;
}
.carte-loupgarou {
  position: relative;
}
</style>