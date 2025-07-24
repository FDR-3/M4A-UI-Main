<template>
  <div class="commentActionBar">
    <ion-button v-if="connectedWallet.addressString!=SYSTEM_PROGRAM_ADDRESS_STRING" fill="clear" @click="$emit('replyToComment')">
      <ion-icon :color="colorName" :src="arrowUndo"></ion-icon>
    </ion-button>
    <div v-if="(connectedWallet.addressString==postOwnerAddress?.toBase58() ||
        connectedWallet.addressString == postOwnerAddress?.toBase58()) && !isDeleted">
      <ion-button fill="clear" @click="editMode=true; $emit('editComment')">
        <EditSVG class="actionBarIcon" :fill="colorHexValue"/>
      </ion-button>
      <ion-button fill="clear" @click="openPopover($event)">
        <DeleteSVG class="actionBarIcon" :fill="colorHexValue"/>
      </ion-button>
    </div>
    <ion-popover :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen=false" side="top" alignment="center" size="auto">
      <ion-label align="center">Confirm Delete?</ion-label>
      <div class="deleteSelectionButtons">
        <ion-button @click="popoverOpen=false; deleteMessage()" color="dark" fill="clear">
          <ion-label :color="colorName">Yes</ion-label>
        </ion-button>
        <ion-button @click="popoverOpen=false" color="dark" fill="clear">
          <ion-label :color="colorName">No</ion-label>
        </ion-button>
      </div>
    </ion-popover>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject } from 'vue'
  import { IonIcon, IonButton, IonPopover, IonLabel } from '@ionic/vue'
  import { arrowUndo } from 'ionicons/icons'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { navigation, MenuIndex } from '/src/assets/globalStates/Navigation.vue'
  import EditSVG from '/src/assets/svg/edit-svg.vue'
  import DeleteSVG from '/src/assets/svg/delete-svg.vue'
  import { confirmChatTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'  
  import { anchorPrograms, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'

  const emit = defineEmits(['editComment', 'replyToComment', 'saveEdit', 'cancelEdit'])
  
  const props = defineProps(
  [
    'type',
    'colorName',
    'colorHexValue',
    'commentSectionNamePrefix',
    'commentSectionName',
    'chatAccountPostCountIndex',
    'postOwnerAddress',
    'isDeleted'
  ])

  const toast = inject('toast')
  
  var editMode = ref()
  var popoverOpen = ref()
  var event = ref()

  async function deleteMessage()
  {
    var tx
    var contractFunctionName

    try
    {
      if(props.type == "comment")
      {
        if(navigation.menuIndex == MenuIndex.M4A)
        {
          contractFunctionName = "delete_m4a_comment"
          tx = await anchorPrograms.chat.chatProgram.methods.deleteM4AComment
          (
            props.commentSectionNamePrefix,
            props.commentSectionName,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress
          ).rpc()
        }
        else if(navigation.menuIndex == MenuIndex.PLI)
        {
          contractFunctionName = "delete_pli_comment"
          tx = await anchorPrograms.chat.chatProgram.methods.deletePliComment
          (
            props.commentSectionNamePrefix,
            props.commentSectionName,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress
          ).rpc()
        }
        else if(navigation.menuIndex == MenuIndex.About)
        {
          contractFunctionName = "delete_about_comment"
          tx = await anchorPrograms.chat.chatProgram.methods.deleteAboutComment
          (
            props.commentSectionNamePrefix,
            props.commentSectionName,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress
          ).rpc()
        }
      }
      else if(props.type == "reply")
      {
        if(navigation.menuIndex == MenuIndex.M4A)
        {
          contractFunctionName = "delete_m4a_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.deleteM4AReply
          (
            props.commentSectionNamePrefix,
            props.commentSectionName,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress
          ).rpc()
        }
        else if(navigation.menuIndex == MenuIndex.PLI)
        {
          contractFunctionName = "delete_pli_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.deletePliReply
          (
            props.commentSectionNamePrefix,
            props.commentSectionName,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress
          ).rpc()
        }
        else if(navigation.menuIndex == MenuIndex.About)
        {
          contractFunctionName = "delete_about_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.deleteAboutReply
          (
            props.commentSectionNamePrefix,
            props.commentSectionName,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress
          ).rpc()
        }
      }
      else if(props.type == "replyToReply")
      {
        if(navigation.menuIndex == MenuIndex.M4A)
        {
          contractFunctionName = "delete_m4a_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.deleteM4ALv3Reply
          (
            props.commentSectionNamePrefix,
            props.commentSectionName,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress
          ).rpc()
        }
        else if(navigation.menuIndex == MenuIndex.PLI)
        {
          contractFunctionName = "delete_pli_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.deletePliLv3Reply
          (
            props.commentSectionNamePrefix,
            props.commentSectionName,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress
          ).rpc()
        }
        else if(navigation.menuIndex == MenuIndex.About)
        {
          contractFunctionName = "delete_about_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.deleteAboutLv3Reply
          (
            props.commentSectionNamePrefix,
            props.commentSectionName,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress
          ).rpc()
        }
      }
      else if(props.type == "replyToLv3Reply")
      {
        if(navigation.menuIndex == MenuIndex.M4A)
        {
          contractFunctionName = "delete_m4a_reply_to_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.deleteM4ALv4Reply
          (
            props.commentSectionNamePrefix,
            props.commentSectionName,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress
          ).rpc()
        }
        else if(navigation.menuIndex == MenuIndex.PLI)
        {
          contractFunctionName = "delete_pli_reply_to_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.deletePliLv4Reply
          (
            props.commentSectionNamePrefix,
            props.commentSectionName,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress
          ).rpc()
        }
        else if(navigation.menuIndex == MenuIndex.About)
        {
          contractFunctionName = "delete_about_reply_to_reply_to_reply"
          tx = await anchorPrograms.chat.chatProgram.methods.deleteAboutLv4Reply
          (
            props.commentSectionNamePrefix,
            props.commentSectionName,
            props.chatAccountPostCountIndex,
            anchorPrograms.usdcFeeTokenAddress
          ).rpc()
        }
      }

      await confirmChatTransaction(tx, toast, contractFunctionName)
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, contractFunctionName)
    }
  }

  function openPopover(e: Event) 
  {
    event.value = e
    popoverOpen.value = true
  }
</script>

<style scoped>
  .commentActionBar
  {
    max-width: 550px;
    min-width: 180px;
    max-height: 25px;
    margin-bottom: 7px;
    display: flex;
    flex-direction: row;
    justify-content: center
  }

  ion-icon
  {
    width: 25px;
    height: 25px
  }

  .actionBarIcon
  {
    
    width: 25px;
    height: 25px
  }

  .deleteSelectionButtons
  {
    display: flex;
    justify-content: center;
    gap: 15px
  }

  @media screen and (min-width: 1115px)  
  {
    .commentActionBar
    {
      margin-bottom: 11px;
    }
  }

  @media screen and (max-width: 1114.9px) 
  {
    .commentActionBar
    {
      margin-bottom: 5px;
    }
  }
</style>
