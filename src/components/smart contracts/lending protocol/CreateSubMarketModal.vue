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
        <ion-button class="copyTokenMintAddressButton" color="green" @click="passByRefWrapperCopyTokenMintAddress()" @mouseleave="closeTokenPopover($event)">
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

    <div class="mediumMarginTop">
      <InfoButton :infoMessage="subMarketInfoMSG"/>
      <ion-button
        color="dark"
        @click="createSubMarket()"
        :disabled="!isValidPublicKey || !connectedWallet.isConnected"
      >
        Create SubMarket
      </ion-button>
    </div>
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
    copyAddress,
    copyTokenMintAddressText,
    isValidSolanaPublicKey,
    confirmLendingTransaction,
    doesKeyExistInLookUpTable,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenAddressStrings } from '/src/assets/constants/Addresses.ts'
  import { getUserNextSubMarketIndex,
    getSubMarketPDA,
    getSubMarketOwnerLookUpTablePDA,
    sendVersionedLendingProtocolTransaction } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { tokenReservesHashMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketLookUpTableByOwnerHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { AddressLookupTableProgram } from '@solana/web3.js'
  import InfoButton from '/src/components/help/InfoButton.vue'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue') as string

  var feePercentage = ref(3)
  var isValidPublicKey = ref(false)
  var creatingSubMarket = ref(false)
  var createSubMarketSVG = ref()
  var subMarketTokenName = ref()
  var feeCollectorAddress = ref()
  var selectedTokenId: number
  var selectedTokenMintAddress: PublicKey
  var selectedTokenMintAddressString: string

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)
  var modalRef = ref()
  const subMarketInfoMSG = "Developers can create\nSubMarkets to generate\ninterest for their\nusers while collecting fees\nto pay what ever bill they\nchoose. Developers will\nneed to build their own UIs\nfor their user deposits,\netc."

  // When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  const handleClickOutside = (event: any) =>
  {
    if(creatingSubMarket.value && modalRef.value)
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
      {
        creatingSubMarket.value = false
        window.removeEventListener('click', handleClickOutside)
      }
    }
  }

  function openCreateSubMarketModal(tokenId: number, tokenMintAddress: PublicKey, tokenSVG: Component, tokenName: string, )
  {
    window.addEventListener('click', handleClickOutside)

    feeCollectorAddress.value = connectedWallet.addressString
    isValidPublicKey.value = isValidSolanaPublicKey(feeCollectorAddress.value)
    selectedTokenId = tokenId
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

  function passByRefWrapperCopyTokenMintAddress()
  {
    copyAddress(copyTokenMintAddressButtonText, selectedTokenMintAddress)
  }

  async function createSubMarket()
  {
    try
    {
      var instructionsToSend = []
      var lookUpTableAccounts = []

      var createLookUpTableInstruction = undefined
      var lookUpTableAddress = undefined
      var creatingNewLookUpTable = false

      //Check if Sub Market Owner Look Up Table Account has already been initialized
      const subMarketOwnerLookUpTableAccount = subMarketLookUpTableByOwnerHashMap.map.get(connectedWallet.addressString)
      if(!subMarketOwnerLookUpTableAccount)
      {
        const slot = await anchorPrograms.lending.lendingProgram.provider.connection.getSlot(); //Need a semi colon before a tuple reassignment.

        [createLookUpTableInstruction, lookUpTableAddress] = 
        AddressLookupTableProgram.createLookupTable({
          authority: connectedWallet.publicKey,
          payer: connectedWallet.publicKey,
          recentSlot: slot
        })

        instructionsToSend.push(createLookUpTableInstruction)
        creatingNewLookUpTable = true

        const subMarketOwnerLookUpTablePDA = getSubMarketOwnerLookUpTablePDA(connectedWallet.publicKey)
        const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
        {
          authority: connectedWallet.publicKey,
          payer: connectedWallet.publicKey,
          lookupTable: lookUpTableAddress,
          addresses: [subMarketOwnerLookUpTablePDA]
        })

        instructionsToSend.push(extendLookUpTableInstruction)
      }
      else
        lookUpTableAddress = subMarketOwnerLookUpTableAccount.key

      const userNextSubMarketIndex = getUserNextSubMarketIndex(selectedTokenId, connectedWallet.addressString)
      const tokenReserve = tokenReservesHashMap.map.get(selectedTokenId)
      const subMarketPDA = getSubMarketPDA(tokenReserve.tokenId, connectedWallet.publicKey, userNextSubMarketIndex)

      if(!doesKeyExistInLookUpTable(subMarketOwnerLookUpTableAccount, subMarketPDA))
      {
        const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
        {
          authority: connectedWallet.publicKey,
          payer: connectedWallet.publicKey,
          lookupTable: lookUpTableAddress,
          addresses: [subMarketPDA]
        })

        instructionsToSend.push(extendLookUpTableInstruction)
      }

      const createSubMarketInstruction = await anchorPrograms.lending.lendingProgram.methods.createSubMarket
      (
        userNextSubMarketIndex,
        feePercentage.value * 100,//convert to fixedpoint notation
        creatingNewLookUpTable ? lookUpTableAddress : null//It's cheaper to pass in null when the value isn't needed
      )
      .accounts({ tokenMintAddress: selectedTokenMintAddress, feeCollectorAddress: new PublicKey(feeCollectorAddress.value) })
      .instruction()

      instructionsToSend.push(createSubMarketInstruction)

      //Get Lending Protocol Look Up Table Account
      lookUpTableAccounts.push(anchorPrograms.lendingProtocolLookUpTableAccount)

      //Not worth getting Submarket look up table for just subMarketOwnerLookUpTableAccount, you'll never have the submarket as well in time cause you're creating it here.

      const tx = await sendVersionedLendingProtocolTransaction(instructionsToSend, lookUpTableAccounts)

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