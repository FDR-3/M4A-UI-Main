<template>
  <div class="statContainer">
    <RainbowStarWolf id="rainbowStarWolf"/>
    <div class="statsContainer thickBorder">
      <h1 class="yellow">{{ displayName }}</h1>
      <div class="protocolWrapper">
        <div>
          <h2 class="underLine">M4A Protocol</h2>
          <p class="statsLineHeight">Approved Health Care Claim Total: $<span class="rainbowText">{{ approvedClaimAmountString }}</span></p>
          <p class="statsLineHeight">Total Patients: {{ patientCount }}</p>
          <p class="statsLineHeight">Submitted Claims: {{ submittedClaimCount }}</p>
          <p class="statsLineHeight">Submitted Appeals: {{ submittedAppealCount }}</p>
          <p class="statsLineHeight">Approved Claims: {{ approvedClaimCount }}</p>
          <p class="statsLineHeight">Denied Claims: {{ deniedClaimCount }}</p>
          <p class="statsLineHeight">Denied Appeals: {{ deniedAppealCount }}</p>
          <p class="statsLineHeight">Undenied Claims: {{ undeniedClaimCount }}</p>
          <p class="statsLineHeight">Max Denied Claims: {{ maxDeniedClaimCount }}</p>
          <p class="statsLineHeight">Revoked Approvals: {{ revokedApprovalCount }}</p>
        </div>
        <div>
          <h2 class="underLine">Chat Protocol</h2>
          <p class="statsLineHeight">Vote Money Earned: $<span class="rainbowText">{{ parseDollarAmountStringFromDecimalNoDollarSign(receivedUpVoteScore * .01) }}</span></p>
          <p class="statsLineHeight">Net Vote Score Received: {{ netReceivedVoteScore }}</p>
          <p class="statsLineHeight">Net Vote Score Casted: {{ netCastedVoteScore }}</p>
          <p class="statsLineHeight">Votes Received: {{ votesReceivedCount }}</p>
          <p class="statsLineHeight">Up Votes Received: {{ upVoteReceivedCount }}</p>
          <p class="statsLineHeight">Down Votes Received: {{ downVoteReceivedCount }}</p>
          <p class="statsLineHeight">Votes Casted: {{ votesCastedCount }}</p>
          <p class="statsLineHeight">Up Votes Casted: {{ upVoteCastedCount }}</p>
          <p class="statsLineHeight">Down Votes Casted: {{ downVoteCastedCount }}</p>
          <p class="statsLineHeight">Posts: {{ commentAndReplyCount }}</p>
          <p class="statsLineHeight">Edits: {{ editedCommentAndReplyCount }}</p>
          <p class="statsLineHeight">Deletes: {{ deletedCommentAndReplyCount }}</p>
          <p class="statsLineHeight">Starred By CEO: {{ ceoStarredCommentAndReplyCount }}</p>
          <p class="statsLineHeight">Marked FED By CEO: {{ ceoMarkedFEDCommentAndReplyCount }}</p>
        </div>
      </div>
      <ion-input v-model="addressToCheck" placeholder="Check New Address" fill="outline" style="margin-top: -10px"></ion-input>
      <ion-button id="checkNewAddressButton" @click="checkNewAddress()" :color="colorName" style="margin-bottom: -5px">Check New Address</ion-button>
    </div>
  </div>

  <div>
    <PatientRecordsTable :submitterAccount="submitterAccount" :searchAddress="searchAddress"/>
    <VoterRecordTable 
      v-if="!toggleVoterCanidateTable && !toggleUniqueTable"
      @toggleVoterCanidateTable="toggleVoterCanidateTable = true"
      @toggleUniqueTable="toggleUniqueTable = true"
      :tableData="voterRecordTableData" 
      :uniqueVoterData="uniqueVoterTableData"
      :uniqueVoterCount="uniqueVoterCount"
      :isLoading="voterTableIsLoading"
      :searchAddress="searchAddress"
      :displayName="possiblyTrimmedDisplayName"
      :uniqueVoterHashMap="uniqueVoterHashMap"
    />
    <UniqueVoterTable 
      v-if="!toggleVoterCanidateTable && toggleUniqueTable"
      @toggleVoterCanidateTable="toggleVoterCanidateTable = true"
      @toggleUniqueTable="toggleUniqueTable = false"
      :tableData="uniqueVoterTableData" 
      :uniqueVoterData="uniqueVoterTableData"
      :uniqueVoterCount="uniqueVoterCount"
      :isLoading="voterTableIsLoading"
      :searchAddress="searchAddress"
      :displayName="possiblyTrimmedDisplayName"
    />
    <CanidateRecordTable 
      v-if="toggleVoterCanidateTable && !toggleUniqueTable"
      @toggleVoterCanidateTable="toggleVoterCanidateTable = false"
      @toggleUniqueTable="toggleUniqueTable = true"
      :tableData="canidateRecordTableData" 
      :uniqueCanidateData="uniqueCanidateTableData"
      :uniqueCanidateCount="uniqueCanidateCount"
      :isLoading="canidateTableIsLoading"
      :searchAddress="searchAddress"
      :displayName="possiblyTrimmedDisplayName"
      :uniqueCanidateHashMap="uniqueCanidateHashMap"
    />
    <UniqueCanidateTable 
      v-if="toggleVoterCanidateTable && toggleUniqueTable"
      @toggleVoterCanidateTable="toggleVoterCanidateTable = false"
      @toggleUniqueTable="toggleUniqueTable = false"
      :tableData="uniqueCanidateTableData" 
      :uniqueCanidateData="uniqueCanidateTableData"
      :uniqueCanidateCount="uniqueCanidateCount"
      :isLoading="canidateTableIsLoading"
      :searchAddress="searchAddress"
      :displayName="possiblyTrimmedDisplayName"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onUnmounted, computed, inject } from 'vue'
  import { IonButton, IonInput } from '@ionic/vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import RainbowStarWolf from '/src/components/fancy/RainbowStarWolf.vue' 
  import PatientRecordsTable from '/src/components/tables/m4a/PatientRecordsTable.vue' 
  import VoterRecordTable from '/src/components/tables/chat/VoterRecordTable.vue'
  import CanidateRecordTable from '/src/components/tables/chat/CanidateRecordTable.vue' 
  import UniqueVoterTable from '/src/components/tables/chat/UniqueVoterTable.vue'
  import UniqueCanidateTable from '/src/components/tables/chat/UniqueCanidateTable.vue'
  import { trimAddress,
    parseDollarAmountStringFromDecimalNoDollarSign,
    parseDollarAmountStringFromFixed2PointNotationNoDollarSign } from '/src/assets/contracts/WalletHelper.vue'
  import { convertUnixTimeToLocalDate, convertUnixTimeToLocalTime } from '/src/assets/helperFunctions/UnixTimeStampHelper.ts'
  import { getSubmitterAccount, getSubmitterAccountPDA } from '/src/assets/contracts/Solana/M4AProtocol.vue'
  import { getUserDisplayName, getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { chatAccountHashMap, customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { postVoteRecords } from '/src/assets/globalStates/chat/PostVoteRecords.vue'
  import * as anchor from "@coral-xyz/anchor"
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { VOTE_COST } from '/src/assets/contracts/WalletHelper.vue'
  import cloneDeep from 'lodash/cloneDeep'

  const colorName = inject('colorName') as string

  var uniqueVoterHashMap = ref()
  var uniqueCanidateHashMap = ref()

  var uniqueVoterCount = ref(0)

  var displayName = ref()
  var possiblyTrimmedDisplayName = ref()
  var searchAddress = ref()
  var addressToCheck = ref()

  var voterRecordTableData: any = ref([])
  var uniqueVoterTableData: any = ref([])

  var canidateRecordTableData: any = ref([])
  var uniqueCanidateTableData: any = ref([])
  var uniqueCanidateCount: any = ref()

  var toggleVoterCanidateTable = ref(false)
  var toggleUniqueTable = ref(false)
  
  var voterTableIsLoading = ref(true)
  var canidateTableIsLoading = ref(true)

  var approvedClaimAmountString = ref("0.00")
  var patientCount = ref(0)
  var submittedClaimCount = ref(0)
  var submittedAppealCount = ref(0)
  var approvedClaimCount = ref(0)
  var undeniedClaimCount = ref(0)
  var deniedClaimCount = ref(0)
  var deniedAppealCount = ref(0)
  var maxDeniedClaimCount = ref(0)
  var revokedApprovalCount = ref(0)

  var receivedUpVoteScore = ref(0)
  var netReceivedVoteScore = ref(0)
  var netCastedVoteScore = ref(0)
  var votesReceivedCount = ref(0)
  var upVoteReceivedCount = ref(0)
  var downVoteReceivedCount = ref(0)
  var votesCastedCount = ref(0)
  var upVoteCastedCount = ref(0)
  var downVoteCastedCount = ref(0)
  var commentAndReplyCount = ref(0)
  var editedCommentAndReplyCount = ref(0)
  var deletedCommentAndReplyCount = ref(0)
  var ceoStarredCommentAndReplyCount = ref(0)
  var ceoMarkedFEDCommentAndReplyCount = ref(0)

  var submitterAccount = ref()
  
  var submitterAccountWatchId: any
  var chatAccountWatchId: any

  onMounted(async() => 
  {
    toggleVoterCanidateTable.value = localStorage.getItem("toggleVoterCanidateTable") == "true"
    toggleUniqueTable.value = localStorage.getItem("toggleUniqueTable") == "true"

    searchAddress.value = connectedWallet.addressString

    getChatAccountStats(searchAddress.value)

    if(postVoteRecords.data)
      sortPostVoteRecords(searchAddress.value)

    if(connectedWallet.addressString != "")
    {
      //await getSubmitterAccountStats(searchAddress.value)
      //await listenForSubmitterAccountChanges(searchAddress.value)
    }

    if(connectedWallet.isChatAccountReady)
    {
      displayName.value = getUserDisplayName(searchAddress.value)
      possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(searchAddress.value)
    }
    else
    {
      displayName.value = searchAddress.value
      possiblyTrimmedDisplayName.value = trimAddress(searchAddress.value)
    }

    voterTableIsLoading.value = false
    canidateTableIsLoading.value = false
  })

  onUnmounted(() => 
  {
    if(submitterAccountWatchId != undefined)
     anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(submitterAccountWatchId)
  })

  watch(postVoteRecords, () =>
  {
    sortPostVoteRecords(searchAddress.value)
  })

  watch(chatAccountHashMap, () =>
  {
    getChatAccountStats(searchAddress.value)
  })

  watch(customUserNameHashMap, () =>
  {
    displayName.value = getUserDisplayName(searchAddress.value)
    possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(searchAddress.value)

    if(voterRecordTableData.value)
      for(var i=0; i<voterRecordTableData.value.length; i++)
      {
        const chatAccount = customUserNameHashMap.map.get(voterRecordTableData.value[i].voterAddress)
        if(chatAccount.useCustomName)
          voterRecordTableData.value[i].displayName = chatAccount.userName
        else
          voterRecordTableData.value[i].displayName = trimAddress(voterRecordTableData.value[i].voterAddress)
      }

    if(uniqueVoterTableData.value)
      for(var i=0; i<uniqueVoterTableData.value.length; i++)
      {
        const chatAccount = customUserNameHashMap.map.get(uniqueVoterTableData.value[i].voterAddress)
        if(chatAccount.useCustomName)
          uniqueVoterTableData.value[i].displayName = chatAccount.userName
        else
          uniqueVoterTableData.value[i].displayName = trimAddress(uniqueVoterTableData.value[i].voterAddress)
      }

    if(canidateRecordTableData.value)
      for(var i=0; i<canidateRecordTableData.value.length; i++)
      {
        const chatAccount = customUserNameHashMap.map.get(canidateRecordTableData.value[i].canidateAddress)
        if(chatAccount.useCustomName)
          canidateRecordTableData.value[i].displayName = chatAccount.userName
        else
          canidateRecordTableData.value[i].displayName = trimAddress(canidateRecordTableData.value[i].canidateAddress)
      }

    if(uniqueCanidateTableData.value)
      for(var i=0; i<uniqueCanidateTableData.value.length; i++)
      {
        const chatAccount = customUserNameHashMap.map.get(uniqueCanidateTableData.value[i].canidateAddress)
        if(chatAccount.useCustomName)
          uniqueCanidateTableData.value[i].displayName = chatAccount.userName
        else
          uniqueCanidateTableData.value[i].displayName = trimAddress(uniqueCanidateTableData.value[i].canidateAddress)
      }
  })

  //Json string of wallet to detect object property changes
  const walletWatch = computed(() =>
  {
    return JSON.stringify(connectedWallet)
  })

  watch(walletWatch, async (newJSONObjectString, oldJSONObjectString) =>
  {
    voterTableIsLoading.value = true
    canidateTableIsLoading.value = true

    let newWallet = JSON.parse(newJSONObjectString)
    let oldWallet= JSON.parse(oldJSONObjectString)

    if(newWallet.addressString == oldWallet.addressString)
      return

    try
    {
      if(submitterAccountWatchId != undefined)
      {
         anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(submitterAccountWatchId)
         submitterAccountWatchId = undefined
      }
      if(chatAccountWatchId != undefined)
      {
        anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(chatAccountWatchId)
        chatAccountWatchId != undefined
      }

      if(connectedWallet.isChatAccountReady)
      {
        displayName.value = getUserDisplayName(connectedWallet.addressString)
        possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(connectedWallet.addressString)
      }
      else
      {
        displayName.value = connectedWallet.addressString
        possiblyTrimmedDisplayName.value = trimAddress(connectedWallet.addressString)
      }

      //await getSubmitterAccountStats(connectedWallet.addressString)
      getChatAccountStats(connectedWallet.addressString)
      if(postVoteRecords.data)
        sortPostVoteRecords(connectedWallet.addressString)
      searchAddress.value = connectedWallet.addressString

      //await listenForSubmitterAccountChanges(connectedWallet.addressString)
    }
    catch(error)
    {
      console.log(error)
    }
  })

  async function checkNewAddress()
  {
    voterTableIsLoading.value = true
    canidateTableIsLoading.value = true
    
    if(submitterAccountWatchId != undefined)
    {
        anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(submitterAccountWatchId)
        submitterAccountWatchId = undefined
    }
    if(chatAccountWatchId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(chatAccountWatchId)
      chatAccountWatchId != undefined
    }

    displayName.value = getUserDisplayName(addressToCheck.value)
    possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(addressToCheck.value)

    //await getSubmitterAccountStats(addressToCheck.value)
    getChatAccountStats(addressToCheck.value)
    if(postVoteRecords.data)
      sortPostVoteRecords(addressToCheck.value)

    searchAddress.value = addressToCheck.value

    //await listenForSubmitterAccountChanges(addressToCheck.value)

    addressToCheck.value = ""
  }

  async function getSubmitterAccountStats(searchAddress: string)
  {
    submitterAccount.value = await getSubmitterAccount(searchAddress)

    if(submitterAccount.value)
    {
      approvedClaimAmountString.value = parseDollarAmountStringFromFixed2PointNotationNoDollarSign(submitterAccount.value.approvedClaimAmount)
      patientCount.value = submitterAccount.value.patientCount
      submittedClaimCount.value = submitterAccount.value.submittedClaimCount
      submittedAppealCount.value = submitterAccount.value.submittedAppealCount
      approvedClaimCount.value = submitterAccount.value.approvedClaimCount
      undeniedClaimCount.value = submitterAccount.value.undeniedClaimCount
      deniedClaimCount.value = submitterAccount.value.deniedClaimCount
      deniedAppealCount.value = submitterAccount.value.deniedAppealCount
      maxDeniedClaimCount.value = submitterAccount.value.maxDeniedClaimCount
      revokedApprovalCount.value = submitterAccount.value.revokedApprovalCount
    }
    else
    {
      approvedClaimAmountString.value = "0.00"
      patientCount.value = 0
      submittedClaimCount.value = 0
      submittedAppealCount.value = 0
      approvedClaimCount.value = 0
      undeniedClaimCount.value = 0
      deniedClaimCount.value = 0
      deniedAppealCount.value = 0
      maxDeniedClaimCount.value = 0
      revokedApprovalCount.value = 0
    }
  }

  function getChatAccountStats(searchAddress: string)
  {
    const chatAccount = chatAccountHashMap.map.get(searchAddress)
    if(chatAccount)
    {
      receivedUpVoteScore.value = chatAccount.receivedUpVoteScore 
      netReceivedVoteScore.value = chatAccount.receivedUpVoteScore.sub(chatAccount.receivedDownVoteScore) 
      netCastedVoteScore.value = chatAccount.castedUpVoteScore.sub(chatAccount.castedDownVoteScore)
      votesReceivedCount.value = chatAccount.upVoteReceivedCount.add(chatAccount.downVoteReceivedCount)
      upVoteReceivedCount.value = chatAccount.upVoteReceivedCount
      downVoteReceivedCount.value = chatAccount.downVoteReceivedCount
      votesCastedCount.value = chatAccount.upVoteCastedCount.add(chatAccount.downVoteCastedCount)
      upVoteCastedCount.value = chatAccount.upVoteCastedCount
      downVoteCastedCount.value = chatAccount.downVoteCastedCount
      commentAndReplyCount.value = chatAccount.commentAndReplyCount
      editedCommentAndReplyCount.value = chatAccount.editedCommentAndReplyCount
      deletedCommentAndReplyCount.value = chatAccount.deletedCommentAndReplyCount
      ceoStarredCommentAndReplyCount.value = chatAccount.ceoStarredCommentAndReplyCount
      ceoMarkedFEDCommentAndReplyCount.value = chatAccount.ceoMarkedFedCommentAndReplyCount
    }
    else
    {
      receivedUpVoteScore.value = 0
      netReceivedVoteScore.value = 0
      netCastedVoteScore.value = 0
      votesReceivedCount.value = 0
      upVoteReceivedCount.value = 0
      downVoteReceivedCount.value = 0
      votesCastedCount.value = 0
      upVoteCastedCount.value = 0
      downVoteCastedCount.value = 0
      commentAndReplyCount.value = 0
      editedCommentAndReplyCount.value = 0
      deletedCommentAndReplyCount.value = 0
      ceoStarredCommentAndReplyCount.value = 0
      ceoMarkedFEDCommentAndReplyCount.value = 0
    }
  }

  function sortPostVoteRecords(searchAddress: String)
  {
    type ContributionTotalMap = 
    {
      voterMapIndex: number,
      contributionTotal: number,
      contributionTotalString: string,
      amountSpent: number
    }

    var uniqueVoterMap: Map<string, ContributionTotalMap> = new Map() //key -string: user address, value -[number: index for user in the unique table, number: user contribution total]
    var uniqueCanidateMap: Map<string, ContributionTotalMap> = new Map()

    type UniqueVoter = 
    {
      displayName: string,
      voterAddress: string,
      contributionTotal: anchor.BN,
      contributionTotalString: string,
      amountSpent: number
    }

    type UniqueCanidate = 
    {
      displayName: string,
      canidateAddress: string,
      contributionTotal: anchor.BN,
      contributionTotalString: string,
      amountSpent: number
    }

    var voterData: any[] = []
    var canidateData: any[] = []
    var uniqueVoterData: UniqueVoter[] = []
    var uniqueCanidateData: UniqueCanidate[] = []

      //Making a deep copy of the object array so that changes to the sub copies don't effect the original and make the postVoteRecord watcher go crazy
    const postVoteRecordsDeepCopy = cloneDeep(postVoteRecords.data)

    const userReceivedVoteRecords = getReceivedVoteRecords(searchAddress, postVoteRecordsDeepCopy)
    const userCastedVoteRecords = getCastedVoteRecords(searchAddress, postVoteRecordsDeepCopy)

    //Process Voter Data
    for(var i=0; i<userReceivedVoteRecords.length; i++)
    {
      voterData.push(userReceivedVoteRecords[i])

      //Needed to be able to sort properly with Anchor BN numbers, only some id's have that problem for some reason
      if(typeof voterData[i].id != "number")
        voterData[i].id = parseInt(voterData[i].id)

      //Set vote score contribution total string
      if(voterData[i].voteAmount.gt(new anchor.BN(0)))
        voterData[i].voteAmountString = "+" + voterData[i].voteAmount.toNumber().toLocaleString()
      else
        voterData[i].voteAmountString = voterData[i].voteAmount.toNumber().toLocaleString()

      //Set vote absolute value
      voterData[i].absVoteAmount = Math.abs(voterData[i].voteAmount.toNumber()) * VOTE_COST

      voterData[i].creationTimeString = convertUnixTimeToLocalTime(voterData[i].unixCreationTimeStamp)
      voterData[i].creationDateString = convertUnixTimeToLocalDate(voterData[i].unixCreationTimeStamp)

      if(typeof(voterData[i].voterAddress) === "object") //May already be a string if resorting
        voterData[i].voterAddress = voterData[i].voterAddress.toBase58()
      var existingVoterMapEntry = uniqueVoterMap.get(voterData[i].voterAddress)

      //If voter has already appeared in records, set display name and increment or decrement unique vote values
      if(existingVoterMapEntry)
      {
        voterData[i].displayName = getCustomOrTrimmedUserDisplayName(voterData[i].voterAddress)

        const newVoteTotal = uniqueVoterData[existingVoterMapEntry.voterMapIndex].contributionTotal.add(voterData[i].voteAmount)
        uniqueVoterData[existingVoterMapEntry.voterMapIndex].contributionTotal = newVoteTotal

        //Set vote score contribution total string
        if(newVoteTotal.gt(new anchor.BN(0)))
          uniqueVoterData[existingVoterMapEntry.voterMapIndex].contributionTotalString = "+" + newVoteTotal.toNumber().toLocaleString()
        else
          uniqueVoterData[existingVoterMapEntry.voterMapIndex].contributionTotalString = newVoteTotal.toNumber().toLocaleString()

        //Update hashmap with totals so non unique tables can access that data
        existingVoterMapEntry.contributionTotal = newVoteTotal
        existingVoterMapEntry.contributionTotalString = uniqueVoterData[existingVoterMapEntry.voterMapIndex].contributionTotalString
        existingVoterMapEntry.amountSpent = (uniqueVoterData[existingVoterMapEntry.voterMapIndex].amountSpent += voterData[i].absVoteAmount).toFixed(2)
        uniqueVoterMap.set(voterData[i].voterAddress, existingVoterMapEntry)
      }
      //If voter has not appeared in records yet, add the unique voter, set display name, and increment or decrement the unique vote value
      else
      {
        var newVoter: UniqueVoter =
        {
          displayName: "",
          voterAddress: voterData[i].voterAddress,
          contributionTotal: voterData[i].voteAmount,
          contributionTotalString: "",
          amountSpent: voterData[i].absVoteAmount
        }

        uniqueVoterData.push(newVoter)

        const displayName = getCustomOrTrimmedUserDisplayName(voterData[i].voterAddress)
          
        voterData[i].displayName = displayName
        uniqueVoterData[uniqueVoterData.length-1].displayName = displayName

        //Set vote score contribution total string
        if(voterData[i].voteAmount.gt(new anchor.BN(0)))
          uniqueVoterData[uniqueVoterData.length-1].contributionTotalString = "+" + uniqueVoterData[uniqueVoterData.length-1].contributionTotal.toNumber().toLocaleString()
        else
          uniqueVoterData[uniqueVoterData.length-1].contributionTotalString = uniqueVoterData[uniqueVoterData.length-1].contributionTotal.toNumber().toLocaleString()

        var newVoterMapObject: ContributionTotalMap = 
        {
          voterMapIndex: uniqueVoterData.length-1,
          contributionTotal: voterData[i].voteAmount,
          contributionTotalString: uniqueVoterData[uniqueVoterData.length-1].contributionTotalString,
          amountSpent: voterData[i].absVoteAmount
        }

        uniqueVoterMap.set(voterData[i].voterAddress, newVoterMapObject)
      }
    }

    //Process Canidate Data
    for(var i=0; i<userCastedVoteRecords.length; i++)
    {
      canidateData.push(userCastedVoteRecords[i])

      //Needed to be able to sort properly with Anchor BN numbers, only some id's have that problem for some reason
      if(typeof canidateData[i].id != "number")
        canidateData[i].id = canidateData[i].id.toNumber()

      //Set vote score contribution total string
      if(canidateData[i].voteAmount.gt(new anchor.BN(0)))
        canidateData[i].voteAmountString = "+" + canidateData[i].voteAmount.toNumber().toLocaleString()
      else
        canidateData[i].voteAmountString = canidateData[i].voteAmount.toNumber().toLocaleString()

      //Set vote absolute value
      canidateData[i].absVoteAmount = Math.abs(canidateData[i].voteAmount.toNumber()) * VOTE_COST
    
      canidateData[i].creationTimeString = convertUnixTimeToLocalTime(canidateData[i].unixCreationTimeStamp)
      canidateData[i].creationDateString = convertUnixTimeToLocalDate(canidateData[i].unixCreationTimeStamp)

      if(typeof(canidateData[i].canidateAddress) === "object") //May already be a string if resorting
        canidateData[i].canidateAddress = canidateData[i].canidateAddress.toBase58()
      const existingCanidateMapEntry = uniqueCanidateMap.get(canidateData[i].canidateAddress)

      //If canidate has already appeared in records, set display name and increment or decrement unique vote values
      if(existingCanidateMapEntry)
      {
        canidateData[i].displayName = getCustomOrTrimmedUserDisplayName(canidateData[i].canidateAddress)

        const newVoteTotal = uniqueCanidateData[existingCanidateMapEntry.voterMapIndex].contributionTotal.add(canidateData[i].voteAmount)
        uniqueCanidateData[existingCanidateMapEntry.voterMapIndex].contributionTotal = newVoteTotal

        //Set vote score contribution total string
        if(newVoteTotal.gt(new anchor.BN(0)))
          uniqueCanidateData[existingCanidateMapEntry.voterMapIndex].contributionTotalString = "+" + newVoteTotal.toNumber().toLocaleString()
        else
          uniqueCanidateData[existingCanidateMapEntry.voterMapIndex].contributionTotalString = newVoteTotal.toNumber().toLocaleString()

        //Update hashmap with totals so non unique tables can access that data
        existingCanidateMapEntry.contributionTotal = newVoteTotal
        existingCanidateMapEntry.contributionTotalString = uniqueCanidateData[existingCanidateMapEntry.voterMapIndex].contributionTotalString
        existingCanidateMapEntry.amountSpent = (uniqueCanidateData[existingCanidateMapEntry.voterMapIndex].amountSpent += canidateData[i].absVoteAmount).toFixed(2)
        uniqueCanidateMap.set(canidateData[i].canidateAddress, existingCanidateMapEntry)
      }
      //If canidate has not appeared in records yet, add the unique canidate, set display name, and increment or decrement the unique vote value
      else
      {
        var newCanidate: UniqueCanidate =
        {
          displayName: "",
          canidateAddress: canidateData[i].canidateAddress,
          contributionTotal: canidateData[i].voteAmount,
          contributionTotalString: "",
          amountSpent: canidateData[i].absVoteAmount
        }

        uniqueCanidateData.push(newCanidate)

        const displayName = getCustomOrTrimmedUserDisplayName(canidateData[i].canidateAddress)
          
        canidateData[i].displayName = displayName
        uniqueCanidateData[uniqueCanidateData.length-1].displayName = displayName

        //Set vote score contribution total string
        if(canidateData[i].voteAmount.gt(new anchor.BN(0)))
          uniqueCanidateData[uniqueCanidateData.length-1].contributionTotalString = "+" + uniqueCanidateData[uniqueCanidateData.length-1].contributionTotal.toLocaleString()
        else
          uniqueCanidateData[uniqueCanidateData.length-1].contributionTotalString = uniqueCanidateData[uniqueCanidateData.length-1].contributionTotal.toLocaleString()

        var newCanidateMapObject: ContributionTotalMap = 
        {
          voterMapIndex: uniqueCanidateData.length-1,
          contributionTotal: canidateData[i].voteAmount,
          contributionTotalString: uniqueCanidateData[uniqueCanidateData.length-1].contributionTotalString,
          amountSpent: canidateData[i].absVoteAmount
        }

        uniqueCanidateMap.set(canidateData[i].canidateAddress, newCanidateMapObject)
      }
    }

    voterRecordTableData.value = voterData.sort((a: any, b: any) => b.id - a.id)
    uniqueVoterTableData.value = uniqueVoterData
    uniqueVoterCount.value = uniqueVoterData.length

    canidateRecordTableData.value = canidateData.sort((a: any, b: any) => b.id - a.id)
    uniqueCanidateTableData.value = uniqueCanidateData
    uniqueCanidateCount.value = uniqueCanidateData.length

    uniqueVoterHashMap.value = uniqueVoterMap
    uniqueCanidateHashMap.value = uniqueCanidateMap

    voterTableIsLoading.value = false
    canidateTableIsLoading.value = false
  }

  function getReceivedVoteRecords(searchAddress: String, postVoteRecordsDeepCopy: any)
  {
    var receivedVoteRecords = []

    for(var i=0; i<postVoteRecordsDeepCopy.length; i++)
    {
      if(postVoteRecordsDeepCopy[i].account.canidateAddress == searchAddress)
        receivedVoteRecords.push(postVoteRecordsDeepCopy[i].account)
    }

    return receivedVoteRecords 
  }

  function getCastedVoteRecords(searchAddress: String, postVoteRecordsDeepCopy: any)
  {
    var castedVoteRecords = []

    for(var i=0; i<postVoteRecordsDeepCopy.length; i++)
    {
      if(postVoteRecordsDeepCopy[i].account.voterAddress == searchAddress)
        castedVoteRecords.push(postVoteRecordsDeepCopy[i].account)
    }

    return castedVoteRecords 
  }

  async function listenForSubmitterAccountChanges(searchAddressString: string)
  {
    try
    {
      //Subscribe to submitter account changes
      submitterAccountWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getSubmitterAccountPDA(searchAddressString), async() => 
      {
        //Handle account change...
        await getSubmitterAccountStats(searchAddress.value)
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }
</script>

<style scoped>
  p
  {
    font-size: min(5vw, 25px);
  }
  
  #rainbowStarWolf
  {
    width: min(70vw, 500px);
    height: min(90vw, 500px)
  }

  .statsContainer
  {
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 20px;
    margin-top: 20px;
  }

  .topStatsLineHeight
  {
    margin-top: 0px
  }

  .statsLineHeight
  {
    margin-top: -20px
  }

  #checkNewAddressButton
  {
    width: min(30vw, 150px) !important
  }

  ion-input
  {
    --highlight-color: var(--ion-color-gray)
  }

  ion-button
  {
    margin-top: 15px
  }

  @media screen and (min-width: 1701px) 
  { 
    .statContainer
    {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      margin-bottom: 20px
    }

    .statsContainer
    {
      margin-left: 25px;
      width: min(80vw, 1174px)
    }
  }

  @media screen and (max-width: 1700px) 
  { 
    .statContainer
    {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 20px
    }

    .statsContainer
    {

      width: 70vw
    }
  }

  @media screen and (min-width: 1475px) 
  { 
    .protocolWrapper
    {
      display: flex;
      flex-direction: row;
      justify-content: center !important;
      gap: 25px
    }
  }

  @media screen and (max-width: 1474px) 
  { 
    .protocolWrapper
    {
      display: flex;
      flex-direction: column;
    }
  }
</style>