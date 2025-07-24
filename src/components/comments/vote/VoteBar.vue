<template>
  <div class="voteBar">
    <!--Up Vote-->
    <ion-button :style="{opacity:isDeleted ? 0:''}" :disabled="isDeleted || !connectedWallet.isChatAccountReady" @click="openUpVotePopover($event)" fill="clear" color="dark">
      <ion-icon :src="addCircle"></ion-icon>
    </ion-button>
    <ion-popover 
      :is-open="upVotePopoverOpen" 
      :event="event" 
      @didDismiss="upVotePopoverOpen=false; killUpVoteEventListners()"
      side="top" 
      alignment="center"
    >
      <div class="thinBorder flexCenterColumn chatTablePopupContainer">
        <ion-text>Cost: {{ voteCost }}</ion-text>
        <div class="flexCenterRowHeight">
          <ion-input
            ref="upVoteInputRef"
            v-model="voteInputDisplayString"
            class="upVoteInputContainer"
            :class="navigation.menuIndex==MenuIndex.M4A ? 'm4aColor' : 
            navigation.menuIndex==MenuIndex.PLI ? 'pliColor' :
            navigation.menuIndex==MenuIndex.About ? 'aboutColor' : ''"
            @keydown="pressedKey=$event.key"
            @ion-input="formatUpVote($event)"
          >
          </ion-input>

          <div class="flexCenterColumn upVoteIncrementorContainer">
            <UpVoteSVG ref="increaseUpVoteSVG" :menuColor="colorHexValue" @mousedown="incrementVoteAmount()" @mouseup="stopUpdatingValue()" @mouseleave="stopUpdatingValue()"/>
            <p class="marginZero" style="margin-right: 10px !important">Vote<br>Score</p>
            <DownVoteSVG ref="decreaseUpVoteSVG" :menuColor="colorHexValue" @mousedown="decrementVoteAmount()" @mouseup="stopUpdatingValue()" @mouseleave="stopUpdatingValue()"/>
          </div>
        </div>
        <ion-button
          @click="castVote()"
          class="voteButton"
          color="light"
          :disabled="voteAmount==0"
        >
          <ion-label :color="colorName">Cast up vote(s)</ion-label>
        </ion-button>
      </div>
    </ion-popover>

    <!--Vote Total-->
    <ion-button fill="clear"  @click="giveVoteIconCredits()">
      <component style="width: 50px; height: 40px" :is="voteIcon" class="tinyMarginLeft"></component>
    </ion-button>
    <ion-text style="word-wrap: break-word;">{{ netVoteScore.toNumber().toLocaleString() }}</ion-text>
   
    <!--Down Vote-->
    <ion-button :style="{opacity:isDeleted ? 0:''}" :disabled="isDeleted || !connectedWallet.isChatAccountReady" @click="openDownVotePopover($event)" fill="clear" color="dark">
      <ion-icon :src="removeCircle"></ion-icon>
    </ion-button>
    <ion-popover 
      :is-open="downVotePopoverOpen" 
      :event="event" 
      @didDismiss="downVotePopoverOpen=false; killDownVoteEventListners()"
      side="top" 
      alignment="center"
    >
      <div class="thinBorder flexCenterColumn m4aTablePopupContainer">
        <ion-text>Cost: {{ voteCost }}</ion-text>
        <div class="flexCenterRowHeight">
          <ion-input
            ref="downVoteInputRef"
            v-model="voteInputDisplayString"
            class="downVoteInputContainer"
            :class="navigation.menuIndex==MenuIndex.M4A ? 'm4aColor' : 
            navigation.menuIndex==MenuIndex.PLI ? 'pliColor' :
            navigation.menuIndex==MenuIndex.About ? 'aboutColor' : ''"
            @keydown="pressedKey=$event.key"
            @ion-input="formatDownVote()"
          >
          </ion-input>
          
          <div class="flexCenterColumn downVoteIncrementorContainer">
            <UpVoteSVG ref="increaseDownVoteSVG" :menuColor="colorHexValue" @mousedown="incrementVoteAmount()" @mouseup="stopUpdatingValue()" @mouseleave="stopUpdatingValue()"/>
            <p class="marginZero" style="margin-right: 10px !important">Vote<br>Score</p>
            <DownVoteSVG ref="decreaseDownVoteSVG" :menuColor="colorHexValue" @mousedown="decrementVoteAmount()" @mouseup="stopUpdatingValue()" @mouseleave="stopUpdatingValue()"/>
          </div>
        </div>
        <ion-button
          @click="castVote()"
          class="voteButton"

          color="light"
          :disabled="voteAmount==0"
        >
          <ion-label :color="colorName">Cast down vote(s)</ion-label>
        </ion-button>
      </div>
    </ion-popover>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, inject, onUnmounted } from 'vue'
  import { IonIcon, IonButton, IonText, IonPopover, IonInput, IonLabel } from '@ionic/vue'
  import { givePNGToSVGBarrenTreeCredit,
    giveUXWingTreeCredit,
    giveUXWingTripleTreeCredit } from '/src/assets/helperFunctions/credits.ts'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { addCircle, removeCircle } from 'ionicons/icons'
  import Tree from '/src/assets/svg/tree-svg.vue'
  import Trees from '/src/assets/svg/trees-svg.vue'
  import BarrenTree from '/src/assets/svg/barren-tree-svg.vue'
  import UpVoteSVG from './UpVoteSVG.vue'
  import DownVoteSVG from './DownVoteSVG.vue'
  import { navigation, MenuIndex } from '/src/assets/globalStates/Navigation.vue'
  import { parseDollarAmountStringFromDecimal, confirmChatTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import * as anchor from "@coral-xyz/anchor"
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

  const props = defineProps(
  [
    'colorName',
    'colorHexValue',
    'type',
    'commentSectionNamePrefix',
    'commentSectionName', 
    'postOwnerAddress',
    'chatAccountPostCountIndex', 
    'netVoteScore', 
    'isDeleted'
  ])

  const toast = inject('toast')

  var increaseUpVoteSVG = ref()
  var increaseDownVoteSVG = ref()
  var decreaseUpVoteSVG = ref()
  var decreaseDownVoteSVG = ref()

  var voteAmount = ref()
  var voteInputDisplayString = ref("")
  var upVotePopoverOpen = ref(false)
  var downVotePopoverOpen = ref(false)
  var upVoteInputRef = ref()
  var downVoteInputRef = ref()
  var savedCursorPosition: any
  var previousNumberOfDigits = 0
  var currentNumberOfDigits = 0
  var previousNumberOfCommas = 0
  var currentNumberOfCommas = 0
  var previousNumberOfCommasOnLeftSideOfCursor = 0
  var currentNumberOfCommasOnLeftSideOfCursor = 0
  var pressedKey = ""
  var event = ref()

  let intervalId: any;

  onUnmounted(() =>
  {
    if(intervalId != undefined)
    {
      clearInterval(intervalId);
      intervalId = undefined
    }
  })

  function stopUpdatingValue()
  {
    if(intervalId != undefined)
    {
      clearInterval(intervalId);
      intervalId = undefined
    }
  }

  function incrementVoteAmount()
  {
    if(intervalId != undefined)
      return
    else
    {
      if(downVotePopoverOpen.value)
      {
        if(parseInt(voteInputDisplayString.value) == 0)//Don't have to remove commas here since we're checking for 0
          return
        else if(voteInputDisplayString.value == "-")
        {
          voteInputDisplayString.value = "0"
          voteAmount.value = 0
          return
        }
      }
      else
      {
        if(voteInputDisplayString.value == "")
        {
          voteInputDisplayString.value = "1"
          voteAmount.value = 1
        }
      }

      if(parseInt(voteInputDisplayString.value.replaceAll(',', '')) == parseInt(("999,999,999,999,999").replaceAll(',', '')))
      {
        voteInputDisplayString.value = "999,999,999,999,999"
        voteAmount.value = 999999999999999
        return
      }

      intervalId = setInterval(() => 
      {
        if(downVotePopoverOpen.value)
        {
          if(parseInt(voteInputDisplayString.value) == 0)//Don't have to remove commas here since we're checking for 0
            return
        }
        else
        {
          if(parseInt(voteInputDisplayString.value.replaceAll(',', '')) >= 999999999999999)
          {
            voteInputDisplayString.value = "999,999,999,999,999"
            voteAmount.value = 999999999999999
            return
          }
        }

        voteInputDisplayString.value = (parseInt(voteInputDisplayString.value.replaceAll(',', '')) + 1).toLocaleString()
        voteAmount.value = parseInt(voteInputDisplayString.value.replaceAll(',', ''))
      }, 10)
    }
  }

  function decrementVoteAmount()
  {
    if(upVotePopoverOpen.value)
    { 
      if(parseInt(voteInputDisplayString.value) == 0)//Don't have to remove commas here since we're checking for 0
        return
      else if(voteInputDisplayString.value == "")
      {
        voteInputDisplayString.value = "0"
        voteAmount.value = 0
        return
      }
    }
    else
    {
      if(voteInputDisplayString.value == "-")
      {
        voteInputDisplayString.value = "-1"
        voteAmount.value = -1
      }
    }

    if(parseInt(voteInputDisplayString.value.replaceAll(',', '')) == parseInt(("-999,999,999,999,999").replaceAll(',', '')))
      return

    intervalId = setInterval(() => 
    {
      if(upVotePopoverOpen.value)
      {
        if(parseInt(voteInputDisplayString.value) == 0)//Don't have to remove commas here since we're checking for 0
          return
      }
      else
      {
        if(parseInt(voteInputDisplayString.value.replaceAll(',', '')) <= -999999999999999)
          return
      }

      voteInputDisplayString.value = (parseInt(voteInputDisplayString.value.replaceAll(',', '')) - 1).toLocaleString()
      voteAmount.value = parseInt(voteInputDisplayString.value.replaceAll(',', ''))
    }, 10)
  }

  function openUpVotePopover(e: Event) 
  {
    voteInputDisplayString.value = "1"
    voteAmount.value = 1
    event.value = e
    upVotePopoverOpen.value = true

    setTimeout(() =>
    {
      increaseUpVoteSVG.value.$el.addEventListener("touchstart", incrementVoteAmount, { passive: true })
      increaseUpVoteSVG.value.$el.addEventListener("touchend", stopUpdatingValue, { passive: true })
      decreaseUpVoteSVG.value.$el.addEventListener("touchstart", decrementVoteAmount, { passive: true })
      decreaseUpVoteSVG.value.$el.addEventListener("touchend", stopUpdatingValue, { passive: true })
    }, 200)
  }

  function openDownVotePopover(e: Event) 
  {
    voteInputDisplayString.value = "-1"
    voteAmount.value = -1
    event.value = e
    downVotePopoverOpen.value = true

    setTimeout(() =>
    {
      increaseDownVoteSVG.value.$el.addEventListener("touchstart", incrementVoteAmount, { passive: true })
      increaseDownVoteSVG.value.$el.addEventListener("touchend", stopUpdatingValue, { passive: true })
      decreaseDownVoteSVG.value.$el.addEventListener("touchstart", decrementVoteAmount, { passive: true })
      decreaseDownVoteSVG.value.$el.addEventListener("touchend", stopUpdatingValue, { passive: true })
    }, 200)
  }

  function killUpVoteEventListners()
  {
    increaseUpVoteSVG.value.$el.removeEventListener("touchstart", incrementVoteAmount)
    increaseUpVoteSVG.value.$el.removeEventListener("touchend", stopUpdatingValue)
    decreaseUpVoteSVG.value.$el.removeEventListener("touchstart", decrementVoteAmount)
    decreaseUpVoteSVG.value.$el.removeEventListener("touchend", stopUpdatingValue)
  }

  function killDownVoteEventListners()
  {
    increaseDownVoteSVG.value.$el.removeEventListener("touchstart", incrementVoteAmount)
    increaseDownVoteSVG.value.$el.removeEventListener("touchend", stopUpdatingValue)
    decreaseDownVoteSVG.value.$el.removeEventListener("touchstart", decrementVoteAmount)
    decreaseDownVoteSVG.value.$el.removeEventListener("touchend", stopUpdatingValue)
  }
  
  function formatUpVote(e: Event)
  {
    //Get previous number of commas before reformatting, number has already changed at this point but commas haven't. Doing the check here
    //early also catches if the user moves the cursor and the number of commas on the left side of it change
    previousNumberOfCommasOnLeftSideOfCursor = 0

    var inputElement = upVoteInputRef.value?.$el.querySelector(".native-input")
    if(inputElement) 
    {
      for(var i=0; i<inputElement.selectionStart; i++)
      {
        if(voteInputDisplayString.value[i] == ',')
        previousNumberOfCommasOnLeftSideOfCursor += 1
      }

      previousNumberOfCommasOnLeftSideOfCursor
      previousNumberOfCommas = voteInputDisplayString.value.split(",").length - 1
    }

    //Prevent any non digit character or more than 15 characters and remove commas
    voteInputDisplayString.value = voteInputDisplayString.value.replace(/\D/g, '').slice(0, 15); 

    if(voteInputDisplayString.value != "")
    {
      voteAmount.value = parseInt(voteInputDisplayString.value)
      voteInputDisplayString.value = voteAmount.value.toLocaleString()
      currentNumberOfDigits = getNumberOfDigits(voteAmount.value)
      currentNumberOfCommas = voteInputDisplayString.value.split(",").length - 1

      var inputElement = upVoteInputRef.value?.$el.querySelector(".native-input")
      if(inputElement) 
      {
        if(inputElement.selectionStart != voteInputDisplayString.value.length)
          savedCursorPosition = inputElement.selectionStart
        //This else if is specifically for when you delete a digit from the 2nd to last index and a comma is lost, keeps the cursor from jumping to the end
        else if((currentNumberOfCommas < previousNumberOfCommas) && (inputElement.selectionStart == voteInputDisplayString.value.length))
          savedCursorPosition = inputElement.selectionStart
        else
          savedCursorPosition = undefined
      }

      //Off set saved cursor position based on commas if it was saved
      if(savedCursorPosition != undefined)
      {

        //Take care of cursor when deleting numbers and losing a comma
        if((currentNumberOfDigits < previousNumberOfDigits) && (currentNumberOfCommas < previousNumberOfCommas))
          savedCursorPosition -= 1

        //Count commas to the left of the current savedposition
        currentNumberOfCommasOnLeftSideOfCursor = 0

        for(var i=0; i<savedCursorPosition; i++)
        {
          if(voteInputDisplayString.value[i] == ',')
            currentNumberOfCommasOnLeftSideOfCursor += 1
        }

        if(currentNumberOfCommasOnLeftSideOfCursor > previousNumberOfCommasOnLeftSideOfCursor)
          savedCursorPosition += 1
      }
    }
    else
    {
      voteAmount.value = 0
      currentNumberOfDigits = 0
      currentNumberOfCommas = 0
    }

    //Apply changes to ion-input and apply saved cursor position after
    const inputCmp = upVoteInputRef.value;
    if (inputCmp !== undefined) 
    {
      if(voteInputDisplayString.value != '')
      {
        inputCmp.$el.value = voteInputDisplayString.value

        //Handle when delete is used on a comma
        if(currentNumberOfDigits == previousNumberOfDigits)
        {
          if(pressedKey == "Delete")
          {
            savedCursorPosition += 1
            inputElement.setSelectionRange(savedCursorPosition, savedCursorPosition)
            savedCursorPosition = undefined
          }
          else
          {
            //Bug Feature - if you fill out the vote amount from any where not at the end of the string (index -1) it loops around without this check, lol
            if(savedCursorPosition == undefined)
              return

            inputElement.setSelectionRange(savedCursorPosition, savedCursorPosition)
            savedCursorPosition = undefined
          }
        }
        else if(savedCursorPosition != undefined)
        {
          //Handle with number and comma are deleted at the front, keeps cursor from jumping to the end
          if((savedCursorPosition == -1) && ((pressedKey == "Delete") || (pressedKey == "Backspace")))
            savedCursorPosition = 0

          inputElement.setSelectionRange(savedCursorPosition, savedCursorPosition)
          savedCursorPosition = undefined
        }
      }
      else
        inputCmp.$el.value = '0'

      previousNumberOfDigits = currentNumberOfDigits
    }
  } 

  function formatDownVote()
  {
    //Get previous number of commas before reformatting, number has already changed at this point but commas haven't. Doing the check here
    //early also catches if the user moves the cursor and the number of commas on the left side of it change
    previousNumberOfCommasOnLeftSideOfCursor = 0

    var inputElement = downVoteInputRef.value?.$el.querySelector(".native-input")
    if(inputElement) 
    {
      for(var i=0; i<inputElement.selectionStart; i++)
      {
        if(voteInputDisplayString.value[i] == ',')
          previousNumberOfCommasOnLeftSideOfCursor += 1
      }

      previousNumberOfCommas = voteInputDisplayString.value.split(",").length - 1
    }

    if(voteInputDisplayString.value != '-' && voteInputDisplayString.value != '')
    {
      //Prevent any non digit character or more than 15 characters and remove commas
      voteInputDisplayString.value = '-' + voteInputDisplayString.value.replace(/\D/g, '').slice(0, 15); 

      //Prevent more than 16 characters
      voteAmount.value = parseInt(voteInputDisplayString.value)
      voteInputDisplayString.value = voteAmount.value.toLocaleString()
      currentNumberOfDigits = getNumberOfDigits(voteAmount.value)
      currentNumberOfCommas = voteInputDisplayString.value.split(",").length - 1

      var inputElement = downVoteInputRef.value?.$el.querySelector(".native-input")
      if(inputElement) 
      {
        if(inputElement.selectionStart != voteInputDisplayString.value.length)
          savedCursorPosition = inputElement.selectionStart
        //This else if is specifically for when you delete a digit from the 2nd to last index and a comma is lost, keeps the cursor from jumping to the end
        else if((currentNumberOfCommas < previousNumberOfCommas) && (inputElement.selectionStart == voteInputDisplayString.value.length))
          savedCursorPosition = inputElement.selectionStart
        else
          savedCursorPosition = undefined

        //handles when the user puts the cursor infront of the negative sign and types
        if((savedCursorPosition == 1) && pressedKey != "Delete" && pressedKey != "Backspace")
          savedCursorPosition = 2
      }
      
      currentNumberOfCommasOnLeftSideOfCursor = 0

      //Off set saved cursor position based on commas if it was saved
      if(savedCursorPosition != undefined)
      {
        //Take care of cursor when deleting numbers and losing a comma
        if((currentNumberOfDigits < previousNumberOfDigits) && 
        (currentNumberOfCommas < previousNumberOfCommas) &&
        (savedCursorPosition != 1))//Handle when comma is lost but deleting infront of negative sign (or skip rather)
          savedCursorPosition -= 1
        
        //Count commas to the left of the current savedposition
        currentNumberOfCommasOnLeftSideOfCursor = 0

        for(var i=0; i<savedCursorPosition; i++)
        {
          if(voteInputDisplayString.value[i] == ',')
            currentNumberOfCommasOnLeftSideOfCursor += 1
        }

        if(currentNumberOfCommasOnLeftSideOfCursor > previousNumberOfCommasOnLeftSideOfCursor)
          savedCursorPosition += 1
      }
    }
    else
    {
      voteInputDisplayString.value = '-'
      voteAmount.value = 0
      currentNumberOfDigits = 0
      currentNumberOfCommas = 0
    }

    //Apply changes to ion-input
    const inputCmp = downVoteInputRef.value;
    if (inputCmp !== undefined) 
    {
      if(voteInputDisplayString.value != '')
      {
        inputCmp.$el.value = voteInputDisplayString.value

        inputCmp.$el.value = voteInputDisplayString.value

        //Handle when delete is used on a comma
        if(currentNumberOfDigits == previousNumberOfDigits)
        {
          if(pressedKey == "Delete")
          {
            savedCursorPosition += 1
            inputElement.setSelectionRange(savedCursorPosition, savedCursorPosition)
            savedCursorPosition = undefined
          }
          else
          {
            //Bug Feature - if you fill out the vote amount from any where not at the end of the string (index -1) it loops around without this check, lol
            if(savedCursorPosition == undefined)
              return

            inputElement.setSelectionRange(savedCursorPosition, savedCursorPosition)
            savedCursorPosition = undefined
          }
        }
        else if(savedCursorPosition != undefined)
        {
          //Handle with number and comma are deleted at the front, keeps cursor from jumping to the end
          if((savedCursorPosition == -1) && ((pressedKey == "Delete") || (pressedKey == "Backspace")))
            savedCursorPosition = 0

          inputElement.setSelectionRange(savedCursorPosition, savedCursorPosition)
          savedCursorPosition = undefined
        }
      }
      else
      {
        inputCmp.$el.value = '-'
      }
    }

    previousNumberOfDigits = currentNumberOfDigits
  }

  function getNumberOfDigits(num: number)
  {
    if(num === 0)
    {
      return 1;
    }

    return Math.floor(Math.log10(Math.abs(num))) + 1;
  }

  const voteCost = computed(() =>
  {
    return parseDollarAmountStringFromDecimal((Math.abs(voteAmount.value) * 0.04))
  })
  
  const voteIcon = computed(() =>
  {
    if(props.netVoteScore.gt(new anchor.BN(299)))
      return Trees
    else if(props.netVoteScore.lt(new anchor.BN(-299)))
      return BarrenTree
    else
      return Tree
  })

  function giveVoteIconCredits()
  {
    if(voteIcon.value == BarrenTree)
      givePNGToSVGBarrenTreeCredit()
    else if(voteIcon.value == Tree)
      giveUXWingTreeCredit()
    else if(voteIcon.value == Trees)
      giveUXWingTripleTreeCredit()
  }


  
  async function castVote()
  {
    var tx
    var contractFunctionName

    try
    {
      if(props.type == "comment")
      {
        if(navigation.menuIndex == MenuIndex.M4A)
        {
          contractFunctionName = "m4a_comment_vote"
          tx = await anchorPrograms.chat.chatProgram.methods.m4ACommentVote
          (
            props.commentSectionNamePrefix, props.commentSectionName,
            props.postOwnerAddress,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress,
            new anchor.BN(voteAmount.value)
          ).rpc()

          upVotePopoverOpen.value = false
          downVotePopoverOpen.value = false
        }
        else if(navigation.menuIndex == MenuIndex.PLI)
        {
          contractFunctionName = "pli_comment_vote"
          tx = await anchorPrograms.chat.chatProgram.methods.pliCommentVote
          (
            props.commentSectionNamePrefix, props.commentSectionName,
            props.postOwnerAddress,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress,
            new anchor.BN(voteAmount.value)
          ).rpc()

          upVotePopoverOpen.value = false
          downVotePopoverOpen.value = false
        }
        else if(navigation.menuIndex == MenuIndex.About)
        {
          contractFunctionName = "about_comment_vote"
          tx = await anchorPrograms.chat.chatProgram.methods.aboutCommentVote
          (
            props.commentSectionNamePrefix, props.commentSectionName,
            props.postOwnerAddress,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress,
            new anchor.BN(voteAmount.value)
          ).rpc()

          upVotePopoverOpen.value = false
          downVotePopoverOpen.value = false
        }
      }
      else if(props.type == "reply")
      {
        if(navigation.menuIndex == MenuIndex.M4A)
        {
          contractFunctionName = "m4a_reply_vote"
          tx = await anchorPrograms.chat.chatProgram.methods.m4AReplyVote
          (
            props.commentSectionNamePrefix, props.commentSectionName,
            props.postOwnerAddress,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress,
            new anchor.BN(voteAmount.value)
          ).rpc()

          upVotePopoverOpen.value = false
          downVotePopoverOpen.value = false
        }
        else if(navigation.menuIndex == MenuIndex.PLI)
        {
          contractFunctionName = "pli_reply_vote"
          tx = await anchorPrograms.chat.chatProgram.methods.pliReplyVote
          (
            props.commentSectionNamePrefix, props.commentSectionName,
            props.postOwnerAddress,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress,
            new anchor.BN(voteAmount.value)
          ).rpc()

          upVotePopoverOpen.value = false
          downVotePopoverOpen.value = false
        }
        else if(navigation.menuIndex == MenuIndex.About)
        {
          contractFunctionName = "about_reply_vote"
          tx = await anchorPrograms.chat.chatProgram.methods.aboutReplyVote
          (
            props.commentSectionNamePrefix, props.commentSectionName,
            props.postOwnerAddress,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress,
            new anchor.BN(voteAmount.value)
          ).rpc()

          upVotePopoverOpen.value = false
          downVotePopoverOpen.value = false
        }
      }
      else if(props.type == "replyToReply")
      {
        if(navigation.menuIndex == MenuIndex.M4A)
        {
          contractFunctionName = "m4a_reply_to_reply_vote"
          tx = await anchorPrograms.chat.chatProgram.methods.m4ALv3ReplyVote
          (
            props.commentSectionNamePrefix, props.commentSectionName,
            props.postOwnerAddress,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress,
            new anchor.BN(voteAmount.value)
          ).rpc()

          upVotePopoverOpen.value = false
          downVotePopoverOpen.value = false
        }
        else if(navigation.menuIndex == MenuIndex.PLI)
        {
          contractFunctionName = "pli_reply_to_reply_vote"
          tx = await anchorPrograms.chat.chatProgram.methods.pliLv3ReplyVote
          (
            props.commentSectionNamePrefix, props.commentSectionName,
            props.postOwnerAddress,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress,
            new anchor.BN(voteAmount.value)
          ).rpc()

          upVotePopoverOpen.value = false
          downVotePopoverOpen.value = false
        }
        else if(navigation.menuIndex == MenuIndex.About)
        {
          contractFunctionName = "about_reply_to_reply_vote"
          tx = await anchorPrograms.chat.chatProgram.methods.aboutLv3ReplyVote
          (
            props.commentSectionNamePrefix, props.commentSectionName,
            props.postOwnerAddress,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress,
            new anchor.BN(voteAmount.value)
          ).rpc()

          upVotePopoverOpen.value = false
          downVotePopoverOpen.value = false
        }
      }
      else if(props.type == "replyToLv3Reply")
      {
        if(navigation.menuIndex == MenuIndex.M4A)
        {
          contractFunctionName = "m4a_reply_to_reply_to_reply_vote"
          tx = await anchorPrograms.chat.chatProgram.methods.m4ALv4ReplyVote
          (
            props.commentSectionNamePrefix, props.commentSectionName,
            props.postOwnerAddress,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress,
            new anchor.BN(voteAmount.value)
          ).rpc()

          upVotePopoverOpen.value = false
          downVotePopoverOpen.value = false
        }
        else if(navigation.menuIndex == MenuIndex.PLI)
        {
          contractFunctionName = "pli_reply_to_reply_to_reply_vote"
          tx = await anchorPrograms.chat.chatProgram.methods.pliLv4ReplyVote
          (
            props.commentSectionNamePrefix, props.commentSectionName,
            props.postOwnerAddress,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress,
            new anchor.BN(voteAmount.value)
          ).rpc()

          upVotePopoverOpen.value = false
          downVotePopoverOpen.value = false
        }
        else if(navigation.menuIndex == MenuIndex.About)
        {
          contractFunctionName = "about_reply_to_reply_to_reply_vote"
          tx = await anchorPrograms.chat.chatProgram.methods.aboutLv4ReplyVote
          (
            props.commentSectionNamePrefix, props.commentSectionName,
            props.postOwnerAddress,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress,
            new anchor.BN(voteAmount.value)
          ).rpc()

          upVotePopoverOpen.value = false
          downVotePopoverOpen.value = false
        }
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
  .voteBar
  {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 77px
  }

  .voteButton
  {
    width: 180px;
    height: 60px;
    align-self: center;
    border: thin solid var(--ion-color-dark);
    border-radius: 4px
  }

  .upVoteInputContainer
  {
    margin-left: 5px;
    margin-right: 5px;
    min-width: 185px
  }

  .downVoteInputContainer
  {
    margin-left: 11px;
    margin-right: -8px;
    min-width: 185px
  }

  ion-icon
  {
    min-width: min(7vw, 25px);
    height: min(7vw, 25px)
  }

  .upVoteIncrementorContainer
  {
    margin-left: -14px
  }

  .downVoteIncrementorContainer
  {
    margin-left: -2px
  }

  /* This wasn't working here for some reason, hence the broken out classes below
  ion-input
  {
    --highlight-color: v-bind(colorHexValue) !important
  }*/

  .m4aColor
  {
    --highlight-color: var(--ion-color-green)
  }

  .pliColor
  {
    --highlight-color: var(--ion-color-blue)
  }

  .aboutColor
  {
    --highlight-color: var(--ion-color-gray)
  }
</style>
