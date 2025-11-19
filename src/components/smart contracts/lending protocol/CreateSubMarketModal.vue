<template>
  <div v-if="creatingSubMarket"
    id="createSubMarketModal"
    class="thickBorder"
  >
    <div id="createSubMarketHeader" class="nMediumSmallMarginTop tinyMarginBottom flexCenterRow">
      <ion-button id="openCopyTokenMintAddressButton" fill="clear" @click="openTokenPopover($event)">
        <img class="noClickEvent" v-if="selectedTokenMintAddressString==tokenAddressStringsMainNet.solTokenMintAddress"  style="width: 50px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
        <component class="noClickEvent" v-else :is="createSubMarketSVG" style="width: 44px"></component>
        <ion-text class="noClickEvent" color="dark">{{ subMarketTokenName }}</ion-text><br>
      </ion-button>
      <ion-popover
      id="copyTokenMintAddressPopover"
      :is-open="tokenPopoverOpen" 
      :event="event" 
      @didDismiss="tokenPopoverOpen=false"
      side="top" 
      alignment="center"
      >
        <ion-button id="copyTokenMintAddressButton" class="copyAddressButton" color="green" @click="passByRefWrapperCopyAddress()" @mouseleave="closeTokenPopover($event)">
          <ion-label class="noClickEvent" color="dark">{{ copyTokenMintAddressButtonText }}</ion-label>
        </ion-button>
      </ion-popover>
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
      id="feeCollectorInput"
      v-model="feePercentage"
      ref="feePercentageRef"
      class="mediumMarginTop"
      :inputStyle="{'text-align': 'center'}"
      suffix="%"
      inputId="percent"
      :minFractionDigits="2" :maxFractionDigits="2"
      :min="0" :max="100"
      :step="0.01"
      showButtons
      fluid
      @keydown.enter="checkIfCursorBehindPercentSign()"
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
  import type { Component } from 'vue'
  import { IonInput, IonButton, IonText, IonPopover, IonLabel } from '@ionic/vue'
  import InputNumber from 'primevue/inputnumber'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { trimAddress,
    copyTokenMintAddress,
    isValidSolanaPublicKey,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenAddressStringsMainNet } from '/src/assets/constants/Addresses.ts'
  import { getUserNextSubMarketIndex } from '/src/assets/contracts/Solana/LendingProtocol.vue'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue') as string

  var feePercentage = ref(3)
  var feePercentageRef = ref()
  var isValidPublicKey = ref(false)
  var creatingSubMarket = ref(false)
  var createSubMarketSVG = ref()
  var subMarketTokenName = ref()
  var feeCollectorAddress = ref()
  var selectedTokenMintAddress: PublicKey
  var selectedTokenMintAddressString: string

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")

  // When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  window.onclick = function(event: any) 
  {
    if(creatingSubMarket.value)
    {
      const dataPcSectionValue = event?.target?.getAttribute('data-pc-section')

      if((event?.target?.id != "createSubMarketHeader") &&
      (event?.target?.id != "openCopyTokenMintAddressButton") &&
      (event?.target?.id != "copyTokenMintAddressButton") &&
      (event?.target?.id != "copyTokenMintAddressPopover") &&
      (event?.target?.id != "createSubMarketModal") &&
      (event?.target?.id != "openCreateSubMarketModal") &&
      (event?.target?.id != "createSubMarketButton") &&
      (event?.target?.id != "themeButton") &&
      !event?.target?.classList.contains("native-input") &&
      !event?.target?.classList.contains("native-wrapper") &&
      !event?.target?.classList.contains("p-inputtext") &&
      !event?.target?.classList.contains("p-icon") &&
      !event?.target?.classList.contains("p-inputnumber") &&
      !event?.target?.classList.contains("p-inputnumber-button") &&
      !event?.target?.classList.contains("p-inputnumber-button-group") &&
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast text from closing modal
      !event?.target?.classList.contains("p-toast-close-button") && //Keep transaction toast close button from closing modal
      !dataPcSectionValue?.includes('button container') &&  //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path')) //Keep transaction toast close button from sometimes closing modal
        creatingSubMarket.value = false

      //Close modal when clicking into input search's behind Modal
      if((event?.target?.placeholder == "Reserves Search     ") ||
      (event?.target?.placeholder == "Owners Search     "))
        creatingSubMarket.value = false
    }
  }

  function openCreateSubMarketModal(tokenMintAddress: PublicKey, tokenSVG: Component, tokenName: string, )
  {
    feeCollectorAddress.value = connectedWallet.addressString
    isValidPublicKey.value = isValidSolanaPublicKey(feeCollectorAddress.value)
    selectedTokenMintAddress = tokenMintAddress
    selectedTokenMintAddressString = tokenMintAddress.toString()
    createSubMarketSVG.value = tokenSVG
    subMarketTokenName.value = tokenName
    creatingSubMarket.value = true
  }

  function openTokenPopover(e: Event) 
  {
    event.value = e

    tokenPopoverOpen.value = true
  }

  function closeTokenPopover(e: Event) 
  {
    event.value = e
    tokenPopoverOpen.value = false
  }

  function passByRefWrapperCopyAddress()
  {
    copyTokenMintAddress(copyTokenMintAddressButtonText, selectedTokenMintAddress)
  }

  function checkIfCursorBehindPercentSign()
  {
    var inputElement = feePercentageRef.value?.$el.querySelector(".p-inputtext")

    if(inputElement)
    {
      if(inputElement.value.length == inputElement.selectionEnd)
      {
        const beforePercentSign = inputElement.selectionEnd - 1
        inputElement.setSelectionRange(beforePercentSign, beforePercentSign)
      }
    }
  }

  async function createSubMarket()
  {
    try
    {
      const userNextSubMarketIndex = getUserNextSubMarketIndex(selectedTokenMintAddress.toString(), connectedWallet.addressString)

      const tx = await anchorPrograms.lending.lendingProgram.methods.createSubMarket
      (
        selectedTokenMintAddress,
        userNextSubMarketIndex,
        new PublicKey(feeCollectorAddress.value),
        feePercentage.value * 100//convert to fixedpoint notation
      ).rpc()
      await confirmLendingTransaction(tx, toast, "create_sub_market")
      creatingSubMarket.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "create_sub_market")
    }
  }

  defineExpose(
  {
    openCreateSubMarketModal
  })
</script>

<style scoped>
  #createSubMarketModal
  {
    position: fixed; /* Makes sure the modal is fixed in place on the screen */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4000; /* Makes sure the modal is on top */
    padding: 20px;
    background-color: var(--ion-background-color)
  }

  #feeCollectorInput
  {
    --highlight-color: v-bind(colorHexValue) !important
  }

  :deep(.p-inputnumber .p-inputnumber-input:focus)
  {
    border-color: v-bind(colorHexValue) !important
  }
</style>