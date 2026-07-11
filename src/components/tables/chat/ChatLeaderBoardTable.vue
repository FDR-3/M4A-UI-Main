<template>
  <div class="tableContainer">
    <DataTable
      ref="tableRef"
      id="chatLeaderBoardTable"
      class="tableMinWidth"
      paginator 
      :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      dataKey="id" 
      v-model:filters="filters" 
      show-gridlines 
      size="small"
      :value="tableData"
      v-model:sortField="sortField"
      v-model:sortOrder="sortOrder"
      :loading="isLoading"
      @sort="handleSort($event)"
      :globalFilterFields="
      [
        'ranking',
        'displayName',
        'userAddress',
        'voteMoneyEarnedString',
        'netReceivedVoteScore',
        'netCastedVoteScore',
        'votesReceivedCount',
        'upVoteReceivedCount',
        'downVoteReceivedCount',
        'votesCastedCount',
        'upVoteCastedCount',
        'downVoteCastedCount',
        'commentAndReplyCount',
        'editedCommentAndReplyCount',
        'deletedCommentAndReplyCount',
        'ceoStarredCommentAndReplyCount',
        'ceoMarkedFEDCommentAndReplyCount'
      ]"
    >
      <template #header>
        <div>
          <div class="flexCenterRow">
            <div style="margin-bottom: 4px">
              <InfoButton :infoMessage="chatLeaderBoardInfoMSG" />
            </div>
            <h2>Chat Leader Board</h2>
          </div>

          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="Chat Leader Board Search     ">
            <ion-icon class="tableSearchIcon" slot="start" :icon="search"></ion-icon>
          </ion-input>

          <ion-button fill="clear" @click="exportCSV($event)">
            <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
          </ion-button>
        </div>
      </template>
      <template #loading> Loading Lending Leader Board. Please Wait. </template>
      <Column field="ranking" header="Ranking" style="width: 0%"></Column>
      <Column field="displayName" header="User" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-button fill="clear" style="margin: 0px; margin-left: -15px" @click="openUserPopover($event, slotProps.data)">
            <div class="flexCenterRowHeight">
              <div class="smallMarginLeft" >
                <div v-if=" slotProps.data.userAddress==adminAccounts.chatCEOAddress">
                  <RIPKingStarWolf v-if="adminAccounts.ceoIsDead && slotProps.data.ranking==1" class="kingStarWolfButton" style="margin-left: -7px; margin-right: -5px"/>
                  <RIPStarWolf v-else-if="adminAccounts.ceoIsDead" class="starWolfButton" :fill="slotProps.data.ranking==1 ? '#ffd700' :
                  slotProps.data.ranking == 2 ? '#b5bbcad3' :
                  slotProps.data.ranking == 3 ? '#a77822' : '#39bd39'"/>
                  <KingStarWolf v-else-if="slotProps.data.ranking==1" class="kingStarWolfButton" style="margin-left: -7px; margin-right: -5px"/>
                  <StarWolf v-else class="starWolfButton" :fill="slotProps.data.ranking == 2 ? '#b5bbcad3' :
                  slotProps.data.ranking == 3 ? '#a77822' : '#39bd39'"/>
                </div>
                <div v-else>
                  <KingStarWolf v-if="slotProps.data.ranking==1" class="kingStarWolfButton" style="margin-left: -7px; margin-right: -5px"/>
                  <StarWolf v-else class="starWolfButton" :fill="slotProps.data.ranking == 2 ? '#b5bbcad3' :
                  slotProps.data.ranking == 3 ? '#a77822' :
                  darkTheme.value ? '#FFFFFF' : '#000000'"/>
                </div>
              </div>

              <ion-label v-if="slotProps.data.userAddress!=adminAccounts.chatCEOAddress" color="dark" class="noWrapText">{{ slotProps.data.displayName }}</ion-label>
              <ion-label v-else color="green" class="noWrapText">{{ slotProps.data.displayName }}</ion-label>
            </div>
          </ion-button>
          <ion-popover 
          :is-open="ownerPopoverOpen" 
          :event="event" 
          @didDismiss="ownerPopoverOpen=false"
          side="top" 
          alignment="center"
          >
            <div @mouseleave="closeUserPopover($event)">
              <ion-button class="copyAddressButton thinBorder" color="light" @click="passByRefWrapperCopyAddress()">
                <ion-label color="gray">{{ copyFullAddressButtonText }}</ion-label>
              </ion-button>
              <ion-button class="copyAddressButton thinBorder" color="light" @click="viewSelectedUser()">
                <ion-label color="gray">View</ion-label>
              </ion-button>
            </div>
          </ion-popover>
        </template>
      </Column>
      <Column field="voteMoneyEarned" style="width: 0%" class="rainbowText" sortable>
        <template #header>
          <span class="rainbowText" style="font-weight: bold">Vote Money Earned</span>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.voteMoneyEarnedString }}
        </template>
      </Column>
      <Column field="netReceivedVoteScore" header="Net Vote Score Received" style="width: 0%; color: #ffd700" sortable></Column>
      <Column field="netCastedVoteScore" header="Net Vote Score Casted" style="width: 0%; color: #ffd700" sortable></Column>
      <Column field="votesReceivedCount" header="Votes Received" style="width: 0%; color: #ffd700" sortable></Column>
      <Column field="upVoteReceivedCount" header="Up Votes Received" style="width: 0%; color: #39bd39" sortable></Column>
      <Column field="downVoteReceivedCount" header="Down Votes Received" style="width: 0%; color: red" sortable></Column>
      <Column field="votesCastedCount" header="Votes Casted" style="width: 0%; color: #ffd700" sortable></Column>
      <Column field="upVoteCastedCount" header="Up Votes Casted" style="width: 0%; color: #39bd39" sortable></Column>
      <Column field="downVoteCastedCount" header="Down Votes Casted" style="width: 0%; color: red" sortable></Column>
      <Column field="commentAndReplyCount" header="Posts" style="width: 0%; color: #39bd39" sortable></Column>
      <Column field="editedCommentAndReplyCount" header="Edits" style="width: 0%; color: #557fcc" sortable></Column>
      <Column field="deletedCommentAndReplyCount" header="Deletes" style="width: 0%; color: red" sortable></Column>
      <Column field="ceoStarredCommentAndReplyCount" style="width: 0%" class="rainbowText" sortable>
        <template #header>
          <span class="rainbowText" style="font-weight: bold">Starred Posts</span>
        </template>
      </Column>
      <Column field="ceoMarkedFEDCommentAndReplyCount" style="width: 0%" class="poopText" sortable>
        <template #header>
          <span class="poopText" style="font-weight: bold">Marked Fed Posts</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, inject } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonPopover } from '@ionic/vue'
  import { search, download } from 'ionicons/icons'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import RIPStarWolf from '/src/assets/svg/rip-star-wolf-svg.vue'
  import KingStarWolf from '/src/components/fancy/KingStarWolf.vue'
  import RIPKingStarWolf from '/src/components/fancy/rip/RIPKingStarWolf.vue' 
  import { FilterMatchMode } from '@primevue/core/api'
  import { chatLeaderBoard } from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { copyAddress, copyFullAddressText } from '/src/assets/contracts/WalletHelper.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import InfoButton from '/src/components/help/InfoButton.vue'
  
  const emits = defineEmits(['viewSelectedUser'])

  var tableRef = ref()
  var tableData = ref()
  var isLoading = ref(true)
  var previousSortField = "voteMoneyEarned"
  var sortField = ref("voteMoneyEarned")
  var sortOrder = ref(-1)

  const chatLeaderBoardInfoMSG = "You can view a User by clicking on them."

  var event = ref()
  var ownerPopoverOpen = ref(false)
  var copyFullAddressButtonText = ref(copyFullAddressText)

  onMounted(() =>
  {
    if(chatLeaderBoard.data)
    {
      tableData.value = chatLeaderBoard.data
      sortTable()
      isLoading.value = false
    }
  })

  watch(chatLeaderBoard,() =>
  {
    tableData.value = chatLeaderBoard.data
    sortTable()
    if(isLoading.value)
      isLoading.value = false
  })

  watch(customUserNameHashMap, () =>
  {
    sortTable()//Sort again incase name change caused a change the rankings
  })

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
      case "voteMoneyEarned":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.voteMoneyEarned - a.voteMoneyEarned)
        setRankingColumn()
        break
      }
      case "netReceivedVoteScore":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.netReceivedVoteScore - a.netReceivedVoteScore)
        setRankingColumn()
        break
      }
      case "netCastedVoteScore":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.netCastedVoteScore - a.netCastedVoteScore)
        setRankingColumn()
        break
      }
      case "votesReceivedCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.votesReceivedCount - a.votesReceivedCount)
        setRankingColumn()
        break
      }
      case "upVoteReceivedCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.upVoteReceivedCount - a.upVoteReceivedCount)
        setRankingColumn()
        break
      }
      case "downVoteReceivedCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.downVoteReceivedCount - a.downVoteReceivedCount)
        setRankingColumn()
        break
      }
      case "votesCastedCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.votesCastedCount - a.votesCastedCount)
        setRankingColumn()
        break
      }
      case "upVoteCastedCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.upVoteCastedCount - a.upVoteCastedCount)
        setRankingColumn()
        break
      }
      case "downVoteCastedCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.downVoteCastedCount - a.downVoteCastedCount)
        setRankingColumn()
        break
      }
      case "commentAndReplyCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.commentAndReplyCount - a.commentAndReplyCount)
        setRankingColumn()
        break
      }
      case "editedCommentAndReplyCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.editedCommentAndReplyCount - a.editedCommentAndReplyCount)
        setRankingColumn()
        break
      }
      case "deletedCommentAndReplyCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.deletedCommentAndReplyCount - a.deletedCommentAndReplyCount)
        setRankingColumn()
        break
      }
      case "ceoStarredCommentAndReplyCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.ceoStarredCommentAndReplyCount - a.ceoStarredCommentAndReplyCount)
        setRankingColumn()
        break
      }
      case "ceoMarkedFEDCommentAndReplyCount":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.ceoMarkedFEDCommentAndReplyCount - a.ceoMarkedFEDCommentAndReplyCount)
        setRankingColumn()
        break
      }
      default:
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.voteMoneyEarned - a.voteMoneyEarned)
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

  function openUserPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.userAddress = rowData.userAddress

    ownerPopoverOpen.value = true
  }

  function closeUserPopover(e: Event) 
  {
    //Need this delay so that emits("viewSelectedUser") data doesn't get over ruled
    setTimeout(() =>
    {
      event.value = e
      ownerPopoverOpen.value = false
    }, 100)
  }

  function passByRefWrapperCopyAddress()
  {
    copyAddress(copyFullAddressButtonText, event.value.userAddress)
  }

  function viewSelectedUser()
  {
    ownerPopoverOpen.value = false

    //Need this delay so that the popover has time to close before emitting
    setTimeout(() =>
    {
      emits("viewSelectedUser", event.value.userAddress)
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
</script>

<style scoped>
ion-input
  {
    --highlight-color: var(--ion-color-green)
  }
  
  
  #test :deep(.p-datatable-tbody > tr)
  {
    height: 75px
  }

  /*Set row height to higest possible value*/
  #chatLeaderBoardTable :deep(.p-datatable-tbody > tr)
  {
    height: 64px;
  }

  #chatLeaderBoardTable :deep(th)
  {
    font-size: min(4vw, 12px)
  }

  #chatLeaderBoardTable :deep(td)
  {
    font-size: min(4vw, 14px)
  }

  .tableMinWidth
  {
    min-width:1664px
  }
</style>