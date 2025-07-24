<template>
  <h1 >Poll Table</h1>
  <div>
    <ion-input
      v-model="pollNameInput"
      placeholder="Enter New Poll Name"
      :counter="true"
      :maxlength=MAX_POLL_NAME
      :spellcheck="true"
      :counter-formatter="pollNameCustomFormatter"
    >
    </ion-input>

    <ion-button v-if="!anchorPrograms.areChatQOLAccountsReady" color="dark" :disabled="true">Quality Of Life Accounts Not Initialized</ion-button>
    <ion-button v-else color="dark" @click="createPoll()" :disabled="pollNameInput==''">Create New Poll</ion-button>

  </div>
  <div class="tableContainer">
    <DataTable
      ref="tableDownload"
      class="tableMinWidth"
      paginator 
      show-gridlines 
      :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      dataKey="index" 
      v-model:expandedRows="pollOptionRows" 
      v-model:filters="filters" 
      :value="tableData"
      :loading="isLoading"
      :globalFilterFields="
      [
        'isActive',
        'pollIndex', 
        'pollName', 
        'votesCastedCount',
        'upVoteCount',
        'downVoteCount',
        'netVoteScore',
        'unixCreationTimeStamp',
        'creationTimeString',
        'creationDateString',
        'optionCount',
        'pollOptions.isActive',
        'pollOptions.pollOptionIndex',
        'pollOptions.pollOptionName',
        'pollOptions.votesCastedCount',
        'pollOptions.upVoteCount',
        'pollOptions.downVoteCount',
        'pollOptions.netVoteScore']"
    >
      <template #header>
        <div>
          <ion-input
            color="dark"
            v-model="filters['global'].value"
            fill="outline"
            placeholder="Poll Search      "  
          >
            <ion-icon slot="start" :icon="search"></ion-icon>
          </ion-input>

          <div :class="connectedWallet.addressString!=adminAccounts.m4aCEOAddress ? 'largeMarginBottom' : ''">
            <ion-button fill="clear" @click="expandPollOptions()">
              <ion-label  color="dark">Expand Poll Options</ion-label>
            </ion-button>

            <ion-button fill="clear" @click="exportCSV($event)">
              <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
            </ion-button>

            <ion-button fill="clear" @click="pollOptionRows={}">
              <ion-label  color="dark">Collapse Poll Options</ion-label>
            </ion-button>
          </div>
        </div>
      </template>

      <template #empty>No records found.</template>
      <template #loading>Loading records. Please wait.</template>

      <Column expander style="width: 0%"/>
      <Column field="pollIndex" header="Poll Index" style="width: 0%" sortable></Column>
      <Column field="pollName" header="Poll Name" style="width: 0%" sortable></Column>
      
      <Column field="votesCastedCount" header="Vote Count" style="width: 0%" sortable></Column>
      <Column field="upVoteCount" header="Up Vote Count" style="width: 0%" sortable></Column>
      <Column field="downVoteCount" header="Down Vote Count" style="width: 0%" sortable></Column>
      <Column field="netVoteScore" header="Vote Score" style="width: 0%" sortable>
      <template #body="slotProps">
        <ion-label v-if="slotProps.data.netVoteScore > 0" class="positive">+{{ slotProps.data.netVoteScore }}</ion-label>
        <ion-label v-else-if="slotProps.data.netVoteScore == 0">{{ slotProps.data.netVoteScore }}</ion-label>
        <ion-label v-else class="negative">{{ slotProps.data.netVoteScore }}</ion-label>
      </template>
      </Column>
      <Column field="unixCreationTimeStamp" header="Creation Time" style="width: 0%" sortable>
        <template #body="slotProps">
          {{ slotProps.data.creationTimeString }}
          <br>
          {{ slotProps.data.creationDateString }}
        </template>
      </Column>
      <Column field="optionCount" header="Created Option Count" style="width: 0%" sortable></Column>
      <Column field="isActive" header="Active" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-text v-if="slotProps.data.isActive" color="green">True</ion-text>
          <ion-text v-else color="red">False</ion-text>
        </template>
      </Column>

      <Column header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <ion-button color="dark" @click="openCreatePollOptionPopover($event, slotProps.data)">
              Create Poll Option
            </ion-button>
            <ion-popover 
              :is-open="createPollOptionPopoverOpen" 
              :event="event" 
              @didDismiss="createPollOptionPopoverOpen = false"
              side="top" 
              alignment="center"
            >
              <div class="thinBorder flexCenterColumn chatTablePopupContainer">
                <ion-input
                  v-model="pollOptionNameInput"
                  placeholder="Enter New Poll Option Name"
                  :counter="true"
                  :maxlength=MAX_POLL_NAME
                  :spellcheck="true"
                  :counter-formatter="pollOptionNameCustomFormatter"
                >
              </ion-input>
                <ion-button color="dark" @click="createPollOption(event.pollIndex)">
                  <ion-label color="light">Confirm New Poll Option</ion-label>
                </ion-button>
              </div>
            </ion-popover>
          </div>
          <div class="flexCenterColumn">
            <ion-button color="dark" @click="openEditPollPopover($event, slotProps.data)">
              Update Poll
            </ion-button>
            <ion-popover 
              :is-open="editPollPopoverOpen" 
              :event="event" 
              @didDismiss="editPollPopoverOpen = false"
              side="top" 
              alignment="center"
            >
              <div class="thinBorder flexCenterColumn chatTablePopupContainer">
                <ion-input
                  v-model="editedPollNameInput"
                  placeholder="Enter New Poll Option Name"
                  :counter="true"
                  :maxlength=MAX_POLL_NAME
                  :spellcheck="true"
                  :counter-formatter="editPollNameCustomFormatter"
                >
              </ion-input>
                <ion-button color="dark" @click="editPoll(event.pollIndex)">
                  <ion-label color="light">Confirm Edit</ion-label>
                </ion-button>
              </div>
            </ion-popover>
            <ion-button color="dark" @click="slotProps.data.isActive ? 
              setPollFlag(slotProps.data.pollIndex, false) : 
              setPollFlag(slotProps.data.pollIndex, true)">
                <ion-label v-if="slotProps.data.isActive">Mark Inactive</ion-label>
                <ion-label v-else>Mark Active</ion-label>
              </ion-button>
          </div>
        </template>
      </Column>

      <template #expansion="slotProps">
        <DataTable
          :value="slotProps.data.pollOptions"
          :globalFilterFields="
          [
            'isActive',
            'pollOptionIndex',
            'pollOptionName',
            'votesCastedCount',
            'upVoteCount',
            'downVoteCount',
            'netVoteScore',
            'unixCreationTimeStamp',
            'creationTimeString',
            'creationDateString'
          ]">
        
          <template #empty>No poll options found.</template>

          <Column field="pollOptionIndex" header="Poll Option Index" style="width: 10%"></Column>
          <Column field="pollOptionName" header="Poll Option Name" style="width: 10%"></Column>
          <Column field="votesCastedCount" header="Vote Count" style="width: 10%"></Column>
          <Column field="upVoteCount" header="Up Vote Count" style="width: 10%"></Column>
          <Column field="downVoteCount" header="Down Vote Count" style="width: 10%"></Column>
          <Column field="netVoteScore" header="Vote Score" style="width: 10%">
          <template #body="slotProps">
            <ion-label v-if="slotProps.data.netVoteScore > 0" class="positive">+{{ slotProps.data.netVoteScore }}</ion-label>
            <ion-label v-else-if="slotProps.data.netVoteScore == 0">{{ slotProps.data.netVoteScore }}</ion-label>
            <ion-label v-else class="negative">{{ slotProps.data.netVoteScore }}</ion-label>
          </template>
          </Column>
          <Column field="unixCreationTimeStamp" header="Creation Time" style="width: 0%" sortable>
            <template #body="slotProps">
              {{ slotProps.data.creationTimeString }}
              <br>
              {{ slotProps.data.creationDateString }}
            </template>
          </Column>
          <Column field="isActive" header="Active" style="width: 0%" sortable>
            <template #body="slotProps">
              <ion-text v-if="slotProps.data.isActive" color="green">True</ion-text>
              <ion-text v-else color="red">False</ion-text>
            </template>
          </Column>
          
          <Column header="Actions" style="width: 0%">
            <template #body="slotProps">
              <div class="flexCenterColumn">
                <ion-button color="dark" @click="openEditPollOptionPopover($event, slotProps.data)">
                  Update Poll Option
                </ion-button>
                <ion-popover 
                  :is-open="editPollOptionPopoverOpen" 
                  :event="event" 
                  @didDismiss="editPollOptionPopoverOpen = false"
                  side="top" 
                  alignment="center"
                >
                  <div class="thinBorder flexCenterColumn chatTablePopupContainer">
                    <ion-input
                      v-model="editedPollOptionNameInput"
                      placeholder="Enter New Poll Option Name"
                      :counter="true"
                      :maxlength=MAX_POLL_NAME
                      :spellcheck="true"
                      :counter-formatter="editPollOptionNameCustomFormatter"
                    >
                    </ion-input>
                    <ion-button color="dark" @click="editPollOption(event.pollIndex, event.pollOptionIndex)">
                      <ion-label color="light">Confirm Edit</ion-label>
                    </ion-button>
                  </div>
                </ion-popover>
                <ion-button color="dark" @click="slotProps.data.isActive ? 
                setPollOptionFlag(slotProps.data.pollIndex, slotProps.data.pollOptionIndex, false) : 
                setPollOptionFlag(slotProps.data.pollIndex, slotProps.data.pollOptionIndex, true)">
                  <ion-label v-if="slotProps.data.isActive">Mark Inactive</ion-label>
                  <ion-label v-else>Mark Active</ion-label>
                </ion-button>
              </div>
            </template>
          </Column> 
        </DataTable>
      </template>
      
    </DataTable>
  </div>

    <div v-if="connectedWallet.addressString==adminAccounts.chatCEOAddress" class="thickBorder smallMarginTop">
    <div class="smallMarginTop">
      <ion-text >Chat Fee Token Account</ion-text>
    </div>
    <div class=" flexCenterRow">
      <div style="width: 90%">
        <ion-input v-model="tokenMintAddressInput" fill="outline" placeholder="Enter The Mint Address For The Fee Token"></ion-input>
        <ion-input v-model="tokenDecmialCountInput" fill="outline" type="number" placeholder="Enter The Token Decimal Count When Adding" class="tinyMarginTop"></ion-input>
         
        <div class="flexCenterRow">
          <ion-button class="smallMarginBottom" color="dark" @click="addChatFeeTokenAccount()" style="width:77px">Add</ion-button>
          <ion-button class="smallMarginBottom" color="dark" @click="removeChatFeeTokenAccount()" style="width:77px">Remove</ion-button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, inject } from 'vue'
  import { IonButton, IonLabel, IonIcon, IonInput, IonPopover, IonText } from '@ionic/vue'
  import { search, download } from 'ionicons/icons'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { FilterMatchMode } from '@primevue/core/api'
  import { confirmChatTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import * as anchor from "@coral-xyz/anchor"
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import {  PublicKey } from "@solana/web3.js"

  const props = defineProps(['tableData', 'isLoading'])

  const toast = inject('toast')

  const MAX_POLL_NAME = 144

  var pollNameInput = ref("")
  var pollOptionNameInput = ref("")
  var editedPollNameInput = ref("")
  var editedPollOptionNameInput = ref("")
  var pollOptionRows = ref()
  var tableDownload = ref()
  var editPollPopoverOpen = ref()
  var createPollOptionPopoverOpen = ref()
  var editPollOptionPopoverOpen = ref()
  var event = ref()

  var tokenMintAddressInput = ref()
  var tokenDecmialCountInput = ref()

  function exportCSV(e: Event) 
  {
    tableDownload.value.exportCSV()
  }

  function openEditPollPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.pollIndex = new anchor.BN(rowData.pollIndex)

    editedPollNameInput.value = rowData.pollName
    editPollPopoverOpen.value = true
  }

  function openCreatePollOptionPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.pollIndex = new anchor.BN(rowData.pollIndex)

    createPollOptionPopoverOpen.value = true
  }

  function openEditPollOptionPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.pollIndex = new anchor.BN(rowData.pollIndex)
    event.value.pollOptionIndex = rowData.pollOptionIndex

    editedPollOptionNameInput.value = rowData.pollOptionName
    editPollOptionPopoverOpen.value = true
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  const expandPollOptions = () => 
  {
    pollOptionRows.value = props.tableData.reduce((acc: { [x: string]: boolean }, p: { index: string | number }) => (acc[p.index] = true) && acc, {})
  }

  async function createPoll()
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.createPoll(pollNameInput.value).rpc()
      await confirmChatTransaction(tx, toast, "create_poll")

      pollNameInput.value = ""
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "create_poll")
    }
  }

  async function editPoll(pollIndex: number)
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.editPoll(pollIndex, editedPollNameInput.value).rpc()
      await confirmChatTransaction(tx, toast, "edit_poll")

      editPollPopoverOpen.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "edit_poll")
    }
  }

  async function setPollFlag(pollIndex: number, isActiveFlag: boolean)
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.setPollFlag(pollIndex, isActiveFlag).rpc()
      await confirmChatTransaction(tx, toast, "set_poll_flag")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "set_poll_flag")
    }
  }

  async function createPollOption(pollIndex: number)
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.createPollOption(pollIndex, pollOptionNameInput.value).rpc()
      await confirmChatTransaction(tx, toast, "create_poll_option")

      pollOptionNameInput.value = ""
      createPollOptionPopoverOpen.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "create_poll_option")
    }
  }

  async function editPollOption(pollIndex: number, pollOptionIndex: number)
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.editPollOption(new anchor.BN(pollIndex), pollOptionIndex, editedPollOptionNameInput.value).rpc()
      await confirmChatTransaction(tx, toast, "edit_poll_option")

      editPollOptionPopoverOpen.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "edit_poll_option")
    }
  }

  async function setPollOptionFlag(pollIndex: number, pollOptionIndex: number, isActiveFlag: boolean)
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.setPollOptionFlag(new anchor.BN(pollIndex), pollOptionIndex, isActiveFlag).rpc()
      await confirmChatTransaction(tx, toast, "set_poll_option_flag")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "set_poll_option_flag")
    }
  }

  async function addChatFeeTokenAccount()
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.addFeeTokenEntry(new PublicKey(tokenMintAddressInput.value), tokenDecmialCountInput.value).rpc()
      tokenMintAddressInput.value = ""
      tokenDecmialCountInput.value = ""
      await confirmChatTransaction(tx, toast, "add_fee_token_entry")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "add_fee_token_entry")
    }
  }

  async function removeChatFeeTokenAccount()
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.removeFeeTokenEntry(new PublicKey(tokenMintAddressInput.value)).rpc()
      tokenMintAddressInput.value = ""
      tokenDecmialCountInput.value = ""
      await confirmChatTransaction(tx, toast, "remove_fee_token_entry")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "remove_fee_token_entry")
    }
  }

  var overNoteByteSizeLimit = ref(false)

  const pollNameCustomFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([pollNameInput.value])
    const sizeInBytes = blob.size

    inputLength = sizeInBytes

    if(inputLength > maxLength)
    {
      overNoteByteSizeLimit.value = true
    }
    else
      overNoteByteSizeLimit.value = false

    return `${inputLength}/${maxLength}`
  }

  const pollOptionNameCustomFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([pollOptionNameInput.value])
    const sizeInBytes = blob.size

    inputLength = sizeInBytes

    if(inputLength > maxLength)
    {
      overNoteByteSizeLimit.value = true
    }
    else
      overNoteByteSizeLimit.value = false

    return `${inputLength}/${maxLength}`
  }

  const editPollNameCustomFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([editedPollNameInput.value])
    const sizeInBytes = blob.size

    inputLength = sizeInBytes

    if(inputLength > maxLength)
    {
      overNoteByteSizeLimit.value = true
    }
    else
      overNoteByteSizeLimit.value = false

    return `${inputLength}/${maxLength}`
  }

  const editPollOptionNameCustomFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([editedPollOptionNameInput.value])
    const sizeInBytes = blob.size

    inputLength = sizeInBytes

    if(inputLength > maxLength)
    {
      overNoteByteSizeLimit.value = true
    }
    else
      overNoteByteSizeLimit.value = false

    return `${inputLength}/${maxLength}`
  }
</script>

<style scoped>
  .tableMinWidth
  {
    min-width: 1576px
  }

  .actionButton
  {
    width: 100px !important;
    height: auto !important
  }

  ion-input, ion-textarea
  {
    --highlight-color: var(--ion-color-gray)
  }
</style>