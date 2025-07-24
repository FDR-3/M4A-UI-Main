<template>
  <div id="topOfPage">
    <h1>Getting Started 1/30</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<VideoFlipper
        ref="videoFlipper"
        frontVideo="src/assets/video/M4A/110/5_1GettingStarted/M4A Protocol Getting Started.mp4"
        backVideo="src/assets/video/M4A/110/Extra Editing Lessons/Extra Editing Lesson 1 - Outtros/Outtros.mp4"
      />-->
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://ionicframework.com/docs/intro/environment" target="_blank">Ionic Framework</a><br>
        <a href="https://ionicframework.com/docs/api" target="_blank">Ionic Component Docs</a><br>
        <a href="https://www.dafont.com/metal-gear-solid.font" target="_blank">Dafont Metal Gear</a><br>
        <a href="https://www.svgrepo.com/svg/210041/cross-belief" target="_blank">SVG Repo Cross</a><br>
        <a href="https://www.svgrepo.com/svg/53131/bandaid" target="_blank">SVG Repo Bandaid</a><br>
        <a href="https://www.freepik.com/free-vector/shield-outline-half-flat_43314030.htm#fromView=keyword&page=1&position=37&uuid=3bc244cd-14d9-48b0-a374-bb0d1dc3bb3e&query=Shield" target="_blank">Freepik Shield</a><br>
        <a href="https://ionic.io/ionicons" target="_blank">Ion Icons (You can just import the icons)</a><br>
        <a href="https://retoucher.online/transparent-background" target="_blank">Retoucher - make pic background transparent</a><br>
        <a href="https://www.youtube.com/watch?v=xhy7dXWjpAA" target="_blank">Futurama</a><br>
        <a href="https://www.youtube.com/watch?v=ymqh7vy3Qk8" target="_blank">Family Guy</a><br>
      </p>

      <p align="left">Extra Video/SFX Lessons 1/6<br>
        <button id="videoFlipButton" @click="videoFlipper.flipVideo()" :disabled=videoFlipper?.flipping>
          <span class="rainbowText">VSDC Outtros (Plus missing Metal Gear number 4)</span>
        </button>
        <br>
        <a href="https://www.vecteezy.com/vector-art/35767852-wolf-silhouette-editable-vector-illustration-isolated-over-white-background" target="_blank">Company Star Wolf Logo</a><br>
        <a href="https://www.youtube.com/watch?v=EKF-iXkwFN8" target="_blank">Brady Show</a><br>
        <a href="https://www.webdew.com/wp-content/uploads/2022/10/Vecteezy.png" target="_blank">Vecteezy Logo</a><br>
        <a href="https://fontforge.org/en-US/" target="_blank">Font Forge</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoFlipper from '/src/components/fancy/VideoFlipper.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'
  import Uploading from '/src/components/pages/Uploading.vue'

  var videoFlipper = ref()
</script>