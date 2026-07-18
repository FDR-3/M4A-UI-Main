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
    //connection = new Connection(clusterApiUrl("devnet")/*Interchangeable with "https://api.devnet.solana.com"*/, preflightCommitment)
    //connection = new Connection("https://api.devnet.solana.com"/*Interchangeable with "clusterApiUrl("devnet")"*/, preflightCommitment)
    
    //It isn't neccessary to run the alert protocol against mainnet. This saves on requests just using devnet and no RPC provider since this contract is just for triggering alerts.
    if(isProduction())
      connection = new Connection("https://m4a.io/Proxy", preflightCommitment)
    else
      connection = DEV_MODE ? new Connection("https://m4a.io/Proxy"/*Interchangeable with "https://api.devnet.solana.com"*/, preflightCommitment) : new Connection("https://solana-rpc.publicnode.com", preflightCommitment)
      //connection = DEV_MODE ? new Connection("https://api.devnet.solana.com"/*Interchangeable with "clusterApiUrl("devnet")"*/, preflightCommitment) : new Connection("https://solana-rpc.publicnode.com", preflightCommitment)
    
    const provider = computed
    (
      () =>
        new AnchorProvider(connection, wallet.value,
        {
          preflightCommitment
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