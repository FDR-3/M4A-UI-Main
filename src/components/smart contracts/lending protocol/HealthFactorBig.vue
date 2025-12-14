<template>
  <div class="horizontalValues">
    <h3 class="nTinyMarginBottom" style="margin-top: 0">Health Factor</h3>
    <ion-text>Asset Value: {{ assetValue }}</ion-text>
    <ion-text> Debt Value: {{ debtValue }}</ion-text>
  </div>

  <div class="verticalValues">
    <h3 class="nTinyMarginBottom" style="margin-top: 0">Health Factor</h3>
    <ion-text>Asset Value: {{ assetValue }}</ion-text><br>
    <ion-text> Debt Value: {{ debtValue }}</ion-text>
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
  import { ref, onMounted, watch } from 'vue'
  import { IonText } from '@ionic/vue'
  import { priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { lendingUserTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import InfoButton from '/src/components/help/InfoButton.vue'
  
  const props = defineProps(['accountOwnerAddress', 'accountIndex'])
  const healthFactorInfo = "\nHealth Factor equals\n\n(Assets - Debt)/Assets\n\nWhen Debt is equal or less \nthan Assets, IE: Health\nFactor is 0% or negative,\nthe Account is exposed to\nLiquidation.\n\nLiquidations occur 48 times\na day automatically\nevery 30 minutes on the\nhour."

  var assetValue = ref()
  var debtValue = ref()
  var healthFactor = ref()
  var barColor = ref()

  onMounted(() =>
  {
    calculateValues()
  })

  watch([lendingUserTabAccountListHashMap, priceObjectMap], () =>
  {
    calculateValues()
  })

  watch(() => [props.accountOwnerAddress, props.accountIndex], (() => 
  {
    calculateValues()
  }))

  function calculateValues()
  {
    if(!lendingUserTabAccountListHashMap.map)
      return

    const userTabAccounts = lendingUserTabAccountListHashMap.map.get(props.accountOwnerAddress + props.accountIndex)

    var calculatedAssetValue = 0
    var calculatedDebtValue = 0

    for(var i=0; i<userTabAccounts.length; i++)
    {
      const price = priceObjectMap.data[userTabAccounts[i].tokenMintAddress.toString()].usdPrice
      const decimalAmount = tokenDecimalHashMap.get(userTabAccounts[i].tokenMintAddress.toString())

      calculatedAssetValue += Number(userTabAccounts[i].depositedAmount / Math.pow(10, decimalAmount)) * Number(price)//Convert from fixed point notation to decimal
      calculatedDebtValue += Number(userTabAccounts[i].borrowedAmount / Math.pow(10, decimalAmount)) * Number(price)//Convert from fixed point notation to decimal
    }

    assetValue.value = '$' + calculatedAssetValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 })
    debtValue.value = '$' + calculatedDebtValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 })

    if(calculatedAssetValue != 0)
    {
      healthFactor.value = (((calculatedAssetValue - calculatedDebtValue)/calculatedAssetValue) * 100).toFixed(2)//Convert to percent
      if(healthFactor.value < 0)
        healthFactor.value = 0
    }
    else if(calculatedDebtValue == 0)
      healthFactor.value = 100
    else
      healthFactor.value = 0

    if(healthFactor.value >= 70)
      barColor.value = "#39bd39"
    else if(healthFactor.value >= 30)
      barColor.value = "#ffd700"
    else
      barColor.value = "#ff0000"
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

  @media screen and (min-width: 450.1px)
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
  @media screen and (max-width: 450px)
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