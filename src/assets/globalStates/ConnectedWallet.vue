<script lang="ts">
  import { reactive } from 'vue'
  import { PublicKey } from "@solana/web3.js"
  import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'

  export const connectedWallet = reactive(
  {
    publicKey: new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING),
    addressString: "",
    isChatAccountReady: false,
    hasHadCustomName: false,
    isSubmitterAccountReady: false,
    isProcessorAccountReady: false,
    isProcessorAccountActive: false,
    isProcessorAccountSuperAdmin: false,
    isProcessorWorkingAClaim: false,
    submitterAddressOfClaimBeingProcessed: ""
  })

  export default connectedWallet
</script>