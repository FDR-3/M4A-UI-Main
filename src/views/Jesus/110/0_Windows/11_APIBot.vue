<template>
  <div>
    <h1>API Youtube Scraping 9/10</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<media-player class="videoContainer" src="src/assets/video/Jesus Debate/110/11_APIBot/APIBot.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.tunepocket.com/youtube-channel-id-finder/?srsltid=AfmBOoqyJtHrAzAXYJljJDl_XOLvY1ZOjmMwJbXqigRrNkZpNNzardCM" target="_blank">TunePocket</a><br>
        <a href="https://pypi.org/project/scrapetube/" target="_blank">Scrape Tube API</a><br>
        <a href="https://pypi.org/project/youtube-transcript-api/" target="_blank">Youtube Transcript API</a><br>
        <a href="https://www.myinstants.com/en/instant/drum-roll-sound-effect-92004/" target="_blank">Drumroll SFX</a><br>
        <a href="https://www.youtube.com/watch?v=2oHV-ZKocEk" target="_blank">Jiggle Billy</a><br>
        <a href="https://www.youtube.com/watch?v=Yqurxi4PPIo" target="_blank">Threatening me or something</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import Uploading from '/src/components/pages/Uploading.vue'
</script>