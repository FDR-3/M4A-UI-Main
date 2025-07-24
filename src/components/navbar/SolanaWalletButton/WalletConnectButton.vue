<template>
  <slot v-bind="scope">
    <ion-button class="connectButton"
      :color="colorName"
      :disabled="disabled || !wallet || connecting || connected"
      @click="onClick"
    >
      <wallet-icon v-if="wallet" :wallet="wallet"></wallet-icon>
      <p v-text="content"></p>
  </ion-button>
  </slot>
</template>

<script setup lang="ts">
  import { IonButton } from '@ionic/vue'
  import { computed, toRefs } from "vue"
  import { useWallet } from 'solana-wallets-vue'
  import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import WalletIcon from "./WalletIcon.vue"

  const props = defineProps(['disabled', 'container', 'logo', 'dark', 'colorName', 'connectButton', 'colorHexValue'])
  const emits = defineEmits(['click'])

  const { disabled } = toRefs(props)
  const { wallet, connect, connecting, connected } = useWallet()

  const content = computed(() => {
    if(connecting.value) return "Connecting ..."
    if(connected.value) return "Connected"
    if(wallet.value) return "Connect"
    return SYSTEM_PROGRAM_ADDRESS_STRING
  })

  const onClick = (event: MouseEvent) => 
  {
    emits("click", event)
    if(event.defaultPrevented) return
    connect().catch(() => {})
  }

  const scope = {
    wallet,
    disabled,
    connecting,
    connected,
    content,
    onClick,
  }
</script>

<style scoped>
  .connectButton
  {
    white-space: nowrap
  }
</style>