<template>
  <div class="pollDownVoteContainer">
    <div>
      <div>
        <ion-text>Cost: {{ voteCost }}</ion-text>
        <ion-input
          ref="downVoteInputRef"
          v-model="voteInputDisplayString"
          class="smallMarginTop nSmallMarginBottom"
          @keydown="pressedKey=$event.key"
          @ion-input="formatDownVote()"
        >
        </ion-input>
        <div style="margin-right: -10px" class="flexCenterRow">
          <UpVoteSVG ref="increaseDownVoteSVG" :menuColor="colorHexValue" @mousedown="incrementVoteAmount()" @mouseup="stopUpdatingValue()" @mouseleave="stopUpdatingValue()"/>
          <p style="margin-left: -10px">Vote<br>Score</p>
          <DownVoteSVG ref="decreaseDownVoteSVG" :menuColor="colorHexValue" @mousedown="decrementVoteAmount()" @mouseup="stopUpdatingValue()" @mouseleave="stopUpdatingValue()"/>
        </div>
      </div>
    </div>

    <ion-button
      v-if="connectedWallet.isChatAccountReady"
      style="width: 112px"
      :color="colorName"
      @click="votePollOption(pollIndex, pollOptionIndex, voteAmount)"
      :disabled="voteAmount==0"
    >
      Down Vote
    </ion-button>
    <ion-button v-else :color="colorName" @click="createChatAccount()" style="width: 150px">
      Create Your Chat Account
    </ion-button>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onBeforeUnmount, ref, computed, inject } from 'vue'
  import { IonButton, IonText, IonInput } from '@ionic/vue'
  import UpVoteSVG from '/src/components/comments/vote/UpVoteSVG.vue'
  import DownVoteSVG from '/src/components/comments/vote/DownVoteSVG.vue'
  import { parseDollarAmountStringFromDecimal, confirmChatTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import * as anchor from "@coral-xyz/anchor"

  defineProps(['pollIndex', 'pollOptionIndex', 'colorName', 'colorHexValue'])

  const toast = inject('toast')

  var increaseDownVoteSVG = ref()
  var decreaseDownVoteSVG = ref()

  var voteAmount = ref(-1)
  var voteInputDisplayString = ref("-1")
  var downVoteInputRef = ref()
  var savedCursorPosition: any
  var previousNumberOfDigits = 0
  var currentNumberOfDigits = 0
  var previousNumberOfCommas = 0
  var currentNumberOfCommas = 0
  var previousNumberOfCommasOnLeftSideOfCursor = 0
  var currentNumberOfCommasOnLeftSideOfCursor = 0
  var pressedKey = ""

  let intervalId: any

  onMounted(() =>
  {
    increaseDownVoteSVG.value.$el.addEventListener("touchstart", incrementVoteAmount, { passive: true })
    increaseDownVoteSVG.value.$el.addEventListener("touchend", stopUpdatingValue, { passive: true })
    decreaseDownVoteSVG.value.$el.addEventListener("touchstart", decrementVoteAmount, { passive: true })
    decreaseDownVoteSVG.value.$el.addEventListener("touchend", stopUpdatingValue, { passive: true })
  })

  onBeforeUnmount(() =>
  {
    increaseDownVoteSVG.value.$el.removeEventListener("touchstart", incrementVoteAmount)
    increaseDownVoteSVG.value.$el.removeEventListener("touchend", stopUpdatingValue)
    decreaseDownVoteSVG.value.$el.removeEventListener("touchstart", decrementVoteAmount)
    decreaseDownVoteSVG.value.$el.removeEventListener("touchend", stopUpdatingValue)
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
      if(parseInt(voteInputDisplayString.value) == 0)//Don't have to remove commas here since we're checking for 0
          return
      else if(voteInputDisplayString.value == "-")
      {
        voteInputDisplayString.value = "0"
        voteAmount.value = 0
        return
      }

      if(parseInt(voteInputDisplayString.value.replaceAll(',', '')) == parseInt(("999,999,999,999,999").replaceAll(',', '')))
      {
        voteInputDisplayString.value = "999,999,999,999,999"
        voteAmount.value = 999999999999999
        return
      }

      intervalId = setInterval(() => 
      {
        if(parseInt(voteInputDisplayString.value) == 0)//Don't have to remove commas here since we're checking for 0
            return

        voteInputDisplayString.value = (parseInt(voteInputDisplayString.value.replaceAll(',', '')) + 1).toLocaleString()
        voteAmount.value = parseInt(voteInputDisplayString.value.replaceAll(',', ''))
      }, 10)
    }
  }

  function decrementVoteAmount()
  {

    if(voteInputDisplayString.value == "-")
    {
      voteInputDisplayString.value = "-1"
      voteAmount.value = -1
    }
    
    if(parseInt(voteInputDisplayString.value.replaceAll(',', '')) == parseInt(("-999,999,999,999,999").replaceAll(',', '')))
      return

    intervalId = setInterval(() => 
    {
      if(parseInt(voteInputDisplayString.value.replaceAll(',', '')) <= -999999999999999)
        return

      voteInputDisplayString.value = (parseInt(voteInputDisplayString.value.replaceAll(',', '')) - 1).toLocaleString()
      voteAmount.value = parseInt(voteInputDisplayString.value.replaceAll(',', ''))
    }, 10)
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

  async function votePollOption(pollIndex: number, pollOptionIndex: number, downVoteAmount: number)
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.votePollOption(new anchor.BN(pollIndex), pollOptionIndex, anchorPrograms.usdcFeeTokenAddress, new anchor.BN(downVoteAmount)).rpc()
      await confirmChatTransaction(tx, toast, "vote_poll_option")

      voteAmount.value = -1
      voteInputDisplayString.value = "-1"
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "vote_poll_option")
    }
  }
</script>

<style scoped>
  .pollDownVoteContainer
  {
    width: 260px
  }

  ion-input
  {
    --highlight-color: v-bind(colorHexValue) !important
  }
</style>