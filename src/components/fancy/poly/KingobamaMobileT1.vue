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
  @media screen and (min-width: 520.1px) and (max-width: 670px)
  {
    .mobileSpaceFiller
    {
      margin-top: -1vw
    }
  }
  @media screen and (min-width: 450.1px) and (max-width: 520px)
  {
    .mobileSpaceFiller
    {
      margin-top: -8vw
    }
  }
  @media screen and (min-width: 400.1px) and (max-width: 450px)
  {
    .mobileSpaceFiller
    {
      margin-top: -15vw
    }
  }
  @media screen and (min-width: 364.1px) and (max-width: 400px)
  {
    .mobileSpaceFiller
    {
      margin-top: -22vw
    }
  }
  @media screen and (min-width: 332.1px) and (max-width: 364px)
  {
    .mobileSpaceFiller
    {
      margin-top: -30vw
    }
  }
  @media screen and (min-width: 320.1px) and (max-width: 332px)
  {
    .mobileSpaceFiller
    {
      margin-top: -39vw
    }
  }
  @media screen and (min-width: 292.1px) and (max-width: 320px)
  {
    .mobileSpaceFiller
    {
      margin-top: -42vw
    }
  }
  @media screen and (min-width: 265.1px) and (max-width: 292px)
  {
    .mobileSpaceFiller
    {
      margin-top: -55vw
    }
  }
  @media screen and (min-width: 234.1px) and (max-width: 265px)
  {
    .mobileSpaceFiller
    {
      margin-top: -73vw
    }
  }
  @media screen and (min-width: 220.1px) and (max-width: 234px)
  {
    .mobileSpaceFiller
    {
      margin-top: -89vw
    }
  }
  @media screen and (min-width: 205.1px) and (max-width: 220px)
  {
    .mobileSpaceFiller
    {
      margin-top: -97vw
    }
  }
  @media screen and (min-width: 185.1px) and (max-width: 205px)
  {
    .mobileSpaceFiller
    {
      margin-top: -107vw
    }
  }
  @media screen and (min-width: 174.1px) and (max-width: 185px)
  {
    .mobileSpaceFiller
    {
      margin-top: -118vw
    }
  }
  @media screen and (min-width: 164.1px) and (max-width: 174px)
  {
    .mobileSpaceFiller
    {
      margin-top: -128vw
    }
  }
  @media screen and (max-width: 164px)
  {
    .mobileSpaceFiller
    {
      margin-top: -138vw
    }
  }
  /*Fire Fox Mobile Space Filler*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 332.1px) and (max-width: 364px)
    {
      .mobileSpaceFiller
      {
        margin-top: -34vw
      }
    }
    @media screen and (min-width: 320.1px) and (max-width: 332px)
    {
      .mobileSpaceFiller
      {
        margin-top: -43vw
      }
    }
    @media screen and (min-width: 292.1px) and (max-width: 320px)
    {
      .mobileSpaceFiller
      {
        margin-top: -48vw
      }
    }
    @media screen and (min-width: 265.1px) and (max-width: 292px)
    {
      .mobileSpaceFiller
      {
        margin-top: -59vw
      }
    }
    @media screen and (min-width: 234.1px) and (max-width: 265px)
    {
      .mobileSpaceFiller
      {
        margin-top: -70vw
      }
    }
    @media screen and (min-width: 220.1px) and (max-width: 234px)
    {
      .mobileSpaceFiller
      {
        margin-top: -84vw
      }
    }
    @media screen and (min-width: 205.1px) and (max-width: 220px)
    {
      .mobileSpaceFiller
      {
        margin-top: -91vw
      }
    }
    @media screen and (min-width: 185.1px) and (max-width: 205px)
    {
      .mobileSpaceFiller
      {
        margin-top: -101vw
      }
    }
    @media screen and (min-width: 174.1px) and (max-width: 185px)
    {
      .mobileSpaceFiller
      {
        margin-top: -111vw
      }
    }
    @media screen and (min-width: 164.1px) and (max-width: 174px)
    {
      .mobileSpaceFiller
      {
        margin-top: -122vw
      }
    }
    @media screen and (max-width: 164px)
    {
      .mobileSpaceFiller
      {
        margin-top: -131vw
      }
    }
  }
</style>