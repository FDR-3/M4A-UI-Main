<script lang="ts">
  import { computed } from "vue"
  import { useAnchorWallet } from 'solana-wallets-vue'
  import { Connection, clusterApiUrl } from "@solana/web3.js"
  import { AnchorProvider, Program } from "@coral-xyz/anchor"
  import idl from "/src/assets/contracts/Solana/AlertProtocol.json"
  //import idl2 from "/src/assets/contracts/Solana/AlertProtocol2.json"
  import { AlertProtocol } from "./alert.ts"//including the type doesn't seem to help with auto complete/IDE suggestions when programing in the front end, not sure how to fix that
  import { DEV_MODE } from '/src/assets/globalStates/EnvironmentSettings.ts'
  import { isProduction } from '/src/assets/helperFunctions/browserHelper.ts'

  const preflightCommitment = "processed"
  const commitment = "confirmed"

  var workspace: any = null
  var connection: any = null

  export const useAlertWorkspace = () => workspace
  export const initAlertWorkspace = () =>
  { 
    const wallet = useAnchorWallet()
    connection = new Connection(clusterApiUrl("devnet"), preflightCommitment)//Interchangeable with "https://api.devnet.solana.com"
    //connection = new Connection("https://api.devnet.solana.com", preflightCommitment)//Interchangeable with clusterApiUrl("devnet")
    
    //It isn't neccessary to run the alert protocol against mainnet
    /*
    if(isProduction())
      connection = new Connection("https://m4a.io/proxyCORS", preflightCommitment)
    else
      connection = DEV_MODE ? new Connection(clusterApiUrl("devnet"), preflightCommitment) : new Connection("https://solana-rpc.publicnode.com", preflightCommitment)//Interchangeable with "https://api.devnet.solana.com"
      //connection = DEV_MODE ? new Connection("https://api.devnet.solana.com", preflightCommitment) : new Connection("https://solana-rpc.publicnode.com", preflightCommitment)//Interchangeable with "https://api.devnet.solana.com"
    */
    
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