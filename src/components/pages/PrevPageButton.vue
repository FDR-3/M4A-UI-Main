<template>
  <ion-button fill="clear" @click="prevPage()" :disabled="navigation.pageIndex == 0" :style="{opacity: navigation.pageIndex != 0 ? 1:0}">
    <ion-icon color="dark" class="pageIcon" :src="arrowBackCircle"></ion-icon>
  </ion-button>
</template>

<script setup lang="ts">
  import { IonIcon, IonButton } from '@ionic/vue'
  import { navigation } from '/src/assets/globalStates/Navigation.vue'
  import { arrowBackCircle } from 'ionicons/icons'

  function prevPage()
  {
    if(navigation.pageIndex != 0)
    {
      navigation.pageIndex--
      localStorage.setItem("navigationPageIndex", navigation.pageIndex)
    }
  }
</script>

<style scoped>
  .pageIcon
  {
    width: min(8vw, 44px);
    height: min(8vw, 44px)
  }
</style>
