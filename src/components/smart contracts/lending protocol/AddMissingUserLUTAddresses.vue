<template>
  <div v-if="connectedWallet.missingLUTAddresses.length >= 1">
    <div>
      <InfoButton :infoMessage="missingLUTAddressMSG" :openSide="'top'"/>
      <ion-button
        color="green"
        @click="updateUserLUT()"
      >
        Update LookupTable
      </ion-button>
    </div>

    <div class="largeMarginLeft noWrapText">
      <ion-text>Missing Addresses:</ion-text>
      <div class="flexCenterRow">
        <div v-for="(description, index) in connectedWallet.missingLUTAddressDescriptions">
          <ion-text v-if="index==0" >{{ description }}</ion-text>
          <ion-text v-else>{{ ", " + description }}</ion-text>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { inject } from 'vue'
  import { IonButton } from '@ionic/vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import InfoButton from '/src/components/help/InfoButton.vue'
  import { confirmLendingTransaction, doesKeyExistInLookUpTable, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { AddressLookupTableProgram, Transaction } from "@solana/web3.js"

  const toast = inject('toast')
  const missingLUTAddressMSG = "A missing Look up Table address(es) has been detected for your account. They must have not been added when depositing into a new token for some reason. Adding the address(es) lowers the transaction sizes for the Deposit, Withdraw, Borrow, Repay, and Liquidate functions which you might have noticed printing in the f12 console. The main benefit to you specifically is that if you are using a hardward wallet, you can continue to only have to sign 1 transaction for longer before they are broken into 2, 3, or more transactions signing with your hardware wallet."

  async function updateUserLUT()
  {
    try
    {
      var transaction = new Transaction
      var addressesToExtend = []

      for(var i=0; i<connectedWallet.missingLUTAddresses.length; i++)
        if(!doesKeyExistInLookUpTable(connectedWallet.lendingUserLookUpTableAccount, connectedWallet.missingLUTAddresses[i]))
          addressesToExtend.push(connectedWallet.missingLUTAddresses[i])

      if(addressesToExtend.length > 0)
      {
        const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
        {
          authority: connectedWallet.publicKey,
          payer: connectedWallet.publicKey,
          lookupTable: connectedWallet.lendingUserLookUpTableAddress,
          addresses: addressesToExtend
        })

        transaction.add(extendLookUpTableInstruction)

        const tx = await anchorPrograms.lending.lendingProgram.provider.sendAndConfirm(transaction)

        await confirmLendingTransaction(tx, toast, "extend_look_up_table")
      }
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "extend_look_up_table")
    }
  }
</script>