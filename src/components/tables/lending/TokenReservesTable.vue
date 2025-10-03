<template>
  <div class="tableContainer">
    <!--TokenReserveTable-->
    <DataTable
      v-if="!showTokenSubMarkets"
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines
      sortField="tokenMintAddress" 
      :sortOrder="-1" 
      size="small" 
      :value="tokenReserveTableData"
      :loading="isLoading"
      rowGroupMode="subheader" groupRowsBy="asset.type"
      :globalFilterFields="['name', 'tokenMintAddress', 'tokenReserveATA', 'price', 'percentChange24h', 'quanity', 'value', 'subMarketCount']"  
    >
      <template #header>
        <div>
          <h2>Token Reserves Value: $<span class="rainbowText">{{ tvl.tokenReserveTVL.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}</span></h2>
          <ion-input v-model="filters['global'].value" fill="outline" placeholder="Reserves Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <br>
        </div>
      </template>
      <template #loading> Loading Reserves. Please wait. </template>
      <Column field="name" header="Token Reserve" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button style="margin-left: -11px; margin-right: -5px" fill="clear" @click="openTokenReserveATAPopover($event, slotProps.data)">
              <component :is="slotProps.data.svg" style="width: 24px; margin-right: 5px"></component>
              <ion-label color="dark">{{ slotProps.data.name }}</ion-label>
            </ion-button>
            <ion-popover 
            :is-open="tokenReserveATAPopoverOpen" 
            :event="event" 
            @didDismiss="tokenReserveATAPopoverOpen=false"
            side="top" 
            alignment="center"
            >
              <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyTokenReserveATA()" @mouseleave="closeTokenReserveATAPopover($event)">
                <ion-label color="dark">{{ copyTokenReserveATAButtonText }}</ion-label>
              </ion-button>
            </ion-popover>
          </div>
        </template>
      </Column>
      <Column field="price" header="Price" style="width: 0%" sortable>
        <template #body="slotProps">
          ${{ slotProps.data.price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}
        </template>
      </Column>
      <Column field="percentChange24h" header="24h% Change" style="width: 0%" sortable>
        <template #body="slotProps">
           <ion-text :color="slotProps.data.percentChange24h<0 ? 'red' : 'green'">{{ slotProps.data.percentChange24h }}%</ion-text>
        </template>
      </Column>
      <Column field="quanity" header="Quantity" style="width: 0%" sortable></Column>
      <Column field="value" header="Value" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.value }}
        </template>
      </Column>
      <Column field="subMarketCount" header="SubMarket Count" style="width: 0%" sortable></Column>
      <Column field="tokenDecimalAmount" header="Actions" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRow">
            <ion-button id="openCreateSubMarketModal"
            color="dark"
            @click="selectedTokenMintAddress=slotProps.data.tokenMintAddress;
            $emit('createSubMarketModal', 
              slotProps.data.tokenMintAddress,
              slotProps.data.svg,
              slotProps.data.name)"
            >
              Create SubMarket
            </ion-button>
            <ion-button v-if="slotProps.data.subMarketCount" color="dark" @click="selectedTokenMintAddress=slotProps.data.tokenMintAddress; showTokenReserveSubMarkets()">
              View Markets
            </ion-button>
          </div>
        </template>
      </Column>
    </DataTable>

    <!--TokenReserveSubMarketsTable-->
    <DataTable
      v-if="showTokenSubMarkets" 
      class="tableMinWidth"
      v-model:filters="filters" 
      paginator 
      show-gridlines 
      :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      size="small" 
      :value="tokenMarketTableData"
      :loading="isLoading"
      editMode="cell" 
      @cell-edit-complete="onCellEditSave($event)"
      @sort="sorting=true"
      @value-change="onValueChange($event)"
    >
      <template #header>
        <div>
          <h2>USDC SubMarkets</h2>

          <ion-button color="dark" class="mediumSmallMarginBottom nSmallMarginTop" @click="unShowSubMarkets()">Return</ion-button>
          <ion-input
            color="dark"
            v-model="searchInput"
            fill="outline"

            placeholder="Reserves Search     "
            @input="filterTable()"
          >
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <br>
        </div>
      </template>
      <template #loading> Loading Reserves. Please wait. </template>
      <Column field="id" header="Id" style="width: 0%" sortable></Column>
      <Column field="owner" header="Owner" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="openOwnerPopover($event, slotProps.data)">

              <div v-if=" slotProps.data.owner==adminAccounts.lendingCEOAddress">
                <RIPStarWolf v-if="adminAccounts.ceoIsDead" class="starWolfButton" :fill="colorHexValue"/>
                <StarWolf v-else class="starWolfButton" :fill="colorHexValue"/>
              </div>
              <StarWolf v-else class="starWolfButton" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>

              <ion-label color="dark">
                {{ slotProps.data.displayName }}
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
                <ion-label color="dark">{{ copyFullAddressButtonText }}</ion-label>
              </ion-button>
            </ion-popover>
          </div>
        </template>
      </Column>
      <Column field="feeCollectorAddress" header="Fee Collector Address" style="width: 0%" sortable>
        <template #editor="{ index, data, field }">
          <InputText
            v-model="data[field]"
            fluid
            @input="isEditing=true; tokenMarketTableData[index].isEditingRow=true; checkAddress(data[field])"
            :disabled="connectedWallet.addressString!=tokenMarketTableData[index].owner ||
            (isDataEdited && !tokenMarketTableData[index].isEditingRow && !tokenMarketTableData[index].isRowDataEdited)"
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
          suffix="%"
          inputId="percent"
          :minFractionDigits="2" :maxFractionDigits="2"
          :min="0" :max="100"
          :step="0.01"
          showButtons
          fluid
          @focus="moveCursorInFrontPercentSign(data)"
          @input="isEditing=true; tokenMarketTableData[index].isEditingRow=true; fixCursorPosition(data)"
          :disabled="connectedWallet.addressString!=tokenMarketTableData[index].owner ||
          (isDataEdited && !tokenMarketTableData[index].isEditingRow && !tokenMarketTableData[index].isRowDataEdited)"/>
        </template>
      </Column>
      <Column header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <div v-if="connectedWallet.addressString==slotProps.data.owner">
              <ion-label v-if="slotProps.data.isEditingRow" color="yellow">
                Table Updates Paused While Editing
              </ion-label>
              <ion-label v-else-if="isDataEdited && !slotProps.data.isRowDataEdited && !slotProps.data.isEditingRow">
                You can only edit one row at a time
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
            <ion-text v-else align="center">Only the owner can edit their sub market</ion-text>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, inject } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonText, IonPopover } from '@ionic/vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import InputNumber from 'primevue/inputnumber'
  import InputText from 'primevue/inputtext'
  import { search } from 'ionicons/icons'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { tokenReserves,
    tokenReserveDevNetMap, 
    priceObjectMap,
    tokenReserveBalancesMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { tokenReserveHashMap, subMarketsHashMap, subMarketOwnerHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import RIPStarWolf from '/src/assets/svg/rip-star-wolf-svg.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { copyFullAddress,
    copyTokenReserveATA,
    isValidSolanaPublicKey,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { tvl } from '/src/assets/globalStates/AdminAccounts.vue'
  import cloneDeep from 'lodash/cloneDeep'

  const emits = defineEmits(['createSubMarketModal', 'updateReserveTableSizing'])

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue') as string

  const tokenReserveTableData = ref()
  const tokenMarketTableData = ref()
  const showTokenSubMarkets = ref(false)
  const isLoading = ref(true)
  var newTableData: any
  
  const ownerPopoverOpen = ref(false)
  const event = ref()

  var selectedTokenMintAddress: PublicKey
  var publicKeyCheckColor = ref("#6fff7b")
  var isInvalidPublicKey = ref(false)
  var savedEditedRow: any 
  var isEditing = false
  const isDataEdited = ref(false)
  const copyFullAddressButtonText = ref("Copy Full Address")

  const tokenReserveATAPopoverOpen = ref(false)
  var copyTokenReserveATAButtonText = ref("Copy Token Reserve ATA")

  const inputFeeRefs = ref(new Map())

  var searchInput = ref("")

  var unfilteredTableData: any
  var sorting = false
  
  onMounted(() =>
  {
    if(tokenReserveHashMap.map)
    {
      processTokenReserveTableData()
      emitReserveTableSizing()

      isLoading.value = false
    }
    else
      isLoading.value = true
  })

  watch(priceObjectMap, () =>
  {
    processTokenReserveTableData()
  })

  watch(subMarketOwnerHashMap, () => //Watching subMarketOwnerHashMap instead of tokenReserveHashMap to avoid circular updating and watching. The most important thing is keeping the process for updating custom names separate and not causing extra fetches
  {
    processTokenReserveTableData()

    if(isLoading.value)
      isLoading.value = false

    //Update inner table if it's already opened
    if(showTokenSubMarkets.value)
      processNewSubMarketData()

    emitReserveTableSizing()
  })

  watch(tokenReserveBalancesMap, () =>
  {
    processTokenReserveTableData()
  })

  watch(customUserNameHashMap, () =>
  {
    processTokenReserveTableData()
  })

  //Keeps editing from fucking up the table after it's sorted or filtered
  function onValueChange(value: any) 
  {
    if(sorting)
    {
      tokenMarketTableData.value = value
      sorting = false
    }
  }

  //Custom table filtering to be able to edit cells after filtering
  function filterTable()
  {
    if(unfilteredTableData == undefined)
      unfilteredTableData = tokenMarketTableData.value

    if(searchInput.value == "")
    {
      tokenMarketTableData.value = unfilteredTableData
      unfilteredTableData == undefined
    }
    else
    {
      tokenMarketTableData.value = customFilter(searchInput.value)
    }
  }

  function customFilter(filterString: string)
  {
    var filteredTable: any = []

    for(var i=0; i<unfilteredTableData.length; i++)
    {
      if(unfilteredTableData[i].id.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].owner.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].displayName.toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].feeCollectorAddress.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].feeOnInterestEarnedRate.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
    }

    return filteredTable
  }

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

  function passByRefWrapperCopyAddress()
  {
    copyFullAddress(copyFullAddressButtonText, event.value.ownerAddress)
  }

  function openTokenReserveATAPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.tokenReserveATA = rowData.tokenReserveATA

    tokenReserveATAPopoverOpen.value = true
  }

  function closeTokenReserveATAPopover(e: Event) 
  {
    event.value = e
    tokenReserveATAPopoverOpen.value = false
  }

  function passByRefWrapperCopyTokenReserveATA()
  {
    copyTokenReserveATA(copyTokenReserveATAButtonText, event.value.tokenReserveATA)
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  function processTokenReserveTableData()
  {
    var value = 0
    var processedTableData = []
    var newTableData = cloneDeep(tokenReserves)

    if(!newTableData.data)
      return

    for(var i=0; i<newTableData.data.length; i++)
    {
      processedTableData.push(newTableData.data[i].account)

      const tokenReserveFrontEndProperties = tokenReserveDevNetMap.get(processedTableData[i].tokenMintAddress.toString())//These are static and don't need to be reactive
      processedTableData[i].name = tokenReserveFrontEndProperties.name
      processedTableData[i].svg = tokenReserveFrontEndProperties.svg
      processedTableData[i].source = tokenReserveFrontEndProperties.source
      processedTableData[i].tokenReserveATA = tokenReserveFrontEndProperties.ata

      //Update Table Prices
      if(priceObjectMap.data)
      {
        processedTableData[i].price = priceObjectMap.data[processedTableData[i].tokenMintAddress.toString()].usdPrice
        processedTableData[i].percentChange24h = priceObjectMap.data[processedTableData[i].tokenMintAddress.toString()].priceChange24h.toFixed(2)
      }

      //Update Table Balances
      if(tokenReserveBalancesMap.map)
      {
        const tokenReserveBalance = tokenReserveBalancesMap.map.get(processedTableData[i].tokenMintAddress.toString())
        if(tokenReserveBalance)
        {
          processedTableData[i].quanity = tokenReserveBalance as number
          processedTableData[i].value = '$' + tokenReserveBalance

          value = Number(tokenReserveBalance) + Number(value)
        }
        else
        {
          processedTableData[i].quanity = 0.00
          processedTableData[i].value = '$0.00'
        }
      }

      var tokenReserveSubMarketList = []

      //Get SubMarket List And Count
      if(tokenReserveHashMap.map)
      {
        var unProcessedTokenSubMarketList = tokenReserveHashMap.map.get(processedTableData[i].tokenMintAddress.toString())//These are reactive
        if(unProcessedTokenSubMarketList)
        {
          unProcessedTokenSubMarketList = unProcessedTokenSubMarketList.sort((a: any, b: any) => a.id - b.id)
          processedTableData[i].subMarketCount = unProcessedTokenSubMarketList.length

          for(var j=0; j<unProcessedTokenSubMarketList.length; j++)
          {
            unProcessedTokenSubMarketList[j].displayName = getCustomOrTrimmedUserDisplayName(unProcessedTokenSubMarketList[j].owner.toString())
            tokenReserveSubMarketList.push(unProcessedTokenSubMarketList[j])
          }
        }

        tokenReserveHashMap.map.set(processedTableData[i].tokenMintAddress.toString(), tokenReserveSubMarketList)
      }
      else
        processedTableData[i].subMarketCount = 0
    }

    tvl.tokenReserveTVL = value
    tokenReserveTableData.value = processedTableData
  }

  function processNewSubMarketData()
  {
    if(isEditing)//Save new table data until after Processor is done typing
      newTableData = tokenReserveHashMap.map.get(selectedTokenMintAddress.toString()) 
    else if(unfilteredTableData != undefined) //Set new data into the unfiltered table if currently filtering table
    {
      if(savedEditedRow != undefined)//Combine saved row data with new table data
      {
        var tempTable = tokenReserveHashMap.map.get(selectedTokenMintAddress.toString()) 

        for(var i=0; i<tempTable.length; i++)
          if(tempTable[i].id == savedEditedRow.id)
          {
            tempTable[i].feeCollectorAddress = savedEditedRow.feeCollectorAddress
            tempTable[i].feeOnInterestEarnedRate = savedEditedRow.feeOnInterestEarnedRate
            tempTable[i].isRowDataEdited = true
          }

        unfilteredTableData = tempTable
        tokenMarketTableData.value = customFilter(searchInput.value)
      }
      else
      {
        unfilteredTableData = tokenReserveHashMap.map.get(selectedTokenMintAddress.toString()) 
        tokenMarketTableData.value = customFilter(searchInput.value)
      }
    }
    else if(savedEditedRow != undefined)//Combine saved row data with new table data
    {
      var tempTable = tokenReserveHashMap.map.get(selectedTokenMintAddress.toString()) 

      for(var i=0; i<tempTable.length; i++)
        if(tempTable[i].id == savedEditedRow.id)
        {
          tempTable[i].feeCollectorAddress = savedEditedRow.feeCollectorAddress
          tempTable[i].feeOnInterestEarnedRate = savedEditedRow.feeOnInterestEarnedRate
          tempTable[i].isRowDataEdited = true
        }

      tokenMarketTableData.value = tempTable
    }
    else //Update current table like normal
      tokenMarketTableData.value = tokenReserveHashMap.map.get(selectedTokenMintAddress.toString()) 
  }

  function showTokenReserveSubMarkets()
  {
    tokenMarketTableData.value = tokenReserveHashMap.map.get(selectedTokenMintAddress.toString()) 
    showTokenSubMarkets.value = true
    emitReserveTableSizing()
  }

  function unShowSubMarkets()
  {
    showTokenSubMarkets.value = false
    emitReserveTableSizing()
  }

  function emitReserveTableSizing()
  {
    if(!tokenMarketTableData.value)
      tokenMarketTableData.value = []

    emits('updateReserveTableSizing', tokenReserveTableData.value.length, tokenMarketTableData.value.length, showTokenSubMarkets.value)
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
    
    tokenMarketTableData.value[index].feeCollectorAddress = newData.feeCollectorAddress
    tokenMarketTableData.value[index].feeOnInterestEarnedRate = newData.feeOnInterestEarnedRate

    const subMarket = subMarketsHashMap.map.get
    (
      tokenMarketTableData.value[index].tokenMintAddress.toBase58() +
      tokenMarketTableData.value[index].owner.toString() +
      tokenMarketTableData.value[index].subMarketIndex.toString()
    )

    if(newData.feeCollectorAddress != subMarket.feeCollectorAddress ||
    newData.feeOnInterestEarnedRate != subMarket.feeOnInterestEarnedRate)
    {
      tokenMarketTableData.value[index].isRowDataEdited = true
      savedEditedRow = tokenMarketTableData.value[index]
      isDataEdited.value = true
    }
    else
    {
      tokenMarketTableData.value[index].isRowDataEdited = false

      //Erase saved row if it exists since the row data matches what's on the block chain
      if(savedEditedRow != undefined)
        if(tokenMarketTableData.value[index].id == savedEditedRow.id) //Keeps other rows from erasing the data when you click in them
        { 
          savedEditedRow = undefined
          isDataEdited.value = false
        }
    }

    checkForNewDataAfterEditing()
    tokenMarketTableData.value[index].isEditingRow = false
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
        tokenMarketTableData.value = customFilter(searchInput.value)
      }
      else    
        tokenMarketTableData.value = newTableData

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

      tokenMarketTableData.value[index].isRowDataEdited = false
      savedEditedRow = undefined
      isDataEdited.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "edit_sub_market")
    }
  }
</script>

<style scoped>
  .container
  {
    margin-bottom: 77px
  }

  #tableTitle
  {
    margin: 20px
  }

  .tableMinWidth
  {
    min-width: 1075px
  }

  ion-input
  {
    --highlight-color: v-bind(colorHexValue) !important
  }

  .p-inputnumber:hover .p-inputnumber-input:not(:focus)
  {
    border-color: var(--ion-color-gray) !important
  }

  .p-inputnumber-input:focus
  {
    --p-inputtext-focus-border-color: #6fff7b !important
  }

  .p-inputtext:focus-within
  {
    --p-inputtext-focus-border-color: v-bind(publicKeyCheckColor) !important
  }
</style>