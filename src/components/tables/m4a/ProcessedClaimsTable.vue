<template>
  <h1 id="tableTop">Processed Claims</h1>
  <h2 class="statSpacingTop">Total Approved Claim Amount: $<span class="rainbowText">{{ approvedClaimAmountString }}</span></h2>
  <h2 class="statSpacing">Total Approved Claims: {{ protocolApprovedClaimCount }}</h2>
  <h2 class="statSpacing">Total Denied Claims: {{ protocolDeniedClaimCount }}</h2>
  <h2 class="statSpacing">Total Undenied Claims: {{ protocolUndeniedClaimCount }}</h2>
  <h2 class="statSpacing">Total Max Denied Claims: {{ protocolMaxDeniedClaimCount }}</h2>
  <h2 class="statSpacing">Total Submitted Appeals: {{ protocolSubmittedAppealCount }}</h2>
  <h2 class="statSpacing">Total Denied Appeals: {{ protocolDeniedAppealCount }}</h2>
  <h2 class="statSpacing">Total Revoked Approvals: {{ protocolRevokedApprovalCount }}</h2>
  <h2 class="statSpacing">Total Denial Hammers Dropped: {{ protocolDenialHammerDroppedCount }}</h2>
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
        'processorAddress',
        'patientFullName', 
        'processedClaimId', 
        'claimId',
        'submittedTime',
        'submittedTimeString',
        'submittedDateString',
        'processedTime',
        'processedTimeString',
        'processedDateString',
        'hospitalName', 
        'stateIndex', 
        'hospitalCity', 
        'hospitalBillInvoiceNumber',
        'hospitalAddress', 
        'hospitalPhoneNumber', 
        'hospitalZipCode',
        'hospitalNote',
        'countryName',
        'stateName', 
        'insuranceCompanyName',
        'insuranceCompanyNote',
        'ailment', 
        'note',
        'submitterApprovedClaimAmountString',
        'patientApprovedClaimAmountString',
        'hospitalApprovedClaimAmountString',
        'insuranceCompanyApprovedClaimAmountString',
        'claimAmountString',
        'healthInsurance',
        'status',
        'statusMessage']"
    >
      <template #header>
        <div>
          <div class="tableToggleButtonContainer smallMarginBottom">
            <ion-button color="dark" @click="$emit('toggleClaimQueueTable')">Toggle Claim Queue</ion-button>
            <ion-button color="dark" @click="$emit('toggleHospitalTable')">Toggle Hospital Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleInsuranceCompanyTable')">Toggle Insurance Company Table</ion-button>
            <ion-button color="dark" class="tableToggleSelect" :disabled="true">Toggle Processed Claims</ion-button>
          </div>
          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="Processed Claims Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
     
          <ion-button fill="clear" style="margin-bottom: -5px" @click="exportCSV($event)">
            <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
          </ion-button>
        </div>
      </template>
      <template #empty> No records found.</template>
      <template #loading>Loading records. Please wait.</template>

      <Column field="processedClaimId" header="Processed Claim Id" style="width: 0%" sortable></Column>
      <Column field="claimId" header="Claim Id" style="width: 0%" sortable></Column>
      <Column field="submitterAddress" header="User" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRow">
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
              <ion-label class="tablePopupUnderLine">Patient Name</ion-label>
              {{ event.patientFullName }}
              <ion-label class="tablePopupUnderLine">Submit Time</ion-label>
              {{ event.submittedTimeString }}
              <ion-label class="tablePopupUnderLine">Submit Date</ion-label>
              {{ event.submittedDateString }}
              <ion-label class="tablePopupUnderLine">Processed Time</ion-label>
              {{ event.processedTimeString }}
              <ion-label class="tablePopupUnderLine">Processed Date</ion-label>
              {{ event.processedDateString }}
              <ion-label class="tablePopupUnderLine">Submitter Address</ion-label>
              {{ event.trimmedAddress }}
              <ion-button class="copyAddressButton" style="margin: 10px; margin-bottom: 5px" color="dark" @click="passByRefWrapperCopyAddress()">
                  <ion-label color="light">{{copyFullAddressButtonText}}</ion-label>
              </ion-button>
            </div>
          </ion-popover>
        </template>
      </Column>
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
                <ion-label class="tablePopupUnderLine">Hospital Approved Total</ion-label>
                {{ event.hospitalApprovedClaimAmountString }}
                <ion-label class="tablePopupUnderLine">Invoice Number</ion-label>
                {{ event.hospitalBillInvoiceNumber }}
                <ion-label class="tablePopupUnderLine">Hospital Address</ion-label>
                {{ event.hospitalAddress }}
                <ion-label class="tablePopupUnderLine">Hospital Zip Code</ion-label>
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
      <Column field="countryName" header="Hospital Country" style="width: 0%" sortable></Column>
      <Column field="stateName" header="Hospital State" style="width: 0%" sortable></Column>
      <Column field="hospitalCity" header="Hospital City" style="width: 0%" sortable></Column>
      <Column field="insuranceCompanyName" header="Insurance Company" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-button class="tableButton" fill="clear" @click="openInsuranceCompanyPopover($event, slotProps.data)">
            <span class="tableButtonEmoji">
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
                <ion-label class="tablePopupUnderLine">Total Charges Against Insurance Company</ion-label>
                {{ event.insuranceCompanyApprovedClaimAmountString }}
                <ion-label class="tablePopupUnderLine">Insurance Company Note</ion-label>
                {{ event.insuranceCompanyNote }}
              </div>
            </ion-popover>
        </template>
      </Column>
      <Column field="ailment" header="Ailment" style="width: 15%" sortable>
        <template #body="slotProps">
          <ion-button class="tableButton" fill="clear" @click="openClaimNotePopover($event, slotProps.data)">  
            <span class="tableButtonEmoji">
              {{ "🤮" }}
            </span>
            <ion-label align="left" color="dark">
              {{ slotProps.data.ailment }}
            </ion-label>
          </ion-button>
          <ion-popover 
            :is-open="claimNotePopoverOpen" 
            :event="event" 
            @didDismiss="claimNotePopoverOpen = false"
            side="top" 
            alignment="center"
          >
            <div class="thinBorder flexCenterColumn m4aTablePopupContainer">
              <ion-label class="tablePopupUnderLine">Claim Note</ion-label>
              <span class="emojiText">{{ event.note }}</span>
            </div>
          </ion-popover>
        </template>
      </Column>
      <Column field="claimAmount" header="Claim Amount" style="width: 5%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.claimAmountString }}
        </template>
      </Column>
      <Column field="statusMessage" header="Status /Denial Reason" style="width: 5%" sortable>
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <ion-label v-if="slotProps.data.status == statusTypes.Pending" color="dark">
              {{ slotProps.data.statusMessage }}
            </ion-label>
            <ion-label v-else-if="slotProps.data.status == statusTypes.Approved" color="green">
              {{ slotProps.data.statusMessage }}
            </ion-label>
            <div v-else-if="slotProps.data.status == statusTypes.Denied">
              <ion-label color="red">
                {{ slotProps.data.denialMessage }}
              </ion-label>
              <br><br>
              <ion-label v-if="slotProps.data.appealMessage.length!=0" color="blue">
                {{ slotProps.data.appealMessage }}
              </ion-label>
            </div>
            <div v-else-if="slotProps.data.status == statusTypes.Appealed">
              <ion-label  color="blue">
                {{ slotProps.data.appealMessage }}
              </ion-label>
              <br><br>
              <ion-label color="red">
                {{ slotProps.data.denialMessage }}
              </ion-label>
            </div>
            <ion-button v-if="slotProps.data.submitterAddress == connectedWallet.addressString &&
            slotProps.data.status == statusTypes.Denied"
            color="dark"
            @click="openAppealDenialPopover($event, slotProps.data)"
            >
              Appeal Denial for $0.04
            </ion-button>
            <ion-popover :is-open="appealDenialPopoverOpen" :event="event" @didDismiss="appealDenialPopoverOpen=false" side="bottom" alignment="center">
              <ion-text class="flexCenterColumn">Enter why your claim should be undenied</ion-text>
              <ion-textarea 
                v-model="appealReason" 
                :counter="true"
                :maxlength=M4A_MAX_NOTE_LENGTH
                :spellcheck="true"
                :counter-formatter="customFormatter">
              </ion-textarea>
              <ion-button color="dark" v-if="event.isPatientRecordCreated && 
                !event.isHospitalRecordCreated && 
                !event.isInsuranceCompanyRecordCreated"
                @click="appealDenialClaimWithOnlyPatientRecord()"
                :disabled="overNoteByteSizeLimit || appealReason.length == 0">Appeal Denial And Update Patient Record
              </ion-button>
              <ion-button color="dark" v-if="event.isPatientRecordCreated && 
                event.isHospitalRecordCreated && 
                event.isInsuranceCompanyRecordCreated"
                @click="appealDeniedClaimWithAllRecords()"
                :disabled="overNoteByteSizeLimit || appealReason.length == 0">Appeal Denial And Update All Records
              </ion-button>
            </ion-popover>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineProps, onMounted, inject } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonPopover, IonText, IonTextarea, IonInput } from '@ionic/vue'
  import { search } from 'ionicons/icons'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import { download } from 'ionicons/icons'
  import { statusTypes } from '/src/types/statusTypes.ts'
  import { HospitalTypes } from '/src/types/HospitalTypes.ts'
  import { M4A_MAX_NOTE_LENGTH } from '/src/assets/contracts/Solana/M4AProtocol.vue'
  import { trimAddress, copyFullAddress, confirmM4ATransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

  defineEmits(['toggleClaimQueueTable', 'toggleHospitalTable', 'toggleInsuranceCompanyTable', 'toggleProcessedClaimsTable'])
  
  defineProps(
  [
    'tableData',
    'isLoading',
    'nextInLine',
    'approvedClaimAmountString',
    'protocolApprovedClaimCount',
    'protocolDeniedClaimCount',
    'protocolUndeniedClaimCount',
    'protocolMaxDeniedClaimCount',
    'protocolSubmittedAppealCount',
    'protocolDeniedAppealCount',
    'protocolRevokedApprovalCount',
    'protocolDenialHammerDroppedCount',
  ])

  const toast = inject('toast')

  var userPopoverOpen = ref(false)
  var claimNotePopoverOpen = ref(false)
  var hospitalPopoverOpen = ref(false)
  var insuranceCompanyPopoverOpen = ref(false)
  var appealDenialPopoverOpen = ref(false)
  var appealReason = ref("")
  var event = ref()

  var copyFullAddressButtonText = ref("Copy Full Address")

  onMounted(() =>
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
    event.value.processedTimeString = rowData.processedTimeString
    event.value.processedDateString = rowData.processedDateString
    event.value.address = rowData.submitterAddress
    event.value.trimmedAddress = trimAddress(rowData.submitterAddress)
    event.value.patientFullName = rowData.patientFullName

    userPopoverOpen.value = true
  }

  function openClaimNotePopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.note = rowData.note
    claimNotePopoverOpen.value = true
  }

  function openHospitalPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.hospitalApprovedClaimAmountString = rowData.hospitalApprovedClaimAmountString
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

  function openAppealDenialPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.processorAddress = rowData.processorAddress
    event.value.processorCountIndex = rowData.processorCountIndex
    event.value.isPatientRecordCreated = rowData.isPatientRecordCreated
    event.value.isHospitalRecordCreated = rowData.isHospitalRecordCreated
    event.value.isInsuranceCompanyRecordCreated = rowData.isInsuranceCompanyRecordCreated
    appealDenialPopoverOpen.value = true
  }

  var overNoteByteSizeLimit = ref(false)

  const customFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([appealReason.value])
    const sizeInBytes = blob.size

    inputLength = sizeInBytes

    if(inputLength > maxLength)
    {
      overNoteByteSizeLimit.value = true
    }
    else
      overNoteByteSizeLimit.value = false

    return `${inputLength}/${maxLength}`
  }

  async function appealDenialClaimWithOnlyPatientRecord()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.appealDeniedClaimWithOnlyPatientRecord(
        event.value.processorAddress,
        event.value.processorCountIndex,
        anchorPrograms.usdcFeeTokenAddress,
        appealReason.value
      ).rpc()

      appealReason.value = ""
      appealDenialPopoverOpen.value = false
      await confirmM4ATransaction(tx, toast, "appeal_denial_claim_with_only_patient_record")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "appeal_denial_claim_with_only_patient_record")
    }
  }

  async function appealDeniedClaimWithAllRecords()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.appealDeniedClaimWithAllRecords
      (
        event.value.processorAddress,
        event.value.processorCountIndex,
        anchorPrograms.usdcFeeTokenAddress,
        appealReason.value
      ).rpc()

      appealReason.value = ""
      appealDenialPopoverOpen.value = false
      await confirmM4ATransaction(tx, toast, "appeal_denied_claim_with_all_records")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "appeal_denied_claim_with_all_records")
    }
  }
</script>
  
<style scoped>
  .tableMinWidth
  {
    min-width: 1645px
  }

  ion-input, ion-textarea
  {
    --highlight-color: var(--ion-color-green)
  }

  .cellWrapper
  {
    display: flex
  }
</style>