<template>
  <div class="tableContainer">
    <DataTable
      ref="tableRef"
      class="tableMinWidth"
      paginator 
      :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      dataKey="id" 
      v-model:filters="filters" 
      show-gridlines 
      size="small"
      :value="tableData"
      v-model:expandedRows="subTableData"
      v-model:sortField="sortField"
      v-model:sortOrder="sortOrder"
      :loading="isLoading"
      @sort="handleSort($event)"
      :globalFilterFields="
      [
        'id',
        'ranking',
        'displayName',
        'submitterAddress',
        'approvedClaimAmountString',
        'approvedClaimCount',
        'patientCount',
        'submittedClaimCount',
        'submittedAppealCount',
        'deniedClaimCount',
        'deniedAppealCount',
        'maxDeniedClaimCount',
        'undeniedClaimCount',
        'revokedApprovalCount',
        'accountListWithLastestMonthlyStatement.accountName'
      ]"
    >
      <template #header>
        <div>
          <div class="flexCenterRow">
            <div style="margin-bottom: 4px">
              <InfoButton :infoMessage="m4aLeaderBoardInfoMSG" />
            </div>
            <h2>M4A Leader Board</h2>
          </div>

          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="M4A Leader Board Search     ">
            <ion-icon class="tableSearchIcon" slot="start" :icon="search"></ion-icon>
          </ion-input>

          <ion-button fill="clear" @click="expandSubTables()">
            <ion-label  color="dark">Expand Submitters</ion-label>
          </ion-button>

          <ion-button fill="clear" @click="exportCSV($event)">
            <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
          </ion-button>

          <ion-button fill="clear" @click="subTableData={}">
            <ion-label  color="dark">Collapse Submitters</ion-label>
          </ion-button>
        </div>
      </template>
      <template #loading> Loading Lending Leader Board. Please Wait. </template>
      <Column expander style="width: 0%"/>
      <Column field="ranking" header="Ranking" style="width: 0%"></Column>
      <Column field="displayName" header="Submitter" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-button fill="clear" style="margin: 0px; margin-left: -15px" @click="openSubmitterPopover($event, slotProps.data)">
            <div class="flexCenterRowHeight">
              <div class="smallMarginLeft" >
                <div v-if=" slotProps.data.submitterAddress==adminAccounts.m4aCEOAddress">
                  <RIPKingStarWolf v-if="adminAccounts.ceoIsDead && slotProps.data.ranking==1" class="starWolfButton" style="margin-left: -7px; margin-right: -5px"/>
                  <RIPStarWolf v-else-if="adminAccounts.ceoIsDead" class="starWolfButton" :fill="slotProps.data.ranking==1 ? '#ffd700' :
                  slotProps.data.ranking == 2 ? '#b5bbcad3' :
                  slotProps.data.ranking == 3 ? '#a77822' : '#39bd39'"/>
                  <KingStarWolf v-else-if="slotProps.data.ranking==1" class="starWolfButton" style="margin-left: -7px; margin-right: -5px"/>
                  <StarWolf v-else class="starWolfButton" :fill="slotProps.data.ranking == 2 ? '#b5bbcad3' :
                  slotProps.data.ranking == 3 ? '#a77822' : '#39bd39'"/>
                </div>
                <div v-else>
                  <KingStarWolf v-if="slotProps.data.ranking==1" class="starWolfButton" style="margin-left: -7px; margin-right: -5px"/>
                  <StarWolf v-else class="starWolfButton" :fill="slotProps.data.ranking == 2 ? '#b5bbcad3' :
                  slotProps.data.ranking == 3 ? '#a77822' :
                  darkTheme.value ? '#FFFFFF' : '#000000'"/>
                </div>
              </div>

              <ion-label v-if="slotProps.data.submitterAddress!=adminAccounts.m4aCEOAddress" color="dark" class="noWrapText">{{ slotProps.data.displayName }}</ion-label>
              <ion-label v-else color="green" class="noWrapText">{{ slotProps.data.displayName }}</ion-label>
            </div>
          </ion-button>
          <ion-popover 
          :is-open="submitterPopoverOpen" 
          :event="event" 
          @didDismiss="submitterPopoverOpen=false"
          side="top" 
          alignment="center"
          >
            <div @mouseleave="closeSubmitterPopover($event)">
              <ion-button class="copyAddressButton thinBorder" color="light" @click="passByRefWrapperCopyAddress()">
                <ion-label color="gray">{{ copyFullAddressButtonText }}</ion-label>
              </ion-button>
              <ion-button class="copyAddressButton thinBorder" color="light" @click="viewSelectedSubmitter()">
                <ion-label color="gray">View</ion-label>
              </ion-button>
            </div>
          </ion-popover>
        </template>
      </Column>
      <Column field="approvedClaimAmount" style="width: 0%" class="rainbowText" sortable>
        <template #header>
          <span class="rainbowText" style="font-weight: bold">Approved Claim Value</span>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.approvedClaimAmountString }}
        </template>
      </Column>
      <Column field="approvedClaimCount" header="Approved Claims" style="width: 0%; color: #39bd39" sortable></Column>
      <Column field="patientCount" header="Total Patients" style="width: 0%; color: #557fcc" sortable></Column>
      <Column field="submittedClaimCount" header="Submitted Claims" style="width: 0%; color: #ffd700" sortable></Column>
      <Column field="submittedAppealCount" header="Submitted Appeals" style="width: 0%; color: #ffd700" sortable></Column>
      <Column field="deniedClaimCount" header="Denied Claims" style="width: 0%; color: red" sortable></Column>
      <Column field="deniedAppealCount" header="Denied Appeals" style="width: 0%; color: red" sortable></Column>
      <Column field="maxDeniedClaimCount" header="Max Denied Claims" style="width: 0%; color: red" sortable></Column>
      <Column field="undeniedClaimCount" header="Undenied Claims" style="width: 0%; color: #8a2be2" sortable></Column>
      <Column field="revokedApprovalCount" style="width: 0%" class="poopText" sortable>
        <template #header>
          <span class="poopText" style="font-weight: bold">Revoked Approvals</span>
        </template>
      </Column>
      <template #expansion="slotProps">
        <DataTable :value="slotProps.data.patientList" style="font-size: 5px">
          <Column field="name" header="Patient" style="width: 0%" sortable></Column>
          <Column field="approvedClaimAmount" style="width: 0%" class="rainbowText" sortable>
            <template #header>
              <span class="rainbowText" style="font-weight: bold">Approved Claim Value</span>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.approvedClaimAmountString }}
            </template>
          </Column>
          <Column field="approvedClaimCount" header="Approved Claims" style="width: 0%; color: #39bd39" sortable></Column>
          <Column field="submittedClaimCount" header="Submitted Claims" style="width: 0%; color: #ffd700" sortable></Column>
          <Column field="submittedAppealCount" header="Submitted Appeals" style="width: 0%; color: #ffd700" sortable></Column>
          <Column field="deniedClaimCount" header="Denied Claims" style="width: 0%; color: red" sortable></Column>
          <Column field="deniedAppealCount" header="Denied Appeals" style="width: 0%; color: red" sortable></Column>
          <Column field="maxDeniedClaimCount" header="Max Denied Claims" style="width: 0%; color: red" sortable></Column>
          <Column field="undeniedClaimCount" header="Undenied Claims" style="width: 0%; color: #8a2be2" sortable></Column>
          <Column field="revokedApprovalCount" style="width: 0%" class="poopText" sortable>
            <template #header>
              <span class="poopText" style="font-weight: bold">Revoked Approvals</span>
            </template>
          </Column>
        </DataTable>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, inject, type Component, markRaw } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonPopover, IonText } from '@ionic/vue'
  import { search, download } from 'ionicons/icons'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import RIPStarWolf from '/src/assets/svg/rip-star-wolf-svg.vue'
  import KingStarWolf from '/src/components/fancy/KingStarWolf.vue'
  import RIPKingStarWolf from '/src/components/fancy/rip/RIPKingStarWolf.vue' 
  import { FilterMatchMode } from '@primevue/core/api'
  import { m4aLeaderBoard } from '/src/assets/globalStates/m4a/SubmittersAndPatients.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { copyAddress, copyFullAddressText } from '/src/assets/contracts/WalletHelper.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import InfoButton from '/src/components/help/InfoButton.vue'

  const emits = defineEmits(['viewSelectedSubmitter'])
  
  var tableRef = ref()
  var tableData = ref()
  var subTableData = ref()
  var isLoading = ref(true)
  var previousSortField = "approvedClaimAmount"
  var sortField = ref("approvedClaimAmount")
  var sortOrder = ref(-1)

  const m4aLeaderBoardInfoMSG = "You can view a Submitter by\nclicking on them."

  var event = ref()
  var submitterPopoverOpen = ref(false)
  var copyFullAddressButtonText = ref(copyFullAddressText)

  onMounted(() =>
  {
    if(m4aLeaderBoard.data)
    {
      tableData.value = m4aLeaderBoard.data;console.log(tableData.value)
      updateLeaderBoardDisplayNames()
      sortTable()
      isLoading.value = false
    }
  })

  watch(m4aLeaderBoard,() =>
  {
    tableData.value = m4aLeaderBoard.data
    sortTable()
    if(isLoading.value)
      isLoading.value = false
  })

  watch(customUserNameHashMap,() =>
  {
    updateLeaderBoardDisplayNames()
    sortTable()//Sort again incase name change caused a change the rankings
  })

  function updateLeaderBoardDisplayNames()
  {
    if(tableData.value == undefined)
      return

    for(var i=0; i<tableData.value.length; i++)
      tableData.value[i].displayName = getCustomOrTrimmedUserDisplayName(tableData.value[i].submitterAddress)
  }

  function sortTable()
  {
    if(tableData.value == undefined)
      return

    switch (sortField.value)
    {
      case"displayName":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => a.displayName.localeCompare(b.displayName))
        setRankingColumn(true)
        break
      }
      case "approvedClaimAmount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.approvedClaimAmount - a.approvedClaimAmount)
        setRankingColumn()
        break
      }
      case "approvedClaimCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.approvedClaimCount - a.approvedClaimCount)
        setRankingColumn()
        break
      }
      case "patientCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.patientCount - a.patientCount)
        setRankingColumn()
        break
      }
      case "submittedClaimCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.submittedClaimCount - a.submittedClaimCount)
        setRankingColumn()
        break
      }
      case "submittedAppealCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.submittedAppealCount - a.submittedAppealCount)
        setRankingColumn()
        break
      }
      case "deniedClaimCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.deniedClaimCount - a.deniedClaimCount)
        setRankingColumn()
        break
      }
      case "deniedAppealCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.deniedAppealCount - a.deniedAppealCount)
        setRankingColumn()
        break
      }
      case "maxDeniedClaimCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.maxDeniedClaimCount - a.maxDeniedClaimCount)
        setRankingColumn()
        break
      }
      case "undeniedClaimCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.undeniedClaimCount - a.undeniedClaimCount)
        setRankingColumn()
        break
      }
      case "revokedApprovalCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.revokedApprovalCount - a.revokedApprovalCount)
        setRankingColumn()
        break
      }
      default:
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.approvedClaimCount - a.approvedClaimCount)
        setRankingColumn()
        break
      }
    }
  }

  function setRankingColumn(reverse = false)
  {
    for(var i=0; i<tableData.value.length; i++)
      tableData.value[i].ranking = i + 1

    if(reverse)
      sortOrder.value = -1
  }

  function openSubmitterPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.submitterAddress = rowData.submitterAddress

    submitterPopoverOpen.value = true
  }

  function closeSubmitterPopover(e: Event) 
  {
    event.value = e
    submitterPopoverOpen.value = false
  }

  function passByRefWrapperCopyAddress()
  {
    copyAddress(copyFullAddressButtonText, event.value.submitterAddress)
  }

  function viewSelectedSubmitter()
  {
    submitterPopoverOpen.value = false

    //Need this delay so that the popover has time to close before emitting
    setTimeout(() =>
    {
      emits("viewSelectedSubmitter", event.value.submitterAddress)
    }, 100) 
  }

  function handleSort(event: any)
  {
    if(previousSortField != sortField.value)
      setTimeout(() =>
      {
        sortOrder.value = event.sortOrder * -1
      }, 0)

    previousSortField = sortField.value

    sortTable()
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  function exportCSV(e: Event) 
  {
    tableRef.value.exportCSV()
  }

  const expandSubTables = () => 
  {
    subTableData.value = tableData.value.reduce((acc: { [x: string]: boolean }, p: { id: string | number }) => (acc[p.id] = true) && acc, {})
  }
</script>

<style scoped>
ion-input
  {
    --highlight-color: var(--ion-color-green)
  }

  .tableMinWidth
  {
    min-width:1664px
  }
</style>