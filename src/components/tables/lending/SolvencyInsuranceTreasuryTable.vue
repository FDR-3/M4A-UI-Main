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

          <ion-button color="light" class="thinBorder4Rad mediumMarginBottom" @click="handleShowSolvencyHistory()">
            <ion-label v-if="!showSolvencyHistory" color="green">Show History</ion-label>
            <ion-label v-else color="green">Hide History</ion-label>
          </ion-button>

          <transition name="divSlide">
            <div v-if="showSolvencyHistory">
              <div class="divSlideContent">
                <div class="beamOverlay"></div>
                <SolvencyChart :currentTreasuryValue="tvl.solvencyTreasury"
                :current7DayProjection="Number(sevenDayProjectionRate.replace(/,/g, ''))"
                :amountHistoryHashMap="amountHistoryHashMap"/>
              </div>
            </div>
          </transition>

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
          </div>
        </template>
      </Column>
      <Column field="chain.name" header="Chain" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="slotProps.data.chain.source()">
              <component :is="slotProps.data.chain.svg" style="margin-left: -15px; margin-right: -11px"></component>
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
              <component :is="slotProps.data.asset.svg" style="width: 28px; height: 32px; margin-right: 5px"/>
              <ion-label color="dark">{{ slotProps.data.asset.name }}</ion-label>
            </ion-button>
          </div>
        </template>
      </Column>
      <Column field="chain.name" header="Chain" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="slotProps.data.chain.source()">
              <component :is="slotProps.data.chain.svg" style="margin-left: -15px; margin-right: -11px"></component>
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
  import { calculateTokenReserveSevenDaySupplyInterestFactor } from '/src/components/smart contracts/lending protocol/InterestCalcHelpers.ts'
  import { unixData } from '/src/assets/globalStates/AnchorPrograms.vue'
  import SolvencyChart from '/src/components/charts/lending/SolvencyChart.vue'
  import { playOpenChartSFX, playCloseChartSFX } from '/src/components/audio/AudioFunctions.vue'
  import cloneDeep from 'lodash/cloneDeep'

  var stableCoinTableData = ref()
  var CryptoCurrencyTableData = ref()
  var isLoading = ref(true)
  var treasuryStableValue = ref(0)
  var treasuryCryptoValue = ref(0)
  var tvlContributionStableValue = ref(0)
  var tvlContributionCryptoValue = ref(0)
  var showSolvencyHistory = ref(false)
  var amountHistoryHashMap = ref()

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
      tvl.solvencyTreasury = Math.floor((treasuryStableValue.value + treasuryCryptoValue.value) * 100) / 100
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
    tvl.solvencyTreasury = Math.floor((treasuryStableValue.value + treasuryCryptoValue.value) * 100) / 100
    tvl.solvencyTVLContribution = tvlContributionStableValue.value + tvlContributionCryptoValue.value

    if(isLoading.value && lendingUserTabAccountsHashMap.map)
      isLoading.value = false
  })

  watch(lendingUserTabAccountsHashMap, () => 
  {
    processSolvencyStableCoinTableData()
    processSolvencyCryptoCurrencyTableData()
    tvl.solvencyTreasury = Math.floor((treasuryStableValue.value + treasuryCryptoValue.value) * 100) / 100
    tvl.solvencyTVLContribution = tvlContributionStableValue.value + tvlContributionCryptoValue.value

    if(isLoading.value && solvencyInsuranceTreasuryWalletBalancesHashMap.map)
      isLoading.value = false
  })

  watch(priceObjectMap, () => 
  {
    processSolvencyStableCoinTableData()
    processSolvencyCryptoCurrencyTableData()
    tvl.solvencyTreasury = Math.floor((treasuryStableValue.value + treasuryCryptoValue.value) * 100) / 100
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
    var tempMap = new Map<number, string>(amountHistoryHashMap.value)
    var unprocessedTableData = []

    for(var i=0; i<StableCoins.length; i++)
    {
      unprocessedTableData.push(cloneDeep(StableCoins[i]))//Keeps Single Payer, HODL, and Solvency tables from writing over each other
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].asset.svg)//Have to markRaw again after cloneDeep
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].chain.svg)//Have to markRaw again after cloneDeep

      const decimalAmount = tokenDecimalHashMap.get(unprocessedTableData[i].tokenId)

      //Set Wallet Amounts
      const tokenAmount = solvencyInsuranceTreasuryWalletBalancesHashMap.map.get(unprocessedTableData[i].tokenId)
      if(tokenAmount)
      {
        unprocessedTableData[i].wallet = Number(tokenAmount.replace(/,/g, ''))
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

      const treasuryTotalAmount = Number(unprocessedTableData[i].wallet) + Number(unprocessedTableData[i].unCollectedFees)
      const tvlContributionTotalAmount = Number(unprocessedTableData[i].wallet)
      var treasuryCalculatedValue = 0
      var tvlContributionCalculatedValue = 0
      const tokenMintAddressString = tokenIdHashMap.map.get(unprocessedTableData[i].tokenId)
      const priceData = priceObjectMap.data[tokenMintAddressString]
      if(priceData)
      {
        treasuryCalculatedValue = treasuryTotalAmount * priceData.usdPrice
        tvlContributionCalculatedValue = tvlContributionTotalAmount * priceData.usdPrice
      }

      treasuryValue += treasuryCalculatedValue
      var flooredValue = Math.floor(treasuryCalculatedValue * 100) / 100

      treasuryValue += treasuryCalculatedValue
      tvlContributionValue += tvlContributionCalculatedValue

      unprocessedTableData[i].value = flooredValue
      unprocessedTableData[i].valueString = '$' + flooredValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 })

      //Set SolvencyHistory Current Data
      const totalAmountString = treasuryTotalAmount.toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })
      tempMap.set(unprocessedTableData[i].tokenId, totalAmountString)
    }

    treasuryStableValue.value = treasuryValue
    tvlContributionStableValue.value = tvlContributionValue
    amountHistoryHashMap.value = tempMap
    stableCoinTableData.value = unprocessedTableData
  }

  function processSolvencyCryptoCurrencyTableData()
  {
    if(!lendingUserTabAccountsHashMap.map)
      return

    var treasuryValue = 0
    var tvlContributionValue = 0
    var tempMap = new Map<number, string>(amountHistoryHashMap.value)
    var unprocessedTableData = []

    for(var i=0; i<CryptoCurrency.length; i++)
    {
      unprocessedTableData.push(cloneDeep(CryptoCurrency[i]))//Keeps Single Payer, HODL, and Solvency tables from writing over each other
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].asset.svg)//Have to markRaw again after cloneDeep
      unprocessedTableData[i].svg = markRaw(unprocessedTableData[i].chain.svg)//Have to markRaw again after cloneDeep

      const decimalAmount = tokenDecimalHashMap.get(unprocessedTableData[i].tokenId)

      //Set Wallet Amounts
      const tokenAmount = solvencyInsuranceTreasuryWalletBalancesHashMap.map.get(unprocessedTableData[i].tokenId)
      if(tokenAmount)
      {
        unprocessedTableData[i].wallet = Number(tokenAmount.replace(/,/g, ''))
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

      const treasuryTotalAmount = Number(unprocessedTableData[i].wallet) + Number(unprocessedTableData[i].unCollectedFees)
      const tvlContributionTotalAmount = Number(unprocessedTableData[i].wallet)
      var treasuryCalculatedValue = 0
      var tvlContributionCalculatedValue = 0
      const tokenMintAddressString = tokenIdHashMap.map.get(unprocessedTableData[i].tokenId)
      const priceData = priceObjectMap.data[tokenMintAddressString]
      if(priceData)
      {
        treasuryCalculatedValue = treasuryTotalAmount * priceData.usdPrice
        tvlContributionCalculatedValue = tvlContributionTotalAmount * priceData.usdPrice
      }

      treasuryValue += treasuryCalculatedValue
      var flooredValue = Math.floor(treasuryCalculatedValue * 100) / 100

      treasuryValue += treasuryCalculatedValue
      tvlContributionValue += tvlContributionCalculatedValue

      unprocessedTableData[i].value = flooredValue
      unprocessedTableData[i].valueString = '$' + flooredValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 })

      //Set SolvencyHistory Current Data
      const totalAmountString = treasuryTotalAmount.toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })
      tempMap.set(unprocessedTableData[i].tokenId, totalAmountString)
    }

    treasuryCryptoValue.value = treasuryValue
    tvlContributionStableValue.value = tvlContributionValue
    amountHistoryHashMap.value = tempMap
    CryptoCurrencyTableData.value = unprocessedTableData
  }

  function calculateSubMarketSevenDayFeeAccrued(tokenId: number, tokenReserveSupplyInterestChangeIndex: number, tokenReserveSevenDaySupplyChangeIndex: number)
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

      var subMarketFee
      if(tokenReserveSubMarketList[i].feeOnInterestEarnedRate + tokenReserve.solvencyInsuranceFeeRate <= 100)
        subMarketFee = tokenReserveSubMarketList[i].feeOnInterestEarnedRate
      else
        subMarketFee = 100 - tokenReserve.solvencyInsuranceFeeRate

      //SubMarket New Balance Before Fee = Old Balance * Token Reserve current Earned Interest Index / Sub Market Reserve Earned Interest Index
      const newSubMarketDepositedAmountBeforeFees = Number(tokenReserveSubMarketList[i].depositedAmount) * tokenReserveSupplyInterestChangeIndex / tokenReserveSubMarketList[i].supplyInterestChangeIndex
      const subMarketInterestedEarnedBeforeFees = newSubMarketDepositedAmountBeforeFees - Number(tokenReserveSubMarketList[i].depositedAmount) 
      const subMarketInterestedEarnedAfterFees = subMarketInterestedEarnedBeforeFees - (subMarketInterestedEarnedBeforeFees * subMarketFee / 100) - (subMarketInterestedEarnedBeforeFees * tokenReserve.solvencyInsuranceFeeRate / 100)
      const newSubMarketDepositedAmountAfterFees = Number(tokenReserveSubMarketList[i].depositedAmount) + subMarketInterestedEarnedAfterFees

      //SubMarket New 7 day Balance Before Fee = Old Balance * Token Reserve 7 day Earned Interest Index / Token Reserve current Earned Interest Index
      //Interest Earned Before Fee = New Balance Before Fee - Old Balance
      //Fee Generated = Interest Earned Before Fee * Token Reserve Solvency Insurance Fee Rate
      const sevenDaySubMarketBalanceBeforeFee = (newSubMarketDepositedAmountAfterFees * tokenReserveSevenDaySupplyChangeIndex / tokenReserveSupplyInterestChangeIndex)
      const sevenDayInterestEarnedBeforeFee = sevenDaySubMarketBalanceBeforeFee - newSubMarketDepositedAmountAfterFees
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
        [stableCoinFeeArray[i].tokenReserveSupplyInterestChangeIndex, stableCoinFeeArray[i].tokenReserve7DaySupplyInterestChangeIndex] = calculateTokenReserveSevenDaySupplyInterestFactor(unixData.timeStamp, stableCoinFeeArray[i].tokenId)
        if(stableCoinFeeArray[i].tokenReserveSupplyInterestChangeIndex && stableCoinFeeArray[i].tokenReserve7DaySupplyInterestChangeIndex)
          sevenDayStableCoinProjectionValue += calculateSubMarketSevenDayFeeAccrued(stableCoinFeeArray[i].tokenId, stableCoinFeeArray[i].tokenReserveSupplyInterestChangeIndex, stableCoinFeeArray[i].tokenReserve7DaySupplyInterestChangeIndex)
      }

      var sevenDayCryptoCurrencyProjectionValue = 0
      for(var i=0; i<cryptoCurrencyFeeArray.length; i++)
      {
        [cryptoCurrencyFeeArray[i].tokenReserveSupplyInterestChangeIndex, cryptoCurrencyFeeArray[i].tokenReserve7DaySupplyInterestChangeIndex] = calculateTokenReserveSevenDaySupplyInterestFactor(unixData.timeStamp, cryptoCurrencyFeeArray[i].tokenId)
        if(cryptoCurrencyFeeArray[i].tokenReserveSupplyInterestChangeIndex && cryptoCurrencyFeeArray[i].tokenReserve7DaySupplyInterestChangeIndex)
          sevenDayCryptoCurrencyProjectionValue += calculateSubMarketSevenDayFeeAccrued(cryptoCurrencyFeeArray[i].tokenId, cryptoCurrencyFeeArray[i].tokenReserveSupplyInterestChangeIndex, cryptoCurrencyFeeArray[i].tokenReserve7DaySupplyInterestChangeIndex)
      }

      const sevenDayProjection = sevenDayStableCoinProjectionValue + sevenDayCryptoCurrencyProjectionValue < 0 ? 0 : sevenDayStableCoinProjectionValue + sevenDayCryptoCurrencyProjectionValue
      sevenDayProjectionRate.value = (sevenDayProjection).toLocaleString('en-US', {
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

  function handleShowSolvencyHistory()
  {
    if(!showSolvencyHistory.value)
      playOpenChartSFX()
    else
      playCloseChartSFX()

    showSolvencyHistory.value = !showSolvencyHistory.value
  }
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