<template>
  <div id="tableTop" class="flexCenterRow" style="font-size: 77px; margin-bottom: 10px">
    <span>💩</span>
    <h1 style="padding-top: 22px">{{ insuranceCompanyName }}</h1>
  </div>
  <h2 class="statSpacing">Insurance Company Records</h2>
  <h2 class="statSpacing">Total Charges Against: $<span class="poopText">{{ insuranceCompanyApprovedClaimAmountString }}</span></h2>
  <h2 class="statSpacing">Insurance Company Approved Claims: {{ insuranceCompanyApprovedClaimCount }}</h2>
  <h2 class="statSpacing">Insurance Company Denied Claims: {{ insuranceCompanyDeniedClaimCount }}</h2>
  <h2 class="statSpacing">Insurance Company Undenied Claims: {{ insuranceCompanyUndeniedClaimCount }}</h2>
  <h2 class="statSpacing">Insurance Company Submitted Appeals: {{ insuranceCompanySubmittedAppealCount }}</h2>
  <h2 class="statSpacing">Insurance Company Denied Appeals: {{ insuranceCompanyDeniedAppealCount }}</h2>
  <h2 class="statSpacing">Insurance Company Revoked Approvals: {{ insuranceCompanyRevokedApprovalCount }}</h2>

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
        'recordId', 
        'id',
        'submitterDisplayName',
        'submitterAddress', 
        'patientFullName',
        'submittedTime',
        'submittedTimeString',
        'submittedDateString',
        'processedTime',
        'processedTimeString',
        'processedDateString',
        'hospitalName',
        'hospitalType',
        'hospitalTypeName',
        'hospitalCountryName',
        'hospitalStateName', 
        'hospitalCity', 
        'hospitalAddress', 
        'hospitalPhoneNumber', 
        'hospitalZipCode',
        'hospitalNote',
        'hospitalBillInvoiceNumber',
        'ailment',
        'submitterApprovedClaimAmountString',
        'patientApprovedClaimAmountString',
        'hospitalApprovedClaimAmountString',
        'claimAmountString',
        'note',
        'status',
        'statusMessage']"
    >
      <template #header>
        <div>
          <div class="tableToggleButtonContainer smallMarginBottom"> 
            <ion-button color="dark" @click="$emit('showInsuranceCompanyList')">Return To Insurance Company List</ion-button>
          </div>
          <ion-input color="dark" v-model="filters['global'].value" fill="outline" label-placement="stacked" placeholder="Insurance Company Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <ion-button fill="clear" style="margin-bottom: -5px" @click="exportCSV($event)">
            <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
          </ion-button>
        </div>
      </template>
      <template #empty> No records found.</template>
      <template #loading> Loading records. Please wait.</template>

      <Column field="recordId" header="Record Id" style="width: 0%" sortable></Column>
      <Column field="claimId" header="Claim Id" style="width: 0%" sortable></Column>
      <Column field="submitterAddress" header="User" style="width: 10%" sortable>
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
              {{ event?.submitterApprovedClaimAmountString}}
              <ion-label class="tablePopupUnderLine">Patient Approved Total</ion-label>
              {{ event?.patientApprovedClaimAmountString }}
              <ion-label class="tablePopupUnderLine">Patient Name</ion-label>
              {{ event?.patientFullName }}
              <ion-label class="tablePopupUnderLine">Submitter Address</ion-label>
              {{ event?.trimmedAddress }}
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
                {{ event?.hospitalApprovedClaimAmountString }}
                <ion-label class="tablePopupUnderLine">Hospital Type</ion-label>
                {{ event?.hospitalTypeName }}
                <ion-label class="tablePopupUnderLine">Invoice Number</ion-label>
                {{ event?.hospitalBillInvoiceNumber }}
                <ion-label class="tablePopupUnderLine">Hospital Country</ion-label>
                {{ event?.hospitalCountryName }}
                <ion-label class="tablePopupUnderLine">Hospital State</ion-label>
                {{ event?.hospitalStateName }}
                <ion-label class="tablePopupUnderLine">Hospital City</ion-label>
                {{ event?.hospitalCity }}
                <ion-label class="tablePopupUnderLine">Hospital Address</ion-label>
                {{ event?.hospitalAddress }}
                <ion-label class="tablePopupUnderLine">Hospital Zipcode</ion-label>
                {{ event?.hospitalZipCode }}
                <ion-label class="tablePopupUnderLine">Hospital Phone Number</ion-label>
                {{ event?.hospitalPhoneNumber }}
                <ion-label class="tablePopupUnderLine">Hospital Note</ion-label>
                {{ event?.hospitalNote }}
              </div>
            </ion-popover>
            
          </div>
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
      <Column field="claimAmount" header="Claim Amount" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.claimAmountString }}
        </template>
      </Column>
      <Column field="submittedTime" header="Submitted Time/Date" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-label>
            {{ slotProps.data.submittedTimeString }}
            <br>
            {{ slotProps.data.submittedDateString }}
          </ion-label>
        </template>
      </Column>
      <Column field="processedTime" header="Processed Time/Date" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-label>
            {{ slotProps.data.processedTimeString }}
            <br>
            {{ slotProps.data.processedDateString }}
          </ion-label>
        </template>
      </Column>
      <Column field="statusMessage" header="Status/Denial Reason" style="width: 0%" sortable>
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
              <ion-button color="dark"
                @click="appealDeniedClaimWithAllRecords()"
                :disabled="overNoteByteSizeLimit || appealReason.length==0"
              >
                Appeal Denial And Update All Records
              </ion-button>
            </ion-popover>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, onMounted, inject, watch } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonInput, IonTextarea, IonText, IonPopover } from '@ionic/vue'
  import { search, download } from 'ionicons/icons'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import { hospitals } from '/src/assets/globalStates/m4a/Hospitals.vue'
  import { insuranceCompanies} from '/src/assets/globalStates/m4a/InsuranceCompanies.vue'
  import { M4A_MAX_NOTE_LENGTH,
    getInsuranceCompany,
    getInsuranceCompanyRecords } from '/src/assets/contracts/Solana/M4AProtocol.vue'
  import { statusTypes } from '/src/types/statusTypes.ts'
  import { HospitalTypes } from '/src/types/HospitalTypes.ts'
  import { parseDollarAmountStringFromFixed2PointNotationNoDollarSign,
    trimAddress,
    copyFullAddress,
    confirmM4ATransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { sleep } from '/src/assets/helperFunctions/sleep.ts'

  defineEmits(['showInsuranceCompanyList'])

  const toast = inject('toast')

  var tableData = ref()
  var isLoading = ref(true)
  var tableDownload = ref()
  var userPopoverOpen = ref(false)
  var hospitalPopoverOpen =ref(false)
  var claimNotePopoverOpen = ref(false)
  var appealDenialPopoverOpen = ref(false)
  var appealReason = ref("")
  var event = ref()
  var copyFullAddressButtonText = ref("Copy Full Address")

  var insuranceCompanyName = ref()
  var insuranceCompanyIndex = ref()
  var insuranceCompanyApprovedClaimAmountString = ref("Loading")
  var insuranceCompanyApprovedClaimCount = ref(0)
  var insuranceCompanyDeniedClaimCount = ref(0)
  var insuranceCompanyUndeniedClaimCount = ref(0)
  var insuranceCompanySubmittedAppealCount = ref(0)
  var insuranceCompanyDeniedAppealCount = ref(0)
  var insuranceCompanyRevokedApprovalCount = ref(0)

  var isOnMountPassThroughDone = false

  onMounted(async() =>
  {
    document.getElementById("tableTop")?.scrollIntoView()

    insuranceCompanyIndex.value = localStorage.getItem('queueRecordInsuranceCompanyIndex')

    const insuranceCompany = getInsuranceCompany(insuranceCompanyIndex.value)
    if(insuranceCompany)
    {
      insuranceCompanyName.value = insuranceCompany.insuranceCompanyName
      insuranceCompanyApprovedClaimAmountString.value = parseDollarAmountStringFromFixed2PointNotationNoDollarSign(insuranceCompany.approvedClaimAmount)
      insuranceCompanyApprovedClaimCount.value = insuranceCompany.approvedClaimCount
      insuranceCompanyDeniedClaimCount.value = insuranceCompany.deniedClaimCount
      insuranceCompanyUndeniedClaimCount.value = insuranceCompany.undeniedClaimCount
      insuranceCompanySubmittedAppealCount.value = insuranceCompany.submittedAppealCount 
      insuranceCompanyDeniedAppealCount.value = insuranceCompany.deniedAppealCount
      insuranceCompanyRevokedApprovalCount.value = insuranceCompany.revokedApprovalCount
    }

    tableData.value = await getInsuranceCompanyRecords(insuranceCompanyIndex.value)
    isLoading.value = false
    isOnMountPassThroughDone = true
  })

  watch(hospitals, async() => 
  {
    //Prevents fetching the records twice on a refresh when you hit refresh on records table page
    if(!isOnMountPassThroughDone)
      return

    const insuranceCompany = getInsuranceCompany(insuranceCompanyIndex.value)
    insuranceCompanyName.value = insuranceCompany.insuranceCompanyName
    insuranceCompanyApprovedClaimAmountString.value = parseDollarAmountStringFromFixed2PointNotationNoDollarSign(insuranceCompany.approvedClaimAmount)
    insuranceCompanyApprovedClaimCount = insuranceCompany.approvedClaimCount
    insuranceCompanyDeniedClaimCount = insuranceCompany.deniedClaimCount
    insuranceCompanyUndeniedClaimCount = insuranceCompany.undeniedClaimCount
    insuranceCompanySubmittedAppealCount = insuranceCompany.submittedAppealCount 
    insuranceCompanyDeniedAppealCount = insuranceCompany.deniedAppealCount
    insuranceCompanyRevokedApprovalCount = insuranceCompany.revokedApprovalCount

    //await sleep(5000)
    tableData.value = await getInsuranceCompanyRecords(insuranceCompanyIndex.value)
  })

  watch(insuranceCompanies, async() => 
  {
    //Prevents fetching the records twice on a refresh when you hit refresh on records table page
    if(!isOnMountPassThroughDone)
      return

    const insuranceCompany = getInsuranceCompany(insuranceCompanyIndex.value)
    insuranceCompanyName.value = insuranceCompany.insuranceCompanyName
    insuranceCompanyApprovedClaimAmountString.value = parseDollarAmountStringFromFixed2PointNotationNoDollarSign(insuranceCompany.approvedClaimAmount)
    insuranceCompanyApprovedClaimCount = insuranceCompany.approvedClaimCount
    insuranceCompanyDeniedClaimCount = insuranceCompany.deniedClaimCount
    insuranceCompanyUndeniedClaimCount = insuranceCompany.undeniedClaimCount
    insuranceCompanySubmittedAppealCount = insuranceCompany.submittedAppealCount 
    insuranceCompanyDeniedAppealCount = insuranceCompany.deniedAppealCount
    insuranceCompanyRevokedApprovalCount = insuranceCompany.revokedApprovalCount

    //await sleep(5000)
    tableData.value = await getInsuranceCompanyRecords(insuranceCompanyIndex.value)
  })

  watch(customUserNameHashMap, () =>
  {
    if(tableData.value)
      for(var i=0; i<tableData.value.length; i++)
      {
        const chatAccount = customUserNameHashMap.map.get(tableData.value[i].submitterAddress)
        if(chatAccount)
        {
          if(chatAccount.useCustomName)
            tableData.value[i].submitterDisplayName = chatAccount.userName
          else
            tableData.value[i].submitterDisplayName = trimAddress(tableData.value[i].submitterAddress)
        }
      }
  })

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  function exportCSV(e: Event) 
  {
    tableDownload.value.exportCSV()
  }

  function passByRefWrapperCopyAddress()
  {
    copyFullAddress(copyFullAddressButtonText, event.value.address)
  }

  function openUserPopover(e: Event, rowData: any, ) 
  {
    event.value = e
    event.value.submitterApprovedClaimAmountString = rowData.submitterApprovedClaimAmountString
    event.value.patientApprovedClaimAmountString = rowData.patientApprovedClaimAmountString
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
    event.value.hospitalCountryName = rowData.hospitalCountryName
    event.value.hospitalStateName = rowData.hospitalStateName
    event.value.hospitalCity = rowData.hospitalCity
    event.value.hospitalAddress = rowData.hospitalAddress
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

  function openAppealDenialPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.processorAddress = rowData.processorAddress
    event.value.processorCountIndex = rowData.processorCountIndex
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
  .tableToggleButtonContainer
  {
    display: flex;
    justify-content: center;
    gap: 25px
  }

  .tableMinWidth
  {
    min-width: 1470px
  }

  ion-input, ion-textarea
  {
    --highlight-color: var(--ion-color-green)
  }
</style>