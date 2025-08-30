<script lang="ts">
  import USDCSVG from '/src/assets/cryptoIcons/usdc-svg.vue'
  import SOLSVG from '/src/assets/cryptoIcons/sol-svg.vue'
  import { sourceUSDC, sourceSOL} from '/src/assets/helperFunctions/sources.ts'

  export const StableCoins = [
  /*{
    asset: 
    {
      image: "pyusd2.webp",
      name: "PYUSD",
      type: "Stable Coin" 
    },
    price: "$1.00",
    apy: "8.0%",
    app:
    {
      image: "marginfi.svg",
      name: "MarginFi"
    },
    chain:
    {
      image: "sol.svg",
      name: "Solana"
    }
  },*/
  {
    asset: 
    {
      name: "USDC",
      type: "Stable Coin",
      svg: USDCSVG,
      source: () => {sourceUSDC()}
    },
    price: "$1.00",
    apy: "4.84%",
    app:
    {
      image: "marginfi.svg",
      name: "MarginFi"
    },
    chain:
    {
      name: "Solana",
      svg: SOLSVG,
      source: () => {sourceSOL()}
    }
  }/*,
  {
    asset: 
    {
      image: "dai.svg",
      name: "DAI",
      type: "Stable Coin"  
    },
    price: "$1.00",
    apy: "5.0%",
    app:
    {
      image: "aave.svg",
      name: "Aave"
    },
    chain:
    {
      image: "matic.svg",
      name: "Polygon"
    }
  }*/]

//Crypto Currencies
  export const CryptoCurrency = [
  {
    asset: 
    {
      image: "sol.svg",
      name: "Sol",
      type: "Crypto Currency",
      url: "https://logowik.com/solana-logo-vector-svg-pdf-ai-eps-cdr-free-download-19832.html"
    },
    price: "$2,220.00",
    apy: "5.0%",
    app:
    {
      image: "marginfi.svg",
      name: "MarginFi"
    },
    chain:
    {
      image: "sol.svg",
      name: "Solana",
      url: "https://logowik.com/solana-logo-vector-svg-pdf-ai-eps-cdr-free-download-19832.html"
    }
  },
  {
    asset: 
    {
      image: "eth.svg",
      name: "ETH",
      type: "Crypto Currency"  
    },
    price: "$2,220.00",
    apy: "5.0%",
    app:
    {
      image: "radiant.png",
      name: "Radiant"
    },
    chain:
    {
      image: "base.png",
      name: "Base"
    }
  },
  {
    asset: 
    {
      image: "wbtc.svg",
      name: "WBTC",
      type: "Crypto Currency"  
    },
    price: "$52,150.00",
    apy: "0.31%",
    app:
    {
      image: "radiant.png",
      name: "Radiant"
    },
    chain:
    {
      image: "base.png",
      name: "Base"
    }
  },
  {
    asset: 
    {
      image: "maticx.svg",
      name: "MaticX",
      type: "Crypto Currency"  
    },
    price: "$0.30",
    apy: "2.0%",
    app:
    {
      image: "mesh.svg",
      name: "Mesh"
    },
    chain:
    {
      image: "matic.svg",
      name: "Polygon"
    }
  },
  {
    asset: 
    {
      image: "avax.svg",
      name: "Avax",
      type: "Crypto Currency"  
    },
    price: "$31.00",
    apy: "7.0%",
    app:
    {
      image: "benqi.svg",
      name: "Benqi"
    },
    chain:
    {
      image: "avax.svg",
      name: "Avax"
    }
  },
]

export default StableCoins
</script>
