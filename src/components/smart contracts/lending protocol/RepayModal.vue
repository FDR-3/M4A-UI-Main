<template>
  <div v-if="repaying"
    id="repayModal"
    class="thickBorder"
  >
    <div id="tokenButtonContainer" class="nMediumSmallMarginTop nMediumMarginBottom flexCenterRow">
      <ion-button id="openCopyTokenMintAddressButton" fill="clear" @click="openTokenPopover($event)">
        <img class="noClickEvent" v-if="selectedTokenMintAddress?.toString()==tokenAddressStrings.solTokenMintAddress"  style="width: 50px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
        <component class="noClickEvent" v-else :is="repaySVG" style="width: 44px"></component>
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

    <ion-label class="alignSelfLeft noClickEvent">Debt: {{ userDebt.toFixed(tokenDecimalAmount) }}</ion-label>
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
    />
    <div id="maxButtonContainer" class="alignSelfLeft">
      <button id="maxButton" style="background-color: transparent" @click="repayAmount=userDebt">
        <ion-label color="dark">Max</ion-label>
      </button>
    </div>

    <div class="smallMarginTop noClickEvent">
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
  var accountName = ref()
  var accountSelect = ref()
  var accountList = ref()
  var repayAmount = ref()
  var repayIncrementAmount = ref()
  var repaying = ref(false)
  var repaySVG = ref()
  var subMarketTokenName = ref()
  var userDebt = ref(0)
  var selectedTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var tokenDecimalAmount = ref()

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")

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
      
      if((event?.target?.id != "tokenButtonContainer") &&
      (event?.target?.id != "openCopyTokenMintAddressButton") &&
      (event?.target?.id != "copyTokenMintAddressButton") &&
      (event?.target?.id != "copyTokenMintAddressPopover") &&
      (event?.target?.id != "repayModal") &&
      (event?.target?.id != "openRepayModal") &&
      (event?.target?.id != "maxButtonContainer") &&
      (event?.target?.id != "maxButton") &&
      (event?.target?.id != "repayButton") &&
      (event?.target?.id != "themeButton") &&
      !event?.target?.classList.contains("tableRepayButton") &&
      !event?.target?.classList.contains("native-wrapper") &&
      !event?.target?.classList.contains("native-input") &&
      !event?.target?.classList.contains("input-outline-container") &&
      !event?.target?.classList.contains("input-wrapper") &&
      !event?.target?.classList.contains("input-bottom") &&
      !event?.target?.classList.contains("emoteButton") &&
      !event?.target?.classList.contains("emojiButton") &&
      !event?.target?.classList.contains("sc-ion-label-md-h") &&
      !event?.target?.classList.contains("button") &&
      !event?.target?.classList.contains("p-select") &&
      !event?.target?.classList.contains("p-select-list") &&
      !event?.target?.classList.contains("p-select-label") &&
      !event?.target?.classList.contains("p-select-dropdown") &&
      !event?.target?.classList.contains("p-select-empty-message") &&
      !event?.target?.classList.contains("p-select-option") &&
      !event?.target?.classList.contains("p-select-option-label") &&
      !event?.target?.classList.contains("p-select-list-container") &&
      !event?.target?.classList.contains("p-inputtext") &&
      !event?.target?.classList.contains("p-icon") &&
      !event?.target?.classList.contains("p-inputnumber") &&
      !event?.target?.classList.contains("p-inputnumber-button") &&
      !event?.target?.classList.contains("p-inputnumber-button-group") &&
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast text from closing modal
      !event?.target?.classList.contains("p-toast-close-button") && //Keep transaction toast close button from closing modal
      !dataPcSectionValue?.includes('button container') &&  //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path')) //Keep transaction toast close button from sometimes closing modal
        repaying.value = false

      //Close modal when clicking into input search's behind Modal
      if((event?.target?.placeholder == "Market Search     "))
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
        accountName.value
      ).accounts({ mint: selectedTokenMintAddress, signer: connectedWallet.publicKey }).rpc()

      await confirmLendingTransaction(tx, toast, "repay_tokens")

      repaying.value = false
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