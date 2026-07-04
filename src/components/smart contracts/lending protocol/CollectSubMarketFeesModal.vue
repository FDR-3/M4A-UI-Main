<template>
  <div v-if="collecting"
    id="collectSubMarketFeesModal"
    class="thickBorder flexCenterColumn"
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
        <ion-button class="copyTokenMintAddressButton" color="green" @click="passByRefWrapperCopyTokenMintAddress()" @mouseleave="closeTokenPopover($event)">
          <ion-label class="noClickEvent" color="dark">{{ copyTokenMintAddressButtonText }}</ion-label>
        </ion-button>
      </ion-popover>
    </div>

    <div class="mediumMarginTop mediumSmallMarginBottom">
      <ion-text>Destination SubMarket</ion-text>
    </div>
    <div class="nMediumMarginBottom">
      <ion-text>SubMarket Owner:</ion-text>
    </div>
 
    <Select
    class="standardFontSize mediumMarginTop nTinyMarginBottom"
    style="width: min(290px, 70vw)"
    v-model="ownerSelect" 
    :options="ownerList" 
    optionLabel="ownerDisplayName" 
    optionValue="ownerAddress" 
    placeholder="Select SubMarket Owner"
    appendTo="self"
    @change="setSelectedOwner()">
    </Select>

    <ion-button fill="clear" class="marginZero" @click="openOwnerPopover($event)">
      <ion-label color="dark">{{ trimmedOwnerAddress }}</ion-label>
    </ion-button>
    <ion-popover 
    :is-open="ownerPopoverOpen" 
    :event="event" 
    @didDismiss="ownerPopoverOpen=false"
    side="top" 
    alignment="center"
    >
      <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyAddress()" @mouseleave="closeOwnerPopover($event)">
        <ion-label class="noClickEvent" color="dark">{{ copyFullAddressButtonText }}</ion-label>
      </ion-button>
    </ion-popover>

    <div class="nMediumMarginBottom">
      <ion-text>SubMarket Index:</ion-text>
    </div>
 
    <Select
    class="standardFontSize mediumMarginTop nTinyMarginBottom"
    style="width: min(290px, 70vw)"
    v-model="destinationSubMarketSelect" 
    :options="subMarketList" 
    optionLabel="subMarketDescription" 
    optionValue="subMarketIndex" 
    placeholder="Select SubMarket Index"
    appendTo="self">
    </Select>
 
    <div class="mediumMarginTop nMediumMarginBottom">
      <ion-text>Account:</ion-text>
    </div>
    <div class="flexCenterRow">
      <ion-button v-if="addingAdditionalLendingAccount" id="closeAccountNameEditButton" class="mediumMarginBottom nMediumSmallMarginLeft" fill="clear" @click="cancelAddingAdditionalLendingAccount()">
        <ion-icon :src="close" color="dark" class="noClickEvent"></ion-icon>
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
            <ion-button id="newAccountButton" @click="setNewAccountDefaultName()" color="dark">
              <ion-label class="noClickEvent" color="light">New</ion-label>
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
      :class="{ 'invalid': overByteSizeLimit }"
      style="width: min(290px, 70vw)"
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

    <ion-label class="alignSelfLeft">Uncollected Fees: {{ uncollectedAmount }}</ion-label>
    <div class="smallMarginTop">
      <ion-text>Value: ${{ uncollectedValue }}</ion-text>
    </div>

    <ion-button
      color="dark"
      @click="claimSubMarketFees()"
      class="mediumSmallMarginTop nTinyMarginBottom"
      :disabled="uncollectedAmount == 0 || overByteSizeLimit"
    >
      Deposit Fees
    </ion-button>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, watch, computed, onUpdated, type Component } from 'vue'
  import { IonButton, IonText, IonPopover, IonLabel, IonInput, IonIcon } from '@ionic/vue'
  import { close } from 'ionicons/icons'
  import Select from 'primevue/select'
  import EmojiButton from '/src/components/comments/emojis/EmojiButton.vue'
  import { anchorPrograms,
    SYSTEM_PROGRAM_ADDRESS_STRING,
    MAX_ACCOUNT_NAME_LENGTH } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { copyAddress,
    copyTokenMintAddressText,
    copyFullAddressText,
    confirmLendingTransaction,
    parseProgramErrorCode,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenReserveFontEndInfoHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketLookUpTableByOwnerHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserAccountsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { getLendingUserLookUpTableAddressAndInstructions, sendVersionedLendingProtocolTransaction } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { subMarketOwnerHashMap, subMarketByTokenIdAndOwnerHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { trimAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenAddressStrings } from '/src/assets/constants/Addresses.ts'
  import * as anchor from "@coral-xyz/anchor"

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue')

  var ownerSelect = ref()
  var ownerList = ref()
  var destinationSubMarketSelect = ref()
  var subMarketList = ref()
  var initialSubMarketOwnerAddress: PublicKey
  var initialSubMarketIndex: number
  var trimmedOwnerAddress = ref()
  var accountName = ref()
  var accountSelect = ref()
  var previousAccountSelect: number
  var accountList = ref()
  var hasAtleast1Account = ref()
  var accountNameEditInputRef = ref()
  var addingAdditionalLendingAccount = ref(false)
  var uncollectedAmount = ref()
  var collecting = ref(false)
  var depositSVG = ref()
  var subMarketTokenName = ref()
  var selectedTokenId = 0
  var selectedTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var destinationSubMarketOwnerAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var tokenDecimalAmount: number

  var tokenPopoverOpen = ref(false)
  var ownerPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)
  var copyFullAddressButtonText = ref(copyFullAddressText)

  var savedEmojiCursorPosition: any
  var overByteSizeLimit = ref()
  var modalRef = ref()

  var uncollectedValue = computed(() =>
  {
    const price = priceObjectMap.data[selectedTokenMintAddress.toString()].usdPrice
    if(price)
      return (uncollectedAmount.value * Number(price)).toLocaleString('en-US', {
        minimumFractionDigits: tokenDecimalAmount,
        maximumFractionDigits: tokenDecimalAmount })        
    else
      return (0).toLocaleString('en-US', {
        minimumFractionDigits: tokenDecimalAmount,
        maximumFractionDigits: tokenDecimalAmount })   
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

  watch(subMarketByTokenIdAndOwnerHashMap,() =>
  {
    generateOwnersSelectList()
    generateSubMarketList()
  })

  //When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  const handleClickOutside = (event: any) => 
  {
    if(collecting.value && modalRef.value)
    {
      //const emojiButton = 
      const dataPcSectionValue = event?.target?.getAttribute('data-pc-section')

      if(event?.target?.classList.contains("actionsPopoverButton") ||
      (!modalRef.value.contains(event?.target) &&
      (event?.target?.id != "newAccountButton") &&
      (event?.target?.id != "closeAccountNameEditButton") &&
      (event?.target?.id != "emojiBottomBar") &&
      !event?.target?.classList.contains("native-input") &&
      !event?.target?.classList.contains("emojiSearchContainer") &&
      !event?.target?.classList.contains("emojiSearchOptions") &&
      !event?.target?.classList.contains("magnifyingGlassEmoji") &&
      !event?.target?.classList.contains("emojiColorSelectDivider") &&
      !event?.target?.classList.contains("emojiPage") &&
      !event?.target?.classList.contains("button") &&
      !event?.target?.classList.contains("lendingActionButton") &&
      !event?.target?.classList.contains("copyTokenMintAddressButton") &&
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast text from closing modal
      !event?.target?.classList.contains("p-toast-close-icon") && //Keep transaction toast close button from closing modal
      !event?.target?.classList.contains("p-toast-close-button") && //Keep transaction toast close button from closing modal
      !dataPcSectionValue?.includes('button container') &&  //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path'))) //Keep transaction toast close button from sometimes closing modal
      {
          collecting.value = false
          if(addingAdditionalLendingAccount.value)
          {
            cancelAddingAdditionalLendingAccount()
            addingAdditionalLendingAccount.value = false
          }
          window.removeEventListener('click', handleClickOutside)
      }
    }
  }

  function openCollectSubMarketFeesModal(rowData: any)
  {
    window.addEventListener('click', handleClickOutside)

    const tokenInfo = tokenReserveFontEndInfoHashMap.get(rowData.tokenId)
    const tokenName = tokenInfo.name
    const decimalAmount = tokenInfo.decimalAmount
    const tokenSVG = tokenInfo.svg
    
    uncollectedAmount.value = rowData.uncollectedSubMarketFeesAmount
    selectedTokenId = rowData.tokenId
    selectedTokenMintAddress = new PublicKey(rowData.tokenMintAddress.toString())
    destinationSubMarketOwnerAddress = new PublicKey(rowData.owner.toString())
    trimmedOwnerAddress.value = trimAddress(rowData.owner.toString())
    tokenDecimalAmount = decimalAmount
    depositSVG.value = tokenSVG
    subMarketTokenName.value = tokenName

    generateOwnersSelectList()
    generateSubMarketList()
    ownerSelect.value = rowData.owner.toString()
    destinationSubMarketSelect.value = rowData.subMarketIndex
    initialSubMarketOwnerAddress = rowData.owner
    initialSubMarketIndex = rowData.subMarketIndex
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
        accountName.value = "Generic Sub Fee Claimer 1"
        hasAtleast1Account.value = false
      }
    }
    else
    {
      accountName.value = "Generic Sub Fee Claimer 1"
      hasAtleast1Account.value = false
    }

    setTimeout(() =>
    {
      const inputElement = accountNameEditInputRef.value?.$el.querySelector(".native-input")
      if(inputElement)
        inputElement.focus()
    }, 10) 

    collecting.value = true
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

  function openOwnerPopover(e: Event) 
  {
    event.value = e
    ownerPopoverOpen.value = true
  }

  function closeOwnerPopover(e: Event) 
  {
    event.value = e
    ownerPopoverOpen.value = false
  }

  function passByRefWrapperCopyAddress()
  {
    copyAddress(copyFullAddressButtonText, destinationSubMarketOwnerAddress)
  }

  const customFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([accountName.value])
    const sizeInBytes = blob.size

    inputLength = sizeInBytes

    if(inputLength > maxLength)
    {
      overByteSizeLimit.value = true
    }
    else
      overByteSizeLimit.value = false

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

    accountName.value = `Generic Sub Fee Claimer ${userAccountList.length + 1}`
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

  function setSelectedOwner()
  {
    destinationSubMarketOwnerAddress = new PublicKey(ownerSelect.value)
    trimmedOwnerAddress.value = trimAddress(ownerSelect.value)
    generateSubMarketList()
    destinationSubMarketSelect.value = 0
  }

  function generateOwnersSelectList()
  {
    if(!subMarketOwnerHashMap.map)
      return
    
    const subMarketOwnerArray = Array.from(subMarketOwnerHashMap.map, ([owner, ownerData]) => ({ owner, ownerData }))
    var tempOwnerList = []

    if(!subMarketOwnerArray || subMarketOwnerArray.length == 0)
      return

    for(var i=0; i<subMarketOwnerArray.length; i++)
    {
      const displayName = getCustomOrTrimmedUserDisplayName(subMarketOwnerArray[i].owner) 
      tempOwnerList.push({ ownerDisplayName: displayName, ownerAddress: subMarketOwnerArray[i].owner })
    }

    ownerList.value = tempOwnerList
  }

  function generateSubMarketList()
  {
    if(!subMarketByTokenIdAndOwnerHashMap.map)
      return

    const ownerSubMarketListArray = subMarketByTokenIdAndOwnerHashMap.map.get(selectedTokenId.toString() + destinationSubMarketOwnerAddress.toString())
    var tempSubMarketList = []

    if(!ownerSubMarketListArray || ownerSubMarketListArray.length == 0)
      return

    for(var i=0; i<ownerSubMarketListArray.length; i++)
    {

      tempSubMarketList.push({ subMarketDescription: `Index: ${ownerSubMarketListArray[i].subMarketIndex}, ${ownerSubMarketListArray[i].feeOnInterestEarnedRate}% Fee`,
      subMarketIndex: ownerSubMarketListArray[i].subMarketIndex })
    }

    subMarketList.value = tempSubMarketList
  }

  async function claimSubMarketFees()
  {
    var functionCallName = ""

    try
    {
      var lookUpTableAccounts = []
      var instructionsToSend: anchor.web3.TransactionInstruction[] = []
      var creatingNewLookUpTable = false
      var lendingUserLookUpTableAddress: PublicKey
      
      if(initialSubMarketOwnerAddress.toString() == destinationSubMarketOwnerAddress.toString() && initialSubMarketIndex == destinationSubMarketSelect.value)
      {
        [lendingUserLookUpTableAddress, instructionsToSend, creatingNewLookUpTable] = await getLendingUserLookUpTableAddressAndInstructions(connectedWallet.publicKey,
        accountSelect.value,
        connectedWallet.lendingUserLookUpTableAccount,
        selectedTokenId,
        initialSubMarketOwnerAddress,
        initialSubMarketIndex)

        const claimSubMarketFeesInstruction = await anchorPrograms.lending.lendingProgram.methods.claimSubMarketFees
        (
          initialSubMarketIndex,
          accountSelect.value,
          creatingNewLookUpTable ? accountName.value : null,
          creatingNewLookUpTable ? lendingUserLookUpTableAddress : null
        )
        .accounts({ tokenMintAddress: selectedTokenMintAddress, subMarketOwner: initialSubMarketOwnerAddress })
        .instruction()

        instructionsToSend.push(claimSubMarketFeesInstruction)
        functionCallName = "claim_sub_market_fees"
      }
      else
      {
        [lendingUserLookUpTableAddress, instructionsToSend, creatingNewLookUpTable] = await getLendingUserLookUpTableAddressAndInstructions(connectedWallet.publicKey,
        accountSelect.value,
        connectedWallet.lendingUserLookUpTableAccount,
        selectedTokenId,
        initialSubMarketOwnerAddress,
        initialSubMarketIndex,
        destinationSubMarketOwnerAddress,
        destinationSubMarketSelect.value)
        
        const claimSubMarketFeesAndDepositInDifferentSubMarketInstruction = await anchorPrograms.lending.lendingProgram.methods.claimSubMarketFeesAndDepositInDifferentSubMarket
        (
          initialSubMarketIndex,
          destinationSubMarketSelect.value,
          accountSelect.value,
          creatingNewLookUpTable ? accountName.value : null,
          creatingNewLookUpTable ? lendingUserLookUpTableAddress : null
        )
        .accounts({ 
          tokenMintAddress: selectedTokenMintAddress,
          initialSubMarketOwner: initialSubMarketOwnerAddress,
          destinationSubMarketOwner: destinationSubMarketOwnerAddress
         })
        .instruction()

        instructionsToSend.push(claimSubMarketFeesAndDepositInDifferentSubMarketInstruction)
        functionCallName = "claim_sub_market_fees_and_deposit_in_different_sub_market"
      }

      //Get Lending Protocol Look Up Table Account
      lookUpTableAccounts.push(anchorPrograms.lendingProtocolLookUpTableAccount)

      //Only include look up table if there are 2 different submarkets by the same owner. Lookuptable account cost 35 bytes, single submarket account is 32 bytes
      //Get Sub Market Look Up Table Account By Owner
      if((initialSubMarketOwnerAddress.toString() == destinationSubMarketOwnerAddress.toString()) &&
      (initialSubMarketIndex != destinationSubMarketSelect.value))
      {
        const subInitialMarketOwnerLookUpTableAccount = subMarketLookUpTableByOwnerHashMap.map.get(initialSubMarketOwnerAddress.toString())
        lookUpTableAccounts.push(subInitialMarketOwnerLookUpTableAccount)
      }

      //Get Lending User Look Up Table Account
      if(connectedWallet.lendingUserLookUpTableAccount)//Won't be available if first lending action
        lookUpTableAccounts.push(connectedWallet.lendingUserLookUpTableAccount)

      const tx = await sendVersionedLendingProtocolTransaction(instructionsToSend, lookUpTableAccounts)

      await confirmLendingTransaction(tx, toast, functionCallName)

      collecting.value = false
    }
    catch(error)
    {
      var errorMessage = parseProgramErrorCode(error, anchorPrograms.lending.lendingProgram)
      toastPreTransactionError(errorMessage, toast, functionCallName)
    }
  }

  defineExpose(
  {
    openCollectSubMarketFeesModal
  })
</script>

<style scoped>
  #collectSubMarketFeesModal
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