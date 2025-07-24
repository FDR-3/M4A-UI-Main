<template>
    <div class="flexCenterRow smallMarginTop smallMarginBottom">
      <div title="Init M4A Stats">
        <div v-if="areM4AProtocolStatsReady" class="finishedCircle"></div>
        <div v-else class="inProgressCircle"></div>
      </div>
      <div title="Init M4A Protocol">
        <div v-if="isM4AProtocolReady" class="finishedCircle"></div>
        <div v-else class="inProgressCircle"></div>
      </div>
      <div title="Init Submitter Account">
        <div v-if="isSubmitterAccountReady" class="finishedCircle"></div>
        <div v-else class="inProgressCircle"></div>
      </div>
      <div title="Init Patient Account">
        <div v-if="hasPatientList" class="finishedCircle"></div>
        <div v-else class="inProgressCircle"></div>
      </div>
    </div>
</template>

<script setup lang="ts">
  defineProps(
  [
    'colorHexValue',
    'areM4AProtocolStatsReady',
    'isM4AProtocolReady',
    'isSubmitterAccountReady',
    'hasPatientList'
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