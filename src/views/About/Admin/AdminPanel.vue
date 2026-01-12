<template>
  <div class="mediumMarginTop">
    <b id="accessGrantedText">Access Granted</b>
    <div class="tinyMarginTop">
      <ion-button
        v-if="adminAccounts.isChatCEOAccountReady"
        :class="adminPanelSelect==1 ? 'tableToggleSelect' : ''"
        color="dark"
        @click="setAdminPanelSelect(1)"
        :disabled="adminPanelSelect==1"
      >
        Toggle Chat Admin Page
      </ion-button>
      <ion-button
        v-if="adminAccounts.isAlertCEOAccountReady"
        :class="adminPanelSelect==3 ? 'tableToggleSelect' : ''"
        color="dark"
        @click="setAdminPanelSelect(3)"
        :disabled="adminPanelSelect==3"
      >
        Toggle Alert Admin Page
      </ion-button>
      <ion-button
        v-if="adminAccounts.isLendingCEOAccountReady"
        :class="adminPanelSelect==2 ? 'tableToggleSelect' : ''"
        color="dark"
        @click="setAdminPanelSelect(2)"
        :disabled="adminPanelSelect==2"
      >
        Toggle Lending Admin Page
      </ion-button>
      <ion-button
        v-if="adminAccounts.isM4ACEOAccountReady"
        :class="adminPanelSelect==0 ? 'tableToggleSelect' : ''"
        color="dark"
        @click="setAdminPanelSelect(0)"
        :disabled="adminPanelSelect==0"
      >
        Toggle M4A Admin Page
      </ion-button>
    </div>
  </div>

  <M4AAdmin v-if="adminPanelSelect==0 && 
    (connectedWallet.addressString==adminAccounts.m4aCEOAddress ||
    connectedWallet.addressString==adminAccounts.m4aTreasurerAddress ||
    connectedWallet.isProcessorAccountActive)"
    :processorsTableData="processorsTableData"
    :claimQueueTableData="claimQueueTableData"
    :hospitalTableData="hospitalTableData"
    :insuranceCompanyTableData="insuranceCompanyTableData"
    :processedClaimsTableData="processedClaimsTableData"
    :isProcessorsTableLoading="isProcessorsTableLoading"
    :isClaimQueueTableLoading="isClaimQueueTableLoading"
    :isHospitalTableLoading="isHospitalTableLoading"
    :isInsuranceCompanyTableLoading="isInsuranceCompanyTableLoading"
    :isProcessedClaimsTableLoading="isProcessedClaimsTableLoading"
    :isClaimQueueOn="isClaimQueueOn"
    :currentClaimQueueCount="currentClaimQueueCount"
    :claimQueueSizeLimit="claimQueueSizeLimit"
  />

  <ChatAdmin v-if="adminPanelSelect==1 &&
    (connectedWallet.addressString==adminAccounts.chatCEOAddress || connectedWallet.addressString==adminAccounts.chatTreasurerAddress)"
    :isPollTableDataLoading="isPollTableDataLoading"
    :pollTableData="pollTableData"
  />

  <LendingAdmin v-if="adminPanelSelect==2 &&
    (connectedWallet.addressString==adminAccounts.lendingCEOAddressString ||
     connectedWallet.addressString==adminAccounts.singlePayerTreasuryAddress.toString() ||
     connectedWallet.addressString==adminAccounts.hodlTreasuryAddress.toString() ||
     connectedWallet.addressString==adminAccounts.solvencyTreasuryAddress.toString())"
  />

  <AlertAdmin v-if="adminPanelSelect==3 &&
    (connectedWallet.addressString==adminAccounts.alertCEOAddress)"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { IonButton } from '@ionic/vue'
  import M4AAdmin from '/src/views/About/Admin/M4AAdmin.vue'
  import ChatAdmin from '/src/views/About/Admin/ChatAdmin.vue'
  import LendingAdmin from '/src/views/About/Admin/LendingAdmin.vue'
  import AlertAdmin from '/src/views/About/Admin/AlertAdmin.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { claimQueue, claims, processedClaims } from '/src/assets/globalStates/m4a/Claims.vue'
  import { hospitals } from '/src/assets/globalStates/m4a/Hospitals.vue'
  import { insuranceCompanies } from '/src/assets/globalStates/m4a/InsuranceCompanies.vue'
  import { processors } from '/src/assets/globalStates/m4a/Processors.vue'
  import { polls } from '/src/assets/globalStates/chat/Polls.vue'
  import cloneDeep from 'lodash/cloneDeep'

  var adminPanelSelect = ref()

  var processorsTableData = ref()
  var claimQueueTableData = ref()
  var hospitalTableData = ref()
  var insuranceCompanyTableData = ref()
  var processedClaimsTableData = ref()
  var pollTableData = ref()

  var isClaimQueueOn = ref()
  var currentClaimQueueCount = ref()
  var claimQueueSizeLimit = ref()

  var isProcessorsTableLoading = ref(true)
  var isClaimQueueTableLoading = ref(true)
  var isHospitalTableLoading = ref(true)
  var isInsuranceCompanyTableLoading = ref(true)
  var isProcessedClaimsTableLoading = ref(true)
  var isPollTableDataLoading = ref(true)

  onMounted(() => 
  {
    adminPanelSelect.value = localStorage.getItem("adminPanelSelect") || 0

    if(processors.data)
    {
      processorsTableData.value = processors.data
      isProcessorsTableLoading.value = false
    }

    if(claimQueue.data)
    {
      isClaimQueueOn.value = claimQueue.data.enabled
      currentClaimQueueCount.value = claimQueue.data.currentClaimQueueCount
      claimQueueSizeLimit.value = claimQueue.data.queueSizeLimit
    }
    else
    {
      isClaimQueueOn.value = false
      currentClaimQueueCount.value = 0
      claimQueueSizeLimit.value = 0
      claimQueueTableData.value = []
    }

    if(claims.data)
    {
      claimQueueTableData.value = cloneDeep(claims.data)
      isClaimQueueTableLoading.value = false
    }

    if(hospitals.data)
    {
      hospitalTableData.value = cloneDeep(hospitals.data)
      isHospitalTableLoading.value = false
    }

    if(insuranceCompanies.data)
    {
      insuranceCompanyTableData.value = cloneDeep(insuranceCompanies.data)
      isInsuranceCompanyTableLoading.value = false
    }
    
    if(processedClaims.data)
    {
      processedClaimsTableData.value = cloneDeep(processedClaims.data)
      isProcessedClaimsTableLoading.value = false
    }
    
    if(polls.data)
    {
      pollTableData.value = polls.data
      isPollTableDataLoading.value = false
    } 
  })

  watch(processors, () => 
  {
    //Get processors table data
    processorsTableData.value = processors.data

    if(isProcessorsTableLoading.value)
      isProcessorsTableLoading.value = false
  })

  watch(claimQueue, () => 
  {
    isClaimQueueOn.value = claimQueue.data.enabled
    claimQueueSizeLimit.value = claimQueue.data.queueSizeLimit
    currentClaimQueueCount.value = claimQueue.data.currentClaimQueueCount
  })

  watch(claims, () => 
  {
    //Get claims table data
    claimQueueTableData.value = cloneDeep(claims.data)

    if(isClaimQueueTableLoading.value)
      isClaimQueueTableLoading.value = false
  })

  watch(hospitals, () => 
  {
    //Get hospital table data
    hospitalTableData.value = cloneDeep(hospitals.data)

    if(isHospitalTableLoading.value)
      isHospitalTableLoading.value = false
  })

  watch(insuranceCompanies, () => 
  {
    //Get insurance company table data
    insuranceCompanyTableData.value = cloneDeep(insuranceCompanies.data)

    if(isInsuranceCompanyTableLoading.value)
      isInsuranceCompanyTableLoading.value = false
  })

  watch(processedClaims, () => 
  {
    //Get processed claims table data
    processedClaimsTableData.value = cloneDeep(processedClaims.data)

    if(isProcessedClaimsTableLoading.value)
      isProcessedClaimsTableLoading.value = false
  })

  watch(polls, () => 
  {
    //Get poll table data
    pollTableData.value = cloneDeep(polls.data)

    if(isPollTableDataLoading.value)
      isPollTableDataLoading.value = false
  })

  function setAdminPanelSelect(value: number)
  {
    adminPanelSelect.value = value
    localStorage.setItem("adminPanelSelect", value.toString()) 
  }
</script>

<style scoped>
  #accessGrantedText
  {
    font-size: min(5vw, 25px)
  }
</style>
