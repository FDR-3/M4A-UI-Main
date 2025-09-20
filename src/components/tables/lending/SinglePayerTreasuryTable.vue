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
      :globalFilterFields="['asset.name', 'chain.name', 'price', 'app.name', 'quanity', 'value']"  
    >
      <template #header>
        <div>
          <h2>Single Payer Treasury Value <br>(Amount Available For Claim Payouts): $<span class="rainbowText">{{ totalValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}</span></h2>
          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="Single Payer Treasury Search     ">
              <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <br><ion-label id="tableTitle">Stable Coins</ion-label>
        </div>
      </template>
      <template #loading> Loading records. Please wait. </template>
      <Column field="asset" header="Asset" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="slotProps.data.asset.source()">
              <component :is="slotProps.data.asset.svg" style="width: 24px; margin-left: -11px; margin-right: -11px"></component>
            </ion-button>
            <span>{{ slotProps.data.asset.name }}</span>
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
      :globalFilterFields="['asset.name', 'chain.name', 'price', 'app.name', 'quanity', 'value']"
    >
      <template #header>
        <div>
          <br><ion-label id="tableTitle">Crypto Currency</ion-label>
        </div>
      </template>
      <template #loading> Loading records. Please wait. </template>
      <Column field="asset" header="Asset" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="slotProps.data.asset.source()" style="margin-left: -8px; margin-right: -10px">
              <component v-if="slotProps.data.asset.name=='Sol'" :is="slotProps.data.asset.svg" style="width: 40px; margin-left: -8px; margin-right: -4px" />
              <component v-else :is="slotProps.data.asset.svg" style="width: 24px; height: 24px; margin-right: 2px" />
            </ion-button>
            <span>{{ slotProps.data.asset.name }}</span>
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
  import { ref, onMounted, watch, markRaw } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton } from '@ionic/vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { singlePayerTreasuryBalancesDevNetHashMap } from '/src/assets/globalStates/AdminAccounts.vue'
  import { FilterMatchMode } from '@primevue/core/api'
  import { search } from 'ionicons/icons'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
  import cloneDeep from 'lodash/cloneDeep'

  const stableCoinTableData = ref()
  const CryptoCurrencyTableData = ref()
  const isLoading = ref(true)
  var totalValue = ref(0)

  onMounted(() =>
  {
    if(singlePayerTreasuryBalancesDevNetHashMap.map)
    {
      processSinglePayerStableCoinTableData()
      processSinglePayerCryptoCurrencyTableData()

      isLoading.value = false
    }
    else
      isLoading.value = true
  })

  watch(singlePayerTreasuryBalancesDevNetHashMap, () => 
  {
    processSinglePayerStableCoinTableData()
    processSinglePayerCryptoCurrencyTableData()

    if(isLoading.value)
      isLoading.value = false
  })

  watch(StableCoins, () => 
  {
    processSinglePayerStableCoinTableData()
  })

  watch(CryptoCurrency, () => 
  {
    processSinglePayerCryptoCurrencyTableData()
  })

  function processSinglePayerStableCoinTableData()
  {
    var unprocessedTableData = []

    for(var i=0; i<StableCoins.length; i++)
    {
      unprocessedTableData.push(cloneDeep(StableCoins[i]))//Keeps SinglePayer and Single Payer tables from writing over each other
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].asset.svg)//Have to markRaw again after cloneDeep
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].chain.svg)//Have to markRaw again after cloneDeep

      const tokenAmount = singlePayerTreasuryBalancesDevNetHashMap.map.get(unprocessedTableData[i].tokenMintAddress)
      if(tokenAmount)
      {
        unprocessedTableData[i].quanity = tokenAmount as number
        unprocessedTableData[i].value = '$' + tokenAmount

        totalValue.value = Number(tokenAmount) + Number(totalValue.value)
      }
      else
      {
        unprocessedTableData[i].quanity = 0.00
        unprocessedTableData[i].value = '$0.00'
      }
    }

    stableCoinTableData.value = unprocessedTableData
  }

  function processSinglePayerCryptoCurrencyTableData()
  {
    var unprocessedTableData = []

    for(var i=0; i<CryptoCurrency.length; i++)
    {
      unprocessedTableData.push(cloneDeep(CryptoCurrency[i]))//Keeps SinglePayer and Single Payer tables from writing over each other
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].asset.svg)//Have to markRaw again after cloneDeep
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].chain.svg)//Have to markRaw again after cloneDeep

      const tokenAmount = singlePayerTreasuryBalancesDevNetHashMap.map.get(unprocessedTableData[i].tokenMintAddress)
      if(tokenAmount)
      {
        unprocessedTableData[i].quanity = tokenAmount as number
        unprocessedTableData[i].value = '$' + tokenAmount

        totalValue.value = Number(tokenAmount) + Number(totalValue.value)
      }
      else
      {
        unprocessedTableData[i].quanity = 0.00
        unprocessedTableData[i].value = '$0.00'
      }
    }

    CryptoCurrencyTableData.value = unprocessedTableData
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })
</script>

<style scoped>
  #tableTitle
  {
    margin: 90px
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