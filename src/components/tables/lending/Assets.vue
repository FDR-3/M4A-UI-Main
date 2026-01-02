<script lang="ts">
  import { reactive } from 'vue'
  import DAISVG from '/src/assets/cryptoIcons/dai-svg.vue'
  import USDCSVG from '/src/assets/cryptoIcons/usdc-svg.vue'
  import SOLSVG from '/src/assets/cryptoIcons/sol-svg.vue'
  import WETHSVG from '/src/assets/cryptoIcons/weth-svg.vue'
  import WBTCSVG from '/src/assets/cryptoIcons/wbtc-svg.vue'
  import { sourceDAI,
    sourceUSDC,
    sourceSOL,
    sourceWETH,
    sourceWBTC } from '/src/assets/helperFunctions/sources.ts'
  import { tokenAddressStrings, hodlWalletATAStrings, solvencyWalletATAStrings } from '/src/assets/constants/Addresses.ts'
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
      tokenMintAddressString: tokenAddressStrings.daiTokenMintAddress,
      decimalAmount: 8,
      hodlATA: hodlWalletATAStrings.daiATA,
      solvencyATA: solvencyWalletATAStrings.daiATA,
      asset: 
      {
        name: "DAI",
        svg: DAISVG,
        source: () => {sourceDAI()}
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
      decimalAmount: 6,
      hodlATA: hodlWalletATAStrings.usdcATA,
      solvencyATA: solvencyWalletATAStrings.usdcATA,
      asset: 
      {
        name: usdcName,
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
      decimalAmount: 9,
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
      decimalAmount: 8,
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
      decimalAmount: 8,
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
