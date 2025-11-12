<template>
  <button class="bouton" @click="openDialog">
    <img
  class="position-logo"
  src="/logospouvoirs/pouvoirsectaire.png"
  alt="pouvoirsectaire"
  title="Pouvoir du Sectaire"
/>
  </button>
  <dialog ref="sectaireDialog">
    <button class="close-btn" @click="closeDialog" title="Fermer">&times;</button>
    <form @submit.prevent="validate">
      <div v-if="!nomSectaire">
        <label>Qui est le sectaire ?</label>
        <select v-model="nomSectaire" required>
          <option value="" disabled>Choisir un joueur</option>
          <option v-for="joueur in joueurs" :key="joueur.nom" :value="joueur.nom">{{ joueur.nom }}</option>
        </select>
      </div>
      <div v-if="nomSectaire">
        <p>Répartis les joueurs en 2 groupes :</p>
        <div v-for="joueur in joueurs" :key="joueur.nom" style="margin-bottom: 0.5rem;">
          <span>{{ joueur.nom }}</span>
          <label style="margin-left:1em;">
            <input type="radio" :name="'groupe-' + joueur.nom" value="sectaire" v-model="groupes[joueur.nom]" required />
            Groupe du sectaire
          </label>
          <label style="margin-left:1em;">
            <input type="radio" :name="'groupe-' + joueur.nom" value="oppose" v-model="groupes[joueur.nom]" required />
            Groupe opposé
          </label>
        </div>
      </div>
      <button type="submit" style="margin-top:1.2em;">Valider</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
const props = defineProps({ joueurs: Array });
const emit = defineEmits(["sectaire-init"]);

const nomSectaire = ref('');
const groupes = ref({});
const sectaireDialog = ref(null);

function openDialog() {
  sectaireDialog.value.showModal();
}
function closeDialog() {
  sectaireDialog.value.close();
}
function validate() {
  const groupeSectaire = Object.keys(groupes.value).filter(nom => groupes.value[nom] === 'sectaire');
  const groupeOppose = Object.keys(groupes.value).filter(nom => groupes.value[nom] === 'oppose');
  emit('sectaire-init', { nomSectaire: nomSectaire.value, groupeSectaire, groupeOppose });
  sectaireDialog.value.close();
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
  border: none;
  border-radius: 16px;
  padding: 2rem 2.5rem;
  background: #232323;
  color: #fff;
  box-shadow: 0 8px 32px #000a;
  min-width: 320px;
  text-align: center;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 14px;
  background: transparent;
  border: none;
  font-size: 1.15rem;
  color: #ffae00bb;
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
dialog::backdrop {
  background: rgba(0,0,0,0.55);
}
</style>