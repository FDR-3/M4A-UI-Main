<template>
  <div class="tableContainer">
    <h1 class="yellow displayLongName">{{ displayName }}</h1>
    <h1 class="yellow displayShortName">{{ possiblyTrimmedDisplayName }}</h1>

    <p v-if="searchAddress==SYSTEM_PROGRAM_ADDRESS_STRING">Connect Wallet or Search for a Different Public Key</p>

    <ion-input
    v-model="addressToCheck"
    placeholder="Check New Address"
    fill="outline"
    class="nSmallMarginTop"
    :class="{ 'invalid': !isValidPublicKey }"
    @ion-input="isValidPublicKey = isValidSolanaPublicKey(addressToCheck)"
    ></ion-input>

    <ion-button
    id="checkNewAddressButton"
    class="nTinyMarginBottom"
    @click="checkNewAddress()"
    color="green"
    :disabled="!isValidPublicKey"
    >
      Check New Address
    </ion-button>
  </div>

  <div class="thickBorder smallMarginTop">
    <div class="hHeaderDisplay thinBorderBottom" style="justify-content:space-around !important">
      <div>
        <h2 class="underLine">7 Day Projection Rate</h2>
        <h3 class="nMediumMarginTop">Value: $<span class="rainbowText">0.90</span> A Week</h3>
      </div>

      <ion-button color="dark" style="height: 20px; align-self: center" :disabled="true">Browse All Users</ion-button>

      <div>
        <h2 class="underLine">Life Time Interest Earned</h2>
        <h3 class="nMediumMarginTop">Value: $<span class="rainbowText">90.00</span></h3>
      </div>   
    </div>

    <div class="vHeaderDisplay thinBorderBottom" style="justify-content:space-around !important">
      <ion-button color="dark" class="mediumMarginTop" style="align-self: center" :disabled="true">Browse All Users</ion-button>

      <div>
        <h2 class="underLine">7 Day Projection Rate</h2>
        <h3 class="nMediumMarginTop">Value: $<span class="rainbowText">0.90</span> A Week</h3>
      </div>

      <div>
        <h2 class="underLine nSmallMarginTop">Life Time Interest Earned</h2>
        <h3 class="nMediumMarginTop">Value: $<span class="rainbowText">90.00</span></h3>
      </div>   
    </div>

    <!--Stable Coin Charts-->
    <div class="smallMarginTop hHeaderDisplay">
      <div>
        <h4 class="underLine" style="line-height: 27px">Stable Coin<br>7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">0.45</span> A Week</h5>
        <h5 class="nMediumSmallMarginTop">Amount: <span class="rainbowText">0.45</span> A Week</h5>
      </div>

      <div>
        <h4 class="underLine" style="line-height: 27px">Stable Coin<br>Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">45.00</span></h5>
        <h5 class="nMediumSmallMarginTop">Amount: <span class="rainbowText">45.00</span></h5>
      </div>  
    </div>

    <div class="smallMarginTop vHeaderDisplay">
      <div>
        <h4 class="underLine" style="line-height: 27px">Stable Coin<br>7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">0.45</span> A Week</h5>
        <h5 class="nMediumSmallMarginTop">Amount: <span class="rainbowText">0.45</span> A Week</h5>
      </div>

      <div style="margin-top: -25px">
        <h4 class="underLine" style="line-height: 27px">Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">45.00</span></h5>
        <h5 class="nMediumSmallMarginTop">Amount: <span class="rainbowText">45.00</span></h5>
      </div>  
    </div>

    <div class="mediumSmallMarginBottom">
      <div v-for="token in StableCoins"  >
        <PortfolioChart :tokenMintAddress="token.tokenMintAddressString" :tokenSVG="token.asset.svg" :tokenName="token.asset.name" :chartData="chartData"/>
      </div>
    </div>

    <!--Crypto Charts-->
    <div class="thinBorderTop largeMarginTop" >
      <div class="hHeaderDisplay smallMarginTop">
        <div>
          <h4 class="underLine" style="line-height: 27px">Crypto Currency<br>7 Day Projection Rate</h4>
          <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">0.45</span> A Week</h5>
        </div>

        <div>
          <h4 class="underLine" style="line-height: 27px">Crypto Currency<br>Life Time Interest Earned</h4>
          <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">45.00</span></h5>
        </div>
      </div>
    </div>

    <div class="mediumSmallMarginTop nSmallMarginBottom" >
      <div class="vHeaderDisplay smallMarginTop">
        <div>
          <h4 class="underLine" style="line-height: 27px">Crypto Currency<br>7 Day Projection Rate</h4>
          <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">0.45</span> A Week</h5>
        </div>

        <div style="margin-top: -27px">
          <h4 class="underLine" style="line-height: 27px">Life Time Interest Earned</h4>
          <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">45.00</span></h5>
        </div>
      </div>
    </div>

    <div v-for="token in CryptoCurrency">
      <PortfolioChart :tokenMintAddress="token.tokenMintAddressString" :tokenSVG="token.asset.svg" :tokenName="token.asset.name" :chartData="chartData"/>
    </div>
    
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
  import { IonInput, IonButton, IonLabel } from '@ionic/vue'
  import Chart from 'primevue/chart'
  import type { Chart as ChartJS } from 'chart.js'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { getUserDisplayName, getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { lendingerUserAvailableStatementYearsHashMap, lendingerUserAvailableTokenMintAddressesHashMap, lendingerUserMonthlyStatementsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
  import { trimAddress, isValidSolanaPublicKey } from '/src/assets/contracts/WalletHelper.vue'
  import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import PortfolioChart from '/src/components/charts/lending/PortfolioChart.vue'

  const emits = defineEmits(['checkNewAddress'])

  var displayName = ref()
  var possiblyTrimmedDisplayName = ref()
  var searchAddress = ref()
  var addressToCheck = ref()
  var isValidPublicKey = ref(false)

  var chartData = ref() 
  var chartOptions = ref()
  var chartRef = ref<any>(null)
  var legenHiddenArray = ref([false, false, false])
  var chartTextColor = ref(darkTheme.value ? "#ffffff" : "#000000")

  var intervalId: any

  onMounted(() =>
  {
    searchAddress.value = connectedWallet.addressString
    addressToCheck.value = searchAddress.value
    isValidPublicKey.value = isValidSolanaPublicKey(addressToCheck.value)

    if(connectedWallet.isChatAccountReady)
    {
      displayName.value = getUserDisplayName(searchAddress.value)
      possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(searchAddress.value)
    }
    else
    {
      displayName.value = searchAddress.value
      possiblyTrimmedDisplayName.value = trimAddress(searchAddress.value)
    }

    if(lendingerUserAvailableStatementYearsHashMap.map)
    {
      console.log(lendingerUserMonthlyStatementsHashMap.map)
      console.log(lendingerUserAvailableTokenMintAddressesHashMap.map)
      console.log(lendingerUserAvailableStatementYearsHashMap.map)
    }

    chartData.value = setChartData()
    startGradientAnimation()//This has to be called here and inside of the PortfolioChart.vue file for some reason
  })

  watch(connectedWallet, () =>
  {
    searchAddress.value = connectedWallet.addressString
    addressToCheck.value = searchAddress.value
    isValidPublicKey.value = isValidSolanaPublicKey(addressToCheck.value)

    if(connectedWallet.isChatAccountReady)
    {
      displayName.value = getUserDisplayName(searchAddress.value)
      possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(searchAddress.value)
    }
    else
    {
      displayName.value = searchAddress.value
      possiblyTrimmedDisplayName.value = trimAddress(searchAddress.value)
    }  
  })

  watch(lendingerUserMonthlyStatementsHashMap, () =>
  {
    console.log(lendingerUserAvailableTokenMintAddressesHashMap.map)
    console.log(lendingerUserAvailableStatementYearsHashMap.map)
    console.log(lendingerUserMonthlyStatementsHashMap.map)
  })

  function getGradient (ctx: any, chartArea:any)
  {
    if(!chartArea)
    return

    const offset = gradientOffset.value
    const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0)

    gradient.addColorStop((0 - offset + 1) % 1, '#14ffe9')
    gradient.addColorStop((0.10 - offset + 1) % 1, '#ffc800')
    gradient.addColorStop((0.50 - offset + 1) % 1, '#ff00e0')
    gradient.addColorStop((0.95 - offset + 1) % 1, '#14ffe9')

    /*gradient.addColorStop((0 - offset + 1) % 1, '#14ffe9')
    gradient.addColorStop((0.25 - offset + 1) % 1, '#ffc800')
    gradient.addColorStop((0.50 - offset + 1) % 1, '#ff00e0')
    gradient.addColorStop((0.75 - offset + 1) % 1, '#14ffe9')*/

    return gradient
  }

  function setChartData()
  {
    return {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets:
      [
        {
          type: 'line',
          label: 'Balance',
          borderColor: function(context: any)
          { 
            const chart = context.chart
            const { ctx, chartArea } = chart
            return getGradient(ctx, chartArea)
          },
          borderWidth: 4,
          fill: false,
          tension: 0.4,
          data: [0, 20, 40, 145, 120, 175, 160, 100, 120, 140, 160, 190]
        },
        {
          type: 'bar',
          label: 'Deposits',
          backgroundColor: "#39bd39",
          data: [5, 30, 25, 125, 5, 75, 35, 40, 40, 20, 20, 50]
        },
        {
          type: 'bar',
          label: 'Withdrawals',
          backgroundColor: "#b5bbca",
          data: [5, 10, 5, 20, 30, 20, 50, 100, 20, 0, 0, 0]
        }
      ]
    }   
  }

  const gradientOffset = ref(0)
  function startGradientAnimation()
  {
    intervalId = setInterval(() => {
    //Increment the offset slightly.
    gradientOffset.value += 0.07
    
    //Ensure the offset wraps around (e.g., from 1.0 back to 0.0)
    if (gradientOffset.value >= 1)
      gradientOffset.value = 0

    }, 55)
  }

  function checkNewAddress()
  {
    emits('checkNewAddress', addressToCheck.value)

    displayName.value = getUserDisplayName(addressToCheck.value)
    possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(addressToCheck.value)

    searchAddress.value = addressToCheck.value

    addressToCheck.value = ""
  }
</script>

<style scoped>
  .custom-chart-legend
  {
    display: flex;
    justify-content: center;
    gap: 20px
  }

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

  ion-input
  {
    --highlight-color: var(--ion-color-green)
  }

  @media screen and (min-width: 1311.1px)
  { 
    .displayLongName
    {
      display: block
    }
    .displayShortName
    {
      display: none
    }
  }
  @media screen and (max-width: 1311px) 
  { 
    .displayLongName
    {
      display: none
    }
    .displayShortName
    {
      display: block
    }
  }

  @media screen and (min-width: 1285.1px)
  { 
    .hHeaderDisplay
    {
      display: flex;
      justify-content: space-around;
    }
    .vHeaderDisplay
    {
      display: none
    }
  }
  @media screen and (max-width: 1285px)
  { 
    .hHeaderDisplay
    {
      display: none
    }
    .vHeaderDisplay
    {
      display: flex;
      flex-direction: column
    }
  }
</style>