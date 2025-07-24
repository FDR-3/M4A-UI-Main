<template></template>
<script setup lang="ts">
  import { watch, onMounted } from 'vue'
  import { aboutChat } from '/src/assets/globalStates/chat/Chats.vue'
  import { aboutComments, aboutReplies, aboutLv3Replies, aboutLv4Replies } from '/src/assets/globalStates/chat/Posts.vue'
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
      if(aboutChat.data)
      {
        //Comments
        await getAboutComments()

        //Replies
        await getAboutReplies()

        //Lv3 Replies
        await getAboutLv3Replies()

        //Lv4 Replies
        await getAboutLv4Replies()

        currentCommentCount = aboutChat.data.commentCount
        currentEditedCommentCount = aboutChat.data.editedCommentCount
        currentDeletedCommentCount = aboutChat.data.deletedCommentCount
        currentCommentVoteCount = aboutChat.data.commentUpVoteCount.add(aboutChat.data.commentDownVoteCount)
        currentCommentStarredCount = aboutChat.data.ceoStarredCommentCount
        currentCommentFEDCount = aboutChat.data.ceoMarkedFedCommentCount

        currentReplyCount = aboutChat.data.replyCount
        currentEditedReplyCount = aboutChat.data.editedReplyCount
        currentDeletedReplyCount = aboutChat.data.deletedReplyCount
        currentReplyVoteCount = aboutChat.data.replyUpVoteCount.add(aboutChat.data.replyDownVoteCount)
        currentReplyStarredCount = aboutChat.data.ceoStarredReplyCount
        currentReplyFEDCount = aboutChat.data.ceoMarkedFedReplyCount

        currentLv3ReplyCount = aboutChat.data.replyLv3Count
        currentEditedLv3ReplyCount = aboutChat.data.editedLv3ReplyCount
        currentDeletedLv3ReplyCount = aboutChat.data.deletedLv3ReplyCount
        currentLv3ReplyVoteCount = aboutChat.data.replyLv3UpVoteCount.add(aboutChat.data.replyLv3DownVoteCount)
        currentLv3ReplyStarredCount = aboutChat.data.ceoStarredLv3ReplyCount
        currentLv3ReplyFEDCount = aboutChat.data.ceoMarkedFedLv3ReplyCount

        currentLv4ReplyCount = aboutChat.data.replyLv4Count
        currentEditedLv4ReplyCount = aboutChat.data.editedLv4ReplyCount
        currentDeletedLv4ReplyCount = aboutChat.data.deletedLv4ReplyCount
        currentLv4ReplyVoteCount = aboutChat.data.replyLv4UpVoteCount.add(aboutChat.data.replyLv4DownVoteCount)
        currentLv4ReplyStarredCount = aboutChat.data.ceoStarredLv4ReplyCount
        currentLv4ReplyFEDCount = aboutChat.data.ceoMarkedFedLv4ReplyCount
      }
    }
  })

  watch(aboutChat, async() => 
  {
    if(!hidenCommentSections.hidden)
    {
      if(aboutChat.data.replyCount.gt(currentReplyCount) ||
      aboutChat.data.commentCount.gt(currentCommentCount) ||
      aboutChat.data.editedCommentCount.gt(currentEditedCommentCount) ||
      aboutChat.data.deletedCommentCount.gt(currentDeletedCommentCount) ||
      aboutChat.data.commentUpVoteCount.add(aboutChat.data.commentDownVoteCount).gt(currentCommentVoteCount) ||
      !aboutChat.data.ceoStarredCommentCount.eq(currentCommentStarredCount) || //I tried .eqn but that wasn't working
      !aboutChat.data.ceoMarkedFedCommentCount.eq(currentCommentFEDCount)) //I tried .eqn but that wasn't working
      {
        //Comments
        await getAboutComments()

        currentCommentCount = aboutChat.data.commentCount
        currentEditedCommentCount = aboutChat.data.editedCommentCount
        currentDeletedCommentCount = aboutChat.data.deletedCommentCount
        currentCommentVoteCount = aboutChat.data.commentUpVoteCount.add(aboutChat.data.commentDownVoteCount)
        currentCommentStarredCount = aboutChat.data.ceoStarredCommentCount
        currentCommentFEDCount = aboutChat.data.ceoMarkedFedCommentCount
      }
      if(aboutChat.data.replyLv3Count.gt(currentLv3ReplyCount) ||
      aboutChat.data.replyCount.gt(currentReplyCount) ||
      aboutChat.data.editedReplyCount.gt(currentEditedReplyCount) ||
      aboutChat.data.deletedReplyCount.gt(currentDeletedReplyCount) ||
      aboutChat.data.replyUpVoteCount.add(aboutChat.data.replyDownVoteCount).gt(currentReplyVoteCount) ||
      !aboutChat.data.ceoStarredReplyCount.eq(currentReplyStarredCount) || //I tried .eqn but that wasn't working
      !aboutChat.data.ceoMarkedFedReplyCount.eq(currentReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Replies
        await getAboutReplies()

        currentReplyCount = aboutChat.data.replyCount
        currentEditedReplyCount = aboutChat.data.editedReplyCount
        currentDeletedReplyCount = aboutChat.data.deletedReplyCount
        currentReplyVoteCount = aboutChat.data.replyUpVoteCount.add(aboutChat.data.replyDownVoteCount)
        currentReplyStarredCount = aboutChat.data.ceoStarredReplyCount
        currentReplyFEDCount = aboutChat.data.ceoMarkedFedReplyCount
      }
      if(aboutChat.data.replyLv4Count.gt(currentLv4ReplyCount) ||
      aboutChat.data.replyLv3Count.gt(currentLv3ReplyCount) ||
      aboutChat.data.editedLv3ReplyCount.gt(currentEditedLv3ReplyCount) ||
      aboutChat.data.deletedLv3ReplyCount.gt(currentDeletedLv3ReplyCount) ||
      aboutChat.data.replyLv3UpVoteCount.add(aboutChat.data.replyLv3DownVoteCount).gt(currentLv3ReplyVoteCount) ||
      !aboutChat.data.ceoStarredLv3ReplyCount.eq(currentLv3ReplyStarredCount) || //I tried .eqn but that wasn't working
      !aboutChat.data.ceoMarkedFedLv3ReplyCount.eq(currentLv3ReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Lv3 Replies
        await getAboutLv3Replies()

        currentLv3ReplyCount = aboutChat.data.replyLv3Count
        currentEditedLv3ReplyCount = aboutChat.data.editedLv3ReplyCount
        currentDeletedLv3ReplyCount = aboutChat.data.deletedLv3ReplyCount
        currentLv3ReplyVoteCount = aboutChat.data.replyLv3UpVoteCount.add(aboutChat.data.replyLv3DownVoteCount)
        currentLv3ReplyStarredCount = aboutChat.data.ceoStarredLv3ReplyCount
        currentLv3ReplyFEDCount = aboutChat.data.ceoMarkedFedLv3ReplyCount
      }
      if(aboutChat.data.replyLv4Count.gt(currentLv4ReplyCount) ||
      aboutChat.data.editedLv4ReplyCount.gt(currentEditedLv4ReplyCount) ||
      aboutChat.data.deletedLv4ReplyCount.gt(currentDeletedLv4ReplyCount) ||
      aboutChat.data.replyLv4UpVoteCount.add(aboutChat.data.replyLv4DownVoteCount).gt(currentLv4ReplyVoteCount) ||
      !aboutChat.data.ceoStarredLv4ReplyCount.eq(currentLv4ReplyStarredCount) || //I tried .eqn but that wasn't working
      !aboutChat.data.ceoMarkedFedLv4ReplyCount.eq(currentLv4ReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Lv4 Replies
        await getAboutLv4Replies()

        currentLv4ReplyCount = aboutChat.data.replyLv4Count
        currentEditedLv4ReplyCount = aboutChat.data.editedLv4ReplyCount
        currentDeletedLv4ReplyCount = aboutChat.data.deletedLv4ReplyCount
        currentLv4ReplyVoteCount = aboutChat.data.replyLv4UpVoteCount.add(aboutChat.data.replyLv4DownVoteCount)
        currentLv4ReplyStarredCount = aboutChat.data.ceoStarredLv4ReplyCount
        currentLv4ReplyFEDCount = aboutChat.data.ceoMarkedFedLv4ReplyCount
      }
    }
    else
    {
      aboutComments.data = []
      aboutReplies.data = []
      aboutLv3Replies.data = []
      aboutLv4Replies.data = []

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
      if(aboutChat.data.replyCount.gt(currentReplyCount) ||
      aboutChat.data.commentCount.gt(currentCommentCount) ||
      aboutChat.data.editedCommentCount.gt(currentEditedCommentCount) ||
      aboutChat.data.deletedCommentCount.gt(currentDeletedCommentCount) ||
      aboutChat.data.commentUpVoteCount.add(aboutChat.data.commentDownVoteCount).gt(currentCommentVoteCount) ||
      !aboutChat.data.ceoStarredCommentCount.eq(currentCommentStarredCount) || //I tried .eqn but that wasn't working
      !aboutChat.data.ceoMarkedFedCommentCount.eq(currentCommentFEDCount)) //I tried .eqn but that wasn't working
      {
        //Comments
        await getAboutComments()

        currentCommentCount = aboutChat.data.commentCount
        currentEditedCommentCount = aboutChat.data.editedCommentCount
        currentDeletedCommentCount = aboutChat.data.deletedCommentCount
        currentCommentVoteCount = aboutChat.data.commentUpVoteCount.add(aboutChat.data.commentDownVoteCount)
        currentCommentStarredCount = aboutChat.data.ceoStarredCommentCount
        currentCommentFEDCount = aboutChat.data.ceoMarkedFedCommentCount
      }
      if(aboutChat.data.replyLv3Count.gt(currentLv3ReplyCount) ||
      aboutChat.data.replyCount.gt(currentReplyCount) ||
      aboutChat.data.editedReplyCount.gt(currentEditedReplyCount) ||
      aboutChat.data.deletedReplyCount.gt(currentDeletedReplyCount) ||
      aboutChat.data.replyUpVoteCount.add(aboutChat.data.replyDownVoteCount).gt(currentReplyVoteCount) ||
      !aboutChat.data.ceoStarredReplyCount.eq(currentReplyStarredCount) || //I tried .eqn but that wasn't working
      !aboutChat.data.ceoMarkedFedReplyCount.eq(currentReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Replies
        await getAboutReplies()
        
        currentReplyCount = aboutChat.data.replyCount
        currentEditedReplyCount = aboutChat.data.editedReplyCount
        currentDeletedReplyCount = aboutChat.data.deletedReplyCount
        currentReplyVoteCount = aboutChat.data.replyUpVoteCount.add(aboutChat.data.replyDownVoteCount)
        currentReplyStarredCount = aboutChat.data.ceoStarredReplyCount
        currentReplyFEDCount = aboutChat.data.ceoMarkedFedReplyCount
      }
      if(aboutChat.data.replyLv4Count.gt(currentLv4ReplyCount) ||
      aboutChat.data.replyLv3Count.gt(currentLv3ReplyCount) ||
      aboutChat.data.editedLv3ReplyCount.gt(currentEditedLv3ReplyCount) ||
      aboutChat.data.deletedLv3ReplyCount.gt(currentDeletedLv3ReplyCount) ||
      aboutChat.data.replyLv3UpVoteCount.add(aboutChat.data.replyLv3DownVoteCount).gt(currentLv3ReplyVoteCount) ||
      !aboutChat.data.ceoStarredLv3ReplyCount.eq(currentLv3ReplyStarredCount) || //I tried .eqn but that wasn't working
      !aboutChat.data.ceoMarkedFedLv3ReplyCount.eq(currentLv3ReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Lv3 Replies
        await getAboutLv3Replies()

        currentLv3ReplyCount = aboutChat.data.replyLv3Count
        currentEditedLv3ReplyCount = aboutChat.data.editedLv3ReplyCount
        currentDeletedLv3ReplyCount = aboutChat.data.deletedLv3ReplyCount
        currentLv3ReplyVoteCount = aboutChat.data.replyLv3UpVoteCount.add(aboutChat.data.replyLv3DownVoteCount)
        currentLv3ReplyStarredCount = aboutChat.data.ceoStarredLv3ReplyCount
        currentLv3ReplyFEDCount = aboutChat.data.ceoMarkedFedLv3ReplyCount
      }
      if(aboutChat.data.replyLv4Count.gt(currentLv4ReplyCount) ||
      aboutChat.data.editedLv4ReplyCount.gt(currentEditedLv4ReplyCount) ||
      aboutChat.data.deletedLv4ReplyCount.gt(currentDeletedLv4ReplyCount) ||
      aboutChat.data.replyLv4UpVoteCount.add(aboutChat.data.replyLv4DownVoteCount).gt(currentLv4ReplyVoteCount) ||
      !aboutChat.data.ceoStarredLv4ReplyCount.eq(currentLv4ReplyStarredCount) || //I tried .eqn but that wasn't working
      !aboutChat.data.ceoMarkedFedLv4ReplyCount.eq(currentLv4ReplyFEDCount)) //I tried .eqn but that wasn't working
      {
        //Lv4 Replies
        await getAboutLv4Replies()

        currentLv4ReplyCount = aboutChat.data.replyLv4Count
        currentEditedLv4ReplyCount = aboutChat.data.editedLv4ReplyCount
        currentDeletedLv4ReplyCount = aboutChat.data.deletedLv4ReplyCount
        currentLv4ReplyVoteCount = aboutChat.data.replyLv4UpVoteCount.add(aboutChat.data.replyLv4DownVoteCount)
        currentLv4ReplyStarredCount = aboutChat.data.ceoStarredLv4ReplyCount
        currentLv4ReplyFEDCount = aboutChat.data.ceoMarkedFedLv4ReplyCount
      }
    }
    else
    {
      aboutComments.data = []
      aboutReplies.data = []
      aboutLv3Replies.data = []
      aboutLv4Replies.data = []

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

  async function getAboutComments()
  {console.log("Getting About Comments")
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        aboutComments.data = await anchorPrograms.chat.chatProgram.account.aboutComment.all()
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

  async function getAboutReplies()
  {console.log("Getting About Replies")
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        aboutReplies.data = await anchorPrograms.chat.chatProgram.account.aboutReply.all()
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

  async function getAboutLv3Replies()
  {console.log("Getting About Lv3 Replies")
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        aboutLv3Replies.data = await anchorPrograms.chat.chatProgram.account.aboutLv3Reply.all()
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

  async function getAboutLv4Replies()
  {console.log("Getting About Lv4 Replies")
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        aboutLv4Replies.data = await anchorPrograms.chat.chatProgram.account.aboutLv4Reply.all()
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