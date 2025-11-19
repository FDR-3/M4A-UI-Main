<template>
  <div v-if="withdrawing"
    id="withdrawalModal"
    class="thickBorder"
  >
    <div id="tokenButtonContainer" class="nMediumSmallMarginTop nMediumMarginBottom flexCenterRow">
      <ion-button id="openCopyTokenMintAddressButton" fill="clear" @click="openTokenPopover($event)">
        <img class="noClickEvent" v-if="selectedTokenMintAddress?.toString()==tokenAddressStringsMainNet.solTokenMintAddress"  style="width: 50px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
        <component class="noClickEvent" v-else :is="withdrawSVG" style="width: 44px"></component>
        <ion-text class="noClickEvent" color="dark">{{ subMarketTokenName }}</ion-text><br>
      </ion-button>
      <ion-popover
      id="copyTokenMintAddressPopover"
      :is-open="tokenPopoverOpen" 
      :event="event" 
      @didDismiss="tokenPopoverOpen=false"
      side="top" 
      alignment="center"
      >
        <ion-button id="copyTokenMintAddressButton" class="copyAddressButton" color="green" @click="passByRefWrapperCopyAddress()" @mouseleave="closeTokenPopover($event)">
          <ion-label class="noClickEvent" color="dark">{{ copyTokenMintAddressButtonText }}</ion-label>
        </ion-button>
      </ion-popover>
    </div>

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

    <ion-label class="alignSelfLeft noClickEvent">Bal: {{ userBalance.toFixed(tokenDecimalAmount) }}</ion-label>
    <InputNumber
      v-model="withdrawAmount"
      :inputStyle="{'text-align': 'center'}"
      :minFractionDigits="tokenDecimalAmount" :maxFractionDigits="tokenDecimalAmount"
      :max="userBalance"
      :min="0"
      :step="withdrawIncrementAmount"
      showButtons
      fluid
      @input="(event: { value: any }) => withdrawAmount = event.value"
    />
    <div id="maxButtonContainer" class="alignSelfLeft">
      <button id="maxButton" style="background-color: transparent" @click="withdrawAmount=userBalance">
        <ion-label color="dark">Max</ion-label>
      </button>
    </div>

    <div class="smallMarginTop noClickEvent">
      <ion-text>Value: ${{ withdrawValue }}</ion-text>
    </div>

     <div class="flexCenterRow largeMarginTop nMediumMarginBottom progressCircleWrapper">
      <div style="margin-left: -55px">
      <InfoButton :infoMessage="withdrawOrBorrowInfo"/>
      </div>
      <div title="Interest Earned and Accrued Snapshot" class="progressCircleWrapper nMediumSmallMarginLeft">
        <div class="noClickEvent nMediumSmallMarginTop"><ion-label>0</ion-label></div>
        <div v-if="snapShotTimeDiffValid" class="finishedCircle"></div>
        <div v-else class="inProgressCircle"></div>
      </div>
      <div title="Generate Pyth Price Update" class="progressCircleWrapper">
        <div class="noClickEvent nMediumSmallMarginTop"><ion-label>0</ion-label></div>
        <div v-if="pythTimeDiffValid" class="finishedCircle"></div>
        <div v-else class="inProgressCircle"></div>
      </div>
      <div title="Withdraw" class="progressCircleWrapper">
        <div v-if="withdrawSuccessful" class="finishedCircle"></div>
        <div v-else class="inProgressCircle"></div>
      </div>
    </div>

    <ion-button
      id="withdrawButton"
      color="dark"
      @click="withdrawTokens()"
      class="mediumSmallMarginTop nTinyMarginBottom"
      :disabled="withdrawAmount == 0 || overCommentByteSizeLimit"
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
    SYSTEM_PROGRAM_ADDRESS_STRING,
    DEFAULT_3_PERCENT_FEE_SUBMARKET_INDEX } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { copyTokenMintAddress,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenReserveDevNetMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { lendingUserAccountsHashMap, lendingUserTabAccountsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { generateTabAndPythRemainingAccounts, getLendingUserTabAccountPDA } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { tokenAddressStringsMainNet } from '/src/assets/constants/Addresses.ts'
  import { PythSolanaReceiver, InstructionWithEphemeralSigners } from "@pythnetwork/pyth-solana-receiver"
  import { HermesClient } from "@pythnetwork/hermes-client"
  import * as anchor from "@coral-xyz/anchor"
  import InfoButton from '/src/components/help/InfoButton.vue'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue')

  var accountSelect = ref()
  var accountList = ref()
  var hasAtleast2Accounts = ref()
  var withdrawAmount = ref()
  var withdrawIncrementAmount = ref()
  var withdrawing = ref(false)
  var withdrawSVG = ref()
  var subMarketTokenName = ref()
  var userBalance = ref()
  var userLasterInterestChangeTimeStamp = ref()
  var selectedTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var tokenDecimalAmount = ref()

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")

  var overCommentByteSizeLimit = ref()

  const withdrawOrBorrowInfo = "Info\n\n1. Snapshots of user earned\nand accrued interest no\nolder than 120 seconds are\nrequired for withdrawals\nand borrows.\n(Snapshots are\ngenerated automatically\nafter Deposits, Repayments,\nand Liquidations, but can\nbe generated before\nwithdrawals or borrows if\nstale)\n2. Pyth prices of tokens\ncan be no older than 30\nseconds.\n3. Withdraw tokens while\nSnapshots and Pyth prices\nare still valid."
  var withdrawSuccessful = ref(false)

  var snapShotTimeDiffValid = computed ( () =>
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

  var pythTimeDiffValid = computed ( () =>
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

  var withdrawValue = computed ( () =>
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

  watch(connectedWallet, () =>
  {
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
    withdrawAmount.value = 0

    if(lendingUserTabAccountsHashMap.map)
    {
      const balance = lendingUserTabAccountsHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString() + selectedTokenMintAddress.toString())
      if(balance)
        userBalance.value = Number(balance)
      else
        userBalance.value = 0
    }
    else
      userBalance.value = 0
  })

  function addCloseListner()
  {
    window.addEventListener('click', handleClickOutside);
  }

  function removeCloseListner()
  {
    window.removeEventListener('click', handleClickOutside);
  }

  //When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  const handleClickOutside = function(event: any) 
  {
    if(withdrawing.value)
    {
      const dataPcSectionValue = event?.target?.getAttribute('data-pc-section')

      if((event?.target?.id != "tokenButtonContainer") &&
      (event?.target?.id != "openCopyTokenMintAddressButton") &&
      (event?.target?.id != "copyTokenMintAddressButton") &&
      (event?.target?.id != "copyTokenMintAddressPopover") &&
      (event?.target?.id != "withdrawalModal") &&
      (event?.target?.id != "openWithdrawalModal") &&
      (event?.target?.id != "maxButtonContainer") &&
      (event?.target?.id != "maxButton") &&
      (event?.target?.id != "withdrawButton") &&
      (event?.target?.id != "themeButton") &&
      !event?.target?.classList.contains("tableWithdrawButton") &&
      !event?.target?.classList.contains("native-wrapper") &&
      !event?.target?.classList.contains("native-input") &&
      !event?.target?.classList.contains("input-outline-container") &&
      !event?.target?.classList.contains("input-wrapper") &&
      !event?.target?.classList.contains("input-bottom") &&
      !event?.target?.classList.contains("emoteButton") &&
      !event?.target?.classList.contains("emojiButton") &&
      !event?.target?.classList.contains("sc-ion-label-md-h") &&
      !event?.target?.classList.contains("button") &&
      !event?.target?.classList.contains("p-select") &&
      !event?.target?.classList.contains("p-select-list") &&
      !event?.target?.classList.contains("p-select-label") &&
      !event?.target?.classList.contains("p-select-dropdown") &&
      !event?.target?.classList.contains("p-select-empty-message") &&
      !event?.target?.classList.contains("p-select-option") &&
      !event?.target?.classList.contains("p-select-option-label") &&
      !event?.target?.classList.contains("p-select-list-container") &&
      !event?.target?.classList.contains("p-inputtext") &&
      !event?.target?.classList.contains("p-icon") &&
      !event?.target?.classList.contains("progressCircleWrapper") &&
      !event?.target?.classList.contains("finishedCircle") &&
      !event?.target?.classList.contains("inProgressCircle") &&
      !event?.target?.classList.contains("p-inputnumber") &&
      !event?.target?.classList.contains("p-inputnumber-button") &&
      !event?.target?.classList.contains("p-inputnumber-button-group") &&
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast text from closing modal
      !event?.target?.classList.contains("p-toast-close-button") && //Keep transaction toast close button from closing modal
      !dataPcSectionValue?.includes('button container') &&  //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path')) //Keep transaction toast close button from sometimes closing modal
        withdrawing.value = false

      //Close modal when clicking into input search's behind Modal
      if((event?.target?.placeholder == "Market Search     "))
        withdrawing.value = false
    }
  }

  function openWithdrawalModal(tokenMintAddress: string)
  {
    addCloseListner()
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex

    if(lendingUserAccountsHashMap.map)
    {
      const userAccountList = lendingUserAccountsHashMap.map.get(connectedWallet.addressString)
      if(userAccountList)
      {
        accountList.value = userAccountList
        if(userAccountList.length >= 2)
          hasAtleast2Accounts.value = true
      }
      else
        hasAtleast2Accounts.value = false
    }
    else
      hasAtleast2Accounts.value = false

    const balance = lendingUserTabAccountsHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString() + tokenMintAddress)
    if(balance)
      userBalance.value = Number(balance)
    else
      userBalance.value = 0

    //userLasterInterestChangeTimeStamp.value = .interestChangeLastUpdatedTimeStamp

    const tokenInfo = tokenReserveDevNetMap.get(tokenMintAddress)
    const tokenName = tokenInfo.name
    const decimalAmount = tokenInfo.decimalAmount
    const tokenSVG = tokenInfo.svg

    withdrawAmount.value = 0
    withdrawIncrementAmount.value = 1 / Math.pow(10, decimalAmount)
    selectedTokenMintAddress = new PublicKey(tokenMintAddress)
    tokenDecimalAmount.value = decimalAmount
    withdrawSVG.value = tokenSVG
    subMarketTokenName.value = tokenName
    withdrawing.value = true
  }

  function closeWithdrawalModal()
  {
    withdrawing.value = false
    removeCloseListner()
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

  function passByRefWrapperCopyAddress()
  {
    copyTokenMintAddress(copyTokenMintAddressButtonText, selectedTokenMintAddress)
  }

  function updateStoredSelectedAccount()
  {
    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
    localStorage.setItem("selectedLendingAccountIndex", accountSelect.value.toString())
  }

  async function withdrawTokens()
  {
    console.log(connectedWallet.addressString)
    console.log(accountSelect.value)
    const remainingAccounts = generateTabAndPythRemainingAccounts(connectedWallet.addressString, accountSelect.value)
    var pythIdArray = []

    console.log(remainingAccounts)
    for(var i=0; i<remainingAccounts.length; i+=2)
    {
      console.log(remainingAccounts)
      const tokenInfo = tokenReserveDevNetMap.get(remainingAccounts[i].tokenMintAddress)
      pythIdArray.push(tokenInfo.pythId)
    }

    const hermesClient = new HermesClient("https://hermes.pyth.network/")

    const pythSolanaReceiver = new PythSolanaReceiver(
    {
      connection: anchorPrograms.lending.connection,
      wallet: anchorPrograms.lending.wallet,
    })
    console.log(pythIdArray)
    //const solPythFeedIdByteArray = Buffer.from("ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d", 'hex')
    const priceUpdateData = await hermesClient.getLatestPriceUpdates(pythIdArray, { encoding: "base64" })

    const transactionBuilder = pythSolanaReceiver.newTransactionBuilder({ closeUpdateAccounts: true })

    await transactionBuilder.addPostPriceUpdates(priceUpdateData.binary.data)

    /*const withdrawInstruction = await anchorPrograms.lending.lendingProgram.methods.withdrawTokens
    (
      selectedTokenMintAddress,
      adminAccounts.lendingCEOAddressKey,
      DEFAULT_3_PERCENT_FEE_SUBMARKET_INDEX,
      accountSelect.value,
      new anchor.BN(withdrawAmount.value * Math.pow(10, tokenDecimalAmount.value))//convert to fixedpoint notation
    )
    .accounts({ mint: selectedTokenMintAddress, signer: connectedWallet.publicKey })
    .remainingAccounts(remainingAccounts)
    .instruction()

    transactionBuilder.addInstruction(withdrawInstruction)*/

    await transactionBuilder.addPriceConsumerInstructions(
      async (
        getPriceUpdateAccount: (priceFeedId: string) => PublicKey
      ): Promise<InstructionWithEphemeralSigners[]> => {
        return [
          {
            instruction: await anchorPrograms.lending.lendingProgram.methods.withdrawTokens
              (
                selectedTokenMintAddress,
                adminAccounts.lendingCEOAddressKey,
                DEFAULT_3_PERCENT_FEE_SUBMARKET_INDEX,
                accountSelect.value,
                new anchor.BN(withdrawAmount.value * Math.pow(10, tokenDecimalAmount.value))//convert to fixedpoint notation
              )
              .accounts({ mint: selectedTokenMintAddress, signer: connectedWallet.publicKey })
              .remainingAccounts(remainingAccounts)
              .instruction(),
            signers: []
          },
        ]
      }
    )
    const tabAccountPDA = getLendingUserTabAccountPDA(
     selectedTokenMintAddress,
     adminAccounts.lendingCEOAddressKey,
     DEFAULT_3_PERCENT_FEE_SUBMARKET_INDEX,
     connectedWallet.publicKey,
     accountSelect.value
    )
    const tabAccount = await anchorPrograms.lending.lendingProgram.account.lendingUserTabAccount.fetch(tabAccountPDA)
    console.log(Number(tabAccount.depositedAmount))
    console.log(withdrawAmount.value * Math.pow(10, tokenDecimalAmount.value))
    try
    {
      const tx = await pythSolanaReceiver.provider.sendAll
      (
        await transactionBuilder.buildVersionedTransactions({ computeUnitPriceMicroLamports: 50000 }), { skipPreflight: true }
      )

      /*await anchorPrograms.lending.lendingProgram.methods.withdrawTokens
      (
        selectedTokenMintAddress,
        adminAccounts.lendingCEOAddressKey,
        DEFAULT_3_PERCENT_FEE_SUBMARKET_INDEX,
        accountSelect.value,
        new anchor.BN(withdrawAmount.value * Math.pow(10, tokenDecimalAmount.value))//convert to fixedpoint notation
      )
      .accounts({ mint: selectedTokenMintAddress, signer: connectedWallet.publicKey })
      .remainingAccounts(remainingAccounts)
      .rpc()*/


    
      if(tx.length)
        for(var i=0; i<tx.length; i++)
          await confirmLendingTransaction(tx[i], toast, "withdraw_tokens")
      else
        await confirmLendingTransaction(tx, toast, "withdraw_tokens")

      withdrawing.value = false
    }
    catch(error: any)
    {console.log(error)
      if(error.message.includes("\"Custom\":6000"))
        toastPreTransactionError("StalePriceData: The price data was stale", toast, "withdraw_tokens")
      else if(error.message.includes("\"Custom\":6001"))
        toastPreTransactionError("InsufficientFunds: You can't withdraw more funds than you've deposited or an amount that would expose you to liquidation on purpose", toast, "withdraw_tokens")
      else
        toastPreTransactionError(error, toast, "withdraw_tokens")  
    }
  }

  defineExpose(
  {
    openWithdrawalModal,
    closeWithdrawalModal
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
</style>