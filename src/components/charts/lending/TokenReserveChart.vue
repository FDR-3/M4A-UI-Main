<template>
  <div class="smallMarginTop">
    <div class="">
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
  import { tokenIds, tokenIdArray } from '/src/assets/constants/Addresses.ts'
  import { getAmountBaseChart,
    setChartOptions,
    toggleDataset,
    setRainbowLineAnimatedGradient,
    setRainbowBarAnimatedGradient,
    setUSDSLineAnimatedGradient,
    setUSDCLineAnimatedGradient,
    setSOLLineAnimatedGradient,
    setWEthLineAnimatedGradient,
    setWBtcLineAnimatedGradient } from './ChartHelper'
  import cloneDeep from 'lodash/cloneDeep'
  import './Chart.css'

  const props = defineProps(['amountHistoryHashMap'])

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
 
  onMounted(async() =>
  {
    setChartData()
    chartOptions.value = setChartOptions(false, chartTextColor.value)
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

    chartOptions.value = setChartOptions(false, chartTextColor.value)
  })

  watch(() => [props.amountHistoryHashMap], (async() => 
  {
    setChartData() //Updating chart hash map so that the last value is already valid for when the user switches

    ////chartData = chartDataHashMap.get(chartSelect.value) //Setting the whole chart can cause it to re-render every time the price changes in some cases. Specifically seems like right after watching a video in full screen on the website and then looking at the Treasury, or atleast that's what I did, lol.

    tokenIdArray.forEach((tokenId: number, index: number) =>
    {
      chartData.datasets[index].data[chartData.datasets[index].data.length - 1] = props.amountHistoryHashMap.get(tokenId)
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

  function setChartData()
  {
    const newDate = new Date()
    const startYear = Number(lendingProtocolHistoryOptions[1].historyOption)
    const currentYear = newDate.getFullYear()
    const currentMonth = newDate.getMonth() + 1
    var tempYearlyHashMap = new Map<string, any>()
    var tempAllChartData = cloneDeep(getAmountBaseChart(gradientOffset))
    var allLabels: string[] = []

    //Define token configs to loop over dynamically
    const tokens =
    [
      { historyMap: TokenReserveUSDSHistoryHashMap, tokenId: tokenIds.usdsTokenId, allData: [] as any[] },
      { historyMap: TokenReserveUSDCHistoryHashMap, tokenId: tokenIds.usdcTokenId, allData: [] as any[] },
      { historyMap: TokenReserveSOLHistoryHashMap,  tokenId: tokenIds.solTokenId,  allData: [] as any[] },
      { historyMap: TokenReserveWEthHistoryHashMap, tokenId: tokenIds.wethTokenId, allData: [] as any[] },
      { historyMap: TokenReserveWBtcHistoryHashMap, tokenId: tokenIds.wbtcTokenId, allData: [] as any[] }
    ]

    for(var year = startYear; year <= currentYear; year++)
    {
      var yearlyLabels: string[] = []
      var tempYearlyChartData = cloneDeep(getAmountBaseChart(gradientOffset))

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

          if(monthlyValue != undefined)
          {
            if (!labelAddedToAll)
            {
              allLabels.push(monthName + ' ' + year.toString())
              labelAddedToAll = true
            }
            token.allData.push(monthlyValue)
            yearlyDataLists[index].push(monthlyValue)
          }
          else if(isCurrentOrPrevMonth)
          {
            if(!labelAddedToAll)
            {
              allLabels.push(monthName + ' ' + year.toString())
              labelAddedToAll = true
            }
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

    //Assign aggregated "All" data
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