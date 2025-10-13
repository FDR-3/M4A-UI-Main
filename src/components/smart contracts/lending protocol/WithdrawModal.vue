<template>
  <div v-if="withdrawing"
    id="withdrawModal"
    class="thickBorder"
  >
    <div id="tokenButtonContainer" class="nMediumSmallMarginTop nMediumMarginBottom flexCenterRow">
      <ion-button id="openCopyTokenMintAddressButton" fill="clear" @click="openTokenPopover($event)">
        <component class="noClickEvent" id="withdrawSVG" :is="withdrawSVG" style="width: 44px; max-height: 40px"></component>
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

    <ion-label class="alignSelfLeft noClickEvent">Bal: {{ userBalance.toFixed(tokenDecimalAmount) }}</ion-label>
    <InputNumber
      v-model="withdrawAmount"
      :inputStyle="{'text-align': 'center'}"
      :minFractionDigits="tokenDecimalAmount" :maxFractionDigits="tokenDecimalAmount"
      :max="userBalance"
      :min="0"
      :step="withdrawIncrementAmount"
      showButtons
      fluid
      @input="(event: { value: any }) => withdrawAmount = event.value"
    />
    <div id="maxButtonContainer" class="alignSelfLeft">
      <button id="maxButton" style="background-color: transparent" @click="withdrawAmount=userBalance">
        <ion-label color="dark">Max</ion-label>
      </button>
    </div>

    <div class="smallMarginTop noClickEvent">
      <ion-text>Value: ${{ withdrawValue }}</ion-text>
    </div>

    <ion-button
      id="withdrawButton"
      color="dark"
      @click="withdrawTokens()"
      class="mediumSmallMarginTop nTinyMarginBottom"
      :disabled="withdrawAmount == 0 || overCommentByteSizeLimit"
    >
      Withdraw
    </ion-button>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, watch, computed, type Component } from 'vue'
  import { IonButton, IonText, IonPopover, IonLabel } from '@ionic/vue'
  import Select from 'primevue/select'
  import InputNumber from 'primevue/inputnumber'
  import { anchorPrograms,
    SYSTEM_PROGRAM_ADDRESS_STRING,
    DEFAULT_3_PERCENT_FEE_SUBMARKET_INDEX } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { copyTokenMintAddress,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { lendingerUserAccountsHashMap, lendingerUserDepositBalanceHashMap, lendingerUserTabsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import * as anchor from "@coral-xyz/anchor"

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue')

  var accountSelect = ref()
  var accountList = ref()
  var hasAtleast2Accounts = ref()
  var withdrawAmount = ref()
  var withdrawIncrementAmount = ref()
  var withdrawing = ref(false)
  var withdrawSVG = ref()
  var subMarketTokenName = ref()
  var userBalance = ref()
  var selectedTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var tokenDecimalAmount = ref()

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")

  var overCommentByteSizeLimit = ref()

  var withdrawValue = computed ( () =>
  {
    const price = priceObjectMap.data[selectedTokenMintAddress.toString()].usdPrice
    if(price)
      return (withdrawAmount.value * Number(price)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })        
    else
      return (0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })   
  })
  
  watch(connectedWallet, () =>
  {
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
    withdrawAmount.value = 0

    if(lendingerUserDepositBalanceHashMap.map)
    {
      const balance = lendingerUserDepositBalanceHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString() + selectedTokenMintAddress.toString())
      if(balance)
        userBalance.value = Number(balance)
      else
        userBalance.value = 0
    }
    else
      userBalance.value = 0
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
    if(withdrawing.value)
    {
      const dataPcSectionValue = event?.target?.getAttribute('data-pc-section')

      if((event?.target?.id != "tokenButtonContainer") &&
      (event?.target?.id != "openCopyTokenMintAddressButton") &&
      (event?.target?.id != "copyTokenMintAddressButton") &&
      (event?.target?.id != "copyTokenMintAddressPopover") &&
      (event?.target?.id != "withdrawSVG") &&
      (event?.target?.id != "withdrawModal") &&
      (event?.target?.id != "openWithdrawModal") &&
      (event?.target?.id != "maxButtonContainer") &&
      (event?.target?.id != "maxButton") &&
      (event?.target?.id != "withdrawButton") &&
      (event?.target?.id != "themeButton") &&
      !event?.target?.classList.contains("tableWithdrawButton") &&
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
        withdrawing.value = false

      //Close modal when clicking into input search's behind Modal
      if((event?.target?.placeholder == "Market Search     "))
        withdrawing.value = false
    }
  }

  function openWithdrawModal(tokenMintAddress: PublicKey, decimalAmount: number, tokenSVG: Component, tokenName: string)
  {
    addCloseListner()
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex

    if(lendingerUserAccountsHashMap.map)
    {
      const userAccountList = lendingerUserAccountsHashMap.map.get(connectedWallet.addressString)
      if(userAccountList)
      {

        accountList.value = userAccountList
        if(userAccountList.length >= 2)
          hasAtleast2Accounts.value = true
      }
      else
      {

        hasAtleast2Accounts.value = false
      }
    }
    else
    {

      hasAtleast2Accounts.value = false
    }

    const balance = lendingerUserDepositBalanceHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString() + tokenMintAddress.toString())
    if(balance)
      userBalance.value = Number(balance)
    else
      userBalance.value = 0

    withdrawAmount.value = 0
    withdrawIncrementAmount.value = 1 / Math.pow(10, decimalAmount)
    selectedTokenMintAddress = tokenMintAddress
    tokenDecimalAmount.value = decimalAmount
    withdrawSVG.value = tokenSVG
    subMarketTokenName.value = tokenName
    withdrawing.value = true
  }

  function closeWithdrawModal()
  {
    withdrawing.value = false
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
    localStorage.setItem(connectedWallet.addressString + "selectedLendingAccountIndex", accountSelect.value.toString())
  }

  async function withdrawTokens()
  {
    const lendingUserObligationAccounts = lendingerUserTabsHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())

    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.withdrawTokens
      (
        selectedTokenMintAddress,
        adminAccounts.lendingCEOAddressKey,
        DEFAULT_3_PERCENT_FEE_SUBMARKET_INDEX,
        accountSelect.value,
        new anchor.BN(withdrawAmount.value * Math.pow(10, tokenDecimalAmount.value)),//convert to fixedpoint notation
      )
      .accounts({ mint: selectedTokenMintAddress, signer: connectedWallet.publicKey })
      .remainingAccounts(lendingUserObligationAccounts)
      .rpc()

      await confirmLendingTransaction(tx, toast, "withdraw_tokens")
      withdrawing.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "withdraw_tokens")
    }
  }

  defineExpose(
  {
    openWithdrawModal,
    closeWithdrawModal
  })
</script>

<style scoped>
  #withdrawModal
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