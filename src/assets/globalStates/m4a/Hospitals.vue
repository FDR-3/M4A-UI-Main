<script lang="ts">
  import { reactive } from 'vue'

  export const hospitalStats = reactive(
  {
    data: undefined
  })

  export const hospitals = reactive(
  {
    data: undefined
  })

  export const hospitalHashMap = reactive(
  {
    map: new Map<string, any>()
  })

  export default hospitalStats
</script>