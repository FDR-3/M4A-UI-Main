<template>
  <div class="mediumMarginBottom">
    <h1>Special Thanks</h1>

    <div v-if="anchorPrograms.isM4AProtocolReady">
      <h2>M4A Protocol Initiator:</h2>
      <div v-if="useM4AProtocolInitiatorCustomName" class="flexCenterRow nMediumMarginTop">
        <RainbowStarWolf class="starWolfIcon"/>
        <h3>{{ m4aProtocolInitiatorDisplayName }}</h3>
      </div>
      <div v-else class="flexCenterRow nMediumMarginTop">
        <StarWolf class="starWolfIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
        <h3 v-if="useTrimmedAddress" class="rainbowText fullAddress">{{ trimAddress(m4aProtocolInitiatorDisplayName) }}</h3>
        <h3 v-else class="rainbowText fullAddress">{{ m4aProtocolInitiatorDisplayName }}</h3>
      </div> 
    </div>

    <div v-if="anchorPrograms.isChatProtocolReady">
      <h2>Chat Protocol Initiator:</h2>
      <div v-if="useChatProtocolInitiatorCustomName" class="flexCenterRow nMediumMarginTop">
        <RainbowStarWolf class="starWolfIcon"/>
        <h3>{{ chatProtocolInitiatorDisplayName }}</h3>
      </div>
      <div v-else class="flexCenterRow nMediumMarginTop">
        <StarWolf class="starWolfIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
        <h3 v-if="useTrimmedAddress" class="rainbowText fullAddress">{{ trimAddress(chatProtocolInitiatorDisplayName) }}</h3>
        <h3 v-else class="rainbowText fullAddress">{{ chatProtocolInitiatorDisplayName }}</h3>
      </div>
    </div>

    <div v-if="anchorPrograms.isM4AChatReady">
      <h2>M4A Chat Initiator:</h2>
      <div v-if="useM4AChatInitiatorCustomName" class="flexCenterRow nMediumMarginTop">
        <RainbowStarWolf class="starWolfIcon"/>
        <h3>{{ m4aChatInitiatorDisplayName }}</h3>
      </div>
      <div v-else class="flexCenterRow nMediumMarginTop">
        <StarWolf class="starWolfIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
        <h3 v-if="useTrimmedAddress" class="rainbowText fullAddress">{{ trimAddress(m4aChatInitiatorDisplayName) }}</h3>
        <h3 v-else class="rainbowText fullAddress">{{ m4aChatInitiatorDisplayName }}</h3>
      </div>
    </div>

    <div v-if="anchorPrograms.isPLIChatReady">
      <h2>PLI Chat Initiator:</h2>
      <div v-if="usePLIChatInitiatorCustomName" class="flexCenterRow nMediumMarginTop">
        <RainbowStarWolf class="starWolfIcon"/>
        <h3>{{ pliChatInitiatorDisplayName }}</h3>
      </div>
      <div v-else class="flexCenterRow nMediumMarginTop">
        <StarWolf class="starWolfIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
        <h3 v-if="useTrimmedAddress" class="rainbowText fullAddress">{{ trimAddress(pliChatInitiatorDisplayName) }}</h3>
        <h3 v-else class="rainbowText fullAddress">{{ pliChatInitiatorDisplayName }}</h3>
      </div>
    </div>

    <div v-if="anchorPrograms.isAboutChatReady">
      <h2>About Chat Initiator:</h2>
      <div v-if="useAboutChatInitiatorCustomName" class="flexCenterRow nMediumMarginTop">
        <RainbowStarWolf class="starWolfIcon"/>
        <h3>{{ aboutChatInitiatorDisplayName }}</h3>
      </div>
      <div v-else class="flexCenterRow nMediumMarginTop">
        <StarWolf class="starWolfIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
        <h3 v-if="useTrimmedAddress" class="rainbowText fullAddress">{{ trimAddress(aboutChatInitiatorDisplayName) }}</h3>
        <h3 v-else class="rainbowText fullAddress">{{ aboutChatInitiatorDisplayName }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
  import { getUserDisplayName, getUserCustomNameFlag } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { trimAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import RainbowStarWolf from '/src/components/fancy/RainbowStarWolf.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

  var m4aProtocolInitiatorDisplayName = ref()
  var chatProtocolInitiatorDisplayName = ref()
  var m4aChatInitiatorDisplayName = ref()
  var pliChatInitiatorDisplayName = ref()
  var aboutChatInitiatorDisplayName = ref()

  var useM4AProtocolInitiatorCustomName = ref()
  var useChatProtocolInitiatorCustomName = ref()
  var useM4AChatInitiatorCustomName = ref()
  var usePLIChatInitiatorCustomName = ref()
  var useAboutChatInitiatorCustomName = ref()

  const windowWidth = ref(window.innerWidth)

  const handleResize = () =>
  {
    windowWidth.value = window.innerWidth
  }

  const useTrimmedAddress = computed(() =>
  {
    return windowWidth.value < 920
  })

  //"anchorPrograms" variable values may not be available onmounted refresh so additional watch of "anchorPrograms" was added
  onMounted(async() =>
  {
    window.addEventListener('resize', handleResize)

    //M4A Protocol
    if(anchorPrograms.isM4AProtocolReady)
    {
      m4aProtocolInitiatorDisplayName.value = getUserDisplayName(anchorPrograms.m4aProtocolInitiatorAddress)
      useM4AProtocolInitiatorCustomName.value = getUserCustomNameFlag(anchorPrograms.m4aProtocolInitiatorAddress)
    }

    //Chat Protocol
    if(anchorPrograms.isChatProtocolReady)
    {
      chatProtocolInitiatorDisplayName.value = getUserDisplayName(anchorPrograms.chatProtocolInitiatorAddress)
      useChatProtocolInitiatorCustomName.value = getUserCustomNameFlag(anchorPrograms.chatProtocolInitiatorAddress)
    }

    //M4A Chat
    if(anchorPrograms.isM4AChatReady)
    {
      m4aChatInitiatorDisplayName.value = getUserDisplayName(anchorPrograms.m4aChatInitiatorAddress)
      useM4AChatInitiatorCustomName.value = getUserCustomNameFlag(anchorPrograms.m4aChatInitiatorAddress)
    }

    //PLI Chat
    if(anchorPrograms.isPLIChatReady)
    {
      pliChatInitiatorDisplayName.value = getUserDisplayName(anchorPrograms.pliChatInitiatorAddress)
      usePLIChatInitiatorCustomName.value = getUserCustomNameFlag(anchorPrograms.pliChatInitiatorAddress)
    }

    //About Chat
    if(anchorPrograms.isAboutChatReady)
    {
      aboutChatInitiatorDisplayName.value = getUserDisplayName(anchorPrograms.aboutChatInitiatorAddress)
      useAboutChatInitiatorCustomName.value = getUserCustomNameFlag(anchorPrograms.aboutChatInitiatorAddress)
    }
  })

  onUnmounted(() =>
  {
    window.removeEventListener('resize', handleResize)
  })

  watch(anchorPrograms, () =>
  {
    //M4A Protocol
    if(anchorPrograms.isM4AProtocolReady)
    {
      m4aProtocolInitiatorDisplayName.value = getUserDisplayName(anchorPrograms.m4aProtocolInitiatorAddress)
      useM4AProtocolInitiatorCustomName.value = getUserCustomNameFlag(anchorPrograms.m4aProtocolInitiatorAddress)
    }

    //Chat Protocol
    if(anchorPrograms.isChatProtocolReady)
    {
      chatProtocolInitiatorDisplayName.value = getUserDisplayName(anchorPrograms.chatProtocolInitiatorAddress)
      useChatProtocolInitiatorCustomName.value = getUserCustomNameFlag(anchorPrograms.chatProtocolInitiatorAddress)
    }

    //M4A Chat
    if(anchorPrograms.isM4AChatReady)
    {
      m4aChatInitiatorDisplayName.value = getUserDisplayName(anchorPrograms.m4aChatInitiatorAddress)
      useM4AChatInitiatorCustomName.value = getUserCustomNameFlag(anchorPrograms.m4aChatInitiatorAddress)
    }

    //PLI Chat
    if(anchorPrograms.isPLIChatReady)
    {
      pliChatInitiatorDisplayName.value = getUserDisplayName(anchorPrograms.pliChatInitiatorAddress)
      usePLIChatInitiatorCustomName.value = getUserCustomNameFlag(anchorPrograms.pliChatInitiatorAddress)
    }

    //About Chat
    if(anchorPrograms.isAboutChatReady)
    {
      aboutChatInitiatorDisplayName.value = getUserDisplayName(anchorPrograms.aboutChatInitiatorAddress)
      useAboutChatInitiatorCustomName.value = getUserCustomNameFlag(anchorPrograms.aboutChatInitiatorAddress)
    }
  })

  watch(customUserNameHashMap, () =>
  {
    //M4A Protocol
    if(anchorPrograms.isM4AProtocolReady)
    {
      m4aProtocolInitiatorDisplayName.value = getUserDisplayName(anchorPrograms.m4aProtocolInitiatorAddress)
      useM4AProtocolInitiatorCustomName.value = getUserCustomNameFlag(anchorPrograms.m4aProtocolInitiatorAddress)
    }

    //Chat Protocol
    if(anchorPrograms.isChatProtocolReady)
    {
      chatProtocolInitiatorDisplayName.value = getUserDisplayName(anchorPrograms.chatProtocolInitiatorAddress)
      useChatProtocolInitiatorCustomName.value = getUserCustomNameFlag(anchorPrograms.chatProtocolInitiatorAddress)
    }

    //M4A Chat
    if(anchorPrograms.isM4AChatReady)
    {
      m4aChatInitiatorDisplayName.value = getUserDisplayName(anchorPrograms.m4aChatInitiatorAddress)
      useM4AChatInitiatorCustomName.value = getUserCustomNameFlag(anchorPrograms.m4aChatInitiatorAddress)
    }

    //PLI Chat
    if(anchorPrograms.isPLIChatReady)
    {
      pliChatInitiatorDisplayName.value = getUserDisplayName(anchorPrograms.pliChatInitiatorAddress)
      usePLIChatInitiatorCustomName.value = getUserCustomNameFlag(anchorPrograms.pliChatInitiatorAddress)
    }

    //About Chat
    if(anchorPrograms.isAboutChatReady)
    {
      aboutChatInitiatorDisplayName.value = getUserDisplayName(anchorPrograms.aboutChatInitiatorAddress)
      useAboutChatInitiatorCustomName.value = getUserCustomNameFlag(anchorPrograms.aboutChatInitiatorAddress)
    }
  })
</script>

<style scoped>
  .starWolfIcon
  {
    width: min(10vw, 80px);
    min-width: min(10vw, 80px);
 
    height: min(12vw, 100px);
    min-height: min(12vw, 100px);
  }

  h3
  {
    margin: 0;
    margin-left: 5px
  }
</style>