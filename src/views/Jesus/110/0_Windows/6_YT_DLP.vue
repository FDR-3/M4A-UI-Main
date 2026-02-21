<template>
  <div>
    <h1>YT-DLP 5/{{ totalPages }}</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/Jesus Debate/110/6_YT_DLP/YT DLP.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      
      <iframe
        class="videoContainer"
        src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F61578948853626%2Fvideos%2F1075503857569972%2F&show_text=false&width=560&t=0"
        style="border:none;overflow:hidden"
        scrolling="no"
        frameborder="0"
        allowfullscreen="true"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen="true">
      </iframe>
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://github.com/yt-dlp/yt-dlp" target="_blank">YT-DLP</a><br>
        <a href="https://www.gyan.dev/ffmpeg/builds/" target="_blank">FFMPEG</a><br>
      </p>
    </div>
    <div class="sources">
      <h1>Video Responses</h1>
      <p align="left">Links<br>
        <a href="https://www.facebook.com/watch/?ref=embed_video&v=1312151866577735" target="_blank" class="rainbowText">Can You Use YT-DLP To Grab LinkedIn Videos?</a><br>
        <a href="https://www.facebook.com/watch/?ref=embed_video&v=808221278573916" target="_blank" class="rainbowText">Can You Use YT-DLP To Grab LinkedIn Course Videos?</a><br>
        <a href="https://www.youtube.com/watch?v=OBu6TJmluiQ" target="_blank" class="rainbowText">How To Fix YT-DLP 403 Forbidden/Cookies Error?</a><br>
        <a href="https://www.youtube.com/watch?v=VRmfsGSUI5M" target="_blank" class="rainbowText">How To Use YT-DLP On Android?</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'

  defineProps(['totalPages'])
</script>