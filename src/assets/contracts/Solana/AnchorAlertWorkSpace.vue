<script lang="ts">
  import { computed } from "vue"
  import { useAnchorWallet } from 'solana-wallets-vue'
  import { Connection, clusterApiUrl } from "@solana/web3.js"
  import { AnchorProvider, Program } from "@coral-xyz/anchor"
  import idl from "/src/assets/contracts/Solana/AlertProtocol.json"
  //import idl2 from "/src/assets/contracts/Solana/AlertProtocol2.json"
  import { AlertProtocol } from "./alert.ts"//including the type doesn't seem to help with auto complete/IDE suggestions when programing in the front end, not sure how to fix that

  const preflightCommitment = "processed"
  const commitment = "confirmed"

  var workspace: any = null
  export const useAlertWorkspace = () => workspace

  export const initAlertWorkspace = () =>
  { 
    const wallet = useAnchorWallet()

    //const connection = new Connection('http://127.0.0.1:8899')
    const connection = new Connection(clusterApiUrl("devnet"), preflightCommitment)
    //const connection = new Connection(clusterApiUrl("mainnet-beta"), preflightCommitment)
    //const connection = new Connection("https://solana-rpc.publicnode.com", preflightCommitment)
    
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