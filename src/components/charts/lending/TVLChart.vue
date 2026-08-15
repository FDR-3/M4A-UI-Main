<template>
  <div class="smallMarginTop">
    <div>
      <br>
      <div class="nMediumMarginTop">
        <Select
        class="chartSelect smallMarginBottom"
        v-model="chartSelect" 
        :options="lendingProtocolHistoryOptions" 
        optionLabel="historyOption" 
        optionValue="historyOption" 
        placeholder="Select Year"
        appendTo="self"
        @change="switchChartData()">
        </Select>
      </div>
    </div>

    <div>
      <div class="flexCenterColumn">
        <div class="chartLegend">
          <div 
          v-for="(dataset, index) in chartData?.datasets" 
          :key="index" 
          class="legendItem"
          @click="toggleDataset(index, chartRef, legenHiddenArray)"
          >
            <div 
              v-if="dataset.label=='TVL'" 
              class="swatch animatedRainbowX">
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
      <Chart type="line" ref="chartRef" :width="chartWidth" :data="chartData" :options="chartOptions"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { IonLabel } from '@ionic/vue'
  import Select from 'primevue/select'
  import Chart from 'primevue/chart'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { monthList } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { lendingProtocolHistoryOptions, TVLHistoryHashMap } from './TVLHistory'
  import { sleep } from '/src/assets/helperFunctions/sleep.ts'
  import { setChartOptions,
    toggleDataset,
    setRainbowLineAnimatedGradient } from './ChartHelper'
  import cloneDeep from 'lodash/cloneDeep'
  import './Chart.css'

  const props = defineProps(['currentTVL'])

  var chartData: any
  var chartOptions = ref()
  var chartRef = ref<any>(null)
  var legenHiddenArray = ref([false])
  var chartTextColor = ref(darkTheme.value ? "#ffffff" : "#000000")
  var animationIntervalId: any
  var chartSelect = ref("All")
  var chartDataHashMap = new Map<string, any>()
  var chartContainer = ref<any>(null)
  var chartWidth = ref(0)

  var gradientOffset = ref(0)
 
  const baseChartData =
  {
    labels: [],
    datasets:
    [
      {
        type: 'line',
        label: 'TVL',
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
      }
    ]
  }

  onMounted(async() =>
  {
    setChartData()
    chartOptions.value = setChartOptions(true, chartTextColor.value, true)
    chartData = chartDataHashMap.get(chartSelect.value)

    startGradientAnimation()
    await showToggleAnimation()
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

    chartOptions.value = setChartOptions(true, chartTextColor.value, true)
  })

  watch(() => [props.currentTVL], (async() => 
  {
    setChartData() //Updating chart hash map so that the last value is already valid for when the user switches

    //chartData = chartDataHashMap.get(chartSelect.value) //Setting the whole chart can cause it to re-render every time the price changes in some cases. Specifically seems like right after watching a video in full screen on the website and then looking at the Treasury, or atleast that's what I did, lol.
    if(chartData?.datasets?.[0])
      chartData.datasets[0].data[chartData.datasets[0].data.length-1] = props.currentTVL.replace(/,/g, '')
  }))

  async function switchChartData()
  {
    chartOptions.value.responsive = false
    chartData = chartDataHashMap.get(chartSelect.value)
    resetHiddenArray()
  
    await sleep(40)
    chartOptions.value.responsive = true
  }

  function resetHiddenArray()
  {
    for(var i=0; i<legenHiddenArray.value.length; i++)
      legenHiddenArray.value[i] = false
  }

  async function showToggleAnimation()
  {
    await sleep(100)

    const chart = chartRef.value?.chart
    if(!chart) return

    //1. Hide the dataset and force an INSTANT update (no animation)
    chart.hide(0)
    chart.update('none')

    //2. Wait exactly two browser frames. This guarantees the browser 
    //actually paints the "empty" chart to the screen before moving on.
    requestAnimationFrame(() => 
    {
      requestAnimationFrame(() => 
      {
        //3. Now that the browser knows it is hidden, trigger the show animation
        chart.show(0)
        chart.update() 
      })
    })
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
    var allTVLs = []

    for(var year=Number(lendingProtocolHistoryOptions[1].historyOption); year<=currentYear; year++)
    {
      var yearlyLabels = []
      var yearlyTVLs = []

      var tempYearlyChartData = cloneDeep(baseChartData)
      
      const maxMonth = (year == currentYear) ? currentMonth : 12

      for(var month=1; month<=maxMonth; month++)
      {
        yearlyLabels.push(monthList[month-1].monthName)

        const tvlMonthlyStatementValue = TVLHistoryHashMap.get(month.toString() + '-' + year.toString())

        if(tvlMonthlyStatementValue != undefined)
        {
          allLabels.push(monthList[month-1].monthName + ' ' + year.toString())
          allTVLs.push(tvlMonthlyStatementValue)
          yearlyTVLs.push(tvlMonthlyStatementValue)
        }
        else
        {
          if(year == currentYear && (month == currentMonth || month == currentMonth-1))
          {
            allLabels.push(monthList[month-1].monthName + ' ' + year.toString())
            allTVLs.push(props.currentTVL.replace(/,/g, ''))
            yearlyTVLs.push(props.currentTVL.replace(/,/g, ''))
          }
          else
            yearlyTVLs.push(0)
        }
      }

      tempYearlyChartData.labels = yearlyLabels
      tempYearlyChartData.datasets[0].data = yearlyTVLs
      tempYearlyHashMap.set(year.toString(), tempYearlyChartData)
    }

    tempAllChartData.labels = allLabels
    tempAllChartData.datasets[0].data = allTVLs
    tempYearlyHashMap.set("All", tempAllChartData)
    chartDataHashMap = tempYearlyHashMap
  }
</script>