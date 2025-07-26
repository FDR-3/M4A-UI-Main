<template>
  <div>
    <h1>Comment Section - Local Storage Part1 12/31</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/15_1CommentSectionLocalStoragePart1/Comment Section - Local Storage Part 1.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/EO1Zx5TK7E0?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://projects.aaronromanick.com/interactive-comments-section/" target="_blank">Aaron Romanick - Interactive Comments Section</a><br>
        <a href="https://github.com/aaron-romanick/interactive-comments-section/tree/main/src/components" target="_blank">Aaron Romanick - Interactive Comments Section Code</a><br>
        <a href="https://media.licdn.com/dms/image/v2/C4D12AQEJDbI0MHyLug/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1520159720884?e=2147483647&v=beta&t=gYvH473CQC9kbm2x7lZt6tOxdyNv-FJT1S2Wn-5kN4g" target="_blank">man bowing</a><br>
        <a href="https://uxwing.com/green-tree-icon/" target="_blank">UX Wing: green tree</a><br>
        <a href="https://www.svgrepo.com/svg/354592/youtube-icon" target="_blank">SVG Repo: youtube icon</a><br>
        <a href="https://www.deviantart.com/hirussai/art/Sad-Pepe-Feels-Bad-Man-Vector-535336270" target="_blank">feels bad man svg</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'
</script>