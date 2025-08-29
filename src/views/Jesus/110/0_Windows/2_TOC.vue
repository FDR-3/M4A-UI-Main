<template>
  <div class="flexCenterRow">
    <PrevPageButton/>
    <div>
      <p>Windows</p>
      <h4 style="margin-top: -1px">Table of Contents</h4>
    </div>
    <NextPageButton/>
  </div>
  <div class="flexCenterColumnWidth">
    <ion-button color="dark" @click="pageSelect(0)">1-Overview</ion-button>
    <ion-button color="dark" @click="nextPage()">2-OBS Video Capture Software</ion-button>
    <ion-button color="dark" @click="pageSelect(4)">3-AI Voice Change Client</ion-button>
    <ion-button color="dark" @click="pageSelect(5)">4-Train A Custom RVC Voice Model</ion-button>
    <ion-button color="dark" @click="pageSelect(6)">5-YT-DLP</ion-button>
    <ion-button color="dark" @click="pageSelect(7)">6-Whisper-AI</ion-button>
    <ion-button color="dark" @click="pageSelect(8)">7-Radiant-Media-Player-Thumbnails</ion-button>
    <ion-button color="dark" @click="pageSelect(9)">8-Manual Youtube Scraping</ion-button>
    <ion-button color="dark" @click="pageSelect(10)">9-Selenium Youtube Scraping</ion-button>
    <ion-button color="dark" @click="pageSelect(11)">10-API Youtube Scraping</ion-button>
    <ion-button color="dark" @click="pageSelect(12)">11-VSDC Video Editing Software</ion-button>
    <ion-button color="dark" @click="pageSelect(13)">12-Illegally Fired In Retaliation</ion-button>
    <ion-button color="dark" @click="pageSelect(14)">13-Patriot Software Is Lying To The Government On Me!🤬</ion-button>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import { IonButton } from '@ionic/vue'
  import { navigation } from '/src/assets/globalStates/Navigation.vue'

  defineProps(['colorName'])

  function nextPage()
  {
    navigation.pageIndex++

    localStorage.setItem("navigationPageIndex", navigation.pageIndex)
  }

  function pageSelect(pageNumber:number)
  {
    navigation.pageIndex = pageNumber

    localStorage.setItem("navigationPageIndex", navigation.pageIndex)
  }
</script>

<style scoped>
  .flexCenterRow
  {
    margin-top: 50px
  }
</style>
