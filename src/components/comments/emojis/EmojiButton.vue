<template>
  <ion-button 
    ref="emojiButton"
    style="margin-left: -7px; margin-right: -20px; margin-top: -9px"
    slot="end"
    fill="clear"
    @click="openPopover($event); isEmojiSearchActive=false; emojiSearchValue=''">
    <ion-icon class="emojiButtonIcon" color="gray" :src=happyOutline></ion-icon>
  </ion-button>
  <ion-popover
    :is-open="popoverOpen" 
    :event="event"
    @didDismiss="popoverOpen=false"
    @didPresent="movePopoverIntoView($event)"
    side="top" 
    alignment="center"
    size="auto"
  >
  <div class="emojiPopover">
    <!--emoji search bar-->
    <div v-if="!isEmojiSearchActive" class="flexCenterColumn">
      <ion-button @click="setisEmojiSearchActive(true); setSearchBarFocus()" fill="clear">
        <ion-label class="magnifyingGlassEmoji">🔍</ion-label>
        <ion-label color="white">{{ emojiPlaceHolderSearchValue }}</ion-label>
      </ion-button>
    </div>
    <div v-else class="flexCenterRow">
      <ion-input
        ref="emojiSearchTextAreaRef"
        id="emojiSearchTextArea"
        class="right-placeholder"
        v-model="emojiSearchValue" 
        :placeholder="emojiPlaceHolderSearchValue"
        :spellcheck="true"
      >
        <ion-button slot="end" fill="clear" @click="setisEmojiSearchActive(false); emojiSearchValue=''">
          <ion-icon id="searchCloseButton" style="margin-right: 20px" :src=closeOutline color="white">
          </ion-icon>
        </ion-button>
      </ion-input>
    </div>

    <!--topOption bar-->
    <div class="spaceRowEvenly">
      <ion-button 
      :class="{ selected: emojiSelector.topMenuBarIndex==0 }"
      class="emojiButton" 
      fill="clear" 
      title="emojis" 
      @click="isEmojiSearchActive=false; emojiSelector.peopleEmojiFilterCount=-1; setTopMenuBarIndex(0); emojiSearchValue=''; emojiPlaceHolderSearchValue='emoji search'">
        🙂
      </ion-button>
      <ion-button 
      :class="{ selected: emojiSelector.topMenuBarIndex==1 }"
      class="kaomojiButton noWrapText"
      fill="clear" 
      title="kaomojis" 
      @click="isEmojiSearchActive=false; emojiSelector.peopleEmojiFilterCount=-1; setTopMenuBarIndex(1); emojiSearchValue=''; emojiPlaceHolderSearchValue='ascii art search'" 
      color="white">
        ( ͡• ͜ʖ ͡•)
      </ion-button>
      <ion-button 
      :class="{ selected: emojiSelector.topMenuBarIndex==2 }"
      class="emojiButton" 
      fill="clear" 
      title="symbols" 
      @click="isEmojiSearchActive=false; emojiSelector.peopleEmojiFilterCount=-1; setTopMenuBarIndex(2); emojiSearchValue=''; emojiPlaceHolderSearchValue='ascii symbol search'" 
      color="white"
      >
        ©
      </ion-button>
      
    </div>

    <!--pages-->
    <ion-content class="emojiPage">
      <!--emoji filtered pages-->
      <EmojiSearchPageList
        v-if="isEmojiSearchActive && emojiSearchValue!=''"
        @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"
        :colorHexValue="colorHexValue"
      />

      <!--emoji pages with color selector-->
      <component 
        v-if="emojiSelector.topMenuBarIndex==0 && emojiSelector.emojiBottomMenuBarIndex==1 && !isEmojiSearchActive"
        :is="emojiPages[emojiSelector.emojiBottomMenuBarIndex]" 
        @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"
        :colorHexValue="colorHexValue"
      ></component>
      <!--emoji pages-->
      <component 
        v-else-if="emojiSelector.topMenuBarIndex==0 && !isEmojiSearchActive"
        :is="emojiPages[emojiSelector.emojiBottomMenuBarIndex]" 
        @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"
      ></component>

      <!--ascii art pages-->
      <component 
        v-if="emojiSelector.topMenuBarIndex==1 && !isEmojiSearchActive"
        :is="asciiArtPages[emojiSelector.asciiArtBottomMenuBarIndex]" 
        @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"
      ></component>

      <!--symbols art pages-->
      <component 
        v-if="emojiSelector.topMenuBarIndex==2 && !isEmojiSearchActive"
        :is="symbolsPages[emojiSelector.symbolsBottomMenuBarIndex]" 
        @emojiSelected="(emoji: String) => $emit('emojiSelected', emoji)"
      ></component>
    </ion-content>

    <!--bottomOption bar-->
    <div>
      <div v-if="isEmojiSearchActive" class="magnifyingGlassEmoji flexCenterRow">🔍</div>
      <component v-else :is="bottomMenuBars[emojiSelector.topMenuBarIndex]" :colorHexValue="colorHexValue"></component>
    </div>
  </div> 
  </ion-popover>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick, onMounted } from 'vue'
  import { IonButton, IonInput, IonIcon, IonPopover, IonContent, IonLabel } from '@ionic/vue'
  import { happyOutline, closeOutline } from 'ionicons/icons'
  import { emojiPages, asciiArtPages, symbolsPages  } from './EmojiPageList.vue'
  import EmojiSearchPageList from './EmojiSearchPageList.vue'
  import { bottomMenuBars } from './BottomMenuBarList.vue'
  import { emojiSelector, skinColorBarIndex } from '/src/assets/globalStates/EmojiSelector.vue'

  defineProps(['colorHexValue'])
  defineEmits(['emojiSelected'])

  var isEmojiSearchActive = ref()
  var emojiSearchTextAreaRef = ref()
  var emojiPlaceHolderSearchValue = ref("emoji search")
  var emojiSearchValue = ref("")
  var popoverOpen = ref()
  var event = ref()

  var popoverYOffset = ref("0px")

  var emojiButton = ref()

  onMounted(() => 
  {
    emojiSelector.topMenuBarIndex = localStorage.getItem("topMenuBarIndex") || 0
    isEmojiSearchActive.value = localStorage.getItem("isEmojiSearchActive") == "true"

    if(emojiSelector.topMenuBarIndex == 0)
      emojiPlaceHolderSearchValue.value = "     emoji search"
    else if(emojiSelector.topMenuBarIndex == 1)
      emojiPlaceHolderSearchValue.value = "     ascii art search"
    else if(emojiSelector.topMenuBarIndex == 2)
      emojiPlaceHolderSearchValue.value = "     ascii symbol"
  })

  watch([emojiSearchValue, skinColorBarIndex], async () =>
  {
    if(isEmojiSearchActive.value)
    {
      await nextTick()
      filterEmojis(emojiSearchValue.value)
    }
    else
      emojiSelector.peopleEmojiFilterCount = -1
  })

  function openPopover(e: Event) 
  {
    popoverYOffset.value = "0px"

    event.value = e
    popoverOpen.value = true
    emojiSearchValue.value = ""
    emojiSelector.peopleEmojiFilterCount = -1
  }

  function movePopoverIntoView(event: Event)
  {
    const popover = event.target as HTMLIonTextareaElement;

    const popoverContent = popover.shadowRoot?.querySelector('.popover-content') as HTMLElement;

    if (popoverContent)
    {
      const popoverRect = popoverContent.getBoundingClientRect()

      if (popoverRect.top < 0)
      {
        popoverYOffset.value = Math.abs(popoverRect.top - 111).toString() + "px"
      } 
    }
  }

  function setTopMenuBarIndex(index: number)
  {
    emojiSelector.topMenuBarIndex = index
    localStorage.setItem("topMenuBarIndex", index.toString())
  }

  function filterEmojis(searchValue: String)
  {
    var newFilteredPeopleCount = 0
    const emojiButtons = document.getElementsByClassName("emojiFilter")

    for(var i=0; i<emojiButtons.length; i++) 
    {
      hideEmoji(emojiButtons[i])
      
      if(emojiButtons[i].className.includes(searchValue.toLowerCase())) 
      {
        showEmoji(emojiButtons[i])
        
        if(emojiButtons[i].className.includes("peopleFilter"))
          newFilteredPeopleCount++
      }
    }

    emojiSelector.peopleEmojiFilterCount = newFilteredPeopleCount
  }

  // Show filtered elements
  function showEmoji(emojiElement: Element) 
  {
    const emojiClassNames = emojiElement.className.split(' ')

    if(emojiClassNames.indexOf('show') == -1) 
    {
      if(emojiClassNames.indexOf('hide') != -1)
        emojiClassNames.splice(emojiClassNames.indexOf('hide'), 1)
      
      emojiClassNames.push('show')

      emojiElement.className = emojiClassNames.join(' ')
    }
  }

  // Hide elements that are not selected
  function hideEmoji(emojiElement: Element) 
  {
    const emojiClassNames = emojiElement.className.split(" ")

    if(emojiClassNames.indexOf("hide") == -1) 
    {
      if(emojiClassNames.indexOf('show') != -1)
        emojiClassNames.splice(emojiClassNames.indexOf("show"), 1)
      
      emojiClassNames.push("hide")

      emojiElement.className = emojiClassNames.join(" ")
    }
  }

  async function setisEmojiSearchActive(isActive: boolean)
  {
    isEmojiSearchActive.value = isActive
    localStorage.setItem("isEmojiSearchActive", isEmojiSearchActive.value)
  }

  async function setSearchBarFocus()
  {
    await nextTick()

    if (emojiSearchTextAreaRef.value)
      setTimeout(() => { emojiSearchTextAreaRef.value.$el.setFocus() }, 100) //Doesn't work without delay
  }

</script>

<style scoped>
  ion-input
  {
    position: relative;
    width: 100%;
    --highlight-color: v-bind(colorHexValue);
    color: white
  }
  
  ion-button::part(native)
  {
    display: flex;
    align-self: center
  }

  ion-popover 
  {
    --background: rgb(77, 72, 72);
    --backdrop-opacity: 0.8;
    --box-shadow: 0px 0px 10px 10px v-bind(colorHexValue);
    --color: white;
    --width: min(94vw, 438px);
    --max-height: 394px;
    --offset-y: v-bind(popoverYOffset)
  }
/*emojiPopover"max-height: 438px"*/
  ion-content
  {
    height: 438px
  }

  .emojiButtonIcon
  {
    width: 25px;
    height: 25px
  }

  .selected 
  {
    text-decoration:underline;
    text-decoration-color: v-bind(colorHexValue);
    text-decoration-thickness: 2px;
    text-underline-offset: 8px
  }

  .magnifyingGlassEmoji
  {
    font-size: 34px
  }

  .right-placeholder::placeholder{
    text-align: center !important;
}

  .searchCloseButton
  {
    width: 20px
  }

  #topOptionBar
  {
    display: flex;
    justify-content: space-evenly
  }

  .emojiPage
  {
    max-height: 225px !important;
    min-height: 170px !important;
  }

  #emojiSearchTextArea
  {
    text-align: center
  }
</style>
