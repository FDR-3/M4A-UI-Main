<script lang="ts">
  import { reactive, Component, markRaw } from 'vue'
  import DAISVG from '/src/assets/cryptoIcons/dai-svg.vue'
  import USDCSVG from '/src/assets/cryptoIcons/usdc-svg.vue'
  import SOLSVG from '/src/assets/cryptoIcons/sol-svg.vue'
  import WETHSVG from '/src/assets/cryptoIcons/weth-svg.vue'
  import WBTCSVG from '/src/assets/cryptoIcons/wbtc-svg.vue'
  import { LegacyTokenProgramID,
    TokenProgram2022ID,
    tokenAddressStrings,
    tokenReserveATAKeys,
    pythFeedIds } from '/src/assets/constants/Addresses.ts'
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

  export const tokenReserveStats = reactive(
  {
    data: undefined
  })

  //Key: Token Mint Address, Value: Specific Token Reserve
  export const tokenReservesHashMap = reactive(
  {
    map: undefined
  })

  export const priceObjectMap = reactive(
  {
    data: undefined
  })

  export const tokenReserveFontEndInfoHashMap: Map<string, tokenMapObject> = new Map(
  [ 
    //Key: Token Mint Address, Value: Token SVG
    [tokenAddressStrings.daiTokenMintAddress,
    {
      name: "DAI-Dev",
      decimalAmount: 8,
      svg: markRaw(DAISVG),
      source: () => {sourceDAI()},
      ata: tokenReserveATAKeys.daiATA,
      pythFeedId: pythFeedIds.daiPythFeedId,
      tokenProgram: LegacyTokenProgramID
    }],
    [tokenAddressStrings.usdcTokenMintAddress,
    {
      name: "USDC-Dev",
      decimalAmount: 6,
      svg: markRaw(USDCSVG),
      source: () => {sourceUSDC()},
      ata: tokenReserveATAKeys.usdcATA,
      pythFeedId: pythFeedIds.usdcPythFeedId,
      tokenProgram: LegacyTokenProgramID
    }],
    [tokenAddressStrings.solTokenMintAddress,
    {
      name: "SOL-Dev", decimalAmount: 9,
      svg: markRaw(SOLSVG),
      source: () => {sourceSOL()},
      ata: tokenReserveATAKeys.solATA,
      pythFeedId: pythFeedIds.solPythFeedId,
      tokenProgram: LegacyTokenProgramID
    }],
    [tokenAddressStrings.wethTokenMintAddress,
    {
      name: "WETH-Dev",
      decimalAmount: 8,
      svg: markRaw(WETHSVG),
      source: () => {sourceWETH()},
      ata: tokenReserveATAKeys.wethATA,
      pythFeedId: pythFeedIds.wethPythFeedId,
      tokenProgram: LegacyTokenProgramID
    }],
    [tokenAddressStrings.wbtcTokenMintAddress,
    {
      name: "WBTC-Dev",
      decimalAmount: 8,
      svg: markRaw(WBTCSVG),
      source: () => {sourceWBTC()},
      ata: tokenReserveATAKeys.wbtcATA,
      pythFeedId: pythFeedIds.wbtcPythFeedId,
      tokenProgram: LegacyTokenProgramID
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

  export default tokenReserves
</script>