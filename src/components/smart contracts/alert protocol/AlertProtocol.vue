<template>
  <DeadMansBreakCheck/>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { getDeadMansBreak,
  getAlertProtocolCEOAccount,
  getDeadMansBreakPDA,
  getSiteUpdateAlertPDA,
  getAlertProtocolCEOAccountPDA } from '/src/assets/contracts/Solana/AlertProtocol.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import DeadMansBreakCheck from './DeadMansBreakCheck.vue'

  var deadMansBreakWatchId: any
  var siteUpdateAlertWatcherId: any
  var alertProtocolCEOAccountWatcherId: any

  onMounted(async() =>
  {
    //Dead Man's Break
    const deadMansBreak = await getDeadMansBreak()
    await listenForChatQualityOfLifeAccountsChanges()
    if(deadMansBreak)
    {
      anchorPrograms.deadMansBreakTimeStamp = deadMansBreak.unixClockInTimeStamp
      anchorPrograms.isDeadMansBreakTripped = isDeadMansBreakTripped()
    }

    //WebSite Update Notice
    await listenForWebSiteUpdateNotices()

    //Alert Protocol CEO Account
    const alertCEOAccount = await getAlertProtocolCEOAccount()
    if(alertCEOAccount)
    {
      adminAccounts.isAlertCEOAccountReady = true
      adminAccounts.alertCEOAddress = alertCEOAccount.address.toBase58()
    }
    else
    {
      adminAccounts.isAlertCEOAccountReady = false
      await listenForAlertCEOAccountInitialization()
    }
  })

  onUnmounted(() => 
  {
    if(deadMansBreakWatchId != undefined)
    {
      anchorPrograms.alert.alertProgram.provider.connection.removeAccountChangeListener(deadMansBreakWatchId)
      deadMansBreakWatchId = undefined
    }
    if(siteUpdateAlertWatcherId != undefined)
    {
      anchorPrograms.alert.alertProgram.provider.connection.removeAccountChangeListener(siteUpdateAlertWatcherId)
      siteUpdateAlertWatcherId = undefined
    }
    if(alertProtocolCEOAccountWatcherId != undefined)
    {
      anchorPrograms.alert.alertProgram.provider.connection.removeAccountChangeListener(alertProtocolCEOAccountWatcherId)
      alertProtocolCEOAccountWatcherId = undefined
    }
  })

  function isDeadMansBreakTripped()
  {
    const currentUnixTimeStamp = new Date()/1000 //divide by 1000 since typescript/javascript time stamp is in mili seconds, but Solana time stamp is in seconds
    return currentUnixTimeStamp - anchorPrograms.deadMansBreakTimeStamp.toNumber() > anchorPrograms.secondsUntilDeadMansBreakTrips
  }

  async function listenForChatQualityOfLifeAccountsChanges()
  {
    try
    {
      const deadMansBreakPDA = getDeadMansBreakPDA()

      //Subscribe to account changes
      deadMansBreakWatchId = anchorPrograms.alert.alertProgram.provider.connection.onAccountChange(deadMansBreakPDA, async() => 
      {
        //Handle account change...
        const deadMansBreak = await getDeadMansBreak()
        anchorPrograms.deadMansBreakTimeStamp = deadMansBreak.unixClockInTimeStamp
        anchorPrograms.isDeadMansBreakTripped = isDeadMansBreakTripped()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForWebSiteUpdateNotices()
  {
    //Subscribe to account changes
    siteUpdateAlertWatcherId = anchorPrograms.alert.alertProgram.provider.connection.onAccountChange(getSiteUpdateAlertPDA(), () => 
    {
      //Handle account change..
      anchorPrograms.hasWebSiteBeenUpdated = true
    })
  }

  async function listenForAlertCEOAccountInitialization()
  {
    //Subscribe to account changes
    alertProtocolCEOAccountWatcherId = anchorPrograms.alert.alertProgram.provider.connection.onAccountChange(getAlertProtocolCEOAccountPDA(), async() => 
    {
      //Handle account change..
      const alertCEOAccount = await getAlertProtocolCEOAccount()
      adminAccounts.isAlertCEOAccountReady = true
      adminAccounts.alertCEOAddress = alertCEOAccount.address.toBase58()
      anchorPrograms.alert.alertProgram.provider.connection.removeAccountChangeListener(alertProtocolCEOAccountWatcherId)
      alertProtocolCEOAccountWatcherId = undefined
    })
  }
</script>