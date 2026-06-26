<script lang="ts">
  import { reactive, Component, markRaw } from 'vue'
  import DAISVG from '/src/assets/cryptoIcons/dai-svg.vue'
  import USDCSVG from '/src/assets/cryptoIcons/usdc-svg.vue'
  import SOLSVG from '/src/assets/cryptoIcons/sol-svg.vue'
  import WETHSVG from '/src/assets/cryptoIcons/weth-svg.vue'
  import WBTCSVG from '/src/assets/cryptoIcons/wbtc-svg.vue'
  import { LegacyTokenProgramID,
    TokenProgram2022ID,
    tokenIds,
    tokenReserveATAKeys,
    tokenAddressKeys } from '/src/assets/constants/Addresses.ts'
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
    [tokenIds.daiTokenId,
    {
      name: "DAI-Dev",
      publicKey: tokenAddressKeys.daiTokenMintAddress,
      decimalAmount: 8,
      svg: markRaw(DAISVG),
      source: () => {sourceDAI()},
      ata: tokenReserveATAKeys.daiATA,
      tokenProgram: LegacyTokenProgramID
    }],
    [tokenIds.usdcTokenId,
    {
      name: "USDC-Dev",
      publicKey: tokenAddressKeys.usdcTokenMintAddress,
      decimalAmount: 6,
      svg: markRaw(USDCSVG),
      source: () => {sourceUSDC()},
      ata: tokenReserveATAKeys.usdcATA,
      tokenProgram: LegacyTokenProgramID
    }],
    [tokenIds.solTokenId,
    {
      name: "SOL-Dev",
      publicKey: tokenAddressKeys.solTokenMintAddress,
      decimalAmount: 9,
      svg: markRaw(SOLSVG),
      source: () => {sourceSOL()},
      ata: tokenReserveATAKeys.solATA,
      tokenProgram: LegacyTokenProgramID
    }],
    [tokenIds.wethTokenId,
    {
      name: "WETH-Dev",
      publicKey: tokenAddressKeys.wethTokenMintAddress,
      decimalAmount: 8,
      svg: markRaw(WETHSVG),
      source: () => {sourceWETH()},
      ata: tokenReserveATAKeys.wethATA,
      tokenProgram: LegacyTokenProgramID
    }],
    [tokenIds.wbtcTokenId,
    {
      name: "WBTC-Dev",
      publicKey: tokenAddressKeys.wbtcTokenMintAddress,
      decimalAmount: 8,
      svg: markRaw(WBTCSVG),
      source: () => {sourceWBTC()},
      ata: tokenReserveATAKeys.wbtcATA,
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