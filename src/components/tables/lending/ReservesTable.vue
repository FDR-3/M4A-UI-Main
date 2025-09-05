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
      :globalFilterFields="['tokenMintAddress', 'tokenDecimalAmount']"  
    >
      <template #header>
        <div>
          <h2>Reserves Value: $<span class="rainbowText">{{ adminAccounts.treasuryBalance.toLocaleString() }}</span></h2>
          <ion-input v-model="filters['global'].value" fill="outline" placeholder="Reserves Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <br><ion-label id="tableTitle">Stable Coins</ion-label>
        </div>
      </template>
      <template #loading> Loading Reserves. Please wait. </template>
      <Column field="svg" header="svg" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="slotProps.data.source()">
              <component :is="slotProps.data.svg" style="width: 24px"></component>
            </ion-button>
          </div>
        </template>
      </Column>
      <Column field="tokenMintAddress" header="tokenMintAddress" style="width: 0%" sortable></Column>
      <Column field="tokenDecimalAmount" header="tokenDecimalAmount" style="width: 0%" sortable></Column>
      <Column field="tokenDecimalAmount" header="Actions" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <ion-button id="openCreateSubMarketModal"
            color="dark"
            @click="selectedTokenMintAddress=slotProps.data.tokenMintAddress;
            createSubMarketSVG=slotProps.data.svg;
            sourceSubMarketSVG=slotProps.data.source;
            feeCollectorAddress=connectedWallet.addressString;
            creatingSubMarket=true;
            checkAddress()"
            >
              Create SubMarket
            </ion-button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>

  <!--Create Sub Market Modal-->
  <div v-if="creatingSubMarket"
    id="createSubMarketModal"
    class="thickBorder"

  >
    <div id="createSubMarketHeader" class="nMediumSmallMarginTop tinyMarginBottom flexCenterRow">
      <ion-button fill="clear" @click="sourceSubMarketSVG()">
        <component id="createSubMarketSVG" :is="createSubMarketSVG" style="width: 44px; margin-right: -20px"></component>
      </ion-button>

      <ion-text class="noClickEvent">USDC</ion-text><br>
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
      @ion-input="checkAddress()"
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
      @click="createSubMarket(selectedTokenMintAddress)"
      class="mediumMarginTop"
      :disabled="!validPublicKey || !connectedWallet.isConnected"
    >
      Create SubMarket
    </ion-button>
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
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { tokenReserves, tokenReserveDevNetMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { confirmLendingTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { isValidSolanaPublicKey } from '/src/assets/contracts/Wallethelper.vue'
  import { trimAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import cloneDeep from 'lodash/cloneDeep'

  const toast = inject('toast')

  const tableData = ref()
  const isLoading = ref(true)
  const creatingSubMarket = ref(false)
  const createSubMarketSVG = ref()
  const sourceSubMarketSVG = ref()
  var selectedTokenMintAddress: PublicKey
  const feeCollectorAddress = ref(connectedWallet.addressString)
  const feePercentage = ref(3)
  const validPublicKey = ref(false)
  

  onMounted(() =>
  {
    if(tokenReserves.data)
    {
      processTokenReserveTableData()
      isLoading.value = false
    }
    else
      isLoading.value = true
  })

  watch(tokenReserves, () => 
  {
    processTokenReserveTableData()

    if(isLoading.value)
      isLoading.value = false
  })

  // When the user clicks anywhere outside of the create sub market modal, close it, not when closing toast alert though
  window.onclick = function(event: any) 
  {
    if(creatingSubMarket.value)
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
      !event?.target?.classList.contains("p-toast-summary") && //Keep transaction toast from closing modal
      !event?.target?.classList.contains("p-toast-detail") && //Keep transaction toast from closing modal
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast from closing modal
      !event?.target?.classList.contains("p-toast-message-text") && //Keep transaction toast from closing modal
      !event?.target?.classList.contains("p-toast-message-icon") && //Keep transaction toast from closing modal
      !event?.target?.classList.contains("p-toast-close-icon") && //Keep transaction toast from closing modal
      !event?.target?.closest('path')) //Keep transaction toast from closing modal
        creatingSubMarket.value = false
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  function processTokenReserveTableData()
  {
    var processedTableData = []
    var newTableData = cloneDeep(tokenReserves)

    for(var i=0; i<newTableData.data.length; i++)
    {
      processedTableData.push(newTableData.data[i].account)

      const tokenMapObject = tokenReserveDevNetMap.get(processedTableData[i].tokenMintAddress.toString())

      processedTableData[i].svg = markRaw(tokenMapObject.svg)
      processedTableData[i].source = tokenMapObject.source
    }

    tableData.value = processedTableData
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

  async function createSubMarket(tokenMintAddress: PublicKey)
  {
    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.createSubMarket(tokenMintAddress, 0).rpc()
      await confirmLendingTransaction(tx, toast, "create_sub_market")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "create_sub_market")
    }
  }
</script>

<style>
  #createSubMarketModal
  {
    position: fixed; /* Makes sure the modal is fixed in place on the screen */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-height: 50px;
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

  #feeCollectorInput
  {
    --highlight-color: var(--ion-color-green) !important
  }

  #feeCollectorInput.invalid
  {
    --border-color: var(--ion-color-red) !important
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