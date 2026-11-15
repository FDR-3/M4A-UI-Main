<template>
  <div class="horizontalValues">
    <h3 class="nTinyMarginBottom yellow" style="margin-top: 0">Health Factor</h3>
    <div>
      <ion-text>Asset Value: $<span class="depositText">{{ assetValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 }) }}</span>
      </ion-text>
      <ion-text> Debt Value: $<span class="borrowText">{{ debtValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 }) }}</span>
      </ion-text>
    </div>
    <ion-text>Overall Value: $<span class="rainbowText">{{ overallValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 }) }}</span>
    </ion-text>
  </div>

  <div class="verticalValues">
    <h3 class="nTinyMarginBottom yellow" style="margin-top: 0">Health Factor</h3>
    <ion-text>Asset Value: $<span class="depositText">{{ assetValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 }) }}</span>
    </ion-text><br>
    <ion-text>Debt Value: $<span class="borrowText">{{ debtValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 }) }}</span>
    </ion-text><br>
    <ion-text>Overall Value: $<span class="rainbowText">{{ overallValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 }) }}</span>
    </ion-text>
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
  import { ref, watch, onMounted } from 'vue'
  import { IonText } from '@ionic/vue'
  import InfoButton from '/src/components/help/InfoButton.vue'
  import { healthFactorInfo } from './InterestCalcHelpers.ts'
  
  const props = defineProps(
  [
    'accountOwnerAddress',
    'accountIndex',
    'userTotalValueChartDataHashMap',
    'assetValue',
    'debtValue',
    'overallValue'
  ])

  var healthFactor = ref()
  var barColor = ref()

  onMounted(() =>
  {
    updateHealthFactor()
  })
  watch(() => [props.assetValue, props.debtValue, props.overallValue], (() => 
  {
    updateHealthFactor()
  }))

  function updateHealthFactor()
  {
    if(props.assetValue != 0)
    {
      healthFactor.value = (((props.assetValue * 0.8 - props.debtValue)/(props.assetValue * 0.8)) * 100).toFixed(2)//Convert to percent
      if(Number(healthFactor.value) < 0)
        healthFactor.value = (0).toFixed(2)
    }
    else if(props.debtValue == 0)
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