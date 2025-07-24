<template>
  <h1 id="tableTop">Hospitals</h1>
  <h2 class="statSpacingTop">Total Approved Claim Amount: $<span class="rainbowText">{{ approvedClaimAmountString }}</span></h2>
  <h2 class="statSpacing">Total Hospitals: {{ totalHospitalCount }}</h2>
  <div>
    <div>
      <div class="flexCenterRow statTopHospitalSpacing">
        <ion-button style="margin-left: -42px" fill="clear" @click="givePokemonCenterCreatorCredit()">
          <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazN1BiMybI527AkmeVxopsR6nYgKDZFazU8GXHu" width="80"/>
        </ion-button>
        <h2 style="padding-top: 7px; margin-left: -10px">General Hospitals: {{ generalHospitalCount }}</h2>
      </div>
      <div class="flexCenterRow statHospitalSpacing">
        <ion-button style="margin-left: -42px" fill="clear" @click="givePokemonCenterCreatorCredit()">
          <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNWtAaGHwuNPjCJgbOYz4DrkMvpEVGBFh1X6s5" width="80"/>
        </ion-button>
        <h2 style="padding-top: 7px; margin-left: -10px">Dental Hospitals: {{ dentalHospitalCount }}</h2>
      </div>
      <div class="flexCenterRow statHospitalSpacing">
        <ion-button style="margin-left: -42px" fill="clear" @click="givePokemonCenterCreatorCredit()">
          <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNrYFyAr2cvyILZuPHpomK5CU6N2bAltaz03cT" width="80" style="padding:-10px"/>
        </ion-button>
        <h2 style="padding-top: 7px; margin-left: -10px">Vision Hospitals: {{ visionHospitalCount }}</h2>
      </div>
      <div class="flexCenterRow statHospitalSpacing">
        <ion-button style="margin-left: -42px" fill="clear" @click="givePokemonCenterCreatorCredit()">
          <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNCnJgmUjrdlPMfOjk8zL1aoRbyDWUGc9mQ0ew" width="80"/>
        </ion-button>
        <h2 style="padding-top: 7px; margin-left: -10px">Mental Hospitals: {{ mentalHospitalCount }}</h2>
      </div>
    </div>
</div>
  
  <div class="tableContainer">
    <DataTable
      ref="tableDownload"
      class="tableMinWidth"
      paginator 
      show-gridlines 
      :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      dataKey="id" 
      v-model:expandedRows="hospitalDetails" 
      v-model:filters="filters" 
      :value="tableData"
      :loading="isLoading"
      :globalFilterFields="
      [ 
        'id',
        'hospitalType',
        'hospitalTypeName',
        'hospitalLongitude',
        'hospitalLatitude',
        'hospitalName', 
        'countryIndex',
        'stateIndex', 
        'hospitalIndex', 
        'hospitalCountryName',
        'hospitalStateName', 
        'hospitalCity', 
        'hospitalAddress', 
        'hospitalPhoneNumber', 
        'hospitalZipCode', 
        'approvedClaimAmountString',
        'note',
        'isActive'
      ]"
    >
      <template #header>
        <div style="margin-bottom: -10px">
          <div class="tableToggleButtonContainer smallMarginBottom"> 
            <ion-button color="dark" @click="$emit('toggleClaimQueueTable')">Toggle Claim Queue</ion-button>
            <ion-button color="dark" class="tableToggleSelect" :disabled="true">Toggle Hospital Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleInsuranceCompanyTable')">Toggle Insurance Company Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleProcessedClaimsTable')">Toggle Processed Claims</ion-button>
          </div>
          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="Hospital Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>

          <ion-button fill="clear" @click="exportCSV($event)">
            <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
          </ion-button>
        </div>
      </template>
      <template #empty> No records found.</template>
      <template #loading> Loading records. Please wait.</template>

      <Column field="id" header="Id" style="width: 0%" sortable></Column>
      <Column field="hospitalTypeName" header="Type" style="width: 0%" sortable></Column>
      <Column field="hospitalName" header="Hospital Name" style="width: 10%" sortable>
        <template #body="slotProps">
          <div>
      
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
                <div class="flexCenterRow">
                  <ion-button class="showRecordsButton" color="dark" @click="showHospitalRecords()">Show Records</ion-button>
                </div>
              </div>
            </ion-popover>

          </div>
        </template>
      </Column>
      <Column field="hospitalCountryName" header="Country" style="width: 0%" sortable></Column>
      <Column field="hospitalStateName" header="State" style="width: 0%" sortable></Column>
      <Column field="hospitalCity" header="City" style="width: 5%" sortable></Column>
      <Column field="hospitalAddress" header="Address" style="width: 10%" sortable></Column>
      <Column field="hospitalZipCode" header="ZipCode" style="width: 0%" sortable></Column>
      <Column field="hospitalPhoneNumber" header="Phone Number" style="width: 7%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.hospitalPhoneNumber }}
        </template>
      </Column>
      <Column field="approvedClaimAmount" header="Approved Claim Total" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.approvedClaimAmountString }}
        </template>
      </Column>
      <Column field="note" header="Note" style="width: 0%" sortable></Column>
    </DataTable>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonInput, IonPopover } from '@ionic/vue'
  import { search, download } from 'ionicons/icons'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import { givePokemonCenterCreatorCredit } from '/src/assets/helperFunctions/credits.ts'
  import { HospitalTypes } from '/src/types/HospitalTypes.ts'

  const emits = defineEmits(['toggleClaimQueueTable', 'toggleInsuranceCompanyTable', 'toggleProcessedClaimsTable', 'showHospitalRecords'])

  defineProps(
  [
    'tableData',
    'isLoading',
    'approvedClaimAmountString',
    'totalHospitalCount',
    'generalHospitalCount',
    'dentalHospitalCount',
    'visionHospitalCount',
    'mentalHospitalCount'
  ])

  const tableDownload = ref()
  const hospitalDetails = ref({})
  var hospitalPopoverOpen = ref(false)
  var event = ref()

  onMounted(() =>
  {
    document.getElementById("tableTop")?.scrollIntoView()
  })

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  function exportCSV(e: Event) 
  {
    tableDownload.value.exportCSV()
  }

  function openHospitalPopover(e: Event, rowData: any)
  {
    event.value = e
    event.value.countryIndex = rowData.countryIndex
    event.value.stateIndex = rowData.stateIndex
    event.value.hospitalIndex = rowData.hospitalIndex
    event.value.hospitalTypeName = rowData.hospitalTypeName
    event.value.recordCount = rowData.hospitalType
    event.value.recordCount = rowData.recordCount
    hospitalPopoverOpen.value = true
  }

  async function showHospitalRecords()
  {
    hospitalPopoverOpen.value = false
    await sleep(100)
    emits('showHospitalRecords', event.value.countryIndex, event.value.stateIndex, event.value.hospitalIndex)
  }

  async function sleep(ms: number): Promise<void> 
  {
    return new Promise((resolve) => setTimeout(resolve, ms))
  } 
</script>
  
<style scoped>
  .tableMinWidth
  {
    min-width: 1600px
  }

  ion-input
  {
    --highlight-color: var(--ion-color-green)
  }
</style>