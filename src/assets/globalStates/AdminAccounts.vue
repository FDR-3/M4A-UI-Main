<script lang="ts">
  import { reactive } from 'vue'
  import { PublicKey } from "@solana/web3.js"

  export const adminAccounts = reactive(
  {
    initialCEOAddress: "Fdqu1muWocA5ms8VmTrUxRxxmSattrmpNraQ7RpPvzZg",
    hodlTreasuryAddress: new PublicKey("9BRgCdmwyP5wGVTvKAUDjSwucpqGncurVa35DjaWqSsC"),
    singlePayerTreasuryAddress: new PublicKey("B9UiZdNg7j7qH1FhimSwkG5CY7D4K8WRpP1Zw4BgHBtb"),
    m4aCEOAddress: undefined,
    m4aTreasurerAddress: undefined,
    chatCEOAddress: undefined,
    chatTreasurerAddress: undefined,
    lendingCEOAddress: undefined,
    isM4ACEOAccountReady: false,
    isChatCEOAccountReady: false,
    isLendingCEOAccountReady: false,
    ceoIsDead: false
  })

  //Mainnet Net
  export const hodlTreasuryBalancesMainNetHashMap = reactive(
  {
    map: new Map<string, string>()
  })
  export const singlePayerTreasuryBalancesMainNetHashMap = reactive(
  {
    map: new Map<string, string>()
  })

  //Dev Net
  export const hodlTreasuryBalancesDevNetHashMap = reactive(
  {
    map: new Map<string, string>()
  })
  export const singlePayerTreasuryBalancesDevNetHashMap = reactive(
  {
    map: new Map<string, string>()
  })

  export default adminAccounts
</script>