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
      :globalFilterFields="['name', 'tokenMintAddress', 'subMarketCount']"  
    >
      <template #header>
        <div>
          <h2>Token Reserves</h2>
          <ion-input id="reservesSearchInput" v-model="filters['global'].value" fill="outline" placeholder="Reserves Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <br>
        </div>
      </template>
      <template #loading> Loading Reserves. Please wait. </template>
      <Column field="name" header="Token Reserve" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            
            <ion-button style="margin-left: -11px; margin-right: -11px" fill="clear" @click="slotProps.data.source()">
              <component :is="slotProps.data.svg" style="width: 24px"></component>
            </ion-button>
            <ion-text>{{ slotProps.data.name }}</ion-text>
          </div>
        </template>
      </Column>
      <Column field="tokenMintAddress" header="TokenMintAddress" style="width: 0%" sortable></Column>
      <Column field="subMarketCount" header="SubMarket Count" style="width: 0%" sortable></Column>
      <Column field="tokenDecimalAmount" header="Actions" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRow">
            <ion-button id="openCreateSubMarketModal"
            color="dark"
            @click="selectedTokenMintAddress=slotProps.data.tokenMintAddress;
            subMarketTokenName=slotProps.data.name;
            createSubMarketSVG=slotProps.data.svg;
            sourceSubMarketSVG=slotProps.data.source;
            feeCollectorAddress=connectedWallet.addressString;
            creatingSubMarket=true;
            validPublicKey = isValidSolanaPublicKey(feeCollectorAddress)"
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
      show-gridlines
      sortField="tokenMintAddress" 
      :sortOrder="-1" 
      size="small" 
      :value="tokenMarketTableData"
      :loading="isLoading"
      editMode="cell" 
      @cell-edit-complete="onCellEditSave($event)"
      rowGroupMode="subheader" groupRowsBy="asset.type"
      :globalFilterFields="['owner', 'displayName', 'feeCollectorAddress', 'feeOnInterestEarnedRate']"  
    >
      <template #header>
        <div>
          <h2>USDC SubMarkets</h2>
          <ion-button color="dark" class="mediumSmallMarginBottom nSmallMarginTop" @click="showTokenSubMarkets=false">Return</ion-button>
          <ion-input id="reservesSearchInput" v-model="filters['global'].value" fill="outline" placeholder="Reserves Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <br>
        </div>
      </template>
      <template #loading> Loading Reserves. Please wait. </template>
      <Column field="owner" header="Owner" style="width: 18%" sortable>
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
              <ion-button id="commentCopyAddressButton" color="green" @click="passByRefWrapperCopyAddress()" @mouseleave="closeOwnerPopover($event)">
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
          <ion-text>{{ slotProps.data.feeOnInterestEarnedRate * 100 }}%</ion-text>
        </template>
        <template #editor="{ index, data, field }">
          <InputNumber
          v-model="data[field]"
          :min=0
          :max=100
          :step=0.01
          fluid
          @input="isEditing=true; tokenMarketTableData[index].isEditingRow=true"
          :disabled="connectedWallet.addressString!=tokenMarketTableData[index].owner ||
          (isDataEdited && !tokenMarketTableData[index].isEditingRow && !tokenMarketTableData[index].isRowDataEdited)"/>
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

    <!--Create Sub Market Modal-->
    <div v-if="creatingSubMarket"
      id="createSubMarketModal"
      class="thickBorder"

    >
      <div id="createSubMarketHeader" class="nMediumSmallMarginTop tinyMarginBottom flexCenterRow">
        <ion-button fill="clear" @click="sourceSubMarketSVG()">
          <component id="createSubMarketSVG" :is="createSubMarketSVG" style="width: 44px; margin-right: -20px"></component>
        </ion-button>

        <ion-text class="noClickEvent">{{ subMarketTokenName }}</ion-text><br>
      </div>

      <p class="nTinyMarginTop noClickEvent">Owner: {{ trimAddress(connectedWallet.addressString) }}</p>
      <div v-if="!connectedWallet.isConnected" class="nMediumMarginTop mediumMarginBottom noClickEvent">
        <ion-text  style="font-size: 11px"
        >
          Connect wallet to create a submarket
        </ion-text>
      </div>

      <ion-input
        id="feeCollectorInput"
        v-model="feeCollectorAddress"
        fill="outline"
        @ion-input="validPublicKey = isValidSolanaPublicKey(feeCollectorAddress)"
        :class="{ 'invalid': !validPublicKey }"
      >
      </ion-input>
      <ion-text style="font-size: 11px" class="noClickEvent">Enter solana publickey that will have the authority to collect fees from your sub market</ion-text>
      <InputNumber
        v-model="feePercentage"
        class="mediumMarginTop"
        :inputStyle="{'text-align': 'center'}"
        suffix="%"
        inputId="percent"
        :minFractionDigits="2" :maxFractionDigits="2"
        :min="0" :max="100"
        :step="0.01"
        showButtons
        fluid
      />
      <ion-text style="font-size: 11px" class="noClickEvent">Enter fee percentage on interest earned for your sub market from 0% to 100%</ion-text><br>

      <ion-button
        id="createSubMarketButton"
        color="dark"
        @click="createSubMarket()"
        class="mediumMarginTop"
        :disabled="!validPublicKey || !connectedWallet.isConnected"
      >
        Create SubMarket
      </ion-button>
    </div>
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
  import { tokenReserves, tokenReserveDevNetMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { tokenReserveHashMap, subMarketsHashMap, subMarketOwnerHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import RIPStarWolf from '/src/assets/svg/rip-star-wolf-svg.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { trimAddress,
    copyFullAddress,
    isValidSolanaPublicKey,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { getUserNextSubMarketIndex } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import cloneDeep from 'lodash/cloneDeep'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue') as string

  const tokenReserveTableData = ref()
  const tokenMarketTableData = ref()
  const showTokenSubMarkets = ref(false)
  const isLoading = ref(true)
  const creatingSubMarket = ref(false)
  const createSubMarketSVG = ref()
  const sourceSubMarketSVG = ref()
  const subMarketTokenName = ref()
  const feeCollectorAddress = ref(connectedWallet.addressString)
  const feePercentage = ref(3)
  const validPublicKey = ref(false)
  const ownerPopoverOpen = ref(false)
  const event = ref()

  var selectedTokenMintAddress: PublicKey
  var publicKeyCheckColor = ref("#6fff7b")
  var isInvalidPublicKey = ref(false)
  var savedEditedRow: any 
  var isEditing = false
  const isDataEdited = ref(false)
  const copyFullAddressButtonText = ref("Copy Full Address")
  
  onMounted(() =>
  {
    if(tokenReserveHashMap.map)
    {
      processTokenReserveTableData()
      isLoading.value = false
    }
    else
      isLoading.value = true
  })

  watch(subMarketOwnerHashMap, () => //Watching subMarketOwnerHashMap instead of tokenReserveHashMap to avoid circular updating and watching. The most important thing is keeping the process for updating custom names separate and not causing extra fetches
  {
    processTokenReserveTableData()

    if(isLoading.value)
      isLoading.value = false

    //Update inner table if it's already opened
    if(showTokenSubMarkets.value)
      showTokenReserveSubMarkets()
  })

  watch(customUserNameHashMap, () =>
  {
    processTokenReserveTableData()
  })

  // When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  window.onclick = function(event: any) 
  {
    if(creatingSubMarket.value)
    {
      const dataPcSectionValue = event?.target?.getAttribute('data-pc-section')

      if((event?.target?.id != "createSubMarketHeader") &&
      (event?.target?.id != "createSubMarketSVG") &&
      (event?.target?.id != "createSubMarketModal") &&
      (event?.target?.id != "openCreateSubMarketModal") &&
      (event?.target?.id != "createSubMarketButton") &&
      !event?.target?.classList.contains("native-input") &&
      !event?.target?.classList.contains("native-wrapper") &&
      !event?.target?.classList.contains("p-inputtext") &&
      !event?.target?.classList.contains("p-icon") &&
      !event?.target?.classList.contains("p-inputnumber-button-group") &&
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast text from closing modal
      !event?.target?.classList.contains("p-toast-close-button") && //Keep transaction toast close button from closing modal
      !dataPcSectionValue?.includes('button container') &&  //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path')) //Keep transaction toast close button from sometimes closing modal
        creatingSubMarket.value = false
    }
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

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  function processTokenReserveTableData()
  {

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

      var tokenReserveSubMarketList = []
      const unProcessedTokenSubMarketList = tokenReserveHashMap.map.get(processedTableData[i].tokenMintAddress.toString())//These are reactive
      if(unProcessedTokenSubMarketList)
        processedTableData[i].subMarketCount = unProcessedTokenSubMarketList.length
      else
        processedTableData[i].subMarketCount = 0

      
      for(var j=0; j<unProcessedTokenSubMarketList.length; j++)
      {
        unProcessedTokenSubMarketList[j].displayName = getCustomOrTrimmedUserDisplayName(unProcessedTokenSubMarketList[j].owner.toString())
        tokenReserveSubMarketList.push(unProcessedTokenSubMarketList[j])
      }

      tokenReserveHashMap.map.set(processedTableData[i].tokenMintAddress.toString(), tokenReserveSubMarketList)
    }

    tokenReserveTableData.value = processedTableData
  }

  function showTokenReserveSubMarkets()
  {
    tokenMarketTableData.value = tokenReserveHashMap.map.get(selectedTokenMintAddress.toString()) 
    showTokenSubMarkets.value = true
  }

  function passByRefWrapperCopyAddress()
  {
    copyFullAddress(copyFullAddressButtonText, event.value.ownerAddress)
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
        if(tokenMarketTableData.value[index].subMarketIndex == savedEditedRow.subMarketIndex) //Keeps other rows from erasing the data when you click in them
        { 
          savedEditedRow = undefined
          isDataEdited.value = false
        }
    }

    tokenMarketTableData.value[index].isEditingRow = false
    isEditing = false
  }
  
  async function createSubMarket()
  {
    try
    {
      const userNextSubMarketIndex = getUserNextSubMarketIndex(connectedWallet.addressString)

      const tx = await anchorPrograms.lending.lendingProgram.methods.createSubMarket
      (
        selectedTokenMintAddress,
        userNextSubMarketIndex,
        new PublicKey(feeCollectorAddress.value),
        feePercentage.value/100
      ).rpc()
      await confirmLendingTransaction(tx, toast, "create_sub_market")
      creatingSubMarket.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "create_sub_market")
    }
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

<style scoped>
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
    min-width: 1070px
  }

  #reservesSearchInput, #feeCollectorInput
  {
    --highlight-color: var(--ion-color-green) !important
  }

  #feeCollectorInput.invalid
  {
    --border-color: var(--ion-color-red) !important
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