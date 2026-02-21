<script lang="ts">
  import { computed } from "vue"
  import { useAnchorWallet } from 'solana-wallets-vue'
  import { Connection, clusterApiUrl } from "@solana/web3.js"
  import { AnchorProvider, Program } from "@coral-xyz/anchor"
  import idl1 from "/src/assets/contracts/Solana/M4AProtocol.json"
  //import idl2 from "/src/assets/contracts/Solana/M4AProtocol2.json"
  import { M4AProtocol } from "./m4a.ts"//including the type doesn't seem to help with auto complete/IDE suggestions when programing in the front end, not sure how to fix that
  import { DEV_MODE } from '/src/assets/globalStates/EnvironmentSettings.ts'
  import { isProduction } from '/src/assets/helperFunctions/browserHelper.ts'

  const preflightCommitment = "processed"
  const commitment = "confirmed"

  var workspace: any = null
  var connection: any = null

  export const useM4AWorkspace = () => workspace
  export const initM4AWorkspace = (contractVersion: number) =>
  { 
    const wallet = useAnchorWallet()

    if(isProduction())
      connection = new Connection("https://m4a.io/proxyCORS", preflightCommitment)
    else
      connection = DEV_MODE ? new Connection(clusterApiUrl("devnet"), preflightCommitment) : new Connection("https://solana-rpc.publicnode.com", preflightCommitment)//Interchangeable with "https://api.devnet.solana.com"
      //connection = DEV_MODE ? new Connection("https://api.devnet.solana.com", preflightCommitment) : new Connection("https://solana-rpc.publicnode.com", preflightCommitment)//Interchangeable with "https://api.devnet.solana.com"
    
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

    var idlToUse: any

    if(contractVersion == 0)
      idlToUse = idl1
    //if(contractVersion == 1)
      //idlToUse = idl2

    var m4aProgram = computed(() => new Program(idlToUse, provider.value) as Program<M4AProtocol>) 

    workspace =
    {
      wallet,
      connection,
      provider,
      m4aProgram,
    }
  }

  export default useM4AWorkspace
</script>