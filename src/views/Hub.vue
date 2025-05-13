<script setup>

</script>

<template>

    
     <h1 class="Bienvenue">Bienvenue</h1>
    
    <main>
        
        <h2>A quoi on joue</h2>

        <div class="flexbox">

    <ul>
        <li>
            <router-link to="" class="carte-lien"></router-link>
                <span class="carte-titre">Escape Game</span>
        </li>
        <li>
            <router-link to="/loupGarou" class="carte-lien"></router-link>
                <span class="carte-titre">Loup Garou</span>
        </li>
        <li>
            <router-link to="" class="carte-lien"></router-link>
                <span class="carte-titre">Quizz Game</span>

        </li>
        <li>
            <router-link to="" class="carte-lien"></router-link>
                <span class="carte-titre">Time s Up</span>
        </li>
        <li>
            <router-link to="/poker" class="carte-lien"></router-link>
            <span class="carte-titre">Poker</span>

        </li>
        <li><router-link to="" class="carte-lien"></router-link>
            <span class="carte-titre">Blind Test</span>

        </li>
    </ul>
</div>
</main>
<footer>
    <p>AMELINE-BOLLES Florian X 2025 Ecole de la station.</p>
</footer>

</template>

<style scoped>

h1 {
    color: white;
    font-family: "nokabold", sans-serif;
    text-align: center;
    font-size: 3rem;
    text-transform: uppercase;
    letter-spacing: 2px;
  transition: color 0.3s ease, transform 0.3s ease;
  cursor: pointer;
}

.Bienvenue:hover {
    text-shadow:  2px 2px 5px rgba(255, 255, 255, 0.907);
  }
  

main {
    min-height: 500px;
    width: 90%;
    background-color:#192232;
    /* 1è valeur = Haut/bas 2è valeur = gauche/droite  */
    margin : 0 auto;
    margin-top: 100px;
    border : 2px solid rgb(221, 218, 245);
    border-radius: 20px;
    box-shadow: 0px 0px 20px 4px #ffae00;
    padding: 20px;
    text-transform: uppercase;
    font-weight: bold;
}

h2 {
    margin: 0;
    text-align: center;
}

.flexbox {
    border: 2px solid #ffffff0d;
    border-radius: 10px;
    padding: 10px;
    margin-top: 30px;
}
.flexbox ul{
    padding: 0;
    display: flex;
 /* Répartie équitablement les éléments sur la page */
    justify-content: space-around;
}

.flexbox li {
    list-style: none;
    height: 220px; /* Augmente la hauteur */
    width: 220px;  /* Augmente la largeur */
    margin: 20px;
    display: flex;
    flex-direction: column; /* Pour empiler image et titre */
    justify-content: flex-end; /* Pour placer le titre en bas */
    align-items: center;
    border-radius: 16px;
    box-shadow: 0px 0px 20px 4px rgba(190, 5, 5, 0.619);
    font-size: 1rem;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
}
/* Menu Escape game  */

.flexbox li:nth-child(1) {
    background-image: url(../assets/assets-projet/autres/Break-out-escape-game.png);
    background-size:cover
    
}
.flexbox li:nth-child(1):hover {
    background-image: url(../assets/assets-projet/autres/Break-out-escape-game.png);
    background-size: cover;
    transform: scale(1.1);
    transition: transform 0.3s ease;
}
/* Menu Loup garou */
.flexbox li:nth-child(2) {
    background-image: url(../assets/assets-projet/autres/lg.jpg);
    background-size: cover;
    box-shadow: 0px 0px 20px 4px #00ff44 !important;
}

.flexbox li:nth-child(2):hover {
    background-image: url(../assets/assets-projet/autres/lg.jpg);
    background-size: cover;
    transform: scale(1.1);
    transition: transform 0.3s ease;
}
/* Menu quizz */
.flexbox li:nth-child(3) {
    background-image: url(../assets/assets-projet/autres/buzzer.jpg);
    background-size: cover
}

.flexbox li:nth-child(3):hover {
    background-image: url(../assets/assets-projet/autres/buzzer.jpg);
    background-size: cover;
    transform: scale(1.1);
    transition: transform 0.3s ease;
}
/* Menu Time's up */
.flexbox li:nth-child(4) {
    background-image: url(../assets/assets-projet/autres/timesup.jpg);
    background-size:cover;
    background-repeat: no-repeat;
    background-position: center;
}

.flexbox li:nth-child(4):hover {
    background-image: url(../assets/assets-projet/autres/timesup.jpg);
    background-size:cover;
    background-repeat: no-repeat;
    background-position: center;
    transform: scale(1.1);
    transition: transform 0.3s ease;
}
/* Menu poker */
.flexbox li:nth-child(5) {
    background-image: url(../assets/assets-projet/autres/pokertest.jpg);
    background-size:cover;
    background-repeat: no-repeat;
    background-position: center;
}
.flexbox li:nth-child(5):hover {
    background-image: url(../assets/assets-projet/autres/pokertest.jpg);
    background-size:cover;
    background-repeat: no-repeat;
    background-position: center;
    transform: scale(1.1);
    transition: transform 0.3s ease;
}
/* Menu Blind test */
.flexbox li:nth-child(6) {
    background-image: url(../assets/assets-projet/autres/blindtest.jpg);
    background-size:cover;
    background-repeat: no-repeat;
    background-position: center;
}
.flexbox li:nth-child(6):hover {
    background-image: url(../assets/assets-projet/autres/blindtest.jpg);
    background-size:cover;
    background-repeat: no-repeat;
    background-position: center;
    transform: scale(1.1);
    transition: transform 0.3s ease;
}

/* Le lien prend toute la carte */
.carte-lien {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 100%;
    text-decoration: none;
    background: transparent;
    border-radius: 16px;
    transition: background 0.2s;
    cursor: pointer;
}

/* Style du titre */
.carte-titre {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 1.25rem;
    font-weight: bold;
    color: #ffae00;
    background: rgba(25,34,50,0.85);
    padding: 10px 0 8px 0;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    letter-spacing: 1px;
    text-shadow: 1px 1px 6px #192232, 0 0 10px #ffae0099;
    margin-top: 0;
    pointer-events: none; /* Pour que le clic soit sur toute la carte */
}

/* Effet au survol de la carte */
.flexbox li:hover .carte-lien,
.carte-lien:hover {
    background: rgba(255, 174, 0, 0.10);
}

footer {
    text-align: center;
    margin-top: 200px;
    padding: 20px;
}

@font-face {
    font-family: "Noka";
    src: url(../Police/NokaTrial-Medium-BF63bccdebda4ed.otf) format("truetype");
}

@font-face {
    font-family: "NokaBold";
    src: url(../Police/NokaTrial-Bold-BF63bccdec13b50.otf) format("truetype");
}
</style>