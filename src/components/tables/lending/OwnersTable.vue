<template>
  <div class="tableContainer">
    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines
      sortField="tokenMintAddress" 
      :sortOrder="-1" 
      size="small" 
      :value="tableData"
      :loading="isLoading"
      rowGroupMode="subheader" groupRowsBy="asset.type"
      :globalFilterFields="['owner', 'ownerData.displayName', 'ownerData.subMarketCount']"  
    >
      <template #header>
        <div>
          <h2>SubMarket Owner Count: {{ subMarkets.ownerCount }}</h2>
          <ion-input id="ownerSearchInput" v-model="filters['global'].value" fill="outline" placeholder="Owners Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <br><ion-label id="tableTitle">Stable Coins</ion-label>
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
            <ion-button id="commentCopyAddressButton" color="green" @click="passByRefWrapperCopyAddress()" @mouseleave="closeOwnerPopover($event)">
              <ion-label color="dark">{{copyFullAddressButtonText}}</ion-label>
            </ion-button>
          </ion-popover>

          </div>
        </template>
      </Column>
      <Column field="ownerData.subMarketCount" header="SubMarket Count" style="width: 0%" sortable></Column>
      <Column field="tokenDecimalAmount" header="Actions" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <ion-button id=""
            color="dark"
            @click=""
            >
              View Markets
            </ion-button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, inject, markRaw } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonText } from '@ionic/vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import InputNumber from 'primevue/inputnumber'
  import { search } from 'ionicons/icons'
  import { tokenReserves, tokenReserveDevNetMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarkets, tokenReserveHashMap, subMarketOwnerHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import RIPStarWolf from '/src/assets/svg/rip-star-wolf-svg.vue'
  import { confirmLendingTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { isValidSolanaPublicKey } from '/src/assets/contracts/Wallethelper.vue'
  import { trimAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { getUserNextSubMarketIndex } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { copyFullAddress } from '/src/assets/contracts/WalletHelper.vue'
  import cloneDeep from 'lodash/cloneDeep'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue') as string

  const tableData = ref()
  const isLoading = ref(true)
  const creatingSubMarket = ref(false)
  const createSubMarketSVG = ref()
  const sourceSubMarketSVG = ref()
  const subMarketTokenName = ref()
  var selectedTokenMintAddress: PublicKey
  const feeCollectorAddress = ref(connectedWallet.addressString)
  const feePercentage = ref(3)
  const validPublicKey = ref(false)
  var ownerPopoverOpen = ref(false)
  var event = ref()

  var copyFullAddressButtonText = ref("Copy Full Address")
  
  onMounted(() =>
  {
    if(subMarketOwnerHashMap.map)
    {
      processOwnersTable()
      isLoading.value = false
    }
    else if(subMarkets)
      isLoading.value = false
    else
      isLoading.value = true
  })

  watch(subMarketOwnerHashMap, () => 
  {
    processOwnersTable()

    if(isLoading.value)
      isLoading.value = false
  })

  watch(customUserNameHashMap, () =>
  {
    processOwnersTable()
  })

  function passByRefWrapperCopyAddress()
  {
    copyFullAddress(copyFullAddressButtonText, event.value.ownerAddress)
  }

  function processOwnersTable()
  {
    const unprocessedData = Array.from(subMarketOwnerHashMap.map, ([owner, ownerData]) => ({ owner, ownerData }))
    
    if(!unprocessedData || unprocessedData.length == 0)
      return

    for(var i=0; i<unprocessedData.length; i++)
    {
      const chatAccount = customUserNameHashMap.map.get(unprocessedData[i].owner)

      if(chatAccount)
      {
        if(chatAccount.useCustomName)
          unprocessedData[i].ownerData.displayName = chatAccount.userName
        else
          unprocessedData[i].ownerData.displayName = trimAddress(unprocessedData[i].owner)
      }
      else
        unprocessedData[i].ownerData.displayName = trimAddress(unprocessedData[i].owner)
    }

    tableData.value = unprocessedData
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  function openOwnerPopover(e: Event, rowData: any, ) 
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

  function checkAddress()
  {
    if(feeCollectorAddress.value == SYSTEM_PROGRAM_ADDRESS_STRING)
      validPublicKey.value = false
    else if(isValidSolanaPublicKey(feeCollectorAddress.value))
      validPublicKey.value = true
    else
      validPublicKey.value = false
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
    min-width: 570px;
  }

  #ownerSearchInput
  {
    --highlight-color: var(--ion-color-green) !important
  }

  .p-inputnumber:hover .p-inputnumber-input:not(:focus)
  {
    border-color: var(--ion-color-gray) !important;
  }

  .p-inputnumber-input:focus
  {
    --p-inputtext-focus-border-color: #6fff7b !important;
  }
</style>