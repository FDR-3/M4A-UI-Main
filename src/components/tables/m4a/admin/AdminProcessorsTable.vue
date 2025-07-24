<template>
  <h1 >Processors</h1>

  <div class="tableContainer">
    <DataTable
      ref="tableDownload"
      class="tableMinWidth"
      paginator 
      show-gridlines 
      :rows="20" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      dataKey="id"
      v-model:expandedRows="processorStats" 
      v-model:filters="filters" 
      :value="tableData"
      :loading="isLoading"
      :globalFilterFields="
      [
        'id', 
        'processorDisplayName', 
        'address',
        'isActive',
        'isSuperAdmin',
        'isProcessingClaim',
        'createdHospitalCount',
        'createdInsuranceCompanyCount',
        'processedClaimCount',
        'approvedClaimCount', 
        'maxDeniedClaimCount', 
        'deniedClaimCount',
        'submitterAddressOfClaimBeingProcessed'
      ]"
    >
      <template #header>
        <div style="margin-bottom: -10px">
          <div class="tableToggleButtonContainer smallMarginBottom">
            <ion-button color="dark" class="tableToggleSelect" :disabled="true">Toggle Processors Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleClaimQueueTable')">Toggle Claim Table</ion-button>        
            <ion-button color="dark" @click="$emit('toggleHospitalTable')">Toggle Hospital Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleInsuranceCompanyTable')">Toggle Insurance Company Table</ion-button> 
            <ion-button color="dark" @click="$emit('toggleProcessedClaimsTable')">Toggle Processed Claims Table</ion-button>
          </div>
          <ion-input color="dark" v-model="filters['global'].value" fill="outline" label-placement="stacked" placeholder="Processor Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>

          <ion-button fill="clear" @click="expandProcessorStats()">
            <ion-label  color="dark">Expand Processors</ion-label>
          </ion-button>

          <ion-button fill="clear" @click="exportCSV($event)">
            <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
          </ion-button>

          <ion-button fill="clear" @click="processorStats={}">
            <ion-label  color="dark">Collapse Processors</ion-label>
          </ion-button>
        </div>
      </template>
      <template #empty> No records found.</template>
      <template #loading> Loading records. Please wait.</template>

      <Column expander style="width: 0%"/>
      <Column field="id" header="Id" style="width: 0%" sortable></Column>
      <Column field="processorDisplayName" header="Employee" style="width: 10%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
              <StarWolf class="starWolfButton" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
              <ion-label color="dark">
                {{ slotProps.data.processorDisplayName }}
              </ion-label>
          </div>
        </template>
      </Column>
      <Column field="isActive" header="Active" style="width: 0%" sortable>
        <template #body="slotProps">
          <div v-if="slotProps.data.isActive">
            <ion-text color="green">True</ion-text>
          </div>
          <div v-else>
            <ion-text color="red">False</ion-text>
          </div>
        </template>
      </Column>
      <Column field="isSuperAdmin" header="Super Admin" style="width: 0%" sortable>
        <template #body="slotProps">
          <div v-if="slotProps.data.isSuperAdmin">
            <ion-text color="green">True</ion-text>
          </div>
          <div v-else>
            <ion-text color="red">False</ion-text>
          </div>
        </template>
      </Column>
      <Column field="isProcessingClaim" header="Processing Claim" style="width: 0%" sortable>
        <template #body="slotProps">
          <div v-if="slotProps.data.isProcessingClaim">
            <ion-text color="green">True</ion-text>
          </div>
          <div v-else>
            <ion-text color="red">False</ion-text>
          </div>
        </template>
      </Column>
      <Column field="createdHospitalCount" header="Hospital Created" style="width: 0%" sortable></Column>
      <Column field="createdInsuranceCompanyCount" header="Insurance Company Created" style="width: 0%" sortable></Column>
      <Column field="processedClaimCount" header="Claims Processed" style="width: 0%" sortable></Column>
      <Column field="approvedClaimCount" header="Claims Approved" style="width: 0%" sortable></Column>
      <Column field="maxDeniedClaimCount" header="Claims Max Denied" style="width: 0%" sortable></Column>
      <Column field="deniedClaimCount" header="Claims Denied" style="width: 0%" sortable></Column>
      <Column v-if="connectedWallet.addressString==adminAccounts.m4aCEOAddress" header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div>
            <ion-button 
              v-if="slotProps.data.isActive" 
              @click="toggleProcessorActiveFlag(slotProps.data.address, false)"
              color="dark" 
            >
              Set Inactive
            </ion-button>
            <ion-button
              v-else
              @click="toggleProcessorActiveFlag(slotProps.data.address, true)"
              color="dark" 
            >
              Set Active
            </ion-button>
            <ion-button
              v-if="slotProps.data.isSuperAdmin"
              @click="toggleProcessorSuperAdminFlag(slotProps.data.address, false)"
              color="dark"
            >
              Unset as Super Admin
            </ion-button>
            <ion-button
              v-else
              @click="toggleProcessorSuperAdminFlag(slotProps.data.address, true)"
              color="dark"
            >
              Set as Super Admin
            </ion-button>
            <ion-button
              v-if="slotProps.data.isProcessingClaim"
              @click="setProcessorToNotProcessingClaimState(slotProps.data.address)"
              color="dark"
              >
              Reset Processor To Not Processing Dead Claim (Will need to update Claim if it still exists)
            </ion-button>
          </div>
        </template>
      </Column>

      <template #expansion="slotProps">
        <DataTable :value="[slotProps.data]">
          <Column field="undeniedClaimCount" header="Claims Undenied" style="width: 0%"></Column>
          <Column field="deniedAppealCount" header="Appeals Denied" style="width: 0%"></Column>
          <Column field="revokedApprovalCount" header="Revoked Approvals" style="width: 0%"></Column>
          <Column field="denialHammerDroppedCount" header="Denial Hammers Dropped" style="width: 0%"></Column>
        </DataTable>

        <DataTable :value="[slotProps.data]">
          <Column field="submitterAddressOfClaimBeingProcessed" header="Submitter Address of Assigned Claim" style="width: 0%">
            <template #body="slotProps">
              <div v-if="slotProps.data.submitterAddressOfClaimBeingProcessed!=SYSTEM_PROGRAM_ADDRESS_STRING">
                {{ slotProps.data.submitterAddressOfClaimBeingProcessed }}
              </div>
              <div v-else>
                <ion-text>None</ion-text>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </DataTable>
  </div>
  <div v-if="connectedWallet.addressString==adminAccounts.m4aCEOAddress && anchorPrograms.areM4AProtocolStatsReady" class="thickBorder smallMarginTop">
    <div class="smallMarginTop">
      <ion-text >Create Processor Account</ion-text>
    </div>
    <div class=" flexCenterRow">
      <div style="width: 90%">
        <ion-input v-model="employeeAddressInput" fill="outline" placeholder="Enter New Employee Public Wallet Address"></ion-input>
        <ion-button class="smallMarginBottom" color="dark" @click="createProcessorAccount()">Confirm</ion-button>
      </div>
    </div>
  </div>

  <div v-if="connectedWallet.addressString==adminAccounts.m4aCEOAddress" class="thickBorder smallMarginTop">
    <div class="smallMarginTop">
      <ion-text >M4A Fee Token Account</ion-text>
    </div>
    <div class=" flexCenterRow">
      <div style="width: 90%">
        <ion-input v-model="tokenMintAddressInput" fill="outline" placeholder="Enter The Mint Address For The Fee Token"></ion-input>
        <ion-input v-model="tokenDecmialCountInput" fill="outline" type="number" placeholder="Enter The Token Decimal Count When Adding" class="tinyMarginTop"></ion-input>
         
        <div class="flexCenterRow">
          <ion-button class="smallMarginBottom" color="dark" @click="addM4AFeeTokenAccount()" style="width:77px">Add</ion-button>
          <ion-button class="smallMarginBottom" color="dark" @click="removeM4AFeeTokenAccount()" style="width:77px">Remove</ion-button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, onMounted, inject } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonInput, IonText } from '@ionic/vue'
  import { search, download } from 'ionicons/icons'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import { confirmM4ATransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import {  PublicKey } from "@solana/web3.js"

  defineEmits(['toggleClaimQueueTable', 'toggleHospitalTable', 'toggleInsuranceCompanyTable', 'toggleProcessedClaimsTable'])

  const props = defineProps(['tableData', 'isLoading'])

  const toast = inject('toast')

  const processorStats = ref()
  const tableDownload = ref()
  var isDataEdited = ref(false)

  var employeeAddressInput = ref()

  var tokenMintAddressInput = ref()
  var tokenDecmialCountInput = ref()

  onMounted(async() =>
  {
    isDataEdited.value = false
  })

  const expandProcessorStats = () => 
  {
    processorStats.value = props.tableData.reduce((acc: { [x: string]: boolean }, p: { id: string | number }) => (acc[p.id] = true) && acc, {})
  }

  function exportCSV(e: Event) 
  {
    tableDownload.value.exportCSV()
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  async function createProcessorAccount()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.createProcessorAccount(new PublicKey(employeeAddressInput.value)).rpc()
      employeeAddressInput.value = ""
      await confirmM4ATransaction(tx, toast, "create_processor_account")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "create_processor_account")
    }
  }

  async function addM4AFeeTokenAccount()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.addFeeTokenEntry(new PublicKey(tokenMintAddressInput.value), tokenDecmialCountInput.value).rpc()
      tokenMintAddressInput.value = ""
      tokenDecmialCountInput.value = ""
      await confirmM4ATransaction(tx, toast, "add_fee_token_entry")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "add_fee_token_entry")
    }
  }

  async function removeM4AFeeTokenAccount()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.removeFeeTokenEntry(new PublicKey(tokenMintAddressInput.value)).rpc()
      tokenMintAddressInput.value = ""
      tokenDecmialCountInput.value = ""
      await confirmM4ATransaction(tx, toast, "remove_fee_token_entry")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "remove_fee_token_entry")
    }
  }
  
  async function toggleProcessorActiveFlag(processorAddress: PublicKey, flag: boolean)
  {
    try
    {console.log(processorAddress)
      const tx = await anchorPrograms.m4a.m4aProgram.methods.setProcessorAccountActiveFlag(processorAddress, flag).rpc()
      await confirmM4ATransaction(tx, toast, "toggle_processor_active_flag")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "toggle_processor_active_flag")
    }
  }

  async function toggleProcessorSuperAdminFlag(processorAddress: PublicKey, flag: boolean)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.setProcessorAccountPrivilege(processorAddress, flag).rpc()
      await confirmM4ATransaction(tx, toast, "toggle_processor_super_admin_flag")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "toggle_processor_super_admin_flag")
    }
  }

  async function setProcessorToNotProcessingClaimState(processorAddress: PublicKey)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.setProcessorToNotProcessingClaimState(processorAddress).rpc()
      await confirmM4ATransaction(tx, toast, "set_processor_to_not_processing_claim_state")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "set_processor_to_not_processing_claim_state")
    }
  }
</script>
  
<style scoped>
  .tableMinWidth
  {
    min-width: 1667px
  }

  .actionButton
  {
    width: 100px !important;
    height: 50px !important
  }

  ion-input
  {
    --highlight-color: var(--ion-color-gray)
  }
</style>