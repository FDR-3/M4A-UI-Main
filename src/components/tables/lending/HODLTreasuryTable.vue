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
          <h2>HODL Treasury Value: $<span class="rainbowText">{{ tvl.hodlTreasury.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}</span>
          </h2>
          <h2 class="nMediumMarginTop">7 Day Projection Rate: $<span class="rainbowText">{{ sevenDayProjectionRate }}</span></h2>

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
            <ion-button fill="clear" @click="openTreasuryATAPopover($event, slotProps.data)">
              <component :is="slotProps.data.asset.svg" style="width: 24px; margin-left: -11px; margin-right: 5px"></component>
              <ion-label color="dark">{{ slotProps.data.asset.name }}</ion-label>
            </ion-button>
            <ion-popover 
            :is-open="treasuryATAPopoverOpen" 
            :event="event" 
            @didDismiss="treasuryATAPopoverOpen=false"
            side="top" 
            alignment="center"
            >
              <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyTreasuryATA()" @mouseleave="closeTreasuryATAPopover($event)">
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
      <Column field="percentChange24h" header="24h %Price Change" style="width: 0%" sortable>
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
      <Column field="asset.name" header="Asset" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="openTokenMintAddressPopover($event, slotProps.data)" style="margin-left: -8px">
              <component v-if="slotProps.data.asset.name=='Sol'" :is="slotProps.data.asset.svg" style="width: 44px; height: 32px; margin-left: -8px; margin-right: -4px"/>
              <component v-else :is="slotProps.data.asset.svg" style="width: 28px; height: 32px; margin-right: 5px"/>
              <ion-label color="dark">{{ slotProps.data.asset.name }}</ion-label>
            </ion-button>
            <ion-popover 
            :is-open="tokenMintAddressPopoverOpen" 
            :event="event" 
            @didDismiss="tokenMintAddressPopoverOpen=false"
            side="top" 
            alignment="center"
            >
              <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyTokenMintAddress()" @mouseleave="closeTokenMintAddressPopover($event)">
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
      <Column field="percentChange24h" header="24h %Price Change" style="width: 0%" sortable>
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
  import { hodlTreasuryWalletBalancesHashMap } from '/src/assets/globalStates/AdminAccounts.vue'
  import { subMarketsHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserTabAccountsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenReservesHashMap, tokenIdHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { FilterMatchMode } from '@primevue/core/api'
  import { search } from 'ionicons/icons'
  import { copyAddress, copyTokenMintAddressText, copyTreasuryATAText } from '/src/assets/contracts/WalletHelper.vue'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
  import { tvl } from '/src/assets/globalStates/AdminAccounts.vue'
  import { tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { unixData } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { calculateTokenReserveSevenDaySupplyInterestFactor } from '/src/components/smart contracts/lending protocol/InterestCalcHelpers.ts'
  import cloneDeep from 'lodash/cloneDeep'

  var stableCoinTableData = ref()
  var CryptoCurrencyTableData = ref()
  var isLoading = ref(true)
  var treasuryStableValue = ref(0)
  var treasuryCryptoValue = ref(0)
  var tvlContributionStableValue = ref(0)

  var treasuryATAPopoverOpen = ref(false)
  var tokenMintAddressPopoverOpen = ref(false)
  var event = ref()
  var copyTreasuryATAButtonText = ref(copyTreasuryATAText)
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)

  var sevenDayProjectionRate = ref()
  sevenDayProjectionRate.value = (0).toFixed(2)
  var stableCoinFeeArray = cloneDeep(StableCoins)
  var cryptoCurrencyFeeArray = cloneDeep(CryptoCurrency)
  var subMarketFeesAccruedIntervalId: any

  onMounted(() =>
  {
    if(hodlTreasuryWalletBalancesHashMap.map && lendingUserTabAccountsHashMap.map)
    {
      processHODLStableCoinTableData()
      processHODLCryptoCurrencyTableData()
      tvl.hodlTreasury = treasuryStableValue.value + treasuryCryptoValue.value
      tvl.hodlTVLContribution = tvlContributionStableValue.value

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

  watch(hodlTreasuryWalletBalancesHashMap, () => 
  {
    processHODLStableCoinTableData()
    processHODLCryptoCurrencyTableData()
    tvl.hodlTreasury = treasuryStableValue.value + treasuryCryptoValue.value
    tvl.hodlTVLContribution = tvlContributionStableValue.value

    if(isLoading.value && lendingUserTabAccountsHashMap.map)
      isLoading.value = false
  })

  watch(lendingUserTabAccountsHashMap, () => 
  {
    processHODLStableCoinTableData()
    processHODLCryptoCurrencyTableData()
    tvl.hodlTreasury = treasuryStableValue.value + treasuryCryptoValue.value
    tvl.hodlTVLContribution = tvlContributionStableValue.value

    if(isLoading.value && hodlTreasuryWalletBalancesHashMap.map)
      isLoading.value = false
  })

  watch(priceObjectMap, () => 
  {
    processHODLStableCoinTableData()
    processHODLCryptoCurrencyTableData()
    tvl.hodlTreasury = treasuryStableValue.value + treasuryCryptoValue.value
    tvl.hodlTVLContribution = tvlContributionStableValue.value
  })

  watch([tokenReservesHashMap, subMarketsHashMap], () => 
  {
    if(subMarketFeesAccruedIntervalId == undefined)
      startFeeCalculation()
  })

  function openTreasuryATAPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.hodlATA = rowData.hodlATA

    treasuryATAPopoverOpen.value = true
  }

  function closeTreasuryATAPopover(e: Event) 
  {
    event.value = e
    treasuryATAPopoverOpen.value = false
  }

  function openTokenMintAddressPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.tokenMintAddressString = rowData.tokenMintAddressString

    tokenMintAddressPopoverOpen.value = true
  }

  function closeTokenMintAddressPopover(e: Event) 
  {
    event.value = e
    tokenMintAddressPopoverOpen.value = false
  }

  function passByRefWrapperCopyTreasuryATA()
  {
    copyAddress(copyTreasuryATAButtonText, event.value.hodlATA)
  }

  function passByRefWrapperCopyTokenMintAddress()
  {
    copyAddress(copyTokenMintAddressButtonText, event.value.tokenMintAddressString)
  }

  function processHODLStableCoinTableData()
  {
    if(!hodlTreasuryWalletBalancesHashMap.map || !lendingUserTabAccountsHashMap.map)
      return

    var treasuryValue = 0
    var tvlContributionValue = 0
    var unprocessedTableData = []

    for(var i=0; i<StableCoins.length; i++)
    {
      unprocessedTableData.push(cloneDeep(StableCoins[i]))//Keeps HODL and Single Payer tables from writing over each other
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].asset.svg)//Have to markRaw again after cloneDeep
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].chain.svg)//Have to markRaw again after cloneDeep

      const decimalAmount = tokenDecimalHashMap.get(unprocessedTableData[i].tokenId)

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
      const subMarket = subMarketsHashMap.map.get(unprocessedTableData[i].tokenId.toString() +
      adminAccounts.lendingCEOAddressString +
      adminAccounts.lendingMain3PercentSubMarketIndex.toString())
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

      const tokenMintAddressString = tokenIdHashMap.map.get(unprocessedTableData[i].tokenId)
      const priceData = priceObjectMap.data[tokenMintAddressString]

      const treasuryTotalAmount = Number(unprocessedTableData[i].wallet) + Number(unprocessedTableData[i].unCollectedFees) + Number(unprocessedTableData[i].deposits)
      const tvlContributionTotalAmount = Number(unprocessedTableData[i].wallet)

      if(!priceData)
        return

      const treasuryCalculatedValue = treasuryTotalAmount * priceData.usdPrice
      const tvlContributionCalculatedValue = tvlContributionTotalAmount * priceData.usdPrice

      treasuryValue += treasuryCalculatedValue
      tvlContributionValue += tvlContributionCalculatedValue

      unprocessedTableData[i].value = treasuryCalculatedValue
      unprocessedTableData[i].valueString = '$' + treasuryCalculatedValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 })
    }

    treasuryStableValue.value = treasuryValue
    tvlContributionStableValue.value = tvlContributionValue
    stableCoinTableData.value = unprocessedTableData
  }

  function processHODLCryptoCurrencyTableData()
  {
    if(!lendingUserTabAccountsHashMap.map)
      return

    var treasuryValue = 0
    var unprocessedTableData = []

    for(var i=0; i<CryptoCurrency.length; i++)
    {
      unprocessedTableData.push(cloneDeep(CryptoCurrency[i]))//Keeps HODL and Single Payer tables from writing over each other
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].asset.svg)//Have to markRaw again after cloneDeep
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].chain.svg)//Have to markRaw again after cloneDeep

      const decimalAmount = tokenDecimalHashMap.get(unprocessedTableData[i].tokenId)

      //Set UnCollected Fee Amounts
      const subMarket = subMarketsHashMap.map.get(unprocessedTableData[i].tokenId.toString() +
      adminAccounts.lendingCEOAddressString +
      adminAccounts.lendingMain3PercentSubMarketIndex.toString())
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

      const tokenMintAddressString = tokenIdHashMap.map.get(unprocessedTableData[i].tokenId)
      const priceData = priceObjectMap.data[tokenMintAddressString]

      const treasuryTotalAmount = Number(unprocessedTableData[i].unCollectedFees) + Number(unprocessedTableData[i].deposits)

      if(!priceData)
        return

      const treasuryCalculatedValue = (treasuryTotalAmount * priceData.usdPrice)

      treasuryValue += treasuryCalculatedValue

      unprocessedTableData[i].value = treasuryCalculatedValue
      unprocessedTableData[i].valueString = '$' + treasuryCalculatedValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 })
    }

    treasuryCryptoValue.value = treasuryValue
    CryptoCurrencyTableData.value = unprocessedTableData
  }

  function calculateSubMarketSevenDayFeeAccrued(tokenId: number, tokenReserveSevenDaySupplyInterestFactor: number)
  {
    const tokenReserve = tokenReservesHashMap.map.get(tokenId)
    const subMarket3PercentFee = subMarketsHashMap.map.get(tokenId +
    adminAccounts.lendingCEOAddressString +
    adminAccounts.lendingMain3PercentSubMarketIndex.toString())
    const subMarket = subMarketsHashMap.map.get(tokenId +
    adminAccounts.lendingCEOAddressString +
    adminAccounts.lendingMain100PercentSubMarketIndex.toString())

    if(!tokenReserve || !subMarket)
      return 0

    if(Number(subMarket3PercentFee.supplyInterestChangeIndex) === 0)
      return 0

    var tokenDecimalAmount = tokenDecimalHashMap.get(tokenId)
    var userBalance
    var userOriginalBalance
    var total7DayHODLFeesAndInterestValue = 0

    /*Calculate 7 day Sub Market fees generated by the 3% fee submarket*/
    //SubMarket New 7 day Balance Before Fee = Old Balance * Token Reserve 7 day Earned Interest Index / Token Reserve current Earned Interest Index
    //Interest Earned Before Fee = New Balance Before Fee - Old Balance
    //Fee Generated = Interest Earned Before Fee * SubMarket Fee Rate
    const sevenDaySubMarketBalanceBeforeFee = (Number(subMarket3PercentFee.depositedAmount) * tokenReserveSevenDaySupplyInterestFactor)
    const sevenDayInterestEarnedBeforeFee = sevenDaySubMarketBalanceBeforeFee - Number(subMarket3PercentFee.depositedAmount)
    const sevenDaySubMarketFeeGenerated = (sevenDayInterestEarnedBeforeFee * subMarket3PercentFee.feeOnInterestEarnedRate / 100)

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
        stableCoinFeeArray[i].tokenReserve7DaySupplyInterestFactor = calculateTokenReserveSevenDaySupplyInterestFactor(unixData.timeStamp, stableCoinFeeArray[i].tokenId)
        if(stableCoinFeeArray[i].tokenReserve7DaySupplyInterestFactor)
          sevenDayStableCoinProjectionValue += calculateSubMarketSevenDayFeeAccrued(stableCoinFeeArray[i].tokenId, stableCoinFeeArray[i].tokenReserve7DaySupplyInterestFactor)
      }

      var sevenDayCryptoCurrencyProjectionValue = 0
      for(var i=0; i<cryptoCurrencyFeeArray.length; i++)
      {
        cryptoCurrencyFeeArray[i].tokenReserve7DaySupplyInterestFactor = calculateTokenReserveSevenDaySupplyInterestFactor(unixData.timeStamp, cryptoCurrencyFeeArray[i].tokenId)
        if(cryptoCurrencyFeeArray[i].tokenReserve7DaySupplyInterestFactor)
          sevenDayCryptoCurrencyProjectionValue += calculateSubMarketSevenDayFeeAccrued(cryptoCurrencyFeeArray[i].tokenId, cryptoCurrencyFeeArray[i].tokenReserve7DaySupplyInterestFactor)
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