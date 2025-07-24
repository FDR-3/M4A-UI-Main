<template>
  <div class="tableContainer">
    <DataTable 
      class="tableMinWidth"
      show-gridlines 
      paginator :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]"
      sortField="pollRecordId" 
      :sortOrder="-1" 
      size="small" 
      :value="tableData"
      :globalFilterFields="
      [
        'pollRecordId',
        'pollOptionName',
        'displayName',
        'displayNamePossiblyTrimmed',
        'voterAddress',
        'unixCreationTimeStamp',
        'creationTimeString',
        'creationDateString',
        'voteAmount',
        'voteAmountString',
        'absoluteVoteAmount',
        'amountSpentString'
      ]" 
      ref="tableDownload" 
      v-model:filters="filters"
      :loading=isLoading
    >
      <template #header>
        <div>
          <h1>Poll Vote Records</h1>
          <ion-input color="dark" v-model="filters['global'].value " fill="outline" placeholder="Voter Record Search    ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>
          <div class="voterTableUtilityBar">
            <ion-label slot="start" color="dark">Unique Voters: {{ "uniqueVoterCount" }}</ion-label>
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

      <Column field="pollRecordId" header="Vote Record Id" style="width: 5%" sortable></Column>
      <Column field="voterAddress" header="Voter Address" style="width: 30%" sortField="displayName" sortable>
        <template #body="slotProps">
          <div>
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
      <Column field="pollOptionName" header="Poll Option" style="width: 28%" sortable></Column>
      <Column field="unixCreationTimeStamp" header="Time/Date" style="width: 10%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.creationTimeString }}
          <br>
          {{ slotProps.data.creationDateString }}
        </template>
      </Column>
      <Column field="voteAmount" header="Vote Score" style="width: 5%" sortable>
        <template #body="slotProps">
          <ion-label v-if="slotProps.data.voteAmount > 0" class="positive">{{ slotProps.data.voteAmountString }}</ion-label>
          <ion-label v-else class="negative">{{ slotProps.data.voteAmountString }}</ion-label>
        </template>
      </Column>
      <Column field="absoluteVoteAmount" header="Amount Spent" style="width: 5%" sortable>
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

  const props = defineProps(['uniqueVoterHashMap', 'tableData', 'isLoading'])

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

    const contributionTotalObject = props.uniqueVoterHashMap.get(rowData.voterAddress + rowData.pollOptionName)
    event.value.netVoteScoreContribution= contributionTotalObject.netVoteScoreContribution
    event.value.netVoteScoreContributionString = contributionTotalObject.netVoteScoreContributionString
    event.value.absoluteVoteAmountString = contributionTotalObject.absoluteVoteAmountString
    event.value.amountSpentString = contributionTotalObject.amountSpentString

    popoverOpen.value = true  
  }

  function toggleUniquePollRecordTable()
  {
    localStorage.setItem("toggleUniquePollTable", "true")
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