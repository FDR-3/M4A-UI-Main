<script lang="ts">
  import { reactive, Component, markRaw } from 'vue'
  import DAISVG from '/src/assets/cryptoIcons/dai-svg.vue'
  import USDCSVG from '/src/assets/cryptoIcons/usdc-svg.vue'
  import SOLSVG from '/src/assets/cryptoIcons/sol-svg.vue'
  import WETHSVG from '/src/assets/cryptoIcons/weth-svg.vue'
  import WBTCSVG from '/src/assets/cryptoIcons/wbtc-svg.vue'
  import { tokenAddressStringsMainNet, tokenAddressStringsDevNet, tokenReserveAssociatedTokenAddressKeysDevNet } from '/src/assets/constants/Addresses.ts'
  import { sourceDAI,
    sourceUSDC,
    sourceSOL,
    sourceWETH,
    sourceWBTC } from '/src/assets/helperFunctions/sources.ts'
  import { PublicKey } from "@solana/web3.js"

  export const tokenReserves = reactive(
  {
    data: undefined
  })

  export const priceObjectMap = reactive(
  {
    data: undefined
  })

  //Mainnet Net
  export const tokenReserveMainnetMap: Map<string, tokenMapObject> = new Map(
  [
    //Key: Token Mint Address, Value: Token SVG
    [tokenAddressStringsMainNet.daiTokenMintAddress, { name: "DAI", svg: markRaw(DAISVG), source: () => {sourceDAI()}, ata: tokenReserveAssociatedTokenAddressKeysDevNet.daiATA }],
    [tokenAddressStringsMainNet.usdcTokenMintAddress, { name: "USDC", svg: markRaw(USDCSVG), source: () => {sourceUSDC()}, ata: tokenReserveAssociatedTokenAddressKeysDevNet.usdcATA }],
    [tokenAddressStringsMainNet.solTokenMintAddress, { name: "SOL", svg: markRaw(SOLSVG), source: () => {sourceSOL()}, ata: tokenReserveAssociatedTokenAddressKeysDevNet.solATA }],
    [tokenAddressStringsMainNet.wethTokenMintAddress, { name: "WETH", svg: markRaw(WETHSVG), source: () => {sourceWETH()}, ata: tokenReserveAssociatedTokenAddressKeysDevNet.wethATA }],
    [tokenAddressStringsMainNet.wbtcTokenMintAddress, { name: "WBTC", svg: markRaw(WBTCSVG), source: () => {sourceWBTC()}, ata: tokenReserveAssociatedTokenAddressKeysDevNet.wbtcATA }]
  ])

  //Dev Net
  export const tokenReserveDevNetMap: Map<string, tokenMapObject> = new Map(
  [ 
    //Key: Token Mint Address, Value: Token SVG
    [tokenAddressStringsDevNet.daiTokenMintAddress, { name: "DAI-Dev", svg: markRaw(DAISVG), source: () => {sourceDAI()}, ata: tokenReserveAssociatedTokenAddressKeysDevNet.daiATA }],
    [tokenAddressStringsDevNet.usdcTokenMintAddress, { name: "USDC-Dev", svg: markRaw(USDCSVG), source: () => {sourceUSDC()}, ata: tokenReserveAssociatedTokenAddressKeysDevNet.usdcATA }],
    [tokenAddressStringsDevNet.solTokenMintAddress, { name: "SOL-Dev", svg: markRaw(SOLSVG), source: () => {sourceSOL()}, ata: tokenReserveAssociatedTokenAddressKeysDevNet.solATA }],
    [tokenAddressStringsDevNet.wethTokenMintAddress, { name: "WETH-Dev", svg: markRaw(WETHSVG), source: () => {sourceWETH()}, ata: tokenReserveAssociatedTokenAddressKeysDevNet.wethATA }],
    [tokenAddressStringsDevNet.wbtcTokenMintAddress, { name: "WBTC-Dev", svg: markRaw(WBTCSVG), source: () => {sourceWBTC()}, ata: tokenReserveAssociatedTokenAddressKeysDevNet.wbtcATA }]
  ])

  export const tokenReserveBalancesMap = reactive(
  {
    map: new Map<string, string>()
  })

  type tokenMapObject =
  {
    name: string;
    svg: Component;
    source: () => void;
    ata: PublicKey
  }

  export default tokenReserves
</script>