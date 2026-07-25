<template>
  <div v-if="withdrawing"
    id="withdrawalModal"
    class="thickBorder"
    ref="modalRef"
  >
    <div class="nMediumSmallMarginTop nMediumMarginBottom flexCenterRow">
      <ion-button fill="clear" @click="openTokenPopover($event)">
        <component :is="withdrawSVG" style="width: 44px"></component>
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

    <div class="flexCenterColumn selectionContainer">
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

      <HealthFactorSmall :assetValue="totalAssetValue" :debtValue="totalDebtValue"/>
    </div>

    <div>
      <ion-label class="alignSelfLeft">Balance: {{ userBalance.toLocaleString('en-US', {
        minimumFractionDigits: tokenDecimalAmount,
        maximumFractionDigits: tokenDecimalAmount }) }}
      </ion-label>
      <ion-label class="alignSelfLeft">Available: {{ availableWithdrawalBalance.toLocaleString('en-US', {
        minimumFractionDigits: tokenDecimalAmount,
        maximumFractionDigits: tokenDecimalAmount }) }}
      </ion-label>
      <ion-label class="alignSelfLeft">Token Reserve: {{ availableInTokenReserveAmount?.toLocaleString('en-US', {
        minimumFractionDigits: tokenDecimalAmount,
        maximumFractionDigits: tokenDecimalAmount }) }}
      </ion-label>
    </div>
    <InputNumber
      v-model="withdrawAmount"
      :inputStyle="{'text-align': 'center'}"
      :minFractionDigits="tokenDecimalAmount" :maxFractionDigits="tokenDecimalAmount"
      :max="maxWithdrawAmount"
      :min="0"
      :step="withdrawIncrementAmount"
      showButtons
      fluid
      @input="(event: { value: any }) => withdrawAmount = event.value"
      @focus="withdrawMax=false; withdrawHalf=false"
    />
    <div class="alignSelfLeft">
      <button style="background-color: transparent" @click="withdrawHalf=false; withdrawMax=true">
        <ion-label color="dark">Max</ion-label>
      </button>

      <button class="mediumSmallMarginLeft" style="background-color: transparent" @click="withdrawMax=false; withdrawHalf=true">
        <div style="margin-top: 2px"><ion-label color="dark">Half</ion-label></div>
      </button>
    </div>

    <div class="smallMarginTop">
      <ion-text>Value: ${{ withdrawValue }}</ion-text>
    </div>

    <div v-if="connectedWallet.isTempPriceAccountAlive" class="flexCenterColumn">
      <br>
      <ion-text>{{ TEMP_PRICE_ACCOUNT_ALIVE_MSG }}</ion-text>
      <ion-button :color="colorName" @click="closeTempOraclePriceData(toast)">
        Close Temp Price Account
      </ion-button>
    </div>
    <div v-else-if="anchorPrograms.isLendingProtocolReady && connectedWallet.lendingUserLUTAccountReady">
      <ion-button
        id="withdrawModalButton"
        color="dark"
        @click="withdrawTokens()"
        class="mediumSmallMarginTop nTinyMarginBottom"
        :disabled="withdrawAmount==0"
      >
        Withdraw
      </ion-button>
      <div v-if="connectedWallet.missingLUTAddresses.length >= 1" class="nLargeMarginLeft tinyMarginTop nSmallMarginBottom">
        <AddMissingUserLUTAddresses/>
      </div>
    </div>
    <ion-text v-else>Loading</ion-text>
  </div>
</template>

<script setup lang="ts">
  import { onUnmounted, ref, inject, watch, computed } from 'vue'
  import { IonButton, IonText, IonPopover, IonLabel } from '@ionic/vue'
  import Select from 'primevue/select'
  import InputNumber from 'primevue/inputnumber'
  import { anchorPrograms, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { copyAddress,
    copyTokenMintAddressText,
    confirmLendingTransaction,
    parseProgramErrorCode,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { sendVersionedLendingProtocolTransaction,
    userSignsLendingTransactions,
    bundleProtocolPriceTransactions,
    getNeccessaryRefreshInstructionData,
    getTokenReserveRemainingAccounts,
    getTempRemainingPriceAccount,
    closeTempOraclePriceData,
    TEMP_PRICE_ACCOUNT_ALIVE_MSG } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { tokenReservesHashMap,
    tokenReserveFontEndInfoHashMap,
    tokenReserveBalancesHashMap,
    tokenIdHashMap,
    priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketLookUpTableByOwnerHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { subMarketsHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserAccountsHashMap,
    lendingUserTabAccountsHashMap,
    lendingUserTabAccountListHashMap,
    lendingUserRemainingTabAccountListHashMap, } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenAddressStrings, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import * as anchor from "@coral-xyz/anchor"
  import cloneDeep from 'lodash/cloneDeep'
  import HealthFactorSmall from '/src/components/smart contracts/lending protocol/HealthFactorSmall.vue'
  import { unixData } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { calculateNewBalance, calculateNewDebtBalance, getCompoundingFactor } from './InterestCalcHelpers.ts'
  import AddMissingUserLUTAddresses from '/src/components/smart contracts/lending protocol/AddMissingUserLUTAddresses.vue'
  import * as bs58 from 'bs58'

  const toast = inject('toast')
  const colorName = inject('colorName') as string
  const colorHexValue = inject('colorHexValue') as string

  var tokenReserve: any
  var lendingUserTabAccount: any
  var subMarketSelect = ref(0)
  var subMarketList = ref()
  var accountSelect = ref(0)
  var accountList = ref()
  var withdrawAmount = ref()
  var withdrawIncrementAmount = ref()
  var withdrawing = ref(false)
  var withdrawSVG = ref()
  var withdrawMax = ref(false)
  var withdrawHalf = ref(false)
  var subMarketTokenName = ref()
  var userBalance = ref()
  var userOriginalBalance = 0
  var availableWithdrawalBalance = ref(0)
  var availableInTokenReserveAmount = ref(0)
  var maxWithdrawAmount = 0
  var userHasDebt = false
  var selectedTokenId = 0
  var selectedTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var tokenDecimalAmount: number
  var tokenProgram: PublicKey
  var interestEarnedIntervalId: any
  var healthFactorIntervalId: any

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)

  var totalAssetValue = ref(0)
  var totalDebtValue = ref(0)
  var modalRef = ref()

  var withdrawValue = computed (() =>
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

  onUnmounted(() =>
  {
    stopInterestCalculation()
    stopHealthFactorCalculation()
    withdrawMax.value = false
    withdrawHalf.value = false
    withdrawing.value = false
    window.removeEventListener('click', handleClickOutside)
  })

  watch(tokenReserveBalancesHashMap, () =>
  {
    if(withdrawing.value)
      availableInTokenReserveAmount.value = tokenReserveBalancesHashMap.map.get(selectedTokenId)
  })

  watch(lendingUserTabAccountListHashMap, async() =>
  {
    if(withdrawing.value)//Don't start another count down if on another modal since the withdrawal modal is still mounted even when not visible
    {
      setInitialBalance()
      stopInterestCalculation()
      startInterestCalculation()
      stopHealthFactorCalculation()
      startHealthFactorCalculation()
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
    if(withdrawing.value)
    {
      let newWallet = JSON.parse(newJSONObjectString)
      let oldWallet = JSON.parse(oldJSONObjectString)

      //Only want this running if the connected Wallet Address String is changing and modal is visible
      if(!withdrawing.value ||
      (newWallet.addressString == oldWallet.addressString &&
      newWallet.selectedLendingUserAccountIndex == oldWallet.selectedLendingUserAccountIndex))
        return

      accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
      withdrawAmount.value = 0

      setInitialBalance()
      stopInterestCalculation()
      startInterestCalculation()
      stopHealthFactorCalculation()
      startHealthFactorCalculation()
    }
  })
  
  //When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  const handleClickOutside = (event: any) => 
  {
    if(withdrawing.value && modalRef.value)
    {
      const dataPcSectionValue = event?.target?.getAttribute('data-pc-section')

      if(!modalRef.value.contains(event?.target) &&
      !event?.target?.classList.contains("jitoWarning") &&
      !event?.target?.classList.contains("lendingActionButton") &&
      !event?.target?.classList.contains("copyTokenMintAddressButton") &&
      !event?.target?.classList.contains("infoButtonPopover") &&
      !event?.target?.classList.contains("infoButtonText") &&
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast text from closing modal
      !event?.target?.classList.contains("p-toast-close-icon") && //Keep transaction toast close button from closing modal
      !event?.target?.classList.contains("p-toast-close-button") && //Keep transaction toast close button from closing modal
      !dataPcSectionValue?.includes('button container') && //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path')) //Keep transaction toast close button from sometimes closing modal
      {
        stopInterestCalculation()
        stopHealthFactorCalculation()
        withdrawMax.value = false
        withdrawHalf.value = false
        withdrawing.value = false
        window.removeEventListener('click', handleClickOutside)
      }  
    }
  }

  async function openWithdrawalModal(tokenId:number, tokenMintAddress: string, subMarkets: any[])
  {
    window.addEventListener('click', handleClickOutside)

    tokenReserve = cloneDeep(tokenReservesHashMap.map.get(tokenId))//cloneDeep to keep changes to tokenReserve variable from setting off tokenReservesHashMap watchers
    const tokenInfo = tokenReserveFontEndInfoHashMap.get(tokenId)
    const tokenName = tokenInfo.name
    const decimalAmount = tokenInfo.decimalAmount
    const tokenSVG = tokenInfo.svg
    
    tokenProgram = tokenInfo.tokenProgram
    subMarketList.value = subMarkets

    const tokenReserveBalance = tokenReserveBalancesHashMap.map.get(tokenId)
    if(tokenReserveBalance)
      availableInTokenReserveAmount.value = tokenReserveBalance
    else
      availableInTokenReserveAmount.value = 0

    subMarketSelect.value = Number(localStorage.getItem(tokenId.toString() +
    connectedWallet.addressString +
    connectedWallet.selectedLendingUserAccountIndex.toString() +
     "selectedMainSubMarketIndex")) || 0

    const isIndexContained = subMarkets.some(item => item.subMarketIndex === subMarketSelect.value)
    if(!isIndexContained)
      subMarketSelect.value = subMarkets[0].subMarketIndex

    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex

    setDefaultSubMarketTo1WithDebt(subMarkets)

    if(lendingUserAccountsHashMap.map)
    {
      const userAccountList = lendingUserAccountsHashMap.map.get(connectedWallet.addressString)
      if(userAccountList)
        accountList.value = userAccountList
    }

    withdrawAmount.value = 0
    withdrawIncrementAmount.value = 1 / Math.pow(10, decimalAmount)
    selectedTokenId = tokenId
    selectedTokenMintAddress = new PublicKey(tokenMintAddress)
    
    tokenDecimalAmount = decimalAmount
    withdrawSVG.value = tokenSVG
    subMarketTokenName.value = tokenName
    withdrawing.value = true

    setDefaultSubMarketTo1WithDebt(subMarkets)
    setInitialBalance()
    stopInterestCalculation()
    startInterestCalculation()
    stopHealthFactorCalculation()
    startHealthFactorCalculation()
  }

  function setDefaultSubMarketTo1WithDebt(subMarkets: any[])
  {
    //Check if initial setting has a balance
    let tempLendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(selectedTokenId.toString() +
    adminAccounts.lendingCEOAddressString +
    subMarketSelect.value.toString() +
    connectedWallet.addressString +
    accountSelect.value.toString())

    if(tempLendingUserTabAccount)
    {
      const balance = Number(tempLendingUserTabAccount.depositedAmount) / Math.pow(10, tokenDecimalAmount)//Convert from fixed point notation to decimal
      if(balance > 0)
        return
    }

    //Set initial submarket to one with a balance for withdrawal
    for(var i=0; i<subMarkets.length; i++)
    {
      let tempLendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(selectedTokenId.toString() +
      adminAccounts.lendingCEOAddressString +
      subMarkets[i].subMarketIndex.toString() +
      connectedWallet.addressString +
      accountSelect.value.toString())

      if(tempLendingUserTabAccount)
      {
        const balance = Number(tempLendingUserTabAccount.depositedAmount) / Math.pow(10, tokenDecimalAmount)//Convert from fixed point notation to decimal
        if(balance > 0)
        {
          subMarketSelect.value = subMarkets[i].subMarketIndex
          return
        }
      }
    }
    
    return
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

  async function updateStoredSelectedAccount()
  {
    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
    localStorage.setItem("selectedLendingAccountIndex" + connectedWallet.addressString, accountSelect.value.toString())
  }

  function setInitialBalance()
  {
    lendingUserTabAccount = cloneDeep(lendingUserTabAccountsHashMap.map.get(selectedTokenId.toString() +
    adminAccounts.lendingCEOAddressString +
    subMarketSelect.value.toString() +
    connectedWallet.addressString +
    accountSelect.value.toString()))

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

        calculatedAssetValue += userBalanceWithInterestEarned / Math.pow(10, decimalAmount) * Number(price)
        calculatedDebtValue += userDebtWithInterestAccrued / Math.pow(10, decimalAmount) * Number(price)
      }
    
    const priceOfSelectedToken = Number(priceObjectMap.data[selectedTokenMintAddress.toString()].usdPrice)

    if(calculatedDebtValue == 0)
    {
      availableWithdrawalBalance.value = userBalance.value
      userHasDebt = false
    }
    else
    {
      const availableValueBeforeWithdraw = calculatedAssetValue - calculatedDebtValue / 0.7
      const availableToWithdrawAmount = availableValueBeforeWithdraw / priceOfSelectedToken

      //The available value to withdraw might be higher than a specific token amount that the user has deposited if they have different tokens deposited.
      if(availableToWithdrawAmount >= userBalance.value)
        availableWithdrawalBalance.value = userBalance.value
      else
        availableWithdrawalBalance.value = availableToWithdrawAmount

      userHasDebt = true
    }

    if(withdrawHalf.value || withdrawMax.value)
    {
      if(availableInTokenReserveAmount.value < 0)
        withdrawAmount.value = 0
      else if(availableInTokenReserveAmount.value < availableWithdrawalBalance.value)
        withdrawAmount.value = availableInTokenReserveAmount.value
      else
        if(withdrawHalf.value)
          if(availableWithdrawalBalance.value < 0)
            withdrawAmount.value = 0
          else
            withdrawAmount.value = availableWithdrawalBalance.value * 0.5
        else if(withdrawMax.value)
          withdrawAmount.value = availableWithdrawalBalance.value < 0 ? 0 : availableWithdrawalBalance.value

      maxWithdrawAmount = withdrawAmount.value
    }
    else
      if(availableInTokenReserveAmount.value < availableWithdrawalBalance.value)
        maxWithdrawAmount = availableInTokenReserveAmount.value
      else
        maxWithdrawAmount = availableWithdrawalBalance.value < 0 ? 0 : availableWithdrawalBalance.value

    //Account for value that is about to be withdrawn
    //Check for less than zero values when doing complete withdrawals, due to the price possibly being slighly off
    calculatedAssetValue -= withdrawAmount.value * Number(priceOfSelectedToken)
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

  async function withdrawTokens()
  {
    try
    {
      const remainingTabAccounts = lendingUserRemainingTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())
      var instructionsToSend = []
      var lookUpTableAccounts = []
      var refreshingUserRemainingAccounts = []
      
      //Get Lending Protocol Look Up Table Account
      lookUpTableAccounts.push(anchorPrograms.lendingProtocolLookUpTableAccount)

      //Get Lending User Look Up Table Account
      lookUpTableAccounts.push(connectedWallet.lendingUserLookUpTableAccount)
      
      if(totalDebtValue.value != 0)
      {
        const [uniqueTokenIds, createMonthlyStatementInstructions, lendingTabSubMarketAndMonthlyStatementRemainingAccounts, subMarketOwnerArray] =
        await getNeccessaryRefreshInstructionData(remainingTabAccounts, connectedWallet.publicKey, accountSelect.value)

        //Get SubMarket Look Up Table
        //Only worth if there are 2 or more submarkets of the same owner.
        for(var i=0; i<subMarketOwnerArray.length; i++)
        {
          if(subMarketOwnerArray[i].count >= 2)
          {
            const subMarketLookTableAccount = subMarketLookUpTableByOwnerHashMap.map.get(subMarketOwnerArray[i].subMarketOwnerAddress)
            lookUpTableAccounts.push(subMarketLookTableAccount)
          }
        }

        const uniqueTokenReserveRemainingAccounts = getTokenReserveRemainingAccounts(uniqueTokenIds)
        const tempPriceRemainingAccount = getTempRemainingPriceAccount()

        refreshingUserRemainingAccounts.push(tempPriceRemainingAccount)
        refreshingUserRemainingAccounts.push(...uniqueTokenReserveRemainingAccounts)
        refreshingUserRemainingAccounts.push(...lendingTabSubMarketAndMonthlyStatementRemainingAccounts)

        const refreshUserHealthAndTokenReservesInstruction = await anchorPrograms.lending.lendingProgram.methods.refreshUserHealthChunkAndTokenReserves(accountSelect.value,
          uniqueTokenReserveRemainingAccounts.length,
          lendingTabSubMarketAndMonthlyStatementRemainingAccounts.length / 3,
          false
        )
        .accounts({ lendingUserOwner: connectedWallet.publicKey })
        .remainingAccounts(refreshingUserRemainingAccounts)
        .instruction()

        const withdrawInstruction = await anchorPrograms.lending.lendingProgram.methods.withdrawTokens(
        subMarketSelect.value,
        accountSelect.value,
        new anchor.BN(withdrawAmount.value * Math.pow(10, tokenDecimalAmount)), //convert to fixedpoint notation
        withdrawMax.value
        )
        .accounts({
          subMarketOwner: adminAccounts.lendingCEOAddressKey,
          tokenMint: selectedTokenMintAddress,
          tokenProgram: tokenProgram })
        .remainingAccounts([tempPriceRemainingAccount, adminAccounts.priceOracleRemainingAccount])
        .instruction()

        instructionsToSend.push(...createMonthlyStatementInstructions)
        instructionsToSend.push(refreshUserHealthAndTokenReservesInstruction)
        instructionsToSend.push(withdrawInstruction)

        const signedTransactions = await userSignsLendingTransactions(instructionsToSend, lookUpTableAccounts)

        for(var i=0; i<signedTransactions.length; i++)
        {
          const size = signedTransactions[i].serialize().length
          console.log(`Signed Transaction Size: ${size} bytes`)
        }

        await bundleProtocolPriceTransactions([...uniqueTokenIds], signedTransactions)

        var userTxs = []
    
        for(var i=0; i<signedTransactions.length; i++)
          userTxs.push(bs58.default.encode(signedTransactions[i].signatures[0]))

        if(userTxs.length)
          for(var i=0; i<userTxs.length; i++)
            await confirmLendingTransaction(userTxs[i], toast, "withdraw_tokens")
        else
          await confirmLendingTransaction(userTxs, toast, "withdraw_tokens")
      }
      else
      {
        const withdrawInstruction = await anchorPrograms.lending.lendingProgram.methods.withdrawTokens(
        subMarketSelect.value,
        accountSelect.value,
        new anchor.BN(withdrawAmount.value * Math.pow(10, tokenDecimalAmount)), //convert to fixedpoint notation
        withdrawMax.value
        )
        .accounts({
          tokenMint: selectedTokenMintAddress,
          subMarketOwner: adminAccounts.lendingCEOAddressKey,
          tokenProgram: tokenProgram })
        .instruction()

        instructionsToSend.push(withdrawInstruction)

        const tx = await sendVersionedLendingProtocolTransaction(instructionsToSend, lookUpTableAccounts)
        await confirmLendingTransaction(tx, toast, "withdraw_tokens")
      }
      
      stopInterestCalculation()
      stopHealthFactorCalculation()
      withdrawMax.value = false
      withdrawHalf.value = false
      withdrawing.value = false
    }
    catch(error: any)
    {
      var errorMessage = parseProgramErrorCode(error, anchorPrograms.lending.lendingProgram)
      toastPreTransactionError(errorMessage, toast, "withdraw_tokens")
    }
  }

  function updateStoredSelectedSubMarketIndex(tokenId: number, subMarketIndex: string)
  {
    withdrawAmount.value = 0

    localStorage.setItem(tokenId.toString() +
    connectedWallet.addressString +
    connectedWallet.selectedLendingUserAccountIndex.toString() +
     "selectedMainSubMarketIndex", subMarketIndex)

    setInitialBalance()
    stopInterestCalculation()
    startInterestCalculation()
    stopHealthFactorCalculation()
    startHealthFactorCalculation()
  }

  defineExpose(
  {
    openWithdrawalModal
  })
</script>

<style scoped>
  #withdrawalModal
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