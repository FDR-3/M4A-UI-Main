<template>
  <div v-if="depositing"
    id="depositModal"
    class="thickBorder"
    ref="modalRef"
  >
    <div class="nMediumSmallMarginTop nMediumMarginBottom flexCenterRow">
      <ion-button fill="clear" @click="openTokenPopover($event)">
        <img v-if="selectedTokenMintAddress?.toString()==tokenAddressStrings.solTokenMintAddress" style="width: 50px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
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

    <div class="flexCenterColumn">
    <span v-if="subMarketSelect==1" class="mediumMarginTop"><ion-text color="red">Warning: </ion-text> Depositing into 100%<br>fee on interest earned SubMarket</span>
    <Select
    class="standardFontSize mediumMarginTop nTinyMarginBottom"
    v-model="subMarketSelect" 
    :options="subMarketList" 
    optionLabel="subMarketFeeName" 
    optionValue="subMarketIndex" 
    placeholder="Select fdr-3 SubMarket"
    appendTo="self"
    @change="updateStoredSelectedSubMarketIndex(selectedTokenId, subMarketSelect.toString())">
    </Select>
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

    <HealthFactorSmall :assetValue="totalAssetValue" :debtValue="totalDebtValue"/>

    <ion-label class="alignSelfLeft">Wallet: {{ userWalletBalance.toLocaleString('en-US', {
      minimumFractionDigits: tokenDecimalAmount,
      maximumFractionDigits: tokenDecimalAmount }) }}
    </ion-label>
    <ion-label class="alignSelfLeft">Balance: {{ userBalance.toLocaleString('en-US', {
      minimumFractionDigits: tokenDecimalAmount,
      maximumFractionDigits: tokenDecimalAmount }) }}
    </ion-label>
    <InputNumber
      v-model="depositAmount"
      :inputStyle="{'text-align': 'center'}"
      :minFractionDigits="tokenDecimalAmount" :maxFractionDigits="tokenDecimalAmount"
      :max="userWalletBalance"
      :min="0"
      :step="depositIncrementAmount"
      showButtons
      fluid
      @input="(event: { value: any }) => depositAmount = event.value"
    />
    <div class="alignSelfLeft">
      <!--If it's the SOL Token, leave some SOL when hitting the Max button for transaction fees-->
      <button style="background-color: transparent" @click="selectedTokenMintAddress?.toString()!=tokenAddressStrings.solTokenMintAddress ? depositAmount=userWalletBalance : depositAmount=userWalletBalance-0.1">
        <ion-label color="dark">Max</ion-label>
      </button>

      <button class="mediumSmallMarginLeft" style="background-color: transparent" @click="depositAmount=userWalletBalance * 0.5">
        <div style="margin-top: 2px"><ion-label color="dark">Half</ion-label></div>
      </button>
    </div>

    <div class="smallMarginTop">
      <ion-text>Value: ${{ depositValue }}</ion-text>
    </div>

    <ion-text v-if="!connectedWallet.isConnected" class="nMediumMarginTop mediumMarginBottom" style="font-size: 11px"
    >
      Connect wallet to deposit
    </ion-text>
    <div v-else-if="anchorPrograms.isLendingProtocolReady" class="mediumSmallMarginTop nTinyMarginBottom nMediumLargeMarginLeft">
      <div>
        <InfoButton :infoMessage="depositInfoMSG" :openSide="'top'"/>
        <ion-button
          color="dark"
          @click="depositTokens()"
          :disabled="overByteSizeLimit"
        >
          Deposit
        </ion-button>
      </div>
      <AddMissingUserLUTAddresses/>
    </div>
    <ion-text v-else>Loading</ion-text>
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
  import { copyAddress,
    copyTokenMintAddressText,
    confirmLendingTransaction,
    parseProgramErrorCode,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenReservesHashMap, tokenReserveFontEndInfoHashMap, tokenIdHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketsHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserAccountsHashMap, lendingUserTabAccountsHashMap, lendingUserTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { getLendingUserLookUpTableAddressAndInstructions, sendVersionedLendingProtocolTransaction } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { tokenAddressStrings, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import InfoButton from '/src/components/help/InfoButton.vue'
  import { getDynamicPriorityFeePrice } from '/src/assets/contracts/WalletHelper.vue'
  import * as anchor from "@coral-xyz/anchor"
  import cloneDeep from 'lodash/cloneDeep'
  import HealthFactorSmall from '/src/components/smart contracts/lending protocol/HealthFactorSmall.vue'
  import { unixData } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { calculateNewBalance, calculateNewDebtBalance, getCompoundingFactor } from './InterestCalcHelpers.ts'
  import AddMissingUserLUTAddresses from '/src/components/smart contracts/lending protocol/AddMissingUserLUTAddresses.vue'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue')

  var tokenReserve: any
  var lendingUserTabAccount: any
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
  var userWalletBalance = ref()
  var userBalance = ref()
  var userOriginalBalance = 0
  var selectedTokenId = 0
  var selectedTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var tokenDecimalAmount: number
  var tokenProgram: PublicKey
  var interestEarnedIntervalId: any
  var healthFactorIntervalId: any

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)

  var savedEmojiCursorPosition: any
  var overByteSizeLimit = ref()
  var totalAssetValue = ref(0)
  var totalDebtValue = ref(0)
  var modalRef = ref()

  const depositInfoMSG = "The initial transaction fees for depositing a new Token for the first time are more expensive than normal to initialize your account data. You need different account data for each different Token you deposit into. You also need new account data when a new month comes for your monthly statement accounts. A new monthly statement account is only generated when you're executing a transaction during a new month.\n\nAn initial deposit transaction fee might be around 0.008881 SOL and 0.00008 SOL when no new data accounts are needed."

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

  watch(lendingUserTabAccountListHashMap, async() =>
  {
    if(depositing.value)//Don't start another count down if on another modal since the deposit modal is still mounted even when not visible
    {
      setInitialBalance()
      stopInterestCalculation()
      startInterestCalculation()
      stopHealthFactorCalculation()
      startHealthFactorCalculation()
    }
  })

  watch(connectedWallet, async() =>
  {
    if(depositing.value)
    {
      const balance = connectedWallet.tokenBalanceMap.get(selectedTokenMintAddress.toString())
      if(balance)
        userWalletBalance.value = Number(balance)
      else
        userWalletBalance.value = 0
    }
  })

  //Json string of wallet to detect object property changes
  const walletWatch = computed(() =>
  {
    return JSON.stringify(
    {
      addressString: connectedWallet.addressString,
      selectedLendingUserAccountIndex: connectedWallet.selectedLendingUserAccountIndex
    })
  })

  watch(walletWatch, async (newJSONObjectString, oldJSONObjectString) =>
  {
    if(depositing.value)
    {
      let newWallet = JSON.parse(newJSONObjectString)
      let oldWallet= JSON.parse(oldJSONObjectString)

      //Only want this running if the connected Wallet Address String is changing
      if(newWallet.addressString == oldWallet.addressString && newWallet.selectedLendingUserAccountIndex == oldWallet.selectedLendingUserAccountIndex )
        return

      const balance = connectedWallet.tokenBalanceMap.get(selectedTokenMintAddress.toString())
      if(balance)
        userWalletBalance.value = Number(balance)
      else
        userWalletBalance.value = 0

      accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
      depositAmount.value = 0

      setInitialBalance()
      stopInterestCalculation()
      startInterestCalculation()
      stopHealthFactorCalculation()
      startHealthFactorCalculation()
    }
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

  //When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  const handleClickOutside = (event: any) =>
  {
    if(depositing.value && modalRef.value)
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
      !dataPcSectionValue?.includes('button container') && //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path'))) //Keep transaction toast close button from sometimes closing modal
      {
        if(addingAdditionalLendingAccount.value)
        {
          cancelAddingAdditionalLendingAccount()
          addingAdditionalLendingAccount.value = false
        }

        depositing.value = false
        stopInterestCalculation()
        stopHealthFactorCalculation()
        window.removeEventListener('click', handleClickOutside)
      }
    }
  }

  function openDepositModal(tokenId: number, tokenMintAddress: string, subMarkets: any[])
  {
    window.addEventListener('click', handleClickOutside)

    const tokenInfo = tokenReserveFontEndInfoHashMap.get(tokenId)
    const tokenName = tokenInfo.name
    const decimalAmount = tokenInfo.decimalAmount
    const tokenSVG = tokenInfo.svg

    tokenProgram = tokenInfo.tokenProgram
    subMarketList.value = subMarkets

    //The HODL Treasurer and the Singler Payer should only ever deposit into the %100 Fee Sub Market
    if((connectedWallet.addressString == adminAccounts.hodlTreasuryAddress.toString()) ||
    (connectedWallet.addressString == adminAccounts.singlePayerTreasuryAddress.toString()))
      subMarketSelect.value = 1
    else
      subMarketSelect.value = Number(localStorage.getItem(tokenId.toString() +
      connectedWallet.addressString +
      connectedWallet.selectedLendingUserAccountIndex.toString() +
      "selectedMainSubMarketIndex")) || 0

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
      userWalletBalance.value = Number(balance)
    else
      userWalletBalance.value = 0

    depositAmount.value = 0
    depositIncrementAmount.value = 1 / Math.pow(10, decimalAmount)
    selectedTokenId = tokenId
    selectedTokenMintAddress = new PublicKey(tokenMintAddress)
    tokenDecimalAmount = decimalAmount
    depositSVG.value = tokenSVG
    subMarketTokenName.value = tokenName
    depositing.value = true

    setInitialBalance()
    stopInterestCalculation()
    startInterestCalculation()
    stopHealthFactorCalculation()
    startHealthFactorCalculation()
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

  function setInitialBalance()
  {
    if(!lendingUserTabAccountsHashMap.map)
      return

    lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(selectedTokenId.toString() +
    adminAccounts.lendingCEOAddressString +
    subMarketSelect.value.toString() +
    connectedWallet.addressString +
    accountSelect.value.toString())

    if(lendingUserTabAccount)
      userBalance.value = Number(lendingUserTabAccount.depositedAmount / Math.pow(10, tokenDecimalAmount))//Convert from fixed point notation to decimal
    else
      userBalance.value = 0

    userOriginalBalance = userBalance.value
  }

  function calculateHealthFactorValues(timeStamp: number)
  {
    if(!lendingUserTabAccountListHashMap.map || selectedTokenMintAddress.toString()==SYSTEM_PROGRAM_ADDRESS_STRING)
      return

    const userTabAccounts = lendingUserTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value)

    var calculatedAssetValue = 0
    var calculatedDebtValue = 0

    if(userTabAccounts)
      for(var i=0; i<userTabAccounts.length; i++)
      {
        const tokenMintAddressString = tokenIdHashMap.map.get(userTabAccounts[i].tokenId)
        const price = priceObjectMap.data[tokenMintAddressString].usdPrice
        const decimalAmount = tokenDecimalHashMap.get(userTabAccounts[i].tokenId)
        const tabTokenReserve = tokenReservesHashMap.map.get(userTabAccounts[i].tokenId)
        const subMarket = subMarketsHashMap.map.get(userTabAccounts[i].tokenId.toString() +
        userTabAccounts[i].subMarketOwnerAddress.toString() +
        userTabAccounts[i].subMarketIndex.toString())

        const userBalanceWithInterestEarned = calculateNewBalance(
        tabTokenReserve,
        subMarket,
        Number(userTabAccounts[i].depositedAmount),
        Number(userTabAccounts[i].supplyInterestChangeIndex),
        timeStamp)

        const userDebtWithInterestAccrued =  calculateNewDebtBalance(
        tabTokenReserve,
        Number(userTabAccounts[i].borrowedAmount),
        Number(userTabAccounts[i].borrowInterestChangeIndex),
        timeStamp)

        calculatedAssetValue += Number(userBalanceWithInterestEarned / Math.pow(10, decimalAmount)) * Number(price)
        calculatedDebtValue += Number(userDebtWithInterestAccrued / Math.pow(10, decimalAmount)) * Number(price)
      }
    
    const priceOfSelectedToken = Number(priceObjectMap.data[selectedTokenMintAddress.toString()].usdPrice)

    //Account for value that is about to be deposited
    //Check for less than zero values when doing complete withdrawals, due to the price possibly being slighly off
    calculatedAssetValue += depositAmount.value * Number(priceOfSelectedToken)
    if(calculatedAssetValue < 0)
      calculatedAssetValue = 0

    totalAssetValue.value = calculatedAssetValue
    totalDebtValue.value = calculatedDebtValue
  }

  function startInterestCalculation()
  {
    if(unixData.timeStamp == 0)
      return

    interestEarnedIntervalId = setInterval(() =>
    {
      calculateTokenReserveInterestChangeIndex(unixData.timeStamp)
      calculateUserInterest()
    }, 55)
  }

  function stopInterestCalculation()
  {
    if(interestEarnedIntervalId != undefined)
    {
      clearInterval(interestEarnedIntervalId)
      interestEarnedIntervalId = undefined
    }
  }

  function startHealthFactorCalculation()
  {
    if(unixData.timeStamp == 0)
      return

    healthFactorIntervalId = setInterval(() =>
    {
      calculateHealthFactorValues(unixData.timeStamp)
    }, 55)
  }

  function stopHealthFactorCalculation()
  {
    if(healthFactorIntervalId != undefined)
    {
      clearInterval(healthFactorIntervalId)
      healthFactorIntervalId = undefined
    }
  }

  function calculateTokenReserveInterestChangeIndex(timeStamp: number)
  {
    tokenReserve = cloneDeep(tokenReservesHashMap.map.get(selectedTokenId))//cloneDeep to keep changes to tokenReserve variable from setting off tokenReservesHashMap watchers

    if(!tokenReserve)
      return

    //Token Reserve Supply Interest Index = Old Supply Interest Index * Taylor Series 4th Order Interest Calculation: e^x = 1 + x + (x^2 / 2!) + (x^3 / 3!) + (x^4 / 4!)
    const oldTime = Number(tokenReserve.lastLendingActivityTimeStamp)
    const changeInTime = timeStamp - oldTime
    const supplyApy = tokenReserve.supplyApy / 10000 //convert from fixed point to decimal
    const supplyCompoundingFactor = getCompoundingFactor(supplyApy, changeInTime)

    tokenReserve.newSupplyInterestChangeIndex = Number(tokenReserve.supplyInterestChangeIndex) * supplyCompoundingFactor
  }

  function calculateUserInterest()
  {
    setInitialBalance()

    if(!lendingUserTabAccount)
      return

    //For tab accounts initialized with no deposits, keeps from dividing by zero
    //For example, can happen when claiming submarket fees in different destination submarket on new initial tab account
    if(Number(lendingUserTabAccount.supplyInterestChangeIndex) == 0)
      lendingUserTabAccount.supplyInterestChangeIndex = tokenReserve.newSupplyInterestChangeIndex

    //User New Balance Before Fee = Old Balance * Token Reserve Earned Interest Index / User Earned Interest Index
    //Interest Earned Before Fee = New Balance Before Fee - Old Balance
    
    const newBalanceBeforeFee = (userOriginalBalance * tokenReserve.newSupplyInterestChangeIndex / Number(lendingUserTabAccount.supplyInterestChangeIndex))
    const interestEarnedBeforeFees = newBalanceBeforeFee - userOriginalBalance

    const subMarket = subMarketsHashMap.map.get(selectedTokenId.toString() + adminAccounts.lendingCEOAddressString + subMarketSelect.value.toString())
    const subMarketFee = subMarket.feeOnInterestEarnedRate
    var formulaSubMarketFee
    var solvencyInsuranceFee
    if(subMarketFee + tokenReserve.solvencyInsuranceFeeRate <= 100)
    {
      formulaSubMarketFee = subMarketFee
      solvencyInsuranceFee = tokenReserve.solvencyInsuranceFeeRate
    }
    else
    {
      solvencyInsuranceFee = tokenReserve.solvencyInsuranceFeeRate
      formulaSubMarketFee = 100 - tokenReserve.solvencyInsuranceFeeRate
    }

    //Interest Earned After Fee = Interest Earned Before Fee - (Interest Earned Before Fee * SubMarket Fee Rate) - (Interest Earned Before Fee * Solvency Insurance Fee Rate)
    //User New Balance After Fee = Old Balance + Interest Earned After Fee
    var interestEarnedAfterFees = interestEarnedBeforeFees - (interestEarnedBeforeFees * formulaSubMarketFee / 100) - (interestEarnedBeforeFees * solvencyInsuranceFee / 100)
    interestEarnedAfterFees = Number(interestEarnedAfterFees.toFixed(tokenDecimalAmount))

    //Add interest earned to original balance
    userBalance.value = userOriginalBalance + interestEarnedAfterFees
  }

  async function depositTokens()
  {
    try
    {
      var lookUpTableAccounts = []

      var [lendingUserLookUpTableAddress, instructionsToSend, creatingNewLookUpTable] = await getLendingUserLookUpTableAddressAndInstructions(connectedWallet.publicKey,
      accountSelect.value,
      connectedWallet.lendingUserLookUpTableAccount,
      selectedTokenId,
      adminAccounts.lendingCEOAddressKey,
      subMarketSelect.value)

      const depositTokensInstruction = await anchorPrograms.lending.lendingProgram.methods.depositTokens
      (
        subMarketSelect.value,
        accountSelect.value,
        new anchor.BN(depositAmount.value * Math.pow(10, tokenDecimalAmount)),//convert to fixedpoint notation
        creatingNewLookUpTable ? accountName.value : null,
        creatingNewLookUpTable ? lendingUserLookUpTableAddress : null
      ).accounts({ tokenMint: selectedTokenMintAddress, subMarketOwner: adminAccounts.lendingCEOAddressKey, tokenProgram: tokenProgram })
      .instruction()

      instructionsToSend.push(depositTokensInstruction)

      //Get Lending Protocol Look Up Table Account
      lookUpTableAccounts.push(anchorPrograms.lendingProtocolLookUpTableAccount)

      //Not worth getting Submarket look up table for just 1 subMarket, 1 submarket account is 32 bytes, lookuptable account is 35 bytes minimum.

      //Get Lending User Look Up Table Account
      if(connectedWallet.lendingUserLookUpTableAccount)//Won't be available on first deposit
        lookUpTableAccounts.push(connectedWallet.lendingUserLookUpTableAccount)

      const tx = await sendVersionedLendingProtocolTransaction(instructionsToSend, lookUpTableAccounts)

      await confirmLendingTransaction(tx, toast, "deposit_tokens")

      stopInterestCalculation()
      stopHealthFactorCalculation()
      depositing.value = false
      addingAdditionalLendingAccount.value = false
    }
    catch(error)
    {
      var errorMessage = parseProgramErrorCode(error, anchorPrograms.lending.lendingProgram)
      toastPreTransactionError(errorMessage, toast, "deposit_tokens")  
    }
  }

  function updateStoredSelectedSubMarketIndex(tokenId: number, mainSubMarketIndex: string)
  {
    depositAmount.value = 0

    localStorage.setItem(tokenId.toString() +
    connectedWallet.addressString +
    connectedWallet.selectedLendingUserAccountIndex.toString() +
    "selectedMainSubMarketIndex", mainSubMarketIndex)

    setInitialBalance()
    stopInterestCalculation()
    startInterestCalculation()
    stopHealthFactorCalculation()
    startHealthFactorCalculation()
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