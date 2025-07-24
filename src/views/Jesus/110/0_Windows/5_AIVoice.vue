<template>
  <div>
    <h1>Okada Voice Changer Client 3/10</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<media-player class="videoContainer" src="src/assets/video/Jesus Debate/110/4_AIVoice/Voice Changer Client.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://github.com/w-okada/voice-changer/blob/master/README_en.md" target="_blank">Okada Voice Change Github</a><br>
        <a href="https://www.7-zip.org/" target="_blank">7Zip</a><br>
        <a href="https://www.win-rar.com/start.html?&L=0" target="_blank">Winrar</a><br>
        <a href="https://huggingface.co/wok000/vcclient000/tree/main" target="_blank">Hugging Face Download Links</a><br>
        <a href="https://voice-models.com/" target="_blank">Voice Models</a><br>
        <a href="https://vb-audio.com/Cable/index.htm" target="_blank">Virtual Audio Cable</a><br>
        <a href="https://www.youtube.com/watch?v=LhEwywEa6QA" target="_blank">Okada Voice Changer Setup</a><br>
        <a href="https://www.youtube.com/watch?v=dZ_2HELnWJU" target="_blank">Okada Voice Changer Optimizations</a><br>
      </p>
      <p align="left" class="rainbowText">Extras<br>
        <a href="https://www.youtube.com/watch?v=7pMrssIrKcY" target="_blank">Why you shouldn't buy an ASUS branded graphics card or anything from ASUS</a><br>
        <a href="https://www.youtube.com/watch?v=FGW3TPytTjc" target="_blank">Why you shouldn't get computer hardware information from Linux Tech Tips</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import Uploading from '/src/components/pages/Uploading.vue'
</script>