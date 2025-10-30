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
  @media screen and (min-width: 600.1px) and (max-width: 670px)
  {
    .mobileSpaceFiller
    {
      margin-top: -1vw
    }
  }
  @media screen and (min-width: 550.1px) and (max-width: 600px)
  {
    .mobileSpaceFiller
    {
      margin-top: -2vw
    }
  }
  @media screen and (min-width: 510.1px) and (max-width: 550px)
  {
    .mobileSpaceFiller
    {
      margin-top: -4vw
    }
  }
  @media screen and (min-width: 470.1px) and (max-width: 510px)
  {
    .mobileSpaceFiller
    {
      margin-top: -7vw
    }
  }
  @media screen and (min-width: 450.1px) and (max-width: 470px)
  {
    .mobileSpaceFiller
    {
      margin-top: -10vw
    }
  }
  @media screen and (min-width: 410.1px) and (max-width: 450px)
  {
    .mobileSpaceFiller
    {
      margin-top: -12vw
    }
  }
  @media screen and (min-width: 377.1px) and (max-width: 410px)
  {
    .mobileSpaceFiller
    {
      margin-top: -15vw
    }
  }
  @media screen and (min-width: 353.1px) and (max-width: 377px)
  {
    .mobileSpaceFiller
    {
      margin-top: -19vw
    }
  }
  @media screen and (min-width: 328.1px) and (max-width: 353px)
  {
    .mobileSpaceFiller
    {
      margin-top: -23vw
    }
  }
  @media screen and (min-width: 305.1px) and (max-width: 328px)
  {
    .mobileSpaceFiller
    {
      margin-top: -28vw
    }
  }
  @media screen and (min-width: 285.1px) and (max-width: 305px)
  {
    .mobileSpaceFiller
    {
      margin-top: -32vw
    }
  }
  @media screen and (min-width: 268.1px) and (max-width: 285px)
  {
    .mobileSpaceFiller
    {
      margin-top: -40vw
    }
  }
  @media screen and (min-width: 252.1px) and (max-width: 268px)
  {
    .mobileSpaceFiller
    {
      margin-top: -47vw
    }
  }
  @media screen and (min-width: 227.1px) and (max-width: 252px)
  {
    .mobileSpaceFiller
    {
      margin-top: -53vw
    }
  }
  @media screen and (min-width: 215.1px) and (max-width: 227px)
  {
    .mobileSpaceFiller
    {
      margin-top: -66vw
    }
  }
  @media screen and (min-width: 204.1px) and (max-width: 215px)
  {
    .mobileSpaceFiller
    {
      margin-top: -71vw
    }
  }
  @media screen and (min-width: 193.1px) and (max-width: 204px)
  {
    .mobileSpaceFiller
    {
      margin-top: -77vw
    }
  }
  @media screen and (max-width: 193px)
  {
    .mobileSpaceFiller
    {
      margin-top: -83vw
    }
  }
  /*Set margin-top for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 268.1px) and (max-width: 285px)
    {
      .mobileSpaceFiller
      {
        margin-top: -34vw
      }
    }
    @media screen and (min-width: 252.1px) and (max-width: 268px)
    {
      .mobileSpaceFiller
      {
        margin-top: -38vw
      }
    }
    @media screen and (min-width: 227.1px) and (max-width: 252px)
    {
      .mobileSpaceFiller
      {
        margin-top: -42vw
      }
    }
    @media screen and (min-width: 215.1px) and (max-width: 227px)
    {
      .mobileSpaceFiller
      {
        margin-top: -49vw
      }
    }
    @media screen and (min-width: 204.1px) and (max-width: 215px)
    {
      .mobileSpaceFiller
      {
        margin-top: -52vw
      }
    }
    @media screen and (min-width: 193.1px) and (max-width: 204px)
    {
      .mobileSpaceFiller
      {
        margin-top: -57vw
      }
    }
    @media screen and (min-width: 155.1px) and (max-width: 193px)
    {
      .mobileSpaceFiller
      {
        margin-top: -62vw
      }
    }
    @media screen and (max-width: 155px)
    {
      .mobileSpaceFiller
      {
        margin-top: -76vw
      }
    }
  }
</style>