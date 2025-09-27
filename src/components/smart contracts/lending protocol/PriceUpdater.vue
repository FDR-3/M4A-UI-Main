<template></template>
<script async setup lang="ts">
    import { onUnmounted } from 'vue'
    import { tokenAddressStringsMainNet } from '/src/assets/constants/Addresses.ts'
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
        }, 2000)
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

        for(var i=0; i<price.length; i++)
        {
            console.log(price)
        }

        for(var i=0; i<StableCoins.length; i++)
        {
            if(!price[StableCoins[i].tokenMintAddress])
                continue

            StableCoins[i].price = price[StableCoins[i].tokenMintAddress].usdPrice
            StableCoins[i].percentChange24h = price[StableCoins[i].tokenMintAddress].priceChange24h.toFixed(2)
        }

        for(var i=0; i<CryptoCurrency.length; i++)
        {
            if(!price[CryptoCurrency[i].tokenMintAddress])
                continue

            CryptoCurrency[i].price = price[CryptoCurrency[i].tokenMintAddress].usdPrice
            CryptoCurrency[i].percentChange24h = price[CryptoCurrency[i].tokenMintAddress].priceChange24h.toFixed(2)
        }

        if(price)
            priceObjectMap.data = price
    }
</script>