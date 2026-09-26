<template> 
  <div id="warningModal" class="feeWarning">
    <div align="right" class="mediumMarginLeft feeWarning">
      <ion-button id="closeAlertButton" class="feeWarning" fill="clear" color="dark" @click="anchorPrograms.priorityFeeWarning=false">
        <ion-icon id="closeAlertIcon" class="noClickEvent" :src="closeCircle"></ion-icon>
      </ion-button>
    </div>
    <div class="flexCenterColumn feeWarning">
      <div class="noClickEvent">
        <ion-text color="dark" class="noClickEvent">Priority fee abnormally high</ion-text>
      </div>

      <div class="smallMarginTop noClickEvent">
        <ion-label color="dark" class="noClickEvent">Amount: {{ anchorPrograms.priorityFeeAmount.toFixed(9) }} Sol </ion-label>
      </div>
      <div class="noClickEvent">
        <ion-label color="dark" class="noClickEvent">Value: {{ priorityFeeValue }}</ion-label>
      </div>

      <ion-checkbox
        class="smallMarginTop feeWarning"
        label-placement="end"
        @ionChange="validateCheckbox"
      >
        <ion-label color="dark" class="feeWarning">Don't Show Again</ion-label>
      </ion-checkbox>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { IonText, IonButton, IonIcon, IonLabel, IonCheckbox, CheckboxCustomEvent } from '@ionic/vue'
  import { closeCircle } from 'ionicons/icons'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { tokenAddressStrings } from '/src/assets/constants/Addresses.ts'

  var priorityFeeValue = computed(() =>
  {
    if(!priceObjectMap.data)
      return "$0.00"

    const price = priceObjectMap.data[tokenAddressStrings.solTokenMintAddress]?.usdPrice
    return '$' + (Number(price) * anchorPrograms.priorityFeeAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  })

  const validateCheckbox = (event: CheckboxCustomEvent<{ checked: boolean }>) =>
  {
    localStorage.setItem("dontShowPriorityFeeWarning", event.detail.checked.toString())
  }
</script>

<style scoped>
  ion-button
  {
    --padding-top: 0;
    --padding-bottom: 0;
    --padding-start: 0;
    --padding-end: 0
  }

  ion-checkbox
  {
    --checkmark-color: light-dark(#000000, #eeeeee);
    --size: 22px;
    --checkbox-background: light-dark(#000000, #eeeeee);
    --checkbox-background-checked: var(--ion-color-green);
  }

  ion-checkbox::part(container)
  {
    border-radius: 6px;
    border: 2px solid light-dark(#000000, #eeeeee);
  }

  #warningModal
  {
    width: min(90vw, 317px);
    position: fixed; /* Makes sure the modal is fixed in place on the screen */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4000; /* Makes sure the modal is on top */
    padding: 20px;
    background-color: light-dark(#eeeeee, #000000);
    border: solid thin light-dark(#000000, #eeeeee);
  }

  #closeAlertButton
  {
    margin-top: -25px;
    margin-bottom: -5px;
    margin-right: -10px
  }

  #closeAlertIcon
  {
    width: 25px;
    height: 25px
  }

  #warningModal
  {
    animation: popup 0.7s
  }

  @keyframes popup
  {
    0%
    {
      transform: translate(-50%, -50%) scale(1)
    }
    50%
    {
      transform: translate(-50%, -50%) scale(1.4)
    }
    60%
    {
      transform: translate(-50%, -50%) scale(1.1)
    }
    70%
    {
      transform: translate(-50%, -50%) scale(1.2)
    }
    80%
    {
      transform: translate(-50%, -50%) scale(1)
    }
    90%
    {
      transform: translate(-50%, -50%) scale(1.1)
    }
    100%
    {
      transform: translate(-50%, -50%) scale(1)
    }
  }
</style>