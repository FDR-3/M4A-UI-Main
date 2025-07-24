<template>
  <div class="videoFlipContainer">
    <div class="videoCard" :class="flipped">
      <div class="frontVideo" :style="{display: display1stVideo}">
        <media-player class="videoContainer" :src="frontVideo">
          <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
          <media-plyr-layout thumbnails=""></media-plyr-layout>
        </media-player>
      </div>

      <div class="backVideo" :style="{display: display2ndVideo}">
        <media-player class="videoContainer" :src="backVideo">
          <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
          <media-plyr-layout thumbnails=""></media-plyr-layout>
        </media-player>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  defineProps(['frontVideo', 'backVideo'])

  var flipping = ref(false)
  var flipped = ""
  var display1stVideo = ref("")
  var display2ndVideo = ref("none")

  function flipVideo()
  {
    document.getElementById("topOfPage")?.scrollIntoView()

    flipping.value = true

    if(flipped == "")
    {
      flipped = "flipped"
      display2ndVideo.value = "block"

      setTimeout(() => 
      {
        display1stVideo.value = "none"
        flipping.value = false
      }, 500) // 1000 milliseconds == 1 seconds
    }
    else
    {
      flipped = ""
      display1stVideo.value = "block"

      setTimeout(() => 
      {
        display2ndVideo.value = "none"
        flipping.value = false
      }, 500) // 1000 milliseconds == 1 seconds
    }   
  }

  defineExpose(
  {
    flipVideo,
    flipping
  })
</script>

<style scoped>
  .videoFlipContainer
  {
    position: relative;
    width: min(55vw, 1920px);
    height: min(31vw, 1080px)
  }

  .videoCard
  {
    position: absolute;
    width: min(55vw, 1920px);
    transform-style: preserve-3d;
    transition: all 0.5s ease
  }

  .videoCard.flipped
  {
    transform: rotateY(180deg)
  }

  .frontVideo
  {
    position: absolute;
    backface-visibility: hidden;
  }

  .backVideo
  {
    position: absolute;
    backface-visibility: hidden;
    transform: rotateY(180deg)
  }
</style>