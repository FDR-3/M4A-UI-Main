<template>
  <h1 >Insurance Companies</h1>

  <div class="tableContainer">
    <DataTable
      ref="tableDownload"
      class="tableMinWidth"
      paginator 
      show-gridlines 
      :rows="20" 
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
            <ion-button color="dark" class="tableToggleSelect" :disabled="true">Toggle Insurance Company Table</ion-button>
            <ion-button color="dark" @click="$emit('toggleProcessedClaimsTable')">Toggle Processed Claims Table</ion-button>
          </div>
          <ion-input
            color="dark"
            v-model="searchInput"
            fill="outline"
            label-placement="stacked"
            placeholder="Insurance Company Search     "
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

      <Column field="insuranceCompanyIndex" header="Insurance Index" style="width: 0%" sortable></Column>
      <Column field="insuranceCompanyName" header="Insurance Company Name" style="width: 10%" sortable>
        <template #body="slotProps" >
          <div>
            <span class="tableButtonEmoji" >
              {{ "💩" }}
            </span>
            <ion-label color="dark">
              {{ slotProps.data.insuranceCompanyName }}
            </ion-label>
          </div>
        </template>
        <template #editor="{ index, data, field }">
          <InputText
            v-model="data[field]"
            fluid
            @input="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="!data.isInsuranceCompanyReady ||
            connectedWallet.addressString!=adminAccounts.m4aCEOAddress ||
            (isDataEdited && !currentTableData[index].isEditingRow && !currentTableData[index].isRowDataEdited)"
          />
        </template>
      </Column>
      <Column field="approvedClaimAmount" header="Total Claims Against" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.approvedClaimAmountString }}
        </template>
      </Column>
      <Column field="note" header="Insurance Company Note" style="width: 0%" sortable>
        <template #editor="{ index, data, field }">
          <InputText 
            v-model="data[field]"
            fluid
            @input="isEditing=true; currentTableData[index].isEditingRow=true"
            :disabled="!data.isInsuranceCompanyReady ||
            connectedWallet.addressString!=adminAccounts.m4aCEOAddress ||
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
            :disabled="!data.isInsuranceCompanyReady ||
            connectedWallet.addressString!=adminAccounts.m4aCEOAddress ||
            (isDataEdited && !currentTableData[index].isEditingRow && !currentTableData[index].isRowDataEdited)"
          />
        </template>
      </Column>
      <Column v-if="connectedWallet.addressString==adminAccounts.m4aCEOAddress" field="actions" header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <ion-label v-if="!slotProps.data.isInsuranceCompanyReady">Insurance Company<br>Not Initialized</ion-label>
            <ion-label v-else-if="slotProps.data.isEditingRow" color="yellow">
              Table Updates Paused While Editing
            </ion-label>
            <ion-label v-else-if="isDataEdited && !slotProps.data.isRowDataEdited && !slotProps.data.isEditingRow">
              You can only edit one row at a time
            </ion-label>
            <ion-label v-else-if="!slotProps.data.isRowDataEdited">No Edits Detected</ion-label>
            <ion-button v-if="slotProps.data.isRowDataEdited" class="actionButton" color="dark" @click="updateInsuranceCompany(slotProps.data, slotProps.index)">
              <div>Update<span style="font-size: 27px">💩</span></div>
            </ion-button>
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
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { confirmM4ATransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { getInsuranceCompany } from '/src/assets/contracts/Solana/M4AProtocol.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

  defineEmits(['toggleProcessorsTable', 'toggleClaimQueueTable', 'toggleHospitalTable', 'toggleProcessedClaimsTable'])

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

  //Keeps cell edits from fucking up the table after it's sorted
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
      currentTableData.value = customInsuranceCompanyFilter(searchInput.value)
    }
  }

  function customInsuranceCompanyFilter(filterString: string)
  {
    var filteredTable: any = []

    for(var i=0; i<unfilteredTableData.length; i++)
    {
      if(unfilteredTableData[i].insuranceCompanyIndex.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].insuranceCompanyName.toString().toLowerCase().includes(filterString.toLowerCase()))
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
        currentTableData.value = customInsuranceCompanyFilter(searchInput.value)
      }
      else
      {
        unfilteredTableData = props.tableData
        currentTableData.value = customInsuranceCompanyFilter(searchInput.value)
      }
    }
    else if(savedEditedRow != undefined)//Combine saved row data with new table data
    {
      var tempTable = props.tableData

      for(var i=0; i<tempTable.length; i++)
        if(tempTable[i].id == savedEditedRow.id)
        {
          tempTable[i].isActive = savedEditedRow.isActive
          tempTable[i].insuranceCompanyName = savedEditedRow.insuranceCompanyName
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
            newTableData[i].insuranceCompanyName = savedEditedRow.insuranceCompanyName
            newTableData[i].note = savedEditedRow.note
            newTableData[i].isRowDataEdited = true
            newTableData[i].isEditingRow = false
          }
        
      if(unfilteredTableData != undefined)
      {
        unfilteredTableData = newTableData
        currentTableData.value = customInsuranceCompanyFilter(searchInput.value)
      }
      else    
        currentTableData.value = newTableData

      newTableData = undefined
    }
  }

  const onCellEditSave = async (event: { newData:any; index:any } ) => 
  {
    let { newData, index } = event

    if(!currentTableData.value[index].isInsuranceCompanyReady)
      return

    if(typeof(newData.isActive) === "string")
      newData.isActive = newData.isActive.toLowerCase() == "true" ? true : false
    currentTableData.value[index].isActive = newData.isActive
    currentTableData.value[index].insuranceCompanyName = newData.insuranceCompanyName
    currentTableData.value[index].note = newData.note

    const insuranceCompany = getInsuranceCompany(currentTableData.value[index].insuranceCompanyIndex)

    if(newData.isActive != insuranceCompany.isActive ||
    newData.note != insuranceCompany.note || 
    newData.insuranceCompanyName != insuranceCompany.insuranceCompanyName)
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
        if(currentTableData.value[index].insuranceCompanyIndex == savedEditedRow.insuranceCompanyIndex) //Keeps other rows from erasing the data when you click in them
        { 
          savedEditedRow = undefined
          isDataEdited.value = false
        }
    }

    checkForNewDataAfterEditing()
    currentTableData.value[index].isEditingRow = false
    isEditing = false
  }
  
  async function updateInsuranceCompany(rowData: any, index: any)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.editInsuranceCompany
      (
        rowData.insuranceCompanyIndex,
        rowData.isActive,
        rowData.insuranceCompanyName, 
        rowData.note
      ).rpc()

      await confirmM4ATransaction(tx, toast, "update_insurance_company")
      currentTableData.value[index].isRowDataEdited = false
      currentTableData.value[index].isEditingRow = false
      isDataEdited.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "update_insurance_company")
    }
  }
</script>
  
<style scoped>
  .tableMinWidth
  {
    min-width: 914px
  }

  .actionButton
  {
    width: 100px !important;
    height: 50px !important
  }
</style>