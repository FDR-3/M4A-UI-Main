<template>
  <div class="tableContainer">
    <DataTable 
    class="tableMinWidth"
    paginator 
    sortField="claimNumber" 
    :sortOrder="-1" 
    show-gridlines 
    :rows="10" 
    :rowsPerPageOptions="[10, 20, 50, 100]" 
    v-model:filters="filters" 
    ref="tableDownload" 
    :value="patientRecordTableData"
    :loading="isLoading"
    :globalFilterFields="
    ['recordId',
    'claimId',
    'hospitalName',
    'countryName',
    'stateName',
    'hospitalCity', 
    'hospitalAddress', 
    'hospitalPhoneNumber', 
    'hospitalZipCode',
    'hospitalNote',
    'hospitalPhoneNumber',
    'ailment',
    'hospitalApprovedClaimAmountString',
    'insuranceCompanyApprovedClaimAmountString',
    'claimAmountString',
    'submittedTime',
    'submittedTimeString',
    'submittedDateString',
    'processedTime',
    'processedTimeString',
    'processedDateString',
    'status',
    'insuranceCompanyName',
    'insuranceCompanyNote',
    'status',
    'statusMessage']">
      <template #header>
        <div>
          <h2>Patient Records</h2>
          <Select 
            id="patientSelect"
            class="standardFontSize"
            @change="loadNewPatientStats()"
            v-model="patientSelect" 
            :options="patientList" 
            optionLabel="name" 
            optionValue="index" 
            placeholder="Select Patient"
            appendTo="self"
          >
          </Select>
          
          <h2 style="margin-top: 0px">Total Approved Claim Amount: $<span class="rainbowText">{{ patientApprovedClaimAmountString }}</span></h2>
          <h2 class="statSpacing">Patient Submitted Claims: {{ patientSubmittedClaimCount }}</h2>
          <h2 class="statSpacing">Patient Approved Claims: {{ patientApprovedClaimCount }}</h2>
          <h2 class="statSpacing">Patient Denied Claims: {{ patientDeniedClaimCount }}</h2>
          <h2 class="statSpacing">Patient Undenied Claims: {{ patientUndeniedClaimCount }}</h2>
          <h2 class="statSpacing">Patient Submitted Appeals: {{ patientSubmittedAppealCount }}</h2>
          <h2 class="statSpacing">Patient Denied Appeals: {{ patientDeniedAppealCount }}</h2>
          <h2 class="statSpacing">Patient Max Denied Claims: {{ patientMaxDeniedClaimCount }}</h2>
          <h2 class="statSpacing">Patient Revoked Approvals: {{ patientRevokedApprovalCount }}</h2>

          <ion-input color="dark" v-model="filters['global'].value" fill="outline" label-placement="stacked" placeholder="Patient Claim History Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>

          <ion-button id="patientRecordsExportButton" fill="clear" @click="exportCSV($event)">
            <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
          </ion-button>
        </div>
      </template>
      <template #empty> No records found.</template>
      <template #loading> Loading records. Please wait.</template>

      <Column field="recordId" header="Record Id" style="width: 0%" sortable></Column>
      <Column field="claimId" header="Claim Id" style="width: 0%" sortable></Column>
      <Column field="hospitalName" header="Hospital Name" style="width: 0%" sortable>
        <template #body="slotProps">
          <div>
            <ion-button class="hospitalButton" fill="clear" @click="openHospitalPopover($event, slotProps.data)">
              <div style="min-width: 40px; max-width: 40px">
                <img v-if="slotProps.data.hospitalType==HospitalTypes.General" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazN1BiMybI527AkmeVxopsR6nYgKDZFazU8GXHu"/>
                <img v-else-if="slotProps.data.hospitalType==HospitalTypes.Dental" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNWtAaGHwuNPjCJgbOYz4DrkMvpEVGBFh1X6s5"/>
                <img v-else-if="slotProps.data.hospitalType==HospitalTypes.Vision" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNrYFyAr2cvyILZuPHpomK5CU6N2bAltaz03cT"/>
                <img v-else-if="slotProps.data.hospitalType==HospitalTypes.Mental" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNCnJgmUjrdlPMfOjk8zL1aoRbyDWUGc9mQ0ew"/>
              </div>
              <ion-label align="left" class="hospitalButtonLabel" color="dark">{{ slotProps.data.hospitalName }}</ion-label>
            </ion-button>
            <ion-popover 
              :is-open="hospitalPopoverOpen" 
              :event="event" 
              @didDismiss="hospitalPopoverOpen=false"
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
                <ion-label class="tablePopupUnderLine">Hospital Country</ion-label>
                {{ event.countryName }}
                <ion-label class="tablePopupUnderLine">Hospital State</ion-label>
                {{ event.stateName }}
                <ion-label class="tablePopupUnderLine">Hospital City</ion-label>
                {{ event.hospitalCity }}
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
      <Column field="countryName" header="Hospital Country" style="width: 0%" sortable></Column>
      <Column field="stateName" header="Hospital State" style="width: 0%" sortable></Column>
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
            @didDismiss="claimNotePopoverOpen=false"
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
      <Column field="claimAmount" header="Claim Amount" style="width: 0%" sortable>
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
            <ion-label align="center" color="dark">
              {{ slotProps.data.insuranceCompanyName }}
            </ion-label>
          </ion-button>
          <ion-popover 
              :is-open="insuranceCompanyPopoverOpen" 
              :event="event" 
              @didDismiss="insuranceCompanyPopoverOpen=false"
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
      <Column header="Submitted Time/Date" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-label>
            {{ slotProps.data.submittedTimeString }}
            <br>
            {{ slotProps.data.submittedDateString }}
          </ion-label>
        </template>
      </Column>
      <Column header="Processed Time/Date" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-label>
            {{ slotProps.data.processedTimeString }}
            <br>
            {{ slotProps.data.processedDateString }}
          </ion-label>
        </template>
      </Column>
      <Column field="statusMessage" header="Status/Denial Reason" style="width: 5%" sortable>
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <ion-label v-if="slotProps.data.status==statusTypes.Processing" color="green">
              {{ slotProps.data.statusMessage }}
            </ion-label>
            <ion-label v-else-if="slotProps.data.status==statusTypes.Approved" color="green">
              {{ slotProps.data.statusMessage }}
            </ion-label>
            <div v-else-if="slotProps.data.status==statusTypes.Denied">
              <ion-label color="red">
                {{ slotProps.data.denialMessage }}
              </ion-label>
              <br><br>
              <ion-label v-if="slotProps.data.appealMessage.length!=0" color="blue">
                {{ slotProps.data.appealMessage }}
              </ion-label>
            </div>
            <div v-else-if="slotProps.data.status==statusTypes.Appealed">
              <ion-label  color="blue">
                {{ slotProps.data.appealMessage }}
              </ion-label>
              <br><br>
              <ion-label color="red">
                {{ slotProps.data.denialMessage }}
              </ion-label>
            </div>
            <ion-button v-if="slotProps.data.submitterAddress==connectedWallet.addressString &&
              slotProps.data.status==statusTypes.Denied"
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
              <ion-button color="dark" v-if="event.patientRecordOnly"
                @click="appealDenialClaimWithOnlyPatientRecord()"
                :disabled="overNoteByteSizeLimit || appealReason.length==0">Appeal Denial And Update Patient Record
              </ion-button>
              <ion-button color="dark" v-else
                @click="appealDeniedClaimWithAllRecords()"
                :disabled="overNoteByteSizeLimit || appealReason.length==0">Appeal Denial And Update All Records
              </ion-button>
            </ion-popover>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, defineProps, onMounted, onUnmounted, watch, inject } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonInput, IonTextarea, IonText, IonPopover } from '@ionic/vue'
  import { search } from 'ionicons/icons'
  import Select from 'primevue/select'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { M4A_MAX_NOTE_LENGTH, getPatientList, getNewPatient } from '/src/assets/contracts/Solana/M4AProtocol.vue'
  import { FilterMatchMode } from '@primevue/core/api'
  import { hospitals } from '/src/assets/globalStates/m4a/Hospitals.vue'
  import { insuranceCompanies} from '/src/assets/globalStates/m4a/InsuranceCompanies.vue'
  import { download } from 'ionicons/icons'
  import { PublicKey } from "@solana/web3.js"
  import { getPatientRecords, getSubmitterAccountPDA, getPatientAccountPDA } from '/src/assets/contracts/Solana/M4AProtocol.vue'
  import { HospitalTypes } from '/src/types/HospitalTypes.ts'
  import { statusTypes } from '/src/types/statusTypes.ts'
  import { parseDollarAmountStringFromFixed2PointNotationNoDollarSign,
    confirmM4ATransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { sleep } from '/src/assets/helperFunctions/sleep.ts'
  
  const props = defineProps(['searchAddress', 'submitterAccount'])

  const toast = inject('toast')
  
  var patientSelect = ref(0)
  var patientRecordTableData: any = ref([])
  var isLoading = ref(true)
  var tableDownload = ref()
  var hospitalPopoverOpen = ref(false)
  var claimNotePopoverOpen = ref(false)
  var insuranceCompanyPopoverOpen = ref(false)
  var appealDenialPopoverOpen = ref(false)
  var appealReason = ref("")
  var event = ref()

  var patientList: any = ref([])
  var patientApprovedClaimAmountString = ref("$0.00")
  var patientSubmittedClaimCount = ref()
  var patientApprovedClaimCount = ref()
  var patientDeniedClaimCount = ref()
  var patientUndeniedClaimCount = ref()
  var patientSubmittedAppealCount = ref()
  var patientDeniedAppealCount = ref()
  var patientMaxDeniedClaimCount = ref()
  var patientRevokedApprovalCount = ref()

  var currentPatientCount: number

  var patientListWatchId: any
  var patientRecordWatchId: any

  var isOnMountPassThroughDone = false

  onMounted(async() =>
  {
    if(props.searchAddress)
    {
      /*patientList.value = await getPatientList(props.searchAddress)
      patientRecordTableData.value = await getPatientRecords(props.searchAddress, patientSelect.value)

      //Listen for Patient Account Init
      await listenForAdditionalPatients(props.searchAddress)
      
      //Listen for Patient Record Status Change
      await listenForPatientRecordStatusUpdates(props.searchAddress, patientSelect.value)*/
    }

    if(props.submitterAccount)
      currentPatientCount = props.submitterAccount.patientCount
    else
    currentPatientCount = 0

    if(patientList.value.length != 0)
    {
      patientApprovedClaimAmountString.value =  parseDollarAmountStringFromFixed2PointNotationNoDollarSign(patientList.value[0].approvedClaimAmount)
      patientSubmittedClaimCount.value = patientList.value[0].submittedClaimCount
      patientApprovedClaimCount.value = patientList.value[0].approvedClaimCount
      patientDeniedClaimCount.value = patientList.value[0].deniedClaimCount
      patientUndeniedClaimCount.value = patientList.value[0].undeniedClaimCount
      patientSubmittedAppealCount.value = patientList.value[0].submittedAppealCount
      patientDeniedAppealCount.value = patientList.value[0].deniedAppealCount
      patientMaxDeniedClaimCount.value = patientList.value[0].maxDeniedClaimCount 
      patientRevokedApprovalCount.value = patientList.value[0].revokedApprovalCount

      patientSelect.value = patientList.value[0].index
    }
    else
    {
      patientApprovedClaimAmountString.value =  "0.00"
      patientSubmittedClaimCount.value = 0
      patientApprovedClaimCount.value = 0
      patientDeniedClaimCount.value = 0
      patientUndeniedClaimCount.value = 0
      patientSubmittedAppealCount.value = 0
      patientDeniedAppealCount.value = 0
      patientMaxDeniedClaimCount.value = 0
      patientRevokedApprovalCount.value = 0

      patientSelect.value = 0
    }

    isLoading.value = false
    isOnMountPassThroughDone = true
  })

  onUnmounted(() => 
  {
    if(patientListWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(patientListWatchId)
      patientListWatchId = undefined
    }

    if(patientRecordWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(patientRecordWatchId)
      patientRecordWatchId = undefined
    }
  })

  watch(hospitals, async() => 
  {
    //Prevents fetching the records twice on a refresh when you are the records table
    if(!isOnMountPassThroughDone)
      return
    
    //await sleep(5000)
    //patientRecordTableData.value = await getPatientRecords(props.searchAddress, patientSelect.value)
  })

  watch(insuranceCompanies, async() => 
  {
    //Prevents fetching the records twice on a refresh when you are the records table
    if(!isOnMountPassThroughDone)
      return
    
    //await sleep(5000)
    //patientRecordTableData.value = await getPatientRecords(props.searchAddress, patientSelect.value)
  })

  watch(() => props.searchAddress, async() =>  
  {
    isLoading.value = true
    
    if(patientListWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(patientListWatchId)
      patientListWatchId = undefined
    }

    if(patientRecordWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(patientRecordWatchId)
      patientRecordWatchId = undefined
    }

    if(props.submitterAccount)
      currentPatientCount = props.submitterAccount.patientCount
    else
    currentPatientCount = 0

    //patientList.value = await getPatientList(props.searchAddress)

    if(patientList.value.length != 0)
    {
      patientApprovedClaimAmountString.value =  parseDollarAmountStringFromFixed2PointNotationNoDollarSign(patientList.value[0].approvedClaimAmount)
      patientSubmittedClaimCount.value = patientList.value[0].submittedClaimCount
      patientApprovedClaimCount.value = patientList.value[0].approvedClaimCount
      patientDeniedClaimCount.value = patientList.value[0].deniedClaimCount
      patientUndeniedClaimCount.value = patientList.value[0].undeniedClaimCount
      patientSubmittedAppealCount.value = patientList.value[0].submittedAppealCount
      patientDeniedAppealCount.value = patientList.value[0].deniedAppealCount
      patientMaxDeniedClaimCount.value = patientList.value[0].maxDeniedClaimCount 
      patientRevokedApprovalCount.value = patientList.value[0].revokedApprovalCount

      patientSelect.value = patientList.value[0].index
    }
    else
    {
      patientApprovedClaimAmountString.value =  "0.00"
      patientSubmittedClaimCount.value = 0
      patientApprovedClaimCount.value = 0
      patientDeniedClaimCount.value = 0
      patientUndeniedClaimCount.value = 0
      patientSubmittedAppealCount.value = 0
      patientDeniedAppealCount.value = 0
      patientMaxDeniedClaimCount.value = 0
      patientRevokedApprovalCount.value = 0

      patientSelect.value = 0
    }

    //patientRecordTableData.value = await getPatientRecords(props.searchAddress, patientSelect.value)

    isLoading.value = false

    //Listen for Patient Account Init
    //await listenForAdditionalPatients(props.searchAddress)
    
    //Listen for Patient Record Status Change
    //await listenForPatientRecordStatusUpdates(props.searchAddress, patientSelect.value)
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
    event.value.hospitalApprovedClaimAmountString = rowData.hospitalApprovedClaimAmountString
    event.value.hospitalTypeName = rowData.hospitalTypeName
    event.value.hospitalBillInvoiceNumber = rowData.hospitalBillInvoiceNumber
    event.value.countryName = rowData.countryName
    event.value.stateName = rowData.stateName
    event.value.hospitalAddress = rowData.hospitalAddress
    event.value.hospitalCity = rowData.hospitalCity
    event.value.hospitalZipCode = rowData.hospitalZipCode
    event.value.hospitalPhoneNumber = rowData.hospitalPhoneNumber
    event.value.hospitalNote = rowData.hospitalNote
    hospitalPopoverOpen.value = true
  }

  function openClaimNotePopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.note = rowData.note
    claimNotePopoverOpen.value = true
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
    event.value.patientRecordOnly = rowData.patientRecordOnly

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

  async function loadNewPatientStats()
  {
    if(patientRecordWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(patientRecordWatchId)
      patientRecordWatchId = undefined
    }

    isLoading.value = true
    
    /*const patient = await anchorPrograms.m4a.m4aProgram.account.patientAccount.fetch(getPatientAccountPDA(props.searchAddress, patientSelect.value))
    patientApprovedClaimAmountString.value =  parseDollarAmountStringFromFixed2PointNotationNoDollarSign(patient.approvedClaimAmount)
    patientSubmittedClaimCount.value = patient.submittedClaimCount
    patientApprovedClaimCount.value = patient.approvedClaimCount
    patientDeniedClaimCount.value = patient.deniedClaimCount
    patientUndeniedClaimCount.value = patient.undeniedClaimCount
    patientSubmittedAppealCount.value = patient.submittedAppealCount
    patientDeniedAppealCount.value = patient.deniedAppealCount
    patientMaxDeniedClaimCount.value = patient.maxDeniedClaimCount 
    patientRevokedApprovalCount.value = patient.revokedApprovalCount
    patientRecordTableData.value = await getPatientRecords(props.searchAddress, patientSelect.value)*/

    isLoading.value = false

    //Listen for Patient Record Status Change
    //await listenForPatientRecordStatusUpdates(props.searchAddress, patientSelect.value)
  }

  async function listenForAdditionalPatients(submitterAddress: String)
  {
    const publicKey = new PublicKey(submitterAddress)
    try
    {
      //Subscribe to account changes
      patientListWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getSubmitterAccountPDA(publicKey), async() => 
      {
        //Handle account change...
        if(props.submitterAccount.patientCount > currentPatientCount)
        {
          const patient = await getNewPatient(submitterAddress)

          //Set stats of new patient
          patientApprovedClaimAmountString.value =  parseDollarAmountStringFromFixed2PointNotationNoDollarSign(patient.approvedClaimAmount)
          patientSubmittedClaimCount.value = patient.submittedClaimCount
          patientApprovedClaimCount.value = patient.approvedClaimCount
          patientDeniedClaimCount.value = patient.deniedClaimCount
          patientUndeniedClaimCount.value = patient.undeniedClaimCount
          patientSubmittedAppealCount.value = patient.submittedAppealCount
          patientDeniedAppealCount.value = patient.deniedAppealCount
          patientMaxDeniedClaimCount.value = patient.maxDeniedClaimCount 
          patientRevokedApprovalCount.value = patient.revokedApprovalCount
          patientRecordTableData.value = [] //New Patient, so don't bother fetching records

          patientSelect.value = patient.index
          patientList.value.push(patient)
          patientList.value = patientList.value.sort((a: any, b: any) => a.patientFirstName.localeCompare(b.patientFirstName))
          currentPatientCount = props.submitterAccount.patientCount
        }
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForPatientRecordStatusUpdates(submitterAddress: String, patientIndex: number)
  {
    const publicKey = new PublicKey(submitterAddress)
    try
    {
      //Subscribe to account changes
      patientRecordWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getPatientAccountPDA(publicKey, patientIndex), async() => 
      {
        //Handle account change...
        const patient = await anchorPrograms.m4a.m4aProgram.account.patientAccount.fetch(getPatientAccountPDA(publicKey, patientIndex))

        patientApprovedClaimAmountString.value =  parseDollarAmountStringFromFixed2PointNotationNoDollarSign(patient.approvedClaimAmount)
        patientSubmittedClaimCount.value = patient.submittedClaimCount
        patientApprovedClaimCount.value = patient.approvedClaimCount
        patientDeniedClaimCount.value = patient.deniedClaimCount
        patientUndeniedClaimCount.value = patient.undeniedClaimCount
        patientSubmittedAppealCount.value = patient.submittedAppealCount
        patientDeniedAppealCount.value = patient.deniedAppealCount
        patientMaxDeniedClaimCount.value = patient.maxDeniedClaimCount 
        patientRevokedApprovalCount.value = patient.revokedApprovalCount

        //await sleep(5000)
        patientRecordTableData.value = await getPatientRecords(submitterAddress, patientIndex)
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }
</script>
  
<style scoped>
  #patientSelect
  {
    width: 444px;
    margin-top: -20px;
    margin-bottom: 20px;
    padding-left: 50px
  }

  #patientRecordsExportButton
  {
    margin-bottom: -5px
  }

  .tableMinWidth
  {
    min-width: 1615px
  }

  ion-input, ion-textarea
  {
    --highlight-color: var(--ion-color-gray)
  }
</style>