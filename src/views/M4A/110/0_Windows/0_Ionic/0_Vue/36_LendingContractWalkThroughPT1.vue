<template>
  <div>
    <h1>Lending Contract Walk Through Part1 32/{{ totalPages }}</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/33_2SneakPeak/Season 2 Sneak Peak.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/gx9KW_6SBHk?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://solana.com/docs/core/pda/pda-derivation" target="_blank">Solana PDA info</a><br>
        <a href="https://www.tumblr.com/adventurtime-gifs/52484168415" target="_blank">Adventure time soul sucking gif</a><br>
        <a href="https://www.wco.tv/hunter-x-hunter-2011-episode-117-english-dubbed" target="_blank">Hunter x Hunter</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'

  defineProps(['totalPages'])
</script>