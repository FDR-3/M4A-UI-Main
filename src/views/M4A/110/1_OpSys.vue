<template>
  <div>
    <h1>Operating System Select</h1>
    <div class="patchSelectionContainer flexCenterColumn" >
      <ion-button color="dark" @click="prevPage()" @mouseenter="playHoverSFX()">Return</ion-button>
      <div class="flexCenterColumn">
        <ion-button 
          v-if="!isWindowsFlashing" 
          fill="clear" 
          @click="playSelection1SFXThenNextPage(); isWindowsFlashing=true" 
          @mouseenter="playHoverSFXIfNotOnAPhone()"
        >
          <WindowsSVG class="pathSelectionIcon" slot="icon-only"/>
        </ion-button>
        <WindowsFlashing v-if="isWindowsFlashing"/>
        <ion-text>Windows</ion-text>
      </div>
      <div class="flexCenterColumn">
        <AppleSVG class="pathSelectionIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'" slot="icon-only" @click="giveSVGRepoAppleCredit()"/>
        <ion-text class="tinyMarginTop">Apple</ion-text>
      </div>
      <div class="flexCenterColumn">
        <ion-button
          fill="clear" 
          @click="openLinuxDetour()"
          @mouseenter="playHoverSFXIfNotOnAPhone()"
        >
          <LinuxSVG class="pathSelectionIcon" slot="icon-only"/>
        </ion-button>
        <ion-text style="margin-top: -15px">Linux</ion-text>
      </div>
      <ion-text>Apple and Linux walkthroughs currently unavailable</ion-text>
      <a href="https://www.youtube.com/watch?v=AT5nb-TDm28" target="_blank">SFX</a>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { IonText, IonButton } from '@ionic/vue'
  import { navigation } from '/src/assets/globalStates/Navigation.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { playHoverSFX, playHoverSFXIfNotOnAPhone, playSelection1SFXThenNextPage }  from '/src/components/audio/SelectionAudioFunctions.vue'
  import WindowsSVG from '/src/assets/svg/windows-svg.vue'
  import WindowsFlashing from '/src/components/fancy/flashing/WindowsFlashing.vue'
  import AppleSVG from '/src/assets/svg/apple-svg.vue'
  import LinuxSVG from '/src/assets/svg/linux-svg.vue'
  import { giveSVGRepoAppleCredit } from '/src/assets/helperFunctions/credits.ts'

  var isWindowsFlashing= ref(false)

  function prevPage()
  {
    navigation.pageIndex--
    localStorage.setItem("navigationPageIndex", navigation.pageIndex)
  }

  function openLinuxDetour()
  {
    window.open("https://youtu.be/lm51xZHZI6g", "_blank")

    var audio = document.getElementById("musicPlayer") as HTMLMediaElement
    audio.pause()
  }
</script>

<style scoped>
  .svgSize
  {
    min-width: min(7vw, 35px);
    height: min(7vw, 35px);
    margin-left: 5px
  }
</style>