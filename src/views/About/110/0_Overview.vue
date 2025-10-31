<template>
      <!--<StarWolfBannerHTMLText/>-->
      <div v-if="darkTheme.value">
        <RIPDarkModeStarWolfBannerSignal id="banner" v-if="adminAccounts.ceoIsDead"/>
        <DarkModeStarWolfBannerSignal id="banner" v-else/>
      </div>
      <div v-else>
        <RIPLightModeStarWolfBannerSignal id="banner" v-if="adminAccounts.ceoIsDead"/>
        <LightModeStarWolfBannerSignal id="banner" v-else/>
      </div>
      <p>M4A Protocol is the world's first attempt at universal healthcare using smart contracts.
        By making hospital bills transparent and public, M4A Protocol will force hospitals to compete with each other instead of hiding behind charge masters.
        The majority of the funds for paying people's medical bills will come from fees generated from an over collateralized lending protocol such as Aave or Margin Fi.
        Other developers will be able to build on top of M4A protocol to pay other people's medical bills or any bills that they might choose.
        M4A Protocol makes it profitable to pay other people's bills.
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
  import RIPDarkModeStarWolfBannerSignal from '/src/components/fancy/rip/RIPDarkModeStarWolfBannerSignal.vue' 
  import RIPLightModeStarWolfBannerSignal from '/src/components/fancy/rip/RIPLightModeStarWolfBannerSignal.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
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
