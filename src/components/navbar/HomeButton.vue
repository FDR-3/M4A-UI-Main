<template>  

  <ion-button id="fullHomeButton" class="nSmallMarginLeft" fill="clear" color="dark" @click="goHome()" router-direction="root" router-link="/Jesus">
    <StarWolfBanner id="fullHomeIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
  </ion-button>
  <ion-button id="smallHomeButton" style="margin-left: -13px; margin-top: 2px" fill="clear" color="dark" @click="goHome()" router-direction="root" router-link="/Jesus">
    <StarWolf id="smallHomeIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
  </ion-button>

</template>

<script setup lang="ts">
  import { IonButton } from '@ionic/vue'
  import { navigation, MenuIndex } from '/src/assets/globalStates/Navigation.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import StarWolfBanner from '/src/assets/svg/star-wolf-banner-svg.vue'
  

  function goHome()
  {
    navigation.menuIndex = MenuIndex.Jesus
    navigation.navBarIndex = 0
    navigation.pageIndex = 0
    localStorage.setItem("navigationMenuIndex", navigation.menuIndex.toString())
    localStorage.setItem("navigationNavbarIndex", navigation.navBarIndex.toString())
    localStorage.setItem("navigationPageIndex", navigation.pageIndex.toString())
  }
</script>

<style scoped>
  #fullHomeIcon
  {
    width: 200px;
    height: 80px;
    margin-right: -13px
  }

  #smallHomeIcon
  {
    width: 70px;
    height: 75px;
    margin-right: -13px
  }

  @media screen and (min-width: 380px)
  {
    #fullHomeButton
    {
      display: block
    }

    #smallHomeButton
    {
      display: none
    }
  }

  @media screen and (max-width: 379.9px)
  {
    #fullHomeButton
    {
      display: none
    }

    #smallHomeButton
    {
      display: block
    }
  }
</style>