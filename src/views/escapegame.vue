<template>

     <h1 class="Bienvenue">Bienvenue</h1>
    
    <main>
        
        <h2>Sélectionne ta salle</h2>

        <div class="flexbox">

    <ul>
        <li>
            <router-link to="/escapegame" class="carte-lien">
              <div class="carte-img" style="background-image: url('../assets/assets-projet/salles/viking.jpg');"></div>
              <span class="carte-titre">Viking</span>
            </router-link>
          </li>
          <li>
            <a href="http://192.168.0.100" class="carte-lien" target="_blank" rel="noopener">
              <div class="carte-img" style="background-image: url('../assets/assets-projet/salles/jura.jpg');"></div>
              <span class="carte-titre">Jurassic <br> Lab</span>
            </a>
          </li>
          <li>
            <router-link to="" class="carte-lien">
              <div class="carte-img" style="background-image: url('../assets/assets-projet/salles/alien.jpg');"></div>
              <span class="carte-titre">Alien <br> Investigation</span>
            </router-link>
          </li>
    </ul>
</div>
</main>
      <router-link to="/"><button class="btn-retour-accueil">Accueil</button></router-link>

<footer>
    <p>AMELINE-BOLLES Florian X 2025 Ecole de la station.</p>
</footer>

</template>

<script setup>


</script>

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
    margin : 0 auto;
    margin-top: 100px;
    border-radius: 20px;
    padding: 20px;
    text-transform: uppercase;
    font-weight: bold;
}

h2 {
    margin: 0;
    text-align: center;
}

.flexbox {
    border: none;
    background: none;
    border-radius: 0;
    padding: 0;
    margin-top: 30px;
}
.flexbox ul{
    padding: 0;
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.flexbox li {
    list-style: none;
    width: 320px;
    height: 380px;
    margin: 10px;
    border-radius: 18px;
    box-shadow: 0 4px 24px 0 #000a, 0 0 0 2px #ffae0033 inset;
    background: none;
    overflow: hidden;
    transition: transform 0.18s, box-shadow 0.18s;
    position: relative;
    display: flex;
    align-items: stretch;
}
/* Menu Escape game  */

.flexbox li:nth-child(1) {
    background-image: url(../assets/assets-projet/salles/viking.jpg);
    background-size:cover;
    box-shadow: 0px 0px 20px 4px #a78800;
}
.flexbox li:nth-child(1):hover {
    background-image: url(../assets/assets-projet/salles/viking.jpg);
    background-size: cover;
    transform: scale(1.1);
    transition: transform 0.3s ease;
}
/* Menu Loup garou */
.flexbox li:nth-child(2) {
    background-image: url(../assets/assets-projet/salles/jura.jpg);
    background-size: cover;
    box-shadow: 0px 0px 20px 4px #007208;
}

.flexbox li:nth-child(2):hover {
    background-image: url(../assets/assets-projet/salles/jura.jpg);
    background-size: cover;
    transform: scale(1.1);
    transition: transform 0.3s ease;
}
/* Menu lgob */
.flexbox li:nth-child(3) {
    background-image: url(../assets/assets-projet/salles/alien.jpg);
    background-size: cover;
    box-shadow: 0px 0px 20px 4px #000472;
}

.flexbox li:nth-child(3):hover {
    background-image: url(../assets/assets-projet/salles/alien.jpg);
    background-size: cover;
    transform: scale(1.1);
    transition: transform 0.3s ease;
}
/* Le lien prend toute la carte */
.carte-lien {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: stretch;
    width: 100%;
    height: 100%;
    text-decoration: none;
    background: transparent;
    border-radius: 18px;
    transition: background 0.2s;
    cursor: pointer;
    overflow: hidden;
}

.carte-img {
  flex: 1 1 auto;
  background-size: cover;
  background-position: center;
  width: 100%;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  transition: transform 0.25s;
}

.carte-lien:hover .carte-img {
  transform: scale(1.06);
  filter: brightness(1.08) saturate(1.2);
}

/* Style du titre */
.carte-titre {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 1.25rem;
    font-weight: bold;
    color: #ffae00;
    background: rgba(25,34,50,0.92);
    padding: 18px 0 14px 0;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    letter-spacing: 1px;
    text-shadow: 1px 1px 6px #192232, 0 0 10px #ffae0099;
    margin-top: 0;
    pointer-events: none; /* Pour que le clic soit sur toute la carte */
    backdrop-filter: blur(1.5px);
    min-height: 48px;
}

/* Effet au survol de la carte */
.flexbox li:hover .carte-lien,
.carte-lien:hover {
    background: rgba(255, 174, 0, 0.10);
}

.flexbox li:hover {
  transform: scale(1.04) translateY(-8px);
  box-shadow: 0 8px 40px 8px #ffae00cc, 0 0 0 2px #ffae00 inset;
  border-color: #ffae00;
  z-index: 2;

}
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

@media (max-width: 900px) {
  .flexbox ul {
    gap: 1rem;
  }
  .flexbox li {
    width: 200px;
    height: 240px;
    border-radius: 12px;
  }
  .carte-img {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  .carte-titre {
    font-size: 1rem;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    padding: 10px 0 8px 0;
    min-height: 32px;
  }
}

@media (max-width: 600px) {
  .flexbox li {
    width: 98vw;
    height: 120px;
    border-radius: 8px;
  }
  .carte-img {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .carte-titre {
    font-size: 0.85rem;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    padding: 6px 0 5px 0;
    min-height: 22px;
  }
}
</style>