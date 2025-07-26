<template>
  <div class="tableContainer">
    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines
      sortField="apy" 
      :sortOrder="-1" 
      size="small" 
      :value="StableCoins"
      rowGroupMode="subheader" groupRowsBy="asset.type"
      :globalFilterFields="['asset.name', 'price', 'apy', 'app.name', 'chain.name']"  
    >
      <template #header>
        <div>
          <h2>Single Payer Treasury Value <br>(Amount Available For Claim Payouts): $<span class="rainbowText">{{ adminAccounts.singlePayerBalance.toLocaleString() }}</span></h2>
          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="Treasury Search     ">
              <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <br><ion-label id="tableTitle">Stable Coins</ion-label>
        </div>
      </template>
      <template #loading> Loading records. Please wait. </template>
      <Column field="asset" header="Asset" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flex">
            <ion-button fill="clear" @click="slotProps.data.asset.source()">
              <component :is="slotProps.data.asset.svg" style="width: 24px"></component>
            </ion-button>
            <span>{{ slotProps.data.asset.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="chain.name" header="Chain" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flex">
            <ion-button fill="clear" @click="slotProps.data.chain.source()">
              <component :is="slotProps.data.chain.svg" style="width: 35px"></component>
            </ion-button>
            <span class="nTinyMarginLeft">{{ slotProps.data.chain.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="price" header="Price" style="width: 0%" sortable></Column>
      
      <Column field="quantity" header="Quantity" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ adminAccounts.singlePayerBalance.toLocaleString() }}
        </template>
      </Column>
      <Column field="value" header="Value" style="width: 0%" sortable>
        <template #body="slotProps">
          ${{ adminAccounts.singlePayerBalance.toLocaleString() }}
        </template>
      </Column>
    </DataTable>
<!--
    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines size="small" 
      :value="CryptoCurrency"
      rowGroupMode="subheader" 
      groupRowsBy="asset.type"
      :globalFilterFields="['asset.name', 'price', 'apy', 'app.name', 'chain.name']"
    >
      <template #header>
        <div>
          <br><ion-label id="tableTitle">Crypto Currency</ion-label>
        </div>
      </template>
      <template #loading> Loading records. Please wait. </template>
      <Column field="asset" header="Asset" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flex">
              <img :src="`/src/assets/cryptoIcons/${slotProps.data.asset.image}`" style="width: 24px" />
              <span>{{ slotProps.data.asset.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="chain.name" header="Chain" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flex">
              <img :src="`/src/assets/cryptoIcons/${slotProps.data.chain.image}`" style="width: 24px" />
              <span>{{ slotProps.data.chain.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="price" header="Price" style="width: 0%" sortable></Column>
      <Column field="quantity" header="Quantity" style="width: 0%" sortable></Column>
      <Column field="value" header="Value" style="width: 0%" sortable></Column>
    </DataTable> -->
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton } from '@ionic/vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import { search } from 'ionicons/icons'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/Assets.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })
</script>

<style scoped>
  .container
  {
    margin-bottom: 77px
  }
  
  .flex
  {
    display: flex;
    align-items: center;
    gap: 2px
  }

  #tableTitle
  {
    margin: 20px
  }

  .tableMinWidth
  {
    min-width: 570px
  }
</style>