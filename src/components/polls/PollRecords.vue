<template>
  <PollRecordsTable
  v-if="!toggleUniquePollTable"
  :uniqueVoterHashMap="uniqueVoterHashMap"
  :uniqueVoterCount="uniqueVoterCount"
  :tableData="pollRecordsTableData"
  :isLoading="isPollRecordsTableLoading"
  @toggleUniquePollTable="toggleUniquePollTable = true"/>
  <UniquePollRecordsTable
  v-else
  :uniqueVoterCount="uniqueVoterCount"
  :tableData="uniquePollRecordsTableData"
  :isLoading="isUniquePollRecordsTableLoading"
  @toggleUniquePollTable="toggleUniquePollTable = false"/>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import PollRecordsTable from '/src/components/tables/chat/PollRecordsTable.vue' 
  import UniquePollRecordsTable from '/src/components/tables/chat/UniquePollRecordsTable.vue'

  defineProps(['uniqueVoterHashMap', 'uniqueVoterCount', 'pollRecordsTableData', 'uniquePollRecordsTableData', 'isPollRecordsTableLoading', 'isUniquePollRecordsTableLoading'])

  var toggleUniquePollTable = ref(false)

  onMounted(() =>
  {
    toggleUniquePollTable.value = localStorage.getItem("toggleUniquePollTable") == "true"
  })

</script>

<script scoped>
</script>