<template>
  <div>
    <h1>Playwright Youtube Scraping/View Bot 15/{{ totalPages }}</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/Jesus Debate/110/3_OBS/OBS.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/ughLJLie7cg?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://github.com/FDR-3/Playwright-Youtube-Bot" target="_blank">Playwright Bot Repo</a><br>
        <a href="https://github.com/FDR-3/YoutubeBots" target="_blank">Selenium Bot Repo</a><br>
        <a href="https://code.visualstudio.com/" target="_blank">VS Code</a><br>
        <a href="https://nodejs.org/en/download" target="_blank">Node.js</a><br>
        <a href="https://www.polygon.com/naoya-hair-flip-meme-jujutsu-kaisen-season-3-anime-adaptation-mappa/" target="_blank">JJK</a><br>
        <a href="https://seeklogo.com/vector-logo/489584/playwright" target="_blank">Playwright Logo</a><br>
        <a href="https://seeklogo.com/vector-logo/456125/selenium" target="_blank">Selenium Logo</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'

  defineProps(['totalPages'])
</script>
