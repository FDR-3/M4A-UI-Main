<script lang="ts">
  import { reactive } from 'vue'

  //Key: Lending User Address, Value: List of User Lending Accounts
  export const lendingerUserHashMap = reactive(
  {
    map: undefined
  })

  //Key: Lending User Address, Value: List of User Obligations
  export const lendingerUserObligationsHashMap = reactive(
  {
    map: undefined
  })

  export default lendingerUserHashMap
</script>