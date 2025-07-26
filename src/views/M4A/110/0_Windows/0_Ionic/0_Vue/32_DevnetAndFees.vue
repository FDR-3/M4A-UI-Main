<template>
  <div>
    <h1>Devnet & Fees 28/31</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/32_1DevnetAndFees/Devnet And Fees.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/06Qb71OtVZE?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://solana.com/docs/intro/installation" target="_blank">Solana Config Commands</a><br>
        <a href="https://solana.stackexchange.com/questions/2016/how-can-i-calculate-the-cost-the-deploy-a-progam-to-main-net" target="_blank">Calculate How Much To Deploy Contract (Validator must be running if on local config)</a><br>
        <a href="https://www.quicknode.com/guides/solana-development/getting-started/a-complete-guide-to-airdropping-test-sol-on-solana" target="_blank">QuickNode: Airdrop Test SOL Guide</a><br>
        <a href="https://faucet.circle.com/" target="_blank">Circle USDC Devnet Faucet</a><br>
        <a href="https://faucet.solana.com/" target="_blank">Solana SOL Devnet Faucet</a><br>
        <a href="https://spl.solana.com/token" target="_blank">Solana SPL Token Docs</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'
</script>