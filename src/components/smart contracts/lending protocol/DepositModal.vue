<template>
  <div v-if="depositing"
    id="depositModal"
    class="thickBorder"
    ref="modalRef"
  >
    <div class="nMediumSmallMarginTop nMediumMarginBottom flexCenterRow">
      <ion-button fill="clear" @click="openTokenPopover($event)">
        <img v-if="selectedTokenMintAddress?.toString()==tokenAddressStrings.solTokenMintAddress"  style="width: 50px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
        <component v-else :is="depositSVG" style="width: 44px"></component>
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
      <ion-button v-if="addingAdditionalLendingAccount" class="mediumMarginBottom nMediumSmallMarginLeft" fill="clear" @click="cancelAddingAdditionalLendingAccount()">
        <ion-icon :src="close" color="dark"></ion-icon>
      </ion-button>

      <Select
      v-if="hasAtleast1Account && !addingAdditionalLendingAccount"
      id="accountSelect"
      class="standardFontSize mediumMarginTop mediumMarginBottom"
      v-model="accountSelect" 
      :options="accountList" 
      optionLabel="accountName" 
      optionValue="userAccountIndex" 
      placeholder="Select Account"
      appendTo="self"
      @change="updateStoredSelectedAccount()">
        <template #footer>
          <div class="flexCenterRow">
            <ion-button @click="setNewAccountDefaultName()" color="dark">
              <ion-label color="light">New</ion-label>
            </ion-button>
          </div>
        </template>
      </Select>

      <ion-input
      v-else
      v-model="accountName"
      ref="accountNameEditInputRef"
      id="accountNameEditInput"
      class="mediumMarginTop smallMarginBottom"
      :class="{ 'invalid': overCommentByteSizeLimit }"
      fill="outline"
      :counter="true"
      :counter-formatter="customFormatter"
      :maxlength=MAX_ACCOUNT_NAME_LENGTH>
        <EmojiButton
        :marginTop="'4px'"
        :colorHexValue="colorHexValue"
        :openSide="'right'"
        @emojiSelected="(emoji: String) => insertEmoji(emoji)"/>
      </ion-input>
    </div>

    <ion-label class="alignSelfLeft">Balance: {{ userBalance.toFixed(tokenDecimalAmount) }}</ion-label>
    <InputNumber
      v-model="depositAmount"
      :inputStyle="{'text-align': 'center'}"
      :minFractionDigits="tokenDecimalAmount" :maxFractionDigits="tokenDecimalAmount"
      :max="userBalance"
      :min="0"
      :step="depositIncrementAmount"
      showButtons
      fluid
      @input="(event: { value: any }) => depositAmount = event.value"
    />
    <div class="alignSelfLeft">
      <!--If it's the SOL Token, leave some SOL when hitting the Max button for transactions-->
      <button style="background-color: transparent" @click="selectedTokenMintAddress?.toString()!=tokenAddressStrings.solTokenMintAddress ? depositAmount=userBalance : depositAmount=userBalance-0.1">
        <ion-label color="dark">Max</ion-label>
      </button>
    </div>

    <div class="smallMarginTop">
      <ion-text>Value: ${{ depositValue }}</ion-text>
    </div>

    <ion-text v-if="!connectedWallet.isConnected" class="nMediumMarginTop mediumMarginBottom" style="font-size: 11px"
    >
      Connect wallet to deposit
    </ion-text>
    <ion-button
      v-else
      color="dark"
      @click="depositTokens()"
      class="mediumSmallMarginTop nTinyMarginBottom"
      :disabled="depositAmount == 0 || overCommentByteSizeLimit"
    >
      Deposit
    </ion-button>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, watch, computed, onUpdated, type Component } from 'vue'
  import { IonButton, IonText, IonPopover, IonLabel, IonInput, IonIcon } from '@ionic/vue'
  import { close } from 'ionicons/icons'
  import Select from 'primevue/select'
  import InputNumber from 'primevue/inputnumber'
  import EmojiButton from '/src/components/comments/emojis/EmojiButton.vue'
  import { anchorPrograms,
    SYSTEM_PROGRAM_ADDRESS_STRING,
    MAX_ACCOUNT_NAME_LENGTH } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { copyTokenMintAddress,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenReserveHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { lendingUserAccountsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenAddressStrings } from '/src/assets/constants/Addresses.ts'
  import * as anchor from "@coral-xyz/anchor"

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue')

  var subMarketSelect = ref()
  var subMarketList = ref()
  var accountName = ref()
  var accountSelect = ref()
  var previousAccountSelect: number
  var accountList = ref()
  var hasAtleast1Account = ref()
  var accountNameEditInputRef = ref()
  var addingAdditionalLendingAccount = ref(false)
  var depositAmount = ref()
  var depositIncrementAmount = ref()
  var depositing = ref(false)
  var depositSVG = ref()
  var subMarketTokenName = ref()
  var userBalance = ref()
  var selectedTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var tokenDecimalAmount = ref()

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")

  var savedEmojiCursorPosition: any
  var overCommentByteSizeLimit = ref()
  var modalRef = ref()

  var depositValue = computed(() =>
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

    const balance = connectedWallet.tokenBalanceMap.get(selectedTokenMintAddress.toString())
    if(balance)
      userBalance.value = Number(balance)
    else
      userBalance.value = 0

    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
  })

  //Move cursor back after emoji insert
  onUpdated(() => 
  {
    //Move cursor back after inserting emoji in reply
    const inputElement = accountNameEditInputRef.value?.$el.querySelector(".native-input")
    if(savedEmojiCursorPosition != undefined)
      if(inputElement)
      {
        inputElement.setSelectionRange(savedEmojiCursorPosition, savedEmojiCursorPosition)
        inputElement.focus()
        savedEmojiCursorPosition = undefined
      }
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
  {console.log(event?.target)
    if(depositing.value)
    {
      const dataPcSectionValue = event?.target?.getAttribute('data-pc-section')
      
      if(!modalRef.value.contains(event?.target) &&
      !event?.target?.classList.contains("lendingActionButton") &&
      !event?.target?.classList.contains("copyTokenMintAddressButton") &&
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast text from closing modal
      !event?.target?.classList.contains("p-toast-close-button") && //Keep transaction toast close button from closing modal
      !dataPcSectionValue?.includes('button container') &&  //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path')) //Keep transaction toast close button from sometimes closing modal
      {
        depositing.value = false
        if(addingAdditionalLendingAccount.value)
        {
          cancelAddingAdditionalLendingAccount()
          addingAdditionalLendingAccount.value = false
        }
      }

      //Close modal when clicking into input search's behind Modal
      if((event?.target?.placeholder == "Market Search     "))
      {
        depositing.value = false
        if(addingAdditionalLendingAccount.value)
        {
          cancelAddingAdditionalLendingAccount()
          addingAdditionalLendingAccount.value = false
        }
      }
    }
  }

  function openDepositModal(tokenMintAddress: string, fdr3SubMarkets: any[])
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
      {
        accountName.value = null
        accountList.value = userAccountList
        hasAtleast1Account.value = true
      }
      else
      {
        accountName.value = "Account 1"
        hasAtleast1Account.value = false
      }
    }
    else
    {
      accountName.value = "Account 1"
      hasAtleast1Account.value = false
    }

    setTimeout(() =>
    {
      const inputElement = accountNameEditInputRef.value?.$el.querySelector(".native-input")
      if(inputElement)
        inputElement.focus()
    }, 10) 

    const balance = connectedWallet.tokenBalanceMap.get(tokenMintAddress)
    if(balance)
      userBalance.value = Number(balance)
    else
      userBalance.value = 0

    depositAmount.value = 0
    depositIncrementAmount.value = 1 / Math.pow(10, decimalAmount)
    selectedTokenMintAddress = new PublicKey(tokenMintAddress)
    tokenDecimalAmount.value = decimalAmount
    depositSVG.value = tokenSVG
    subMarketTokenName.value = tokenName
    depositing.value = true
  }

  function closeDepositModal()
  {
    depositing.value = false
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

  const customFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([accountName.value])
    const sizeInBytes = blob.size

    inputLength = sizeInBytes

    if(inputLength > maxLength)
    {
      overCommentByteSizeLimit.value = true
    }
    else
      overCommentByteSizeLimit.value = false

    return `${inputLength}/${maxLength} `
  }

  function insertEmoji(emoji: String)
  {
    const inputElement = accountNameEditInputRef.value?.$el.querySelector(".native-input")
    if(inputElement) 
    {
      const start = inputElement.selectionStart
      const end = inputElement.selectionEnd
      const newValue =
      accountName.value.substring(0, start) + 
      emoji + 
      accountName.value.substring(end)

      accountName.value = newValue

      savedEmojiCursorPosition = inputElement.selectionStart + emoji.length
    }
  }

  function setNewAccountDefaultName()
  {
    const userAccountList = lendingUserAccountsHashMap.map.get(connectedWallet.addressString)

    accountName.value = `Account ${userAccountList.length + 1}`
    previousAccountSelect = accountSelect.value
    accountSelect.value = userAccountList.length
    localStorage.setItem("selectedLendingAccountIndex", accountSelect.value.toString())

    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
    addingAdditionalLendingAccount.value = true
  }

  function cancelAddingAdditionalLendingAccount()
  {
    accountSelect.value = previousAccountSelect
    localStorage.setItem("selectedLendingAccountIndex", accountSelect.value.toString())

    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
    addingAdditionalLendingAccount.value = false
  }

  function updateStoredSelectedAccount()
  {
    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
    localStorage.setItem("selectedLendingAccountIndex", accountSelect.value.toString())
  }

  async function depositTokens()
  {
    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.depositTokens
      (
        selectedTokenMintAddress,
        adminAccounts.lendingCEOAddressKey,
        subMarketSelect.value,
        accountSelect.value,
        new anchor.BN(depositAmount.value * Math.pow(10, tokenDecimalAmount.value)),//convert to fixedpoint notation
        accountName.value
      ).accounts({ mint: selectedTokenMintAddress, signer: connectedWallet.publicKey }).rpc()

      await confirmLendingTransaction(tx, toast, "deposit_tokens")

      depositing.value = false
      addingAdditionalLendingAccount.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "deposit_tokens")
    }
  }

  function updateStoredSelectedSubMarketIndex(tokenMintAddress: string, mainSubMarketIndex: string)
  {
    localStorage.setItem(tokenMintAddress + "selectedMainSubMarketIndex", mainSubMarketIndex)
  }

  defineExpose(
  {
    openDepositModal,
    closeDepositModal
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

  #accountNameEditInput
  {
    min-height: 25px;
    --highlight-color: v-bind(colorHexValue) !important
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