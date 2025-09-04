<script lang="ts">
  import { computed } from "vue"
  import { useAnchorWallet } from 'solana-wallets-vue'
  import { Connection, clusterApiUrl } from "@solana/web3.js"
  import { AnchorProvider, Program } from "@coral-xyz/anchor"
  import idl1 from "/src/assets/contracts/Solana/ChatProtocol.json"
  //import idl2 from "/src/assets/contracts/Solana/ChatProtocol2.json"
  import { ChatProtocol } from "./chat.ts"//including the type doesn't seem to help with auto complete/IDE suggestions when programing in the front end, not sure how to fix that

  const preflightCommitment = "processed"
  const commitment = "confirmed"

  var workspace: any = null
  export const useChatWorkspace = () => workspace

  export const initChatWorkspace = (contractVersion: number) => 
  {
    const wallet = useAnchorWallet()

    //const connection = new Connection('http://127.0.0.1:8899')
    //const connection = new Connection(clusterApiUrl("devnet"), preflightCommitment)
    //const connection = new Connection(clusterApiUrl("mainnet-beta"), preflightCommitment)
    //const connection = new Connection("https://solana-rpc.publicnode.com", preflightCommitment)
    //const connection = new Connection("https://solana.rpc.grove.city/v1/01fdb492", commitment)
    //const connection = new Connection('https://solana-mainnet.rpc.extrnode.com/27ac0b99-38bc-46a7-8c92-3bf4aeb463b6')
    //const connection = new Connection('https://capable-fabled-field.solana-mainnet.quiknode.pro/b364e9f7fa0babd35bd125a11b9d19781483faed/')

    const connection = new Connection("https://m4a.io/proxyCORS", commitment)

    const provider = computed
    (
      () =>
        new AnchorProvider(connection, wallet.value,
        {
          preflightCommitment,
          commitment
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