<template>
  <div id="topOfPage">
    <h1>Video Flipper 8/31</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <VideoFlipper
        ref="videoFlipper"
        frontVideo="https://www.youtube.com/embed/h0hnb-maWw4?cc_load_policy=1&cc_lang_pref=en"
        backVideo="https://www.youtube.com/embed/oBUzbfxJS7A?cc_load_policy=1&cc_lang_pref=en"
      />
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
        <strong>Extra Video/SFX Lessons 4/6</strong><br>
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

  var videoFlipper = ref()
</script>