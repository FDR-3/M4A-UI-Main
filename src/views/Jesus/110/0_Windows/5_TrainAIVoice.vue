<template>
  <div>
    <h1>Train A Custom RVC Voice Model 4/11</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/Jesus Debate/110/5_TrainAIVoice/TrainAIVoice.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/GwvULtYqjRw?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=Q8du7n0vgfU" target="_blank">Train a voice model - p3tro</a><br>
        <a href="https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI/releases/tag/2.2.231006" target="_blank">RVC WebUI</a><br>
        <a href="https://www.youtube.com/watch?v=yD32o5zqe7M" target="_blank">FDR3 Voice Source</a><br>
        <a href="https://www.audacityteam.org/" target="_blank">Audacity</a><br>
        <a href="https://github.com/flutydeer/audio-slicer" target="_blank">Audio Slicer</a><br>
        
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
</script>
