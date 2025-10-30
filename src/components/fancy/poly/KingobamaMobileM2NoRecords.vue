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
  @media screen and (min-width: 510.1px) and (max-width: 670px)
  {
    .mobileSpaceFiller
    {
      margin-top: -2vw
    }
  }
  @media screen and (min-width: 468.1px) and (max-width: 510px)
  {
    .mobileSpaceFiller
    {
      margin-top: -6vw
    }
  }
  @media screen and (min-width: 450.1px) and (max-width: 468px)
  {
    .mobileSpaceFiller
    {
      margin-top: -7vw
    }
  }
  @media screen and (min-width: 377.1px) and (max-width: 450px)
  {
    .mobileSpaceFiller
    {
      margin-top: 0vw
    }
  }
  @media screen and (min-width: 314.1px) and (max-width: 377px)
  {
    .mobileSpaceFiller
    {
      margin-top: -5vw
    }
  }
  @media screen and (min-width: 282.1px) and (max-width: 314px)
  {
    .mobileSpaceFiller
    {
      margin-top: -11vw
    }
  }
  @media screen and (min-width: 258.1px) and (max-width: 282px)
  {
    .mobileSpaceFiller
    {
      margin-top: -17vw
    }
  }
  @media screen and (min-width: 218.1px) and (max-width: 258px)
  {
    .mobileSpaceFiller
    {
      margin-top: -23vw
    }
  }
  @media screen and (min-width: 203.1px) and (max-width: 218px)
  {
    .mobileSpaceFiller
    {
      margin-top: -25vw
    }
  }
  @media screen and (max-width: 203px)
  {
    .mobileSpaceFiller
    {
      margin-top: -34vw
    }
  }
  /*Set margin-top for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 670.1px)
    {
      .mobileSpaceFiller
      {
        display: none !important
      }
    }
    @media screen and (min-width: 505.1px) and (max-width: 670px)
    {
      .mobileSpaceFiller
      {
        margin-top: -2vw
      }
    }
    @media screen and (min-width: 450.1px) and (max-width: 505px)
    {
      .mobileSpaceFiller
      {
        margin-top: -7vw
      }
    }
    @media screen and (min-width: 384.1px) and (max-width: 450px)
    {
      .mobileSpaceFiller
      {
        margin-top: -1vw
      }
    }
    @media screen and (min-width: 349.1px) and (max-width: 384px)
    {
      .mobileSpaceFiller
      {
        margin-top: -5vw
      }
    }
    @media screen and (min-width: 331.1px) and (max-width: 349px)
    {
      .mobileSpaceFiller
      {
        margin-top: -10vw
      }
    }
    @media screen and (min-width: 285.1px) and (max-width: 331px)
    {
      .mobileSpaceFiller
      {
        margin-top: -7vw
      }
    }
    @media screen and (min-width: 247.1px) and (max-width: 285px)
    {
      .mobileSpaceFiller
      {
        margin-top: -15vw
      }
    }
    @media screen and (min-width: 211.1px) and (max-width: 247px)
    {
      .mobileSpaceFiller
      {
        margin-top: -18vw
      }
    }
    @media screen and (min-width: 171.1px) and (max-width: 211px)
    {
      .mobileSpaceFiller
      {
        margin-top: -24vw
      }
    }
    @media screen and (min-width: 164.1px) and (max-width: 171px)
    {
      .mobileSpaceFiller
      {
        margin-top: -20vw
      }
    }
    @media screen and (min-width: 139.1px) and (max-width: 164px)
    {
      .mobileSpaceFiller
      {
        margin-top: -5vw
      }
    }
    @media screen and (min-width: 131.1px) and (max-width: 139px)
    {
      .mobileSpaceFiller
      {
        margin-top: 1vw
      }
    }
    @media screen and (min-width: 113.1px) and (max-width: 131px)
    {
      .mobileSpaceFiller
      {
        margin-top: 12vw
      }
    }
    @media screen and (min-width: 74.1px) and (max-width: 113px)
    {
      .mobileSpaceFiller
      {
        margin-top: 18vw
      }
    }
    @media screen and (max-width: 74px)
    {
      .mobileSpaceFiller
      {
        margin-top: 85vw
      }
    }
  }
</style>