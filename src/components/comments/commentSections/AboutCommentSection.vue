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
  import { aboutComments, aboutReplies, aboutLv3Replies, aboutLv4Replies } from '/src/assets/globalStates/chat/Posts.vue'
  import AddComment from '/src/components/comments/AddComment.vue'
  import CommentList from '/src/components/comments/commentsAndReplies/CommentList.vue'
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
  //var commentSectionOperatingSystemIndex = ref()
  //var commentSectionFrameWorkIndex = ref()
  //var commentSectionLanguageIndex = ref()

  var reloadingData = ref()

  var commentSectionName = ref()
  var feeFreeLink = ref()

  const commentSectionNamePrefix = "About"
  const commentSectionNames =
  [
    ["Overview", "Palestine", "Warsaw", "TheObvious",  "TheEvenMoreObvious", "TYABTE", "TYABTEx2", "Epstein", "USI", "Handful", "CEO", "LegalFrameWork"], 
    ["Stats"],
    ["Admin"]
  ]

  const feeFreeCommentLinks =
  [
    [
      "",
      "",
      "https://youtu.be/zPh16BCtB_I?t=379", //Warsaw
      "https://www.youtube.com/shorts/0AQUYaXnHZk", //TheObvious
      "https://www.youtube.com/shorts/Ib_E5rqyBIg", //TheEvenMoreObvious
      "https://www.youtube.com/shorts/CLpLHSwcqZI", //TYABTE
      "https://www.youtube.com/watch?v=v8Suyxaj26s", //TYABTEx2
      "https://youtu.be/YeHprJpqxoI?t=750", //Epstein
      "https://www.youtube.com/watch?v=wyM52KT7V3A", //USI
      "https://www.youtube.com/watch?v=mgxmDFG0ZGw", //Handful
      "",
      ""],
    [""],
    [""]
  ]
  
  onMounted(() => 
  {
    commentSectionNavbarIndex = parseInt(localStorage.getItem("navigationNavbarIndex") || "0")
    commentSectionPageIndex= parseInt(localStorage.getItem("navigationPageIndex") || "0")
    //commentSectionOperatingSystemIndex.value = parseInt(localStorage.getItem("navigationOperatingSystemIndex") || "0")
    //commentSectionFrameWorkIndex.value = parseInt(localStorage.getItem("navigationFrameWorkIndex") || "0")
    //commentSectionLanguageIndex.value = parseInt(localStorage.getItem("navigationLanguageIndex") || "0")

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

    if(aboutComments.data)
      commentSectionComments.value = sortCommentSectionPostsAndProcessUserNames(aboutComments.data, commentSectionName.value)
    if(aboutReplies.data)
      commentSectionReplies.value = sortCommentSectionPostsAndProcessUserNames(aboutReplies.data, commentSectionName.value)
    if(aboutLv3Replies.data)
      commentSectionRepliesToReplies.value = sortCommentSectionPostsAndProcessUserNames(aboutLv3Replies.data, commentSectionName.value)
    if(aboutLv4Replies.data)
      commentSectionRemainingReplies.value = sortCommentSectionPostsAndProcessUserNames(aboutLv4Replies.data, commentSectionName.value)
  })

  watch(navigation, () =>
  {
    if(navigation.menuIndex != MenuIndex.About)
      return //This keeps it from sorting the comments an extra time when changing menu's before unmounting finishes

    commentSectionComments.value = []
    commentSectionCommentCount.value = 0
    commentSectionReplies.value = []
    commentSectionRepliesToReplies.value = []
    commentSectionRemainingReplies.value = []

    commentSectionNavbarIndex = navigation.navBarIndex
    commentSectionPageIndex = navigation.pageIndex
    //commentSectionOperatingSystemIndex.value = navigation.operatingSystemIndex
    //commentSectionFrameWorkIndex.value = navigation.frameWorkIndex
    //commentSectionLanguageIndex.value = navigation.languageIndex

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
        commentSectionComments.value = sortCommentSectionPostsAndProcessUserNames(aboutComments.data, commentSectionName.value)
        commentSectionReplies.value = sortCommentSectionPostsAndProcessUserNames(aboutReplies.data, commentSectionName.value)
        commentSectionRepliesToReplies.value = sortCommentSectionPostsAndProcessUserNames(aboutLv3Replies.data, commentSectionName.value)
        commentSectionRemainingReplies.value = sortCommentSectionPostsAndProcessUserNames(aboutLv4Replies.data, commentSectionName.value)
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

  watch(aboutComments, async() =>
  {
    if(hidenCommentSections.hidden)
      return []

    commentSectionComments.value = sortCommentSectionPostsAndProcessUserNames(aboutComments.data, commentSectionName.value)
  })

  watch(aboutReplies, async() =>
  {
    if(hidenCommentSections.hidden)
      return []
    
    commentSectionReplies.value = sortCommentSectionPostsAndProcessUserNames(aboutReplies.data, commentSectionName.value)
  })

  watch(aboutLv3Replies, async() =>
  {
    if(hidenCommentSections.hidden)
      return []
   
    commentSectionRepliesToReplies.value = sortCommentSectionPostsAndProcessUserNames(aboutLv3Replies.data, commentSectionName.value)
  })

  watch(aboutLv4Replies, async() =>
  {
    if(hidenCommentSections.hidden)
      return []

    commentSectionRemainingReplies.value = sortCommentSectionPostsAndProcessUserNames(aboutLv4Replies.data, commentSectionName.value)
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
    
    commentSectionComments.value = sortCommentSectionPostsAndProcessUserNames(aboutComments.data, commentSectionName.value)
    commentSectionReplies.value = sortCommentSectionPostsAndProcessUserNames(aboutReplies.data, commentSectionName.value)
    commentSectionRepliesToReplies.value = sortCommentSectionPostsAndProcessUserNames(aboutLv3Replies.data, commentSectionName.value)
    commentSectionRemainingReplies.value = sortCommentSectionPostsAndProcessUserNames(aboutLv4Replies.data, commentSectionName.value)
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
    reloadingData.value = true //Keeps user from multi clicking and loading the comments too many times, saves them from themselves

    if(hidenCommentSections.hidden)
    {
      getCommentSectionNameAndLinks()
      commentSectionComments.value = sortCommentSectionPostsAndProcessUserNames(aboutComments.data, commentSectionName.value)
      commentSectionReplies.value = sortCommentSectionPostsAndProcessUserNames(aboutReplies.data, commentSectionName.value)
      commentSectionRepliesToReplies.value = sortCommentSectionPostsAndProcessUserNames(aboutLv3Replies.data, commentSectionName.value)
      commentSectionRemainingReplies.value = sortCommentSectionPostsAndProcessUserNames(aboutLv4Replies.data, commentSectionName.value)

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

    reloadingData.value = false
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
    commentSectionName.value = commentSectionNames[commentSectionNavbarIndex][commentSectionPageIndex]
    feeFreeLink.value = feeFreeCommentLinks[commentSectionNavbarIndex][commentSectionPageIndex]
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
