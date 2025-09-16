<template>
  <div id="topOfPage">
    <h1>Minor Setback</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <VideoFlipper
        ref="videoFlipper"
        frontVideo="https://www.youtube.com/embed/RruaW_Ubjg4?cc_load_policy=1&cc_lang_pref=en"
        backVideo="https://www.youtube.com/embed/LSJ76d3bNKg?cc_load_policy=1&cc_lang_pref=en"
      />
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://docs.marginfi.com/faqs#how-do-i-unstake-my-lst" target="_blank">MarginFi docs are still linking to a website that turned into a scamming website for unstaking Q_Q</a><br>
        <a href="https://www.binance.com/en/square/post/2024-07-30-sanctum-warns-against-unstake-it-domain-due-to-potential-scam-11482025500225" target="_blank">Sanctum Warns Against Unstake.it Domain Due To Potential Scam</a><br>
      </p>

      <p align="left">
        <button id="videoFlipButton" @click="videoFlipper.flipVideo()" :disabled=videoFlipper?.flipping>
          <span class="rainbowText">Follow Up Video</span>
        </button>
        <br><a href="https://www.youtube.com/watch?v=XTgzRwUYpPI" target="_blank">Conclusion Video</a>
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

  var videoFlipper = ref()
</script>