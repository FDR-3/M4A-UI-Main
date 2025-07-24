<script lang="ts">
  import { reactive } from 'vue'

  export const chatAccounts = reactive(
  {
    data: undefined
  })

  export const chatAccountHashMap = reactive(
  {
    map: new Map<string, any>()
  })

  export const customUserNameHashMap = reactive(
  {
    map: new Map<string, any>()
  })

  export default chatAccounts
</script>