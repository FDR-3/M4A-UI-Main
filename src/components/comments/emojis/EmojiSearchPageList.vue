<template>
  <div v-if="emojiSelector.topMenuBarIndex==0">
    <PeoplePageSelector @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)" :colorHexValue="colorHexValue"/> 
    <SmileyPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
    <ObjectPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/> 
    <FoodAndPlantPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
    <CarsAndSuchPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
    <SymbolsPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
  </div>
  <div v-if="emojiSelector.topMenuBarIndex==1">
    <ClassicPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
    <KaomojiHappyPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
    <KaomojiGreetingsPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
    <KaomojiActingCutePage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
    <KaomojiSadPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
    <KaomojiAngryPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
    <KaomojiSuprisedPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
  </div>
  <div v-if="emojiSelector.topMenuBarIndex==2">
    <GeneralPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
    <CurrencyPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
    <LatinPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
    <GeometricPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
    <MathSymbolsPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
    <SupplementalPage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
    <LanguagePage @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"/>
  </div>
</template>

<script setup lang="ts">
  import { emojiSelector } from '/src/assets/globalStates/EmojiSelector.vue'  
  import SmileyPage from './emoji/SmileyPage.vue'
  import PeoplePageSelector from './emoji/people/PeoplePageSelector.vue'
  import ObjectPage from './emoji/ObjectPage.vue'
  import FoodAndPlantPage from './emoji/FoodAndPlantPage.vue'
  import CarsAndSuchPage from './emoji/CarsAndSuchPage.vue'
  import SymbolsPage from './emoji/SymbolsPage.vue'

  import ClassicPage from './ascii art/ClassicPage.vue'
  import KaomojiHappyPage from './ascii art/KaomojiHappyPage.vue'
  import KaomojiGreetingsPage from './ascii art/KaomojiGreetingsPage.vue'
  import KaomojiActingCutePage from './ascii art/KaomojiActingCutePage.vue'
  import KaomojiSadPage from './ascii art/KaomojiSadPage.vue'
  import KaomojiAngryPage from './ascii art/KaomojiAngryPage.vue'
  import KaomojiSuprisedPage from './ascii art/KaomojiSuprisedPage.vue'

  import GeneralPage from './symbols/GeneralPage.vue'
  import CurrencyPage from './symbols/CurrencyPage.vue'
  import LatinPage from './symbols/LatinPage.vue'
  import GeometricPage from './symbols/GeometricPage.vue'
  import MathSymbolsPage from './symbols/MathSymbolsPage.vue'
  import SupplementalPage from './symbols/SupplementalPage.vue'
  import LanguagePage from './symbols/LanguagePage.vue'

  defineEmits(['emojiSelected'])
  defineProps(['colorHexValue'])
</script>