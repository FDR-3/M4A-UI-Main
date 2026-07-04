<template>
  <div class="tableContainer">
    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines
      size="small" 
      :value="stableCoinTableData"
      :loading=isLoading
      :globalFilterFields="
      [
        'tokenMintAddressString',
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
          <h2>Single Payer Treasury Value <br>(Amount Available For Claim Payouts): $<span class="rainbowText">{{ tvl.singlePayerTVL.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}</span>
          </h2>
          <h2 class="nMediumMarginTop">7 Day Projection Rate: $<span class="rainbowText">{{ sevenDayProjectionRate }}</span></h2>

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
              <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyTokenMintAddress()" @mouseleave="closeTokenPopover($event)">
                <ion-label color="light">{{ copyTokenMintAddressButtonText }}</ion-label>
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

    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines size="small" 
      :value="CryptoCurrencyTableData"
      :loading=isLoading
      :globalFilterFields="
      [
        'tokenMintAddressString',
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
      <Column field="asset" header="Asset" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="openTokenPopover($event, slotProps.data)" style="margin-left: -8px">
              <component v-if="slotProps.data.asset.name=='Sol'" :is="slotProps.data.asset.svg" style="width: 44px; height: 32px; margin-left: -8px; margin-right: -4px"/>
              <component v-else :is="slotProps.data.asset.svg" style="width: 28px; height: 32px; margin-right: 5px"/>
              <ion-label color="dark">{{ slotProps.data.asset.name }}</ion-label>
            </ion-button>
            <ion-popover 
            :is-open="tokenPopoverOpen" 
            :event="event" 
            @didDismiss="tokenPopoverOpen=false"
            side="top" 
            alignment="center"
            >
              <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyTokenMintAddress()" @mouseleave="closeTokenPopover($event)">
                <ion-label color="light">{{ copyTokenMintAddressButtonText }}</ion-label>
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
  import { ref, onMounted, onUnmounted, watch, markRaw } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonPopover, IonText } from '@ionic/vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { subMarketsHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserTabAccountsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenReservesHashMap, tokenIdHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { FilterMatchMode } from '@primevue/core/api'
  import { search } from 'ionicons/icons'
  import { copyAddress, copyTokenMintAddressText } from '/src/assets/contracts/WalletHelper.vue'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
  import { tvl } from '/src/assets/globalStates/AdminAccounts.vue'
  import { tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { SECONDS_IN_A_YEAR, SECONDS_IN_A_WEEK } from '/src/assets/constants/TimeLengths.ts'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { blockChainData } from '/src/assets/globalStates/AnchorPrograms.vue'
  import cloneDeep from 'lodash/cloneDeep'

  var stableCoinTableData = ref()
  var CryptoCurrencyTableData = ref()
  var isLoading = ref(true)
  var stableValue = ref(0)
  var cryptoValue = ref(0)

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)

  var sevenDayProjectionRate = ref()
  sevenDayProjectionRate.value = (0).toFixed(2)
  var stableCoinFeeArray = cloneDeep(StableCoins)
  var cryptoCurrencyFeeArray = cloneDeep(CryptoCurrency)
  var subMarketFeesAccruedIntervalId: any

  onMounted(() =>
  {
    if(lendingUserTabAccountsHashMap.map)
    {
      processSinglePayerStableCoinTableData()
      processSinglePayerCryptoCurrencyTableData()
      tvl.singlePayerTVL = stableValue.value + cryptoValue.value

      isLoading.value = false
    }
    else
      isLoading.value = true

    startFeeCalculation()
  })

  onUnmounted(() =>
  {
    stopFeeCalculation()
  })

  watch(lendingUserTabAccountsHashMap, () => 
  {
    processSinglePayerStableCoinTableData()
    processSinglePayerCryptoCurrencyTableData()
    tvl.singlePayerTVL = stableValue.value + cryptoValue.value

    if(isLoading.value)
      isLoading.value = false
  })

  watch(priceObjectMap, () => 
  {
    processSinglePayerStableCoinTableData()
    processSinglePayerCryptoCurrencyTableData()
    tvl.singlePayerTVL = stableValue.value + cryptoValue.value
  })

  watch([tokenReservesHashMap, subMarketsHashMap], () => 
  {
    if(subMarketFeesAccruedIntervalId == undefined)
      startFeeCalculation()
  })

  function openTokenPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.tokenMintAddressString = rowData.tokenMintAddressString

    tokenPopoverOpen.value = true
  }

  function closeTokenPopover(e: Event) 
  {
    event.value = e
    tokenPopoverOpen.value = false
  }

  function passByRefWrapperCopyTokenMintAddress()
  {
    copyAddress(copyTokenMintAddressButtonText, event.value.tokenMintAddressString)
  }

  function processSinglePayerStableCoinTableData()
  {
    if(!lendingUserTabAccountsHashMap.map)
      return

    var value = 0
    var unprocessedTableData = []

    for(var i=0; i<StableCoins.length; i++)
    {
      unprocessedTableData.push(cloneDeep(StableCoins[i]))//Keeps SinglePayer and Single Payer tables from writing over each other
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].asset.svg)//Have to markRaw again after cloneDeep
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].chain.svg)//Have to markRaw again after cloneDeep

      const decimalAmount = tokenDecimalHashMap.get(unprocessedTableData[i].tokenId)

      //Set UnCollected Fee Amounts
      const subMarket = subMarketsHashMap.map.get(unprocessedTableData[i].tokenId.toString() +
      adminAccounts.lendingCEOAddressString +
      adminAccounts.lendingMain100PercentSubMarketIndex.toString())
      if(subMarket)
      {
        unprocessedTableData[i].unCollectedFees = Number(subMarket.uncollectedSubMarketFeesAmount)
        unprocessedTableData[i].unCollectedFeeString = subMarket.uncollectedSubMarketFeesAmount
      }
      else
      {
        unprocessedTableData[i].unCollectedFees = 0
        unprocessedTableData[i].unCollectedFeeString = (0).toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })
      }

      //Set Deposit Amounts
      const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(unprocessedTableData[i].tokenId.toString() +
      adminAccounts.lendingCEOAddressString +
      adminAccounts.lendingMain100PercentSubMarketIndex.toString() +
      adminAccounts.singlePayerTreasuryAddress.toString() +
      adminAccounts.singlePayerTreasuryLendingAccountIndex.toString())
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
      
      const tokenMintAddressString = tokenIdHashMap.map.get(unprocessedTableData[i].tokenId)
      const priceData = priceObjectMap.data[tokenMintAddressString]
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

  function processSinglePayerCryptoCurrencyTableData()
  {
    if(!lendingUserTabAccountsHashMap.map)
      return

    var value = 0
    var unprocessedTableData = []

    for(var i=0; i<CryptoCurrency.length; i++)
    {
      unprocessedTableData.push(cloneDeep(CryptoCurrency[i]))//Keeps SinglePayer and Single Payer tables from writing over each other
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].asset.svg)//Have to markRaw again after cloneDeep
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].chain.svg)//Have to markRaw again after cloneDeep

      const decimalAmount = tokenDecimalHashMap.get(unprocessedTableData[i].tokenId)

      //Set UnCollected Fee Amounts
      const subMarket = subMarketsHashMap.map.get(unprocessedTableData[i].tokenId.toString() +
      adminAccounts.lendingCEOAddressString +
      adminAccounts.lendingMain100PercentSubMarketIndex.toString())
      if(subMarket)
      {
        unprocessedTableData[i].unCollectedFees = Number(subMarket.uncollectedSubMarketFeesAmount)
        unprocessedTableData[i].unCollectedFeeString = subMarket.uncollectedSubMarketFeesAmount
      }
      else
      {
        unprocessedTableData[i].unCollectedFees = 0
        unprocessedTableData[i].unCollectedFeeString = (0).toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })
      }

      //Set Deposit Amounts
      const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(unprocessedTableData[i].tokenId.toString() +
      adminAccounts.lendingCEOAddressString +
      adminAccounts.lendingMain100PercentSubMarketIndex.toString() +
      adminAccounts.singlePayerTreasuryAddress.toString() +
      adminAccounts.singlePayerTreasuryLendingAccountIndex.toString())
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

      const tokenMintAddressString = tokenIdHashMap.map.get(unprocessedTableData[i].tokenId)
      const priceData = priceObjectMap.data[tokenMintAddressString]
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

  function calculateTokenReserveSevenDaySupplyInterestChangeIndex(timeStamp: number, tokenId: number)
  {
    const tokenReserve = tokenReservesHashMap.map.get(tokenId)

    if(!tokenReserve)
      return

    //Token Reserve Supply Interest Index = Old Supply Interest Index * (1 + Supply APY * Δt/Seconds in a Year)
    const oldTime = Number(tokenReserve.lastLendingActivityTimeStamp)
    const sevenDayChangeInTime = SECONDS_IN_A_WEEK + timeStamp - oldTime
    const supplyApy = tokenReserve.supplyApy / 10000 //convert from fixed point to decimal

    return Number(tokenReserve.supplyInterestChangeIndex) * (1 + supplyApy * sevenDayChangeInTime / SECONDS_IN_A_YEAR)
  }

  function calculateSubMarketSevenDayFeeAccrued(tokenId: number, tokenReserveSevenDaySupplyInterestChangeIndex: number)
  {
    const tokenReserve = tokenReservesHashMap.map.get(tokenId)
    const subMarket = subMarketsHashMap.map.get(tokenId +
    adminAccounts.lendingCEOAddressString +
    adminAccounts.lendingMain100PercentSubMarketIndex.toString())

    if(!tokenReserve || !subMarket)
      return 0

    if(Number(subMarket.supplyInterestChangeIndex) == 0)
      return 0

    //SubMarket New Balance Before Fee = Old Balance * Token Reserve Earned Interest Index / SubMarket Earned Interest Index
    //Interest Earned Before Fee = New Balance Before Fee - Old Balance
    //Fee Generated = Interest Earned Before Fee * SubMarket Fee Rate
    const sevenDaySubMarketBalanceBeforeFee = (subMarket.depositedAmount * tokenReserveSevenDaySupplyInterestChangeIndex / Number(subMarket.supplyInterestChangeIndex))
    const sevenDayInterestEarnedBeforeFee = sevenDaySubMarketBalanceBeforeFee - subMarket.depositedAmount
    const sevenDaySubMarketFeeGenerated = (sevenDayInterestEarnedBeforeFee * subMarket.feeOnInterestEarnedRate / 100)

    const tokenMintAddressString = tokenIdHashMap.map.get(tokenId)
    const usdPrice = priceObjectMap.data[tokenMintAddressString].usdPrice
    if(usdPrice)
      return sevenDaySubMarketFeeGenerated * Number(usdPrice)
    else
      return 0

    //No need to check Single Payer interest earned as a lending user
    //100% of interest earned from deposits into the 100% fee submarket go to SubMarket and Solvency fees
  }

  function startFeeCalculation()
  {
    if(!tokenReservesHashMap.map || !subMarketsHashMap.map)
      return

    subMarketFeesAccruedIntervalId = setInterval(() =>
    {
      var sevenDayStableCoinProjectionValue = 0
      for(var i=0; i<stableCoinFeeArray.length; i++)
      {
        stableCoinFeeArray[i].tokenReserve7DaySupplyInterestChangeIndex = calculateTokenReserveSevenDaySupplyInterestChangeIndex(blockChainData.timeStamp, stableCoinFeeArray[i].tokenId)
        if(stableCoinFeeArray[i].tokenReserve7DaySupplyInterestChangeIndex)
          sevenDayStableCoinProjectionValue += calculateSubMarketSevenDayFeeAccrued(stableCoinFeeArray[i].tokenId, stableCoinFeeArray[i].tokenReserve7DaySupplyInterestChangeIndex)
      }

      var sevenDayCryptoCurrencyProjectionValue = 0
      for(var i=0; i<cryptoCurrencyFeeArray.length; i++)
      {
        cryptoCurrencyFeeArray[i].tokenReserve7DaySupplyInterestChangeIndex = calculateTokenReserveSevenDaySupplyInterestChangeIndex(blockChainData.timeStamp, cryptoCurrencyFeeArray[i].tokenId)
        if(cryptoCurrencyFeeArray[i].tokenReserve7DaySupplyInterestChangeIndex)
          sevenDayCryptoCurrencyProjectionValue += calculateSubMarketSevenDayFeeAccrued(cryptoCurrencyFeeArray[i].tokenId, cryptoCurrencyFeeArray[i].tokenReserve7DaySupplyInterestChangeIndex)
      }

      sevenDayProjectionRate.value = (sevenDayStableCoinProjectionValue + sevenDayCryptoCurrencyProjectionValue).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 })
    }, 55)
  }

  function stopFeeCalculation()
  {
    if(subMarketFeesAccruedIntervalId != undefined)
    {
      clearInterval(subMarketFeesAccruedIntervalId)
      subMarketFeesAccruedIntervalId = undefined
    }
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
    min-width: 880px
  }

  ion-input
  {
    --highlight-color: var(--ion-color-green)
  }
</style>