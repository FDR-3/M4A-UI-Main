<template>
  <div v-if="navigation.menuIndex!=MenuIndex.Jesus">
    <ion-button id="settingsButton" fill="clear" @click="openSettingsModal()">
      <ion-icon id="settingsIcon" color="dark" :src="settingsSharp"></ion-icon>
    </ion-button>

    <ion-modal :is-open="isSettingsModalOpen" @didDismiss="isSettingsModalOpen=false">
      <ion-content class="ion-padding">
        <div class="flexCenterColumn">
          <ion-button id="modalCloseButton" class="nMediumSmallMarginTop" fill="clear" @click="isSettingsModalOpen=false">
            <ion-icon id="modalCloseIcon":src="closeCircle" color="dark"></ion-icon>
          </ion-button>
          <h2 class="marginZero">Settings</h2>
          <br>
          <ion-text class="underLine bold">Set Lending Protocol RPC</ion-text>
        </div>

        <ion-radio-group v-model="radioGroupSelection" @ionChange="handleRadioChange($event)">
          <ion-radio :color="colorName" value="Helius" label-placement="end">{{ defaultRPCName }}</ion-radio><br>
          <ion-radio :color="colorName" value="Custom" label-placement="end">Custom</ion-radio><br>
        </ion-radio-group>
        <ion-input
          v-model="rpcString"
          fill="outline"
          :style="{ '--highlight-color': colorHexValue }"
          :disabled="radioGroupSelection==='Helius'">
            <ion-button v-if="radioGroupSelection==='Custom'" slot="end" :color="colorName" @click="saveCustomRPCEndPoint()">Save</ion-button>
        </ion-input>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, onMounted } from 'vue'
  import { navigation, MenuIndex } from '/src/assets/globalStates/Navigation.vue'
  import { IonButton, IonIcon, IonModal, IonContent, IonText, IonRadio, IonRadioGroup, IonInput } from '@ionic/vue'
  import { settingsSharp, closeCircle } from 'ionicons/icons'
  import { validateRpcEndpoint } from '/src/assets/contracts/WalletHelper.vue'
  import { updateRpcEndpoint } from '/src/assets/contracts/Solana/AnchorLendingWorkSpace.vue'
  import { DEV_MODE } from '/src/assets/globalStates/EnvironmentSettings.ts'
  import { isProduction } from '/src/assets/helperFunctions/browserHelper.ts'
  import { toastRPCChangeSuccess, toastRPCChangeFailure } from '/src/assets/contracts/WalletHelper.vue'

  const toast = inject('toast')
  const colorName = inject('colorName') as string
  const colorHexValue = inject('colorHexValue') as string

  var radioGroupSelection = ref("Helius")
  var defaultRPCName = ref("Helius")
  var rpcString = ref("")
  var isSettingsModalOpen = ref(false)

  onMounted(() =>
  {
    const rpcSetting = localStorage.getItem("rpcSetting") || ""
    if(rpcSetting == "Helius" || rpcSetting == "")
    {
      radioGroupSelection.value = "Helius"

      if(isProduction())
        rpcString.value = "https://m4a.io/MainNetProxy"
      else
        rpcString.value = DEV_MODE ? "https://m4a.io/TestNetProxy" : "https://m4a.io/MainNetProxy"
    }
    else if(rpcSetting == "Custom")
    {
      radioGroupSelection.value = "Custom"
      const customRPCEndPoint = localStorage.getItem("customRPCEndPoint") || ""

      if(customRPCEndPoint != "")
        rpcString.value = customRPCEndPoint
      else
        rpcString.value = "https://"
    }
  })

  function openSettingsModal()
  {
    isSettingsModalOpen.value = true
  }

  const handleRadioChange = (event: CustomEvent) =>
  {
    radioGroupSelection.value = event.detail.value
    
    if(radioGroupSelection.value == "Helius")
    {
      localStorage.setItem("rpcSetting", "Helius")

      if(isProduction())
        rpcString.value = "https://m4a.io/MainNetProxy"
      else
        rpcString.value = DEV_MODE ? "https://m4a.io/TestNetProxy" : "https://m4a.io/MainNetProxy"

      toastRPCChangeSuccess(toast, rpcString.value)
    }
    else if(radioGroupSelection.value == "Custom")
    {
      const customRPCEndPoint = localStorage.getItem("customRPCEndPoint") || ""

      if(customRPCEndPoint != "")
        rpcString.value = customRPCEndPoint
      else
        rpcString.value = "https://"
    }
  }

  async function saveCustomRPCEndPoint()
  {
    if(await validateRpcEndpoint(rpcString.value))
    {
      localStorage.setItem("rpcSetting", "Custom")
      localStorage.setItem("customRPCEndPoint", rpcString.value)
      updateRpcEndpoint(rpcString.value)
      toastRPCChangeSuccess(toast, rpcString.value)
    }
    else
    {
      toastRPCChangeFailure(toast, rpcString.value)
    }
  }
</script>

<style scoped>
  ion-modal
  {
    --width: 90%;      /* How wide the box is */
    --max-width: 400px; /* Prevents it from being too huge on desktop */
    --height: 30%; /* Adjusts height to your settings content */
    --border-radius: 16px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4)
  }

  /* Optional: Adjust the inner content background */
  ion-modal::part(content)
  {
    border-radius: 16px;
  }

  ion-modal::part(backdrop)
  {
    background-color: rgb(0, 0, 0);
    opacity: 0.5 /* Higher number = darker background */
  }

  #settingsButton
  {
    border-radius: 50%; /*Makes the clickable area a circle*/
    width: min(30px, 9vw);
    --padding-start: 0px;
    --padding-end: 0px;
  }

  #settingsIcon
  {
    width: min(30px, 9vw);
    height: 27px
  }

  #modalCloseButton
  {
    display: flex;
    align-self: end;
    --padding-start: 0px;
    --padding-end: 0px;
    margin-right: -7px
  }

  #modalCloseIcon
  {
    width: 35px;
    height: 35px
  }
</style>