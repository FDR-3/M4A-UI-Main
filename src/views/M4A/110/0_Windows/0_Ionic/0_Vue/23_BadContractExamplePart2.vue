<template>
  <div>
    <h1>Bad Contract Example Part2 18/30</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/23_1BadContractExamplePart2/Bad Contract Example Part2.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=nM2Wz6NdPZs" target="_blank">MeatCanyon: Pinocchio Parody</a><br>
        <a href="https://www.youtube.com/watch?v=J5lR9zK0GUc" target="_blank">King Of Entertainment👑: Regular Show</a><br>
        <a href="https://www.youtube.com/watch?v=V_7T0adxZzg" target="_blank">Drafty Dafty Hubert O'Hare: Regular Show</a><br>
        <a href="https://huggingface.co/Delik/Peter_Griffin_RVCv2/blob/main/petergriffin.zip" target="_blank">HuggingFace/Delink: Peter Griffin Voice Model</a><br>
        <a href="https://www.youtube.com/watch?v=NZkStSdlh3c" target="_blank">sauerkraut28: Lebanese Alarm Clock</a><br>
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