<template>
  <div>
    <div class="largeMarginTop"></div>
    <h1>End Game</h1>
    <div v-if="connectedWallet.hasGoodEnding">
      <h2>Good Ending</h2>
      <br>
      <h2 class="noWrapText">💚 💚 <span id="heartSpacing" class="nTinyMarginBottom">💚</span> 💚 💚 💚</h2>
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
      <h2 style="margin-bottom: 11px">Bad Ending!!!!</h2>
      <div class="flexCenterRow">
        <PrevPageButton/>

        <Kingobama/>
      
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
  import { IonText} from '@ionic/vue'
  import SpecialThanks from './SpecialThanks.vue'
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import SetUserName from '/src/components/comments/SetUserName.vue'
  import CommentSectionTable from '/src/components/tables/chat/CommentSectionTable.vue'
  import Kingobama from '/src/components/fancy/poly/Kingobama.vue'
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

  .KingobamaTextContainer
  {
    font-size: 37px;
    height: 100px
  }
</style>