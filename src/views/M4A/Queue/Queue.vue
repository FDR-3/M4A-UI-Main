<template>
  <div>
    <ClaimQueueTable 
      v-if="tableSelect == 0"
      @toggleHospitalTable="setTableSelect(1)"
      @toggleInsuranceCompanyTable="setTableSelect(2)"
      @toggleProcessedClaimsTable="setTableSelect(3)"
      :tableData="claimQueueTableData"
      :isClaimQueueOn="isClaimQueueOn"
      :isLoading="isClaimQueueTableLoading" 
      :currentClaimQueueCount="currentClaimQueueCount"
      :queueSizeLimit="queueSizeLimit"
      :nextInLine="nextInLine"
      :approvedClaimAmountString="approvedClaimAmountString" 
    />
    <HospitalTable 
      v-if="tableSelect == 1 && !showQueueTableHospitalRecords"
      @toggleClaimQueueTable="setTableSelect(0)"
      @toggleInsuranceCompanyTable="setTableSelect(2)"
      @toggleProcessedClaimsTable="setTableSelect(3)"
      :tableData="hospitalTableData" 
      :isLoading="isHospitalTableLoading"
      :approvedClaimAmountString="approvedClaimAmountString" 
      :totalHospitalCount="totalHospitalCount" 
      :generalHospitalCount="generalHospitalCount" 
      :dentalHospitalCount="dentalHospitalCount" 
      :visionHospitalCount="visionHospitalCount" 
      :mentalHospitalCount="mentalHospitalCount" 
      @showHospitalRecords="(countryIndex:number, stateIndex:number, hospitalIndex:number) => showHospitalRecords(countryIndex, stateIndex, hospitalIndex)"
    />
    <HospitalRecordsTable 
      v-else-if="tableSelect == 1 && showQueueTableHospitalRecords"
      @hospitalSelect="/*country and state index not used when the hospital record table is on the MapClaims page*/
      (hospitalIndex:number, countryIndex: number, stateIndex: number) => moveToClaimPage(countryIndex, stateIndex, hospitalIndex)"  
      @showHospitalList="showAllHospitals()"
    />
    <InsuranceCompanyTable 
      v-if="tableSelect == 2 && !showQueueTableInsuranceCompanyRecords"
      @toggleClaimQueueTable="setTableSelect(0)"
      @toggleHospitalTable="setTableSelect(1)"
      @toggleProcessedClaimsTable="setTableSelect(3)"
      :tableData="insuranceCompanyTableData" 
      :isLoading="isInsuranceCompanyTableLoading" 
      :approvedClaimAmountString="approvedClaimAmountString" 
      :totalInsuranceCompanyCount="totalInsuranceCompanyCount"
      @insuranceCompanySelect="(insuranceCompanyIndex:number) => showInsuranceCompanyRecords(insuranceCompanyIndex)"
    />
    <InsuranceCompanyRecordsTable 
      v-else-if="tableSelect == 2 && showQueueTableInsuranceCompanyRecords"
      @showInsuranceCompanyList="showInsuranceCompanyList()"
    />
    <ProcessedClaimsTable
      v-if="tableSelect == 3"
      @toggleClaimQueueTable="setTableSelect(0)"
      @toggleHospitalTable="setTableSelect(1)"
      @toggleInsuranceCompanyTable="setTableSelect(2)"
      :tableData="processedClaimsTableData" 
      :isLoading="isProcessedClaimsTableLoading"
      :approvedClaimAmountString="approvedClaimAmountString" 
      :protocolApprovedClaimCount="protocolApprovedClaimCount"
      :protocolDeniedClaimCount="protocolDeniedClaimCount"
      :protocolUndeniedClaimCount="protocolUndeniedClaimCount"
      :protocolMaxDeniedClaimCount="protocolMaxDeniedClaimCount"
      :protocolSubmittedAppealCount="protocolSubmittedAppealCount"
      :protocolDeniedAppealCount="protocolDeniedAppealCount"
      :protocolRevokedApprovalCount="protocolRevokedApprovalCount"
      :protocolDenialHammerDroppedCount="protocolDenialHammerDroppedCount"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import ClaimQueueTable from '/src/components/tables/m4a/ClaimQueueTable.vue'
  import HospitalTable from '/src/components/tables/m4a/HospitalTable.vue'
  import HospitalRecordsTable from '/src/components/tables/m4a/HospitalRecordsTable.vue'
  import InsuranceCompanyTable from '/src/components/tables/m4a/InsuranceCompanyTable.vue'
  import InsuranceCompanyRecordsTable from '/src/components/tables/m4a/InsuranceCompanyRecordsTable.vue'
  import ProcessedClaimsTable from '/src/components/tables/m4a/ProcessedClaimsTable.vue'
  import { mapSelection } from '/src/assets/globalStates/MapSelection.vue'
  import { navigation } from '/src/assets/globalStates/Navigation.vue'
  import { claimQueue, claims, processedClaims } from '/src/assets/globalStates/m4a/Claims.vue'
  import { hospitalStats, hospitals } from '/src/assets/globalStates/m4a/Hospitals.vue'
  import { insuranceCompanyStats, insuranceCompanies} from '/src/assets/globalStates/m4a/InsuranceCompanies.vue'
  import { processorStats } from '/src/assets/globalStates/m4a/Processors.vue'
  import { countryStateNameArray } from '/src/components/mapclaims/arrays/CountryStateArrays.ts'
  import { countryStateCoordinatesArray } from '/src/components/mapclaims/arrays/CountryStateArrays.ts'
  import { parseDollarAmountStringFromFixed2PointNotationNoDollarSign, trimAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { INITIAL_INSURANCE_COMPANY_COUNT } from '/src/assets/contracts/Solana/M4AProtocol.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'

  var isClaimQueueOn = ref()
  var claimQueueTableData = ref()
  var hospitalTableData = ref()
  var insuranceCompanyTableData = ref()
  var processedClaimsTableData = ref()

  var isClaimQueueTableLoading = ref(true)
  var isHospitalTableLoading = ref(true)
  var isInsuranceCompanyTableLoading = ref(true)
  var isProcessedClaimsTableLoading = ref(true)

  var currentClaimQueueCount = ref()
  var queueSizeLimit = ref(100)
  var nextInLine = ref("Queue Currently Empty")  

  var totalHospitalCount = ref()
  var generalHospitalCount = ref()
  var dentalHospitalCount = ref()
  var visionHospitalCount = ref()
  var mentalHospitalCount = ref()

  var totalInsuranceCompanyCount = ref()

  var approvedClaimAmountString = ref()
  var protocolApprovedClaimCount = ref()
  var protocolDeniedClaimCount = ref()
  var protocolUndeniedClaimCount = ref()
  var protocolMaxDeniedClaimCount = ref()
  var protocolSubmittedAppealCount = ref()
  var protocolDeniedAppealCount = ref()
  var protocolRevokedApprovalCount = ref()
  var protocolDenialHammerDroppedCount = ref()

  var tableSelect = ref()
  var showQueueTableHospitalRecords = ref()
  var showQueueTableInsuranceCompanyRecords = ref()

  onMounted(() => 
  {
    tableSelect.value = localStorage.getItem("queueTableSelect") || 0
    showQueueTableHospitalRecords.value = localStorage.getItem("showQueueTableHospitalRecords") == 'true' ? true:false
    showQueueTableInsuranceCompanyRecords.value = localStorage.getItem("showQueueTableInsuranceCompanyRecords") == 'true' ? true:false

    //Get Processor Stats, there are values here that go above all the tables that we can grab first. I just like to have the stuff at the top of the page loading in faster.
    if(processorStats.data)
    {
      approvedClaimAmountString.value = parseDollarAmountStringFromFixed2PointNotationNoDollarSign(processorStats.data.approvedClaimAmount)
      protocolApprovedClaimCount.value = processorStats.data.approvedClaimCount
      protocolDeniedClaimCount.value = processorStats.data.deniedClaimCount
      protocolUndeniedClaimCount.value = processorStats.data.undeniedClaimCount
      protocolMaxDeniedClaimCount.value = processorStats.data.maxDeniedClaimCount
      protocolSubmittedAppealCount.value = processorStats.data.submittedAppealCount
      protocolDeniedAppealCount.value = processorStats.data.deniedAppealCount
      protocolRevokedApprovalCount.value = processorStats.data.revokedApprovalCount
      protocolDenialHammerDroppedCount.value = processorStats.data.denialHammerDroppedCount
    }
    else
    {
      approvedClaimAmountString.value = "0.00"
      protocolApprovedClaimCount.value = 0
      protocolDeniedClaimCount.value = 0
      protocolUndeniedClaimCount.value = 0
      protocolMaxDeniedClaimCount.value = 0
      protocolSubmittedAppealCount.value = 0
      protocolDeniedAppealCount.value = 0
      protocolRevokedApprovalCount.value = 0
      protocolDenialHammerDroppedCount.value = 0
    }
    processedClaimsTableData.value = processedClaims.data

    //Get claim queue table data
    claimQueueTableData.value = claims.data
    if(claimQueue.data)
    {
      isClaimQueueOn.value = claimQueue.data.enabled
      currentClaimQueueCount.value = claimQueue.data.currentClaimQueueCount
      queueSizeLimit.value = claimQueue.data.queueSizeLimit
      
      if(currentClaimQueueCount.value && claimQueueTableData.value)
        nextInLine.value = claimQueueTableData.value[0].id
      else
        nextInLine.value = "Queue Currently Empty"  
    }
    else
    {
      isClaimQueueOn.value = false
      currentClaimQueueCount.value = 0
      queueSizeLimit.value = 100
      nextInLine.value = "Queue Not Initialized"  
    }

    //Get hospital data
    hospitalTableData.value = hospitals.data
    if(hospitalStats.data)
    {
      totalHospitalCount.value = hospitalStats.data.hospitalCount
      generalHospitalCount.value = hospitalStats.data.generalHospitalCount
      dentalHospitalCount.value = hospitalStats.data.dentalHospitalCount
      visionHospitalCount.value = hospitalStats.data.visionHospitalCount
      mentalHospitalCount.value = hospitalStats.data.mentalHospitalCount
    }
    else
    {
      totalHospitalCount.value = 0
      generalHospitalCount.value = 0
      dentalHospitalCount.value = 0
      visionHospitalCount.value = 0
      mentalHospitalCount.value = 0
    }

    //Get insurance company data
    insuranceCompanyTableData.value = insuranceCompanies.data
    if(insuranceCompanyStats.data)
      totalInsuranceCompanyCount.value = insuranceCompanyStats.data.additionalInsuranceCompanyCount + INITIAL_INSURANCE_COMPANY_COUNT
    else
      totalInsuranceCompanyCount.value = INITIAL_INSURANCE_COMPANY_COUNT
    
    isClaimQueueTableLoading.value = false
    isHospitalTableLoading.value = false
    isInsuranceCompanyTableLoading.value = false
    isProcessedClaimsTableLoading.value = false
  })

  watch(processorStats, () => 
  {
    approvedClaimAmountString.value = parseDollarAmountStringFromFixed2PointNotationNoDollarSign(processorStats.data.approvedClaimAmount)
    protocolApprovedClaimCount.value = processorStats.data.approvedClaimCount
    protocolDeniedClaimCount.value = processorStats.data.deniedClaimCount
    protocolUndeniedClaimCount.value = processorStats.data.undeniedClaimCount
    protocolMaxDeniedClaimCount.value = processorStats.data.maxDeniedClaimCount
    protocolSubmittedAppealCount.value = processorStats.data.submittedAppealCount
    protocolDeniedAppealCount.value = processorStats.data.deniedAppealCount
    protocolRevokedApprovalCount.value = processorStats.data.revokedApprovalCount
    protocolDenialHammerDroppedCount.value = processorStats.data.denialHammerDroppedCount
  })

  watch(claimQueue, () => 
  {
    isClaimQueueOn.value = claimQueue.data.enabled
    currentClaimQueueCount.value = claimQueue.data.currentClaimQueueCount
    queueSizeLimit.value = claimQueue.data.queueSizeLimit

    if(currentClaimQueueCount.value)
    {
      if(claimQueueTableData.value)
        nextInLine.value = claimQueueTableData.value[0].id
      else
        nextInLine.value = "Queue Currently Empty"
    }
    else
      nextInLine.value = "Queue Currently Empty"
  })

  watch(claims, () => 
  {
    claimQueueTableData.value = claims.data
  })

  watch(hospitalStats, () => 
  {
    totalHospitalCount.value = hospitalStats.data.hospitalCount
    generalHospitalCount.value = hospitalStats.data.generalHospitalCount
    dentalHospitalCount.value = hospitalStats.data.dentalHospitalCount
    visionHospitalCount.value = hospitalStats.data.visionHospitalCount
    mentalHospitalCount.value = hospitalStats.data.mentalHospitalCount
  })

  watch(hospitals, () => 
  {
    hospitalTableData.value = hospitals.data
  })

  watch(insuranceCompanyStats, () => 
  {
    totalInsuranceCompanyCount.value = insuranceCompanyStats.data.additionalInsuranceCompanyCount + INITIAL_INSURANCE_COMPANY_COUNT
  })

  watch(insuranceCompanies, () => 
  {
    insuranceCompanyTableData.value = insuranceCompanies.data
  })

  watch(processedClaims, () => 
  {
    processedClaimsTableData.value = processedClaims.data
  })

  watch(customUserNameHashMap, () =>
  {
    if(claimQueueTableData.value)
      for(var i=0; i<claimQueueTableData.value.length; i++)
      {
        const chatAccount = customUserNameHashMap.map.get(claimQueueTableData.value[i].submitterAddress)
        if(chatAccount)
        {
          if(chatAccount.useCustomName)
            claimQueueTableData.value[i].submitterDisplayName = chatAccount.userName
          else
            claimQueueTableData.value[i].submitterDisplayName = trimAddress(claimQueueTableData.value[i].submitterAddress)
        }
      }
    
    if(processedClaimsTableData.value)
      for(var i=0; i<processedClaimsTableData.value.length; i++)
      {
        const chatAccount = customUserNameHashMap.map.get(processedClaimsTableData.value[i].submitterAddress)
        if(chatAccount)
        {
          if(chatAccount.useCustomName)
            processedClaimsTableData.value[i].submitterDisplayName = chatAccount.userName
          else
            processedClaimsTableData.value[i].submitterDisplayName = trimAddress(processedClaimsTableData.value[i].submitterAddress)
        }
      }
  })

  function setTableSelect(index: number)
  {
    tableSelect.value = index 
    localStorage.setItem('queueTableSelect', index.toString())
  }

  function showHospitalRecords(selectedCountryIndex: number, selectedStateIndex: number, selectedHospitalIndex: number)
  {
    showQueueTableHospitalRecords.value = true
    localStorage.setItem('showQueueTableHospitalRecords', "true")
    localStorage.setItem('queueRecordCountryIndex', selectedCountryIndex.toString())
    localStorage.setItem('queueRecordStateIndex', selectedStateIndex.toString())
    localStorage.setItem('queueRecordHospitalIndex', selectedHospitalIndex.toString())
  }

  function showAllHospitals()
  {
    showQueueTableHospitalRecords.value = false
    localStorage.setItem('showQueueTableHospitalRecords', "false")
  }

  function showInsuranceCompanyList()
  {
    showQueueTableInsuranceCompanyRecords.value = false
    localStorage.setItem('showQueueTableInsuranceCompanyRecords', "false")
  }

  function showInsuranceCompanyRecords(selectedInsuranceCompanyIndex: number)
  {
    showQueueTableInsuranceCompanyRecords.value = true
    localStorage.setItem('showQueueTableInsuranceCompanyRecords', "true")
    localStorage.setItem('queueRecordInsuranceCompanyIndex', selectedInsuranceCompanyIndex.toString())
  }

  function moveToClaimPage(countryIndex: number, stateIndex: number, hospitalIndex:number)
  {
    mapSelection.preSelectedHospitalIndex = hospitalIndex

    const ZOOM_LAT_INDEX = 0
    const ZOOM_LONG_INDEX = 1

    mapSelection.countryIndex = countryIndex
    mapSelection.stateIndex = stateIndex
    mapSelection.isStateSelected = true
    mapSelection.selectedStateName = countryStateNameArray[countryIndex][stateIndex]
    mapSelection.zoomLat = countryStateCoordinatesArray[countryIndex][stateIndex][ZOOM_LAT_INDEX]
    mapSelection.zoomLong = countryStateCoordinatesArray[countryIndex][stateIndex][ZOOM_LONG_INDEX]
    
    localStorage.setItem('showStateHospitalRecords', "false")
    localStorage.setItem("mapCountryIndex", mapSelection.countryIndex.toString())
    localStorage.setItem("mapStateIndex", mapSelection.stateIndex.toString())
    localStorage.setItem("mapIsStateSelected", mapSelection.isStateSelected.toString())
    localStorage.setItem("mapSelectedStateName", mapSelection.selectedStateName)
    localStorage.setItem("mapDefaultLatitude", mapSelection.zoomLat.toString())
    localStorage.setItem("mapDefaultLongitude", mapSelection.zoomLong.toString())

    navigation.navBarIndex = 3
    localStorage.setItem("navigationNavbarIndex", "0")
  }
</script>