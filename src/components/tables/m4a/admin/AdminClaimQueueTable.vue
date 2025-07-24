<template>
  <h1 >Claim Queue</h1>

  <div class="tableContainer">
    <DataTable
      ref="tableDownload"
      class="tableMinWidth"
      paginator 
      show-gridlines 
      :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      dataKey="id" 
      v-model:expandedRows="hospitalAndInsuranceInfo" 
      :value="currentTableData"
      :loading="isLoading"
      editMode="cell" 
      @cell-edit-complete="onCellEditSave($event)"
      @sort="sorting=true"
      @value-change="onValueChange($event)"
    >
      <template #header>
        <div>
          <div class="tableToggleButtonContainer smallMarginBottom">
            <ion-button color="dark" @click="$emit('toggleProcessorsTable')">Toggle Processors Table</ion-button>
            <ion-button color="dark" class="tableToggleSelect" :disabled="true">Toggle Claim Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleHospitalTable')">Toggle Hospital Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleInsuranceCompanyTable')">Toggle Insurance Company Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleProcessedClaimsTable')">Toggle Processed Claims Table</ion-button>
          </div>
          <ion-input
            color="dark"
            v-model="searchInput"
            fill="outline"
            label-placement="stacked"
            placeholder="Claim Queue Search      "
            @input="filterTable()"
          >
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>

          <div :class="connectedWallet.addressString!=adminAccounts.m4aCEOAddress ? 'largeMarginBottom' : ''">
            <ion-button fill="clear" @click="expandClaimDetails()">
              <ion-label  color="dark">Expand Claims</ion-label>
            </ion-button>

            <ion-button fill="clear" @click="exportCSV($event)">
              <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
            </ion-button>

            <ion-button fill="clear" @click="hospitalAndInsuranceInfo={}">
              <ion-label  color="dark">Collapse Claims</ion-label>
            </ion-button>
          </div>
        </div>

        <div v-if="connectedWallet.addressString==adminAccounts.m4aCEOAddress">
          <div class="flexCenterRow">
            <ion-input
              v-model="claimQueueSizeLimitInput"
              :value="claimQueueSizeLimit"
              :disabled="!anchorPrograms.isM4AProtocolReady"
              fill="outline"
              type="number" 
              style="width: 100px; margin-bottom: 10px">
            </ion-input>
          </div>
          <div :style="anchorPrograms.isM4AProtocolReady ? 'margin-bottom: 60px' : ''">
            <ion-text v-if="claimQueueSizeLimitInput==claimQueueSizeLimit || !claimQueueSizeLimitInput" class="flexCenterRow" style="margin-top: -5px">Queue Size Limit</ion-text>
            <ion-button v-else @click="updateClaimQueueSize()" color="dark" style="margin-top: -5px">Update Claim Queue Size</ion-button>
          </div>
        </div>

        <div >
          <div align="left" :style="anchorPrograms.isM4AProtocolReady ? 'margin-bottom: -55px' : ''">
            <ion-text>Queue:{{ currentClaimQueueCount }}/{{ claimQueueSizeLimit }}</ion-text>
          </div>
          <div class="flexCenterRow" v-if="connectedWallet.addressString==adminAccounts.m4aCEOAddress">
            <ion-button v-if="isClaimQueueOn && anchorPrograms.isM4AProtocolReady" color="dark" style="font-size: 27px" @click="setClaimQueueFlag(false)">
              <span style="margin-left: -8px; margin-right: 13px">🔒</span>Disable Claim Queue
            </ion-button>
            <ion-button v-else-if="anchorPrograms.isM4AProtocolReady" color="dark" style="font-size: 27px" @click="setClaimQueueFlag(true)">
              <span style="margin-left: -8px; margin-right: 13px">🔑</span>Re-enable Claim Queue
            </ion-button>
            
            <ion-button v-if="tableData?.length!=0" color="dark" style="font-size: 27px" @click="dropDenialHammer()">
              <span style="margin-left: -8px; margin-right: 13px">🔨</span>Drop Denial Hammer
            </ion-button>
          </div>
        </div>
      </template>

      <template #empty>No records found.</template>
      <template #loading>Loading records. Please wait.</template>

      <Column expander style="width: 0%"/>
      <Column field="id" header="Claim Number" style="width: 0%" sortable></Column>
      <Column field="submitterDisplayName" header="User" style="width: 10%" sortable>
        <template #body="slotProps">
          <div >
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
              <ion-label class="tablePopupUnderLine">Submitter Address</ion-label>
              {{ event.trimmedAddress }}
              <div class="flexCenterRow">
                <ion-button class="copyAddressButton" color="dark" @click="passByRefWrapperCopyAddress()">
                    <ion-label color="light">{{copyFullAddressButtonText}}</ion-label>
                </ion-button>
              </div>
            </div>
          </ion-popover>
        </template>
      </Column>
      <Column field="patientFullName" header="Patient Name" style="width: 0%" sortable></Column>
      <Column field="countryName" header="Country" style="width: 0%" sortable></Column>
      <Column field="stateName" header="State" style="width: 0%" sortable></Column>
      <Column field="hospitalIndex" header="Hos Index" style="width: 0%" sortable>
        <template #editor="{ index, data, field }">
          <InputNumber v-model="data[field]"
            :min=0
            :step=1
            fluid
            @input="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="!data.isStateReady ||
            data.isInsuranceCompanyIndexEdited ||
            data.isHospitalRecordCreated ||
            connectedWallet.addressString!=data.processorAddress.toBase58()"
          />
        </template>
      </Column>
      <Column field="insuranceCompanyIndex" header="Ins Index" style="width: 0%" sortable>
        <template #editor="{ index, data, field }">
          <InputText
            v-model="data[field]"
            fluid
            @input="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="!data.isStateReady ||
            !data.isHospitalReady ||
            data.isHospitalIndexEdited ||
            data.isInsuranceCompanyRecordCreated ||
            connectedWallet.addressString!=data.processorAddress.toBase58()"
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
            :disabled="!data.isPatientRecordCreated ||
            !data.isHospitalRecordCreated ||
            !data.isInsuranceCompanyRecordCreated ||
            connectedWallet.addressString!=data.processorAddress.toBase58()"
          />
        </template>
      </Column>
      <Column field="ailment" header="Ailment" style="width: 0%" sortable>
        <template #editor="{  index, data, field }">
          <InputText
            v-model="data[field]"
            fluid
            @input="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="!data.isPatientRecordCreated ||
            !data.isHospitalRecordCreated ||
            !data.isInsuranceCompanyRecordCreated ||
            connectedWallet.addressString!=data.processorAddress.toBase58()"
          />
        </template>
      </Column>
      <Column field="note" header="Note" style="width: 10%" sortable>
        <template #editor="{ index, data, field }">
          <InputText
            v-model="data[field]"
            fluid
            @input="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="!data.isPatientRecordCreated ||
            !data.isHospitalRecordCreated ||
            !data.isInsuranceCompanyRecordCreated ||
            connectedWallet.addressString!=data.processorAddress.toBase58()"
          />
        </template>
      </Column>
      <Column header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <ion-label v-if="slotProps.data.isEditingRow" color="yellow">
              Table Updates Paused While Editing
            </ion-label>
            <ion-label v-if="!connectedWallet.isProcessorAccountReady">
              Your Processor Account Is Non Existent
            </ion-label>
            <ion-label v-else-if="connectedWallet.addressString==slotProps.data.processorAddress.toBase58() &&
            connectedWallet.submitterAddressOfClaimBeingProcessed==SYSTEM_PROGRAM_ADDRESS_STRING">
              Your Processor Account Was Unassigned. This Claim Still Needs To Be Unassigned, Reassigned, Or Denied
            </ion-label>
            <ion-label v-else-if="slotProps.data.processorAddress.toBase58()!=SYSTEM_PROGRAM_ADDRESS_STRING && connectedWallet.addressString!=slotProps.data.processorAddress.toBase58()">
              Another Processor Is Assigned To This Claim
            </ion-label>
            <ion-label v-else-if="connectedWallet.isProcessorWorkingAClaim && 
              connectedWallet.addressString!=slotProps.data.processorAddress.toBase58()"
            >
              You Are Currently Working Another Claim
            </ion-label>
            <ion-button v-else-if="!connectedWallet.isProcessorWorkingAClaim &&
              slotProps.data.processorAddress.toBase58()==SYSTEM_PROGRAM_ADDRESS_STRING"
              class="actionButton"
              color="dark"
              @click="assignClaimToSelf(slotProps.data)"
              :disabled="!connectedWallet.isProcessorAccountActive"
            >
             Assign Self To Claim
            </ion-button>
            <ion-button v-else-if="!slotProps.data.isStateReady"
              @click="initState(slotProps.data)"
              class="actionButton"
              color="dark"
            >
              Init State
            </ion-button>
            <ion-label v-else-if="slotProps.data.hospitalIndex > slotProps.data.nextHospitalIndex">
              Next Available State Hospital Index Is {{ slotProps.data.nextHospitalIndex }}
            </ion-label>
            <ion-label v-else-if="slotProps.data.hospitalType > HospitalTypes.Mental">
              Hospital Type Must Be Between {{ HospitalTypes.General }} and {{ HospitalTypes.Mental }}
            </ion-label>
            <ion-button v-else-if="!slotProps.data.isHospitalReady" class="actionButton" color="dark" @click="openInitHospitalPopover($event, slotProps.data)">
              Init Hospital
            </ion-button>
            <ion-button v-else-if="(slotProps.data.isHospitalIndexEdited)" 
            class="actionButton" color="dark" @click="updateClaimHospitalIndex(slotProps.data)">
              Update Claim Hospital Index
            </ion-button>
            <ion-label v-else-if="slotProps.data.insuranceCompanyIndex > slotProps.data.nextInsuranceCompanyIndex">
              Next Available Insurance Company Index Is {{ slotProps.data.nextInsuranceCompanyIndex }}
            </ion-label>
            <ion-button v-else-if="!slotProps.data.isInsuranceCompanyReady" class="actionButton" color="dark" @click="openInitInsuranceCompanyPopover($event, slotProps.data)">
              Init Insurance Company
            </ion-button>
            <ion-button v-else-if="(slotProps.data.isHospitalIndexEdited || slotProps.data.isInsuranceCompanyIndexEdited) &&
            !(slotProps.data.hospitalIndex > slotProps.data.nextHospitalIndex) &&
            slotProps.data.isStateReady &&
            slotProps.data.isInsuranceCompanyReady" 
            class="actionButton" color="dark" @click="updateClaimInsuranceCompanyIndex(slotProps.data)">
              Update Claim Insurance Company Index
            </ion-button>
            <ion-button v-else-if="!slotProps.data.isPatientRecordCreated && 
            !slotProps.data.isHospitalRecordCreated && 
            !slotProps.data.isInsuranceCompanyRecordCreated" 
              class="actionButton" color="dark" @click="createPatientRecord(slotProps.data)">
              Create Patient Record
            </ion-button>
            <ion-button v-else-if="slotProps.data.isPatientRecordCreated && 
            !slotProps.data.isHospitalRecordCreated && 
            !slotProps.data.isInsuranceCompanyRecordCreated" 
              class="actionButton" color="dark" @click="createHospitalAndInsuranceCompanyRecords(slotProps.data)">
              Create Hospital And Insurance Company Records
            </ion-button>
            <ion-button v-else-if="slotProps.data.isRowDataEdited" class="actionButton" color="dark" @click="approveClaimWithEdits(slotProps.data)">
              Approve With Edits
            </ion-button>
            <ion-button v-else class="actionButton" color="dark" @click="approveClaim(slotProps.data)" style="width: 77px; height: 40px">
              Approve
            </ion-button>
            <ion-button v-if="
            connectedWallet.addressString==slotProps.data.processorAddress.toBase58() && 
            slotProps.data.isHospitalReady && 
            slotProps.data.isInsuranceCompanyReady && 
            !slotProps.data.isRowDataEdited && 
            !slotProps.data.isPatientRecordCreated" class="actionButton" color="dark" @click="openCreatePatientRecordAndDenyClaimPopover($event, slotProps.data)">
            Create Patient Record & Deny Claim
          </ion-button>
            <ion-button v-else-if="slotProps.data.isPatientRecordCreated &&
              slotProps.data.isHospitalRecordCreated &&
              slotProps.data.isInsuranceCompanyRecordCreated"
              class="actionButton"
              color="dark"
              @click="openDenyClaimPopover($event, slotProps.data)"
            >
              Deny
            </ion-button>
            <ion-button 
              v-if="slotProps.data.processorAddress.toBase58()!=SYSTEM_PROGRAM_ADDRESS_STRING &&
              (connectedWallet.isProcessorAccountSuperAdmin ||
              connectedWallet.addressString==adminAccounts.m4aCEOAddress)"
              color="dark"
              @click="unassignClaimFromProcessor(slotProps.data.submitterAddress)"
            >
              Unassign Claim
            </ion-button>
            <ion-button 
              v-if="slotProps.data.processorAddress.toBase58()!=SYSTEM_PROGRAM_ADDRESS_STRING &&
              !connectedWallet.isProcessorWorkingAClaim && 
              connectedWallet.addressString!=slotProps.data.processorAddress.toBase58() &&
              (connectedWallet.isProcessorAccountSuperAdmin ||
              connectedWallet.addressString==adminAccounts.m4aCEOAddress)"
              color="dark"
              @click="reassignClaimToNewProcessor(slotProps.data.submitterAddress)"
            >
              Reassign Claim To Self
            </ion-button>
            <ion-button v-if="connectedWallet.isProcessorAccountReady &&
            slotProps.data.status==statusTypes.Pending &&
            !slotProps.data.isPatientRecordCreated &&
            (connectedWallet.isProcessorAccountSuperAdmin ||
            connectedWallet.addressString==adminAccounts.m4aCEOAddress)"
            class="actionButton"
            color="dark"
            @click="maxDenyPendingClaim(slotProps.data.submitterAddress)">
              Max Deny Pending Claim
            </ion-button>
            <ion-button v-else-if="connectedWallet.isProcessorAccountReady &&
            slotProps.data.status==statusTypes.Processing &&
            !slotProps.data.isPatientRecordCreated &&
            (connectedWallet.isProcessorAccountSuperAdmin ||
            connectedWallet.addressString==adminAccounts.m4aCEOAddress)"
            class="actionButton"
            color="dark"
            @click="maxDenyInProgressClaim(slotProps.data.submitterAddress)">
              Max Deny In Progress Claim
            </ion-button>
            <ion-popover :is-open="initHospitalPopoverOpen" :event="event" @didDismiss="initHospitalPopoverOpen=false" side="top" alignment="center">
              <ion-text class="flexCenterColumn">
                This will update the claim with the newly created hospital.<br>Are you Sure?
              </ion-text>
              <ion-textarea 
                v-model="hospitalNote"
                placeholder="Optional Note"
                :counter="true"
                :maxlength=M4A_MAX_NOTE_LENGTH
                :spellcheck="true"
                :counter-formatter="customHospitalNoteFormatter">
              </ion-textarea>
              <ion-button color="dark" @click="initHospital()" :disabled=overNoteByteSizeLimit>Update</ion-button>
              <ion-button color="dark" @click="initHospitalPopoverOpen = false">
                Cancel
              </ion-button>
            </ion-popover>
            <ion-popover :is-open="initInsuranceCompanyPopoverOpen" :event="event" @didDismiss="initInsuranceCompanyPopoverOpen=false" side="top" alignment="center">
              <ion-text class="flexCenterColumn">
                This will update the claim with the newly created insurance company.<br>Are you Sure?
              </ion-text>
              <ion-textarea
                v-model="insuranceCompanyNote"
                placeholder="Optional Note"
                :counter="true"
                :maxlength=M4A_MAX_NOTE_LENGTH
                :spellcheck="true"
                :counter-formatter="customInsuranceCompanyNoteFormatter">
              </ion-textarea>
              <ion-button color="dark" @click="initInsuranceCompany()" :disabled=overNoteByteSizeLimit>Update</ion-button>
              <ion-button color="dark" @click="initInsuranceCompanyPopoverOpen = false">
                Cancel
              </ion-button>
            </ion-popover>
            <ion-popover :is-open="createPatientRecordDenyClaimPopoverOpen" :event="event" @didDismiss="createPatientRecordDenyClaimPopoverOpen=false" side="bottom" alignment="center">
              <ion-text class="flexCenterColumn">
                Enter Denial Reason
              </ion-text>
              <ion-textarea 
                v-model="denialReason" 
                :counter="true"
                :maxlength=M4A_MAX_NOTE_LENGTH
                :spellcheck="true"
                :counter-formatter="customDenialFormatter">
              </ion-textarea>
              <ion-button color="dark" @click="createPatientRecordAndDenyClaim()" :disabled="overNoteByteSizeLimit || denialReason?.length == 0">
                Create Patient Record & Deny Claim
              </ion-button>
            </ion-popover>
            <ion-popover :is-open="denyClaimPopoverOpen" :event="event" @didDismiss="denyClaimPopoverOpen=false" side="bottom" alignment="center">
              <ion-text class="flexCenterColumn">
                Enter Denial Reason
              </ion-text>
              <ion-textarea 
                v-model="denialReason" 
                :counter="true"
                :maxlength=M4A_MAX_NOTE_LENGTH
                :spellcheck="true"
                :counter-formatter="customDenialFormatter">
            </ion-textarea>
              <ion-button color="dark" @click="denyClaimWithAllRecords()" :disabled="overNoteByteSizeLimit || denialReason?.length == 0">
                Deny Claim
              </ion-button>
            </ion-popover>
          </div>
        </template>
      </Column>
      
      <template #expansion="slotProps">
        <DataTable
          :value="[slotProps.data]"
          editMode="row"
          v-model:editingRows="editingHospitalRows"
          @row-edit-init="isEditing=true; slotProps.data.isEditingRow=true"
          @row-edit-save="onHospitalRowEditSave($event, slotProps.index)"
          @row-edit-cancel="checkForNewDataAfterEditing(); isEditing=false; slotProps.data.isEditingRow=false"
        >
          <Column field="hospitalName" header="Hospital Name" style="width: 10%">
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
                    <ion-label class="tablePopupUnderLine">Hospital Note</ion-label>
                    {{ event.hospitalNote }}
                  </div>
                </ion-popover>
              </div>
            </template>
            <template #editor="{ data, field }">
              <InputText
                v-model="data[field]"
                fluid
              />
            </template>
          </Column>
          <Column field="hospitalType" header="Type" style="width: 0%">
            <template #body="slotProps">
              {{ slotProps.data.hospitalTypeName }}
            </template>
            <template #editor="{ data, field }">
              <InputNumber
                v-model="data[field]"
                :min=0
                :step=1
                fluid
              />
            </template>
          </Column>
          <Column field="hospitalAddress" header="Address" style="width: 10%">
            <template #editor="{ data, field }">
              <InputText
                v-model="data[field]"
                fluid
              />
            </template>
          </Column>
          <Column field="hospitalCity" header="City" style="width: 7%">
            <template #editor="{ data, field }">
              <InputText
                v-model="data[field]"
                fluid
              />
            </template>
          </Column>
          <Column field="hospitalZipCode" header="Zip Code" style="width: 3%">
            <template #editor="{ data, field }">
              <InputMask
                v-model="data[field]"
                mask="99999"
                fluid
              />
            </template>
          </Column>
          <Column field="hospitalPhoneNumber" header="Phone Number" style="width: 7%">
            <template #editor="{ data, field }">
              <InputMask
                v-model="data[field]"
                mask="(999) 999-9999"
                fluid
              />
            </template>
          </Column>
          <Column field="hospitalBillInvoiceNumber" header="Invoice Number" style="width: 7%">
            <template #editor="{ data, field }">
              <InputText
                v-model="data[field]"
                fluid
              />
            </template>
          </Column>
          <Column field="hospitalLatitude" header="Latitude" style="width: 3%">
            <template #editor="{ data, field }">
              <InputNumber
                v-model="data[field]"
                :maxFractionDigits="6"
                fluid
              />
            </template>
          </Column>
          <Column field="hospitalLongitude" header="Longitude" style="width: 3%">
            <template #editor="{ data, field }">
              <InputNumber
                v-model="data[field]"
                :maxFractionDigits="6"
                fluid
              />
            </template>
          </Column>
          
          <Column 
            v-if="(
            //The state the hospital will be located in has to be initialized first
            slotProps.data.isStateReady &&

            //You can only make changes to the hospital info when initializing it, or switching the hospital on the claim to an existing hospital index
            !slotProps.data.isHospitalReady && 

            //Finish editing insurance company row first before being able to edit hospital row again
            !slotProps.data.isInsuranceIndexEdited &&

            //Hospital index must be an existing index or next available index to be able to edit hospital row
            slotProps.data.hospitalIndex <= slotProps.data.nextHospitalIndex) ||

            //If all records have been created, you can edit the hospital (not index) and approve with edits
            slotProps.data.isInsuranceCompanyRecordCreated" 
            :rowEditor="true"
            style="width: 0%"
            bodyStyle="text-align:center"
          >
          </Column> 
        </DataTable>

        <DataTable
          :value="[slotProps.data]"
          editMode="row"
          v-model:editingRows="editingInsuranceCompanyRows"
          @row-edit-init="isEditing=true"
          @row-edit-save="onInsuranceCompanyRowEditSave($event, slotProps.index)"
          @row-edit-cancel="checkForNewDataAfterEditing(); isEditing=false"
        >
          <Column field="insuranceCompanyName" header="Insurance Name" style="width: 10%">
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
            <template #editor="{ data, field }">
              <InputText
                v-model="data[field]"
                fluid
              />
            </template>
          </Column>
          <Column v-if="
          //Only the processor working the claim can edit the insurance company row
          connectedWallet.submitterAddressOfClaimBeingProcessed==slotProps.data.submitterAddress.toBase58() &&

          //Hospital must be initialized before being able to edit insurance company row
          //If you change the hospital index in the table, you have to initialize the new hospital or update the hospital index on the claim if it's an existing hopsital
          (((slotProps.data.isHospitalReady && !slotProps.data.isHospitalIndexEdited) &&

          //You can edit new insurance companies before you initialize them
          //If you change to an existing insurance company index, you have to update the claim to that insurance company index before being able to edit the insurance company row again
          !slotProps.data.isInsuranceCompanyReady &&

          //Insurance company index must be an existing index or next available index to be able to edit insurance company row
          slotProps.data.insuranceCompanyIndex <= slotProps.data.nextInsuranceCompanyIndex) ||

          //If all records have been created, you can edit the insurance company (not index, can't be changed after records are created) and approve with edits
          slotProps.data.isInsuranceCompanyRecordCreated)"
          
          :rowEditor="true" style="width: 0%" bodyStyle="text-align:center"></Column>
        </DataTable>
      </template>
      
    </DataTable>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, watch, inject } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonTextarea, IonPopover, IonText, IonInput } from '@ionic/vue'
  import { search, download } from 'ionicons/icons'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import InputText from 'primevue/inputtext'
  import InputMask from 'primevue/inputmask'
  import InputNumber from 'primevue/inputnumber'
  import { M4A_MAX_NOTE_LENGTH,
    getClaim,
    getHospital,
    getInsuranceCompany } from '/src/assets/contracts/Solana/M4AProtocol.vue'
  import * as anchor from "@coral-xyz/anchor"
  import { hospitalTypeOptions, HospitalTypes } from '/src/types/HospitalTypes.ts'
  import { statusTypes } from '/src/types/statusTypes.ts'
  import { trimAddress,
    copyFullAddress,
    parsePhoneNumberString,
    parseDollarAmountStringFromDecimal,
    convertFromFixed2PointNotationToDecimal,
    confirmM4ATransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { claims } from '/src/assets/globalStates/m4a/Claims.vue'

  const emits = defineEmits(
  [
    'toggleProcessorsTable',
    'toggleInsuranceCompanyTable',
    'toggleHospitalTable',
    'toggleProcessedClaimsTable'
  ])

  const props = defineProps(
  [
    'tableData',
    'isLoading',
    'isClaimQueueOn',
    'currentClaimQueueCount',
    'claimQueueSizeLimit'
  ])

  const toast = inject('toast')

  var currentTableData = ref(props.tableData)
  var newTableData: any
  var unfilteredTableData: any
  var searchInput = ref("")
  var tableDownload = ref()
  var hospitalAndInsuranceInfo = ref()
  var editingHospitalRows = ref()
  var editingInsuranceCompanyRows = ref()
  var savedEditedRow: any
  var sorting = false
  var isEditing = false
  var claimQueueSizeLimitInput = ref()
  
  var userPopoverOpen = ref()
  var hospitalPopoverOpen = ref()
  var insuranceCompanyPopoverOpen = ref()
  var initHospitalPopoverOpen = ref()
  var initInsuranceCompanyPopoverOpen = ref()
  var createPatientRecordDenyClaimPopoverOpen = ref()
  var denyClaimPopoverOpen = ref()

  var hospitalNote = ref("") //Instruction gets mad if this ends up undefined
  var insuranceCompanyNote = ref("") //Instruction gets mad if this ends up undefined
  var denialReason = ref()
  
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
      currentTableData.value = customClaimQueueFilter(searchInput.value)
    }
  }

  function customClaimQueueFilter(filterString: string)
  {
    var filteredTable: any = []

    for(var i=0; i<unfilteredTableData.length; i++)
    {
      if(unfilteredTableData[i].submitterAddress.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].patientFullName.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].id.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].submittedTime.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].submittedTimeString.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].submittedDateString.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].countryName.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].stateName.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].countryIndex.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].stateIndex.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalName.toString().toLowerCase().includes(filterString.toLowerCase()))
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
      else if(unfilteredTableData[i].hospitalLongitude.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalLatitude.toString().toLowerCase().includes(filterString.toLowerCase()))
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
      else if(unfilteredTableData[i].note.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].insuranceCompanyIndex.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].insuranceCompanyName.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
    }

    return filteredTable
  }


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
          if(tempTable[i].id.eq(savedEditedRow.id))
          {
            tempTable[i].hospitalIndex = savedEditedRow.hospitalIndex
            tempTable[i].insuranceCompanyIndex = savedEditedRow.insuranceCompanyIndex
            tempTable[i].claimAmount = savedEditedRow.claimAmount
            tempTable[i].ailment = savedEditedRow.ailment
            tempTable[i].note = savedEditedRow.note

            tempTable[i].hospitalName = savedEditedRow.hospitalName
            tempTable[i].hospitalType= savedEditedRow.hospitalType
            tempTable[i].hospitalAddress = savedEditedRow.hospitalAddress
            tempTable[i].hospitalCity = savedEditedRow.hospitalCity
            tempTable[i].hospitalZipCode = savedEditedRow.hospitalZipCode
            tempTable[i].hospitalPhoneNumber = savedEditedRow.hospitalPhoneNumber
            tempTable[i].hospitalLongitude = savedEditedRow.hospitalLongitude
            tempTable[i].hospitalLatitude = savedEditedRow.hospitalLatitude
            tempTable[i].isHospitalIndexEdited = savedEditedRow.isHospitalIndexEdited
            tempTable[i].isHospitalReady= savedEditedRow.isHospitalReady

            tempTable[i].insuranceCompanyName = savedEditedRow.insuranceCompanyName
            tempTable[i].isInsuranceCompanyIndexEdited = savedEditedRow.isInsuranceCompanyIndexEdited
            tempTable[i].isInsuranceCompanyReady = savedEditedRow.isInsuranceCompanyReady
            tempTable[i].isRowDataEdited = true
          }

        unfilteredTableData = tempTable
        currentTableData.value = customClaimQueueFilter(searchInput.value)
      }
      else
      {
        unfilteredTableData = props.tableData
        currentTableData.value = customClaimQueueFilter(searchInput.value)
      }
    }
    else if(savedEditedRow != undefined)//Combine saved row data with new table data
    {
      var tempTable = props.tableData

      for(var i=0; i<tempTable.length; i++)
        if(tempTable[i].id.eq(savedEditedRow.id))
        {
          tempTable[i].hospitalIndex = savedEditedRow.hospitalIndex
          tempTable[i].insuranceCompanyIndex = savedEditedRow.insuranceCompanyIndex
          tempTable[i].claimAmount = savedEditedRow.claimAmount
          tempTable[i].ailment = savedEditedRow.ailment
          tempTable[i].note = savedEditedRow.note

          tempTable[i].hospitalName = savedEditedRow.hospitalName
          tempTable[i].hospitalType= savedEditedRow.hospitalType
          tempTable[i].hospitalAddress = savedEditedRow.hospitalAddress
          tempTable[i].hospitalCity = savedEditedRow.hospitalCity
          tempTable[i].hospitalZipCode = savedEditedRow.hospitalZipCode
          tempTable[i].hospitalPhoneNumber = savedEditedRow.hospitalPhoneNumber
          tempTable[i].hospitalLongitude = savedEditedRow.hospitalLongitude
          tempTable[i].hospitalLatitude = savedEditedRow.hospitalLatitude
          tempTable[i].isHospitalIndexEdited = savedEditedRow.isHospitalIndexEdited
          tempTable[i].isHospitalReady= savedEditedRow.isHospitalReady

          tempTable[i].insuranceCompanyName = savedEditedRow.insuranceCompanyName
          tempTable[i].isInsuranceCompanyIndexEdited = savedEditedRow.isInsuranceCompanyIndexEdited
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

  function openUserPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.submitterApprovedClaimAmountString = rowData.submitterApprovedClaimAmountString
    event.value.patientApprovedClaimAmountString = rowData.patientApprovedClaimAmountString
    event.value.submittedTimeString = rowData.submittedTimeString
    event.value.submittedDateString = rowData.submittedDateString
    event.value.address = rowData.submitterAddress
    event.value.trimmedAddress = trimAddress(rowData.submitterAddress)
    event.value.patientFirstName = rowData.patientFirstName
    event.value.patientLastName = rowData.patientLastName

    userPopoverOpen.value = true
  }

  function openHospitalPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.hospitalApprovedClaimAmountString = rowData.hospitalApprovedClaimAmountString
    event.value.hospitalTypeName = rowData.hospitalTypeName
    event.value.hospitalNote = rowData.hospitalNote

    hospitalPopoverOpen.value = true
  }

  async function openInitHospitalPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.rowData = rowData
    initHospitalPopoverOpen.value = true
  }

  async function openInitInsuranceCompanyPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.rowData = rowData
    initInsuranceCompanyPopoverOpen.value = true
  }

  function openInsuranceCompanyPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.insuranceCompanyApprovedClaimAmountString = rowData.insuranceCompanyApprovedClaimAmountString
    event.value.insuranceCompanyNote = rowData.insuranceCompanyNote
    
    insuranceCompanyPopoverOpen.value = true
  }

  async function openCreatePatientRecordAndDenyClaimPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.rowData = rowData
    createPatientRecordDenyClaimPopoverOpen.value = true
  }
   
  async function openDenyClaimPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.rowData = rowData
    denyClaimPopoverOpen.value = true
  }

  const expandClaimDetails = () => 
  {
    hospitalAndInsuranceInfo.value = currentTableData.value.reduce((acc: { [x: string]: boolean }, p: { id: string | number }) => (acc[p.id] = true) && acc, {})
  }

  function checkForNewDataAfterEditing()
  {
    if(newTableData != undefined) //Check if newTableData came in while editing
    {

      if(savedEditedRow != undefined) //Combine new table data with the edited row data if it exists
        for(var i=0; i<newTableData.length; i++)
          if(newTableData[i].id.eq(savedEditedRow.id))
          {
            newTableData[i].hospitalIndex = savedEditedRow.hospitalIndex
            newTableData[i].insuranceCompanyIndex = savedEditedRow.insuranceCompanyIndex
            newTableData[i].claimAmount = savedEditedRow.claimAmount
            newTableData[i].ailment = savedEditedRow.ailment
            newTableData[i].note = savedEditedRow.note

            newTableData[i].hospitalName = savedEditedRow.hospitalName
            newTableData[i].hospitalType= savedEditedRow.hospitalType
            newTableData[i].hospitalAddress = savedEditedRow.hospitalAddress
            newTableData[i].hospitalCity = savedEditedRow.hospitalCity
            newTableData[i].hospitalZipCode = savedEditedRow.hospitalZipCode
            newTableData[i].hospitalPhoneNumber = savedEditedRow.hospitalPhoneNumber
            newTableData[i].hospitalLongitude = savedEditedRow.hospitalLongitude
            newTableData[i].hospitalLatitude = savedEditedRow.hospitalLatitude 

            newTableData[i].insuranceCompanyName = savedEditedRow.insuranceCompanyName

            newTableData[i].isRowDataEdited = true
          }
        
      if(unfilteredTableData != undefined)
      {
        unfilteredTableData = newTableData
        currentTableData.value = customClaimQueueFilter(searchInput.value)
      }
      else    
        currentTableData.value = newTableData

      newTableData = undefined
    }
  }

  const onCellEditSave = async (event: { newData:any; index:any } ) => 
  {
    let { newData, index } = event

    //Don't change anything if nothing change
    if(currentTableData.value[index].hospitalIndex ==  newData.hospitalIndex &&
    currentTableData.value[index].insuranceCompanyIndex ==  newData.insuranceCompanyIndex &&
    currentTableData.value[index].claimAmount ==  newData.claimAmount &&
    currentTableData.value[index].ailment ==  newData.ailment &&
    currentTableData.value[index].note ==  newData.note)
    {
      currentTableData.value[index].isEditingRow = false
      isEditing = false
      return
    }

    if(!newData.hospitalIndex)
      newData.hospitalIndex = 0

    if(!newData.insuranceCompanyIndex)
      newData.insuranceCompanyIndex = 0
    
    currentTableData.value[index].hospitalIndex = newData.hospitalIndex
    currentTableData.value[index].insuranceCompanyIndex = newData.insuranceCompanyIndex
    currentTableData.value[index].claimAmount = newData.claimAmount
    currentTableData.value[index].claimAmountString = parseDollarAmountStringFromDecimal(newData.claimAmount)
    currentTableData.value[index].ailment = newData.ailment
    currentTableData.value[index].note = newData.note

    const claim = getClaim(currentTableData.value[index].submitterAddress)

    //Check if data is edited
    if(currentTableData.value[index].hospitalIndex !=  claim.hospitalIndex ||
    currentTableData.value[index].insuranceCompanyIndex !=  claim.insuranceCompanyIndex ||
    currentTableData.value[index].claimAmount !=  convertFromFixed2PointNotationToDecimal(claim.claimAmount) ||
    currentTableData.value[index].ailment !=  claim.ailment ||
    currentTableData.value[index].note !=  claim.note)
    {
      currentTableData.value[index].isRowDataEdited = true
      savedEditedRow = currentTableData.value[index]
    }
    else
    {
      currentTableData.value[index].isRowDataEdited = false

      //Erase saved row if it exists since the row data matches what's on the block chain
      if(savedEditedRow != undefined)
        if(currentTableData.value[index].id.eq(savedEditedRow.id)) //Keeps other rows from erasing the data when you click in them 
          savedEditedRow = undefined
    }

    //Check specifically if hospital index is edited
    if(currentTableData.value[index].hospitalIndex !=  claim.hospitalIndex)
    {
      currentTableData.value[index].isHospitalIndexEdited = true
      savedEditedRow = currentTableData.value[index]
    }
    else
      currentTableData.value[index].isHospitalIndexEdited = false

    //Check specifically if insurance company index is edited
    if(currentTableData.value[index].insuranceCompanyIndex !=  claim.insuranceCompanyIndex)
    {
      currentTableData.value[index].isInsuranceCompanyIndexEdited = true
      savedEditedRow = currentTableData.value[index]
    }
    else
      currentTableData.value[index].isInsuranceCompanyIndexEdited = false

    //Don't update Hospital or Insurance Company with existing values if records have already been created
    if(currentTableData.value[index].isPatientRecordCreated)
    {
      currentTableData.value[index].isEditingRow = false
      isEditing = false
      return
    }
    
    if(newData.hospitalIndex == currentTableData.value[index].nextHospitalIndex)
    {
      currentTableData.value[index].hospitalName = claim.hospitalName
      currentTableData.value[index].hospitalType= claim.hospitalType
      currentTableData.value[index].hospitalAddress = claim.hospitalAddress
      currentTableData.value[index].hospitalCity = claim.hospitalCity
      currentTableData.value[index].hospitalZipCode = claim.hospitalZipCode
      currentTableData.value[index].hospitalPhoneNumber = parsePhoneNumberString(claim.hospitalPhoneNumber)

      currentTableData.value[index].isHospitalReady = false
    }
    else if(newData.hospitalIndex < currentTableData.value[index].nextHospitalIndex)
    {
        const hospital = getHospital(newData.countryIndex, newData.stateIndex, newData.hospitalIndex)
        if(hospital)
        {
          currentTableData.value[index].hospitalName = hospital.hospitalName
          currentTableData.value[index].hospitalType= hospital.hospitalType
          currentTableData.value[index].hospitalAddress = hospital.hospitalAddress
          currentTableData.value[index].hospitalCity = hospital.hospitalCity
          currentTableData.value[index].hospitalZipCode = hospital.hospitalZipCode
          currentTableData.value[index].hospitalPhoneNumber = parsePhoneNumberString(claim.hospitalPhoneNumber)
          currentTableData.value[index].hospitalLongitude = hospital.hospitalLongitude
          currentTableData.value[index].hospitalLatitude = hospital.hospitalLatitude  

          currentTableData.value[index].isHospitalReady = true
        }
        else
          currentTableData.value[index].isHospitalReady = false
    }

    if(newData.insuranceCompanyIndex == claim.insuranceCompanyIndex)
    {
      currentTableData.value[index].insuranceCompanyName = claim.insuranceCompanyName

      //Check if insurance company is ready or not
      const insuranceCompany = getInsuranceCompany(currentTableData.value[index].insuranceCompanyIndex)
      if(insuranceCompany)
        currentTableData.value[index].isInsuranceCompanyReady = true
      else
        currentTableData.value[index].isInsuranceCompanyReady = false
    }
    else
    {
      const insuranceCompany = getInsuranceCompany(currentTableData.value[index].insuranceCompanyIndex)
      if(insuranceCompany)
      {
        currentTableData.value[index].insuranceCompanyName = insuranceCompany.insuranceCompanyName
        currentTableData.value[index].isInsuranceCompanyReady = true
      }
      else
        currentTableData.value[index].isInsuranceCompanyReady = false
    }

    checkForNewDataAfterEditing()
    currentTableData.value[index].isEditingRow = false
    isEditing = false
  }

  const onHospitalRowEditSave = async (event: { newData:any }, rowIndex:any) => 
  {
    let { newData } = event

    currentTableData.value[rowIndex].hospitalName = newData.hospitalName
    currentTableData.value[rowIndex].hospitalType = newData.hospitalType
    currentTableData.value[rowIndex].hospitalTypeName = hospitalTypeOptions[newData.hospitalType].hospitalTypeName
    currentTableData.value[rowIndex].hospitalAddress = newData.hospitalAddress
    currentTableData.value[rowIndex].hospitalCity = newData.hospitalCity
    currentTableData.value[rowIndex].hospitalZipCode = newData.hospitalZipCode
    currentTableData.value[rowIndex].hospitalPhoneNumber = newData.hospitalPhoneNumber
    currentTableData.value[rowIndex].hospitalBillInvoiceNumber = newData.hospitalBillInvoiceNumber

    const claim = getClaim(currentTableData.value[rowIndex].submitterAddress)
    if(currentTableData.value[rowIndex].hospitalName != claim.hospitalName ||
      currentTableData.value[rowIndex].hospitalType != claim.hospitalType ||
      currentTableData.value[rowIndex].hospitalAddress != claim.hospitalAddress ||
      currentTableData.value[rowIndex].hospitalCity != claim.hospitalCity ||
      currentTableData.value[rowIndex].hospitalZipCode != claim.hospitalZipCode ||
      currentTableData.value[rowIndex].hospitalPhoneNumber != parsePhoneNumberString(claim.hospitalPhoneNumber) ||
      currentTableData.value[rowIndex].hospitalLongitude != newData.hospitalLongitude ||
      currentTableData.value[rowIndex].hospitalLatitude != newData.hospitalLatitude ||
      currentTableData.value[rowIndex].hospitalBillInvoiceNumber != claim.hospitalBillInvoiceNumber)
    {
      currentTableData.value[rowIndex].isRowDataEdited = true
      savedEditedRow = currentTableData.value[rowIndex]
    }
    else
    {
      currentTableData.value[rowIndex].isRowDataEdited = false

      //Erase saved row if it exists since the row data matches what's on the block chain
      if(savedEditedRow != undefined)
        if(currentTableData.value[rowIndex].id.eq(savedEditedRow.id)) //Keeps other rows from erasing the data when you click in them 
          savedEditedRow = undefined
    }

    //Check if longitude and latidude are different above first before updating values
    //This is for hospitals not initialized yet, the latitude and longitude will be overwritten below if the hospital exists
    currentTableData.value[rowIndex].hospitalLongitude = newData.hospitalLongitude
    currentTableData.value[rowIndex].hospitalLatitude = newData.hospitalLatitude 

    //This checks for edits when approving a claim with edits and updating a hospital's information at the same time
    //The lat and long only exists on the hospital (not claim), but hospital may not exist before this function is run
    const hospital = getHospital(newData.countryIndex, newData.stateIndex, newData.hospitalIndex)
    if(hospital)
    {
      if(currentTableData.value[rowIndex].hospitalLongitude != hospital.hospitalLongitude ||
        currentTableData.value[rowIndex].hospitalLatitude != hospital.hospitalLatitude)
      {
        currentTableData.value[rowIndex].isRowDataEdited = true
        savedEditedRow = currentTableData.value[rowIndex]
      }
      else
        currentTableData.value[rowIndex].isRowDataEdited = false
    }

    checkForNewDataAfterEditing()
    currentTableData.value[rowIndex].isEditingRow = false
    isEditing = false
  }

  const onInsuranceCompanyRowEditSave = async (event: { newData:any }, rowIndex:any) => 
  {
    let { newData } = event

    currentTableData.value[rowIndex].insuranceCompanyName = newData.insuranceCompanyName

    const claim = getClaim(currentTableData.value[rowIndex].submitterAddress)

    if(currentTableData.value[rowIndex].insuranceCompanyName != claim.insuranceCompanyName)
    {
      currentTableData.value[rowIndex].isRowDataEdited = true
      savedEditedRow = currentTableData.value[rowIndex]
    }
    else
    {
      currentTableData.value[rowIndex].isRowDataEdited = false

      //Erase saved row if it exists since the row data matches what's on the block chain
      if(savedEditedRow != undefined)
        if(currentTableData.value[rowIndex].id.eq(savedEditedRow.id)) //Keeps other rows from erasing the data when you click in them 
          savedEditedRow = undefined
    }

    checkForNewDataAfterEditing()
    currentTableData.value[rowIndex].isEditingRow = false
    isEditing = false
  }

  async function updateClaimQueueSize()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.editClaimQueueSize(claimQueueSizeLimitInput.value).rpc()
      await confirmM4ATransaction(tx, toast, "update_claim_queue_size")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "update_claim_queue_size")
    }
  }

  async function updateClaimHospitalIndex(claimData: any)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.updateClaimHospitalIndex(claimData.submitterAddress, claimData.hospitalIndex).rpc()
      savedEditedRow = undefined
      await confirmM4ATransaction(tx, toast, "update_claim_hospital_index")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "update_claim_hospital_index")
    }
  }

  async function updateClaimInsuranceCompanyIndex(claimData: any)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.updateClaimInsuranceCompanyIndex(claimData.submitterAddress, claimData.insuranceCompanyIndex).rpc()
      savedEditedRow = undefined
      await confirmM4ATransaction(tx, toast, "update_claim_insurance_company_index")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "update_claim_insurance_company_index")
    }
  }

  async function assignClaimToSelf(claimData: any)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.assignClaimToProcessor(claimData.submitterAddress).rpc()
      await confirmM4ATransaction(tx, toast, "assign_claim_to_self")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "assign_claim_to_self")
    }
  }

  async function initState(claimData: any)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.createStateAccount(claimData.submitterAddress, claimData.countryIndex, claimData.stateIndex).rpc()
      await confirmM4ATransaction(tx, toast, "init_state")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "init_state")
    }
  }

  async function initHospital()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.createHospital(
        event.value.rowData.submitterAddress,
        event.value.rowData.countryIndex, 
        event.value.rowData.stateIndex, 
        event.value.rowData.hospitalType,
        event.value.rowData.hospitalLongitude,
        event.value.rowData.hospitalLatitude,
        event.value.rowData.hospitalName,
        event.value.rowData.hospitalAddress,
        event.value.rowData.hospitalCity,
        event.value.rowData.hospitalZipCode,
        new anchor.BN(event.value.rowData.hospitalPhoneNumber.replace(/\D/g, "")),
        hospitalNote.value == "" ? "None" : hospitalNote.value
      ).rpc()

      savedEditedRow = undefined
      hospitalNote.value = ""
      initHospitalPopoverOpen.value = false
      await confirmM4ATransaction(tx, toast, "init_hospital")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "init_hospital")
    }
  }

  async function initInsuranceCompany()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.createInsuranceCompany(
        event.value.rowData.submitterAddress, 
        event.value.rowData.insuranceCompanyIndex, 
        event.value.rowData.insuranceCompanyName,
        insuranceCompanyNote.value == "" ? "None" : insuranceCompanyNote.value
      ).rpc()
      
      savedEditedRow = undefined
      insuranceCompanyNote.value = ""
      initInsuranceCompanyPopoverOpen.value = false
      await confirmM4ATransaction(tx, toast, "init_insurance_company")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "init_insurance_company")
    }
  }

  async function createPatientRecord(claimData: any)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.createPatientRecord(claimData.submitterAddress).rpc()
      await confirmM4ATransaction(tx, toast, "create_patient_record")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "create_patient_record")
    }
  }

  async function createHospitalAndInsuranceCompanyRecords(claimData: any)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.createHospitalAndInsuranceCompanyRecords(claimData.submitterAddress).rpc()
      await confirmM4ATransaction(tx, toast, "create_hospital_and_insurance_company_records")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "create_hospital_and_insurance_company_records")
    }
  }

  async function approveClaim(claimData: any)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.approveClaim(claimData.submitterAddress).rpc()
      await confirmM4ATransaction(tx, toast, "approve_claim")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "approve_claim")
    }
  }

  async function approveClaimWithEdits(claimData: any)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.approveClaimWithEdits(
        claimData.submitterAddress,
        claimData.hospitalType,
        claimData.hospitalLongitude,
        claimData.hospitalLatitude,
        claimData.hospitalName,
        claimData.hospitalAddress,
        claimData.hospitalCity,
        claimData.hospitalZipCode,
        new anchor.BN(claimData.hospitalPhoneNumber.replace(/\D/g, "")),
        claimData.hospitalBillInvoiceNumber,
        claimData.note == "" ? "None" : claimData.note,
        new anchor.BN(claimData.claimAmount * 100), //Convert from decimal to fixed 2 point notation
        claimData.ailment,
        claimData.insuranceCompanyName
      ).rpc()

      savedEditedRow = undefined
      await confirmM4ATransaction(tx, toast, "approve_claim_with_edits")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "approve_claim_with_edits")
    }
  }

  async function unassignClaimFromProcessor(submitterAddress: String)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.unassignClaimFromProcessor(submitterAddress).rpc()
      await confirmM4ATransaction(tx, toast, "unassign_claim_from_processor")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "unassign_claim_from_processor")
    }
  }

  async function reassignClaimToNewProcessor(submitterAddress: String)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.reassignClaimToNewProcessor(submitterAddress).rpc()
      await confirmM4ATransaction(tx, toast, "reassign_claim_to_new_processor")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "reassign_claim_to_new_processor")
    }
  }
  
  async function maxDenyPendingClaim(submitterAddress: String)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.maxDenyPendingClaim(submitterAddress).rpc()
      await confirmM4ATransaction(tx, toast, "max_deny_pending_claim")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "max_deny_pending_claim")
    }
  }

  async function maxDenyInProgressClaim(submitterAddress: String)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.maxDenyInProgressClaim(submitterAddress).rpc()
      await confirmM4ATransaction(tx, toast, "max_deny_in_progress_claim")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "max_deny_in_progress_claim")
    }
  }


  async function createPatientRecordAndDenyClaim()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.createPatientRecordAndDenyClaim(event.value.rowData.submitterAddress, denialReason.value).rpc()
      createPatientRecordDenyClaimPopoverOpen.value = false
      await confirmM4ATransaction(tx, toast, "create_patient_record_and_deny_claim")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "create_patient_record_and_deny_claim")
    }

    denialReason.value = ""
  }

  async function denyClaimWithAllRecords()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.denyClaimWithAllRecords(event.value.rowData.submitterAddress, denialReason.value).rpc()
      denyClaimPopoverOpen.value = false
      await confirmM4ATransaction(tx, toast, "deny_claim_with_all_records")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "deny_claim_with_all_records")
    }

    denialReason.value = ""
  }

  async function dropDenialHammer()
  {
    const chunkSize = 25
    const chunks = chunk(claims.data, chunkSize)

    try
    {
      for(var i=0; i<chunks.length; i++)
      {
        var claimsToDelete = []

        for(var j=0; j<chunks[i].length; j++)
        {
          var claim = 
          {
            pubkey: claims.data[j].pda,
            isSigner: false,
            isWritable: true
          }

          claimsToDelete.push(claim)
        }
    
        const tx = await anchorPrograms.m4a.m4aProgram.methods.dropDenialHammer()
        .accounts({})
        .remainingAccounts(claimsToDelete).rpc()

        await confirmM4ATransaction(tx, toast, "drop_denial_hammer")
      }

    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "drop_denial_hammer")
    }
  }

  async function setClaimQueueFlag(claimQueueEnableFlag: boolean)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.setClaimQueueFlag(claimQueueEnableFlag).rpc()
      await confirmM4ATransaction(tx, toast, "set_claim_queue_flag")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "set_claim_queue_flag")
    }
  }

  const chunk = (arr: any[], size: number) => Array.from
  (
    { length: Math.ceil(arr.length / size) }, (_, i) => 
    arr.slice(i * size, i * size + size)
  )

  var overNoteByteSizeLimit = ref(false)

  const customHospitalNoteFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([hospitalNote.value])
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

  const customInsuranceCompanyNoteFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([insuranceCompanyNote.value])
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

  const customDenialFormatter = (inputLength: number, maxLength: number) => 
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
    min-width: 1576px
  }

  .actionButton
  {
    width: 100px !important;
    height: auto !important
  }

  ion-input, ion-textarea
  {
    --highlight-color: var(--ion-color-gray)
  }
</style>