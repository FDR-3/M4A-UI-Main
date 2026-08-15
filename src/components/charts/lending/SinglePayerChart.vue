<template>
  <div class="smallMarginTop">
    <div class="">
      <br>
      <div class="nMediumMarginTop tinyMarginBottom flexCenterRow">
        <Select
        class="chartSelect "
        v-model="chartSelect" 
        :options="lendingProtocolHistoryOptions" 
        optionLabel="historyOption" 
        optionValue="historyOption" 
        placeholder="Select Year"
        appendTo="self"
        @change="switchChartData()">
        </Select>

        <ion-button class="toggleButton smallMarginLeft" fill="clear" @click="showValues=!showValues; resetHiddenArray()">
          <ion-label v-if="showValues" color="dark">Toggle Amounts</ion-label>
          <ion-label v-else color="dark">Toggle Values</ion-label>
        </ion-button>
      </div>
    </div>

    <div v-if="showValues">
      <div class="flexCenterColumn">
        <div class="chartLegend">
          <div 
          v-for="(dataset, index) in valueChartData?.datasets" 
          :key="index" 
          class="legendItem"
          @click="toggleDataset(index, chartRef, legenHiddenArray)"
          >
            <div 
              v-if="dataset.label=='Available For Payouts'" 
              class="swatch animatedRainbowX">
            </div>
            <div 
              v-else-if="dataset.label=='7 Day Rate'" 
              class="swatch animatedRainbowY">
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
          v-for="(dataset, index) in amountChartData?.datasets" 
          :key="index" 
          class="legendItem"
          @click="toggleDataset(index, chartRef, legenHiddenArray)"
          >
            <div 
              v-if="dataset.label=='USDS'" 
              class="swatch animatedUSDSX">
            </div>
            <div 
              v-else-if="dataset.label=='USDC'" 
              class="swatch animatedUSDCX">
            </div>
            <div 
              v-else-if="dataset.label=='SOL'" 
              class="swatch animatedSOLX">
            </div>
            <div 
              v-else-if="dataset.label=='WEth'" 
              class="swatch animatedWEthX">
            </div>
            <div 
              v-else-if="dataset.label=='WBtc'" 
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
      <Chart v-if="showValues" type="bar" ref="chartRef" :width="chartWidth" :data="valueChartData" :options="valueChartOptions"/>
      <Chart v-else type="line" ref="chartRef" :width="chartWidth" :data="amountChartData" :options="amountChartOptions"/>
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
  import { SinglePayerPayoutHistoryHashMap,
    SinglePayer7DayProjectionHistoryHashMap,
    SinglePayerUSDSHistoryHashMap,
    SinglePayerUSDCHistoryHashMap,
    SinglePayerSOLHistoryHashMap,
    SinglePayerWEthHistoryHashMap,
    SinglePayerWBtcHistoryHashMap } from './SinglePayerHistory'
  import { sleep } from '/src/assets/helperFunctions/sleep.ts'
  import { tokenIds, tokenIdArray } from '/src/assets/constants/Addresses.ts'
  import { getAmountBaseChart,
    setChartOptions,
    toggleDataset,
    setRainbowLineAnimatedGradient,
    setRainbowBarAnimatedGradient } from '/src/components/charts/lending/ChartHelper.ts'
  import cloneDeep from 'lodash/cloneDeep'
  import './Chart.css'

  const props = defineProps(['currentPayoutAmount', 'current7DayProjection', 'amountHistoryHashMap'])

  var valueChartData: any
  var amountChartData: any
  var valueChartOptions = ref()
  var amountChartOptions = ref()
  var chartRef = ref<any>(null)
  var legenHiddenArray = ref([false])
  var chartTextColor = ref(darkTheme.value ? "#ffffff" : "#000000")
  var animationIntervalId: any
  var chartSelect = ref("All")
  var valueChartDataHashMap = new Map<string, any>()
  var amountChartDataHashMap = new Map<string, any>()
  var chartContainer = ref<any>(null)
  var chartWidth = ref(0)
  var showValues = ref(true)

  var gradientOffset = ref(0)
 
  const valueBaseChartData =
  {
    labels: [],
    datasets:
    [
      {
        type: 'line',
        label: 'Available For Payouts',
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
        type: 'bar',
        label: '7 Day Rate',
        backgroundColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setRainbowBarAnimatedGradient(ctx, chartArea, gradientOffset.value)
        },
        maxBarThickness: 44,
        data: [] as any[]
      }
    ]
  }

  onMounted(async() =>
  {
    setChartData()
    valueChartOptions.value = setChartOptions(false, chartTextColor.value, true)
    amountChartOptions.value = setChartOptions(false, chartTextColor.value, false)
    valueChartData = valueChartDataHashMap.get(chartSelect.value)
    amountChartData = amountChartDataHashMap.get(chartSelect.value)

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

  watch(() => [props.currentPayoutAmount, props.current7DayProjection], (async() => 
  {
    setChartData() //Updating chart hash map so that the last value is already valid for when the user switches

    //valueChartData = valueChartDataHashMap.get(chartSelect.value) //Setting the whole chart can cause it to re-render every time the price changes in some cases. Specifically seems like right after watching a video in full screen on the website and then looking at the Treasury, or atleast that's what I did, lol.
    if(valueChartData?.datasets?.[0])
      valueChartData.datasets[0].data[valueChartData.datasets[0].data.length-1] = props.currentPayoutAmount
    if(valueChartData?.datasets?.[1])
      valueChartData.datasets[1].data[valueChartData.datasets[1].data.length-1] = props.current7DayProjection
  }))

  watch(() => props.amountHistoryHashMap, (async() => 
  {
    setChartData() //Updating chart hash map so that the last value is already valid for when the user switches

    tokenIdArray.forEach((tokenId: number, index: number) =>
    {
      amountChartData.datasets[index].data[amountChartData.datasets[index].data.length - 1] = props.amountHistoryHashMap.get(tokenId)
    })
  }))

  async function switchChartData()
  {
    valueChartOptions.value.responsive = false
    amountChartOptions.value.responsive = false
    amountChartData = amountChartDataHashMap.get(chartSelect.value)
    valueChartData = valueChartDataHashMap.get(chartSelect.value)

    resetHiddenArray()
  
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
    var allSinglePayerAvailableValues = []
    var allSinglePayer7DayProjections = []
    var tempYearlyValueHashMap = new Map<string, any>()
    var tempAllValueChartData = cloneDeep(valueBaseChartData)
    var tempYearlyAmountHashMap = new Map<string, any>()
    var tempAllAmountChartData = getAmountBaseChart(gradientOffset)
    var allLabels: string[] = []

    //Define token configs to loop over dynamically
    const tokens =
    [
      { historyMap: SinglePayerUSDSHistoryHashMap, tokenId: tokenIds.usdsTokenId, allData: [] as any[] },
      { historyMap: SinglePayerUSDCHistoryHashMap, tokenId: tokenIds.usdcTokenId, allData: [] as any[] },
      { historyMap: SinglePayerSOLHistoryHashMap,  tokenId: tokenIds.solTokenId,  allData: [] as any[] },
      { historyMap: SinglePayerWEthHistoryHashMap, tokenId: tokenIds.wethTokenId, allData: [] as any[] },
      { historyMap: SinglePayerWBtcHistoryHashMap, tokenId: tokenIds.wbtcTokenId, allData: [] as any[] }
    ]

    for(var year = startYear; year <= currentYear; year++)
    {
      var yearlyLabels: string[] = []
      var yearlySinglePayerAvailableValues = []
      var yearlySinglePayer7DayProjections = []
      var yearlySinglePayerValueChartData = cloneDeep(valueBaseChartData)
      var yearlySinglePayerAmountChartData = getAmountBaseChart(gradientOffset)
      
      //Track yearly arrays for each token index
      var yearlyDataLists: any[][] = tokens.map(() => [])
      const maxMonth = (year == currentYear) ? currentMonth : 12

      for(var month = 1; month <= maxMonth; month++)
      {
        const monthKey = month.toString() + '-' + year.toString()
        const monthName = monthList[month - 1].monthName
        yearlyLabels.push(monthName)

        const isCurrentOrPrevMonth = (year == currentYear && (month == currentMonth || month == currentMonth - 1))

        var labelAddedToAll = false

        const singlePayerAvailableValue = SinglePayerPayoutHistoryHashMap.get(month.toString() + '-' + year.toString())
        if(singlePayerAvailableValue != undefined)
        {
          if(!labelAddedToAll)
          {
            allLabels.push(monthName + ' ' + year.toString())
            labelAddedToAll = true
          }
          allSinglePayerAvailableValues.push(singlePayerAvailableValue)
          yearlySinglePayerAvailableValues.push(singlePayerAvailableValue)
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
            allSinglePayerAvailableValues.push(props.currentPayoutAmount)
            yearlySinglePayerAvailableValues.push(props.currentPayoutAmount)
          }
          else
            yearlySinglePayerAvailableValues.push(0)
        }

        const singlePayerProjectionMonthlyValue = SinglePayer7DayProjectionHistoryHashMap.get(month.toString() + '-' + year.toString())
        if(singlePayerProjectionMonthlyValue != undefined)
        {
          allSinglePayer7DayProjections.push(singlePayerProjectionMonthlyValue)
          yearlySinglePayer7DayProjections.push(singlePayerProjectionMonthlyValue)
        }
        else
        {
          if(year == currentYear && (month == currentMonth || month == currentMonth-1))
          {
            allSinglePayer7DayProjections.push(props.current7DayProjection)
            yearlySinglePayer7DayProjections.push(props.current7DayProjection)
          }
          else
            yearlySinglePayer7DayProjections.push(0)
        }

        tokens.forEach((token, index) =>
        {
          const monthlyValue = token.historyMap.get(monthKey)

          if(monthlyValue != undefined)
          {
            token.allData.push(monthlyValue)
            yearlyDataLists[index].push(monthlyValue)
          }
          else if(isCurrentOrPrevMonth)
          {
            const val = props.amountHistoryHashMap.get(token.tokenId)
            
            token.allData.push(val)
            yearlyDataLists[index].push(val)
          }
          else
          {
            yearlyDataLists[index].push(0)
          }
        })
      }

      //Assign Value data for the year
      yearlySinglePayerValueChartData.labels = yearlyLabels
      yearlySinglePayerValueChartData.datasets[0].data = yearlySinglePayerAvailableValues
      yearlySinglePayerValueChartData.datasets[1].data = yearlySinglePayer7DayProjections
      tempYearlyValueHashMap.set(year.toString(), yearlySinglePayerValueChartData)

      //Assign Amount data for the year
      yearlySinglePayerAmountChartData.labels = yearlyLabels
      tokens.forEach((_, i) =>
      {
        if(yearlySinglePayerAmountChartData.datasets[i])
          yearlySinglePayerAmountChartData.datasets[i].data = yearlyDataLists[i]
      })
      tempYearlyAmountHashMap.set(year.toString(), yearlySinglePayerAmountChartData)
    }

    //Set Value "All" data
    tempAllValueChartData.labels = allLabels
    tempAllValueChartData.datasets[0].data = allSinglePayerAvailableValues
    tempAllValueChartData.datasets[1].data = allSinglePayer7DayProjections

    //Set Amount "All" data
    tempAllAmountChartData.labels = allLabels
    tokens.forEach((token, i) =>
    {
      if(tempAllAmountChartData.datasets[i])
        tempAllAmountChartData.datasets[i].data = token.allData
    })

    tempYearlyValueHashMap.set("All", tempAllValueChartData)
    tempYearlyAmountHashMap.set("All", tempAllAmountChartData)
    valueChartDataHashMap = tempYearlyValueHashMap
    amountChartDataHashMap = tempYearlyAmountHashMap
  }
</script>