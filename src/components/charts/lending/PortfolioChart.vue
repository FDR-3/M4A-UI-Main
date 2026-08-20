<template>
  <div class="smallMarginTop">
    <div class="flexCenterRow hChartLayout" style="justify-content:space-around !important">
      <div>
        <h4 class="underLine">7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">{{ sevenDayInterestEarnedValueString }}</span> A Week</h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ sevenDayCalculatedUserInterestEarned }}</span> A Week</h5>
      </div>

      <div class="flexCenterColumn">
        <div class="flexCenterRow">
          <ion-button fill="clear" class="smallMarginBottom" @click="openTokenPopover($event)">
            <component :is="tokenSVG" style="width: 44px; height: 35px; max-height: 40px"></component>
            <ion-text color="dark" class="bold">{{ tokenName }}</ion-text>
          </ion-button>
        </div>

        <div class="nSmallMarginTop smallMarginBottom">
          <div class="showTrimmedAddress"><ion-text>SubMarket Owner: {{ subMarketOwnerAddressTrimmed }}</ion-text><br></div>
          <div class="showNonTrimmedAddress"><ion-text>SubMarket Owner: {{ subMarketOwnerAddress }}</ion-text><br></div>
          <ion-text>SubMarket Index: {{ subMarketIndex }}</ion-text><br>
          <ion-text>Fee on Interest Earned: {{ subMarketFee }}%</ion-text><br>
          <ion-text>Supply APY: {{ supplyAPY }}%</ion-text><br>
          <ion-text>Borrow APY: {{ borrowAPY }}%</ion-text>
        </div>

        <ion-text>Balance:
          <span class="rainbowText">{{ Number(userCalculatedBalance)?.toLocaleString('en-US', {
            minimumFractionDigits: decimalAmount,
            maximumFractionDigits: decimalAmount }) }}
          </span> Value: $<span class="rainbowText"> {{ balanceValueString }} </span>
        </ion-text>
        <ion-text class="smallMarginBottom">Debt:
          <span class="poopText">{{ Number(userCalculatedDebt)?.toLocaleString('en-US', {
            minimumFractionDigits: decimalAmount,
            maximumFractionDigits: decimalAmount }) }}
          </span> Value: $<span class="poopText"> {{ debtValueString }} </span>
        </ion-text>

        <ion-label >Last Action: {{ activityDescriptions[chartData?.lastActionType] + ' ' + chartData?.lastActionAmount?.toLocaleString('en-US', {
            minimumFractionDigits: decimalAmount,
            maximumFractionDigits: decimalAmount }) + ' ' + tokenName}}
          <br>{{ convertUnixTimeToLocalDate(chartData?.lastActionTimeStamp) + ' ' + convertUnixTimeToLocalTime(chartData?.lastActionTimeStamp)}}
        </ion-label>

        <div class="flexCenterRow">
          <Select
          class="chartSelect"
          style="margin: 10px"
          v-model="chartSelect" 
          :options="yearList" 
          optionLabel="chartAvailable" 
          optionValue="chartAvailable" 
          placeholder="Select Year"
          appendTo="self"
          @change="$emit('changeYear', tokenId, subMarketOwnerAddress, subMarketIndex, chartSelect)">
          </Select>

          <div v-if="ownerAddress==connectedWallet.addressString">
            <ion-button v-if="!hasDeposits" class="lendingActionButton" fill="clear" @click="updateStoredSelectedSubMarketIndex();
            $emit('openDepositModal', tokenId, tokenMintAddressString, subMarketSelectOption)">
              <ion-label class="noClickEvent" color="dark">Deposit</ion-label>
            </ion-button>
            <ion-button v-else fill="clear" @click="openActionsPopover"><ion-label color="dark">Actions</ion-label></ion-button>
          </div>
        </div>
      </div>

      <div>
        <h4 class="underLine">Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">{{ interestEarnedValueString }}</span></h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ calculatedUserInterestEarned }}</span></h5>
      </div>   
    </div>

    <div class="vChartLayout">
      <ion-button fill="clear" class="nTinyMarginBottom" @click="openTokenPopover($event)">
        <component :is="tokenSVG" style="width: 44px; height: 35px; max-height: 40px"></component>
        <ion-text color="dark" class="bold">{{ tokenName }}</ion-text>
      </ion-button>
      
      <br>

      <ion-text>SubMarket Owner: {{ subMarketOwnerAddressTrimmed }}</ion-text><br>
      <ion-text>SubMarket Index: {{ subMarketIndex }}</ion-text><br>
      <ion-text>Fee on Interest Earned: {{ subMarketFee }}%</ion-text><br>
      <ion-text>Supply APY: {{ supplyAPY }}%</ion-text><br>
      <ion-text>Borrow APY: {{ borrowAPY }}%</ion-text>

      <div class="unStackedBalanceDebt">
        <br><ion-text>Balance:
          <span class="rainbowText">{{ Number(userCalculatedBalance)?.toLocaleString('en-US', {
            minimumFractionDigits: decimalAmount,
            maximumFractionDigits: decimalAmount }) }}
          </span> Value: $<span class="rainbowText"> {{ balanceValueString }} </span></ion-text><br>
        <ion-text class="smallMarginBottom">Debt:
          <span class="poopText">{{ Number(userCalculatedDebt)?.toLocaleString('en-US', {
            minimumFractionDigits: decimalAmount,
            maximumFractionDigits: decimalAmount }) }}
          </span> Value: $<span class="poopText"> {{ debtValueString }} </span>
        </ion-text>
      </div>

      <div class="stackedBalanceDebt">
        <br><ion-text>Balance:
          <span class="rainbowText">{{ Number(userCalculatedBalance)?.toLocaleString('en-US', {
            minimumFractionDigits: decimalAmount,
            maximumFractionDigits: decimalAmount }) }}
          </span>
        <br>Value: $<span class="rainbowText"> {{ balanceValueString }} </span></ion-text><br><br>
        <ion-text class="smallMarginBottom">Debt:
          <span class="poopText">{{ Number(userCalculatedDebt)?.toLocaleString('en-US', {
            minimumFractionDigits: decimalAmount,
            maximumFractionDigits: decimalAmount }) }}
          </span>
        <br>Value: $<span class="poopText"> {{ debtValueString }} </span></ion-text>
      </div>

      <div class="mediumSmallMarginTop">
        <ion-label>Last Action: <br>{{ activityDescriptions[chartData?.lastActionType] + ' ' + chartData?.lastActionAmount?.toLocaleString('en-US', {
            minimumFractionDigits: decimalAmount,
            maximumFractionDigits: decimalAmount }) + ' ' + tokenName}}
          <br>{{ convertUnixTimeToLocalTime(chartData?.lastActionTimeStamp) }}<br>{{ convertUnixTimeToLocalDate(chartData?.lastActionTimeStamp) }}
        </ion-label>
      </div>
      
      <div class="nSmallMarginTop" style="margin-bottom: -2px">
        <h4 class="underLine">7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">{{ sevenDayInterestEarnedValueString }}</span> A Week</h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ sevenDayCalculatedUserInterestEarned }}</span> A Week</h5>
      </div>

      <div class="nMediumMarginTop">
        <h4 class="underLine">Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">{{ interestEarnedValueString }}</span></h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ calculatedUserInterestEarned }}</span></h5>
      </div>  

      <div class="nMediumMarginTop vYearAndActionContainer">
        <Select
        class="chartSelect smallMarginBottom"
        v-model="chartSelect" 
        :options="yearList" 
        optionLabel="chartAvailable" 
        optionValue="chartAvailable" 
        placeholder="Select Year"
        appendTo="self"
        @change="$emit('changeYear', tokenId, subMarketOwnerAddress, subMarketIndex, chartSelect)">
        </Select>
        <div v-if="ownerAddress==connectedWallet.addressString" class="nSmallMarginTop">
          <ion-button v-if="!hasDeposits" class="lendingActionButton" fill="clear" @click="$emit('openDepositModal', tokenId, tokenMintAddressString, subMarketSelectOption)">
            <ion-label class="noClickEvent" color="dark">Deposit</ion-label>
          </ion-button>
          <ion-button v-else fill="clear" @click="openActionsPopover"><ion-label color="dark">Actions</ion-label></ion-button>
        </div>
      </div>
    </div>

    <div class="normalChartLegend">
      <!--Render First 5 Legend Items-->
      <div class="flexCenterRow" style="gap: 10px">
        <div 
        v-for="(dataset, index) in chartData?.datasets.slice(0, 5)" 
        :key="index" 
        class="legendItem"
        @click="toggleDataset(index, chartRef, legenHiddenArray)"
        >
          <div 
            v-if="dataset.label=='Fees Generated'" 
            class="swatch animatedPurpleBlueY">
          </div>
          <div 
            v-else-if="dataset.label=='Balance'" 
            class="swatch animatedRainbowX">
          </div>
          <div 
            v-else-if="dataset.label=='Interest Earned'" 
            class="swatch animatedRainbowY">
          </div>
          <div 
            v-else-if="dataset.label=='Debt'" 
            class="swatch animatedPoopX">
          </div>
          <div 
            v-else="dataset.label=='Interest Accrued'" 
            class="swatch animatedPoopY">
          </div>
          <span 
            class="legendLabel" 
            :class="{'hiddenLabel': legenHiddenArray[index] }"
          >
            <ion-label color="dark" style="margin-left: -6px; letter-spacing: -1px">{{ dataset.label }}</ion-label>
          </span>
        </div>
      </div>
      <!--Render Next 4 Legend Items, Skipping First 5-->
      <div class="flexCenterRow tinyMarginTop" style="gap: 10px">
        <div 
        v-for="(dataset, index) in chartData?.datasets.slice(5, 9)" 
        :key="index + 5" 
        class="legendItem"
        @click="toggleDataset(index+5, chartRef, legenHiddenArray)"
        >
          <div 
            class="swatch" 
            :style="{ backgroundColor: dataset.backgroundColor }">
          </div>
      
          <span 
            class="legendLabel" 
            :class="{'hiddenLabel': legenHiddenArray[index+5] }"
          >
            <ion-label color="dark" style="margin-left: -6px; letter-spacing: -1px">{{ dataset.label }}</ion-label>
          </span>
        </div>
      </div>
      <!--Render Remaining Legend Items, Skipping First 8-->
      <div class="flexCenterRow tinyMarginTop" style="gap: 10px">
        <div 
        v-for="(dataset, index) in chartData?.datasets.slice(9)" 
        :key="index + 9" 
        class="legendItem"
        @click="toggleDataset(index+9, chartRef, legenHiddenArray)"
        >  
          <div 
            class="swatch" 
            :style="{ backgroundColor: dataset.backgroundColor }">
          </div>
          <span 
            class="legendLabel" 
            :class="{'hiddenLabel': legenHiddenArray[index+9] }"
          >
            <ion-label color="dark" style="margin-left: -6px; letter-spacing: -1px">{{ dataset.label }}</ion-label>
          </span>
        </div>
      </div>
    </div>

    <div class="mobileChartLegend">
      <div class="flexCenterColumn">
        <div class="chartLegend">
          <div 
          v-for="(dataset, index) in chartData?.datasets" 
          :key="index" 
          class="legendItem"
          @click="toggleDataset(index, chartRef, legenHiddenArray)"
          >
            <div 
              v-if="dataset.label=='Fees Generated'" 
              class="swatch animatedPurpleBlueY">
            </div>
            <div 
              v-else-if="dataset.label=='Balance'" 
              class="swatch animatedRainbowX">
            </div>
            <div 
              v-else-if="dataset.label=='Interest Earned'" 
              class="swatch animatedRainbowY">
            </div>
            <div 
              v-else-if="dataset.label=='Debt'" 
              class="swatch animatedPoopX">
            </div>
            <div 
              v-else-if="dataset.label=='Interest Accrued'" 
              class="swatch animatedPoopY">
            </div>
            <div 
              v-else 
              class="swatch" 
              :style="{ backgroundColor: dataset.backgroundColor }">
            </div>
            <span 
              class="legendLabel" 
              :class="{'hiddenLabel': legenHiddenArray[index] }"
            >
              <ion-label color="dark" style="margin-left: -6px; letter-spacing: -1px">{{ dataset.label }}</ion-label>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <Chart type="line" ref="chartRef" :data="chartData" :options="chartOptions"/>
    </div>
  </div>

  <ion-popover
  :is-open="tokenPopoverOpen" 
  :event="event" 
  @didDismiss="tokenPopoverOpen=false"
  side="top" 
  alignment="center"
  >
    <ion-button color="green" @click="passByRefWrapperCopyAddress()" @mouseleave="closeTokenPopover($event)">
      <ion-label color="light">{{ copyTokenMintAddressButtonText }}</ion-label>
    </ion-button>
  </ion-popover>

  <ion-popover
  :is-open="actionsPopoverOpen" 
  :event="event" 
  @didDismiss="actionsPopoverOpen=false"
  side="top" 
  alignment="center"
  >
    <div class=" flexCenterColumn lendingActionPopoverContainer">
      <ion-button class="lendingActionButton" fill="clear" @click="updateStoredSelectedSubMarketIndex();
      $emit('openDepositModal', tokenId, tokenMintAddressString, subMarketSelectOption); actionsPopoverOpen=false">
        <ion-label class="noClickEvent" color="dark">Deposit</ion-label>
      </ion-button>
      <ion-button v-if="userCalculatedBalance" class="lendingActionButton" fill="clear" @click="updateStoredSelectedSubMarketIndex();
      $emit('openWithdrawalModal', tokenId, tokenMintAddressString, subMarketSelectOption); actionsPopoverOpen=false">
        <ion-label class="noClickEvent" color="dark">Withdraw</ion-label>
      </ion-button>
      <ion-button v-if="(connectedWallet.addressString!=adminAccounts.hodlTreasuryAddress.toString() &&
      connectedWallet.addressString!=adminAccounts.singlePayerTreasuryAddress.toString())"
      class="lendingActionButton" fill="clear" @click="updateStoredSelectedSubMarketIndex();
      $emit('openBorrowModal', tokenId, tokenMintAddressString, subMarketSelectOption); actionsPopoverOpen=false">
        <ion-label class="noClickEvent" color="dark">Borrow</ion-label>
      </ion-button>
      <ion-button v-if="userCalculatedDebt" class="lendingActionButton" fill="clear" @click="updateStoredSelectedSubMarketIndex();
      $emit('openRepayModal', tokenId, tokenMintAddressString, subMarketSelectOption); actionsPopoverOpen=false">
        <ion-label class="noClickEvent" color="dark">Repay</ion-label>
      </ion-button>
    </div>
  </ion-popover>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { IonButton, IonLabel, IonPopover, IonText } from '@ionic/vue'
  import Select from 'primevue/select'
  import Chart from 'primevue/chart'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { lendingUserAvailableStableCoinYearsBySubMarketHashMap, lendingUserAvailableCryptoCurrencyYearsBySubMarketHashMap, lendingUserTabAccountsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenReservesHashMap, tokenReserveFontEndInfoHashMap, priceObjectMap, tokenIdHashMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketsHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { copyAddress, copyTokenMintAddressText } from '/src/assets/contracts/WalletHelper.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { SECONDS_IN_A_WEEK } from '/src/assets/constants/TimeLengths.ts'
  import { convertUnixTimeToLocalDate, convertUnixTimeToLocalTime } from '/src/assets/helperFunctions/UnixTimeStampHelper.ts'
  import { unixData } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { getCompoundingFactor } from '/src/components/smart contracts/lending protocol/InterestCalcHelpers.ts'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { setChartOptions, toggleDataset } from './ChartHelper'
  import cloneDeep from 'lodash/cloneDeep'
  import './Chart.css'
  
  const props = defineProps(
  [
    'isStableCoin',
    'hasDeposits',
    'tokenId',
    'subMarketOwnerAddress',
    'subMarketOwnerAddressTrimmed',
    'subMarketIndex',
    'ownerAddress',
    'accountIndex',
    'subMarketFee',
    'userTabIndex',
    'chartData',
    'selectedChart'
  ])

  const emits = defineEmits(['interestEarned', 'changeYear', 'openDepositModal', 'openWithdrawalModal', 'openBorrowModal', 'openRepayModal'])

  var chartOptions = ref()
  var chartRef = ref<any>(null)
  var legenHiddenArray = ref([false, false, false])
  var chartTextColor = ref(darkTheme.value ? "#ffffff" : "#000000")
  var animationIntervalId: any
  var interestChangeIntervalId: any

  var tokenPopoverOpen = ref(false)
  var actionsPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)

  var tokenName = ref()
  var tokenSVG = ref()

  var chartSelect = ref()
  var yearList = ref()

  var subMarketSelectOption: any[] = []

  var tokenReserve: any
  var supplyAPY = ref("0.00")
  var borrowAPY = ref("0.00")
  var tokenMintAddressString: string
  var decimalAmount: number
  var lendingUserTabAccount: any
  var userOriginalBalance = 0
  var userCalculatedBalance = ref(0)
  var balanceValueString = ref()
  var userOriginalInterestEarned = ref()
  var calculatedUserInterestEarned = ref()
  var interestEarnedValueString = ref()
  var sevenDayCalculatedUserInterestEarned = ref()
  var sevenDayInterestEarnedValueString = ref()
  var userOriginalDebt = ref()
  var userCalculatedDebt = ref(0)
  var debtValueString = ref()
 
  var activityDescriptions =
  [
    "Deposited",
    "Withdrew",
    "Borrowed",
    "Repaid",
    "Liquidated",
    "Collected SubMarket Fees",
    "Collected Solvency Fees",
    "Collected Liquidation Fees"
  ]

  onMounted(() =>
  {
    tokenMintAddressString = tokenIdHashMap.map.get(props.tokenId)
    decimalAmount = tokenDecimalHashMap.get(props.tokenId)

    if(lendingUserTabAccountsHashMap.map && props.tokenId && (props.accountIndex != undefined))
    {
      const tokenInfo = tokenReserveFontEndInfoHashMap.get(props.tokenId)
      tokenName.value = tokenInfo.name
      tokenSVG.value = tokenInfo.svg

      setInitialBalance()

      yearList.value = getYearList()

      if(unixData.timeStamp != 0)
        startInterestCalculation()
    }

    tokenReserve = cloneDeep(tokenReservesHashMap.map.get(props.tokenId))//cloneDeep to keep changes to tokenReserve variable from setting off tokenReservesHashMap watchers
    const subMarket = subMarketsHashMap.map.get(props.tokenId + props.subMarketOwnerAddress + props.subMarketIndex)
    const option = 
    {
      subMarketFeeName: (subMarket.feeOnInterestEarnedRate).toString() + "% Fee Market",
      subMarketIndex: subMarket.subMarketIndex
    }
    subMarketSelectOption.push(option)
    
    chartSelect.value = props.selectedChart

    chartOptions.value = setChartOptions(true, chartTextColor.value)
    startGradientAnimation()
    
    if(props.chartData && props.chartData.datasets)
      legenHiddenArray.value = props.chartData.datasets.map((dataset: any) => dataset.hidden)
  })

  onUnmounted(() =>
  {
    stopGradientAnimation()
    stopInterestCalculation()
  })

  watch(lendingUserTabAccountsHashMap,() =>
  {
    setInitialBalance()

    yearList.value = getYearList()
    chartSelect.value = props.selectedChart
  })

  watch(darkTheme,() =>
  {
    if(darkTheme.value)
      chartTextColor.value = "#ffffff"
    else
      chartTextColor.value = "#000000"

    chartOptions.value = setChartOptions(true, chartTextColor.value)
  })

  watch(() => [props.ownerAddress, props.accountIndex], (() => 
  {
    lendingUserTabAccount = cloneDeep(lendingUserTabAccountsHashMap.map.get(props.tokenId +
    props.subMarketOwnerAddress +
    props.subMarketIndex.toString() +
    props.ownerAddress +
    props.accountIndex.toString()))

    userOriginalBalance = Number(lendingUserTabAccount.depositedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
    userOriginalInterestEarned.value = Number(lendingUserTabAccount.interestEarnedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
    userOriginalDebt.value = Number(lendingUserTabAccount.borrowedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal

    yearList.value = getYearList()
    chartSelect.value = yearList.value[yearList.value.length - 1].chartAvailable
  }))

  function getYearList()
  {
    const newDate = new Date()
    const currentYear = newDate.getFullYear()

    var initialList
    if(props.isStableCoin)
      initialList = lendingUserAvailableStableCoinYearsBySubMarketHashMap.map.get(props.tokenId +
      props.subMarketOwnerAddress +
      props.subMarketIndex +
      props.ownerAddress +
      props.accountIndex.toString())
    else
      initialList = lendingUserAvailableCryptoCurrencyYearsBySubMarketHashMap.map.get(props.tokenId +
      props.subMarketOwnerAddress +
      props.subMarketIndex +
      props.ownerAddress +
      props.accountIndex.toString())

    var firstYear = undefined
    var processedList = [{chartAvailable: "All"}]

    if(initialList)
      var firstYear = initialList[0].yearAvailable

    if(firstYear)
      for(var year=firstYear; year<=currentYear; year++)
      {
        const availableYearObject =
        {
          chartAvailable: year.toString()
        }

        processedList.push(availableYearObject)
      }

    return processedList
  }

  function setInitialBalance()
  {
    if(!lendingUserTabAccountsHashMap.map)
      return

    lendingUserTabAccount = cloneDeep(lendingUserTabAccountsHashMap.map.get(props.tokenId +
    props.subMarketOwnerAddress +
    props.subMarketIndex.toString() +
    props.ownerAddress +
    props.accountIndex.toString()))

    userOriginalBalance = Number(lendingUserTabAccount.depositedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
    userOriginalInterestEarned.value = Number(lendingUserTabAccount.interestEarnedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
    userOriginalDebt.value = Number(lendingUserTabAccount.borrowedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
  }

  function startGradientAnimation()
  {
    stopGradientAnimation()

    animationIntervalId = setInterval(() =>
    { 
      if(chartRef.value)
        if(chartRef.value.chart)
          chartRef.value.chart.update("none")
    }, 55)
  }

  function stopGradientAnimation()
  {
    if(animationIntervalId != undefined)
    {
      clearInterval(animationIntervalId)
      animationIntervalId = undefined
    }
  }

  function openTokenPopover(e: Event) 
  {
    event.value = e
    tokenPopoverOpen.value = true
  }

  function closeTokenPopover(e: Event) 
  {
    event.value = e
    tokenPopoverOpen.value = false
  }

  function openActionsPopover(e: Event) 
  {
    event.value = e
    actionsPopoverOpen.value = true
  }

  function passByRefWrapperCopyAddress()
  {
    copyAddress(copyTokenMintAddressButtonText, tokenMintAddressString)
  }

  function calculateTokenReserveInterestChangeIndex(timeStamp: number)
  {
    tokenReserve = cloneDeep(tokenReservesHashMap.map.get(props.tokenId))//cloneDeep to keep changes to tokenReserve variable from setting off tokenReservesHashMap watchers

    const oldTime = Number(tokenReserve.lastLendingActivityTimeStamp)
    const changeInTime = timeStamp - oldTime
    const supplyApy = tokenReserve.supplyApy / 10000 //convert from fixed point to decimal
    const borrowApy = tokenReserve.borrowApy / 10000 //convert from fixed point to decimal

    const supplyCompoundingFactor = getCompoundingFactor(supplyApy, changeInTime)
    const borrowCompoundingFactor = getCompoundingFactor(borrowApy, changeInTime)
    const sevenDaySupplyCompoundingFactor = getCompoundingFactor(supplyApy, SECONDS_IN_A_WEEK)

    tokenReserve.newSupplyInterestChangeIndex = Number(tokenReserve.supplyInterestChangeIndex) * supplyCompoundingFactor
    tokenReserve.newBorrowInterestChangeIndex = Number(tokenReserve.borrowInterestChangeIndex) * borrowCompoundingFactor

    tokenReserve.sevenDaySupplyInterestChangeIndex = tokenReserve.newSupplyInterestChangeIndex * sevenDaySupplyCompoundingFactor

    supplyAPY.value = (supplyApy * 100).toFixed(2) //convert to % form
    borrowAPY.value = (borrowApy * 100).toFixed(2) //convert to % form
  }

  function calculateUserInterest()
  {
    setInitialBalance()

    //For tab accounts initialized with no deposits, keeps from dividing by zero
    //For example, can happen to when claiming submarket fees in different destination submarket on new initial tab account
    //Or the Solvency Treasury might have zeros for supply and borrow change index if they aren't doing deposits or borrows
    if(Number(lendingUserTabAccount.supplyInterestChangeIndex) == 0)
      lendingUserTabAccount.supplyInterestChangeIndex = tokenReserve.newSupplyInterestChangeIndex
    if(Number(lendingUserTabAccount.borrowInterestChangeIndex) == 0)
      lendingUserTabAccount.borrowInterestChangeIndex = tokenReserve.borrowInterestChangeIndex

    //User New Balance Before Fee = Old Balance * Token Reserve Earned Interest Index / User Earned Interest Index
    //Interest Earned Before Fee = New Balance Before Fee - Old Balance
    //Interest Earned After Fee = Interest Earned Before Fee - (Interest Earned Before Fee * SubMarket Fee Rate)
    //User New Balance After Fee = Old Balance + Interest Earned After Fee
    //Calculate interest earned
    const newBalanceBeforeFee = (userOriginalBalance * tokenReserve.newSupplyInterestChangeIndex / Number(lendingUserTabAccount.supplyInterestChangeIndex))
    const interestEarnedBeforeFees = newBalanceBeforeFee - userOriginalBalance

    var subMarketFee
    if(props.subMarketFee + tokenReserve.solvencyInsuranceFeeRate <= 100)
      subMarketFee = props.subMarketFee
    else
      subMarketFee = 100 - tokenReserve.solvencyInsuranceFeeRate

    var interestEarnedAfterFees = interestEarnedBeforeFees - (interestEarnedBeforeFees * subMarketFee / 100) - (interestEarnedBeforeFees * tokenReserve.solvencyInsuranceFeeRate / 100)
    interestEarnedAfterFees = Number(interestEarnedAfterFees.toFixed(decimalAmount))

    userCalculatedBalance.value = userOriginalBalance + interestEarnedAfterFees
    calculatedUserInterestEarned.value = (interestEarnedAfterFees + userOriginalInterestEarned.value).toFixed(decimalAmount)

    //User New Debt = Old Debt * Token Reserve Accrued Interest Index / User Accrued Interest Index
    //Calculate interest accrued
    const newDebt = (userOriginalDebt.value * tokenReserve.newBorrowInterestChangeIndex / Number(lendingUserTabAccount.borrowInterestChangeIndex))
    userCalculatedDebt.value = newDebt

    //Calculate 7 day interest earned
    const sevenDayUserCalculatedBalanceBeforeFee = (userCalculatedBalance.value * tokenReserve.sevenDaySupplyInterestChangeIndex / tokenReserve.newSupplyInterestChangeIndex)
    const sevenDayInterestEarnedBeforeFee = sevenDayUserCalculatedBalanceBeforeFee - userCalculatedBalance.value

    sevenDayCalculatedUserInterestEarned.value = sevenDayInterestEarnedBeforeFee - (sevenDayInterestEarnedBeforeFee * props.subMarketFee / 100)
    sevenDayCalculatedUserInterestEarned.value = sevenDayCalculatedUserInterestEarned.value < 0 ? (0).toFixed(decimalAmount) : sevenDayCalculatedUserInterestEarned.value.toFixed(decimalAmount)

    var unRoundedInterestEarnedValue
    var unRoundedSevenDayInterestEarnedValue

    const price = priceObjectMap.data[tokenMintAddressString].usdPrice
    if(price)
    {
      var flooredValue = Math.floor(userCalculatedBalance.value * Number(price) * 100) / 100
      balanceValueString.value = flooredValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

      flooredValue = Math.floor(userCalculatedDebt.value * Number(price) * 100) / 100
      debtValueString.value = flooredValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

      unRoundedInterestEarnedValue = calculatedUserInterestEarned.value * Number(price)
      flooredValue = Math.floor(unRoundedInterestEarnedValue * 100) / 100
      interestEarnedValueString.value = flooredValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

      unRoundedSevenDayInterestEarnedValue = sevenDayCalculatedUserInterestEarned.value * Number(price)
      flooredValue = Math.floor(unRoundedSevenDayInterestEarnedValue * 100) / 100
      sevenDayInterestEarnedValueString.value = flooredValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })
    }
    else
    {
      const zeroValueString = (0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

      balanceValueString.value = zeroValueString
      debtValueString.value = zeroValueString
      interestEarnedValueString.value = zeroValueString
      sevenDayInterestEarnedValueString.value = zeroValueString

      unRoundedInterestEarnedValue = 0
      unRoundedSevenDayInterestEarnedValue = 0
    }

    emits('interestEarned',
    props.userTabIndex,
    Number(sevenDayCalculatedUserInterestEarned.value.replace(/,/g, '')),
    unRoundedSevenDayInterestEarnedValue,
    Number(calculatedUserInterestEarned.value.replace(/,/g, '')),
    unRoundedInterestEarnedValue)
  }

  function startInterestCalculation()
  {
    interestChangeIntervalId = setInterval(() =>
    {
      calculateTokenReserveInterestChangeIndex(unixData.timeStamp)
      calculateUserInterest()
    }, 55)
  }

  function stopInterestCalculation()
  {
    if(interestChangeIntervalId != undefined)
    {
      clearInterval(interestChangeIntervalId)
      interestChangeIntervalId = undefined
    }
  }

  function updateStoredSelectedSubMarketIndex()
  {
    localStorage.setItem(props.tokenId.toString() + 
    connectedWallet.addressString +
    connectedWallet.selectedLendingUserAccountIndex.toString() +
    "selectedMainSubMarketIndex", props.subMarketIndex)
  }
</script>

<style scoped>
  ion-popover 
  {
    --width: min(70vw, 144px)
  }

  h4
  {
    font-size: min(4.5vw, 26px)
  }

  h5
  {
    font-size: min(4vw, 25px)
  }
  
  @media screen and (min-width: 1544.1px)
  { 
    .showTrimmedAddress
    {
      display: none
    }
    .showNonTrimmedAddress
    {
      display: flex
    }
  }

  @media screen and (max-width: 1544px)
  { 
    .showTrimmedAddress
    {
      display: flex
    }
    .showNonTrimmedAddress
    {
      display: none
    }
  }

  @media screen and (min-width: 1544.1px)
  { 
    .hChartLayout
    {
      display: flex
    }
    .vChartLayout
    {
      display: none
    } 
  }
  @media screen and (max-width: 1544px)
  { 
    .hChartLayout
    {
      display: none
    }
    .vChartLayout
    {
      display: block
    }
  }

  @media screen and (min-width: 240.1px)
  { 
    .vYearAndActionContainer
    {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
  @media screen and (max-width: 240px)
  { 
    .vYearAndActionContainer
    {
      display: flex;
      flex-direction: column;
      align-items: center
    }
  }

  @media screen and (min-width: 1800.1px)
  {  
    .normalChartLegend
    {
      display: flex;
      flex-direction: column
    }
    .verticalChartLegend
    {
      display: none
    }
    .chartLegend
    {
      display: flex;
      justify-content: center;
      gap: 10px
    }
  }
  @media screen and (min-width: 795.1px)
  { 
    .normalChartLegend
    {
      display: flex;
      flex-direction: column
    }
    .mobileChartLegend
    {
      display: none
    }
    .chartLegend
    {
      display: flex;
      flex-direction: column;
      align-items: left;
    }
  }
  @media screen and (max-width: 795.1px)
  { 
    .normalChartLegend
    {
      display: none
    }
    .mobileChartLegend
    {
      display: flex;
      flex-direction: column
    }
    .chartLegend
    {
      display: flex;
      flex-direction: column;
      align-items: left;
    }
  }

  @media screen and (min-width: 500.1px)
  { 
    .unStackedBalanceDebt
    {
      display: block
    }
    .stackedBalanceDebt
    {
      display: none
    }
  }
  @media screen and (max-width: 500px)
  { 
    .unStackedBalanceDebt
    {
      display: none
    }
    .stackedBalanceDebt
    {
      display: block
    }
  } 
</style>