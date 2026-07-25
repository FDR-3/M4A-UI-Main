<script lang="ts">
  import { reactive, Component, markRaw } from 'vue'
  import USDSSVG from '/src/assets/cryptoIcons/usds-svg.vue'
  import USDCSVG from '/src/assets/cryptoIcons/usdc-svg.vue'
  import SOLSVG from '/src/assets/cryptoIcons/sol-svg.vue'
  import WEthSVG from '/src/assets/cryptoIcons/weth-svg.vue'
  import WBtcSVG from '/src/assets/cryptoIcons/wbtc-svg.vue'
  import { LegacyTokenProgramID,
    TokenProgram2022ID,
    tokenIds,
    tokenReserveATAKeys,
    tokenDecimalHashMap,
    tokenAddressKeys } from '/src/assets/constants/Addresses.ts'
  import { sourceUSDS,
    sourceUSDC,
    sourceSOL,
    sourceWEth,
    sourceWBtc } from '/src/assets/helperFunctions/sources.ts'
  import { PublicKey } from "@solana/web3.js"

  export const tokenReserves = reactive(
  {
    data: undefined
  })

  export const tokenReserveStats = reactive(
  {
    data: undefined
  })

  //Key: Token Mint Address, Value: Specific Token Reserve
  export const tokenReservesHashMap = reactive(
  {
    map: undefined
  })

  //Key: Token Mint Id, Value: Token Mint Address
  export const tokenIdHashMap = reactive(
  {
    map: undefined
  })

  export const priceObjectMap = reactive(
  {
    data: undefined
  })

  export const tokenReserveFontEndInfoHashMap: Map<number, tokenMapObject> = new Map(
  [ 
    //Key: Token Mint Address, Value: Token SVG
    [tokenIds.usdsTokenId,
    {
      name: "USDS",
      publicKey: tokenAddressKeys.usdsTokenMintAddress,
      decimalAmount: tokenDecimalHashMap.get(tokenIds.usdsTokenId),
      svg: markRaw(USDSSVG),
      source: () => {sourceUSDS()},
      ata: tokenReserveATAKeys.usdsATA,
      tokenProgram: LegacyTokenProgramID,
      initialGlobalLimit:  100_000
    }],
    [tokenIds.usdcTokenId,
    {
      name: "USDC",
      publicKey: tokenAddressKeys.usdcTokenMintAddress,
      decimalAmount: tokenDecimalHashMap.get(tokenIds.usdcTokenId),
      svg: markRaw(USDCSVG),
      source: () => {sourceUSDC()},
      ata: tokenReserveATAKeys.usdcATA,
      tokenProgram: LegacyTokenProgramID,
      initialGlobalLimit:  100_000
    }],
    [tokenIds.solTokenId,
    {
      name: "SOL",
      publicKey: tokenAddressKeys.solTokenMintAddress,
      decimalAmount: tokenDecimalHashMap.get(tokenIds.solTokenId),
      svg: markRaw(SOLSVG),
      source: () => {sourceSOL()},
      ata: tokenReserveATAKeys.solATA,
      tokenProgram: LegacyTokenProgramID,
      initialGlobalLimit:  1_444
    }],
    [tokenIds.wethTokenId,
    {
      name: "WEth",
      publicKey: tokenAddressKeys.wethTokenMintAddress,
      decimalAmount: tokenDecimalHashMap.get(tokenIds.wethTokenId),
      svg: markRaw(WEthSVG),
      source: () => {sourceWEth()},
      ata: tokenReserveATAKeys.wethATA,
      tokenProgram: LegacyTokenProgramID,
      initialGlobalLimit:  53.77
    }],
    [tokenIds.wbtcTokenId,
    {
      name: "WBtc",
      publicKey: tokenAddressKeys.wbtcTokenMintAddress,
      decimalAmount: tokenDecimalHashMap.get(tokenIds.wbtcTokenId),
      svg: markRaw(WBtcSVG),
      source: () => {sourceWBtc()},
      ata: tokenReserveATAKeys.wbtcATA,
      tokenProgram: LegacyTokenProgramID,
      initialGlobalLimit:  1.57
    }]
  ])

  type tokenMapObject =
  {
    name: string;
    decimalAmount: number;
    svg: Component;
    source: () => void;
    ata: PublicKey
  }

  export const tokenReserveBalancesHashMap = reactive(
  {
    map: new Map<number, number>()
  })

  export default tokenReserves
</script>