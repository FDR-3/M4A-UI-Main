<template>
  <div>
    <h1>Footer 3/30</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/7_1Footer/Footer.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://icons8.com/icon/YfCbGWCWcuar/x" target="_blank">Icons8 Twitter</a><br>
        <a href="https://www.svgrepo.com/svg/512317/github-142" target="_blank">SVG Repo Github</a><br>
        <a href="https://www.svgrepo.com/svg/508999/youtube" target="_blank">SVG Repo Youtube</a><br>
        <a href="https://c.tenor.com/x8v1oNUOmg4AAAAd/tenor.gif" target="_blank">Rick Roll GIF</a><br>
        <a href="https://www.pngtosvg.com/" target="_blank">Png to SVG</a><br>
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