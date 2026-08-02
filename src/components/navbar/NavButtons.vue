<template>
  <div style="margin-bottom: 3px">
    <!--Big Nav Buttons-->
    <ion-button 
      v-for="(navButton, index) in navButtons"
      color="offLightDark "
      class="navButton bigNavButtons"
      style="border-radius: 4px"
      :class="{ selected: navigation.navBarIndex === index }"
      @click="handleNavClick(index, navButton.url)"
    >
      <ion-label :class="navButton.labelClass" :color="navButton.textColor">{{ navButton.text }}</ion-label>
    </ion-button>

    <!--Lil Nav Buttons-->
    <ion-button
      id="lilNavSelector"
      color="offLightDark "
      class="navButton"
      @click="openPopOver($event)"
    >
      <div class="flexCenterColumn noClickEvent" style="margin-top: 20px">
        <ion-label class="lilNavTextSize" :class="lilNavClass" :color="lilNavClass=='' ? colorName : ''">{{ lilNavText }}</ion-label>
        <ion-icon id="lilNavChevron" color="dark" :src="chevronDown"></ion-icon>
      </div>
    </ion-button>
    <ion-popover :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen=false" side="bottom" size="cover">
      <div class="flexCenterColumn">
        <ion-button 
          v-for="(navButton, index) in navButtons"
          color="offLightDark "
          class="popOverButton tinyMarginTop"
          :class="{ selected: navigation.navBarIndex === index,
            tinyMarginBottom: index === navButtons.length - 1 }"
          :style="{ '--box-shadow': navigation.navBarIndex === index ? `0px 0px 5px 8px ${buttonShadow}`: '' }"
          @click="handleNavClick(index, navButton.url)"
        >
          <ion-label class="innerLilNavTextSize" :class="navButton.labelClass" :color="navButton.textColor">{{ navButton.lilNavText }}</ion-label>
        </ion-button>
      </div>
    </ion-popover>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonPopover } from '@ionic/vue'
  import { chevronDown } from 'ionicons/icons'
  import { navigation } from '/src/assets/globalStates/Navigation.vue'

  const props = defineProps(['navButtons', 'colorName', 'buttonShadow'])

  var lilNavText = ref("")
  var lilNavClass = ref("")

  var popoverOpen = ref()
  var event :Event

  onMounted(() =>
  {
    setLilNavBarIndex()
  })

  watch(navigation,() =>
  {
    popoverOpen.value = false
    setLilNavBarIndex()
  })

  function openPopOver(e: Event)
  {
    event= e
    popoverOpen.value = true
  }

  function handleNavClick(index: number, url: string)
  {
    setNavBarIndex(index)

    const pathname = window.location.pathname
    const portfolioMatch = pathname.match(/^\/M4A\/Markets-Portfolios-([a-zA-Z0-9]+)-(\d+)$/)
    const urlIsMarketsSubPath = window.location.pathname == "/M4A/Markets-Portfolios" || window.location.pathname == "/M4A/Markets-LendingLeaderBoard"
    if(url != "/M4A/Markets")
      window.history.pushState({}, '', url)
    else if(!urlIsMarketsSubPath && !portfolioMatch)
      window.history.pushState({}, '', url)
  }

  function setNavBarIndex(navBarindex: number)
  {
    popoverOpen.value = false;

    navigation.navBarIndex = navBarindex
    localStorage.setItem("navigationNavbarIndex", navigation.navBarIndex.toString())

    navigation.pageIndex = 0
    localStorage.setItem("navigationPageIndex", "0")
  }

  function setLilNavBarIndex()
  {
    if(navigation.navBarIndex == 0)
    {
      lilNavText.value = props.navButtons[navigation.navBarIndex]?.lilNavText
      lilNavClass.value = "rainbowText"
    }
    else
    {
      lilNavText.value = props.navButtons[navigation.navBarIndex]?.lilNavText
      lilNavClass.value = ""
    }
  }
</script>

<style scoped>
  ion-button
  { 
    --border-radius: 4px;
    --border-width: 1px;
    --border-style: solid;
    border: thin solid var(--ion-color-dark)
  }

  .navButton
  {
    margin: 7px;
    width: 96px;
    height: 65px;
    letter-spacing: 0px;
    font-size: min(6.0vw, 15px);
    font-weight: bold
  }

  ion-button:hover
  {

    text-decoration: underline;
    text-decoration-color: var(--ion-color-dark);
    text-decoration-thickness: 2px
  }

  .popOverButton
  {
    width: 80px !important
  }

  ion-button.selected
  {
    text-decoration: underline;
    text-decoration-color: var(--ion-color-dark);
    text-decoration-thickness: 2px;
    --box-shadow: 0px 0px 5px 8px v-bind(buttonShadow)
  }

  #lilNavSelector
  {
    --box-shadow: 0px 0px 5px 8px v-bind(buttonShadow)
  }

  #lilNavChevron
  {
    height: min(5vw, 20px);
    width: min(8vw, 20px)
  }

  .lilNavTextSize
  {
    font-size: min(7vw, 15px)
  }

  .innerLilNavTextSize
  {
    font-size: min(7vw, 13px)
  }

  @media screen and (min-width: 1101px)
  {
    #lilNavSelector
    {
      display: none
    }
  }

  @media screen and (max-width: 1100.9px)
  {
    .bigNavButtons
    {
      display: none
    }
  }
</style>