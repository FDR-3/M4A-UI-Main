<template>
  <div class="tableContainer">
    <!--Table of SubMarket Owners-->
    <DataTable
      v-if="!showOwnerSubMarkets"
      id="submarketOwnersTable"
      class="tableMinWidth"
      v-model:filters="filters" 
      paginator 
      show-gridlines 
      :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      size="small" 
      :value="ownerTableData"
      :loading="isLoading"
      :globalFilterFields="['owner', 'ownerData.displayName', 'ownerData.ceoName', 'ownerData.subMarketCount']"  
    >
      <template #header>
        <div>
          <h2>SubMarket Owner Count: {{ subMarkets.ownerCount }}</h2>
          <ion-input v-model="filters['global'].value" fill="outline" placeholder="Owners Search     ">
            <ion-icon class="tableSearchIcon" slot="start" :icon="search"></ion-icon>
          </ion-input>
          <br>
        </div>
      </template>
      <template #loading>Loading Owners. Please wait.</template>
      <Column field="owner" header="Owner" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="openOwnerPopover($event, slotProps.data)">

              <div v-if=" slotProps.data.owner==adminAccounts.lendingCEOAddressString">
                <RIPStarWolf v-if="adminAccounts.ceoIsDead" class="starWolfButton" :fill="colorHexValue"/>
                <StarWolf v-else class="starWolfButton" :fill="colorHexValue"/>
              </div>
              <StarWolf v-else class="starWolfButton" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>

              <ion-label v-if=" slotProps.data.owner==adminAccounts.lendingCEOAddressString" color="green">
                fdr-3
              </ion-label>
              <ion-label v-else=" slotProps.data.owner==adminAccounts.lendingCEOAddressString" color="dark">
                {{ slotProps.data.ownerData.displayName }}
              </ion-label>

            </ion-button>
            <ion-popover 
            :is-open="ownerPopoverOpen" 
            :event="event" 
            @didDismiss="ownerPopoverOpen=false"
            side="top" 
            alignment="center"
            >
              <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyAddress()" @mouseleave="closeOwnerPopover($event)">
                <ion-label color="light">{{ copyFullAddressButtonText }}</ion-label>
              </ion-button>
            </ion-popover>

          </div>
        </template>
      </Column>
      <Column field="ownerData.subMarketCount" header="SubMarket Count" style="width: 0%" sortable></Column>
      <Column header="Actions" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <ion-button id=""
            color="dark"
            @click="selectedOwnerAddress=slotProps.data.owner; openOwnerSubMarkets()"
            >
              View Markets
            </ion-button>
          </div>
        </template>
      </Column>
    </DataTable>

    <!--SubMarkets for a Specific Owner-->
    <DataTable
      v-if="showOwnerSubMarkets"
      ref="tableRef"
      id="submarketOwnersInnerTable"
      class="tableMinWidth"
      v-model:filters="filters" 
      paginator 
      show-gridlines 
      :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      size="small" 
      :value="ownerSubMarketTableData"
      :loading="isLoading"
      editMode="cell" 
      @cell-edit-complete="onCellEditSave($event)"
      @sort="sorting=true"
      @value-change="onValueChange($event)"
    >
      <template #header>
        <div>
          <h2>{{ subMarketsOwnedByUser }} SubMarket{{ subMarketsSText }} Owned By:<br>{{ subMarketOwnerDisplayName }}</h2>

          <ion-button color="dark" class="mediumSmallMarginBottom nSmallMarginTop" @click="closeOwnerSubMarkets()">Return</ion-button>
          <ion-input
            color="dark"
            v-model="searchInput"
            fill="outline"

            placeholder="Owners Search     "
            @input="filterTable()"
          >
            <ion-icon class="tableSearchIcon" slot="start" :icon="search"></ion-icon>
          </ion-input>
          <br>
        </div>
      </template>
      <template #loading>Loading Owners. Please wait.</template>
      <Column field="id" header="Id" style="width: 0%" sortable></Column>
      <Column field="tokenName" header="Token" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button style="margin-left: -11px; margin-right: -11px" fill="clear" @click="openTokenPopover($event, slotProps.data)">
              <img v-if="slotProps.data.tokenMintAddress==tokenAddressStringsMainNet.solTokenMintAddress"  style="width: 40px; height: 32px; margin-left: -8px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
              <component v-else :is="slotProps.data.tokenSVG" style="width: 24px; margin-right: 5px"></component>
              <ion-label color="dark">{{ slotProps.data.tokenName }}</ion-label>
            </ion-button>
            <ion-popover 
            :is-open="tokenPopoverOpen" 
            :event="event" 
            @didDismiss="tokenPopoverOpen=false"
            side="top" 
            alignment="center"
            >
              <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyTokenMintAddress()" @mouseleave="closeTokenPopover($event)">
                <ion-label color="light">{{ copyTokenMintAddressButtonText }}</ion-label>
              </ion-button>
            </ion-popover>
          </div>
        </template>
      </Column>
      <Column field="feesGeneratedAmount" header="Fees Generated" style="width: 0%" sortable></Column>
      <Column field="uncollectedFeesAmount" header="Uncollected Fees" style="width: 0%" sortable></Column>
      <Column field="feeCollectorAddress" header="Fee Collector Address" style="width: 0%" sortable>
        <template #editor="{ index, data, field }">
          <InputText
            v-model="data[field]"
            class="feeRecipientInput"
            fluid
            @input="isEditing=true; ownerSubMarketTableData[index].isEditingRow=true; checkAddress(data[field])"
            :disabled="connectedWallet.addressString!=ownerSubMarketTableData[index].owner ||
            (isDataEdited && !ownerSubMarketTableData[index].isEditingRow && !ownerSubMarketTableData[index].isRowDataEdited)"
          />
        </template>
      </Column>
      <Column field="feeOnInterestEarnedRate" header="Fee On Interest Earned Rate" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-text>{{ slotProps.data.feeOnInterestEarnedRate.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}%</ion-text>
        </template>
        <template #editor="{ index, data, field }">
          <InputNumber
          v-model="data[field]"
          :ref="($el: any) => setInputRef($el, data)"
          class="ownerFeeInput"
          suffix="%"
          inputId="percent"
          :minFractionDigits="2" :maxFractionDigits="2"
          :min="0" :max="100"
          :step="0.01"
          showButtons
          fluid
          @focus="moveCursorInFrontPercentSign(data)"
          @input="isEditing=true; ownerSubMarketTableData[index].isEditingRow=true; fixCursorPosition(data)"
          :disabled="connectedWallet.addressString!=ownerSubMarketTableData[index].owner ||
          (isDataEdited && !ownerSubMarketTableData[index].isEditingRow && !ownerSubMarketTableData[index].isRowDataEdited)"/>
        </template>
      </Column>

      <Column field="actions" header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <div v-if="connectedWallet.addressString==slotProps.data.owner">
              <ion-label v-if="slotProps.data.isEditingRow" color="yellow">
                Updates Paused
              </ion-label>
              <ion-label v-else-if="isDataEdited && !slotProps.data.isRowDataEdited && !slotProps.data.isEditingRow">
                Editing Another Row
              </ion-label>
              <ion-label v-else-if="!slotProps.data.isRowDataEdited">No Edits Detected</ion-label>
              <ion-button
              v-if="slotProps.data.isRowDataEdited"
              color="dark"
              @click="editSubMarket(slotProps.data, slotProps.index)"
              :disabled="isInvalidPublicKey"
              >
                Edit Market
              </ion-button>
            </div>
            <ion-text v-else align="center">Owner Not Detected</ion-text>

            <ion-button
            v-if="connectedWallet.addressString==slotProps.data.feeCollectorAddress && !isDataEdited"
            color="dark"
            @click="openCollectFeesPopover($event, slotProps.data)"
            >
              Collect Fees
            </ion-button>
            <ion-popover 
            :is-open="collectFeesPopoverOpen" 
            :event="event" 
            @didDismiss="collectFeesPopoverOpen=false"
            side="top" 
            alignment="center"
            >
              <div style="margin: 5px" class="flexCenterColumn">
                <div>
                  <div>
                    <ion-text v-if="accountList==undefined">Create Accounts While Depositing</ion-text>
                  </div>
                  <Select
                  id="accountSelect"
                  class="standardFontSize mediumMarginTop"
                  style="margin-bottom: 40px"
                  v-model="accountSelect" 
                  :options="accountList" 
                  optionLabel="accountName" 
                  optionValue="userAccountIndex" 
                  placeholder="No Accounts"
                  appendTo="self">
                  </Select>
                </div>
                <ion-button
                class="copyAddressButton"
                color="dark"
                :disabled="accountSelect==undefined"
                @click="claimSubMarketFees()">
                  Collect Fees
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
  import { ref, onMounted, watch, inject, computed } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonText, IonPopover } from '@ionic/vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Select from 'primevue/select'
  import { FilterMatchMode } from '@primevue/core/api'
  import InputText from 'primevue/inputtext'
  import InputNumber from 'primevue/inputnumber'
  import { search } from 'ionicons/icons'
  import { tokenReserveDevNetMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarkets, subMarketsHashMap, subMarketOwnerHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import RIPStarWolf from '/src/assets/svg/rip-star-wolf-svg.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { isValidSolanaPublicKey,
    copyFullAddress,
    copyTokenMintAddress,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { lendingUserAccountsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenAddressStringsMainNet } from '/src/assets/constants/Addresses.ts'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'

  const emits = defineEmits(['updateOwnerTableSizing'])

  var toast = inject('toast')
  var colorHexValue = inject('colorHexValue') as string

  var ownerTableData = ref()
  var ownerSubMarketTableData = ref()
  var tableRef = ref()
  var newTableData: any
  var isLoading = ref(true)
  var showOwnerSubMarkets = ref(false)
  var subMarketsOwnedByUser = ref()
  var subMarketOwnerDisplayName = ref()

  var ownerPopoverOpen = ref(false)
  var collectFeesPopoverOpen = ref(false)
  var event = ref()

  var accountSelect = ref()
  var accountList = ref()

  var selectedOwnerAddress: PublicKey
  var publicKeyCheckColor = ref("#6fff7b")
  var isInvalidPublicKey = ref(false)
  var savedEditedRow: any 
  var isEditing = false
  var isDataEdited = ref(false)
  var copyFullAddressButtonText = ref("Copy Full Address")

  var tokenPopoverOpen = ref(false)
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")

  var inputFeeRefs = ref(new Map())

  var searchInput = ref("")

  var unfilteredTableData: any
  var sorting = false

  const subMarketsSText = computed(() =>
  {
    if(subMarketsOwnedByUser.value == 1)
      return ''
    else
      return 's'
  })
  
  onMounted(() =>
  {
    ownerTableData.value = []

    if(subMarketOwnerHashMap.map)
    {
      processOwnersTable()
      emitReserveTableSizing()
      
      isLoading.value = false
    }
    else if(subMarkets.data)
      isLoading.value = false
    else
      isLoading.value = true
  })

  watch(subMarketOwnerHashMap, () => 
  {
    processOwnersTable()

    if(isLoading.value)
      isLoading.value = false

    //Update inner table if it's already opened
    if(showOwnerSubMarkets.value)
      processNewSubMarketData()

    emitReserveTableSizing()
  })

  watch(customUserNameHashMap, () =>
  {
    processOwnersTable()
  })

  //Keeps editing from fucking up the table after it's sorted or filtered
  function onValueChange(value: any) 
  {
    if(sorting)
    {
      ownerSubMarketTableData.value = value
      sorting = false
    }
  }

  //Custom table filtering to be able to edit cells after filtering
  function filterTable()
  {
    if(unfilteredTableData == undefined)
      unfilteredTableData = ownerSubMarketTableData.value

    if(searchInput.value == "")
    {
      ownerSubMarketTableData.value = unfilteredTableData
      unfilteredTableData == undefined
    }
    else
    {
      ownerSubMarketTableData.value = customFilter(searchInput.value)
    }
  }

  function customFilter(filterString: string)
  {
    var filteredTable: any = []
    console.log(filterString)
    for(var i=0; i<unfilteredTableData.length; i++)
    {
      if(unfilteredTableData[i].id.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].tokenMintAddress.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].tokenName.toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].feeCollectorAddress.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].feeOnInterestEarnedRate.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
    }

    return filteredTable
  }

  function openOwnerSubMarkets()
  {
    var subMarketOwner = subMarketOwnerHashMap.map.get(selectedOwnerAddress)
    subMarketOwner.ownerSubMarketList = subMarketOwner.ownerSubMarketList.sort((a: any, b: any) => a.id - b.id)

    ownerSubMarketTableData.value = subMarketOwner.ownerSubMarketList
    subMarketsOwnedByUser.value = subMarketOwner.subMarketCount
    subMarketOwnerDisplayName.value = subMarketOwner.displayName

    showOwnerSubMarkets.value = true

    emitReserveTableSizing()
  }

  function closeOwnerSubMarkets()
  {
    showOwnerSubMarkets.value = false
    emitReserveTableSizing()
  }

  function openCollectFeesPopover(e: Event, rowData: any) 
  {
    if(lendingUserAccountsHashMap.map)
    {
      const userAccountList = lendingUserAccountsHashMap.map.get(connectedWallet.addressString)
      console.log(userAccountList)
      if(userAccountList)
      {
        accountList.value = userAccountList
        accountSelect.value = 0
      }
      else
      {
        accountList.value = undefined
        accountSelect.value = undefined
      }
    }

    event.value = e
    event.value.tokenMintAddress = rowData.tokenMintAddress
    event.value.owner = rowData.owner
    event.value.subMarketIndex = rowData.subMarketIndex
    
    collectFeesPopoverOpen.value = true
  }

  function emitReserveTableSizing()
  {
    if(!subMarketsOwnedByUser.value)
      subMarketsOwnedByUser.value = 0

    emits('updateOwnerTableSizing', ownerTableData.value.length, subMarketsOwnedByUser.value, showOwnerSubMarkets.value)
  }

  function passByRefWrapperCopyAddress()
  {
    copyFullAddress(copyFullAddressButtonText, event.value.ownerAddress)
  }

  function openTokenPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.tokenMintAddress = rowData.tokenMintAddress

    tokenPopoverOpen.value = true
  }

  function closeTokenPopover(e: Event) 
  {
    event.value = e
    tokenPopoverOpen.value = false
  }

  function passByRefWrapperCopyTokenMintAddress()
  {
    copyTokenMintAddress(copyTokenMintAddressButtonText, event.value.tokenMintAddress)
  }

  function processOwnersTable()
  {
    if(!subMarketOwnerHashMap.map)
      return
    
    const unprocessedData = Array.from(subMarketOwnerHashMap.map, ([owner, ownerData]) => ({ owner, ownerData }))
    
    if(!unprocessedData || unprocessedData.length == 0)
      return

    for(var i=0; i<unprocessedData.length; i++)
    {
      unprocessedData[i].ownerData.displayName = getCustomOrTrimmedUserDisplayName(unprocessedData[i].owner)

      if(unprocessedData[i].owner.toString() == adminAccounts.lendingCEOAddressString)
        unprocessedData[i].ownerData.ceoName = "fdr-3"
      else
        unprocessedData[i].ownerData.ceoName = ""

      //This has to be done here as opposed to in the LendingProtocol.vue file since it has to be after it's deep cloned
      for(var j=0; j<unprocessedData[i].ownerData.ownerSubMarketList.length; j++)
      {
        const tokenReserveFrontEndProperties = tokenReserveDevNetMap.get(unprocessedData[i].ownerData.ownerSubMarketList[j].tokenMintAddress.toString())
        unprocessedData[i].ownerData.ownerSubMarketList[j].tokenSVG = tokenReserveFrontEndProperties.svg
      }

    }

    ownerTableData.value = unprocessedData
  }

  function processNewSubMarketData()
  {
    var subMarketOwner = subMarketOwnerHashMap.map.get(selectedOwnerAddress)
    const newData =  subMarketOwner.ownerSubMarketList.sort((a: any, b: any) => a.id - b.id)

    if(isEditing)//Save new table data until after Processor is done typing
      newTableData = newData
    else if(unfilteredTableData != undefined) //Set new data into the unfiltered table if currently filtering table
    {
      if(savedEditedRow != undefined)//Combine saved row data with new table data
      {
        var tempTable = newData

        for(var i=0; i<tempTable.length; i++)
          if(tempTable[i].id == savedEditedRow.id)
          {
            tempTable[i].feeCollectorAddress = savedEditedRow.feeCollectorAddress
            tempTable[i].feeOnInterestEarnedRate = savedEditedRow.feeOnInterestEarnedRate
            tempTable[i].isRowDataEdited = true
          }

        unfilteredTableData = tempTable
        ownerSubMarketTableData.value = customFilter(searchInput.value)
      }
      else
      {
        unfilteredTableData = newData
        ownerSubMarketTableData.value = customFilter(searchInput.value)
      }
    }
    else if(savedEditedRow != undefined)//Combine saved row data with new table data
    {
      var tempTable = newData

      for(var i=0; i<tempTable.length; i++)
        if(tempTable[i].id == savedEditedRow.id)
        {
          tempTable[i].feeCollectorAddress = savedEditedRow.feeCollectorAddress
          tempTable[i].feeOnInterestEarnedRate = savedEditedRow.feeOnInterestEarnedRate
          tempTable[i].isRowDataEdited = true
        }

      ownerSubMarketTableData.value = tempTable
    }
    else //Update current table like normal
      ownerSubMarketTableData.value = newData
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  function openOwnerPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.ownerAddress = rowData.owner

    ownerPopoverOpen.value = true
  }

  function closeOwnerPopover(e: Event) 
  {
    event.value = e
    ownerPopoverOpen.value = false
  }

  function checkAddress(address: string)
  {
    if(isValidSolanaPublicKey(address))
    {
      publicKeyCheckColor.value = "#6fff7b"
      isInvalidPublicKey.value = false
    }
    else
    {
      publicKeyCheckColor.value = "#ff0000"
      isInvalidPublicKey.value = true
    }
  }

  function moveCursorInFrontPercentSign(rowData: any)
  {
    const ref = inputFeeRefs.value.get(rowData.id)
    const inputElement = ref?.$el.querySelector(".p-inputtext")

    if(inputElement)
    {
      const beforePercentSign = inputElement.selectionEnd - 1
      inputElement.setSelectionRange(beforePercentSign, beforePercentSign)
      inputElement.focus()
    }
  }

  function fixCursorPosition(rowData: any)
  {
    const ref = inputFeeRefs.value.get(rowData.id)
    const inputElement = ref?.$el.querySelector(".p-inputtext")

    if(inputElement)
    {
      if(inputElement.value == "")
      {
        inputElement.value = "0.00%"
        inputElement.setSelectionRange(0, 0)
      }

      const previousStart = inputElement.selectionStart
      const previousEnd = inputElement.selectionEnd
      const previousValue = inputElement.value
      
      setTimeout(() =>
      {
        inputElement.value = previousValue
        inputElement.setSelectionRange(previousStart, previousEnd)
      }, 0);
    }
  }

  const setInputRef = (el: any, rowData: any) =>
  {
    if(el)
      inputFeeRefs.value.set(rowData.id, el)
    else
      inputFeeRefs.value.delete(rowData.id)
  }

  const onCellEditSave = async (event: { newData:any; index:any } ) => 
  {
    let { newData, index } = event
    
    ownerSubMarketTableData.value[index].feeCollectorAddress = newData.feeCollectorAddress
    ownerSubMarketTableData.value[index].feeOnInterestEarnedRate = newData.feeOnInterestEarnedRate

    const subMarket = subMarketsHashMap.map.get
    (
      ownerSubMarketTableData.value[index].tokenMintAddress.toBase58() +
      ownerSubMarketTableData.value[index].owner.toString() +
      ownerSubMarketTableData.value[index].subMarketIndex.toString()
    )

    if(newData.feeCollectorAddress != subMarket.feeCollectorAddress ||
    newData.feeOnInterestEarnedRate != subMarket.feeOnInterestEarnedRate)
    {
      ownerSubMarketTableData.value[index].isRowDataEdited = true
      savedEditedRow = ownerSubMarketTableData.value[index]
      isDataEdited.value = true
    }
    else
    {
      ownerSubMarketTableData.value[index].isRowDataEdited = false

      //Erase saved row if it exists since the row data matches what's on the block chain
      if(savedEditedRow != undefined)
        if(ownerSubMarketTableData.value[index].id == savedEditedRow.id) //Keeps other rows from erasing the data when you click in them
        { 
          savedEditedRow = undefined
          isDataEdited.value = false
        }
    }

    checkForNewDataAfterEditing()
    ownerSubMarketTableData.value[index].isEditingRow = false
    isEditing = false
  }

  function checkForNewDataAfterEditing()
  {
    if(newTableData != undefined) //Check if newTableData came in while editing
    {
      if(savedEditedRow != undefined) //Combine new table data with the edited row data if it exists
        for(var i=0; i<newTableData.length; i++)
          if(newTableData[i].id == savedEditedRow.id)
          {
            newTableData[i].feeCollectorAddress = savedEditedRow.feeCollectorAddress
            newTableData[i].feeOnInterestEarnedRate = savedEditedRow.feeOnInterestEarnedRate
            newTableData[i].isRowDataEdited = true
            newTableData[i].isEditingRow = false
          }
       
      if(unfilteredTableData != undefined)
      {
        unfilteredTableData = newTableData
        ownerSubMarketTableData.value = customFilter(searchInput.value)
      }
      else    
        ownerSubMarketTableData.value = newTableData

      newTableData = undefined
    }
  }

  async function editSubMarket(subMarketTableRow: any, index: number)
  {
    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.editSubMarket
      (
        new PublicKey(subMarketTableRow.tokenMintAddress),
        subMarketTableRow.subMarketIndex,
        new PublicKey(subMarketTableRow.feeCollectorAddress),
        subMarketTableRow.feeOnInterestEarnedRate * 100//convert to fixedpoint notation
      ).rpc()
      await confirmLendingTransaction(tx, toast, "edit_sub_market")

      ownerSubMarketTableData.value[index].isRowDataEdited = false
      savedEditedRow = undefined
      isDataEdited.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "edit_sub_market")
    }
  }

  async function claimSubMarketFees()
  {
    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.claimSubMarketFees
      (
        event.value.tokenMintAddress,
        event.value.owner,
        event.value.subMarketIndex,
        accountSelect.value
      ).rpc()
      await confirmLendingTransaction(tx, toast, "claim_sub_market_fees")

      collectFeesPopoverOpen.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "claim_sub_market_fees")
    }
  }
</script>

<style scoped>
  .container
  {
    margin-bottom: 77px
  }

  /*Set row height to higest possible value*/
  #submarketOwnersTable :deep(.p-datatable-tbody > tr)
  {
    height: 84px
  }

  #submarketOwnersInnerTable :deep(.p-datatable-tbody > tr)
  {
    height: 90px
  }

  #tableTitle
  {
    margin: 20px
  }

  .tableMinWidth
  {
    min-width: 1495px
  }

  ion-input
  {
    --highlight-color: v-bind(colorHexValue) !important
  }

  .p-inputnumber-input:focus
  {
    --p-inputtext-focus-border-color: #6fff7b !important
  }

  .feeRecipientInput:focus-within
  {
    --p-inputtext-focus-border-color: v-bind(publicKeyCheckColor) !important
  }
</style>