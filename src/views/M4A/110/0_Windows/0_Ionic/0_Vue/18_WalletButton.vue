<template>
  <div>
    <h1>Wallet Button 14/30</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/18_1WalletButton/Wallet Button.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://github.com/lorisleiva/solana-wallets-vue" target="_blank">lorisleiva Github: Vue 3 solana-wallets-vue (npm install "@solana/wallet-adapter-wallets" is broken, "solana-wallets-vue" still installs fine currently) 6/1/2025</a><br>
        <a href="https://codesandbox.io/p/devbox/solana-wallets-vue-3kn4l" target="_blank">lorisleiva CodeSandBox: Vue 3 solana-wallets-vue</a><br>
        <a href="https://www.npmjs.com/package/solana-wallets-vue" target="_blank">solana-wallets-vue npm install command that actually works(It just works cause it's not also installing "@solana/wallet-adapter-wallets")</a><br>
        <a href="https://github.com/lorisleiva/solana-wallets-vue/issues/49" target="_blank">lorisleiva solana-wallets-vue: Wallet disconnect error</a><br>
        <a href="https://www.youtube.com/watch?v=orGcdmCRCc0" target="_blank">LearnVue: Vue Slots Simplified</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'
  import Uploading from '/src/components/pages/Uploading.vue'
</script>