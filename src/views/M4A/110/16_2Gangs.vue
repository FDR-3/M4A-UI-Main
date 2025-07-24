<template>
  <div>
    <h1>M4A Protocol Gang Violence</h1>
    <div class="spaceRowEvenly">
      <ion-button fill="clear" @click="sourceCautionLight()">
        <img class="emergencyLight" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNNFOJAfPTdVlbcqUQE4iP1WwRarhv0NXzSKT8">
      </ion-button>
      <div>
        <br>
        <br>
        <h2>Explict Content Warning!!!!</h2>
        <a href="https://www.youtube.com/watch?v=eBMxvWBvfYA" target="_blank" class="noWrapText">Leaving Site</a>
      </div>
      <ion-button fill="clear" @click="sourceCautionLight()">
        <img class="emergencyLight" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNNFOJAfPTdVlbcqUQE4iP1WwRarhv0NXzSKT8">
      </ion-button>
    </div>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <NextPageButton/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IonButton } from '@ionic/vue'
  import { sourceCautionLight } from '/src/assets/helperFunctions/sources.ts'
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
</script>

<style scoped>
  .emergencyLight
  {
    width: min(50vw, 200px)
  }
</style>