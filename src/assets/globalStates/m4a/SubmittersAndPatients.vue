<script lang="ts">
  import { reactive } from 'vue'

  export const submitterHashMap = reactive(
  {
    //Key: submitterAddress, Value: submitterData
    map: new Map<string, any>()
  })

  export const submitterPatientListHashMap = reactive(
  {
    //Key: submitterAddress, Value: submitterPatientListData
    map: new Map<string, any>()
  })

  export const submitterActivePatientListHashMap = reactive(
  {
    //Key: submitterAddress, Value: submitterActivePatientListData
    map: new Map<string, any>()
  })

  export const patientHashMap = reactive(
  {
    //Key: submitterAddress + submitterPatientIndex, Value: patientData
    map: new Map<string, any>()
  })

  export default submitterHashMap
</script>