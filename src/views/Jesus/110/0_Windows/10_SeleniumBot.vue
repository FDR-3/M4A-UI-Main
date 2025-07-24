<template>
  <div>
    <h1>Selenium Youtube Scraping 8/10</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<media-player class="videoContainer" src="src/assets/video/Jesus Debate/110/10_SeleniumBot/Selenium Bot.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://code.visualstudio.com/" target="_blank">VS Code</a><br>
        <a href="https://googlechromelabs.github.io/chrome-for-testing/#stable" target="_blank">Download Chrome Browser & Web Driver (To download a driver, you can open the zip file link in another browser tab)</a><br>
        <a href="https://www.youtube.com/watch?v=ofw2RsOb7h0" target="_blank">Devil Artemis</a><br>
        <a href="https://www.youtube.com/watch?v=cPuPqObRQgc" target="_blank">Kyle Kulinski Show</a><br>
        <a href="https://ia600508.us.archive.org/4/items/The-Boondocks-Season3-Complete-4K-Singecku/The%20Boondocks%20%284K%29%20S3%20E09%20-%20A%20Date%20With%20the%20Booty%20Warrior.mp4" target="_blank">Boondocks</a><br>
        <a href="https://www.amazon.com/Ketchum-League-Expo-Embroidered-Mesh/dp/B01KIY9T7W/ref=sr_1_29?sr=8-29" target="_blank">Ash Hats</a><br>
        <a href="https://www.youtube.com/watch?v=nyrWAHlqrOE" target="_blank">Jiggly Puff SFX</a><br>
        <a href="https://www.youtube.com/watch?v=lXZk_wSzUKc" target="_blank">Gold in them there hills!</a><br>
        <a href="https://www.pokemon.com/us/pokedex/jigglypuff" target="_blank">Jigglypuff</a><br>
        <a href="https://www.youtube.com/watch?v=ZXsQAXx_ao0" target="_blank">Shia Labeouf, Just Do It!</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import Uploading from '/src/components/pages/Uploading.vue'
</script>