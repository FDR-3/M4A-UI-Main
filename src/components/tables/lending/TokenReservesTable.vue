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
      :globalFilterFields="['name', 'tokenMintAddress', 'tokenReserveATA', 'price', 'percentChange24h', 'depositedAmount', 'value', 'subMarketCount']"  
    >
      <template #header>
        <div class="flexCenterRow">
          <div class="tinyMarginBottom" style="margin-right: -10px">
            <InfoButton :infoMessage="subMarketInfoMSG"/>
          </div>
          <h2>Token Reserves Value: $<span class="rainbowText">{{ tvl.tokenReserveTVL.toLocaleString('en-US',
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              }) }}
            </span>
          </h2>
          <br>
        </div>
        <ion-input v-model="filters['global'].value" fill="outline" placeholder="Reserves Search     ">
          <ion-icon class="tableSearchIcon" slot="start" :icon="search"></ion-icon>
        </ion-input><br>
      </template>
      <template #loading> Loading Reserves. Please wait. </template>
      <Column field="name" header="Token Reserve" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight" >
            <ion-button style="margin-left: -11px; margin-right: -5px" fill="clear" @click="openTokenReserveATAPopover($event, slotProps.data)">
              <img v-if="slotProps.data.tokenMintAddress==tokenAddressStrings.solTokenMintAddress" style="width: 40px; height: 32px; margin-left: -8px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
              <component v-else :is="slotProps.data.svg" style="width: 24px; margin-right: 5px"></component>
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
                <ion-label color="light">{{ copyTokenReserveATAButtonText }}</ion-label>
              </ion-button>
            </ion-popover>
          </div>
        </template>
      </Column>
      <Column field="price" header="Price" style="width: 0%" sortable></Column>
      <Column field="percentChange24h" header="24h% Change" style="width: 0%" sortable>
        <template #body="slotProps">
           <ion-text :color="slotProps.data.percentChange24h<0 ? 'red' : 'green'">{{ slotProps.data.percentChange24h }}%</ion-text>
        </template>
      </Column>
      <Column field="depositedAmount" header="Deposits" style="width: 0%" sortable></Column>
      <Column field="value" header="Value" style="width: 0%" sortable></Column>
      <Column field="subMarketCount" header="SubMarket Count" style="width: 0%" sortable></Column>
      <Column field="tokenDecimalAmount" header="Actions" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRow">
            <ion-button id="openCreateSubMarketModalButton"
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
      id="tokenReserveSubMarketsTable"
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

          <div class="flexCenterRow">
            <img v-if="selectedTokenMintAddress.toString()==tokenAddressStrings.solTokenMintAddress" style="width: 70px; margin-left: -22px; margin-right: -5px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
            <component v-else :is="subMarketTokenSVG" style="width: 40px; height: 40px; margin-right: 10px"></component>
            <h2>{{subMarketTokenName}} SubMarkets</h2>
          </div>

          <ion-button color="dark" class="mediumSmallMarginBottom nSmallMarginTop" @click="unShowSubMarkets()">Return</ion-button>
          <ion-input
            color="dark"
            v-model="searchInput"
            fill="outline"

            placeholder="Reserves Search     "
            @input="filterTable()"
          >
            <ion-icon class="tableSearchIcon" slot="start" :icon="search"></ion-icon>
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
      <Column field="depositedAmount" header="Deposits" style="width: 0%" sortable></Column>
      <Column field="value" header="Value" style="width: 0%" sortable></Column>
      <Column field="feesGeneratedAmount" header="Fees Generated" style="width: 0%" sortable></Column>
      <Column field="uncollectedFeesAmount" header="Uncollected Fees" style="width: 0%" sortable></Column>
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
  import { ref, onMounted, watch, inject } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonText, IonPopover } from '@ionic/vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Select from 'primevue/select'
  import { FilterMatchMode } from '@primevue/core/api'
  import InputNumber from 'primevue/inputnumber'
  import InputText from 'primevue/inputtext'
  import { search } from 'ionicons/icons'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { tokenReserves,
    tokenReserveHashMap, 
    priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { tokenAddressStrings } from '/src/assets/constants/Addresses.ts'
  import { tokenReserveSubMarketListHashMap, subMarketsHashMap, subMarketOwnerHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
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
  import { lendingUserAccountsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tvl } from '/src/assets/globalStates/AdminAccounts.vue'
  import cloneDeep from 'lodash/cloneDeep'
  import InfoButton from '/src/components/help/InfoButton.vue'

  var emits = defineEmits(['createSubMarketModal', 'updateReserveTableSizing'])

  var toast = inject('toast')
  var colorHexValue = inject('colorHexValue') as string

  var tokenReserveTableData = ref()
  var tokenMarketTableData = ref()
  var showTokenSubMarkets = ref(false)
  var isLoading = ref(true)
  var newTableData: any

  var accountSelect = ref()
  var accountList = ref()
  
  var ownerPopoverOpen = ref(false)
  var collectFeesPopoverOpen = ref(false)
  var event = ref()

  var selectedTokenMintAddress: PublicKey
  var publicKeyCheckColor = ref("#6fff7b")
  var isInvalidPublicKey = ref(false)
  var savedEditedRow: any 
  var isEditing = false
  var isDataEdited = ref(false)
  var copyFullAddressButtonText = ref("Copy Full Address")

  var tokenReserveATAPopoverOpen = ref(false)
  var copyTokenReserveATAButtonText = ref("Copy Token Reserve ATA")
  const subMarketInfoMSG = "Developers can create\nSubMarkets to generate\ninterest for their\nusers while collecting fees\nto pay what ever bill they\nchoose. Developers will\nneed to build their own UIs\nfor their user deposits,\netc."

  var inputFeeRefs = ref(new Map())

  var searchInput = ref("")

  var unfilteredTableData: any
  var sorting = false

  var subMarketTokenSVG = ref("")
  var subMarketTokenName = ref("")
  
  onMounted(() =>
  {
    if(tokenReserveSubMarketListHashMap.map)
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

  watch(subMarketOwnerHashMap, () => //Watching subMarketOwnerHashMap instead of tokenReserveSubMarketListHashMap to avoid circular updating and watching. The most important thing is keeping the process for updating custom names separate and not causing extra fetches
  {
    processTokenReserveTableData()

    if(isLoading.value)
      isLoading.value = false

    //Update inner table if it's already opened
    if(showTokenSubMarkets.value)
      processNewSubMarketData()

    emitReserveTableSizing()
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
      else if(unfilteredTableData[i].ceoName.toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].depositedAmount.toString().toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].value.toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].feesGeneratedAmount.toLowerCase().includes(filterString.toLowerCase()))
        filteredTable.push(unfilteredTableData[i])
      else if(unfilteredTableData[i].uncollectedFeesAmount.toLowerCase().includes(filterString.toLowerCase()))
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
      processedTableData.push(newTableData.data[i])

      const tokenMintAddressString = processedTableData[i].tokenMintAddress.toString()
      const tokenReserveFrontEndProperties = tokenReserveHashMap.get(tokenMintAddressString)//These are static and don't need to be reactive
      processedTableData[i].name = tokenReserveFrontEndProperties.name
      processedTableData[i].svg = tokenReserveFrontEndProperties.svg
      processedTableData[i].source = tokenReserveFrontEndProperties.source
      processedTableData[i].tokenReserveATA = tokenReserveFrontEndProperties.ata

      //Update Table Prices
      if(priceObjectMap.data)
      {
        processedTableData[i].price = '$' + priceObjectMap.data[tokenMintAddressString].usdPrice.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 })
        processedTableData[i].percentChange24h = priceObjectMap.data[tokenMintAddressString].priceChange24h.toFixed(2)
      }

      const balance = processedTableData[i].depositedAmount
      var calculatedValue = 0

      const priceData = priceObjectMap.data[tokenMintAddressString]
      if(priceData)
        calculatedValue = (balance * priceData.usdPrice)

      processedTableData[i].value = '$' + calculatedValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 })
      value += calculatedValue + value

      //Get SubMarket List And Count
      var tokenReserveSubMarketList = []

      if(tokenReserveSubMarketListHashMap.map)
      {
        var unProcessedTokenSubMarketList = tokenReserveSubMarketListHashMap.map.get(tokenMintAddressString)//These are reactive
        if(unProcessedTokenSubMarketList)
        {
          unProcessedTokenSubMarketList = unProcessedTokenSubMarketList.sort((a: any, b: any) => a.id - b.id)
          processedTableData[i].subMarketCount = unProcessedTokenSubMarketList.length

          for(var j=0; j<unProcessedTokenSubMarketList.length; j++)
          {
            unProcessedTokenSubMarketList[j].displayName = getCustomOrTrimmedUserDisplayName(unProcessedTokenSubMarketList[j].owner.toString())

            if(priceObjectMap.data)
            {
              const balance = unProcessedTokenSubMarketList[j].depositedAmount
              var calculatedValue = 0

              const priceData = priceObjectMap.data[tokenMintAddressString]
              if(priceData)
                calculatedValue = (balance * priceData.usdPrice)

                unProcessedTokenSubMarketList[j].value = '$' + calculatedValue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 })
            }

            tokenReserveSubMarketList.push(unProcessedTokenSubMarketList[j])
          }
        }

        tokenReserveSubMarketListHashMap.map.set(tokenMintAddressString, tokenReserveSubMarketList)
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
      newTableData = tokenReserveSubMarketListHashMap.map.get(selectedTokenMintAddress.toString()) 
    else if(unfilteredTableData != undefined) //Set new data into the unfiltered table if currently filtering table
    {
      if(savedEditedRow != undefined)//Combine saved row data with new table data
      {
        var tempTable = tokenReserveSubMarketListHashMap.map.get(selectedTokenMintAddress.toString()) 

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
        unfilteredTableData = tokenReserveSubMarketListHashMap.map.get(selectedTokenMintAddress.toString()) 
        tokenMarketTableData.value = customFilter(searchInput.value)
      }
    }
    else if(savedEditedRow != undefined)//Combine saved row data with new table data
    {
      var tempTable = tokenReserveSubMarketListHashMap.map.get(selectedTokenMintAddress.toString()) 

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
      tokenMarketTableData.value = tokenReserveSubMarketListHashMap.map.get(selectedTokenMintAddress.toString()) 
  }

  function showTokenReserveSubMarkets()
  {
    tokenMarketTableData.value = tokenReserveSubMarketListHashMap.map.get(selectedTokenMintAddress.toString()) 
    showTokenSubMarkets.value = true

    const tokenFrontEndProperties = tokenReserveHashMap.get(selectedTokenMintAddress.toString())
    subMarketTokenSVG.value = tokenFrontEndProperties.svg
    subMarketTokenName.value = tokenFrontEndProperties.name

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
  #tokenReserveSubMarketsTable :deep(.p-datatable-tbody > tr)
  {
    height: 104px !important
  }

  #tableTitle
  {
    margin: 20px
  }

  .tableMinWidth
  {
    min-width: 1340px
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