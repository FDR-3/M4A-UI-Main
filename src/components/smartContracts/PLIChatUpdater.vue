<template></template>
<script setup lang="ts">
  import { watch, onMounted } from 'vue'
  import { pliChat } from '/src/assets/globalStates/chat/Chats.vue'
  import { pliComments, pliReplies, pliLv3Replies, pliLv4Replies } from '/src/assets/globalStates/chat/Posts.vue'
  import { hidenCommentSections } from '/src/assets/globalStates/chat/CommentSections.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { sleep, MAX_RETRY_FETCH, RETRY_TIME_OUT, RETRY_MESSAGE, ERROR_429 } from '/src/assets/helperFunctions/sleep.ts'
  import * as anchor from "@coral-xyz/anchor"

  var currentCommentCount = new anchor.BN(0)
  var currentEditedCommentCount = new anchor.BN(0)
  var currentDeletedCommentCount = new anchor.BN(0)
  var currentCommentVoteCount = new anchor.BN(0)
  var currentCommentStarredCount = new anchor.BN(0)
  var currentCommentFEDCount = new anchor.BN(0)

  var currentReplyCount = new anchor.BN(0)
  var currentEditedReplyCount = new anchor.BN(0)
  var currentDeletedReplyCount = new anchor.BN(0)
  var currentReplyVoteCount = new anchor.BN(0)
  var currentReplyStarredCount = new anchor.BN(0)
  var currentReplyFEDCount = new anchor.BN(0)

  var currentLv3ReplyCount = new anchor.BN(0)
  var currentEditedLv3ReplyCount = new anchor.BN(0)
  var currentDeletedLv3ReplyCount = new anchor.BN(0)
  var currentLv3ReplyVoteCount = new anchor.BN(0)
  var currentLv3ReplyStarredCount = new anchor.BN(0)
  var currentLv3ReplyFEDCount = new anchor.BN(0)

  var currentLv4ReplyCount = new anchor.BN(0)
  var currentEditedLv4ReplyCount = new anchor.BN(0)
  var currentDeletedLv4ReplyCount = new anchor.BN(0)
  var currentLv4ReplyVoteCount = new anchor.BN(0)
  var currentLv4ReplyStarredCount = new anchor.BN(0)
  var currentLv4ReplyFEDCount = new anchor.BN(0)

  onMounted(async() =>
  {
    if(!hidenCommentSections.hidden)
    {
      if(pliChat.data)
      {
        //Comments
        await getPLIComments()

        //Replies
        await getPLIReplies()

        //Lv3 Replies
        await getPLILv3Replies()

        //Lv4 Replies
        await getPLILv4Replies()

        currentCommentCount = pliChat.data.commentCount
        currentEditedCommentCount = pliChat.data.editedCommentCount
        currentDeletedCommentCount = pliChat.data.deletedCommentCount
        currentCommentVoteCount = pliChat.data.commentUpVoteCount.add(pliChat.data.commentDownVoteCount)
        currentCommentStarredCount = pliChat.data.ceoStarredCommentCount
        currentCommentFEDCount = pliChat.data.ceoMarkedFedCommentCount

        currentReplyCount = pliChat.data.replyCount
        currentEditedReplyCount = pliChat.data.editedReplyCount
        currentDeletedReplyCount = pliChat.data.deletedReplyCount
        currentReplyVoteCount = pliChat.data.replyUpVoteCount.add(pliChat.data.replyDownVoteCount)
        currentReplyStarredCount = pliChat.data.ceoStarredReplyCount
        currentReplyFEDCount = pliChat.data.ceoMarkedFedReplyCount

        currentLv3ReplyCount = pliChat.data.replyLv3Count
        currentEditedLv3ReplyCount = pliChat.data.editedLv3ReplyCount
        currentDeletedLv3ReplyCount = pliChat.data.deletedLv3ReplyCount
        currentLv3ReplyVoteCount = pliChat.data.replyLv3UpVoteCount.add(pliChat.data.replyLv3DownVoteCount)
        currentLv3ReplyStarredCount = pliChat.data.ceoStarredLv3ReplyCount
        currentLv3ReplyFEDCount = pliChat.data.ceoMarkedFedLv3ReplyCount

        currentLv4ReplyCount = pliChat.data.replyLv4Count
        currentEditedLv4ReplyCount = pliChat.data.editedLv4ReplyCount
        currentDeletedLv4ReplyCount = pliChat.data.deletedLv4ReplyCount
        currentLv4ReplyVoteCount = pliChat.data.replyLv4UpVoteCount.add(pliChat.data.replyLv4DownVoteCount)
        currentLv4ReplyStarredCount = pliChat.data.ceoStarredLv4ReplyCount
        currentLv4ReplyFEDCount = pliChat.data.ceoMarkedFedLv4ReplyCount
      }
    }
  })

  watch(pliChat, async() =>
  {
    if(!hidenCommentSections.hidden)
    {
      if(pliChat.data.replyCount.gt(currentReplyCount) ||
      pliChat.data.commentCount.gt(currentCommentCount) ||
      pliChat.data.editedCommentCount.gt(currentEditedCommentCount) ||
      pliChat.data.deletedCommentCount.gt(currentDeletedCommentCount) ||
      pliChat.data.commentUpVoteCount.add(pliChat.data.commentDownVoteCount).gt(currentCommentVoteCount) ||
      !pliChat.data.ceoStarredCommentCount.eq(currentCommentStarredCount) || //I tried .eqn but that wasn't working
      !pliChat.data.ceoMarkedFedCommentCount.eq(currentCommentFEDCount)) //I tried .eqn but that wasn't working
      {
        //Comments
        await getPLIComments()

        currentCommentCount = pliChat.data.commentCount
        currentEditedCommentCount = pliChat.data.editedCommentCount
        currentDeletedCommentCount = pliChat.data.deletedCommentCount
        currentCommentVoteCount = pliChat.data.commentUpVoteCount.add(pliChat.data.commentDownVoteCount)
        currentCommentStarredCount = pliChat.data.ceoStarredCommentCount
        currentCommentFEDCount = pliChat.data.ceoMarkedFedCommentCount
      }
      if(pliChat.data.replyLv3Count.gt(currentLv3ReplyCount) ||
      pliChat.data.replyCount.gt(currentReplyCount) ||
      pliChat.data.editedReplyCount.gt(currentEditedReplyCount) ||
      pliChat.data.deletedReplyCount.gt(currentDeletedReplyCount) ||
      pliChat.data.replyUpVoteCount.add(pliChat.data.replyDownVoteCount).gt(currentReplyVoteCount) ||
      !pliChat.data.ceoStarredReplyCount.eq(currentReplyStarredCount) || //I tried .eqn but that wasn't working
      !pliChat.data.ceoMarkedFedReplyCount.eq(currentReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Replies
        await getPLIReplies()

        currentReplyCount = pliChat.data.replyCount
        currentEditedReplyCount = pliChat.data.editedReplyCount
        currentDeletedReplyCount = pliChat.data.deletedReplyCount
        currentReplyVoteCount = pliChat.data.replyUpVoteCount.add(pliChat.data.replyDownVoteCount)
        currentReplyStarredCount = pliChat.data.ceoStarredReplyCount
        currentReplyFEDCount = pliChat.data.ceoMarkedFedReplyCount
      }
      if(pliChat.data.replyLv4Count.gt(currentLv4ReplyCount) ||
      pliChat.data.replyLv3Count.gt(currentLv3ReplyCount) ||
      pliChat.data.editedLv3ReplyCount.gt(currentEditedLv3ReplyCount) ||
      pliChat.data.deletedLv3ReplyCount.gt(currentDeletedLv3ReplyCount) ||
      pliChat.data.replyLv3UpVoteCount.add(pliChat.data.replyLv3DownVoteCount).gt(currentLv3ReplyVoteCount) ||
      !pliChat.data.ceoStarredLv3ReplyCount.eq(currentLv3ReplyStarredCount) || //I tried .eqn but that wasn't working
      !pliChat.data.ceoMarkedFedLv3ReplyCount.eq(currentLv3ReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Lv3 Replies
        await getPLILv3Replies()

        currentLv3ReplyCount = pliChat.data.replyLv3Count
        currentEditedLv3ReplyCount = pliChat.data.editedLv3ReplyCount
        currentDeletedLv3ReplyCount = pliChat.data.deletedLv3ReplyCount
        currentLv3ReplyVoteCount = pliChat.data.replyLv3UpVoteCount.add(pliChat.data.replyLv3DownVoteCount)
        currentLv3ReplyStarredCount = pliChat.data.ceoStarredLv3ReplyCount
        currentLv3ReplyFEDCount = pliChat.data.ceoMarkedFedLv3ReplyCount
      }
      if(pliChat.data.replyLv4Count.gt(currentLv4ReplyCount) ||
      pliChat.data.editedLv4ReplyCount.gt(currentEditedLv4ReplyCount) ||
      pliChat.data.deletedLv4ReplyCount.gt(currentDeletedLv4ReplyCount) ||
      pliChat.data.replyLv4UpVoteCount.add(pliChat.data.replyLv4DownVoteCount).gt(currentLv4ReplyVoteCount) ||
      !pliChat.data.ceoStarredLv4ReplyCount.eq(currentLv4ReplyStarredCount) || //I tried .eqn but that wasn't working
      !pliChat.data.ceoMarkedFedLv4ReplyCount.eq(currentLv4ReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Lv4 Replies
        await getPLILv4Replies()

        currentLv4ReplyCount = pliChat.data.replyLv4Count
        currentEditedLv4ReplyCount = pliChat.data.editedLv4ReplyCount
        currentDeletedLv4ReplyCount = pliChat.data.deletedLv4ReplyCount
        currentLv4ReplyVoteCount = pliChat.data.replyLv4UpVoteCount.add(pliChat.data.replyLv4DownVoteCount)
        currentLv4ReplyStarredCount = pliChat.data.ceoStarredLv4ReplyCount
        currentLv4ReplyFEDCount = pliChat.data.ceoMarkedFedLv4ReplyCount
      }
    }
    else
    {
      pliComments.data = []
      pliReplies.data = []
      pliLv3Replies.data = []
      pliLv4Replies.data = []

      currentCommentCount = new anchor.BN(0)
      currentEditedCommentCount = new anchor.BN(0)
      currentDeletedCommentCount = new anchor.BN(0)
      currentCommentVoteCount = new anchor.BN(0)
      currentCommentStarredCount = new anchor.BN(0)
      currentCommentFEDCount = new anchor.BN(0)

      currentReplyCount = new anchor.BN(0)
      currentEditedReplyCount = new anchor.BN(0)
      currentDeletedReplyCount = new anchor.BN(0)
      currentReplyVoteCount = new anchor.BN(0)
      currentReplyStarredCount = new anchor.BN(0)
      currentReplyFEDCount = new anchor.BN(0)

      currentLv3ReplyCount = new anchor.BN(0)
      currentEditedLv3ReplyCount = new anchor.BN(0)
      currentDeletedLv3ReplyCount = new anchor.BN(0)
      currentLv3ReplyVoteCount = new anchor.BN(0)
      currentLv3ReplyStarredCount = new anchor.BN(0)
      currentLv3ReplyFEDCount = new anchor.BN(0)

      currentLv4ReplyCount = new anchor.BN(0)
      currentEditedLv4ReplyCount = new anchor.BN(0)
      currentDeletedLv4ReplyCount = new anchor.BN(0)
      currentLv4ReplyVoteCount = new anchor.BN(0)
      currentLv4ReplyStarredCount = new anchor.BN(0)
      currentLv4ReplyFEDCount = new anchor.BN(0)
    }
  })

  watch(hidenCommentSections, async() => 
  {
    if(!hidenCommentSections.hidden)
    {
      if(pliChat.data.replyCount.gt(currentReplyCount) ||
      pliChat.data.commentCount.gt(currentCommentCount) ||
      pliChat.data.editedCommentCount.gt(currentEditedCommentCount) ||
      pliChat.data.deletedCommentCount.gt(currentDeletedCommentCount) ||
      pliChat.data.commentUpVoteCount.add(pliChat.data.commentDownVoteCount).gt(currentCommentVoteCount) ||
      !pliChat.data.ceoStarredCommentCount.eq(currentCommentStarredCount) || //I tried .eqn but that wasn't working
      !pliChat.data.ceoMarkedFedCommentCount.eq(currentCommentFEDCount)) //I tried .eqn but that wasn't working
      {
        //Comments
        await getPLIComments()

        currentCommentCount = pliChat.data.commentCount
        currentEditedCommentCount = pliChat.data.editedCommentCount
        currentDeletedCommentCount = pliChat.data.deletedCommentCount
        currentCommentVoteCount = pliChat.data.commentUpVoteCount.add(pliChat.data.commentDownVoteCount)
        currentCommentStarredCount = pliChat.data.ceoStarredCommentCount
        currentCommentFEDCount = pliChat.data.ceoMarkedFedCommentCount
      }
      if(pliChat.data.replyLv3Count.gt(currentLv3ReplyCount) ||
      pliChat.data.replyCount.gt(currentReplyCount) ||
      pliChat.data.editedReplyCount.gt(currentEditedReplyCount) ||
      pliChat.data.deletedReplyCount.gt(currentDeletedReplyCount) ||
      pliChat.data.replyUpVoteCount.add(pliChat.data.replyDownVoteCount).gt(currentReplyVoteCount) ||
      !pliChat.data.ceoStarredReplyCount.eq(currentReplyStarredCount) || //I tried .eqn but that wasn't working
      !pliChat.data.ceoMarkedFedReplyCount.eq(currentReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Replies
        await getPLIReplies()

        currentReplyCount = pliChat.data.replyCount
        currentEditedReplyCount = pliChat.data.editedReplyCount
        currentDeletedReplyCount = pliChat.data.deletedReplyCount
        currentReplyVoteCount = pliChat.data.replyUpVoteCount.add(pliChat.data.replyDownVoteCount)
        currentReplyStarredCount = pliChat.data.ceoStarredReplyCount
        currentReplyFEDCount = pliChat.data.ceoMarkedFedReplyCount
      }
      if(pliChat.data.replyLv4Count.gt(currentLv4ReplyCount) ||
      pliChat.data.replyLv3Count.gt(currentLv3ReplyCount) ||
      pliChat.data.editedLv3ReplyCount.gt(currentEditedLv3ReplyCount) ||
      pliChat.data.deletedLv3ReplyCount.gt(currentDeletedLv3ReplyCount) ||
      pliChat.data.replyLv3UpVoteCount.add(pliChat.data.replyLv3DownVoteCount).gt(currentLv3ReplyVoteCount) ||
      !pliChat.data.ceoStarredLv3ReplyCount.eq(currentLv3ReplyStarredCount) || //I tried .eqn but that wasn't working
      !pliChat.data.ceoMarkedFedLv3ReplyCount.eq(currentLv3ReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Lv3 Replies
        await getPLILv3Replies()

        currentLv3ReplyCount = pliChat.data.replyLv3Count
        currentEditedLv3ReplyCount = pliChat.data.editedLv3ReplyCount
        currentDeletedLv3ReplyCount = pliChat.data.deletedLv3ReplyCount
        currentLv3ReplyVoteCount = pliChat.data.replyLv3UpVoteCount.add(pliChat.data.replyLv3DownVoteCount)
        currentLv3ReplyStarredCount = pliChat.data.ceoStarredLv3ReplyCount
        currentLv3ReplyFEDCount = pliChat.data.ceoMarkedFedLv3ReplyCount
      }
      if(pliChat.data.replyLv4Count.gt(currentLv4ReplyCount) ||
      pliChat.data.editedLv4ReplyCount.gt(currentEditedLv4ReplyCount) ||
      pliChat.data.deletedLv4ReplyCount.gt(currentDeletedLv4ReplyCount) ||
      pliChat.data.replyLv4UpVoteCount.add(pliChat.data.replyLv4DownVoteCount).gt(currentLv4ReplyVoteCount) ||
      !pliChat.data.ceoStarredLv4ReplyCount.eq(currentLv4ReplyStarredCount) || //I tried .eqn but that wasn't working
      !pliChat.data.ceoMarkedFedLv4ReplyCount.eq(currentLv4ReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Lv4 Replies
        await getPLILv4Replies()

        currentLv4ReplyCount = pliChat.data.replyLv4Count
        currentEditedLv4ReplyCount = pliChat.data.editedLv4ReplyCount
        currentDeletedLv4ReplyCount = pliChat.data.deletedLv4ReplyCount
        currentLv4ReplyVoteCount = pliChat.data.replyLv4UpVoteCount.add(pliChat.data.replyLv4DownVoteCount)
        currentLv4ReplyStarredCount = pliChat.data.ceoStarredLv4ReplyCount
        currentLv4ReplyFEDCount = pliChat.data.ceoMarkedFedLv4ReplyCount
      }
    }
    else
    {
      pliComments.data = []
      pliReplies.data = []
      pliLv3Replies.data = []
      pliLv4Replies.data = []

      currentCommentCount = new anchor.BN(0)
      currentEditedCommentCount = new anchor.BN(0)
      currentDeletedCommentCount = new anchor.BN(0)
      currentCommentVoteCount = new anchor.BN(0)
      currentCommentStarredCount = new anchor.BN(0)
      currentCommentFEDCount = new anchor.BN(0)

      currentReplyCount = new anchor.BN(0)
      currentEditedReplyCount = new anchor.BN(0)
      currentDeletedReplyCount = new anchor.BN(0)
      currentReplyVoteCount = new anchor.BN(0)
      currentReplyStarredCount = new anchor.BN(0)
      currentReplyFEDCount = new anchor.BN(0)

      currentLv3ReplyCount = new anchor.BN(0)
      currentEditedLv3ReplyCount = new anchor.BN(0)
      currentDeletedLv3ReplyCount = new anchor.BN(0)
      currentLv3ReplyVoteCount = new anchor.BN(0)
      currentLv3ReplyStarredCount = new anchor.BN(0)
      currentLv3ReplyFEDCount = new anchor.BN(0)

      currentLv4ReplyCount = new anchor.BN(0)
      currentEditedLv4ReplyCount = new anchor.BN(0)
      currentDeletedLv4ReplyCount = new anchor.BN(0)
      currentLv4ReplyVoteCount = new anchor.BN(0)
      currentLv4ReplyStarredCount = new anchor.BN(0)
      currentLv4ReplyFEDCount = new anchor.BN(0)
    }
  })

  async function getPLIComments()
  {console.log("Getting PLI Comments")
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        pliComments.data = await anchorPrograms.chat.chatProgram.account.pliComment.all()
        break
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          break
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  async function getPLIReplies()
  {console.log("Getting PLI Replies")
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        pliReplies.data = await anchorPrograms.chat.chatProgram.account.pliReply.all()
        break
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          break
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  async function getPLILv3Replies()
  {console.log("Getting PLI Lv3 Replies")
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        pliLv3Replies.data = await anchorPrograms.chat.chatProgram.account.pliLv3Reply.all()
        break
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          break
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  async function getPLILv4Replies()
  {console.log("Getting PLI Lv4 Replies")
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        pliLv4Replies.data = await anchorPrograms.chat.chatProgram.account.pliLv4Reply.all()
        break
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          break
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }
</script>