<template >
  <div>
    <ion-text id="AccessText" class="super" >Access Denied</ion-text>
  </div>
  <div class="rainbowStarWolfBanner mediumMarginBottom">
    <RIPRainbowStarWolf v-if="adminAccounts.ceoIsDead" id="rainbowWolf"/>
    <RainbowStarWolf v-else id="rainbowWolf"/>
    <p class="logoText rainbowText"><span class="logoText">M<span class="logoText" id="logo4A">4A</span></span><span class ="logoText" id="bottomLogo"><br>Prot<span class="logoText" id="logoO">o</span>col</span></p>
  </div>
  <!--<div class="smallMarginTop mediumMarginBottom" >
    <ion-text id="AccessText" class="super rainbowText" >. T.Y.A.B.T.E.</ion-text>
  </div>-->
  <!--<ion-text id="AccessText" class="super">Visit m4a.io to learn more</ion-text>-->
</template>

<script setup lang="ts">
  import { IonText } from '@ionic/vue'
  import RainbowStarWolf from '/src/components/fancy/RainbowStarWolf.vue'
  import RIPRainbowStarWolf from '/src/components/fancy/RIPRainbowStarWolf.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
</script>

<style scoped>
  #rainbowWolf
  {
    width: min(42vw, 550px);
    height: min(44vw, 577px);
  }

  .logoText
  {
    font-family: SuperMagic;
    font-size: min(7vw, 160px);
    line-height: min(5.7vw, 200px)
  }

  #logo4A
  {
    letter-spacing: 4px
  }

  #logoO
  {
    letter-spacing: 7px
  }

  #bottomLogo
  {
    letter-spacing: 5px
  }

  #AccessText
  {
    font-size: min(15vw, 170px)
  }

  @media screen and (min-width: 201px) 
  { 
    .rainbowStarWolfBanner
  {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center
  }
  }

  @media screen and (max-width: 200px) 
  { 
    .rainbowStarWolfBanner
    {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center
    }
  }
</style>
