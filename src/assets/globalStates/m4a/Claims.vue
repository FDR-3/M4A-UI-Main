<script lang="ts">
  import { reactive } from 'vue'

  export const claimQueue = reactive(
  {
    data: undefined
  })

  export const claims = reactive(
  {
    data: undefined
  })

  export const processedClaims = reactive(
  {
    data: undefined
  })

  export const claimHashMap = reactive(
  {
    map: new Map<string, any>()
  })

  export const processedClaimHashMap = reactive(
  {
    map: new Map<string, any>()
  })

  export default claimQueue
</script>