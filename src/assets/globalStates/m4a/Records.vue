<script lang="ts">
  import { reactive } from 'vue'

  export const patientRecordsHashMap = reactive(
  {
    //Key: SubmitterAddress + patientIndex, Value: patientRecordsList
    map: undefined
  })

  export const hospitalRecordsHashMap = reactive(
  {
    //Key: CountryIndex + stateIndex + hospitalIndex, Value: hospitalRecordsList
    map: undefined
  })

  export const insuranceCompanyRecordsHashMap = reactive(
  {
    //Key: InsuranceCompanyIndex, Value: insuranceCompanyRecordsList
    map: undefined
  })

  export default patientRecordsHashMap
</script>