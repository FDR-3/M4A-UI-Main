<template>
  <div id="topOfPage">
    <h1>Video Flipper 7/30</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<VideoFlipper
        ref="videoFlipper"
        frontVideo="src/assets/video/M4A/110/11_1VideoFlipper/VideoFlipper.mp4"
        backVideo="src/assets/video/M4A/110/Extra Editing Lessons/Extra Editing Lesson 4 - Thumbnails And Captions/Thumbnails And Captions.mp4"
      />-->
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=OV8MVmtgmoY" target="_blank">CSS Flip Card Effect - Arjun Khara</a><br>
        <a href="https://github.com/vidstack/player" target="_blank">Vidstack</a><br>
      </p>

      <div align="left">
        <span>Extra Video/SFX Lessons 4/6</span><br>
        <button id="videoFlipButton"  @click="videoFlipper.flipVideo()" :disabled=videoFlipper?.flipping>
          <span class="rainbowText">Thumbnails And Captioning Techniques</span>
        </button>
        <br>
        <a href="https://github.com/radiantmediaplayer/rmp-create-vtt-thumbnails" target="_blank">Radiant Media Player VTT Thumbnails</a><br>
      </div>
      <br>
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