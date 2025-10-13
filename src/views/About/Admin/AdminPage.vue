<template>
  <div class="mediumMarginTop">
    <ion-button v-if="!adminAccounts.isChatCEOAccountReady && connectedWallet.addressString==adminAccounts.initialCEOAddress"
      @click="initializeChatProtocolAdminAccounts()"
      :color=colorName
    >
      <ion-label color="dark">Init Chat Admin Accounts</ion-label>
    </ion-button>
    <ion-button v-if="!adminAccounts.isAlertCEOAccountReady && connectedWallet.addressString==adminAccounts.initialCEOAddress"
      @click="initializeAlertProtocol()"
      :color=colorName
    >
      <ion-label color="dark">Init Alert Admin Accounts</ion-label>
    </ion-button>
    <div v-if="!adminAccounts.isLendingCEOAccountReady && connectedWallet.addressString==adminAccounts.initialCEOAddress">
      <ion-button 
        @click="initializeLendingProtocol()"
        :color=colorName
        :disabled="taxYearInput == ''"
      >
        <ion-label color="dark">Init Lending Admin Accounts</ion-label>
      </ion-button>
      <ion-input v-model="taxYearInput" fill="outline" placeholder="Enter Tax Year" type="number" step="1" min="2025"></ion-input>
    </div>
    <ion-button v-if="!adminAccounts.isM4ACEOAccountReady && connectedWallet.addressString==adminAccounts.initialCEOAddress"
      @click="initializeM4AProtocolAdminAccounts()"
      :color=colorName
    >
      <ion-label color="dark">Init M4A Admin Accounts</ion-label>
    </ion-button>
  </div>
  <div>
    <AdminPanel v-if="connectedWallet.addressString==adminAccounts.m4aCEOAddress ||
    connectedWallet.addressString==adminAccounts.m4aTreasurerAddress ||
    connectedWallet.addressString==adminAccounts.chatCEOAddress ||
    connectedWallet.addressString==adminAccounts.chatTreasurerAddress ||
    connectedWallet.addressString==adminAccounts.lendingCEOAddressString ||
    connectedWallet.isProcessorAccountActive"/>
    <LogoArt v-else/>
  </div>
  <DeadMansBreakClock/>
</template>

<script setup lang="ts">
  import { ref, inject } from 'vue'
  import { IonButton, IonLabel, IonInput } from '@ionic/vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import AdminPanel  from './AdminPanel.vue'
  import LogoArt  from './LogoArt.vue'
  import DeadMansBreakClock from '/src/components/smart contracts/alert protocol/DeadMansBreakClock.vue'
  import { confirmM4ATransaction,
    confirmChatTransaction,
    confirmLendingTransaction,
    confirmAlertTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'

  const toast = inject('toast')
  const colorName = inject('colorName') as string
  const colorHexValue = inject('colorHexValue') as string

  var taxYearInput = ref("")

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
      await confirmChatTransaction(tx, toast, "initialize_chat_protocol_admin_accounts")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "initialize_chat_protocol_admin_accounts")
    }
  }

  async function initializeLendingProtocol()
  {
    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.initializeLendingProtocol(Number(taxYearInput.value)).rpc()
      await confirmLendingTransaction(tx, toast, "initialize_lending_protocol")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "initialize_lending_protocol")
    }
  }

  async function initializeAlertProtocol()
  {
    try
    {
      const tx = await anchorPrograms.alert.alertProgram.methods.initializeAlertProtocol().rpc()
      await confirmAlertTransaction(tx, toast, "initialize_alert_protocol")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "initialize_alert_protocol")
    }
  }
</script>

<style scoped>
  ion-input
  {
    --highlight-color: v-bind(colorHexValue)
  }
</style>