<template>
    <Suspense><PriceUpdater/></Suspense>
    <Suspense><BalanceUpdater/></Suspense>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { getLendingProtocolCEOAccount,
  getTokenReserves,
  getSubMarkets,
  getLendingProtocolCEOAccountPDA,
  getLendingProtocolPDA,
  getSubMarketStatsPDA } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { tokenReserves } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarkets } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import PriceUpdater from './PriceUpdater.vue'
  import BalanceUpdater from './BalanceUpdater.vue'

  var lendingProtocolCEOAccountWatcherId: any

  var lendingProtocolWatcherId: any
  var subMarketStatsWatcherId: any

  onMounted(async() =>
  {
    //Token Reserves
    tokenReserves.data = await getTokenReserves()
    await listenForTokenReserveChanges()

    //SubMarkets
    subMarkets.data = await getSubMarkets()
    await listenForSubMarketChanges()

    //Lending Protocol CEO Account
    const lendingCEOAccount = await getLendingProtocolCEOAccount()
    if(lendingCEOAccount)
    {
      adminAccounts.isLendingCEOAccountReady = true
      adminAccounts.lendingCEOAddress = lendingCEOAccount.address.toBase58()
    }
    else
    {
      adminAccounts.isLendingCEOAccountReady = false
      await listenForLendingCEOAccountInitialization()
    }
  })

  onUnmounted(() => 
  {
    if(lendingProtocolWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(lendingProtocolWatcherId)
      lendingProtocolWatcherId = undefined
    }
    if(subMarketStatsWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(subMarketStatsWatcherId)
      subMarketStatsWatcherId = undefined
    }  
    if(lendingProtocolCEOAccountWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(lendingProtocolCEOAccountWatcherId)
      lendingProtocolCEOAccountWatcherId = undefined
    }    
  })

  async function listenForTokenReserveChanges()
  {
    //Subscribe to account changes
    lendingProtocolWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(getLendingProtocolPDA(), async() => 
    {
      //Handle account change..
      tokenReserves.data = await getTokenReserves()
    })
  }

  async function listenForSubMarketChanges()
  {
    //Subscribe to account changes
    subMarketStatsWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(getSubMarketStatsPDA(), async() => 
    {
      //Handle account change..
      subMarkets.data = await getSubMarkets()
    })
  }

  async function listenForLendingCEOAccountInitialization()
  {
    //Subscribe to account changes
    lendingProtocolCEOAccountWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(getLendingProtocolCEOAccountPDA(), async() => 
    {
      //Handle account change..
      const lendingCEOAccount = await getLendingProtocolCEOAccount()
      adminAccounts.isLendingCEOAccountReady = true
      adminAccounts.lendingCEOAddress = lendingCEOAccount.address.toBase58()
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(lendingProtocolCEOAccountWatcherId)
      lendingProtocolCEOAccountWatcherId = undefined
    })
  }
</script>