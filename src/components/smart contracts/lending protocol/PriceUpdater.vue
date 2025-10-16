<template></template>
<script async setup lang="ts">
  import { onUnmounted } from 'vue'
  import { tokenAddressStringsMainNet, tokenAddressStringsDevNet } from '/src/assets/constants/Addresses.ts'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
  import { priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  
  var intervalId: any

  await getTokenPrices()

  onUnmounted(() =>
  {
    if(intervalId != undefined)
    {
      clearInterval(intervalId);
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
      `${tokenAddressStringsMainNet.daiTokenMintAddress},` +
      `${tokenAddressStringsMainNet.usdcTokenMintAddress},` +
      `${tokenAddressStringsMainNet.solTokenMintAddress},` +
      `${tokenAddressStringsMainNet.wethTokenMintAddress},` +
      `${tokenAddressStringsMainNet.wbtcTokenMintAddress}`
    )).json()

    for(var i=0; i<StableCoins.length; i++)
    {
      //Update Price for Dev USDC
      if(StableCoins[i].tokenMintAddressString == tokenAddressStringsDevNet.usdcTokenMintAddress)
      {
        StableCoins[i].price = price[tokenAddressStringsMainNet.usdcTokenMintAddress].usdPrice
        StableCoins[i].priceString = '$' + price[tokenAddressStringsMainNet.usdcTokenMintAddress].usdPrice.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })
        StableCoins[i].percentChange24h = price[tokenAddressStringsMainNet.usdcTokenMintAddress].priceChange24h.toFixed(2)
        price[tokenAddressStringsDevNet.usdcTokenMintAddress] = price[tokenAddressStringsMainNet.usdcTokenMintAddress]
        continue
      }

      StableCoins[i].price = price[StableCoins[i].tokenMintAddressString].usdPrice
      StableCoins[i].priceString = '$' + price[StableCoins[i].tokenMintAddressString].usdPrice.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })
      if(StableCoins[i].percentChange24h)//Seems like sometimes just these come back empty
        StableCoins[i].percentChange24h = price[StableCoins[i].tokenMintAddressString].priceChange24h.toFixed(2)
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