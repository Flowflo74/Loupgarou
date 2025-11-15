<template>
  <div>
    <button class="btn-liste-joueurs" @click="show = !show">
      👥
    </button>
    <div v-if="show" class="liste-joueurs-popup">
      <ul>
        <li
          v-for="joueur in joueursTries"
          :key="joueur.nom"
          :class="{ mort: joueur.mort }"
        >
          {{ joueur.nom }}
        </li>
      </ul>
      <button class="close-btn" @click="show = false">Fermer</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from "vue";

const props = defineProps({ joueurs: Array });
const show = ref(false);

const joueursTries = computed(() => [
  ...props.joueurs.filter(j => !j.mort),
  ...props.joueurs.filter(j => j.mort)
]);
</script>

<style scoped>
.btn-liste-joueurs {
  background: linear-gradient(90deg, #ffae00 60%, #ffd966 100%);
  border: none;
  color: #232a4d;
  font-size: 1.08em;
  cursor: pointer;
  padding: 0.4em 1.1em;
  border-radius: 8px;
  font-weight: bold;
  box-shadow: 0 2px 8px #ffae0033;
  transition: background 0.2s, color 0.2s;
}
.btn-liste-joueurs:hover {
  background: linear-gradient(90deg, #ffd966 60%, #ffae00 100%);
  color: #1a2040;
}
.liste-joueurs-popup {
  position: absolute;
  top: 2.5em;
  left: 0;
  background: #232a4d;
  border: 2px solid #ffae00;
  border-radius: 14px;
  box-shadow: 0 8px 32px #ffae0044, 0 2px 12px #0002;
  padding: 1.2em 2em 1.2em 1.2em;
  z-index: 200;
  min-width: 210px;
}
.liste-joueurs-popup ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.liste-joueurs-popup li {
  padding: 0.35em 0.7em;
  margin-bottom: 0.3em;
  border-radius: 7px;
  font-size: 1.08em;
  font-weight: 500;
  color: #ffd966;
  background: #1a2040;
  box-shadow: 0 1px 4px #ffae0022;
  transition: background 0.2s, color 0.2s;
}
.liste-joueurs-popup li.mort {
  color: #fff;
  background: linear-gradient(90deg, #bdbdbd 60%, #ffae00 100%);
  box-shadow: 0 0 12px #ffae0055 inset;
  text-decoration: line-through;
  opacity: 0.85;
}
.close-btn {
  margin-top: 0.7em;
  background: #ffae00;
  border: none;
  border-radius: 6px;
  padding: 0.25em 1.1em;
  cursor: pointer;
  color: #232a4d;
  font-size: 1em;
  float: right;
  font-weight: bold;
  box-shadow: 0 1px 6px #ffae0033;
  transition: background 0.2s, color 0.2s;
}
.close-btn:hover {
  background: #ffd966;
  color: #1a2040;
}
</style>