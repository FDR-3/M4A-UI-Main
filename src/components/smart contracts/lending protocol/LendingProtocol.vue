<template>
    <Suspense><PriceUpdater/></Suspense>
    <Suspense><BalanceUpdater/></Suspense>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { getLendingProtocolCEOAccount,
  getTokenReserves,
  getSubMarkets,
  setLendingUserAccountHashMap,
  setLendingUserObligationsHashMap,
  getLendingProtocolCEOAccountPDA,
  getTokenReserveStatsPDA,
  getSubMarketStatsPDA,
  getLendingStatsPDA,
  getUserLendingStatsPDA } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { tokenReserves } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarkets } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import PriceUpdater from './PriceUpdater.vue'
  import BalanceUpdater from './BalanceUpdater.vue'

  var lendingProtocolCEOAccountWatcherId: any

  var lendingProtocolWatcherId: any
  var subMarketStatsWatcherId: any
  var lendingStatsWatcherId: any
  var lendingUserStatsWatcherId: any 

  onMounted(async() =>
  {
    //Token Reserves
    tokenReserves.data = await getTokenReserves()
    await listenForNewTokenReserves()

    //SubMarkets
    subMarkets.data = await getSubMarkets()
    await listenForSubMarketChanges()

    //Lending Users
    await setLendingUserAccountHashMap()
    await setLendingUserObligationsHashMap()
    await listenForLendingStatChanges()
    await listenForLendingUserStatChanges()

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
    if(lendingStatsWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(lendingStatsWatcherId)
      lendingStatsWatcherId = undefined
    }
    if(lendingUserStatsWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(lendingUserStatsWatcherId)
      lendingUserStatsWatcherId = undefined
    }
    if(lendingProtocolCEOAccountWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(lendingProtocolCEOAccountWatcherId)
      lendingProtocolCEOAccountWatcherId = undefined
    }    
  })

  async function listenForNewTokenReserves()
  {
    //Subscribe to account changes
    lendingProtocolWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(getTokenReserveStatsPDA(), async() => 
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

  async function listenForLendingStatChanges()
  {
    //Subscribe to account changes
    lendingStatsWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(getLendingStatsPDA(), async() => 
    {
      //Handle account change..
      tokenReserves.data = await getTokenReserves()
      subMarkets.data = await getSubMarkets()
      await setLendingUserAccountHashMap()
      await setLendingUserObligationsHashMap()
    })
  }

  async function listenForLendingUserStatChanges()
  {
    //Subscribe to account changes
    lendingUserStatsWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(getUserLendingStatsPDA(), async() => 
    {
      //Handle account change..
      await setLendingUserAccountHashMap()
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