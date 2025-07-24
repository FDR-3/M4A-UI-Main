<template>
  <ion-button v-if="!metaMaskWalletConnected.connected" class="connectButton" :color="colorName" size="small" slot="end" @click="askToConnect()" fill="solid">
    <ion-label color="dark">{{connectedWallet.addressString}}</ion-label>
  </ion-button>
  <ion-button v-if="metaMaskWalletConnected.connected" class="connectButton" :color="colorName" size="small" slot="end" @click="openPopover($event)" fill="solid">
    <ion-label class="noClickEvent" color="dark">{{connectedWallet.addressString}}</ion-label>
  </ion-button>
  <ion-popover :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen = false" side="bottom" size="cover">
    <ion-button class="popOverButton" :color="colorName" @click="disconnectWallet()">
      <ion-label color="dark">Disconnect</ion-label>
    </ion-button>
  </ion-popover>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { IonButton, IonLabel, IonPopover } from '@ionic/vue'
  import { askToConnect, handleAccountsChanged, disconnectWallet }   from '/src/assets/contracts/WalletHelper.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { metaMaskWalletConnected } from '/src/assets/globalStates/MetaMaskWalletConnected.vue'

  defineProps(['colorName', 'connectButton', 'lilNavColor'])

  var popoverOpen = ref()
  var event = ref()

  onMounted(async() => 
  {
    await handleAccountsChanged() 
  })

  //watch(window.ethereum.on("accountsChanged", handleAccountsChanged), () => {
  //})

  function openPopover(e: Event) 
  {
    event.value = e
    popoverOpen.value = true
  }
</script>
  
<style scoped>
  .connectButton
  {
    width: min(27vw, 100px);
    letter-spacing: 0px;
    display: v-bind(connectButton);
    white-space: nowrap
  }

  .connectButton:hover
  {
    text-decoration: underline;
    text-decoration-color: var(--ion-color-light);
    text-decoration-thickness: 2px;
    opacity: 1
  }
</style>
