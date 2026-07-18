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
        <ion-button class="copyTokenMintAddressButton" color="green" @click="passByRefWrapperCopyTokenMintAddress()" @mouseleave="closeTokenPopover($event)">
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
    @change="updateStoredSelectedSubMarketIndex(selectedTokenId, subMarketSelect.toString())">
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

    <HealthFactorSmall :assetValue="totalAssetValue" :debtValue="totalDebtValue"/>

    <ion-label class="alignSelfLeft">Wallet: {{ userWalletBalance.toLocaleString('en-US', {
      minimumFractionDigits: tokenDecimalAmount,
      maximumFractionDigits: tokenDecimalAmount }) }}
    </ion-label>
    <ion-label class="alignSelfLeft">Debt: {{ userDebt.toLocaleString('en-US', {
      minimumFractionDigits: tokenDecimalAmount,
      maximumFractionDigits: tokenDecimalAmount }) }}
    </ion-label>
    <InputNumber
      v-model="repayAmount"
      :inputStyle="{'text-align': 'center'}"
      :minFractionDigits="tokenDecimalAmount" :maxFractionDigits="tokenDecimalAmount"
      :max="userWalletBalance < userDebt ? userWalletBalance : userDebt"
      :min="0"
      :step="repayIncrementAmount"
      showButtons
      fluid
      @input="(event: { value: any }) => repayAmount = event.value"
      @focus="repayMax=false; repayHalf=false"
    />
    <div class="alignSelfLeft">
      <button style="background-color: transparent" @click="repayAmount=userWalletBalance < userDebt ? userWalletBalance : userDebt;
        repayHalf=false; repayMax=true">
        <ion-label color="dark">Max</ion-label>
      </button>

      <button class="mediumSmallMarginLeft" style="background-color: transparent" @click="repayAmount=userWalletBalance < userDebt*0.5 ? userWalletBalance : userDebt*0.5;
        repayMax=false; repayHalf=true">
        <ion-label color="dark">Half</ion-label>
      </button>
    </div>

    <div class="smallMarginTop">
      <ion-text>Value: ${{ repayValue }}</ion-text>
    </div>

    <div v-if="connectedWallet.isTempPriceAccountAlive" class="flexCenterColumn">
      <br>
      <ion-text>Your temp price data account is alive. You must close it before you can call the repay function.</ion-text>
      <ion-button :color="colorName" @click="closeTempOraclePriceData(toast)">
        Close Temp Price Account
      </ion-button>
    </div>
    <div v-else-if="anchorPrograms.isLendingProtocolReady && connectedWallet.lendingUserLUTAccountReady">
      <ion-button
        id="repayButton"
        color="dark"
        @click="repayTokens()"
        class="mediumSmallMarginTop nTinyMarginBottom"
        :disabled="repayAmount == 0"
      >
        Repay
      </ion-button>
      <div class="nLargeMarginLeft tinyMarginTop nSmallMarginBottom">
        <AddMissingUserLUTAddresses/>
      </div>
    </div>
    <ion-text v-else>Loading</ion-text>
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
  import { copyAddress,
    copyTokenMintAddressText,
    confirmLendingTransaction,
    parseProgramErrorCode,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { userSignsLendingTransactions,
    bundleProtocolPriceTransactions,
    getNeccessaryRefreshInstructionData,
    getTokenReserveRemainingAccounts,
    getTempRemainingPriceAccount,
    closeTempOraclePriceData } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { tokenReservesHashMap, tokenReserveFontEndInfoHashMap, tokenIdHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketsHashMap, subMarketLookUpTableByOwnerHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserAccountsHashMap,
    lendingUserTabAccountsHashMap,
    lendingUserTabAccountListHashMap,
    lendingUserRemainingTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenAddressStrings, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import * as anchor from "@coral-xyz/anchor"
  import cloneDeep from 'lodash/cloneDeep'
  import { unixData } from '/src/assets/globalStates/AnchorPrograms.vue'
  import HealthFactorSmall from '/src/components/smart contracts/lending protocol/HealthFactorSmall.vue'
  import { calculateNewBalance, calculateNewDebtBalance, getCompoundingFactor  } from './InterestCalcHelpers.ts'
  import AddMissingUserLUTAddresses from '/src/components/smart contracts/lending protocol/AddMissingUserLUTAddresses.vue'
  import * as bs58 from 'bs58'

  const toast = inject('toast')
  const colorName = inject('colorName') as string
  const colorHexValue = inject('colorHexValue') as string

  var tokenReserve: any
  var lendingUserTabAccount: any
  var subMarketSelect = ref()
  var subMarketList = ref()
  var accountSelect = ref()
  var accountList = ref()
  var repayAmount = ref()
  var repayIncrementAmount = ref()
  var repaying = ref(false)
  var repaySVG = ref()
  var repayMax = ref(false)
  var repayHalf = ref(false)
  var subMarketTokenName = ref()
  var userWalletBalance = ref()
  var userDebt = ref(0)
  var userOriginalDebt = 0
  var selectedTokenId = 0
  var selectedTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var tokenDecimalAmount: number
  var tokenProgram: PublicKey
  var interestAccruedIntervalId: any
  var healthFactorIntervalId: any

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)
  var totalAssetValue = ref(0)
  var totalDebtValue = ref(0)
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

  watch(lendingUserTabAccountListHashMap, async() =>
  {
    if(repaying.value)//Don't start another count down if on another modal since the repayment modal is still mounted even when not visible
    {
      setInitialDebtBalance()
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
    if(repaying.value)
    {
      let newWallet = JSON.parse(newJSONObjectString)
      let oldWallet = JSON.parse(oldJSONObjectString)

      //Only want this running if the connected Wallet Address String is changing and modal is visible
      if((newWallet.addressString == oldWallet.addressString
      && newWallet.selectedLendingUserAccountIndex == oldWallet.selectedLendingUserAccountIndex))
        return

      const balance = connectedWallet.tokenBalanceMap.get(selectedTokenId)
      if(balance)
        userWalletBalance.value = Number(balance)
      else
        userWalletBalance.value = 0

      setInitialDebtBalance()
      stopInterestCalculation()
      startInterestCalculation()
      stopHealthFactorCalculation()
      startHealthFactorCalculation()
      accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
    }
  })

  //When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  const handleClickOutside = (event: any) => 
  {
    if(repaying.value && modalRef.value)
    {
      const dataPcSectionValue = event?.target?.getAttribute('data-pc-section')
      
      if(!modalRef.value.contains(event?.target) &&
      !event?.target?.classList.contains("jitoWarning") &&
      !event?.target?.classList.contains("lendingActionButton") &&
      !event?.target?.classList.contains("copyTokenMintAddressButton") &&
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast text from closing modal
      !event?.target?.classList.contains("p-toast-close-icon") && //Keep transaction toast close button from closing modal
      !event?.target?.classList.contains("p-toast-close-button") && //Keep transaction toast close button from closing modal
      !dataPcSectionValue?.includes('button container') && //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path')) //Keep transaction toast close button from sometimes closing modal
      {
        stopInterestCalculation()
        stopHealthFactorCalculation()
        repayMax.value = false
        repayHalf.value = false
        repaying.value = false
        window.removeEventListener('click', handleClickOutside)
      }
    }
  }

  function openRepayModal(tokenId :number, tokenMintAddress: string, subMarkets: any[])
  {
    window.addEventListener('click', handleClickOutside)

    const tokenInfo = tokenReserveFontEndInfoHashMap.get(tokenId)
    const tokenName = tokenInfo.name
    const decimalAmount = tokenInfo.decimalAmount
    const tokenSVG = tokenInfo.svg

    tokenProgram = tokenInfo.tokenProgram
    subMarketList.value = subMarkets
    
    subMarketSelect.value = Number(localStorage.getItem(tokenId.toString() +
    connectedWallet.addressString +
    connectedWallet.selectedLendingUserAccountIndex.toString() +
    "selectedMainSubMarketIndex")) || 0

    const isIndexContained = subMarkets.some(item => item.subMarketIndex === subMarketSelect.value)
    if(!isIndexContained)
      subMarketSelect.value = subMarkets[0].subMarketIndex

    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
    
    if(lendingUserAccountsHashMap.map)
    {
      const userAccountList = lendingUserAccountsHashMap.map.get(connectedWallet.addressString)
      if(userAccountList)
        accountList.value = userAccountList
    }

    const balance = connectedWallet.tokenBalanceMap.get(tokenId)
    if(balance)
      userWalletBalance.value = Number(balance)
    else
      userWalletBalance.value = 0

    selectedTokenId = tokenId
    selectedTokenMintAddress = new PublicKey(tokenMintAddress)
    tokenReserve = cloneDeep(tokenReservesHashMap.map.get(selectedTokenId))//cloneDeep to keep changes to tokenReserve variable from setting off tokenReservesHashMap watchers
    repayAmount.value = 0
    repayIncrementAmount.value = 1 / Math.pow(10, decimalAmount)
    tokenDecimalAmount = decimalAmount
    repaySVG.value = tokenSVG
    subMarketTokenName.value = tokenName
    repaying.value = true

    setDefaultSubMarketTo1WithDebt(subMarkets)
    setInitialDebtBalance()
    stopInterestCalculation()
    startInterestCalculation()
    stopHealthFactorCalculation()
    startHealthFactorCalculation()
  }

  function setDefaultSubMarketTo1WithDebt(subMarkets: any[])
  {
    //Check if initial setting has debt
    let tempLendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(selectedTokenId.toString() +
    adminAccounts.lendingCEOAddressString +
    subMarketSelect.value.toString() +
    connectedWallet.addressString +
    accountSelect.value.toString())

    if(tempLendingUserTabAccount)
    {
      const debt = Number(tempLendingUserTabAccount.borrowedAmount) / Math.pow(10, tokenDecimalAmount)//Convert from fixed point notation to decimal
      if(debt > 0)
        return
    }

    //Set initial submarket to one with debt for repayment
    for(var i=0; i<subMarkets.length; i++)
    {
      let tempLendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(selectedTokenId.toString() +
      adminAccounts.lendingCEOAddressString +
      subMarkets[i].subMarketIndex.toString() +
      connectedWallet.addressString +
      accountSelect.value.toString())

      if(tempLendingUserTabAccount)
      {
        const debt = Number(tempLendingUserTabAccount.borrowedAmount) / Math.pow(10, tokenDecimalAmount)//Convert from fixed point notation to decimal
        if(debt > 0)
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

  function updateStoredSelectedAccount()
  {
    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
    localStorage.setItem("selectedLendingAccountIndex" + connectedWallet.addressString, accountSelect.value.toString())
  }

  function setInitialDebtBalance()
  {
    if(!lendingUserTabAccountsHashMap.map || subMarketSelect.value == undefined)
      return

    lendingUserTabAccount = cloneDeep(lendingUserTabAccountsHashMap.map.get(selectedTokenId.toString() +
    adminAccounts.lendingCEOAddressString +
    subMarketSelect.value.toString() +
    connectedWallet.addressString +
    accountSelect.value.toString()))

    if(lendingUserTabAccount)
    {
      const decimalAmount = tokenDecimalHashMap.get(selectedTokenId)
      userDebt.value = Number(lendingUserTabAccount.borrowedAmount) / Math.pow(10, decimalAmount)//Convert from fixed point notation to decimal
    }
    else
      userDebt.value = 0

    userOriginalDebt = userDebt.value
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

    //Account for value that is about to be repaid
    //Check for less than zero values when doing complete withdrawals, due to the price possibly being slighly off
    calculatedDebtValue -= repayAmount.value * Number(priceOfSelectedToken)
    if(calculatedAssetValue < 0)
      calculatedAssetValue = 0

    if(calculatedDebtValue < 0)
      calculatedDebtValue = 0

    totalAssetValue.value = calculatedAssetValue
    totalDebtValue.value = calculatedDebtValue
  }

  function startInterestCalculation()
  {
    if(unixData.timeStamp == 0)
      return

    interestAccruedIntervalId = setInterval(() =>
    {
      calculateTokenReserveInterestChangeIndex(unixData.timeStamp)
      calculateUserInterest()
    }, 55)
  }

  function stopInterestCalculation()
  {
    if(interestAccruedIntervalId != undefined)
    {
      clearInterval(interestAccruedIntervalId)
      interestAccruedIntervalId = undefined
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

    //Token Reserve Borrow Interest Index = Old Borrow Interest Index * Taylor Series 4th Order Interest Calculation: e^x = 1 + x + (x^2 / 2!) + (x^3 / 3!) + (x^4 / 4!)
    const oldTime = Number(tokenReserve.lastLendingActivityTimeStamp)
    const changeInTime = timeStamp - oldTime
    const borrowApy = tokenReserve.borrowApy / 10000 //convert from fixed point to decimal
    const borrowCompoundingFactor = getCompoundingFactor(borrowApy, changeInTime)

    tokenReserve.newBorrowInterestChangeIndex = Number(tokenReserve.borrowInterestChangeIndex) * borrowCompoundingFactor
  }

  function calculateUserInterest()
  {
    setInitialDebtBalance()

    if(!lendingUserTabAccount)
      return

    //For tab accounts initialized with no deposits, keeps from dividing by zero
    //For example, can happen to when claiming submarket fees in different destination submarket on new initial tab account
    if(Number(lendingUserTabAccount.borrowInterestChangeIndex) == 0)
      lendingUserTabAccount.borrowInterestChangeIndex = tokenReserve.newBorrowInterestChangeIndex

    //User New Debt = Old Debt * Token Reserve Accrued Interest Index / User Accrued Interest Index
    //Calculate interest accrued
    userDebt.value = userOriginalDebt * tokenReserve.newBorrowInterestChangeIndex / Number(lendingUserTabAccount.borrowInterestChangeIndex)

    if(repayHalf.value)
      repayAmount.value = userWalletBalance.value < userDebt.value * 0.5 ? userWalletBalance.value : userDebt.value * 0.5
    if(repayMax.value)
      repayAmount.value = userWalletBalance.value < userDebt.value ? userWalletBalance.value : userDebt.value
  }

  async function repayTokens()
  {
    const remainingTabAccounts = lendingUserRemainingTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())
    var instructionsToSend = []
    var lookUpTableAccounts = []
    var refreshingUserRemainingAccounts = []

    try
    {
      const [uniqueTokenIds, createMonthlyStatementInstructions, lendingTabSubMarketAndMonthlyStatementRemainingAccounts, subMarketOwnerArray] =
      await getNeccessaryRefreshInstructionData(remainingTabAccounts, connectedWallet.publicKey, accountSelect.value)

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
      
      const repayInstruction = await anchorPrograms.lending.lendingProgram.methods.repayTokens
      (
        subMarketSelect.value,
        accountSelect.value,
        new anchor.BN(repayAmount.value * Math.pow(10, tokenDecimalAmount)),//convert to fixedpoint notation
        repayMax.value
      )
      .accounts({
        subMarketOwner: adminAccounts.lendingCEOAddressKey,
        tokenMint: selectedTokenMintAddress,
        tokenProgram: tokenProgram })
      .remainingAccounts([tempPriceRemainingAccount, adminAccounts.priceOracleRemainingAccount])
      .instruction()

      const computeUnitIncreaseInstruction = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 })
      instructionsToSend.push(computeUnitIncreaseInstruction)
      instructionsToSend.push(...createMonthlyStatementInstructions)
      instructionsToSend.push(refreshUserHealthAndTokenReservesInstruction)
      instructionsToSend.push(repayInstruction)

      //Get Lending Protocol Look Up Table Account
      lookUpTableAccounts.push(anchorPrograms.lendingProtocolLookUpTableAccount)

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

      //Get Lending User Look Up Table Account
      lookUpTableAccounts.push(connectedWallet.lendingUserLookUpTableAccount)

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
          await confirmLendingTransaction(userTxs[i], toast, "repay_tokens")
      else
        await confirmLendingTransaction(userTxs, toast, "repay_tokens")

      stopInterestCalculation()
      stopHealthFactorCalculation()
      repaying.value = false
      repayMax.value = false
    }
    catch(error)
    {
      var errorMessage = parseProgramErrorCode(error, anchorPrograms.lending.lendingProgram)
      toastPreTransactionError(errorMessage, toast, "repay_tokens")  
    }
  }

  function updateStoredSelectedSubMarketIndex(tokenId: number, mainSubMarketIndex: string)
  {
    repayAmount.value = 0

    localStorage.setItem(tokenId.toString() +
    connectedWallet.addressString +
    connectedWallet.selectedLendingUserAccountIndex.toString() +
    "selectedMainSubMarketIndex", mainSubMarketIndex)

    setInitialDebtBalance()
    stopInterestCalculation()
    startInterestCalculation()
    stopHealthFactorCalculation()
    startHealthFactorCalculation()
  }

  defineExpose(
  {
    openRepayModal
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