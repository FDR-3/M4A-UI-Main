<template>
  <div>
    <h1>Language Select</h1>
    <div class="patchSelectionContainer flexCenterColumn">
      <ion-button color="dark" @click="prevPage()" @mouseenter="playHoverSFX()">Return</ion-button>
      <div class="flexCenterColumn">
        <ion-button 
          v-if="!isVueFlashing"
          fill="clear" 
          @click="playSelection2SFXThenNextPage(); isVueFlashing=true" 
          @mouseenter="playHoverSFXIfNotOnAPhone()"
        >
          <VueSVG class="pathSelectionIcon" slot="icon-only"/>
        </ion-button>
        
        <VueFlashing v-if="isVueFlashing"/>
        <ion-text style="margin-top: -7px">Vue.js</ion-text>
      </div>
      <div class="flexCenterColumn">
        <ReactSVG class="pathSelectionIcon" slot="icon-only" @click="giveSVGRepoReactCredit()"/>
        <ion-text>React.js</ion-text>
        </div>
      <div class="flexCenterColumn">
        <AngularSVG class="pathSelectionIcon" slot="icon-only" @click="giveSVGRepoAngularCredit()"/>
        <ion-text class="smallMarginTop">Angular.js</ion-text>
      </div>
      <ion-text>React and Angular walkthroughs currently unavailable</ion-text>
      <a href="https://www.youtube.com/watch?v=AT5nb-TDm28" target="_blank">SFX</a>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { IonText, IonButton } from '@ionic/vue'
  import { navigation } from '/src/assets/globalStates/Navigation.vue'
  import { playHoverSFX, playHoverSFXIfNotOnAPhone, playSelection2SFXThenNextPage }  from '/src/components/audio/SelectionAudioFunctions.vue'
  import VueSVG from '/src/assets/svg/vue-svg.vue'
  import VueFlashing from '/src/components/fancy/flashing/VueFlashing.vue'
  import ReactSVG from '/src/assets/svg/react-svg.vue'
  import AngularSVG from '/src/assets/svg/angular-svg.vue'
  
  import { giveSVGRepoReactCredit, giveSVGRepoAngularCredit } from '/src/assets/helperFunctions/credits.ts'

  var isVueFlashing= ref(false)

  function prevPage()
  {
    navigation.pageIndex--

    localStorage.setItem("navigationPageIndex", navigation.pageIndex)
  }
</script>
