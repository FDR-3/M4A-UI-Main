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
              v-if="dataset.label=='Overall Value'" 
              class="swatch animatedRainbowX">
            </div>
            <div 
              v-else-if="dataset.label=='Total Deposit Value'" 
              class="swatch animatedDepositValueX">
            </div>
            <div 
              v-else-if="dataset.label=='Total Borrow Value'" 
              class="swatch animatedBorrowValueX">
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

    <div>
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
  import { lendingProtocolHistoryOptions, TVLHistoryHashMap } from './TVLHistory'
  import { sleep } from '/src/assets/helperFunctions/sleep.ts'
  import { setChartOptions,
    toggleDataset,
    setRainbowLineAnimatedGradient,
    setDepositLineAnimatedGradient,
    setBorrowLineAnimatedGradient } from './ChartHelper'
  import cloneDeep from 'lodash/cloneDeep'
  import './Chart.css'

  const props = defineProps(['userTotalValueChartDataHashMap', 'previousMonthDataMissing'])

  var chartData: any
  var chartOptions = ref()
  var chartRef = ref<any>(null)
  var legenHiddenArray = ref([false])
  var chartTextColor = ref(darkTheme.value ? "#ffffff" : "#000000")
  var animationIntervalId: any
  var chartSelect = ref("All")
  var chartDataHashMap = new Map<string, any>()
  var chartWidth = ref(0)

  var gradientOffset = ref(0)

  onMounted(async() =>
  {
    chartDataHashMap = props.userTotalValueChartDataHashMap
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

  /*watch(() => [props.userTotalValueChartDataHashMap], (async() => 
  {
    chartDataHashMap = props.userTotalValueChartDataHashMap
    chartData = chartDataHashMap.get(chartSelect.value)

    if(chartData?.datasets?.[0] && chartData.datasets[0].data.length > 0)
    {
      const lastIndex = chartData.datasets[0].data.length - 1
      if(props.previousMonthDataMissing && chartData.datasets[0].data[lastIndex - 1] !== undefined)
        chartData.datasets[0].data[lastIndex - 1] = chartData.datasets[0].data[lastIndex]
    }
  }))*/

  async function switchChartData()
  {
    chartOptions.value.responsive = false
    chartDataHashMap = props.userTotalValueChartDataHashMap
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
</script>