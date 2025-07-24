<template>
  <div>
    <h1>The $1 Trillion Dollar Private Health Insurance Scam</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <div>
        <iframe class="videoContainer"
          src="https://www.youtube.com/embed/cQR67WRcVUg"
          allowfullscreen
          allowtransparency
        ></iframe>
      </div>
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=cQR67WRcVUg" target="_blank">More Perfect Union</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
</script>