<template>
  <i class="swv-button-icon">
    <img
      v-if="wallet"
      :src="wallet.adapter.icon"
      :alt="`${wallet.adapter.name} icon`"
    />
  </i>
</template>

<script lang="ts">
  import { defineComponent, PropType, toRefs } from "vue"
  import  Wallet  from '/src/components/navbar/SolanaWalletButton/types/Wallet.ts'

  export default defineComponent({
    props: {
      wallet: Object as PropType<Wallet>,
    },
    setup(props) {
      return toRefs(props)
    },
  })
</script>

<style scoped>
  .swv-button-icon
  {
    min-width: 24px !important
  }
</style>



