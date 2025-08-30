<template>
  <h1>Treasury</h1>   
  <HODLTreasuryTable/>
  <SinglePayerTreasuryTable/>
  <!--<div class="videoFlipContainer">
    <div class="videoCard" :class="flipped">
      <div class="frontVideo" :style="{display: display1stVideo}">
        <h1>Treasury</h1>
        <ion-button @click="flipVideo()"></ion-button>
        <HODLTreasuryTable/>
        <SinglePayerTreasuryTable/>
      </div>

      <div class="backVideo" :style="{display: display2ndVideo}">
        <h1>Reserves</h1>
        <ion-button @click="flipVideo()"></ion-button>
        <ReservesTable/>
      </div>
    </div>
  </div> -->
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { IonButton } from '@ionic/vue'
  import HODLTreasuryTable from '/src/components/tables/lending/HODLTreasuryTable.vue'
  import SinglePayerTreasuryTable from '/src/components/tables/lending/SinglePayerTreasuryTable.vue'
  import ReservesTable from '/src/components/tables/lending/ReservesTable.vue'

  defineProps(['colorName', 'colorHexValue'])//This just keeps a warning from going off since all pages get feed these props

  var flipping = ref(false)
  var flipped = ""
  var display1stVideo = ref("")
  var display2ndVideo = ref("none")

  function flipVideo()
  {
    document.getElementById("topOfPage")?.scrollIntoView()

    flipping.value = true

    if(flipped == "")
    {
      flipped = "flipped"
      display2ndVideo.value = "block"

      setTimeout(() => 
      {
        display1stVideo.value = "none"
        flipping.value = false
      }, 500) // 1000 milliseconds == 1 seconds
    }
    else
    {
      flipped = ""
      display1stVideo.value = "block"

      setTimeout(() => 
      {
        display2ndVideo.value = "none"
        flipping.value = false
      }, 500) // 1000 milliseconds == 1 seconds
    }   
  }
</script>

<style scoped>
  .videoFlipContainer
  {
    position: relative;
    width: 1800px !important; 
    height: min(34vw, 1080px)
  }

  .videoCard
  {
    position: absolute;

    width: 1200px; 
    transform-style: preserve-3d;
    transition: all 0.5s ease
  }

  .videoCard.flipped
  {
    transform: rotateY(180deg)
  }

  .frontVideo
  {
    position: absolute;
    backface-visibility: hidden;
  }

  .backVideo
  {
    position: absolute;
    backface-visibility: hidden;
    transform: rotateY(180deg)
  }
</style>