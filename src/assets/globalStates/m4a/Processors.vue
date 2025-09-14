<script lang="ts">
  import { reactive } from 'vue'

  export const processorStats = reactive(
  {
    data: undefined
  })

  export const processors = reactive(
  {
    data: undefined
  })

  export const processorHashMap = reactive(
  {
    map: new Map<string, any>()
  })

  export default processorStats
</script>