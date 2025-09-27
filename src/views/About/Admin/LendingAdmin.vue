<template>
  <div v-if="connectedWallet.addressString==adminAccounts.chatCEOAddress" class="thickBorder smallMarginTop">
    <div class="smallMarginTop">
      <ion-text>Add Lending Token Reserve Account</ion-text>
    </div>
    <div class=" flexCenterRow">
      <div style="width: 90%">
        <ion-input v-model="tokenMintAddressInput" fill="outline" placeholder="Enter The Mint Address For The Fee Token"></ion-input>
        <ion-input v-model="tokenDecmialCountInput" fill="outline" type="number" min="0" placeholder="Enter The Token Decimal Count When Adding" class="tinyMarginTop"></ion-input>
        <ion-button class="smallMarginBottom" color="dark" @click="addTokenReserve()" style="width:77px">Add</ion-button>
      </div>
    </div>
  </div>
  <ReservesTable/>
</template>

<script setup lang="ts">
  import { ref, inject } from 'vue'
  import { IonButton, IonInput, IonText } from '@ionic/vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { confirmLendingTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import ReservesTable from '/src/components/tables/lending/TokenReservesTable.vue'
  import {  PublicKey } from "@solana/web3.js"

  const toast = inject('toast')

  var tokenMintAddressInput = ref()
  var tokenDecmialCountInput = ref()

  async function addTokenReserve()
  {
    try
    {
      const mintAddressKey = new PublicKey(tokenMintAddressInput.value)
      const tx = await anchorPrograms.lending.lendingProgram.methods.addTokenReserve(mintAddressKey, tokenDecmialCountInput.value)
      .accounts({mint: mintAddressKey})
      .rpc()

      tokenMintAddressInput.value = ""
      tokenDecmialCountInput.value = ""
      await confirmLendingTransaction(tx, toast, "add_token_reserve")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "add_token_reserve")
    }
  }
</script>