<template>
  <div class="flexCenterColumn thickBorder">
    <div class="smallMarginTop smallMarginBottom">
      <h2 v-if="connectedWallet.hasHadCustomName">Current Name: 
        <span v-if="isCustomNameEnabled">{{ currentName }}</span>
        <s v-else>{{ currentName }}</s>   
      </h2>
      <div class="flexCenterRow">
        <ion-text>Set custom user name for just a</ion-text>
        <ion-button fill="clear" @click="giveUXWingDollarCredit()">
          <Dollar style="width: min(50px, 11vw)"/>
        </ion-button>
        <ion-button fill="clear" @click="giveUXWingTreeCredit()" class="nMediumLargeMarginLeft">
          <Tree class="svgSize"/>
        </ion-button>
      </div>
      <div class="flexCenterRow" >
        <ion-text>Toggle on or off for just a</ion-text>
        <ion-button fill="clear" style="width: 15%" @click="giveUXWingTreeCredit()">
          <Tree class="svgSize"/>
        </ion-button>
        <ion-text style="margin-left: 7px">+</ion-text>
        <div class="nMediumSmallMarginBottom">
          <div class="nMediumSmallMarginBottom">
            <ion-text style="line-height: -10px; font-size: min(22px, 8vw)">1</ion-text><br>
          </div>
          <ion-text style="line-height: 2px" class="nSmallMarginTop">___</ion-text><br>
          <ion-button fill="clear" @click="sourceW3SchoolsEmojis()" class="nSmallMarginTop">
            <ion-text class="emojiText">💩</ion-text>
          </ion-button>
        </div>

        <ion-button fill="clear" style="margin-left: -31px" @click="giveUXWingTreeCredit()" class="nLargeMarginLeft">
          <Tree class="svgSize"/>
        </ion-button>
      </div>

      <br>
      <ion-text>These crowd funding donations are paid in
        <div class="flexCenterRow tinyMarginTop">
          <ion-button fill="clear" @click="sourceUSDC()" >
            <USDCSVG class="svgSize"/>
          </ion-button>
          <ion-label class="nSmallMarginLeft">USDC</ion-label>
        </div>
      </ion-text>
    </div>
    
    <div>
      <div class="flexCenterRow nMediumLargeMarginTop" style="width: min(84vw, 580px)">
        <ion-textarea
          ref="setUserNameTextAreaRef"
          class="emojiTextSmaller"
          v-model="userNameInput"
          fill="outline"
          style="overflow-y: none"
          placeholder="Set user name for $1.03, Toogle on or off for $0.04"
          :counter="true"
          :maxlength=MAX_USERNAME_LENGTH
          :counter-formatter="customFormatter"
        >
          <EmojiButton
            :colorHexValue="colorHexValue"
            @emojiSelected="(emoji: String) => insertEmoji(emoji)"
          />
        </ion-textarea>
      </div>
      <ion-button
        :color=colorName
        style="margin-bottom: 21px"
        @click="updateUserName()"
        :disabled="!connectedWallet.isChatAccountReady || (userNameInput==currentName) || (userNameInput=='')"
      >
        Set Name
      </ion-button>
      <ion-button v-if="connectedWallet.hasHadCustomName" :color=colorName style="margin-bottom: 21px; margin-left: 10px" @click="setUseCustomNameFlag()">
        {{ isCustomNameEnabled ? "Toggle Off" : "Toggle On"}}
      </ion-button>
    </div>
    <ion-text v-if="connectedWallet.hasHadCustomName">
      Your account can now get to this page faster with the <ion-text color="green">"Comment Section Jumper"</ion-text> button in the Menu
    </ion-text>
    <div v-if="!connectedWallet.isChatAccountReady" class="mediumMarginBottom">
      <ion-text  color="red">Initialize your chat account to set custom user name</ion-text>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUpdated, watch, computed, inject } from 'vue'
  import { IonText, IonTextarea, IonButton, IonLabel } from '@ionic/vue'
  import { MAX_USERNAME_LENGTH } from './constants.ts'
  import Dollar from '/src/assets/svg/dollar-svg.vue'
  import Tree from '/src/assets/svg/tree-svg.vue'
  import USDCSVG from '/src/assets/cryptoIcons/usdc-svg.vue'
  import EmojiButton from '/src/components/comments/emojis/EmojiButton.vue'
  import { giveUXWingDollarCredit, giveUXWingTreeCredit } from '/src/assets/helperFunctions/credits.ts'
  import { sourceW3SchoolsEmojis, sourceUSDC } from '/src/assets/helperFunctions/sources.ts'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { confirmChatTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'

  const toast = inject('toast')
  const colorName = inject('colorName') as string 
  const colorHexValue = inject('colorHexValue') as string

  var setUserNameTextAreaRef = ref()
  var savedEmojiCursorPosition: any
  var userNameInput = ref("")//Set as string initially for length to insert emoji
  var overUserNameByteSizeLimit = ref(false)

  var currentName = ref()
  var isCustomNameEnabled = ref()

  var chatAccountWatchId: any
  
  onMounted(async() =>
  {
    
    const chatAccount = customUserNameHashMap.map.get(connectedWallet.addressString)
    if(chatAccount)
    {
      currentName.value = chatAccount.userName
      isCustomNameEnabled.value = chatAccount.useCustomName
      userNameInput.value = currentName.value
    }
    else
    {
      currentName.value = ""
      isCustomNameEnabled.value = false
      userNameInput.value = ""
    }
  })

  watch(customUserNameHashMap, () =>
  {
    const chatAccount = customUserNameHashMap.map.get(connectedWallet.addressString)
    if(chatAccount)
    {
      currentName.value = chatAccount.userName
      isCustomNameEnabled.value = chatAccount.useCustomName
      userNameInput.value = currentName.value
    }
    else
    {
      currentName.value = ""
      isCustomNameEnabled.value = false
      userNameInput.value = ""
    }
  })

  //Json string of wallet to detect object property changes
  const walletWatch = computed(() =>
  {
    return JSON.stringify(connectedWallet)
  })

  watch(walletWatch, async (newJSONObjectString, oldJSONObjectString) =>
  { 
    let newWallet = JSON.parse(newJSONObjectString)
    let oldWallet= JSON.parse(oldJSONObjectString)

    if(newWallet.addressString == oldWallet.addressString)
      return

    if(chatAccountWatchId != undefined)
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(chatAccountWatchId)
    
    const chatAccount = customUserNameHashMap.map.get(connectedWallet.addressString)
    if(chatAccount)
    {
      currentName.value = chatAccount.userName
      isCustomNameEnabled.value = chatAccount.useCustomName
      userNameInput.value = currentName.value
    }
    else
    {
      currentName.value = ""
      isCustomNameEnabled.value = false
      userNameInput.value = ""
    }
  })

  //Move cursor back after emoji insert
  onUpdated(() => 
  {
    var textAreaElement = setUserNameTextAreaRef.value?.$el.querySelector(".native-textarea")

    if(savedEmojiCursorPosition != undefined)
      if(textAreaElement)
      {
        textAreaElement.setSelectionRange(savedEmojiCursorPosition, savedEmojiCursorPosition)
        textAreaElement.focus()
        savedEmojiCursorPosition = undefined
      }
  })

  async function updateUserName()
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.updateUserName(anchorPrograms.usdcFeeTokenAddress, userNameInput.value).rpc()
      userNameInput.value = ""
      await confirmChatTransaction(tx, toast, "update_user_name")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "update_user_name")
    }
  }

  async function setUseCustomNameFlag()
  {
    var tx

    try
    {
      if(isCustomNameEnabled.value)
        tx = await anchorPrograms.chat.chatProgram.methods.setUseCustomNameFlag(anchorPrograms.usdcFeeTokenAddress, false).rpc()
      else
        tx = await anchorPrograms.chat.chatProgram.methods.setUseCustomNameFlag(anchorPrograms.usdcFeeTokenAddress, true).rpc()

      await confirmChatTransaction(tx, toast, "set_use_custom_name_flag")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "set_use_custom_name_flag")
    }
  } 
  
  const customFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([userNameInput.value])
    const sizeInBytes = blob.size

    inputLength = sizeInBytes

    if(inputLength > maxLength)
    {
      overUserNameByteSizeLimit.value = true
    }
    else
      overUserNameByteSizeLimit.value = false

    return `${inputLength}/${maxLength}`
  }

  function insertEmoji(emoji: String)
  {
    var textAreaElement = setUserNameTextAreaRef.value.$el.querySelector(".native-textarea")
    if(textAreaElement) 
    {
      const start = textAreaElement.selectionStart
      const end = textAreaElement.selectionEnd
      const newValue = 
      userNameInput.value.substring(0, start) + 
      emoji + 
      userNameInput.value.substring(end)

      userNameInput.value = newValue

      savedEmojiCursorPosition = textAreaElement.selectionStart + emoji.length
    }
  }
</script>

<style scoped>
  ion-icon
  {
    min-width: min(7vw, 35px);
    height: min(7vw, 35px);
    margin-left: 5px
  }

  .svgSize
  {
    min-width: min(7vw, 35px);
    height: min(7vw, 35px);
    margin-left: 5px
  }

  ion-textarea
  {
    --highlight-color: v-bind(colorHexValue)
  }
</style>