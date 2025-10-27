<template>
  <div class="tableContainer">
    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines 
      sortField="supplyAPY" 
      :sortOrder="-1" 
      size="small" 
      :value="[]"
      rowGroupMode="subheader" 
      groupRowsBy="asset.type"
      :globalFilterFields="
      [
        'tokenMintAddress',
        'asset.name',
        'chain.name',
        'priceString',
        'percentChange24h',
        'supplyAPYString',
        'borrowAPYString',
        'utilizationRateString',
        'depositsString',
        'borrowsString',
        'globalLimitString'
      ]"
    >
      <template #header>
        <div>
          <h2>Lending Leader Board</h2>

          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="Leader Board Search     ">
            <ion-icon class="tableSearchIcon" slot="start" :icon="search"></ion-icon>
          </ion-input>
        </div>
      </template>
      <template #loading> Loading Stable Coins. Please Wait. </template>
      <Column header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterRow">
            <ion-text v-if="!slotProps.data.isMainSubMarketReady">No Submarket</ion-text>
            <ion-button
            v-else
            class="tableDepositButton"
            color="dark"
            @click="$emit('openDepositModal',
            slotProps.data.tokenMintAddressString,
            slotProps.data.decimalAmount,
            slotProps.data.asset.svg,
            slotProps.data.asset.name)"
            >
             Deposit
            </ion-button>
            <ion-button
            v-if="slotProps.data.depositBalance"
            class="tableWithdrawButton"
            color="dark"
            @click="$emit('openWithdrawalModal',
            slotProps.data.tokenMintAddressString,
            slotProps.data.decimalAmount,
            slotProps.data.asset.svg,
            slotProps.data.asset.name)"
            >
             Withdraw
            </ion-button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, inject } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonPopover, IonText } from '@ionic/vue'
  import { search } from 'ionicons/icons'
  import { pencil, informationCircle, close } from 'ionicons/icons'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Select from 'primevue/select'
  import { FilterMatchMode } from '@primevue/core/api'

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

</script>

<style scoped>

</style>