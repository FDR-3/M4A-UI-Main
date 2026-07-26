<template>
  <div id="siteUpdateModal">
    <div align="right">
      <ion-button id="closeAlertButton" fill="clear" color="white" @click="anchorPrograms.hasWebSiteBeenUpdated=false">
        <ion-icon id="closeAlertIcon":src="closeCircle"></ion-icon>
      </ion-button>
    </div>
    <div class="flexCenterColumn">
      <div v-if="!darkTheme.value"> <!--This is reversed to get the opposite color for the popup-->
        <RIPDarkModeStarWolfBannerSignal id="banner" v-if="adminAccounts.ceoIsDead"/>
        <DarkModeStarWolfBannerSignal id="banner" v-else/>
      </div>
      <div v-else>
          <RIPGrayModeStarWolfBannerSignal id="banner" v-if="adminAccounts.ceoIsDead"/>
          <GreyModeStarWolfBannerSignal id="banner" v-else/>
      </div>
      <div class="mediumMarginTop">
          <ion-text color="white">The Site has been Updated</ion-text><br>
          <ion-text color="white">Reload Browser for Newest UI/UX</ion-text><br>
          <ion-text color="white">See Github M4A-UI-Main Commits for Latest Code Changes/Notes</ion-text><br>
          <ion-text color="white">You can click the 3 dot (...) "Show description" button on a commit to see the all notes</ion-text>
      </div>
      <div>
        <ion-button title="Github" fill="clear" @click="openGithub()">
          <Github id="githhubIcon" class="footerIcon" :fill="'#FFFFFF'"/>
        </ion-button>
        <ion-button color="white" style="margin-bottom: -11px" @click="refreshPage()">
          <ion-label color="black">Refresh<br>Page</ion-label>
        </ion-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
    import { IonText, IonButton, IonIcon, IonLabel } from '@ionic/vue'
    import { closeCircle } from 'ionicons/icons'
    import DarkModeStarWolfBannerSignal from '/src/components/fancy/DarkModeStarWolfBannerSignal.vue' 
    import GreyModeStarWolfBannerSignal from '/src/components/fancy/GreyModeStarWolfBannerSignal.vue'
    import RIPDarkModeStarWolfBannerSignal from '/src/components/fancy/rip/RIPDarkModeStarWolfBannerSignal.vue' 
    import RIPGrayModeStarWolfBannerSignal from '/src/components/fancy/rip/RIPGrayModeStarWolfBannerSignal.vue'
    import Github from '/src/assets/svg/github-svg.vue'
    import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
    import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
    import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'

    function openGithub()
    {
      window.open("https://github.com/FDR-3/M4A-UI-Main/commits", "_blank")
    }

    function refreshPage()
    {
      window.location.reload()
    }
</script>

<style scoped>
  #siteUpdateModal
  {
    width: min(90vw, 764px);
    position: fixed; /* Makes sure the modal is fixed in place on the screen */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4000; /* Makes sure the modal is on top */
    padding: 20px;
    background-color: light-dark(#000000, #505050);
    border: solid thin white
  }

  #closeAlertButton
  {
    margin-top: -20px;
    margin-right: -26px
  }

  #closeAlertIcon
  {
    width: 34px;
    height: 34px
  }

  #banner
  {
    width: 100%;
    height: min(30vw, 250px);
    margin-bottom: -7px
  }

  .footerIcon
  {
    width: 44px;
    height: 44px;
    margin-top: 10px;
    margin-bottom: -4px
  }

  #siteUpdateModal
  {
    animation: popup 0.7s
  }

@keyframes popup
  {
    0%
    {
      transform: translate(-50%, -50%) scale(1)
    }
    50%
    {
      transform: translate(-50%, -50%) scale(1.4)
    }
    60%
    {
      transform: translate(-50%, -50%) scale(1.1)
    }
    70%
    {
      transform: translate(-50%, -50%) scale(1.2)
    }
    80%
    {
      transform: translate(-50%, -50%) scale(1)
    }
    90%
    {
      transform: translate(-50%, -50%) scale(1.1)
    }
    100%
    {
      transform: translate(-50%, -50%) scale(1)
    }
  }
</style>