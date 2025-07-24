<template>
  <div id="symbolsBottomBar">
    <ion-button 
    color="white" 
    class="bottomMenuSymbolButton" 
    :class="{ selected: emojiSelector.symbolsBottomMenuBarIndex  == 0 }"
    fill="clear" 
    title="General" 
    @click="setsymbolsBottomMenuBarIndex(0)">
      ℉
    </ion-button>
    <ion-button 
    color="white" 
    class="bottomMenuSymbolButton" 
    :class="{ selected: emojiSelector.symbolsBottomMenuBarIndex  == 1 }"
    fill="clear" 
    title="Currency" 
    @click="setsymbolsBottomMenuBarIndex(1)" >
      $
    </ion-button>
    <ion-button 
    color="white" 
    class="bottomMenuSymbolButton" 
    :class="{ selected: emojiSelector.symbolsBottomMenuBarIndex  == 2 }"
    fill="clear" 
    title="Latin" 
    @click="setsymbolsBottomMenuBarIndex(2)" >
      ʤ
    </ion-button>
    <ion-button 
    color="white" 
    class="highBottomMenuSymbolButton" 
    :class="{ selected: emojiSelector.symbolsBottomMenuBarIndex  == 3 }"
    fill="clear" 
    title="Geometric" 
    @click="setsymbolsBottomMenuBarIndex(3)" >
      ↺
    </ion-button>
    <ion-button 
    color="white" 
    class="highBottomMenuSymbolButton" 
    :class="{ selected: emojiSelector.symbolsBottomMenuBarIndex  == 4 }"
    fill="clear" 
    title="Math" 
    @click="setsymbolsBottomMenuBarIndex(4)" >
      ∑
    </ion-button>
    <ion-button 
    color="white" 
    class="bottomMenuSymbolButton" 
    :class="{ selected: emojiSelector.symbolsBottomMenuBarIndex  == 5 }"
    fill="clear" 
    title="Supplemental" 
    @click="setsymbolsBottomMenuBarIndex(5)" >
      ⫷
    </ion-button>
    <ion-button 
    color="white" 
    class="highBottomMenuSymbolButton" 
    :class="{ selected: emojiSelector.symbolsBottomMenuBarIndex  == 6 }"
    fill="clear" 
    title="Language" 
    @click="setsymbolsBottomMenuBarIndex(6)" >
      Ᾱ
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
    emojiSelector.symbolsBottomMenuBarIndex = localStorage.getItem("symbolsBottomMenuBarIndex") || 0
  })

  function setsymbolsBottomMenuBarIndex(index: number)
  {
    emojiSelector.symbolsBottomMenuBarIndex = index
    localStorage.setItem("symbolsBottomMenuBarIndex", index.toString())
  }  
</script>

<style scoped> 
  #symbolsBottomBar
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

  .bottomMenuSymbolButton
  {
    font-size: 27px;
    min-width: 10px;
    margin: 0px
  }

  .highBottomMenuSymbolButton
  {
    font-size: 27px;
    min-width: 10px;
    margin-top: 11px;
    margin-right: 0px;
    margin-left: 0px
  }
</style>
