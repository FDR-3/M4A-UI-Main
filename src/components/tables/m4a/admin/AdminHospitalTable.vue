<template>
  <h1 >Hospitals</h1>

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
            <ion-button color="dark" class="tableToggleSelect" :disabled="true">Toggle Hospital Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleInsuranceCompanyTable')">Toggle Insurance Company Table</ion-button>  
            <ion-button color="dark" @click="$emit('toggleProcessedClaimsTable')">Toggle Processed Claims Table</ion-button>
          </div>
          <ion-input
            color="dark"
            v-model="searchInput"
            fill="outline"
            label-placement="stacked"
            placeholder="Hospital Search      "
            @input="filterTable()"
          >
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
      <Column field="hospitalLatitude" header="Latitude" style="width: 0%" sortable>
        <template #editor="{ index, data, field }">
          <InputNumber
            v-model="data[field]"
            :maxFractionDigits="6"
            fluid
            @input="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="connectedWallet.addressString!=adminAccounts.m4aCEOAddress ||
            (isDataEdited && !currentTableData[index].isEditingRow && !currentTableData[index].isRowDataEdited)"
          />
        </template>
      </Column>
      <Column field="hospitalLongitude" header="Longitude" style="width: 0%" sortable>
        <template #editor="{ index, data, field }">
          <InputNumber
            v-model="data[field]"
            :maxFractionDigits="6"
            fluid
            @input="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="connectedWallet.addressString!=adminAccounts.m4aCEOAddress ||
            (isDataEdited && !currentTableData[index].isEditingRow && !currentTableData[index].isRowDataEdited)"
          />
        </template>
      </Column>
      <Column field="hospitalType" header="Type" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.hospitalTypeName }}
        </template>
        <template #editor="{ index, data, field }">
          <InputNumber
            v-model="data[field]"
            :min=0
            :step=1
            fluid
            @input="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="connectedWallet.addressString!=adminAccounts.m4aCEOAddress ||
            (isDataEdited && !currentTableData[index].isEditingRow && !currentTableData[index].isRowDataEdited)"
          />
        </template>
      </Column>
      <Column field="hospitalName" header="Hospital Name" style="width: 5%">
        <template #body="slotProps">
          <div class="adminHospitalTableLabel">
            <div  style="min-width: 40px; max-width: 40px">
              <img v-if="slotProps.data.hospitalType == HospitalTypes.General" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazN1BiMybI527AkmeVxopsR6nYgKDZFazU8GXHu"/>
              <img v-else-if="slotProps.data.hospitalType == HospitalTypes.Dental" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNWtAaGHwuNPjCJgbOYz4DrkMvpEVGBFh1X6s5"/>
              <img v-else-if="slotProps.data.hospitalType == HospitalTypes.Vision" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNrYFyAr2cvyILZuPHpomK5CU6N2bAltaz03cT"/>
              <img v-else-if="slotProps.data.hospitalType == HospitalTypes.Mental" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNCnJgmUjrdlPMfOjk8zL1aoRbyDWUGc9mQ0ew"/>
            </div>
            <ion-label class="hospitalButtonLabel" color="dark">{{ slotProps.data.hospitalName }}</ion-label>
          </div>
        </template>
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
      <Column field="hospitalAddress" header="Address" style="width: 5%" sortable>
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
      <Column field="hospitalPhoneNumber" header="Phone Number" style="width: 7%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.hospitalPhoneNumber }}
        </template>
        <template #editor="{ index, data, field }">
          <InputMask
            v-model="data[field]"
            mask="(999) 999-9999"
            fluid
            @keypress="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="connectedWallet.addressString!=adminAccounts.m4aCEOAddress ||
            (isDataEdited && !currentTableData[index].isEditingRow && !currentTableData[index].isRowDataEdited)"
          />
        </template>
      </Column>
      <Column field="hospitalCity" header="City" style="width: 0%" sortable>
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
      <Column field="hospitalStateName" header="State" style="width: 0%" sortable></Column>
      <Column field="hospitalZipCode" header="Zip Code" style="width: 0%" sortable>
        <template #editor="{ index, data, field }">
          <InputMask
            v-model="data[field]"
            mask="99999"
            fluid
            @keypress="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="connectedWallet.addressString!=adminAccounts.m4aCEOAddress ||
            (isDataEdited && !currentTableData[index].isEditingRow && !currentTableData[index].isRowDataEdited)"
          />
        </template>
      </Column>
      <Column field="approvedClaimAmount" header="Approved Claim Total" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.approvedClaimAmountString }}
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
      <Column field="isActive" header="Active" style="width: 0%" sortable>
        <template #body="slotProps">
          <div v-if="slotProps.data.isActive">
            <ion-text color="green">True</ion-text>
          </div>
          <div v-else>
            <ion-text color="red">False</ion-text>
          </div>
        </template>
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
            <ion-label v-if="isDataEdited && !slotProps.data.isRowDataEdited && !slotProps.data.isEditingRow">
              You can only edit one row at a time
            </ion-label>
            <ion-label v-else-if="!slotProps.data.isRowDataEdited">No Edits Detected</ion-label>
            <ion-label v-else-if="slotProps.data.hospitalType > HospitalTypes.Mental">
              Hospital Type Must Be Within {{ HospitalTypes.General }} and {{ HospitalTypes.Mental }}
            </ion-label>
            <ion-button v-else-if="slotProps.data.isRowDataEdited" class="actionButton" color="dark" @click="updateHospital(slotProps.data)">Update Hospital</ion-button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, watch, onMounted, inject } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonInput, IonText } from '@ionic/vue'
  import { search, download } from 'ionicons/icons'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import InputText from 'primevue/inputtext'
  import InputMask from 'primevue/inputmask'
  import InputNumber from 'primevue/inputnumber'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { getHospital } from '/src/assets/contracts/Solana/M4AProtocol.vue'
  import { HospitalTypes } from '/src/types/HospitalTypes.ts'
  import { parsePhoneNumberString, confirmM4ATransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import * as anchor from "@coral-xyz/anchor"
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

  defineEmits(['toggleProcessorsTable', 'toggleClaimQueueTable', 'toggleInsuranceCompanyTable', 'toggleProcessedClaimsTable'])

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

  //Keeps editing from fucking up the table after it's sorted or filtered
  function onValueChange(value: any) 
  {
    if(sorting)
    {
      currentTableData.value = value
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
      currentTableData.value = customHospitalFilter(searchInput.value)
    }
  }

  function customHospitalFilter(filterString: string)
  {
    var filteredTable: any = []

    for(var i=0; i<unfilteredTableData.length; i++)
    {
      if(unfilteredTableData[i].hospitalIndex.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalLongitude.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalLatitude.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalType.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalTypeName.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalName.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].countryIndex.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].stateIndex.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalCountryName.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalStateName.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalCity.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalAddress.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalPhoneNumber.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].hospitalZipCode.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].approvedClaimAmountString.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].note.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].isActive.toString().toLowerCase().includes(filterString.toLowerCase()))
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
          if(tempTable[i].id == savedEditedRow.id)
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
        currentTableData.value = customHospitalFilter(searchInput.value)
      }
      else
      {
        unfilteredTableData = props.tableData
        currentTableData.value = customHospitalFilter(searchInput.value)
      }
    }
    else if(savedEditedRow != undefined)//Combine saved row data with new table data
    {
      var tempTable = props.tableData

      for(var i=0; i<tempTable.length; i++)
        if(tempTable[i].id == savedEditedRow.id)
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

      currentTableData.value = tempTable
    }
    else //Update current table like normal
      currentTableData.value = props.tableData
  })

  function exportCSV(e: Event) 
  {
    tableDownload.value.exportCSV()
  }

  function checkForNewDataAfterEditing()
  {
    if(newTableData != undefined) //Check if newTableData came in while editing
    {
      if(savedEditedRow != undefined) //Combine new table data with the edited row data if it exists
        for(var i=0; i<newTableData.length; i++)
          if(newTableData[i].id == savedEditedRow.id)
          {
            newTableData[i].isActive = savedEditedRow.isActive
            newTableData[i].hospitalLongitude = savedEditedRow.hospitalLongitude
            newTableData[i].hospitalLatitude = savedEditedRow.hospitalLatitude
            newTableData[i].hospitalType = savedEditedRow.hospitalType
            newTableData[i].hospitalTypeName = savedEditedRow.hospitalTypeName
            newTableData[i].hospitalName = savedEditedRow.hospitalName
            newTableData[i].hospitalAddress = savedEditedRow.hospitalAddress
            newTableData[i].hospitalCity = savedEditedRow.hospitalCity
            newTableData[i].hospitalZipCode = savedEditedRow.hospitalZipCode
            newTableData[i].hospitalPhoneNumber = savedEditedRow.hospitalPhoneNumber
            newTableData[i].note = savedEditedRow.note
            newTableData[i].isRowDataEdited = true
            newTableData[i].isEditingRow = false
          }
       
      if(unfilteredTableData != undefined)
      {
        unfilteredTableData = newTableData
        currentTableData.value = customHospitalFilter(searchInput.value)
      }
      else    
        currentTableData.value = newTableData

      newTableData = undefined
    }
  }

  const onCellEditSave = async (event: { newData:any; index:any } ) => 
  {
    let { newData, index } = event

    //newData.hospitalPhoneNumber = newData.hospitalPhoneNumber.replace(/\D/, "")//Regex to replace everything not a number
    if(typeof(newData.isActive) === "string")
      newData.isActive = newData.isActive.toLowerCase() == "true" ? true : false

    currentTableData.value[index].isActive = newData.isActive
    currentTableData.value[index].hospitalLongitude = newData.hospitalLongitude
    currentTableData.value[index].hospitalLatitude = newData.hospitalLatitude
    currentTableData.value[index].hospitalType = newData.hospitalType

    //Set hospital type name
    if(newData.hospitalType == HospitalTypes.General)
      currentTableData.value[index].hospitalTypeName = "General"
    else if(newData.hospitalType == HospitalTypes.Dental)
      currentTableData.value[index].hospitalTypeName = "Dental"
    else if(newData.hospitalType == HospitalTypes.Vision)
      currentTableData.value[index].hospitalTypeName = "Vision"
    else if(newData.hospitalType == HospitalTypes.Mental)
      currentTableData.value[index].hospitalTypeName = "Mental"

    currentTableData.value[index].hospitalName = newData.hospitalName
    currentTableData.value[index].hospitalAddress = newData.hospitalAddress
    currentTableData.value[index].hospitalCity = newData.hospitalCity
    currentTableData.value[index].hospitalZipCode = newData.hospitalZipCode
    currentTableData.value[index].hospitalPhoneNumber = newData.hospitalPhoneNumber
    currentTableData.value[index].note = newData.note

    const hospital = getHospital(newData.countryIndex, newData.stateIndex, newData.hospitalIndex)
    
    if(newData.isActive != hospital.isActive ||
    newData.hospitalLongitude != hospital.hospitalLongitude ||
    newData.hospitalLatitude != hospital.hospitalLatitude ||
    newData.hospitalType != hospital.hospitalType ||
    newData.hospitalName != hospital.hospitalName ||
    newData.hospitalAddress != hospital.hospitalAddress ||
    newData.hospitalCity != hospital.hospitalCity ||
    newData.hospitalZipCode != hospital.hospitalZipCode ||
    newData.hospitalPhoneNumber != hospital.hospitalPhoneNumber ||
    newData.note != hospital.note)
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
        if(currentTableData.value[index].id == savedEditedRow.id) //Keeps other rows from erasing the data when you click in them
        { 
          savedEditedRow = undefined
          isDataEdited.value = false
        }
    }
    
    checkForNewDataAfterEditing()
    currentTableData.value[index].isEditingRow = false
    isEditing = false
  }
  
  async function updateHospital(rowData: any)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.editHospital
      (
        rowData.countryIndex,
        rowData.stateIndex,
        rowData.hospitalIndex,
        rowData.isActive,
        rowData.hospitalType,
        rowData.hospitalLongitude,
        rowData.hospitalLatitude,
        rowData.hospitalName,
        rowData.hospitalAddress,
        rowData.hospitalCity,
        rowData.hospitalZipCode,
        new anchor.BN(rowData.hospitalPhoneNumber.replace(/\D/g, "")),
        rowData.note
      ).rpc()

      savedEditedRow = undefined
      isDataEdited.value = false
      await confirmM4ATransaction(tx, toast, "update_hospital")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "update_hospital")
    }
  }
</script>
  
<style scoped>
  .adminHospitalTableLabel
  {
    display: flex;
    flex-direction: row;
    align-items: center
  }

  .tableMinWidth
  {
    min-width: 1695px
  }

  .actionButton
  {
    width: 100px !important;
    height: 50px !important
  }
</style>