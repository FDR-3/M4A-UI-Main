<template>
  <div class="flexCenterRow obamaContainer">
    <div class="overlayContainer">
      <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNl7yVwaQI8q5NK7Szk01wJgXYZuyrWDbmcx3v" class="KingobamasCrown"/>
      <ion-button fill="clear" @click="sourceKingobamaCrown()">
        <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNAXLrl5F2r4R183qO0kYoBvxFHy75cgZzsbND"/>
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

  @media screen and (min-width: 830.1px) and (max-width: 892px) 
  { 
    .KingobamasCrown
    {
      width: 55vw;
      top: -9vw;
      left: -9vw
    }
  }
  @media screen and (min-width: 644.1px) and (max-width: 830px) 
  { 
    .KingobamasCrown
    {
      width: 54vw;
      top: -9vw;
      left: -9vw
    }
  }
  @media screen and (min-width: 551.1px) and (max-width: 644px) 
  { 
    .KingobamasCrown
    {
      width: 52vw;
      top: -9vw;
      left: -9vw
    }
  }
  @media screen and (min-width: 420.1px) and (max-width: 551px) 
  { 
    .KingobamasCrown
    {
      width: 50vw;
      top: -9vw;
      left: -9vw
    }
  }
  @media screen and (min-width: 350.1px) and (max-width: 420px) 
  { 
    .KingobamasCrown
    {
      width: 44vw;
      top: -6vw;
      left: -6vw
    }
  }
  @media screen and (min-width: 325.1px) and (max-width: 350px) 
  { 
    .KingobamasCrown
    {
      width: 38vw;
      top: -4vw;
      left: -3vw
    }
  }
  @media screen and (min-width: 300.1px) and (max-width: 325px) 
  { 
    .KingobamasCrown
    {
      width: 34vw;
      top: -3vw;
      left: -1vw
    }
  }
  @media screen and (min-width: 270.1px) and (max-width: 300px) 
  { 
    .KingobamasCrown
    {
      width: 33vw;
      top: -3vw;
      left: -1vw
    }
  }
  @media screen and (min-width: 240.1px) and (max-width: 270px) 
  { 
    .KingobamasCrown
    {
      width: 30vw;
      top: -1vw;
      left: 0vw
    }
  }
  @media screen and (min-width: 215.1px) and (max-width: 240px) 
  { 
    .KingobamasCrown
    {
      width: 25vw;
      top: 0vw;
      left: 2vw
    }
  }
  @media screen and (min-width: 200.1px) and (max-width: 215px) 
  { 
    .KingobamasCrown
    {
      width: 21vw;
      top: 1vw;
      left: 4vw
    }
  }
  @media screen and (min-width: 185.1px) and (max-width: 200px) 
  { 
    .KingobamasCrown
    {
      width: 18vw;
      top: 2vw;
      left: 5vw
    }
  }
  @media screen and (min-width: 177px) and (max-width: 185px) 
  { 
    .KingobamasCrown
    {
      width: 14vw;
      top: 4vw;
      left: 7vw
    }
  }
  @media screen and (min-width: 172.1px) and (max-width: 177px) 
  { 
    .KingobamasCrown
    {
      width: 11vw;
      top: 5vw;
      left: 8vw
    }
  }
  @media screen and (min-width: 170.1px) and (max-width: 172px) 
  { 
    .KingobamasCrown
    {
      width: 10vw;
      top: 7vw;
      left: 9vw
    }
  }
  @media screen and (max-width: 170px) 
  { 
    .KingobamasCrown
    {
      width: 0vw
    }
  }

  /*kingObamaContainer*/
  @media screen and (min-width: 270.1px) and (max-width: 420px) 
  { 
    .obamaContainer
    {
      margin-top: -15px
    }
  }
  @media screen and (min-width: 215.1px) and (max-width: 270px) 
  { 
    .obamaContainer
    {
      margin-top: -18px
    }
  }
  @media screen and (min-width: 200.1px) and (max-width: 215px) 
  { 
    .obamaContainer
    {
      margin-top: -22px
    }
  }
  @media screen and (max-width: 200px) 
  { 
    .obamaContainer
    {
      margin-top: -29px
    }
  }
</style>