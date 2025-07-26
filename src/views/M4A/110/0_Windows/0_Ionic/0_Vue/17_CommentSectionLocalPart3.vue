<template>
  <div id="topOfPage">
    <h1>Comment Section - Local Storage Part3 14/31</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <VideoFlipper
        ref="videoFlipper"
        frontVideo="https://www.youtube.com/embed/qBndkrNAt4U?cc_load_policy=1&cc_lang_pref=en"
        backVideo="https://www.youtube.com/embed/5kw1UCapkOs?cc_load_policy=1&cc_lang_pref=en"
      />
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.w3schools.com/html/html_emojis.asp" target="_blank">W3Schools: Universally Usable Emojis</a><br>
        <a href="https://www.w3schools.com/howto/howto_js_filter_elements.asp" target="_blank">W3Schools: Filter Elements</a><br>
        <a href="https://www.youtube.com/watch?v=C2xFnKWSxdQ" target="_blank">South Park: Ladder to Heaven</a><br>
      </p>
      <div align="left">
        <strong>Extra Video/SFX Lessons 5/6</strong><br>
        <button id="videoFlipButton" @click="videoFlipper.flipVideo()" :disabled=videoFlipper?.flipping>
          <span class="rainbowText">Making Gifs</span>
        </button>
        <br>
        <a href="https://ezgif.com/" target="_blank">ezgif</a><br>
        <a href="https://www.youtube.com/watch?v=XooISvoZ_rs" target="_blank">Agent Smith Says Mr Anderson</a><br>
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