<template>
  <div>
    <h1>Assuming no major break throughs in quantum computing, how secure is a 24 word wallet?</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <div>
        <iframe class="videoContainer"
          src="https://www.youtube.com/embed/wQPWdzFfPXY"
          allowfullscreen
          allowtransparency
        ></iframe>
      </div>
      <NextPageButton/>
    </div>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=wQPWdzFfPXY" target="_blank">Southern Bitcoiner</a><br>
      </p>
      <p align="left">Developer Note<br>
        I think the only real issue with using seed words that aren't randomly generated comes when you're generating them on
        a malicous software wallet (or something like that) and bad actors are just waiting for you to fund accounts on it so they can
        steal them. I don't see someone guessing or brute forcing the neccessary 10 phrases, in just the right order, just because I didn't pick
        them truly at random (In my opinion). It's just a really big ass number at the end of the day ¯\_(ツ)_/¯
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
</script>