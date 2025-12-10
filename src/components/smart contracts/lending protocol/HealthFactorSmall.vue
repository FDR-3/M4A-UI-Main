<template>
  <div class="nSmallMarginTop noClickEvent">
    <h3 class="" style="margin: 0">Health Factor</h3>
    <div class="flexCenterRow" style="gap: 10px">
      <ion-label>Asset Value: {{ assetValue }}</ion-label>
      <ion-label>Debt Value: {{ debtValue }}</ion-label>
    </div>
  </div>

  <div class="flexCenterRow nTinyMarginTop healthFactorBarContainer" style="width: 100%">
    <div class="nMediumMarginLeft">
      <InfoButton :infoMessage="healthFactorInfo"/>
    </div>
    
    <div class="progressBarContainer noClickEvent nMediumSmallMarginLeft">
      <div class="progressBar" :style="{ width: healthFactor + '%', backgroundColor: barColor}"></div>
    </div>

    <ion-text class="tinyMarginLeft  noClickEvent">{{ healthFactor }}%</ion-text>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { IonText, IonLabel } from '@ionic/vue'
  import InfoButton from '/src/components/help/InfoButton.vue'
  
  const props = defineProps(['assetValue', 'debtValue'])
  const healthFactorInfo = "\nHealth Factor equals\n\n(Assets - Debt)/Assets\n\nWhen Debt is equal or less \nthan Assets, IE: Health\nFactor is 0% or negative,\nthe Account is exposed to\nLiquidation.\n\nLiquidations occur 48 times\na day automatically\nevery 30 minutes on the\nhour."

  var assetValue = ref()
  var debtValue = ref()
  var healthFactor = ref()
  var barColor = ref()

  onMounted(() =>
  {
    setValues()
  })

  watch(() => [props.assetValue, props.debtValue], (() => 
  {
    setValues()
  }))

  function setValues()
  {
    assetValue.value = '$' + props.assetValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 })
    debtValue.value = '$' + props.debtValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 })

    if(props.assetValue != 0)
      healthFactor.value = (((props.assetValue - props.debtValue)/props.assetValue) * 100).toFixed(2)
    else if(props.debtValue == 0)
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
  h3
  {
    font-size: min(5vw, 27px);
  }

  .progressBarContainer
  {
    border: 1px solid light-dark(#000000,#ffffff);
    position: relative;
    border-radius: 5px;
    overflow: hidden
  }

  .progressBar
  {
    height: 20px;
    border-radius: 5px;
    transition: width 1s linear
  }
</style>