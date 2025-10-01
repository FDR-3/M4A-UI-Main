<template>
  <div class="flexCenterRow mobileSpaceFiller">
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
    width: min(68vw, 550px);
    transform: rotate(-32deg) !important;
    position: absolute;
    top: -105px;
    left: -115px;
    z-index: 1
  }

  @media screen and (min-width: 751px) 
  { 
    .KingobamasCrown
    {
      width: min(66vw, 550px);
      top: min(10vw, -105px);
      left: min(10vw, -115px)
    }
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

  /*Mobile Space Filler*/
  @media screen and (min-width: 670.1px)
  {
    .mobileSpaceFiller
    {
      display: none !important
    }
  }
  @media screen and (min-width: 574.1px) and (max-width: 670px)
  {
    .mobileSpaceFiller
    {
      margin-top: -1vw
    }
  }
  @media screen and (min-width: 485.1px) and (max-width: 574px)
  {
    .mobileSpaceFiller
    {
      margin-top: -7vw
    }
  }
  @media screen and (min-width: 425.1px) and (max-width: 485px)
  {
    .mobileSpaceFiller
    {
      margin-top: -14vw
    }
  }
  @media screen and (min-width: 370.1px) and (max-width: 425px)
  {
    .mobileSpaceFiller
    {
      margin-top: -20vw
    }
  }
  @media screen and (min-width: 344.1px) and (max-width: 370px)
  {
    .mobileSpaceFiller
    {
      margin-top: -27vw
    }
  }
  @media screen and (min-width: 315.1px) and (max-width: 344px)
  {
    .mobileSpaceFiller
    {
      margin-top: -34vw
    }
  }
  @media screen and (min-width: 305.1px) and (max-width: 315px)
  {
    .mobileSpaceFiller
    {
      margin-top: -42vw
    }
  }
  @media screen and (min-width: 280.1px) and (max-width: 305px)
  {
    .mobileSpaceFiller
    {
      margin-top: -57vw
    }
  }
  @media screen and (min-width: 260.1px) and (max-width: 280px)
  {
    .mobileSpaceFiller
    {
      margin-top: -65vw
    }
  }
  @media screen and (min-width: 244.1px) and (max-width: 260px)
  {
    .mobileSpaceFiller
    {
      margin-top: -72vw
    }
  }
  @media screen and (min-width: 228.1px) and (max-width: 244px)
  {
    .mobileSpaceFiller
    {
      margin-top: -79vw
    }
  }
  @media screen and (min-width: 212.1px) and (max-width: 228px)
  {
    .mobileSpaceFiller
    {
      margin-top: -87vw
    }
  }
  @media screen and (min-width: 198.1px) and (max-width: 212px)
  {
    .mobileSpaceFiller
    {
      margin-top: -96vw
    }
  }
  @media screen and (max-width: 198px)
  {
    .mobileSpaceFiller
    {
      margin-top: -103vw
    }
  }
</style>