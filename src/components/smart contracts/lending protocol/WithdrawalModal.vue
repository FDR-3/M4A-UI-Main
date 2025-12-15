<template>
  <div v-if="withdrawing"
    id="withdrawalModal"
    class="thickBorder"
  >
    <div id="tokenButtonContainer" class="nMediumSmallMarginTop nMediumMarginBottom flexCenterRow">
      <ion-button id="openCopyTokenMintAddressButton" fill="clear" @click="openTokenPopover($event)">
        <img class="noClickEvent" v-if="selectedTokenMintAddress?.toString()==tokenAddressStrings.solTokenMintAddress"  style="width: 50px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
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

    <ion-label class="alignSelfLeft noClickEvent">Balance: {{ userBalance.toFixed(tokenDecimalAmount) }}</ion-label>
    <ion-label class="alignSelfLeft noClickEvent">Available: {{ availableWithdrawalBalance.toFixed(tokenDecimalAmount) }}</ion-label>
    <InputNumber
      v-model="withdrawAmount"
      :inputStyle="{'text-align': 'center'}"
      :minFractionDigits="tokenDecimalAmount" :maxFractionDigits="tokenDecimalAmount"
      :max="availableWithdrawalBalance"
      :min="0"
      :step="withdrawIncrementAmount"
      showButtons
      fluid
      @input="updateValues"
      @update:model-value="calculateHealthFactorValues(); withdrawMax=false"
    />
    <div id="maxButtonContainer" class="alignSelfLeft">
      <button id="maxButton" style="background-color: transparent" @click="withdrawAmount=availableWithdrawalBalance; calculateHealthFactorValues(); withdrawMax=true">
        <ion-label color="dark">Max</ion-label>
      </button>
    </div>

    <div class="smallMarginTop noClickEvent">
      <ion-text>Value: ${{ withdrawValue }}</ion-text>
    </div>

    <div class="flexCenterRow mediumSmallMarginTop nMediumMarginBottom progressCircleWrapper">
      <div style="margin-left: -15px; margin-right: -4px">
      <InfoButton :infoMessage="withdrawOrBorrowInfo"/>
      </div>
      <div title="Interest Earned and Accrued Snapshot" class="progressBarStep flexCenterColumn progressCircleWrapper nMediumSmallMarginLeft">
        <div class="noClickEvent nMediumSmallMarginTop"><ion-label>{{ snapShotValidCountDown }}</ion-label></div>
        <div v-if="snapShotValidCountDown!=0" class="finishedCircle"></div>
        <div v-else class="inProgressCircle"></div>
      </div>
      <div title="Withdraw" class="progressBarStep flexCenterColumn progressCircleWrapper">
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
  import { copyTokenMintAddress,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenReserveHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { lendingUserAccountsHashMap, lendingUserTabAccountsHashMap, lendingUserTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { generateTabAndPythRemainingAccounts } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { tokenAddressStrings, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { PythSolanaReceiver, InstructionWithEphemeralSigners } from "@pythnetwork/pyth-solana-receiver"
  import { HermesClient } from "@pythnetwork/hermes-client"
  import * as anchor from "@coral-xyz/anchor"
  import InfoButton from '/src/components/help/InfoButton.vue'
  import HealthFactorSmall from '/src/components/smart contracts/lending protocol/HealthFactorSmall.vue'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue')

  var subMarketSelect = ref(0)
  var subMarketList = ref()
  var accountSelect = ref(0)
  var accountList = ref()
  var withdrawAmount = ref()
  var withdrawIncrementAmount = ref()
  var withdrawing = ref(false)
  var withdrawSVG = ref()
  var withdrawMax = ref(false)
  var subMarketTokenName = ref()
  var userBalance = ref()
  var availableWithdrawalBalance = ref()
  var selectedTokenMintAddress = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
  var tokenDecimalAmount = ref()

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")

  const withdrawOrBorrowInfo = "Info\n\n1. Snapshots of user earned\nand accrued interest no\nolder than 120 seconds are\nrequired for withdrawals\nand borrows.\n2. Withdraw tokens while\nSnapshots and are still\nvalid."

  var snapShotValidCountDown = ref(0)
  var snapShotCountDownIntervalId: any
  var pythAccountCountDownIntervalId: any

  var totalAssetValue = ref()
  var totalDebtValue = ref()
  var healthFactor = ref()

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
    if(withdrawing.value)//Don't start another count down if on anothert modal since the withdrawal modal is still mounted even when not visible
    {
      clearSnapShotIntervalCountDown()
      await setSnapShotIntervalCountDown()
    }
  })

  watch(priceObjectMap, () =>
  {
    calculateHealthFactorValues()
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

    //Only want this running if the connected Wallet Address String is changing
    if(newWallet.addressString == oldWallet.addressString && newWallet.selectedLendingUserAccountIndex == oldWallet.selectedLendingUserAccountIndex )
      return

    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
    
    if(lendingUserTabAccountsHashMap.map)
    {
      const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(selectedTokenMintAddress.toString() +
      adminAccounts.lendingCEOAddressString +
      subMarketSelect.value.toString() +
      connectedWallet.addressString +
      accountSelect.value.toString())

      if(lendingUserTabAccount)
      {
        const decimalAmount = tokenDecimalHashMap.get(selectedTokenMintAddress.toString())
        userBalance.value = Number(lendingUserTabAccount.depositedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
      }
      else
        userBalance.value = 0
    }
    else
      userBalance.value = 0

    withdrawAmount.value = 0
    calculateHealthFactorValues()
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
      (event?.target?.id != "withdrawModalButton") &&
      (event?.target?.id != "themeButton") &&
      !event?.target?.classList.contains("tableWithdrawButton") &&
      !event?.target?.classList.contains("native-wrapper") &&
      !event?.target?.classList.contains("native-input") &&
      !event?.target?.classList.contains("input-outline-container") &&
      !event?.target?.classList.contains("input-wrapper") &&
      !event?.target?.classList.contains("input-bottom") &&
      !event?.target?.classList.contains("sc-ion-label-md-h") &&
      !event?.target?.classList.contains("button") &&
      !event?.target?.classList.contains("selectionContainer") &&
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
      !event?.target?.classList.contains("p-inputnumber") &&
      !event?.target?.classList.contains("p-inputnumber-button") &&
      !event?.target?.classList.contains("p-inputnumber-button-group") &&
      !event?.target?.classList.contains("healthFactorBarContainer") &&
      !event?.target?.classList.contains("infoButtonPopover") &&
      !event?.target?.classList.contains("infoButtonText") &&
      !event?.target?.classList.contains("progressCircleWrapper") &&
      !event?.target?.classList.contains("finishedCircle") &&
      !event?.target?.classList.contains("inProgressCircle") &&
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast text from closing modal
      !event?.target?.classList.contains("p-toast-close-button") && //Keep transaction toast close button from closing modal
      !dataPcSectionValue?.includes('button container') &&  //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path')) //Keep transaction toast close button from sometimes closing modal
      {
        clearSnapShotIntervalCountDown()
        clearPythAccountIntervalCountDown()
        withdrawing.value = false
      }  
      
      //Close modal when clicking into input search's behind Modal
      if((event?.target?.placeholder == "Market Search     "))
      {
        clearSnapShotIntervalCountDown()
        clearPythAccountIntervalCountDown()
        withdrawing.value = false
      }  
    }
  }

  async function openWithdrawalModal(tokenMintAddress: string, fdr3SubMarkets: any[])
  {
    addCloseListner()

    const tokenInfo = tokenReserveHashMap.get(tokenMintAddress)
    const tokenName = tokenInfo.name
    const decimalAmount = tokenInfo.decimalAmount
    const tokenSVG = tokenInfo.svg

    subMarketList.value = fdr3SubMarkets
    subMarketSelect.value = Number(localStorage.getItem(tokenMintAddress + "selectedMainSubMarketIndex")) || 0
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex

    if(lendingUserAccountsHashMap.map)
    {
      const userAccountList = lendingUserAccountsHashMap.map.get(connectedWallet.addressString)
      if(userAccountList)
        accountList.value = userAccountList
    }

    const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(tokenMintAddress +
    adminAccounts.lendingCEOAddressString +
    subMarketSelect.value.toString() +
    connectedWallet.addressString +
    accountSelect.value.toString())

    if(lendingUserTabAccount)
      userBalance.value = Number(lendingUserTabAccount.depositedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
    else
      userBalance.value = 0

    withdrawAmount.value = 0
    withdrawIncrementAmount.value = 1 / Math.pow(10, decimalAmount)
    selectedTokenMintAddress = new PublicKey(tokenMintAddress)
    tokenDecimalAmount.value = decimalAmount
    withdrawSVG.value = tokenSVG
    subMarketTokenName.value = tokenName
    withdrawing.value = true

    calculateHealthFactorValues()
    await setSnapShotIntervalCountDown()
  }

  function closeWithdrawalModal()
  {
    withdrawing.value = false
    removeCloseListner()

    clearSnapShotIntervalCountDown()
    clearPythAccountIntervalCountDown()
  }
  
  async function setSnapShotIntervalCountDown()
  {
    const allUserTabAccounts = lendingUserTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())
    const slot = await anchorPrograms.lending.lendingProgram.provider.connection.getSlot();
    const currentBlockTimeStamp = await anchorPrograms.lending.lendingProgram.provider.connection.getBlockTime(slot);
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

  function clearPythAccountIntervalCountDown()
  {
    if(pythAccountCountDownIntervalId != undefined)
    {
      clearInterval(pythAccountCountDownIntervalId)
      pythAccountCountDownIntervalId = undefined
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

  function passByRefWrapperCopyAddress()
  {
    copyTokenMintAddress(copyTokenMintAddressButtonText, selectedTokenMintAddress)
  }

  async function updateStoredSelectedAccount()
  {
    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
    localStorage.setItem("selectedLendingAccountIndex", accountSelect.value.toString())
    clearSnapShotIntervalCountDown()
    await setSnapShotIntervalCountDown()
  }

  function updateValues(event: { value: number | null })
  {
    withdrawAmount.value = event.value
    calculateHealthFactorValues()
  }

  function calculateHealthFactorValues()
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

        calculatedAssetValue += Number(userTabAccounts[i].depositedAmount / Math.pow(10, decimalAmount)) * Number(price)
        calculatedDebtValue += Number(userTabAccounts[i].borrowedAmount / Math.pow(10, decimalAmount)) * Number(price)
      }
    
    const priceOfSelectedToken = Number(priceObjectMap.data[selectedTokenMintAddress.toString()].usdPrice)

    if(calculatedDebtValue == 0)
      availableWithdrawalBalance.value = userBalance.value
    else
    {
      const availableValueBeforeWithdraw = calculatedAssetValue - calculatedDebtValue / 0.7
      const availableToWithdrawAmount = availableValueBeforeWithdraw / priceOfSelectedToken

      if(availableToWithdrawAmount >= userBalance.value)
        availableWithdrawalBalance.value = userBalance.value
      else
        availableWithdrawalBalance.value = availableToWithdrawAmount
    }

    //Account for value that is about to be withdrawn
    calculatedAssetValue -= withdrawAmount.value * Number(priceOfSelectedToken)

    totalAssetValue.value = calculatedAssetValue
    totalDebtValue.value = calculatedDebtValue
    healthFactor.value = ((calculatedAssetValue - calculatedDebtValue) / calculatedAssetValue) * 100
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
    /*
    await transactionBuilder.addPriceConsumerInstructions(
      async (
        // This function returns the temporary key for the freshly posted price update
        getPriceUpdateAccount: (priceFeedId: string) => PublicKey
      ): Promise<InstructionWithEphemeralSigners[]> => {
        
        // **A. Create a new array to hold the updated accounts**
        let updatedRemainingAccounts = [];

        for (let i = 0; i < remainingAccounts.length; i += 2) {
          const tabAccountMeta = remainingAccounts[i];
          const pythAccountMeta = remainingAccounts[i + 1];

          // 1. Keep the Tab Account Meta as is (It holds the permanent key data)
          updatedRemainingAccounts.push(tabAccountMeta);

          // 2. Look up the Price Feed ID needed for this tab account
          const tokenInfo = tokenReserveHashMap.get(tabAccountMeta.tokenMintAddress);
          
          // 3. Get the Ephemeral Pyth Key using the SDK's helper function
          const ephemeralPythKey = getPriceUpdateAccount(tokenInfo.pythId);
          
          // 4. Push the new Ephemeral Pyth Account Meta
          // We overwrite the pubkey with the fresh, temporary account's key
          updatedRemainingAccounts.push({
            isSigner: pythAccountMeta.isSigner,
            isWritable: pythAccountMeta.isWritable,
            pubkey: ephemeralPythKey, // <--- **THIS IS THE KEY CHANGE**
          });
        }

        return [
          {
            instruction: await anchorPrograms.lending.lendingProgram.methods.borrowTokens
              // ... (instruction parameters) ...
              .remainingAccounts(updatedRemainingAccounts) // **Pass the corrected array**
              .instruction(),
            signers: []
          },
        ]
      }
    );*/





    const remainingAccounts = generateTabAndPythRemainingAccounts(connectedWallet.addressString, accountSelect.value)
    var pythIdArray = []

    for(var i=0; i<remainingAccounts.length; i+=2)
    {
      const tokenInfo = tokenReserveHashMap.get(remainingAccounts[i].tokenMintAddress)
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
                subMarketSelect.value,
                accountSelect.value,
                new anchor.BN(withdrawAmount.value * Math.pow(10, tokenDecimalAmount.value)), //convert to fixedpoint notation
                withdrawMax.value
              )
              .accounts({ mint: selectedTokenMintAddress, signer: connectedWallet.publicKey })
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

  function updateStoredSelectedSubMarketIndex(tokenMintAddress: string, mainSubMarketIndex: string)
  {
    const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(tokenMintAddress +
    adminAccounts.lendingCEOAddressString +
    mainSubMarketIndex +
    connectedWallet.addressString +
    accountSelect.value.toString())

    if(lendingUserTabAccount)
    {
      const decimalAmount = tokenDecimalHashMap.get(tokenMintAddress)

      if(lendingUserTabAccount)
        userBalance.value = Number(lendingUserTabAccount.depositedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
      else
        userBalance.value = 0
    }
    else
      userBalance.value = 0

    withdrawAmount.value = 0
    calculateHealthFactorValues()
    localStorage.setItem(selectedTokenMintAddress.toString() + "selectedMainSubMarketIndex", mainSubMarketIndex)
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