<template>
    <Suspense><PriceUpdater/></Suspense>
    <Suspense><WalletBalanceUpdater/></Suspense>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { getLendingProtocol,
  getLendingProtocolCEOAccount,
  getTokenReserves,
  setTokenReserveHashMap,
  getSubMarkets,
  getLendingUserMonthlyStatementsWrapper,
  setLendingUserAccountHashMap,
  setLendingUserTabHashMaps,
  setLendingUserPortfolioHashMaps,
  setMonthlyStementHashMapAndLendingLeaderBoard,
  getLendingProtocolPDA,
  getLendingProtocolCEOAccountPDA,
  getTokenReserveStatsPDA,
  getSubMarketStatsPDA,
  getLendingStatsPDA,
  getUserLendingStatsPDA } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { tokenReserves } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarkets } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserMonthlyStatements } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { anchorPrograms, monthList } from '/src/assets/globalStates/AnchorPrograms.vue'
  import PriceUpdater from './PriceUpdater.vue'
  import WalletBalanceUpdater from './WalletBalanceUpdater.vue'

  var lendingProtocolWatcherId: any
  var lendingProtocolCEOAccountWatcherId: any
  var tokenReserveStatsWatcherId: any
  var subMarketStatsWatcherId: any
  var lendingStatsWatcherId: any
  var lendingUserStatsWatcherId: any 

  onMounted(async() =>
  {
    //Lending Protocol CEO Account 
    const lendingCEOAccount = await getLendingProtocolCEOAccount()
    if(lendingCEOAccount)
    {
      adminAccounts.isLendingCEOAccountReady = true
      adminAccounts.lendingCEOAddressKey = lendingCEOAccount.address
      adminAccounts.lendingCEOAddressString = lendingCEOAccount.address.toBase58()
    }
    else
    {
      adminAccounts.isLendingCEOAccountReady = false
      await listenForLendingCEOAccountInitialization()
    }

    //Token Reserves
    tokenReserves.data = await getTokenReserves()
    
    setTokenReserveHashMap()
    await listenForNewTokenChanges()

    //SubMarkets
    subMarkets.data = await getSubMarkets()
    await listenForSubMarketChanges()

    //Lending Users
    await setLendingUserAccountHashMap()
    await setLendingUserTabHashMaps() //adminAccounts.lendingCEOAddressString needs to be set before this is called
    lendingUserMonthlyStatements.data = await getLendingUserMonthlyStatementsWrapper()
    await setLendingUserPortfolioHashMaps()
    await setMonthlyStementHashMapAndLendingLeaderBoard()
    await listenForLendingStatChanges()
    await listenForLendingUserStatChanges()

    //Lending Protocol (Current Statement Info)
    const lendingProtocol = await getLendingProtocol()
    if(lendingProtocol)
    {
      anchorPrograms.currentStatementMonth = monthList[lendingProtocol.currentStatementMonth-1].monthName
      anchorPrograms.currentStatementYear = lendingProtocol.currentStatementYear
    }
    await listenForLendingProtocolChanges()
  })

  onUnmounted(() => 
  {
    if(tokenReserveStatsWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(tokenReserveStatsWatcherId)
      tokenReserveStatsWatcherId = undefined
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
    if(lendingProtocolWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(lendingProtocolWatcherId)
      lendingProtocolWatcherId = undefined
    }
  })

  async function listenForNewTokenChanges()
  {
    //Subscribe to account changes
    tokenReserveStatsWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(getTokenReserveStatsPDA(), async() => 
    {
      //Handle account change..
      tokenReserves.data = await getTokenReserves()
      setTokenReserveHashMap()
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
      setTokenReserveHashMap()
      subMarkets.data = await getSubMarkets()
      lendingUserMonthlyStatements.data = await getLendingUserMonthlyStatementsWrapper()
    
      await setLendingUserAccountHashMap()
      await setLendingUserTabHashMaps()
      await setLendingUserPortfolioHashMaps()
      await setMonthlyStementHashMapAndLendingLeaderBoard()
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

  async function listenForLendingProtocolChanges()
  {
    //Subscribe to account changes
    lendingProtocolWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(getLendingProtocolPDA(), async() => 
    {
      //Handle account change..
      const lendingProtocol = await getLendingProtocol()
      anchorPrograms.currentStatementMonth = monthList[lendingProtocol.currentStatementMonth-1].monthName
      anchorPrograms.currentStatementYear = lendingProtocol.currentStatementYear
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
      adminAccounts.lendingCEOAddressKey = lendingCEOAccount.address
      adminAccounts.lendingCEOAddressString = lendingCEOAccount.address.toBase58()
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(lendingProtocolCEOAccountWatcherId)
      lendingProtocolCEOAccountWatcherId = undefined
    })
  }
</script>