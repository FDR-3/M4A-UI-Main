<template>
  <div v-if="repaying"
    id="repayModal"
    class="thickBorder"
    ref="modalRef"
  >
    <div class="nMediumSmallMarginTop nMediumMarginBottom flexCenterRow">
      <ion-button fill="clear" @click="openTokenPopover($event)">
        <img v-if="selectedTokenMintAddress?.toString()==tokenAddressStrings.solTokenMintAddress"  style="width: 50px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
        <component v-else :is="repaySVG" style="width: 44px"></component>
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

    <Select
    class="standardFontSize mediumMarginTop nTinyMarginBottom"
    v-model="subMarketSelect" 
    :options="subMarketList" 
    optionLabel="subMarketFeeName" 
    optionValue="subMarketIndex" 
    placeholder="Select fdr-3 SubMarket"
    appendTo="self"
    @change="updateStoredSelectedSubMarketIndex(selectedTokenMintAddress.toString(), subMarketSelect.toString())">
    </Select>

    <div class="flexCenterRow">
      <Select
      id="accountSelect"
      class="standardFontSize mediumMarginTop mediumMarginBottom"
      v-model="accountSelect" 
      :options="accountList" 
      optionLabel="accountName" 
      optionValue="userAccountIndex" 
      placeholder="Select Account"
      appendTo="self"
      @change="updateStoredSelectedAccount()">
      </Select>
    </div>

    <ion-label class="alignSelfLeft">Debt: {{ userDebt.toFixed(tokenDecimalAmount) }}</ion-label>
    <InputNumber
      v-model="repayAmount"
      :inputStyle="{'text-align': 'center'}"
      :minFractionDigits="tokenDecimalAmount" :maxFractionDigits="tokenDecimalAmount"
      :max="userDebt"
      :min="0"
      :step="repayIncrementAmount"
      showButtons
      fluid
      @input="(event: { value: any }) => repayAmount = event.value"
      @update:model-value="repayMax=false"
    />
    <div class="alignSelfLeft">
      <button style="background-color: transparent" @click="repayAmount=userDebt; repayMax=true">
        <ion-label color="dark">Max</ion-label>
      </button>

      <button class="mediumSmallMarginLeft" style="background-color: transparent" @click="repayAmount=userDebt*0.5; repayMax=false">
        <ion-label color="dark">Half</ion-label>
      </button>
    </div>

    <div class="smallMarginTop">
      <ion-text>Value: ${{ repayValue }}</ion-text>
    </div>

    <ion-button
      id="repayButton"
      color="dark"
      @click="repayTokens()"
      class="mediumSmallMarginTop nTinyMarginBottom"
      :disabled="repayAmount == 0"
    >
      Repay
    </ion-button>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, watch, computed, type Component } from 'vue'
  import { IonButton, IonText, IonPopover, IonLabel } from '@ionic/vue'
  import Select from 'primevue/select'
  import InputNumber from 'primevue/inputnumber'
  import { anchorPrograms, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { copyTokenMintAddress,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenReserveHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { lendingUserAccountsHashMap, lendingUserTabAccountsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenAddressStrings, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import * as anchor from "@coral-xyz/anchor"

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue')

  var subMarketSelect = ref()
  var subMarketList = ref()
  var accountSelect = ref()
  var accountList = ref()
  var repayAmount = ref()
  var repayIncrementAmount = ref()
  var repaying = ref(false)
  var repaySVG = ref()
  var repayMax = ref(false)
  var subMarketTokenName = ref()
  var userDebt = ref(0)
  var selectedTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var tokenDecimalAmount = ref()
  var tokenProgram: PublicKey

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")
  var modalRef = ref()

  var repayValue = computed ( () =>
  {
    const price = priceObjectMap.data[selectedTokenMintAddress.toString()].usdPrice
    if(price)
      return (repayAmount.value * Number(price)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })        
    else
      return (0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })   
  })
  
  watch(connectedWallet, () =>
  {
    setDebtBalance()
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
  })

  //Json string of wallet to detect object property changes
  const walletWatch = computed(() =>
  {
    return JSON.stringify(connectedWallet)
  })

  watch(walletWatch, async (newJSONObjectString, oldJSONObjectString) =>
  {
    let newWallet = JSON.parse(newJSONObjectString)
    let oldWallet= JSON.parse(oldJSONObjectString)

    //Only want this running if the connected Wallet Address String is changing
    if(newWallet.addressString == oldWallet.addressString && newWallet.selectedLendingUserAccountIndex == oldWallet.selectedLendingUserAccountIndex )
      return

    setDebtBalance()
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
  })

  watch(lendingUserTabAccountsHashMap, () =>
  {
    setDebtBalance()
  })

  function addCloseListner()
  {
    window.addEventListener('click', handleClickOutside);
  }

  function removeCloseListner()
  {
    window.removeEventListener('click', handleClickOutside);
  }

  //When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  const handleClickOutside = function(event: any) 
  {
    if(repaying.value)
    {
      const dataPcSectionValue = event?.target?.getAttribute('data-pc-section')
      
      if(!modalRef.value.contains(event?.target) &&
      !event?.target?.classList.contains("lendingActionButton") &&
      !event?.target?.classList.contains("copyTokenMintAddressButton") &&
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast text from closing modal
      !event?.target?.classList.contains("p-toast-close-icon") && //Keep transaction toast close button from closing modal
      !event?.target?.classList.contains("p-toast-close-button") && //Keep transaction toast close button from closing modal
      !dataPcSectionValue?.includes('button container') &&  //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path')) //Keep transaction toast close button from sometimes closing modal
        repaying.value = false
    }
  }

  function openRepayModal(tokenMintAddress: string, fdr3SubMarkets: any[])
  {
    addCloseListner()

    const tokenInfo = tokenReserveHashMap.get(tokenMintAddress)
    const tokenName = tokenInfo.name
    const decimalAmount = tokenInfo.decimalAmount
    const tokenSVG = tokenInfo.svg
    tokenProgram = tokenInfo.tokenProgram
    
    subMarketList.value = fdr3SubMarkets
    subMarketSelect.value = Number(localStorage.getItem(tokenMintAddress + "selectedMainSubMarketIndex")) || 0
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex

    if(lendingUserAccountsHashMap.map)
    {
      const userAccountList = lendingUserAccountsHashMap.map.get(connectedWallet.addressString)
      if(userAccountList)
        accountList.value = userAccountList
    }

    repayAmount.value = 0
    repayIncrementAmount.value = 1 / Math.pow(10, decimalAmount)
    selectedTokenMintAddress = new PublicKey(tokenMintAddress)
    tokenDecimalAmount.value = decimalAmount
    repaySVG.value = tokenSVG
    subMarketTokenName.value = tokenName
    repaying.value = true

    setDebtBalance()
  }

  function closeRepayModal()
  {
    repaying.value = false
    removeCloseListner()
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

  function updateStoredSelectedAccount()
  {
    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
    localStorage.setItem("selectedLendingAccountIndex", accountSelect.value.toString())
  }

  function setDebtBalance()
  {
    if(!lendingUserTabAccountsHashMap.map || subMarketSelect.value == undefined)
      return

    const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(selectedTokenMintAddress.toString() +
    adminAccounts.lendingCEOAddressString +
    subMarketSelect.value.toString() +
    connectedWallet.addressString +
    accountSelect.value.toString())

    if(lendingUserTabAccount)
    {
      const decimalAmount = tokenDecimalHashMap.get(selectedTokenMintAddress.toString())

      if(lendingUserTabAccount)
        userDebt.value = Number(lendingUserTabAccount.borrowedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
      else
        userDebt.value = 0
    }
    else
      userDebt.value = 0
  }

  async function repayTokens()
  {
    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.repayTokens
      (
        selectedTokenMintAddress,
        adminAccounts.lendingCEOAddressKey,
        subMarketSelect.value,
        accountSelect.value,
        new anchor.BN(repayAmount.value * Math.pow(10, tokenDecimalAmount.value)),//convert to fixedpoint notation
        repayMax.value
      ).accounts({ mint: selectedTokenMintAddress, tokenProgram: tokenProgram }).rpc()

      await confirmLendingTransaction(tx, toast, "repay_tokens")

      repaying.value = false
      repayMax.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "repay_tokens")
    }
  }

  function updateStoredSelectedSubMarketIndex(tokenMintAddress: string, mainSubMarketIndex: string)
  {
    const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(tokenMintAddress +
    adminAccounts.lendingCEOAddressString +
    mainSubMarketIndex +
    connectedWallet.addressString +
    accountSelect.value.toString())

    if(lendingUserTabAccount)
    {
      const decimalAmount = tokenDecimalHashMap.get(tokenMintAddress)

      if(lendingUserTabAccount)
        userDebt.value = Number(lendingUserTabAccount.depositedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
      else
        userDebt.value = 0
    }
    else
      userDebt.value = 0

    repayAmount.value = 0

    localStorage.setItem(selectedTokenMintAddress.toString() + "selectedMainSubMarketIndex", mainSubMarketIndex)
  }

  defineExpose(
  {
    openRepayModal,
    closeRepayModal
  })
</script>

<style scoped>
  #repayModal
  {
    position: fixed; /* Makes sure the modal is fixed in place on the screen */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4000; /* Makes sure the modal is on top */
    padding: 20px;
    background-color: var(--ion-background-color)
  }

  #accountSelect
  {
    padding-left: 16px
  }

  .emoteButton::part(native)
  {
    margin-top: 20px !important
  }

  :deep(.p-inputnumber .p-inputnumber-input:focus)
  {
    border-color: v-bind(colorHexValue) !important;
    caret-color: v-bind(colorHexValue) !important
  }
</style>