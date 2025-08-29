<template>
  <div>
    <h1>Overview 1/13</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/Jesus Debate/110/0_Overview/Just a Debate About Jesus.mp4">
        <media-provider><track src="src/assets/video/Jesus Debate/110/0_Overview/Just a Debate About Jesus.vtt" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails="src/assets/video/Jesus Debate/110/0_Overview/Just a Debate About Jesus-thumbnails.vtt"></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/nLMnPQ-bGX0?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">History:<br>
        <a href="https://www.youtube.com/watch?v=OqHrJd_1MiE" target="_blank">The truth about apartheid israel - One Path Network</a><br>
      </p>
      <p align="left">Gospels:<br>
        <a href="https://www.youtube.com/watch?v=E8YtTg9mpF8" target="_blank">Mark</a><br>
        <a href="https://www.youtube.com/watch?v=wrdYjcCVrfw" target="_blank">John</a><br>
        <a href="https://www.youtube.com/watch?v=jh76UkE3jB0" target="_blank">Acts</a><br>
        <a href="https://www.youtube.com/watch?v=PIZpD3fMPh0" target="_blank">Romans</a><br>
      </p>
      <p align="left">The Kyle Kulinski Show:<br>
        <a href="https://www.youtube.com/watch?v=mH3h9K0iAGg" target="_blank">Source 1</a><br>
        <a href="https://www.youtube.com/watch?v=qkl_PefewXc" target="_blank">Source 2/3</a><br>
        <a href="https://www.youtube.com/watch?v=xGCKL4PzNL0" target="_blank">Source 4</a><br>
        <a href="https://www.youtube.com/watch?v=P3lapJkumTA" target="_blank">Source 5/9/12</a><br>
        <a href="https://www.youtube.com/watch?v=ZSZQ6Ph3DnY" target="_blank">Source 6</a><br>
        <a href="https://www.youtube.com/watch?v=3qqESEsOOLs" target="_blank">Source 7</a><br>
        <a href="https://www.youtube.com/watch?v=1U3Fuohj9wg" target="_blank">Source 8</a><br>
        <a href="https://www.youtube.com/watch?v=c29UXIIlNu0" target="_blank">Source 10</a><br>
        <a href="https://www.youtube.com/watch?v=M21ov2w-qAM" target="_blank">Source 11</a><br>
      </p>
      <p align="left">Leroy Kenton:<br> 
        <a href="https://www.youtube.com/watch?v=wUmWsPhllAU" target="_blank">Source</a>
      </p>
      <p align="left">AI Art Generator:<br> 
        <a href="https://www.dall-efree.com/" target="_blank">Source</a>
      </p>
      
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
</script>
