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
  import { TokenReserveUSDSHistoryHashMap,
    TokenReserveUSDCHistoryHashMap,
    TokenReserveSOLHistoryHashMap,
    TokenReserveWEthHistoryHashMap,
    TokenReserveWBtcHistoryHashMap } from './TokenReserveHistory'
  import { sleep } from '/src/assets/helperFunctions/sleep.ts'
  import { tokenIds } from '/src/assets/constants/Addresses.ts'
  import cloneDeep from 'lodash/cloneDeep'

  const props = defineProps(['tokenReserveHistoryMap'])

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
        label: 'USDS',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setUSDSLineAnimatedGradient(ctx, chartArea)
        },
        borderWidth: 4,
        fill: false,
        tension: 0.4,
        data: [] as any[]
      },
      {
        type: 'line',
        label: 'USDC',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setUSDCLineAnimatedGradient(ctx, chartArea)
        },
        borderWidth: 4,
        fill: false,
        tension: 0.4,
        data: [] as any[]
      },
      {
        type: 'line',
        label: 'SOL',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setSOLLineAnimatedGradient(ctx, chartArea)
        },
        borderWidth: 4,
        fill: false,
        tension: 0.4,
        data: [] as any[]
      },
      {
        type: 'line',
        label: 'WEth',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setWEthLineAnimatedGradient(ctx, chartArea)
        },
        borderWidth: 4,
        fill: false,
        tension: 0.4,
        data: [] as any[]
      },
      {
        type: 'line',
        label: 'WBtc',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setWBtcLineAnimatedGradient(ctx, chartArea)
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
    chartOptions.value = setChartOptions()
    chartData = chartDataHashMap.get(chartSelect.value)

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

    chartOptions.value = setChartOptions()
  })

  watch(() => [props.tokenReserveHistoryMap], (async() => 
  {
    setChartData() //Updating chart hash map so that the last value is already valid for when the user switches

    ////chartData = chartDataHashMap.get(chartSelect.value) //Setting the whole chart can cause it to re-render every time the price changes in some cases. Specifically seems like right after watching a video in full screen on the website and then looking at the Treasury, or atleast that's what I did, lol.
    const tokenDatasetMap =
    [
      tokenIds.usdsTokenId, // Index 0: USDS
      tokenIds.usdcTokenId, // Index 1: USDC
      tokenIds.solTokenId,  // Index 2: SOL
      tokenIds.wethTokenId, // Index 3: WEth
      tokenIds.wbtcTokenId  // Index 4: WBtc
    ]

    tokenDatasetMap.forEach((tokenId, index) =>
    {
      chartData.datasets[index].data[chartData.datasets[index].data.length - 1] = props.tokenReserveHistoryMap.get(tokenId).replace(/,/g, '')
    })
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

  function setUSDSLineAnimatedGradient(ctx: any, chartArea:any)
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

    //Two full cycles of the USDS colors
    gradient.addColorStop(0.00, '#ff6d6d')
    gradient.addColorStop(0.25, '#ffd232')
    gradient.addColorStop(0.50, '#ff6d6d')
    gradient.addColorStop(0.75, '#ffd232')
    gradient.addColorStop(1.00, '#ff6d6d')

    return gradient
  }

  function setUSDCLineAnimatedGradient(ctx: any, chartArea:any)
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

    //Two full cycles of the USDC colors
    gradient.addColorStop(0.00, '#3e73c4')
    gradient.addColorStop(0.20, '#3e73c4')
    gradient.addColorStop(0.25, '#fff')
    gradient.addColorStop(0.30, '#3e73c4')
    gradient.addColorStop(0.70, '#3e73c4')
    gradient.addColorStop(0.75, '#fff')
    gradient.addColorStop(0.80, '#3e73c4')
    gradient.addColorStop(1.00, '#3e73c4')

    return gradient
  }

  function setSOLLineAnimatedGradient(ctx: any, chartArea:any)
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

    //Two full cycles of the SOL colors
    gradient.addColorStop(0.00, '#cf41e8')
    gradient.addColorStop(0.25, '#10f2b0')
    gradient.addColorStop(0.50, '#cf41e8')
    gradient.addColorStop(0.75, '#10f2b0')
    gradient.addColorStop(1.00, '#cf41e8')

    return gradient
  }

  function setWEthLineAnimatedGradient(ctx: any, chartArea:any)
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

    //Two full cycles of the WEth colors
    gradient.addColorStop(0.00, '#627eea')
    gradient.addColorStop(0.20, '#627eea')
    gradient.addColorStop(0.25, '#fff')
    gradient.addColorStop(0.30, '#627eea')
    gradient.addColorStop(0.70, '#627eea')
    gradient.addColorStop(0.75, '#fff')
    gradient.addColorStop(0.80, '#627eea')
    gradient.addColorStop(1.00, '#627eea')

    return gradient
  }

  function setWBtcLineAnimatedGradient(ctx: any, chartArea:any)
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

    //Two full cycles of the WBtc colors
    gradient.addColorStop(0.00, '#f09242')
    gradient.addColorStop(0.25, '#282138')
    gradient.addColorStop(0.50, '#f09242')
    gradient.addColorStop(0.75, '#282138')
    gradient.addColorStop(1.00, '#f09242')

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

              if(context.parsed.y !== null)
              {
                const value = context.parsed.y
                label += ": " + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 9 })
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
              return Number(value).toLocaleString('en-US', {
                minimumFractionDigits: 0, 
                maximumFractionDigits: 9
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
    var tempAllChartData = cloneDeep(baseChartData)

    //Define token configs to loop over dynamically
    const tokens =
    [
      { historyMap: TokenReserveUSDSHistoryHashMap, tokenId: tokenIds.usdsTokenId, allData: [] as any[] },
      { historyMap: TokenReserveUSDCHistoryHashMap, tokenId: tokenIds.usdcTokenId, allData: [] as any[] },
      { historyMap: TokenReserveSOLHistoryHashMap,  tokenId: tokenIds.solTokenId,  allData: [] as any[] },
      { historyMap: TokenReserveWEthHistoryHashMap, tokenId: tokenIds.wethTokenId, allData: [] as any[] },
      { historyMap: TokenReserveWBtcHistoryHashMap, tokenId: tokenIds.wbtcTokenId, allData: [] as any[] }
    ]

    var allLabels: string[] = []
    const startYear = Number(lendingProtocolHistoryOptions[1].historyOption)

    for(var year = startYear; year <= currentYear; year++)
    {
      var yearlyLabels: string[] = []
      var tempYearlyChartData = cloneDeep(baseChartData)
      
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

        tokens.forEach((token, index) =>
        {
          const monthlyValue = token.historyMap.get(monthKey)

          if (monthlyValue != undefined)
          {
            if (!labelAddedToAll)
            {
              allLabels.push(monthName + ' ' + year.toString())
              labelAddedToAll = true
            }
            token.allData.push(monthlyValue)
            yearlyDataLists[index].push(monthlyValue)
          }
          else if (isCurrentOrPrevMonth)
          {
            if (!labelAddedToAll)
            {
              allLabels.push(monthName + ' ' + year.toString())
              labelAddedToAll = true
            }
            const rawPropVal = props.tokenReserveHistoryMap.get(token.tokenId)
            const val = rawPropVal ? rawPropVal.replace(/,/g, '') : 0
            
            token.allData.push(val)
            yearlyDataLists[index].push(val)
          }
          else
          {
            yearlyDataLists[index].push(0)
          }
        })
      }

      //Assign dataset data for the year
      tempYearlyChartData.labels = yearlyLabels
      tokens.forEach((_, i) =>
      {
        if (tempYearlyChartData.datasets[i])
        {
          tempYearlyChartData.datasets[i].data = yearlyDataLists[i]
        }
      })
      
      tempYearlyHashMap.set(year.toString(), tempYearlyChartData)
    }

    // Assign aggregated "All" data
    tempAllChartData.labels = allLabels
    tokens.forEach((token, i) =>
    {
      if (tempAllChartData.datasets[i])
      {
        tempAllChartData.datasets[i].data = token.allData
      }
    })

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

  .animatedUSDSX
  {
    background: repeating-linear-gradient(90deg, #ff6d6d 0%, #ffd232 16%, #ffd232 33%, #ff6d6d 50.0%);
    background-size: 150% auto;
    animation: xAnimation 1.8s linear infinite
  }

  .animatedUSDCX
  {
    background: repeating-linear-gradient(90deg, #3e73c4 0%, #fff 16%, #3e73c4 33%, #3e73c4 50.0%);
    background-size: 150% auto;
    animation: xAnimation 1.8s linear infinite
  }

  .animatedSOLX
  {
    background: repeating-linear-gradient(90deg, #10f2b0 0%, #cf41e8 16%, #cf41e8 23%, #10f2b0 50.0%);
    background-size: 150% auto;
    animation: xAnimation 1.8s linear infinite
  }

  .animatedWEthX
  {
    background: repeating-linear-gradient(90deg, #627eea 0%, #fff 16%, #627eea 33%, #627eea 50.0%);
    background-size: 150% auto;
    animation: xAnimation 1.8s linear infinite
  }

  .animatedWBtcX
  {
    background: repeating-linear-gradient(90deg, #f09242 0%, #282138 16%, #282138 23%, #f09242 50.0%);
    background-size: 150% auto;
    animation: xAnimation 1.8s linear infinite
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