<script lang="ts">
  import { reactive } from 'vue'

  export const stateAccountReadyHashMap = reactive(
  {
    //Key: CountryIndex + stateIndex, Value: stateData
    map: undefined
  })

  export const stateHospitalListHashMap = reactive(
  {
    //Key: CountryIndex + stateIndex, Value: stateData
    map: undefined
  })

  export type State = 
  {
    hospitalList: [],
    approvedClaimAmountString: string,
    approvedClaimAmount: number,
    approvedClaimCount: number,
    deniedClaimCount: number,
    undeniedClaimCount: number,
    submittedAppealCount: number,
    deniedAppealCount: number,
    revokedApprovalCount: number,
    hospitalCount: number,
    generalHospitalCount: number,
    dentalHospitalCount: number,
    visionHospitalCount: number,
    mentalHospitalCount: number
  }

  export default stateHospitalListHashMap
</script>