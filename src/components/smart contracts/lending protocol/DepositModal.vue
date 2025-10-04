<template>
  <div v-if="depositing"
    id="depositModal"
    class="thickBorder"
  >
    <div id="depositModalHeader" class="nMediumSmallMarginTop tinyMarginBottom flexCenterRow">
      <ion-button id="openCopyTokenMintAddressButton" fill="clear" @click="openTokenPopover($event)">
        <component class="noClickEvent" id="depositSVG" :is="depositSVG" style="width: 44px; max-height: 40px"></component>
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
    <ion-label class="alignSelfLeft noClickEvent">Bal: {{ userBalance.toFixed(tokenDecimalAmount) }}</ion-label>
    <InputNumber
      v-model="depositAmount"
      :inputStyle="{'text-align': 'center'}"
      :minFractionDigits="tokenDecimalAmount" :maxFractionDigits="tokenDecimalAmount"
      :max="userBalance"
      :min="0"
      :step="depositIncrementAmount"
      showButtons
      fluid
    />
    <div id="maxButtonContainer" class="alignSelfLeft">
      <button id="maxButton" style="background-color: transparent" @click="depositAmount=userBalance">
        <ion-label color="dark">Max</ion-label>
      </button>
    </div>

    <div class="smallMarginTop noClickEvent">
      <ion-text>Value: ${{ depositValue }}</ion-text>
    </div>

    <ion-text v-if="!connectedWallet.isConnected" class="nMediumMarginTop mediumMarginBottom noClickEvent" style="font-size: 11px"
    >
      Connect wallet to deposit
    </ion-text>
    <ion-button
      v-else
      id="depositButton"
      color="dark"
      @click="depositTokens()"
      class="mediumSmallMarginTop nTinyMarginBottom"
      :disabled="depositAmount == 0"
    >
      Deposit
    </ion-button>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, watch, computed } from 'vue'
  import type { Component } from 'vue'
  import { IonButton, IonText, IonPopover, IonLabel } from '@ionic/vue'
  import InputNumber from 'primevue/inputnumber'
  import { anchorPrograms, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { copyTokenMintAddress,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { lendingerUserHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import * as anchor from "@coral-xyz/anchor"

  const toast = inject('toast')

  const depositAmount = ref()
  const depositIncrementAmount = ref()
  const depositing = ref(false)
  const depositSVG = ref()
  const subMarketTokenName = ref()
  const userBalance = ref()
  var selectedTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var tokenDecimalAmount = ref()

  const tokenPopoverOpen = ref(false)
  const event = ref()
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")

  const depositValue = computed ( () =>
  {
    const price = priceObjectMap.data[selectedTokenMintAddress.toString()].usdPrice
    if(price)
      return (depositAmount.value * Number(price)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })        
    else
      return (0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })   
  })
  
  watch(connectedWallet, () =>
  {
    const balance = connectedWallet.tokenBalanceMap.get(selectedTokenMintAddress.toString())
    if(balance)
      userBalance.value = Number(balance)
    else
      userBalance.value = 0
  })

  // When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  window.onclick = function(event: any) 
  {
    if(depositing.value)
    {
      const dataPcSectionValue = event?.target?.getAttribute('data-pc-section')
      console.log(event?.target)
      if((event?.target?.id != "depositModalHeader") &&
      (event?.target?.id != "openCopyTokenMintAddressButton") &&
      (event?.target?.id != "copyTokenMintAddressButton") &&
      (event?.target?.id != "copyTokenMintAddressPopover") &&
      (event?.target?.id != "depositSVG") &&
      (event?.target?.id != "depositModal") &&
      (event?.target?.id != "openDepositModal") &&
      (event?.target?.id != "maxButtonContainer") &&
      (event?.target?.id != "maxButton") &&
      (event?.target?.id != "depositButton") &&
      (event?.target?.id != "themeButton") &&
      !event?.target?.classList.contains("tableDepositButton") &&
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
        depositing.value = false

      //Close modal when clicking into input search's behind Modal
      if((event?.target?.placeholder == "Reserves Search     ") ||
      (event?.target?.placeholder == "Owners Search     "))
        depositing.value = false
    }
  }

  function openDepositModal(tokenMintAddress: PublicKey, decimalAmount: number, tokenSVG: Component, tokenName: string)
  {
    const balance = connectedWallet.tokenBalanceMap.get(tokenMintAddress.toString())
    if(balance)
      userBalance.value = Number(balance)
    else
      userBalance.value = 0

    depositAmount.value = 0
    depositIncrementAmount.value = 1 / Math.pow(10, decimalAmount)
    selectedTokenMintAddress = tokenMintAddress
    tokenDecimalAmount.value = decimalAmount
    depositSVG.value = tokenSVG
    subMarketTokenName.value = tokenName
    depositing.value = true
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

  async function depositTokens()
  {
    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.depositTokens
      (
        selectedTokenMintAddress,
        adminAccounts.initialCEOPublicKey,
        0,
        0,
        new anchor.BN(depositAmount.value * Math.pow(10, tokenDecimalAmount.value))//convert to fixedpoint notation
      ).accounts({ mint: selectedTokenMintAddress, signer: connectedWallet.publicKey }).rpc()
      await confirmLendingTransaction(tx, toast, "deposit_tokens")
      depositing.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "deposit_tokens")
    }
  }

  defineExpose(
  {
    openDepositModal
  })
</script>

<style scoped>
  #depositModal
  {
    position: fixed; /* Makes sure the modal is fixed in place on the screen */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4000; /* Makes sure the modal is on top */
    padding: 20px;
    background-color: var(--ion-background-color)
  }
</style>