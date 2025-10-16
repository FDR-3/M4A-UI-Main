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

  //Key: Lending User Address, Value: List of User Tabs
  export const lendingerUserDepositBalanceHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address, Value: Lending User Has Deposit Boolean
  export const lendingerUserTabsHashMap = reactive(
  {
    map: undefined
  })

  export default lendingerUserAccountsHashMap
</script>