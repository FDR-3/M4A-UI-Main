<script lang="ts">
  import { reactive } from 'vue'

  export const emojiSelector = reactive(
  {
    topMenuBarIndex: 0,
    
    emojiBottomMenuBarIndex: 0,
    asciiArtBottomMenuBarIndex: 0,
    symbolsBottomMenuBarIndex: 0,
    peopleEmojiFilterCount: 0
  })

  export const skinColorBarIndex = reactive(
  {
    value: 0
  })

  export default emojiSelector
</script>