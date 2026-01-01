<template>
  <div v-if="withdrawing"
    id="withdrawalModal"
    class="thickBorder"
    ref="modalRef"
  >
    <div class="nMediumSmallMarginTop nMediumMarginBottom flexCenterRow">
      <ion-button fill="clear" @click="openTokenPopover($event)">
        <img v-if="selectedTokenMintAddress?.toString()==tokenAddressStrings.solTokenMintAddress"  style="width: 50px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
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
        <ion-button class="copyTokenMintAddressButton" color="green" @click="passByRefWrapperCopyAddress()" @mouseleave="closeTokenPopover($event)">
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
      @input="updateValues"
      @update:model-value="calculateHealthFactorValues(); withdrawMax=false"
    />
    <div class="alignSelfLeft">
      <button style="background-color: transparent" @click="withdrawAmount=availableWithdrawalBalance; calculateHealthFactorValues(); withdrawMax=true">
        <ion-label color="dark">Max</ion-label>
      </button>

      <button class="mediumSmallMarginLeft" style="background-color: transparent" @click="withdrawAmount=availableWithdrawalBalance*0.5; calculateHealthFactorValues(); withdrawMax=false">
        <ion-label color="dark">Half</ion-label>
      </button>
    </div>

    <div class="smallMarginTop">
      <ion-text>Value: ${{ withdrawValue }}</ion-text>
    </div>

    <div class="flexCenterRow mediumSmallMarginTop nMediumMarginBottom">
      <div style="margin-left: -15px; margin-right: -4px">
      <InfoButton :infoMessage="withdrawOrBorrowInfo"/>
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
  import { copyTokenMintAddress,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenReserveHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { lendingUserAccountsHashMap,
    lendingUserTabAccountsHashMap,
    lendingUserTabAccountListHashMap,
    lendingUserRemainingTabAccountListHashMap, } from '/src/assets/globalStates/lending/LendingUsers.vue'
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
  var tokenProgram: PublicKey

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

      if(!modalRef.value.contains(event?.target) &&
      !event?.target?.classList.contains("lendingActionButton") &&
      !event?.target?.classList.contains("copyTokenMintAddressButton") &&
      !event?.target?.classList.contains("infoButtonPopover") &&
      !event?.target?.classList.contains("infoButtonText") &&
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast text from closing modal
      !event?.target?.classList.contains("p-toast-close-icon") && //Keep transaction toast close button from closing modal
      !event?.target?.classList.contains("p-toast-close-button") && //Keep transaction toast close button from closing modal
      !dataPcSectionValue?.includes('button container') &&  //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path')) //Keep transaction toast close button from sometimes closing modal
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
    tokenProgram = tokenInfo.tokenProgram

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
      const tokenInfo = tokenReserveHashMap.get(remainingTabAccounts[i].tokenMintAddress)
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

        return[
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