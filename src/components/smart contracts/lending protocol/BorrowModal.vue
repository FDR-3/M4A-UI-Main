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
      <ion-label class="alignSelfLeft">Amount: {{ availableToBorrowAmount.toLocaleString('en-US', {
        minimumFractionDigits: tokenDecimalAmount,
        maximumFractionDigits: tokenDecimalAmount }) }}
      </ion-label>
      <ion-label class="alignSelfLeft">Value: {{ availableToBorrowValue }}</ion-label>
    </div>
    <div>
      <ion-label>Available in Token Reserve: {{ availableInTokenReserveAmount?.toLocaleString('en-US', {
        minimumFractionDigits: tokenDecimalAmount,
        maximumFractionDigits: tokenDecimalAmount }) }}
      </ion-label>
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

    <div v-if="connectedWallet.isTempPriceAccountAlive" class="flexCenterColumn">
      <br>
      <ion-text>Your temp price data account is alive. You must close it before you can call the borrow function.</ion-text>
      <ion-button :color="colorName" @click="closeTempOraclePriceData(toast)">
        Close Temp Price Account
      </ion-button>
    </div>
    <div v-else-if="anchorPrograms.isLendingProtocolReady && connectedWallet.lendingUserLUTAccountReady" class="flexCenterColumn">
      <ion-button
        id="borrowModalButton"
        color="dark"
        @click="borrowTokens()"
        class="mediumSmallMarginTop nTinyMarginBottom"
        :disabled="borrowAmount==0"
      >
        Borrow
      </ion-button>
      <div v-if="connectedWallet.missingLUTAddresses.length >= 1" class="nLargeMarginLeft tinyMarginTop nSmallMarginBottom">
        <AddMissingUserLUTAddresses/>
      </div>
    </div>
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
  import { PublicKey, AddressLookupTableProgram } from "@solana/web3.js"
  import { copyAddress,
    copyTokenMintAddressText,
    confirmLendingTransaction,
    doesKeyExistInLookUpTable,
    parseProgramErrorCode,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { userSignsLendingTransactions,
    bundleProtocolPriceTransactions,
    getNeccessaryRefreshInstructionData,
    getTokenReserveRemainingAccounts,
    getTempRemainingPriceAccount,
    closeTempOraclePriceData,
    getLendingUserTabAccountPDA } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { subMarketsHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { tokenReservesHashMap,
    tokenReserveFontEndInfoHashMap,
    tokenReserveBalancesHashMap,
    tokenIdHashMap,
    priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketLookUpTableByOwnerHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserAccountsHashMap,
    lendingUserTabAccountListHashMap,
    lendingUserTabAccountsHashMap,
    lendingUserRemainingTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenAddressStrings, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import * as anchor from "@coral-xyz/anchor"
  import HealthFactorSmall from '/src/components/smart contracts/lending protocol/HealthFactorSmall.vue'
  import { unixData } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { calculateNewBalance, calculateNewDebtBalance } from './InterestCalcHelpers.ts'
  import AddMissingUserLUTAddresses from '/src/components/smart contracts/lending protocol/AddMissingUserLUTAddresses.vue'
  import * as bs58 from 'bs58'

  const toast = inject('toast')
  const colorName = inject('colorName') as string
  const colorHexValue = inject('colorHexValue') as string

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

  watch(tokenReserveBalancesHashMap, () =>
  {
    if(borrowing.value)
      availableInTokenReserveAmount.value = tokenReserveBalancesHashMap.map.get(selectedTokenId)
  })

  watch(lendingUserTabAccountListHashMap, async() =>
  {
    if(borrowing.value)//Don't start another count down if on another modal since the borrow modal is still mounted even when not visible
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
    if(borrowing.value)
    {
      let newWallet = JSON.parse(newJSONObjectString)
      let oldWallet = JSON.parse(oldJSONObjectString)

      //Only want this running if the connected Wallet Address String is changing and modal is visible
      if((newWallet.addressString == oldWallet.addressString &&
      newWallet.selectedLendingUserAccountIndex == oldWallet.selectedLendingUserAccountIndex))
        return

      accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
      
      borrowAmount.value = 0
      stopHealthFactorCalculation()
      startHealthFactorCalculation()
    }
  })

  //When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  const handleClickOutside = (event: any) => 
  {
    if(borrowing.value && modalRef.value)
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
        stopHealthFactorCalculation()
        borrowMax.value = false
        borrowHalf.value = false
        borrowing.value = false
        window.removeEventListener('click', handleClickOutside)
      }  
    }
  }

  async function openBorrowModal(tokenId: number, tokenMintAddress: string, subMarkets: any[])
  {
    window.addEventListener('click', handleClickOutside)
    
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

    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex

    const isIndexContained = subMarkets.some(item => item.subMarketIndex === subMarketSelect.value)
    if(!isIndexContained)
      subMarketSelect.value = subMarkets[0].subMarketIndex

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
    localStorage.setItem("selectedLendingAccountIndex" + connectedWallet.addressString, accountSelect.value.toString())
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

        calculatedAssetValue += userBalanceWithInterestEarned / Math.pow(10, decimalAmount) * Number(price)
        calculatedDebtValue += userDebtWithInterestAccrued / Math.pow(10, decimalAmount) * Number(price)
      }
    
    var availableValueBeforeBorrow = calculatedAssetValue * 0.7 - calculatedDebtValue
    availableValueBeforeBorrow = availableValueBeforeBorrow < 0 ? 0 : availableValueBeforeBorrow
    availableToBorrowValue.value = '$' + availableValueBeforeBorrow.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 })

    const priceOfSelectedToken = Number(priceObjectMap.data[selectedTokenMintAddress.toString()].usdPrice)
    availableToBorrowAmount.value = availableValueBeforeBorrow / priceOfSelectedToken
    
    //Account for value that is about to be borrowed
    calculatedDebtValue += borrowAmount.value * Number(priceOfSelectedToken)

    if(borrowHalf.value || borrowMax.value)
    {
      const amount = availableToBorrowAmount.value < 0 ? 0 : availableToBorrowAmount.value
      const targetBorrowAmount = borrowHalf.value 
        ? amount * 0.5 
        : amount

      if(availableInTokenReserveAmount.value < 0)
        borrowAmount.value = 0
      else if(availableInTokenReserveAmount.value < targetBorrowAmount)
        borrowAmount.value = availableInTokenReserveAmount.value
      else
        borrowAmount.value = targetBorrowAmount

      maxBorrowAmount = borrowAmount.value
    }
    else
      if(availableInTokenReserveAmount.value < availableToBorrowAmount.value)
        maxBorrowAmount = availableInTokenReserveAmount.value
      else
        maxBorrowAmount = availableToBorrowAmount.value < 0 ? 0 : availableToBorrowAmount.value

    totalAssetValue.value = calculatedAssetValue
    totalDebtValue.value = calculatedDebtValue
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

  function extendUserLUTForNewBorrowToken()
  {
    const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(selectedTokenId.toString() +
    adminAccounts.lendingCEOAddressString +
    subMarketSelect.value.toString() +
    connectedWallet.addressString +
    accountSelect.value.toString())

    //Add Lending User Tab Account to Lending User Look Up Table if it doesn't exist
    if(!lendingUserTabAccount)
    {
      //Determine PDA for new LendingUserTabAccount that will be created
      const lendingUserTabAccountPDA = getLendingUserTabAccountPDA(selectedTokenId,
      adminAccounts.lendingCEOAddressKey,
      subMarketSelect.value,
      connectedWallet.publicKey,
      accountSelect.value)

      if(!doesKeyExistInLookUpTable(connectedWallet.lendingUserLookUpTableAccount, lendingUserTabAccountPDA))
      {
        const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
          {
            authority: connectedWallet.publicKey,
            payer: connectedWallet.publicKey,
            lookupTable: connectedWallet.lendingUserLookUpTableAddress,
            addresses: [lendingUserTabAccountPDA]
          })

        return extendLookUpTableInstruction
      }
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
      const [uniqueTokenIds, createMonthlyStatementInstructions, lendingTabSubMarketAndMonthlyStatementRemainingAccounts, subMarketOwnerArray] =
      await getNeccessaryRefreshInstructionData(remainingTabAccounts, connectedWallet.publicKey, accountSelect.value)

      //If user is borrowing from a token they have never interacted with before, add it to the array for price checks and extend their look up table with the new tab account
      const isNewBorrowToken = !uniqueTokenIds.has(selectedTokenId)
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
        borrowMax.value
      )
      .accounts({
      subMarketOwner: adminAccounts.lendingCEOAddressKey,
      tokenMint: selectedTokenMintAddress,
      tokenProgram: tokenProgram })
      .remainingAccounts([tempPriceRemainingAccount, adminAccounts.priceOracleRemainingAccount])
      .instruction()

      const computeUnitIncreaseInstruction = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 })
      instructionsToSend.push(computeUnitIncreaseInstruction)
      if(isNewBorrowToken)
        instructionsToSend.push(extendUserLUTForNewBorrowToken())
      instructionsToSend.push(...createMonthlyStatementInstructions)
      instructionsToSend.push(refreshUserHealthAndTokenReservesInstruction)
      instructionsToSend.push(borrowInstruction)

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

    localStorage.setItem(tokenId.toString() +
    connectedWallet.addressString +
    connectedWallet.selectedLendingUserAccountIndex.toString() +
    "selectedMainSubMarketIndex", mainSubMarketIndex)
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