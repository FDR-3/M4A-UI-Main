<template>
  <div class="tableContainer">
    <DataTable
      v-if="!showTokenSubMarkets"
      class="tableMinWidth"
      v-model:filters="filters"
      show-gridlines
      sortField="tokenId" 
      :sortOrder="1" 
      size="small" 
      :value="tokenReserveTableData"
      :loading="isLoading"
      :globalFilterFields="
      [
        'name',
        'tokenMintAddress',
        'tokenReserveATA',
        'supplyAPYString',
        'borrowAPYString',
        'baseBorrowAPYString',
        'useFixedBorrowApy',
        'utilizationRateString',
        'solvencyInsuranceFeeRateString',
        'globalLimitString',
        'uncollectedSolvencyInsuranceFeesAmountString',
        'uncollectedLiquidationFeesAmountString'
      ]"  
    >
      <template #header>
          <h2>Admin Token Reserves Table</h2>
        <ion-input v-model="filters['global'].value" fill="outline" placeholder="Reserves Search     ">
          <ion-icon class="tableSearchIcon" slot="start" :icon="search"></ion-icon>
        </ion-input><br>
      </template>
      <template #loading> Loading Reserves. Please wait. </template>
      <Column field="name" header="Token Reserve" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight" >
            <ion-button style="margin-left: -11px; margin-right: -5px" fill="clear" @click="openTokenReserveATAPopover($event, slotProps.data)">
              <component :is="slotProps.data.svg" style="width: 24px; margin-right: 5px"></component>
              <ion-label color="dark">{{ slotProps.data.name }}</ion-label>
            </ion-button>
            <ion-popover 
            :is-open="tokenReserveATAPopoverOpen" 
            :event="event" 
            @didDismiss="tokenReserveATAPopoverOpen=false"
            side="top" 
            alignment="center"
            >
              <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyTokenReserveATA()" @mouseleave="closeTokenReserveATAPopover($event)">
                <ion-label color="light">{{ copyTokenReserveATAButtonText }}</ion-label>
              </ion-button>
            </ion-popover>
          </div>
        </template>
      </Column>
      <Column field="supplyAPY" header="Supply APY%" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.supplyAPYString }}
        </template>
      </Column>
      <Column field="borrowAPY" header="Borrow APY%" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.borrowAPYString }}
        </template>
      </Column>
      <Column field="baseBorrowAPY" header="Base Borrow APY%" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.baseBorrowAPYString }}
        </template>
      </Column>
      <Column field="useFixedBorrowApy" header="Use Fixed Borrow APY%" style="width: 0%" sortable></Column>
      <Column field="utilizationRate" header="Utilization Rate%" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.utilizationRateString }}
        </template>
      </Column>
      <Column field="solvencyInsuranceFeeRate" header="Solvency Insurance Rate" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.solvencyInsuranceFeeRateString }}
        </template>
      </Column>
      <Column field="globalLimit" header="Global Limit" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.globalLimitString }}
        </template>
      </Column>
      <Column field="uncollectedSolvencyInsuranceFeesAmount" header="Uncollected Solvency Fees" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.uncollectedSolvencyInsuranceFeesAmountString }}
        </template>
      </Column>
      <Column field="uncollectedLiquidationFeesAmount" header="Uncollected Liquidation Fees" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.uncollectedLiquidationFeesAmountString }}
        </template>
      </Column>
      <Column field="tokenDecimalAmount" header="Actions" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRow">
            <ion-text v-if="connectedWallet.addressString!=adminAccounts.lendingCEOAddressString &&
            connectedWallet.addressString!=solvencyTreasuryWalletPublicKeyString &&
            connectedWallet.addressString!=adminAccounts.liquidationTreasuryAddress.toString()">
              Lending CEO/Treasuer Not Detected
            </ion-text>

            <ion-button
            v-else
            class="actionsPopoverButton"
            color="dark"
            @click="openActionsPopover($event, slotProps.data)"
            >
              Actions
            </ion-button>
            <ion-popover 
            :is-open="actionsPopoverOpen" 
            :event="event" 
            @didDismiss="actionsPopoverOpen=false"
            side="top" 
            alignment="center"
            >
              <ion-button
              v-if="connectedWallet.addressString==adminAccounts.lendingCEOAddressString"
              id="openEditTokenReserveModalButton"
              fill="clear"
              @click="selectedTokenMintAddress=event.tokenMintAddress;
              $emit('editTokenReserveModal',
                event.tokenId,
                event.tokenMintAddress,
                event.svg,
                event.name,
                event.solvencyInsuranceFeeRate,
                event.baseBorrowAPY,
                event.useFixedBorrowApy,
                event.globalLimit)"
              >
                <ion-label color="dark" class="noClickEvent">Edit TokenReserve</ion-label>
              </ion-button>
              
              <ion-button
              v-if="connectedWallet.addressString==solvencyTreasuryWalletPublicKeyString &&
              anchorPrograms.isLendingProtocolReady && connectedWallet.lendingUserLUTAccountReady"
              fill="clear"
              @click="collectSolvencyFees()"
              >
                <ion-label color="dark">Collect Solvency Fees</ion-label>
              </ion-button>
              <ion-text v-else-if="connectedWallet.addressString==solvencyTreasuryWalletPublicKeyString">Loading</ion-text>

              <ion-button
                v-if="connectedWallet.addressString==adminAccounts.liquidationTreasuryAddress.toString() &&
                anchorPrograms.isLendingProtocolReady && connectedWallet.lendingUserLUTAccountReady"
                fill="clear"
                @click="collectLiquidationFees()"
                >
                  <ion-label color="dark">Collect Liquidation Fees</ion-label>
              </ion-button>
              <ion-text v-else-if="connectedWallet.addressString==adminAccounts.liquidationTreasuryAddress.toString()">Loading</ion-text>
            </ion-popover>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, inject } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonPopover, IonText } from '@ionic/vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import { search } from 'ionicons/icons'
  import { tokenReserves, tokenReserveFontEndInfoHashMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { getLendingUserLookUpTableAddressAndInstructions, sendVersionedLendingProtocolTransaction } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { tokenAddressStrings } from '/src/assets/constants/Addresses.ts'
  import { PublicKey, VersionedTransaction, TransactionMessage } from "@solana/web3.js"
  import { copyAddress,
    copyTreasuryATAText,
    confirmLendingTransaction,
    parseProgramErrorCode,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { adminAccounts, tvl } from '/src/assets/globalStates/AdminAccounts.vue'
  import { solvencyTreasuryWalletPublicKeyString } from '/src/assets/constants/Addresses.ts'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import cloneDeep from 'lodash/cloneDeep'

  var emits = defineEmits(['editTokenReserveModal'])

  var toast = inject('toast')
  var colorHexValue = inject('colorHexValue') as string

  var tokenReserveTableData = ref()
  var showTokenSubMarkets = ref(false)
  var isLoading = ref(true)
  var tokenProgram: PublicKey

  var actionsPopoverOpen = ref(false)
  var event = ref()

  var selectedTokenMintAddress: PublicKey
  var publicKeyCheckColor = ref("#6fff7b")

  var tokenReserveATAPopoverOpen = ref(false)
  var copyTokenReserveATAButtonText = ref(copyTreasuryATAText)

  onMounted(() =>
  {
    if(tokenReserves.data)
    {
      processTokenReserveTableData()

      isLoading.value = false
    }
    else
      isLoading.value = true
  })

  watch(tokenReserves, () =>
  {
    processTokenReserveTableData()

    if(isLoading.value)
      isLoading.value = false
  })

  function openTokenReserveATAPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.tokenReserveATA = rowData.tokenReserveATA

    tokenReserveATAPopoverOpen.value = true
  }

  function closeTokenReserveATAPopover(e: Event) 
  {
    event.value = e
    tokenReserveATAPopoverOpen.value = false
  }

  function passByRefWrapperCopyTokenReserveATA()
  {
    copyAddress(copyTokenReserveATAButtonText, event.value.tokenReserveATA)
  }

  function openActionsPopover(e: Event, rowData: any)
  {
    event.value = e
    event.value.tokenId = rowData.tokenId
    event.value.tokenMintAddress = rowData.tokenMintAddress
    event.value.svg = rowData.svg
    event.value.name = rowData.name
    event.value.solvencyInsuranceFeeRate = rowData.solvencyInsuranceFeeRate
    event.value.baseBorrowAPY = rowData.baseBorrowAPY
    event.value.useFixedBorrowApy = rowData.useFixedBorrowApy
    event.value.globalLimit = rowData.globalLimit
    actionsPopoverOpen.value = true
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  function processTokenReserveTableData()
  {
    var value = 0
    var processedTableData = []
    var newTableData = cloneDeep(tokenReserves)

    if(!newTableData.data)
      return

    for(var i=0; i<newTableData.data.length; i++)
    {
      processedTableData.push(newTableData.data[i])

      const tokenId = processedTableData[i].tokenId
      const tokenInfo = tokenReserveFontEndInfoHashMap.get(tokenId)//These are static and don't need to be reactive
      const decimalAmount = tokenInfo.decimalAmount

      processedTableData[i].name = tokenInfo.name
      processedTableData[i].svg = tokenInfo.svg
      processedTableData[i].source = tokenInfo.source
      processedTableData[i].tokenReserveATA = tokenInfo.ata

      processedTableData[i].supplyAPY = processedTableData[i].supplyApy / 100 //Convert to decimal from fixed point notation
      processedTableData[i].supplyAPYString = processedTableData[i].supplyAPY.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 }) + '%'
      processedTableData[i].borrowAPY = processedTableData[i].borrowApy / 100 //Convert to decimal from fixed point notation
      processedTableData[i].borrowAPYString = processedTableData[i].borrowAPY.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 }) + '%'
      processedTableData[i].baseBorrowAPY = processedTableData[i].baseBorrowApy / 100 //Convert to decimal from fixed point notation
      processedTableData[i].baseBorrowAPYString = processedTableData[i].baseBorrowAPY.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 }) + '%'
      processedTableData[i].utilizationRate = processedTableData[i].utilizationRate / 100 //Convert to decimal from fixed point notation 
      processedTableData[i].utilizationRateString = processedTableData[i].utilizationRate.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 }) + '%'
      processedTableData[i].solvencyInsuranceFeeRate = processedTableData[i].solvencyInsuranceFeeRate // Already converted in .../assets/contracts/Solana/LendingProtocol.vue 
      processedTableData[i].solvencyInsuranceFeeRateString = processedTableData[i].solvencyInsuranceFeeRate.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 }) + '%'
      processedTableData[i].globalLimit = Number(processedTableData[i].globalLimit) / Math.pow(10, decimalAmount) //Convert to decimal from fixed point notation
      processedTableData[i].globalLimitString = processedTableData[i].globalLimit.toLocaleString()
      processedTableData[i].uncollectedSolvencyInsuranceFeesAmount = Number(processedTableData[i].uncollectedSolvencyInsuranceFeesAmount)
      processedTableData[i].uncollectedSolvencyInsuranceFeesAmountString = processedTableData[i].uncollectedSolvencyInsuranceFeesAmount.toLocaleString('en-US', {
      minimumFractionDigits: decimalAmount,
      maximumFractionDigits: decimalAmount })
      processedTableData[i].uncollectedLiquidationFeesAmount = Number(processedTableData[i].uncollectedLiquidationFeesAmount)
      processedTableData[i].uncollectedLiquidationFeesAmountString = processedTableData[i].uncollectedLiquidationFeesAmount.toLocaleString('en-US', {
      minimumFractionDigits: decimalAmount,
      maximumFractionDigits: decimalAmount })
    }

    tvl.tokenReserveTVL = value
    tokenReserveTableData.value = processedTableData
  }

  async function collectSolvencyFees()
  {
    try
    {
      var lookUpTableAccounts = []

      var [lendingUserLookUpTableAddress, instructionsToSend, creatingNewLookUpTable] = await getLendingUserLookUpTableAddressAndInstructions(connectedWallet.publicKey,
      adminAccounts.solvencyTreasuryLendingAccountIndex, //Use Solvency account index 0
      connectedWallet.lendingUserLookUpTableAccount,
      event.value.tokenId,
      adminAccounts.lendingCEOAddressKey,
      0) //Solvency Fees are collected to a wallet to keep it separate from the Lending Protocol. The Submarket choice is just to determine which Tab and Monthly Statement account will get updated

      const tokenInfo = tokenReserveFontEndInfoHashMap.get(event.value.tokenId)
      tokenProgram = tokenInfo.tokenProgram

      const claimSolvencyInsuranceFeesInstruction = await anchorPrograms.lending.lendingProgram.methods.claimSolvencyInsuranceFees
      (
        0, //Solvency Fees are collected to a wallet to keep it separate from the Lending Protocol. The Submarket choice is just to determine which Tab and Monthly Statement account will get updated
        adminAccounts.solvencyTreasuryLendingAccountIndex, //Use Solvency account index 0
        null,
        creatingNewLookUpTable ? lendingUserLookUpTableAddress : null
      )
      .accounts({ subMarketOwner: adminAccounts.lendingCEOAddressKey, tokenMint: event.value.tokenMintAddress, tokenProgram: tokenProgram })
      .instruction()

      instructionsToSend.push(claimSolvencyInsuranceFeesInstruction)

      //Get Lending Protocol Look Up Table Account
      lookUpTableAccounts.push(anchorPrograms.lendingProtocolLookUpTableAccount)

      //Not worth getting submarket when it's just 1 account in this case. It's 32 bytes by itself, the look up table account would be 35 bytes

      //Get Lending User Look Up Table Account
      if(connectedWallet.lendingUserLookUpTableAccount)//Won't be available if first lending action
        lookUpTableAccounts.push(connectedWallet.lendingUserLookUpTableAccount)

      const tx = await sendVersionedLendingProtocolTransaction(instructionsToSend, lookUpTableAccounts)

      await confirmLendingTransaction(tx, toast, "claim_solvency_insurance_fees")

      actionsPopoverOpen.value = false
    }
    catch(error)
    {
      var errorMessage = parseProgramErrorCode(error, anchorPrograms.lending.lendingProgram)
      toastPreTransactionError(errorMessage, toast, "claim_solvency_insurance_fees")
    }
  }

  async function collectLiquidationFees()
  { 
    try
    {
      var lookUpTableAccounts = []

      var [lendingUserLookUpTableAddress, instructionsToSend, creatingNewLookUpTable] = await getLendingUserLookUpTableAddressAndInstructions(connectedWallet.publicKey,
      adminAccounts.hodlTreasuryLendingAccountIndex, //Use HODL account index 0
      connectedWallet.lendingUserLookUpTableAccount,
      event.value.tokenId,
      adminAccounts.lendingCEOAddressKey,
      1) //Use Submarket Index 1, HODL Treasury uses the 100% fee submarket, so it should collect in that sub market. Solvency Fees come from the Token Reserve but you choose which Sub Market to Credit.

      const claimLiquidationFeesInstruction = await anchorPrograms.lending.lendingProgram.methods.claimLiquidationFees
      (
        1, //Use Submarket Index 1, HODL Treasury uses the 100% fee submarket, so it should collect in that sub market. Solvency Fees come from the Token Reserve but you choose which Sub Market to Credit.
        adminAccounts.hodlTreasuryLendingAccountIndex, //Use HODL account index 0
        null,
        creatingNewLookUpTable ? lendingUserLookUpTableAddress : null
      )
      .accounts({ tokenMintAddress: event.value.tokenMintAddress, subMarketOwner: adminAccounts.lendingCEOAddressKey })
      .instruction()

      instructionsToSend.push(claimLiquidationFeesInstruction)

      //Get Lending Protocol Look Up Table Account
      lookUpTableAccounts.push(anchorPrograms.lendingProtocolLookUpTableAccount)

      //Not worth getting submarket when it's just 1 account in this case. It's 32 bytes by itself, the look up table account would be 35 bytes

      //Get Lending User Look Up Table Account
      if(connectedWallet.lendingUserLookUpTableAccount)//Won't be available if first lending action
        lookUpTableAccounts.push(connectedWallet.lendingUserLookUpTableAccount)

      const tx = await sendVersionedLendingProtocolTransaction(instructionsToSend, lookUpTableAccounts)

      await confirmLendingTransaction(tx, toast, "claim_liquidation_fees")

      actionsPopoverOpen.value = false
    }
    catch(error)
    {
      var errorMessage = parseProgramErrorCode(error, anchorPrograms.lending.lendingProgram)
      toastPreTransactionError(errorMessage, toast, "claim_liquidation_fees")
    }
  }
</script>

<style scoped>
  .container
  {
    margin-bottom: 77px
  }

  /*Set row height to higest possible value*/
  #tokenReserveSubMarketsTable :deep(.p-datatable-tbody > tr)
  {
    height: 104px !important
  }

  #tableTitle
  {
    margin: 20px
  }

  .tableMinWidth
  {
    min-width: 1340px
  }

  ion-input
  {
    --highlight-color: v-bind(colorHexValue) !important
  }

  .p-inputnumber:hover .p-inputnumber-input:not(:focus)
  {
    border-color: var(--ion-color-gray) !important
  }

  .p-inputnumber-input:focus
  {
    --p-inputtext-focus-border-color: #6fff7b !important
  }

  .p-inputtext:focus-within
  {
    --p-inputtext-focus-border-color: v-bind(publicKeyCheckColor) !important
  }
</style>