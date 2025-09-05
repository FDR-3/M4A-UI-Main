<script lang="ts">
  import { reactive, Component } from 'vue'
  import USDCSVG from '/src/assets/cryptoIcons/usdc-svg.vue'
  import { sourceUSDC, sourceSOL} from '/src/assets/helperFunctions/sources.ts'

  export const tokenReserves = reactive(
  {
    data: undefined
  })

  //Dev Net
  export const tokenReserveDevNetMap: Map<string, tokenMapObject> = new Map(
  [ 
    //Key: Token Mint Address, Value: Token SVG
    ["4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", { name: "USDC", svg: USDCSVG, source: () => {sourceUSDC()}} ]
  ])

  //Mainnet Net
  export const tokenReserveMainnetMap: Map<string, tokenMapObject> = new Map(
  [
    //Key: Token Mint Address, Value: Token SVG
    ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", { name: "USDC", svg: USDCSVG, source: () => {sourceUSDC()}} ]
  ])

  type tokenMapObject =
  {
    name: string;
    svg: Component;
    source: () => void;
  }

  export default tokenReserves
</script>