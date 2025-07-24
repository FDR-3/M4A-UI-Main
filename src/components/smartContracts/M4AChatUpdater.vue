<template></template>
<script setup lang="ts">
  import { watch, onMounted } from 'vue'
  import { m4aChat } from '/src/assets/globalStates/chat/Chats.vue'
  import { m4aComments, m4aReplies, m4aLv3Replies, m4aLv4Replies } from '/src/assets/globalStates/chat/Posts.vue'
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
      if(m4aChat.data)
      {
        //Comments
        await getM4AComments()

        //Replies
        await getM4AReplies()

        //Lv3 Replies
        await getM4ALv3Replies()

        //Lv4 Replies
        await getM4ALv4Replies()

        currentCommentCount = m4aChat.data.commentCount
        currentEditedCommentCount = m4aChat.data.editedCommentCount
        currentDeletedCommentCount = m4aChat.data.deletedCommentCount
        currentCommentVoteCount = m4aChat.data.commentUpVoteCount.add(m4aChat.data.commentDownVoteCount)
        currentCommentStarredCount = m4aChat.data.ceoStarredCommentCount
        currentCommentFEDCount = m4aChat.data.ceoMarkedFedCommentCount

        currentReplyCount = m4aChat.data.replyCount
        currentEditedReplyCount = m4aChat.data.editedReplyCount
        currentDeletedReplyCount = m4aChat.data.deletedReplyCount
        currentReplyVoteCount = m4aChat.data.replyUpVoteCount.add(m4aChat.data.replyDownVoteCount)
        currentReplyStarredCount = m4aChat.data.ceoStarredReplyCount
        currentReplyFEDCount = m4aChat.data.ceoMarkedFedReplyCount

        currentLv3ReplyCount = m4aChat.data.replyLv3Count
        currentEditedLv3ReplyCount = m4aChat.data.editedLv3ReplyCount
        currentDeletedLv3ReplyCount = m4aChat.data.deletedLv3ReplyCount
        currentLv3ReplyVoteCount = m4aChat.data.replyLv3UpVoteCount.add(m4aChat.data.replyLv3DownVoteCount)
        currentLv3ReplyStarredCount = m4aChat.data.ceoStarredLv3ReplyCount
        currentLv3ReplyFEDCount = m4aChat.data.ceoMarkedFedLv3ReplyCount

        currentLv4ReplyCount = m4aChat.data.replyLv4Count
        currentEditedLv4ReplyCount = m4aChat.data.editedLv4ReplyCount
        currentDeletedLv4ReplyCount = m4aChat.data.deletedLv4ReplyCount
        currentLv4ReplyVoteCount = m4aChat.data.replyLv4UpVoteCount.add(m4aChat.data.replyLv4DownVoteCount)
        currentLv4ReplyStarredCount = m4aChat.data.ceoStarredLv4ReplyCount
        currentLv4ReplyFEDCount = m4aChat.data.ceoMarkedFedLv4ReplyCount
      }
    }
  })

  watch(m4aChat, async() => 
  {
    if(!hidenCommentSections.hidden)
    {
      if(m4aChat.data.replyCount.gt(currentReplyCount) ||
      m4aChat.data.commentCount.gt(currentCommentCount) ||
      m4aChat.data.editedCommentCount.gt(currentEditedCommentCount) ||
      m4aChat.data.deletedCommentCount.gt(currentDeletedCommentCount) ||
      m4aChat.data.commentUpVoteCount.add(m4aChat.data.commentDownVoteCount).gt(currentCommentVoteCount) ||
      !m4aChat.data.ceoStarredCommentCount.eq(currentCommentStarredCount) || //I tried .eqn but that wasn't working
      !m4aChat.data.ceoMarkedFedCommentCount.eq(currentCommentFEDCount)) //I tried .eqn but that wasn't working
      {
        //Comments
        await getM4AComments()
        
        currentCommentCount = m4aChat.data.commentCount
        currentEditedCommentCount = m4aChat.data.editedCommentCount
        currentDeletedCommentCount = m4aChat.data.deletedCommentCount
        currentCommentVoteCount = m4aChat.data.commentUpVoteCount.add(m4aChat.data.commentDownVoteCount)
        currentCommentStarredCount = m4aChat.data.ceoStarredCommentCount
        currentCommentFEDCount = m4aChat.data.ceoMarkedFedCommentCount
      }
      if(m4aChat.data.replyLv3Count.gt(currentLv3ReplyCount) ||
      m4aChat.data.replyCount.gt(currentReplyCount) ||
      m4aChat.data.editedReplyCount.gt(currentEditedReplyCount) ||
      m4aChat.data.deletedReplyCount.gt(currentDeletedReplyCount) ||
      m4aChat.data.replyUpVoteCount.add(m4aChat.data.replyDownVoteCount).gt(currentReplyVoteCount) ||
      !m4aChat.data.ceoStarredReplyCount.eq(currentReplyStarredCount) || //I tried .eqn but that wasn't working
      !m4aChat.data.ceoMarkedFedReplyCount.eq(currentReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Replies
        await getM4AReplies()

        currentReplyCount = m4aChat.data.replyCount
        currentEditedReplyCount = m4aChat.data.editedReplyCount
        currentDeletedReplyCount = m4aChat.data.deletedReplyCount
        currentReplyVoteCount = m4aChat.data.replyUpVoteCount.add(m4aChat.data.replyDownVoteCount)
        currentReplyStarredCount = m4aChat.data.ceoStarredReplyCount
        currentReplyFEDCount = m4aChat.data.ceoMarkedFedReplyCount
      }
      if(m4aChat.data.replyLv4Count.gt(currentLv4ReplyCount) ||
      m4aChat.data.replyLv3Count.gt(currentLv3ReplyCount) ||
      m4aChat.data.editedLv3ReplyCount.gt(currentEditedLv3ReplyCount) ||
      m4aChat.data.deletedLv3ReplyCount.gt(currentDeletedLv3ReplyCount) ||
      m4aChat.data.replyLv3UpVoteCount.add(m4aChat.data.replyLv3DownVoteCount).gt(currentLv3ReplyVoteCount) ||
      !m4aChat.data.ceoStarredLv3ReplyCount.eq(currentLv3ReplyStarredCount) || //I tried .eqn but that wasn't working
      !m4aChat.data.ceoMarkedFedLv3ReplyCount.eq(currentLv3ReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Lv3 Replies
        await getM4ALv3Replies()

        currentLv3ReplyCount = m4aChat.data.replyLv3Count
        currentEditedLv3ReplyCount = m4aChat.data.editedLv3ReplyCount
        currentDeletedLv3ReplyCount = m4aChat.data.deletedLv3ReplyCount
        currentLv3ReplyVoteCount = m4aChat.data.replyLv3UpVoteCount.add(m4aChat.data.replyLv3DownVoteCount)
        currentLv3ReplyStarredCount = m4aChat.data.ceoStarredLv3ReplyCount
        currentLv3ReplyFEDCount = m4aChat.data.ceoMarkedFedLv3ReplyCount
      }
      if(m4aChat.data.replyLv4Count.gt(currentLv4ReplyCount) ||
      m4aChat.data.editedLv4ReplyCount.gt(currentEditedLv4ReplyCount) ||
      m4aChat.data.deletedLv4ReplyCount.gt(currentDeletedLv4ReplyCount) ||
      m4aChat.data.replyLv4UpVoteCount.add(m4aChat.data.replyLv4DownVoteCount).gt(currentLv4ReplyVoteCount) ||
      !m4aChat.data.ceoStarredLv4ReplyCount.eq(currentLv4ReplyStarredCount) || //I tried .eqn but that wasn't working
      !m4aChat.data.ceoMarkedFedLv4ReplyCount.eq(currentLv4ReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Lv4 Replies
        await getM4ALv4Replies()

        currentLv4ReplyCount = m4aChat.data.replyLv4Count
        currentEditedLv4ReplyCount = m4aChat.data.editedLv4ReplyCount
        currentDeletedLv4ReplyCount = m4aChat.data.deletedLv4ReplyCount
        currentLv4ReplyVoteCount = m4aChat.data.replyLv4UpVoteCount.add(m4aChat.data.replyLv4DownVoteCount)
        currentLv4ReplyStarredCount = m4aChat.data.ceoStarredLv4ReplyCount
        currentLv4ReplyFEDCount = m4aChat.data.ceoMarkedFedLv4ReplyCount
      }
    }
    else
    {
      m4aComments.data = []
      m4aReplies.data = []
      m4aLv3Replies.data = []
      m4aLv4Replies.data = []

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
      if(m4aChat.data.replyCount.gt(currentReplyCount) ||
      m4aChat.data.commentCount.gt(currentCommentCount) ||
      m4aChat.data.editedCommentCount.gt(currentEditedCommentCount) ||
      m4aChat.data.deletedCommentCount.gt(currentDeletedCommentCount) ||
      m4aChat.data.commentUpVoteCount.add(m4aChat.data.commentDownVoteCount).gt(currentCommentVoteCount) ||
      !m4aChat.data.ceoStarredCommentCount.eq(currentCommentStarredCount) || //I tried .eqn but that wasn't working
      !m4aChat.data.ceoMarkedFedCommentCount.eq(currentCommentFEDCount)) //I tried .eqn but that wasn't working
      {
        //Comments
        await getM4AComments()

        currentCommentCount = m4aChat.data.commentCount
        currentEditedCommentCount = m4aChat.data.editedCommentCount
        currentDeletedCommentCount = m4aChat.data.deletedCommentCount
        currentCommentVoteCount = m4aChat.data.commentUpVoteCount.add(m4aChat.data.commentDownVoteCount)
        currentCommentStarredCount = m4aChat.data.ceoStarredCommentCount
        currentCommentFEDCount = m4aChat.data.ceoMarkedFedCommentCount
      }
      if(m4aChat.data.replyLv3Count.gt(currentLv3ReplyCount) ||
      m4aChat.data.replyCount.gt(currentReplyCount) ||
      m4aChat.data.editedReplyCount.gt(currentEditedReplyCount) ||
      m4aChat.data.deletedReplyCount.gt(currentDeletedReplyCount) ||
      m4aChat.data.replyUpVoteCount.add(m4aChat.data.replyDownVoteCount).gt(currentReplyVoteCount) ||
      !m4aChat.data.ceoStarredReplyCount.eq(currentReplyStarredCount) || //I tried .eqn but that wasn't working
      !m4aChat.data.ceoMarkedFedReplyCount.eq(currentReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Replies
        await getM4AReplies()

        currentReplyCount = m4aChat.data.replyCount
        currentEditedReplyCount = m4aChat.data.editedReplyCount
        currentDeletedReplyCount = m4aChat.data.deletedReplyCount
        currentReplyVoteCount = m4aChat.data.replyUpVoteCount.add(m4aChat.data.replyDownVoteCount)
        currentReplyStarredCount = m4aChat.data.ceoStarredReplyCount
        currentReplyFEDCount = m4aChat.data.ceoMarkedFedReplyCount
      }
      if(m4aChat.data.replyLv4Count.gt(currentLv4ReplyCount) ||
      m4aChat.data.replyLv3Count.gt(currentLv3ReplyCount) ||
      m4aChat.data.editedLv3ReplyCount.gt(currentEditedLv3ReplyCount) ||
      m4aChat.data.deletedLv3ReplyCount.gt(currentDeletedLv3ReplyCount) ||
      m4aChat.data.replyLv3UpVoteCount.add(m4aChat.data.replyLv3DownVoteCount).gt(currentLv3ReplyVoteCount) ||
      !m4aChat.data.ceoStarredLv3ReplyCount.eq(currentLv3ReplyStarredCount) || //I tried .eqn but that wasn't working
      !m4aChat.data.ceoMarkedFedLv3ReplyCount.eq(currentLv3ReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Lv3 Replies
        await getM4ALv3Replies()

        currentLv3ReplyCount = m4aChat.data.replyLv3Count
        currentEditedLv3ReplyCount = m4aChat.data.editedLv3ReplyCount
        currentDeletedLv3ReplyCount = m4aChat.data.deletedLv3ReplyCount
        currentLv3ReplyVoteCount = m4aChat.data.replyLv3UpVoteCount.add(m4aChat.data.replyLv3DownVoteCount)
        currentLv3ReplyStarredCount = m4aChat.data.ceoStarredLv3ReplyCount
        currentLv3ReplyFEDCount = m4aChat.data.ceoMarkedFedLv3ReplyCount
      }
      if(m4aChat.data.replyLv4Count.gt(currentLv4ReplyCount) ||
      m4aChat.data.editedLv4ReplyCount.gt(currentEditedLv4ReplyCount) ||
      m4aChat.data.deletedLv4ReplyCount.gt(currentDeletedLv4ReplyCount) ||
      m4aChat.data.replyLv4UpVoteCount.add(m4aChat.data.replyLv4DownVoteCount).gt(currentLv4ReplyVoteCount) ||
      !m4aChat.data.ceoStarredLv4ReplyCount.eq(currentLv4ReplyStarredCount) || //I tried .eqn but that wasn't working
      !m4aChat.data.ceoMarkedFedLv4ReplyCount.eq(currentLv4ReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Lv4 Replies
        await getM4ALv4Replies()

        currentLv4ReplyCount = m4aChat.data.replyLv4Count
        currentEditedLv4ReplyCount = m4aChat.data.editedLv4ReplyCount
        currentDeletedLv4ReplyCount = m4aChat.data.deletedLv4ReplyCount
        currentLv4ReplyVoteCount = m4aChat.data.replyLv4UpVoteCount.add(m4aChat.data.replyLv4DownVoteCount)
        currentLv4ReplyStarredCount = m4aChat.data.ceoStarredLv4ReplyCount
        currentLv4ReplyFEDCount = m4aChat.data.ceoMarkedFedLv4ReplyCount
      }
    }
    else
    {
      m4aComments.data = []
      m4aReplies.data = []
      m4aLv3Replies.data = []
      m4aLv4Replies.data = []

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

  async function getM4AComments()
  {console.log("Getting M4A Comments")
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        m4aComments.data = await anchorPrograms.chat.chatProgram.account.m4AComment.all() //Note the .'m4A' capital A on the account, anchor being weird with acronyms
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

  async function getM4AReplies()
  {console.log("Getting M4A Replies")
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        m4aReplies.data = await anchorPrograms.chat.chatProgram.account.m4AReply.all() //Note the .'m4A' capital A on the account, anchor being weird with acronyms
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

  async function getM4ALv3Replies()
  {console.log("Getting M4A Lv3 Replies")
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        m4aLv3Replies.data = await anchorPrograms.chat.chatProgram.account.m4ALv3Reply.all() //Note the .'m4A' capital A on the account, anchor being weird with acronyms
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

  async function getM4ALv4Replies()
  {console.log("Getting M4A Lv4 Replies")
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        m4aLv4Replies.data = await anchorPrograms.chat.chatProgram.account.m4ALv4Reply.all() //Note the .'m4A' capital A on the account, anchor being weird with acronyms
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