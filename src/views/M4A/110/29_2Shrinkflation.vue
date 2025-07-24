<template>
  <div>
    <h1>What is Shrinkflation?</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <div>
        <iframe class="videoContainer"
          src="https://www.youtube.com/embed/H2Z-FQtezCc"
          allowfullscreen
          allowtransparency
        ></iframe>
      </div>
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=H2Z-FQtezCc" target="_blank">It's Complicated</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
</script>

<style scoped>
  .emergencyLight
  {
    margin-top: 10px;
    width: min(20vw, 70px)
  }
</style>
