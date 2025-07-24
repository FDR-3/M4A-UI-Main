<template>
  <div>
    <h1>T.Y.A.B.T.E.</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <div>
        <iframe class="videoContainer"
          src="https://www.youtube.com/embed/CLpLHSwcqZI"
          allowfullscreen
          allowtransparency
        ></iframe>
      </div>
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Hamzah Saadah:<br>
        <a href="https://www.youtube.com/shorts/CLpLHSwcqZI" target="_blank">Source</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import 'vidstack/player/styles/base.css'
  import 'vidstack/player/styles/plyr/theme.css'
  import 'vidstack/player'
  import 'vidstack/player/layouts/plyr'
  import 'vidstack/player/ui'
  import 'media-captions/styles/captions.css'
  import 'media-captions/styles/regions.css'
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
</script>
