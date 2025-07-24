<template>
  <div v-if="!mobileQualityNoticeDimissed" id="mobileBanner" class="thinBorder" style="margin: 10px">
    <div align="right">
      <ion-button id="closeMobileBannerButton" fill="clear" color="dark" @click="dismissBanner()">
        <ion-icon class="footerIcon":src="closeCircle"></ion-icon>
      </ion-button>
    </div>

    <div align="center" style="padding: 10px; padding-top: 0px;">
      <ion-text>For the current best mobile experience, use the web browser native to your wallet phone app.</ion-text><br>
      <ion-text>IE: Use the phantom app with its web broswer (currently under the search magnifying glass) instead of the Brave or Chrome phone apps.</ion-text><br>
      <ion-text>Straight browser phone apps may not curently be able to connect to the site properly or call contract functions.</ion-text>
      <div class="nSmallMarginBottom">
        <ion-text >Use a computer for the best user experience currently (The tables definitely need to be reworked for phones).</ion-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { IonText, IonButton, IonIcon } from '@ionic/vue'
  import { closeCircle } from 'ionicons/icons'

  var mobileQualityNoticeDimissed = ref()

  onMounted(() =>
  {
    mobileQualityNoticeDimissed.value = localStorage.getItem("mobileQualityNoticeDimissed") == "true"
  })

  function dismissBanner()
  {
    localStorage.setItem("mobileQualityNoticeDimissed", "true")
    mobileQualityNoticeDimissed.value = true
  }
</script>

<style>
  #closeMobileBannerButton
  {
    margin-top: -18px;
    margin-bottom: -10px;
    margin-right: -10px
  }

  @media screen and (min-width: 629px) 
  { 
    #mobileBanner
    {
      display: none
    }
  }
  @media screen and (max-width: 628.9px) 
  { 
    #mobileBanner
    {
      display: block;
      padding-bottom: -20px
    }
  }
</style>