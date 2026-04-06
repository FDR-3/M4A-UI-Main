<template>
  <div class="tableContainer">
    <DataTable
      v-if="!showTokenSubMarkets"
      class="tableMinWidth"
      v-model:filters="filters"
      show-gridlines
      sortField="tokenMintAddress" 
      :sortOrder="-1" 
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
        'fixedBorrowAPYString',
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
              <img v-if="slotProps.data.tokenMintAddress==tokenAddressStrings.solTokenMintAddress" style="width: 40px; height: 32px; margin-left: -8px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
              <component v-else :is="slotProps.data.svg" style="width: 24px; margin-right: 5px"></component>
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
      <Column field="fixedBorrowAPY" header="Fixed Borrow APY%" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.fixedBorrowAPYString }}
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
            @click="openActionsPopover($event, slotProps.data.tokenMintAddress)"
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
              @click="selectedTokenMintAddress=slotProps.data.tokenMintAddress;
              $emit('editTokenReserveModal', 
                slotProps.data.tokenMintAddress,
                slotProps.data.svg,
                slotProps.data.name,
                slotProps.data.solvencyInsuranceFeeRate,
                slotProps.data.fixedBorrowAPY,
                slotProps.data.useFixedBorrowApy,
                slotProps.data.globalLimit)"
              >
                <ion-label color="dark">Edit TokenReserve</ion-label>
              </ion-button>
              <ion-button
              v-if="connectedWallet.addressString==solvencyTreasuryWalletPublicKeyString"
              id="openEditTokenReserveModalButton"
              fill="clear"
              @click="collectSolvencyFees()"
              >
                <ion-label color="dark">Collect Solvency Fees</ion-label>
              </ion-button>
              <ion-button
              v-if="connectedWallet.addressString==adminAccounts.liquidationTreasuryAddress.toString()"
              id="openEditTokenReserveModalButton"
              fill="clear"
              @click="collectLiquidationFees()"
              >
                <ion-label color="dark">Collect Liquidation Fees</ion-label>
              </ion-button>
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
  import { tokenAddressStrings } from '/src/assets/constants/Addresses.ts'
  import { PublicKey } from "@solana/web3.js"
  import { copyAddress, copyTreasuryATAText, confirmLendingTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
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

  function openActionsPopover(e: Event, tokenMintAddress: PublicKey)
  {
    event.value = e
    event.value.tokenMintAddress = tokenMintAddress
    console.log(tokenMintAddress)
    console.log(tokenMintAddress.toString())
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

      const tokenMintAddressString = processedTableData[i].tokenMintAddress.toString()
      const tokenInfo = tokenReserveFontEndInfoHashMap.get(tokenMintAddressString)//These are static and don't need to be reactive
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
      processedTableData[i].fixedBorrowAPY = processedTableData[i].fixedBorrowApy / 100 //Convert to decimal from fixed point notation
      processedTableData[i].fixedBorrowAPYString = processedTableData[i].fixedBorrowAPY.toLocaleString('en-US', {
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
    const tokenInfo = tokenReserveFontEndInfoHashMap.get(event.value.tokenMintAddress.toString())
    tokenProgram = tokenInfo.tokenProgram

    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.claimSolvencyInsuranceFees
      (
        event.value.tokenMintAddress,
        adminAccounts.lendingCEOAddressKey,
        0, //Use Submarket Index 0, needed for monthly statement
        adminAccounts.solvencyTreasuryLendingAccountIndex, //Use Solvency account index 0
        null
      ).accounts({ tokenMint: event.value.tokenMintAddress, tokenProgram: tokenProgram })
      .rpc()
      await confirmLendingTransaction(tx, toast, "claim_solvency_insurance_fees")

      actionsPopoverOpen.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "claim_solvency_insurance_fees")
    }
  }

  async function collectLiquidationFees()
  {
    const tokenInfo = tokenReserveFontEndInfoHashMap.get(event.value.tokenMintAddress.toString())
    tokenProgram = tokenInfo.tokenProgram

    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.claimLiquidationFees
      (
        event.value.tokenMintAddress,
        adminAccounts.lendingCEOAddressKey,
        1, //Use Submarket Index 1, HODL Treasury uses the 100% fee submarket
        adminAccounts.hodlTreasuryLendingAccountIndex, //Use HODL account index 0
        null
      ).accounts({ tokenMint: event.value.tokenMintAddress, tokenProgram: tokenProgram })
      .rpc()
      await confirmLendingTransaction(tx, toast, "claim_liquidation_fees")

      actionsPopoverOpen.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "claim_liquidation_fees")
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