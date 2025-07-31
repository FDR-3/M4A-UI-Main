<template>
  <div :id="id" class="replyWrapper">

    <!--Horizontal Reply-->
    <div class="horizontalReply thickBorder smallMarginTop">
      <div class="flexCenterColumn leftContainer">
        <div class="user">
          <ion-button fill="clear" @click="openUserPopover($event)">
          <StarWolf id="userIcon" :fill="postOwnerAddress.toBase58()==adminAccounts.chatCEOAddress ? colorHexValue : darkTheme.value ? '#FFFFFF' : '#000000'"/>
        
            <div class="flexCenterColumn">
              <ion-label color="dark">
                {{ displayName }}
              </ion-label>

              <ion-label v-if="postOwnerAddress.toBase58()==adminAccounts.chatCEOAddress" :color="colorName">
                fdr-3
              </ion-label>
            </div>
          </ion-button>
          <ion-popover 
            :is-open="userPopoverOpen" 
            :event="event" 
            @didDismiss="userPopoverOpen=false"
            side="top" 
            alignment="center"
          >
            <ion-button id="replyCopyAddressButton" :color="colorName" @click="passByRefWrapperCopyAddress()" @mouseleave="closeUserPopover($event)">
              <ion-label color="dark">{{copyFullAddressButtonText}}</ion-label>
            </ion-button>
          </ion-popover> 
        </div>

        <!--Vote Bar-->
        <div class="voteBarContainer">
          <VoteBar
            :colorName="colorName"
            :colorHexValue="colorHexValue"
            type="replyToLv3Reply"
            :commentSectionNamePrefix="commentSectionNamePrefix"
            :commentSectionName="commentSectionName"
            :postOwnerAddress="postOwnerAddress"
            :chatAccountPostCountIndex="chatAccountPostCountIndex"
            :netVoteScore="netVoteScore" 
            :isDeleted="isDeleted"
          />
        </div>
      </div>
      <div class="flexCenterColumn middleContainer">

        <!--CEO Bar-->
        <div v-if="connectedWallet.addressString==adminAccounts.chatCEOAddress" class="flexCenterRow">
          <div>
            <ion-button fill="clear" @click="isStarred ? unstarLv4Reply() : starLv4Reply()">
              <StarWolf id="ceoStarReplyButton" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
            </ion-button>
          </div>
          <div>
            <ion-button fill="clear" @click="isFed ? unFEDLv4Reply() : fedLv4Reply()">
              <img id="ceoStarReplyButton" color="dark" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNaVZq9XioXKfgiJR3mI9SN2wMY8ULeF1syb7v"/>
            </ion-button>
          </div>
        </div>

        <!--Quality Of Life Bar-->
        <div>
          <div class="flexCenterRow">
            <ion-button fill="clear" @click="openPostInSolanaExplorer()">
              <SolanaSVG slot="icon-only"/>
            </ion-button>

            <div v-if="isStarred">
              <HStarredComment id="rainbowStarWolf" @click="openStarredPopover($event)"/>
            </div>
            <ion-popover 
              :is-open="starredPopoverOpen" 
              :event="event" 
              @didDismiss="starredPopoverOpen=false"
              side="top" 
              alignment="center"
            >
              <div class="flexCenterColumn ceoPopupInfo">
                <ion-label color="dark">The CEO has starred your idea!</ion-label>
              </div>
            </ion-popover> 

            <div v-if="embeddedYouTubeLink && !isDeleted">
              <ion-button v-if="showVideoMessage" fill="clear" @click="setShowVideoMessage(false)">
                <YoutubeSVG class="videoReplyButton"/>
                <ion-label color="dark">Hide Video Reply</ion-label>
              </ion-button>
              <ion-button v-else-if="!editMode" fill="clear" @click="setShowVideoMessage(true)">
                <YoutubeSVG class="videoReplyButton"/>
                <ion-label color="dark">Show Video Reply</ion-label>
              </ion-button>
            </div>

            <ion-label v-if="isFed" color="dark" title="Federal Agent!" style="font-size: 55px !important" @click="openFEDPopover($event)">🕴🏻</ion-label>
            <ion-popover 
              :is-open="fedPopoverOpen" 
              :event="event" 
              @didDismiss="fedPopoverOpen=false"
              side="top"
              alignment="center"
            >
              <div class="flexCenterColumn ceoPopupInfo">
                <ion-label color="dark">Federal Agent!</ion-label>
              </div>
            </ion-popover> 
          </div>
        </div>
        <div v-if="embeddedYouTubeLink && showVideoMessage && !isDeleted">
          <div class="smallMarginBottom">
            <ion-text>{{ parsedMessage }}</ion-text>
          </div>
          <iframe
            :src=embeddedYouTubeLink
            allowfullscreen
            allowtransparency
            allow="autoplay"
            class="horizontalPostVideoContainer"
          ></iframe>
        </div>

        <!--Message Content-->
        <div v-else-if="!editMode" class="postContent">
          <ion-text v-if="isDeleted" class="emojiTextSmaller">Post Deleted By User</ion-text>
          <ion-text v-else class="emojiTextSmaller">{{ embeddedYouTubeLink || parsedMessage ? parsedMessage : msg }}</ion-text>
        </div>
        <div v-else-if="editMode && connectedWallet.addressString == postOwnerAddress.toBase58()" class="postContent">
          <ion-textarea
            ref="editTextAreaH"
            class="emojiTextSmaller"
            v-model="editedMessage"
            fill="outline" 
            :counter="true"
            :maxlength=MAX_COMMENT_LENGTH
            :counter-formatter="editCustomFormatter"
          >
            <EmojiButton 
              :colorHexValue="colorHexValue"
              @emojiSelected="(emoji: String) => insertEditEmoji(emoji)"
            />
          </ion-textarea>
        </div>

        <div v-if="isEdited" class="smallMarginTop">
          <ion-text>(Edited)</ion-text>
        </div>

        <div v-if="replyCount!=0">
          <ion-button class="showRepliesButton" v-if="!showReplies" @click="toggleShowReplies(true)" fill="clear" :color="colorName">
            Show Replies({{ replyCount }})
          </ion-button>
          <ion-button class="showRepliesButton" v-else-if="showReplies" @click="toggleShowReplies(false)" fill="clear" :color="colorName">
            Hide Replies({{ replyCount }})
          </ion-button>
        </div>
      </div>
      <div class= "endContainer">

        <!--Time And Date-->
        <ion-label class="replyDate">{{ convertUnixTimeToLocalTime(unixCreationTimeStamp) }}<br>{{ convertUnixTimeToLocalDate(unixCreationTimeStamp) }}</ion-label>

        <!--Action Bar-->
        <CommentActionBar 
          v-if="!editMode"
          type="replyToLv3Reply"
          :commentSectionNamePrefix="commentSectionNamePrefix"
          :commentSectionName="commentSectionName"
          :chatAccountPostCountIndex="chatAccountPostCountIndex"
          :postOwnerAddress="postOwnerAddress" 
          @replyToComment="replying=true" 
          @editComment="editMode=true; showVideoMessage=false"
          :colorName="colorName"
          :colorHexValue="colorHexValue"
          :isDeleted="isDeleted"
        />
        <EditBar v-if="editMode" @saveEdit="saveEdit()" @cancelEdit="editMode=false" :colorName="colorName"/>
      </div>
    </div>

    <!--Vertical Reply-->
    <div class="verticalReply thickBorder smallMarginTop">
      <div class="flexCenterColumn leftContainer">

        <!--Vote Bar-->
        <div class="voteBarContainer">
          <VoteBar
            :colorName="colorName"
            :colorHexValue="colorHexValue"
            type="replyToLv3Reply"
            :commentSectionNamePrefix="commentSectionNamePrefix"
            :commentSectionName="commentSectionName"
            :postOwnerAddress="postOwnerAddress"
            :chatAccountPostCountIndex="chatAccountPostCountIndex"
            :netVoteScore="netVoteScore" 
            :isDeleted="isDeleted"
          />
        </div>
      </div>
      <div class="middleContainer">

        <!--User-->
        <div class="user">
          <ion-button fill="clear" @click="openUserPopover($event)">
          <StarWolf id="userIcon" :fill="postOwnerAddress.toBase58()==adminAccounts.chatCEOAddress ? colorHexValue : darkTheme.value ? '#FFFFFF' : '#000000'"/>
        
            <div class="flexCenterColumn">
              <ion-label color="dark">
                {{ displayName }}
              </ion-label>

              <ion-label v-if="postOwnerAddress.toBase58()==adminAccounts.chatCEOAddress" :color="colorName">
                fdr-3
              </ion-label>
            </div>
          </ion-button>
          <ion-popover 
            :is-open="userPopoverOpen" 
            :event="event" 
            @didDismiss="userPopoverOpen=false"
            side="top" 
            alignment="center"
          >
            <ion-button id="replyCopyAddressButton" :color="colorName" @click="passByRefWrapperCopyAddress()" @mouseleave="closeUserPopover($event)">
              <ion-label color="dark">{{copyFullAddressButtonText}}</ion-label>
            </ion-button>
          </ion-popover> 
        </div>

        <!--Time And Date-->
        <ion-label class="replyDate mediumMarginBottom">{{ convertUnixTimeToLocalTime(unixCreationTimeStamp) }}<br>{{ convertUnixTimeToLocalDate(unixCreationTimeStamp) }}</ion-label>

        <!--CEO Bar-->
        <div v-if="connectedWallet.addressString==adminAccounts.chatCEOAddress" class="flexCenterRow">
          <div>
            <ion-button fill="clear" @click="isStarred ? unstarLv4Reply() : starLv4Reply()">
              <StarWolf id="ceoStarReplyButton" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
            </ion-button>
          </div>
          <div>
            <ion-button fill="clear" @click="isFed ? unFEDLv4Reply() : fedLv4Reply()">
              <img id="ceoStarReplyButton" color="dark" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNaVZq9XioXKfgiJR3mI9SN2wMY8ULeF1syb7v"/>
            </ion-button>
          </div>
        </div>

        <!--Quality Of Life Bar-->
        <div>
          <div class="flexCenterRow">
            <ion-button fill="clear" @click="openPostInSolanaExplorer()">
              <SolanaSVG slot="icon-only"/>
            </ion-button>

            <div v-if="isStarred">
              <VStarredComment id="rainbowStarWolf" @click="openStarredPopover($event)"/>
            </div>
            <ion-popover 
              :is-open="starredPopoverOpen" 
              :event="event" 
              @didDismiss="starredPopoverOpen=false"
              side="top" 
              alignment="center"
            >
              <div class="flexCenterColumn ceoPopupInfo">
                <ion-label color="dark">The CEO has starred your idea!</ion-label>
              </div>
            </ion-popover> 

            <div v-if="embeddedYouTubeLink && !isDeleted">
              <ion-button v-if="showVideoMessage" fill="clear" @click="setShowVideoMessage(false)">
                <YoutubeSVG class="videoReplyButton"/>
                <ion-label align="left" class="videoReplyLabel" color="dark">Hide Video Reply</ion-label>
              </ion-button>
              <ion-button v-else-if="!editMode" fill="clear" @click="setShowVideoMessage(true)">
                <YoutubeSVG class="videoReplyButton"/>
                <ion-label align="left" class="videoReplyLabel" color="dark">Show Video Reply</ion-label>
              </ion-button>
            </div>

            <ion-label v-if="isFed" color="dark" title="Federal Agent!" style="font-size: 55px !important" @click="openFEDPopover($event)">🕴🏻</ion-label>
            <ion-popover 
              :is-open="fedPopoverOpen" 
              :event="event" 
              @didDismiss="fedPopoverOpen=false"
              side="top"
              alignment="center"
            >
              <div class="flexCenterColumn ceoPopupInfo">
                <ion-label color="dark">Federal Agent!</ion-label>
              </div>
            </ion-popover> 
          </div>
        </div>
        <div v-if="embeddedYouTubeLink && showVideoMessage && !isDeleted">
          <div class="smallMarginBottom">
            <ion-text>{{ parsedMessage }}</ion-text>
          </div>
          <iframe
            :src=embeddedYouTubeLink
            allowfullscreen
            allowtransparency
            allow="autoplay"
            class="videoContainer smallMarginLeft"
          ></iframe>
        </div>

        <!--Message Content-->
        <div v-else-if="!editMode" class="postContent">
          <ion-text v-if="isDeleted" class="emojiTextSmaller">Post Deleted By User</ion-text>
          <ion-text v-else class="emojiTextSmaller">{{ embeddedYouTubeLink || parsedMessage ? parsedMessage : msg }}</ion-text>
        </div>
        <div v-else-if="editMode && connectedWallet.addressString == postOwnerAddress.toBase58()" class="postContent">
          <ion-textarea
            ref="editTextAreaV"
            class="emojiTextSmaller"
            v-model="editedMessage"
            fill="outline" 
            :counter="true"
            :maxlength=MAX_COMMENT_LENGTH
            :counter-formatter="editCustomFormatter"
          >
            <EmojiButton 
              :colorHexValue="colorHexValue"
              @emojiSelected="(emoji: String) => insertEditEmoji(emoji)"
            />
          </ion-textarea>
        </div>

        <EditBar v-if="editMode" @saveEdit="saveEdit()" @cancelEdit="editMode=false" :colorName="colorName"/>

        <div v-if="isEdited" class="mediumSmallMarginTop">
          <ion-text>(Edited)</ion-text>
        </div>

        <!--Action Bar-->
        <CommentActionBar 
          v-if="!editMode"
          type="replyToLv3Reply"
          :commentSectionNamePrefix="commentSectionNamePrefix"
          :commentSectionName="commentSectionName"
          :chatAccountPostCountIndex="chatAccountPostCountIndex"
          :postOwnerAddress="postOwnerAddress" 
          @replyToComment="replying=true" 
          @editComment="editMode=true; showVideoMessage=false"
          :colorName="colorName"
          :colorHexValue="colorHexValue"
          :isDeleted="isDeleted"
        />

        <div v-if="replyCount!=0" :class=" editMode ? '' : 'tinyMarginTop'">
          <ion-button class="showRepliesButton" v-if="!showReplies" @click="toggleShowReplies(true)" fill="clear" :color="colorName">
            Show Replies({{ replyCount }})
          </ion-button>
          <ion-button class="showRepliesButton" v-else-if="showReplies" @click="toggleShowReplies(false)" fill="clear" :color="colorName">
            Hide Replies({{ replyCount }})
          </ion-button>
        </div>
      </div>
    </div>

    <!--Reply Section-->
    <div v-if="replying && (connectedWallet.addressString != SYSTEM_PROGRAM_ADDRESS_STRING)" class="replyOrCancelContainer">
      <ion-textarea 
        ref="postReplyTextArea"
        v-model="replyMessage"
        class="postReplyInput emojiTextSmaller"  
        color="dark"
        fill="outline"
        placeholder="Reply for $0.04"
        :counter="true"
        :maxlength=MAX_COMMENT_LENGTH
        :counter-formatter="replyCustomFormatter"
      >
        <EmojiButton 
          :colorHexValue="colorHexValue"
          @emojiSelected="(emoji: String) => insertReplyEmoji(emoji)"
        />
      </ion-textarea>

      <div class="replyButtonsContainer">
        <ion-button 
          v-if="!connectedWallet.isChatAccountReady"
          @click="createChatAccount()"
          class="replyButtons"
          fill="outline" 
          color="dark"
        >
          <ion-label :color="colorName">Create Your Chat Account</ion-label>
        </ion-button>

        <ion-button
          v-else
          @click="postLv4Reply()" 
          fill="outline"  
          class="replyButtons" 
          color="dark"
          :disabled="overReplyByteSizeLimit || replyMessage==''"
        >
          <ion-label :color="colorName">Reply</ion-label>
        </ion-button>

        <ion-button @click="replying=false; replyMessage=''" class="replyButtons" fill="outline" color="dark">
          <ion-label :color="colorName">Cancel</ion-label>
        </ion-button>
      </div>
    </div>
    
    <ReplyLv4List 
      v-if="showReplies"
      id="replies" 
      class="fancyLine"
      :commentSectionNamePrefix="commentSectionNamePrefix"
      :commentSectionName="commentSectionName"
      :replies="replyTuple[REPLY_LIST_INDEX]"
      :remainingReplies="replyTuple[REMAINING_REPLIES_INDEX]"
      :colorName="colorName"
      :colorHexValue="colorHexValue"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, onUpdated, computed, inject, watch } from 'vue'
  import { IonLabel, IonText, IonTextarea, IonButton, IonPopover } from '@ionic/vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import HStarredComment from '/src/components/fancy/HStarredComment.vue'
  import VStarredComment from '/src/components/fancy/VStarredComment.vue'
  import YoutubeSVG from '/src/assets/svg/youtube-svg.vue'
  import VoteBar from '/src/components/comments/vote/VoteBar.vue'
  import ReplyLv4List from '/src/components/comments/commentsAndReplies/ReplyLv4List.vue'
  import CommentActionBar from '/src/components/comments/CommentActionBar.vue'
  import EmojiButton from '/src/components/comments/emojis/EmojiButton.vue'
  import EditBar from '/src/components/comments/EditBar.vue'
  import { parseYoutubeLink } from './Functions.ts'
  import { copyFullAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { MAX_COMMENT_LENGTH, REPLY_LIST_INDEX, REMAINING_REPLIES_INDEX } from '../constants.ts'
  import { navigation, MenuIndex } from '/src/assets/globalStates/Navigation.vue'
  import { confirmChatTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { convertUnixTimeToLocalDate, convertUnixTimeToLocalTime } from '/src/assets/helperFunctions/UnixTimeStampHelper.ts'
  import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { getM4ALv4ReplyPDA, getPLILv4ReplyPDA, getAboutLv4ReplyPDA } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import SolanaSVG from '/src/assets/svg/solana-svg.vue'

  const props = defineProps(
  [
    'commentSectionNamePrefix',
    'commentSectionName', 
    'remainingReplies',
    'colorName',
    'colorHexValue',
    'replyCount',
    'id',
    'chatAccountPostCountIndex', 
    'postOwnerAddress',
    'displayName',
    'netVoteScore', 
    'unixCreationTimeStamp',
    'msg',
    'isEdited',
    'isDeleted',
    'isStarred',
    'isFed',
  ])

  const toast = inject('toast')

  var copyFullAddressButtonText = ref("Copy Full Address")
  var replying = ref()
  var editMode = ref()
  var editedMessage = ref()
  var replyMessage = ref("")//Set as string initially for length to insert emoji
  var showReplies = ref()
  var savedEditEmojiCursorPosition: any
  var savedReplyEmojiCursorPosition: any
  var embeddedYouTubeLink = ref()
  var showVideoMessage = ref()
  var parsedMessage = ref()

  var editTextAreaH = ref()
  var editTextAreaV = ref()
  var postReplyTextArea = ref()

  var userPopoverOpen = ref()
  var starredPopoverOpen = ref()
  var fedPopoverOpen = ref()
  var event = ref()

  var overReplyByteSizeLimit = ref()

  onMounted(async() => 
  {
    editedMessage.value = props.msg; //Need semicolon here because of tuple line next
    [parsedMessage.value, embeddedYouTubeLink.value] = parseYoutubeLink(props.msg as string)
  })  

  watch(() => props.msg, (async() => 
  {
    [parsedMessage.value, embeddedYouTubeLink.value] = parseYoutubeLink(props.msg as string)
  }))

  function passByRefWrapperCopyAddress()
  {
    copyFullAddress(copyFullAddressButtonText, props.postOwnerAddress)
  }

  const replyTuple = computed (() =>
  {
    var sortedReplyReplies: any[] = []
    var sortedRemainingReplies: any[] = []

    for(var i=0; i<props.remainingReplies.length; i++)
    {
      if(props.remainingReplies[i].account.parentId.eq(props.id))
        sortedReplyReplies.push(props.remainingReplies[i])
      else 
        sortedRemainingReplies.push(props.remainingReplies[i]) 
    }

    return [sortedReplyReplies.sort((a: any, b: any) => a.account.id.sub(b.account.id)),
    sortedRemainingReplies.sort((a: any, b: any) => a.account.id.sub(b.account.id))]
  })

  const editCustomFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([editedMessage.value])
    const sizeInBytes = blob.size

    inputLength = sizeInBytes

    if(inputLength > maxLength)
    {
      overReplyByteSizeLimit.value = true
    }
    else
      overReplyByteSizeLimit.value = false

    return `${inputLength}/${maxLength} `
  }

  const replyCustomFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([replyMessage.value])
    const sizeInBytes = blob.size

    inputLength = sizeInBytes

    if(inputLength > maxLength)
    {
      overReplyByteSizeLimit.value = true
    }
    else
      overReplyByteSizeLimit.value = false

    return `${inputLength}/${maxLength} `
  }

  function setShowVideoMessage(showVideo: boolean)
  {
    showVideoMessage.value = showVideo

    if(showVideo)
    {
      setTimeout(() => 
      {
        document.getElementById(props.id)?.scrollIntoView() // Revert to the initial value
      }, 20) // 2000 milliseconds = 2 seconds
    }
  }

  function toggleShowReplies(show: boolean)
  {
    showReplies.value = show

    if(show)
    {
      setTimeout(() => 
      {
        document.getElementById(props.id)?.scrollIntoView() //Scroll to the comment that had it's replies opened
      }, 20) // 2000 milliseconds = 2 seconds
    }
  }

  function openUserPopover(e: Event) 
  {
    event.value = e
    userPopoverOpen.value = true
  }

  function openStarredPopover(e: Event) 
  {
    event.value = e
    starredPopoverOpen.value = true
  }

  function openFEDPopover(e: Event) 
  {
    event.value = e
    fedPopoverOpen.value = true
  }

  function closeUserPopover(e: Event) 
  {
    event.value = e
    userPopoverOpen.value = false
  }

  //Move cursor back after emoji insert
  onUpdated(() => 
  {
    //Move cursor back after inserting emoji in reply
    var textAreaElement = postReplyTextArea.value?.$el.querySelector(".native-textarea")
    if(savedReplyEmojiCursorPosition != undefined)
      if(textAreaElement)
      {
        textAreaElement.setSelectionRange(savedReplyEmojiCursorPosition, savedReplyEmojiCursorPosition)
        textAreaElement.focus()
        savedReplyEmojiCursorPosition = undefined
      }

    //Move cursor back after inserting emoji in edited msg
    if(window.innerWidth > 1050)
      textAreaElement = editTextAreaH.value?.$el.querySelector(".native-textarea")
    else
      textAreaElement = editTextAreaV.value?.$el.querySelector(".native-textarea")
    if(savedEditEmojiCursorPosition != undefined)
      if(textAreaElement)
      {
        textAreaElement.setSelectionRange(savedEditEmojiCursorPosition, savedEditEmojiCursorPosition)
        textAreaElement.focus()
        savedEditEmojiCursorPosition = undefined
      }     
  })

  function insertEditEmoji(emoji: String)
  {
    var textAreaElement
    if(window.innerWidth > 1050)
      textAreaElement = editTextAreaH.value?.$el.querySelector(".native-textarea")
    else
      textAreaElement = editTextAreaV.value?.$el.querySelector(".native-textarea")
    
    if(textAreaElement) 
    {
      const start = textAreaElement.selectionStart
      const end = textAreaElement.selectionEnd
      const newValue = 
      editedMessage.value.substring(0, start) + 
      emoji + 
      editedMessage.value.substring(end)

      editedMessage.value = newValue

      savedEditEmojiCursorPosition = textAreaElement.selectionStart + emoji.length
    }
  }

  function insertReplyEmoji(emoji: String)
  {
    var textAreaElement = postReplyTextArea.value.$el.querySelector(".native-textarea")
    if(textAreaElement) 
    {
      //Keeps emoji search bar from blinking every time you select an emoji
      //textAreaElement.focus()

      const start = textAreaElement.selectionStart
      const end = textAreaElement.selectionEnd
      const newValue =
      replyMessage.value.substring(0, start) + 
      emoji + 
      replyMessage.value.substring(end)

      replyMessage.value = newValue

      savedReplyEmojiCursorPosition = textAreaElement.selectionStart + emoji.length

      //Keeps emoji search bar from blinking every time you select an emoji
      //textAreaElement.focus()
    }
  }

  async function createChatAccount()
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.createChatAccount().rpc()
      await confirmChatTransaction(tx, toast, "create_chat_account")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "create_chat_account")
    }
  }

  function openPostInSolanaExplorer()
  {
    if(navigation.menuIndex == MenuIndex.M4A)
    {
      const postPDA = getM4ALv4ReplyPDA(props.commentSectionNamePrefix, props.commentSectionName, props.chatAccountPostCountIndex, props.postOwnerAddress).toBase58()
      window.open(`https://explorer.solana.com/address/${postPDA}?cluster=devnet`, "_blank")
    }
    else if(navigation.menuIndex == MenuIndex.PLI)
    {
      const postPDA = getPLILv4ReplyPDA(props.commentSectionNamePrefix, props.commentSectionName, props.chatAccountPostCountIndex, props.postOwnerAddress).toBase58()
      window.open(`https://explorer.solana.com/address/${postPDA}?cluster=devnet`, "_blank")
    }
    else if(navigation.menuIndex == MenuIndex.About)
    {
      const postPDA = getAboutLv4ReplyPDA(props.commentSectionNamePrefix, props.commentSectionName, props.chatAccountPostCountIndex, props.postOwnerAddress).toBase58()
      window.open(`https://explorer.solana.com/address/${postPDA}?cluster=devnet`, "_blank")
    }
  }

  async function saveEdit()
  {
    var tx
    var contractFunctionName

    try
    {
      if(navigation.menuIndex == MenuIndex.M4A)
      {
        contractFunctionName = "edit_m4a_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.editM4ALv4Reply(
        props.commentSectionNamePrefix, props.commentSectionName,
        props.chatAccountPostCountIndex,
        anchorPrograms.usdcFeeTokenAddress,
        editedMessage.value).rpc()
      }
      else if(navigation.menuIndex == MenuIndex.PLI)
      {
        contractFunctionName = "edit_pli_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.editPliLv4Reply(
        props.commentSectionNamePrefix, props.commentSectionName,
        props.chatAccountPostCountIndex,
        anchorPrograms.usdcFeeTokenAddress,
        editedMessage.value).rpc() 
      }
      else if(navigation.menuIndex == MenuIndex.About)
      {
        contractFunctionName = "edit_about_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.editAboutLv4Reply(
        props.commentSectionNamePrefix, props.commentSectionName,
        props.chatAccountPostCountIndex,
        anchorPrograms.usdcFeeTokenAddress,
        editedMessage.value).rpc()
      }
    
      editMode.value = false
      await confirmChatTransaction(tx, toast, contractFunctionName)
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, contractFunctionName)
    }
  }
  
  async function postLv4Reply()
  {
    var tx
    var contractFunctionName

    try
    {
      if(navigation.menuIndex == MenuIndex.M4A)
      {
        contractFunctionName = "reply_to_m4a_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.replyToM4ALv4Reply(
        props.commentSectionNamePrefix, props.commentSectionName,
        props.postOwnerAddress,
        props.chatAccountPostCountIndex,
        anchorPrograms.usdcFeeTokenAddress,
        replyMessage.value).rpc()
      }
      else if(navigation.menuIndex == MenuIndex.PLI)
      {
        contractFunctionName = "reply_to_pli_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.replyToPliLv4Reply(
        props.commentSectionNamePrefix, props.commentSectionName,
        props.postOwnerAddress,
        props.chatAccountPostCountIndex,
        anchorPrograms.usdcFeeTokenAddress,
        replyMessage.value).rpc() 
      }
      else if(navigation.menuIndex == MenuIndex.About)
      {
        contractFunctionName = "reply_to_about_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.replyToAboutLv4Reply(
        props.commentSectionNamePrefix, props.commentSectionName,
        props.postOwnerAddress,
        props.chatAccountPostCountIndex,
        anchorPrograms.usdcFeeTokenAddress,
        replyMessage.value).rpc()
      }

      replyMessage.value = ""
      replying.value = false
      await confirmChatTransaction(tx, toast, contractFunctionName)
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, contractFunctionName)
    }
  }

  async function starLv4Reply()
  {
    var tx
    var contractFunctionName

    try
    {
      if(navigation.menuIndex == MenuIndex.M4A)
      {
        contractFunctionName = "star_m4a_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.starM4ALv4Reply
        (
          props.commentSectionNamePrefix, props.commentSectionName,
          props.postOwnerAddress,
          props.chatAccountPostCountIndex
        ).rpc()
      }
      else if(navigation.menuIndex == MenuIndex.PLI)
      {
        contractFunctionName = "star_pli_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.starPliLv4Reply
        (
          props.commentSectionNamePrefix, props.commentSectionName,
          props.postOwnerAddress,
          props.chatAccountPostCountIndex
        ).rpc()
      }
      else if(navigation.menuIndex == MenuIndex.About)
      {
        contractFunctionName = "star_about_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.starAboutLv4Reply
        (
          props.commentSectionNamePrefix, props.commentSectionName,
          props.postOwnerAddress,
          props.chatAccountPostCountIndex
        ).rpc()
      }

      await confirmChatTransaction(tx, toast, contractFunctionName)
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, contractFunctionName)
    }
  }

  async function unstarLv4Reply()
  {
    var tx
    var contractFunctionName

    try
    {
      if(navigation.menuIndex == MenuIndex.M4A)
      {
        contractFunctionName = "unstar_m4a_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.unstarM4ALv4Reply
        (
          props.commentSectionNamePrefix, props.commentSectionName,
          props.postOwnerAddress,
          props.chatAccountPostCountIndex
        ).rpc()
      }
      else if(navigation.menuIndex == MenuIndex.PLI)
      {
        contractFunctionName = "unstar_pli_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.unstarPliLv4Reply
        (
          props.commentSectionNamePrefix, props.commentSectionName,
          props.postOwnerAddress,
          props.chatAccountPostCountIndex
        ).rpc()
      }
      else if(navigation.menuIndex == MenuIndex.About)
      {
        contractFunctionName = "unstar_about_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.unstarAboutLv4Reply
        (
          props.commentSectionNamePrefix, props.commentSectionName,
          props.postOwnerAddress,
          props.chatAccountPostCountIndex
        ).rpc()
      }

      await confirmChatTransaction(tx, toast, contractFunctionName)
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, contractFunctionName)
    }
  }

  async function fedLv4Reply()
  {
    var tx
    var contractFunctionName

    try
    {
      if(navigation.menuIndex == MenuIndex.M4A)
      {
        contractFunctionName = "fed_m4a_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.fedM4ALv4Reply
        (
          props.commentSectionNamePrefix, props.commentSectionName,
          props.postOwnerAddress,
          props.chatAccountPostCountIndex
        ).rpc()
      }
      else if(navigation.menuIndex == MenuIndex.PLI)
      {
        contractFunctionName = "fed_pli_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.fedPliLv4Reply
        (
          props.commentSectionNamePrefix, props.commentSectionName,
          props.postOwnerAddress,
          props.chatAccountPostCountIndex
        ).rpc()
      }
      else if(navigation.menuIndex == MenuIndex.About)
      {
        contractFunctionName = "fed_about_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.fedAboutLv4Reply
        (
          props.commentSectionNamePrefix, props.commentSectionName,
          props.postOwnerAddress,
          props.chatAccountPostCountIndex
        ).rpc()
      }

      await confirmChatTransaction(tx, toast, contractFunctionName)
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, contractFunctionName)
    }
  }

  async function unFEDLv4Reply()
  {
    var tx
    var contractFunctionName

    try
    {
      if(navigation.menuIndex == MenuIndex.M4A)
      {
        contractFunctionName = "unfed_m4a_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.unfedM4ALv4Reply
        (
          props.commentSectionNamePrefix, props.commentSectionName,
          props.postOwnerAddress,
          props.chatAccountPostCountIndex
        ).rpc()
      }
      else if(navigation.menuIndex == MenuIndex.PLI)
      {
        contractFunctionName = "unfed_pli_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.unfedPliLv4Reply
        (
          props.commentSectionNamePrefix, props.commentSectionName,
          props.postOwnerAddress,
          props.chatAccountPostCountIndex
        ).rpc()
      }
      else if(navigation.menuIndex == MenuIndex.About)
      {
        contractFunctionName = "unfed_about_reply_to_reply_to_reply"
        tx = await anchorPrograms.chat.chatProgram.methods.unfedAboutLv4Reply
        (
          props.commentSectionNamePrefix, props.commentSectionName,
          props.postOwnerAddress,
          props.chatAccountPostCountIndex
        ).rpc()
      }

      await confirmChatTransaction(tx, toast, contractFunctionName)
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, contractFunctionName)
    }
  }
</script>

<style scoped>
  #ceoStarReplyButton
  {
    width: 70px;
    height: 70px
  }

  #rainbowStarWolf
  {
    width: 55px;
    min-width: 55px;
    height: 55px
  }

  .ceoPopupInfo
  {
    padding: 4px;
    background-color: var(--ion-color-light);
    border: thick solid var(--ion-color-dark);
    border-radius: 0%
  }

  iframe
  {
    min-width: 254px
  }

  .fancyLine
  {
    border-left: 2px solid var(--ion-color-dark);
    border-radius: 0
  }

  .user
  {
    display:flex;
    align-items: center
  }

  .postContent
  {
    height: 100%;
    width: 100%;
    min-width: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: center
  }

  ion-textarea
  {
    --highlight-color: v-bind(colorHexValue);
  }

  .textarea-outline-container
  {
    margin-left: 20px !important
  }

  .textarea-outline-start.sc-ion-textarea-md
  {width: 0px !important
  }

  .replyWrapper
  {
    display: flex;
    flex-direction: column
  }

  .replyButtonsContainer
  {
    margin-top: 9px;
    display: flex;
    gap: 5px
  }

  .postReplyInput
  {
    margin-top: -7px;
    margin-right: 7px
  }

  .showRepliesButton
  {
    margin-bottom: -10px;
    width: min(50vw, 150px);
    font-size: min(4vw, 15px);
    white-space: nowrap
  }

  #replyCopyAddressButton
  {
    font-weight: bold
  }

  #replyCopyAddressButton:hover
  {
    text-decoration: underline;
    text-decoration-color: var(--ion-color-light);
    text-decoration-thickness: 2px;
    opacity: 1
  }
  
  .videoReplyButton
  {
    width: 40px;
    height: 40px;
    padding-right: 5px
  }

  .videoReplyLabel
  {
    max-width: 55px
  }

  /*.transition
  {
    max-height: 0
    transition: max-height ease 750ms
  }

  .transition.active {
    max-height: 100vh
  }*/

  @media screen and (min-width: 1115px)  
  { 
    .horizontalReply
    {
      display: flex;
      padding: 10px;
      width: 100%;
    
      overflow-y: hidden;
      overflow-x: auto
    }

    .verticalReply
    {
      display: none
    }

    .voteBarContainer
    {
      height: 100%;
      display: flex;
    }

    #userIcon
    {
      margin-left: -15px;
      width: 55px;
      height: 55px
    }

    .replyDate
    {
      text-align: right;
      margin-right: 10px
    }

    .leftContainer
    {
      max-width: 270px
    }

    .middleContainer
    {
      min-width: 200px;
      display:flex;
      flex-grow: 1;
      flex-direction: column
    }

    .endContainer
    {
      display: flex;
      flex-direction: column;
      justify-content: space-between
    }
  }

  @media screen and (max-width: 1114.9px) 
  { 
    .horizontalReply
    {
      display: none
    }

    .verticalReply
    {
      display: flex;
      padding: 10px;
      padding-bottom: 15px;
      width: 100%;
    
      overflow-y: hidden
    }

    #userIcon
    {
      margin-left: -15px;
      width: 55px;
      height: 55px
    }

    .leftContainer
    {
      min-width: 40px
    }

    .middleContainer
    {
      display:flex;
      flex-direction: column;
      flex-grow: 1;
      align-items: center
    }
  }

  @media screen and (min-width: 778px) 
  { 
    .replyOrCancelContainer
    {
      display: flex;
      flex-direction: row
    }

  }

  @media screen and (max-width: 777px) 
  { 
    .replyOrCancelContainer
    {
      display: flex;
      flex-direction: column
    }

    .replyButtonsContainer
    {
      display: flex;
      justify-content: space-evenly
    }
  }
</style>