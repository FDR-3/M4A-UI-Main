<template>
  <div class="commentSection standardFontSize">
    <div id="pricing" class="thickBorder">

      <div class="flexCenterRow">
        <ion-text>Add a comment or software question for just a</ion-text>
        
        <ion-button fill="clear" @click="giveUXWingDollarCredit()"  >
          <Dollar style="width: min(50px, 11vw)"/>
        </ion-button>
        <ion-button fill="clear" @click="giveUXWingTreeCredit()" class="nMediumLargeMarginLeft">
          <Tree class="svgSize"/>
        </ion-button>
      </div>

      <div class="flexCenterRow">
        <ion-text>Vote or reply for just a</ion-text>
        <ion-button fill="clear" style="width: 15%" @click="giveUXWingTreeCredit()">
          <Tree class="svgSize"/>
        </ion-button>
        <ion-text style="margin-left: 7px">+</ion-text>
        <div class="nMediumSmallMarginBottom">
          <div class="nMediumSmallMarginBottom">
            <ion-text style="line-height: -10px; font-size: min(22px, 11vw)">1</ion-text><br>
          </div>
          <ion-text style="line-height: 2px" class="nSmallMarginTop">___</ion-text><br>
          <ion-button fill="clear" @click="sourceW3SchoolsEmojis()" class="nSmallMarginTop">
            <ion-text class="emojiText">💩</ion-text>
          </ion-button>
        </div>

        <ion-button fill="clear" @click="giveUXWingTreeCredit()" class="nLargeMarginLeft">
          <Tree class="svgSize"/>
        </ion-button>
      </div>

      <br>
      <ion-text>These crowd funding donations are paid in
        <div class="flexCenterRow tinyMarginTop">
          <ion-button fill="clear" @click="sourceUSDC()" >
            <USDCSVG class="svgSize"/>
          </ion-button>
          <ion-label class="nSmallMarginLeft">USDC</ion-label>
        </div>
      </ion-text>
 
      <div v-if="link!='' && link!=undefined && link!=null">
        <ion-text id="magicalLink">Want to post a comment, but skip the donation? Follow this magical <a class="rainbowText" :href="link"  target="_blank">link</a> :D</ion-text>
      </div>
    </div>

    <div id="feeInfo" class="thickBorder">
      <ion-text><span class="rainbowText">110%</span> of these crowd funding donation fees will go to the <ion-text color="green">M4A</ion-text> 
      treasury. These fees also deter bots, but on an unrelated note, bots and DOS/DDOS attacks are welcomed :D Come at me Bro!!!
      Exposing any weaknesses would be greatly appreciated.<br>

      <ion-button fill="clear" @click="sourceBowingJapaneseMan()">
        <img id="bow" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNRvMD9h9nMKDparwjbHtxvqFyh8i2fL5ZXEd0">
      </ion-button><br>

      <strong>Please</strong></ion-text>
      <ion-text>Any advice on improving the code or processes for the customer experience would be greatly appreciated. You do not have to be a software developer to have a great idea or to give <b>"constructive"</b> critism.<br> 
        Asking questions not directly derived from the website content may not receive a response
        <ion-button fill="clear" @click="giveSadSadPepeFeelsBadManCredit()">
          <FeelsBadSVG style="width: min(10vw, 50px); height: min(10vw, 55px)"/>
        </ion-button>
        <br>ie. Asking how to do something specific to your project that wasn't already done in this one. A random commentor might respond though.
      </ion-text>
      <ion-text>Want to post a

          <ion-button class="smallMarginBottom" fill="clear" style="width: 40px; height: 30px" @click="giveSVGRepoYoutubeCredit()">
            <YoutubeSVG class="svgSize"/>
          </ion-button>
  
        video comment? Just paste a youtube link with a space between the rest of your comment!
      </ion-text>
 
      <span class="flexCenterRow">$0.01
        <ion-button fill="clear" @click="sourceUSDC()" class="nMediumMarginLeft">
          <USDCSVG class="svgSize"/>
        </ion-button>
      </span>
      <ion-text > is sent to the original poster for each up vote they receive.</ion-text> 
    </div>

    <h2>Comment Section</h2>

    <h3 v-if="commentSectionInfo.isCommentSectionReady" class="nMediumMarginTop nSmallMarginBottom "> Initialized By: {{ commentSectionInfo.initiatorDisplayName }}</h3>

    <CommentSectionProgressBar
      v-if="!anchorPrograms.isChatProtocolReady || !isChatReady || !connectedWallet.isChatAccountReady || !commentSectionInfo.isCommentSectionReady"
      :colorHexValue="colorHexValue"
      :isChatProtocolReady="anchorPrograms.isChatProtocolReady"
      :isChatReady="isChatReady"
      :isChatAccountReady="connectedWallet.isChatAccountReady"
      :isCommentSectionReady="commentSectionInfo.isCommentSectionReady"
    />

    <div v-if="!adminAccounts.isChatCEOAccountReady" class="smallMarginTop">
      CEO account not initialized yet
    </div>

    <div v-else-if="!anchorPrograms.areChatQOLAccountsReady" class="smallMarginTop">
      Quality of life accounts not initialized yet
    </div>

    <div v-else-if="!anchorPrograms.isChatFeeTokenAccountReady" class="smallMarginTop">
      No token account for fees initialized yet
    </div>

    <div v-else-if="connectedWallet.addressString!=SYSTEM_PROGRAM_ADDRESS_STRING" class="addCommentContainer" >
      <ion-textarea 
        ref="addCommentTextAreaRef"
        v-model="msg"
        class="emojiTextSmaller"
        color="dark"
        fill="outline"
        placeholder="Comment for $1.03, Reply/Edit/Delete/Vote for $0.04"
        :counter="true"
        :maxlength=MAX_COMMENT_LENGTH
        :counter-formatter="customFormatter"
      >
      <EmojiButton
          :colorHexValue="colorHexValue"
          @emojiSelected="(emoji: String) => insertEmoji(emoji)"
        /> 
      </ion-textarea>
    
      <div id="chatButtonContainer" class="flexCenterRow">
        <ion-button v-if="!anchorPrograms.isChatProtocolReady" :color="colorName" @click="initializeChatProtocol()">
          <ion-label color="dark">Initialize Chat Protocol</ion-label>
        </ion-button>
        <ion-button v-else-if="!isChatReady" :color="colorName" @click="initializeChat()">
          <ion-label color="dark">Initialize {{ commentSectionNamePrefix }} Chat</ion-label>
        </ion-button>
        <ion-button v-else-if="!connectedWallet.isChatAccountReady" :color="colorName" @click="createChatAccount()">
          <ion-label color="dark">Create Your Chat Account</ion-label>
        </ion-button>
        <ion-button v-else-if="!commentSectionInfo.isCommentSectionReady" :color="colorName" @click="createCommentSection()">
          <ion-label color="dark">Initialize This Comment Section</ion-label>
        </ion-button>
        <ion-button v-else @click="postComment()" :color="colorName" :disabled="overCommentByteSizeLimit || msg==''">
          <ion-label color="dark">Post Comment</ion-label>
        </ion-button>
      </div>
    </div>
    <div v-else class="largeMarginTop largeMarginBottom">
      <ion-label >Connect wallet to add a comment<br>Comment for $1.03<br>Reply/Vote/Edit/Delete for $0.04</ion-label>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onUpdated, computed, inject } from 'vue'
  import { IonButton, IonTextarea, IonText, IonLabel } from '@ionic/vue'
  import { giveUXWingDollarCredit,
    giveUXWingTreeCredit,
    giveSadSadPepeFeelsBadManCredit,
    giveSVGRepoYoutubeCredit } from '/src/assets/helperFunctions/credits.ts'
  import { sourceW3SchoolsEmojis, sourceBowingJapaneseMan, sourceUSDC } from '/src/assets/helperFunctions/sources.ts'
  import { commentSectionInfo } from '/src/assets/globalStates/chat/CommentSections.vue'
  import CommentSectionProgressBar from '/src/components/comments/CommentSectionProgressBar.vue'
  import Dollar from '/src/assets/svg/dollar-svg.vue'
  import Tree from '/src/assets/svg/tree-svg.vue'
  import USDCSVG from '/src/assets/cryptoIcons/usdc-svg.vue'
  import FeelsBadSVG from '/src/assets/svg/feels-bad-svg.vue'
  import YoutubeSVG from '/src/assets/svg/youtube-svg.vue'
  import EmojiButton from '/src/components/comments/emojis/EmojiButton.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { navigation, MenuIndex } from '/src/assets/globalStates/Navigation.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { MAX_COMMENT_LENGTH } from './constants.ts'
  import { confirmChatTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'

  const toast = inject('toast')

  var msg = ref("")//Set as string initially for length to insert emoji
  var addCommentTextAreaRef = ref()
  var savedEmojiCursorPosition: any

  const props = defineProps(
  [
    'colorName',
    'colorHexValue',
    'commentSectionNamePrefix',
    'commentSectionName',
    'link'
  ])

  var overCommentByteSizeLimit = ref()

  const isChatReady = computed(() =>
  {
    if(navigation.menuIndex == MenuIndex.M4A)
      return anchorPrograms.isM4AChatReady
    if(navigation.menuIndex == MenuIndex.PLI)
      return anchorPrograms.isPLIChatReady
    if(navigation.menuIndex == MenuIndex.About)
      return anchorPrograms.isAboutChatReady
  })

  //Move cursor back after emoji insert
  onUpdated(() => 
  {
    var textAreaElement = addCommentTextAreaRef.value?.$el.querySelector(".native-textarea")

    if(savedEmojiCursorPosition != undefined)
      if(textAreaElement)
      {
        textAreaElement.setSelectionRange(savedEmojiCursorPosition, savedEmojiCursorPosition)
        textAreaElement.focus()
        savedEmojiCursorPosition = undefined
      }
  })

  function insertEmoji(emoji: String)
  {
    var textAreaElement = addCommentTextAreaRef.value.$el.querySelector(".native-textarea")
    if(textAreaElement) 
    {
      const start = textAreaElement.selectionStart
      const end = textAreaElement.selectionEnd
      const newValue = 
      msg.value.substring(0, start) + 
      emoji + 
      msg.value.substring(end)

      msg.value = newValue

      savedEmojiCursorPosition = textAreaElement.selectionStart + emoji.length
    }
  }

  const customFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([msg.value])
    const sizeInBytes = blob.size

    inputLength = sizeInBytes

    if(inputLength > maxLength)
    {
      overCommentByteSizeLimit.value = true
    }
    else
      overCommentByteSizeLimit.value = false

    return `${inputLength}/${maxLength}`
  }

  async function initializeChatProtocol()
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.initializeChatProtocol().rpc()
      await confirmChatTransaction(tx, toast, "initialize_chat_protocol")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "initialize_chat_protocol")
    }
  }

  async function initializeChat()
  {
    var tx
    var contractFunctionName

    try
    {
      if(navigation.menuIndex == MenuIndex.M4A)
      {
        contractFunctionName = "initialize_m4a_chat"
        tx = await anchorPrograms.chat.chatProgram.methods.initializeM4AChat().rpc()
      }
      if(navigation.menuIndex == MenuIndex.PLI)
      {
        contractFunctionName = "initialize_pli_chat"
        tx = await anchorPrograms.chat.chatProgram.methods.initializePliChat().rpc()
      }
      if(navigation.menuIndex == MenuIndex.About)
      {
        contractFunctionName = "initialize_about_chat"
        tx = await anchorPrograms.chat.chatProgram.methods.initializeAboutChat().rpc()
      }

      await confirmChatTransaction(tx, toast, contractFunctionName)
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, contractFunctionName)
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

  async function createCommentSection()
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.createCommentSection(props.commentSectionNamePrefix, props.commentSectionName).rpc()
      await confirmChatTransaction(tx, toast, "create_comment_section")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "create_comment_section")
    }
  }

  async function postComment()
  {
    var tx
    var contractFunctionName

    try
    {
      if(navigation.menuIndex == MenuIndex.M4A)
      {
        contractFunctionName = "post_m4a_comment"
        tx = await anchorPrograms.chat.chatProgram.methods.postM4AComment(
        props.commentSectionNamePrefix, props.commentSectionName,
        anchorPrograms.usdcFeeTokenAddress,
        msg.value).rpc()
      }
      else if(navigation.menuIndex == MenuIndex.PLI)
      {
        contractFunctionName = "post_pli_comment"
        tx = await anchorPrograms.chat.chatProgram.methods.postPliComment(
        props.commentSectionNamePrefix, props.commentSectionName,
        anchorPrograms.usdcFeeTokenAddress,
        msg.value).rpc() 
      }
      else if(navigation.menuIndex == MenuIndex.About)
      {
        contractFunctionName = "post_about_comment"
        tx = await anchorPrograms.chat.chatProgram.methods.postAboutComment(
        props.commentSectionNamePrefix, props.commentSectionName,
        anchorPrograms.usdcFeeTokenAddress,
        msg.value).rpc()
      }
      
      msg.value = ""
      await confirmChatTransaction(tx, toast, contractFunctionName)
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, contractFunctionName)
    }
  }
</script>

<style scoped>
  .commentSection
  {
    margin-bottom: 50px
  }

  #chatButtonContainer
  {
    display: flex;
    justify-content:space-between;
    gap: 5px
  }

  #bow
  {
    margin: 7px;
    width: min(40vw, 200px);
    border: thick solid v-bind(colorHexValue);
    border-radius: 12px
  }

  #pricing
  {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 10px
  }

  #feeInfo
  {
    display: flex;
    flex-direction: column;
    padding: 10px
  }

  ion-icon
  {
    min-width: min(7vw, 35px);
    height: min(7vw, 35px);
    margin-left: 5px
  }

  .svgSize
  {
    min-width: min(7vw, 35px);
    height: min(7vw, 35px);
    margin-left: 5px
  }

  ion-textarea
  {
    --highlight-color: v-bind(colorHexValue)
  }

  @media screen and (min-width: 921px) 
  { 
    .addCommentContainer
    {
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: center
    }
  }

  @media screen and (max-width: 920px) 
  { 
    .addCommentContainer
    {
      display: flex;
      flex-direction: column
    }
  }
</style>
