<template></template>
<script async setup lang="ts">
    import { onUnmounted } from 'vue'
    import { tokenAddressStringsMainNet } from '/src/assets/constants/TokenAddresses.ts'
    import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
    
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
        }, 5000)
    }

    async function fetchPrices()
    {
        console.log("Updating Prices")

        const price = await(await fetch
        (
            "https://lite-api.jup.ag/price/v3?ids=" +
            `${tokenAddressStringsMainNet.DAITokenMintAddress},` +
            `${tokenAddressStringsMainNet.USDCTokenMintAddress},` +
            `${tokenAddressStringsMainNet.SOLTokenMintAddress},` +
            `${tokenAddressStringsMainNet.WETHTokenMintAddress},` +
            `${tokenAddressStringsMainNet.WBTCTokenMintAddress}`
        )).json()

        for(var i=0; i<StableCoins.length; i++)
        {
            if(!price[StableCoins[i].tokenMintAddress])
                continue

            StableCoins[i].price = price[StableCoins[i].tokenMintAddress].usdPrice
        }

        for(var i=0; i<CryptoCurrency.length; i++)
        {
            if(!price[CryptoCurrency[i].tokenMintAddress])
                continue

            CryptoCurrency[i].price = price[CryptoCurrency[i].tokenMintAddress].usdPrice
        }
    }
</script>