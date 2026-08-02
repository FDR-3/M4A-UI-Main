<template>
  <div class="smallMarginTop">
    <div class="">

      
      <br>


      <div class="nMediumMarginTop vYearAndActionContainer">
        <Select
        class="chartSelect smallMarginBottom"
        v-model="chartSelect" 
        :options="lendingProtocolHistoryOptions" 
        optionLabel="historyOption" 
        optionValue="historyOption" 
        placeholder="Select Year"
        @change="updateChartData()">
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

    <div class="card">
      <Chart type="line" ref="chartRef" :data="chartData" :options="chartOptions" class="h-30rem"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { IonButton, IonLabel, IonPopover, IonText } from '@ionic/vue'
  import Select from 'primevue/select'
  import Chart from 'primevue/chart'
  import { lendingUserAvailableStableCoinYearsBySubMarketHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { copyTokenMintAddressText } from '/src/assets/contracts/WalletHelper.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { anchorPrograms, monthList } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { lendingProtocolHistoryOptions, TVLHistoryHashMap } from './TVLHistory'
  import cloneDeep from 'lodash/cloneDeep'
  
  const props = defineProps(['currentTVL'])

  var chartData = ref()
  var chartOptions = ref()
  var chartRef = ref<any>(null)
  var legenHiddenArray = ref([false, false, false])
  var chartTextColor = ref(darkTheme.value ? "#ffffff" : "#000000")
  var animationIntervalId: any
  var chartSelect = ref("All")
  var chartDataHashMap = new Map<string, any>()

  var gradientOffset = ref(0)
 
  const allBaseChartData =
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
          return setRainbowLineAnimatedGradient(ctx, chartArea)
        },
        borderWidth: 4,
        fill: false,
        tension: 0.4,
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
        label: 'TVL',
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
      }
    ]
  }

  onMounted(() =>
  {
    setChartData()
    chartData.value = chartDataHashMap.get(chartSelect.value)
    chartOptions.value = setChartOptions()
    startGradientAnimation()
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

  watch(() => [props.currentTVL], (() => 
  {
    setChartData()
  }))

  function startGradientAnimation()
  {
    stopGradientAnimation()

    animationIntervalId = setInterval(() =>
    { 
      //Increment the offset slightly.
      gradientOffset.value += 0.07
      
      //Ensure the offset wraps around (e.g., from 1.0 back to 0.0)
      if(gradientOffset.value >= 1)
        gradientOffset.value = 0

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

  function setRainbowLineAnimatedGradient(ctx: any, chartArea:any)
  {
    if(!chartArea)
      return

    const width = chartArea.right - chartArea.left
    const offset = gradientOffset.value
    //Shift goes from 0 to the width of the chart
    const shift = offset * width

    //Create a gradient that is exactly twice as wide as the chart, and slide it left
    const gradient = ctx.createLinearGradient(
      chartArea.left - shift, 0, 
      chartArea.left - shift + (width * 2), 0
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
    return{
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
        //Fixes the hover popup truncation
        tooltip:
        {
          callbacks:
          {
            label: function(context: any)
            {
              let label = context.dataset.label || ''
              if(label == "TVL")
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
    var allTVLs = []

    for(var year=Number(lendingProtocolHistoryOptions[1].historyOption); year<=currentYear; year++)
    {
      var yearlyLabels = []
      var yearlyTVLs = []
    
      var tempYearlyChartData = cloneDeep(yearlyBaseChartData)
      
      //If current year, go up until the current month, otherwise cover the whole year
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
          if(year == currentYear && month == currentMonth)
            if(props.currentTVL)
            {
              allLabels.push(monthList[month-1].monthName + ' ' + year.toString())
              allTVLs.push(props.currentTVL)
              yearlyTVLs.push(props.currentTVL)
            }
            else
              yearlyTVLs.push(0)
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

  function updateChartData()
  {
    chartData.value = chartDataHashMap.get(chartSelect.value)
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

  .animatedPoopX
  {
    background: repeating-linear-gradient(90deg, #851717 0%, #0f8332 25%, #851717 50.0%);
    background-size: 150% auto;
    animation: xAnimation 1.8s linear infinite
  }

  .animatedPoopY
  {
    background: repeating-linear-gradient(0deg, #851717 0%, #0f8332 25%, #851717 50.0%);
    background-size: auto 200%;
    animation: yAnimation 1.8s linear infinite
  }

  .animatedPurpleBlueY
  {
    background: repeating-linear-gradient(0deg, #8a2be2 0%, #557fcc 25%, #8a2be2 50.0%);
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