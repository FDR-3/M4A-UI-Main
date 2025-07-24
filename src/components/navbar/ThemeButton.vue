<template>
  <ion-button id="themeButton" fill="clear" color="dark" @click="paletteIcon=toggleTheme()">
    <ion-icon id="themeIcon" :src=paletteIcon></ion-icon>
  </ion-button>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { IonButton, IonIcon } from '@ionic/vue'
  import { sunny, moon } from 'ionicons/icons'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  
  var paletteIcon = ref()

  onMounted(() =>
  {
    paletteIcon.value = initializeTheme()
  })

  function toggleTheme()
  {
    if(localStorage.getItem("userTheme") === "lightTheme") 
    {
      document.documentElement.classList.toggle('ion-palette-dark', true)
      localStorage.setItem("userTheme", "darkTheme")
      darkTheme.value = true
      return sunny
    }
    else
    {
      document.documentElement.classList.toggle('ion-palette-dark', false)
      localStorage.setItem("userTheme", "lightTheme")
      darkTheme.value = false
      return moon
    }
  }

  function initializeTheme()
  {
    if(localStorage.getItem("userTheme") === "lightTheme") 
    {
      document.documentElement.classList.toggle('ion-palette-dark', false)
      localStorage.setItem("userTheme", "lightTheme")
      darkTheme.value = false
      return moon
    }
    else
    {
      //Set user theme to dark by default if undefined
      document.documentElement.classList.toggle('ion-palette-dark', true)
      localStorage.setItem("userTheme", "darkTheme")
      darkTheme.value = true
      return sunny
    }
  }
</script>
  
<style scoped>
  #themeButton
  {
    margin-left: -11px;
    margin-right: -13px;
    padding: 0px
  }

  #themeIcon
  {
    width: min(30px, 9vw);
    margin: 0px;
    height: 27px
  }
</style>
