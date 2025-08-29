<template>
  <div>
    <h1>Song: This is a call</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <div>
        <iframe class="videoContainer"
          src="https://www.youtube.com/embed/JGH611vjd4s"
          allowfullscreen
          allowtransparency
          allow="autoplay"
        ></iframe>
      </div>
      <NextPageButton :lastPage="true"/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Artist: Thousand Foot Krutch<br>
        <a href="https://www.youtube.com/watch?v=JGH611vjd4s" target="_blank">Source</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
</script>