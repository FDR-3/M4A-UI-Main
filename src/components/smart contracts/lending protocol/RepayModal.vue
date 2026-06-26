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

    <ion-label class="alignSelfLeft">Debt: {{ userDebt.toFixed(tokenDecimalAmount) }}</ion-label>
    <InputNumber
      v-model="repayAmount"
      :inputStyle="{'text-align': 'center'}"
      :minFractionDigits="tokenDecimalAmount" :maxFractionDigits="tokenDecimalAmount"
      :max="userDebt"
      :min="0"
      :step="repayIncrementAmount"
      showButtons
      fluid
      @input="(event: { value: any }) => repayAmount = event.value"
      @focus="repayMax=false; repayHalf=false"
    />
    <div class="alignSelfLeft">
      <button style="background-color: transparent" @click="repayAmount=userDebt; repayHalf=false; repayMax=true">
        <ion-label color="dark">Max</ion-label>
      </button>

      <button class="mediumSmallMarginLeft" style="background-color: transparent" @click="repayAmount=userDebt*0.5; repayMax=false; repayHalf=true">
        <ion-label color="dark">Half</ion-label>
      </button>
    </div>

    <div class="smallMarginTop">
      <ion-text>Value: ${{ repayValue }}</ion-text>
    </div>

    <ion-button
      v-if="anchorPrograms.isLendingProtocolReady"
      id="repayButton"
      color="dark"
      @click="repayTokens()"
      class="mediumSmallMarginTop nTinyMarginBottom"
      :disabled="repayAmount == 0"
    >
      Repay
    </ion-button>
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
    getTempRemainingPriceAccount } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { tokenReservesHashMap, tokenReserveFontEndInfoHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketsHashMap, subMarketLookUpTableByOwnerHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserAccountsHashMap,
    lendingUserTabAccountsHashMap,
    lendingUserRemainingTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenAddressStrings, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { blockChainData } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { SECONDS_IN_A_YEAR } from '/src/assets/constants/TimeLengths.ts'
  import * as anchor from "@coral-xyz/anchor"
  import cloneDeep from 'lodash/cloneDeep'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue')

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
  var userDebt = ref(0)
  var userOriginalDebt = 0
  var selectedTokenId = 0
  var selectedTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var tokenDecimalAmount: number
  var tokenProgram: PublicKey
  var interestAccruedIntervalId: any

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)
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
    if(!repaying.value ||
    (newWallet.addressString == oldWallet.addressString
    && newWallet.selectedLendingUserAccountIndex == oldWallet.selectedLendingUserAccountIndex))
      return

    stopInterestCalculation()
    setInitialDebtBalance()
    startInterestCalculation()
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
  })

  watch(lendingUserTabAccountsHashMap, () =>
  {
    if(repaying.value)
    {
      stopInterestCalculation()
      setInitialDebtBalance()
      startInterestCalculation()
    }
  })

  //When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  const handleClickOutside = function(event: any) 
  {
    if(repaying.value)
    {
      const dataPcSectionValue = event?.target?.getAttribute('data-pc-section')
      
      if(!modalRef.value.contains(event?.target) &&
      !event?.target?.classList.contains("lendingActionButton") &&
      !event?.target?.classList.contains("copyTokenMintAddressButton") &&
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast text from closing modal
      !event?.target?.classList.contains("p-toast-close-icon") && //Keep transaction toast close button from closing modal
      !event?.target?.classList.contains("p-toast-close-button") && //Keep transaction toast close button from closing modal
      !dataPcSectionValue?.includes('button container') && //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path')) //Keep transaction toast close button from sometimes closing modal
      {
        stopInterestCalculation()
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
    subMarketSelect.value = Number(localStorage.getItem(tokenId.toString() + "selectedMainSubMarketIndex")) || 0
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex

    if(lendingUserAccountsHashMap.map)
    {
      const userAccountList = lendingUserAccountsHashMap.map.get(connectedWallet.addressString)
      if(userAccountList)
        accountList.value = userAccountList
    }

    selectedTokenId = tokenId
    selectedTokenMintAddress = new PublicKey(tokenMintAddress)
    tokenReserve = cloneDeep(tokenReservesHashMap.map.get(selectedTokenId))//cloneDeep to keep changes to tokenReserve variable from setting off tokenReservesHashMap watchers
    repayAmount.value = 0
    repayIncrementAmount.value = 1 / Math.pow(10, decimalAmount)
    tokenDecimalAmount = decimalAmount
    repaySVG.value = tokenSVG
    subMarketTokenName.value = tokenName
    repaying.value = true

    setInitialDebtBalance()
    stopInterestCalculation()
    startInterestCalculation()
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
    localStorage.setItem("selectedLendingAccountIndex", accountSelect.value.toString())
  }

  function setInitialDebtBalance()
  {
    if(!lendingUserTabAccountsHashMap.map || subMarketSelect.value == undefined)
      return

    lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(selectedTokenId.toString() +
    adminAccounts.lendingCEOAddressString +
    subMarketSelect.value.toString() +
    connectedWallet.addressString +
    accountSelect.value.toString())

    if(lendingUserTabAccount)
    {
      const decimalAmount = tokenDecimalHashMap.get(selectedTokenId)

      if(lendingUserTabAccount)
        userDebt.value = Number(lendingUserTabAccount.borrowedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
      else
        userDebt.value = 0
    }
    else
      userDebt.value = 0

    userOriginalDebt = userDebt.value
  }

  function updateStoredSelectedSubMarketIndex(tokenId: number, mainSubMarketIndex: string)
  {
    lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(tokenId.toString() +
    adminAccounts.lendingCEOAddressString +
    mainSubMarketIndex +
    connectedWallet.addressString +
    accountSelect.value.toString())

    if(lendingUserTabAccount)
    {
      const decimalAmount = tokenDecimalHashMap.get(tokenId)

      if(lendingUserTabAccount)
        userDebt.value = Number(lendingUserTabAccount.borrowedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
      else
        userDebt.value = 0
    }
    else
      userDebt.value = 0

    userOriginalDebt = userDebt.value
    repayAmount.value = 0

    localStorage.setItem(tokenId.toString() + "selectedMainSubMarketIndex", mainSubMarketIndex)

    stopInterestCalculation()
    startInterestCalculation()
  }

  function startInterestCalculation()
  {
    if(blockChainData.timeStamp == 0)
      return

    interestAccruedIntervalId = setInterval(() =>
    {
      calculateTokenReserveInterestChangeIndex(blockChainData.timeStamp)
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

  function calculateTokenReserveInterestChangeIndex(timeStamp: number)
  {
    if(!tokenReserve)
      return

    //Token Reserve Borrow Interest Index = Old Borrow Interest Index * (1 + Borrow APY * Δt/Seconds in a Year)
    const oldTime = Number(tokenReserve.lastLendingActivityTimeStamp)
    const changeInTime = timeStamp - oldTime
    const borrowApy = tokenReserve.borrowApy / 10000 //convert from fixed point to decimal

    tokenReserve.newBorrowInterestChangeIndex = Number(tokenReserve.borrowInterestChangeIndex) * (1 + borrowApy * changeInTime / SECONDS_IN_A_YEAR)
  }

  function calculateUserInterest()
  {
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
      repayAmount.value = userDebt.value * 0.5
    if(repayMax.value)
      repayAmount.value = userDebt.value
  }

  async function repayTokens()
  {
    const remainingTabAccounts = lendingUserRemainingTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())
    var instructionsToSend = []
    var lookUpTableAccounts = []
    var refreshingUserRemainingAccounts = []

    try
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

      instructionsToSend.push(...createMonthlyStatementInstructions)
      instructionsToSend.push(refreshUserHealthAndTokenReservesInstruction)
      instructionsToSend.push(repayInstruction)

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

      stopInterestCalculation()
      repaying.value = false
      repayMax.value = false
    }
    catch(error)
    {
      var errorMessage = parseProgramErrorCode(error, anchorPrograms.lending.lendingProgram)
      toastPreTransactionError(errorMessage, toast, "repay_tokens")  
    }
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