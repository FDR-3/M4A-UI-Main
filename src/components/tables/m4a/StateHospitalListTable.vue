<template>
  <div class="tableContainer">
    <DataTable 
      class="tableMinWidth"
      paginator 
      show-gridlines 
      :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      v-model:filters="filters" 
      ref="tableDownload" 
      :value="tableData"
      :loading="isLoading"
      :globalFilterFields="
      [
        'id', 
        'hospitalType', 
        'hospitalTypeName', 
        'hospitalName',
        'hospitalAddress', 
        'hospitalPhoneNumber', 
        'hospitalCity', 
        'hospitalZipCode', 
        'approvedClaimAmountString',
        'note'
      ]"  
    >
      <template #header>
        <div>
          <h1>{{stateName}} Hospital List</h1>
          <div class="flexCenterRowWidth" style="gap: 100px">
            <div class="stateStatsContainer">
              <h2 class="flexCenterRow statSpacingTop">State Total Hospitals: {{ stateTotalHospitalCount }}</h2>
              <div class="flexCenterRow statTopHospitalSpacing">
                <ion-button style="margin-left: -42px" fill="clear" @click="givePokemonCenterCreatorCredit()">
                  <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazN1BiMybI527AkmeVxopsR6nYgKDZFazU8GXHu" width="80"/>
                </ion-button>
                <h2 style="padding-top: 7px; margin-left: -10px">General Hospitals: {{ stateGeneralHospitalCount }}</h2>
              </div>
              <div class="flexCenterRow statHospitalSpacing">
                <ion-button style="margin-left: -42px" fill="clear" @click="givePokemonCenterCreatorCredit()">
                  <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNWtAaGHwuNPjCJgbOYz4DrkMvpEVGBFh1X6s5" width="80"/>
                </ion-button>
                <h2 style="padding-top: 7px; margin-left: -10px">Dental Hospitals: {{ stateDentalHospitalCount }}</h2>
              </div>
              <div class="flexCenterRow statHospitalSpacing">
                <ion-button style="margin-left: -42px" fill="clear" @click="givePokemonCenterCreatorCredit()">
                  <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNrYFyAr2cvyILZuPHpomK5CU6N2bAltaz03cT" width="80" style="padding:-10px"/>
                </ion-button>
                <h2 style="padding-top: 7px; margin-left: -10px">Vision Hospitals: {{ stateVisionHospitalCount }}</h2>
              </div>
              <div class="flexCenterRow statHospitalSpacing">
                <ion-button style="margin-left: -42px" fill="clear" @click="givePokemonCenterCreatorCredit()">
                  <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNCnJgmUjrdlPMfOjk8zL1aoRbyDWUGc9mQ0ew" width="80"/>
                </ion-button>
                <h2 style="padding-top: 7px; margin-left: -10px">Mental Hospitals: {{ stateMentalHospitalCount }}</h2>
              </div>
            </div>

            <div>
              <h2 class="statSpacingTop">State Approved Claim Amount: $<span class="rainbowText">{{ stateApprovedClaimTotalString }}</span></h2>
              <h2 class="stateStatSpacing">State Approved Claims: {{ stateApprovedClaimCount }}</h2>
              <h2 class="stateStatSpacing">State Denied Claims: {{ stateDeniedClaimCount }}</h2>
              <h2 class="stateStatSpacing">State Undenied Claims: {{ stateUndeniedClaimCount }}</h2>
              <h2 class="stateStatSpacing">State Submitted Appeals: {{ stateSubmittedAppealCount }}</h2>
              <h2 class="stateStatSpacing">State Denied Appeals: {{ stateDeniedAppealCount }}</h2>
              <h2 class="stateStatSpacing">State Revoked Approvals: {{ stateRevokedApprovalCount }}</h2>
            </div>
          </div>

          <ion-input color="dark" v-model="filters['global'].value" fill="outline" label-placement="stacked" :placeholder="`${stateName} Hospital Search   `">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>

          <ion-button fill="clear" style="margin-bottom: -5px" @click="exportCSV($event)">
            <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
          </ion-button>
        </div>
      </template>
      <template #empty> No records found.</template>
      <template #loading> Loading records. Please wait.</template>

      <Column field="id" header="Protocol Id" style="width: 0%" sortable></Column>
      <Column field="hospitalIndex" header="State Id" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.hospitalIndex + 1 }}
        </template></Column>
      <Column field="hospitalType" header="Type" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.hospitalTypeName }}
        </template>
      </Column>
      <Column field="hospitalName" header="Hospital Name" style="width: 20%" sortable>
        <template #body="slotProps">
          <ion-button class="hospitalButton" fill="clear" @click="openHospitalPopover($event, slotProps.data)">
            <div style="min-width: 40px; max-width: 40px">
                <img v-if="slotProps.data.hospitalType == HospitalTypes.General" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazN1BiMybI527AkmeVxopsR6nYgKDZFazU8GXHu"/>
                <img v-else-if="slotProps.data.hospitalType == HospitalTypes.Dental" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNWtAaGHwuNPjCJgbOYz4DrkMvpEVGBFh1X6s5"/>
                <img v-else-if="slotProps.data.hospitalType == HospitalTypes.Vision" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNrYFyAr2cvyILZuPHpomK5CU6N2bAltaz03cT"/>
                <img v-else-if="slotProps.data.hospitalType == HospitalTypes.Mental" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNCnJgmUjrdlPMfOjk8zL1aoRbyDWUGc9mQ0ew"/>
              </div>
              <ion-label align="left" class="hospitalButtonLabel" color="dark">{{ slotProps.data.hospitalName }}</ion-label>
          </ion-button>
          <ion-popover 
            :is-open="hospitalPopoverOpen" 
            :event="event" 
            @didDismiss="hospitalPopoverOpen = false"
            side="top" 
            alignment="center"
          >
            <div class="thinBorder flexCenterColumn m4aTablePopupContainer">
              <ion-label class="tablePopupUnderLine">Hospital Type</ion-label>
              {{ event.hospitalTypeName }}
              <ion-label class="tablePopupUnderLine">Records: {{ event.recordCount }}</ion-label>
              <ion-button color="dark" style="margin-bottom: -2px" @click="showHospitalRecords()">Show Records</ion-button>
            </div>
          </ion-popover>
        </template>
      </Column>
      <Column field="hospitalAddress" header="Street Address" style="width: 20%" sortable></Column>
      <Column field="hospitalPhoneNumber" header="Phone Number" style="width: 13%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.hospitalPhoneNumber }}
        </template>
      </Column>
      <Column field="hospitalCity" header="City" style="width: 10%" sortable></Column>
      <Column field="hospitalZipCode" header="Zip Code" style="width: 0%" sortable></Column>
      <Column field="approvedClaimAmount" header="Approved Claim Total Amount" style="width: 5%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.approvedClaimAmountString }}
        </template>
      </Column>   
      <Column field="note" header="Hospital Note" style="width: 0%" sortable></Column>
      <Column field="actions" header="Actions" style="width: 0%">
        <template #body="slotProps">
          <ion-button color="dark" @click="preFillClaim(slotProps.data)" style="width: 77px; height: 40px">New Claim</ion-button>
        </template>
      </Column> 
    </DataTable>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, defineProps } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonInput, IonPopover } from '@ionic/vue'
  import { search, download } from 'ionicons/icons'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import { givePokemonCenterCreatorCredit } from '/src/assets/helperFunctions/credits.ts'
  import { HospitalTypes } from '/src/types/HospitalTypes.ts'

  defineProps(
  [
    'tableData',
    'isLoading',
    'stateName',
    'countryIndex',
    'stateIndex',
    'stateApprovedClaimTotalString',
    'stateApprovedClaimCount',
    'stateDeniedClaimCount',
    'stateUndeniedClaimCount',
    'stateSubmittedAppealCount',
    'stateDeniedAppealCount',
    'stateRevokedApprovalCount',
    'stateTotalHospitalCount',
    'stateGeneralHospitalCount',
    'stateDentalHospitalCount',
    'stateVisionHospitalCount',
    'stateMentalHospitalCount'
  ])

  const emits = defineEmits(['showHospitalRecords', 'hospitalSelect'])

  const tableDownload = ref()
  var hospitalPopoverOpen = ref(false)
  var event = ref()

  function openHospitalPopover(e: Event, rowData: any)
  {
    event.value = e
    event.value.hospitalName = rowData.hospitalName
    event.value.countryIndex = rowData.countryIndex
    event.value.stateIndex = rowData.stateIndex
    event.value.hospitalIndex = rowData.hospitalIndex
    event.value.hospitalTypeName = rowData.hospitalTypeName
    event.value.recordCount = rowData.recordCount
    hospitalPopoverOpen.value = true
  }

  async function showHospitalRecords()
  {
    hospitalPopoverOpen.value = false
    await sleep(100)
    emits('showHospitalRecords', event.value.countryIndex, event.value.stateIndex, event.value.hospitalIndex)
  }

  function preFillClaim(rowData:any)
  {
    document.getElementById("submitClaimsHeader")?.scrollIntoView()
    emits('hospitalSelect', rowData.hospitalIndex)
  }
  
  function exportCSV(e: Event) 
  {
    tableDownload.value.exportCSV()
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  async function sleep(ms: number): Promise<void> 
  {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
</script>
  
<style scoped>
  .tableMinWidth
  {
    min-width: 1375px
  }

  ion-input
  {
    --highlight-color: var(--ion-color-green)
  }
</style>