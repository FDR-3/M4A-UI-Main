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
        'solvencyATA',
        'asset.name',
        'chain.name',
        'priceString',
        'percentChange24h',
        'walletString',
        'unCollectedFeeString',
        'valueString'
      ]"  
    >
      <template #header>
        <div>
          <h2>Solvency Insurance Treasury Value: $<span class="rainbowText">{{ tvl.solvencyTreasury.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}</span>
          </h2>
          <h2 class="nMediumMarginTop">7 Day Projection Rate: $<span class="rainbowText">{{ sevenDayProjectionRate }}</span></h2>

          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="Solvency Treasury Search     ">
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
        'solvencyATA',
        'asset.name',
        'chain.name',
        'priceString',
        'percentChange24h',
        'walletString',
        'unCollectedFeeString',
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
  import { solvencyInsuranceTreasuryWalletBalancesHashMap } from '/src/assets/globalStates/AdminAccounts.vue'
  import { subMarketsHashMap, tokenReserveSubMarketListHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserTabAccountsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenReservesHashMap, tokenIdHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { FilterMatchMode } from '@primevue/core/api'
  import { search } from 'ionicons/icons'
  import { copyAddress, copyTreasuryATAText } from '/src/assets/contracts/WalletHelper.vue'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
  import { tvl } from '/src/assets/globalStates/AdminAccounts.vue'
  import { tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { SECONDS_IN_A_YEAR, SECONDS_IN_A_WEEK } from '/src/assets/constants/TimeLengths.ts'
  import { blockChainData } from '/src/assets/globalStates/AnchorPrograms.vue'
  import cloneDeep from 'lodash/cloneDeep'

  var stableCoinTableData = ref()
  var CryptoCurrencyTableData = ref()
  var isLoading = ref(true)
  var treasuryStableValue = ref(0)
  var treasuryCryptoValue = ref(0)
  var tvlContributionStableValue = ref(0)
  var tvlContributionCryptoValue = ref(0)

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTreasuryATAButtonText = ref(copyTreasuryATAText)

  var sevenDayProjectionRate = ref()
  sevenDayProjectionRate.value = (0).toFixed(2)
  var stableCoinFeeArray = cloneDeep(StableCoins)
  var cryptoCurrencyFeeArray = cloneDeep(CryptoCurrency)
  var subMarketFeesAccruedIntervalId: any

  onMounted(async() =>
  {
    if(solvencyInsuranceTreasuryWalletBalancesHashMap.map && lendingUserTabAccountsHashMap.map)
    {
      processSolvencyStableCoinTableData()
      processSolvencyCryptoCurrencyTableData()
      tvl.solvencyTreasury = treasuryStableValue.value + treasuryCryptoValue.value
      tvl.solvencyTVLContribution = tvlContributionStableValue.value + tvlContributionCryptoValue.value

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

  watch(solvencyInsuranceTreasuryWalletBalancesHashMap, () => 
  {
    processSolvencyStableCoinTableData()
    processSolvencyCryptoCurrencyTableData()
    tvl.solvencyTreasury = treasuryStableValue.value + treasuryCryptoValue.value
    tvl.solvencyTVLContribution = tvlContributionStableValue.value + tvlContributionCryptoValue.value

    if(isLoading.value && lendingUserTabAccountsHashMap.map)
      isLoading.value = false
  })

  watch(lendingUserTabAccountsHashMap, () => 
  {
    processSolvencyStableCoinTableData()
    processSolvencyCryptoCurrencyTableData()
    tvl.solvencyTreasury = treasuryStableValue.value + treasuryCryptoValue.value
    tvl.solvencyTVLContribution = tvlContributionStableValue.value + tvlContributionCryptoValue.value

    if(isLoading.value && solvencyInsuranceTreasuryWalletBalancesHashMap.map)
      isLoading.value = false
  })

  watch(priceObjectMap, () => 
  {
    processSolvencyStableCoinTableData()
    processSolvencyCryptoCurrencyTableData()
    tvl.solvencyTreasury = treasuryStableValue.value + treasuryCryptoValue.value
    tvl.solvencyTVLContribution = tvlContributionStableValue.value + tvlContributionCryptoValue.value
  })

  watch([tokenReservesHashMap, subMarketsHashMap], () => 
  {
    if(subMarketFeesAccruedIntervalId == undefined)
      startFeeCalculation()
  })

  function openTokenPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.solvencyATA = rowData.solvencyATA

    tokenPopoverOpen.value = true
  }

  function closeTokenPopover(e: Event) 
  {
    event.value = e
    tokenPopoverOpen.value = false
  }

  function passByRefWrapperCopyAddress()
  {
    copyAddress(copyTreasuryATAButtonText, event.value.solvencyATA)
  }

  function processSolvencyStableCoinTableData()
  {
    if(!solvencyInsuranceTreasuryWalletBalancesHashMap.map || !lendingUserTabAccountsHashMap.map)
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
      const tokenAmount = solvencyInsuranceTreasuryWalletBalancesHashMap.map.get(unprocessedTableData[i].tokenId)
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
      const tokenReserve = tokenReservesHashMap.map.get(unprocessedTableData[i].tokenId)
      if(tokenReserve)
      {
        unprocessedTableData[i].unCollectedFees = Number(tokenReserve.uncollectedSolvencyInsuranceFeesAmount)
        unprocessedTableData[i].unCollectedFeeString = tokenReserve.uncollectedSolvencyInsuranceFeesAmount
      }
      else
      {
        unprocessedTableData[i].unCollectedFees = 0
        unprocessedTableData[i].unCollectedFeeString = (0).toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })
      }

      const tokenMintAddressString = tokenIdHashMap.map.get(unprocessedTableData[i].tokenId)
      const priceData = priceObjectMap.data[tokenMintAddressString]

      const treasuryTotalAmount = Number(unprocessedTableData[i].wallet) + Number(unprocessedTableData[i].unCollectedFees)
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

  function processSolvencyCryptoCurrencyTableData()
  {
    if(!lendingUserTabAccountsHashMap.map)
      return

    var treasuryValue = 0
    var tvlContributionValue = 0
    var unprocessedTableData = []

    for(var i=0; i<CryptoCurrency.length; i++)
    {
      unprocessedTableData.push(cloneDeep(CryptoCurrency[i]))//Keeps HODL and Single Payer tables from writing over each other
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].asset.svg)//Have to markRaw again after cloneDeep
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].chain.svg)//Have to markRaw again after cloneDeep

      const decimalAmount = tokenDecimalHashMap.get(unprocessedTableData[i].tokenId)

      //Set Wallet Amounts
      const tokenAmount = solvencyInsuranceTreasuryWalletBalancesHashMap.map.get(unprocessedTableData[i].tokenId)
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
      const tokenReserve = tokenReservesHashMap.map.get(unprocessedTableData[i].tokenId)
      if(tokenReserve)
      {
        unprocessedTableData[i].unCollectedFees = Number(tokenReserve.uncollectedSolvencyInsuranceFeesAmount)
        unprocessedTableData[i].unCollectedFeeString = tokenReserve.uncollectedSolvencyInsuranceFeesAmount
      }
      else
      {
        unprocessedTableData[i].unCollectedFees = 0
        unprocessedTableData[i].unCollectedFeeString = (0).toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })
      }

      const tokenMintAddressString = tokenIdHashMap.map.get(unprocessedTableData[i].tokenId)
      const priceData = priceObjectMap.data[tokenMintAddressString]

      const treasuryTotalAmount = Number(unprocessedTableData[i].wallet) + Number(unprocessedTableData[i].unCollectedFees)
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

    treasuryCryptoValue.value = treasuryValue
    tvlContributionStableValue.value = tvlContributionValue
    CryptoCurrencyTableData.value = unprocessedTableData
  }

  function calculateTokenReserveSevenDaySupplyInterestChangeIndex(timeStamp: number, tokenMintAddress: string)
  {
    const tokenReserve = tokenReservesHashMap.map.get(tokenMintAddress)

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
    const tokenReserveSubMarketList = tokenReserveSubMarketListHashMap.map.get(tokenId)

    if(!tokenReserve || !tokenReserveSubMarketList)
      return 0

    var totalSolvencyInsuranceFeesGenerated = 0

    for(var i=0; i<tokenReserveSubMarketList.length; i++)
    {
      if(Number(tokenReserveSubMarketList[i].supplyInterestChangeIndex) == 0)
        continue

      //SubMarket New Balance Before Fee = Old Balance * Token Reserve Earned Interest Index / SubMarket Earned Interest Index
      //Interest Earned Before Fee = New Balance Before Fee - Old Balance
      //Fee Generated = Interest Earned Before Fee * Token Reserve Solvency Insurance Fee Rate
      const sevenDaySubMarketBalanceBeforeFee = (Number(tokenReserveSubMarketList[i].depositedAmount) * tokenReserveSevenDaySupplyInterestChangeIndex / Number(tokenReserveSubMarketList[i].supplyInterestChangeIndex))
      const sevenDayInterestEarnedBeforeFee = sevenDaySubMarketBalanceBeforeFee - Number(tokenReserveSubMarketList[i].depositedAmount)
      totalSolvencyInsuranceFeesGenerated += (sevenDayInterestEarnedBeforeFee * tokenReserve.solvencyInsuranceFeeRate / 100)
    }

    const tokenMintAddressString = tokenIdHashMap.map.get(tokenId)
    const usdPrice = priceObjectMap.data[tokenMintAddressString].usdPrice
    if(usdPrice)
      return totalSolvencyInsuranceFeesGenerated * Number(usdPrice)
    else
      return 0
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
          sevenDayStableCoinProjectionValue += calculateSubMarketSevenDayFeeAccrued(stableCoinFeeArray[i].tokenMintAddressString, stableCoinFeeArray[i].tokenReserve7DaySupplyInterestChangeIndex)
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