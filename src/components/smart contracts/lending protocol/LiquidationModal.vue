<template>
  <div v-if="liquidating"
    id="liquidationModal"
    class="thickBorder"
    ref="modalRef"
  >
    <div class="flexCenterColumn nSmallMarginTop mediumMarginBottom">
      <ion-label style="margin-bottom: 5px">Liquidating</ion-label>
      <ion-label>{{ liquidatiDisplayName}}: {{ accountDisplayName }}</ion-label>
    </div>

    <HealthFactorSmall :assetValue="totalAssetValue" :debtValue="totalDebtValue" :openSide="'bottom'"/>
   
    <div class="nMediumMarginTop flexCenterRow tinyMarginBottom">
      <InfoButton :infoMessage="liquidationInfoMSG" :openSide="'bottom'"/>
      <div class="nMediumSmallMarginLeft">
        <ion-text v-if="solvent" color="green">Solvent</ion-text>
        <ion-text v-else color="red">Insolvent</ion-text>
      </div>
    </div>
    
    <div class="nMediumMarginBottom">
      <ion-text style="font-weight: bold">Borrow Position To Repay:</ion-text>
    </div>
    <Select
    class="standardFontSize mediumMarginTop"
    style="width: min(440px, 70vw)"
    v-model="borrowPositionToRepaySelect" 
    :options="borrowPositionToRepayList" 
    optionLabel="borrowedAmount" 
    optionValue="borrowInfo" 
    placeholder="Select Position To Repay"
    appendTo="self"
    @change="setRepaymentTokenMintAddress()">
    </Select>

    <div class="flexCenterRow tinyMarginTop">
      <img v-if="repaymentTokenMintAddress?.toString()==tokenAddressStrings.solTokenMintAddress" style="width: 50px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
      <component v-else :is="borrowSVG" style="width: 44px"></component>
      <ion-label>Borrowed Amount: {{ selectedBorrowedAmount }}</ion-label>
    </div>
    <ion-label class="alignSelfLeft tinyMarginTop">Repayment Amount: </ion-label>
 
    <InputNumber
      v-model="repayAmount"
      :inputStyle="{'text-align': 'center'}"
      :minFractionDigits="repaymentTokenDecimalAmount" :maxFractionDigits="repaymentTokenDecimalAmount"
      :max="payableUserDebt"
      :min="0"
      :step="repayIncrementAmount"
      showButtons
      fluid
      @input="(event: { value: any }) => repayAmount = event.value"
      @focus="repayMax=false; repayHalf=false"
    />

    <div style="display: flex; justify-content:space-between">
      <div>
        <button style="background-color: transparent" @click="repayAmount=payableUserDebt; repayHalf=false; repayMax=true">
          <ion-label color="dark">Max</ion-label>
        </button>

        <button class="mediumSmallMarginLeft" style="background-color: transparent" @click="repayAmount=payableUserDebt*0.5; repayMax=false; repayHalf=true">
          <ion-label color="dark">Half</ion-label>
        </button>
      </div>

      <ion-label style="display: flex; justify-self:flex-end; " color="dark">Value: ${{ repaymentValue }}</ion-label>
    </div>
    
    <div class=" mediumMarginTop nMediumMarginBottom">
      <ion-text style="font-weight: bold">Deposit Position To Liquidate:</ion-text>
    </div>

    <Select
    class="standardFontSize mediumMarginTop"
    style="width: min(440px, 70vw)"
    v-model="depositPositionToLiquidateSelect" 
    :options="depositPositionToLiquidateList" 
    optionLabel="depositedAmount" 
    optionValue="depositInfo" 
    placeholder="Select Position To Liquidate"
    appendTo="self"
    @change="setLiquidationTokenMintAddress()">
    </Select>

    <div class="flexCenterRow tinyMarginTop">
      <img v-if="liquidationTokenMintAddress?.toString()==tokenAddressStrings.solTokenMintAddress" style="width: 50px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
      <component v-else :is="depositSVG" style="width: 44px"></component>
      <ion-label>Deposited Amount: {{ selectedDepositedAmount }}</ion-label>
    </div>
    <br>
   
    <div>
      <ion-text style="font-weight: bold">Result Estimation</ion-text>
    </div>
    <div style="display: flex; justify-content:space-between">
      <ion-label class="mediumMarginRight">Amount To Be Liquidated: {{ totalLiquidationAmount }} </ion-label>
      <ion-label>Value: ${{ TotalLiquidationValue }}</ion-label>
    </div>
    <div style="display: flex; justify-content:space-between">
      <ion-label class="mediumMarginRight">Amount To Liquidator: {{ liquidationAmountWith7PercentBonus }}</ion-label>
      <ion-label>Value: ${{ liquidationAmountWith7PercentBonusValue }}</ion-label>
    </div>
    <div style="display: flex; justify-content:space-between">
      <ion-label class="mediumMarginRight">Amount To HODL Treasury: {{ liquidation1PercentFee }}</ion-label>
      <ion-label>Value: ${{ liquidation1PercentFeeValue }}</ion-label>
    </div>
 
    <div class="mediumMarginTop nMediumMarginBottom">
      <ion-text>Account To Credit:</ion-text>
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

    <div class="flexCenterRow">
      <div style="margin-left: -15px; margin-right: -4px">
      <InfoButton :infoMessage="snapShotInfo"/>
      </div>
      <div title="Interest Earned and Accrued Snapshot" class="progressBarStep flexCenterColumn nMediumSmallMarginLeft">
        <div class="nMediumSmallMarginTop"><ion-label>{{ snapShotValidCountDown }}</ion-label></div>
        <div v-if="snapShotValidCountDown!=0" class="finishedCircle"></div>
        <div v-else class="inProgressCircle"></div>
      </div>
      <div title="Withdraw" class="progressBarStep flexCenterColumn">
        <div class="inProgressCircle"></div>
      </div>
    </div>

    <ion-text v-if="!connectedWallet.isConnected" class="" style="font-size: 11px"
    >
      Connect wallet to liquidate
    </ion-text>

    <ion-button
      v-else-if="snapShotValidCountDown==0"
      id="borrowModalButton"
      color="dark"
      @click="updateUserSnapShots()"
      class="mediumSmallMarginTop nTinyMarginBottom"
    >
      Update SnapShots
    </ion-button>

    <ion-button
      v-else
      color="dark"
      @click="liquidateAccount()"
      class="mediumSmallMarginTop nTinyMarginBottom"
      :disabled="overByteSizeLimit || repayAmount==0 || snapShotValidCountDown==0"
    >
      Liquidate
    </ion-button>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, watch, computed, onUpdated } from 'vue'
  import { IonButton, IonText, IonLabel, IonInput, IonIcon } from '@ionic/vue'
  import { close } from 'ionicons/icons'
  import Select from 'primevue/select'
  import InputNumber from 'primevue/inputnumber'
  import EmojiButton from '/src/components/comments/emojis/EmojiButton.vue'
  import { anchorPrograms,
    SYSTEM_PROGRAM_ADDRESS_STRING,
    MAX_ACCOUNT_NAME_LENGTH } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey, Transaction } from "@solana/web3.js"
  import { confirmLendingTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenReservesHashMap, tokenReserveFontEndInfoHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketsHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserHashMap,
    lendingUserAccountsHashMap,
    lendingUserTabAccountListHashMap,
    lendingUserRemainingTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { tokenAddressStrings, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import InfoButton from '/src/components/help/InfoButton.vue'
  import HealthFactorSmall from '/src/components/smart contracts/lending protocol/HealthFactorSmall.vue'
  import { blockChainData } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { calculateNewBalance, calculateNewDebtBalance } from './HealthFactorInfo.ts'
  import { PythSolanaReceiver, InstructionWithEphemeralSigners } from "@pythnetwork/pyth-solana-receiver"
  import { HermesClient } from "@pythnetwork/hermes-client"
  import * as anchor from "@coral-xyz/anchor"

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue')

  var liquidatiDisplayName = ref()
  var accountDisplayName = ref()
  var borrowPositionToRepaySelect = ref()
  var borrowPositionToRepayList = ref()
  var selectedBorrowedAmount = ref()
  var depositPositionToLiquidateSelect = ref()
  var depositPositionToLiquidateList = ref()
  var selectedDepositedAmount = ref()
  var repayAmount = ref(0)
  var payableUserDebt = ref()
  var repaymentTokenDecimalAmount: number
  var repayIncrementAmount = ref()
  var repayMax = ref(false)
  var repayHalf = ref(false)
  var liquidationDecimalAmount: number
  
  var accountName = ref()
  var accountSelect = ref()
  var previousAccountSelect: number
  var accountList = ref()
  var hasAtleast1Account = ref()
  var accountNameEditInputRef = ref()
  var addingAdditionalLendingAccount = ref(false)
  var liquidating = ref(false)
  var borrowSVG = ref()
  var depositSVG = ref()
  var liquidatiAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var liquidatiAccountIndex: number
  var repaymentTokenProgram = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var repaymentTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var liquidationTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var healthFactorIntervalId: any
  var tabIntervalId: any

  var savedEmojiCursorPosition: any
  var overByteSizeLimit = ref()
  var totalAssetValue = ref(0)
  var totalDebtValue = ref(0)
  var modalRef = ref()

  var tabDepositHashMap = new Map<string, string>()
  var tabBorrowHashMap = new Map<string, string>()

  const snapShotInfo = "Info\n\n1. Snapshots of user earned\nand accrued interest no\nolder than 120 seconds are\nrequired for withdrawals\nand borrows.\n2. Withdraw tokens while\nSnapshots and are still\nvalid."
  var snapShotValidCountDown = ref(0)
  var snapShotCountDownIntervalId: any

  var solvent = computed (() =>
  {
    if(totalAssetValue.value > totalDebtValue.value)
      return true
    else
      return false
  })

  var repaymentValue = computed(() =>
  {
    const price = priceObjectMap.data[repaymentTokenMintAddress.toString()]?.usdPrice
    if(price)
      return (repayAmount.value * Number(price)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })        
    else
      return (0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })   
  })

  var liquidationAmountEquivalentToRepaymentAmount = computed(() =>
  {
    const price = priceObjectMap.data[liquidationTokenMintAddress.toString()]?.usdPrice
    if(price)
    {
      return (Number(repaymentValue.value) / Number(price))
    }   
    else
      return 0
  })

  var liquidationAmountWith7PercentBonus = computed(() =>
  {
    return (liquidationAmountEquivalentToRepaymentAmount.value * 1.07).toLocaleString('en-US', {
      minimumFractionDigits: liquidationDecimalAmount,
      maximumFractionDigits: liquidationDecimalAmount })  
  })

  var liquidation1PercentFee = computed(() =>
  {
    return (liquidationAmountEquivalentToRepaymentAmount.value * 0.01).toLocaleString('en-US', {
      minimumFractionDigits: liquidationDecimalAmount,
      maximumFractionDigits: liquidationDecimalAmount })  
  })

  var totalLiquidationAmount = computed(() =>
  {
    return (Number(liquidationAmountWith7PercentBonus.value) + Number(liquidation1PercentFee.value)).toLocaleString('en-US', {
        minimumFractionDigits: liquidationDecimalAmount,
        maximumFractionDigits: liquidationDecimalAmount })  
  })

  var TotalLiquidationValue = computed(() =>
  {
    const price = priceObjectMap.data[liquidationTokenMintAddress.toString()]?.usdPrice
    if(price)
    {
      return (Number(totalLiquidationAmount.value) * Number(price)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })  
    }   
    else
      return 0 
  })

  var liquidationAmountWith7PercentBonusValue = computed(() =>
  {
    const price = priceObjectMap.data[liquidationTokenMintAddress.toString()]?.usdPrice
    if(price)
    {
      return (Number(liquidationAmountWith7PercentBonus.value) * Number(price)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })  
    }   
    else
      return 0
  })

  var liquidation1PercentFeeValue = computed(() =>
  {
    const price = priceObjectMap.data[liquidationTokenMintAddress.toString()]?.usdPrice
    if(price)
    {
      return (Number(liquidation1PercentFee.value) * Number(price)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })  
    }   
    else
      return 0
  })

  const liquidationInfoMSG = "\nYou can repay up to 50% of\na Liquidati's debt position\nif it isn't insolvent and\nclaim a 7% bonus value on\nthe liquidated deposited\ncollateral that you choose.\n\nIf it is insolvent, you can\nrepay up to 100% of their\ndebt position, although\nthis is not immediately\nprofitable.\n\n A 1% bonus value fee is\nalso collected for the\nHODL Treasury\n"

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

  watch(lendingUserTabAccountListHashMap, async() =>
  {
    if(liquidating.value)
    {
      stopTabCalculation()
      startTabCalculation()
      clearSnapShotIntervalCountDown()
      await setSnapShotIntervalCountDown()
    }
  })

  //When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  const handleClickOutside = function(event: any) 
  {
    if(liquidating.value)
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
          liquidating.value = false
          if(addingAdditionalLendingAccount.value)
          {
            stopTabCalculation()
            stopHealthFactorCalculation()
            clearSnapShotIntervalCountDown()
            cancelAddingAdditionalLendingAccount()
            addingAdditionalLendingAccount.value = false
          }
          window.removeEventListener('click', handleClickOutside)
      }
    }
  }

  async function openLiquidationModal(ownerAddressString: string, accountIndex: number)
  {
    window.addEventListener('click', handleClickOutside)

    liquidatiDisplayName.value = getCustomOrTrimmedUserDisplayName(ownerAddressString)
    accountDisplayName.value = lendingUserHashMap.map.get(ownerAddressString + accountIndex.toString()).accountName
    liquidatiAddress = new PublicKey(ownerAddressString)
    liquidatiAccountIndex = accountIndex
    liquidating.value = true
    borrowPositionToRepaySelect.value = undefined
    depositPositionToLiquidateSelect.value = undefined
    
    stopTabCalculation()
    startTabCalculation()
    stopHealthFactorCalculation()
    startHealthFactorCalculation()
    clearSnapShotIntervalCountDown()
    await setSnapShotIntervalCountDown()
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
  }

  async function setSnapShotIntervalCountDown()
  {
    const allUserTabAccounts = lendingUserTabAccountListHashMap.map.get(liquidatiAddress.toString() + liquidatiAccountIndex.toString())
    const slot = await anchorPrograms.alert.alertProgram.provider.connection.getSlot()
    const currentBlockTimeStamp = await anchorPrograms.alert.alertProgram.provider.connection.getBlockTime(slot)
    var oldestSnapShot = Number(allUserTabAccounts[0].interestChangeLastUpdatedTimeStamp)

    for(var i=0; i<allUserTabAccounts.length; i++)
    {
      if(allUserTabAccounts[i].interestChangeLastUpdatedTimeStamp < oldestSnapShot)
        oldestSnapShot = Number(allUserTabAccounts[i].interestChangeLastUpdatedTimeStamp)
    }
    
    const timeDiff = currentBlockTimeStamp - oldestSnapShot

    if(timeDiff < 120)
    {
      snapShotValidCountDown.value = 120 - timeDiff

      snapShotCountDownIntervalId = setInterval(() =>
      {
        snapShotValidCountDown.value--

        if(snapShotValidCountDown.value <= 0)
          clearSnapShotIntervalCountDown()

      }, 1000)
    }
    else
      snapShotValidCountDown.value = 0
  }

  function clearSnapShotIntervalCountDown()
  {
    if(snapShotCountDownIntervalId != undefined)
    {
      clearInterval(snapShotCountDownIntervalId)
      snapShotCountDownIntervalId = undefined
    }
  }

  function calculateHealthFactorValues(timeStamp: number)
  {
    if(!lendingUserTabAccountListHashMap.map)
      return

    const userTabAccounts = lendingUserTabAccountListHashMap.map.get(liquidatiAddress.toString() + liquidatiAccountIndex.toString())

    var calculatedAssetValue = 0
    var calculatedDebtValue = 0

    if(userTabAccounts)
      for(var i=0; i<userTabAccounts.length; i++)
      {
        const price = priceObjectMap.data[userTabAccounts[i].tokenMintAddress.toString()].usdPrice
        const decimalAmount = tokenDecimalHashMap.get(userTabAccounts[i].tokenMintAddress.toString())
        const tabTokenReserve = tokenReservesHashMap.map.get(userTabAccounts[i].tokenMintAddress.toString())
        const subMarket = subMarketsHashMap.map.get(userTabAccounts[i].tokenMintAddress.toString() +
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
    
    const selectedBorrowedAmount = tabBorrowHashMap.get(borrowPositionToRepaySelect.value.repaymentTokenMintAddress.toString() +
    borrowPositionToRepaySelect.value.repaymentSubMarketOwnerAddress.toString() + 
    borrowPositionToRepaySelect.value.repaymentSubMarketIndex.toString())

    const selectedDepositedAmount = tabDepositHashMap.get(depositPositionToLiquidateSelect.value.liquidationTokenMintAddress.toString() +
    depositPositionToLiquidateSelect.value.liquidationSubMarketOwnerAddress.toString() + 
    depositPositionToLiquidateSelect.value.liquidationSubMarketIndex.toString())

    //If account insolvent, allow for entire debt to be paid off regardless of profitability
    if(calculatedDebtValue > calculatedAssetValue)
      payableUserDebt.value = selectedBorrowedAmount
    //If account solvent, guide user to only repay amount that is profitable
    else
    {
      //Calculate value of the normal max repayment (50% of debt position)
      const repaymentTokenPrice = priceObjectMap.data[repaymentTokenMintAddress.toString()]?.usdPrice
      const liquidationTokenPrice = priceObjectMap.data[liquidationTokenMintAddress.toString()]?.usdPrice
      
      const normal50PercentRepaymentValue = Number(selectedBorrowedAmount) * Number(repaymentTokenPrice) * 0.5
      const normalLiquidationEquivalentRepaymentAmount = normal50PercentRepaymentValue / Number(liquidationTokenPrice)
      
      if(selectedDepositedAmount)
        if(Number(selectedDepositedAmount) < normalLiquidationEquivalentRepaymentAmount * 1.08)//7% bonus liquidation amount + 1% fee amount
        {
          const inRangeDepositLiquidationAmount = Number(selectedDepositedAmount) / 1.08//7% bonus liquidation amount + 1% fee amount
          const inRangeDepositLiquidationValue = inRangeDepositLiquidationAmount * Number(liquidationTokenPrice)
          const inRangeRepaymentTokenAmount = inRangeDepositLiquidationValue / Number(repaymentTokenPrice)
          payableUserDebt.value = inRangeRepaymentTokenAmount
        }
        else
          payableUserDebt.value = Number(selectedBorrowedAmount) * 0.5
      else
        payableUserDebt.value = Number(selectedBorrowedAmount) * 0.5
    }

    if(repayHalf.value)
      repayAmount.value = payableUserDebt.value * 0.5
    if(repayMax.value)
      repayAmount.value = payableUserDebt.value

    totalAssetValue.value = calculatedAssetValue
    totalDebtValue.value = calculatedDebtValue
  }

  function startTabCalculation()
  {
    if(blockChainData.timeStamp == 0)
      return

    tabIntervalId = setInterval(() =>
    {
      generateTabLists(blockChainData.timeStamp)
    }, 55)
  }

  function stopTabCalculation()
  {
    if(tabIntervalId != undefined)
    {
      clearInterval(tabIntervalId)
      tabIntervalId = undefined
    }
  }

  function startHealthFactorCalculation()
  {
    if(blockChainData.timeStamp == 0)
      return

    healthFactorIntervalId = setInterval(() =>
    {
      calculateHealthFactorValues(blockChainData.timeStamp)
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

  function setRepaymentTokenMintAddress()
  {
    repayMax.value = false
    repayHalf.value = false
    repaymentTokenMintAddress = borrowPositionToRepaySelect.value.repaymentTokenMintAddress

    const tokenInfo = tokenReserveFontEndInfoHashMap.get(repaymentTokenMintAddress.toString())
    borrowSVG.value = tokenInfo.svg
    repaymentTokenDecimalAmount = tokenInfo.decimalAmount
    repaymentTokenProgram = tokenInfo.tokenProgram
    repayAmount.value = 0
  }

  function setLiquidationTokenMintAddress()
  {
    repayMax.value = false
    repayHalf.value = false
    liquidationTokenMintAddress = depositPositionToLiquidateSelect.value.liquidationTokenMintAddress

    const tokenInfo = tokenReserveFontEndInfoHashMap.get(liquidationTokenMintAddress.toString())
    depositSVG.value = tokenInfo.svg
    liquidationDecimalAmount = tokenInfo.decimalAmount
    repayAmount.value = 0
  }
  
  function generateTabLists(timeStamp: number)
  {
    if(!lendingUserTabAccountListHashMap.map || !liquidating.value)
      return

    const liquidatiTabList = lendingUserTabAccountListHashMap.map.get(liquidatiAddress.toString() + liquidatiAccountIndex.toString())
    if(!liquidatiTabList)
      return

    var borrowedTokenList = []
    var depositedTokenList = []
    var tempTabDepositHashMap = new Map<string, string>()
    var tempTabBorrowHashMap = new Map<string, string>()

    for(var i=0; i<liquidatiTabList.length; i++)
    {
      const tokenInfo = tokenReserveFontEndInfoHashMap.get(liquidatiTabList[i].tokenMintAddress.toString())
      const tokenName = tokenInfo.name
      const decimalAmount = tokenInfo.decimalAmount
      const borrowedAmount = Number(liquidatiTabList[i].borrowedAmount) / Math.pow(10, decimalAmount)
      const depositedAmount = Number(liquidatiTabList[i].depositedAmount) / Math.pow(10, decimalAmount)

      const tabTokenReserve = tokenReservesHashMap.map.get(liquidatiTabList[i].tokenMintAddress.toString())
      const subMarket = subMarketsHashMap.map.get(liquidatiTabList[i].tokenMintAddress.toString() +
      liquidatiTabList[i].subMarketOwnerAddress.toString() +
      liquidatiTabList[i].subMarketIndex.toString())

      const userBalanceWithInterestEarned = calculateNewBalance(
      tabTokenReserve,
      subMarket,
      depositedAmount,
      Number(liquidatiTabList[i].supplyInterestChangeIndex),
      timeStamp)

      const userDebtWithInterestAccrued =  calculateNewDebtBalance(
      tabTokenReserve,
      borrowedAmount,
      Number(liquidatiTabList[i].borrowInterestChangeIndex),
      timeStamp)

      if(userDebtWithInterestAccrued > 0)
      {
        const fixedUserDebtWithInterestAccrued = userDebtWithInterestAccrued.toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })

        const listOption = tokenName + " SubOwner: " + getCustomOrTrimmedUserDisplayName(liquidatiTabList[i].subMarketOwnerAddress.toString()) +
        " SubIndex " + liquidatiTabList[i].subMarketIndex
        const listValue = 
        {
          repaymentTokenMintAddress: liquidatiTabList[i].tokenMintAddress,
          repaymentSubMarketOwnerAddress: liquidatiTabList[i].subMarketOwnerAddress,
          repaymentSubMarketIndex: liquidatiTabList[i].subMarketIndex
        }

        tempTabBorrowHashMap.set(liquidatiTabList[i].tokenMintAddress.toString() +
        liquidatiTabList[i].subMarketOwnerAddress.toString() +
        liquidatiTabList[i].subMarketIndex.toString(), fixedUserDebtWithInterestAccrued)
 
        borrowedTokenList.push({ borrowedAmount: listOption, borrowInfo: listValue })
      }

      if(userBalanceWithInterestEarned > 0)
      {
        const fixeduserBalanceWithInterestEarned = userBalanceWithInterestEarned.toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })

        var depositValue = 0
        const price = priceObjectMap.data[liquidatiTabList[i].tokenMintAddress.toString()]?.usdPrice
        if(price)
          depositValue = userBalanceWithInterestEarned * Number(price)

        const listOption = tokenName + " SubOwner: " + getCustomOrTrimmedUserDisplayName(liquidatiTabList[i].subMarketOwnerAddress.toString()) +
        " SubIndex " + liquidatiTabList[i].subMarketIndex
        const listValue = 
        {
          liquidationTokenMintAddress: liquidatiTabList[i].tokenMintAddress,
          liquidationSubMarketOwnerAddress: liquidatiTabList[i].subMarketOwnerAddress,
          liquidationSubMarketIndex: liquidatiTabList[i].subMarketIndex,
          //depositedAmount: userBalanceWithInterestEarned,
          //depositedValue: depositValue
        }

        tempTabDepositHashMap.set(liquidatiTabList[i].tokenMintAddress.toString() +
        liquidatiTabList[i].subMarketOwnerAddress.toString() +
        liquidatiTabList[i].subMarketIndex.toString(), fixeduserBalanceWithInterestEarned)

        depositedTokenList.push({ depositedAmount: listOption, depositInfo: listValue })
      }
    }

    tabBorrowHashMap = tempTabBorrowHashMap
    tabDepositHashMap = tempTabDepositHashMap
    borrowPositionToRepayList.value = borrowedTokenList
    depositPositionToLiquidateList.value = depositedTokenList

    //Initalize borrowPositionToRepaySelect
    if(borrowPositionToRepaySelect.value == undefined)
    {
      borrowPositionToRepaySelect.value = borrowedTokenList[0].borrowInfo
      repaymentTokenMintAddress = borrowedTokenList[0].borrowInfo.repaymentTokenMintAddress
      
      const tokenInfo = tokenReserveFontEndInfoHashMap.get(repaymentTokenMintAddress.toString())
      repaymentTokenDecimalAmount = tokenInfo.decimalAmount
      repaymentTokenProgram = tokenInfo.tokenProgram
      borrowSVG.value = tokenInfo.svg

      repayIncrementAmount.value = 1 / Math.pow(10, repaymentTokenDecimalAmount)
      selectedBorrowedAmount.value = tabBorrowHashMap.get(repaymentTokenMintAddress.toString() +
      borrowedTokenList[0].borrowInfo.repaymentSubMarketOwnerAddress.toString() + 
      borrowedTokenList[0].borrowInfo.repaymentSubMarketIndex.toString())
      
    }
    //Update borrow position to repay amount
    else
    {
      selectedBorrowedAmount.value = tabBorrowHashMap.get(borrowPositionToRepaySelect.value.repaymentTokenMintAddress.toString() +
      borrowPositionToRepaySelect.value.repaymentSubMarketOwnerAddress.toString() + 
      borrowPositionToRepaySelect.value.repaymentSubMarketIndex.toString())
    }

    //Initalize depositPositionToLiquidateSelect
    if(depositPositionToLiquidateSelect.value == undefined)
    {
      depositPositionToLiquidateSelect.value = depositedTokenList[0].depositInfo
      liquidationTokenMintAddress = depositedTokenList[0].depositInfo.liquidationTokenMintAddress
      
      const tokenInfo = tokenReserveFontEndInfoHashMap.get(liquidationTokenMintAddress.toString())
      liquidationDecimalAmount = tokenInfo.decimalAmount
      depositSVG.value = tokenInfo.svg

      selectedDepositedAmount.value = tabDepositHashMap.get(liquidationTokenMintAddress.toString() +
      depositedTokenList[0].depositInfo.liquidationSubMarketOwnerAddress.toString() + 
      depositedTokenList[0].depositInfo.liquidationSubMarketIndex.toString())
    }
    //Update deposition position to liquidate amount
    else
    {
      selectedDepositedAmount.value = tabDepositHashMap.get(liquidationTokenMintAddress.toString() +
      depositedTokenList[0].depositInfo.liquidationSubMarketOwnerAddress.toString() + 
      depositedTokenList[0].depositInfo.liquidationSubMarketIndex.toString())
    }
  }

  async function updateUserSnapShots()
  {
    const lendingUserTabAccounts = lendingUserTabAccountListHashMap.map.get(liquidatiAddress.toString() + liquidatiAccountIndex.toString())
    const transaction = new Transaction()

    try
    {
      for(var i=0; i<lendingUserTabAccounts.length; i++)
      {
        const instruction = await anchorPrograms.lending.lendingProgram.methods.updateUserSnapShot
        (
          lendingUserTabAccounts[i].tokenMintAddress,
          lendingUserTabAccounts[i].subMarketOwnerAddress,
          lendingUserTabAccounts[i].subMarketIndex,
          lendingUserTabAccounts[i].owner,
          accountSelect.value
        ).instruction()

        transaction.add(instruction);
      }

      const tx = await anchorPrograms.lending.lendingProgram.provider.sendAndConfirm(transaction, []);
      await confirmLendingTransaction(tx, toast, "update_user_snap_shots")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "update_user_snap_shots")
    }
  }

  async function liquidateAccount()
  {
    var payingOffInsolventAccount = false

    if(repayMax.value && !solvent)
      payingOffInsolventAccount = true

    const remainingTabAccounts = lendingUserRemainingTabAccountListHashMap.map.get(liquidatiAddress.toString() + liquidatiAccountIndex.toString())
    var pythIdArray: string[] = []

    for(var i=0; i<remainingTabAccounts.length; i++)
    {
      const tokenInfo = tokenReserveFontEndInfoHashMap.get(remainingTabAccounts[i].tokenMintAddress)
      pythIdArray.push(tokenInfo.pythId)
    }

    const hermesClient = new HermesClient("https://hermes.pyth.network/")
    const pythSolanaReceiver = new PythSolanaReceiver(
    {
      connection: anchorPrograms.lending.connection,
      wallet: anchorPrograms.lending.wallet,
    })

    const priceUpdateData = await hermesClient.getLatestPriceUpdates(pythIdArray, { encoding: "base64" })
    const transactionBuilder = pythSolanaReceiver.newTransactionBuilder({ closeUpdateAccounts: true })

    await transactionBuilder.addPostPriceUpdates(priceUpdateData.binary.data)
    await transactionBuilder.addPriceConsumerInstructions
    (
      async(
        getPriceUpdateAccount: (priceFeedId: string) => PublicKey
      ): Promise<InstructionWithEphemeralSigners[]> =>
      {
        var remainingAccounts = []

        for(var i=0; i<pythIdArray.length; i++)
        {
          remainingAccounts.push(remainingTabAccounts[i])

          const ephemeralPythKey = getPriceUpdateAccount(pythIdArray[i]);

          const ephemeralPythPriceUpdateRemainingAccount = 
          {
            pubkey: ephemeralPythKey,
            isSigner: false,
            isWritable: true
          }

          remainingAccounts.push(ephemeralPythPriceUpdateRemainingAccount)
        } 

        return [
          {
            instruction: await anchorPrograms.lending.lendingProgram.methods.liquidateAccount
            (
              repaymentTokenMintAddress,
              liquidationTokenMintAddress,
              borrowPositionToRepaySelect.value.repaymentSubMarketOwnerAddress,
              borrowPositionToRepaySelect.value.repaymentSubMarketIndex,
              depositPositionToLiquidateSelect.value.liquidationSubMarketOwnerAddress,
              depositPositionToLiquidateSelect.value.liquidationSubMarketIndex,
              liquidatiAddress,
              liquidatiAccountIndex,
              accountSelect.value,
              new anchor.BN(repayAmount.value * Math.pow(10, repaymentTokenDecimalAmount)),//convert to fixedpoint notation
              repayMax.value,
              payingOffInsolventAccount,
              accountName.value
            ).accounts({ repaymentMint: repaymentTokenMintAddress, repaymentTokenProgram: repaymentTokenProgram })
            .remainingAccounts(remainingAccounts)
            .instruction(),
            signers: []
          },
        ]
      }
    )

    try
    {
      const tx = await pythSolanaReceiver.provider.sendAll
      (
        await transactionBuilder.buildVersionedTransactions({ computeUnitPriceMicroLamports: 50000 }), { skipPreflight: false }
      )
    
      if(tx.length)
        for(var i=0; i<tx.length; i++)
          await confirmLendingTransaction(tx[i], toast, "borrow_tokens")
      else
        await confirmLendingTransaction(tx, toast, "borrow_tokens")

      stopHealthFactorCalculation()
      clearSnapShotIntervalCountDown()
      liquidating.value = false
    }
    catch(error: any)
    {
      if(error.message.includes("\"Custom\":6000"))//These error code numbers don't match the idl exactly for some reason, but I've confirmed these are the proper error messages
        toastPreTransactionError("StalePriceData: The price data was stale", toast, "liquidate_account")
      else if(error.message.includes("\"Custom\":6001"))//These error code numbers don't match the idl exactly for some reason, but I've confirmed these are the proper error messages
        toastPreTransactionError("StaleSnapShot: The Lending User snap shot data was stale", toast, "liquidate_account")
      else
        toastPreTransactionError(error, toast, "liquidate_account")  
    }
  }

  defineExpose(
  {
    openLiquidationModal
  })
</script>

<style scoped>
  #liquidationModal
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

  .flexCenterRow 
  {
    gap: 10px
  }

  .inProgressCircle 
  {
    width: 20px;
    height: 20px;
    border: thin solid v-bind(colorHexValue);
  }

  .finishedCircle 
  {
    width: 20px;
    height: 20px;
    background-color: v-bind(colorHexValue);
  }

  .progressBarStep
  {
    width: 20px
  }
</style>