<script lang="ts">
  import { reactive } from 'vue'

  export const commentSectionInfo = reactive(
  {
    prefix: "",
    name: "",
    isCommentSectionReady: false,
    initiatorAddress: "",
    initiatorDisplayName: "",
    videoVoteScore: 0,
    hideComments: localStorage.getItem("hideComments") == "true"
  })

  export const hidenCommentSections = reactive(
  {
    hidden: localStorage.getItem("hideComments") == "true"
  })

  export const commentSections = reactive(
  {
    data: undefined
  })

  export const commentSectionHashMap = reactive(
  {
    map: new Map<string, any>()
  })

  export default commentSectionInfo
</script>