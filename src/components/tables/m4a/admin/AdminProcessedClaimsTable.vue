<template>
  <h1 >Processed Claims</h1>

  <div class="tableContainer">
    <DataTable
      ref="tableDownload"
      class="tableMinWidth"
      paginator 
      show-gridlines 
      :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      :value="currentTableData"
      :loading="isLoading"
      editMode="cell" 
      @cell-edit-complete="onCellEditSave($event)"
      @sort="sorting=true"
      @value-change="onValueChange($event)"
    >
      <template #header>
        <div style="margin-bottom: -10px">
          <div class="tableToggleButtonContainer smallMarginBottom">
            <ion-button color="dark" @click="$emit('toggleProcessorsTable')">Toggle Processors Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleClaimQueueTable')">Toggle Claim Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleHospitalTable')">Toggle Hospital Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleInsuranceCompanyTable')">Toggle Insurance Company Table</ion-button>
            <ion-button color="dark" class="tableToggleSelect" :disabled="true">Toggle Processed Claims Table</ion-button>
          </div>
          <ion-input
            color="dark"
            v-model="searchInput"
            fill="outline"
            label-placement="stacked"
            placeholder="Processsed Claims Search     "
            @input="filterTable()"
          >
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>

          <ion-button fill="clear" @click="exportCSV($event)">
            <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
          </ion-button>
        </div>
      </template>

      <template #empty>No records found.</template>
      <template #loading>Loading records. Please wait.</template>

      <Column field="processedClaimId" header="Processed Claim Id" style="width: 0%" sortable></Column>
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
      <Column field="hospitalName" header="Hos Name" style="width: 0%" sortable>
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
                <ion-label class="tablePopupUnderLine">Hospital Address</ion-label>
                {{ event.hospitalAddress }}
                <ion-label class="tablePopupUnderLine">Hospital City</ion-label>
                {{ event.hospitalCity }}
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
      <Column field="countryName" header="Country" style="width: 0%" sortable></Column>
      <Column field="stateName" header="State" style="width: 0%" sortable></Column>
      <Column field="statusMessage" header="Status" style="width: 0%" sortable>
        <template #body="slotProps">
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
        </template>
      </Column>

      <!--Hospital and Insurance Company Index can only be edited on processed claim if it was denied with only the patient record being created-->
      <Column field="hospitalIndex" header="Hos Index" style="width: 0%" sortable>
        <template #editor="{ index, data, field }">
          <InputNumber
            v-model="data[field]"
            :min=0
            :step=1
            fluid
            @input="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="data.isHospitalRecordCreated ||
            data.isInsuranceCompanyRecordCreated ||
            connectedWallet.addressString!=adminAccounts.m4aCEOAddress ||
            (isDataEdited && !currentTableData[index].isEditingRow && !currentTableData[index].isRowDataEdited)"
          />
        </template>
      </Column>
      <Column field="insuranceCompanyIndex" header="Ins Index" style="width: 0%" sortable>
        <template #editor="{ index, data, field }">
          <InputNumber
            v-model="data[field]"
            :min=0
            :step=1
            fluid
            @input="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="data.isHospitalRecordCreated ||
            data.isInsuranceCompanyRecordCreated ||
            connectedWallet.addressString!=adminAccounts.m4aCEOAddress ||
            (isDataEdited && !currentTableData[index].isEditingRow && !currentTableData[index].isRowDataEdited)"
          />
        </template>
      </Column>

      <Column field="hospitalBillInvoiceNumber" header="Hos Invoice Number" style="width: 0%" sortable>
        <template #editor="{ index, data, field }">
          <InputText
            v-model="data[field]"
            fluid
            @input="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="connectedWallet.addressString!=adminAccounts.m4aCEOAddress ||
            (isDataEdited && !currentTableData[index].isEditingRow && !currentTableData[index].isRowDataEdited)"
          />
        </template>
      </Column>
      <Column field="claimAmount" header="Claim Amount" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.claimAmountString }}
        </template>
        <template #editor="{ index, data, field }">
          <InputNumber
            v-model="data[field]"
            inputId="currency-us"
            mode="currency"
            currency="USD"
            locale="en-US"
            fluid
            @input="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="connectedWallet.addressString!=adminAccounts.m4aCEOAddress ||
            (isDataEdited && !currentTableData[index].isEditingRow && !currentTableData[index].isRowDataEdited)"
          />
        </template>
      </Column>
      <Column field="ailment" header="Ailment" style="width: 0%" sortable>
        <template #editor="{ index, data, field }">
          <InputText
            v-model="data[field]"
            fluid
            @input="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="connectedWallet.addressString!=adminAccounts.m4aCEOAddress ||
            (isDataEdited && !currentTableData[index].isEditingRow && !currentTableData[index].isRowDataEdited)"
          />
        </template>
      </Column>
      <Column field="note" header="Note" style="width: 0%" sortable>
        <template #editor="{ index, data, field }">
            <InputText
              v-model="data[field]"
              fluid
              @input="isEditing=true; currentTableData[index].isEditingRow=true"
              :disabled="connectedWallet.addressString!=adminAccounts.m4aCEOAddress ||
              (isDataEdited && !currentTableData[index].isEditingRow && !currentTableData[index].isRowDataEdited)"
            />
        </template>
      </Column>
      <Column v-if="connectedWallet.addressString==adminAccounts.m4aCEOAddress" field="actions" header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <ion-label v-if="slotProps.data.isEditingRow" color="yellow">
              Table Updates Paused While Editing
            </ion-label>
            <ion-label v-else-if="isDataEdited && !slotProps.data.isRowDataEdited && !slotProps.data.isEditingRow">
              You can only edit one row at a time
            </ion-label>
            <ion-label v-else-if="!slotProps.data.isRowDataEdited">
              No Edits Detected
            </ion-label>
            <ion-label v-else-if="!slotProps.data.isHospitalReady && !slotProps.data.isInsuranceCompanyReady">
              Hos And Ins Index Not Initialized
            </ion-label>
            <ion-label v-else-if="!slotProps.data.isHospitalReady">
              Hos Not Index Initialized
            </ion-label>
            <ion-label v-else-if="!slotProps.data.isInsuranceCompanyReady">
              Ins Not Index Initialized
            </ion-label>
            <ion-button v-else-if="slotProps.data.isPatientRecordCreated &&
              !slotProps.data.isHospitalRecordCreated &&
              !slotProps.data.isInsuranceCompanyRecordCreated"
              class="actionButton"
              color="dark"
              @click="editProcessedClaimAndPatientRecord(slotProps.data)"
            >
              Update Processed Claim And Patient Record
            </ion-button>
            <ion-button v-else-if="slotProps.data.isPatientRecordCreated &&
              slotProps.data.isHospitalRecordCreated &&
              slotProps.data.isInsuranceCompanyRecordCreated"
              class="actionButton"
              color="dark"
              @click="editProcessedClaimAndAllRecords(slotProps.data)"
            >
              Update Processed Claim And All Records
            </ion-button>
            <ion-button v-if="slotProps.data.status == statusTypes.Approved"
              class="actionButton"
              color="dark"
              @click="openRevokeApprovalPopover($event, slotProps.data)"
            >
              Revoke Approval
            </ion-button>
            <ion-button v-else-if="(slotProps.data.status == statusTypes.Denied || slotProps.data.status == statusTypes.Appealed) &&
              slotProps.data.isPatientRecordCreated && slotProps.data.isHospitalRecordCreated && slotProps.data.isInsuranceCompanyRecordCreated"
              class="actionButton" color="dark" @click="undenyClaimWithAllRecords(slotProps.data)"
            >
              Undo Denial With All Records
            </ion-button>
            <ion-button v-else-if="(slotProps.data.status == statusTypes.Denied || slotProps.data.status == statusTypes.Appealed) &&
              slotProps.data.isPatientRecordCreated &&
              !slotProps.data.isHospitalRecordCreated &&
              !slotProps.data.isInsuranceCompanyRecordCreated &&
              slotProps.data.isHospitalReady &&
              slotProps.data.isInsuranceCompanyReady"
              class="actionButton"
              color="dark"
              @click="undenyClaimAndCreateHospitalAndInsuranceCompanyRecords(slotProps.data)"
            >
              Undo Denial And Create Hos and Ins Records
            </ion-button>
            <ion-button v-if="slotProps.data.status == statusTypes.Appealed &&
              slotProps.data.isPatientRecordCreated &&
              !slotProps.data.isHospitalRecordCreated &&
              !slotProps.data.isInsuranceCompanyRecordCreated"
              class="actionButton" 
              color="dark"
              @click="openDenyAppealWithOnlyPatientRecordPopover($event, slotProps.data)"
            >
              Deny Appeal That Only Has Patient Record
            </ion-button>
            <ion-button v-else-if="slotProps.data.status == statusTypes.Appealed &&
              slotProps.data.isPatientRecordCreated &&
              slotProps.data.isHospitalRecordCreated &&
              slotProps.data.isInsuranceCompanyRecordCreated"
              class="actionButton"
              color="dark"
              @click="openDenyAppealWithAllRecordsPopover($event, slotProps.data)"
            >
              Deny Appeal With All Records
            </ion-button>

            <ion-popover :is-open="denyAppealWithOnlyPatientRecordPopoverOpen" :event="event" @didDismiss="denyAppealWithOnlyPatientRecordPopoverOpen=false" side="bottom" alignment="center">
              <ion-text>
                Enter Denial Reason To Deny Appeal
              </ion-text>
              <div class="flexCenterColumn">
                <ion-textarea v-model="denialReason" 
                  :counter="true"
                  :maxlength=M4A_MAX_NOTE_LENGTH
                  :spellcheck="true"
                  :counter-formatter="customFormatter">
                </ion-textarea>
                <ion-button 
                  color="dark" @click="denyAppealedClaimWithOnlyPatientRecord()" :disabled="overNoteByteSizeLimit || denialReason.length == 0"
                >
                  Deny Appeal That Only Has Patient Record
                </ion-button>
              </div>
            </ion-popover>

            <ion-popover :is-open="denyAppealWithAllRecordsPopoverOpen" :event="event" @didDismiss="denyAppealWithAllRecordsPopoverOpen=false" side="bottom" alignment="center">
              <ion-text>
                Enter Denial Reason To Deny Appeal
              </ion-text>
              <div class="flexCenterColumn">
                <ion-textarea v-model="denialReason" 
                  :counter="true"
                  :maxlength=M4A_MAX_NOTE_LENGTH
                  :spellcheck="true"
                  :counter-formatter="customFormatter">
                </ion-textarea>
                <ion-button
                color="dark" @click="denyAppealedClaimWithAllRecords()" :disabled="overNoteByteSizeLimit || denialReason.length == 0">
                  Deny Appeal With All Records
                </ion-button>
              </div>
            </ion-popover>

            <ion-popover :is-open="revokeApprovalPopoverOpen" :event="event" @didDismiss="revokeApprovalPopoverOpen=false" side="bottom" alignment="center">
              <ion-text>
                Enter Denial Reason To Revoke Approval
              </ion-text>
              <div class="flexCenterColumn">
                <ion-textarea v-model="denialReason" 
                  :counter="true"
                  :maxlength=M4A_MAX_NOTE_LENGTH
                  :spellcheck="true"
                  :counter-formatter="customFormatter">
                </ion-textarea>
                <ion-button color="dark" @click="revokeApproval()" :disabled="overNoteByteSizeLimit || denialReason.length == 0">
                  Confirm Revoke Approval
                </ion-button>
              </div>
            </ion-popover>
          </div>
          
        </template>
      </Column>
    </DataTable>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, watch, onMounted, inject } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonInput, IonTextarea, IonPopover, IonText } from '@ionic/vue'
  import { search, download } from 'ionicons/icons'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import InputText from 'primevue/inputtext'
  import InputNumber from 'primevue/inputnumber'
  import { M4A_MAX_NOTE_LENGTH,
    getHospital,
    getInsuranceCompany,
    getProcessedClaim } from '/src/assets/contracts/Solana/M4AProtocol.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { statusTypes } from '/src/types/statusTypes.ts'
  import { HospitalTypes } from '/src/types/HospitalTypes.ts'
  import { trimAddress,
    copyFullAddress,
    parseDollarAmountStringFromDecimal,
    convertFromFixed2PointNotationToDecimal,
    confirmM4ATransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import * as anchor from "@coral-xyz/anchor"
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

  defineEmits(['toggleProcessorsTable', 'toggleClaimQueueTable', 'toggleHospitalTable', 'toggleInsuranceCompanyTable', 'toggleProcessedClaimsTable'])

  const props = defineProps(['tableData', 'isLoading'])

  const toast = inject('toast')
  
  var currentTableData = ref(props.tableData)
  var newTableData: any
  var unfilteredTableData: any
  var searchInput = ref("")
  var tableDownload = ref()
  var savedEditedRow: any
  var sorting = false
  var isEditing = false
  var isDataEdited = ref(false)
  
  var userPopoverOpen = ref()
  var hospitalPopoverOpen = ref()
  var denyAppealWithOnlyPatientRecordPopoverOpen = ref()
  var denyAppealWithAllRecordsPopoverOpen = ref()
  var revokeApprovalPopoverOpen = ref()
  var denialReason = ref("")

  var event = ref()

  var copyFullAddressButtonText = ref("Copy Full Address")

  //Keeps editing from fucking up the table after it's sorted
  function onValueChange(value: any) 
  {
    if(sorting)
    {
      currentTableData.value = value;
      sorting = false
    }
  }

  //Custom table filtering to be able to edit cells after filtering
  function filterTable()
  {
    if(unfilteredTableData == undefined)
      unfilteredTableData = currentTableData.value

    if(searchInput.value == "")
    {
      currentTableData.value = unfilteredTableData
      unfilteredTableData == undefined
    }
    else
    {
      currentTableData.value = customProcessedClaimsFilter(searchInput.value)
    }
  }

  function customProcessedClaimsFilter(filterString: string)
  {
    var filteredTable: any = []

    for(var i=0; i<unfilteredTableData.length; i++)
    {
      if(unfilteredTableData[i].submitterAddress.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].patientFullName.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].processedClaimId.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].submittedTime.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].submittedTimeString.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].submittedDateString.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].processedTime.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].processedTimeString.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].processedDateString.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].countryName.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].stateName.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalName.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].countryIndex.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].stateIndex.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalIndex.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalCity.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalAddress.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalPhoneNumber.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalZipCode.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalBillInvoiceNumber.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].ailment.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].submitterApprovedClaimAmountString.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].patientApprovedClaimAmountString.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalApprovedClaimAmountString.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].insuranceCompanyApprovedClaimAmountString.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].claimAmountString.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].status.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].statusMessage.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].note.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].insuranceCompanyIndex.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].insuranceCompanyName.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
    }

    return filteredTable
  }

  //Checks for presisting edits incase you navigate away before committing changes
  onMounted(()=>
  {
    if(currentTableData.value?.length > 0)
      for(var i=0; i<currentTableData.value.length; i++)  
        if(currentTableData.value[i].isRowDataEdited)
          isDataEdited.value = true
  })

  watch(() => props.tableData, async() =>  
  {
    if(isEditing)//Save new table data until after Processor is done typing
      newTableData = props.tableData
    else if(unfilteredTableData != undefined) //Set new data into the unfiltered table if currently filtering table
    {
      if(savedEditedRow != undefined)//Combine saved row data with new table data
      {
        var tempTable = props.tableData

        for(var i=0; i<tempTable.length; i++)
          if(tempTable[i].processedClaimId == savedEditedRow.processedClaimId)
          {
            tempTable[i].isActive = savedEditedRow.isActive
            tempTable[i].hospitalLongitude = savedEditedRow.hospitalLongitude
            tempTable[i].hospitalLatitude = savedEditedRow.hospitalLatitude
            tempTable[i].hospitalType = savedEditedRow.hospitalType
            tempTable[i].hospitalTypeName = savedEditedRow.hospitalTypeName
            tempTable[i].hospitalName = savedEditedRow.hospitalName
            tempTable[i].hospitalAddress = savedEditedRow.hospitalAddress
            tempTable[i].hospitalCity = savedEditedRow.hospitalCity
            tempTable[i].hospitalZipCode = savedEditedRow.hospitalZipCode
            tempTable[i].hospitalPhoneNumber = savedEditedRow.hospitalPhoneNumber
            tempTable[i].note = savedEditedRow.note
            tempTable[i].isRowDataEdited = true
          }

        unfilteredTableData = tempTable
        currentTableData.value = customProcessedClaimsFilter(searchInput.value)
      }
      else
      {
        unfilteredTableData = props.tableData
        currentTableData.value = customProcessedClaimsFilter(searchInput.value)
      }
    }
    else if(savedEditedRow != undefined)//Combine saved row data with new table data
    {
      var tempTable = props.tableData

      for(var i=0; i<tempTable.length; i++)
        if(tempTable[i].processedClaimId == savedEditedRow.processedClaimId)
        {
          tempTable[i].hospitalIndex = savedEditedRow.hospitalIndex
          tempTable[i].insuranceCompanyIndex = savedEditedRow.insuranceCompanyIndex
          tempTable[i].hospitalBillInvoiceNumber = savedEditedRow.hospitalBillInvoiceNumber
          tempTable[i].claimAmount = savedEditedRow.claimAmount
          tempTable[i].claimAmountString = savedEditedRow.claimAmountString
          tempTable[i].ailment = savedEditedRow.ailment
          tempTable[i].note= savedEditedRow.note
          tempTable[i].isHospitalReady = savedEditedRow.isHospitalReady
          tempTable[i].isInsuranceCompanyReady = savedEditedRow.isInsuranceCompanyReady
          tempTable[i].isRowDataEdited = true
        }

      currentTableData.value = tempTable
    }
    else //Update current table like normal
      currentTableData.value = props.tableData
  })

  function passByRefWrapperCopyAddress()
  {
    copyFullAddress(copyFullAddressButtonText, event.value.address)
  }

  function exportCSV(e: Event) 
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

  function openHospitalPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.hospitalApprovedClaimAmountString = rowData.hospitalApprovedClaimAmountString
    event.value.hospitalBillInvoiceNumber = rowData.hospitalBillInvoiceNumber
    event.value.hospitalAddress = rowData.hospitalAddress
    event.value.hospitalCity = rowData.hospitalCity
    event.value.hospitalZipCode = rowData.hospitalZipCode
    event.value.hospitalPhoneNumber = rowData.hospitalPhoneNumber
    event.value.hospitalNote = rowData.hospitalNote
    hospitalPopoverOpen.value = true
  }

  function openDenyAppealWithOnlyPatientRecordPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.processorAddress = rowData.processorAddress
    event.value.processorCountIndex = rowData.processorCountIndex
    denyAppealWithOnlyPatientRecordPopoverOpen.value = true
  }

  function openDenyAppealWithAllRecordsPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.processorAddress = rowData.processorAddress
    event.value.processorCountIndex = rowData.processorCountIndex
    denyAppealWithAllRecordsPopoverOpen.value = true
  }

  function openRevokeApprovalPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.processorAddress = rowData.processorAddress
    event.value.processorCountIndex = rowData.processorCountIndex
    revokeApprovalPopoverOpen.value = true
  }

  function checkForNewDataAfterEditing()
  {
    if(newTableData != undefined) //Check if newTableData came in while editing
    {
      if(savedEditedRow != undefined) //Combine new table data with the edited row data if it exists
        for(var i=0; i<newTableData.length; i++)
          if(newTableData[i].processedClaimId == savedEditedRow.processedClaimId)
          {
            newTableData[i].hospitalIndex = savedEditedRow.hospitalIndex
            newTableData[i].insuranceCompanyIndex = savedEditedRow.insuranceCompanyIndex
            newTableData[i].hospitalBillInvoiceNumber = savedEditedRow.hospitalBillInvoiceNumber
            newTableData[i].claimAmount = savedEditedRow.claimAmount
            newTableData[i].claimAmountString = savedEditedRow.claimAmountString
            newTableData[i].ailment = savedEditedRow.ailment
            newTableData[i].note= savedEditedRow.note
            newTableData[i].isHospitalReady = savedEditedRow.isHospitalReady
            newTableData[i].isInsuranceCompanyReady = savedEditedRow.isInsuranceCompanyReady
            newTableData[i].isRowDataEdited = true
            newTableData[i].isEditingRow = false
          }
      
      if(unfilteredTableData != undefined)
      {
        unfilteredTableData = newTableData
        currentTableData.value = customProcessedClaimsFilter(searchInput.value)
      }
      else    
        currentTableData.value = newTableData

      newTableData = undefined
    }
  }

  const onCellEditSave = async (event: { newData:any; index:any } ) => 
  {
    let { newData, index } = event

    //const processedClaim = await anchorPrograms.m4a.m4aProgram.account.processedClaim.fetch(getProcessedClaimPDA(currentTableData.value[index].processorAddress, currentTableData.value[index].processorCountIndex))

    const processedClaim = getProcessedClaim(currentTableData.value[index].processorAddress, currentTableData.value[index].processorCountIndex)

    currentTableData.value[index].hospitalIndex = newData.hospitalIndex
    currentTableData.value[index].insuranceCompanyIndex = newData.insuranceCompanyIndex
    currentTableData.value[index].hospitalBillInvoiceNumber = newData.hospitalBillInvoiceNumber
    currentTableData.value[index].claimAmount = newData.claimAmount
    currentTableData.value[index].claimAmountString = parseDollarAmountStringFromDecimal(newData.claimAmount)
    currentTableData.value[index].ailment = newData.ailment
    currentTableData.value[index].note = newData.note

    if(currentTableData.value[index].hospitalIndex !=  processedClaim.hospitalIndex ||
    currentTableData.value[index].insuranceCompanyIndex !=  processedClaim.insuranceCompanyIndex ||
    currentTableData.value[index].hospitalBillInvoiceNumber !=  processedClaim.hospitalBillInvoiceNumber ||
    currentTableData.value[index].claimAmount !=  processedClaim.claimAmount ||
    currentTableData.value[index].ailment !=  processedClaim.ailment ||
    newData.note !=  processedClaim.note)
    {
      currentTableData.value[index].isRowDataEdited = true
      savedEditedRow = currentTableData.value[index]
      isDataEdited.value = true
    }
    else
    {
      currentTableData.value[index].isRowDataEdited = false

      //Erase saved row if it exists since the row data matches what's on the block chain
      if(savedEditedRow != undefined)
        if(currentTableData.value[index].processedClaimId == savedEditedRow.processedClaimId) //Keeps other rows from erasing the data when you click in them
        {
          savedEditedRow = undefined
          isDataEdited.value = false
        }
    }

    const hospital = getHospital(newData.countryIndex, newData.stateIndex, newData.hospitalIndex)
    if(hospital)
      currentTableData.value[index].isHospitalReady = true
    else
      currentTableData.value[index].isHospitalReady = false

    const insuranceCompany = getInsuranceCompany(currentTableData.value[index].insuranceCompanyIndex)
    
    if(insuranceCompany)
      currentTableData.value[index].isInsuranceCompanyReady = true
    else
      currentTableData.value[index].isInsuranceCompanyReady = false

    checkForNewDataAfterEditing()
    currentTableData.value[index].isEditingRow = false
    isEditing = false
  }

  async function editProcessedClaimAndPatientRecord(processedClaimData: any)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.editProcessedClaimAndPatientRecord
      (
        processedClaimData.processorAddress,
        processedClaimData.processorCountIndex,
        processedClaimData.hospitalIndex,
        processedClaimData.insuranceCompanyIndex,
        processedClaimData.hospitalBillInvoiceNumber,
        processedClaimData.note == "" ? "None" : processedClaimData.note,
        new anchor.BN(processedClaimData.claimAmount * 100), //Convert from decimal to fixed 2 point notation
        processedClaimData.ailment
      ).rpc()

      savedEditedRow = undefined
      isDataEdited.value = false
      await confirmM4ATransaction(tx, toast, "edit_processed_claim_and_patient_record")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "edit_processed_claim_and_patient_record")
    }
  }
  
  async function editProcessedClaimAndAllRecords(processedClaimData: any)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.editProcessedClaimAndAllRecords
      (
        processedClaimData.processorAddress,
        processedClaimData.processorCountIndex,
        processedClaimData.hospitalBillInvoiceNumber,
        processedClaimData.note == "" ? "None" : processedClaimData.note,
        new anchor.BN(processedClaimData.claimAmount * 100), //Convert from decimal to fixed 2 point notation
        processedClaimData.ailment
      ).rpc()

      savedEditedRow = undefined
      isDataEdited.value = false
      await confirmM4ATransaction(tx, toast, "edit_processed_claim_and_all_records")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "edit_processed_claim_and_all_records")
    }
  }
  
  async function undenyClaimWithAllRecords(processedClaimData: any)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.undenyClaimWithAllRecords
      (
        processedClaimData.processorAddress,
        processedClaimData.processorCountIndex,
      ).rpc()
      await confirmM4ATransaction(tx, toast, "undeny_claim_with_all_records")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "undeny_claim_with_all_records")
    }

  }

  async function undenyClaimAndCreateHospitalAndInsuranceCompanyRecords(processedClaimData: any)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.undenyClaimAndCreateHospitalAndInsuranceCompanyRecords
      (
        processedClaimData.processorAddress,
        processedClaimData.processorCountIndex,
      ).rpc()
      await confirmM4ATransaction(tx, toast, "undeny_claim_and_create_hospital_and_insurance_company_records")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "undeny_claim_and_create_hospital_and_insurance_company_records")
    }
  }

  async function denyAppealedClaimWithOnlyPatientRecord()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.denyAppealedClaimWithOnlyPatientRecord
      (
        event.value.processorAddress,
        event.value.processorCountIndex,
        denialReason.value
      ).rpc()

      denialReason.value = ""
      denyAppealWithOnlyPatientRecordPopoverOpen.value = false
      await confirmM4ATransaction(tx, toast, "deny_appealed_claim_with_only_patient_record")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "deny_appealed_claim_with_only_patient_record")
    }
  }

  async function denyAppealedClaimWithAllRecords()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.denyAppealedClaimWithAllRecords
      (
        event.value.processorAddress,
        event.value.processorCountIndex,
        denialReason.value
      ).rpc()

      denialReason.value = ""
      denyAppealWithAllRecordsPopoverOpen.value = false
      await confirmM4ATransaction(tx, toast, "deny_appealed_claim_with_all_records")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "deny_appealed_claim_with_all_records")
    }
  }

  async function revokeApproval()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.revokeApproval
      (
        event.value.processorAddress,
        event.value.processorCountIndex,
        denialReason.value
      ).rpc()

      denialReason.value = ""
      revokeApprovalPopoverOpen.value = false
      await confirmM4ATransaction(tx, toast, "revoke_approval")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "revoke_approval")
    }
  }

  var overNoteByteSizeLimit = ref(false)

  const customFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([denialReason.value])
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
</script>

<style scoped>
  .tableMinWidth
  {
    min-width: 1770px
  }

  .actionButton
  {
    min-width: 90px
  }

  ion-input, ion-textarea
  {
    --highlight-color: var(--ion-color-gray)
  }
</style>