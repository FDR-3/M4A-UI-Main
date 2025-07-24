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
      :globalFilterFields="['asset.name', 'price', 'apy', 'app.name', 'chain.name']"
    >
    <template #header>
      <div>
        <h2>Earn interest on deposits while helping to push the USA to universal health care like every other fucking first world country not named the United States of America</h2>
        <p>A 3% fee on interest earned is collected for the <span color="green">M4A</span> Treasury</p>
        <p>IE: If you have $100 of USDC deposited for a year, and the apy remains at exactly 10% for the whole year (Not likely at all)</p>
        <p>After a year, you would have your $100(deposit) + $10(interest earned) - $0.30(fee) = $109.70</p>
        <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="Market Search     ">
          <ion-icon slot="start" :icon="search"></ion-icon>
        </ion-input>
        <br><ion-label id="tableTitle">Stable Coins</ion-label>
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
    <Column field="price" header="Price" style="width: 0%" sortable></Column>
    <Column field="apy" header="APY%" style="width: 0%" sortable></Column>
    <Column field="app.name" header="App" style="width: 0%" sortable>
      <template #body="slotProps">
        <div class="flex">
            <img v-if="slotProps.data.app.image.includes('.png')" :src="`/src/assets/cryptoIcons/${slotProps.data.app.image}`" style="width: 40px" />
            <ion-icon v-if="slotProps.data.app.image.includes('.svg')" color="dark" :src="`/src/assets/cryptoIcons/${slotProps.data.app.image}`" style="width: 24px; height: 24px" />
            <span class="tinyMarginLeft">{{ slotProps.data.app.name }}</span>
        </div>
      </template>
      </Column>
      <Column field="chain.name" header="Chain" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flex">
              <img :src="`/src/assets/cryptoIcons/${slotProps.data.chain.image}`" style="width: 35px" />
              <span class="nTinyMarginLeft">{{ slotProps.data.chain.name }}</span>
          </div>
        </template>
      </Column>
      <Column header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <ion-button color="dark">Deposit</ion-button>
          </div>
        </template>
      </Column>
    </DataTable>
<!--
    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines size="small" 
      :value="CryptoCurrency"
      scrollable
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
      <Column field="price" header="Price" style="width: 0%" sortable></Column>
      <Column field="apy" header="APY%" style="width: 0%" sortable></Column>
      <Column field="app.name" header="App" style="width: 0%" sortable>
      <template #body="slotProps">
        <div class="flex">
            <img v-if="slotProps.data.app.image.includes('.png')" :src="`/src/assets/cryptoIcons/${slotProps.data.app.image}`" style="width: 24px" />
            <ion-icon v-if="slotProps.data.app.image.includes('.svg')" color="dark" :src="`/src/assets/cryptoIcons/${slotProps.data.app.image}`" style="width: 24px" />
            <span>{{ slotProps.data.app.name }}</span>
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
    </DataTable>-->
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
    min-width: 550px
  }

  ion-textarea
  {
    --highlight-color: var(--ion-color-green)
  }
</style>