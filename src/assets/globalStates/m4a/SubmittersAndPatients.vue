<script lang="ts">
  import { reactive } from 'vue'

  export const submitterHashMap = reactive(
  {
    //Key: submitterAddress, Value: submitterData
    map: undefined
  })

  export const submitterPatientListHashMap = reactive(
  {
    //Key: submitterAddress, Value: submitterPatientListData
    map: undefined
  })

  export const submitterActivePatientListHashMap = reactive(
  {
    //Key: submitterAddress, Value: submitterActivePatientListData
    map: undefined
  })

  export const patientHashMap = reactive(
  {
    //Key: submitterAddress + submitterPatientIndex, Value: patientData
    map: undefined
  })

  export default submitterHashMap
</script>