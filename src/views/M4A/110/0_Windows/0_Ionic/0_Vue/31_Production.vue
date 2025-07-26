<template>
  <div>
    <h1>Production 27/31</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/31_1Production/Production.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/rbFMMQce3m8?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=GQhNwlibeP8" target="_blank">SnipesDG: Shia Labeouf Green Screen</a><br>
        <a href="https://www.youtube.com/watch?v=8TGalu36BHA" target="_blank">Hajbiz: DBZ, Further Beyond</a><br>
        <a href="https://www.youtube.com/watch?v=1pkX2k2Q_rk" target="_blank">Emit Reviews: Hostinger Value Proposition</a><br>
        <a href="https://www.youtube.com/watch?v=cTJJkfCsTs4" target="_blank">Craylor Made: Best free web hosting? Cloudflare vs. GitHub</a><br>
        Developer Note: As far as I could tell giving it a google, the free versions of GitHub Pages and Vercel aren't for commerical use.<br>
        <a href="https://www.youtube.com/watch?v=SCIfWhAheVw" target="_blank">Fireship: Vercel charges customer $96,280</a><br>
        <a href="https://www.youtube.com/watch?v=jsuNjCAngnQ" target="_blank">Theo - t3.gg: How To Avoid Big Serverless Bills</a><br>
        <a href="https://www.youtube.com/watch?v=vKrn53B-S_s&ab_channel=KnowledgeByMarcus" target="_blank">Knowledge By Marcus: How To Setup FREE Cloudflare CDN To Hostinger Under 3 Minutes</a><br>
        <a href="https://www.youtube.com/watch?v=1pczmZMy3Xs" target="_blank">SeaNanners: Haunted by Mr. Stop Talking About It</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'
</script>