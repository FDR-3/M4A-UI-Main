<script lang="ts">
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

  export const StableCoins =
  [
    {
      tokenMintAddress: "EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o",
      asset: 
      {
        name: "DAI",
        svg: DAISVG,
        source: () => {sourceDAI()}
      },
      price: 1.00,
      apy: "4.44%",
      chain:
      {
        name: "Solana",
        svg: SOLSVG,
        source: () => {sourceSOL()}
      }
    },
    {
      tokenMintAddress: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
      asset: 
      {
        name: "USDC",
        svg: USDCSVG,
        source: () => {sourceUSDC()}
      },
      price: 1.00,
      apy: "4.44%",
      chain:
      {
        name: "Solana",
        svg: SOLSVG,
        source: () => {sourceSOL()}
      }
    }
  ]

  export const CryptoCurrency =
  [
    {
      tokenMintAddress: "So11111111111111111111111111111111111111112",
      asset: 
      {
        name: "Sol",
        svg: SOLSVG,
        source: () => {sourceSOL()}
      },
      price: 212.98,
      apy: "4.44%",
      chain:
      {
        name: "Solana",
        svg: SOLSVG,
        source: () => {sourceSOL()}
      }
    },
    {
      tokenMintAddress: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
      asset: 
      {
        name: "WEth",
        svg: WEthSVG,
        source: () => {sourceWEth()}
      },
      price: 4292.44,
      apy: "4.44%",
      chain:
      {
        name: "Solana",
        svg: SOLSVG,
        source: () => {sourceSOL()}
      }
    },
    {
      tokenMintAddress: "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh",
      asset: 
      {
        name: "WBtc",
        svg: WBtcSVG,
        source: () => {sourceWBtc()}
      },
      price: 110645.87,
      apy: "4.44%",
      chain:
      {
        name: "Solana",
        svg: SOLSVG,
        source: () => {sourceSOL()}
      }
    },
  ]

export default StableCoins
</script>
