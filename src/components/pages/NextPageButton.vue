<template>
  <ion-button fill="clear" @click="nextPage()" :disabled="lastPage" :style="{opacity: !lastPage ? 1:0}">
    <ion-icon color="dark" class="pageIcon" :src="arrowForwardCircle" ></ion-icon>
  </ion-button>
</template>

<script setup lang="ts">
  import { IonButton, IonIcon } from '@ionic/vue'
  import { navigation } from '/src/assets/globalStates/Navigation.vue'
  import { arrowForwardCircle } from 'ionicons/icons'

  const props = defineProps(['lastPage'])

  function nextPage()
  {
    if(!props.lastPage)
    {
      navigation.pageIndex++
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