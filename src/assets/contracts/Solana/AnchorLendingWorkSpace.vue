<script lang="ts">
  import { computed } from "vue"
  import { useAnchorWallet } from 'solana-wallets-vue'
  import { Connection, clusterApiUrl } from "@solana/web3.js"
  import { AnchorProvider, Program } from "@coral-xyz/anchor"
  import idl1 from "/src/assets/contracts/Solana/LendingProtocol.json"
  //import idl2 from "/src/assets/contracts/Solana/LendingProtocol2.json"
  import { LendingProtocol } from "./lending.ts"//including the type doesn't seem to help with auto complete/IDE suggestions when programing in the front end, not sure how to fix that
  import { DEV_MODE } from '/src/assets/globalStates/EnvironmentSettings.ts'

  const preflightCommitment = "processed"
  const commitment = "confirmed"

  var workspace: any = null
  var connection: any = null

  export const useLendingWorkspace = () => workspace
  export const initLendingWorkspace = (contractVersion: number) =>
  { 
    const wallet = useAnchorWallet()

    if(DEV_MODE)
    {
      //const connection = new Connection('http://127.0.0.1:8899') //For testing with local validator
      connection = new Connection(clusterApiUrl("devnet"), preflightCommitment)
    }
    else
    {
      connection = new Connection("https://solana-rpc.publicnode.com", preflightCommitment)
      //connection = new Connection(clusterApiUrl("mainnet-beta"), preflightCommitment) //mainnet-beta seems to refuse everything and doesn't allow testing
    }
    
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

    var lendingProgram = computed(() => new Program(idlToUse, provider.value) as Program<LendingProtocol>) 

    workspace =
    {
      wallet,
      connection,
      provider,
      lendingProgram,
    }
  }

  export default useLendingWorkspace
</script>