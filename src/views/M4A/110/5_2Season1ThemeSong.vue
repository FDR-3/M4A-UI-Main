<template>
  <div id="topOfPage">
    <h1>Season 1 Theme Song</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <VideoFlipper
        ref="videoFlipper"
        frontVideo="https://www.youtube.com/embed/VdEr0DvuGhk"
        backVideo="https://www.youtube.com/embed/S6wwQle7-5g?cc_load_policy=1&cc_lang_pref=en"
      />
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=E8YtTg9mpF8" target="_blank">Gospel of Mark</a><br>
        <a href="https://www.youtube.com/watch?v=5-sfG8BV8wU" target="_blank">Original Music Video</a><br>
        <a href="https://www.youtube.com/watch?v=ZXsQAXx_ao0" target="_blank">Original Video</a><br>
        <a href="https://www.nationalnursesunited.org/medicare-for-all" target="_blank">National Nurses United</a><br>
        <a href="https://www.youtube.com/watch?v=GQhNwlibeP8" target="_blank">Shia Labeouf Green Screen</a><br>
        <a href="https://youtu.be/yx9PucbYnzM?t=21" target="_blank">Green Screen: Explosion #4</a><br>
        <a href="https://www.youtube.com/watch?v=br4tnE425y0" target="_blank">Bruce Almighty Typing</a><br>
        <a href="https://www.youtube.com/watch?v=-sqio1tiPGk" target="_blank">Wolverine</a><br>
        <a href="https://www.youtube.com/watch?v=YHYp0ZLVa9g" target="_blank">Scary Movie Clip 1</a><br>
        <a href="https://www.youtube.com/watch?v=UlIBiZxArGY" target="_blank">Scary Movie Clip 2</a><br>
        <a href="https://www.youtube.com/watch?v=gCZBY7a8kqE" target="_blank">Matrix</a><br>
        <a href="https://www.youtube.com/watch?v=BxBXzAcGgd8" target="_blank">Green Screen: Uncle Sam</a><br>
        <a href="https://www.architecturaldigest.com/story/everything-you-need-to-know-about-the-white-house" target="_blank">White House</a><br>
        <a href="https://www.youtube.com/watch?v=wJw4FfyoCzw" target="_blank">An Extremely Goofy Movie</a><br>
        <a href="https://www.youtube.com/watch?v=QbYzEnYmATM" target="_blank">Gospel of Matthew</a><br>
        <a href="https://www.freepik.com/free-psd/view-nature-mountain-landscape_269375113.htm#fromView=search&page=1&position=11&uuid=60aa5941-3a14-4893-9255-2b554177b284&query=giant+Mountain" target="_blank">Freepik Mountain</a><br>
      </p>

      <p align="left"><br>
        <strong>Extra Video/SFX Lessons 2/6</strong><br>
        <button id="videoFlipButton" @click="videoFlipper.flipVideo()" :disabled=videoFlipper?.flipping>
          <span class="rainbowText">Isolating Voices</span>
        </button>
        <br>
        <a href="https://www.youtube.com/watch?v=QbYzEnYmATM" target="_blank">Gospel of Matthew</a><br>
        <a href="https://github.com/Anjok07/ultimatevocalremovergui" target="_blank">Ultimate Vocal Remover 5</a><br>
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