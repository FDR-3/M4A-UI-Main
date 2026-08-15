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
          <h2>Single Payer Treasury Value <br>
            <div class="flexCenterRow nSmallMarginTop">
              <div style="margin-bottom: 2px">
                <InfoButton :infoMessage="payoutMSG"/>
              </div>
              Amount Available For Claim Payouts: $<span class="rainbowText">{{ tvl.singlePayerPayOuts.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 }) }}</span>
            </div>
          </h2>
          <h2 class="nMediumLargeMarginTop">7 Day Projection Rate: $<span class="rainbowText">{{ sevenDayProjectionRate }}</span></h2>

          <ion-button color="light" class="thinBorder4Rad mediumMarginBottom" @click="handleShowSinglePayerHistory()">
            <ion-label v-if="!showSinglePayerHistory" color="green">Show History</ion-label>
            <ion-label v-else color="green">Hide History</ion-label>
          </ion-button>

          <transition name="divSlide">
            <div v-if="showSinglePayerHistory">
              <div class="divSlideContent">
                <div class="beamOverlay"></div>
                <SinglePayerChart :currentPayoutAmount="tvl.singlePayerPayOuts"
                :current7DayProjection="Number(sevenDayProjectionRate.replace(/,/g, ''))"
                :amountHistoryHashMap="amountHistoryHashMap"/>
              </div>
            </div>
          </transition>

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
      <Column field="percentChange24h" header="24h% Price Change" style="width: 0%" sortable>
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
      <Column field="percentChange24h" header="24h% Price Change" style="width: 0%" sortable>
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
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, markRaw, inject } from 'vue'
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
  import { calculateTokenReserveSevenDaySupplyInterestFactor } from '/src/components/smart contracts/lending protocol/InterestCalcHelpers.ts'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { unixData } from '/src/assets/globalStates/AnchorPrograms.vue'
  import SinglePayerChart from '/src/components/charts/lending/SinglePayerChart.vue'
  import { playOpenChartSFX, playCloseChartSFX } from '/src/components/audio/AudioFunctions.vue'
  import InfoButton from '/src/components/help/InfoButton.vue'
  import cloneDeep from 'lodash/cloneDeep'

  var stableCoinTableData = ref()
  var CryptoCurrencyTableData = ref()
  var isLoading = ref(true)
  var stableValue = ref(0)
  var cryptoValue = ref(0)
  var showSinglePayerHistory = ref(false)
  var amountHistoryHashMap = ref()

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)

  var sevenDayProjectionRate = ref()
  sevenDayProjectionRate.value = (0).toFixed(2)
  var stableCoinFeeArray = cloneDeep(StableCoins)
  var cryptoCurrencyFeeArray = cloneDeep(CryptoCurrency)
  var subMarketFeesAccruedIntervalId: any

  const payoutMSG = "The amount available for claim payouts is updated every Friday at the latest."

  onMounted(() =>
  {
    if(lendingUserTabAccountsHashMap.map)
    {
      processSinglePayerStableCoinTableData()
      processSinglePayerCryptoCurrencyTableData()
      tvl.singlePayerPayOuts = Math.floor((stableValue.value + cryptoValue.value) * 100) / 100  

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
    tvl.singlePayerPayOuts = Math.floor((stableValue.value + cryptoValue.value) * 100) / 100  

    if(isLoading.value)
      isLoading.value = false
  })

  watch(priceObjectMap, () => 
  {
    processSinglePayerStableCoinTableData()
    processSinglePayerCryptoCurrencyTableData()
    tvl.singlePayerPayOuts = Math.floor((stableValue.value + cryptoValue.value) * 100) / 100  
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

    var treasuryValue = 0
    var tempMap = new Map<number, string>(amountHistoryHashMap.value)
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

      const treasuryTotalAmount = Number(unprocessedTableData[i].unCollectedFees) + Number(unprocessedTableData[i].deposits)
      var treasuryCalculatedValue = 0
      const tokenMintAddressString = tokenIdHashMap.map.get(unprocessedTableData[i].tokenId)
      const priceData = priceObjectMap.data[tokenMintAddressString]
      if(priceData)
        treasuryCalculatedValue = treasuryTotalAmount * priceData.usdPrice

      treasuryValue += treasuryCalculatedValue
      var flooredValue = Math.floor(treasuryCalculatedValue * 100) / 100

      unprocessedTableData[i].value = flooredValue
      unprocessedTableData[i].valueString = '$' + flooredValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 })

      //Set SinglePayerHistory Current Data
      const totalAmountString = treasuryTotalAmount.toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })
      tempMap.set(unprocessedTableData[i].tokenId, totalAmountString)
    }

    stableValue.value = treasuryValue
    amountHistoryHashMap.value = tempMap
    stableCoinTableData.value = unprocessedTableData
  }

  function processSinglePayerCryptoCurrencyTableData()
  {
    if(!lendingUserTabAccountsHashMap.map)
      return

    var treasuryValue = 0
    var tempMap = new Map<number, string>(amountHistoryHashMap.value)
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

      const treasuryTotalAmount = Number(unprocessedTableData[i].unCollectedFees) + Number(unprocessedTableData[i].deposits)
      var treasuryCalculatedValue = 0
      const tokenMintAddressString = tokenIdHashMap.map.get(unprocessedTableData[i].tokenId)
      const priceData = priceObjectMap.data[tokenMintAddressString]
      if(priceData)
        treasuryCalculatedValue = treasuryTotalAmount * priceData.usdPrice

      treasuryValue += treasuryCalculatedValue
      var flooredValue = Math.floor(treasuryCalculatedValue * 100) / 100

      unprocessedTableData[i].value = flooredValue
      unprocessedTableData[i].valueString = '$' + flooredValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 })

      //Set SinglePayerHistory Current Data
      const totalAmountString = treasuryTotalAmount.toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount })
      tempMap.set(unprocessedTableData[i].tokenId, totalAmountString)
    }

    cryptoValue.value = treasuryValue
    amountHistoryHashMap.value = tempMap
    CryptoCurrencyTableData.value = unprocessedTableData
  }

  function calculateSubMarketSevenDayFeeAccrued(tokenId: number, tokenReserveSupplyInterestChangeIndex: number, tokenReserveSevenDaySupplyChangeIndex: number)
  {
    const tokenReserve = tokenReservesHashMap.map.get(tokenId)
    const subMarket100PercentFee = subMarketsHashMap.map.get(tokenId +
    adminAccounts.lendingCEOAddressString +
    adminAccounts.lendingMain100PercentSubMarketIndex.toString())

    if(!tokenReserve || !subMarket100PercentFee)
      return 0

    if(Number(subMarket100PercentFee.supplyInterestChangeIndex) == 0)
      return 0

    var subMarketFee
    if(subMarket100PercentFee.feeOnInterestEarnedRate + tokenReserve.solvencyInsuranceFeeRate <= 100)
      subMarketFee = subMarket100PercentFee.feeOnInterestEarnedRate
    else
      subMarketFee = 100 - tokenReserve.solvencyInsuranceFeeRate

    //SubMarket New Balance Before Fee = Old Balance * Token Reserve current Earned Interest Index / Sub Market Reserve Earned Interest Index
    const newSubMarketDepositedAmountBeforeFees = Number(subMarket100PercentFee.depositedAmount) * tokenReserveSupplyInterestChangeIndex / subMarket100PercentFee.supplyInterestChangeIndex
    const subMarketInterestedEarnedBeforeFees = newSubMarketDepositedAmountBeforeFees - Number(subMarket100PercentFee.depositedAmount) 
    const subMarketInterestedEarnedAfterFees = subMarketInterestedEarnedBeforeFees - (subMarketInterestedEarnedBeforeFees * subMarketFee / 100) - (subMarketInterestedEarnedBeforeFees * tokenReserve.solvencyInsuranceFeeRate / 100)
    const newSubMarketDepositedAmountAfterFees = Number(subMarket100PercentFee.depositedAmount) + subMarketInterestedEarnedAfterFees
    //We know the deposited amount actually won't go up here because the fees are at %100 in this Sub Market

    //SubMarket New 7 day Balance Before Fee = Old Balance * Token Reserve 7 day Earned Interest Index / Token Reserve current Earned Interest Index
    //Interest Earned Before Fee = New Balance Before Fee - Old Balance
    //Fee Generated = Interest Earned Before Fee * SubMarket Fee Rate
    const sevenDaySubMarketBalanceBeforeFee = (newSubMarketDepositedAmountAfterFees * tokenReserveSevenDaySupplyChangeIndex / tokenReserveSupplyInterestChangeIndex)
    const sevenDayInterestEarnedBeforeFee = sevenDaySubMarketBalanceBeforeFee - newSubMarketDepositedAmountAfterFees

    var subMarketFee
    if(subMarket100PercentFee.feeOnInterestEarnedRate + tokenReserve.solvencyInsuranceFeeRate <= 100)
      subMarketFee = subMarket100PercentFee.feeOnInterestEarnedRate
    else
      subMarketFee = 100 - tokenReserve.solvencyInsuranceFeeRate
    
    const sevenDaySubMarketFeeGenerated = (sevenDayInterestEarnedBeforeFee * subMarketFee / 100)

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

  function handleShowSinglePayerHistory()
  {
    if(!showSinglePayerHistory.value)
      playOpenChartSFX()
    else
      playCloseChartSFX()

    showSinglePayerHistory.value = !showSinglePayerHistory.value
  }
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

  /*The Horizontal Glowing Light Beam*/
  .beamOverlay::before
  {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 10px;
    opacity: 0;
    background: linear-gradient(90deg, transparent 0%, var(--ion-color-green) 50%, transparent 100%);
    box-shadow: 0 0 15px var(--ion-color-green)
  }

  /*Particles following near the beam*/
  .beamOverlay::after
  {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 35px;
    opacity: 0;
    background-image: radial-gradient(circle, var(--ion-color-green) 1.5px, transparent 2px);
    background-size: 24px 24px
  }
</style>