<template>
  <div id="asciiArtBottomBar">
    <ion-button 
    color="white" 
    class="bottomMenuKaomojiButton" 
    :class="{ selected: emojiSelector.asciiArtBottomMenuBarIndex  == 0 }"
    fill="clear" 
    title="classic" 
    @click="setAsciiArtBottomMenuBarIndex(0)">
      :)
    </ion-button>
    <ion-button 
    color="white" 
    class="bottomMenuKaomojiButton" 
    :class="{ selected: emojiSelector.asciiArtBottomMenuBarIndex  == 1 }"
    fill="clear" 
    title="Kaomoji: Happy" 
    @click="setAsciiArtBottomMenuBarIndex(1)" >
      (✿◠‿◠)
    </ion-button>
    <ion-button 
    color="white" 
    class="bottomMenuKaomojiButton" 
    :class="{ selected: emojiSelector.asciiArtBottomMenuBarIndex  == 2 }"
    fill="clear" 
    title="Kaomoji: Greetings" 
    @click="setAsciiArtBottomMenuBarIndex(2)" >
      ☜(ﾟヮﾟ☜)
    </ion-button>
    <ion-button 
    color="white" 
    class="bottomMenuKaomojiButton" 
    :class="{ selected: emojiSelector.asciiArtBottomMenuBarIndex  == 3 }"
    fill="clear" 
    title="Kaomoji: Acting Cute" 
    @click="setAsciiArtBottomMenuBarIndex(3)" >
      ✍(◔◡◔)
    </ion-button>
    <ion-button 
    color="white" 
    class="bottomMenuKaomojiButton" 
    :class="{ selected: emojiSelector.asciiArtBottomMenuBarIndex  == 4 }"
    fill="clear" 
    title="Kaomoji: Sad" 
    @click="setAsciiArtBottomMenuBarIndex(4)" >
      (┬┬﹏┬┬)
    </ion-button>
    <ion-button 
    color="white" 
    class="bottomMenuKaomojiButton" 
    :class="{ selected: emojiSelector.asciiArtBottomMenuBarIndex  == 5 }"
    fill="clear" 
    title="Kaomoji: Angry" 
    @click="setAsciiArtBottomMenuBarIndex(5)" >
      (╬▔皿▔)╯
    </ion-button>
    <ion-button 
    color="white" 
    class="bottomMenuKaomojiButton" 
    :class="{ selected: emojiSelector.asciiArtBottomMenuBarIndex  == 6 }"
    fill="clear" 
    title="Kaomoji: Surpised" 
    @click="setAsciiArtBottomMenuBarIndex(6)" >
      ⚆_⚆
    </ion-button>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { IonButton } from '@ionic/vue'
  import { emojiSelector } from '/src/assets/globalStates/EmojiSelector.vue'

  defineProps(['colorHexValue'])

  onMounted(() => 
  {
    emojiSelector.asciiArtBottomMenuBarIndex = localStorage.getItem("asciiArtBottomMenuBarIndex") || 0
  })

  function setAsciiArtBottomMenuBarIndex(index: number)
  {
    emojiSelector.asciiArtBottomMenuBarIndex = index
    localStorage.setItem("asciiArtBottomMenuBarIndex", index.toString())
  }  
</script>

<style scoped> 
  #asciiArtBottomBar
  {
    display: flex;
    overflow-x: auto
  }
  
  .selected 
  {
    text-decoration:underline;
    text-decoration-color: v-bind(colorHexValue);
    text-decoration-thickness: 2px;
    text-underline-offset: 8px
  }

  .bottomMenuKaomojiButton
  {
    font-size: 20px;
    white-space: nowrap
  }
</style>
