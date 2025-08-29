<template>
  <div>
    <h1>YT-DLP 5/13</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/Jesus Debate/110/6_YT_DLP/YT DLP.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/V2ghw1ijqk8?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://github.com/yt-dlp/yt-dlp" target="_blank">YT-DLP</a><br>
        <a href="https://www.gyan.dev/ffmpeg/builds/" target="_blank">FFMPEG</a><br>
      </p>
    </div>
    <div class="sources">
      <h1>Video Responses</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=e2HbHq0wmeU" target="_blank" class="rainbowText">Can You Use YT-DLP To Grab LinkedIn Videos?</a><br>
        <a href="https://www.youtube.com/watch?v=o3g7ZrrwK9w" target="_blank" class="rainbowText">Can You Use YT-DLP To Grab LinkedIn Course Videos?</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
</script>