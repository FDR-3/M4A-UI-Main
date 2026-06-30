<script lang="ts">
  import { reactive } from 'vue'
  import { tokenAddressStrings,
      hodlWalletATAKeys,
      solvencyWalletATAKeys,
      solvencyTreasuryWalletPublicKeyString  } from '/src/assets/constants/Addresses.ts'
  import { PublicKey } from "@solana/web3.js"

  export const adminAccounts = reactive(
  {
    initialCEOAddress: "Fdqu1muWocA5ms8VmTrUxRxxmSattrmpNraQ7RpPvzZg",
    initialCEOPublicKey: new PublicKey("Fdqu1muWocA5ms8VmTrUxRxxmSattrmpNraQ7RpPvzZg"),
    hodlTreasuryAddress: new PublicKey("9BRgCdmwyP5wGVTvKAUDjSwucpqGncurVa35DjaWqSsC"),
    hodlTreasuryLendingAccountIndex: 0,
    singlePayerTreasuryAddress: new PublicKey("B9UiZdNg7j7qH1FhimSwkG5CY7D4K8WRpP1Zw4BgHBtb"),
    singlePayerTreasuryLendingAccountIndex: 0,
    solvencyTreasuryAddress: new PublicKey(solvencyTreasuryWalletPublicKeyString),
    solvencyTreasuryLendingAccountIndex: 0,
    liquidationTreasuryAddress: new PublicKey("9BRgCdmwyP5wGVTvKAUDjSwucpqGncurVa35DjaWqSsC"),
    liquidationTreasuryLendingAccountIndex: 0,
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
    ceoIsDead: false,
    priceOracleRemainingAccount: 
    {
      pubkey: new PublicKey("6zpT3Fr3Hw95L23AVgx2D1wFkig8kESXB62dGZHxW2tS"),
      isSigner: false,
      isWritable: true
    }
  })

  //These are for the Chat and M4A fees that go directly to HODL Wallet
  export const hodlTreasuryWalletATAHashMap: Map<string, PublicKey> = new Map(
  [
    //Key: Token Mint Address, Value: Assocated Token Address
    [tokenAddressStrings.usdsTokenMintAddress, hodlWalletATAKeys.usdsATA],
    [tokenAddressStrings.usdcTokenMintAddress, hodlWalletATAKeys.usdcATA]
  ])

  //These are for the Chat and M4A fees that go directly to HODL Wallet
  export const solvencyInsuranceTreasuryWalletATAHashMap: Map<string, PublicKey> = new Map(
  [
    //Key: Token Mint Address, Value: Assocated Token Address
    [tokenAddressStrings.usdsTokenMintAddress, solvencyWalletATAKeys.usdsATA],
    [tokenAddressStrings.usdcTokenMintAddress, solvencyWalletATAKeys.usdcATA],
    [tokenAddressStrings.solTokenMintAddress, solvencyWalletATAKeys.solATA],
    [tokenAddressStrings.wethTokenMintAddress, solvencyWalletATAKeys.wethATA],
    [tokenAddressStrings.wbtcTokenMintAddress, solvencyWalletATAKeys.wbtcATA]
  ])
  
  export const hodlTreasuryWalletBalancesHashMap = reactive(
  {
    map: new Map<string, string>()
  })

  export const solvencyInsuranceTreasuryWalletBalancesHashMap = reactive(
  {
    map: new Map<string, string>()
  })

  export const tvl = reactive(
  {
    singlePayerTVL: 0,
    hodlTVL: 0,
    solvencyTVL: 0,
    tokenReserveTVL: 0
  })

  export default adminAccounts
</script>