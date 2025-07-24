<template>
  <div>
    <h1>Operating System Select</h1>
    <div class="patchSelectionContainer flexCenterColumn" >
      <ion-button color="dark" @click="prevPage()">Return</ion-button>
      <div class="flexCenterColumn">
        <ion-button fill="clear" @click="nextPage()">
          <WindowsSVG class="pathSelectionIcon" slot="icon-only"/>
        </ion-button>
        <ion-text color="dark">Windows</ion-text>
      </div>
      <div class="flexCenterColumn">
        <AppleSVG class="pathSelectionIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'" slot="icon-only" @click="giveSVGRepoAppleCredit()"/>
        <ion-text class="tinyMarginTop">Apple</ion-text>
      </div>
      <div class="flexCenterColumn">
        <ion-button fill="clear" @click="openLinuxDetour()">
          <LinuxSVG class="pathSelectionIcon"/>
        </ion-button>
        <ion-text style="margin-top: -15px">Linux</ion-text>
      </div>
      <ion-text>Apple and Linux walkthrough currently unavailable</ion-text>
    </div>
    
  </div>
</template>

<script setup lang="ts">
  import { IonText, IonButton } from '@ionic/vue'
  import { navigation } from '/src/assets/globalStates/Navigation.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { giveSVGRepoAppleCredit } from '/src/assets/helperFunctions/credits.ts'
  import  { OperatingSystem } from '/src/types/110Types.vue'
  import WindowsSVG from '/src/assets/svg/windows-svg.vue'
  import AppleSVG from '/src/assets/svg/apple-svg.vue'
  import LinuxSVG from '/src/assets/svg/linux-svg.vue'

  function prevPage()
  {
    navigation.pageIndex--

    localStorage.setItem("navigationPageIndex", navigation.pageIndex)
  }
  
  function nextPage()
  {
    navigation.pageIndex++
    localStorage.setItem("navigationPageIndex", navigation.pageIndex)

    navigation.operatingSystemIndex = OperatingSystem.Windows
    localStorage.setItem("operatingSystem", OperatingSystem.Windows)
  }

  function openLinuxDetour()
  {
    window.open("https://www.youtube.com/watch?v=NqniwVaSJVA", "_blank")
  }
</script>