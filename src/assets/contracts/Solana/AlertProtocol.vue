<script lang="ts">
  import * as anchor from "@coral-xyz/anchor"
  import { PublicKey } from "@solana/web3.js"
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { sleep, MAX_RETRY_FETCH, RETRY_TIME_OUT, RETRY_MESSAGE, ERROR_429 } from '/src/assets/helperFunctions/sleep.ts'

  export async function getDeadMansBreak()
  {
    console.log("Get Dead Man's Break")

    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.alert.alertProgram.account.deadMansBreakAlert.fetch(getDeadMansBreakPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Alert Protocol Not Initialized. No DeadMansBreakTimeStamp")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getAlertProtocolCEOAccount()
  {
    console.log("Getting Alert Protocol CEO Account")

    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.alert.alertProgram.account.alertProtocolCeo.fetch(getAlertProtocolCEOAccountPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Alert CEO Account Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getSiteUpdateAlertAccount()
  {
    console.log("Getting Site Update Alert Account")

    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.alert.alertProgram.account.siteUpdateAlert.fetch(getSiteUpdateAlertPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Site Update Alert Account Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export function getDeadMansBreakPDA()
  {
    const [deadMansBreakPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("deadMansBreakAlert")
      ],
      anchorPrograms.alert.alertProgram.programId
    )
    return deadMansBreakPDA
  }

  export function getSiteUpdateAlertPDA()
  {
    const [siteUpdateAlertPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("siteUpdateAlert")
      ],
      anchorPrograms.alert.alertProgram.programId
    )
    return siteUpdateAlertPDA
  }

  export function getAlertProtocolCEOAccountPDA()
  {
    const [alertProtocolCEOPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("alertProtocolCEO")
      ],
      anchorPrograms.alert.alertProgram.programId
    )
    return alertProtocolCEOPDA
  }

  export default getDeadMansBreak
</script>