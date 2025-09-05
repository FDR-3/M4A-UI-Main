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
            <component :is="slotProps.data.svg" style="width: 24px; height: 24px"></component>
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
            @click="selectedTokenMintAddress=slotProps.data.tokenMintAddress; createSubMarketSVG=slotProps.data.svg; creatingSubMarket=true"
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
    <div class="tinyMarginTop noClickEvent">
      <ion-text class="flexCenterRow"> <component :is="createSubMarketSVG"></component>USDC</ion-text><br>
    </div>

    <ion-input v-model="feeCollectorAddress" fill="outline" @ion-input="checkAddress()"></ion-input>
    <ion-text style="font-size: 11px">Enter solana publickey that will have the authority to collect fees from your sub market</ion-text>
    <InputNumber
      v-model="feePercentage"
      class="mediumMarginTop"
      :inputStyle="{'text-align': 'center'}"
      suffix="%"
      inputId="percent"
      :minFractionDigits="2" :maxFractionDigits="2"
      :min="0" :max="100"
      fluid
    />
    <ion-text style="font-size: 11px">Enter fee percentage on interest earned for your sub market between 0%-100%</ion-text>
    <ion-button color="dark" @click="createSubMarket(selectedTokenMintAddress)" class="mediumMarginTop">Create SubMarket</ion-button>
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
  import { tokenReserves, tokenReserveSVGsDevNetMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { confirmLendingTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { PublicKey } from "@solana/web3.js"
  import { isValidSolanaPublicKey } from '/src/assets/contracts/Wallethelper.vue'

  const toast = inject('toast')

  const tableData = ref()
  const isLoading = ref(true)
  const creatingSubMarket = ref(false)
  const createSubMarketSVG = ref()
  var selectedTokenMintAddress: PublicKey
  const feeCollectorAddress = ref(connectedWallet.addressString)
  const feePercentage = ref(3)
  

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
  {console.log(event?.target)
    if(creatingSubMarket.value)
      if((event?.target?.id != "createSubMarketModal") &&
      (event?.target?.id != "openCreateSubMarketModal") &&
      !event?.target?.classList.contains("native-input") &&
      !event?.target?.classList.contains("native-wrapper") &&
      !event?.target?.classList.contains("p-inputtext") &&
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
    var newTableData = []

    for(var i=0; i<tokenReserves.data.length; i++)
    {
      newTableData.push(tokenReserves.data[i].account)
      newTableData[i].svg = markRaw(tokenReserveSVGsDevNetMap.get(newTableData[i].tokenMintAddress.toString()))
    }

    tableData.value = newTableData
  }

  function checkAddress()
  {
    isValidSolanaPublicKey()
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

<style scoped>
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

  ion-input
  {
    --highlight-color: var(--ion-color-green)
  }

  .p-inputtext:focus
  {
    --p-inputtext-focus-border-color: #ff0000 !important
  }
</style>