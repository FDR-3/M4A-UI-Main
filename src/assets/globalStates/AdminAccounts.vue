<script lang="ts">
  import { reactive } from 'vue'
  import { tokenAddressStrings, hodlWalletATAKeys, hodlDepositsATAStrings, singlePayerDepositsATAStrings } from '/src/assets/constants/Addresses.ts'
  import { PublicKey } from "@solana/web3.js"

  export const adminAccounts = reactive(
  {
    initialCEOAddress: "Fdqu1muWocA5ms8VmTrUxRxxmSattrmpNraQ7RpPvzZg",
    initialCEOPublicKey: new PublicKey("Fdqu1muWocA5ms8VmTrUxRxxmSattrmpNraQ7RpPvzZg"),
    hodlTreasuryAddress: new PublicKey("9BRgCdmwyP5wGVTvKAUDjSwucpqGncurVa35DjaWqSsC"),
    hodlTreasuryLendingAccountIndex: 0,
    singlePayerTreasuryAddress: new PublicKey("B9UiZdNg7j7qH1FhimSwkG5CY7D4K8WRpP1Zw4BgHBtb"),
    singlePayerTreasuryLendingAccountIndex: 0,
    m4aCEOAddress: undefined,
    m4aTreasurerAddress: undefined,
    chatCEOAddress: undefined,
    chatTreasurerAddress: undefined,
    lendingCEOAddressKey: undefined,
    lendingCEOAddressString: undefined,
    lendingMain3PercentSubMarketIndex: 0,
    lendingMain100PercentSubMarketIndex: 1,
    alertCEOAddress: undefined,
    isM4ACEOAccountReady: false,
    isChatCEOAccountReady: false,
    isLendingCEOAccountReady: false,
    isAlertCEOAccountReady: false,
    ceoIsDead: false
  })

  export const hodlTreasuryWalletBalancesHashMap = reactive(
  {
    map: new Map<string, string>()
  })

  //These are for the Chat and M4A fees
  export const hodlTreasuryWalletATAHashMap: Map<string, PublicKey> = new Map(
  [
    //Key: Token Mint Address, Value: Assocated Token Address
    [tokenAddressStrings.daiTokenMintAddress, hodlWalletATAKeys.daiATA],
    [tokenAddressStrings.usdcTokenMintAddress, hodlWalletATAKeys.usdcATA]
  ])

  export const hodlTreasuryDepositsATAHashMap: Map<string, string> = new Map(
  [
    //Key: Token Mint Address, Value: Assocated Token Address
    [tokenAddressStrings.daiTokenMintAddress, hodlDepositsATAStrings.daiATA],
    [tokenAddressStrings.usdcTokenMintAddress, hodlDepositsATAStrings.usdcATA],
    [tokenAddressStrings.solTokenMintAddress, hodlDepositsATAStrings.solATA],
    [tokenAddressStrings.wethTokenMintAddress, hodlDepositsATAStrings.wethATA],
    [tokenAddressStrings.wbtcTokenMintAddress, hodlDepositsATAStrings.wbtcATA]
  ])
  
  export const singlePayerTreasuryDepositsATAHashMap: Map<string, string> = new Map(
  [
    //Key: Token Mint Address, Value: Assocated Token Address
    [tokenAddressStrings.daiTokenMintAddress, singlePayerDepositsATAStrings.daiATA],
    [tokenAddressStrings.usdcTokenMintAddress, singlePayerDepositsATAStrings.usdcATA],
    [tokenAddressStrings.solTokenMintAddress, singlePayerDepositsATAStrings.solATA],
    [tokenAddressStrings.wethTokenMintAddress, singlePayerDepositsATAStrings.wethATA],
    [tokenAddressStrings.wbtcTokenMintAddress, singlePayerDepositsATAStrings.wbtcATA]
  ])

  export const tvl = reactive(
  {
    hodlTVL: 0,
    singlePayerTVL: 0,
    tokenReserveTVL: 0
  })

  export default adminAccounts
</script>