<template>
  <div class="flexCenterRow nSmallMarginBottom">
    <div class="overlayContainer">
      <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNl7yVwaQI8q5NK7Szk01wJgXYZuyrWDbmcx3v" class="KingobamasCrown"/>
      <ion-button fill="clear" @click="sourceKingobamaCrown()">
        <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNaZ7wqzeioXKfgiJR3mI9SN2wMY8ULeF1syb7"/>
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IonButton } from '@ionic/vue'
  import { sourceKingobamaCrown } from '/src/assets/helperFunctions/sources.ts'
</script>

<style scoped>
  .overlayContainer
  {
    position: relative
  }

  .KingobamaTextContainer
  {
    font-size: 37px;
    height: 100px
  }

  .KingobamasCrown
  {
    pointer-events: none;
    width: 550px;
    transform: rotate(-32deg) !important;
    position: absolute;
    top: -105px;
    left: -115px;
    z-index: 1
  }

  @media screen and (min-width: 420.1px) and (max-width: 750px) 
  { 
    .KingobamasCrown
    {
      width: 70vw;
      top: -11vw;
      left: -11vw;
      z-index: 1
    }
  }
  @media screen and (min-width: 300.1px) and (max-width: 420px) 
  { 
    .KingobamasCrown
    {
      width: 68vw;
      top: -10vw;
      left: -9vw
    }
  }
  @media screen and (min-width: 250.1px) and (max-width: 300px) 
  { 
    .KingobamasCrown
    {
      width: 68vw;
      top: -10vw;
      left: -9vw
    }
  }
  @media screen and (min-width: 225.1px) and (max-width: 250px) 
  { 
    .KingobamasCrown
    {
      width: 68vw;
      top: -9vw;
      left: -8vw
    }
  }
  @media screen and (min-width: 200.1px) and (max-width: 225px) 
  { 
    .KingobamasCrown
    {
      width: 64vw;
      top: -8.0vw;
      left: -6.0vw
    }
  }
  @media screen and (min-width: 185.1px) and (max-width: 200px) 
  { 
    .KingobamasCrown
    {
      width: 64vw;
      top: -8.0vw;
      left: -6.0vw
    }
  }
  @media screen and (min-width: 170.1px) and (max-width: 185px) 
  { 
    .KingobamasCrown
    {
      width: 64vw;
      top: -8.0vw;
      left: -6.0vw
    }
  }
  @media screen and (min-width: 160.1px) and (max-width: 170px) 
  { 
    .KingobamasCrown
    {
      width: 62vw;
      top: -6.0vw;
      left: -4.0vw
    }
  }
  @media screen and (min-width: 155.1px) and (max-width: 160px) 
  { 
    .KingobamasCrown
    {
      width: 62vw;
      top: -6.0vw;
      left: -4.0vw
    }
  }
  @media screen and (min-width: 150.1px) and (max-width: 155px) 
  { 
    .KingobamasCrown
    {
      width: 62vw;
      top: -6.0vw;
      left: -4.0vw
    }
  }
  @media screen and (min-width: 147.1px) and (max-width: 150px) 
  { 
    .KingobamasCrown
    {
      width: 62vw;
      top: -6.0vw;
      left: -4.0vw
    }
  }
  @media screen and (min-width: 144.1px) and (max-width: 147px) 
  { 
    .KingobamasCrown
    {
      width: 62vw;
      top: -6.0vw;
      left: -4.0vw
    }
  }
  @media screen and (min-width: 142.1px) and (max-width: 144px) 
  { 
    .KingobamasCrown
    {
      width: 62vw;
      top: -6.0vw;
      left: -4.0vw
    }
  }
  @media screen and (min-width: 137.1px) and (max-width: 142px) 
  { 
    .KingobamasCrown
    {
      width: 62vw;
      top: -6.0vw;
      left: -4.0vw
    }
  }
  @media screen and (min-width: 135.1px) and (max-width: 137px) 
  { 
    .KingobamasCrown
    {
      width: 62vw;
      top: -6.0vw;
      left: -4.0vw
    }
  }
  @media screen and (max-width: 135px) 
  { 
    .KingobamasCrown
    {
      width: 0vw
    }
  }
</style>