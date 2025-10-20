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
  @media screen and (min-width: 585.1px) and (max-width: 670px)
  {
    .mobileSpaceFiller
    {
      margin-top: -2vw
    }
  }
  @media screen and (min-width: 548.1px) and (max-width: 585px)
  {
    .mobileSpaceFiller
    {
      margin-top: -8.5vw
    }
  }
  @media screen and (min-width: 545.1px) and (max-width: 548px)
  {
    .mobileSpaceFiller
    {
      margin-top: -16.2vw
    }
  }
  @media screen and (min-width: 517.1px) and (max-width: 545px)
  {
    .mobileSpaceFiller
    {
      margin-top: -13.2vw
    }
  }
  @media screen and (min-width: 488.1px) and (max-width: 517px)
  {
    .mobileSpaceFiller
    {
      margin-top: -20vw
    }
  }
  @media screen and (min-width: 462.1px) and (max-width: 488px)
  {
    .mobileSpaceFiller
    {
      margin-top: -28.5vw
    }
  }
  @media screen and (min-width: 444.1px) and (max-width: 462px)
  {
    .mobileSpaceFiller
    {
      margin-top: -35.3vw
    }
  }
  @media screen and (min-width: 415.1px) and (max-width: 444px)
  {
    .mobileSpaceFiller
    {
      margin-top: -67.0vw
    }
  }
  @media screen and (min-width: 388.1px) and (max-width: 415px)
  {
    .mobileSpaceFiller
    {
      margin-top: -80.0vw
    }
  }
  @media screen and (min-width: 365.1px) and (max-width: 388px)
  {
    .mobileSpaceFiller
    {
      margin-top: -92.0vw
    }
  }
  @media screen and (min-width: 358.1px) and (max-width: 365px)
  {
    .mobileSpaceFiller
    {
      margin-top: -105.0vw
    }
  }
  @media screen and (min-width: 337.1px) and (max-width: 358px)
  {
    .mobileSpaceFiller
    {
      margin-top: -115.0vw
    }
  }
  @media screen and (min-width: 320.1px) and (max-width: 337px)
  {
    .mobileSpaceFiller
    {
      margin-top: -127.0vw
    }
  }
  @media screen and (min-width: 302.1px) and (max-width: 320px)
  {
    .mobileSpaceFiller
    {
      margin-top: -141.0vw
    }
  }
  @media screen and (min-width: 286.1px) and (max-width: 302px)
  {
    .mobileSpaceFiller
    {
      margin-top: -155.0vw
    }
  }
  @media screen and (min-width: 272.1px) and (max-width: 286px)
  {
    .mobileSpaceFiller
    {
      margin-top: -171.0vw
    }
  }
  @media screen and (min-width: 258.1px) and (max-width: 272px)
  {
    .mobileSpaceFiller
    {
      margin-top: -185.0vw
    }
  }
  @media screen and (min-width: 240.1px) and (max-width: 258px)
  {
    .mobileSpaceFiller
    {
      margin-top: -201.0vw
    }
  }
  @media screen and (min-width: 232.1px) and (max-width: 240px)
  {
    .mobileSpaceFiller
    {
      margin-top: -85.0vw
    }
  }
  @media screen and (min-width: 244.1px) and (max-width: 232px)
  {
    .mobileSpaceFiller
    {
      margin-top: -93.0vw
    }
  }
  @media screen and (min-width: 212.1px) and (max-width: 224px)
  {
    .mobileSpaceFiller
    {
      margin-top: -101.0vw
    }
  }
  @media screen and (max-width: 212px)
  {
    .mobileSpaceFiller
    {
      margin-top: -108.0vw
    }
  }
  /*Set margin-top for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 517.1px) and (max-width: 545px)
    {
      .mobileSpaceFiller
      {
        margin-top: -13.0vw
      }
    }
    @media screen and (min-width: 490.1px) and (max-width: 517px)
    {
      .mobileSpaceFiller
      {
        margin-top: -19.0vw
      }
    }
    @media screen and (min-width: 460.1px) and (max-width: 490px)
    {
      .mobileSpaceFiller
      {
        margin-top: -27.0vw
      }
    }
    @media screen and (min-width: 444.1px) and (max-width: 460px)
    {
      .mobileSpaceFiller
      {
        margin-top: -35.0vw
      }
    }
    @media screen and (min-width: 415.1px) and (max-width: 444px)
    {
      .mobileSpaceFiller
      {
        margin-top: -37.0vw
      }
    }
    @media screen and (min-width: 388.1px) and (max-width: 415px)
    {
      .mobileSpaceFiller
      {
        margin-top: -47.2vw
      }
    }
    @media screen and (min-width: 374.1px) and (max-width: 388px)
    {
      .mobileSpaceFiller
      {
        margin-top: -57.5vw
      }
    }
    @media screen and (min-width: 358.1px) and (max-width: 374px)
    {
      .mobileSpaceFiller
      {
        margin-top: -70.0vw
      }
    }
    @media screen and (min-width: 339.1px) and (max-width: 358px)
    {
      .mobileSpaceFiller
      {
        margin-top: -75.4vw
      }
    }
    @media screen and (min-width: 320.1px) and (max-width: 339px)
    {
      .mobileSpaceFiller
      {
        margin-top: -88.4vw
      }
    }
    @media screen and (min-width: 302.1px) and (max-width: 320px)
    {
      .mobileSpaceFiller
      {
        margin-top: -98.8vw
      }
    }
    @media screen and (min-width: 286.1px) and (max-width: 302px)
    {
      .mobileSpaceFiller
      {
        margin-top: -111.4vw
      }
    }
    @media screen and (min-width: 272.1px) and (max-width: 286px)
    {
      .mobileSpaceFiller
      {
        margin-top: -122.5vw
      }
    }
    @media screen and (min-width: 258.1px) and (max-width: 272px)
    {
      .mobileSpaceFiller
      {
        margin-top: -135.1vw
      }
    }
    @media screen and (min-width: 240.1px) and (max-width: 258px)
    {
      .mobileSpaceFiller
      {
        margin-top: -150.0vw
      }
    }
    @media screen and (min-width: 167.1px) and (max-width: 240px)
    {
      .mobileSpaceFiller
      {
        margin-top: -30.0vw
      }
    }
    @media screen and (max-width: 167px)
    {
      .mobileSpaceFiller
      {
        margin-top: 120.5vw
      }
    }
  }
</style>