<template>
  <div class="smallMarginTop">
    <div>
      <br>
      <div class="nMediumMarginTop tinyMarginBottom flexCenterRow">
        <Select
        class="chartSelect"
        v-model="chartSelect" 
        :options="lendingProtocolHistoryOptions" 
        optionLabel="historyOption" 
        optionValue="historyOption" 
        placeholder="Select Year"
        appendTo="self"
        @change="switchChartData()">
        </Select>

        <ion-button class="toggleButton smallMarginLeft" fill="clear" @click="handleToggleChart()">
          <ion-label v-if="showValues==1" color="dark">Toggle Deposited Amounts</ion-label>
          <ion-label v-else-if="showValues==2" color="dark">Toggle Borrowed Amounts</ion-label>
          <ion-label v-else color="dark">Toggle Values</ion-label>
        </ion-button>
      </div>
    </div>

    <div v-if="showValues==1">
      <div class="flexCenterColumn">
        <div class="chartLegend">
          <div 
          v-for="(dataset, index) in valueChartData?.datasets" 
          :key="index" 
          class="legendItem"
          @click="toggleDataset(index, chartRef, legenHiddenArray)"
          >
            <div 
              v-if="dataset.label=='Deposited Value'" 
              class="swatch animatedRainbowX">
            </div>
            <div 
              v-else-if="dataset.label=='Borrowed Value'" 
              class="swatch animatedPoopX">
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

    <div v-else-if="showValues==2">
      <div class="flexCenterColumn">
        <div class="chartLegend">
          <div 
          v-for="(dataset, index) in depositedAmountChartData?.datasets"
          :key="index" 
          class="legendItem"
          @click="toggleDataset(index, chartRef, legenHiddenArray)"
          >
            <div 
              v-if="dataset.label=='Deposited USDS'" 
              class="swatch animatedUSDSX">
            </div>
            <div 
              v-else-if="dataset.label=='Deposited USDC'" 
              class="swatch animatedUSDCX">
            </div>
            <div 
              v-else-if="dataset.label=='Deposited SOL'" 
              class="swatch animatedSOLX">
            </div>
            <div 
              v-else-if="dataset.label=='Deposited WEth'" 
              class="swatch animatedWEthX">
            </div>
            <div 
              v-else-if="dataset.label=='Deposited WBtc'" 
              class="swatch animatedWBtcX">
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

    <div v-else>
      <div class="flexCenterColumn">
        <div class="chartLegend">
          <div 
          v-for="(dataset, index) in borrowedAmountChartData?.datasets"
          :key="index" 
          class="legendItem"
          @click="toggleDataset(index, chartRef, legenHiddenArray)"
          >
            <div 
              v-if="dataset.label=='Borrowed USDS'" 
              class="swatch animatedUSDSX">
            </div>
            <div 
              v-else-if="dataset.label=='Borrowed USDC'" 
              class="swatch animatedUSDCX">
            </div>
            <div 
              v-else-if="dataset.label=='Borrowed SOL'" 
              class="swatch animatedSOLX">
            </div>
            <div 
              v-else-if="dataset.label=='Borrowed WEth'" 
              class="swatch animatedWEthX">
            </div>
            <div 
              v-else-if="dataset.label=='Borrowed WBtc'" 
              class="swatch animatedWBtcX">
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

    <div ref="chartContainer">
      <Chart v-if="showValues==1" type="line" ref="chartRef" :width="chartWidth" :data="valueChartData" :options="valueChartOptions"/>
      <Chart v-else-if="showValues==2" type="line" ref="chartRef" :width="chartWidth" :data="depositedAmountChartData" :options="amountChartOptions"/>
      <Chart v-else type="line" ref="chartRef" :width="chartWidth" :data="borrowedAmountChartData" :options="amountChartOptions"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { IonLabel, IonButton } from '@ionic/vue'
  import Select from 'primevue/select'
  import Chart from 'primevue/chart'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { monthList } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { lendingProtocolHistoryOptions } from './TVLHistory'
  import { TokenReserveDepositedValueHistoryHashMap,
    TokenReserveBorrowedValueHistoryHashMap,
    TokenReserveUSDSDepositedHistoryHashMap,
    TokenReserveUSDCDepositedHistoryHashMap,
    TokenReserveSOLDepositedHistoryHashMap,
    TokenReserveWEthDepositedHistoryHashMap,
    TokenReserveWBtcDepositedHistoryHashMap,
    TokenReserveUSDSBorrowedHistoryHashMap,
    TokenReserveUSDCBorrowedHistoryHashMap,
    TokenReserveSOLBorrowedHistoryHashMap,
    TokenReserveWEthBorrowedHistoryHashMap,
    TokenReserveWBtcBorrowedHistoryHashMap } from './TokenReserveHistory'
  import { sleep } from '/src/assets/helperFunctions/sleep.ts'
  import { tokenIds, tokenIdArray } from '/src/assets/constants/Addresses.ts'
  import { getDepositedAmountBaseChart,
    getBorrowedAmountBaseChart,
    setChartOptions,
    toggleDataset,
    setRainbowLineAnimatedGradient,
    setPoopLineAnimatedGradient } from './ChartHelper'
  import cloneDeep from 'lodash/cloneDeep'
  import './Chart.css'

  const props = defineProps(['depositedValue', 'borrowedValue', 'depositedAmountHistoryHashMap', 'borrowedAmountHistoryHashMap'])

  var valueChartData: any
  var depositedAmountChartData: any
  var borrowedAmountChartData: any
  var valueChartOptions = ref()
  var amountChartOptions = ref()
  var chartRef = ref<any>(null)
  var legenHiddenArray = ref([false])
  var chartTextColor = ref(darkTheme.value ? "#ffffff" : "#000000")
  var animationIntervalId: any
  var chartSelect = ref("All")
  var valueChartDataHashMap = new Map<string, any>()
  var depositedAmountChartDataHashMap = new Map<string, any>()
  var borrowedAmountChartDataHashMap = new Map<string, any>()
  var chartContainer = ref<any>(null)
  var chartWidth = ref(0)
  var showValues = ref(1)

  var gradientOffset = ref(0)

  const valueBaseChartData =
  {
    labels: [],
    datasets:
    [
      {
        type: 'line',
        label: 'Deposited Value',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setRainbowLineAnimatedGradient(ctx, chartArea, gradientOffset.value)
        },
        borderWidth: 4,
        fill: false,
        tension: 0.4,
        data: [] as any[]
      },
      {
        type: 'line',
        label: 'Borrowed Value',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setPoopLineAnimatedGradient(ctx, chartArea, gradientOffset.value)
        },
        borderWidth: 4,
        fill: false,
        tension: 0.4,
        data: [] as any[]
      }
    ]
  }
 
  onMounted(async() =>
  {
    setChartData()
    valueChartOptions.value = setChartOptions(false, chartTextColor.value, true)
    amountChartOptions.value = setChartOptions(false, chartTextColor.value)
    valueChartData = valueChartDataHashMap.get(chartSelect.value)
    depositedAmountChartData = depositedAmountChartDataHashMap.get(chartSelect.value)
    borrowedAmountChartData = borrowedAmountChartDataHashMap.get(chartSelect.value)
    updateChartWidth() 
    startGradientAnimation()
    await sleep(100)
    valueChartOptions.value.responsive = true
    amountChartOptions.value.responsive = true
  })

  onUnmounted(() =>
  {
    stopGradientAnimation()
  })

  watch(darkTheme,() =>
  {
    if(darkTheme.value)
      chartTextColor.value = "#ffffff"
    else
      chartTextColor.value = "#000000"

    valueChartOptions.value = setChartOptions(false, chartTextColor.value, true)
    amountChartOptions.value = setChartOptions(false, chartTextColor.value)
  })

  watch(() => [props.depositedValue, props.borrowedValue], (async() => 
  {
    setChartData() //Updating chart hash map so that the last value is already valid for when the user switches

    //valueChartData = valueChartDataHashMap.get(chartSelect.value) //Setting the whole chart can cause it to re-render every time the price changes in some cases. Specifically seems like right after watching a video in full screen on the website and then looking at the Treasury, or atleast that's what I did, lol.
    if(valueChartData?.datasets?.[0])
      valueChartData.datasets[0].data[valueChartData.datasets[0].data.length-1] = props.depositedValue
    if(valueChartData?.datasets?.[1])
      valueChartData.datasets[1].data[valueChartData.datasets[1].data.length-1] = props.borrowedValue
  }))

  watch(() => [props.depositedAmountHistoryHashMap], (async() => 
  {
    setChartData() //Updating chart hash map so that the last value is already valid for when the user switches

    ////depositedAmountChartData = depositedAmountChartDataHashMap.get(chartSelect.value) //Setting the whole chart can cause it to re-render every time the price changes in some cases. Specifically seems like right after watching a video in full screen on the website and then looking at the Treasury, or atleast that's what I did, lol.

    tokenIdArray.forEach((tokenId: number, index: number) =>
    {
      depositedAmountChartData.datasets[index].data[depositedAmountChartData.datasets[index].data.length - 1] = props.depositedAmountHistoryHashMap.get(tokenId)
    })
  }))

  watch(() => [props.borrowedAmountHistoryHashMap], (async() => 
  {
    setChartData() //Updating chart hash map so that the last value is already valid for when the user switches

    ////borrowedAmountChartData = borrowedAmountChartDataHashMap.get(chartSelect.value) //Setting the whole chart can cause it to re-render every time the price changes in some cases. Specifically seems like right after watching a video in full screen on the website and then looking at the Treasury, or atleast that's what I did, lol.

    tokenIdArray.forEach((tokenId: number, index: number) =>
    {
      borrowedAmountChartData.datasets[index].data[borrowedAmountChartData.datasets[index].data.length - 1] = props.borrowedAmountHistoryHashMap.get(tokenId)
    })
  }))

  async function switchChartData()
  {
    valueChartOptions.value.responsive = false
    amountChartOptions.value.responsive = false
    depositedAmountChartData = depositedAmountChartDataHashMap.get(chartSelect.value)
    borrowedAmountChartData = borrowedAmountChartDataHashMap.get(chartSelect.value)
    valueChartData = valueChartDataHashMap.get(chartSelect.value)

    resetHiddenArray()
  
    await sleep(40)
    valueChartOptions.value.responsive = true
    amountChartOptions.value.responsive = true
  }

  async function handleToggleChart()
  {
    valueChartOptions.value.responsive = false //Needed this extra step to get initial animation when swithching only in Production for some reason
    amountChartOptions.value.responsive = false

    resetHiddenArray()
    if(showValues.value == 3)
      showValues.value = 1
    else
      showValues.value++

    await sleep(40)
    valueChartOptions.value.responsive = true
    amountChartOptions.value.responsive = true
  }

  function resetHiddenArray()
  {
    for(var i=0; i<legenHiddenArray.value.length; i++)
      legenHiddenArray.value[i] = false
  }
  
  function updateChartWidth() 
  {
    if(chartContainer.value) 
    {
      const currentWidth = chartContainer.value.clientWidth

      if (currentWidth > 0) 
        chartWidth.value = currentWidth
    }
  }

  function startGradientAnimation()
  {
    stopGradientAnimation()

    animationIntervalId = setInterval(() =>
    { 
      gradientOffset.value += 0.07
      
      if(gradientOffset.value >= 1)
        gradientOffset.value = 0

      if(chartRef.value?.chart)
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

  function setChartData()
  {
    const newDate = new Date()
    const startYear = Number(lendingProtocolHistoryOptions[1].historyOption)
    const currentYear = newDate.getFullYear()
    const currentMonth = newDate.getMonth() + 1
    var allTokenReserveDepositedValues = []
    var allTokenReserveBorrowedValues = []
    var tempYearlyValueHashMap = new Map<string, any>()
    var tempAllValueChartData = cloneDeep(valueBaseChartData)
    var tempYearlyDepositedAmountHashMap = new Map<string, any>()
    var tempYearlyBorrowedAmountHashMap = new Map<string, any>()
    var tempAllDepositedAmountChartData = getDepositedAmountBaseChart(gradientOffset)
    var tempAllBorrowedAmountChartData = getBorrowedAmountBaseChart(gradientOffset)
    var allLabels: string[] = []

    //Define token configs to loop over dynamically
    const depositedTokens =
    [
      { historyMap: TokenReserveUSDSDepositedHistoryHashMap, tokenId: tokenIds.usdsTokenId, allData: [] as any[] },
      { historyMap: TokenReserveUSDCDepositedHistoryHashMap, tokenId: tokenIds.usdcTokenId, allData: [] as any[] },
      { historyMap: TokenReserveSOLDepositedHistoryHashMap,  tokenId: tokenIds.solTokenId,  allData: [] as any[] },
      { historyMap: TokenReserveWEthDepositedHistoryHashMap, tokenId: tokenIds.wethTokenId, allData: [] as any[] },
      { historyMap: TokenReserveWBtcDepositedHistoryHashMap, tokenId: tokenIds.wbtcTokenId, allData: [] as any[] }
    ]

    const borrowedTokens =
    [
      { historyMap: TokenReserveUSDSBorrowedHistoryHashMap, tokenId: tokenIds.usdsTokenId, allData: [] as any[] },
      { historyMap: TokenReserveUSDCBorrowedHistoryHashMap, tokenId: tokenIds.usdcTokenId, allData: [] as any[] },
      { historyMap: TokenReserveSOLBorrowedHistoryHashMap,  tokenId: tokenIds.solTokenId,  allData: [] as any[] },
      { historyMap: TokenReserveWEthBorrowedHistoryHashMap, tokenId: tokenIds.wethTokenId, allData: [] as any[] },
      { historyMap: TokenReserveWBtcBorrowedHistoryHashMap, tokenId: tokenIds.wbtcTokenId, allData: [] as any[] }
    ]

    for(var year = startYear; year <= currentYear; year++)
    {
      var yearlyLabels: string[] = []
      var yearlyTokenReserveDepositedValues = []
      var yearlyTokenReserveBorrowedValues = []
      var yearlyTokenReserveValueChartData = cloneDeep(valueBaseChartData)
      var yearlyTokenReserveDepositedAmountChartData = cloneDeep(getDepositedAmountBaseChart(gradientOffset))
      var yearlyTokenReserveBorrowedAmountChartData = cloneDeep(getBorrowedAmountBaseChart(gradientOffset))

      //Track yearly arrays for each token index
      var yearlyDepositedAmountDataLists: any[][] = depositedTokens.map(() => [])
      var yearlyBorrowedAmountDataLists: any[][] = borrowedTokens.map(() => [])
      const maxMonth = (year == currentYear) ? currentMonth : 12

      for(var month = 1; month <= maxMonth; month++)
      {
        const monthKey = month.toString() + '-' + year.toString()
        const monthName = monthList[month - 1].monthName
        yearlyLabels.push(monthName)

        const isCurrentOrPrevMonth = (year == currentYear && (month == currentMonth || month == currentMonth - 1))

        var labelAddedToAll = false

        const tokenReserveDepositedValue = TokenReserveDepositedValueHistoryHashMap.get(month.toString() + '-' + year.toString())
        if(tokenReserveDepositedValue != undefined)
        {
          if(!labelAddedToAll)
          {
            allLabels.push(monthName + ' ' + year.toString())
            labelAddedToAll = true
          }
          allTokenReserveDepositedValues.push(tokenReserveDepositedValue)
          yearlyTokenReserveDepositedValues.push(tokenReserveDepositedValue)
        }
        else
        {
          if(year == currentYear && (month == currentMonth || month == currentMonth-1))
          {
            if(!labelAddedToAll)
            {
              allLabels.push(monthName + ' ' + year.toString())
              labelAddedToAll = true
            }
            allTokenReserveDepositedValues.push(props.depositedValue)
            yearlyTokenReserveDepositedValues.push(props.depositedValue)
          }
          else
            yearlyTokenReserveDepositedValues.push(0)
        }

        const tokenReserveBorrowedValue = TokenReserveBorrowedValueHistoryHashMap.get(month.toString() + '-' + year.toString())
        if(tokenReserveBorrowedValue != undefined)
        {
          allTokenReserveBorrowedValues.push(tokenReserveBorrowedValue)
          yearlyTokenReserveBorrowedValues.push(tokenReserveBorrowedValue)
        }
        else
        {
          if(year == currentYear && (month == currentMonth || month == currentMonth-1))
          {
            allTokenReserveBorrowedValues.push(props.borrowedValue)
            yearlyTokenReserveBorrowedValues.push(props.borrowedValue)
          }
          else
            yearlyTokenReserveBorrowedValues.push(0)
        }

        depositedTokens.forEach((token, index) =>
        {
          const monthlyValue = token.historyMap.get(monthKey)

          if(monthlyValue != undefined)
          {
            token.allData.push(monthlyValue)
            yearlyDepositedAmountDataLists[index].push(monthlyValue)
          }
          else if(isCurrentOrPrevMonth)
          {
            const val = props.depositedAmountHistoryHashMap.get(token.tokenId)
            
            token.allData.push(val)
            yearlyDepositedAmountDataLists[index].push(val)
          }
          else
            yearlyDepositedAmountDataLists[index].push(0)
        })

        borrowedTokens.forEach((token, index) =>
        {
          const monthlyValue = token.historyMap.get(monthKey)

          if(monthlyValue != undefined)
          {
            token.allData.push(monthlyValue)
            yearlyBorrowedAmountDataLists[index].push(monthlyValue)
          }
          else if(isCurrentOrPrevMonth)
          {
            const val = props.borrowedAmountHistoryHashMap.get(token.tokenId)
            
            token.allData.push(val)
            yearlyBorrowedAmountDataLists[index].push(val)
          }
          else
            yearlyBorrowedAmountDataLists[index].push(0)
        })
      }

      //Assign Value data for the year
      yearlyTokenReserveValueChartData.labels = yearlyLabels
      yearlyTokenReserveValueChartData.datasets[0].data = yearlyTokenReserveDepositedValues
      yearlyTokenReserveValueChartData.datasets[1].data = yearlyTokenReserveBorrowedValues
      tempYearlyValueHashMap.set(year.toString(), yearlyTokenReserveValueChartData)

      //Assign DepositedAmount data for the year
      yearlyTokenReserveDepositedAmountChartData.labels = yearlyLabels
      depositedTokens.forEach((_, i) =>
      {
        if(yearlyTokenReserveDepositedAmountChartData.datasets[i])
          yearlyTokenReserveDepositedAmountChartData.datasets[i].data = yearlyDepositedAmountDataLists[i]
      })
      tempYearlyDepositedAmountHashMap.set(year.toString(), yearlyTokenReserveDepositedAmountChartData)

      //Assign BorrowedAmount data for the year
      yearlyTokenReserveBorrowedAmountChartData.labels = yearlyLabels
      borrowedTokens.forEach((_, i) =>
      {
        if(yearlyTokenReserveBorrowedAmountChartData.datasets[i])
          yearlyTokenReserveBorrowedAmountChartData.datasets[i].data = yearlyBorrowedAmountDataLists[i]
      })
      tempYearlyBorrowedAmountHashMap.set(year.toString(), yearlyTokenReserveBorrowedAmountChartData)
    }

    //Set Value "All" data
    tempAllValueChartData.labels = allLabels
    tempAllValueChartData.datasets[0].data = allTokenReserveDepositedValues
    tempAllValueChartData.datasets[1].data = allTokenReserveBorrowedValues

    //Set Deposited Amount "All" data
    tempAllDepositedAmountChartData.labels = allLabels
    depositedTokens.forEach((token, i) =>
    {
      if(tempAllDepositedAmountChartData.datasets[i])
        tempAllDepositedAmountChartData.datasets[i].data = token.allData
    })

    //Set Borrowed Amount "All" data
    tempAllBorrowedAmountChartData.labels = allLabels
    borrowedTokens.forEach((token, i) =>
    {
      if(tempAllBorrowedAmountChartData.datasets[i])
        tempAllBorrowedAmountChartData.datasets[i].data = token.allData
    })

    tempYearlyValueHashMap.set("All", tempAllValueChartData)
    tempYearlyDepositedAmountHashMap.set("All", tempAllDepositedAmountChartData)
    tempYearlyBorrowedAmountHashMap.set("All", tempAllBorrowedAmountChartData)
    valueChartDataHashMap = tempYearlyValueHashMap
    depositedAmountChartDataHashMap = tempYearlyDepositedAmountHashMap
    borrowedAmountChartDataHashMap = tempYearlyBorrowedAmountHashMap
  }
</script>