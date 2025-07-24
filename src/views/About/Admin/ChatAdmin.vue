<template>
  <div v-if="!anchorPrograms.areChatQOLAccountsReady" class="mediumMarginTop">
    <ion-button color="dark" @click="initializeQualityOfLifeAccounts()">Init Quality Of Life Accounts</ion-button>
  </div>

  <AdminPollTable :tableData="pollTableData" :isLoading="isPollTableDataLoading"/>
</template>

<script setup lang="ts">
  import { inject } from 'vue'
  import { IonButton } from '@ionic/vue'
  import AdminPollTable from '/src/components/tables/chat/admin/AdminPollTable.vue'
  import { confirmM4ATransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

  defineProps(['pollTableData', 'isPollTableDataLoading'])

  const toast = inject('toast')

  async function initializeQualityOfLifeAccounts()
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.initializeQualityOfLifeAccounts().rpc()
      await confirmM4ATransaction(tx, toast, "initialize_protocol_stats")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "initialize_protocol_stats")
    }
  }
</script>