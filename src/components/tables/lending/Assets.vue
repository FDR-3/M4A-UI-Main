<script lang="ts">
  import { reactive } from 'vue'
  import USDSSVG from '/src/assets/cryptoIcons/usds-svg.vue'
  import USDCSVG from '/src/assets/cryptoIcons/usdc-svg.vue'
  import SOLSVG from '/src/assets/cryptoIcons/sol-svg.vue'
  import WETHSVG from '/src/assets/cryptoIcons/weth-svg.vue'
  import WBTCSVG from '/src/assets/cryptoIcons/wbtc-svg.vue'
  import { sourceUSDS,
    sourceUSDC,
    sourceSOL,
    sourceWETH,
    sourceWBTC } from '/src/assets/helperFunctions/sources.ts'
  import { tokenAddressStrings,
    tokenIds,
    hodlWalletATAStrings,
    solvencyWalletATAStrings,
    tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { DEV_MODE } from '/src/assets/globalStates/EnvironmentSettings.ts'

  var usdcName = ""

  if(DEV_MODE)
  {
    usdcName = "USDC-DEV"
  }
  else
  {
    usdcName = "USDC"
  }

  export const StableCoins = reactive(
  [
    {
      tokenMintAddressString: tokenAddressStrings.usdsTokenMintAddress,
      tokenId: tokenIds.usdsTokenId,
      decimalAmount: tokenDecimalHashMap.get(tokenIds.usdsTokenId),
      hodlATA: hodlWalletATAStrings.usdsATA,
      solvencyATA: solvencyWalletATAStrings.usdsATA,
      asset: 
      {
        name: "USDS",
        svg: USDSSVG,
        source: () => {sourceUSDS()}
      },
      price: '-',
      percentChange24h: '-',
      supplyAPY: "-",
      borrowAPY: "-",
      chain:
      {
        name: "Solana",
        svg: SOLSVG,
        source: () => {sourceSOL()}
      }
    },
    {
      tokenMintAddressString: tokenAddressStrings.usdcTokenMintAddress,
      tokenId: tokenIds.usdcTokenId,
      decimalAmount: tokenDecimalHashMap.get(tokenIds.usdcTokenId),
      hodlATA: hodlWalletATAStrings.usdcATA,
      solvencyATA: solvencyWalletATAStrings.usdcATA,
      asset: 
      {
        name: "USDC",
        svg: USDCSVG,
        source: () => {sourceUSDC()}
      },
      price: '-',
      percentChange24h: '-',
      supplyAPY: "-",
      borrowAPY: "-",
      chain:
      {
        name: "Solana",
        svg: SOLSVG,
        source: () => {sourceSOL()}
      }
    }
  ])

  export const CryptoCurrency = reactive(
  [
    {
      tokenMintAddressString: tokenAddressStrings.solTokenMintAddress,
      tokenId: tokenIds.solTokenId,
      decimalAmount: tokenDecimalHashMap.get(tokenIds.solTokenId),
      solvencyATA: solvencyWalletATAStrings.solATA,
      asset: 
      {
        name: "Sol",
        svg: SOLSVG,
        source: () => {sourceSOL()}
      },
      price: '-',
      percentChange24h: '-',
      supplyAPY: "-",
      borrowAPY: "-",
      chain:
      {
        name: "Solana",
        svg: SOLSVG,
        source: () => {sourceSOL()}
      }
    },
    {
      tokenMintAddressString: tokenAddressStrings.wethTokenMintAddress,
      tokenId: tokenIds.wethTokenId,
      decimalAmount: tokenDecimalHashMap.get(tokenIds.wethTokenId),
      solvencyATA: solvencyWalletATAStrings.wethATA,
      asset: 
      {
        name: "WETH",
        svg: WETHSVG,
        source: () => {sourceWETH()}
      },
      price: '-',
      percentChange24h: '-',
      supplyAPY: "-",
      borrowAPY: "-",
      chain:
      {
        name: "Solana",
        svg: SOLSVG,
        source: () => {sourceSOL()}
      }
    },
    {
      tokenMintAddressString: tokenAddressStrings.wbtcTokenMintAddress,
      tokenId: tokenIds.wbtcTokenId,
      decimalAmount: tokenDecimalHashMap.get(tokenIds.wbtcTokenId),
      solvencyATA: solvencyWalletATAStrings.wbtcATA,
      asset: 
      {
        name: "WBTC",
        svg: WBTCSVG,
        source: () => {sourceWBTC()}
      },
      price: '-',
      percentChange24h: '-',
      supplyAPY: "-",
      borrowAPY: "-",
      chain:
      {
        name: "Solana",
        svg: SOLSVG,
        source: () => {sourceSOL()}
      }
    }
  ])

export default StableCoins
</script>
