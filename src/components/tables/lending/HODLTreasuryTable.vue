<template>
  <div class="tableContainer">
    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines
      sortField="apy" 
      :sortOrder="-1" 
      size="small" 
      :value="stableCoinTableData"
      rowGroupMode="subheader" groupRowsBy="asset.type"
      :globalFilterFields="['tokenMintAddress', 'hodlATA', 'asset.name', 'chain.name', 'price', 'percentChange24h', 'quanity', 'value']"  
    >
      <template #header>
        <div>
          <h2>HODL Treasury Value: $<span class="rainbowText">{{ tvl.hodlTVL.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}</span></h2>
          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="HODL Treasury Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <br><ion-label id="tableTitle">Stable Coins</ion-label>
        </div>
      </template>
      <template #loading> Loading records. Please wait. </template>
      <Column field="asset.name" header="Asset" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="openTokenPopover($event, slotProps.data)">
              <component :is="slotProps.data.asset.svg" style="width: 24px; margin-left: -11px; margin-right: 5px"></component>
              <ion-label color="dark">{{ slotProps.data.asset.name }}</ion-label>
            </ion-button>
            <ion-popover 
            :is-open="tokenPopoverOpen" 
            :event="event" 
            @didDismiss="tokenPopoverOpen=false"
            side="top" 
            alignment="center"
            >
              <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyAddress()" @mouseleave="closeTokenPopover($event)">
                <ion-label color="dark">{{ copyTreasuryATAButtonText }}</ion-label>
              </ion-button>
            </ion-popover>
          </div>
        </template>
      </Column>
      <Column field="chain.name" header="Chain" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="slotProps.data.chain.source()">
              <component :is="slotProps.data.chain.svg" style="width: 35px; margin-left: -15px; margin-right: -11px"></component>
            </ion-button>
            <span class="nTinyMarginLeft">{{ slotProps.data.chain.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="price" header="Price" style="width: 0%" sortable>
        <template #body="slotProps">
          ${{ slotProps.data.price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })}}
        </template>
      </Column>
      <Column field="percentChange24h" header="24h Percent Change" style="width: 0%" sortable>
        <template #body="slotProps">
           <ion-text :color="slotProps.data.percentChange24h<0 ? 'red' : 'green'">{{ slotProps.data.percentChange24h }}%</ion-text>
        </template>
      </Column>
      <Column field="quanity" header="Quantity" style="width: 0%" sortable></Column>
      <Column field="value" header="Value" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.value.toLocaleString() }}
        </template>
      </Column>
    </DataTable>

    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines size="small" 
      :value="CryptoCurrencyTableData"
      rowGroupMode="subheader" 
      groupRowsBy="asset.type"
      :globalFilterFields="['tokenMintAddress', 'hodlATA', 'asset.name', 'chain.name', 'price', 'percentChange24h', 'quanity', 'value']"
    >
      <template #header>
        <div>
          <br><ion-label id="tableTitle">Crypto Currency</ion-label>
        </div>
      </template>
      <template #loading> Loading records. Please wait. </template>
      <Column field="asset.name" header="Asset" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="openTokenPopover($event, slotProps.data)" style="margin-left: -8px">
              <component v-if="slotProps.data.asset.name=='Sol'" :is="slotProps.data.asset.svg" style="width: 40px; margin-left: -8px; margin-right: -4px"/>
              <component v-else :is="slotProps.data.asset.svg" style="width: 24px; height: 24px; margin-right: 5px"/>
              <ion-label color="dark">{{ slotProps.data.asset.name }}</ion-label>
            </ion-button>
            <ion-popover 
            :is-open="tokenPopoverOpen" 
            :event="event" 
            @didDismiss="tokenPopoverOpen=false"
            side="top" 
            alignment="center"
            >
              <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyAddress()" @mouseleave="closeTokenPopover($event)">
                <ion-label color="dark">{{ copyTreasuryATAButtonText }}</ion-label>
              </ion-button>
            </ion-popover>
          </div>
        </template>
      </Column>
      <Column field="chain.name" header="Chain" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="slotProps.data.chain.source()">
              <component :is="slotProps.data.chain.svg" style="width: 35px; margin-left: -15px; margin-right: -11px"></component>
            </ion-button>
            <span class="nTinyMarginLeft">{{ slotProps.data.chain.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="price" header="Price" style="width: 0%" sortable>
        <template #body="slotProps">
          ${{ slotProps.data.price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })}}
        </template>
      </Column>
      <Column field="percentChange24h" header="24h Percent Change" style="width: 0%" sortable>
        <template #body="slotProps">
           <ion-text :color="slotProps.data.percentChange24h<0 ? 'red' : 'green'">{{ slotProps.data.percentChange24h }}%</ion-text>
        </template>
      </Column>
      <Column field="quanity" header="Quantity" style="width: 0%" sortable></Column>
      <Column field="value" header="Value" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.value.toLocaleString() }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, markRaw, computed } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonPopover, IonText } from '@ionic/vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { hodlTreasuryBalancesDevNetHashMap } from '/src/assets/globalStates/AdminAccounts.vue'
  import { FilterMatchMode } from '@primevue/core/api'
  import { search } from 'ionicons/icons'
  import { copyTreasuryATA } from '/src/assets/contracts/WalletHelper.vue'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
  import { tvl } from '/src/assets/globalStates/AdminAccounts.vue'
  import cloneDeep from 'lodash/cloneDeep'

  const stableCoinTableData = ref()
  const CryptoCurrencyTableData = ref()
  const isLoading = ref(true)
  var stableValue = ref(0)
  var cryptoValue = ref(0)

  const tokenPopoverOpen = ref(false)
  const event = ref()
  var copyTreasuryATAButtonText = ref("Copy Treasury ATA")

  onMounted(() =>
  {
    if(hodlTreasuryBalancesDevNetHashMap.map)
    {
      processHODLStableCoinTableData()
      processHODLCryptoCurrencyTableData()
      tvl.hodlTVL = stableValue.value + cryptoValue.value

      isLoading.value = false
    }
    else
      isLoading.value = true
  })

  watch(hodlTreasuryBalancesDevNetHashMap, () => 
  {
    processHODLStableCoinTableData()
    processHODLCryptoCurrencyTableData()
    tvl.hodlTVL = stableValue.value + cryptoValue.value

    if(isLoading.value)
      isLoading.value = false
  })

  watch(StableCoins, () => 
  {
    processHODLStableCoinTableData()
    tvl.hodlTVL = stableValue.value + cryptoValue.value
  })

  watch(CryptoCurrency, () => 
  {
    processHODLCryptoCurrencyTableData()
    tvl.hodlTVL = stableValue.value + cryptoValue.value
  })

  function openTokenPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.hodlATA = rowData.hodlATA

    tokenPopoverOpen.value = true
  }

  function closeTokenPopover(e: Event) 
  {
    event.value = e
    tokenPopoverOpen.value = false
  }

  function passByRefWrapperCopyAddress()
  {
    copyTreasuryATA(copyTreasuryATAButtonText, event.value.hodlATA)
  }

  function processHODLStableCoinTableData()
  {
    var value = 0
    var unprocessedTableData = []

    for(var i=0; i<StableCoins.length; i++)
    {
      unprocessedTableData.push(cloneDeep(StableCoins[i]))//Keeps HODL and Single Payer tables from writing over each other
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].asset.svg)//Have to markRaw again after cloneDeep
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].chain.svg)//Have to markRaw again after cloneDeep

      const tokenAmount = hodlTreasuryBalancesDevNetHashMap.map.get(unprocessedTableData[i].tokenMintAddress)
      if(tokenAmount)
      {
        unprocessedTableData[i].quanity = tokenAmount as number
        unprocessedTableData[i].value = '$' + tokenAmount

        value = Number(tokenAmount) + Number(value)
      }
      else
      {
        unprocessedTableData[i].quanity = 0.00
        unprocessedTableData[i].value = '$0.00'
      }
    }

    stableValue.value = value
    stableCoinTableData.value = unprocessedTableData
  }

  function processHODLCryptoCurrencyTableData()
  {
    var value = 0
    var unprocessedTableData = []

    for(var i=0; i<CryptoCurrency.length; i++)
    {
      unprocessedTableData.push(cloneDeep(CryptoCurrency[i]))//Keeps HODL and Single Payer tables from writing over each other
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].asset.svg)//Have to markRaw again after cloneDeep
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].chain.svg)//Have to markRaw again after cloneDeep

      const tokenAmount = hodlTreasuryBalancesDevNetHashMap.map.get(unprocessedTableData[i].tokenMintAddress)

      if(tokenAmount)
      {
        unprocessedTableData[i].quanity = tokenAmount as number
        unprocessedTableData[i].value = '$' + tokenAmount

        value = Number(tokenAmount) + Number(value)
      }
      else
      {
        unprocessedTableData[i].quanity = 0.00
        unprocessedTableData[i].value = '$0.00'
      }
    }

    cryptoValue.value = value
    CryptoCurrencyTableData.value = unprocessedTableData
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })
</script>

<style scoped>
  .container
  {
    margin-bottom: 77px
  }
  
  #tableTitle
  {
    margin: 20px
  }

  .tableMinWidth
  {
    min-width: 970px
  }

  ion-input
  {
    --highlight-color: var(--ion-color-green)
  }
</style>