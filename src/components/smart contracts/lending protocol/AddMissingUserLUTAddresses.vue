<template>
  <div v-if="connectedWallet.missingLUTAddresses.length >= 1">
    <InfoButton :infoMessage="missingLUTAddressMSG" :openSide="'top'"/>

    <ion-button
      color="green"
      @click=""
      :disabled="false"
    >
      Update LookupTable
    </ion-button>
  </div>
</template>

<script setup lang="ts">
  import { IonButton } from '@ionic/vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import InfoButton from '/src/components/help/InfoButton.vue'

  const missingLUTAddressMSG = "A missing Look up Table address(es) has been detected for your account. They must have not been added when depositing into a new token for some reason. Adding the address(es) lowers the transaction sizes for the Deposit, Withdraw, Borrow, Repay, and Liquidate functions which you might have noticed printing in the f12 console. The main benefit to you specifically is that if you are using a hardward wallet, you can continue to only have to sign 1 transaction for longer before they are broken into 2, 3, or more transactions signing with your hardware wallet."
</script>

<style scope>

</style>