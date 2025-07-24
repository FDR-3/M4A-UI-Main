<template>
  <h1>Starred Ideas/Reported Bugs Table</h1>

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
        'idea',
        'unixCreationTimeStamp',
        'creationTimeString',
        'creationDateString',
        'implementationTime',
        'implementationTimeString',
        'implementationDateString',
        'isUpdated',
        'isImplemented']"
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
      <Column field="postOwnerAddress" header="Poster" style="width: 7%" sortable>
        <template #body="slotProps">
          <div >
            <ion-button class="submitterButton" fill="clear" @click="openUserPopover($event, slotProps.data)">
              <div class="flexCenterRow">
                <RainbowStarWolf class="starWolfButton"/>
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
      <Column field="idea" header="Idea / Bug Report" style="width: 10%" sortable>
      </Column>
      <Column field="unixCreationTimeStamp" header="Create Time Stamp" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.creationTimeString }}
          <br>
          {{ slotProps.data.creationDateString }}
        </template>
      </Column>
      <Column field="implementationTime" header="Implemented Time Stamp" style="width: 0%" sortable>
        <template #body="slotProps">
          <div v-if="slotProps.data.implementationTime!=0">
            {{ slotProps.data.implementationTimeString }}
            <br>
            {{ slotProps.data.implementationDateString }}
          </div>
        </template>
      </Column>
      <Column field="isUpdated" header="Updated" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-text v-if="slotProps.data.isUpdated" color="green">True</ion-text>
          <ion-text v-else color="red">False</ion-text>
        </template>
      </Column>
      <Column field="isImplemented" header="Implemented" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-text v-if="slotProps.data.isImplemented" color="green">True</ion-text>
          <ion-text v-else color="red">False</ion-text>
        </template>
      </Column>
      <Column header="Select" style="width: 0%">
        <template #body="slotProps" >
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
              <ion-button color="dark" @click="openUpdateIdeaPopover($event, slotProps.data)">
                Update Idea
              </ion-button>
              <ion-popover 
                :is-open="updateIdeaPopoverOpen" 
                :event="event" 
                @didDismiss="updateIdeaPopoverOpen = false"
                side="left" 
                alignment="center"
              >
                <div class="thinBorder flexCenterColumn chatTablePopupContainer">
                  <ion-textarea v-model="updateIdeaTextArea" class="updateIdeaTextArea" :rows="7"></ion-textarea>
                  <ion-button color="dark" @click="updateIdea()">
                    <ion-label color="light">Confirm Update</ion-label>
                  </ion-button>
                </div>
              </ion-popover>
              <ion-button color="dark" @click="slotProps.data.isImplemented ? implementIdea(slotProps.data, false) : implementIdea(slotProps.data, true)">
                <ion-label>{{ slotProps.data.isImplemented ? 'Unmark' : 'Mark' }}<br>Done</ion-label>
              </ion-button>
              <ion-button color="dark" @click="unstarPost(slotProps.data)">
                Unstar Post
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
  import { IonButton, IonLabel, IonIcon, IonInput, IonPopover, IonText, IonTextarea } from '@ionic/vue'
  import { navigation } from '/src/assets/globalStates/Navigation.vue'
  import { mapSelection } from '/src/assets/globalStates/MapSelection.vue'
  import { search, download } from 'ionicons/icons'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { ideas } from '/src/assets/globalStates/chat/QOL.vue'
  import { PostTypes } from '/src/components/comments/PostTypes.ts'
  import { commentSectionPreFixNameHashTable, commentSectionNameHashTable } from '/src/components/comments/hashtables.ts'
  import RainbowStarWolf from '/src/components/fancy/RainbowStarWolf.vue'
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
  var updateIdeaPopoverOpen = ref(false)
  var updateIdeaTextArea = ref()

  var event = ref()

  var copyFullAddressButtonText = ref("Copy Full Address")

  onMounted(() =>
  {
    if(ideas.data)
      tableData.value = ideas.data

    isLoading.value = false
  })

  watch(ideas, () =>
  {
    tableData.value = ideas.data
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

  function openUpdateIdeaPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.commentSectionNamePrefix = rowData.commentSectionNamePrefix
    event.value.commentSectionName = rowData.commentSectionName
    event.value.postOwnerAddress = rowData.postOwnerAddress
    event.value.chatAccountPostCountIndex = rowData.chatAccountPostCountIndex

    updateIdeaTextArea.value = rowData.idea
    updateIdeaPopoverOpen.value = true
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  function jumpToCommentSection(rowData: any)
  {
    const menuValue = commentSectionPreFixNameHashTable.get(rowData.commentSectionNamePrefix)

    //Set menu value to jump to
    if(menuValue)
    {
      navigation.menuIndex = menuValue
      localStorage.setItem("navigationMenuIndex", navigation.menuIndex)
    }

    //Jump to Map comment section
    if(rowData.commentSectionName.includes("Country: "))
    {
      const countryAndStateIndex = rowData.commentSectionName.match(/\d+/g)

      if(countryAndStateIndex)
      {
        const COUNTRY_INDEX = 0
        const STATE_INDEX = 1
        const M4A_MAP_NAV_BAR_INDEX = 3

        mapSelection.countryIndex = countryAndStateIndex[COUNTRY_INDEX]
        mapSelection.stateIndex = countryAndStateIndex[STATE_INDEX]
        mapSelection.isStateSelected = true
        mapSelection.selectedStateName = rowData.stateName
        mapSelection.zoomLong = rowData.zoomLong
        mapSelection.zoomLat = rowData.zoomLat
        localStorage.setItem("mapCountryIndex", mapSelection.countryIndex)
        localStorage.setItem("mapStateIndex", mapSelection.stateIndex)
        localStorage.setItem("mapIsStateSelected", mapSelection.isStateSelected)
        localStorage.setItem("mapSelectedStateName", mapSelection.selectedStateName)
        localStorage.setItem("mapDefaultLongitude", mapSelection.zoomLong)
        localStorage.setItem("mapDefaultLatitude", mapSelection.zoomLat)

        navigation.navBarIndex = M4A_MAP_NAV_BAR_INDEX
        navigation.pageIndex = 0
        localStorage.setItem("navigationNavbarIndex", M4A_MAP_NAV_BAR_INDEX.toString())
        localStorage.setItem("navigationPageIndex", "0")
      }
    }
    //Jump regular comment section
    else
    {
      const navbarAndPageValues = commentSectionNameHashTable.get(rowData.commentSectionName)

      if(navbarAndPageValues)
      {
        navigation.navBarIndex = navbarAndPageValues[0]
        navigation.pageIndex = navbarAndPageValues[1]
        localStorage.setItem("navigationNavbarIndex", navigation.navBarIndex)
        localStorage.setItem("navigationPageIndex", navigation.pageIndex)
      }
    }
  }

  async function updateIdea()
  {
    try
    {
    const tx = await anchorPrograms.chat.chatProgram.methods.updateIdea
    (
      event.value.commentSectionNamePrefix, event.value.commentSectionName,
      event.value.postOwnerAddress,
      event.value.chatAccountPostCountIndex,
      updateIdeaTextArea.value
    ).rpc()

      await confirmChatTransaction(tx, toast, "update_idea")

      updateIdeaPopoverOpen.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "update_idea")
    }
  }

  async function implementIdea(rowData: any, isImplemented: boolean)
  {
    try
    {
    const tx = await anchorPrograms.chat.chatProgram.methods.setIdeaImplementedFlag
    (
        rowData.commentSectionNamePrefix, rowData.commentSectionName,
        rowData.postOwnerAddress,
        rowData.chatAccountPostCountIndex,
        isImplemented
      ).rpc()

      await confirmChatTransaction(tx, toast, "set_idea_implemented_flag")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "set_idea_implemented_flag")
    }
  }

  async function unstarPost(rowData: any)
  {
    var tx
    var contractFunctionName

    if(rowData.postType == PostTypes.Comment)
    {
      try
      {
        if(rowData.commentSectionNamePrefix == M4A_PREFIX_STRING)
        {
          contractFunctionName = "unstar_m4a_comment"
          tx = await anchorPrograms.chat.chatProgram.methods.unstarM4AComment
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == PLI_PREFIX_STRING)
        {
          contractFunctionName = "unstar_pli_comment"
          tx = await anchorPrograms.chat.chatProgram.methods.unstarPliComment
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == ABOUT_PREFIX_STRING)
        {
          contractFunctionName = "unstar_about_comment"
          tx = await anchorPrograms.chat.chatProgram.methods.unstarAboutComment
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
          contractFunctionName = "unstar_m4a_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unstarM4AReply
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == PLI_PREFIX_STRING)
        {
          contractFunctionName = "unstar_pli_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unstarPliReply
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == ABOUT_PREFIX_STRING)
        {
          contractFunctionName = "unstar_about_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unstarAboutReply
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
          contractFunctionName = "unstar_m4a_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unstarM4ALv3Reply
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == PLI_PREFIX_STRING)
        {
          contractFunctionName = "unstar_pli_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unstarPliLv3Reply
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == ABOUT_PREFIX_STRING)
        {
          contractFunctionName = "unstar_about_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unstarAboutLv3Reply
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
          contractFunctionName = "unstar_m4a_reply_to_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unstarM4ALv4Reply
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == PLI_PREFIX_STRING)
        {
          contractFunctionName = "unstar_pli_reply_to_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unstarPliLv4Reply
          (
            rowData.commentSectionNamePrefix, rowData.commentSectionName,
            rowData.postOwnerAddress,
            rowData.chatAccountPostCountIndex
          ).rpc()
        }
        else if(rowData.commentSectionNamePrefix == ABOUT_PREFIX_STRING)
        {
          contractFunctionName = "unstar_about_reply_to_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.unstarAboutLv4Reply
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

  .updateIdeaTextArea
  {
    padding-top: 80px
  }

  ion-input, ion-textarea
  {
    --highlight-color: var(--ion-color-gray)
  }
</style>