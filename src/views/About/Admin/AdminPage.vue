<template>
  <div class="mediumMarginTop flexCenterRow">
    <ion-button v-if="!adminAccounts.isChatCEOAccountReady && connectedWallet.addressString==adminAccounts.initialCEOAddress"
      style="margin-top: 59px"
      @click="initializeChatProtocolAdminAccounts()"
      :color=colorName
    >
      <ion-label color="dark">Init Chat Admin Accounts</ion-label>
    </ion-button>
    <ion-button v-if="!adminAccounts.isAlertCEOAccountReady && connectedWallet.addressString==adminAccounts.initialCEOAddress"
      style="margin-top: 59px"
      @click="initializeAlertProtocol()"
      :color=colorName
    >
      <ion-label color="dark">Init Alert Admin Accounts</ion-label>
    </ion-button>
    <div v-if="!adminAccounts.isLendingCEOAccountReady && connectedWallet.addressString==adminAccounts.initialCEOAddress" class="flexCenterColumn">
      <div class="flexCenterRow" style="gap: 10px">
        <Select
        class="tinyMarginBottom"
        v-model="monthSelect" 
        :options="monthList" 
        optionLabel="monthName" 
        optionValue="monthNumber" 
        placeholder="Select Month"
        appendTo="self">
        </Select>
        <ion-input
        v-model="statementYearInput"
        style="width: 100px"
        fill="outline"
        placeholder="Enter Statement Year"
        type="number"
        step="1"
        min="2022">
        </ion-input>
      </div>
      <ion-button 
        @click="initializeLendingProtocol()"
        :color=colorName
        :disabled="statementYearInput == ''"
      >
        <ion-label color="dark">Init Lending Admin Accounts</ion-label>
      </ion-button>
      
    </div>
    <ion-button v-if="!adminAccounts.isM4ACEOAccountReady && connectedWallet.addressString==adminAccounts.initialCEOAddress"
      style="margin-top: 59px"
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
  import { ref, inject, onMounted } from 'vue'
  import { IonButton, IonLabel, IonInput } from '@ionic/vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { anchorPrograms, monthList } from '/src/assets/globalStates/AnchorPrograms.vue'
  import AdminPanel  from './AdminPanel.vue'
  import LogoArt  from './LogoArt.vue'
  import DeadMansBreakClock from '/src/components/smart contracts/alert protocol/DeadMansBreakClock.vue'
  import Select from 'primevue/select'
  import { confirmM4ATransaction,
    confirmChatTransaction,
    confirmLendingTransaction,
    confirmAlertTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'

  const toast = inject('toast')
  const colorName = inject('colorName') as string
  const colorHexValue = inject('colorHexValue') as string
  var monthSelect = ref()

  var statementYearInput = ref("")

  onMounted(() =>
  {
    const currentDate = new Date()

    statementYearInput.value = currentDate.getFullYear().toString()
    monthSelect.value = currentDate.getMonth() + 1
  })

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
      const tx = await anchorPrograms.lending.lendingProgram.methods.initializeLendingProtocol(monthSelect.value, Number(statementYearInput.value)).rpc()
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