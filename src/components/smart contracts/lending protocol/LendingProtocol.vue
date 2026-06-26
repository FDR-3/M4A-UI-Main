<template>
    <Suspense><PriceUpdater/></Suspense>
    <Suspense><WalletBalanceUpdater/></Suspense>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { getLendingProtocol,
  getLendingProtocolCEOAccount,
  getTokenReserves,
  setTokenReserveFontEndInfoHashMap,
  getSubMarkets,
  getLendingUserMonthlyStatementsWrapper,
  setLendingUserAccountHashMap,
  setLendingUserTabHashMapsAndLendingLeaderBoard,
  setLendingUserPortfolioHashMaps,
  setMonthlyStatementHashMap,
  getLendingProtocolPDA,
  getLendingProtocolCEOAccountPDA,
  getTokenReserveStatsPDA,
  getSubMarketStatsPDA,
  getLendingStatsPDA,
  getUserLendingStatsPDA,
  getAddressLookUpTableProgramAccountWrapper,
  setSubMarketLookUpTableHashMap } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { tokenReserves } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarkets } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserMonthlyStatements } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { anchorPrograms, monthList } from '/src/assets/globalStates/AnchorPrograms.vue'
  import PriceUpdater from './PriceUpdater.vue'
  import WalletBalanceUpdater from './WalletBalanceUpdater.vue'
  import { sleep } from '/src/assets/helperFunctions/sleep.ts'

  var lendingProtocolWatcherId: any
  var lendingProtocolCEOAccountWatcherId: any
  var tokenReserveStatsWatcherId: any
  var subMarketStatsWatcherId: any
  var lendingStatsWatcherId: any
  var lendingUserStatsWatcherId: any 

  onMounted(async() =>
  {
    //Lending Protocol (Current Statement Info)
    const lendingProtocol = await getLendingProtocol()
    if(lendingProtocol)
    {
      anchorPrograms.currentStatementMonthName = monthList[lendingProtocol.currentStatementMonth-1].monthName
      anchorPrograms.currentStatementMonthNumber = lendingProtocol.currentStatementMonth
      anchorPrograms.currentStatementYear = lendingProtocol.currentStatementYear
      anchorPrograms.lendingProtocolLookUpTableAddress = lendingProtocol.lookUpTableAddress
      anchorPrograms.lendingProtocolLookUpTableAccount = await getAddressLookUpTableProgramAccountWrapper(anchorPrograms.lendingProtocolLookUpTableAddress)
      anchorPrograms.isLendingProtocolInitialized = true
    }
    await listenForLendingProtocolChanges()

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
      listenForLendingCEOAccountInitialization()
    }

    //Token Reserves
    tokenReserves.data = await getTokenReserves()
    
    setTokenReserveFontEndInfoHashMap()
    await listenForTokenReserveChanges()

    //SubMarkets
    subMarkets.data = await getSubMarkets()
    await setSubMarketLookUpTableHashMap()
    await listenForSubMarketChanges()

    //Lending Users
    await setLendingUserAccountHashMap()
    await setLendingUserTabHashMapsAndLendingLeaderBoard() //adminAccounts.lendingCEOAddressString needs to be set before this is called
    lendingUserMonthlyStatements.data = await getLendingUserMonthlyStatementsWrapper()
    await setLendingUserPortfolioHashMaps()
    await setMonthlyStatementHashMap()
    await listenForLendingStatChanges()
    await listenForLendingUserStatChanges()

    anchorPrograms.isLendingProtocolReady = true
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

  async function listenForTokenReserveChanges()
  {
    //Subscribe to account changes
    tokenReserveStatsWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(getTokenReserveStatsPDA(), async() => 
    {
      //Handle account change..
      tokenReserves.data = await getTokenReserves()
      setTokenReserveFontEndInfoHashMap()

      await sleep(1000) //1000 milliseconds = 1 second. Waiting for next block slot if a new token reserve pda was added to look up table
      anchorPrograms.lendingProtocolLookUpTableAccount = await getAddressLookUpTableProgramAccountWrapper(anchorPrograms.lendingProtocolLookUpTableAddress)
    })
  }

  async function listenForSubMarketChanges()
  {
    //Subscribe to account changes
    subMarketStatsWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(getSubMarketStatsPDA(), async() => 
    {
      //Handle account change..
      subMarkets.data = await getSubMarkets()

      await setSubMarketLookUpTableHashMap()
    })
  }

  async function listenForLendingStatChanges()
  {
    //Subscribe to account changes
    lendingStatsWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(getLendingStatsPDA(), async() => 
    {
      //Handle account change..
      tokenReserves.data = await getTokenReserves()
      setTokenReserveFontEndInfoHashMap()
      subMarkets.data = await getSubMarkets()
      lendingUserMonthlyStatements.data = await getLendingUserMonthlyStatementsWrapper()
    
      await setLendingUserAccountHashMap()
      await setLendingUserTabHashMapsAndLendingLeaderBoard()
      await setLendingUserPortfolioHashMaps()
      await setMonthlyStatementHashMap()
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
    lendingProtocolWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(getLendingProtocolPDA(),
    async(accountInfo: { data: Uint8Array<ArrayBufferLike> }) => 
    {
      //Handle account change..
      const lendingProtocol = anchorPrograms.lending.lendingProgram.account.lendingProtocol.coder.accounts.decode("lendingProtocol", accountInfo.data)

      anchorPrograms.currentStatementMonthName = monthList[lendingProtocol.currentStatementMonth-1].monthName
      anchorPrograms.currentStatementMonthNumber = lendingProtocol.currentStatementMonth
      anchorPrograms.currentStatementYear = lendingProtocol.currentStatementYear
      anchorPrograms.lendingProtocolLookUpTableAddress = lendingProtocol.lookUpTableAddress

      if(!anchorPrograms.lendingProtocolLookUpTableAccount)
        anchorPrograms.lendingProtocolLookUpTableAccount = await getAddressLookUpTableProgramAccountWrapper(anchorPrograms.lendingProtocolLookUpTableAddress)
      if(!anchorPrograms.isLendingProtocolInitialized)
        anchorPrograms.isLendingProtocolInitialized = true
    })
  }

  function listenForLendingCEOAccountInitialization()
  {
    //Subscribe to account changes
    lendingProtocolCEOAccountWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(getLendingProtocolCEOAccountPDA(),
    (accountInfo: { data: Uint8Array<ArrayBufferLike> }) => 
    {
      //Handle account change..
      //const lendingCEOAccount = await getLendingProtocolCEOAccount()
      const lendingCEOAccount = anchorPrograms.lending.lendingProgram.account.lendingProtocolCeo.coder.accounts.decode("lendingProtocolCeo", accountInfo.data)
      adminAccounts.isLendingCEOAccountReady = true
      adminAccounts.lendingCEOAddressKey = lendingCEOAccount.address
      adminAccounts.lendingCEOAddressString = lendingCEOAccount.address.toBase58()
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(lendingProtocolCEOAccountWatcherId)
      lendingProtocolCEOAccountWatcherId = undefined
    })
  }
</script>