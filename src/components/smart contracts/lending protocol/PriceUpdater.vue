<template></template>
<script async setup lang="ts">
  import { onUnmounted } from 'vue'
  import { tokenAddressStrings } from '/src/assets/constants/Addresses.ts'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
  import { priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  
  var intervalId: any

  var usdcTokenMintAddressMainNet = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  var usdcTokenMintAddressDevNet = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"

  await getTokenPrices()

  onUnmounted(() =>
  {
    if(intervalId != undefined)
    {
      clearInterval(intervalId)
      intervalId = undefined
    }
  })

  async function getTokenPrices()
  {
    await fetchPrices()

    intervalId = setInterval(async() => 
    {
      await fetchPrices()
    }, 2222)
  }

  async function fetchPrices()
  {
    console.log("Updating Prices")

    const price = await(await fetch
    (
      "https://lite-api.jup.ag/price/v3?ids=" +
      `${tokenAddressStrings.daiTokenMintAddress},` +
      `${usdcTokenMintAddressMainNet},` +
      `${tokenAddressStrings.solTokenMintAddress},` +
      `${tokenAddressStrings.wethTokenMintAddress},` +
      `${tokenAddressStrings.wbtcTokenMintAddress}`
    )).json()

    for(var i=0; i<StableCoins.length; i++)
    {
      //Update Price for Dev USDC
      if(StableCoins[i].tokenMintAddressString == usdcTokenMintAddressDevNet)
      {
        StableCoins[i].price = price[usdcTokenMintAddressMainNet].usdPrice
        StableCoins[i].priceString = '$' + price[usdcTokenMintAddressMainNet].usdPrice.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })
        StableCoins[i].percentChange24h = price[usdcTokenMintAddressMainNet].priceChange24h.toFixed(2)
        price[usdcTokenMintAddressDevNet] = price[usdcTokenMintAddressMainNet]
        continue
      }

      StableCoins[i].price = price[StableCoins[i].tokenMintAddressString].usdPrice
      StableCoins[i].priceString = '$' + price[StableCoins[i].tokenMintAddressString].usdPrice.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

      if(typeof StableCoins[i].percentChange24h === 'number')//Seems like sometimes just these come back empty
        StableCoins[i].percentChange24h = price[StableCoins[i].tokenMintAddressString].priceChange24h.toFixed(2)
      else
        StableCoins[i].percentChange24h = (0).toFixed(2)
    }

    for(var i=0; i<CryptoCurrency.length; i++)
    {
      CryptoCurrency[i].price = price[CryptoCurrency[i].tokenMintAddressString].usdPrice
      CryptoCurrency[i].priceString = '$' + price[CryptoCurrency[i].tokenMintAddressString].usdPrice.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })
      CryptoCurrency[i].percentChange24h = price[CryptoCurrency[i].tokenMintAddressString].priceChange24h.toFixed(2)
    }

    if(price)
      priceObjectMap.data = price
  }
</script>