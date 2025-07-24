<template>
  <div class="flexCenterRow smallMarginTop" style="font-size: 50px">
    <ion-button v-if="hospitalType==HospitalTypes.General" style="margin-top:20px; margin-bottom: -15px; margin-right: -10px" fill="clear" @click="givePokemonCenterCreatorCredit()">
      <img  src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNVb4n4DEhW7MqHDNnjQlr4SsC0pORAEcIoe2B" width="150"/>
    </ion-button>
    <ion-button v-else-if="hospitalType==HospitalTypes.Dental" style="margin-top: 20px; margin-bottom: -10px" fill="clear" @click="givePokemonCenterCreatorCredit()">
      <img  src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNWtAaGHwuNPjCJgbOYz4DrkMvpEVGBFh1X6s5" width="150"/>
    </ion-button>
    <ion-button v-else-if="hospitalType==HospitalTypes.Vision" style="margin-top: 20px; margin-bottom: -10px"fill="clear" @click="givePokemonCenterCreatorCredit()">
      <img  src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNrYFyAr2cvyILZuPHpomK5CU6N2bAltaz03cT" width="150"/>
    </ion-button>
    <ion-button v-else-if="hospitalType==HospitalTypes.Mental" style="margin-top: 20px; margin-bottom: -10px" fill="clear" @click="givePokemonCenterCreatorCredit()">
      <img  src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNCnJgmUjrdlPMfOjk8zL1aoRbyDWUGc9mQ0ew" width="150"/>
    </ion-button>
    <h1 id="tableTop" class="mediumMarginTop">{{ hospitalName }}</h1>
  </div>
  <h2>{{ hospitalTypeName }} Hospital Records</h2>

  <h2 class="statSpacing">Total Approved Claim Amount: $<span class="rainbowText">{{ hospitalApprovedClaimAmountString }}</span></h2>
  <h2 class="statSpacing">Hospital Approved Claims: {{ hospitalApprovedClaimCount }}</h2>
  <h2 class="statSpacing">Hospital Denied Claims: {{ hospitalDeniedClaimCount }}</h2>
  <h2 class="statSpacing">Hospital Undenied Claims: {{ hospitalUndeniedClaimCount }}</h2>
  <h2 class="statSpacing">Hospital Submitted Appeals: {{ hospitalSubmittedAppealCount }}</h2>
  <h2 class="statSpacing">Hospital Denied Appeals: {{ hospitalDeniedAppealCount }}</h2>
  <h2 class="statSpacing">Hospital Revoked Approvals: {{ hospitalRevokedApprovalCount }}</h2>

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
      [ 'recordId',
        'claimId',
        'submitterDisplayName',
        'submitterAddress',
        'hospitalBillInvoiceNumber',
        'patientFullName',
        'submittedTime',
        'submittedTimeString',
        'submittedDateString',
        'processedTime',
        'processedTimeString',
        'processedDateString',
        'ailment',
        'submitterApprovedClaimAmountString',
        'patientApprovedClaimAmountString',
        'insuranceCompanyApprovedClaimAmountString',
        'claimAmountString',
        'note',
        'insuranceCompanyName',
        'insuranceCompanyNote',
        'status',
        'statusMessage']"
    >
      <template #header>
        <div>
          <div class="smallMarginBottom">
            <div>
              <ion-button color="dark" @click="preFillHospitalInfo">Submit Claim</ion-button>
            </div>
            <div>
              <ion-button color="dark" @click="$emit('showHospitalList')">Return To Hospital List</ion-button>
            </div>
          </div>
          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="Hospital Search     ">
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
            @didDismiss="userPopoverOpen=false"
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
              <ion-label class="tablePopupUnderLine">Submitter Address</ion-label>
              {{ event.trimmedAddress }}
              <ion-button class="copyAddressButton" style="margin: 10px; margin-bottom: 5px" color="dark" @click="passByRefWrapperCopyAddress()">
                  <ion-label color="light">{{copyFullAddressButtonText}}</ion-label>
              </ion-button>
            </div>
          </ion-popover>
        </template>
      </Column>
      <Column field="hospitalBillInvoiceNumber" header="Invoice Number" style="width: 0%" sortable></Column>
      <Column field="ailment" header="Ailment" style="width: 10%"  sortable>
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
            <ion-label color="dark">
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
                {{  event.insuranceCompanyNote }}
              </div>
            </ion-popover>
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
                :disabled="overNoteByteSizeLimit || appealReason.length == 0"
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
    getHospital,
    getHospitalRecords } from '/src/assets/contracts/Solana/M4AProtocol.vue'
  import { navigation } from '/src/assets/globalStates/Navigation.vue'
  import { givePokemonCenterCreatorCredit } from '/src/assets/helperFunctions/credits.ts'
  import { HospitalTypes } from '/src/types/HospitalTypes.ts'
  import { statusTypes } from '/src/types/statusTypes.ts'
  import { parseDollarAmountStringFromFixed2PointNotationNoDollarSign, 
    trimAddress,
    copyFullAddress,
    confirmM4ATransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { sleep } from '/src/assets/helperFunctions/sleep.ts'

  const emits = defineEmits(['hospitalSelect', 'showHospitalList'])

  const toast = inject('toast')

  const tableData = ref()
  const isLoading = ref(true)
  const tableDownload = ref()
  const hospitalDetails = ref({})

  var countryIndex = ref()
  var stateIndex = ref()
  var hospitalIndex = ref()
  var hospitalApprovedClaimAmountString = ref("$0.00")
  var hospitalApprovedClaimCount = ref(0)
  var hospitalDeniedClaimCount = ref(0)
  var hospitalUndeniedClaimCount = ref(0)
  var hospitalSubmittedAppealCount = ref(0)
  var hospitalDeniedAppealCount = ref(0)
  var hospitalRevokedApprovalCount = ref(0)

  var hospitalName = ref("")
  var hospitalType = ref()
  var hospitalTypeName = ref()

  var userPopoverOpen = ref(false)
  var insuranceCompanyPopoverOpen = ref(false)
  var claimNotePopoverOpen = ref(false)
  var appealDenialPopoverOpen = ref(false)
  var appealReason = ref("")
  var event = ref()
  var copyFullAddressButtonText = ref("Copy Full Address")

  var isOnMountPassThroughDone = false

  onMounted(async() =>
  {
    document.getElementById("tableTop")?.scrollIntoView()

    if(navigation.navBarIndex == 3)
    {
      countryIndex.value = localStorage.getItem('stateTableCountryIndex')
      stateIndex.value = localStorage.getItem('stateTableStateIndex')
      hospitalIndex.value = localStorage.getItem('stateTableHospitalIndex')
    }
    else if(navigation.navBarIndex == 4)
    {
      countryIndex.value = localStorage.getItem('queueRecordCountryIndex')
      stateIndex.value = localStorage.getItem('queueRecordStateIndex')
      hospitalIndex.value = localStorage.getItem('queueRecordHospitalIndex')
    }

    const hospital = getHospital(countryIndex.value, stateIndex.value, hospitalIndex.value)

    if(hospital)
    {
      hospitalName.value = hospital.hospitalName
      hospitalType.value = hospital.hospitalType 
      hospitalTypeName.value = hospital.hospitalTypeName
      hospitalApprovedClaimAmountString.value = parseDollarAmountStringFromFixed2PointNotationNoDollarSign(hospital.approvedClaimAmount)
      hospitalApprovedClaimCount = hospital.approvedClaimCount
      hospitalDeniedClaimCount = hospital.deniedClaimCount
      hospitalUndeniedClaimCount = hospital.undeniedClaimCount
      hospitalSubmittedAppealCount = hospital.submittedAppealCount 
      hospitalDeniedAppealCount = hospital.deniedAppealCount
      hospitalRevokedApprovalCount = hospital.revokedApprovalCount
    }

    tableData.value = await getHospitalRecords(countryIndex.value, stateIndex.value, hospitalIndex.value)
    isLoading.value = false
    isOnMountPassThroughDone = true
  })

  watch(hospitals, async() => 
  {
    //Prevents fetching the records twice on a refresh when you hit refresh on records table page
    if(!isOnMountPassThroughDone)
      return

    const hospital = getHospital(countryIndex.value, stateIndex.value, hospitalIndex.value)
    hospitalName.value = hospital.hospitalName
    hospitalType.value = hospital.hospitalType 
    hospitalTypeName.value =  hospital.hospitalTypeName
    hospitalApprovedClaimAmountString.value = parseDollarAmountStringFromFixed2PointNotationNoDollarSign(hospital.approvedClaimAmount)
    hospitalApprovedClaimCount = hospital.approvedClaimCount
    hospitalDeniedClaimCount = hospital.deniedClaimCount
    hospitalUndeniedClaimCount = hospital.undeniedClaimCount
    hospitalSubmittedAppealCount = hospital.submittedAppealCount 
    hospitalDeniedAppealCount = hospital.deniedAppealCount
    hospitalRevokedApprovalCount = hospital.revokedApprovalCount

    //await sleep(5000)
    tableData.value = await getHospitalRecords(countryIndex.value, stateIndex.value, hospitalIndex.value)
  })

  watch(insuranceCompanies, async() => 
  {
    //Prevents fetching the records twice on a refresh when you hit refresh on records table page
    if(!isOnMountPassThroughDone)
      return

    const hospital = getHospital(countryIndex.value, stateIndex.value, hospitalIndex.value)
    hospitalName.value = hospital.hospitalName
    hospitalType.value = hospital.hospitalType 
    hospitalTypeName.value =  hospital.hospitalTypeName
    hospitalApprovedClaimAmountString.value = parseDollarAmountStringFromFixed2PointNotationNoDollarSign(hospital.approvedClaimAmount)
    hospitalApprovedClaimCount = hospital.approvedClaimCount
    hospitalDeniedClaimCount = hospital.deniedClaimCount
    hospitalUndeniedClaimCount = hospital.undeniedClaimCount
    hospitalSubmittedAppealCount = hospital.submittedAppealCount 
    hospitalDeniedAppealCount = hospital.deniedAppealCount
    hospitalRevokedApprovalCount = hospital.revokedApprovalCount

    //await sleep(5000)
    tableData.value = await getHospitalRecords(countryIndex.value, stateIndex.value, hospitalIndex.value)
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

  function passByRefWrapperCopyAddress()
  {
    copyFullAddress(copyFullAddressButtonText, event.value.address)
  }

  function exportCSV(e: Event) 
  {
    tableDownload.value.exportCSV()
  }

  function preFillHospitalInfo()
  {
    document.getElementById("submitClaimsHeader")?.scrollIntoView()

    emits('hospitalSelect', hospitalIndex.value, countryIndex.value, stateIndex.value)
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

  function openInsuranceCompanyPopover(e: Event, rowData: any, ) 
  {
    event.value = e
    event.value.insuranceCompanyApprovedClaimAmountString = rowData.insuranceCompanyApprovedClaimAmountString
    event.value.insuranceCompanyNote = rowData.insuranceCompanyNote

    insuranceCompanyPopoverOpen.value = true
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
  .tableMinWidth
  {
    min-width: 1516px
  }

  ion-input, ion-textarea
  {
    --highlight-color: var(--ion-color-green)
  }
</style>