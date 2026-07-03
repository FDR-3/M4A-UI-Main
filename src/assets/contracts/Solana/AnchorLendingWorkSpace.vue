<script lang="ts">
  import { computed, shallowRef, ref } from "vue"
  import { useAnchorWallet } from 'solana-wallets-vue'
  import { Connection, clusterApiUrl } from "@solana/web3.js"
  import { AnchorProvider, Program } from "@coral-xyz/anchor"
  import idl1 from "/src/assets/contracts/Solana/LendingProtocol.json"
  //import idl2 from "/src/assets/contracts/Solana/LendingProtocol2.json"
  import { LendingProtocol } from "./lending.ts"//including the type doesn't seem to help with auto complete/IDE suggestions when programing in the front end, not sure how to fix that
  import { DEV_MODE } from '/src/assets/globalStates/EnvironmentSettings.ts'
  import { isProduction } from '/src/assets/helperFunctions/browserHelper.ts'

  const preflightCommitment = "processed"
  const commitment = "confirmed"
  var workspace: any = null

  export const useLendingWorkspace = () => workspace

  const rpcSetting = localStorage.getItem("rpcSetting") || ""
  const customRPCEndPoint = localStorage.getItem("customRPCEndPoint") || ""
  const rpcUrl = ref("")

  if(rpcSetting == "Custom")
  {
    if(customRPCEndPoint != "")
      rpcUrl.value = customRPCEndPoint
    else
    {
      if(isProduction())
        rpcUrl.value = "https://m4a.io/TestNetProxy"
      else
        rpcUrl.value = DEV_MODE ? clusterApiUrl("testnet")/*Interchangeable with "https://api.devnet.solana.com"*/ : "https://solana-rpc.publicnode.com"
        //rpcUrl.value = DEV_MODE ? "https://api.devnet.solana.com"/*Interchangeable with clusterApiUrl("devnet")*/ : "https://solana-rpc.publicnode.com"
    }
  }
  else
  {
    if(isProduction())
      rpcUrl.value = "https://m4a.io/TestNetProxy"
    else
      rpcUrl.value = DEV_MODE ? "https://cool-frosty-seed.solana-testnet.quiknode.pro/789532ac83ade299fe5246d56aa5d4d32a600017/"/*Interchangeable with "https://api.devnet.solana.com"*/ : "https://solana-rpc.publicnode.com"
      //rpcUrl.value = DEV_MODE ? "https://api.devnet.solana.com"/*Interchangeable with clusterApiUrl("devnet")*/ : "https://solana-rpc.publicnode.com"
  }

  const connection = shallowRef(new Connection(rpcUrl.value, preflightCommitment))
  export const updateRpcEndpoint = (newUrl: string) =>
  {
    rpcUrl.value = newUrl
    connection.value = new Connection(newUrl, preflightCommitment)
  }

  export const initLendingWorkspace = (contractVersion: number) =>
  { 
    const wallet = useAnchorWallet()

    const provider = computed
    (
      () =>
        new AnchorProvider(connection.value, wallet.value,
        {
          preflightCommitment
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