<template>
  <div class="thickBorder smallMarginTop widthOverFlow">
    <div class="minWidth">
      <h2 class="smallMarginTop">Price Oracle</h2>
      <div class="spaceRowEvenly mediumMarginBottom" style="width: 100%">
        <div class="smallMarginTop flexCenterRow" style="gap: 10px">
          
          <div class="flexCenterColumn">
            <ion-text>Close Temp Price Account</ion-text>
            <ion-input
              v-model="userAddress"
              fill="outline"
              placeholder="Enter User Address">
            </ion-input>
            <ion-button :color="colorName" @click="closePriceAccount()">Close Price Account</ion-button>
          </div>

          <div class="flexCenterColumn">
            <ion-text>Set New Price Oracle</ion-text>
            <ion-input
              v-model="oracleAddress"
              fill="outline"
              placeholder="Enter New Price Oracle Address">
            </ion-input>
            <ion-button :color="colorName" @click="setNewPriceOracle()">Set New Price Oracle</ion-button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject } from 'vue'
  import { IonButton, IonInput } from '@ionic/vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { LegacyTokenProgramID } from '/src/assets/constants/Addresses.ts'
  import { copyAddress, copyTokenMintAddressText, confirmLendingTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { Token, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'
  import { PublicKey, Transaction, Keypair, SystemProgram } from '@solana/web3.js'

  const toast = inject('toast')
  const colorName = inject('colorName') as string

  var userAddress = ref("")
  var oracleAddress = ref("")

  async function closePriceAccount()
  {
    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.closeTempOraclePriceData()
      .accounts({ lendingUserAddress: new PublicKey(userAddress.value) })
      .remainingAccounts([adminAccounts.priceOracleRemainingAccount])
      .rpc()
    
      await confirmLendingTransaction(tx, toast, "close_temp_oracle_price_data")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "close_temp_oracle_price_data")
    }
  }

  async function setNewPriceOracle()
  {
    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.setOraclePriceValidator()
      .accounts({ newPriceValidatorAddress: new PublicKey(oracleAddress.value) })
      .rpc()
    
      await confirmLendingTransaction(tx, toast, "set_oracle_price_validator")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "set_oracle_price_validator")
    }
  }
</script>

<style scoped>
  ion-input
  {
    --highlight-color: var(--ion-color-gray);
    min-width: 222px
  }

  .rowContainer
  {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
  }

  .minWidth
  {
    min-width: 1200px
  }
</style>