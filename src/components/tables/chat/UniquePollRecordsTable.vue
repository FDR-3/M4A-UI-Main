<template>
  <div class="tableContainer">
    <DataTable 
      class="tableMinWidth"
      show-gridlines 
      paginator :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]"
      sortField="displayName" 
      :sortOrder="-1" 
      size="small" 
      :value="tableData"
      :globalFilterFields="
      [
        'displayName',
        'displayNamePossiblyTrimmed',
        'voterAddress',
        'pollOptionName',
        'netVoteScoreContribution',
        'netVoteScoreContributionString',
        'absoluteVoteAmount',
        'amountSpentString'
      ]" 
      ref="tableDownload" 
      v-model:filters="filters"
      :loading="loading"
    >
      <template #header>
        <div>
          <h1>Unique Poll Voter Option List</h1>

          <ion-input color="dark" v-model="filters['global'].value " fill="outline" placeholder="Unique Voter Search    ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <div class="voterTableUtilityBar">
            <ion-label slot="start" color="dark">Unique Voters: {{ uniqueVoterCount }}</ion-label>
            <ion-button style="margin-left: 18px" fill="clear" @click="exportCSV($event)">
              <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
            </ion-button>
            <ion-button color="dark" @click="toggleUniquePollRecordTable()">
              <ion-label slot="end" color="light">Toggle Unique</ion-label>
            </ion-button>
          </div>
        </div>
      </template>
      <template #empty> No records found. </template>
      <template #loading> Loading records. Please wait. </template>

      <Column field="voterAddress" header="Unique Voter Address" style="width: 40%" sortField="displayName" sortable>
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
                <ion-label color="dark">Contributions To <span class="purple">{{ event.pollOptionName }}</span> From <span class="yellow">{{ event.displayNamePossiblyTrimmed }}</span></ion-label><br>
                <ion-label v-if="event.netVoteScoreContribution > 0" >Net Vote Score:<br><span class="positive">{{ event.netVoteScoreContributionString }}</span></ion-label>
                <ion-label v-else-if="event.netVoteScoreContribution < 0" >Net Vote Score:<br><span class="negative">{{ event.netVoteScoreContributionString }}</span></ion-label>
                <ion-label v-else>Net Vote Score:<br><span>{{ event.netVoteScoreContributionString }}</span></ion-label><br>
                <ion-label>Absolute Vote Score:<br>{{ event.absoluteVoteAmountString }}</ion-label><br>
                <ion-label>Total Spent:<br><span class="rainbowText">{{ event.amountSpentString }}</span></ion-label><br>
              </div>
                <ion-button class="copyAddressButton" color="dark" @click="passByRefWrapperCopyAddress()">
                  <ion-label color="light">{{copyFullAddressButtonText}}</ion-label>
              </ion-button>
            </div>
            </ion-popover> 
          </div>
        </template>
      </Column>
      <Column field="pollOptionName" header="Option Name" style="width: 30%" sortable></Column>
      <Column field="netVoteScoreContribution" header="Net Vote Score Contribution" style="width: 10%" sortable>
        <template #body="slotProps">
          <ion-label v-if="slotProps.data.netVoteScoreContribution > 0" class="positive">{{ slotProps.data.netVoteScoreContributionString }}</ion-label>
          <ion-label v-else-if="slotProps.data.netVoteScoreContribution == 0">{{ slotProps.data.netVoteScoreContributionString }}</ion-label>
          <ion-label v-else class="negative">{{ slotProps.data.netVoteScoreContributionString }}</ion-label>
        </template>
      </Column>
      <Column field="absoluteVoteAmount" header="Total Vote Score Contribution" style="width: 5%" sortable>
        <template #body="slotProps">
          <ion-label>{{ slotProps.data.absoluteVoteAmountString }}</ion-label>
        </template>
      </Column>
      <Column field="absoluteVoteAmount" header="Total Amount Spent" style="width: 5%" sortable>
        <template #body="slotProps">
          <ion-label>{{ slotProps.data.amountSpentString }}</ion-label>
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
  import { copyFullAddress  } from '/src/assets/contracts/WalletHelper.vue'
  import * as anchor from "@coral-xyz/anchor"

  const props = defineProps(
  [
    'tableData',
    'loading',
    'uniqueVoterCount',
    'searchAddress',
    'displayName'
  ])

  const emits = defineEmits(['toggleUniquePollTable'])

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

  const filters= ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  function openPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.displayNamePossiblyTrimmed = rowData.displayNamePossiblyTrimmed
    event.value.voterAddress = rowData.voterAddress
    event.value.pollOptionName = rowData.pollOptionName
    event.value.netVoteScoreContribution= rowData.netVoteScoreContribution
    event.value.netVoteScoreContributionString = rowData.netVoteScoreContributionString
    event.value.absoluteVoteAmountString = rowData.absoluteVoteAmountString
    event.value.amountSpentString = rowData.amountSpentString

    popoverOpen.value = true
  }


  function toggleUniquePollRecordTable()
  {
    localStorage.setItem("toggleUniquePollTable", "false")
    emits('toggleUniquePollTable')
  }
</script>

<style scoped>
  .tableMinWidth
  {
    min-width:1050px
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