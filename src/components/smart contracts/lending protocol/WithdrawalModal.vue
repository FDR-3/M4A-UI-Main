<template>
  <div v-if="withdrawing"
    id="withdrawalModal"
    class="thickBorder"
    ref="modalRef"
  >
    <div class="nMediumSmallMarginTop nMediumMarginBottom flexCenterRow">
      <ion-button fill="clear" @click="openTokenPopover($event)">
        <img v-if="selectedTokenMintAddress?.toString()==tokenAddressStrings.solTokenMintAddress" style="width: 50px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
        <component v-else :is="withdrawSVG" style="width: 44px"></component>
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
    <ion-label class="alignSelfLeft">Balance: {{ userBalance.toFixed(tokenDecimalAmount) }}</ion-label>
    <ion-label class="alignSelfLeft">Available: {{ availableWithdrawalBalance.toFixed(tokenDecimalAmount) }}</ion-label>
    <ion-label class="alignSelfLeft">Token Reserve: {{ availableInTokenReserveAmount.toFixed(tokenDecimalAmount) }}</ion-label>
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
        <div style="margin-top: 2px"><ion-label color="dark" >Half</ion-label></div>
      </button>
    </div>

    <div class="smallMarginTop">
      <ion-text>Value: ${{ withdrawValue }}</ion-text>
    </div>

    <ion-button
      v-if="anchorPrograms.isLendingProtocolReady"
      id="withdrawModalButton"
      color="dark"
      @click="withdrawTokens()"
      class="mediumSmallMarginTop nTinyMarginBottom"
      :disabled="withdrawAmount==0"
    >
      Withdraw
    </ion-button>
    <ion-text v-else>Loading</ion-text>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, watch, computed } from 'vue'
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
    getTempRemainingPriceAccount } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { tokenReservesHashMap, tokenReserveFontEndInfoHashMap, tokenIdHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketsHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserAccountsHashMap,
    lendingUserTabAccountsHashMap,
    lendingUserTabAccountListHashMap,
    lendingUserRemainingTabAccountListHashMap, } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenAddressStrings, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import * as anchor from "@coral-xyz/anchor"
  import cloneDeep from 'lodash/cloneDeep'
  import HealthFactorSmall from '/src/components/smart contracts/lending protocol/HealthFactorSmall.vue'
  import { blockChainData } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { calculateNewBalance, calculateNewDebtBalance } from './HealthFactorInfo.ts'
  import { SECONDS_IN_A_YEAR } from '/src/assets/constants/TimeLengths.ts'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue')

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

  watch(tokenReservesHashMap, () =>
  {
    const tokenReserve = tokenReservesHashMap.map.get(selectedTokenId)
    if(tokenReserve)
      availableInTokenReserveAmount.value = Number(tokenReserve.depositedAmount) - Number(tokenReserve.borrowedAmount)
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
    let newWallet = JSON.parse(newJSONObjectString)
    let oldWallet= JSON.parse(oldJSONObjectString)

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
  })
  
  //When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  const handleClickOutside = function(event: any) 
  {
    if(withdrawing.value)
    {
      const dataPcSectionValue = event?.target?.getAttribute('data-pc-section')

      if(!modalRef.value.contains(event?.target) &&
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
    availableInTokenReserveAmount.value = Number(tokenReserve.depositedAmount) - Number(tokenReserve.borrowedAmount)
    subMarketList.value = subMarkets
    subMarketSelect.value = Number(localStorage.getItem(tokenId.toString() + "selectedMainSubMarketIndex")) || 0
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex

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

  async function updateStoredSelectedAccount()
  {
    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
    localStorage.setItem("selectedLendingAccountIndex", accountSelect.value.toString())
  }

  function setInitialBalance()
  {
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
    if(blockChainData.timeStamp == 0)
      return

    interestEarnedIntervalId = setInterval(() =>
    {
      calculateTokenReserveInterestChangeIndex(blockChainData.timeStamp)
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
  
  function calculateTokenReserveInterestChangeIndex(timeStamp: number)
  {
    tokenReserve = cloneDeep(tokenReservesHashMap.map.get(selectedTokenId))//cloneDeep to keep changes to tokenReserve variable from setting off tokenReservesHashMap watchers

    if(!tokenReserve)
      return

    //Token Reserve Supply Interest Index = Old Supply Interest Index * (1 + Supply APY * Δt/Seconds in a Year)
    const oldTime = Number(tokenReserve.lastLendingActivityTimeStamp)
    const changeInTime = timeStamp - oldTime
    const supplyApy = tokenReserve.supplyApy / 10000 //convert from fixed point to decimal

    tokenReserve.newSupplyInterestChangeIndex = Number(tokenReserve.supplyInterestChangeIndex) * (1 + supplyApy * changeInTime / SECONDS_IN_A_YEAR)
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

      //Not worth getting Submarket look up table for just 1 subMarket, 1 submarket account is 32 bytes, lookuptable account is 35 bytes minimum.

      //Get Lending User Look Up Table Account
      if(connectedWallet.lendingUserLookUpTableAccount)//Won't be available on first deposit
        lookUpTableAccounts.push(connectedWallet.lendingUserLookUpTableAccount)

      if(totalDebtValue.value != 0)
      {
        const [uniqueTokenIds, createMonthlyStatementInstructions, lendingTabSubMarketAndMonthlyStatementRemainingAccounts] =
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

        const response = await bundleProtocolPriceTransactions([...uniqueTokenIds], signedTransactions)
        const userTxs = response.userTxs

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
      withdrawing.value = false
      withdrawMax.value = false
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
    localStorage.setItem(selectedTokenId.toString() + "selectedMainSubMarketIndex", subMarketIndex)
    const subMarket = subMarketsHashMap.map.get(tokenId.toString() + adminAccounts.lendingCEOAddressString + subMarketSelect.value.toString())
    subMarketFee = subMarket.feeOnInterestEarnedRate

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