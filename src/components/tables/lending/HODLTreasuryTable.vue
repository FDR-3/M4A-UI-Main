<template>
  <div class="tableContainer">
    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines
      size="small" 
      :value="stableCoinTableData"
      :globalFilterFields="
      [
        'tokenMintAddress',
        'hodlATA',
        'asset.name',
        'chain.name',
        'priceString',
        'percentChange24h',
        'walletString',
        'unCollectedFeeString',
        'depositString',
        'valueString'
      ]"  
    >
      <template #header>
        <div>
          <h2>HODL Treasury Value: $<span class="rainbowText">{{ tvl.hodlTVL.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}</span>
          </h2>
          <!--<h2 class="nMediumMarginTop">7 Day Projection Rate: $<span class="rainbowText">{{ tvl.hodlTVL.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}</span>
          </h2>-->
          <h2 class="nMediumMarginTop">7 Day Projection Rate: $<span class="rainbowText">{{ (0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}</span>
          </h2>
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
                <ion-label color="light">{{ copyTreasuryATAButtonText }}</ion-label>
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
           {{ slotProps.data.priceString }}
        </template>
      </Column>
      <Column field="percentChange24h" header="24h% Change" style="width: 0%" sortable>
        <template #body="slotProps">
           <ion-text :color="slotProps.data.percentChange24h<0 ? 'red' : 'green'">{{ slotProps.data.percentChange24h }}%</ion-text>
        </template>
      </Column>
      <Column field="wallet" header="Wallet" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.walletString }}
        </template>
      </Column>
      <Column field="unCollectedFees" header="UnCollected Fees" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.unCollectedFeeString }}
        </template>
      </Column>
      <Column field="deposits" header="Deposits" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.depositString }}
        </template>
      </Column>
      <Column field="value" header="Value" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.valueString }}
        </template>
      </Column>
    </DataTable>

    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines size="small" 
      :value="CryptoCurrencyTableData"
      :globalFilterFields="
      [
        'tokenMintAddress',
        'hodlATA',
        'asset.name',
        'chain.name',
        'priceString',
        'percentChange24h',
        'unCollectedFeeString',
        'depositString',
        'valueString'
      ]"
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
              <component v-if="slotProps.data.asset.name=='Sol'" :is="slotProps.data.asset.svg" style="width: 40px; height: 32px; margin-left: -8px; margin-right: -4px"/>
              <component v-else :is="slotProps.data.asset.svg" style="width: 24px; height: 32px; margin-right: 5px"/>
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
                <ion-label color="light">{{ copyTreasuryATAButtonText }}</ion-label>
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
           {{ slotProps.data.priceString }}
        </template>
      </Column>
      <Column field="percentChange24h" header="24h% Change" style="width: 0%" sortable>
        <template #body="slotProps">
           <ion-text :color="slotProps.data.percentChange24h<0 ? 'red' : 'green'">{{ slotProps.data.percentChange24h }}%</ion-text>
        </template>
      </Column>
      <Column field="unCollectedFees" header="UnCollected Fees" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.unCollectedFeeString }}
        </template>
      </Column>
      <Column field="deposits" header="Deposits" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.depositString }}
        </template>
      </Column>
      <Column field="value" header="Value" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.valueString }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, markRaw } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonPopover, IonText } from '@ionic/vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { hodlTreasuryWalletBalancesHashMap } from '/src/assets/globalStates/AdminAccounts.vue'
  import { subMarketsHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserTabAccountsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { FilterMatchMode } from '@primevue/core/api'
  import { search } from 'ionicons/icons'
  import { copyTreasuryATA } from '/src/assets/contracts/WalletHelper.vue'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
  import { tvl } from '/src/assets/globalStates/AdminAccounts.vue'
  import { tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import cloneDeep from 'lodash/cloneDeep'

  var stableCoinTableData = ref()
  var CryptoCurrencyTableData = ref()
  var isLoading = ref(true)
  var stableValue = ref(0)
  var cryptoValue = ref(0)

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTreasuryATAButtonText = ref("Copy Treasury ATA")

  onMounted(() =>
  {
    if(hodlTreasuryWalletBalancesHashMap.map && lendingUserTabAccountsHashMap.map)
    {
      processHODLStableCoinTableData()
      processHODLCryptoCurrencyTableData()
      tvl.hodlTVL = stableValue.value + cryptoValue.value

      isLoading.value = false
    }
    else
      isLoading.value = true
  })

  watch(hodlTreasuryWalletBalancesHashMap, () => 
  {
    processHODLStableCoinTableData()
    processHODLCryptoCurrencyTableData()
    tvl.hodlTVL = stableValue.value + cryptoValue.value

    if(isLoading.value)
      isLoading.value = false
  })

  watch(lendingUserTabAccountsHashMap, () => 
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
    if(!hodlTreasuryWalletBalancesHashMap.map || !lendingUserTabAccountsHashMap.map)
      return

    var value = 0
    var unprocessedTableData = []

    for(var i=0; i<StableCoins.length; i++)
    {
      unprocessedTableData.push(cloneDeep(StableCoins[i]))//Keeps HODL and Single Payer tables from writing over each other
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].asset.svg)//Have to markRaw again after cloneDeep
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].chain.svg)//Have to markRaw again after cloneDeep

      const decimalAmount = tokenDecimalHashMap.get(unprocessedTableData[i].tokenMintAddressString)

      //Set Wallet Amounts
      const tokenAmount = hodlTreasuryWalletBalancesHashMap.map.get(unprocessedTableData[i].tokenMintAddressString)
      if(tokenAmount)
      {
        unprocessedTableData[i].wallet = Number(tokenAmount)
        unprocessedTableData[i].walletString = tokenAmount
      }
      else
      {
        unprocessedTableData[i].wallet = 0
        unprocessedTableData[i].walletString = (0).toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })
      }

      //Set UnCollected Fee Amounts
      const subMarket = subMarketsHashMap.map.get(unprocessedTableData[i].tokenMintAddressString +
      adminAccounts.lendingCEOAddressString +
      adminAccounts.lendingMain3PercentSubMarketIndex.toString())
      if(subMarket)
      {
        unprocessedTableData[i].unCollectedFees = Number(subMarket.uncollectedFeesAmount)
        unprocessedTableData[i].unCollectedFeeString = subMarket.uncollectedFeesAmount
      }
      else
      {
        unprocessedTableData[i].unCollectedFees = 0
        unprocessedTableData[i].unCollectedFeeString = (0).toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })
      }

      //Set Deposit Amounts
      const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(unprocessedTableData[i].tokenMintAddressString +
      adminAccounts.lendingCEOAddressString +
      adminAccounts.lendingMain100PercentSubMarketIndex.toString() +
      adminAccounts.hodlTreasuryAddress.toString() +
      adminAccounts.hodlTreasuryLendingAccountIndex.toString())
      if(lendingUserTabAccount)
      {
        unprocessedTableData[i].deposits = Number(lendingUserTabAccount.depositedAmount) / Math.pow(10, decimalAmount)
        unprocessedTableData[i].depositString = unprocessedTableData[i].deposits.toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })
      }
      else
      {
        unprocessedTableData[i].deposits = 0
        unprocessedTableData[i].depositString = (0).toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })
      }

      const totalAmount = Number(unprocessedTableData[i].wallet) + Number(unprocessedTableData[i].unCollectedFees) + Number(unprocessedTableData[i].deposits)

      var calculatedValue = 0

      const priceData = priceObjectMap.data[unprocessedTableData[i].tokenMintAddressString]
      if(priceData)
        calculatedValue = (totalAmount * priceData.usdPrice)

      value += calculatedValue

      unprocessedTableData[i].value = calculatedValue
      unprocessedTableData[i].valueString = '$' + calculatedValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 })
    }

    stableValue.value = value
    stableCoinTableData.value = unprocessedTableData
  }

  function processHODLCryptoCurrencyTableData()
  {
    if(!lendingUserTabAccountsHashMap.map)
      return

    var value = 0
    var unprocessedTableData = []

    for(var i=0; i<CryptoCurrency.length; i++)
    {
      unprocessedTableData.push(cloneDeep(CryptoCurrency[i]))//Keeps HODL and Single Payer tables from writing over each other
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].asset.svg)//Have to markRaw again after cloneDeep
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].chain.svg)//Have to markRaw again after cloneDeep

      const decimalAmount = tokenDecimalHashMap.get(unprocessedTableData[i].tokenMintAddressString)

      //Set UnCollected Fee Amounts
      const subMarket = subMarketsHashMap.map.get(unprocessedTableData[i].tokenMintAddressString +
      adminAccounts.lendingCEOAddressString +
      adminAccounts.lendingMain3PercentSubMarketIndex.toString())
      if(subMarket)
      {
        unprocessedTableData[i].unCollectedFees = Number(subMarket.uncollectedFeesAmount)
        unprocessedTableData[i].unCollectedFeeString = subMarket.uncollectedFeesAmount
      }
      else
      {
        unprocessedTableData[i].unCollectedFees = 0
        unprocessedTableData[i].unCollectedFeeString = (0).toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })
      }

      //Set Deposit Amounts
      const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(unprocessedTableData[i].tokenMintAddressString +
      adminAccounts.lendingCEOAddressString +
      adminAccounts.lendingMain100PercentSubMarketIndex.toString() +
      adminAccounts.hodlTreasuryAddress.toString() +
      adminAccounts.hodlTreasuryLendingAccountIndex.toString())
      if(lendingUserTabAccount)
      {
        unprocessedTableData[i].deposits = Number(lendingUserTabAccount.depositedAmount) / Math.pow(10, decimalAmount)
        unprocessedTableData[i].depositString = unprocessedTableData[i].deposits.toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })
      }
      else
      {
        unprocessedTableData[i].deposits = 0
        unprocessedTableData[i].depositString = (0).toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })
      }

      const totalAmount = Number(unprocessedTableData[i].unCollectedFees) + Number(unprocessedTableData[i].deposits)

      var calculatedValue = 0

      const priceData = priceObjectMap.data[unprocessedTableData[i].tokenMintAddressString]
      if(priceData)
        calculatedValue = (totalAmount * priceData.usdPrice)

      value += calculatedValue

      unprocessedTableData[i].value = calculatedValue
      unprocessedTableData[i].valueString = '$' + calculatedValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 })
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
    min-width: 880px
  }

  ion-input
  {
    --highlight-color: var(--ion-color-green)
  }
</style>