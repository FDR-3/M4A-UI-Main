<template>
  <div>
    <div class="largeMarginTop"></div>
    <h1>End Game</h1>
    <div v-if="connectedWallet.hasGoodEnding">
      <h2>Good Ending</h2>
      <br>
      <h2 class="noWrapText">💚 💚 <span id="heartSpacing" style="margin-bottom: -5px">💚</span> 💚 💚 💚</h2>
      <h2 class="noWrapText">💚 Thanka You So Much 💚</h2>
      <h2 class="noWrapText">💚 Fora Playing Mah Game 💚</h2>
      <a href="https://www.youtube.com/watch?v=h6DtVHqyYts" target="_blank" class="noWrapText"><h2>💚 You're Winner<span id="winnerSpacing">!</span> :D 💚</h2></a>
      <h2 class="noWrapText">💚 Always Give 💚</h2>
      <h2 class="noWrapText">💚 <span class="rainbowText">%110</span> 💚</h2>
      <h2>💚</h2>

      <SpecialThanks/>
      
      <div class="flexCenterRow">
        <PrevPageButton/>
        <div>
          <iframe class="videoContainer"
            src="https://www.youtube.com/embed/xWUQ40XT0jI"
            allowfullscreen
            allowtransparency
            allow="autoplay"
          ></iframe>
        </div>
        <NextPageButton :lastPage="true"/>
      </div>
      <div class="sources">
        <h1>Sources</h1>
        <p align="left">Links<br>
          <a href="https://www.youtube.com/watch?v=xWUQ40XT0jI" target="_blank">burialgoods</a><br>
        </p>
      </div>
      
      <SetUserName/>
      <CommentSectionTable/>
    </div>
    <div v-else>
      <h2>Bad Ending!!!!</h2>
      <div class="flexCenterRow">
        <PrevPageButton/>

        <div class="overlayContainer">
          <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNl7yVwaQI8q5NK7Szk01wJgXYZuyrWDbmcx3v" class="KingobamasCrown"/>
          <ion-button fill="clear" @click="sourceKingobamaCrown()">
            <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNAXLrl5F2r4R183qO0kYoBvxFHy75cgZzsbND"/>
          </ion-button>
        </div>
      
        <NextPageButton :lastPage="true"/>
      </div>
      <h2>Please try again</h2>
      <div v-if="false" class="rainbowText KingobamaTextContainer">
        <ion-text class="rainbowText KingobamaTextContainer" style="margin-left: -75px"> <span style="font-size: 50px">K</span>ing <span style="font-size: 11px">o</span>bama</ion-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IonButton , IonText} from '@ionic/vue'
  import { sourceKingobamaCrown } from '/src/assets/helperFunctions/sources.ts'
  import SpecialThanks from './SpecialThanks.vue'
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import SetUserName from '/src/components/comments/SetUserName.vue'
  import CommentSectionTable from '/src/components/tables/chat/CommentSectionTable.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
</script>

<style scoped>
  h2 
  {
    line-height: min(2vw, 20px)
  }

  #heartSpacing
  {
    letter-spacing: 44px
  }

  #winnerSpacing
  {
    letter-spacing: 7px
  }

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
    transform: rotate(-32deg);
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
  @media screen and (min-width: 551px) and (max-width: 750px) 
  { 
    .KingobamasCrown
    {
      width: 58vw;
      top: -11vw;
      left: -11vw;
      z-index: 1
    }
  }
  @media screen and (min-width: 421px) and (max-width: 550px) 
  { 
    .KingobamasCrown
    {
      width: 55vw;
      top: -11vw;
      left: -11vw;
      z-index: 1
    }
  }
  @media screen and (min-width: 301px) and (max-width: 420px) 
  { 
    .KingobamasCrown
    {
      width: 46vw;
      top: -6.5vw;
      left: -6.5vw
    }
  }
  @media screen and (min-width: 251px) and (max-width: 300px) 
  { 
    .KingobamasCrown
    {
      width: 40vw;
      top: -5vw;
      left: -4vw
    }
  }
  @media screen and (min-width: 226px) and (max-width: 250px) 
  { 
    .KingobamasCrown
    {
      width: 30vw;
      top: -1vw;
      left: 1vw
    }
  }
  @media screen and (min-width: 201px) and (max-width: 225px) 
  { 
    .KingobamasCrown
    {
      width: 27vw;
      top: 0vw;
      left: 1.5vw
    }
  }
  @media screen and (min-width: 186px) and (max-width: 200px) 
  { 
    .KingobamasCrown
    {
      width: 23vw;
      top: 0.5vw;
      left: 3.5vw
    }
  }
  @media screen and (min-width: 171px) and (max-width: 185px) 
  { 
    .KingobamasCrown
    {
      width: 20vw;
      top: 2vw;
      left: 4.5vw
    }
  }
  @media screen and (min-width: 161px) and (max-width: 170px) 
  { 
    .KingobamasCrown
    {
      width: 15vw;
      top: 4.5vw;
      left: 7vw
    }
  }
  @media screen and (min-width: 156px) and (max-width: 160px) 
  { 
    .KingobamasCrown
    {
      width: 12vw;
      top: 6vw;
      left: 8vw
    }
  }
  @media screen and (min-width: 151px) and (max-width: 155px) 
  { 
    .KingobamasCrown
    {
      width: 10vw;
      top: 8vw;
      left: 9vw
    }
  }
  @media screen and (min-width: 147px) and (max-width: 150px) 
  { 
    .KingobamasCrown
    {
      width: 8vw;
      top: 9.5vw;
      left: 10vw
    }
  }
  @media screen and (min-width: 145px) and (max-width: 146px) 
  { 
    .KingobamasCrown
    {
      width: 7vw;
      top: 10.5vw;
      left: 10.5vw
    }
  }
  @media screen and (min-width: 142px) and (max-width: 144px) 
  { 
    .KingobamasCrown
    {
      width: 5vw;
      top: 11.5vw;
      left: 11.5vw
    }
  }
  @media screen and (min-width: 137px) and (max-width: 141px) 
  { 
    .KingobamasCrown
    {
      width: 4vw;
      top: 13.5vw;
      left: 11.5vw
    }
  }
  @media screen and (min-width: 135px) and (max-width: 136px) 
  { 
    .KingobamasCrown
    {
      width: 2vw;
      top: 14.5vw;
      left: 12vw
    }
  }
  @media screen and (width: 134px) 
  { 
    .KingobamasCrown
    {
      width: 1vw;
      top: 15.5vw;
      left: 12.5vw
    }
  }
  @media screen and (max-width: 133px) 
  { 
    .KingobamasCrown
    {
      width: 0vw
    }
  }
</style>