<template>
  <ion-page>
    <NavBar
      :navButtons="navButtons"
      :colorName="colorName"
      :buttonShadow="buttonShadow"
    />
    <ion-content ref="pageContent" class="thickBorder">
      <!--Maintenance Page-->
      <MaintenancePage v-if="MAINTENANCE_MODE && !APPROVED_TESTERS.includes(connectedWallet.addressString)"/>
      <!--Normal Page-->
      <div v-else class="flexCenterColumn">
        <h1 v-if="MAINTENANCE_MODE">Maintenance Mode</h1>
        <div class="contentWidth">
          <!--110 pages after path selection-->
          <component 
            v-if="navigation.navBarIndex == 0 && 
            navigation.pageIndex >= 2"
            :is="Jesus110PagesAfterPathSelection[navigation.operatingSystemIndex][navigation.pageIndex-2]">
          </component>
          <!--Pages-->
          <component 
            v-else
            :is="pages[navigation.navBarIndex][navigation.pageIndex]">
          </component>
        </div>
      </div>
    </ion-content>
    <Footer></Footer>
  </ion-page>
</template>

<script setup lang="ts">
  import { ref, watch} from 'vue'
  import { IonContent, IonPage } from '@ionic/vue'
  import NavBar from '/src/components/navbar/NavBar.vue'
  import Footer from '/src/components/pages/Footer.vue'
  import { Jesus110PathSelectionPages, Jesus110PagesAfterPathSelection } from '/src/views/Jesus/110/110JesusPages.vue'
  import { FAQsPages } from '/src/views/Jesus/FAQs/FAQsPages.vue'
  import { navigation, MenuIndex } from '/src/assets/globalStates/Navigation.vue'
  import MaintenancePage from '/src/components/pages/MaintenancePage.vue'
  import { MAINTENANCE_MODE, APPROVED_TESTERS } from '/src/assets/globalStates/MaintenanceMode.ts'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'

  const pageContent = ref()

  const colorName = "yellow"
  const buttonShadow = "goldenrod"

  const pages = 
  [
    Jesus110PathSelectionPages,
    FAQsPages
  ]

  const navButtons = 
  [{
    id: "hundredTenButton",
    labelClass: 'rainbowText',
    text: "110%\r\nOpened Sourced",
    lilNavText: "110%",
    textColor: ""
  },
  {
    id: 'faqsButton',
    labelClass: '',
    text: "FAQs",
    lilNavText: "FAQs",
    textColor: "dark"
  }]

  watch(navigation, () => 
  {
    pageContent.value?.$el.scrollToTop()
  })

  //Prevent user from getting stuck on a nonexistent navbar and page index
  //This fix breaks the comment jumper but no comments in the Jesus section anyway
  if(navigation.menuIndex != MenuIndex.Jesus)
  {
    navigation.menuIndex = MenuIndex.Jesus
    localStorage.setItem("navigationMenuIndex", navigation.menuIndex.toString())
  }
  if(navigation.navBarIndex == 0)
  {
    if(navigation.pageIndex >= Jesus110PagesAfterPathSelection[navigation.operatingSystemIndex].length)
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
  }
</script>