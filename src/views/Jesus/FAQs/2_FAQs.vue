<template>
    <div>
    <h1>FAQs:2</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<media-player class="videoContainer" src="src/assets/video/Jesus Debate/FAQs/FAQs2/FAQs2.mp4">
        <media-provider><track src="src/assets/video/Jesus Debate/FAQs/FAQs2/FAQs2.vtt" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails="src/assets/video/Jesus Debate/FAQs/FAQs2/FAQs2-thumbnails.vtt"></media-plyr-layout>
      </media-player>-->
      <NextPageButton :lastPage="true"/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Brand Russell - Leftist Mafia:<br>
        <a href="https://www.youtube.com/watch?v=HBsBaRYVCwM" target="_blank">Munya Chawawa</a><br>
      </p>
      <p align="left">Nimby Show:<br>
        <a href="https://www.youtube.com/watch?v=ry2XlLKctiI" target="_blank">Rick James</a><br>
        <a href="https://www.youtube.com/watch?v=aJGz0VX4A04" target="_blank">Why Dave Nimby is a Nimby1</a><br>
        <a href="https://www.youtube.com/watch?v=673Dy9FgyGk" target="_blank">Why Dave Nimby is a Nimby2</a><br>
      </p>
      <p align="left">Kyle Kulinski Show:<br>
        <a href="https://www.youtube.com/watch?v=n7mRC4efJdg" target="_blank">Source 1</a><br>
        <a href="https://www.youtube.com/watch?v=TZ0Q5Gnzk2M" target="_blank">Source 2</a><br>
        <a href="https://www.youtube.com/watch?v=jQESa88NIjU" target="_blank">Source 3</a><br>
        <a href="https://www.youtube.com/watch?v=P3lapJkumTA" target="_blank">Source 4</a><br>
      </p>
      <p align="left">Meme Generator:<br> 
        <a href="https://imgflip.com/memegenerator/15170467/RIP" target="_blank">Source</a>
      </p>
      <p align="left">OHHH Meme:<br> 
        <a href="https://www.youtube.com/watch?v=CdLqerS0A6M" target="_blank">Source</a>
      </p>
      <p align="left">South Park:<br> 
        <a href="https://www.youtube.com/watch?v=RxdL13PiDs8" target="_blank">Source</a>
      </p>
      <p align="left">Boon Docks:<br> 
        <a href="https://ia800501.us.archive.org/0/items/the-boondocks-4k-season-2-complete-singecku/The%20Boondocks%20%284K%29%20S2%20E07%20-%20Shinin%27.mp4" target="_blank">Source</a>
      </p>
      <p align="left">Louis Rossman:<br> 
        <a href="https://www.youtube.com/watch?v=f1DvOF-giJQ" target="_blank">Source</a>
      </p>
    </div>
    <div class="sources">
      <h1>Tools</h1>
      <p align="left">Meme Generator:<br> 
        <a href="https://imgflip.com/memegenerator/15170467/RIP" target="_blank">Source</a>
      </p>
      <p align="left">Background Remover Tool:<br> 
        <a href="https://www.photoroom.com/tools/background-remover" target="_blank">Source</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import Uploading from '/src/components/pages/Uploading.vue'
</script>