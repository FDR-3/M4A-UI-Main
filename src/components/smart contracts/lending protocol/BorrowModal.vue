<template>
  <div v-if="borrowing"
    id="borrowModal"
    class="thickBorder"
    ref="modalRef"
  >
    <div class="nMediumSmallMarginTop nMediumMarginBottom flexCenterRow">
      <ion-button fill="clear" @click="openTokenPopover($event)">
        <img v-if="selectedTokenMintAddress?.toString()==tokenAddressStrings.solTokenMintAddress"  style="width: 50px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
        <component v-else :is="borrowSVG" style="width: 44px"></component>
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

    <ion-label>Available</ion-label>
    <div class="flexCenterRow">
      <ion-label class="alignSelfLeft">Amount: {{ availableToBorrowAmount.toFixed(tokenDecimalAmount) }}</ion-label>
      <ion-label class="alignSelfLeft">Value: {{ availableToBorrowValue }}</ion-label>
    </div>
    <InputNumber
      v-model="borrowAmount"
      :inputStyle="{'text-align': 'center'}"
      :minFractionDigits="tokenDecimalAmount" :maxFractionDigits="tokenDecimalAmount"
      :max="availableToBorrowAmount"
      :min="0"
      :step="borrowIncrementAmount"
      showButtons
      fluid
      @input="(event: { value: any }) => borrowAmount = event.value"
      @focus="borrowMax=false; borrowHalf=false"
    />
    <div class="alignSelfLeft">
      <button style="background-color: transparent" @click="borrowHalf=false; borrowMax=true">
        <ion-label color="dark">Max</ion-label>
      </button>

      <button class="mediumSmallMarginLeft" style="background-color: transparent" @click="borrowMax=false; borrowHalf=true;">
        <ion-label color="dark">Half</ion-label>
      </button>
    </div>

    <div class="smallMarginTop">
      <ion-text>Value: ${{ borrowValue }}</ion-text>
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
      id="borrowModalButton"
      color="dark"
      @click="updateUserSnapShots()"
      class="mediumSmallMarginTop nTinyMarginBottom"
    >
      Update SnapShots
    </ion-button>

    <ion-button
      v-else
      id="borrowModalButton"
      color="dark"
      @click="borrowTokens()"
      class="mediumSmallMarginTop nTinyMarginBottom"
      :disabled="borrowAmount==0 || snapShotValidCountDown==0"
    >
      Borrow
    </ion-button>
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
  import { PublicKey, Transaction } from "@solana/web3.js"
  import { copyAddress,
    copyTokenMintAddressText,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenReservesHashMap, tokenReserveFontEndInfoHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketsHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserAccountsHashMap,
    lendingUserTabAccountListHashMap,
    lendingUserRemainingTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenAddressStrings, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { PythSolanaReceiver, InstructionWithEphemeralSigners } from "@pythnetwork/pyth-solana-receiver"
  import { HermesClient } from "@pythnetwork/hermes-client"
  import * as anchor from "@coral-xyz/anchor"
  import InfoButton from '/src/components/help/InfoButton.vue'
  import HealthFactorSmall from '/src/components/smart contracts/lending protocol/HealthFactorSmall.vue'
  import { blockChainData } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { calculateNewBalance, calculateNewDebtBalance } from './HealthFactorInfo.ts'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue')

  var subMarketSelect = ref()
  var subMarketList = ref()
  var accountSelect = ref()
  var accountList = ref()
  var borrowAmount = ref()
  var borrowIncrementAmount = ref()
  var borrowing = ref(false)
  var borrowSVG = ref()
  var borrowMax = ref(false)
  var borrowHalf = ref(false)
  var subMarketTokenName = ref()
  var availableToBorrowAmount = ref(0)
  var availableToBorrowValue = ref("$0.00")
  var selectedTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var tokenDecimalAmount: number
  var tokenProgram: PublicKey
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

  var borrowValue = computed ( () =>
  {
    const price = priceObjectMap.data[selectedTokenMintAddress.toString()].usdPrice
    if(price)
      return (borrowAmount.value * Number(price)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })        
    else
      return (0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })   
  })

  watch(lendingUserTabAccountListHashMap, async() =>
  {
    if(borrowing.value)//Don't start another count down if on another modal since the withdrawal modal is still mounted even when not visible
    {
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
    if(!borrowing.value ||
    (newWallet.addressString == oldWallet.addressString &&
    newWallet.selectedLendingUserAccountIndex == oldWallet.selectedLendingUserAccountIndex))
      return

    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
    
    borrowAmount.value = 0
    stopHealthFactorCalculation()
    startHealthFactorCalculation()
    clearSnapShotIntervalCountDown()
    await setSnapShotIntervalCountDown()
  })

  //When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  const handleClickOutside = function(event: any) 
  {
    if(borrowing.value)
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
        stopHealthFactorCalculation()
        clearSnapShotIntervalCountDown()
        borrowing.value = false
        window.removeEventListener('click', handleClickOutside)
      }  
    }
  }

  async function openBorrowModal(tokenMintAddress: string, subMarkets: any[])
  {
    window.addEventListener('click', handleClickOutside)
    
    const tokenInfo = tokenReserveFontEndInfoHashMap.get(tokenMintAddress)
    const tokenName = tokenInfo.name
    const decimalAmount = tokenInfo.decimalAmount
    const tokenSVG = tokenInfo.svg
    tokenProgram = tokenInfo.tokenProgram

    subMarketList.value = subMarkets
    subMarketSelect.value = Number(localStorage.getItem(tokenMintAddress + "selectedMainSubMarketIndex")) || 0
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex

    if(lendingUserAccountsHashMap.map)
    {
      const userAccountList = lendingUserAccountsHashMap.map.get(connectedWallet.addressString)
      if(userAccountList)
        accountList.value = userAccountList
    }

    borrowAmount.value = 0
    borrowIncrementAmount.value = 1 / Math.pow(10, decimalAmount)
    selectedTokenMintAddress = new PublicKey(tokenMintAddress)
    tokenDecimalAmount = decimalAmount
    borrowSVG.value = tokenSVG
    subMarketTokenName.value = tokenName
    borrowing.value = true

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

  function calculateHealthFactorValues(timeStamp: number)
  {
    if(!lendingUserTabAccountListHashMap.map || selectedTokenMintAddress.toString()==SYSTEM_PROGRAM_ADDRESS_STRING)
      return

    const userTabAccounts = lendingUserTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())

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
    
    const availableValueBeforeBorrow = calculatedAssetValue * 0.7 - calculatedDebtValue
    availableToBorrowValue.value = '$' + availableValueBeforeBorrow.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 })

    const priceOfSelectedToken = Number(priceObjectMap.data[selectedTokenMintAddress.toString()].usdPrice)
    availableToBorrowAmount.value = availableValueBeforeBorrow / priceOfSelectedToken
    
    //Account for value that is about to be borrowed
    calculatedDebtValue += borrowAmount.value * Number(priceOfSelectedToken)

    if(borrowHalf.value)
      borrowAmount.value = availableToBorrowAmount.value * 0.5
    if(borrowMax.value)
    {
      const factor = 100_000
      borrowAmount.value = Math.floor(availableToBorrowAmount.value * factor) / factor//Turn last 5 digits into zeros
    }

    totalAssetValue.value = calculatedAssetValue
    totalDebtValue.value = calculatedDebtValue
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

  async function updateUserSnapShots()
  {
    const lendingUserTabAccounts = lendingUserTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())
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

  async function borrowTokens()
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
        
        return [
          {
            instruction: await anchorPrograms.lending.lendingProgram.methods.borrowTokens
              (
                selectedTokenMintAddress,
                adminAccounts.lendingCEOAddressKey,
                subMarketSelect.value,
                accountSelect.value,
                new anchor.BN(borrowAmount.value * Math.pow(10, tokenDecimalAmount))//convert to fixedpoint notation
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
          await confirmLendingTransaction(tx[i], toast, "borrow_tokens")
      else
        await confirmLendingTransaction(tx, toast, "borrow_tokens")

      stopHealthFactorCalculation()
      clearSnapShotIntervalCountDown()
      borrowing.value = false
    }
    catch(error: any)
    {
      if(error.message.includes("\"Custom\":6000"))//These error code numbers don't match the idl exactly for some reason, but I've confirmed these are the proper error messages
        toastPreTransactionError("StalePriceData: The price data was stale", toast, "borrow_tokens")
      else if(error.message.includes("\"Custom\":6001"))//These error code numbers don't match the idl exactly for some reason, but I've confirmed these are the proper error messages
        toastPreTransactionError("StaleSnapShot: The Lending User snap shot data was stale", toast, "borrow_tokens")
      else
        toastPreTransactionError(error, toast, "borrow_tokens")  
    }
  }

  function updateStoredSelectedSubMarketIndex(tokenMintAddress: string, mainSubMarketIndex: string)
  {
    borrowAmount.value = 0
    localStorage.setItem(selectedTokenMintAddress.toString() + "selectedMainSubMarketIndex", mainSubMarketIndex)
  }

  defineExpose(
  {
    openBorrowModal
  })
</script>

<style scoped>
  #borrowModal
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