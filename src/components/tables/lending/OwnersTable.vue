<template>
  <div class="tableContainer">
    <!--Table of SubMarket Owners-->
    <DataTable
      v-if="!showOwnerSubMarkets"
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines
      size="small" 
      :value="OwnerTableData"
      :loading="isLoading"
      :globalFilterFields="['owner', 'ownerData.displayName', 'ownerData.subMarketCount']"  
    >
      <template #header>
        <div>
          <h2>SubMarket Owner Count: {{ subMarkets.ownerCount }}</h2>
          <ion-input id="ownerSearchInput" v-model="filters['global'].value" fill="outline" placeholder="Owners Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <br>
        </div>
      </template>
      <template #loading>Loading Owners. Please wait.</template>
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
                <ion-label color="dark">{{ copyFullAddressButtonText }}</ion-label>
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
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines
      sortField="id"
      :sortOrder="1"
      size="small" 
      :value="OwnerSubMarketTableData"
      :loading="isLoading"
      editMode="cell" 
      @cell-edit-complete="onCellEditSave($event)"
      :globalFilterFields="['id', 'tokenMintAddress', 'tokenName', 'feeCollectorAddress', 'feeOnInterestEarnedRate']"  
    >
      <template #header>
        <div>
          <h2>{{ subMarketsOwnedByUser }} SubMarket{{ subMarketsSText }} Owned By:<br>{{ subMarketOwnerDisplayName }}</h2>

          <ion-button color="dark" class="mediumSmallMarginBottom nSmallMarginTop" @click="showOwnerSubMarkets=false">Return</ion-button>
          <ion-input id="ownerSearchInput" v-model="filters['global'].value" fill="outline" placeholder="Owners Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
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
              <component :is="slotProps.data.tokenSVG" style="width: 24px; margin-right: 5px"></component>
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
                <ion-label color="dark">{{ copyTokenMintAddressButtonText }}</ion-label>
              </ion-button>
            </ion-popover>
          </div>
        </template>
      </Column>
      <Column field="feeCollectorAddress" header="Fee Collector Address" style="width: 0%" sortable>
        <template #editor="{ index, data, field }">
          <InputText
            v-model="data[field]"
            class="feeRecipientInput"
            fluid
            @input="isEditing=true; OwnerSubMarketTableData[index].isEditingRow=true; checkAddress(data[field])"
            :disabled="connectedWallet.addressString!=OwnerSubMarketTableData[index].owner ||
            (isDataEdited && !OwnerSubMarketTableData[index].isEditingRow && !OwnerSubMarketTableData[index].isRowDataEdited)"
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
          :min="0.00" :max="100"
          :step="0.01"
          showButtons
          fluid
          @focus="moveCursorInFrontPercentSign(data)"
          @input="isEditing=true; OwnerSubMarketTableData[index].isEditingRow=true; checkIfInputEmpty(data)"
          :disabled="connectedWallet.addressString!=OwnerSubMarketTableData[index].owner ||
          (isDataEdited && !OwnerSubMarketTableData[index].isEditingRow && !OwnerSubMarketTableData[index].isRowDataEdited)"/>
        </template>
      </Column>

      <Column field="actions" header="Actions" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRow">
            <div v-if="connectedWallet.addressString==slotProps.data.owner">
              <ion-button
              v-if="slotProps.data.isRowDataEdited"
              color="dark"
              @click="editSubMarket(slotProps.data)"
              :disabled="isInvalidPublicKey"
              >
                Edit Market
              </ion-button>
              <ion-text v-else-if="isDataEdited">Another Row Is Being Edited</ion-text>
              <ion-text v-else>No edits detected</ion-text>
            </div>
            <ion-text v-else align="center">Only the owner can edit their sub market</ion-text>
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
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue') as string

  const OwnerTableData = ref()
  const OwnerSubMarketTableData = ref()
  const isLoading = ref(true)
  const showOwnerSubMarkets = ref(false)
  const subMarketsOwnedByUser = ref()
  const subMarketOwnerDisplayName = ref()
  const ownerPopoverOpen = ref(false)
  const event = ref()

  var selectedOwnerAddress: PublicKey
  var publicKeyCheckColor = ref("#6fff7b")
  var isInvalidPublicKey = ref(false)
  var savedEditedRow: any 
  var isEditing = false
  const isDataEdited = ref(false)
  var copyFullAddressButtonText = ref("Copy Full Address")

  const tokenPopoverOpen = ref(false)
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")

  const inputFeeRefs = ref(new Map())

  const subMarketsSText = computed(() =>
  {
    if(subMarketsOwnedByUser.value == 1)
      return ''
    else
      return 's'
  })
  
  onMounted(() =>
  {
    if(subMarketOwnerHashMap.map)
    {
      processOwnersTable()
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
      openOwnerSubMarkets()
  })

  watch(customUserNameHashMap, () =>
  {
    processOwnersTable()
  })

  function openOwnerSubMarkets()
  {
    const subMarketOwner = subMarketOwnerHashMap.map.get(selectedOwnerAddress)

    OwnerSubMarketTableData.value = subMarketOwner.ownerSubMarketList
    subMarketsOwnedByUser.value = subMarketOwner.subMarketCount
    subMarketOwnerDisplayName.value = subMarketOwner.displayName

    showOwnerSubMarkets.value = true
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
    const unprocessedData = Array.from(subMarketOwnerHashMap.map, ([owner, ownerData]) => ({ owner, ownerData }))
    
    if(!unprocessedData || unprocessedData.length == 0)
      return

    for(var i=0; i<unprocessedData.length; i++)
    {
      unprocessedData[i].ownerData.displayName = getCustomOrTrimmedUserDisplayName(unprocessedData[i].owner)

      //This has to be done here as opposed to in the LendingProtocol.vue file since it has to be after it's deep cloned
      for(var j=0; j<unprocessedData[i].ownerData.ownerSubMarketList.length; j++)
      {
        const tokenReserveFrontEndProperties = tokenReserveDevNetMap.get(unprocessedData[i].ownerData.ownerSubMarketList[j].tokenMintAddress.toString())

        unprocessedData[i].ownerData.ownerSubMarketList[j].tokenSVG = tokenReserveFrontEndProperties.svg
      }

    }

    OwnerTableData.value = unprocessedData
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

  function checkIfInputEmpty(rowData: any)
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
    
    OwnerSubMarketTableData.value[index].feeCollectorAddress = newData.feeCollectorAddress
    OwnerSubMarketTableData.value[index].feeOnInterestEarnedRate = newData.feeOnInterestEarnedRate

    const subMarket = subMarketsHashMap.map.get
    (
      OwnerSubMarketTableData.value[index].tokenMintAddress.toBase58() +
      OwnerSubMarketTableData.value[index].owner.toString() +
      OwnerSubMarketTableData.value[index].subMarketIndex.toString()
    )

    if(newData.feeCollectorAddress != subMarket.feeCollectorAddress ||
    newData.feeOnInterestEarnedRate != subMarket.feeOnInterestEarnedRate)
    {
      OwnerSubMarketTableData.value[index].isRowDataEdited = true
      savedEditedRow = OwnerSubMarketTableData.value[index]
      isDataEdited.value = true
    }
    else
    {
      OwnerSubMarketTableData.value[index].isRowDataEdited = false

      //Erase saved row if it exists since the row data matches what's on the block chain
      if(savedEditedRow != undefined)
        if(OwnerSubMarketTableData.value[index].subMarketIndex == savedEditedRow.subMarketIndex) //Keeps other rows from erasing the data when you click in them
        { 
          savedEditedRow = undefined
          isDataEdited.value = false
        }
    }

    OwnerSubMarketTableData.value[index].isEditingRow = false
    isEditing = false
  }

  async function editSubMarket(subMarketTableRow: any)
  {
    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.editSubMarket
      (
        new PublicKey(subMarketTableRow.tokenMintAddress),
        subMarketTableRow.subMarketIndex,
        new PublicKey(subMarketTableRow.feeCollectorAddress),
        subMarketTableRow.feeOnInterestEarnedRate
      ).rpc()
      await confirmLendingTransaction(tx, toast, "edit_sub_market")

      subMarketTableRow.isRowDataEdited = false
      savedEditedRow = undefined
      isDataEdited.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "edit_sub_market")
    }
  }
</script>

<style>
  #createSubMarketModal
  {
    position: fixed; /* Makes sure the modal is fixed in place on the screen */
    top: 70%;
    left: 50%;
    transform: translate(-50%, -70%);
    z-index: 4000; /* Makes sure the modal is on top */
    padding: 20px;
    background-color: var(--ion-background-color)
  }

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
    min-width: 1000px
  }

  #ownerSearchInput
  {
    --highlight-color: var(--ion-color-green) !important
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