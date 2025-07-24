<template>
  <div>
    <h1>M4A Protocol<br>Scientific Poll</h1>
    <div>
      <PrevPageButton/>
      <Poll
      :pollIndex="0"
      colorName="green"
      colorHexValue="#39bd39"/>
      <NextPageButton/>
    </div>
  </div>
</template>  

<script setup lang="ts">
  import Poll from '/src/components/polls/Poll.vue'
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
</script>