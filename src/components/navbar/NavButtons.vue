<template>
  <div>
    <!--Big Nav Buttons-->
    <ion-button 
      v-for="(navButton, index) in navButtons"
      :color="colorName"
      class="navButton bigNavButtons"
      :class="{ selected: navigation.navBarIndex === index }"
      @click="setNavBarIndex(index)"
    >
      <ion-label :class="navButton.labelClass" :color="navButton.textColor">{{ navButton.text }}</ion-label>
    </ion-button>

    <!--Lil Nav Buttons-->
    <ion-button
      id="lilNavSelector"
      :color="colorName"
      class="navButton"
      @click="openPopOver($event)"
    >
      <div class="flexCenterColumn noClickEvent" style="margin-top: 20px">
        <ion-label class="lilNavTextSize" :class="lilNavClass" :color="lilNavTextColor">{{ lilNavText }}</ion-label>
        <ion-icon id="lilNavChevron" :src="chevronDown"></ion-icon>
      </div>
    </ion-button>
    <ion-popover :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen=false" side="bottom" size="cover">
      <ion-button 
        v-for="(navButton, index) in navButtons"
        :color="colorName"
        class="popOverButton"
        :class="{ selected: navigation.navBarIndex === index }"
        @click="setNavBarIndex(index)"
      >
        <ion-label class="lilNavTextSize" :class="navButton.labelClass" :color="navButton.textColor">{{ navButton.lilNavText }}</ion-label>
      </ion-button>
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
  var lilNavClass = ""
  var lilNavTextColor = ref("")

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
      lilNavClass = "rainbowText"
      lilNavTextColor.value = ""
    }
    else
    {
      lilNavText.value = props.navButtons[navigation.navBarIndex]?.lilNavText
      lilNavClass = ""
      lilNavTextColor.value = "dark"
    }
  }
</script>

<style scoped>
  .navButton
  {
    margin: 7px;
    width: 96px;
    height: 65px;
    letter-spacing: 0px;
    font-size: min(6.0vw, 15px);
    font-weight: bold
  }

  .navButton:hover
  {
    opacity: 1;
    text-decoration: underline;
    text-decoration-color: var(--ion-color-light);
    text-decoration-thickness: 2px
  }

  ion-button.selected
  {
    text-decoration: underline;
    text-decoration-color: var(--ion-color-light);
    text-decoration-thickness: 2px;
    border-radius: 12px;
    box-shadow: 0px 0px 5px 8px v-bind(buttonShadow)
  }

  #lilNavSelector
  {
    border-radius: 12px;
    box-shadow: 0px 0px 5px 8px v-bind(buttonShadow)
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

  @media screen and (min-width: 1064px)
  {
    #lilNavSelector
    {
      display: none
    }
  }

  @media screen and (max-width: 1063.9px)
  {
    .bigNavButtons
    {
      display: none
    }
  }
</style>