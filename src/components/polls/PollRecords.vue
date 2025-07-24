<template>
  <PollRecordsTable
  v-if="!toggleUniquePollTable"
  :tableData="pollRecordsTableData"
  :isLoading="isPollRecordsTableLoading"
  @toggleUniquePollTable="toggleUniquePollTable = true"/>
  <UniquePollRecordsTable
  v-else
  :tableData="uniquePollRecordsTableData"
  :isLoading="isUniquePollRecordsTableLoading"
  @toggleUniquePollTable="toggleUniquePollTable = false"/>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import PollRecordsTable from '/src/components/tables/chat/PollRecordsTable.vue' 
  import UniquePollRecordsTable from '/src/components/tables/chat/UniquePollRecordsTable.vue'

  defineProps(['pollRecordsTableData', 'uniquePollRecordsTableData', 'isPollRecordsTableLoading', 'isUniquePollRecordsTableLoading'])

  var toggleUniquePollTable = ref(false)

  onMounted(() =>
  {
    toggleUniquePollTable.value = localStorage.getItem("toggleUniquePollTable") == "true"
  })

</script>

<script scoped>
</script>