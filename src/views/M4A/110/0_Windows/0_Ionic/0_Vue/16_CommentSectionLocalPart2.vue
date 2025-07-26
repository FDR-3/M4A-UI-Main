<template>
  <div>
    <h1>Comment Section - Local Storage Part2 13/31</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/16_1CommentSectionLocalStoragePart2/Comment Section - Local Storage Part 2.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/5YadHiv5vaU?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.pngtosvg.com/gallery/product/dead-tree-id-1607999364760/" target="_blank">Png to Svg: dead tree</a><br>
        <a href="https://uxwing.com/green-tree-icon/" target="_blank">UX Wing: green tree</a><br>
        <a href="https://uxwing.com/trees-icon/" target="_blank">UX Wing: trees</a><br>
        <a href="https://www.svgrepo.com/svg/446292/pencil" target="_blank">SVG Repo: pencil</a><br>
        <a href="https://www.svgrepo.com/svg/490254/trash-can" target="_blank">SVG Repo: trash can</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'
</script>