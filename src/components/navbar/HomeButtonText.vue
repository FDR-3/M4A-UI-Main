<template>
  <ion-button id="homeButton" slot="start" fill="clear" @click="goHome()" router-link="/Jesus" router-direction="root">
    <StarWolf id="homeIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
    <ion-label id ="homeText" class="metal" color="dark">M<span id="homeText4A" class="metal">4A</span ><br>
      <span id="bottomHomeText" class="metal">PRot<span id="homeTextOC" class="metal">oc</span>ol</span>
    </ion-label>
  </ion-button>
</template>

<script setup lang="ts">
  import { IonButton,  IonLabel } from '@ionic/vue'
  import { navigation } from '/src/assets/globalStates/Navigation.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'

  function goHome()
  {
    navigation.menuIndex = 0
    localStorage.setItem("navigationMenuIndex", "0")
    navigation.navBarIndex = 0
    localStorage.setItem("navigationNavbarIndex", "0")
    navigation.pageIndex = 0
    localStorage.setItem("navigationPageIndex", "0")
  }
</script>

<style scoped>
  #homeIcon 
  {
    width: min(20vw,70px);
    height: min(20vw,70px)
  }

  #homeText
  {
    line-height: 17.878px
  }

  #homeText4A
  {
    letter-spacing: 3.1px
  }

  #homeTextOC
  {
    letter-spacing: 3.1px
  }

  #bottomHomeText
  {
    letter-spacing: 1.48px
  }

  @media screen and (min-width: 341px) 
  { 
    #homeText 
    {
      display: block
    }
  }
  @media screen and (max-width: 340px) 
  { 
    #homeText 
    {
      display: none
    }
  }
</style>
