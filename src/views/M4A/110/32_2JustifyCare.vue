<template>
  <div>
    <h1>United Against Your Health Care Forces Doctor To Justify Care During Surgery</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <div>
        <iframe class="videoContainer"
          src="https://www.youtube.com/embed/mVBLLnDnt9A"
          allowfullscreen
          allowtransparency
        ></iframe>
      </div>
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=mVBLLnDnt9A" target="_blank">Humanist Report</a><br>
      </p>
    </div>

    <div class="sources">
      <div class="flexCenterRow">
        <ion-button fill="clear" @click="sourceCautionLight()">
          <img class="emergencyLight" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNNFOJAfPTdVlbcqUQE4iP1WwRarhv0NXzSKT8">
        </ion-button>
        <div style="margin-top: 13px">
          <h2>Update</h2>
        </div>
        <ion-button fill="clear" @click="sourceCautionLight()">
          <img class="emergencyLight" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNNFOJAfPTdVlbcqUQE4iP1WwRarhv0NXzSKT8">
        </ion-button>
      </div>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=MuBWVLVO2zA" target="_blank">Status Coup News</a><br>
      </p>
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
    margin-top: 10px;
    width: min(20vw, 70px)
  }
</style>
