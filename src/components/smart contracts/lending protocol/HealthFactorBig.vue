<template>
  <div class="horizontalValues">
    <h3 class="nTinyMarginBottom yellow" style="margin-top: 0">Health Factor</h3>
    <div>
      <ion-text>Asset Value: {{ assetValue }}</ion-text>
      <ion-text> Debt Value: {{ debtValue }}</ion-text>
    </div>
    <ion-text>Overall Value: {{ overallValue }}</ion-text>
  </div>

  <div class="verticalValues">
    <h3 class="nTinyMarginBottom yellow" style="margin-top: 0">Health Factor</h3>
    <ion-text>Asset Value: {{ assetValue }}</ion-text><br>
    <ion-text>Debt Value: {{ debtValue }}</ion-text><br>
    <ion-text>Overall Value: {{ overallValue }}</ion-text>
  </div>

  <div class="flexCenterRow nTinyMarginTop">
    <InfoButton :infoMessage="healthFactorInfo"/>
    
    <div class="progressBarContainer">
      <div class="progressBar" :style="{ width: healthFactor + '%', backgroundColor: barColor}"></div>
    </div>

    <ion-text class="mediumMarginLeft mediumMarginRight">{{ healthFactor }}%</ion-text>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { IonText } from '@ionic/vue'
  import { tokenReservesHashMap, tokenIdHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketsHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import InfoButton from '/src/components/help/InfoButton.vue'
  import { calculateNewBalance, calculateNewDebtBalance, healthFactorInfo } from './InterestCalcHelpers.ts'
  import { unixData } from '/src/assets/globalStates/AnchorPrograms.vue'
  
  const props = defineProps(['accountOwnerAddress', 'accountIndex'])

  var assetValue = ref()
  var debtValue = ref()
  var overallValue = ref()
  var healthFactor = ref()
  var barColor = ref()
  var healthFactorIntervalId: any

  onMounted(() =>
  {
    startHealthFactorCalculation()
  })

  onUnmounted(() =>
  {
    stopHealthFactorCalculation()
  })

  function calculateHealthFactorValues(timeStamp: number)
  {
    if(!lendingUserTabAccountListHashMap.map)
      return

    const userTabAccounts = lendingUserTabAccountListHashMap.map.get(props.accountOwnerAddress + props.accountIndex)

    var calculatedAssetValue = 0
    var calculatedDebtValue = 0

    for(var i=0; i<userTabAccounts.length; i++)
    {
      const tokenMintAddressString = tokenIdHashMap.map.get(userTabAccounts[i].tokenId)
      const price = priceObjectMap.data[tokenMintAddressString].usdPrice
      const decimalAmount = tokenDecimalHashMap.get(userTabAccounts[i].tokenId)
      const tabTokenReserve = tokenReservesHashMap.map.get(userTabAccounts[i].tokenId)
      const subMarket = subMarketsHashMap.map.get(userTabAccounts[i].tokenId.toString() +
      userTabAccounts[i].subMarketOwnerAddress.toString() +
      userTabAccounts[i].subMarketIndex.toString())

      const userBalanceWithInterestEarned = calculateNewBalance(
      tabTokenReserve,
      subMarket,
      Number(userTabAccounts[i].depositedAmount),
      Number(userTabAccounts[i].supplyInterestChangeIndex),
      timeStamp)

      const userDebtWithInterestAccrued =  calculateNewDebtBalance(
      tabTokenReserve,
      Number(userTabAccounts[i].borrowedAmount),
      Number(userTabAccounts[i].borrowInterestChangeIndex),
      timeStamp)

      calculatedAssetValue += Number(userBalanceWithInterestEarned / Math.pow(10, decimalAmount)) * Number(price)
      calculatedDebtValue += Number(userDebtWithInterestAccrued / Math.pow(10, decimalAmount)) * Number(price)
    }

    assetValue.value = '$' + calculatedAssetValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 })
    debtValue.value = '$' + calculatedDebtValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 })
    overallValue.value = '$' + (calculatedAssetValue - calculatedDebtValue).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 }) 

    if(calculatedAssetValue != 0)
    {
      healthFactor.value = (((calculatedAssetValue * 0.8 - calculatedDebtValue)/(calculatedAssetValue * 0.8)) * 100).toFixed(2)//Convert to percent
      if(Number(healthFactor.value) < 0)
        healthFactor.value = (0).toFixed(2)
    }
    else if(calculatedDebtValue == 0)
      healthFactor.value = (100).toFixed(2)
    else
      healthFactor.value = (0).toFixed(2)

    if(healthFactor.value >= 70)
      barColor.value = "#39bd39"
    else if(healthFactor.value >= 30)
      barColor.value = "#ffd700"
    else
      barColor.value = "#ff0000"
  }

  function startHealthFactorCalculation()
  {
    if(unixData.timeStamp == 0)
      return

    healthFactorIntervalId = setInterval(() =>
    {
      calculateHealthFactorValues(unixData.timeStamp)
    }, 55)
  }

  function stopHealthFactorCalculation()
  {
    if(healthFactorIntervalId != undefined)
    {
      clearInterval(healthFactorIntervalId)
      healthFactorIntervalId = undefined
    }
  }
</script>

<style>
  .progressBarContainer
  {
    width: 100%;
    border: 1px solid light-dark(#000000,#ffffff);
    position: relative;
    border-radius: 5px;
    overflow: hidden
  }

  .progressBar
  {
    height: 20px;
    border-radius: 5px;
    width: 100%; /* Initial full width */
    transition: width 1s linear /* Smooth transition */
  }

  @media screen and (min-width: 520.1px)
  { 
    .horizontalValues
    {
      display: block
    }
    .verticalValues
    {
      display: none
    }
  }
  @media screen and (max-width: 520px)
  { 
    .horizontalValues
    {
      display: none
    }
    .verticalValues
    {
      display: block
    }
  }
</style>