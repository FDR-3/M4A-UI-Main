<template>
  <div class="tableContainer">
    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines 
      sortField="apy" 
      :sortOrder="-1" 
      size="small" 
      scrollable
      :value="StableCoins"
      rowGroupMode="subheader" 
      groupRowsBy="asset.type"
      :globalFilterFields="['tokenMintAddress', 'asset.name', 'price', 'percentChange24h', 'apy', 'chain.name']"
    >
      <template #header>
        <div>
          <h2>Earn interest on deposits while helping to push the USA to universal health care like every other fucking first world country not named the United States of America</h2>
          <p>A 3% fee on interest earned is collected for the <span color="green">M4A</span> Treasury</p>
          <p>IE: If you have $100 of USDC deposited for a year, and the apy remains at exactly 10% for the whole year (Not likely at all)</p>
          <p>After a year, you would have your $100(deposit) + $10(interest earned) - $0.30(fee) = $109.70</p>
          <!--<a href="https://www.youtube.com/@fdr-3" target="_blank">Where does the money come from that users are earning on their deposits?</a>-->
          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="Market Search     ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <br><ion-label id="tableTitle">Stable Coins</ion-label>
        </div>
      </template>
      <template #loading> Loading Stable Coins. Please Wait. </template>
      <Column field="asset.name" header="Asset" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="openTokenPopover($event, slotProps.data)">
              <component :is="slotProps.data.asset.svg" style="width: 24px; margin-left: -11px; margin-right: 5px"></component>
              <ion-label color="dark">{{ slotProps.data.asset.name }}</ion-label>
            </ion-button>
            <ion-popover 
            :is-open="tokenPopoverOpen" 
            :event="event" 
            @didDismiss="tokenPopoverOpen=false"
            side="top" 
            alignment="center"
            >
              <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyAddress()" @mouseleave="closeTokenPopover($event)">
                <ion-label color="dark">{{ copyTokenMintAddressButtonText }}</ion-label>
              </ion-button>
            </ion-popover>
          </div>
        </template>
      </Column>
      <Column field="price" header="Price" style="width: 0%" sortable>
        <template #body="slotProps">
          ${{ slotProps.data.price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })}}
        </template>
      </Column>
      <Column field="percentChange24h" header="24h Percent Change" style="width: 0%" sortable>
        <template #body="slotProps">
           <ion-text :color="slotProps.data.percentChange24h<0 ? 'red' : 'green'">{{ slotProps.data.percentChange24h }}%</ion-text>
        </template>
      </Column>
      <Column field="chain.name" header="Chain" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="slotProps.data.chain.source()">
              <component :is="slotProps.data.chain.svg" style="width: 35px; margin-left: -15px; margin-right: -11px"></component>
            </ion-button>
            <span class="nTinyMarginLeft">{{ slotProps.data.chain.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="apy" header="APY%" style="width: 0%" sortable></Column>
      <Column header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <ion-button color="dark" :disabled="!APPROVED_TESTERS.includes(connectedWallet.addressString)" @click="">Deposit</ion-button>
          </div>
        </template>
      </Column>
    </DataTable>

    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines size="small" 
      :value="CryptoCurrency"
      scrollable
      rowGroupMode="subheader" 
      groupRowsBy="asset.type"
      :globalFilterFields="['tokenMintAddress', 'asset.name', 'price', 'percentChange24h', 'apy', 'chain.name']"
    >
    <template #header>
      <div>
        <br><ion-label id="tableTitle">Crypto Currency</ion-label>
      </div>
    </template>
    <template #loading> Loading Cryto Currencies. Please wait. </template>
    <Column field="asset.name" header="Asset" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="openTokenPopover($event, slotProps.data)" style="margin-left: -8px">
              <component v-if="slotProps.data.asset.name=='Sol'" :is="slotProps.data.asset.svg" style="width: 40px; margin-left: -8px; margin-right: -4px"/>
              <component v-else :is="slotProps.data.asset.svg" style="width: 24px; height: 24px; margin-right: 5px"/>
              <ion-label color="dark">{{ slotProps.data.asset.name }}</ion-label>
            </ion-button>
          </div>
        </template>
      </Column>
      <Column field="price" header="Price" style="width: 0%" sortable>
        <template #body="slotProps">
          ${{ slotProps.data.price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })}}
        </template>
      </Column>
      <Column field="percentChange24h" header="24h Percent Change" style="width: 0%" sortable>
        <template #body="slotProps">
           <ion-text :color="slotProps.data.percentChange24h<0 ? 'red' : 'green'">{{ slotProps.data.percentChange24h }}%</ion-text>
        </template>
      </Column>
      <Column field="chain.name" header="Chain" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="slotProps.data.chain.source()">
              <component :is="slotProps.data.chain.svg" style="width: 35px; margin-left: -15px; margin-right: -11px"></component>
            </ion-button>
            <span class="nTinyMarginLeft">{{ slotProps.data.chain.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="apy" header="APY%" style="width: 0%" sortable></Column>
      <Column header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <ion-button color="dark" :disabled="!APPROVED_TESTERS.includes(connectedWallet.addressString)">Deposit</ion-button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonPopover, IonText } from '@ionic/vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import { search } from 'ionicons/icons'
  import { copyTokenMintAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { APPROVED_TESTERS } from '/src/assets/globalStates/MaintenanceMode.ts'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'

  const tokenPopoverOpen = ref(false)
  const event = ref()
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

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

  function passByRefWrapperCopyAddress()
  {
    copyTokenMintAddress(copyTokenMintAddressButtonText, event.value.tokenMintAddress)
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
    min-width: 807px
  }

  ion-input
  {
    --highlight-color: var(--ion-color-green)
  }
</style>