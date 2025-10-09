<script lang="ts">
  import { reactive } from 'vue'
  import { PublicKey } from "@solana/web3.js"
  import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'

  export const connectedWallet = reactive(
  {
    publicKey: new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING),
    addressString: SYSTEM_PROGRAM_ADDRESS_STRING,
    isConnected: false,
    isChatAccountReady: false,
    hasHadCustomName: false,
    isSubmitterAccountReady: false,
    isProcessorAccountReady: false,
    isProcessorAccountActive: false,
    isProcessorAccountSuperAdmin: false,
    isProcessorWorkingAClaim: false,
    submitterAddressOfClaimBeingProcessed: "",
    tokenBalanceMap: new Map<string, string>(), //Balances in the user's wallet
    depositedTokenMap: new Map<string, string>(), //Balances that the user has deposited into the lending protocol
    selectedLendingUserAccountIndex: 0
  })

  export default connectedWallet
</script>