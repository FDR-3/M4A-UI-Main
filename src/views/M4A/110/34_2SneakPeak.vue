<template>
  <div>
    <h1>Season 2: Sneak Peak</h1>
    <h2 class="multiLineHeaderLineHeight">💚 All my comrades are heathens 💚</h2>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/33_2SneakPeak/Season 2 Sneak Peak.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/X6WmJKm2vnQ?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://hianime.to/watch/durarara-303?ep=5743&ep=5743" target="_blank">Durarara</a><br>
        <a href="https://www.youtube.com/watch?v=w-eJSHoH9Fs" target="_blank">Key & Peele</a><br>
        <a href="https://www.youtube.com/watch?v=Xjv1sY630Uc&list=PLzMcBGfZo4-n40rB1XaJ0ak1bemvlqumQ" target="_blank">rick & Morty</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'
</script>