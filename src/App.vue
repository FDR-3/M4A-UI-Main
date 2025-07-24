<template>
  <ion-app>
    <ion-split-pane content-id="mainContent" :disabled=true>
      <ion-menu content-id="mainContent" type="reveal" side="end">
        <ion-content>
          <div class="flexCenterColumn" style="padding: 10px">
            <div id="walletConnectButtonContainer">
              <div v-if="width < breakpoint">
                <WalletButton :colorName="colorName" :colorHexValue="colorHexValue" :featured="2" container="body"/>
              </div>
            </div>
            <ion-list>
              <div id="menuHeaderContainer" class="thinBorder" style="border-radius: 8px">
                <ion-button id="menuHeaderButton" fill="clear" style="width: 100%" @click="giveDaFontCredit()">
                  <div class="">
                  <MenuSVG id="menuHeaderSVG" :fill="darkTheme.value ? '#FFFFFF' : '#000000'" slot="icon-only" @click="giveDaFontCredit()"/>
                  <!--<ion-label class="thickUnderLine" color="dark"><ion-text id="headerText" class="metal"><span id="m" class="metal">m</span>enu</ion-text></ion-label>-->
                  </div>
                </ion-button>
              </div>
              <ion-menu-toggle v-for="(menuButton, index) in appPages">
                <ion-item
                  :style="{ background: menuButton.background }"
                  @click="navigation.menuIndex = index; resetNavigation(index)"
                  router-direction="root"
                  :router-link="menuButton.url"
                  lines="none"
                  class="thinBorder"
                  :class="{ selected: navigation.menuIndex==index }"
                >
                  <component :is="menuButton.svg" class="menuIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"></component>
         
                  <ion-label v-if="MAINTENANCE_MODE">{{ "Maintenance Mode" }}</ion-label>
                  <ion-label v-else>{{ menuButton.title }}</ion-label>
                </ion-item>
              </ion-menu-toggle>
            </ion-list>
          
            <!--The ion-menu-toggle tag is used when you want elements to close the menu when they are clicked-->
            <ion-menu-toggle>
              <ion-button v-if="connectedWallet.hasHadCustomName" :color="colorName" @click="moveToCommentSectionJumper()" router-link="/M4A" router-direction="root">
                <ion-label color="dark">Comment Section Jumper</ion-label>
              </ion-button>
            </ion-menu-toggle>

            <div :style="{display: navigation.menuIndex==MenuIndex.Jesus ? 'none':'block'}" class="flexCenterColumn">
              <ContractSwitcher :colorName="colorName" :buttonShadow="buttonShadow"/>
              <!--<ion-text class="largeMarginTop">Market UI built on top of
                <br><a class="rainbowText" href="https://app.marginfi.com/" target="_blank">MarginFi</a>
                <br><a href="https://github.com/mrgnlabs" target="_blank">Repo</a>
                <br><a href="https://docs.marginfi.com/use-cases" target="_blank">Setup Docs</a>
              </ion-text>-->
            </div>
          </div>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="mainContent" aria-hidden="false"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script setup lang="ts">
  import { ref, onMounted, provide, watch } from 'vue'
  import { useRoute } from 'vue-router'  
  import { IonApp,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuToggle,
    IonRouterOutlet,
    IonSplitPane,
    IonButton } from '@ionic/vue'
  import { helpCircleSharp } from 'ionicons/icons'
  import { giveDaFontCredit } from '/src/assets/helperFunctions/credits.ts'
  import 'vidstack/player'
  import 'vidstack/player/layouts/default'
  import 'vidstack/player/ui'
  import { navigation, MenuIndex } from '/src/assets/globalStates/Navigation.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { commentSectionNameHashTable } from '/src/components/comments/hashtables.ts'
  import { useToast } from "primevue/usetoast"
  import ContractSwitcher from '/src/components/smartContracts/ContractSwitcher.vue'
  import WalletButton from '/src/components/navbar/SolanaWalletButton/WalletButton.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import MenuSVG from '/src/assets/svg/menu-svg.vue'
  import Cross from '/src/assets/svg/cross-svg.vue'
  import Bandaid from '/src/assets/svg/bandaid-svg.vue'
  import Shield from '/src/assets/svg/shield-svg.vue'
  import HelpCircle from '/src/assets/svg/help-circle-sharp-svg.vue'
  import { useWindowResize } from './assets/globalStates/WindowWidth.ts'
  
  import { MAINTENANCE_MODE } from './assets/globalStates/MaintenanceMode.ts'

  const route = useRoute()
  
  var colorName = ref()
  var colorHexValue = ref()
  var buttonShadow = ref()
  var currentMenuIndex: number

  const { width } = useWindowResize() // Use the composable to get the reactive width
  const breakpoint = 629 // Define your breakpoint

  const appPages = 
  [
    {
      id: 'Jesus_Button',
      title: 'A Debate About Jesus',
      url: '/Jesus',
      src: "https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNEHkYFqrKustIf5Q7FrS3ZqMDd6eahcUy8ni0",
      svg: Cross,
      background: "#ffd700"
    },
    {
      id: 'M4A_Button',
      title: 'Medicare For All',
      url: '/M4A',
      src: "https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNrLh7NJcvyILZuPHpomK5CU6N2bAltaz03cTW",
      svg: Bandaid,
      color: "success",
      background: "#39bd39"
    },
    {
      id: 'PLI_Button',
      title: 'Perpetual Life Insurance',
      url: '/PLI',
      src: "https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazN52mKS51YxoNpMXfHW3qhQlCTkKazsLdV0r9i",
      svg: Shield,
      color: "primary",
      background: "royalblue"
    },
    {
      id: 'About_Button',
      title: 'About',
      url: '/About',
      src: helpCircleSharp,
      svg: HelpCircle,
      color: "dark",
      background: "gray"
    }
  ]

  const toast = useToast() // Get the Toast instance

  //Provide the toast instance globally
  provide('toast', toast)

  //Colors correct menu button on refresh
  onMounted(() => 
  {
    //Check path to set menu for hard resets
    if(route.path == "/Jesus")
    {
      navigation.menuIndex = MenuIndex.Jesus
      currentMenuIndex = MenuIndex.Jesus
      colorName.value = "yellow"
    }
    else if(route.path == "/M4A")
    {
      navigation.menuIndex = MenuIndex.M4A
      currentMenuIndex = MenuIndex.M4A
      colorName.value = "green"
      colorHexValue.value = "#39bd39"
      buttonShadow.value = "lightgreen"
    }
    else if(route.path == "/PLI")
    {
      navigation.menuIndex = MenuIndex.PLI
      currentMenuIndex = MenuIndex.PLI
      colorName.value = "blue"
      colorHexValue.value = "#557fcc"
      buttonShadow.value = "skyblue"
    }
    else if(route.path == "/About")
    {
      navigation.menuIndex = MenuIndex.About
      currentMenuIndex = MenuIndex.About
      colorName.value = "gray"
      colorHexValue.value = "#b5bbcad3"
      buttonShadow.value = "lightgray"
    }

    //localStorage.setItem("navigationMenuIndex", MenuIndex.Jesus.toString())
  })

  watch(navigation,() =>
  {
    if(navigation.menuIndex == currentMenuIndex)
      return

    //Update colors if menu changes
    if(navigation.menuIndex == MenuIndex.Jesus)
    {
      currentMenuIndex = MenuIndex.Jesus
      colorName.value = "yellow"
    }
    else if(navigation.menuIndex == MenuIndex.M4A)
    {
      currentMenuIndex = MenuIndex.M4A
      colorName.value = "green"
      colorHexValue.value = "#39bd39"
      buttonShadow.value = "lightgreen"
    }
    else if(navigation.menuIndex == MenuIndex.PLI)
    {
      currentMenuIndex = MenuIndex.PLI
      colorName.value = "blue"
      colorHexValue.value = "#557fcc"
      buttonShadow.value = "skyblue"
    }
    else if(navigation.menuIndex == MenuIndex.About)
    {
      currentMenuIndex = MenuIndex.About
      colorName.value = "gray"
      colorHexValue.value = "#b5bbcad3"
      buttonShadow.value = "lightgray"
    }
  })

  function resetNavigation(menuIndex: number)
  {
    localStorage.setItem("navigationMenuIndex", menuIndex.toString())

    navigation.navBarIndex = 0
    localStorage.setItem("navigationNavbarIndex", "0")

    navigation.pageIndex = 0
    localStorage.setItem("navigationPageIndex", "0")
  }

  function moveToCommentSectionJumper()
  {
    navigation.menuIndex = MenuIndex.M4A

    const navbarAndPageValues = commentSectionNameHashTable.get("EndGame")
    if(navbarAndPageValues)
    {
      navigation.navBarIndex = navbarAndPageValues[0]
      navigation.pageIndex = navbarAndPageValues[1]
    }
    
    localStorage.setItem("navigationMenuIndex", navigation.menuIndex.toString())
    localStorage.setItem("navigationNavbarIndex", navigation.navBarIndex.toString())
    localStorage.setItem("navigationPageIndex", navigation.pageIndex.toString())
  }
</script>

<style scoped>
  ion-text, ion-label
  {
    white-space: nowrap;
    font-size: 15px /*Don't want the side menu text to shrink for smaller screens*/
  }

  #menuHeaderButton 
  {
    margin-bottom: -1px;
    text-align: center;
    padding-top: 8px;
    letter-spacing: 6px
  }

  #menuHeaderSVG
  {
    margin-bottom: 12px;
    margin-left: -4px;
    width:250px;
    height: 80px
  }

  #headerText
  {
    margin-left: -7px;
    font-size: 60px
  }

  #m 
  {
    font-size: 60px;
    letter-spacing: 0px
  }

  ion-icon 
  {
    width: 60px;
    height: 50px
  }

  ion-item
  {
    font-size: 20px;
    border-radius: 8px;
    text-align: center
  }

  ion-item:hover 
  {
    --background: display;
    text-decoration: underline;
    text-decoration-color: var(--ion-color-light);
    text-decoration-thickness: 2px
  }  

  ion-item.selected 
  {
    --background: display;
    text-decoration: underline;
    text-decoration-color: var(--ion-color-light);
    text-decoration-thickness: 2px
  }

  @media screen and (min-width: 629px) 
  { 
    .menuIcon
    {
     width: 50px;
     height: 80px
    }
  }
  @media screen and (max-width: 628.9px) 
  { 
    #menuHeaderContainer
    {
      height: 85px;
    }

    #menuHeaderButton 
    {
      margin-top: -7px;
    }

    .menuIcon
    {
     width: 50px;
     height: 64px
    }
  }
</style>
