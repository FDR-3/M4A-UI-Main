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

    <ion-button
      v-if="anchorPrograms.isLendingProtocolReady"
      id="borrowModalButton"
      color="dark"
      @click="borrowTokens1()"
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
  import { toRaw } from 'vue';
  import { IonButton, IonText, IonPopover, IonLabel } from '@ionic/vue'
  import Select from 'primevue/select'
  import InputNumber from 'primevue/inputnumber'
  import { anchorPrograms, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { VersionedTransaction, TransactionMessage, PublicKey, AddressLookupTableProgram } from "@solana/web3.js"
  import { copyAddress,
    copyTokenMintAddressText,
    confirmLendingTransaction,
    parseProgramErrorCode,
    doesKeyExistInLookUpTable,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { getLendingUserTabAccountPDA, getLendingUserMonthlyStatementAccountPDA } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { subMarketsHashMap, subMarketLookUpTableByOwnerHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { tokenReservesHashMap, tokenReserveFontEndInfoHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { lendingUserAccountsHashMap,
    lendingUserTabAccountsHashMap,
    lendingUserTabAccountListHashMap,
    lendingUserMonthlyStatementsHashMap,
    lendingUserRemainingTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenAddressStrings, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { PythSolanaReceiver, InstructionWithEphemeralSigners } from "@pythnetwork/pyth-solana-receiver"
  import { sendTransactions } from "@pythnetwork/solana-utils";
  import { HermesClient } from "@pythnetwork/hermes-client"
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
  var availableToBorrowAmount = ref(0)
  var availableToBorrowValue = ref("$0.00")
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

  async function borrowTokens1()
  {
    const remainingTabAccounts = lendingUserRemainingTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())
    var pythIdArray: string[] = []
    var createMonthlyStatementInstructions: anchor.web3.TransactionInstruction[] = []
    var borrowTokenPriceAccountIndex: number | null = null
    const uniqueSubMarketOwnersAddressStrings = new Set<string>()

    try
    { 
      for(var i=0; i<remainingTabAccounts.length; i++)
      {
        const tokenInfo = tokenReserveFontEndInfoHashMap.get(remainingTabAccounts[i].tokenMintAddress)
        pythIdArray.push(tokenInfo.pythId)

        //Get index for the selected token to use later
        if(remainingTabAccounts[i].tokenMintAddress == selectedTokenMintAddress.toString())
          borrowTokenPriceAccountIndex = i

        uniqueSubMarketOwnersAddressStrings.add(remainingTabAccounts[i].subMarketOwnerAddress)
      }

      //If user is borrowing from a token they have never interacted with before, add it to the array for price checks
      if(borrowTokenPriceAccountIndex == null)
      {
        const newTokenInfo = tokenReserveFontEndInfoHashMap.get(selectedTokenMintAddress.toString())
        pythIdArray.push(newTokenInfo.pythId)
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
          var remainingRefreshAccounts = []
          var remainingBorrowTokenPriceUpdateAccount = []

          //Don't count the pythIdArray that was added because the user has never interacted before with it here
          const refreshAccountLoopNumber = borrowTokenPriceAccountIndex == null ? pythIdArray.length-1 : pythIdArray.length

          for(var i=0; i<refreshAccountLoopNumber; i++)
          {
            //Push Remaining Tab Account
            remainingRefreshAccounts.push(remainingTabAccounts[i])

            //Push Remaining Token Reserve Account
            const tokenReserve = tokenReservesHashMap.map.get(remainingTabAccounts[i].tokenMintAddress)
            const tokenReserveRemainingAccount =
            {
              pubkey: tokenReserve.pda,
              isSigner: false,
              isWritable: true
            }
            remainingRefreshAccounts.push(tokenReserveRemainingAccount)

            //Push Remaining SubMarket Account
            const subMarket = subMarketsHashMap.map.get(remainingTabAccounts[i].tokenMintAddress +
            remainingTabAccounts[i].subMarketOwnerAddress +
            remainingTabAccounts[i].subMarketIndex.toString())
            const subMarketRemainingAccount =
            {
              pubkey: subMarket.pda,
              isSigner: false,
              isWritable: true
            }
            remainingRefreshAccounts.push(subMarketRemainingAccount)

            //Push Remaining Monthly Statement Account
            const monthlyStatement = lendingUserMonthlyStatementsHashMap.map.get(anchorPrograms.currentStatementMonthNumber.toString() +
            anchorPrograms.currentStatementYear.toString() +
            remainingTabAccounts[i].tokenMintAddress +
            remainingTabAccounts[i].subMarketOwnerAddress +
            remainingTabAccounts[i].subMarketIndex.toString() +
            connectedWallet.addressString +
            accountSelect.value.toString())

            var monthlyStatementPDA: PublicKey

            //Create monthly statement for the new month if it doesn't exist
            if(!monthlyStatement)
            {
              const createNewMonthlyStatementInstruction = await anchorPrograms.lending.lendingProgram.methods.createNewMonthlyStatement
              (
                new PublicKey(remainingTabAccounts[i].tokenMintAddress),
                new PublicKey(remainingTabAccounts[i].subMarketOwnerAddress),
                remainingTabAccounts[i].subMarketIndex,
                connectedWallet.publicKey,
                accountSelect.value
              )
              .instruction()

              createMonthlyStatementInstructions.push(createNewMonthlyStatementInstruction)

              //Determine PDA for new MonthlyStatementAccount that will be created
              monthlyStatementPDA = getLendingUserMonthlyStatementAccountPDA(anchorPrograms.currentStatementMonthNumber,
              anchorPrograms.currentStatementYear,
              new PublicKey(remainingTabAccounts[i].tokenMintAddress),
              new PublicKey(remainingTabAccounts[i].subMarketOwnerAddress),
              remainingTabAccounts[i].subMarketIndex,
              connectedWallet.publicKey,
              accountSelect.value)

              if(!doesKeyExistInLookUpTable(connectedWallet.lendingUserLookUpTableAccount, monthlyStatementPDA))
              {
                const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
                {
                  authority: connectedWallet.publicKey,
                  payer: connectedWallet.publicKey,
                  lookupTable: connectedWallet.lendingUserLookUpTableAddress,
                  addresses: [monthlyStatementPDA]
                })
                console.log("Borrow - Existing Tab, Monthly statement account to extend: " + monthlyStatementPDA.toBase58())
                createMonthlyStatementInstructions.push(extendLookUpTableInstruction)
              }
            }
            else
              monthlyStatementPDA = monthlyStatement.pda

            const monthlyStatementRemainingAccount =
            {
              pubkey: monthlyStatementPDA,
              isSigner: false,
              isWritable: true
            }
            remainingRefreshAccounts.push(monthlyStatementRemainingAccount)

            //Push Remaining Pyth Account For Account Refresh
            const ephemeralPythKey = getPriceUpdateAccount(pythIdArray[i])
            const ephemeralPythPriceUpdateRemainingAccount = 
            {
              pubkey: ephemeralPythKey,
              isSigner: false,
              isWritable: true
            }
            remainingRefreshAccounts.push(ephemeralPythPriceUpdateRemainingAccount)

            //Push Remaining Pyth Account for borrowToken Instruction. It only requires the selected token's price account
            if(borrowTokenPriceAccountIndex == i)
              remainingBorrowTokenPriceUpdateAccount.push(ephemeralPythPriceUpdateRemainingAccount)
          }

          //If borrowing from a token a user has never interacted with before, the pyth price account will be at the end of the array
          if(borrowTokenPriceAccountIndex == null)
          {
            const ephemeralPythKey = getPriceUpdateAccount(pythIdArray[pythIdArray.length-1])
            const ephemeralPythPriceUpdateRemainingAccount = 
            {
              pubkey: ephemeralPythKey,
              isSigner: false,
              isWritable: true
            }
            remainingBorrowTokenPriceUpdateAccount.push(ephemeralPythPriceUpdateRemainingAccount)
          }

          //If borrowing from a Sub Market the user has never interacted with before, extend the Lending User Look Up Table with the new Tab Account
          const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(selectedTokenMintAddress.toString() +
          adminAccounts.lendingCEOAddressString +
          subMarketSelect.value.toString() +
          connectedWallet.addressString +
          accountSelect.value.toString())
          console.log(lendingUserTabAccount)

          //For this scenario, the borrow_tokens function will initialize a new Lending User Tab Account and Monthly Statement Account, but we still want to extend the Look Up Table
          //Add Lending User Tab Account to Lending User Look Up Table if it doesn't exist
          console.log("Account Select: ", accountSelect.value)
          if(!lendingUserTabAccount)
          {console.log("Not lending user tab account found, creating new one...")
            //Determine PDA for new MonthlyStatementAccount that will be created
            const lendingUserTabAccountPDA = getLendingUserTabAccountPDA(selectedTokenMintAddress,
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
              console.log("Borrow - Tab account to extend: " + lendingUserTabAccountPDA.toBase58())
              createMonthlyStatementInstructions.push(extendLookUpTableInstruction)
              console.log(createMonthlyStatementInstructions)
            }

            const monthlyStatement = lendingUserMonthlyStatementsHashMap.map.get(anchorPrograms.currentStatementMonthNumber.toString() +
            anchorPrograms.currentStatementYear.toString() +
            selectedTokenMintAddress.toString() +
            adminAccounts.lendingCEOAddressString +
            subMarketSelect.value.toString() +
            connectedWallet.addressString +
            accountSelect.value.toString())

            //Add Monthly Statement Account to Lending User Look Up Table if it doesn't exist
            if(!monthlyStatement)
            {
              //Determine PDA for new MonthlyStatementAccount that will be created
              const monthlyStatementPDA = getLendingUserMonthlyStatementAccountPDA(anchorPrograms.currentStatementMonthNumber,
              anchorPrograms.currentStatementYear,
              selectedTokenMintAddress,
              adminAccounts.lendingCEOAddressKey,
              subMarketSelect.value,
              connectedWallet.publicKey,
              accountSelect.value)

              if(!doesKeyExistInLookUpTable(connectedWallet.lendingUserLookUpTableAccount, monthlyStatementPDA))
              {
                const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
                {
                  authority: connectedWallet.publicKey,
                  payer: connectedWallet.publicKey,
                  lookupTable: connectedWallet.lendingUserLookUpTableAddress,
                  addresses: [monthlyStatementPDA]
                })
                console.log("Borrow - Non-Existing Tab, Monthly statement account to extend: " + monthlyStatementPDA.toBase58())
                createMonthlyStatementInstructions.push(extendLookUpTableInstruction)
                console.log(createMonthlyStatementInstructions)
              }
            }
          }
          console.log(connectedWallet.lendingUserLookUpTableAccount)
          const refreshUserHealthAndTokenReservesInstruction = await anchorPrograms.lending.lendingProgram.methods.refreshUserHealthChunkAndTokenReserves(connectedWallet.publicKey, accountSelect.value)
          .remainingAccounts(remainingRefreshAccounts)
          .instruction()

          //For when the user is borrowing from a Token Reserve they have never interacted with before. RefreshUserHealthChunkAndTokenReserves will miss the new Token Reserve in this case.
          const refreshTokenReserveInstruction = await anchorPrograms.lending.lendingProgram.methods.refreshTokenReserveOnly(selectedTokenMintAddress).instruction()

          const borrowInstruction = await anchorPrograms.lending.lendingProgram.methods.borrowTokens
          (
            adminAccounts.lendingCEOAddressKey,
            subMarketSelect.value,
            accountSelect.value,
            new anchor.BN(borrowAmount.value * Math.pow(10, tokenDecimalAmount))//convert to fixedpoint notation
          )
          .accounts({ tokenMint: selectedTokenMintAddress, tokenProgram: tokenProgram })
          .remainingAccounts(remainingBorrowTokenPriceUpdateAccount)
          .instruction()

          if(borrowTokenPriceAccountIndex == null)
          {console.log("refresh extra token reserve instruction")
            return[
              { instruction: refreshTokenReserveInstruction, signers: [] },
              { instruction: refreshUserHealthAndTokenReservesInstruction, signers: [] },
              { instruction: borrowInstruction, signers: [] }
            ]
          }
          else
          {console.log("no refresh extra token reserve instruction")
            return[
              { instruction: refreshUserHealthAndTokenReservesInstruction, signers: [] },
              { instruction: borrowInstruction, signers: [] }
            ]
          }
        }
      )

      //Get Look Up Table Accounts for all instructions to reduce transaction size
      var lookUpTableAccounts: anchor.web3.AddressLookupTableAccount[] = []

      //Get Protocol Look Up Table
      lookUpTableAccounts.push(toRaw(anchorPrograms.lendingProtocolLookUpTableAccount))

      //Get SubMarket Look Up Table By Owner
      var subMarketLookTableAccounts: anchor.web3.AddressLookupTableAccount[] = []
      uniqueSubMarketOwnersAddressStrings.forEach((subMarketOwnersAddressString) =>
      {
        const subMarketLookTableAccount = subMarketLookUpTableByOwnerHashMap.map.get(subMarketOwnersAddressString)
        if(subMarketLookTableAccount)
          subMarketLookTableAccounts.push(toRaw(subMarketLookTableAccount))
      })
      lookUpTableAccounts.push(...subMarketLookTableAccounts)

      //Get Lending User Look Up Table Account
      lookUpTableAccounts.push(toRaw(connectedWallet.lendingUserLookUpTableAccount))

      const transactionsToSend = []
      const intialInstructionToSend = []

      if(createMonthlyStatementInstructions.length > 0)
      {
        console.log("creating new monthly statement accounts")
        console.log(createMonthlyStatementInstructions)
        intialInstructionToSend.push(...createMonthlyStatementInstructions)

        const { blockhash } = await anchorPrograms.lending.connection.getLatestBlockhash()
        console.log("Before initalMessageV0")
        console.log("Initial instructions to send:", intialInstructionToSend)
        console.log("Look up table accounts to send:", lookUpTableAccounts)
        const initialMessageV0 = new TransactionMessage({
          payerKey: connectedWallet.publicKey,
          recentBlockhash: blockhash,
          instructions: intialInstructionToSend,
        }).compileToV0Message(lookUpTableAccounts)
        console.log("After initalMessageV0")
        const initTx = new VersionedTransaction(initialMessageV0)
        transactionsToSend.push({ tx: initTx, signers: [] })
      }
      else
        console.log("No new monthly statement accounts needed")
      console.log("Before pythTxs")
      const pythTxs = await transactionBuilder.buildVersionedTransactions({ computeUnitPriceMicroLamports: 50000 })
      console.log(pythTxs)
      console.log(transactionsToSend)
      const fullyCompressedTxs = pythTxs.map((pythTxWrapper: { tx: { message: any; }; signers: any; }) =>
      {
        //Extract the original message directly from the internal tx object
        const message = pythTxWrapper.tx.message;

        //Compile a new V0 message with your custom lookup tables added
        const updatedMessageV0 = anchor.web3.TransactionMessage.decompile(message, {
          //If Pyth used any lookup tables internally, they would be passed here, otherwise empty
          addressLookupTableAccounts: lookUpTableAccounts 
        }).compileToV0Message(lookUpTableAccounts); 

        //Return a fresh VersionedTransaction containing the compressed message
        const newTx = new anchor.web3.VersionedTransaction(updatedMessageV0);
        console.log(newTx.version)
        //CRITICAL: Pass Pyth's generated signers (like ephemeral price update accounts) 
        //along with your newly compressed versioned transaction.
        return { 
          tx: newTx, 
          signers: pythTxWrapper.signers 
        }
      })
      //transactionsToSend.push(...pythTxs)
      transactionsToSend.push(...fullyCompressedTxs)
      console.log(pythTxs)
      console.log(fullyCompressedTxs)
      console.log(transactionsToSend)
      console.log("Before sendAll")

      /*const tx = await anchorPrograms.lending.lendingProgram.provider.sendAll
      (
        transactionsToSend, { skipPreflight: false }
      )*/

      /*const tx = await sendTransactions(
        transactionsToSend,
        pythSolanaReceiver.connection,
        pythSolanaReceiver.wallet
      )*/

      const tx = await pythSolanaReceiver.provider.sendAll
      (
        transactionsToSend, { skipPreflight: false, "maxSupportedTransactionVersion": 0 }
      )
      
      /*const tx = await pythSolanaReceiver.provider.sendAll(
      transactionsToSend, 
      { 
        skipPreflight: false,
        maxSupportedTransactionVersion: 0 // Explicitly authorizes Versioned Transactions (V0)
      })*/

     // Extract and pre-sign transactions with internal/ephemeral keypairs
      /*const preparedTxs = transactionsToSend.map((payload) => {
        const { tx: versionedTx, signers } = payload;
        
        // Apply secondary signers (e.g., Pyth oracle update accounts) if they exist
        if (signers && signers.length > 0) {
          versionedTx.sign(signers);
        }
        
        return versionedTx;
      });

      const connection = anchorPrograms.lending.connection;
      const wallet = anchorPrograms.lending.lendingProgram.provider.wallet;

      // 1. ONE WALLET POPUP: Sign everything at once (Single click experience)
      console.log("Opening single wallet prompt for all transactions...");
      const signedTxs = await wallet.signAllTransactions(preparedTxs);

      const txSignatures: string[] = [];

      // 2. Pipeline Execution: Process sequentially but with ultra-fast 'processed' gating
      for (let i = 0; i < signedTxs.length; i++) {
        const signedTx = signedTxs[i];
        console.log(`Dispatched transaction ${i + 1} of ${signedTxs.length}...`);
        
        // Keep skipPreflight: false while debugging so RPC errors bubble up accurately
        const signature = await connection.sendRawTransaction(signedTx.serialize(), {
          skipPreflight: false, 
          maxRetries: 3,
        });
        
        txSignatures.push(signature);

        // If there are dependent transactions following this one, pause until the bank registers the state
        if (i < signedTxs.length - 1) {
          const latestBlockhash = await connection.getLatestBlockhash("processed");
          await connection.confirmTransaction({
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
          }, "processed"); // Only takes ~400ms; guarantees correct account initialization order
          
          console.log(`Transaction ${i + 1} acknowledged by bank. Moving to next step...`);
        }
      }

      // 3. Final Confirmation: Wait for full network confirmation on the final Borrow transaction
      console.log("All prerequisite data on-chain. Finalizing borrow execution...");
      const finalBlockhash = await connection.getLatestBlockhash("confirmed");
      await connection.confirmTransaction({
        signature: txSignatures[txSignatures.length - 1],
        blockhash: finalBlockhash.blockhash,
        lastValidBlockHeight: finalBlockhash.lastValidBlockHeight,
      }, "confirmed");

      // Map back to your downstream logic seamlessly
      const tx = txSignatures;*/

      /*console.log("Lending User Look Up Table Account for the transaction:", connectedWallet.lendingUserLookUpTableAccount)
      console.log("Look up table accounts for the transaction:", lookUpTableAccounts)
      const { blockhash } = await anchorPrograms.lending.connection.getLatestBlockhash()

      console.log("Before message V0")
      const messageV0 = new TransactionMessage({
        payerKey: connectedWallet.publicKey,
        recentBlockhash: blockhash,
        instructions: instructionsToAdd,
      }).compileToV0Message(lookUpTableAccounts)
      console.log("After message V0")
      const transaction = new VersionedTransaction(messageV0)
      console.log("After transaction initialisation")*/
      //const size = transaction.serialize().length
      //console.log(`Current Transaction Size: ${size} bytes`)

      //const tx = await anchorPrograms.lending.lendingProgram.provider.sendAndConfirm(transaction, pythEphemeralSigners)
      
      /*if(tx.length)
        for(var i=0; i<tx.length; i++)
          await confirmLendingTransaction(tx[i], toast, "borrow_tokens")
      else
        await confirmLendingTransaction(tx, toast, "borrow_tokens")*/

      if(tx.length)
        for(var i=0; i<tx.length; i++)
      {
          await confirmLendingTransaction(tx[i], toast, "borrow_tokens")
          console.log(`Borrow transaction ${i + 1} confirmed: ${tx[i]}`)
      }
      else
      {
        await confirmLendingTransaction(tx, toast, "borrow_tokens")
        console.log(`Borrow transaction confirmed: ${tx}`)
      }

      stopHealthFactorCalculation()
      borrowing.value = false
    }
    catch(error: any)
    {
      var errorMessage = parseProgramErrorCode(error, anchorPrograms.lending.lendingProgram)
      toastPreTransactionError(errorMessage, toast, "borrow_tokens")  
    }
  }

  async function borrowTokens2()
  {
    const remainingTabAccounts = lendingUserRemainingTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())
    var pythIdArray: string[] = []
    var createMonthlyStatementInstructions: anchor.web3.TransactionInstruction[] = []
    var borrowTokenPriceAccountIndex: number | null = null
    const uniqueSubMarketOwnersAddressStrings = new Set<string>()

    try
    { 
      for(var i=0; i<remainingTabAccounts.length; i++)
      {
        const tokenInfo = tokenReserveFontEndInfoHashMap.get(remainingTabAccounts[i].tokenMintAddress)
        uniqueSubMarketOwnersAddressStrings.add(remainingTabAccounts[i].subMarketOwnerAddress)
        pythIdArray.push(tokenInfo.pythId)

        //Get index for the selected token to use later
        if(remainingTabAccounts[i].tokenMintAddress == selectedTokenMintAddress.toString())
          borrowTokenPriceAccountIndex = i
      }

      //If user is borrowing from a token they have never interacted with before, add it to the array for price checks
      if(borrowTokenPriceAccountIndex == null)
      {
        const newTokenInfo = tokenReserveFontEndInfoHashMap.get(selectedTokenMintAddress.toString())
        pythIdArray.push(newTokenInfo.pythId)
      }

      const hermesClient = new HermesClient("https://hermes.pyth.network/")
      const pythSolanaReceiver = new PythSolanaReceiver(
      {
        connection: anchorPrograms.lending.connection,
        wallet: anchorPrograms.lending.wallet,
      })

      const priceUpdateData = await hermesClient.getLatestPriceUpdates(pythIdArray, { encoding: "base64" })
      const transactionBuilder = pythSolanaReceiver.newTransactionBuilder({ closeUpdateAccounts: true })

      //const priceConsumerInstructions: anchor.web3.TransactionInstruction[] = []

      const
      {
        postInstructions,
        priceFeedIdToPriceUpdateAccount,
        closeInstructions,
      } = await pythSolanaReceiver.buildPostPriceUpdateAtomicInstructions(priceUpdateData.binary.data)

      console.log("priceFeedIdToPriceUpdateAccount: ", priceFeedIdToPriceUpdateAccount)
      console.log("postInstructions", postInstructions)
      console.log("closeInstructions", closeInstructions)
      const pythPostInstructions = postInstructions.map((i: { instruction: any; }) => i.instruction)
      const pythCloseInstructions = closeInstructions.map((i: { instruction: any; }) => i.instruction)

      // 2. Extract the associated Keypair/Signer objects
      const pythPostSigners = postInstructions.flatMap((i: { signers: any; }) => i.signers);
      const pythCloseSigners = closeInstructions.flatMap((i: { signers: any; }) => i.signers);

      // Combine them into a single array of additional signers
      const pythEphemeralSigners = [...pythPostSigners, ...pythCloseSigners];

      var remainingRefreshAccounts = []
      var remainingBorrowTokenPriceUpdateAccount = []

      //Don't count the pythIdArray that was added because the user has never interacted before with it here
      const refreshAccountLoopNumber = borrowTokenPriceAccountIndex == null ? pythIdArray.length-1 : pythIdArray.length

      for(var i=0; i<refreshAccountLoopNumber; i++)
      {
        //Push Remaining Tab Account
        remainingRefreshAccounts.push(remainingTabAccounts[i])

        //Push Remaining Token Reserve Account
        const tokenReserve = tokenReservesHashMap.map.get(remainingTabAccounts[i].tokenMintAddress)
        const tokenReserveRemainingAccount =
        {
          pubkey: tokenReserve.pda,
          isSigner: false,
          isWritable: true
        }
        remainingRefreshAccounts.push(tokenReserveRemainingAccount)

        //Push Remaining SubMarket Account
        const subMarket = subMarketsHashMap.map.get(remainingTabAccounts[i].tokenMintAddress +
        remainingTabAccounts[i].subMarketOwnerAddress +
        remainingTabAccounts[i].subMarketIndex.toString())
        const subMarketRemainingAccount =
        {
          pubkey: subMarket.pda,
          isSigner: false,
          isWritable: true
        }
        remainingRefreshAccounts.push(subMarketRemainingAccount)

        //Push Remaining Monthly Statement Account
        const monthlyStatement = lendingUserMonthlyStatementsHashMap.map.get(anchorPrograms.currentStatementMonthNumber.toString() +
        anchorPrograms.currentStatementYear.toString() +
        remainingTabAccounts[i].tokenMintAddress +
        remainingTabAccounts[i].subMarketOwnerAddress +
        remainingTabAccounts[i].subMarketIndex.toString() +
        connectedWallet.addressString +
        accountSelect.value.toString())

        var monthlyStatementPDA: PublicKey

        //Create monthly statement for the new month if it doesn't exist
        if(!monthlyStatement)
        {
          const createNewMonthlyStatementInstruction = await anchorPrograms.lending.lendingProgram.methods.createNewMonthlyStatement
          (
            new PublicKey(remainingTabAccounts[i].tokenMintAddress),
            new PublicKey(remainingTabAccounts[i].subMarketOwnerAddress),
            remainingTabAccounts[i].subMarketIndex,
            connectedWallet.publicKey,
            accountSelect.value
          )
          .instruction()

          createMonthlyStatementInstructions.push(createNewMonthlyStatementInstruction)

          //Determine PDA for new MonthlyStatementAccount that will be created
          monthlyStatementPDA = getLendingUserMonthlyStatementAccountPDA(anchorPrograms.currentStatementMonthNumber,
          anchorPrograms.currentStatementYear,
          new PublicKey(remainingTabAccounts[i].tokenMintAddress),
          new PublicKey(remainingTabAccounts[i].subMarketOwnerAddress),
          remainingTabAccounts[i].subMarketIndex,
          connectedWallet.publicKey,
          accountSelect.value)

          if(!doesKeyExistInLookUpTable(connectedWallet.lendingUserLookUpTableAccount, monthlyStatementPDA))
          {
            const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
            {
              authority: connectedWallet.publicKey,
              payer: connectedWallet.publicKey,
              lookupTable: connectedWallet.lendingUserLookUpTableAddress,
              addresses: [monthlyStatementPDA]
            })
            console.log("Borrow - Existing Tab, Monthly statement account to extend: " + monthlyStatementPDA.toBase58())
            createMonthlyStatementInstructions.push(extendLookUpTableInstruction)
          }
        }
        else
          monthlyStatementPDA = monthlyStatement.pda

        const monthlyStatementRemainingAccount =
        {
          pubkey: monthlyStatementPDA,
          isSigner: false,
          isWritable: true
        }
        remainingRefreshAccounts.push(monthlyStatementRemainingAccount)

        //Push Remaining Pyth Account For Account Refresh
        const priceAccountPDA = priceFeedIdToPriceUpdateAccount[pythIdArray[i]]
        //const ephemeralPythKey = getPriceUpdateAccount(pythIdArray[i])
        const pythPriceUpdateRemainingAccount = 
        {
          pubkey: priceAccountPDA,
          isSigner: false,
          isWritable: true
        }
        remainingRefreshAccounts.push(pythPriceUpdateRemainingAccount)

        //Push Remaining Pyth Account for borrowToken Instruction. It only requires the selected token's price account
        if(borrowTokenPriceAccountIndex == i)
          remainingBorrowTokenPriceUpdateAccount.push(pythPriceUpdateRemainingAccount)
      }

      //If borrowing from a token a user has never interacted with before, the pyth price account will be at the end of the array
      if(borrowTokenPriceAccountIndex == null)
      {
        const priceAccountPDA = priceFeedIdToPriceUpdateAccount[pythIdArray[pythIdArray.length-1]]
        const pythPriceUpdateRemainingAccount = 
        {
          pubkey: priceAccountPDA,
          isSigner: false,
          isWritable: true
        }

        //Push Remaining Pyth Account for borrowToken Instruction. It only requires the selected token's price account
        remainingBorrowTokenPriceUpdateAccount.push(pythPriceUpdateRemainingAccount)
      }

      //If borrowing from a Sub Market the user has never interacted with before, extend the Lending User Look Up Table with the new Tab Account
      const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(selectedTokenMintAddress.toString() +
      adminAccounts.lendingCEOAddressString +
      subMarketSelect.value.toString() +
      connectedWallet.addressString +
      accountSelect.value.toString())
      console.log(lendingUserTabAccount)

      //For this scenario, the borrow_tokens function will initialize a new Lending User Tab Account and Monthly Statement Account, but we still want to extend the Look Up Table
      //Add Lending User Tab Account to Lending User Look Up Table if it doesn't exist
      console.log("Account Select: ", accountSelect.value)
      if(!lendingUserTabAccount)
      {console.log("Not lending user tab account found, creating new one...")
        //Determine PDA for new MonthlyStatementAccount that will be created
        const lendingUserTabAccountPDA = getLendingUserTabAccountPDA(selectedTokenMintAddress,
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
          console.log("Borrow - Tab account to extend: " + lendingUserTabAccountPDA.toBase58())
          createMonthlyStatementInstructions.push(extendLookUpTableInstruction)
          console.log(createMonthlyStatementInstructions)
        }

        const monthlyStatement = lendingUserMonthlyStatementsHashMap.map.get(anchorPrograms.currentStatementMonthNumber.toString() +
        anchorPrograms.currentStatementYear.toString() +
        selectedTokenMintAddress.toString() +
        adminAccounts.lendingCEOAddressString +
        subMarketSelect.value.toString() +
        connectedWallet.addressString +
        accountSelect.value.toString())

        //Add Monthly Statement Account to Lending User Look Up Table if it doesn't exist
        if(!monthlyStatement)
        {
          //Determine PDA for new MonthlyStatementAccount that will be created
          const monthlyStatementPDA = getLendingUserMonthlyStatementAccountPDA(anchorPrograms.currentStatementMonthNumber,
          anchorPrograms.currentStatementYear,
          selectedTokenMintAddress,
          adminAccounts.lendingCEOAddressKey,
          subMarketSelect.value,
          connectedWallet.publicKey,
          accountSelect.value)

          if(!doesKeyExistInLookUpTable(connectedWallet.lendingUserLookUpTableAccount, monthlyStatementPDA))
          {
            const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
            {
              authority: connectedWallet.publicKey,
              payer: connectedWallet.publicKey,
              lookupTable: connectedWallet.lendingUserLookUpTableAddress,
              addresses: [monthlyStatementPDA]
            })
            console.log("Borrow - Non-Existing Tab, Monthly statement account to extend: " + monthlyStatementPDA.toBase58())
            createMonthlyStatementInstructions.push(extendLookUpTableInstruction)
            console.log(createMonthlyStatementInstructions)
          }
        }
      }
      console.log(connectedWallet.lendingUserLookUpTableAccount)
      const refreshUserHealthAndTokenReservesInstruction = await anchorPrograms.lending.lendingProgram.methods.refreshUserHealthChunkAndTokenReserves(connectedWallet.publicKey, accountSelect.value)
      .remainingAccounts(remainingRefreshAccounts)
      .instruction()

      //For when the user is borrowing from a Token Reserve they have never interacted with before. RefreshUserHealthChunkAndTokenReserves will miss the new Token Reserve in this case.
      
      const refreshTokenReserveInstruction = await anchorPrograms.lending.lendingProgram.methods.refreshTokenReserveOnly(selectedTokenMintAddress).instruction()

      const borrowInstruction = await anchorPrograms.lending.lendingProgram.methods.borrowTokens
      (
        adminAccounts.lendingCEOAddressKey,
        subMarketSelect.value,
        accountSelect.value,
        new anchor.BN(borrowAmount.value * Math.pow(10, tokenDecimalAmount))//convert to fixedpoint notation
      )
      .accounts({ tokenMint: selectedTokenMintAddress, tokenProgram: tokenProgram })
      .remainingAccounts(remainingBorrowTokenPriceUpdateAccount)
      .instruction()

      //priceConsumerInstructions.push(refreshUserHealthAndTokenReservesInstruction)
      /*const instructionsWithSigners: InstructionWithEphemeralSigners[] = [
          { instruction: refreshUserHealthAndTokenReservesInstruction, signers: [] }
      ];*/

      //if(refreshTokenReserveInstruction)
        //priceConsumerInstructions.push(refreshTokenReserveInstruction)

      //priceConsumerInstructions.push(borrowInstruction)

      //instructionsWithSigners.push({ instruction: borrowInstruction, signers: [] });

      //return instructionsWithSigners;


      
      const instructionsToAdd: anchor.web3.TransactionInstruction[] = []

      //priceConsumerInstructions.push()
      console.log(instructionsToAdd)

      instructionsToAdd.push(...pythPostInstructions)
      instructionsToAdd.push(refreshUserHealthAndTokenReservesInstruction)
      if(refreshTokenReserveInstruction)
        instructionsToAdd.push(refreshTokenReserveInstruction)
      instructionsToAdd.push(borrowInstruction)
      instructionsToAdd.push(...pythCloseInstructions)

      console.log(instructionsToAdd)

      //Get Look Up Table Accounts for all instructions to reduce transaction size
      var lookUpTableAccounts: anchor.web3.AddressLookupTableAccount[] = []

      //Get Protocol Look Up Table
      lookUpTableAccounts.push(toRaw(anchorPrograms.lendingProtocolLookUpTableAccount))

      //Get SubMarket Look Up Table By Owner
      var subMarketLookTableAccounts: anchor.web3.AddressLookupTableAccount[] = []
      uniqueSubMarketOwnersAddressStrings.forEach((subMarketOwnersAddressString) =>
      {
        const subMarketLookTableAccount = subMarketLookUpTableByOwnerHashMap.map.get(subMarketOwnersAddressString)
        if(subMarketLookTableAccount)
          subMarketLookTableAccounts.push(toRaw(subMarketLookTableAccount))
      })
      lookUpTableAccounts.push(...subMarketLookTableAccounts)

      //Get Lending User Look Up Table Account
      lookUpTableAccounts.push(toRaw(connectedWallet.lendingUserLookUpTableAccount))

      const transactionsToSend = []
      const intialInstructionToSend = []

      if(createMonthlyStatementInstructions.length > 0)
      {
        console.log("creating new monthly statement accounts")
        console.log(createMonthlyStatementInstructions)
        //instructionsToAdd.push(...createMonthlyStatementInstructions)
        intialInstructionToSend.push(...createMonthlyStatementInstructions)

        const { blockhash } = await anchorPrograms.lending.connection.getLatestBlockhash()
        console.log("Before initalMessageV0")
        console.log("Initial instructions to send:", intialInstructionToSend)
        console.log("Look up table accounts to send:", lookUpTableAccounts)
        const initialMessageV0 = new TransactionMessage({
          payerKey: connectedWallet.publicKey,
          recentBlockhash: blockhash,
          instructions: intialInstructionToSend,
        }).compileToV0Message(lookUpTableAccounts)
        console.log("After initalMessageV0")
        const initTx = new VersionedTransaction(initialMessageV0)
        transactionsToSend.push({ tx: initTx, signers: [] })
      }
      else
        console.log("No new monthly statement accounts needed")

      console.log("Lending User Look Up Table Account for the transaction:", connectedWallet.lendingUserLookUpTableAccount)
      console.log("Look up table accounts for the transaction:", lookUpTableAccounts)
      const { blockhash } = await anchorPrograms.lending.connection.getLatestBlockhash()

      console.log("Before message V0")
      const messageV0 = new TransactionMessage({
        payerKey: connectedWallet.publicKey,
        recentBlockhash: blockhash,
        instructions: instructionsToAdd,
      }).compileToV0Message(lookUpTableAccounts)
      console.log("After message V0")
      const transaction = new VersionedTransaction(messageV0)
      console.log("After transaction initialisation")
      const size = transaction.serialize().length
      console.log(`Current Transaction Size: ${size} bytes`)

      const tx = await pythSolanaReceiver.provider.sendAll
      (
        [transaction], { skipPreflight: false }
      )
    
      if(tx.length)
        for(var i=0; i<tx.length; i++)
          await confirmLendingTransaction(tx[i], toast, "borrow_tokens")
      else
        await confirmLendingTransaction(tx, toast, "borrow_tokens")

      stopHealthFactorCalculation()
      borrowing.value = false
    }
    catch(error: any)
    {
      var errorMessage = parseProgramErrorCode(error, anchorPrograms.lending.lendingProgram)
      toastPreTransactionError(errorMessage, toast, "borrow_tokens")  
    }
  }

  function updateStoredSelectedSubMarketIndex(tokenMintAddress: string, mainSubMarketIndex: string)
  {
    borrowAmount.value = 0
    localStorage.setItem(tokenMintAddress + "selectedMainSubMarketIndex", mainSubMarketIndex)
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