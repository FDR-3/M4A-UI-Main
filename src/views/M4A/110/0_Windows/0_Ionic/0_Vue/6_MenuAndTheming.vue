<template>
  <div>
    <h1>Menu And Theming 3/31</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/6_1MenuAndTheming/Menu And Theming.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/w8z5Rqd---w?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.pngtosvg.com/" target="_blank">Png to SVG</a><br>
        <a href="https://convertio.co/png-svg/" target="_blank">Convertio: Png to SVG(gave better results than above site for me for some svgs that came out a little jaggged)</a><br>
        <a href="https://mediamodifier.com/svg-editor" target="_blank">Mediamodifier SVG Editor</a><br>
        <a href="https://ionic.io/ionicons" target="_blank">Ion Icons (You can just import the icons)</a><br>
        <a href="https://www.photoroom.com/tools/background-remover" target="_blank">Photo room: another background remover tool (this one is really good, helps some times to throw in a contrasting background with paint)</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'
</script>