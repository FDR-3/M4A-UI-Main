<template>
  <div class="mediumMarginTop">
    <ion-button v-if="!adminAccounts.isM4ACEOAccountReady && connectedWallet.addressString==adminAccounts.initialCEOAddress"
      @click="initializeM4AProtocolAdminAccounts()"
      :color=colorName
    >
      <ion-label color="dark">Init M4A Admin Accounts</ion-label>
    </ion-button>
    <ion-button v-if="!adminAccounts.isChatCEOAccountReady && connectedWallet.addressString==adminAccounts.initialCEOAddress"
      @click="initializeChatProtocolAdminAccounts()"
      :color=colorName
    >
      <ion-label color="dark">Init Chat Admin Accounts</ion-label>
    </ion-button>
  </div>
  <div>
    <AdminPanel v-if="connectedWallet.addressString==adminAccounts.m4aCEOAddress ||
    connectedWallet.addressString==adminAccounts.m4aTreasurerAddress ||
    connectedWallet.addressString==adminAccounts.chatCEOAddress ||
    connectedWallet.addressString==adminAccounts.chatTreasurerAddress ||
    connectedWallet.isProcessorAccountActive"/>
    <LogoArt v-else/>
  </div>
  <DeadMansBreakClock/>
</template>

<script setup lang="ts">
  import { inject } from 'vue'
  import { IonButton, IonLabel } from '@ionic/vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import AdminPanel  from './AdminPanel.vue'
  import LogoArt  from './LogoArt.vue'
  import DeadMansBreakClock from './DeadMansBreakClock.vue'
  import { confirmM4ATransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'

  const toast = inject('toast')
  const colorName = inject('colorName') as string

  async function initializeM4AProtocolAdminAccounts()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.initializeM4AProtocolAdminAccounts().rpc()
      await confirmM4ATransaction(tx, toast, "initialize_m4a_protocol_admin_accounts")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "initialize_m4a_protocol_admin_accounts")
    }
  }

  async function initializeChatProtocolAdminAccounts()
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.initializeChatProtocolAdminAccounts().rpc()
      await confirmM4ATransaction(tx, toast, "initialize_chat_protocol_admin_accounts")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "initialize_chat_protocol_admin_accounts")
    }
  }
</script>

<style scoped>

</style>