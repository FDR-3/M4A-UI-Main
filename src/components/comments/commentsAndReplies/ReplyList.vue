<template>
  <div class="replyList">
    <Reply
      :commentSectionNamePrefix="commentSectionNamePrefix"
      :commentSectionName="commentSectionName"
      :repliesToReplies="repliesToReplies"
      :remainingReplies="remainingReplies"
      v-for="reply in replies"
      :displayName="reply.account.displayName"
      :replyCount="reply.account.replyCount"
      :colorName="colorName"
      :colorHexValue="colorHexValue"
      :id="reply.account.id"
      :chatAccountPostCountIndex="reply.account.chatAccountPostCountIndex"
      :postOwnerAddress="reply.account.postOwnerAddress"
      :netVoteScore="reply.account.netVoteScore"
      :unixCreationTimeStamp="reply.account.unixCreationTimeStamp"
      :msg="reply.account.msg"
      :isEdited="reply.account.isEdited"
      :isDeleted="reply.account.isDeleted"
      :isStarred="reply.account.isStarred"
      :isFed="reply.account.isFed"
    />
  </div>
</template>

<script setup lang="ts">
  import Reply from '/src/components/comments/commentsAndReplies/Reply.vue'
  
  defineProps(
  [
    'colorName',
    'colorHexValue',
    'toggleList',
    'commentSectionNamePrefix',
    'commentSectionName',
    'replies',
    'repliesToReplies',
    'remainingReplies'
  ])
</script>

<style scoped>
  .replyList
  {
    display: flex;
    flex-direction: column
  }

  .commentList .replyList
  {
    display: flex;
    padding-left: 2rem;
    width: 100%
  }
</style>