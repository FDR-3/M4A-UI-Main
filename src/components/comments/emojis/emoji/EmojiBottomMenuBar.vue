<template>
  <div id="emojiBottomBar" class="spaceRowEvenly">
    <ion-button
      :class="{ selected: emojiSelector.emojiBottomMenuBarIndex==0 }"
      class="emojiButton" 
      fill="clear" 
      title="smilies and animals" 
      @click="setEmojiBottomMenuBarIndex(0)"
    >
      😆
    </ion-button>
    <ion-button 
      :class="{ selected: emojiSelector.emojiBottomMenuBarIndex==1 }"
      class="emojiButton" 
      fill="clear" 
      title="people" 
      @click="setEmojiBottomMenuBarIndex(1)"
    >
      🧙‍♂️
    </ion-button>
    <ion-button
      :class="{ selected: emojiSelector.emojiBottomMenuBarIndex==2 }" 
      class="emojiButton" 
      fill="clear" 
      title="objects" 
      @click="setEmojiBottomMenuBarIndex(2)"
    >
      💾
    </ion-button>
    <ion-button 
      :class="{ selected: emojiSelector.emojiBottomMenuBarIndex==3 }"
      class="emojiButton" 
      fill="clear" 
      title="food and plants" 
      @click="setEmojiBottomMenuBarIndex(3)"
    >
      🍜
    </ion-button>
    <ion-button 
      :class="{ selected: emojiSelector.emojiBottomMenuBarIndex==4 }"
      class="emojiButton" 
      fill="clear" 
      title="cars and such" 
      @click="setEmojiBottomMenuBarIndex(4)"
    >
      🚑
    </ion-button>
    <ion-button 
      :class="{ selected: emojiSelector.emojiBottomMenuBarIndex==5 }"
      class="emojiButton" 
      fill="clear" 
      title="symbols" 
      @click="setEmojiBottomMenuBarIndex(5)"
    >
      💖
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
    emojiSelector.emojiBottomMenuBarIndex = localStorage.getItem("emojiBottomMenuBarIndex") || 0
  })

  function setEmojiBottomMenuBarIndex(index: number)
  {
    emojiSelector.emojiBottomMenuBarIndex = index
    localStorage.setItem("emojiBottomMenuBarIndex", index.toString())
  }  
</script>

<style scoped>
  #emojiBottomBar
  {
    display: flex;
    overflow-x: auto;
  }

  .selected 
  {
    text-decoration:underline;
    text-decoration-color: v-bind(colorHexValue);
    text-decoration-thickness: 2px;
    text-underline-offset: 8px
  }
</style>
