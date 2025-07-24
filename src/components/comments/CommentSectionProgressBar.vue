<template>
    <div class="flexCenterRow largeMarginTop smallMarginBottom">
      <div title="Init Chat Protocol">
        <div v-if="isChatProtocolReady" class="finishedCircle"></div>
        <div v-else class="inProgressCircle"></div>
      </div>
      <div title="Init Menu Chat">
        <div v-if="isChatReady" class="finishedCircle"></div>
        <div v-else class="inProgressCircle"></div>
      </div>
      <div title="Init Chat Account">
        <div v-if="isChatAccountReady" class="finishedCircle"></div>
        <div v-else class="inProgressCircle"></div>
      </div>
      <div title="Init Comment Section">
        <div v-if="isCommentSectionReady" class="finishedCircle"></div>
        <div v-else class="inProgressCircle"></div>
      </div>
    </div>
</template>

<script setup lang="ts">
  defineProps(
  [
    'colorHexValue',
    'isChatProtocolReady',
    'isChatReady',
    'isChatAccountReady',
    'isCommentSectionReady'
  ])
</script>

<style scoped>
  .flexCenterRow 
  {
    gap: 10px
  }

  .inProgressCircle 
  {
    width: 20px;
    height: 20px;
    border: thin solid v-bind(colorHexValue);
  }

  .finishedCircle 
  {
    width: 20px;
    height: 20px;
    background-color: v-bind(colorHexValue);
  }
</style>