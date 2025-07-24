<template>
  <div>
    <h1>M4A Public Service Announcement</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/15_2PSA/This Sunday!.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://dn721907.ca.archive.org/0/items/the-boondocks-upscaled-season-1/S01E04%20-%20Granddad%27s%20Fight.mp4" target="_blank">Boon Docks</a><br>
        <a href="https://www.youtube.com/watch?v=w-eJSHoH9Fs" target="_blank">Key & Peele</a><br>
        <a href="https://ia800501.us.archive.org/0/items/the-boondocks-4k-season-2-complete-singecku/The%20Boondocks%20%284K%29%20S2%20E01%20-%20...%20Or%20Die%20Trying%20%2850%20Cent%29.mp4" target="_blank">Boon Docks</a><br>
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