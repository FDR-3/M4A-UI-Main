<script lang="ts">
  import { computed } from "vue"
  import { useAnchorWallet } from 'solana-wallets-vue'
  import { Connection, clusterApiUrl } from "@solana/web3.js"
  import { AnchorProvider, Program } from "@coral-xyz/anchor"
  import idl1 from "/src/assets/contracts/Solana/ChatProtocol.json"
  //import idl2 from "/src/assets/contracts/Solana/ChatProtocol2.json"
  import { ChatProtocol } from "./chat.ts"//including the type doesn't seem to help with auto complete/IDE suggestions when programing in the front end, not sure how to fix that
  import { DEV_MODE } from '/src/assets/globalStates/EnvironmentSettings.ts'
  import { isProduction } from '/src/assets/helperFunctions/browserHelper.ts'
  
  const preflightCommitment = "processed"
  const commitment = "confirmed"

  var workspace: any = null
  var connection: any = null

  export const useChatWorkspace = () => workspace
  export const initChatWorkspace = (contractVersion: number) => 
  {
    const wallet = useAnchorWallet()

    if(isProduction())
      connection = new Connection("https://m4a.io/proxyCORS", preflightCommitment)
    else
      connection = DEV_MODE ? new Connection(clusterApiUrl("devnet")/*Interchangeable with "https://api.devnet.solana.com"*/, preflightCommitment) : new Connection("https://solana-rpc.publicnode.com", preflightCommitment)
      //connection = DEV_MODE ? new Connection("https://api.devnet.solana.com"/*Interchangeable with "clusterApiUrl("devnet")"*/, preflightCommitment) : new Connection("https://solana-rpc.publicnode.com", preflightCommitment)

    const provider = computed
    (
      () =>
        new AnchorProvider(connection, wallet.value,
        {
          preflightCommitment
        }
      )
    )

    var idlToUse: any

    if(contractVersion == 0)
      idlToUse = idl1
    //if(contractVersion == 1)
      //idlToUse = idl2

    var chatProgram = computed(() => new Program(idlToUse, provider.value) as Program<ChatProtocol>) 

    workspace = 
    {
      wallet,
      connection,
      provider,
      chatProgram,
    }
  }

  export default useChatWorkspace
</script>