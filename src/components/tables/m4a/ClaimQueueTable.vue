<template>
  <h1 id="tableTop">Claim Queue</h1>
  <h2 class="statSpacingTop">Total Approved Claim Amount: $<span class="rainbowText">{{ approvedClaimAmountString }}</span></h2>
  
  <div v-if="isClaimQueueOn">
    <h2 class="statSpacing">Queue Capacity: {{ currentClaimQueueCount + "/" + queueSizeLimit }}</h2>
    <h2 class="statSpacing">Now Serving Claim Number: {{ nextInLine }}</h2>
  </div>
  <div v-else>
    <h2>Claim Queue is currently disabled</h2>
  </div>

  <div class="tableContainer">
    <DataTable 
      class="tableMinWidth"
      paginator 
      show-gridlines 
      :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      v-model:filters="filters" 
      :value="tableData"
      :loading="isLoading"
      ref="tableDownload"
      :globalFilterFields="
      [
        'submitterAddress', 
        'patientFullName', 
        'id', 
        'countryName',
        'stateName',
        'submittedTime',
        'submittedTimeString',
        'submittedDateString',
        'hospitalName', 
        'stateIndex', 
        'hospitalCity', 
        'hospitalBillInvoiceNumber',
        'hospitalAddress', 
        'hospitalPhoneNumber', 
        'hospitalZipCode', 
        'hospitalNote',
        'ailment',
        'submitterApprovedClaimAmountString',
        'patientApprovedClaimAmountString',
        'hospitalApprovedClaimAmountString',
        'insuranceCompanyApprovedClaimAmountString',
        'claimAmountString',
        'insuranceCompanyName',
        'insuranceCompanyNote',
        'note'
      ]"
    >
      <template #header>
        <div>
          <div class="tableToggleButtonContainer smallMarginBottom">
            <ion-button color="dark" class="tableToggleSelect" :disabled="true">Toggle Claim Queue</ion-button>
            <ion-button color="dark" @click="$emit('toggleHospitalTable')">Toggle Hospital Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleInsuranceCompanyTable')">Toggle Insurance Company Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleProcessedClaimsTable')">Toggle Processed Claims</ion-button>
          </div>
          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="Claim Queue Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>

          <ion-button fill="clear" style="margin-bottom: -5px" @click="exportCSV($event)">
            <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
          </ion-button>
        </div>
      </template>
      <template #empty>No Current Claims Submitted To The Queue</template>
      <template #loading>Loading records. Please wait.</template>

      <Column field="id" header="Claim Number" style="width: 0%" sortable></Column>
      <Column field="submitterAddress" header="User" style="width: 15%" sortable>
        <template #body="slotProps">
          <div>
            <ion-button class="submitterButton" fill="clear" @click="openUserPopover($event, slotProps.data)">
              <StarWolf class="starWolfButton" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
              <ion-label color="dark">
                {{ slotProps.data.submitterDisplayName }}
              </ion-label>
            </ion-button>
          </div>
          <ion-popover 
            :is-open="userPopoverOpen" 
            :event="event" 
            @didDismiss="userPopoverOpen = false"
            side="top" 
            alignment="center"
          >
            <div class="thinBorder flexCenterColumn m4aTablePopupContainer">
              <ion-label class="tablePopupUnderLine">Submitter Approved Total</ion-label>
              {{ event.submitterApprovedClaimAmountString }}
              <ion-label class="tablePopupUnderLine">Patient Approved Total</ion-label>
              {{ event.patientApprovedClaimAmountString }}
              <ion-label class="tablePopupUnderLine">Submit Time</ion-label>
              {{ event.submittedTimeString }}
              <ion-label class="tablePopupUnderLine">Submit Date</ion-label>
              {{ event.submittedDateString }}
              <ion-label class="tablePopupUnderLine">Patient Name</ion-label>
              {{ event.patientFullName }}
              <ion-label class="tablePopupUnderLine">Submitter Address</ion-label>
              {{ event.trimmedAddress }}
              <ion-button class="copyAddressButton" style="margin: 10px; margin-bottom: 5px" color="dark" @click="passByRefWrapperCopyAddress()">
                  <ion-label color="light">{{copyFullAddressButtonText}}</ion-label>
              </ion-button>
            </div>
          </ion-popover>
        </template>
      </Column>
      <Column field="hospitalName" header="Hospital Name" style="width: 15%" sortable>
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
                <ion-label class="tablePopupUnderLine">Hospital Approved Total</ion-label>
                {{ event.hospitalApprovedClaimAmountString }}
                <ion-label class="tablePopupUnderLine">Hospital Type</ion-label>
                {{ event.hospitalTypeName }}
                <ion-label class="tablePopupUnderLine">Invoice Number</ion-label>
                {{ event.hospitalBillInvoiceNumber }}
                <ion-label class="tablePopupUnderLine">Hospital Address</ion-label>
                {{ event.hospitalAddress }}
                <ion-label class="tablePopupUnderLine">Hospital Zipcode</ion-label>
                {{ event.hospitalZipCode }}
                <ion-label class="tablePopupUnderLine">Hospital Phone Number</ion-label>
                {{ event.hospitalPhoneNumber }}
                <ion-label class="tablePopupUnderLine">Hospital Note</ion-label>
                {{ event.hospitalNote }}
              </div>
            </ion-popover>
            
          </div>
        </template>
      </Column>
      <Column field="countryName" header="Hospital Country" style="width: 5%" sortable></Column>
      <Column field="stateName" header="Hospital State" style="width: 5%" sortable></Column>
      <Column field="hospitalCity" header="Hospital City" style="width: 5%" sortable></Column>
      <Column field="ailment" header="Ailment" style="width: 7%" sortable></Column>
      <Column field="claimAmount" header="Claim Amount" style="width: 5%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.claimAmountString }}
        </template>
      </Column>
      <Column field="insuranceCompanyName" header="Insurance Company" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-button class="tableButton" fill="clear" @click="openInsuranceCompanyPopover($event, slotProps.data)">
            <span class="tableButtonEmoji">
              {{ "💩" }}
            </span>
            <ion-label color="dark">
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
                <ion-label class="tablePopupUnderLine">Total Charges Against Insurance Company</ion-label>
                {{ event.insuranceCompanyApprovedClaimAmountString }}
                <ion-label class="tablePopupUnderLine">Insurance Company Note</ion-label>
                {{ event.insuranceCompanyNote }}
              </div>
            </ion-popover>
        </template>
      </Column>
      <Column field="note" header="Claim Note" style="width: 15%" sortable>
        <template #body="slotProps">
          <span class="emojiText">{{ slotProps.data.note }}</span>
        </template>
      </Column>
      <Column field="statusMessage" header="Status" style="width: 5%" sortable>
        <template #body="slotProps">
          <ion-label v-if="slotProps.data.status == statusTypes.Pending" color="dark">
            {{ slotProps.data.statusMessage }}
          </ion-label>
          <ion-label v-if="slotProps.data.status == statusTypes.Processing" color="green">
            {{ slotProps.data.statusMessage }}
          </ion-label>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, defineProps, onMounted } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonInput, IonPopover } from '@ionic/vue'
  import { search } from 'ionicons/icons'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import { download } from 'ionicons/icons'
  import { trimAddress, copyFullAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { HospitalTypes } from '/src/types/HospitalTypes.ts'
  import { statusTypes } from '/src/types/statusTypes.ts'

  defineEmits(['toggleHospitalTable', 'toggleInsuranceCompanyTable', 'toggleProcessedClaimsTable'])

  defineProps([
    'tableData', 
    'isClaimQueueOn',
    'approvedClaimAmountString', 
    'isLoading', 
    'currentClaimQueueCount', 
    'queueSizeLimit', 
    'nextInLine',
  ])

  var userPopoverOpen = ref(false)
  var hospitalPopoverOpen = ref(false)
  var insuranceCompanyPopoverOpen = ref(false)
  var event = ref()

  var copyFullAddressButtonText = ref("Copy Full Address")

  onMounted(async () => 
  {
    document.getElementById("tableTop")?.scrollIntoView()
  })

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  const tableDownload = ref()

  function passByRefWrapperCopyAddress()
  {
    copyFullAddress(copyFullAddressButtonText, event.value.address)
  }

  function exportCSV (e: Event) 
  {
    tableDownload.value.exportCSV()
  }

  function openUserPopover(e: Event, rowData: any, ) 
  {
    event.value = e
    event.value.submitterApprovedClaimAmountString = rowData.submitterApprovedClaimAmountString
    event.value.patientApprovedClaimAmountString = rowData.patientApprovedClaimAmountString
    event.value.submittedTimeString = rowData.submittedTimeString
    event.value.submittedDateString = rowData.submittedDateString
    event.value.address = rowData.submitterAddress
    event.value.trimmedAddress = trimAddress(rowData.submitterAddress)
    event.value.patientFullName = rowData.patientFullName

    userPopoverOpen.value = true
  }

  function openHospitalPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.hospitalApprovedClaimAmountString = rowData.hospitalApprovedClaimAmountString
    event.value.hospitalTypeName = rowData.hospitalTypeName
    event.value.hospitalBillInvoiceNumber = rowData.hospitalBillInvoiceNumber
    event.value.hospitalAddress = rowData.hospitalAddress
    event.value.hospitalZipCode = rowData.hospitalZipCode
    event.value.hospitalPhoneNumber = rowData.hospitalPhoneNumber
    event.value.hospitalNote = rowData.hospitalNote
    hospitalPopoverOpen.value = true
  }

  function openInsuranceCompanyPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.insuranceCompanyApprovedClaimAmountString = rowData.insuranceCompanyApprovedClaimAmountString
    event.value.insuranceCompanyNote = rowData.insuranceCompanyNote

    insuranceCompanyPopoverOpen.value = true
  }
</script>
  
<style scoped>
  .tableMinWidth
  {
    min-width: 1600px !important
  }

  ion-input
  {
    --highlight-color: var(--ion-color-green)
  }
</style>