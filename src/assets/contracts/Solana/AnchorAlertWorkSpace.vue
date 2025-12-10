<script lang="ts">
  import { computed } from "vue"
  import { useAnchorWallet } from 'solana-wallets-vue'
  import { Connection, clusterApiUrl } from "@solana/web3.js"
  import { AnchorProvider, Program } from "@coral-xyz/anchor"
  import idl from "/src/assets/contracts/Solana/AlertProtocol.json"
  //import idl2 from "/src/assets/contracts/Solana/AlertProtocol2.json"
  import { AlertProtocol } from "./alert.ts"//including the type doesn't seem to help with auto complete/IDE suggestions when programing in the front end, not sure how to fix that
  import { DEV_MODE } from '/src/assets/globalStates/EnvironmentSettings.ts'

  const preflightCommitment = "processed"
  const commitment = "confirmed"

  var workspace: any = null
  var connection: any = null

  export const useAlertWorkspace = () => workspace
  export const initAlertWorkspace = () =>
  { 
    const wallet = useAnchorWallet()
    connection = new Connection(clusterApiUrl("devnet"), preflightCommitment)
    
    //It isn't neccessary to run the alert protocol against mainnet
    /*
    if(DEV_MODE)
    {
      //const connection = new Connection('http://127.0.0.1:8899') //For testing with local validator
      connection = new Connection(clusterApiUrl("devnet"), preflightCommitment)
    }
    else
    {
      connection = new Connection("https://solana-rpc.publicnode.com", preflightCommitment)
      //connection = new Connection(clusterApiUrl("mainnet-beta"), preflightCommitment) //mainnet-beta seems to refuse everything and doesn't allow testing
    }*/
    
    const provider = computed
    (
      () =>
        new AnchorProvider(connection, wallet.value,
        {
          preflightCommitment,
          commitment,
        },
      )
    )

    var alertProgram = computed(() => new Program(idl, provider.value) as Program<AlertProtocol>) 

    workspace =
    {
      wallet,
      connection,
      provider,
      alertProgram,
    }
  }

  export default useAlertWorkspace
</script>