<template>
  <ion-page>
    <Toast position="center" id="aboutSuccessToast">
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
          <component v-if="navigation.navBarIndex < 3/*Prevent issues when leaving CEO page with jumper to M4A Map Index*/"
          :is="pages[navigation.navBarIndex][navigation.pageIndex]"></component>
          <AboutCommentSection
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
  import { TOAST_TIME_LEN_SECONDS } from '/src/assets/contracts/WalletHelper.vue'
  import TimerProgressBar from '/src/components/fancy/TimerProgressBar.vue'
  import NavBar from '/src/components/navbar/NavBar.vue'
  import AboutCommentSection from '/src/components/comments/commentSections/AboutCommentSection.vue'
  import Footer from '/src/components/pages/Footer.vue'
  import AboutPages110 from '/src/views/About/110/AboutPages.vue'
  import Stats  from '/src/views/About/Stats/StatsPage.vue'
  import Admin  from '/src/views/About/Admin/AdminPage.vue'
  import { navigation, MenuIndex } from '/src/assets/globalStates/Navigation.vue'
  import MaintenancePage from '/src/components/pages/MaintenancePage.vue'
  import MobileUXBanner from '/src/components/banners/MobileUXBanner.vue'
  import { MAINTENANCE_MODE, APPROVED_TESTERS } from '/src/assets/globalStates/MaintenanceMode.ts'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'

  const pageContent = ref()

  const colorName = "gray"
  const buttonShadow = "lightgray"
  const colorHexValue = "#b5bbcad3"

  const pages = 
  [
    AboutPages110, 
    [Stats],
    [Admin]
  ]
  
  const navButtons =
  [
    {
      id: "aboutButton",
      labelClass: 'rainbowText',
      text: "About",
      lilNavText: "About",
      textColor: ""
    },
    {
      id: 'stats',
      labelClass: '',
      text: "Stats",
      lilNavText: "Stats",
      textColor: "dark"
    },
    {
      id: 'admin',
      labelClass: '',
      text: "Admin",
      lilNavText: "Admin",
      textColor: "dark"
    }
  ]

  //Added for extra robustness after redeploying new contract or clearing local storage
  navigation.menuIndex = MenuIndex.About
  //navigation.navBarIndex = 0
  //navigation.pageIndex = 0
  localStorage.setItem("navigationMenuIndex", MenuIndex.About.toString())
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
  /*if(navigation.menuIndex != MenuIndex.About)
  {
    navigation.menuIndex = MenuIndex.About
    localStorage.setItem("navigationMenuIndex", navigation.menuIndex.toString())
  }
  if(navigation.navBarIndex >= pages.length)
  {
    navigation.navBarIndex = 0
    localStorage.setItem("navigationNavbarIndex", navigation.navBarIndex.toString())
  }
  if(navigation.pageIndex > pages[navigation.navBarIndex].length)
  {
    navigation.pageIndex = 0
    localStorage.setItem("navigationPageIndex", navigation.pageIndex.toString())
  }*/
</script>

<style>
  #aboutSuccessToast
  {
    --p-toast-success-background: light-dark(rgb(232, 232, 232, 1), rgb(77, 77, 77, 1)) !important;
    --p-toast-success-border-color: light-dark(rgb(232, 232, 232, 1), rgb(77, 77, 77, 1)) !important;
    --p-toast-success-color: #7a7a7a !important;
    filter: none;
    font-family: sans-serif; /* Choose a sharp font */
    font-size: 16px; /* Use a whole pixel value */
    -webkit-font-smoothing: antialiased;
    font-smooth: antialiased;
    /* Avoid transforms if possible */
    max-width: 90vw
  }
</style>
