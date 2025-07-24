<template>
  <div>
    <h1>The Obvious</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <div>
        <iframe class="videoContainer"
          src="https://www.youtube.com/embed/0AQUYaXnHZk"
          allowfullscreen
          allowtransparency
        ></iframe>
      </div>
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Breezy Politic:<br>
        <a href="https://www.youtube.com/shorts/0AQUYaXnHZk" target="_blank">Source</a><br>
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
