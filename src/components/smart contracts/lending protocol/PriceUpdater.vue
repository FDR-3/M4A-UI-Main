<template></template>
<script async setup lang="ts">
  import { onUnmounted } from 'vue'
  import { tokenAddressStrings, jupiterPriceUpdateMainnetTokenAddressStrings } from '/src/assets/constants/Addresses.ts'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
  import { priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { DEV_MODE } from '/src/assets/globalStates/EnvironmentSettings.ts'
  
  var intervalId: any

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
      `${jupiterPriceUpdateMainnetTokenAddressStrings.daiTokenMintAddress},` +
      `${jupiterPriceUpdateMainnetTokenAddressStrings.usdcTokenMintAddress},` +
      `${jupiterPriceUpdateMainnetTokenAddressStrings.solTokenMintAddress},` +
      `${jupiterPriceUpdateMainnetTokenAddressStrings.wethTokenMintAddress},` +
      `${jupiterPriceUpdateMainnetTokenAddressStrings.wbtcTokenMintAddress}`
    )).json()

    for(var i=0; i<StableCoins.length; i++)
    {
      if(DEV_MODE)
      {
        //Update Price for Dev DAI
        if(StableCoins[i].tokenMintAddressString == tokenAddressStrings.daiTokenMintAddress)
        {
          StableCoins[i].price = price[jupiterPriceUpdateMainnetTokenAddressStrings.daiTokenMintAddress].usdPrice
          StableCoins[i].priceString = '$' + price[jupiterPriceUpdateMainnetTokenAddressStrings.daiTokenMintAddress].usdPrice.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 })
          StableCoins[i].percentChange24h = price[jupiterPriceUpdateMainnetTokenAddressStrings.daiTokenMintAddress].priceChange24h.toFixed(2)
          price[tokenAddressStrings.daiTokenMintAddress] = price[jupiterPriceUpdateMainnetTokenAddressStrings.daiTokenMintAddress]
          continue
        }

        //Update Price for Dev USDC
        if(StableCoins[i].tokenMintAddressString == tokenAddressStrings.usdcTokenMintAddress)
        {
          StableCoins[i].price = price[jupiterPriceUpdateMainnetTokenAddressStrings.usdcTokenMintAddress].usdPrice
          StableCoins[i].priceString = '$' + price[jupiterPriceUpdateMainnetTokenAddressStrings.usdcTokenMintAddress].usdPrice.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 })
          StableCoins[i].percentChange24h = price[jupiterPriceUpdateMainnetTokenAddressStrings.usdcTokenMintAddress].priceChange24h.toFixed(2)
          price[tokenAddressStrings.usdcTokenMintAddress] = price[jupiterPriceUpdateMainnetTokenAddressStrings.usdcTokenMintAddress]
          continue
        }
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
      if(DEV_MODE)
      {
        //Update Price for Dev WEth
        if(CryptoCurrency[i].tokenMintAddressString == tokenAddressStrings.wethTokenMintAddress)
        {
          CryptoCurrency[i].price = price[jupiterPriceUpdateMainnetTokenAddressStrings.wethTokenMintAddress].usdPrice
          CryptoCurrency[i].priceString = '$' + price[jupiterPriceUpdateMainnetTokenAddressStrings.wethTokenMintAddress].usdPrice.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 })
          CryptoCurrency[i].percentChange24h = price[jupiterPriceUpdateMainnetTokenAddressStrings.wethTokenMintAddress].priceChange24h.toFixed(2)
          price[tokenAddressStrings.wethTokenMintAddress] = price[jupiterPriceUpdateMainnetTokenAddressStrings.wethTokenMintAddress]
          continue
        }

        //Update Price for Dev WBtc
        if(CryptoCurrency[i].tokenMintAddressString == tokenAddressStrings.wbtcTokenMintAddress)
        {
          CryptoCurrency[i].price = price[jupiterPriceUpdateMainnetTokenAddressStrings.wbtcTokenMintAddress].usdPrice
          CryptoCurrency[i].priceString = '$' + price[jupiterPriceUpdateMainnetTokenAddressStrings.wbtcTokenMintAddress].usdPrice.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 })
          CryptoCurrency[i].percentChange24h = price[jupiterPriceUpdateMainnetTokenAddressStrings.wbtcTokenMintAddress].priceChange24h.toFixed(2)
          price[tokenAddressStrings.wbtcTokenMintAddress] = price[jupiterPriceUpdateMainnetTokenAddressStrings.wbtcTokenMintAddress]
          continue
        }
      }

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