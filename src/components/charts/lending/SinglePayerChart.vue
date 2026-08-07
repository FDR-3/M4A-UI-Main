<template>
  <div class="smallMarginTop">
    <div class="">
      <br>
      <div class="nMediumMarginTop flexCenterColumn">
        <Select
        class="chartSelect smallMarginBottom"
        v-model="chartSelect" 
        :options="lendingProtocolHistoryOptions" 
        optionLabel="historyOption" 
        optionValue="historyOption" 
        placeholder="Select Year"
        @change="switchChartData()">
        </Select>
      </div>
    </div>

    <div class="">
      <div class="flexCenterColumn">
        <div class="chartLegend">
          <div 
          v-for="(dataset, index) in chartData?.datasets" 
          :key="index" 
          class="legendItem"
          @click="toggleDataset(index, chartRef)"
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
  import { lendingProtocolHistoryOptions } from './TVLHistory'
  import { SinglePayerPayoutHistoryHashMap, SinglePayer7DayProjectionHistoryHashMap } from './SinglePayerHistory'
  import { sleep } from '/src/assets/helperFunctions/sleep.ts'
  import cloneDeep from 'lodash/cloneDeep'

  const props = defineProps(['currentPayoutAmount', 'current7DayProjection'])

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
 
  const allBaseChartData =
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
          return setRainbowLineAnimatedGradient(ctx, chartArea)
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
          return setRainbowBarAnimatedGradient(ctx, chartArea)
        },
        maxBarThickness: 44,
        data: [] as any[]
      }
    ]
  }

  const yearlyBaseChartData =
  {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets:
    [
      {
        type: 'line',
        label: 'Available For Payouts',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setRainbowLineAnimatedGradient(ctx, chartArea)
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
          return setRainbowBarAnimatedGradient(ctx, chartArea)
        },
        maxBarThickness: 44,
        data: [] as any[]
      }
    ]
  }

  onMounted(async() =>
  {
    setChartData()
    chartOptions.value = setChartOptions()
    chartData = chartDataHashMap.get(chartSelect.value)

    await updateChartWidth() 
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

    chartOptions.value = setChartOptions()
  })

  watch(() => [props.currentPayoutAmount, props.current7DayProjection], (async() => 
  {
    if(chartData?.datasets?.[0])
      chartData.datasets[0].data[chartData.datasets[0].data.length-1] = props.currentPayoutAmount.replace(/,/g, '')
    if(chartData?.datasets?.[1])
      chartData.datasets[1].data[chartData.datasets[1].data.length-1] = props.current7DayProjection.replace(/,/g, '')
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
  
  function updateChartWidth() 
  {
    if(chartContainer.value) 
    {
      const currentWidth = chartContainer.value.clientWidth

      if (currentWidth > 0) 
        chartWidth.value = currentWidth
    }
  }

  async function showToggleAnimation()
  {
    await sleep(100)
    chartRef.value.chart.hide(0)
    chartRef.value.chart.show(0)
    chartRef.value.chart.update()
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

  function setRainbowLineAnimatedGradient(ctx: any, chartArea:any)
  {
    if(!chartArea)
      return

    const width = chartArea.right - chartArea.left
    const offset = gradientOffset.value
    const shift = offset * width

    const gradient = ctx.createLinearGradient(
      chartArea.left - shift, 0, 
      chartArea.left - shift + (width * 2), 0
    )

    gradient.addColorStop(0.000, '#14ffe9')
    gradient.addColorStop(0.166, '#ffc800')
    gradient.addColorStop(0.333, '#ff00e0')
    gradient.addColorStop(0.500, '#14ffe9')
    gradient.addColorStop(0.666, '#ffc800')
    gradient.addColorStop(0.833, '#ff00e0')
    gradient.addColorStop(1.000, '#14ffe9')

    return gradient
  }

  function setRainbowBarAnimatedGradient(ctx: any, chartArea:any)
  {
    if(!chartArea)
      return

    const height = chartArea.bottom - chartArea.top
    const offset = gradientOffset.value
    //Shift goes from 0 to the height of the chart
    const shift = offset * height

    //Create a gradient twice as tall as the chart, and slide it up
    const gradient = ctx.createLinearGradient(
      0, chartArea.top - shift, 
      0, chartArea.top - shift + (height * 2)
    )

    //Two full cycles of the rainbow
    gradient.addColorStop(0.000, '#14ffe9')
    gradient.addColorStop(0.166, '#ffc800')
    gradient.addColorStop(0.333, '#ff00e0')
    gradient.addColorStop(0.500, '#14ffe9')
    gradient.addColorStop(0.666, '#ffc800')
    gradient.addColorStop(0.833, '#ff00e0')
    gradient.addColorStop(1.000, '#14ffe9')

    return gradient
  }

  function setChartOptions()
  {
    return {
      responsive: false,
      maintainAspectRatio: false,
      aspectRatio: 0.7,
      transitions:
      {
        hide:
        {
          animation:
          {
            duration: 0
          }
        }
      },
      plugins:
      {
        legend:
        {
          display: false
        },
        tooltip:
        {
          callbacks:
          {
            label: function(context: any)
            {
              let label = context.dataset.label || ''
              if(label == "Available For Payouts" || label == "7 Day Rate")
                label += ': $'
              else if(label)
                label += ': '

              if(context.parsed.y !== null)
              {
                const value = context.parsed.y
                label += value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 9 })
              }
              return label;
            }
          }
        }
      },
      scales:
      {
        x:
        {
          ticks:
          {
            color: chartTextColor.value
          },
          grid:
          {
            color: chartTextColor.value
          }
        },
        y:
        {
          ticks:
          {
            color: chartTextColor.value,
            callback: function(value: any)
            {
              return '$' + Number(value).toLocaleString('en-US', {
                minimumFractionDigits: 0, 
                maximumFractionDigits: 2
              })
            }
          },
          grid:
          {
            color: chartTextColor.value
          }
        }
      }
    }
  }

  function toggleDataset(index: number, chartInstance: any)
  {
    if(!chartInstance)
      return

    const chart = chartInstance.chart
    if(chart)
    {
      if(chart.isDatasetVisible(index))
      {
        legenHiddenArray.value[index] = true
        chart.hide(index)
      }
      else
      {
        legenHiddenArray.value[index] = false
        chart.show(index)
        chart.update()
      }
    }
  }

  function setChartData()
  {
    const newDate = new Date()
    const currentYear = newDate.getFullYear()
    const currentMonth = newDate.getMonth() + 1
    var tempYearlyHashMap = new Map<string, any>()
    var tempAllChartData = cloneDeep(allBaseChartData)
    var allLabels = []
    var allSinglePayerAmounts = []
    var allSinglePayer7DayProjections = []

    for(var year=Number(lendingProtocolHistoryOptions[1].historyOption); year<=currentYear; year++)
    {
      var yearlyLabels = []
      var yearlySinglePayerAmounts = []
      var yearlySinglePayer7DayProjections = []

      var tempYearlyChartData = cloneDeep(yearlyBaseChartData)

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
    chartDataHashMap = tempYearlyHashMap
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