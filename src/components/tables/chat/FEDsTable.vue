<template>
  <h1>Federal Agents Table</h1>

  <div class="tableContainer">
    <DataTable
      ref="tableDownload"
      class="tableMinWidth"
      paginator 
      show-gridlines
      sortField="id" 
      :sortOrder="-1" 
      :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      v-model:filters="filters" 
      :value="tableData"
      :loading="isLoading"
      :globalFilterFields="
      [
        'id', 
        'commentSectionNamePrefix', 
        'processedCommentSectionName', 
        'postOwnerAddress',
        'displayName',
        'post',
        'markTime',
        'markTimeString',
        'markDateString',
        'wasEditedBeforeMark']"
    >
      <template #header>
        <div>
          <ion-input
            color="dark"
            v-model="filters['global'].value"
            fill="outline"
            placeholder="Idea/Bug Report Search     "
          >
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>

          <ion-button fill="clear" @click="exportCSV($event)">
            <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
          </ion-button>
        </div>
      </template>

      <template #empty>No records found.</template>
      <template #loading>Loading records. Please wait.</template>

      <Column field="id" header="Id" style="width: 0%" sortable></Column>
      <Column field="commentSectionNamePrefix" header="Menu" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.commentSectionNamePrefix.replace(/_/g, " ") }}
        </template>
      </Column>
      <Column field="processedCommentSectionName" header="Comment Section Name" style="width: 0%" sortable>
      
      </Column>
      <Column field="postOwnerAddress" header="Federal Agent" style="width: 7%" sortable>
        <template #body="slotProps">
          <div >
            <ion-button style="height: 100px" class="submitterButton" fill="clear" @click="openUserPopover($event, slotProps.data)">
              <div class="flexCenterRow">
                <p style="font-size: 50px;">🕴🏻</p>
                <ion-label color="dark">
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
      <Column field="post" header="Post" style="width: 10%" sortable></Column>
      <Column field="markTime" header="Create Time Stamp" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.markTimeString }}
          <br>
          {{ slotProps.data.markDateString }}
        </template>
      </Column>
      <Column field="wasEditedBeforeMark" header="Was Edited Before Mark" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-text v-if="slotProps.data.wasEditedBeforeMark" color="green">True</ion-text>
          <ion-text v-else color="red">False</ion-text>
        </template>
      </Column>
      <Column header="Select" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <div>
              <ion-button 
                v-if="slotProps.data.commentSectionName!='CEO'"
                class="actionButton" color="dark"
                @click="jumpToCommentSection(slotProps.data)"
                :router-link="'/' + slotProps.data.commentSectionNamePrefix"
                router-direction="root"
              >
                Jump To
              </ion-button> 
              <p v-else align="center">You Are Here</p>
            </div>
            <div v-if="connectedWallet.addressString==adminAccounts.chatCEOAddress">
              <ion-button color="dark" @click="unFEDPost(slotProps.data)">
                UnFED Post
              </ion-button>
            </div>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, inject, watch } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonInput, IonPopover, IonText } from '@ionic/vue'
  import { jumpToCommentSection } from '/src/components/comments/hashtables.ts'
  import { search, download } from 'ionicons/icons'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { feds } from '/src/assets/globalStates/chat/QOL.vue'
  import { PostTypes } from '/src/components/comments/PostTypes.ts'
  import { commentSectionPreFixNameHashTable, commentSectionNameHashTable } from '/src/components/comments/hashtables.ts'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import { trimAddress, confirmChatTransaction, toastPreTransactionError, copyFullAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

  const toast = inject('toast')

  const M4A_PREFIX_STRING = "M4A"
  const PLI_PREFIX_STRING = "PLI"
  const ABOUT_PREFIX_STRING = "About"

  const tableData = ref()
  const isLoading = ref(true)
  const tableDownload = ref()
  
  var userPopoverOpen = ref(false)

  var event = ref()

  var copyFullAddressButtonText = ref("Copy Full Address")


  onMounted(() =>
  {
    if(feds.data)
      tableData.value = feds.data

    isLoading.value = false
  })

  watch(feds, () =>
  {
    tableData.value = feds.data
  })

  watch(customUserNameHashMap, () =>
  {
    if(!tableData.value)
      return

    for(var i=0; i<tableData.value.length; i++)
    {
      const chatAccount = customUserNameHashMap.map.get(tableData.value[i].postOwnerAddress.toBase58())
      
      if(chatAccount.useCustomName)
        tableData.value[i].displayName = chatAccount.userName
      else
        tableData.value[i].displayName = trimAddress(tableData.value[i].postOwnerAddress.toBase58())  
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

  function openUserPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.address = rowData.postOwnerAddress
    event.value.trimmedAddress = trimAddress(rowData.postOwnerAddress)

    userPopoverOpen.value = true
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  async function unFEDPost(rowData: any)
  {
    var tx
    var contractFunctionName

    if(rowData.postType == PostTypes.Comment)
    {
      try
      {
        if(rowData.commentSectionNamePrefix == M4A_PREFIX_STRING)
        {
          contractFunctionName = "unfed_m4a_comment"
          tx = await anchorPrograms.chat.chatProgram.methods.unfedM4AComment
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == PLI_PREFIX_STRING)
        {
          contractFunctionName = "unfed_pli_comment"
          tx = await anchorPrograms.chat.chatProgram.methods.unfedPliComment
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == ABOUT_PREFIX_STRING)
        {
          contractFunctionName = "unfed_about_comment"

          tx = await anchorPrograms.chat.chatProgram.methods.unfedAboutComment
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }

        await confirmChatTransaction(tx, toast, contractFunctionName)
      }
      catch(error)
      {
        toastPreTransactionError(error, toast, contractFunctionName)
      }
    }
    else if(rowData.postType == PostTypes.Reply)
    {
      try
      {
        if(rowData.commentSectionNamePrefix == M4A_PREFIX_STRING)
        {
          contractFunctionName = "unfed_m4a_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unfedM4AReply
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == PLI_PREFIX_STRING)
        {
          contractFunctionName = "unfed_pli_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unfedPliReply
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == ABOUT_PREFIX_STRING)
        {
          contractFunctionName = "unfed_about_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unfedAboutReply
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }

        await confirmChatTransaction(tx, toast, contractFunctionName)
      }
      catch(error)
      {
        toastPreTransactionError(error, toast, contractFunctionName)
      }
    }
    else if(rowData.postType == PostTypes.Lv3Reply)
    {
      try
      {
        if(rowData.commentSectionNamePrefix == M4A_PREFIX_STRING)
        {
          contractFunctionName = "unfed_m4a_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unfedM4ALv3Reply
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == PLI_PREFIX_STRING)
        {
          contractFunctionName = "unfed_pli_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unfedPliLv3Reply
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == ABOUT_PREFIX_STRING)
        {
          contractFunctionName = "unfed_about_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unfedAboutLv3Reply
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }

        await confirmChatTransaction(tx, toast, contractFunctionName)
      }
      catch(error)
      {
        toastPreTransactionError(error, toast, contractFunctionName)
      }
    }
    else if(rowData.postType == PostTypes.Lv4Reply)
    {
      try
      {
        if(rowData.commentSectionNamePrefix == M4A_PREFIX_STRING)
        {
          contractFunctionName = "unfed_m4a_reply_to_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unfedM4ALv4Reply
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == PLI_PREFIX_STRING)
        {
          contractFunctionName = "unfed_pli_reply_to_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unfedPliLv4Reply
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == ABOUT_PREFIX_STRING)
        {
          contractFunctionName = "unfed_about_reply_to_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unfedAboutLv4Reply
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }

        await confirmChatTransaction(tx, toast, contractFunctionName)
      }
      catch(error)
      {
        toastPreTransactionError(error, toast, contractFunctionName)
      }
    }
  }
</script>

<style scoped>
  .tableMinWidth
  {
    min-width:1581px
  }

  .actionButton
  {
    width: 70px !important;
    height: auto !important
  }

  ion-input
  {
    --highlight-color: var(--ion-color-gray)
  }
</style>