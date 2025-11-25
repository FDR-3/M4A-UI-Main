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
  import { hodlAssociatedTokenAddressKeysMainNet,
    singlePayerAssociatedTokenAddressKeysMainNet,
    hodlAssociatedTokenAddressKeysDevNet,
    singlePayerAssociatedTokenAddressKeysDevNet } from '/src/assets/constants/Addresses.ts'

  export const StableCoins = reactive(
  [
    {
      tokenMintAddressString: "EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o",
      decimalAmount: 8,
      hodlATA: hodlAssociatedTokenAddressKeysMainNet.daiATA,
      singlePayerATA: singlePayerAssociatedTokenAddressKeysMainNet.daiATA,
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
      tokenMintAddressString: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",//Mainnet
      decimalAmount: 6,
      hodlATA: hodlAssociatedTokenAddressKeysMainNet.usdcATA,
      singlePayerATA: singlePayerAssociatedTokenAddressKeysMainNet.usdcATA,
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
    },
    {
      tokenMintAddressString: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",//Devnet
      decimalAmount: 6,
      hodlATA: hodlAssociatedTokenAddressKeysDevNet.usdcATA,
      singlePayerATA: singlePayerAssociatedTokenAddressKeysDevNet.usdcATA,
      asset: 
      {
        name: "USDC-Dev",
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
      tokenMintAddressString: "So11111111111111111111111111111111111111112",
      decimalAmount: 9,
      hodlATA: hodlAssociatedTokenAddressKeysMainNet.solATA,
      singlePayerATA: singlePayerAssociatedTokenAddressKeysMainNet.solATA,
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
      tokenMintAddressString: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
      decimalAmount: 8,
      hodlATA: hodlAssociatedTokenAddressKeysMainNet.wethATA,
      singlePayerATA: singlePayerAssociatedTokenAddressKeysMainNet.wethATA,
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
      tokenMintAddressString: "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh",
      decimalAmount: 8,
      hodlATA: hodlAssociatedTokenAddressKeysMainNet.wbtcATA,
      singlePayerATA: singlePayerAssociatedTokenAddressKeysMainNet.wbtcATA,
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
