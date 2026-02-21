<template>
  <ion-menu-button id="menuButton"></ion-menu-button>
</template>

<script setup lang="ts">
  import { IonMenuButton } from '@ionic/vue'

</script>
  
<style scoped>
  #menuButton
  {
    border-radius: 50%; /*Makes the clickable area a circle*/
    width: min(30px, 9vw);
    --padding-start: 0px;
    --padding-end: 0px;
  }
</style>
