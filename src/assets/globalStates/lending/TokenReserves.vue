<script lang="ts">
  import { reactive, Component, markRaw } from 'vue'
  import DAISVG from '/src/assets/cryptoIcons/dai-svg.vue'
  import USDCSVG from '/src/assets/cryptoIcons/usdc-svg.vue'
  import SOLSVG from '/src/assets/cryptoIcons/sol-svg.vue'
  import WEthSVG from '/src/assets/cryptoIcons/weth-svg.vue'
  import WBtcSVG from '/src/assets/cryptoIcons/wbtc-svg.vue'
  import { sourceDAI,
    sourceUSDC,
    sourceSOL,
    sourceWEth,
    sourceWBtc } from '/src/assets/helperFunctions/sources.ts'

  export const tokenReserves = reactive(
  {
    data: undefined
  })

  //Mainnet Net
  export const tokenReserveMainnetMap: Map<string, tokenMapObject> = new Map(
  [
    //Key: Token Mint Address, Value: Token SVG
    ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt11", { name: "DAI", svg: markRaw(DAISVG), source: () => {sourceDAI()}} ],
    ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", { name: "USDC", svg: markRaw(USDCSVG), source: () => {sourceUSDC()}} ],
    ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt12", { name: "SOL", svg: markRaw(SOLSVG), source: () => {sourceSOL()}} ],
    ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt13", { name: "WEth", svg: markRaw(WEthSVG), source: () => {sourceWEth()}} ],
    ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt14", { name: "WBtc", svg: markRaw(WBtcSVG), source: () => {sourceWBtc()}} ]
  ])

  //Dev Net
  export const tokenReserveDevNetMap: Map<string, tokenMapObject> = new Map(
  [ 
    //Key: Token Mint Address, Value: Token SVG
    ["4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncD1", { name: "DAI", svg: markRaw(DAISVG), source: () => {sourceDAI()}} ],
    ["4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", { name: "USDC", svg: markRaw(USDCSVG), source: () => {sourceUSDC()}} ],
    ["4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncD2", { name: "SOL", svg: markRaw(SOLSVG), source: () => {sourceSOL()}} ],
    ["4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncD3", { name: "WEth", svg: markRaw(WEthSVG), source: () => {sourceWEth()}} ],
    ["4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncD4", { name: "WBtc", svg: markRaw(WBtcSVG), source: () => {sourceWBtc()}} ]
  ])

  type tokenMapObject =
  {
    name: string;
    svg: Component;
    source: () => void;
  }

  export default tokenReserves
</script>