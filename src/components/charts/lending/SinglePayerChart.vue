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

        <ion-button class="smallMarginLeft" fill="clear" @click="showValues=!showValues">
          <ion-label v-if="showValues" color="dark">Toggle Amounts</ion-label>
          <ion-label v-else color="dark">Toggle Values</ion-label>
        </ion-button>
      </div>
    </div>

    <div>
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

    <div ref="chartContainer">
      <Chart v-if="showValues" type="line" ref="chartRef" :width="chartWidth" :data="valueChartData" :options="chartOptions"/>
      <Chart v-else type="bar" ref="chartRef" :width="chartWidth" :data="amountChartData" :options="chartOptions"/>
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
  import { SinglePayerPayoutHistoryHashMap, SinglePayer7DayProjectionHistoryHashMap } from './SinglePayerHistory'
  import { sleep } from '/src/assets/helperFunctions/sleep.ts'
  import { tokenIds, tokenIdArray } from '/src/assets/constants/Addresses.ts'
  import { setChartOptions,
    toggleDataset,
    setRainbowLineAnimatedGradient,
    setRainbowBarAnimatedGradient } from '/src/components/charts/lending/ChartHelper.ts'
  import cloneDeep from 'lodash/cloneDeep'

  const props = defineProps(['currentPayoutAmount', 'current7DayProjection', 'amountHistoryHashMap'])

  var valueChartData: any
  var amountChartData: any
  var chartOptions = ref()
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
 
  const baseChartData =
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
    chartOptions.value = setChartOptions(false, chartTextColor.value, true)
    valueChartData = valueChartDataHashMap.get(chartSelect.value)
    amountChartData = amountChartDataHashMap.get(chartSelect.value)

    updateChartWidth() 
    startGradientAnimation()
    await sleep(100)
    chartOptions.value.responsive = true
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

    chartOptions.value = setChartOptions(false, chartTextColor.value, true)
  })

  watch(() => [props.currentPayoutAmount, props.current7DayProjection], (async() => 
  {
    setChartData() //Updating chart hash map so that the last value is already valid for when the user switches

    //valueChartData = valueChartDataHashMap.get(chartSelect.value) //Setting the whole chart can cause it to re-render every time the price changes in some cases. Specifically seems like right after watching a video in full screen on the website and then looking at the Treasury, or atleast that's what I did, lol.
    if(valueChartData?.datasets?.[0])
      valueChartData.datasets[0].data[valueChartData.datasets[0].data.length-1] = props.currentPayoutAmount.replace(/,/g, '')
    if(valueChartData?.datasets?.[1])
      valueChartData.datasets[1].data[valueChartData.datasets[1].data.length-1] = props.current7DayProjection.replace(/,/g, '')
  }))

  watch(() => props.amountHistoryHashMap, (async() => 
  {
    setChartData() //Updating chart hash map so that the last value is already valid for when the user switches

    tokenIdArray.forEach((tokenId: number, index: number) =>
    {
      amountChartData.datasets[index].data[amountChartData.datasets[index].data.length - 1] = props.amountHistoryHashMap.get(tokenId).replace(/,/g, '')
    })
  }))

  async function switchChartData()
  {
    chartOptions.value.responsive = false
    valueChartData = valueChartDataHashMap.get(chartSelect.value)
    resetHiddenArray()
  
    await sleep(40)
    chartOptions.value.responsive = true
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
    const currentYear = newDate.getFullYear()
    const currentMonth = newDate.getMonth() + 1
    var tempYearlyHashMap = new Map<string, any>()
    var tempAllChartData = cloneDeep(baseChartData)
    var allLabels = []
    var allSinglePayerAmounts = []
    var allSinglePayer7DayProjections = []

    for(var year=Number(lendingProtocolHistoryOptions[1].historyOption); year<=currentYear; year++)
    {
      var yearlyLabels = []
      var yearlySinglePayerAmounts = []
      var yearlySinglePayer7DayProjections = []

      var tempYearlyChartData = cloneDeep(baseChartData)

      const maxMonth = (year == currentYear) ? currentMonth : 12

      for(var month=1; month<=maxMonth; month++)
      {
        yearlyLabels.push(monthList[month-1].monthName)

        const singlePayerAmountMonthlyValue = SinglePayerPayoutHistoryHashMap.get(month.toString() + '-' + year.toString())
        const singlePayerProjectionMonthlyValue = SinglePayer7DayProjectionHistoryHashMap.get(month.toString() + '-' + year.toString())

        if(singlePayerAmountMonthlyValue != undefined)
        {
          allLabels.push(monthList[month-1].monthName + ' ' + year.toString())
          allSinglePayerAmounts.push(singlePayerAmountMonthlyValue)
          yearlySinglePayerAmounts.push(singlePayerAmountMonthlyValue)
        }
        else
        {
          if(year == currentYear && (month == currentMonth || month == currentMonth-1))
          {
            allLabels.push(monthList[month-1].monthName + ' ' + year.toString())
            allSinglePayerAmounts.push(props.currentPayoutAmount.replace(/,/g, ''))
            yearlySinglePayerAmounts.push(props.currentPayoutAmount.replace(/,/g, ''))
          }
          else
            yearlySinglePayerAmounts.push(0)
        }

        if(singlePayerProjectionMonthlyValue != undefined)
        {
          allSinglePayer7DayProjections.push(singlePayerProjectionMonthlyValue)
          yearlySinglePayer7DayProjections.push(singlePayerProjectionMonthlyValue)
        }
        else
        {
          if(year == currentYear && (month == currentMonth || month == currentMonth-1))
          {
            allSinglePayer7DayProjections.push(props.current7DayProjection.replace(/,/g, ''))
            yearlySinglePayer7DayProjections.push(props.current7DayProjection.replace(/,/g, ''))
          }
          else
            yearlySinglePayer7DayProjections.push(0)
        }
      }

      tempYearlyChartData.labels = yearlyLabels
      tempYearlyChartData.datasets[0].data = yearlySinglePayerAmounts
      tempYearlyChartData.datasets[1].data = yearlySinglePayer7DayProjections
      tempYearlyHashMap.set(year.toString(), tempYearlyChartData)
    }

    tempAllChartData.labels = allLabels
    tempAllChartData.datasets[0].data = allSinglePayerAmounts
    tempAllChartData.datasets[1].data = allSinglePayer7DayProjections
    tempYearlyHashMap.set("All", tempAllChartData)
    valueChartDataHashMap = tempYearlyHashMap
  }
</script>

<style scoped>
  ion-button
  {
    --padding-top: 0;
    --padding-bottom: 0;
    --padding-start: 0;
    --padding-end: 0
  }

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

  .chartLegend
  {
    display: flex;
    justify-content: center;
    gap: 10px
  }
  
  .chartSelect
  {
    width: 130px;
    padding-left: 20px
  }

  .legendItem
  {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px
  }

  .swatch
  {
    width: 27px; /* Standard swatch width */
    height: 12px; /* Standard swatch height */
    margin-right: 8px;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center
  }

  .animatedRainbowX
  {
    background: repeating-linear-gradient(90deg, #14ffe9 0%, #ffc800 16%, #ff00e0 33%, #14ffe9 50.0%);
    background-size: 150% auto;
    animation: xAnimation 1.8s linear infinite
  }

  .animatedRainbowY
  {
    background: repeating-linear-gradient(0deg, #14ffe9 0%, #ffc800 16%, #ff00e0 33%, #14ffe9 50.0%);
    background-size: auto 200%;
    animation: yAnimation 1.8s linear infinite
  }

  @keyframes xAnimation
  {
    to
    {
      background-position: 150% center
    }
  }

  @keyframes yAnimation
  {
    to
    {
      background-position: center 200%
    }
  }

  .hiddenLabel
  {
    text-decoration: line-through
  }
</style>