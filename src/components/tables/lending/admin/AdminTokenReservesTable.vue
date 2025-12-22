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
        'globalLimitString'
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
      <Column field="globalLimit" header="Global Limit" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.globalLimitString }}
        </template>
      </Column>
      <Column field="tokenDecimalAmount" header="Actions" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRow">
            <ion-button id="openEditTokenReserveModalButton"
            color="dark"
            @click="selectedTokenMintAddress=slotProps.data.tokenMintAddress;
            $emit('editTokenReserveModal', 
              slotProps.data.tokenMintAddress,
              slotProps.data.svg,
              slotProps.data.name,
              slotProps.data.fixedBorrowAPY,
              slotProps.data.useFixedBorrowApy,
              slotProps.data.globalLimit)"
            >
              Edit TokenReserve
            </ion-button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, inject } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonPopover } from '@ionic/vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import { search } from 'ionicons/icons'
  import { tokenReserves, tokenReserveHashMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { tokenAddressStrings } from '/src/assets/constants/Addresses.ts'
  import { PublicKey } from "@solana/web3.js"
  import { copyTokenReserveATA } from '/src/assets/contracts/WalletHelper.vue'
  import { tvl } from '/src/assets/globalStates/AdminAccounts.vue'
  import cloneDeep from 'lodash/cloneDeep'

  var emits = defineEmits(['editTokenReserveModal'])

  var colorHexValue = inject('colorHexValue') as string

  var tokenReserveTableData = ref()
  var showTokenSubMarkets = ref(false)
  var isLoading = ref(true)

  var event = ref()

  var selectedTokenMintAddress: PublicKey
  var publicKeyCheckColor = ref("#6fff7b")

  var tokenReserveATAPopoverOpen = ref(false)
  var copyTokenReserveATAButtonText = ref("Copy Token Reserve ATA")

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
    copyTokenReserveATA(copyTokenReserveATAButtonText, event.value.tokenReserveATA)
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
      const tokenInfo = tokenReserveHashMap.get(tokenMintAddressString)//These are static and don't need to be reactive
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
      processedTableData[i].globalLimit = Number(processedTableData[i].globalLimit) / Math.pow(10, decimalAmount) //Convert to decimal from fixed point notation
      processedTableData[i].globalLimitString = processedTableData[i].globalLimit.toLocaleString()
    }

    tvl.tokenReserveTVL = value
    tokenReserveTableData.value = processedTableData
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