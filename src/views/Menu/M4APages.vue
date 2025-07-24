<template>
  <ion-page>
    <Toast position="center" id="m4aSuccessToast">
      <template #message="slotProps">
        <div class="flexCenterColumn">
          <div class="flexCenterRow nSmallMarginBottom">
            <i v-if="slotProps.message.severity == 'success'" class="pi pi-check toastIcon"></i>
            <i v-else-if="slotProps.message.severity == 'error'" class="pi pi-times-circle toastIcon"></i>
            <p>{{ slotProps.message.summary }}</p>
          </div>
          <div class="flexCenterColumn toastMessageContainer">
            <ion-text color="dark">{{ slotProps.message.detail }}</ion-text>
            <TimerProgressBar v-if="slotProps.message.severity == 'success'" 
            :secondsToCount="TOAST_TIME_LEN_SECONDS" :colorHexValue="colorHexValue" class="smallMarginTop"/>
            <TimerProgressBar v-else-if="slotProps.message.severity == 'error'" 
            :secondsToCount="TOAST_TIME_LEN_SECONDS" colorHexValue="#ff0000" class="smallMarginTop"/>
          </div>
        </div>
      </template>
    </Toast>
    <NavBar
      :navButtons="navButtons"
      :colorName="colorName"
      :buttonShadow="buttonShadow"
      :colorHexValue="colorHexValue"
    />
    <ion-content ref="pageContent" class="thickBorder">
      <!--Mobile Quality Warning-->
      <MobileUXBanner/>
      <!--Maintenance Page-->
      <MaintenancePage v-if="MAINTENANCE_MODE && !APPROVED_TESTERS.includes(connectedWallet.addressString)"/>
      <!--Normal Page-->
      <div v-else class="flexCenterColumn">
        <h1 v-if="MAINTENANCE_MODE">Maintenance Mode</h1>
        <div class="contentWidth">
          <!--110 pages after path selection-->
          <component 
            v-if="navigation.navBarIndex == 0 && 
            navigation.pageIndex >= 4"
            :is="M4A110PagesAfterPathSelection[navigation.operatingSystemIndex][navigation.frameWorkIndex][navigation.languageIndex][navigation.pageIndex-4]">
          </component>
          <!--Pages-->
          <component 
            v-else
            :is="pages[navigation.navBarIndex][navigation.pageIndex]"
            :colorHexValue="colorHexValue"
          >
          </component>

          <!--110 comment sections after path selection-->
          <M4ACommentSection
            :colorName="colorName"
            :colorHexValue="colorHexValue"
          />
        </div>
      </div>
    </ion-content>
    <Footer></Footer>
  </ion-page>
</template>

<script setup lang="ts">
  import { ref, watch, provide } from 'vue'
  import { IonContent, IonPage, IonText } from '@ionic/vue'
  import Toast from 'primevue/toast'
  import {TOAST_TIME_LEN_SECONDS } from '/src/assets/contracts/WalletHelper.vue'
  import TimerProgressBar from '/src/components/fancy/TimerProgressBar.vue'
  import NavBar from '/src/components/navbar/NavBar.vue'
  import Footer from '/src/components/pages/Footer.vue'
  import { M4A110PathSelectionPages, M4A110PagesAfterPathSelection } from '/src/views/M4A/110/110M4APages.vue'
  import M4ACommentSection from '/src/components/comments/commentSections/M4ACommentSection.vue'
  import Treasury  from '/src/views/M4A/Treasury/Treasury.vue'
  import Markets  from '/src/views/M4A/Markets/Markets.vue'
  import MapClaims from '/src/views/M4A/MapClaims/MapClaims.vue'
  import Queue from '/src/views/M4A/Queue/Queue.vue'
  import { navigation, MenuIndex } from '/src/assets/globalStates/Navigation.vue'
  import MaintenancePage from '/src/components/pages/MaintenancePage.vue'
  import MobileUXBanner from '/src/components/banners/MobileUXBanner.vue'
  import { MAINTENANCE_MODE, APPROVED_TESTERS } from '/src/assets/globalStates/MaintenanceMode.ts'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'

  const pageContent = ref()

  const colorName = "green"
  const buttonShadow = "lightgreen"
  const colorHexValue = "#39bd39"

  const pages = 
  [
    M4A110PathSelectionPages,
    [Markets],
    [Treasury],
    [MapClaims],
    [Queue]
  ]
  
  const navButtons =
  [
    {
      id: "hundredTenButton",
      labelClass: 'rainbowText',
      text: "110%\r\nOpened Sourced",
      lilNavText: "110%",
      textColor: ""
    },
    {
      id: 'marketButton',
      labelClass: '',
      text: "Markets",
      lilNavText: "Markets",
      textColor: "dark"
    },
    {
      id: 'treasuryButton',
      labelClass: '',
      text: "Treasury",
      lilNavText: "Treasury",
      textColor: "dark"
    },
    {
      id: 'mapButton',
      labelClass: '',
      text: "Claims/\r\nMap",
      lilNavText: "Claims",
      textColor: "dark"
    },
    {
      id: 'queueButton',
      labelClass: '',
      text: "Queue",
      lilNavText: "Queue",
      textColor: "dark"
    }
  ]

  //Added for extra robustness after redeploying new contract or clearing local storage
  navigation.menuIndex = MenuIndex.M4A
  //navigation.navBarIndex = 0
  //navigation.pageIndex = 0
  localStorage.setItem("navigationMenuIndex", MenuIndex.M4A.toString())
  //localStorage.setItem("navigationNavbarIndex", "0")
  //localStorage.setItem("navigationPageIndex", "0")

  //Provide the colorName for the Video Voter Component
  provide('colorName', colorName);
  //Provide the colorName for the Video Voter Component
  provide('colorHexValue', colorHexValue);

  watch(navigation, () => 
  {
    pageContent.value.$el.scrollToTop()
  })

  //Prevent user from getting stuck on a nonexistent navbar and page index
  //This fix breaks the comment jumper
  /*if(navigation.menuIndex != MenuIndex.M4A)
  {
    navigation.menuIndex = MenuIndex.M4A
    localStorage.setItem("navigationMenuIndex", navigation.menuIndex.toString())
  }
  if(navigation.navBarIndex == 0)
  {
    if(navigation.pageIndex >= M4A110PagesAfterPathSelection[navigation.operatingSystemIndex][navigation.frameWorkIndex][navigation.languageIndex].length)
    {
      navigation.pageIndex = 0
      localStorage.setItem("navigationPageIndex", navigation.pageIndex.toString())
    }
  }
  else
  {
    if(navigation.navBarIndex >= pages.length)
    {
      navigation.navBarIndex = 0
      localStorage.setItem("navigationNavbarIndex", navigation.navBarIndex.toString())
    }
    
    if(navigation.pageIndex > pages[navigation.navBarIndex].length)
    {
      navigation.pageIndex = 0
      localStorage.setItem("navigationPageIndex", navigation.pageIndex.toString())
    }
  }*/
</script>

<style>
  #m4aSuccessToast
  {
    --p-toast-success-background: light-dark(rgb(211, 255, 224, 1), rgb(0, 94, 28, 1)) !important;
    --p-toast-success-border-color: light-dark(rgb(211, 255, 224, 1), rgb(0, 94, 28, 1)) !important;
    --p-toast-success-color: var(--ion-color-green) !important;
    filter: none;
    font-family: sans-serif; /* Choose a sharp font */
    font-size: 16px; /* Use a whole pixel value */
    -webkit-font-smoothing: antialiased;
    font-smooth: antialiased;
    /* Avoid transforms if possible */
    max-width: 90vw
  }
</style>