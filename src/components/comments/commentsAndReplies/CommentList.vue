<template>
  <div class="commentList">
    <Comment
      :commentSectionNamePrefix="commentSectionNamePrefix"
      :commentSectionName="commentSectionName"
      :replies="replies"
      :repliesToReplies="repliesToReplies"
      :remainingReplies="remainingReplies"
      v-for="comment in comments"
      :displayName="comment.account.displayName"
      :replyCount="comment.account.replyCount"
      :colorName="colorName"
      :colorHexValue="colorHexValue"
      :id="comment.account.id"
      :chatAccountPostCountIndex="comment.account.chatAccountPostCountIndex"
      :postOwnerAddress="comment.account.postOwnerAddress"
      :netVoteScore="comment.account.netVoteScore"
      :unixCreationTimeStamp="comment.account.unixCreationTimeStamp"
      :msg="comment.account.msg"
      :isEdited="comment.account.isEdited"
      :isDeleted="comment.account.isDeleted"
      :isStarred="comment.account.isStarred"
      :isFed="comment.account.isFed"
    />
  </div>
</template>

<script setup lang="ts">
  import Comment from '/src/components/comments/commentsAndReplies/Comment.vue'

  defineProps(
  [
    'colorName',
    'colorHexValue',
    'toggleList',
    'commentSectionNamePrefix',
    'commentSectionName',
    'comments',
    'replies',
    'repliesToReplies',
    'remainingReplies'
  ])
</script>

<style scoped>
  .commentList
  {
    display: flex;
    flex-direction: v-bind(toggleList)
  }
</style>