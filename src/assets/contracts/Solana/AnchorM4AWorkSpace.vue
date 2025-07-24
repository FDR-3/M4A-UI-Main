<script lang="ts">
  import { computed } from "vue"
  import { useAnchorWallet } from 'solana-wallets-vue'
  import { Connection, clusterApiUrl } from "@solana/web3.js"
  import { AnchorProvider, Program } from "@coral-xyz/anchor"
  import idl1 from "/src/assets/contracts/Solana/M4AProtocol.json"
  //import idl2 from "/src/assets/contracts/Solana/M4AProtocol2.json"
  import { M4AProtocol } from "./m4a.ts"//including the type doesn't seem to help with auto complete/IDE suggestions when programing in the front end, not sure how to fix that

  const preflightCommitment = "processed"
  const commitment = "confirmed"

  var workspace: any = null
  export const useM4AWorkspace = () => workspace

  export const initM4AWorkspace = (contractVersion: number) =>
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