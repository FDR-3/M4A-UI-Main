<template>
  <div v-if="connectedWallet.addressString==adminAccounts.chatCEOAddress" class="thickBorder smallMarginTop">
    <div class="smallMarginTop">
      <ion-text>Trigger Website Update Notice</ion-text>
    </div>
    <div class=" flexCenterRow">
      <div style="width: 90%">
        <ion-button class="smallMarginBottom" color="dark" @click="triggerNotice()" style="width:77px">Trigger Notice</ion-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { inject } from 'vue'
  import { IonButton, IonText } from '@ionic/vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { confirmAlertTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

  const toast = inject('toast')

  async function triggerNotice()
  {
    try
    {
      const tx = await anchorPrograms.alert.alertProgram.methods.triggerNewUiAvailableAlert().rpc()
      await confirmAlertTransaction(tx, toast, "trigger_new_ui_available_alert")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "trigger_new_ui_available_alert")
    }
  }
</script>