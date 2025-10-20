<template>
  <div class="smallMarginTop">
    <div class="flexCenterRow hChartLayout" style="justify-content:space-around !important">
      <div>
        <h4 class="underLine" >7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">0.15</span> A Week</h5>
        <h5 class="nMediumSmallMarginTop">Amount: <span class="rainbowText">0.15</span> A Week</h5>
      </div>
    
      <ion-button fill="clear" @click="openTokenPopover($event)">
        <img v-if="tokenMintAddress==tokenAddressStringsMainNet.solTokenMintAddress" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48" style="width: 60px; margin-right: -7px"/>
        <component v-else :is="tokenSVG" style="width: 44px; max-height: 40px"></component>
        <ion-text color="dark">{{ tokenName }}</ion-text>
      </ion-button>
      <ion-popover
      :is-open="tokenPopoverOpen" 
      :event="event" 
      @didDismiss="tokenPopoverOpen=false"
      side="top" 
      alignment="center"
      >
        <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyAddress()" @mouseleave="closeTokenPopover($event)">
          <ion-label color="dark">{{ copyTokenMintAddressButtonText }}</ion-label>
        </ion-button>
      </ion-popover>

      <div>
        <h4 class="underLine">Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">15.00</span></h5>
        <h5 class="nMediumSmallMarginTop">Amount: <span class="rainbowText">15.00</span></h5>
      </div>   
    </div>

    <div class="vChartLayout">
      <ion-button fill="clear" @click="openTokenPopover($event)">
        <img v-if="tokenMintAddress==tokenAddressStringsMainNet.solTokenMintAddress"src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48" style="width: 60px; margin-right: -7px"/>
        <component v-else :is="tokenSVG" style="width: 44px; max-height: 40px"></component>
        <ion-text color="dark">{{ tokenName }}</ion-text>
      </ion-button>
      <ion-popover
      :is-open="tokenPopoverOpen" 
      :event="event" 
      @didDismiss="tokenPopoverOpen=false"
      side="top" 
      alignment="center"
      >
        <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyAddress()" @mouseleave="closeTokenPopover($event)">
          <ion-label color="dark">{{ copyTokenMintAddressButtonText }}</ion-label>
        </ion-button>
      </ion-popover>

      <div class="nLargeMarginTop">
        <h4 class="underLine">Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">10.00</span></h5>
        <h5 class="nMediumSmallMarginTop">Amount: <span class="rainbowText">10.00</span></h5>
      </div>  

      <div class="nMediumMarginTop">
        <h4 class="underLine">7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">0.11</span> A Week</h5>
        <h5 class="nMediumSmallMarginTop">Amount: <span class="rainbowText">0.11</span> A Week</h5>
      </div>
    </div>

    <div class="chartLegend">
      <div 
      v-for="(dataset, index) in chartData?.datasets" 
      :key="index" 
      class="legend-item"
      @click="toggleDataset(index, chartRef)"
      >
        <div class="swatch-wrapper">
          <div 
            v-if="dataset.label === 'Balance'" 
            class="swatch animatedRainbow"
          ></div>
          <div 
            v-else 
            class="swatch solid-color" 
            :style="{ backgroundColor: dataset.backgroundColor }"
          ></div>
        </div>
        <span 
          class="legend-label" 
          :class="{ ' hiddenLabel': legenHiddenArray[index] }"
        >
          <ion-label color="dark">{{ dataset.label }}</ion-label>
        </span>
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
  import Chart from 'primevue/chart'
  import { copyTokenMintAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { tokenAddressStringsMainNet } from '/src/assets/constants/Addresses.ts'

  const props = defineProps(['tokenMintAddress', 'tokenSVG', 'tokenName', 'chartData'])

  var chartOptions = ref()
  var chartRef = ref<any>(null)
  var legenHiddenArray = ref([false, false, false])
  var chartTextColor = ref(darkTheme.value ? "#ffffff" : "#000000")
  var intervalId: any

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")

  onMounted(() =>
  {
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

  //1. Reactive value to shift the gradient position
  const gradientOffset = ref(0)

  function startGradientAnimation()
  {
    intervalId = setInterval(() => {
    //Increment the offset slightly.
    gradientOffset.value += 0.07
    
    //Ensure the offset wraps around (e.g., from 1.0 back to 0.0)
    if (gradientOffset.value >= 1)
      gradientOffset.value = 0

    if (chartRef.value.chart)
      chartRef.value.chart.update("none")
  
    }, 55)
  }

  function stopGradientAnimation()
  {
    if(intervalId != undefined)
    {
      clearInterval(intervalId)
      intervalId = undefined
    }
  }

  function setChartOptions()
  {
    
    return{
      maintainAspectRatio: false,
      aspectRatio: 0.7,
      transitions:
      {
        /*hide: //Only the show fade in animation is currently working for the custom rainbow line
        {
            animations:
            {
              borderWidth:
              {
                easing: 'linear',
                duration: 400,//Fade out speed
                from: 4, 
                to: 0, 
              }
            }
        },*/
        show:
        {
          animations:
          {
            // Animate the borderWidth back to the original value
            borderWidth:
            {
              easing: 'linear',
              duration: 400, //Fade in speed
              from: 0, 
              to: 4,
            }
          }
        },
      },
      plugins:
      {
        legend:
        {
          display: false
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
            color: chartTextColor.value
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
        if(index == 0)
          stopGradientAnimation()

        legenHiddenArray.value[index] = true
        chart.hide(index)
      }
      else
      {
        legenHiddenArray.value[index] = false
        chart.show(index)

        if(index == 0)
          setTimeout(() =>
          {
            if(legenHiddenArray.value[index] == false)//Incase user has already clicked the button again, don't start animation.
              startGradientAnimation()
          }, 400)
        else
          chart.update()
      }
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

  function passByRefWrapperCopyAddress()
  {
    copyTokenMintAddress(copyTokenMintAddressButtonText, props.tokenMintAddress)
  }
</script>

<style scoped>
  .legend-item
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

  .rainbowGradient
  {
    background: linear-gradient(to right, #14ffe9 0%, #ffc800 25%, #ff00e0 50%, #14ffe9 100%);
    background-size: 150% auto
  }

  .animatedRainbow
  {
    background: repeating-linear-gradient(90deg, #14ffe9 0%, #ffc800 16%, #ff00e0 33%, #14ffe9 50.0%);
    background-size: 150% auto;
    animation: rainbowAnimation 1.8s linear infinite
  }

  @keyframes rainbowAnimation
  {
    to
    {
      background-position: 150% center
    }
  }

  .hiddenLabel
  {
    text-decoration: line-through
  }

  @media screen and (min-width: 1285.1px)
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
  @media screen and (max-width: 1285px)
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

  @media screen and (min-width: 444.1px)
  { 
    .chartLegend
    {
      display: flex;
      justify-content: center;
      gap: 20px
    }
  }
  @media screen and (max-width: 444px)
  { 
    .chartLegend
    {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px
    }
  }

</style>