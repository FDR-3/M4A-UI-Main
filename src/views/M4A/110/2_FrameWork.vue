<template>
  <div>
    <h1>FrameWork Select</h1>
    <div class="patchSelectionContainer flexCenterColumn">
      <ion-button color="dark" @click="prevPage()" @mouseenter="playHoverSFX()">Return</ion-button>
      <div class="flexCenterColumn">
        <ion-button 
          v-if="!isIonicFlashing" 
          fill="clear" 
          @click="playSelection1SFXThenNextPage(); isIonicFlashing=true" 
          @mouseenter="playHoverSFXIfNotOnAPhone()"
        >
          <ion-icon class="pathSelectionIcon" color="blue" slot="icon-only"  :src=logoIonic></ion-icon>
        </ion-button>
        <IonicFlashing v-if="isIonicFlashing" />
        <ion-text>Ionic</ion-text>
      </div>
      <div class="flexCenterColumn">
        <div>
          <SvelteSVG class="pathSelectionIcon" slot="icon-only" @click="giveSVGRepoSvelteCredit()"/>
        </div>
        <ion-text style="margin-top: 7px">Svelte</ion-text>
        <ion-text>(Basically its own language)</ion-text>
      </div>
      <ion-text>Svelte walkthrough currently unavailable</ion-text>
      <a href="https://www.youtube.com/watch?v=AT5nb-TDm28" target="_blank">SFX</a>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { IonIcon, IonText, IonButton } from '@ionic/vue'
  import { logoIonic } from 'ionicons/icons'
  import { navigation } from '/src/assets/globalStates/Navigation.vue'
  import { playHoverSFX, playHoverSFXIfNotOnAPhone, playSelection1SFXThenNextPage }  from '/src/components/audio/SelectionAudioFunctions.vue'
  import IonicFlashing from '/src/components/fancy/flashing/IonicFlashing.vue'
  import SvelteSVG from '/src/assets/svg/svelte-svg.vue'
  import { giveSVGRepoSvelteCredit } from '/src/assets/helperFunctions/credits.ts'

  var isIonicFlashing= ref(false)

  function prevPage()
  {
    navigation.pageIndex--

    localStorage.setItem("navigationPageIndex", navigation.pageIndex)
  }
</script>
