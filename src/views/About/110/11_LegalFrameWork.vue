<template>
  <div>
    <h1>Legal Framework</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/About/110/7_LegalFrameWork/Legal FrameWork.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/nVmrSbGjQcA?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton :lastPage="true"/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.irs.gov/newsroom/money-received-through-crowdfunding-may-be-taxable-taxpayers-should-understand-their-obligations-and-the-benefits-of-good-recordkeeping" target="_blank">irs.gov: money received through crowdfunding</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'
</script>

<style scoped>
  .shit
  {
    font-size: 40px
  }
</style>
