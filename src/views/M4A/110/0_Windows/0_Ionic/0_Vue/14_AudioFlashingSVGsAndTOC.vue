<template>
  <div>
    <h1>Audio, Flashing SVGs, And TOC 10/30</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/14_1AudioFlashingSVGsAndTOC/Audio, Flashing SVGs, And TOC.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.svgrepo.com/svg/382713/windows-applications" target="_blank">SVG Repo: Windows</a><br>
        <a href="https://www.svgrepo.com/svg/511330/apple-173" target="_blank">SVG Repo: Apple</a><br>
        <a href="https://www.svgrepo.com/svg/354004/linux-tux" target="_blank">SVG Repo: Linux</a><br>
        <a href="https://ionic.io/about/brand" target="_blank">Ionic Brand Logo</a><br>
        <a href="https://www.svgrepo.com/svg/354416/svelte-icon" target="_blank">SVG Repo: Svelte</a><br>
        <a href="https://www.svgrepo.com/svg/354528/vue" target="_blank">SVG Repo: Vue</a><br>
        <a href="https://www.svgrepo.com/svg/452092/react" target="_blank">SVG Repo: React</a><br>
        <a href="https://www.svgrepo.com/svg/353396/angular-icon" target="_blank">SVG Repo: Angular</a><br>
        <a href="https://convert.routenote.com/stereo-to-mono" target="_blank">RouteNote: Stereo To Mono</a><br>
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