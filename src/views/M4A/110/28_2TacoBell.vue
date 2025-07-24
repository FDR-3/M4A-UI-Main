<template>
  <div>
    <h1>A CEO(DaVita) Wanted to Run Healthcare Like Taco Bell</h1>
    <h2 class="multiLineHeaderLineHeight">Here’s How His Patients Are Doing</h2>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <div>
        <iframe class="videoContainer"
          src="https://www.youtube.com/embed/08eVXNsta4M"
          allowfullscreen
          allowtransparency
        ></iframe>
      </div>
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=08eVXNsta4M" target="_blank">More Perfect Union</a><br>
      </p>
    </div>4f4f
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
</script>