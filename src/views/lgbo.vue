<template>
  
  <h1>Loup-Garou de BreakOut v1.0</h1>
    <Boutonfullscreen />

    <section v-if="phase === 'selection'" class="selection-phase">
      <p class="selection-perso">Sélectionne les personnages de la partie</p>
      <button class="btn-lancer-partie" @click="startGame" :disabled="!peutLancerPartie">
        Lancer la partie
      </button>
      <p v-if="selectedCards.length !== joueurs.length" class="avertissement-comptage" role="status">
        Il faut autant de joueurs inscrits que de cartes sélectionnées ({{ joueurs.length }} joueur{{ joueurs.length === 1 ? '' : 's' }} / {{ selectedCards.length }} carte{{ selectedCards.length === 1 ? '' : 's' }}).
      </p>
      <!-- Liste des joueurs -->
<Listedesjoueurs :joueurs="joueurs" :phase="phase" @update-joueurs="updateJoueurs" />
      <!-- Cartes -->
      <div class="cartes-selectionnees">
        <p class="label">Cartes sélectionnées : {{ selectedCards.length }}</p>
        <ul>
          <li
            v-for="(card, index) in selectedCards"
            :key="card.instanceId"
            role="button"
            tabindex="0"
            :aria-label="`Retirer la carte ${card.name} de la sélection`"
            @click="removeSelectedCard(index)"
            @keydown.enter.prevent="removeSelectedCard(index)"
            @keydown.space.prevent="removeSelectedCard(index)"
          >
            <LoupGarouCard :lgcard="card" />
          </li>
        </ul>
      </div>
      <div class="cartes-container">
        <div class="cartes-list-2col">
          <div class="cartes-colonne">
            <p class="label">Villageois</p>
            <ul>
              <li
                v-for="card in villageoisCards"
                :key="card.name + '-v'"
                role="button"
                tabindex="0"
                :aria-label="`Ajouter la carte ${card.name}`"
                @click="addCard(card)"
                @keydown.enter.prevent="addCard(card)"
                @keydown.space.prevent="addCard(card)"
              >
                <LoupGarouCard :lgcard="card" />
              </li>
            </ul>
          </div>
          <div class="cartes-colonne">
            <p class="label">Loups-garous & Solitaires</p>
            <ul>
              <li
                v-for="card in [...loupGarouCards, ...solitaireCards]"
                :key="card.name + '-lgsol'"
                role="button"
                tabindex="0"
                :aria-label="`Ajouter la carte ${card.name}`"
                @click="addCard(card)"
                @keydown.enter.prevent="addCard(card)"
                @keydown.space.prevent="addCard(card)"
              >
                <LoupGarouCard :lgcard="card" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <!-- Préparation : première nuit -->
    <section v-if="phase === 'prep'" class="phase-nuit">
      <div class="prep-header">
  <BoutonListedesjoueurs v-if="phase !== 'selection'" :joueurs="joueurs" />
  <h2 class="prep-title">Préparation de la première nuit</h2>
  <span class="prep-header-spacer"></span>
</div>
      
      <ul class="appel-list">
        <li v-for="(card, index) in prepCards" :key="card.instanceId" class="appel-row">
          <div class="appel-carte">
            <LoupGarouCard :lgcard="card"
            :nomAncien="card.name === 'Ancien' ? nomAncien : undefined"
            :nomChasseur="card.name === 'Chasseur' ? nomChasseur : undefined"
            :nomQuitousse="card.name === 'DonQuiTousse' ? nomQuitousse : undefined"
            :nomJuge="card.name === 'Juge' ? nomJuge : undefined"
            :nomSoeur1="card.name === 'Deux Soeurs' ? nomSoeur1 : undefined"
            :nomSoeur2="card.name === 'Deux Soeurs' ? nomSoeur2 : undefined"
            :nomOurs="card.name === 'Montreur d ours' ? nomOurs : undefined"
            :nomEnfantSauvage="card.name === 'Enfant Sauvage' ? nomEnfantSauvage : undefined"
            :mentorIsDead="card.name === 'Enfant Sauvage' ? mentorIsDead : false"
            :nomVoyante="card.name === 'Voyante' ? nomVoyante : undefined"
            :nomLoup="card.name === 'Loup-garou' ? nomsLoups[indexOfLoupInList(prepCards, index)] : undefined"
            :nomFlute="card.name === 'Joueur de flute' ? nomFlute : undefined"
            :nomSectaire="card.name === 'Sectaire' ? nomSectaire : undefined"
            :nomCorbeau="card.name === 'Corbeau' ? nomCorbeau : undefined"
            :nomChienLoup="card.name === 'Chien-Loup' ? nomChienLoup : undefined"
            :campChienLoup="card.name === 'Chien-Loup' ? campChienLoup : undefined"
            :nomCourtisane="card.name === 'Courtisane' ? nomCourtisane : undefined"
            />
            <span v-if="card.count > 1" class="appel-carte-count">× {{ card.count }}</span>
          </div>

          <div class="appel-info">
            <p class="dire"><strong>Meneur :</strong> {{ card.dire }}</p>
            <p class="description">{{ card.description }}</p>
          </div>
          
          <!-- Logo pouvoir chien-loup -->
          <template v-if="card.name === 'Chien-Loup'">
  <PouvoirChienLoup :joueurs="joueurs" @chienloup-init="setChienLoup" />
</template>

          <!-- Logo pouvoir Don Qui Tousse -->
          <template v-if="card.name === 'DonQuiTousse'">
  <Pouvoirrouille :joueurs="joueurs" @donQuitousse="setQuitousse" />
</template>
          <!-- Logo pouvoir sectaire -->
          <template v-if="card.name === 'Sectaire'">
  <PouvoirSectaire :joueurs="joueurs" @sectaire-init="setSectaire" />
          </template>
          <!-- Logo pouvoir ancien -->
          <template v-if="card.name === 'Ancien'">
            <PouvoirAncien :joueurs="joueurs" @ancienduvillage="setAncien" />
          </template>
          <!-- Logo pouvoir Ours -->
          <template v-if="card.name === 'Montreur d ours'">
            <PouvoirOurs :joueurs="joueurs" @oursduvillage="setOurs" />
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
      <button class="btn-next-phase" @click="nextPhase" :disabled="transitioning">Commencer la nuit</button>
    </section>

    <!-- Nuit active (appel des rôles) -->
    <section
      v-if="phase === 'night'"
      class="phase-nuit"
      @pointerdown.capture="rememberPowerButtonScrollPosition"
      @keydown.capture="rememberPowerButtonScrollPosition"
      @click.capture="restorePowerButtonScrollPosition"
    >
      <div class="phase-header">
    <BoutonListedesjoueurs v-if="phase !== 'selection'" :joueurs="joueurs" />
    <h2 class="phase-title">🌙 Nuit {{ nightCount }}</h2>
    <span class="phase-header-spacer"></span>
  </div>
      <p v-if="villageoisPouvoirsPerdus" class="pouvoirs-village-perdus" role="status">
        ⚠️ L'Ancien a été éliminé par le village : les villageois encore en jeu ont perdu leurs pouvoirs.
      </p>
      <ul class="appel-list">
        <li v-for="(card, index) in nightCards" :key="card.instanceId" class="appel-row">
          <div class="appel-carte">
            <LoupGarouCard
              :lgcard="card"
              :nomLoup="card.name === 'Loup-garou' ? nomsLoups[indexOfLoupInList(nightCards, index)] : undefined"
              :nomFlute="card.name === 'Joueur de flute' ? nomFlute : undefined"
              :nomVoyante="card.name === 'Voyante' ? nomVoyante : undefined"
              :nomCorbeau="card.name === 'Corbeau' ? nomCorbeau : undefined"
              :nomChienLoup="card.name === 'Chien-Loup' ? nomChienLoup : undefined"
              :campChienLoup="card.name === 'Chien-Loup' ? campChienLoup : undefined"
              :nomCourtisane="card.name === 'Courtisane' ? nomCourtisane : undefined"
            />
            <span v-if="card.count > 1" class="appel-carte-count">× {{ card.count }}</span>
          </div>
      <div class="appel-info">
        <p class="dire"><strong>Meneur :</strong> {{ card.dire }}</p>
        <p class="description">{{ card.description }}</p>
      </div>

          <!-- Logo pouvoir courtisane -->
          <template v-if="card.name === 'Courtisane'">
            <PouvoirCourtisane :joueurs="joueurs" @courtisaneduvillage="setCourtisane" />
          </template>
          <!-- Logo pouvoir Voyante -->
          <template v-if="card.name === 'Voyante'">
            <PouvoirVoyante :joueurs="joueurs" @voyanteduvillage="setVoyante" />
          </template>
          <!-- Logo pouvoir corbeau -->
          <template v-if="card.name === 'Corbeau'">
            <PouvoirCorbeau :joueurs="joueurs" @corbeauduvillage="setCorbeau" />
          </template>
          <!-- Logos potions pour la Sorcière -->
          <template v-if="card.name === 'Sorciere'">
            <PotionsSorciere
  :joueurs="joueurs"
  :potion-vie-dispo="potionVieDispo"
  :potion-mort-dispo="potionMortDispo"
  @sor-save-name-selected="handleSorciereSave"
  @use-mort="potionMortDispo = false"
  @sor-victim-selected="victimSorName = $event"
/>
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
              <LoupGarouButton
  :joueurs="joueurs"
  :nbLoups="nbLoups"
  :isFirstNight="phase === 'night' && nightCount === 1"
  @loups-selected="setLoups"
  @victim-selected="victimLGName = $event"
/>
            </div>
          </template>
          <!-- Logo tête de lg pour l'infecté --> 
          <template v-if="card.name === 'Infect pere des loups'">
              <Pouvoirinfectperedesloups
    :joueurs="joueurs"
    :pouvoir-infect-dispo="pouvoirInfectDispo"
    @infect-selected="handleInfectVictim"
  />
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
            @fluteduvillage="setFlute"
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
      <!-- ENCART UNIQUE sous la liste des LG -->
  <div v-if="victimLGName" class="encart-victime-lg">
    <strong>Cible désignée par les Loups :</strong> {{ victimLGName }}
  </div>
      <button class="btn-next-phase" @click="nextPhase" :disabled="transitioning">Passer au jour</button>
    </section>

    <!-- Phase : élimination de la nuit -->
    <section v-if="phase === 'night-elim'" class="phase-nuit-elim">
      <div class="phase-header">
        <BoutonListedesjoueurs :joueurs="joueurs" :morts-nuit="nomsJoueursMortsNuit" />
        <h2 class="phase-title">🌙 Bilan de la nuit {{ nightCount }}</h2>
        <span class="phase-header-spacer"></span>
      </div>
      <section class="bilan-nuit" aria-live="polite" aria-label="Résumé des événements de la nuit">
        <div class="bilan-morts">
          <h3>💀 Joueurs morts cette nuit</h3>
          <ul v-if="nomsJoueursMortsNuit.length" class="liste-morts-nuit">
            <li v-for="nom in nomsJoueursMortsNuit" :key="nom" class="revelation-mort-nuit">
              <span>💀 <strong>{{ nom }}</strong> était :</span>
              <template v-if="roleConnuPour(nom) || rolesReveles[nom]">
                <span class="revelation-role">{{ roleConnuPour(nom) || rolesReveles[nom] }}</span>
              </template>
              <label v-else class="choix-role-label" :for="`role-nuit-${nom}`">
                Choisir son rôle :
                <select :id="`role-nuit-${nom}`" v-model="rolesReveles[nom]" @change="sauvegarderRoleRevele(nom)">
                  <option value="" disabled>Choisir un rôle</option>
                  <option v-for="role in rolesDisponibles" :key="role" :value="role">{{ role }}</option>
                </select>
              </label>
            </li>
          </ul>
          <p v-else class="aucun-mort">Aucun joueur n'est mort cette nuit.</p>
        </div>

        <div v-if="evenementsNuit.length" class="bilan-evenements">
          <h3>Autres événements</h3>
          <ul>
            <li v-for="(evenement, index) in evenementsNuit" :key="`${evenement.type}-${evenement.nom}-${index}`" :class="`evenement-${evenement.type}`">
              <strong>{{ evenement.titre }}</strong> {{ evenement.nom }}
            </li>
          </ul>
        </div>

        <div v-if="evenementsNuit.some(evenement => evenement.type === 'protection') || personneProteger || sorciereSaveName || MoineSave || ServSave" class="bilan-protections">
          <h3>🛡️ Protections et sauvetages</h3>
          <ul>
            <li v-if="personneProteger">Le Salvateur a protégé {{ personneProteger }}.</li>
            <li v-if="sorciereSaveName">La Sorcière a sauvé {{ sorciereSaveName }}.</li>
            <li v-if="MoineSave">Le Moine a protégé {{ MoineSave }}.</li>
            <li v-if="ServSave">La Servante dévouée s'est interposée pour {{ ServSave }}.</li>
          </ul>
        </div>

        <div v-if="nomAmoureux1 || nomMentor || nomOurs" class="bilan-infos">
          <h3>Informations du village</h3>
          <p v-if="nomAmoureux1">💘 Les amoureux sont {{ nomAmoureux1 }} et {{ nomAmoureux2 }}.</p>
          <p v-if="nomMentor">🧑 Le mentor de {{ nomEnfantSauvage }} est {{ nomMentor }}.</p>
          <p v-if="nomOurs">🐻 Le Montreur d'ours est {{ nomOurs }}.</p>
        </div>
      </section>
      <section v-if="chasseurActif" class="reaction-chasseur" aria-live="polite">
        <h3>🏹 Le Chasseur {{ chasseurActif }} est éliminé</h3>
        <p>Il peut choisir un joueur vivant à éliminer. Confirme son tir pour résoudre son pouvoir.</p>
        <label :for="`cible-chasseur-nuit-${chasseurActif}`">Joueur à éliminer :</label>
        <template v-if="joueursCiblesChasseur.length">
          <select :id="`cible-chasseur-nuit-${chasseurActif}`" v-model="cibleChasseur">
            <option value="" disabled>Choisir un joueur</option>
            <option v-for="joueur in joueursCiblesChasseur" :key="joueur.nom" :value="joueur.nom">{{ joueur.nom }}</option>
          </select>
          <button type="button" @click="confirmerTirChasseur" :disabled="!cibleChasseur">Confirmer le tir</button>
        </template>
        <button v-else type="button" @click="confirmerTirChasseur">Terminer (aucun joueur vivant à cibler)</button>
      </section>
      <details class="cartes-restantes">
        <summary>
          <span>Rôles identifiés encore en jeu</span>
          <strong>{{ totalCartesRestantes }}</strong>
          <span>{{ totalCartesRestantes === 1 ? 'carte' : 'cartes' }} · {{ cartesRestantes.length }} {{ cartesRestantes.length === 1 ? 'rôle' : 'rôles' }}</span>
        </summary>
        <ul v-if="cartesRestantes.length" class="liste-cartes-restantes">
          <li v-for="carte in cartesRestantes" :key="carte.nom">
            <span>{{ carte.nom }}</span>
            <strong>× {{ carte.nombre }}</strong>
          </li>
        </ul>
        <p v-else class="aucune-carte-restante">Aucune carte ne reste en jeu.</p>
        <div v-if="joueursMortsSansRole.length" class="roles-morts-inconnus">
          <p>Pour actualiser les rôles restants, indique la carte de chaque joueur mort dont le rôle n'est pas encore connu :</p>
          <label v-for="joueur in joueursMortsSansRole" :key="joueur.nom" :for="`role-mort-nuit-${joueur.nom}`">
            <span>{{ joueur.nom }}</span>
            <select :id="`role-mort-nuit-${joueur.nom}`" v-model="rolesReveles[joueur.nom]" @change="sauvegarderRoleRevele(joueur.nom)">
              <option value="" disabled>Choisir un rôle</option>
              <option v-for="role in rolesDisponibles" :key="role" :value="role">{{ role }}</option>
            </select>
          </label>
        </div>
      </details>
      <button class="btn-next-phase" @click="nextPhase" :disabled="transitioning || Boolean(chasseurActif) || !revelationNuitComplete">{{ !revelationNuitComplete ? 'Révéler tous les rôles avant le vote' : 'Passer au vote du village' }}</button>
    </section>

    <!-- Jour -->
    <section v-if="phase === 'day'" class="phase-jour">
      <div class="phase-header">
        <BoutonListedesjoueurs :joueurs="joueurs" :morts-nuit="nomsJoueursMortsNuit" />
        <h2 class="phase-title">🌕 Jour {{ dayCount }}</h2>
        <span class="phase-header-spacer"></span>
      </div>
      <p class="vote">Le village débat et désigne la personne à éliminer.</p>
      <Phasedevote
        :joueurs="joueurs"
        :key="dayCount"
        @update-joueurs="updateJoueurs"
        @vote-confirme="handleVillageVote"
      />
      <section v-if="votantsElimines.length" class="revelation-vote" aria-live="polite">
        <h3>🃏 La personne votée était :</h3>
        <ul class="liste-revelation-vote">
          <li v-for="nom in votantsElimines" :key="nom" class="revelation-vote-joueur">
            <strong class="revelation-vote-nom">{{ nom }}</strong>
            <template v-if="roleConnuPour(nom) || rolesReveles[nom]">
              <span class="revelation-role">{{ roleConnuPour(nom) || rolesReveles[nom] }}</span>
            </template>
            <label v-else class="choix-role-label" :for="`role-vote-${nom}`">
              Rôle encore inconnu — choisissez sa carte :
              <select :id="`role-vote-${nom}`" v-model="rolesReveles[nom]" @change="sauvegarderRoleRevele(nom)">
                <option value="" disabled>Choisir un rôle</option>
                <option v-for="role in rolesDisponibles" :key="role" :value="role">{{ role }}</option>
              </select>
            </label>
          </li>
        </ul>
      </section>
      <p v-else-if="villageVoteConfirme" class="aucune-elimination-vote">
        Aucun joueur n'a été éliminé par le vote aujourd'hui.
      </p>
      <section v-if="chasseurActif" class="reaction-chasseur" aria-live="polite">
        <h3>🏹 Le Chasseur {{ chasseurActif }} est éliminé</h3>
        <p>Il peut choisir un joueur vivant à éliminer. Confirme son tir pour résoudre son pouvoir.</p>
        <label :for="`cible-chasseur-vote-${chasseurActif}`">Joueur à éliminer :</label>
        <template v-if="joueursCiblesChasseur.length">
          <select :id="`cible-chasseur-vote-${chasseurActif}`" v-model="cibleChasseur">
            <option value="" disabled>Choisir un joueur</option>
            <option v-for="joueur in joueursCiblesChasseur" :key="joueur.nom" :value="joueur.nom">{{ joueur.nom }}</option>
          </select>
          <button type="button" @click="confirmerTirChasseur" :disabled="!cibleChasseur">Confirmer le tir</button>
        </template>
        <button v-else type="button" @click="confirmerTirChasseur">Terminer (aucun joueur vivant à cibler)</button>
      </section>
      <details class="cartes-restantes">
        <summary>
          <span>Rôles identifiés encore en jeu</span>
          <strong>{{ totalCartesRestantes }}</strong>
          <span>{{ totalCartesRestantes === 1 ? 'carte' : 'cartes' }} · {{ cartesRestantes.length }} {{ cartesRestantes.length === 1 ? 'rôle' : 'rôles' }}</span>
        </summary>
        <ul v-if="cartesRestantes.length" class="liste-cartes-restantes">
          <li v-for="carte in cartesRestantes" :key="carte.nom">
            <span>{{ carte.nom }}</span>
            <strong>× {{ carte.nombre }}</strong>
          </li>
        </ul>
        <p v-else class="aucune-carte-restante">Aucune carte ne reste en jeu.</p>
        <div v-if="joueursMortsSansRole.length" class="roles-morts-inconnus">
          <p>Pour actualiser les rôles restants, indique la carte de chaque joueur mort dont le rôle n'est pas encore connu :</p>
          <label v-for="joueur in joueursMortsSansRole" :key="joueur.nom" :for="`role-mort-${joueur.nom}`">
            <span>{{ joueur.nom }}</span>
            <select :id="`role-mort-${joueur.nom}`" v-model="rolesReveles[joueur.nom]" @change="sauvegarderRoleRevele(joueur.nom)">
              <option value="" disabled>Choisir un rôle</option>
              <option v-for="role in rolesDisponibles" :key="role" :value="role">{{ role }}</option>
            </select>
          </label>
        </div>
      </details>
      <button class="btn-next-phase" @click="nextPhase" :disabled="transitioning || !villageVoteConfirme || !revelationVoteComplete || Boolean(chasseurActif)">
        {{ !villageVoteConfirme ? 'Confirmer le vote avant la nuit' : !revelationVoteComplete ? 'Révéler le rôle avant la nuit' : 'Nuit suivante' }}
      </button>
    </section>

    <!-- Résultat -->
    <section v-if="phase === 'end'" class="phase-end">
      <h2>{{ winnerMessage }}</h2>
      <img :src="winnerImage" class="winnerimage" alt="Illustration de l'équipe gagnante" />
      <Boutonrejouer v-if="phase === 'jour' || phase === 'end'" @rejouer="rejouer" />
    </section>

    <!-- Footer persistent -->
    <footer v-if="phase !== 'end'" class="footer">
      <button class="btn-rejouer-footer" @click="rejouer">
    Rejouer
  </button>
      <router-link to="/"><button class="btn-retour-accueil">Accueil</button></router-link>
      <p>AMELINE-BOLLES Florian x L'école de la station</p>
    </footer>

    <div v-if="transitioning" class="transition-overlay">
      <span>{{ transitionText }}</span>
    </div>

</template>

<!-- /////////////////////////////////////////////////////////// -->

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
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
import PouvoirOurs from '../components/PouvoirOurs.vue'
import PouvoirCorbeau from '../components/PouvoirCorbeau.vue'
import PouvoirVoyante from '../components/PouvoirVoyante.vue'
import PouvoirSectaire from '../components/PouvoirSectaire.vue'
import Pouvoirrouille from '../components/Pouvoirrouille.vue'
import PouvoirChienLoup from '../components/PouvoirChienLoup.vue'
import BoutonListedesjoueurs from '../components/BoutonListedesjoueurs.vue'


// Etat
const allCards = data
const selectedCards = ref([])
let nextCardId = 0
const phase = ref('selection')
const dayCount = ref(0)
const nightCount = ref(0)
const visible = ref(false)
const winnerMessage = ref('')
const winnerImage = ref('')
const victimLGName = ref('')
const victiminfectLGName = ref('')
const victimGrandLGName = ref('')
const mortsNuit = ref([])
const nomsJoueursMortsNuit = ref([])
const nomAncien = ref('')
const nomJuge = ref('')
const nomChasseur = ref('')
const nomOurs = ref('')
const nomLoup = ref('')
const nomMentor = ref('');
const nomCorbeau = ref('');


const nomChienLoup = ref("");
const campChienLoup = ref("");
function setChienLoup({ nomChienLoup: nom, camp }) {
  nomChienLoup.value = nom;
  campChienLoup.value = camp;
  // Mets à jour la carte Chien-Loup dans selectedCards
  const index = selectedCards.value.findIndex(c => c.name === "Chien-Loup");
  if (index !== -1) {
    selectedCards.value[index] = {
      ...selectedCards.value[index],
      isCallable: camp === "Loup-garou"
    };
  }
}

const nomQuitousse = ref('');
function setQuitousse({ nomQuitousse: nom }) {
  nomQuitousse.value = nom;
}
// Computed
function regrouperCartesPourAppel(cards) {
  const groupes = new Map();
  cards.forEach(card => {
    const existant = groupes.get(card.name);
    if (existant) {
      existant.count += 1;
    } else {
      groupes.set(card.name, { ...card, count: 1 });
    }
  });
  return [...groupes.values()];
}

const prepCards = computed(() =>
  regrouperCartesPourAppel(selectedCards.value
    .filter(c => c.onlyFirstNight)
    .sort((a, b) => a.order - b.order))
)
const nightCards = computed(() =>
  regrouperCartesPourAppel(selectedCards.value
    .filter(c => c.isCallable && !(villageoisPouvoirsPerdus.value && c.categorie === 'Villageois'))
    .sort((a, b) => a.order - b.order))
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

// Transitions
const transitioning = ref(false);
const transitionText = ref("🌞 Le village se réveille...");
let transitionTimeout = null;

// Actions
function addCard(card) {
  // Deux Soeurs représente toujours une paire, tout en gardant deux instances distinctes.
  const nombreInstances = card.name === 'Deux Soeurs' ? 2 : 1;
  for (let i = 0; i < nombreInstances; i++) {
    selectedCards.value.push({ ...card, instanceId: `card-${nextCardId++}` });
  }
}

function removeSelectedCard(index) {
  const selected = selectedCards.value[index];
  if (!selected) return;

  if (selected.name === 'Deux Soeurs') {
    const sisterCards = selectedCards.value
      .map((card, cardIndex) => ({ card, cardIndex }))
      .filter(({ card }) => card.name === 'Deux Soeurs');
    const pair = sisterCards.find(({ cardIndex }) => cardIndex !== index);
    if (pair) {
      selectedCards.value.splice(Math.max(index, pair.cardIndex), 1);
      selectedCards.value.splice(Math.min(index, pair.cardIndex), 1);
      return;
    }
  }

  removeCard(index);
}

function removeCard(index) {
  const removed = selectedCards.value[index];
  if (!removed) return;

  selectedCards.value.splice(index, 1);

  // Victoire de l'Ange uniquement s'il est éliminé au premier jour (après la première nuit)
  if (
    phase.value === 'day' &&
    removed.name === 'Ange' &&
    dayCount.value === 1
  ) {
    phase.value = 'end';
    winnerMessage.value = "L'Ange a été éliminé lors du premier jour et remporte la partie !";
    winnerImage.value = '/victoire/victoireange.jpg';
  }

  // Vérification victoire Sectaire
  if (
    groupeOppose.value.length &&
    groupeOppose.value.every(nom => !joueurs.value.some(j => j.nom === nom && !j.mort))
  ) {
    phase.value = 'end';
    winnerMessage.value = 'Le Sectaire a éliminé tout le groupe opposé et remporte la partie !';
    winnerImage.value = '/victoire/victoiresectaire.jpg';
  }

  if (
    nomFlute.value &&
    joueurs.value.length > 0 &&
    joueurs.value.every(j => j.nom === nomFlute.value || joueursCharmes.value.includes(j.nom))
  ) {
    phase.value = 'end';
    winnerMessage.value = 'Le Joueur de flûte a charmé tout le village et remporte la partie !';
    winnerImage.value = '/victoire/victoireflute.jpg';
  }
}

const selectedCardsInitial = ref([]);
/// Lancer une nouvelle partie
function startGame() {
  if (!peutLancerPartie.value) return;
  joueursInitial.value = joueurs.value.map(j => ({ ...j }));
   selectedCardsInitial.value = selectedCards.value.map(c => ({ ...c }));
  phase.value = 'prep';
}
///Phases de jeu
function resolveNightDeaths() {
  const joueursVivants = new Set(joueurs.value.filter(joueur => !joueur.mort).map(joueur => joueur.nom));
  const victimeLoups = joueursVivants.has(victimLGName.value) ? victimLGName.value : '';
  const attaquesParPouvoir = [victimGrandLGName.value, victimSorName.value, victimAlchimiste.value]
    .filter(nom => nom && joueursVivants.has(nom));
  const victimes = new Set(attaquesParPouvoir);
  if (victimeLoups) victimes.add(victimeLoups);

  // Les protections standards annulent les attaques, mais la potion de mort de la Sorcière reste létale.
  for (const nom of [...victimes]) {
    const attaqueParSorciere = victimSorName.value === nom;
    const attaqueParGrandLoupOuAlchimiste =
      victimGrandLGName.value === nom || victimAlchimiste.value === nom;
    const attaqueDesLoups = victimeLoups === nom;

    // La potion de mort est létale même si la cible est protégée.
    if (attaqueParSorciere) continue;

    const autreAttaqueAboutit =
      attaqueParGrandLoupOuAlchimiste && !protectionsNuit.value.includes(nom);
    const morsureAboutit =
      attaqueDesLoups &&
      !protectionsNuit.value.includes(nom) &&
      sorciereSaveName.value !== nom &&
      nom !== nomAncien.value;

    if (!autreAttaqueAboutit && !morsureAboutit) victimes.delete(nom);
  }

  const mortsDirectes = [...victimes];
  mortsNuit.value = [...victimes];
  nomsJoueursMortsNuit.value = [...victimes];
  joueurs.value = joueurs.value.map(joueur => ({
    ...joueur,
    mort: joueur.mort || victimes.has(joueur.nom)
  }));

  ancienMorsureAbsorbee.value = Boolean(
    nomAncien.value && victimLGName.value === nomAncien.value && !victimes.has(nomAncien.value)
  );

  // Si un amoureux meurt, son partenaire succombe également.
  if (nomAmoureux1.value && nomAmoureux2.value && mortsDirectes.length) {
    const amoureuxDecedes = mortsNuit.value.includes(nomAmoureux1.value)
      ? nomAmoureux2.value
      : mortsNuit.value.includes(nomAmoureux2.value)
        ? nomAmoureux1.value
        : null;
    if (amoureuxDecedes && !mortsNuit.value.includes(amoureuxDecedes)) {
      mortsNuit.value.push(amoureuxDecedes);
      nomsJoueursMortsNuit.value.push(amoureuxDecedes);
      joueurs.value = joueurs.value.map(joueur => ({


        ...joueur,
        mort: joueur.mort || joueur.nom === amoureuxDecedes
      }));
    }
  }
  mortsNuit.value = [...new Set(mortsNuit.value)];
  nomsJoueursMortsNuit.value = [...new Set(nomsJoueursMortsNuit.value)];
  ajouterChasseursDeclenches(nomsJoueursMortsNuit.value);
  // L'Ancien ne résiste qu'à une morsure des Loups, pas à une autre attaque ni à la mort de son amoureux.
  if (ancienMorsureAbsorbee.value && mortsNuit.value.includes(nomAncien.value)) {
    ancienMorsureAbsorbee.value = false;
  }
}

let powerButtonScrollY = 0;

function rememberPowerButtonScrollPosition(event) {
  if (!(event.target instanceof Element) || !event.target.closest('button')) return;
  powerButtonScrollY = window.scrollY;
}

function restorePowerButtonScrollPosition(event) {
  if (!(event.target instanceof Element) || !event.target.closest('button')) return;
  window.scrollTo({ top: powerButtonScrollY, behavior: 'instant' });
  requestAnimationFrame(() => window.scrollTo({ top: powerButtonScrollY, behavior: 'instant' }));
}

function nextPhase() {
  if (transitioning.value) return

  if (phase.value === 'night') {
    transitionText.value = "🌞 Le village se réveille...";
    mortsNuit.value = [];
    nomsJoueursMortsNuit.value = [];
    ancienMorsureAbsorbee.value = false;
    transitioning.value = true;
    resetVotes();
    transitionTimeout = setTimeout(() => {
      transitionTimeout = null;
      resolveNightDeaths();
      phase.value = 'night-elim';
      transitioning.value = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
    return;
  }
  if (phase.value === 'day') {
    transitionText.value = "🌙 La nuit tombe...";
    transitioning.value = true;
    transitionTimeout = setTimeout(() => {
      transitionTimeout = null;
      nightCount.value += 1;
      villageVoteConfirme.value = false;
      votantsElimines.value = [];
      chasseursAResoudre.value = [];
      chasseursDeclenches.value = [];
      cibleChasseur.value = '';
      rolesReveles.value = {};
      phase.value = 'night';
      visible.value = false;
      victimLGName.value = '';
      victimGrandLGName.value = '';
      victiminfectLGName.value = '';
      mortsNuit.value = [];
      nomsJoueursMortsNuit.value = [];
      ancienMorsureAbsorbee.value = false;
      personneProteger.value = '';
      victimSorName.value = '';
      victimAlchimiste.value = '';
      ServSave.value = '';
      MoineSave.value = '';
      sorciereSaveName.value = '';
      transitioning.value = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
    return;
  }
  switch (phase.value) {
    case 'prep':
      nightCount.value = 1
      phase.value = 'night'
      visible.value = false
      break
    case 'night-elim':
      // Ajoute un vote aux joueurs désignés par le corbeau
  joueurs.value.forEach(j => {
    if (j.nom === nomPlume1.value || j.nom === nomPlume2.value) {
      j.votes = (j.votes || 0) + 1;
    } else {
      j.votes = 0; // reset pour les autres
    }
  });
  dayCount.value += 1;
  phase.value = 'day';
  visible.value = true;
  return;
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
const villageoisPouvoirsPerdus = ref(false);
const pouvoirServDispo = ref(true);
const potionVieDispo = ref(true);
const potionMortDispo = ref(true);
const choixrenard = ref(true);
const pouvoirflute = ref(true);
const joueursCharmes = ref([]);
const nomSoeur1 = ref('');
const nomSoeur2 = ref('');
const personneProteger = ref('');
const victimSorName = ref('');
const sorciereSaveName = ref('');
const nomAmoureux1 = ref('');
const nomAmoureux2 = ref('');
const nomEnfantSauvage = ref('');
const nomCourtisane = ref('');
const choixCourtisane = ref('');
const pouvoirMoineDispo = ref('');
const pouvoirAlchiDispo = ref('');
const MoineSave = ref('');
const victimAlchimiste = ref('');
const ServSave = ref('');
const nomVoyante = ref('');
const nomFlute = ref('');
const pouvoirInfectDispo = ref(true);
const nomSectaire = ref('');
const groupeSectaire = ref([]);
const groupeOppose = ref([]);
const ancienMorsureAbsorbee = ref(false);

const evenementsNuit = computed(() => {
  const evenements = [];
  if (victiminfectLGName.value) {
    evenements.push({ type: 'infection', titre: 'Infecté par le Père des Loups :', nom: victiminfectLGName.value });
  }
  if (victimLGName.value && mortsNuit.value.includes(victimLGName.value)) {
    evenements.push({ type: 'attaque', titre: 'Tué par les Loups-garous :', nom: victimLGName.value });
  }
  if (victimGrandLGName.value && mortsNuit.value.includes(victimGrandLGName.value)) {
    evenements.push({ type: 'attaque', titre: 'Tué par le Grand Méchant Loup :', nom: victimGrandLGName.value });
  }
  if (victimSorName.value && mortsNuit.value.includes(victimSorName.value)) {
    evenements.push({ type: 'attaque', titre: 'Tué par la Sorcière :', nom: victimSorName.value });
  }
  if (victimAlchimiste.value && mortsNuit.value.includes(victimAlchimiste.value)) {
    evenements.push({ type: 'attaque', titre: "Tué par l'Alchimiste :", nom: victimAlchimiste.value });
  }
  if (
    victimLGName.value &&
    !mortsNuit.value.includes(victimLGName.value) &&
    (protectionsNuit.value.includes(victimLGName.value) ||
      sorciereSaveName.value === victimLGName.value ||
      (nomAncien.value === victimLGName.value && !mortsNuit.value.includes(nomAncien.value)))
  ) {
    evenements.push({ type: 'protection', titre: 'La victime des Loups a été sauvée :', nom: victimLGName.value });
  }
  if (
    victimLGName.value === nomAncien.value &&
    nomAncien.value &&
    !mortsNuit.value.includes(nomAncien.value)
  ) {
    evenements.push({ type: 'survie', titre: "L'Ancien a résisté à la morsure :", nom: nomAncien.value });
  }
  return evenements;
});

const protectionsNuit = computed(() => [
  personneProteger.value,
  MoineSave.value,
  ServSave.value
].filter(Boolean));

function cardJoueurMortNuit(card, index) {
  const nomJoueur = card.name === 'Loup-garou'
    ? nomsLoups.value[indexOfLoupInList(selectedCards.value, index)]
    : card.instanceId;
  return nomsJoueursMortsNuit.value.includes(nomJoueur);
}

function setSectaire({ nomSectaire: nom, groupeSectaire: g1, groupeOppose: g2 }) {
  nomSectaire.value = nom;
  groupeSectaire.value = g1;
  groupeOppose.value = g2;
}

const mentorIsDead = computed(() =>
  nomMentor.value &&
  !joueurs.value.some(j => j.nom === nomMentor.value)
);

const nbLoups = computed(() =>
  selectedCards.value.filter(c => c.name === 'Loup-garou').length
);
const nomsLoups = ref([]); // ["Alice", "Bob", ...]
function setLoups(liste) {
  nomsLoups.value = liste;
}

function indexOfLoupInList(list, idx) {
  // Retourne le rang du Loup-garou parmi toutes les cartes Loup-garou affichées
  return list
    .slice(0, idx + 1)
    .filter(c => c.name === 'Loup-garou').length - 1;
}


function setAmoureux({ nomAmoureux1: n1, nomAmoureux2: n2 }) {
  nomAmoureux1.value = n1;
  nomAmoureux2.value = n2;
}
function setAncien({ nomAncien: n }) {
  nomAncien.value = n;
}
function setOurs({ nomOurs: n }) {
  nomOurs.value = n;
}
function setChasseur({ nomChasseur: n }) {
  nomChasseur.value = n;
}
function setSoeurs({ nomSoeur1: n1, nomSoeur2: n2 }) {
  nomSoeur1.value = n1;
  nomSoeur2.value = n2;
}
function setMentor({ nomEnfantSauvage: enfant, nomMentor: mentor }) {
  nomEnfantSauvage.value = enfant;
  nomMentor.value = mentor;
}
function setJuge({ nomJuge: nom }) {
  nomJuge.value = nom;
}
function setVoyante({ nomVoyante: nom }) {
  nomVoyante.value = nom;
}
function setCourtisane({ nomCourtisane: nom, choix, personne }) {
  choixCourtisane.value = { choix, personne };
  nomCourtisane.value = nom;
}

const nomPlume1 = ref("");
const nomPlume2 = ref("");
function setCorbeau({ nomCorbeau: nom, nomPlume1: plume1, nomPlume2: plume2 }) {
  nomCorbeau.value = nom;
  nomPlume1.value = plume1;
  nomPlume2.value = plume2;
}

function setCharmes(nomsCharmes) {
  joueursCharmes.value = nomsCharmes;
}

function setFlute({ nomFlute: nom }) {
  nomFlute.value = nom;
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
  ServSave.value = joueur;
}

function handleSorciereSave(nom) {
  potionVieDispo.value = false;
  sorciereSaveName.value = nom;
}

function handleInfectVictim(nom) {
  victiminfectLGName.value = nom;
  pouvoirInfectDispo.value = false;
}

const joueurs = ref([]);
const joueursInitial = ref([]);
const peutLancerPartie = computed(() =>
  selectedCards.value.length > 0 && joueurs.value.length === selectedCards.value.length
);
function updateJoueurs(list) {
  joueurs.value = list;
}

const villageVoteConfirme = ref(false);
const chasseursAResoudre = ref([]);
const chasseursDeclenches = ref([]);
const cibleChasseur = ref('');
const chasseurActif = computed(() => chasseursAResoudre.value[0] || '');
const joueursCiblesChasseur = computed(() => joueurs.value.filter(joueur => !joueur.mort));

const votantsElimines = ref([]);
const rolesReveles = ref({});
const rolesDisponibles = computed(() => [...new Set(selectedCards.value.map(carte => carte.name))].sort((a, b) => a.localeCompare(b, 'fr')));
const joueursMortsSansRole = computed(() => joueurs.value.filter(joueur => joueur.mort && !roleConnuPour(joueur.nom) && !rolesReveles.value[joueur.nom]));
const revelationNuitComplete = computed(() => nomsJoueursMortsNuit.value.every(nom => roleConnuPour(nom) || rolesReveles.value[nom]));
const rolesJoueursMorts = computed(() => joueurs.value
  .filter(joueur => joueur.mort)
  .map(joueur => rolesReveles.value[joueur.nom] || roleConnuPour(joueur.nom))
  .filter(Boolean));
const cartesRestantes = computed(() => {
  const rolesMorts = new Map();
  rolesJoueursMorts.value.forEach(role => rolesMorts.set(role, (rolesMorts.get(role) || 0) + 1));

  const compte = new Map();
  selectedCards.value.forEach(carte => {
    const nombreElimine = rolesMorts.get(carte.name) || 0;
    if (nombreElimine > 0) {
      rolesMorts.set(carte.name, nombreElimine - 1);
      return;
    }
    compte.set(carte.name, (compte.get(carte.name) || 0) + 1);
  });

  return [...compte.entries()]
    .map(([nom, nombre]) => ({ nom, nombre }))
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
});
const totalCartesRestantes = computed(() => cartesRestantes.value.reduce((total, carte) => total + carte.nombre, 0));
const revelationVoteComplete = computed(() => votantsElimines.value.every(nom => roleConnuPour(nom) || rolesReveles.value[nom]));

function roleEstChasseur(nom) {
  return roleConnuPour(nom) === 'Chasseur' || rolesReveles.value[nom] === 'Chasseur';
}

function ajouterChasseursDeclenches(noms) {
  const nouveauxChasseurs = noms.filter(nom => roleEstChasseur(nom) && !chasseursDeclenches.value.includes(nom));
  if (!nouveauxChasseurs.length) return;
  chasseursDeclenches.value.push(...nouveauxChasseurs);
  chasseursAResoudre.value.push(...nouveauxChasseurs);
  cibleChasseur.value = '';
}

function propagerEliminationAmoureux(nomElimine) {
  const noms = [nomElimine];
  const partenaire = nomElimine === nomAmoureux1.value
    ? nomAmoureux2.value
    : nomElimine === nomAmoureux2.value
      ? nomAmoureux1.value
      : '';
  if (partenaire && joueurs.value.some(joueur => joueur.nom === partenaire && !joueur.mort)) {
    noms.push(partenaire);
  }

  joueurs.value = joueurs.value.map(joueur => noms.includes(joueur.nom)
    ? { ...joueur, mort: true }
    : joueur);

  if (phase.value === 'day') {
    votantsElimines.value = [...new Set([...votantsElimines.value, ...noms])];
  } else if (phase.value === 'night-elim') {
    nomsJoueursMortsNuit.value = [...new Set([...nomsJoueursMortsNuit.value, ...noms])];
    mortsNuit.value = [...new Set([...mortsNuit.value, ...noms])];
  }
  ajouterChasseursDeclenches(noms);
}

function confirmerTirChasseur() {
  const nomChasseur = chasseurActif.value;
  if (!nomChasseur) return;

  const ciblesVivantes = joueursCiblesChasseur.value;
  if (!ciblesVivantes.length) {
    chasseursAResoudre.value.shift();
    cibleChasseur.value = '';
    return;
  }

  const cible = ciblesVivantes.find(joueur => joueur.nom === cibleChasseur.value);
  if (!cible) return;

  propagerEliminationAmoureux(cible.nom);
  chasseursAResoudre.value.shift();
  cibleChasseur.value = '';
}

function sauvegarderRoleRevele(nom) {
  const roleRevele = rolesReveles.value[nom];
  joueurs.value = joueurs.value.map(joueur => joueur.nom === nom
    ? { ...joueur, role: roleRevele }
    : joueur);

  if (roleRevele === 'Ancien' && votantsElimines.value.includes(nom)) {
    villageoisPouvoirsPerdus.value = true;
  }

  if (roleRevele === 'Chasseur' && joueurs.value.find(joueur => joueur.nom === nom)?.mort) {
    ajouterChasseursDeclenches([nom]);
  }
}

function roleConnuPour(nom) {
  const joueur = joueurs.value.find(element => element.nom === nom);
  if (!joueur) return '';
  const nomsAssignes = [
    [nomAncien.value, 'Ancien'],
    [nomJuge.value, 'Juge'],
    [nomChasseur.value, 'Chasseur'],
    [nomOurs.value, 'Montreur d ours'],
    [nomMentor.value, 'Enfant Sauvage'],
    [nomSoeur1.value, 'Deux Soeurs'],
    [nomSoeur2.value, 'Deux Soeurs'],
    [nomVoyante.value, 'Voyante'],
    [nomFlute.value, 'Joueur de flute'],
    [nomSectaire.value, 'Sectaire'],
    [nomQuitousse.value, 'DonQuiTousse'],
    [nomChienLoup.value, 'Chien-Loup'],
    [nomCourtisane.value, 'Courtisane'],
    [nomCorbeau.value, 'Corbeau']
  ];
  const roleAssigne = nomsAssignes.find(([nomAssigne]) => nomAssigne === nom);
  if (roleAssigne) return roleAssigne[1];
  const indexLoup = nomsLoups.value.indexOf(nom);
  if (indexLoup !== -1) return selectedCards.value.filter(carte => carte.name === 'Loup-garou')[indexLoup]?.name || 'Loup-garou';
  return joueur.role || joueur.carte || joueur.roleName || '';
}

function handleVillageVote({ elimines }) {
  villageVoteConfirme.value = true;
  const mortsDuVote = new Set(elimines);
  for (const nom of elimines) {
    const partenaire = nom === nomAmoureux1.value
      ? nomAmoureux2.value
      : nom === nomAmoureux2.value
        ? nomAmoureux1.value
        : '';
    if (partenaire && joueurs.value.some(joueur => joueur.nom === partenaire && !joueur.mort)) {
      mortsDuVote.add(partenaire);
    }
  }
  const nomsElimines = [...mortsDuVote];
  joueurs.value = joueurs.value.map(joueur => nomsElimines.includes(joueur.nom)
    ? { ...joueur, mort: true }
    : joueur);
  votantsElimines.value = nomsElimines;
  ajouterChasseursDeclenches(nomsElimines);

  if (nomsElimines.some(nom => roleConnuPour(nom) === 'Ancien' || rolesReveles.value[nom] === 'Ancien')) {
    villageoisPouvoirsPerdus.value = true;
  }
  if (nomsElimines.includes('Ange') && dayCount.value === 1) {
    phase.value = 'end';
    winnerMessage.value = "L'Ange a été éliminé lors du premier jour et remporte la partie !";
    winnerImage.value = '/victoire/victoireange.jpg';
    return;
  }

  if (
    groupeOppose.value.length &&
    groupeOppose.value.every(nom => !joueurs.value.some(joueur => joueur.nom === nom && !joueur.mort))
  ) {
    phase.value = 'end';
    winnerMessage.value = 'Le Sectaire a éliminé tout le groupe opposé et remporte la partie !';
    winnerImage.value = '/victoire/victoiresectaire.jpg';
    return;
  }

  if (
    nomFlute.value &&
    joueurs.value.length > 0 &&
    joueurs.value.every(joueur => joueur.mort || joueur.nom === nomFlute.value || joueursCharmes.value.includes(joueur.nom))
  ) {
    phase.value = 'end';
    winnerMessage.value = 'Le Joueur de flûte a charmé tout le village et remporte la partie !';
    winnerImage.value = '/victoire/victoireflute.jpg';
  }
}

function resetVotes() {
  joueurs.value = joueurs.value.map(j => ({ ...j, votes: 0 }));
}

function rejouer() {
  if (transitionTimeout !== null) {
    clearTimeout(transitionTimeout);
    transitionTimeout = null;
  }
  joueurs.value = joueursInitial.value.map(j => ({ ...j }));
  villageoisPouvoirsPerdus.value = false;
  selectedCards.value = selectedCardsInitial.value.map(c => ({ ...c }));
  phase.value = 'selection';
  dayCount.value = 0;
  nightCount.value = 0;
  villageVoteConfirme.value = false;
  villageoisPouvoirsPerdus.value = false;
  votantsElimines.value = [];
  chasseursAResoudre.value = [];
  chasseursDeclenches.value = [];
  cibleChasseur.value = '';
  rolesReveles.value = {};
  transitioning.value = false;
  winnerMessage.value = '';
  winnerImage.value = '';
  visible.value = false;
  nomAncien.value = '';
  nomChasseur.value = '';
  nomJuge.value = '';
  nomOurs.value = '';
  nomLoup.value = '';
  nomMentor.value = '';
  nomCorbeau.value = '';
  mortsNuit.value = [];
  nomsJoueursMortsNuit.value = [];
  ancienMorsureAbsorbee.value = false;
  nomPlume1.value = '';
  nomPlume2.value = '';
  nomSoeur1.value = '';
  nomSoeur2.value = '';
  nomEnfantSauvage.value = '';
  nomVoyante.value = '';
  nomFlute.value = '';
  nomCourtisane.value = '';
  choixCourtisane.value = '';
  nomAmoureux1.value = '';
  nomAmoureux2.value = '';
  sorciereSaveName.value = '';
  MoineSave.value = '';
  ServSave.value = '';
  personneProteger.value = '';
  victimLGName.value = '';
  victiminfectLGName.value = '';
  victimGrandLGName.value = '';
  mortsNuit.value = [];
  nomsJoueursMortsNuit.value = [];
  ancienMorsureAbsorbee.value = false;
  victimSorName.value = '';
  victimAlchimiste.value = '';
  nomSectaire.value = '';
  groupeSectaire.value = [];
  groupeOppose.value = [];
  nomsLoups.value = [];
  joueursCharmes.value = [];
  nomQuitousse.value = '';
  nomChienLoup.value = "";
  campChienLoup.value = "";
  pouvoirServDispo.value = true;
  potionVieDispo.value = true; 
  potionMortDispo.value = true;
  pouvoirMoineDispo.value = true;
  pouvoirAlchiDispo.value = true;
  pouvoirInfectDispo.value = true;
  choixrenard.value = true;
  pouvoirflute.value = true;
  nextCardId = Math.max(0, ...selectedCards.value.map(card => {
    const match = card.instanceId?.match(/^card-(\d+)$/);
    return match ? Number(match[1]) + 1 : 0;
  }));
}

onBeforeUnmount(() => {
  if (transitionTimeout !== null) clearTimeout(transitionTimeout);
});
</script>

<!-- ///////////////////////////////////////////////////////// -->
 
<style scoped>

@font-face {
  font-family: "NOKAPOLICE";
  src: url("/police/Nokapolice.otf") format("opentype");
  font-weight: normal;
  font-style: normal;
}

:global(body) {
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

.appel-carte {
  position: relative;
  flex: 0 0 auto;
}

.appel-carte-count {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  display: grid;
  place-items: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: #ffae00;
  color: #171a2b;
  font-weight: 800;
  box-shadow: 0 2px 8px #0008;
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

.liste-morts-nuit {
  display: grid;
  gap: 0.65rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.revelation-mort-nuit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.6rem 1rem;
  padding: 0.7rem 0.9rem;
  border: 1px solid #ffffff24;
  border-radius: 10px;
  background: #101321;
  color: #fff;
}

.revelation-mort-nuit > span:first-child strong {
  color: #ffdc5e;
}

.revelation-mort-nuit .revelation-role {
  color: #ffdc5e;
  font-weight: 700;
}

.revelation-mort-nuit .choix-role-label {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.revelation-mort-nuit select {
  max-width: 100%;
  padding: 0.45rem 0.6rem;
  border: 1px solid #ffae0080;
  border-radius: 8px;
  background: #181818;
  color: #fff;
}

.cartes-restantes {
  width: min(720px, calc(100% - 2rem));
  margin: 1.5rem auto;
  border: 1px solid #ffae0066;
  border-radius: 14px;
  background: linear-gradient(145deg, #23243a, #171a2b);
  color: #fff;
  box-shadow: 0 6px 20px #0006;
}

.cartes-restantes summary {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  padding: 1rem 1.25rem;
  color: #ffdc5e;
  font-weight: 700;
  cursor: pointer;
  list-style-position: inside;
}

.cartes-restantes summary strong {
  display: inline-grid;
  place-items: center;
  min-width: 2rem;
  min-height: 2rem;
  padding: 0 0.35rem;
  border-radius: 50%;
  background: #ffae00;
  color: #171a2b;
}

.liste-cartes-restantes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.55rem;
  margin: 0;
  padding: 0 1rem 1rem;
  list-style: none;
}

.liste-cartes-restantes li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.8rem;
  border: 1px solid #ffffff24;
  border-radius: 999px;
  background: #101321;
}

.liste-cartes-restantes li strong {
  color: #ffdc5e;
}

.aucune-carte-restante {
  padding: 0 1rem 1rem;
  text-align: center;
  color: #d4d7e4;
}

.roles-morts-inconnus {
  display: grid;
  gap: 0.65rem;
  margin: 0 1rem 1rem;
  padding: 0.8rem;
  border: 1px solid #ffae0066;
  border-radius: 10px;
  background: #342a15;
}

.roles-morts-inconnus p {
  margin: 0;
  color: #ffe08a;
}

.roles-morts-inconnus label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.roles-morts-inconnus select {
  max-width: 100%;
  padding: 0.45rem 0.6rem;
  border: 1px solid #ffae0080;
  border-radius: 8px;
  background: #181818;
  color: #fff;
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
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  min-width: 120px;
  min-height: 120px;
}

.remaining-card.joueur-mort-nuit {
  outline: 3px solid #e34242;
  background: linear-gradient(145deg, rgba(115, 18, 25, 0.9), rgba(35, 12, 18, 0.96));
  box-shadow: 0 0 20px rgba(227, 66, 66, 0.55);
}

.exclusion-button {
  position: absolute;
  top: 40px;
  left: 50%;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40%;
  max-width: 70px;
  border: 0;
  padding: 0;
  background: transparent;
  transform: translateX(-50%);
  cursor: pointer;
}

.exclusion-logo {
  opacity: 0.95;
  width: 100%;
  height: auto;
  transition: transform 0.2s;
}

.exclusion-button:hover .exclusion-logo,
.exclusion-button:focus-visible .exclusion-logo {
  transform: scale(1.10) rotate(-10deg);
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

.btn-lancer-partie:disabled,
.btn-next-phase:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
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

.btn-rejouer-footer {
  font-size: 0.85rem;
  padding: 0.3em 1.1em;
  margin-bottom: 0.3em;
  background: #ffae00;
  color: #23243a;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 2px 8px #0002;
  transition: background 0.2s;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.avertissement-comptage {
  margin: 0.75rem auto 1rem;
  color: #ffd36a;
  font-weight: 700;
  text-align: center;
}

.selection-perso,
.vote {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 2rem;
  text-shadow: 0 0 8px #fff70099;
}

.rappel {
  font-size: 1rem;
  text-align: center;
  color: #ffae00;
  margin-bottom: 2rem;
  margin-top: 2rem;
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
.mentor-annonce::before    { background: linear-gradient(90deg, #f4d803, #ff0000); }
.ours-annonce::before     { background: linear-gradient(90deg, #03a9f4, #00ffc8); }

/* Emoji pour chaque type */
.victim-annonce strong::before    { content: "💀 "; }
.protected-annonce strong::before { content: "🛡️ "; }
.amoureux-annonce strong::before  { content: "💘 "; }
.mentor-annonce strong::before    {content: "🧑 "; }
.ours-annonce strong::before     { content: "🐻 "; }

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

.phase-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2em;
  margin-bottom: 1.2em;
  width: 100%;
}

.phase-header > *:first-child,
.phase-header > .phase-header-spacer {
  flex: 0 0 60px; /* largeur fixe pour le bouton et le spacer */
}

.phase-nuit :deep(dialog[open]) {
  position: fixed;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
}

.phase-title {
  flex: 1 1 0;
  text-align: center;
  margin: 0;
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
  animation: fadeIn 0.75s forwards;
}

.pouvoirs-village-perdus {
  width: fit-content;
  max-width: calc(100% - 2rem);
  margin: 1rem auto;
  padding: 0.8rem 1.2rem;
  border: 1px solid #ffae00;
  border-radius: 10px;
  background: rgba(80, 45, 10, 0.9);
  color: #ffe08a;
  text-align: center;
  font-weight: 700;
}

.reaction-chasseur {
  display: grid;
  justify-items: center;
  gap: 0.7rem;
  width: min(720px, calc(100% - 2rem));
  margin: 1.25rem auto;
  padding: 1.2rem;
  border: 2px solid #ffae00;
  border-radius: 14px;
  background: linear-gradient(145deg, #342a15, #171a2b);
  color: #fff;
  text-align: center;
  box-shadow: 0 6px 20px #0008;
}

.reaction-chasseur h3,
.reaction-chasseur p {
  margin: 0;
}

.reaction-chasseur h3 {
  color: #ffdc5e;
}

.reaction-chasseur select,
.reaction-chasseur button {
  min-height: 42px;
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
}

.reaction-chasseur select {
  border: 1px solid #ffae0080;
  background: #181818;
  color: #fff;
}

.reaction-chasseur button {
  border: 0;
  background: linear-gradient(90deg, #ffae00, #ffe06a);
  color: #171a2b;
  font-weight: 800;
  cursor: pointer;
}

.reaction-chasseur button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.revelation-vote {
  width: min(900px, calc(100% - 2rem));
  margin: 1.5rem auto;
  padding: 1.25rem;
  border: 1px solid #ffae0080;
  border-radius: 16px;
  background: linear-gradient(145deg, #23243a, #171a2b);
  color: #fff;
  box-shadow: 0 6px 22px #0007;
}

.revelation-vote h3 {
  margin: 0 0 1rem;
  text-align: center;
  color: #ffdc5e;
  font-size: 1.5rem;
}

.liste-revelation-vote {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.8rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.revelation-vote-joueur {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem;
  border-radius: 12px;
  background: #111522;
  border: 1px solid #ffffff24;
  text-align: center;
}

.revelation-vote-nom {
  color: #ffdc5e;
  font-size: 1.2rem;
  text-transform: uppercase;
}

.revelation-role {
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: #315522;
  color: #c8ff9e;
  font-weight: 800;
}

.choix-role-label {
  display: grid;
  gap: 0.5rem;
  color: #d4d7e4;
}

.choix-role-label select {
  min-width: 200px;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ffae00;
  border-radius: 8px;
  background: #101321;
  color: #fff;
  font: inherit;
}

.aucune-elimination-vote {
  width: fit-content;
  margin: 1.5rem auto;
  padding: 0.8rem 1.2rem;
  border-radius: 10px;
  background: #23243a;
  color: #ffdc5e;
  text-align: center;
}

.bilan-nuit {
  width: min(100%, 900px);
  margin: 0 auto 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.bilan-nuit > div {
  padding: 1.2rem;
  border-radius: 14px;
  background: rgba(25, 34, 50, 0.92);
  border: 1px solid rgba(255, 174, 0, 0.35);
  box-shadow: 0 4px 16px #0006;
  color: #fff;
}

.bilan-nuit h3 {
  margin: 0 0 0.8rem;
  color: #ffae00;
  font-size: 1.25rem;
  text-align: center;
}

.bilan-nuit ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.bilan-morts {
  grid-column: 1 / -1;
  border: 2px solid #e34242 !important;
  background: linear-gradient(135deg, rgba(80, 15, 20, 0.96), rgba(35, 20, 30, 0.96)) !important;
}

.liste-morts-nuit {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.7rem;
}

.liste-morts-nuit li {
  padding: 0.65rem 1rem;
  border-radius: 10px;
  background: #9f1717;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 800;
  box-shadow: 0 3px 12px #0008;
}

.aucun-mort {
  margin: 0;
  color: #b6ff9c;
  font-size: 1.1rem;
  text-align: center;
}

.bilan-evenements li,
.bilan-protections li,
.bilan-infos p {
  margin: 0.45rem 0;
  padding: 0.55rem 0.7rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.28);
}

.evenement-infection { border-left: 4px solid #ad5cff; }
.evenement-protection,
.bilan-protections li { border-left: 4px solid #86cf46; }
.evenement-survie { border-left: 4px solid #ffae00; }

@media (max-width: 600px) {
  .bilan-nuit {
    grid-template-columns: 1fr;
  }

  .bilan-morts {
    grid-column: auto;
  }
}

.encart-victime-lg {
  margin: 1.2rem auto 0 auto;
  padding: 0.5rem 1.2rem;
  background: rgba(255, 30, 30, 0.06);
  border: 1px solid #ffb3b3;
  border-radius: 8px;
  color: #b80000;
  font-size: 1.05rem;
  font-weight: 500;
  text-align: center;
  max-width: 260px;
  box-shadow: 0 1px 4px #ff303022;
  letter-spacing: 0.5px;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>