<template>
  <div>
    <h1>VSDC Video Editor 10/10</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<media-player class="videoContainer" src="src/assets/video/Jesus Debate/110/12_VSDC/VSDC.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.videosoftdev.com/free-video-editor/download" target="_blank">VSDC</a><br>
        <a href="https://ia600508.us.archive.org/4/items/The-Boondocks-Season3-Complete-4K-Singecku/The%20Boondocks%20%284K%29%20S3%20E09%20-%20A%20Date%20With%20the%20Booty%20Warrior.mp4" target="_blank">Boondocks</a><br>
        <a href="https://www.youtube.com/watch?v=nyrWAHlqrOE" target="_blank">Jiggly Puff</a><br>
        <a href="https://www.amazon.com/Ketchum-League-Expo-Embroidered-Mesh/dp/B01KIY9T7W" target="_blank">Ash Hat</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import Uploading from '/src/components/pages/Uploading.vue'
</script>