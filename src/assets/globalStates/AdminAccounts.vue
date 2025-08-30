<script lang="ts">
  import { reactive } from 'vue'
  import { PublicKey } from "@solana/web3.js"

  export const adminAccounts = reactive(
  {
    initialCEOAddress: "Fdqu1muWocA5ms8VmTrUxRxxmSattrmpNraQ7RpPvzZg",
    //treasurerUSDCATA: new PublicKey("CNJ2Jb4dMWF8TsMEKsqdaJUkCMnY8AKz5gr9GDjN9cQB"),//Devnet
    //singlePayerUSDCATA: new PublicKey("FLSfaiYMwfbJhfzsmSvSjCGQE9CGfbXcnG7o9ZTz3F7i"),//Devnet
    treasurerUSDCATA: new PublicKey("9JxyN8T2apS2GRE9d6sVYAZWC6CHjd6H9qsy748ydaNF"),//Mainnet
    singlePayerUSDCATA: new PublicKey("Ah4FreAs2UKE8LsEenE21bMwtis55K7CzcNtzfywyypc"),//Mainnet
    m4aCEOAddress: undefined,
    m4aTreasurerAddress: undefined,
    chatCEOAddress: undefined,
    chatTreasurerAddress: undefined,
    isM4ACEOAccountReady: false,
    isChatCEOAccountReady: false,
    treasuryBalance: "0.00",
    singlePayerBalance: "0.00",
    ceoIsDead: false
  })

  export default adminAccounts
</script>