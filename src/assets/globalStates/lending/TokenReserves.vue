<script lang="ts">
  import { reactive, Component } from 'vue'
  import USDCSVG from '/src/assets/cryptoIcons/usdc-svg.vue'

  export const tokenReserves = reactive(
  {
    data: undefined
  })

  //Dev Net
  export const tokenReserveSVGsDevNetMap: Map<string, Component> = new Map(
  [ 
    //Key: Token Mint Address, Value: Token SVG
    ["4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", USDCSVG]
  ])

  //Mainnet Net
  export const tokenReserveSVGsMainnetMap: Map<string, number> = new Map(
  [
    //Key: Token Mint Address, Value: Token SVG
    ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", USDCSVG]
  ])

  export default tokenReserves
</script>