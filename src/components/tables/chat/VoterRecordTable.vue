<template>
  <div class="tableContainer">
    <DataTable 
      class="tableMinWidth"
      show-gridlines 
      paginator :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      size="small" 
      :value="tableData"
      :globalFilterFields="['id', 'displayName', 'voterAddress', 'canidateAddress', 'unixCreationTimeStamp', 'creationTimeString', 'creationDateString', 'voteAmount', 'voteAmountString', 'absVoteAmount']" 
      ref="tableDownload" 
      v-model:filters="filters"
      :loading=isLoading
    >
      <template #header>
        <div>
          <h1 class="yellow">{{ displayName }}</h1>
          <h2 class="voteRecordSubTitle">Received Vote Records</h2>
          <ion-button class="toggleVoteRecordsButton" color="dark" @click="toggleRecordTable()">Show Casted Vote Records Table</ion-button>
          <ion-input color="dark" v-model="filters['global'].value " fill="outline" placeholder="Voter Record Search    ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <div class="voterTableUtilityBar">
            <ion-label slot="start" color="dark">Unique Voters: {{ uniqueVoterCount }}</ion-label>
            <ion-button style="margin-left: 18px" fill="clear" @click="exportCSV($event)">
              <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
            </ion-button>
            <ion-button color="dark" @click="toggleUniqueRecordTable()">
              <ion-label slot="end" color="light">Toggle Unique</ion-label>
            </ion-button>
          </div>
        </div>
      </template>
      <template #empty> No records found. </template>
      <template #loading> Loading records. Please wait. </template>

      <Column field="id" header="Vote Record Id" style="width: 0%" sortable></Column>
      <Column field="voterAddress" header="Voter Address" style="width: 40%" sortField="displayName" sortable>
        <template #body="slotProps">
          <div :class="props.searchAddress == slotProps.data.voterAddress ? 'selfVoteBackground': ''">
            <ion-button fill="clear" @click="openPopover($event, slotProps.data)">
              <StarWolf class="starWolfButton" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
              <ion-label color="dark">
                <span>{{ slotProps.data.displayName }}</span>
              </ion-label>
            </ion-button>
            <ion-popover 
              :is-open="popoverOpen" 
              :event="event" 
              @didDismiss="popoverOpen = false"
              side="top" 
              alignment="center"
            >
            <div class="thinBorder chatTablePopupContainer">
              <div>
                <ion-label color="dark">Net Contribution From {{ event.voterDisplayName }} To <span class="yellow">{{ displayName }}</span></ion-label><br>
                <ion-label v-if="event.contributionTotal > 0" >: <span class="positive">{{ event.contributionTotalString }}</span></ion-label>
                <ion-label v-else-if="event.contributionTotal < 0" >: <span class="negative">{{ event.contributionTotalString }}</span></ion-label>
                <ion-label v-else>:<span>{{ event.contributionTotal }}</span></ion-label>
                <ion-label> Total Spent: <span class="rainbowText">${{ event.amountSpent }}</span></ion-label>
              </div>
                <ion-button class="copyAddressButton" color="dark" @click="passByRefWrapperCopyAddress()">
                  <ion-label color="light">{{copyFullAddressButtonText}}</ion-label>
              </ion-button>
            </div>
            </ion-popover> 
          </div>
        </template>
      </Column>
      <Column field="unixCreationTimeStamp" header="Time/Date" style="width: 10%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.creationTimeString }}
          <br>
          {{ slotProps.data.creationDateString }}
        </template>
      </Column>
      <Column field="voteAmount" header="Vote Amount" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-label v-if="slotProps.data.voteAmount > 0" class="positive">{{ slotProps.data.voteAmountString }}</ion-label>
          <ion-label v-else class="negative">{{ slotProps.data.voteAmountString }}</ion-label>
        </template>
      </Column>
      <Column field="absVoteAmount" header="Amount Spent" style="width: 0%" sortable>
        <template #body="slotProps">
          ${{ slotProps.data.absVoteAmount.toFixed(2) }}
        </template>
      </Column>
        
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineProps } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonPopover, IonInput } from '@ionic/vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import { download } from 'ionicons/icons'
  import { search } from 'ionicons/icons'
  import { copyFullAddress } from '/src/assets/contracts/WalletHelper.vue'

  const props = defineProps([
    'tableData', 
    'isLoading',
    'uniqueVoterData', 
    'uniqueVoterCount',
    'searchAddress',
    'displayName',
    'uniqueVoterHashMap'
  ])

  const emits = defineEmits(['toggleVoterCanidateTable', 'toggleUniqueTable'])

  var popoverOpen = ref(false)
  var event = ref()

  var copyFullAddressButtonText = ref("Copy Address")

  const tableDownload = ref()

  function passByRefWrapperCopyAddress()
  {
    copyFullAddress(copyFullAddressButtonText, event.value.voterAddress)
  }

  function exportCSV (e: Event) 
  {
    tableDownload.value.exportCSV()
  }

  const filters= ref({
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  function openPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.voterDisplayName = rowData.displayName
    event.value.voterAddress = rowData.voterAddress

    const contributionTotalObject = props.uniqueVoterHashMap.get(rowData.voterAddress)
    event.value.contributionTotal = contributionTotalObject.contributionTotal
    event.value.contributionTotalString = contributionTotalObject.contributionTotalString
    event.value.amountSpent = contributionTotalObject.amountSpent

    popoverOpen.value = true  
  }

  function toggleRecordTable()
  {
    localStorage.setItem("toggleVoterCanidateTable", "true")
    emits('toggleVoterCanidateTable')
  }

  function toggleUniqueRecordTable()
  {
    localStorage.setItem("toggleUniqueTable", "true")
    emits('toggleUniqueTable')
  }
</script>

<style scoped>
  .tableMinWidth
  {
    min-width: 757px
  }

  /* Leaving for information purposes
  .number:lt(0)
  {
    color: var(--ion-color-success)!important
  }

  .p-datatable-tbody:lt(0)
  {
    color: var(--ion-color-success)!important
  }
*/

  ion-input
  {
    --highlight-color: var(--ion-color-gray)
  }
</style>