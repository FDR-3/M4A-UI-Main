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

  //Key: Lending User Address + Account Index, Value: Lending User Deposit Balance
  export const lendingUserDepositBalanceHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address + Account Index, Value: List of User Account Tabs
  export const lendingUserTabsHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address + Account Index + TokenMintAddress + Tax Year + Tax Month, Value: User Monthly Statement Accounts for a given TokenMintAddress and Tax Year and Tax Month
  export const lendingUserMonthlyStatementsHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address + Account Index, Value: List of User Available TokenMintAddresses
  export const lendingUserAvailableTokenMintAddressesHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address + Account Index + TokenMintAddress, Value: List of User Available Statement Tax Years by TokenMintAddress
  export const lendingUserAvailableYearsByTokenMintAddressHashMap = reactive(
  {
    map: undefined
  })

  export const lendingLeaderBoardTable = reactive(
  {
    data: undefined
  })

  export default lendingUserAccountsHashMap
</script>