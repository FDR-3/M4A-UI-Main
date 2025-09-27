<template>
  <!--Create Sub Market Modal-->
  <div v-if="creatingSubMarket"
    id="createSubMarketModal"
    class="thickBorder"

  >
    <div id="createSubMarketHeader" class="nMediumSmallMarginTop tinyMarginBottom flexCenterRow">
      <ion-button fill="clear" @click="sourceSubMarketSVG()">
        <component id="createSubMarketSVG" :is="createSubMarketSVG" style="width: 44px; margin-right: -20px"></component>
      </ion-button>

      <ion-text class="noClickEvent">{{ subMarketTokenName }}</ion-text><br>
    </div>

    <p class="nTinyMarginTop noClickEvent">Owner: {{ trimAddress(connectedWallet.addressString) }}</p>
    <div v-if="!connectedWallet.isConnected" class="nMediumMarginTop mediumMarginBottom noClickEvent">
      <ion-text  style="font-size: 11px"
      >
        Connect wallet to create a submarket
      </ion-text>
    </div>

    <ion-input
      id="feeCollectorInput"
      v-model="feeCollectorAddress"
      fill="outline"
      @ion-input="isValidPublicKey = isValidSolanaPublicKey(feeCollectorAddress)"
      :class="{ 'invalid': !isValidPublicKey }"
    >
    </ion-input>
    <ion-text style="font-size: 11px" class="noClickEvent">Enter solana publickey that will have the authority to collect fees from your sub market</ion-text>
    <InputNumber
      v-model="feePercentage"
      class="mediumMarginTop"
      :inputStyle="{'text-align': 'center'}"
      suffix="%"
      inputId="percent"
      :minFractionDigits="2" :maxFractionDigits="2"
      :min="0" :max="100"
      :step="0.01"
      showButtons
      fluid
    />
    <ion-text style="font-size: 11px" class="noClickEvent">Enter fee percentage on interest earned for your sub market from 0% to 100%</ion-text><br>

    <ion-button
      id="createSubMarketButton"
      color="dark"
      @click="createSubMarket()"
      class="mediumMarginTop"
      :disabled="!isValidPublicKey || !connectedWallet.isConnected"
    >
      Create SubMarket
    </ion-button>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject } from 'vue'
  import { IonInput, IonButton, IonText, IonPopover } from '@ionic/vue'
  import InputNumber from 'primevue/inputnumber'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { trimAddress,
    copyTokenMintAddress,
    isValidSolanaPublicKey,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { getUserNextSubMarketIndex } from '/src/assets/contracts/Solana/LendingProtocol.vue'

  const toast = inject('toast')

  const feePercentage = ref(3)
  const isValidPublicKey = ref(false)
  const creatingSubMarket = ref(false)
  const createSubMarketSVG = ref()
  const sourceSubMarketSVG = ref()
  const subMarketTokenName = ref()
  const feeCollectorAddress = ref(connectedWallet.addressString)
  var selectedTokenMintAddress: PublicKey

  // When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  window.onclick = function(event: any) 
  {
    if(creatingSubMarket.value)
    {
      const dataPcSectionValue = event?.target?.getAttribute('data-pc-section')

      if((event?.target?.id != "createSubMarketHeader") &&
      (event?.target?.id != "createSubMarketSVG") &&
      (event?.target?.id != "createSubMarketModal") &&
      (event?.target?.id != "openCreateSubMarketModal") &&
      (event?.target?.id != "createSubMarketButton") &&
      !event?.target?.classList.contains("native-input") &&
      !event?.target?.classList.contains("native-wrapper") &&
      !event?.target?.classList.contains("p-inputtext") &&
      !event?.target?.classList.contains("p-icon") &&
      !event?.target?.classList.contains("p-inputnumber-button-group") &&
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast text from closing modal
      !event?.target?.classList.contains("p-toast-close-button") && //Keep transaction toast close button from closing modal
      !dataPcSectionValue?.includes('button container') &&  //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path')) //Keep transaction toast close button from sometimes closing modal
        creatingSubMarket.value = false
    }
  }

  async function createSubMarket()
  {
    try
    {
      const userNextSubMarketIndex = getUserNextSubMarketIndex(connectedWallet.addressString)

      const tx = await anchorPrograms.lending.lendingProgram.methods.createSubMarket
      (
        selectedTokenMintAddress,
        userNextSubMarketIndex,
        new PublicKey(feeCollectorAddress.value),
        feePercentage.value/100
      ).rpc()
      await confirmLendingTransaction(tx, toast, "create_sub_market")
      creatingSubMarket.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "create_sub_market")
    }
  }
</script>

<style scoped>
  #createSubMarketModal
  {
    position: fixed; /* Makes sure the modal is fixed in place on the screen */
    top: 70%;
    left: 50%;
    transform: translate(-50%, -70%);
    z-index: 4000; /* Makes sure the modal is on top */
    padding: 20px;
    background-color: var(--ion-background-color)
  }
</style>