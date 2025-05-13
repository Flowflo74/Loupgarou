// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Importez vos composants de pages
import Hub from '@/views/Hub.vue'
import loupGarou from '@/views/loupGarou.vue'
import Poker from '@/views/Poker.vue'



const routes = [
  {
    path: '/',
    name: 'Hub',
    component: Hub
  },
  {
    path: '/loupGarou',
    name: 'loupGarou',
    component: loupGarou
  },
  {
    path: '/Poker',
    name: 'Poker',
    component: Poker
  },
  // ajoutez d'autres routes ici
]

const router = createRouter({
  history: createWebHistory(), // utilise l’API History (URLs "propres")
  routes
})

export default router