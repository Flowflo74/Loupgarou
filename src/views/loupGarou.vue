<template>
    <div class="loup-garou-app" :class="phase === 'day' ? 'day-theme' : 'night-theme'">

      <header>
        <h1>Interface Loup-Garou v1.1</h1>
       
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
                <li v-for="card in [...loupGarouCards, ...solitaireCards]" :key="card.name + '-lgsol'" @click="addCard(card)">
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
              <div class="potions-sorciere">
                <img
                  class="position-logo potion-vie"
                  :src="potionVieDispo ? '/logospouvoirs/healthpotion.png' : '/logospouvoirs/potionviecroix.png'"
                  :title="potionVieDispo ? 'Utiliser la potion de vie' : 'Potion de vie déjà utilisée'"
                  @click="potionVieDispo = false"
                />
                <img
                  class="position-logo potion-mort"
                  :src="potionMortDispo ? '/logospouvoirs/deathpotion.png' : '/logospouvoirs/potionmortcroix.png'"
                  :title="potionMortDispo ? 'Utiliser la potion de mort' : 'Potion de mort déjà utilisée'"
                  @click="potionMortDispo = false"
                />
              </div>
            </template>

            <!-- Logos tête de lg pour la victime -->
            <template v-if="card.name === 'Loup-garou'">
              <div class="position-logo victimelg">
                <!-- teeeeeeest -->
                <LoupGarouButton />
<!-- fin du bouton de test -->
                <img
                  v-if="choixvictimelg"
                  class="position-logo victimelg"
                  src="../assets/assets-projet/logoperso/victimelg.png"
                  title="Choisir la victime"
                  @click="victimLGDialog.value.showModal()"/>
              </div>
            </template>
           <!-- Logos bouclier pour le salva -->
            <template v-if="card.name === 'Salvateur'">
              <div class="position-logo boucliersalva">
                <img
                  v-if="choixsalvateur"
                  class="position-logo boucliersalva"
                  src="../assets/assets-projet/logoperso/salvabouclierlogo.png"
                  title="Choisir la personne à protéger"
                  @click="choixsalvateur = false"/>
              </div>
            </template>
            <!-- Logos renard pour le pouvoir du renard -->
            <template v-if="card.name === 'Renard'">
              <div class="position-logo renard">
                <img
                  class="position-logo renard"
                  :src="choixrenard ? '/logospouvoirs/flairrenardlogo.png' : '/logospouvoirs/renardcroix.png'"
                  title="Choisir la personne à flairer"
                  @click="choixrenard = false"/>
              </div>          
            </template>
            <!-- logo pour pour le pouvoir du joueur de flute -->
            <template v-if="card.name === 'Joueur de flute'">
              <div class="position-logo Joueur de flute">
                <img
                  v-if="pouvoirflute"
                  class="position-logo Joueur de flute"
                  src="../assets/assets-projet/logoperso/pouvoirflute.png"
                  title="Le joueur de flute peut choisir 1/2 joueurs à charmer"
                  @click="pouvoirflute = false"/>
              </div>
            </template>

          </li>
        </ul>
        <button class="btn-next-phase" @click="nextPhase">Passer au jour</button>
      </section>
  
      <!-- Phase : élimination de la nuit -->
      <section v-if="phase === 'night-elim'" class="phase-nuit-elim">
        <h2>💀 Qui a été éliminé cette nuit ? 💀</h2>
        <p class="vote">Sélectionne la ou les victimes de la nuit</p>
        <ul class="village-list">
          <li v-for="(card, index) in selectedCards" :key="'nightelim-'+index" class="remaining-card">
            <img src="../assets/assets-projet/autres/tomberip2.png"
                 alt="Exclure" class="exclusion-logo"
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
        <ul class="village-list">
          <li v-for="(card, index) in selectedCards" :key="'vote-'+index" class="remaining-card">
            <img src="../assets/assets-projet/CarteLoupGarou/exclusion.png"
                 alt="Exclure" class="exclusion-logo"
                 @click="removeCard(index)" />
            <LoupGarouCard :lgcard="card" />
          </li>
        </ul>
        <button class="btn-next-phase" @click="nextPhase">Nuit suivante</button>
      </section>
  
      <!-- Résultat -->
      <section v-if="phase === 'end'" class="phase-end">
        <h2>{{ winnerMessage }}</h2>
        <img :src="winnerImage" class="winnerimage"/>
        <button class="nouvellepartie" @click="nouvellepartie">Nouvelle partie</button>
      </section>
  
      <!-- Footer persistent -->
      <footer v-if="phase !== 'end'" class="footer">
        <router-link to="/"><button class="btn-retour-accueil">Accueil</button></router-link>
        <p>AMELINE-BOLLES Florian x L'école de la station</p>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import data from '@/data/cartes.json'
  import LoupGarouCard from '@/components/LoupGarouCard.vue'
  import LoupGarouButton from '@/components/LoupGarouButton.vue'
  
  // Etat
  const allCards = data
  const selectedCards = ref([])
  const phase = ref('selection')
  const dayCount = ref(0)
  const nightCount = ref(0)
  const visible = ref(false)
  const winnerMessage = ref('')
  const winnerImage = ref('')
  const victimName = ref('')
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
        // Après l'élimination de la nuit, on passe au jour
        dayCount.value += 1
        phase.value = 'day'
        visible.value = true
        break
      case 'day':
        nightCount.value += 1
        phase.value = 'night'
        visible.value = false
        break
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
  }

  // ça c'est pour les logos à côté des cartes
  const potionVieDispo = ref(true)
  const potionMortDispo = ref(true)

  const choixvictimelg = ref(true)
  const choixsalvateur = ref(true)
  const choixrenard = ref(true)
  const pouvoirflute = ref(true)
  
// test pour la popup
  const testDialog = ref(null)
function openDialog() {
  testDialog.value.showModal()
}
  </script>
  
  <style scoped>
  /* Thèmes Jour / Nuit */
  .day-theme { background: url('../assets/assets-projet/dabo/1.png') center/cover no-repeat; }
  .night-theme { background: url('../assets/assets-projet/dabo/1.png') center/cover no-repeat; }
  .loup-garou-app { min-height: 100vh; color: #fff; font-family: 'Roboto', sans-serif; }
  
  /* Containers */
  .selection-phase .cartes-container {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    gap: 2rem;
  }
  .cartes-list { flex: 1; }
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
    gap:0.5rem;
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
  .appel-info { flex: 1; }
  .dire { font-weight: bold; color: #ffae00; margin-bottom: 0.25rem; font-size: 1.2rem; }
  .description { font-style: italic; font-size: small;}

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
  .btn-lancer-partie { background: linear-gradient(90deg, #ffae00, #ffec70 100%); color: #fff; }
  .btn-next-phase { background: #192232; color: #ffae00; }
  .btn-phase-jour { background: linear-gradient(90deg, #ffec70, #ffae00); color: #192232; }
  .btn-retour-accueil { display: inline-block;background: transparent; border: 2px solid #ffae00; color: #ffae00; }
  .nouvellepartie { background: linear-gradient(90deg, #ffec70, #ffae00); color: #192232; }
  
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

.selection-perso, .vote {
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
  
  /* Footer */
  .footer { text-align: center; padding: 1rem; }

  </style>
