<template>
  <!--skin tone selector-->
  <ion-item-divider 
    v-if="emojiSelector.peopleEmojiFilterCount!=0"
    color="light"
    sticky
  >
    <ion-button :class="{ selected: skinColorBarIndex.value==0 }" fill="clear" id="emojiPeopleColor1" @click="setskinColorBarIndex(0)" >
      1
    </ion-button>
    <ion-button :class="{ selected: skinColorBarIndex.value==1 }" fill="clear" id="emojiPeopleColor2" @click="setskinColorBarIndex(1)">
      2
    </ion-button>
    <ion-button :class="{ selected: skinColorBarIndex.value==2 }" fill="clear" id="emojiPeopleColor3" @click="setskinColorBarIndex(2)">
      3
    </ion-button>
    <ion-button :class="{ selected: skinColorBarIndex.value==3 }" fill="clear" id="emojiPeopleColor4" @click="setskinColorBarIndex(3)">
      4
    </ion-button>
    <ion-button :class="{ selected: skinColorBarIndex.value==4 }" fill="clear" id="emojiPeopleColor5" @click="setskinColorBarIndex(4)">
      5
    </ion-button>
    <ion-button :class="{ selected: skinColorBarIndex.value==5 }" fill="clear" id="emojiPeopleColor6" @click="setskinColorBarIndex(5)">
      6
    </ion-button>
  </ion-item-divider>
  <component :is="peoplePageArray[skinColorBarIndex.value]" @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"></component>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { IonItemDivider, IonButton } from '@ionic/vue'
  import PeoplePage1  from './PeoplePage1.vue'
  import PeoplePage2  from './PeoplePage2.vue'
  import PeoplePage3  from './PeoplePage3.vue'
  import PeoplePage4  from './PeoplePage4.vue'
  import PeoplePage5  from './PeoplePage5.vue'
  import PeoplePage6  from './PeoplePage6.vue'
  import { emojiSelector, skinColorBarIndex } from '/src/assets/globalStates/EmojiSelector.vue'

  defineProps(['colorHexValue'])
  defineEmits(['emojiSelected'])

  onMounted(() => 
  {
    skinColorBarIndex.value = localStorage.getItem("skinColorBarIndex") || 0
  })

  function setskinColorBarIndex(index: number)
  {
    skinColorBarIndex.value = index
    localStorage.setItem("skinColorBarIndex", index.toString())
  }  

  const peoplePageArray = 
  [
    PeoplePage1,
    PeoplePage2,
    PeoplePage3,
    PeoplePage4,
    PeoplePage5,
    PeoplePage6
  ]
</script>

<style scoped>
  #emojiPeopleColor1
  {
    background-color: #e4c22e;
    border-radius: 4px
  }

  #emojiPeopleColor2
  {
    background-color: rgb(247,215,196);
    border-radius: 4px
  }

  #emojiPeopleColor3
  {
    background-color: rgb(216, 176, 148);
    border-radius: 4px
  }

  #emojiPeopleColor4
  {
    background-color: rgb(187,145,103);
    border-radius: 4px
  }

  #emojiPeopleColor5
  {
    background-color: rgb(142,86,46);
    border-radius: 4px
  }

  #emojiPeopleColor6
  {
    background-color: rgb(97,61,48);
    border-radius: 4px
  }

  ion-button
  {
    --color: white;
    width: 35px
  }

  .selected 
  {
    --border-radius: 4px;
    --border-color: v-bind(colorHexValue);
    --border-style: solid;
    --border-width: 3px;
    width: 35px
  }
</style>