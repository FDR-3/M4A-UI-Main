<template>
  <div id="topOfPage">
    <h1 >Louis Rossman Loses The Plot😢</h1>
    <h2 class="multiLineHeaderLineHeight">(How to make all the issues of universal health care, right to repair, murder, rape, and all world problems go away)</h2>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<VideoFlipper
        ref="videoFlipper"
        frontVideo="src/assets/video/M4A/110/7_2LostPlot/Lost Plot.mp4"
        backVideo="src/assets/video/M4A/110/Extra Editing Lessons/Extra Editing Lesson 3 - Advance Movement/Advance Movement.mp4"
      />-->
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=dgVzeXtC6vs" target="_blank">ლ(╹◡╹ლ) King obama Makes ANOTHER One Of His Phone Calls ლ(╹◡╹ლ)</a><br>
        <a href="https://www.healthcare-now.org/blog/obama-received-20-million-from-healthcare-industry-in-2008-campaign/" target="_blank">King obama Gets Bought Off - HealthCareNow</a><br>
        <a href="https://www.indybay.org/newsitems/2011/03/19/18675092.php" target="_blank">King obama Bombs Hospitals In Libya Cause The World Is Messy And We Don't Need Purity Tests - indybay.org</a><br>
        <a href="https://www.youtube.com/watch?v=8PDxvIxeH3Q" target="_blank">Louis Rossman</a><br>
        <a href="https://www.youtube.com/watch?v=I3cGfrExozQ" target="_blank">randypagan</a><br>
        <a href="https://www.youtube.com/watch?v=Bu7oYE0SCuQ" target="_blank">King obama Runs His Mouth</a><br>
        <a href="https://www.amazon.com/Loftus-International-Halloween-Scepter-Accessory/dp/B074ZM6ZDF/ref=sr_1_5?sr=8-5">King obama Staff</a><br>
        <a href="https://a.1stdibscdn.com/archivesE/upload/9318/43_14/13233940/ORG_1323394.jpeg?disable=upscale&auto=webp&quality=60&width=700">King obama Tiger Pelt</a><br>
        <a href="https://www.youtube.com/watch?v=mVOPAVeBFhI" target="_blank">Power To The People Podcast</a><br>
        <a href="https://www.youtube.com/watch?v=69JZoQG2cL0" target="_blank">Howard Stern</a><br>
        <a href="https://www.youtube.com/watch?v=Kp7eSUU9oy8" target="_blank">Donald Glover</a><br>
      </p>

      <p align="left">Extra Video/SFX Lessons 3/6<br>
        <button id="videoFlipButton" @click="videoFlipper.flipVideo()" :disabled=videoFlipper?.flipping>
          <span class="rainbowText">Advanced Movement Techniques</span>
        </button>
        <br>
        <a href="https://www.youtube.com/watch?v=jlRKOVBSSi0" target="_blank">Green Screen Crown</a><br>
        <a href="https://www.youtube.com/watch?v=2uPqYhkIzrA" target="_blank">Give King obama His Propers!!!! - John Stewart</a><br>
        <a href="https://www.youtube.com/watch?v=LlDfEMzFyGo" target="_blank">Rush Hour</a><br>
        <a href="https://www.youtube.com/watch?v=coLerbRvgsQ" target="_blank">You should see me in a crown - Billie Eilish</a><br>
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