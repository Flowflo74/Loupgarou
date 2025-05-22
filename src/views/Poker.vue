<template>
    <h1>On test des trucs ici</h1>
    
    <p>Nombre de joueurs : {{ count }}</p>
    <div v-show="count > 14">Maximum de joueurs atteint</div>
<button @click="increment">Plus</button>
<button @click="decrement">Moins</button>
<br>

<!-- test de bouton pop up  -->
<button @click="openDialog">Ouvrir la pop-up</button>
<dialog ref="testDialog">
  <p>Ceci est un test de pop-up</p>
  <div>
        <label for="nomvictime" class="font-semibold w-24">La victime est </label>
        <input id="victimName" v-model="victimName" type="text" class="flex-auto" autocomplete="off" />
    </div>
  <button @click="testDialog.close()">Valider</button>
</dialog>


<!-- Bouton de lancement de la partie -->
<button id="lancerlapartie" class="lancerlapartie" @click="lancerLaPartie">Lancer la partie</button>

<!-- Liste des cartes en liste -->
<div class="boxtest">
<ul id="listedescartes" v-if="!partieLancee">
    <li v-for="card in data" :key="card.id" @click="addcard(card)"><LoupGarouCard :lgcard="card"/></li>
</ul>
</div>

<!-- bouton de retour à l'accueil -->
    <div class="retouraccueil">
<router-link to="/" class="retouraccueil">
    <button class="btn-retouraccueil">Retour à l'accueil</button>
</router-link>
</div>
</template>

<!-- /////////////////////////////////////////////////////////// -->

<script setup>
import { ref } from 'vue'
import data from '@/data/cartes.json'
import LoupGarouCard from '@/components/LoupGarouCard.vue'

const count = ref(0)
const increment = () => {
    count.value++
}
const decrement = () => {
    if (count.value--) {
    
    }
}
const lancerLaPartie = () => {
    partieLancee.value = true
}
const partieLancee = ref(false)

const testDialog = ref(null)
function openDialog() {
  testDialog.value.showModal()
}

const victimName = ref('')
</script>

<!-- ///////////////////////////////////////////////////////// -->
 
<style scoped>

.retouraccueil {
    text-align: center;
    margin-top: 50px;
    font-size: 1rem;
    padding: 10px 20px;
    border-radius: 5px;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.retouraccueil:hover {
    transform: scale(1.05);
}
.btn-retouraccueil {
    font-size: 1.2rem;
    background: #192232;
    color: #ffae00;
    border: 2px solid #ffae00;
    border-radius: 18px;
    font-weight: bold;
    padding: 12px 36px;
    margin-top: 24px;
    cursor: pointer;
    box-shadow: 0 0 12px #ffae0055, 0 2px 8px #000a;
    transition: 
        background 0.2s, 
        color 0.2s, 
        border-color 0.2s, 
        box-shadow 0.2s, 
        transform 0.18s;
    letter-spacing: 1px;
}

.btn-retouraccueil:hover {
    background: linear-gradient(90deg, #ffae00 0%, #ffec70 100%);
    color: #192232;
    border-color: #fff700;
    box-shadow: 0 0 24px #fff700cc, 0 4px 16px #ffae0033;
    transform: scale(1.07);
    text-shadow: 0 0 8px #fff70099;
}
</style>