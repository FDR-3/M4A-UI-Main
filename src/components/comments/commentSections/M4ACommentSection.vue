<template>
  
  <div v-if="commentsDisabled" class="flexCenterColumn">
    <ion-button v-if="connectedWallet.addressString==adminAccounts.chatCEOAddress" :color="colorName" @click="setCommentSectionFlag(false)"><ion-label color="dark">Enable Comment Section</ion-label></ion-button>
    This Comment Section Has Been Disabled :X
  </div>
  <div v-else>
    <AddComment v-if="!hidenCommentSections.hidden && commentSectionName!=undefined && feeFreeLink!=undefined"
    :key="commentSectionName + commentSectionNamePrefix"
    :colorName="colorName"
    :colorHexValue="colorHexValue"
    :commentSectionNamePrefix="commentSectionNamePrefix"
    :commentSectionName="commentSectionName"
    :link="feeFreeLink"
    style="margin-bottom: -0px"/>
    <div id="commentSection">
      <ion-button v-if="connectedWallet.addressString==adminAccounts.chatCEOAddress" :color="colorName" @click="setCommentSectionFlag(true)"><ion-label color="dark">Disable Comment Section</ion-label></ion-button>
      <ion-button :color="colorName" @click="toggleShowComments()" :disabled="reloadingData"><ion-label color="dark">{{ hideCommentsMessage }}</ion-label></ion-button>
      <ion-button v-if="!hidenCommentSections.hidden && commentSectionCommentCount!=0" id="sortButton" @click="reOrderList()" :color="colorName">
        <ion-label color="dark">
          {{ sortMessage }}
        </ion-label>
      </ion-button>
      <CommentList
        v-if="!hidenCommentSections.hidden"
        :colorName="colorName"
        :colorHexValue="colorHexValue"
        :toggleList="toggleList"
        :commentSectionNamePrefix="commentSectionNamePrefix"
        :commentSectionName="commentSectionName"
        :comments="commentSectionComments"
        :replies="commentSectionReplies"
        :repliesToReplies="commentSectionRepliesToReplies"
        :remainingReplies="commentSectionRemainingReplies"
      />
    </div>
  </div>
  <div class="extraSpace"></div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, inject } from 'vue'
  import { IonButton, IonLabel } from '@ionic/vue'
  import { commentSectionInfo, commentSectionHashMap, hidenCommentSections } from '/src/assets/globalStates/chat/CommentSections.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { m4aComments, m4aReplies, m4aLv3Replies, m4aLv4Replies } from '/src/assets/globalStates/chat/Posts.vue'
  import AddComment from '/src/components/comments/AddComment.vue'
  import CommentList from '/src/components/comments/commentsAndReplies/CommentList.vue'
  import { M4A110PathSelectionLinks, M4A110LinksAfterPathSelection } from '/src/views/M4A/110/110M4ALinks.vue'
  import { M4A110PathSelectionCommentSectionNames, M4A110CommentSectionNamesAfterPathSelection } from '/src/views/M4A/110/110M4ACommentSections.vue'
  import { mapSelection } from '/src/assets/globalStates/MapSelection.vue'
  import { navigation, MenuIndex } from '/src/assets/globalStates/Navigation.vue'
  import { confirmChatTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { sortCommentSectionPostsAndProcessUserNames } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

  defineProps(['colorName', 'colorHexValue'])

  const toast = inject('toast')
  
  var toggleList = ref("column-reverse")
  var sortMessage = ref("Show: Oldest To Newest")
  var commentsDisabled = ref()
  var hideCommentsMessage = ref("Hide All Comment Sections")

  var commentSectionCommentCount = ref()

  var commentSectionComments = ref()
  var commentSectionReplies = ref()
  var commentSectionRepliesToReplies = ref()
  var commentSectionRemainingReplies = ref()

  var commentSectionPageIndex: number
  var commentSectionNavbarIndex: number
  var commentSectionOperatingSystemIndex: number
  var commentSectionFrameWorkIndex: number
  var commentSectionLanguageIndex: number
  var commentSectionCountryIndex: number
  var commentSectionStateIndex: number

  var reloadingData = ref()

  var commentSectionName = ref()
  var feeFreeLink = ref()

  const commentSectionNamePrefix = "M4A"
  const commentSectionNames = [
    M4A110PathSelectionCommentSectionNames,
    ["Markets"],
    ["Treasury"],
    ["Road Map"],
    ["Queue"]
  ]

  const feeFreeCommentLinks =
  [
    M4A110PathSelectionLinks,
    [""],
    [""],
    [""],
    [""]
  ]

  onMounted(() => 
  {
    commentSectionNavbarIndex = parseInt(localStorage.getItem("navigationNavbarIndex") || "0")
    commentSectionPageIndex = parseInt(localStorage.getItem("navigationPageIndex") || "0")
    commentSectionOperatingSystemIndex = parseInt(localStorage.getItem("navigationOperatingSystemIndex") || "0")
    commentSectionFrameWorkIndex = parseInt(localStorage.getItem("navigationFrameWorkIndex") || "0")
    commentSectionLanguageIndex = parseInt(localStorage.getItem("navigationLanguageIndex") || "0")
    commentSectionCountryIndex = parseInt(localStorage.getItem("mapCountryIndex") || "0")
    commentSectionStateIndex = parseInt(localStorage.getItem("mapStateIndex") || "0")

    getCommentSectionNameAndLinks()
    commentSectionInfo.prefix = commentSectionNamePrefix

    const commentSection = commentSectionHashMap.map.get(commentSectionNamePrefix+commentSectionName.value)
    if(commentSection)
    {
      commentsDisabled.value = commentSection.isDisabled
      commentSectionCommentCount.value = commentSection.commentCount
      commentSectionInfo.isCommentSectionReady = true
      commentSectionInfo.initiatorAddress = commentSection.commentSectionInitiatorAddress.toBase58()
      commentSectionInfo.videoVoteScore = commentSection.videoUpVoteScore.sub(commentSection.videoDownVoteScore)

      const chatAccount = customUserNameHashMap.map.get(commentSectionInfo.initiatorAddress)
      if(chatAccount) //Map may not be populated in time
        if(chatAccount.useCustomName)
          commentSectionInfo.initiatorDisplayName = chatAccount.userName
        else
          commentSectionInfo.initiatorDisplayName = commentSectionInfo.initiatorAddress
    }
    else
    {
      commentsDisabled.value = false
      commentSectionCommentCount.value = 0
      commentSectionInfo.isCommentSectionReady = false
      commentSectionInfo.initiatorAddress = ""
      commentSectionInfo.videoVoteScore = 0
      commentSectionInfo.initiatorDisplayName = ""
    }

    if(!hidenCommentSections.hidden)
      hideCommentsMessage.value = "Hide All Comment Sections"
    else
      hideCommentsMessage.value = "Show All Comment Sections"

    if(m4aComments.data)
      commentSectionComments.value = sortCommentSectionPostsAndProcessUserNames(m4aComments.data, commentSectionName.value)
    if(m4aReplies.data)
      commentSectionReplies.value = sortCommentSectionPostsAndProcessUserNames(m4aReplies.data, commentSectionName.value)
    if(m4aLv3Replies.data)
      commentSectionRepliesToReplies.value = sortCommentSectionPostsAndProcessUserNames(m4aLv3Replies.data, commentSectionName.value)
    if(m4aLv4Replies.data)
      commentSectionRemainingReplies.value = sortCommentSectionPostsAndProcessUserNames(m4aLv4Replies.data, commentSectionName.value)
  })

  watch([navigation, mapSelection], () =>
  {
    if(navigation.menuIndex != MenuIndex.M4A)
      return //This keeps it from sorting the comments an extra time when changing menu's before unmounting finishes

    commentSectionComments.value = []
    commentSectionCommentCount.value = 0
    commentSectionReplies.value = []
    commentSectionRepliesToReplies.value = []
    commentSectionRemainingReplies.value = []

    commentSectionNavbarIndex = navigation.navBarIndex
    commentSectionPageIndex = navigation.pageIndex
    commentSectionOperatingSystemIndex = navigation.operatingSystemIndex
    commentSectionFrameWorkIndex = navigation.frameWorkIndex
    commentSectionLanguageIndex = navigation.languageIndex
    commentSectionCountryIndex = mapSelection.countryIndex
    commentSectionStateIndex = mapSelection.stateIndex

    getCommentSectionNameAndLinks()
    const commentSection = commentSectionHashMap.map.get(commentSectionNamePrefix+commentSectionName.value)
    if(commentSection)
    {
      commentsDisabled.value = commentSection.isDisabled
      commentSectionCommentCount.value = commentSection.commentCount
      commentSectionInfo.isCommentSectionReady = true
      commentSectionInfo.initiatorAddress = commentSection.commentSectionInitiatorAddress.toBase58()
      commentSectionInfo.videoVoteScore = commentSection.videoUpVoteScore.sub(commentSection.videoDownVoteScore)

      const chatAccount = customUserNameHashMap.map.get(commentSectionInfo.initiatorAddress)
      if(chatAccount.useCustomName)
        commentSectionInfo.initiatorDisplayName = chatAccount.userName
      else
        commentSectionInfo.initiatorDisplayName = commentSectionInfo.initiatorAddress
    }
    else
    {
      commentsDisabled.value = false
      commentSectionCommentCount.value = 0
      commentSectionInfo.isCommentSectionReady = false
      commentSectionInfo.initiatorAddress = ""
      commentSectionInfo.videoVoteScore = 0
      commentSectionInfo.initiatorDisplayName = ""
    }

    if(!hidenCommentSections.hidden)
    {
      if(!commentsDisabled.value)
      {
        commentSectionComments.value = sortCommentSectionPostsAndProcessUserNames(m4aComments.data, commentSectionName.value)
        commentSectionReplies.value = sortCommentSectionPostsAndProcessUserNames(m4aReplies.data, commentSectionName.value)
        commentSectionRepliesToReplies.value = sortCommentSectionPostsAndProcessUserNames(m4aLv3Replies.data, commentSectionName.value)
        commentSectionRemainingReplies.value = sortCommentSectionPostsAndProcessUserNames(m4aLv4Replies.data, commentSectionName.value)
      } 
    }
  })

  watch(commentSectionHashMap, () =>
  {
    const commentSection = commentSectionHashMap.map.get(commentSectionNamePrefix+commentSectionName.value)
    if(commentSection)
    {
      commentsDisabled.value = commentSection.isDisabled
      commentSectionCommentCount.value = commentSection.commentCount
      commentSectionInfo.isCommentSectionReady = true
      commentSectionInfo.initiatorAddress = commentSection.commentSectionInitiatorAddress.toBase58()
      commentSectionInfo.videoVoteScore = commentSection.videoUpVoteScore.sub(commentSection.videoDownVoteScore)

      const chatAccount = customUserNameHashMap.map.get(commentSectionInfo.initiatorAddress)
      if(chatAccount.useCustomName)
        commentSectionInfo.initiatorDisplayName = chatAccount.userName
      else
        commentSectionInfo.initiatorDisplayName = commentSectionInfo.initiatorAddress
    }
    else
    {
      commentsDisabled.value = false
      commentSectionCommentCount.value = 0
      commentSectionInfo.isCommentSectionReady = false
      commentSectionInfo.initiatorAddress = ""
      commentSectionInfo.videoVoteScore = 0
      commentSectionInfo.initiatorDisplayName = ""
    }
  })

  watch(m4aComments, async() =>
  {
    if(hidenCommentSections.hidden)
      return []

    commentSectionComments.value = sortCommentSectionPostsAndProcessUserNames(m4aComments.data, commentSectionName.value)
  })

  watch(m4aReplies, async() => 
  {
    if(hidenCommentSections.hidden)
      return []
    
    commentSectionReplies.value = sortCommentSectionPostsAndProcessUserNames(m4aReplies.data, commentSectionName.value)
  })

  watch(m4aLv3Replies, async() =>
  {
    if(hidenCommentSections.hidden)
      return []
   
    commentSectionRepliesToReplies.value = sortCommentSectionPostsAndProcessUserNames(m4aLv3Replies.data, commentSectionName.value)
  })

  watch(m4aLv4Replies, async() =>
  {
    if(hidenCommentSections.hidden)
      return []

    commentSectionRemainingReplies.value = sortCommentSectionPostsAndProcessUserNames(m4aLv4Replies.data, commentSectionName.value)
  })

  watch(customUserNameHashMap, () =>
  {
    if(commentSectionInfo.initiatorAddress == "")
      return
    
    const chatAccount = customUserNameHashMap.map.get(commentSectionInfo.initiatorAddress)
    if(chatAccount.useCustomName)
      commentSectionInfo.initiatorDisplayName = chatAccount.userName
    else
      commentSectionInfo.initiatorDisplayName = commentSectionInfo.initiatorAddress

    commentSectionComments.value = sortCommentSectionPostsAndProcessUserNames(m4aComments.data, commentSectionName.value)
    commentSectionReplies.value = sortCommentSectionPostsAndProcessUserNames(m4aReplies.data, commentSectionName.value)
    commentSectionRepliesToReplies.value = sortCommentSectionPostsAndProcessUserNames(m4aLv3Replies.data, commentSectionName.value)
    commentSectionRemainingReplies.value = sortCommentSectionPostsAndProcessUserNames(m4aLv4Replies.data, commentSectionName.value)
  })

  function reOrderList()
  {
    if(toggleList.value === "column")
    {
      sortMessage.value =  "Show: Oldest To Newest"
      toggleList.value = "column-reverse"
    }
    else
    {
      sortMessage.value =  "Show: Newest To Oldest"
      toggleList.value = "column"
    }
  }

  async function toggleShowComments()
  {
    reloadingData.value = true; //Keeps user from multi clicking and loading the comments too many times, saves them from themselves

    if(hidenCommentSections.hidden)
    {
      getCommentSectionNameAndLinks()
      commentSectionComments.value = sortCommentSectionPostsAndProcessUserNames(m4aComments.data, commentSectionName.value)
      commentSectionReplies.value = sortCommentSectionPostsAndProcessUserNames(m4aReplies.data, commentSectionName.value)
      commentSectionRepliesToReplies.value = sortCommentSectionPostsAndProcessUserNames(m4aLv3Replies.data, commentSectionName.value)
      commentSectionRemainingReplies.value = sortCommentSectionPostsAndProcessUserNames(m4aLv4Replies.data, commentSectionName.value)

      hideCommentsMessage.value = "Hide All Comment Sections"
      localStorage.setItem("hideComments", "false")
      hidenCommentSections.hidden = false
    }
    else
    {
      commentSectionComments.value = []
      commentSectionReplies.value = []
      commentSectionRepliesToReplies.value = []
      commentSectionRemainingReplies.value = []

      hideCommentsMessage.value = "Show All Comment Sections"
      localStorage.setItem("hideComments", "true")
      hidenCommentSections.hidden = true
    }

    reloadingData.value = false;
  }

  async function setCommentSectionFlag(flag: boolean)
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.setCommentSectionFlag
      (
        commentSectionNamePrefix, commentSectionName.value,
        flag
      ).rpc()

      await confirmChatTransaction(tx, toast, "set_comment_section_flag")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "set_comment_section_flag")
    }
  }

  function getCommentSectionNameAndLinks()
  {
    //M4A 110 Comment Section
    if(commentSectionNavbarIndex == 0 && commentSectionPageIndex >= 4)
    {
      commentSectionName.value = M4A110CommentSectionNamesAfterPathSelection[commentSectionOperatingSystemIndex][commentSectionFrameWorkIndex][commentSectionLanguageIndex][commentSectionPageIndex-4]
      feeFreeLink.value = M4A110LinksAfterPathSelection[commentSectionOperatingSystemIndex][commentSectionFrameWorkIndex][commentSectionLanguageIndex][commentSectionPageIndex-4]
    }
    //M4A Map Comment Section
    else if(commentSectionNavbarIndex == 3 && commentSectionCountryIndex != -1 && commentSectionStateIndex != -1)
    {
      commentSectionName.value = commentSectionName.value = "Country: " + commentSectionCountryIndex.toString() + " State: " + commentSectionStateIndex.toString()
      feeFreeLink.value = ""
    }
    //M4A Comment Section
    else
    {
      commentSectionName.value = commentSectionNames[commentSectionNavbarIndex][commentSectionPageIndex]
      feeFreeLink.value = feeFreeCommentLinks[commentSectionNavbarIndex][commentSectionPageIndex]
    }

    commentSectionInfo.name = commentSectionName.value
  }
</script>

<style scoped>
  #commentSection
  {
    
    display: flex;
    flex-direction: column
  }

  #sortButton
  {
    margin-bottom: 10px
  }

  .extraSpace
  {
    height: 200px
  }
</style>
