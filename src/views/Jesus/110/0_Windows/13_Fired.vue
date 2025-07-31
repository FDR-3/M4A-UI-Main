<template>
  <div>
    <h1>How I Was Illegally Fired In Retaliation 12/12</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/Jesus Debate/110/12_VSDC/VSDC.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/7sT6JFPbjPA?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://gofund.me/f4786bb5" target="_blank">GoFundMe: Xavier Dillard</a><br>
        <a href="https://www.myinstants.com/en/instant/metal-gear-solid-alert/" target="_blank">Myinstants: Metal Gear Sound Alert</a><br>
        <a href="https://www.youtube.com/watch?v=CEvzFcqKbXw" target="_blank">MetalGearfan: MetalGear Solid Alert Theme</a><br>
        <a href="https://media1.tenor.com/m/Fp0JJdxY6msAAAAC/yes-sweating.gif" target="_blank">Tenor: sweating gif</a><br>
        <a href="https://www.youtube.com/watch?v=5BIW6qyrdu4" target="_blank">HLN: Mission Accomplished</a><br>
        <a href="https://dn720807.ca.archive.org/0/items/TheBoondocks-4K-Season1-Complete-Singecku/The%20Boondocks%20E05%20%5B4K%5D%20A%20Date%20with%20the%20Health%20Inspector.ia.mp4" target="_blank">Boon Docks</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
</script>