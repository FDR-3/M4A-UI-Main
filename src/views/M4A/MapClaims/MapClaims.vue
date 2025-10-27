<template>
  <h2>Under Construction On Devnet<br>Monopoly Money</h2>
  <h1 v-if="!mapSelection.isStateSelected">Universal Health Care Road Map</h1>
  <div v-if="mapSelection.isStateSelected" class="smallMarginTop">
    <!--<BETACountDown/>-->
    <BETADelayExcuse/>
    <h1>{{ mapSelection.selectedStateName }} Hospitals</h1>
  </div>
  <div >
    <USMap v-if="!mapSelection.isStateSelected" @stateSelect="(countryIndex :number, stateIndex: number, stateName: string) => showState(countryIndex, stateIndex, stateName)"/>
    <ion-button fill="clear" v-if="mapSelection.isStateSelected" @click="resetStateSelected()">
      <ion-label color="dark">Pick Different State</ion-label>
    </ion-button>
    <WorldMap v-if="mapSelection.isStateSelected"
    :stateHospitalList="stateHospitalList"
    :zoomLat="mapSelection.zoomLat"
    :zoomLong="mapSelection.zoomLong"
    @hospitalSelect="(hospitalIndex:number) => submitClaim.preFillClaimInputs(hospitalIndex)"/>
    <StateHospitalListTable 
      v-if="mapSelection.isStateSelected && !showStateHospitalRecords"
      :tableData="stateHospitalList"
      :isLoading="isLoading"
      :stateName="mapSelection.selectedStateName" 
      :countryIndex="mapSelection.countryIndex" 
      :stateIndex="mapSelection.stateIndex"
      :stateApprovedClaimTotalString="stateApprovedClaimTotalString"
      :stateApprovedClaimCount="stateApprovedClaimCount"
      :stateDeniedClaimCount="stateDeniedClaimCount"
      :stateUndeniedClaimCount="stateUndeniedClaimCount"
      :stateSubmittedAppealCount="stateSubmittedAppealCount"
      :stateDeniedAppealCount="stateDeniedAppealCount"
      :stateRevokedApprovalCount="stateRevokedApprovalCount"
      :stateTotalHospitalCount="stateTotalHospitalCount"
      :stateGeneralHospitalCount="stateGeneralHospitalCount"
      :stateDentalHospitalCount="stateDentalHospitalCount"
      :stateVisionHospitalCount="stateVisionHospitalCount"
      :stateMentalHospitalCount="stateMentalHospitalCount"
      @hospitalSelect="(hospitalIndex:number) => submitClaim.preFillClaimInputs(hospitalIndex)"
      @showHospitalRecords="(countryIndex:number, stateIndex:number, hospitalIndex:number) => showHospitalRecords(countryIndex, stateIndex, hospitalIndex)"
    />
    <HospitalRecordsTable 
      v-else-if="mapSelection.isStateSelected && showStateHospitalRecords"
      @hospitalSelect="/*country and state index also used when the hospital record table is on the Queue page*/
      (hospitalIndex:number) => submitClaim.preFillClaimInputs(hospitalIndex)"
      @showHospitalList="showStateHospitals()"
    />
    <div id="submitClaimsHeader">
      <SubmitClaim ref="submitClaim" v-if="mapSelection.isStateSelected" :stateName="mapSelection.selectedStateName" :countryIndex="mapSelection.countryIndex" :stateIndex="mapSelection.stateIndex" :colorHexValue="colorHexValue"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { IonButton, IonLabel } from '@ionic/vue'
  import BETACountDown from '/src/components/mapclaims/BETACountDown.vue'
  import BETADelayExcuse from '/src/components/mapclaims/BETADelayExcuse.vue' 
  import USMap from '/src/components/mapclaims/USMap.vue'
  import WorldMap from '/src/components/mapclaims/WorldMap.vue'
  import StateHospitalListTable from '/src/components/tables/m4a/StateHospitalListTable.vue'
  import HospitalRecordsTable from '/src/components/tables/m4a/HospitalRecordsTable.vue'
  import SubmitClaim from '/src/components/mapclaims/SubmitClaim.vue'
  import { stateHospitalListHashMap } from '/src/assets/globalStates/m4a/States.vue'
  import { countryStateCoordinatesArray } from '/src/components/mapclaims/arrays/CountryStateArrays.ts'
  import { mapSelection } from '/src/assets/globalStates/MapSelection.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

  defineProps(['colorName', 'colorHexValue'])

  const submitClaim = ref()
  var showStateHospitalRecords = ref()
  var stateHospitalList = ref()
  var isLoading = ref(true)

  var stateApprovedClaimTotalString = ref("$0.00")
  var stateApprovedClaimCount = ref(0)
  var stateDeniedClaimCount = ref(0)
  var stateUndeniedClaimCount = ref(0)
  var stateSubmittedAppealCount = ref(0)
  var stateDeniedAppealCount = ref(0)
  var stateRevokedApprovalCount = ref(0)
  var stateTotalHospitalCount = ref(0)
  var stateGeneralHospitalCount = ref(0)
  var stateDentalHospitalCount = ref(0)
  var stateVisionHospitalCount = ref(0)
  var stateMentalHospitalCount = ref(0)

  onMounted(async () => 
  {
    showStateHospitalRecords.value = localStorage.getItem("showStateHospitalRecords") == 'true' ? true:false

    if(mapSelection.countryIndex != -1 && mapSelection.stateIndex != -1)
    {
      if(stateHospitalListHashMap.map)
      {
        getStateData()
        isLoading.value = false
      }
    }
  })

  watch(stateHospitalListHashMap, () =>
  {
    getStateData()

    if(isLoading.value)
      isLoading.value = false
  })

  function getStateData()
  {
    try
    {
      //Get state hospital table data
      var stateAccount = stateHospitalListHashMap.map.get(mapSelection.countryIndex.toString() + mapSelection.stateIndex.toString())
      
      if(stateAccount)
      {
        stateHospitalList.value = stateAccount.hospitalList
        stateApprovedClaimTotalString.value = stateAccount.approvedClaimAmountString
        stateApprovedClaimCount.value = stateAccount.approvedClaimCount
        stateDeniedClaimCount.value = stateAccount.deniedClaimCount
        stateUndeniedClaimCount.value = stateAccount.undeniedClaimCount
        stateSubmittedAppealCount.value = stateAccount.submittedAppealCount
        stateDeniedAppealCount.value = stateAccount.deniedAppealCount
        stateRevokedApprovalCount.value = stateAccount.revokedApprovalCount
        stateTotalHospitalCount.value = stateAccount.hospitalCount
        stateGeneralHospitalCount.value = stateAccount.generalHospitalCount
        stateDentalHospitalCount.value = stateAccount.dentalHospitalCount
        stateVisionHospitalCount.value = stateAccount.visionHospitalCount
        stateMentalHospitalCount.value = stateAccount.mentalHospitalCount
      }
      else
      {
        stateApprovedClaimTotalString.value = "$0.00"
        stateApprovedClaimCount.value = 0
        stateDeniedClaimCount.value = 0
        stateUndeniedClaimCount.value = 0
        stateSubmittedAppealCount.value = 0
        stateDeniedAppealCount.value = 0
        stateRevokedApprovalCount.value = 0
        stateTotalHospitalCount.value = 0
        stateGeneralHospitalCount.value = 0
        stateDentalHospitalCount.value = 0
        stateVisionHospitalCount.value = 0
        stateMentalHospitalCount.value = 0
      }
    }
    catch(error)
    {
      console.log(error)
    }
  }

  function showState(countryIndexToShow: number, stateIndexToShow: number, stateNameToShow: string)
  {
    const ZOOM_LAT_INDEX = 0
    const ZOOM_LONG_INDEX = 1

    mapSelection.countryIndex = countryIndexToShow
    mapSelection.stateIndex = stateIndexToShow
    mapSelection.isStateSelected = true
    mapSelection.selectedStateName = stateNameToShow
    mapSelection.zoomLat = countryStateCoordinatesArray[countryIndexToShow][stateIndexToShow][ZOOM_LAT_INDEX]
    mapSelection.zoomLong = countryStateCoordinatesArray[countryIndexToShow][stateIndexToShow][ZOOM_LONG_INDEX]
    
    localStorage.setItem("mapCountryIndex", mapSelection.countryIndex.toString())
    localStorage.setItem("mapStateIndex", mapSelection.stateIndex.toString())
    localStorage.setItem("mapIsStateSelected", mapSelection.isStateSelected.toString())
    localStorage.setItem("mapSelectedStateName", mapSelection.selectedStateName)
    localStorage.setItem("mapDefaultLatitude", mapSelection.zoomLat.toString())
    localStorage.setItem("mapDefaultLongitude", mapSelection.zoomLong.toString())

    if(stateHospitalListHashMap.map)
    {
      getStateData()
      isLoading.value = false
    }
  }

  function resetStateSelected()
  {
    mapSelection.countryIndex = -1
    mapSelection.stateIndex = -1
    mapSelection.isStateSelected = false
    mapSelection.selectedStateName = ""
    mapSelection.zoomLat = 0
    mapSelection.zoomLong = 0

    localStorage.setItem("mapCountryIndex", "-1")
    localStorage.setItem("mapStateIndex", "-1")
    localStorage.setItem("mapIsStateSelected", "false")
    localStorage.setItem("mapSelectedStateName", "")
    localStorage.setItem("mapDefaultLatitude", "0")
    localStorage.setItem("mapDefaultLongitude", "0")  
  }

  function showHospitalRecords( selectedCountryIndex: number, selectedStateIndex: number, selectedHospitalIndex: number)
  {
    localStorage.setItem('showStateHospitalRecords', "true")
    localStorage.setItem('stateTableCountryIndex', selectedCountryIndex.toString())
    localStorage.setItem('stateTableStateIndex', selectedStateIndex.toString())
    localStorage.setItem('stateTableHospitalIndex', selectedHospitalIndex.toString())
    showStateHospitalRecords.value = true
  }

  function showStateHospitals()
  {
    localStorage.setItem('showStateHospitalRecords', "false")
    showStateHospitalRecords.value = false
  }
</script>