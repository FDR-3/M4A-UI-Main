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

  export const mainNetTreasury = reactive(
  {
    DAITokenMintAddress: new PublicKey("EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o"),
    USDCTokenMintAddress: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    SOLTokenMintAddress: new PublicKey("So11111111111111111111111111111111111111112"),
    WEthTokenMintAddress: new PublicKey("7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs"),
    WBtcTokenMintAddress: new PublicKey("3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh")
  })

  export const devNetTreasury = reactive(
  {
    DAITokenMintAddress: new PublicKey("EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o"),
    USDCTokenMintAddress: new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"),
    SOLTokenMintAddress: new PublicKey("So11111111111111111111111111111111111111112"),
    WEthTokenMintAddress: new PublicKey("7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs"),
    WBtcTokenMintAddress: new PublicKey("3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh")
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