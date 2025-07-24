<template>
  <h1>Comment Section Table</h1>

  <div class="tableContainer">
    <DataTable
      ref="tableDownload"
      class="tableMinWidth"
      paginator 
      show-gridlines
      sortField="id" 
      :sortOrder="1" 
      :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      dataKey="id" 
      v-model:expandedRows="commentSectionStats" 
      v-model:filters="filters" 
      :value="tableData"
      :loading="isLoading"
      :globalFilterFields="
      [
        'id', 
        'commentSectionNamePrefix', 
        'processedCommentSectionName', 
        'commentSectionInitiatorAddress',
        'displayName',
        'commentAndReplyCount',
        'editedCommentAndReplyCount',
        'deletedCommentAndReplyCount',
        'ceoStarredCommentAndReplyCount',
        'ceoMarkedFedCommentAndReplyCount', 
        'postVoteCount', 
        'postVoteScore',
        'netVideoVoteScore']"
    >
      <template #header>
        <div>
          <ion-input color="dark" v-model="filters['global'].value" fill="outline" label-placement="stacked" placeholder="Comment Section Search        ">
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>

          <ion-button fill="clear" @click="expandCommentSections()">
            <ion-label  color="dark">Expand Comment Sections</ion-label>
          </ion-button>

          <ion-button fill="clear" @click="exportCSV($event)">
            <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
          </ion-button>

          <ion-button fill="clear" @click="commentSectionStats={}">
            <ion-label  color="dark">Collapse Comment Sections</ion-label>
          </ion-button>

        </div>
      </template>

      <template #empty>No records found.</template>
      <template #loading>Loading records. Please wait.</template>

      <Column expander style="width: 0%"/>
      <Column field="id" header="Id" style="width: 0%" sortable></Column>
      <Column field="commentSectionNamePrefix" header="Menu" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.commentSectionNamePrefix.replace(/_/g, " ") }}
        </template>
      </Column>
      <Column field="processedCommentSectionName" header="Comment Section Name" style="width: 0%" sortable>
      
      </Column>
      <Column field="commentSectionInitiatorAddress" header="Initiator" style="width: 10%" sortable>
        <template #body="slotProps">
          <div >
            <ion-button class="submitterButton" fill="clear" style="height: auto" @click="openUserPopover($event, slotProps.data)">
              <div v-if="slotProps.data.useCustomName" class="flexCenterRow">
                <RainbowStarWolf class="starWolfButton"/>
                <ion-label color="dark">
                    {{ slotProps.data.displayName }}
                </ion-label>
              </div>
              <div v-else class="flexCenterRow">
                <StarWolf class="starWolfButton" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
                <ion-label class="rainbowText">
                    {{ slotProps.data.displayName }}
                </ion-label>
              </div>
            </ion-button>
          </div>
          <ion-popover 
            :is-open="userPopoverOpen" 
            :event="event" 
            @didDismiss="userPopoverOpen = false"
            side="top" 
            alignment="center"
          >
            <div class="thinBorder flexCenterColumn chatTablePopupContainer">
              <div class="flexCenterRow">
                <ion-button class="copyAddressButton" color="dark" @click="passByRefWrapperCopyAddress()">
                    <ion-label color="light">{{copyFullAddressButtonText}}</ion-label>
                </ion-button>
              </div>
            </div>
          </ion-popover>
        </template>
      </Column>
      <Column field="commentAndReplyCount" header="Posts" style="width: 0%" sortable></Column>
      <Column field="editedCommentAndReplyCount" header="Edits" style="width: 0%" sortable></Column>
      <Column field="deletedCommentAndReplyCount" header="Deletes" style="width: 0%" sortable></Column>
      <Column field="ceoStarredCommentAndReplyCount" header="Stars" style="width: 0%" sortable></Column>
      <Column field="ceoMarkedFedCommentAndReplyCount" header="FEDs" style="width: 0%" sortable></Column>
      <Column field="postVoteCount" header="Post Vote Count" style="width: 0%" sortable></Column>
      <Column field="postVoteScore" header="Post Net Vote Score" style="width: 0%" sortable></Column>
      <Column field="netVideoVoteScore" header="Video Net Vote Score" style="width: 0%" sortable></Column>
      <Column header="Select" style="width: 0%">
        <template #body="slotProps">
          <div>
            <ion-button 
              v-if="slotProps.data.commentSectionName!='EndGame'"
              class="actionButton" color="dark"
              @click="jumpToCommentSection(slotProps.data)"
              :router-link="'/' + slotProps.data.commentSectionNamePrefix"
              router-direction="root"
            >
              Jump To
            </ion-button> 
            <p v-else align="center">You Are Here</p>
          </div>
        </template>
      </Column>
      <template #expansion="slotProps">
        <DataTable :value="[slotProps.data]">
          <Column field="commentCount" header="Comments" style="width: 10%"></Column>
          <Column field="replyCount" header="Replies" style="width: 10%"></Column>
          <Column field="replyLv3Count" header="Lv3 Replies" style="width: 10%"></Column>
          <Column field="replyLv4Count" header="Lv4 Replies Or Higher" style="width: 10%"></Column>
        </DataTable>
        <DataTable :value="[slotProps.data]">
          <Column field="editedCommentCount" header="Edited Comments" style="width: 10%"></Column>
          <Column field="editedReplyCount" header="Edited Replies" style="width: 10%"></Column>
          <Column field="editedLv3ReplyCount" header="Edited Lv3 Replies" style="width: 10%"></Column>
          <Column field="editedLv4ReplyCount" header="Edited Lv4 Replies Or Higher" style="width: 10%"></Column>
        </DataTable>
        <DataTable :value="[slotProps.data]">
          <Column field="deletedCommentCount" header="Deleted Comments" style="width: 10%"></Column>
          <Column field="deletedReplyCount" header="Deleted Replies" style="width: 10%"></Column>
          <Column field="deletedLv3ReplyCount" header="Deleted Lv3 Replies" style="width: 10%"></Column>
          <Column field="deletedLv4ReplyCount" header="Deleted Lv4 Replies Or Higher" style="width: 10%"></Column>
        </DataTable>
        <DataTable :value="[slotProps.data]">
          <Column field="ceoStarredCommentCount" header="CEO Starred Comments" style="width: 10%"></Column>
          <Column field="ceoStarredReplyCount" header="CEO Starred Replies" style="width: 10%"></Column>
          <Column field="ceoStarredLv3ReplyCount" header="CEO Starred Lv3 Replies" style="width: 10%"></Column>
          <Column field="ceoStarredLv4ReplyCount" header="CEO Starred Lv4 Replies Or Higher" style="width: 10%"></Column>
        </DataTable>
        <DataTable :value="[slotProps.data]">
          <Column field="ceoMarkedFedCommentCount" header="CEO Marked FED Comments" style="width: 10%"></Column>
          <Column field="ceoMarkedFedReplyCount" header="CEO Marked FED Replies" style="width: 10%"></Column>
          <Column field="ceoMarkedFedLv3ReplyCount" header="CEO Marked FED Lv3 Replies" style="width: 10%"></Column>
          <Column field="ceoMarkedFedLv4ReplyCount" header="CEO Marked FED Lv4 Replies Or Higher" style="width: 10%"></Column>
        </DataTable>
        <DataTable :value="[slotProps.data]">
          <Column field="commentVotesCastedCount" header="Comment Total Vote Count" style="width: 10%"></Column>
          <Column field="replyVotesCastedCount" header="Reply Total Vote Count" style="width: 10%"></Column>
          <Column field="replyToReplyVotesCastedCount" header="Reply To Reply Total Vote Count" style="width: 10%"></Column>
          <Column field="replyToLv3ReplyVotesCastedCount" header="Lv4 Replies Or Higher, Total Vote Count" style="width: 10%"></Column>
        </DataTable>
        <DataTable :value="[slotProps.data]">
          <Column field="commentUpVoteCount" header="Comment Up Vote Count" style="width: 10%"></Column>
          <Column field="replyUpVoteCount" header="Reply Up Vote Count" style="width: 10%"></Column>
          <Column field="replyLv3UpVoteCount" header="Reply To Reply Up Vote Count" style="width: 10%"></Column>
          <Column field="replyLv4UpVoteCount" header="Lv4 Replies Or Higher, Up Vote Count" style="width: 10%"></Column>
        </DataTable>
        <DataTable :value="[slotProps.data]">
          <Column field="commentDownVoteCount" header="Comment Down Vote Count" style="width: 10%">
            <template #body="slotProps">
              <span v-if="slotProps.data.commentDownVoteCount.toNumber() > 0">-</span>{{ slotProps.data.commentDownVoteCount }}
            </template>
          </Column>
          <Column field="replyDownVoteCount" header="Reply Down Vote Count" style="width: 10%">
            <template #body="slotProps">
              <span v-if="slotProps.data.replyDownVoteCount.toNumber() > 0">-</span>{{ slotProps.data.replyDownVoteCount }}
            </template>
          </Column>
          <Column field="replyLv3DownVoteCount" header="Reply To Reply Down Vote Count" style="width: 10%">
            <template #body="slotProps">
              <span v-if="slotProps.data.replyLv3DownVoteCount.toNumber() > 0">-</span>{{ slotProps.data.replyLv3DownVoteCount }}
            </template>
          </Column>
          <Column field="replyLv4DownVoteCount" header="Lv4 Replies Or Higher, Down Vote Count" style="width: 10%">
            <template #body="slotProps">
              <span v-if="slotProps.data.replyLv4DownVoteCount.toNumber() > 0">-</span>{{ slotProps.data.replyLv4DownVoteCount }}
            </template>
          </Column>
        </DataTable>
        <DataTable :value="[slotProps.data]">
          <Column field="commentNetVoteScore" header="Comment Net Vote Score" style="width: 10%"></Column>
          <Column field="replyNetVoteScore" header="Reply Net Vote Score" style="width: 10%"></Column>
          <Column field="replyToReplyNetVoteScore" header="Reply To Reply Net Vote Score" style="width: 10%"></Column>
          <Column field="replyToLv3ReplyNetVoteScore" header="Lv4 Replies Or Higher, Net Vote Score" style="width: 10%"></Column>
        </DataTable>
        <DataTable :value="[slotProps.data]">
          <Column field="commentUpVoteScore" header="Comment Up Vote Score" style="width: 10%"></Column>
          <Column field="replyUpVoteScore" header="Reply Up Vote Score" style="width: 10%"></Column>
          <Column field="replyToReplyUpVoteScore" header="Reply To Reply Up Vote Score" style="width: 10%"></Column>
          <Column field="replyToLv3ReplyUpVoteScore" header="Lv4 Replies Or Higher, Up Vote Score" style="width: 10%"></Column>
        </DataTable>
        <DataTable :value="[slotProps.data]">
          <Column field="commentDownVoteScore" header="Comment Down Vote Score" style="width: 10%">
            <template #body="slotProps">
              <span v-if="slotProps.data.commentDownVoteScore.toNumber() > 0">-</span>{{ slotProps.data.commentDownVoteScore }}
            </template>
          </Column>
          <Column field="replyDownVoteScore" header="Reply Down Vote Score" style="width: 10%">
            <template #body="slotProps">
              <span v-if="slotProps.data.replyDownVoteScore.toNumber() > 0">-</span>{{ slotProps.data.replyDownVoteScore }}
            </template>
          </Column>
          <Column field="replyToReplyDownVoteScore" header="Reply To Reply Down Vote Score" style="width: 10%">
            <template #body="slotProps">
              <span v-if="slotProps.data.replyToReplyDownVoteScore.toNumber() > 0">-</span>{{ slotProps.data.replyToReplyDownVoteScore }}
            </template>
          </Column>
          <Column field="replyToLv3ReplyDownVoteScore" header="Lv4 Replies Or Higher, Down Vote Score" style="width: 10%">
            <template #body="slotProps">
              <span v-if="slotProps.data.replyToLv3ReplyDownVoteScore.toNumber() > 0">-</span>{{ slotProps.data.replyToLv3ReplyDownVoteScore }}
            </template>
          </Column>
        </DataTable>
      </template>
    </DataTable>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, onMounted, watch, inject } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonInput, IonPopover} from '@ionic/vue'
  import { search, download } from 'ionicons/icons'
  import { commentSections } from '/src/assets/globalStates/chat/CommentSections.vue'
  import { jumpToCommentSection } from '/src/components/comments/hashtables.ts'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import RainbowStarWolf from '/src/components/fancy/RainbowStarWolf.vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import { trimAddress, copyFullAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'

  const colorHexValue = inject('colorHexValue') as string

  const tableData = ref()
  const isLoading = ref(true)
  const tableDownload = ref()
  const commentSectionStats = ref({})
  
  var userPopoverOpen = ref(false)

  var event = ref()

  var copyFullAddressButtonText = ref("Copy Full Address")

  onMounted(async() =>
  {
    if(commentSections.data)
      tableData.value = commentSections.data

    isLoading.value = false
  })

  watch(commentSections, () =>
  {
    tableData.value = commentSections.data
  })

  watch(customUserNameHashMap, () =>
  {
    if(!tableData.value)
      return
    
    for(var i=0; i<tableData.value.length; i++)
    {
      const chatAccount = customUserNameHashMap.map.get(tableData.value[i].commentSectionInitiatorAddress.toBase58())
      
      if(chatAccount.useCustomName)
        tableData.value[i].displayName = chatAccount.userName
      else
        tableData.value[i].displayName = trimAddress(tableData.value[i].commentSectionInitiatorAddress.toBase58())  

      tableData.value[i].useCustomName = chatAccount.useCustomName
    }
  })

  function passByRefWrapperCopyAddress()
  {
    copyFullAddress(copyFullAddressButtonText, event.value.address)
  }

  function exportCSV(e: Event) 
  {
    tableDownload.value.exportCSV()
  }

  const expandCommentSections = () => 
  {
    commentSectionStats.value = tableData.value.reduce((acc: { [x: string]: boolean }, p: { id: string | number }) => (acc[p.id] = true) && acc, {})
  }

  function openUserPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.address = rowData.commentSectionInitiatorAddress.toBase58()
    event.value.trimmedAddress = trimAddress(rowData.commentSectionInitiatorAddress.toBase58())

    userPopoverOpen.value = true
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })
</script>

<style scoped>
  .tableMinWidth
  {
    min-width:1640px
  }

  .actionButton
  {
    width: 70px !important;
    height: auto !important
  }

  ion-input
  {
    --highlight-color: v-bind(colorHexValue)
  }
</style>