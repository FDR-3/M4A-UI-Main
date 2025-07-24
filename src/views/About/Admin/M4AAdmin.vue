<template>
  <div v-if="!anchorPrograms.areM4AProtocolStatsReady" class="mediumMarginTop">
    <ion-button color="dark" @click="initializeProtocolStats()">Commence South Carolina BETA</ion-button>
  </div>
  
  <div>
    <AdminProcessorsTable 
    v-if="adminTableSelect==0"
    @toggleClaimQueueTable="setM4AAdminTableSelect(1)"
    @toggleHospitalTable="setM4AAdminTableSelect(2)"
    @toggleInsuranceCompanyTable="setM4AAdminTableSelect(3)"
    @toggleProcessedClaimsTable="setM4AAdminTableSelect(4)"
    :tableData="processorsTableData"
    :isLoading="isProcessorsTableLoading"
    />
    <AdminClaimQueueTable 
    v-if="adminTableSelect==1"
    @toggleProcessorsTable="setM4AAdminTableSelect(0)"
    @toggleHospitalTable="setM4AAdminTableSelect(2)"
    @toggleInsuranceCompanyTable="setM4AAdminTableSelect(3)"
    @toggleProcessedClaimsTable="setM4AAdminTableSelect(4)"
    :tableData="claimQueueTableData"
    :isLoading="isClaimQueueTableLoading"
    :isClaimQueueOn="isClaimQueueOn"
    :currentClaimQueueCount="currentClaimQueueCount"
    :claimQueueSizeLimit="claimQueueSizeLimit"
    />
    <AdminHospitalTable 
    v-if="adminTableSelect==2"
    @toggleProcessorsTable="setM4AAdminTableSelect(0)"
    @toggleClaimQueueTable="setM4AAdminTableSelect(1)"
    @toggleInsuranceCompanyTable="setM4AAdminTableSelect(3)"
    @toggleProcessedClaimsTable="setM4AAdminTableSelect(4)"
    :tableData="hospitalTableData"
    :isLoading="isHospitalTableLoading"
    />
    <AdminInsuranceCompanyTable 
    v-if="adminTableSelect==3"
    @toggleProcessorsTable="setM4AAdminTableSelect(0)"
    @toggleClaimQueueTable="setM4AAdminTableSelect(1)"
    @toggleHospitalTable="setM4AAdminTableSelect(2)"
    @toggleProcessedClaimsTable="setM4AAdminTableSelect(4)"
    :tableData="insuranceCompanyTableData"
    :isLoading="isInsuranceCompanyTableLoading"
    />
    <AdminProcessedClaimsTable 
    v-if="adminTableSelect==4"
    @toggleProcessorsTable="setM4AAdminTableSelect(0)"
    @toggleClaimQueueTable="setM4AAdminTableSelect(1)"
    @toggleHospitalTable="setM4AAdminTableSelect(2)"
    @toggleInsuranceCompanyTable="setM4AAdminTableSelect(3)"
    :tableData="processedClaimsTableData"
    :isLoading="isProcessedClaimsTableLoading"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, inject } from 'vue'
  import { IonButton } from '@ionic/vue'
  import AdminProcessorsTable from '/src/components/tables/m4a/admin/AdminProcessorsTable.vue'
  import AdminClaimQueueTable from '/src/components/tables/m4a/admin/AdminClaimQueueTable.vue'
  import AdminHospitalTable from '/src/components/tables/m4a/admin/AdminHospitalTable.vue'
  import AdminInsuranceCompanyTable from '/src/components/tables/m4a/admin/AdminInsuranceCompanyTable.vue'
  import AdminProcessedClaimsTable from '/src/components/tables/m4a/admin/AdminProcessedClaimsTable.vue'
  import { confirmM4ATransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

  defineProps(
  [
    'processorsTableData',
    'claimQueueTableData',
    'hospitalTableData',
    'insuranceCompanyTableData',
    'processedClaimsTableData',
    'isProcessorsTableLoading',
    'isClaimQueueTableLoading',
    'isHospitalTableLoading',
    'isInsuranceCompanyTableLoading',
    'isProcessedClaimsTableLoading',
    'isClaimQueueOn',
    'currentClaimQueueCount',
    'claimQueueSizeLimit'
  ])

  const toast = inject('toast')

  var adminTableSelect = ref()

  onMounted(async() => 
  {
    adminTableSelect.value = localStorage.getItem("m4aAdminTableSelect") || 0
  })

  function setM4AAdminTableSelect(value: number)
  {
    adminTableSelect.value = value
    localStorage.setItem("m4aAdminTableSelect", value.toString()) 
  }

  async function initializeProtocolStats()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.initializeProtocolStats().rpc()
      await confirmM4ATransaction(tx, toast, "initialize_protocol_stats")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "initialize_protocol_stats")
    }
  }
</script>
