<template>
  <div class="smallMarginTop">
    <div class="flexCenterRow hChartLayout" style="justify-content:space-around !important">
      <div>
        <h4 class="underLine" >7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">0.15</span> A Week</h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">0.15</span> A Week</h5>
      </div>

      <div class="flexCenterColumn">
        <div class="flexCenterRow">
          <ion-button fill="clear" @click="openTokenPopover($event)">
            <img v-if="tokenMintAddress==tokenAddressStringsMainNet.solTokenMintAddress" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48" style="width: 60px; height: 35px; ; max-height: 40px; margin-right: -7px"/>
            <component v-else :is="tokenSVG"style="width: 44px; height: 35px; max-height: 40px"></component>
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
              <ion-label color="light">{{ copyTokenMintAddressButtonText }}</ion-label>
            </ion-button>
          </ion-popover>
        </div>

        
        <div class="nSmallMarginTop smallMarginBottom">
          <div class="showTrimmedAddress"><ion-text >SubMarket Owner: {{ subMarketOwnerAddressTrimmed }}</ion-text><br></div>
          <div class="showNonTrimmedAddress"><ion-text>SubMarket Owner: {{ subMarketOwnerAddress }}</ion-text><br></div>
          <ion-text>SubMarket Index: {{ subMarketIndex }}</ion-text><br>
          <ion-text>Fee on Interest Earned: {{ subMarketFee }}%</ion-text>
        </div>

        <ion-label class="smallMarginBottom">Balance: <span class="rainbowText">{{ userBalance }}</span> Value: $<span class="rainbowText"> {{ balanceValue }} </span></ion-label>
 
        <ion-label >Last Action: {{ activityDescriptions[chartData?.lastActionType] + ' ' + chartData?.lastActionAmount + ' ' + tokenName}}
          <br>{{ convertUnixTimeToLocalDate(chartData?.lastActionTimeStamp) + ' ' + convertUnixTimeToLocalTime(chartData?.lastActionTimeStamp)}}
        </ion-label>

        <div class="flexCenterRow">
          <Select
          class="yearSelect"
          style="margin: 10px"
          v-model="yearSelect" 
          :options="yearList" 
          optionLabel="yearAvailable" 
          optionValue="yearAvailable" 
          placeholder="Select Year"
          @change="$emit('changeYear', tokenMintAddress, subMarketOwnerAddress, subMarketIndex, yearSelect)">
          </Select>
          <ion-button v-if="ownerAddress==connectedWallet.addressString" fill="clear" @click="openActionsPopover"><ion-label color="dark">Actions</ion-label></ion-button>
          <ion-popover
          :is-open="actionsPopoverOpen" 
          :event="event" 
          @didDismiss="actionsPopoverOpen=false"
          side="top" 
          alignment="center"
          >
            <ion-button class="copyAddressButton" fill="clear" @click="$emit('openDepositModal', tokenMintAddress); actionsPopoverOpen=false">
              <ion-label color="dark">Deposit</ion-label>
            </ion-button>
            <ion-button class="copyAddressButton" fill="clear" @click="$emit('openWithdrawalModal', tokenMintAddress); actionsPopoverOpen=false">
              <ion-label color="dark">Withdraw</ion-label>
            </ion-button>
          </ion-popover>
        </div>
      </div>

      <div>
        <h4 class="underLine">Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">15.00</span></h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">15.00</span></h5>
      </div>   
    </div>

    <div class="vChartLayout">
      <ion-button fill="clear" @click="openTokenPopover($event)">
        <img v-if="tokenMintAddress==tokenAddressStringsMainNet.solTokenMintAddress"src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48" style="width: 60px; height: 35px; ; max-height: 40px; margin-right: -7px"/>
        <component v-else :is="tokenSVG" style="width: 44px; height: 35px; max-height: 40px"></component>
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
          <ion-label color="light">{{ copyTokenMintAddressButtonText }}</ion-label>
        </ion-button>
      </ion-popover><br>

      <ion-text >SubMarket Owner: {{ subMarketOwnerAddressTrimmed }}</ion-text><br>
      <ion-text>SubMarket Index: {{ subMarketIndex }}</ion-text><br>
      <ion-text>Fee on Interest Earned: {{ subMarketFee }}%</ion-text><br>

      <br><ion-label>Balance: <span class="rainbowText">{{ userBalance }}</span> Value: $<span class="rainbowText"> {{ balanceValue }} </span></ion-label>

      <div class="mediumSmallMarginTop">
        <ion-label>Last Action: <br>{{ activityDescriptions[chartData?.lastActionType] + ' ' + chartData?.lastActionAmount + ' ' + tokenName}}
          <br>{{ convertUnixTimeToLocalTime(chartData?.lastActionTimeStamp) }}<br>{{ convertUnixTimeToLocalDate(chartData?.lastActionTimeStamp) }}
        </ion-label>
      </div>
      
      <div class="nSmallMarginTop">
        <h4 class="underLine">Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">10.00</span></h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">10.00</span></h5>
      </div>  

      <div class="nMediumMarginTop" style="margin-bottom: -2px">
        <h4 class="underLine">7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">0.11</span> A Week</h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">0.11</span> A Week</h5>
      </div>

      <div class="nMediumMarginTop">
        <Select
          class="yearSelect smallMarginBottom"
          v-model="yearSelect" 
          :options="yearList" 
          optionLabel="yearAvailable" 
          optionValue="yearAvailable" 
          placeholder="Select Year"
          @change="$emit('changeYear', tokenMintAddress, subMarketOwnerAddress, subMarketIndex, yearSelect)">
          </Select>
          <ion-button v-if="ownerAddress==connectedWallet.addressString" fill="clear" @click="openActionsPopover"><ion-label color="dark">Actions</ion-label></ion-button>
          <ion-popover
          :is-open="actionsPopoverOpen" 
          :event="event" 
          @didDismiss="actionsPopoverOpen=false"
          side="top" 
          alignment="center"
          >
            <ion-button class="copyAddressButton" fill="clear" @click="$emit('openDepositModal', tokenMintAddress); actionsPopoverOpen=false">
              <ion-label color="dark">Deposit</ion-label>
            </ion-button>
            <ion-button class="copyAddressButton" fill="clear" @click="$emit('openWithdrawalModal', tokenMintAddress); actionsPopoverOpen=false">
              <ion-label color="dark">Withdraw</ion-label>
            </ion-button>
          </ion-popover>
      </div>
    </div>

    <div class="normalChartLegend">
      <div class="flexCenterColumn">
        <div class="chartLegend">
          <div 
          v-for="(dataset, index) in chartData?.datasets" 
          :key="index" 
          class="legendItem"
          @click="toggleDataset(index, chartRef)"
          >
            <div class="swatchWrapper">
              <div 
                v-if="dataset.label=='Balance'" 
                class="swatch animatedRainbow">
              </div>
              <div 
                v-else-if="dataset.label=='Interest Earned'" 
                class="swatch rainbowBackGround">
              </div>
              <div 
                v-else-if="dataset.label=='Debt'" 
                class="swatch animatedPoop">
              </div>
              <div 
                v-else-if="dataset.label=='Interest Accrued'" 
                class="swatch poopBackGround">
              </div>
              <div 
                v-else 
                class="swatch" 
                :style="{ backgroundColor: dataset.backgroundColor }"
              ></div>
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

    <div class="midChartLegend">
      <!--Render First 4 Legend Items-->
      <div class="flexCenterRow" style="gap: 10px">
        <div 
        v-for="(dataset, index) in chartData?.datasets.slice(0, 4)" 
        :key="index" 
        class="legendItem"
        @click="toggleDataset(index, chartRef)"
        >
          <div class="swatchWrapper">
            <div 
              v-if="dataset.label=='Balance'" 
              class="swatch animatedRainbow">
            </div>
            <div 
              v-else-if="dataset.label=='Interest Earned'" 
              class="swatch rainbowBackGround">
            </div>
            <div 
              v-else-if="dataset.label=='Debt'" 
              class="swatch animatedPoop">
            </div>
            <div 
              v-else-if="dataset.label=='Interest Accrued'" 
              class="swatch poopBackGround">
            </div>
            <div 
              v-else 
              class="swatch" 
              :style="{ backgroundColor: dataset.backgroundColor }">
            </div>
          </div>
          <span 
            class="legendLabel" 
            :class="{'hiddenLabel': legenHiddenArray[index] }"
          >
            <ion-label color="dark" style="margin-left: -6px; letter-spacing: -1px">{{ dataset.label }}</ion-label>
        </span>
        </div>
      </div>
      <!--Render Remaining Legend Items, Skipping First 4-->
      <div class="flexCenterRow tinyMarginTop" style="gap: 10px">
        <div 
        v-for="(dataset, index) in chartData?.datasets.slice(4)" 
        :key="index + 4" 
        class="legendItem"
        @click="toggleDataset(index+4, chartRef)"
        >
          <div class="swatchWrapper">
            <div 
              v-if="dataset.label=='Balance'" 
              class="swatch animatedRainbow">
            </div>
            <div 
              v-else-if="dataset.label=='Interest Earned'" 
              class="swatch rainbowBackGround">
            </div>
            <div 
              v-else-if="dataset.label=='Debt'" 
              class="swatch animatedPoop">
            </div>
            <div 
              v-else-if="dataset.label=='Interest Accrued'" 
              class="swatch poopBackGround">
            </div>
            <div 
              v-else 
              class="swatch" 
              :style="{ backgroundColor: dataset.backgroundColor }">
            </div>
          </div>
          <span 
            class="legendLabel" 
            :class="{'hiddenLabel': legenHiddenArray[index+4] }"
          >
            <ion-label color="dark" style="margin-left: -6px; letter-spacing: -1px">{{ dataset.label }}</ion-label>
          </span>
          <br v-if="index==2"> 
        </div>
      </div>
    </div>

    <div class="card">
      <Chart type="line" ref="chartRef" :data="chartData" :options="chartOptions" class="h-30rem"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
  import { IonButton, IonLabel, IonPopover, IonText } from '@ionic/vue'
  import Select from 'primevue/select'
  import Chart from 'primevue/chart'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { lendingUserAvailableStableCoinYearsBySubMarketHashMap, lendingUserAvailableCryptoCurrencyYearsBySubMarketHashMap, lendingUserTabAccountsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { copyTokenMintAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { tokenAddressStringsMainNet, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { tokenReserveDevNetMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { convertUnixTimeToLocalDate, convertUnixTimeToLocalTime } from '/src/assets/helperFunctions/UnixTimeStampHelper.ts'

  const props = defineProps(['isStableCoin', 'tokenMintAddress', 'subMarketOwnerAddress', 'subMarketOwnerAddressTrimmed', 'subMarketIndex', 'ownerAddress', 'accountIndex', 'subMarketFee', 'chartData', 'selectedYear'])

  var chartOptions = ref()
  var chartRef = ref<any>(null)
  var legenHiddenArray = ref([false, false, false])
  var chartTextColor = ref(darkTheme.value ? "#ffffff" : "#000000")
  var intervalId: any

  var tokenPopoverOpen = ref(false)
  var actionsPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")

  var tokenName = ref()
  var tokenSVG = ref()

  var yearSelect = ref()
  var yearList = ref()

  var userBalance = ref()
  var balanceValue = computed ( () =>
  {
    const price = priceObjectMap.data[props.tokenMintAddress].usdPrice
    if(price)
      return (userBalance.value * Number(price)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })        
    else
      return (0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })   
  })

  var activityDescriptions =
  [
    "Deposited",
    "Withdrew",
    "Borrowed",
    "Repaid"
  ]

  onMounted(() =>
  {
    if(lendingUserTabAccountsHashMap.map && props.tokenMintAddress && (props.accountIndex != undefined))
    {
      const tokenInfo = tokenReserveDevNetMap.get(props.tokenMintAddress)
      tokenName.value = tokenInfo.name
      tokenSVG.value = tokenInfo.svg

      const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(props.tokenMintAddress +
      props.subMarketOwnerAddress +
      props.subMarketIndex.toString() +
      props.ownerAddress +
      props.accountIndex.toString())

      userBalance.value = Number(lendingUserTabAccount.depositedAmount / Math.pow(10, tokenInfo.decimalAmount))//Convert from fixed point notation to decimal

      yearList.value = getYearList()
    }

    yearSelect.value = props.selectedYear

    chartOptions.value = setChartOptions()
    startGradientAnimation()
  })

  onUnmounted(() =>
  {
    stopGradientAnimation()
  })

  watch(lendingUserTabAccountsHashMap,() =>
  {
    const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(props.tokenMintAddress +
    props.subMarketOwnerAddress +
    props.subMarketIndex.toString() +
    props.ownerAddress +
    props.accountIndex.toString())

    const decimalAmount = tokenDecimalHashMap.get(props.tokenMintAddress)
    userBalance.value = Number(lendingUserTabAccount.depositedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal

    yearList.value = getYearList()
    yearSelect.value = props.selectedYear
  })

  watch(darkTheme,() =>
  {
    if(darkTheme.value)
      chartTextColor.value = "#ffffff"
    else
      chartTextColor.value = "#000000"

    chartOptions.value = setChartOptions()
  })

  watch(() => [props.ownerAddress, props.accountIndex], (() => 
  {
    const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(props.tokenMintAddress +
    props.subMarketOwnerAddress +
    props.subMarketIndex.toString() +
    props.ownerAddress +
    props.accountIndex.toString())

    const decimalAmount = tokenDecimalHashMap.get(props.tokenMintAddress)
    userBalance.value = Number(lendingUserTabAccount.depositedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal

    yearList.value = getYearList()
    yearSelect.value = yearList.value[yearList.value.length - 1].yearAvailable
  }))

  function getYearList()
  {
    const newDate = new Date()
    const currentYear = newDate.getFullYear()

    var initialList
    if(props.isStableCoin)
      initialList = lendingUserAvailableStableCoinYearsBySubMarketHashMap.map.get(props.tokenMintAddress +
      props.subMarketOwnerAddress +
      props.subMarketIndex +
      props.ownerAddress +
      props.accountIndex.toString())
    else
      initialList = lendingUserAvailableCryptoCurrencyYearsBySubMarketHashMap.map.get(props.tokenMintAddress +
      props.subMarketOwnerAddress +
      props.subMarketIndex +
      props.ownerAddress +
      props.accountIndex.toString())

    var firstYear = undefined
    var processedList = []

    if(initialList)
      var firstYear = initialList[0].yearAvailable

    if(firstYear)
      for(var year=firstYear; year<=currentYear; year++)
      {
        const availableYearObject =
        {
          yearAvailable: year
        }

        processedList.push(availableYearObject)
      }

    return processedList
  }

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

    if(chartRef.value.chart)
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

  function openActionsPopover(e: Event) 
  {
    event.value = e
    actionsPopoverOpen.value = true
  }

  function passByRefWrapperCopyAddress()
  {
    copyTokenMintAddress(copyTokenMintAddressButtonText, props.tokenMintAddress)
  }
</script>

<style scoped>
  h4
  {
    font-size: min(4.5vw, 26px)
  }

  h5
  {
    font-size: min(4vw, 25px)
  }
  
  .yearSelect
  {
    width: 125px;
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

  .animatedRainbow
  {
    background: repeating-linear-gradient(90deg, #14ffe9 0%, #ffc800 16%, #ff00e0 33%, #14ffe9 50.0%);
    background-size: 150% auto;
    animation: rainbowXAnimation 1.8s linear infinite
  }

  .rainbowBackGround
  {
    background: repeating-linear-gradient(0deg, #14ffe9 0%, #ffc800 16%, #ff00e0 33%, #14ffe9 50.0%);
    background-size: auto 200%;
    animation: rainbowYAnimation 1.8s linear infinite
  }

  .animatedPoop
  {
    background: repeating-linear-gradient(90deg, #851717 0%, #0f8332 25%, #851717 50.0%);
    background-size: 150% auto;
    animation: rainbowXAnimation 1.8s linear infinite
  }

  .poopBackGround
  {
    background: repeating-linear-gradient(0deg, #851717 0%, #0f8332 25%, #851717 50.0%);
    background-size: auto 200%;
    animation: rainbowYAnimation 1.8s linear infinite
  }

  @keyframes rainbowXAnimation
  {
    to
    {
      background-position: 150% center
    }
  }

  @keyframes rainbowYAnimation
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

  
  @media screen and (min-width: 1450.1px)
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

  @media screen and (max-width: 1450px)
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

  @media screen and (min-width: 1160.1px)
  {  
    .normalChartLegend
    {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .midChartLegend
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
  @media screen and (min-width: 620.1px) and (max-width: 1160px)
  { 
    .normalChartLegend
    {
      display: none
    }
    .midChartLegend
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
  @media screen and (max-width: 620.1px)
  { 
    .normalChartLegend
    {
      display: flex;
      flex-direction: column
    }
    .midChartLegend
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
</style>