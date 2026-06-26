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

    <ion-label>Available</ion-label>
    <div class="flexCenterRow">
      <ion-label class="alignSelfLeft">Amount: {{ availableToBorrowAmount.toFixed(tokenDecimalAmount) }}</ion-label>
      <ion-label class="alignSelfLeft">Value: {{ availableToBorrowValue }}</ion-label>
    </div>
    <div>
      <ion-label>Available in Token Reserve: {{ availableInTokenReserveAmount.toFixed(tokenDecimalAmount) }}</ion-label>
    </div>
    
    <InputNumber
      v-model="borrowAmount"
      :inputStyle="{'text-align': 'center'}"
      :minFractionDigits="tokenDecimalAmount" :maxFractionDigits="tokenDecimalAmount"
      :max="maxBorrowAmount"
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

    <ion-button
      v-if="anchorPrograms.isLendingProtocolReady"
      id="borrowModalButton"
      color="dark"
      @click="borrowTokens()"
      class="mediumSmallMarginTop nTinyMarginBottom"
      :disabled="borrowAmount==0"
    >
      Borrow
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
  import { userSignsLendingTransactions,
    bundleProtocolPriceTransactions,
    getNeccessaryRefreshInstructionData,
    getTokenReserveRemainingAccounts,
    getTempRemainingPriceAccount } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { subMarketsHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { tokenReservesHashMap, tokenReserveFontEndInfoHashMap, tokenIdHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { lendingUserAccountsHashMap,
    lendingUserTabAccountListHashMap,
    lendingUserRemainingTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenAddressStrings, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import * as anchor from "@coral-xyz/anchor"
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
  var availableInTokenReserveAmount = ref(0)
  var availableToBorrowAmount = ref(0)
  var availableToBorrowValue = ref("$0.00")
  var maxBorrowAmount = 0
  var selectedTokenId = 0
  var selectedTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var tokenDecimalAmount: number
  var tokenProgram: PublicKey
  var healthFactorIntervalId: any

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)

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

  watch(tokenReservesHashMap, () =>
  {
    const tokenReserve = tokenReservesHashMap.map.get(selectedTokenMintAddress.toString())
    if(tokenReserve)
      availableInTokenReserveAmount.value = Number(tokenReserve.depositedAmount) - Number(tokenReserve.borrowedAmount)
  })

  watch(lendingUserTabAccountListHashMap, async() =>
  {
    if(borrowing.value)//Don't start another count down if on another modal since the withdrawal modal is still mounted even when not visible
    {
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
    if(!borrowing.value ||
    (newWallet.addressString == oldWallet.addressString &&
    newWallet.selectedLendingUserAccountIndex == oldWallet.selectedLendingUserAccountIndex))
      return

    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
    
    borrowAmount.value = 0
    stopHealthFactorCalculation()
    startHealthFactorCalculation()
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
        borrowing.value = false
        window.removeEventListener('click', handleClickOutside)
      }  
    }
  }

  async function openBorrowModal(tokenId: number, tokenMintAddress: string, subMarkets: any[])
  {
    window.addEventListener('click', handleClickOutside)
    
    const tokenReserve = tokenReservesHashMap.map.get(tokenId)
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

    borrowAmount.value = 0
    borrowIncrementAmount.value = 1 / Math.pow(10, decimalAmount)
    selectedTokenId = tokenId
    selectedTokenMintAddress = new PublicKey(tokenMintAddress)
    tokenDecimalAmount = decimalAmount
    borrowSVG.value = tokenSVG
    subMarketTokenName.value = tokenName
    borrowing.value = true

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
    
    const availableValueBeforeBorrow = calculatedAssetValue * 0.7 - calculatedDebtValue
    availableToBorrowValue.value = '$' + availableValueBeforeBorrow.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 })

    const priceOfSelectedToken = Number(priceObjectMap.data[selectedTokenMintAddress.toString()].usdPrice)
    availableToBorrowAmount.value = availableValueBeforeBorrow / priceOfSelectedToken
    
    //Account for value that is about to be borrowed
    calculatedDebtValue += borrowAmount.value * Number(priceOfSelectedToken)

    if(borrowHalf.value || borrowMax.value)
    {
      const targetBorrowAmount = borrowHalf.value 
        ? availableToBorrowAmount.value * 0.5 
        : availableToBorrowAmount.value

      if(availableInTokenReserveAmount.value < 0)
        borrowAmount.value = 0
      else if(availableInTokenReserveAmount.value < targetBorrowAmount)
        borrowAmount.value = availableInTokenReserveAmount.value * 0.999
      else
        borrowAmount.value = targetBorrowAmount

      maxBorrowAmount = borrowAmount.value
    }
    else
      if(availableInTokenReserveAmount.value < availableToBorrowAmount.value)
        maxBorrowAmount = availableInTokenReserveAmount.value
      else
        maxBorrowAmount = availableToBorrowAmount.value

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

  async function borrowTokens()
  {
    const remainingTabAccounts = lendingUserRemainingTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())
    var instructionsToSend = []
    var lookUpTableAccounts = []
    var refreshingUserRemainingAccounts = []

    try
    { 
      const [uniqueTokenIds, createMonthlyStatementInstructions, lendingTabSubMarketAndMonthlyStatementRemainingAccounts] =
      await getNeccessaryRefreshInstructionData(remainingTabAccounts, connectedWallet.publicKey, accountSelect.value)

      //If user is borrowing from a token they have never interacted with before, add it to the array for price checks
      uniqueTokenIds.add(selectedTokenId)

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
      
      const borrowInstruction = await anchorPrograms.lending.lendingProgram.methods.borrowTokens
      (
        subMarketSelect.value,
        accountSelect.value,
        new anchor.BN(borrowAmount.value * Math.pow(10, tokenDecimalAmount)),//convert to fixedpoint notation
      )
      .accounts({
      subMarketOwner: adminAccounts.lendingCEOAddressKey,
      tokenMint: selectedTokenMintAddress,
      tokenProgram: tokenProgram })
      .remainingAccounts([tempPriceRemainingAccount, adminAccounts.priceOracleRemainingAccount])
      .instruction()

      instructionsToSend.push(...createMonthlyStatementInstructions)
      instructionsToSend.push(refreshUserHealthAndTokenReservesInstruction)
      instructionsToSend.push(borrowInstruction)

      //Get Lending Protocol Look Up Table Account
      lookUpTableAccounts.push(anchorPrograms.lendingProtocolLookUpTableAccount)

      //Not worth getting Submarket look up table for just 1 subMarket, 1 submarket account is 32 bytes, lookuptable account is 35 bytes minimum.

      //Get Lending User Look Up Table Account
      if(connectedWallet.lendingUserLookUpTableAccount)//Won't be available on first deposit
        lookUpTableAccounts.push(connectedWallet.lendingUserLookUpTableAccount)

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
          await confirmLendingTransaction(userTxs[i], toast, "borrow_tokens")
      else
        await confirmLendingTransaction(userTxs, toast, "borrow_tokens")

      stopHealthFactorCalculation()
      borrowing.value = false
    }
    catch(error: any)
    {
      var errorMessage = parseProgramErrorCode(error, anchorPrograms.lending.lendingProgram)
      toastPreTransactionError(errorMessage, toast, "borrow_tokens")  
    }
  }

  function updateStoredSelectedSubMarketIndex(tokenId: number, mainSubMarketIndex: string)
  {
    borrowAmount.value = 0
    localStorage.setItem(tokenId.toString() + "selectedMainSubMarketIndex", mainSubMarketIndex)
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