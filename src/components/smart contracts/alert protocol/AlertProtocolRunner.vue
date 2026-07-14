<template>
  <DeadMansBreakCheck/>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { getDeadMansBreak,
  getAlertProtocolCEOAccount,
  getSiteUpdateAlertAccount,
  getDeadMansBreakPDA,
  getSiteUpdateAlertPDA,
  getAlertProtocolCEOAccountPDA } from '/src/assets/contracts/Solana/AlertProtocol.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import DeadMansBreakCheck from './DeadMansBreakCheck.vue'
  import { sleep, MAX_RETRY_FETCH, RETRY_TIME_OUT, RETRY_MESSAGE, ERROR_429 } from '/src/assets/helperFunctions/sleep.ts'

  var deadMansBreakWatchId: any
  var siteUpdateAlertWatcherId: any
  var alertProtocolCEOAccountWatcherId: any

  var alertCounter: any = undefined //This is used to prevent false positives on website update alerts. Sometimes the listner just goes off, so we want to be sure there was actually an update.

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
    const siteUpdateAlertAccount = await getSiteUpdateAlertAccount()
    if(siteUpdateAlertAccount)
      alertCounter = siteUpdateAlertAccount.siteUpdateCount
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
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        deadMansBreakWatchId = anchorPrograms.alert.alertProgram.provider.connection.onAccountChange(getDeadMansBreakPDA(), async() => 
        {
          //Handle account change...
          const deadMansBreak = await getDeadMansBreak()
          anchorPrograms.deadMansBreakTimeStamp = deadMansBreak.unixClockInTimeStamp
          anchorPrograms.isDeadMansBreakTripped = isDeadMansBreakTripped()
        })

        break
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
          console.error(error)
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  async function listenForWebSiteUpdateNotices()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        siteUpdateAlertWatcherId = anchorPrograms.alert.alertProgram.provider.connection.onAccountChange(getSiteUpdateAlertPDA(), async() => 
        {
          //Handle account change..
          const siteUpdateAlertAccount = await getSiteUpdateAlertAccount()
          if(alertCounter == undefined)
            alertCounter = siteUpdateAlertAccount.siteUpdateCount
          else if(alertCounter.lt(siteUpdateAlertAccount.siteUpdateCount))
          {
            alertCounter = siteUpdateAlertAccount.siteUpdateCount
            anchorPrograms.hasWebSiteBeenUpdated = true
          }
        })

        break
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
          console.error(error)
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  async function listenForAlertCEOAccountInitialization()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
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

        break
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
          console.error(error)
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }
</script>