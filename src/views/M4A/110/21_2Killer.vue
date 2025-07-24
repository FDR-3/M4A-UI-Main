<template>
  <div>
    <h1>The Man With The Highest Kill Count,
      Responsible For Generating The Most Serial Killers,
      And Responsible For Making You More Dumberererer</h1>
      <h2 class="longMultiLineHeaderLineHeight">(Also the source video title is a lie)</h2>
      <h2 class="longMultiLineHeaderLineHeight">(No accidents, just greed)</h2>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <div>
        <iframe class="videoContainer"
          src="https://www.youtube.com/embed/IV3dnLzthDA"
          allowfullscreen
          allowtransparency
        ></iframe>
      </div>
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=IV3dnLzthDA" target="_blank">Veritasium</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
</script>