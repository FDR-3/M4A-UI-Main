<template>
  <div v-if="creatingSubMarket"
    id="createSubMarketModal"
    class="thickBorder"
    ref="modalRef"
  >
    <div class="nMediumSmallMarginTop tinyMarginBottom flexCenterRow">
      <ion-button fill="clear" @click="openTokenPopover($event)">
        <img v-if="selectedTokenMintAddressString==tokenAddressStrings.solTokenMintAddress"  style="width: 50px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
        <component v-else :is="createSubMarketSVG" style="width: 44px"></component>
        <ion-text color="dark">{{ subMarketTokenName }}</ion-text><br>
      </ion-button>
      <ion-popover
      :is-open="tokenPopoverOpen" 
      :event="event" 
      @didDismiss="tokenPopoverOpen=false"
      side="top" 
      alignment="center"
      >
        <ion-button class="copyTokenMintAddressButton" color="green" @click="passByRefWrapperCopyAddress()" @mouseleave="closeTokenPopover($event)">
          <ion-label class="noClickEvent" color="dark">{{ copyTokenMintAddressButtonText }}</ion-label>
        </ion-button>
      </ion-popover>
    </div>

    <p class="nTinyMarginTop">Owner: {{ trimAddress(connectedWallet.addressString) }}</p>
    <div v-if="!connectedWallet.isConnected" class="nMediumMarginTop mediumMarginBottom">
      <ion-text  style="font-size: 11px"
      >
        Connect wallet to create a submarket
      </ion-text>
    </div>

    <ion-input
      class="feeCollectorInput"
      v-model="feeCollectorAddress"
      fill="outline"
      @ion-input="isValidPublicKey = isValidSolanaPublicKey(feeCollectorAddress)"
      :class="{ 'invalid': !isValidPublicKey }"
    >
    </ion-input>
    <ion-text style="font-size: 11px">Enter solana publickey that will have the authority to collect fees from your sub market</ion-text>
    <InputNumber
      v-model="feePercentage"
      class="feeCollectorInput mediumMarginTop"
      :inputStyle="{'text-align': 'center'}"
      suffix="%"
      inputId="percent"
      :minFractionDigits="2" :maxFractionDigits="2"
      :min="0" :max="100"
      :step="0.01"
      showButtons
      fluid
    />
    <ion-text style="font-size: 11px">Enter fee percentage on interest earned for your sub market from 0% to 100%</ion-text><br>

    <ion-button
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
  import { ref, inject, onMounted, onUnmounted } from 'vue'
  import type { Component } from 'vue'
  import { IonInput, IonButton, IonText, IonPopover, IonLabel } from '@ionic/vue'
  import InputNumber from 'primevue/inputnumber'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { trimAddress,
    copyAddress,
    copyTokenMintAddressText,
    isValidSolanaPublicKey,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenAddressStrings } from '/src/assets/constants/Addresses.ts'
  import { getUserNextSubMarketIndex } from '/src/assets/contracts/Solana/LendingProtocol.vue'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue') as string

  var feePercentage = ref(3)
  var isValidPublicKey = ref(false)
  var creatingSubMarket = ref(false)
  var createSubMarketSVG = ref()
  var subMarketTokenName = ref()
  var feeCollectorAddress = ref()
  var selectedTokenMintAddress: PublicKey
  var selectedTokenMintAddressString: string

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)
  var modalRef = ref()

  onMounted(() =>
  {
    window.addEventListener('click', handleClickOutside);
  })

  onUnmounted(() =>
  {
    window.removeEventListener('click', handleClickOutside);
  })

  // When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  const handleClickOutside = (event: any) =>
  {
    if(creatingSubMarket.value)
    {
      const dataPcSectionValue = event?.target?.getAttribute('data-pc-section')

      if(!modalRef.value.contains(event?.target) &&
      (event?.target?.id != "openCreateSubMarketModalButton") &&
      !event?.target?.classList.contains("copyTokenMintAddressButton") &&
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast text from closing modal
      !event?.target?.classList.contains("p-toast-close-icon") && //Keep transaction toast close button from closing modal
      !event?.target?.classList.contains("p-toast-close-button") && //Keep transaction toast close button from closing modal
      !dataPcSectionValue?.includes('button container') &&  //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path')) //Keep transaction toast close button from sometimes closing modal
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
    copyAddress(copyTokenMintAddressButtonText, selectedTokenMintAddress)
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

  .feeCollectorInput
  {
    --highlight-color: v-bind(colorHexValue) !important
  }

  :deep(.p-inputnumber .p-inputnumber-input:focus)
  {
    border-color: v-bind(colorHexValue) !important
  }
</style>