<script lang="ts">
  import { reactive } from 'vue'

  export const patientRecordsHashMap = reactive(
  {
    //Key: SubmitterAddress + patientIndex, Value: patientRecordsList
    map: new Map<string, any>()
  })

  export const hospitalRecordsHashMap = reactive(
  {
    //Key: CountryIndex + stateIndex + hospitalIndex, Value: hospitalRecordsList
    map: new Map<string, any>()
  })

  export const insuranceCompanyRecordsHashMap = reactive(
  {
    //Key: InsuranceCompanyIndex, Value: insuranceCompanyRecordsList
    map: new Map<string, any>()
  })

  export default patientRecordsHashMap
</script>