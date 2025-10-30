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

  /*Mobile Space Filler*/
  @media screen and (min-width: 670.1px)
  {
    .mobileSpaceFiller
    {
      display: none !important
    }
  }
  @media screen and (min-width: 525.1px) and (max-width: 670px)
  {
    .mobileSpaceFiller
    {
      margin-top: -1vw
    }
  }
  @media screen and (min-width: 483.1px) and (max-width: 525px)
  {
    .mobileSpaceFiller
    {
      margin-top: -8vw
    }
  }
  @media screen and (min-width: 454.1px) and (max-width: 483px)
  {
    .mobileSpaceFiller
    {
      margin-top: -18vw
    }
  }
  @media screen and (min-width: 414.1px) and (max-width: 454px)
  {
    .mobileSpaceFiller
    {
      margin-top: -21vw
    }
  }
  @media screen and (min-width: 379.1px) and (max-width: 414px)
  {
    .mobileSpaceFiller
    {
      margin-top: -26vw
    }
  }
  @media screen and (min-width: 360.1px) and (max-width: 379px)
  {
    .mobileSpaceFiller
    {
      margin-top: -32vw
    }
  }
  @media screen and (min-width: 344.1px) and (max-width: 360px)
  {
    .mobileSpaceFiller
    {
      margin-top: -38vw
    }
  }
  @media screen and (min-width: 325.1px) and (max-width: 344px)
  {
    .mobileSpaceFiller
    {
      margin-top: -42vw
    }
  }
  @media screen and (min-width: 301.1px) and (max-width: 325px)
  {
    .mobileSpaceFiller
    {
      margin-top: -49vw
    }
  }
  @media screen and (min-width: 292.1px) and (max-width: 301px)
  {
    .mobileSpaceFiller
    {
      margin-top: -56vw
    }
  }
  @media screen and (min-width: 260.1px) and (max-width: 292px)
  {
    .mobileSpaceFiller
    {
      margin-top: -64vw
    }
  }
  @media screen and (min-width: 235.1px) and (max-width: 260px)
  {
    .mobileSpaceFiller
    {
      margin-top: -80vw
    }
  }
  @media screen and (min-width: 207.1px) and (max-width: 235px)
  {
    .mobileSpaceFiller
    {
      margin-top: -102vw
    }
  }
  @media screen and (min-width: 100.1px) and (max-width: 207px)
  {
    .mobileSpaceFiller
    {
      margin-top: -117vw
    }
  }
</style>