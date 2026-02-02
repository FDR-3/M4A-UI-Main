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
      @change="updateStoredSelectedSubMarketIndex(selectedTokenMintAddress.toString(), subMarketSelect.toString())">
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

    <ion-label class="alignSelfLeft">Balance: {{ userBalance.toFixed(tokenDecimalAmount) }}</ion-label>
    <ion-label class="alignSelfLeft">Available: {{ availableWithdrawalBalance.toFixed(tokenDecimalAmount) }}</ion-label>
    <InputNumber
      v-model="withdrawAmount"
      :inputStyle="{'text-align': 'center'}"
      :minFractionDigits="tokenDecimalAmount" :maxFractionDigits="tokenDecimalAmount"
      :max="availableWithdrawalBalance"
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
        <ion-label color="dark">Half</ion-label>
      </button>
    </div>

    <div class="smallMarginTop">
      <ion-text>Value: ${{ withdrawValue }}</ion-text>
    </div>

    <div class="flexCenterRow mediumSmallMarginTop nMediumMarginBottom">
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

    <ion-button
      v-if="snapShotValidCountDown==0"
      id="withdrawModalButton"
      color="dark"
      @click="updateUserSnapShots()"
      class="mediumSmallMarginTop nTinyMarginBottom"
    >
      Update SnapShots
    </ion-button>

    <ion-button
      v-else
      id="withdrawModalButton"
      color="dark"
      @click="withdrawTokens()"
      class="mediumSmallMarginTop nTinyMarginBottom"
      :disabled="withdrawAmount==0 || snapShotValidCountDown==0"
    >
      Withdraw
    </ion-button>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, watch, computed } from 'vue'
  import { IonButton, IonText, IonPopover, IonLabel } from '@ionic/vue'
  import Select from 'primevue/select'
  import InputNumber from 'primevue/inputnumber'
  import { anchorPrograms,
    SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey, Transaction } from "@solana/web3.js"
  import { copyAddress,
    copyTokenMintAddressText,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenReservesHashMap, tokenReserveFontEndInfoHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketsHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserAccountsHashMap,
    lendingUserTabAccountsHashMap,
    lendingUserTabAccountListHashMap,
    lendingUserRemainingTabAccountListHashMap, } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenAddressStrings, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { PythSolanaReceiver, InstructionWithEphemeralSigners } from "@pythnetwork/pyth-solana-receiver"
  import { HermesClient } from "@pythnetwork/hermes-client"
  import * as anchor from "@coral-xyz/anchor"
  import cloneDeep from 'lodash/cloneDeep'
  import InfoButton from '/src/components/help/InfoButton.vue'
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
  var subMarketFee = 0
  var accountSelect = ref(0)
  var accountList = ref()
  var withdrawAmount = ref()
  var withdrawIncrementAmount = ref()
  var withdrawing = ref(false)
  var withdrawSVG = ref()
  var withdrawMax = ref(false)
  var withdrawHalf = ref(false)
  var withdrawFullDepositedAmount = false
  var subMarketTokenName = ref()
  var userBalance = ref()
  var userOriginalBalance = 0
  var availableWithdrawalBalance = ref(0)
  var selectedTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var tokenDecimalAmount: number
  var tokenProgram: PublicKey
  var interestEarnedIntervalId: any
  var healthFactorIntervalId: any

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)

  const snapShotInfo = "Info\n\n1. Snapshots of user earned\nand accrued interest no\nolder than 120 seconds are\nrequired for withdrawals\nand borrows.\n2. Withdraw tokens while\nSnapshots and are still\nvalid."

  var snapShotValidCountDown = ref(0)
  var snapShotCountDownIntervalId: any

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

  watch(lendingUserTabAccountListHashMap, async() =>
  {
    if(withdrawing.value)//Don't start another count down if on another modal since the withdrawal modal is still mounted even when not visible
    {
      setInitialBalance()
      stopInterestCalculation()
      startInterestCalculation()
      stopHealthFactorCalculation()
      startHealthFactorCalculation()
      clearSnapShotIntervalCountDown()
      await setSnapShotIntervalCountDown()
    }
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
    clearSnapShotIntervalCountDown()
    await setSnapShotIntervalCountDown()
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
        clearSnapShotIntervalCountDown()
        withdrawing.value = false
        window.removeEventListener('click', handleClickOutside)
      }  
    }
  }

  async function openWithdrawalModal(tokenMintAddress: string, subMarkets: any[])
  {
    window.addEventListener('click', handleClickOutside)

    const tokenInfo = tokenReserveFontEndInfoHashMap.get(tokenMintAddress)
    const tokenName = tokenInfo.name
    const decimalAmount = tokenInfo.decimalAmount
    const tokenSVG = tokenInfo.svg
    tokenProgram = tokenInfo.tokenProgram
    
    subMarketList.value = subMarkets
    subMarketSelect.value = Number(localStorage.getItem(tokenMintAddress + "selectedMainSubMarketIndex")) || 0
    const subMarket = subMarketsHashMap.map.get(tokenMintAddress + adminAccounts.lendingCEOAddressString + subMarketSelect.value.toString())
    subMarketFee = subMarket.feeOnInterestEarnedRate
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex

    if(lendingUserAccountsHashMap.map)
    {
      const userAccountList = lendingUserAccountsHashMap.map.get(connectedWallet.addressString)
      if(userAccountList)
        accountList.value = userAccountList
    }

    withdrawAmount.value = 0
    withdrawIncrementAmount.value = 1 / Math.pow(10, decimalAmount)
    selectedTokenMintAddress = new PublicKey(tokenMintAddress)
    tokenReserve = cloneDeep(tokenReservesHashMap.map.get(selectedTokenMintAddress.toString()))//cloneDeep to keep changes to tokenReserve variable from setting off tokenReservesHashMap watchers
    tokenDecimalAmount = decimalAmount
    withdrawSVG.value = tokenSVG
    subMarketTokenName.value = tokenName
    withdrawing.value = true

    setInitialBalance()
    stopInterestCalculation()
    startInterestCalculation()
    stopHealthFactorCalculation()
    startHealthFactorCalculation()
    clearSnapShotIntervalCountDown()
    await setSnapShotIntervalCountDown()
  }
  
  async function setSnapShotIntervalCountDown()
  {
    const allUserTabAccounts = lendingUserTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())
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
    lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(selectedTokenMintAddress.toString() +
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
    
    const priceOfSelectedToken = Number(priceObjectMap.data[selectedTokenMintAddress.toString()].usdPrice)

    if(calculatedDebtValue == 0)
      availableWithdrawalBalance.value = userBalance.value
    else
    {
      const availableValueBeforeWithdraw = calculatedAssetValue - calculatedDebtValue / 0.7
      const availableToWithdrawAmount = availableValueBeforeWithdraw / priceOfSelectedToken

      //The available value to withdraw might be higher than a specific token amount that the user has deposited if they have different tokens deposited.
      if(availableToWithdrawAmount >= userBalance.value)
        availableWithdrawalBalance.value = userBalance.value
      else
        availableWithdrawalBalance.value = availableToWithdrawAmount
    }

    if(withdrawHalf.value)
      withdrawAmount.value = availableWithdrawalBalance.value * 0.5
    if(withdrawMax.value)
    {
      if(calculatedDebtValue == 0)
      {
        withdrawFullDepositedAmount = true
        withdrawAmount.value = availableWithdrawalBalance.value
      }
      else
      {
        withdrawFullDepositedAmount = false
        //Withdraw less to keep up with possible available amount countdown
        const factor = 100_000
        withdrawAmount.value = Math.floor(availableWithdrawalBalance.value * factor) / factor//Turn last 5 digits into zeros
      }
    }
    else
      withdrawFullDepositedAmount = false

    //Account for value that is about to be withdrawn
    //Check for less than zero values when doing complete withdrawals, do the price possibly being slighly off
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
    if(!lendingUserTabAccount)
      return

    //For tab accounts initialized with no deposits, keeps from dividing by zero
    //For example, can happen to when claiming submarket fees in different destination submarket on new initial tab account
    if(Number(lendingUserTabAccount.supplyInterestChangeIndex) == 0)
      lendingUserTabAccount.supplyInterestChangeIndex = tokenReserve.newSupplyInterestChangeIndex

    //User New Balance Before Fee = Old Balance * Token Reserve Earned Interest Index / User Earned Interest Index
    //Interest Earned Before Fee = New Balance Before Fee - Old Balance
    //Interest Earned After Fee = Interest Earned Before Fee - (Interest Earned Before Fee * SubMarket Fee Rate)
    //User New Balance After Fee = Old Balance + Interest Earned After Fee
    //Calculate interest earned
    const newBalanceBeforeFee = (userOriginalBalance * tokenReserve.newSupplyInterestChangeIndex / Number(lendingUserTabAccount.supplyInterestChangeIndex))
    const interestEarnedBeforeFees = newBalanceBeforeFee - userOriginalBalance

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

    var interestEarnedAfterFees = interestEarnedBeforeFees - (interestEarnedBeforeFees * formulaSubMarketFee / 100) - (interestEarnedBeforeFees * solvencyInsuranceFee / 100)
    interestEarnedAfterFees = Number(interestEarnedAfterFees.toFixed(tokenDecimalAmount))

    userBalance.value = userOriginalBalance + interestEarnedAfterFees
  }

  async function updateUserSnapShots()
  {
    const lendingUserTabAccounts = lendingUserTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())
    const transaction = new Transaction();

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

  async function withdrawTokens()
  {
    const remainingTabAccounts = lendingUserRemainingTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())
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
        console.log(tokenProgram.toString())
        return[
          {
            instruction: await anchorPrograms.lending.lendingProgram.methods.withdrawTokens
            (
              selectedTokenMintAddress,
              adminAccounts.lendingCEOAddressKey,
              subMarketSelect.value,
              accountSelect.value,
              new anchor.BN(withdrawAmount.value * Math.pow(10, tokenDecimalAmount)), //convert to fixedpoint notation
              withdrawFullDepositedAmount
            )
            .accounts({ mint: selectedTokenMintAddress, tokenProgram: tokenProgram })
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
          await confirmLendingTransaction(tx[i], toast, "withdraw_tokens")
      else
        await confirmLendingTransaction(tx, toast, "withdraw_tokens")

      stopInterestCalculation()
      stopHealthFactorCalculation()
      clearSnapShotIntervalCountDown()
      withdrawing.value = false
      withdrawMax.value = false
    }
    catch(error: any)
    {
      if(error.message.includes("\"Custom\":6000"))//These error code numbers don't match the idl exactly for some reason, but I've confirmed these are the proper error messages
        toastPreTransactionError("StalePriceData: The price data was stale", toast, "withdraw_tokens")
      else if(error.message.includes("\"Custom\":6001"))//These error code numbers don't match the idl exactly for some reason, but I've confirmed these are the proper error messages
        toastPreTransactionError("StaleSnapShot: The Lending User snap shot data was stale", toast, "withdraw_tokens")
      else
        toastPreTransactionError(error, toast, "withdraw_tokens")  
    }
  }

  function updateStoredSelectedSubMarketIndex(tokenMintAddress: string, subMarketIndex: string)
  {
    withdrawAmount.value = 0
    localStorage.setItem(selectedTokenMintAddress.toString() + "selectedMainSubMarketIndex", subMarketIndex)
    const subMarket = subMarketsHashMap.map.get(tokenMintAddress + adminAccounts.lendingCEOAddressString + subMarketSelect.value.toString())
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