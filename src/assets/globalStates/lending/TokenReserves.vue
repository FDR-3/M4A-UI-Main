<script lang="ts">
  import { reactive, Component, markRaw } from 'vue'
  import DAISVG from '/src/assets/cryptoIcons/dai-svg.vue'
  import USDCSVG from '/src/assets/cryptoIcons/usdc-svg.vue'
  import SOLSVG from '/src/assets/cryptoIcons/sol-svg.vue'
  import WETHSVG from '/src/assets/cryptoIcons/weth-svg.vue'
  import WBTCSVG from '/src/assets/cryptoIcons/wbtc-svg.vue'
  import {tokenAddressStringsMainNet, tokenAddressStringsDevNet} from '/src/assets/constants/TokenAddresses.ts'
  import { sourceDAI,
    sourceUSDC,
    sourceSOL,
    sourceWETH,
    sourceWBTC } from '/src/assets/helperFunctions/sources.ts'

  export const tokenReserves = reactive(
  {
    data: undefined
  })

  //Mainnet Net
  export const tokenReserveMainnetMap: Map<string, tokenMapObject> = new Map(
  [
    //Key: Token Mint Address, Value: Token SVG
    [tokenAddressStringsMainNet.DAITokenMintAddress, { name: "DAI", svg: markRaw(DAISVG), source: () => {sourceDAI()}} ],
    [tokenAddressStringsMainNet.USDCTokenMintAddress, { name: "USDC", svg: markRaw(USDCSVG), source: () => {sourceUSDC()}} ],
    [tokenAddressStringsMainNet.SOLTokenMintAddress, { name: "SOL", svg: markRaw(SOLSVG), source: () => {sourceSOL()}} ],
    [tokenAddressStringsMainNet.WETHTokenMintAddress, { name: "WETH", svg: markRaw(WETHSVG), source: () => {sourceWETH()}} ],
    [tokenAddressStringsMainNet.WBTCTokenMintAddress, { name: "WBTC", svg: markRaw(WBTCSVG), source: () => {sourceWBTC()}} ]
  ])

  //Dev Net
  export const tokenReserveDevNetMap: Map<string, tokenMapObject> = new Map(
  [ 
    //Key: Token Mint Address, Value: Token SVG
    [tokenAddressStringsDevNet.DAITokenMintAddress, { name: "DAI", svg: markRaw(DAISVG), source: () => {sourceDAI()}} ],
    [tokenAddressStringsDevNet.USDCTokenMintAddress, { name: "USDC", svg: markRaw(USDCSVG), source: () => {sourceUSDC()}} ],
    [tokenAddressStringsDevNet.SOLTokenMintAddress, { name: "SOL", svg: markRaw(SOLSVG), source: () => {sourceSOL()}} ],
    [tokenAddressStringsDevNet.WETHTokenMintAddress, { name: "WETH", svg: markRaw(WETHSVG), source: () => {sourceWETH()}} ],
    [tokenAddressStringsDevNet.WBTCTokenMintAddress, { name: "WBTC", svg: markRaw(WBTCSVG), source: () => {sourceWBTC()}} ]
  ])

  type tokenMapObject =
  {
    name: string;
    svg: Component;
    source: () => void;
  }

  export default tokenReserves
</script>