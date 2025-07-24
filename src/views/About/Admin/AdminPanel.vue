<template>
  <div class="mediumMarginTop">
    <b id="accessGrantedText">Access Granted</b>
    <div class="tinyMarginTop">
      <ion-button
        v-if="adminAccounts.isM4ACEOAccountReady"
        :class="adminPanelSelect==0 ? 'tableToggleSelect' : ''"
        color="dark"
        @click="setAdminPanelSelect(0)"
        :disabled="adminPanelSelect==0"
      >
        Toggle M4A Admin Page
      </ion-button>
      <ion-button
        v-if="adminAccounts.isChatCEOAccountReady"
        :class="adminPanelSelect==1 ? 'tableToggleSelect' : ''"
        color="dark"
        @click="setAdminPanelSelect(1)"
        :disabled="adminPanelSelect==1"
      >
        Toggle Chat Admin Page
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
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { IonButton } from '@ionic/vue'
  import M4AAdmin from '/src/views/About/Admin/M4AAdmin.vue'
  import ChatAdmin from '/src/views/About/Admin/ChatAdmin.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { claimQueue, claims, processedClaims } from '/src/assets/globalStates/m4a/Claims.vue'
  import { hospitals } from '/src/assets/globalStates/m4a/Hospitals.vue'
  import { insuranceCompanies } from '/src/assets/globalStates/m4a/InsuranceCompanies.vue'
  import { processors } from '/src/assets/globalStates/m4a/Processors.vue'
  import { polls } from '/src/assets/globalStates/chat/Polls.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { trimAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
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

  var pollStatsWatchId: any

  onMounted(() => 
  {
    adminPanelSelect.value = localStorage.getItem("adminPanelSelect") || 0

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

    processorsTableData.value = processors.data
    claimQueueTableData.value = cloneDeep(claims.data)
    hospitalTableData.value = cloneDeep(hospitals.data)
    insuranceCompanyTableData.value = cloneDeep(insuranceCompanies.data)
    processedClaimsTableData.value = cloneDeep(processedClaims.data)

    if(polls.data)
      pollTableData.value = polls.data

    isProcessorsTableLoading.value = false
    isClaimQueueTableLoading.value = false
    isHospitalTableLoading.value = false
    isInsuranceCompanyTableLoading.value = false
    isProcessedClaimsTableLoading.value = false 
    isPollTableDataLoading.value = false
  })

  onUnmounted(() =>
  {
    if(pollStatsWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(pollStatsWatchId)
      pollStatsWatchId = undefined
    }
  })

  watch(claimQueue, () => 
  {
    isClaimQueueOn.value = claimQueue.data.enabled
    claimQueueSizeLimit.value = claimQueue.data.queueSizeLimit
    currentClaimQueueCount.value = claimQueue.data.currentClaimQueueCount
  })

  watch(claims, () => 
  {
    claimQueueTableData.value = cloneDeep(claims.data)
  })

  watch(hospitals, () => 
  {
    //Get hospital table data
    hospitalTableData.value = cloneDeep(hospitals.data)
  })

  watch(insuranceCompanies, () => 
  {
    //Get insurance company table data
    //insuranceCompanyTableData.value = JSON.parse(JSON.stringify(insuranceCompanies.data));
    insuranceCompanyTableData.value = cloneDeep(insuranceCompanies.data)
  })

  watch(processors, () => 
  {
    //Get processors table data
    processorsTableData.value = processors.data
  })

  watch(processedClaims, () => 
  {
    //Get processed claims table data
    processedClaimsTableData.value = cloneDeep(processedClaims.data)
  })

  watch(polls, () => 
  {
    //Get poll table data
    pollTableData.value = cloneDeep(polls.data)
  })

  watch(customUserNameHashMap, () =>
  {
    if(processorsTableData.value)
      for(var i=0; i<processorsTableData.value.length; i++)
      {
        const chatAccount = customUserNameHashMap.map.get(processorsTableData.value[i].address)
        if(chatAccount)
        {
          if(chatAccount.useCustomName)
            processorsTableData.value[i].processorDisplayName = chatAccount.userName
          else
            processorsTableData.value[i].processorDisplayName = trimAddress(processorsTableData.value[i].address)
        }
      }

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
