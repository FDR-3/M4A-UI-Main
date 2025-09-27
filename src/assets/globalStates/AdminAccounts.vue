<script lang="ts">
  import { reactive } from 'vue'
  import { tokenAddressStringsMainNet,
    tokenAddressStringsDevNet,
    hodlAssociatedTokenAddressKeysMainNet,
    singlePayerAssociatedTokenAddressKeysMainNet,
    hodlAssociatedTokenAddressKeysDevNet,
    singlePayerAssociatedTokenAddressKeysDevNet } from '/src/assets/constants/Addresses.ts'
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
    alertCEOAddress: undefined,
    isM4ACEOAccountReady: false,
    isChatCEOAccountReady: false,
    isLendingCEOAccountReady: false,
    isAlertCEOAccountReady: false,
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
  export const hodlTreasuryATAMainNetHashMap: Map<string, PublicKey> = new Map(
  [
    //Key: Token Mint Address, Value: Assocated Token Address
    [tokenAddressStringsMainNet.daiTokenMintAddress, hodlAssociatedTokenAddressKeysMainNet.daiATA],
    [tokenAddressStringsMainNet.usdcTokenMintAddress, hodlAssociatedTokenAddressKeysMainNet.usdcATA],
    [tokenAddressStringsMainNet.solTokenMintAddress, hodlAssociatedTokenAddressKeysMainNet.solATA],
    [tokenAddressStringsMainNet.wethTokenMintAddress, hodlAssociatedTokenAddressKeysMainNet.wethATA],
    [tokenAddressStringsMainNet.wbtcTokenMintAddress, hodlAssociatedTokenAddressKeysMainNet.wbtcATA]
  ])
  export const singlePayerTreasuryATAMainNetHashMap: Map<string, PublicKey> = new Map(
  [
    //Key: Token Mint Address, Value: Assocated Token Address
    [tokenAddressStringsMainNet.daiTokenMintAddress, singlePayerAssociatedTokenAddressKeysMainNet.daiATA],
    [tokenAddressStringsMainNet.usdcTokenMintAddress, singlePayerAssociatedTokenAddressKeysMainNet.usdcATA],
    [tokenAddressStringsMainNet.solTokenMintAddress, singlePayerAssociatedTokenAddressKeysMainNet.solATA],
    [tokenAddressStringsMainNet.wethTokenMintAddress, singlePayerAssociatedTokenAddressKeysMainNet.wethATA],
    [tokenAddressStringsMainNet.wbtcTokenMintAddress, singlePayerAssociatedTokenAddressKeysMainNet.wbtcATA]
  ])

  //Dev Net
  export const hodlTreasuryBalancesDevNetHashMap = reactive(
  {
    map: new Map<string, string>()
  })
  export const singlePayerTreasuryBalancesDevNetHashMap = reactive(
  {
    map: new Map<string, string>()
  })
  export const hodlTreasuryATADevNetHashMap: Map<string, PublicKey> = new Map(
  [
    //Key: Token Mint Address, Value: Assocated Token Address
    [tokenAddressStringsDevNet.daiTokenMintAddress, hodlAssociatedTokenAddressKeysDevNet.daiATA],
    [tokenAddressStringsDevNet.usdcTokenMintAddress, hodlAssociatedTokenAddressKeysDevNet.usdcATA],
    [tokenAddressStringsDevNet.solTokenMintAddress, hodlAssociatedTokenAddressKeysDevNet.solATA],
    [tokenAddressStringsDevNet.wethTokenMintAddress, hodlAssociatedTokenAddressKeysDevNet.wethATA],
    [tokenAddressStringsDevNet.wbtcTokenMintAddress, hodlAssociatedTokenAddressKeysDevNet.wbtcATA]
  ])
  export const singlePayerTreasuryATADevNetHashMap: Map<string, PublicKey> = new Map(
  [
    //Key: Token Mint Address, Value: Assocated Token Address
    [tokenAddressStringsDevNet.daiTokenMintAddress, singlePayerAssociatedTokenAddressKeysDevNet.daiATA],
    [tokenAddressStringsDevNet.usdcTokenMintAddress, singlePayerAssociatedTokenAddressKeysDevNet.usdcATA],
    [tokenAddressStringsDevNet.solTokenMintAddress, singlePayerAssociatedTokenAddressKeysDevNet.solATA],
    [tokenAddressStringsDevNet.wethTokenMintAddress, singlePayerAssociatedTokenAddressKeysDevNet.wethATA],
    [tokenAddressStringsDevNet.wbtcTokenMintAddress, singlePayerAssociatedTokenAddressKeysDevNet.wbtcATA]
  ])

  export const tvl = reactive(
  {
    hodlTVL: 0,
    singlePayerTVL: 0,
    tokenReserveTVL: 0
  })

  export default adminAccounts
</script>