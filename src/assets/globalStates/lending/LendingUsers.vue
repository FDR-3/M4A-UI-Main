<script lang="ts">
  import { reactive } from 'vue'

  //Key: Lending User Address + Account Index, Value: Specific Lending User Account
  export const lendingerUserHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address, Value: List of User Lending Accounts
  export const lendingerUserAccountsHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address + Account Index, Value: Lending User Deposit Balance
  export const lendingerUserDepositBalanceHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address + Account Index, Value: List of User Account Tabs
  export const lendingerUserTabsHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address + Account Index + TokenMintAddress + Tax Year + Tax Month, Value: User Monthly Statement Accounts for a given TokenMintAddress and Tax Year and Tax Month
  export const lendingerUserMonthlyStatementsHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address + Account Index, Value: List of User Available TokenMintAddresses
  export const lendingerUserAvailableTokenMintAddressesHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address + Account Index + TokenMintAddress, Value: List of User Available Statement Tax Years by TokenMintAddress
  export const lendingerUserAvailableYearsByTokenMintAddressHashMap = reactive(
  {
    map: undefined
  })

  export default lendingerUserAccountsHashMap
</script>