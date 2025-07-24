<template>

  <div id="tableTop" class="flexCenterRow" style="font-size: 77px; margin-bottom: 10px">
    <span>💩</span>
    <h1 style="padding-top: 22px">Insurance Companies</h1>
  </div>
  <h2 class="statSpacingTop">Total Charges Against: $<span class="poopText">{{ approvedClaimAmountString }}</span></h2>
  <h2 class="statSpacing">Insurance Companies: {{ totalInsuranceCompanyCount }}</h2>

  <div class="tableContainer">
    <DataTable
      ref="tableDownload"
      class="tableMinWidth"
      paginator 
      show-gridlines 
      :rows="20" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      dataKey="id" 
      v-model:filters="filters" 
      :value="tableData"
      :loading="isLoading"
      :globalFilterFields="
      [
        'insuranceCompanyIndex', 
        'insuranceCompanyName', 
        'approvedClaimAmountString', 
        'note',
        'isActive']"
    >
      <template #header>
        <div style="margin-bottom: -10px">
          <div class="tableToggleButtonContainer smallMarginBottom">
            <ion-button color="dark" @click="$emit('toggleClaimQueueTable')">Toggle Claim Queue</ion-button>
            <ion-button color="dark" @click="$emit('toggleHospitalTable')">Toggle Hospital Table</ion-button>
            <ion-button color="dark" class="tableToggleSelect" :disabled="true">Toggle Insurance Company Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleProcessedClaimsTable')">Toggle Processed Claims</ion-button>
          </div>
          <ion-input color="dark" v-model="filters['global'].value" fill="outline" label-placement="stacked" placeholder="Insurance Company Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <ion-button fill="clear" @click="exportCSV($event)">
            <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
          </ion-button>
        </div>
      </template>
      <template #empty> No records found.</template>
      <template #loading> Loading records. Please wait.</template>

      <Column field="insuranceCompanyIndex" header="Insurance Index" style="width: 0%" sortable></Column>
      <Column field="insuranceCompanyName" header="Insurance Company Name" style="width: 380px" sortable>
        <template #body="slotProps" >
          <div>
            <ion-button class="tableButton" fill="clear" @click="openInsuranceCompanyPopover($event, slotProps.data)">
              <span class="tableButtonEmoji" >
                {{ "💩" }}
              </span>
              <ion-label align="left" color="dark">
                {{ slotProps.data.insuranceCompanyName }}
              </ion-label>
            </ion-button>
            <ion-popover 
              :is-open="insuranceCompanyPopoverOpen" 
              :event="event" 
              @didDismiss="insuranceCompanyPopoverOpen = false"
              side="top" 
              alignment="center"
            >
              <div class="thinBorder flexCenterColumn m4aTablePopupContainer">
                <ion-label class="tablePopupUnderLine">Records: {{ event.recordCount }}</ion-label>
                <div class="flexCenterRow">
                  <ion-button class="showRecordsButton" color="dark" @click="showInsuranceCompanyRecords()">Show Records</ion-button>
                </div>
              </div>
            </ion-popover>
          </div>
        </template>
      </Column>
      <Column field="approvedClaimAmount" header="Total Claims Against" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.approvedClaimAmountString }}
        </template>
      </Column>
      <Column field="note" header="Insurance Company Note" style="width: 0%" sortable></Column>
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
    </DataTable>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonInput, IonPopover, IonText } from '@ionic/vue'
  import { search, download } from 'ionicons/icons'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'

  const emits = defineEmits(['toggleClaimQueueTable', 'toggleHospitalTable', 'toggleProcessedClaimsTable', 'insuranceCompanySelect'])

  defineProps(
  [
    'tableData',
    'isLoading',
    'approvedClaimAmountString',
    'totalInsuranceCompanyCount'
  ])

  const tableDownload = ref()
  var insuranceCompanyPopoverOpen = ref(false)
  var event = ref()

  onMounted(() =>
  {
    document.getElementById("tableTop")?.scrollIntoView()
  })

  function openInsuranceCompanyPopover(e: Event, rowData: any)
  {
    event.value = e
    event.value.insuranceCompanyName = rowData.insuranceCompanyName
    event.value.insuranceCompanyIndex = rowData.insuranceCompanyIndex
    event.value.recordCount = rowData.recordCount
    insuranceCompanyPopoverOpen.value = true
  }

  async function showInsuranceCompanyRecords()
  {
    insuranceCompanyPopoverOpen.value = false
    await sleep(100)
    emits('insuranceCompanySelect', event.value.insuranceCompanyIndex)
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
  .tableToggleButtonContainer
  {
    display: flex;
    justify-content: center;
    gap: 25px
  }

  .tableMinWidth
  {
    min-width: 805px
  }

  ion-input
  {
    --highlight-color: var(--ion-color-green)
  }
</style>