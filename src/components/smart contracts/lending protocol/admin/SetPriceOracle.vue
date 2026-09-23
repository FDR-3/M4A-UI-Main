<template>
  <div class="thickBorder smallMarginTop widthOverFlow">
    <div class="minWidth">
      <h2 class="smallMarginTop">Price Oracle</h2>
      <div class="spaceRowEvenly mediumMarginBottom" style="width: 100%">
        <div class="smallMarginTop flexCenterRow" style="gap: 10px">

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
  import { IonButton, IonInput, IonText } from '@ionic/vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { confirmLendingTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { PublicKey } from '@solana/web3.js'

  const toast = inject('toast')
  const colorName = inject('colorName') as string

  var oracleAddress = ref("")

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