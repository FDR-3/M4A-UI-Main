<template>
      <!--<StarWolfBannerHTMLText/>-->
      <div>
        <DarkModeStarWolfBannerSignal id="banner" v-if="darkTheme.value"/>
        <LightModeStarWolfBannerSignal id="banner" v-if="!darkTheme.value"/>
      </div>
      <p>M4A Protocol is a decentrally funded, single payer health care system. 
        Please check out our open source sections to learn more.
        <span class="rainbowText"><br> We are 110% open sourced!!!</span>
      </p>
      <NextPageButton/>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import StarWolfBannerHTMLText from '/src/components/fancy/StarWolfBannerHTMLText.vue'
  import DarkModeStarWolfBannerSignal from '/src/components/fancy/DarkModeStarWolfBannerSignal.vue' 
  import LightModeStarWolfBannerSignal from '/src/components/fancy/LightModeStarWolfBannerSignal.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
</script>

<style scoped>
  #banner
  {
    width: min(90vw, 1700px);
    height: min(30vw, 564px);
    margin-bottom: -7px
  }
</style>
