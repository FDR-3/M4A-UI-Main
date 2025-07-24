<template>
  <h1 id="header">Treasury</h1>
  <HODLTreasuryTable/>
  <SinglePayerTreasuryTable/>
</template>

<script setup lang="ts">
  import HODLTreasuryTable from '/src/components/tables/HODLTreasuryTable.vue'
  import SinglePayerTreasuryTable from '/src/components/tables/SinglePayerTreasuryTable.vue'

  defineProps(['colorName', 'colorHexValue'])//This just keeps a warning from going off since all pages get feed these props
</script>
