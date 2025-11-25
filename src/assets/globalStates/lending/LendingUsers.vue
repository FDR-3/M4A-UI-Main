<script lang="ts">
  import { reactive } from 'vue'

  //Key: Lending User Address + Account Index, Value: Specific Lending User Account
  export const lendingUserHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address, Value: List of User Lending Accounts
  export const lendingUserAccountsHashMap = reactive(
  {
    map: undefined
  })

  //Key: TokenMintAddress + SubMarketOwnerAddress + SubMarketIndex + Lending User Address + Account Index, Value: Specific Lending User Tab account for a specific SubMarket
  export const lendingUserTabAccountsHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address + Account Index, Value: List of User Tab Accounts
  export const lendingUserTabAccountListHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address + Account Index, Value: List of User Remaining Account Tabs
  export const lendingUserRemainingTabAccountListHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Monthly Statement Data
  export const lendingUserMonthlyStatements = reactive(
  {
    data: undefined
  })

  //Key: Lending User Address + Account Index + TokenMintAddress + Tax Year + Tax Month, Value: User Monthly Statement Accounts for a given TokenMintAddress and Tax Year and Tax Month
  export const lendingUserMonthlyStatementsHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address + Account Index, Value: List of User Available Stable Coin SubMarkets
  export const lendingUserAvailableStableCoinStatementsBySubMarketsHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address + Account Index + TokenMintAddress, Value: List of User Available Stable Coin Statement Tax Years by SubMarket
  export const lendingUserAvailableStableCoinYearsBySubMarketHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address + Account Index, Value: List of User Available Crypto Currency SubMarkets
  export const lendingUserAvailableCryptoCurrencyStatementsBySubMarketsHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address + Account Index + TokenMintAddress, Value: List of User Available Crypto Currency Statement Tax Years by SubMarket
  export const lendingUserAvailableCryptoCurrencyYearsBySubMarketHashMap = reactive(
  {
    map: undefined
  })

  export const lendingLeaderBoardTable = reactive(
  {
    data: undefined
  })

  export default lendingUserAccountsHashMap
</script>