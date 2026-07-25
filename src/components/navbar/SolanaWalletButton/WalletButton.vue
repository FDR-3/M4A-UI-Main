<template>
  <!--Using "display: none" instead of v-if to fix comment section jumper button not display on fresh on Jesus Menu. Need wallet connected address username check-->
  <div :style="{display: navigation.menuIndex==MenuIndex.Jesus ? 'none':'block'}">
    <wallet-modal-provider
      :featured="featured"
      :container="container"
      :logo="logo"
      :dark="dark"
      :colorHexValue="colorHexValue"
    >
      <template #default="modalScope">
      
          <ion-button
            v-if="!wallet"
            :color="colorName"
            @click="modalScope.openModal"
          >
            <ion-label color="dark">
              Connect Wallet
            </ion-label>
          </ion-button>
          <wallet-connect-button
            :colorName="colorName"
            v-else-if="!publicKeyBase58"
          ></wallet-connect-button>
          <div v-else class="swv-dropdown">
            <ion-button
              class="swv-button swv-button-trigger connectButton"
              @click="openPopOver($event)"
              fill="clear"
            >
              <wallet-icon :wallet="wallet" class="swv-button-icon noClickEvent"></wallet-icon>
              <ion-text color="dark" v-text="publicKeyTrimmed" class="noClickEvent"></ion-text>
            </ion-button>

            <ion-popover name="dropdown" v-bind="{modalScope, scope}"
            :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen=false" side="bottom" size="cover">
              <ion-button v-if="canCopy"
                @click="copyAddress"
                :color="colorName"
                class="popOverButton"
              >
                <ion-label color="dark">
                  {{ addressCopied ? "Copied" : "Copy address" }}
                </ion-label>
              </ion-button>

              <ion-button
                @click="modalScope.openModal(); closePopOver($event)"
                :color="colorName"
                class="popOverButton"
              >
                <ion-label color="dark">
                  Change Wallet
                </ion-label>
              </ion-button>

              <ion-button
                @click="handleDisconnect(); closePopOver($event)"
                :color="colorName"
                class="popOverButton"
              >
                <ion-label color="dark">
                  Disconnect
                </ion-label>
              </ion-button>

            </ion-popover>
          </div>
      </template>

      <!-- Enable modal overrides. -->
      <template #overlay="modalScope">
        <slot name="modal-overlay" v-bind="{modalScope, scope}"></slot>
      </template>
      <template #modal="modalScope">
        <slot name="modal" v-bind="{modalScope, scope}"></slot>
      </template>
    </wallet-modal-provider>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, toRefs, onMounted, onUnmounted, watch } from "vue"
  import { onClickOutside, useClipboard } from "@vueuse/core"
  import { IonButton, IonLabel, IonPopover, IonText } from '@ionic/vue'
  import { PublicKey, AccountInfo } from "@solana/web3.js"
  import { useWallet } from 'solana-wallets-vue'
  import { navigation, MenuIndex } from '/src/assets/globalStates/Navigation.vue'
  import WalletConnectButton from '/src/components/navbar/SolanaWalletButton/WalletConnectButton.vue'
  import WalletIcon from './WalletIcon.vue'
  import WalletModalProvider from '/src/components/navbar/SolanaWalletButton/WalletModalProvider.vue'
  import { getAddressLookUpTableProgramAccountWrapper,
    getPriceAccountPDA,
    isTempPriceAccountAlive,
    determineMissingLUTAddresses } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { lendingUserHashMap, lendingUserRemainingTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { isSubmitterAccountInitialized, getProcessorAccount } from '/src/assets/contracts/Solana/M4AProtocol.vue'
  import { getChatAccount } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { submitterHashMap } from '/src/assets/globalStates/m4a/SubmittersAndPatients.vue'
  import { processorHashMap } from '/src/assets/globalStates/m4a/Processors.vue'
  import { chatAccountHashMap } from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { commentSections } from '/src/assets/globalStates/chat/CommentSections.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { anchorPrograms, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { sleep, MAX_RETRY_FETCH, RETRY_TIME_OUT, RETRY_MESSAGE, ERROR_429 } from '/src/assets/helperFunctions/sleep.ts'
  import * as anchor from "@coral-xyz/anchor"

  const props = defineProps(['featured', 'container', 'logo', 'dark', 'colorName', 'connectButton', 'colorHexValue'])
  
  const { publicKey, wallet, disconnect } = useWallet()
  const { featured, container, logo, dark } = toRefs(props)

  const dropdownPanel = ref<HTMLElement>()
  const dropdownOpened = ref(false)

  const popoverOpen = ref()
  const event = ref()

  var lendingUserLookUpTableWatcherId: any
  var lendingUserTempPriceAccountWatcherId: any

  onMounted(async() =>
  {
    if(publicKey.value == null || publicKey.value.toBase58() == SYSTEM_PROGRAM_ADDRESS_STRING)
    {
      connectedWallet.isChatAccountReady = false
      connectedWallet.hasHadCustomName = false
      connectedWallet.hasGoodEnding = false
      connectedWallet.isSubmitterAccountReady = false
      connectedWallet.isProcessorAccountReady = false
      connectedWallet.isProcessorAccountActive = false
      connectedWallet.isProcessorAccountSuperAdmin = false
      connectedWallet.submitterAddressOfClaimBeingProcessed = SYSTEM_PROGRAM_ADDRESS_STRING
      connectedWallet.addressString = SYSTEM_PROGRAM_ADDRESS_STRING
      connectedWallet.isConnected = false
      connectedWallet.selectedLendingUserAccountIndex = 0
      connectedWallet.lendingUserLookUpTableAddress = undefined
      connectedWallet.lendingUserLookUpTableAccount = undefined
      connectedWallet.missingLUTAddresses = []
      connectedWallet.missingLUTAddressDescriptions = []
      connectedWallet.isTempPriceAccountAlive = false
    }
    else
    { 
      connectedWallet.publicKey = publicKey.value
      connectedWallet.addressString = publicKey.value.toBase58()
      connectedWallet.selectedLendingUserAccountIndex = Number(localStorage.getItem("selectedLendingAccountIndex" + connectedWallet.addressString)) || 0
      connectedWallet.isConnected = true

      if(lendingUserHashMap.map)
      {
        const lendingUserAccount = lendingUserHashMap.map.get(connectedWallet.addressString + connectedWallet.selectedLendingUserAccountIndex.toString())
        if(lendingUserAccount)
        {
          connectedWallet.lendingUserLookUpTableAddress = lendingUserAccount.lookUpTableAddress
          connectedWallet.lendingUserLookUpTableAccount = await getAddressLookUpTableProgramAccountWrapper(connectedWallet.lendingUserLookUpTableAddress);
          [connectedWallet.missingLUTAddresses, connectedWallet.missingLUTAddressDescriptions] = determineMissingLUTAddresses(connectedWallet.lendingUserLookUpTableAccount,
            connectedWallet.publicKey,
            connectedWallet.selectedLendingUserAccountIndex)
          connectedWallet.hasGoodEnding = true
          await listenForLendingUserLookUpTableChanges()
        }
        else
        {
          connectedWallet.lendingUserLookUpTableAddress = undefined
          connectedWallet.lendingUserLookUpTableAccount = undefined
          connectedWallet.missingLUTAddresses = []
          connectedWallet.missingLUTAddressDescriptions = []
        }
      }
      else
      {
        connectedWallet.lendingUserLookUpTableAddress = undefined
        connectedWallet.lendingUserLookUpTableAccount = undefined
        connectedWallet.missingLUTAddresses = []
        connectedWallet.missingLUTAddressDescriptions = []
      }

      connectedWallet.isTempPriceAccountAlive = await isTempPriceAccountAlive(connectedWallet.publicKey)
      await listenForLendingUserTempPriceAccountChanges()

      const chatAccount = getChatAccount(connectedWallet.addressString)
      if(chatAccount)
      {
        connectedWallet.isChatAccountReady = true
        connectedWallet.hasHadCustomName = chatAccount.hasHadCustomName
        connectedWallet.hasGoodEnding = chatAccount.commentAndReplyCount.gt(new anchor.BN(0)) ||
          chatAccount.postVoteCastedCount.gt(new anchor.BN(0)) ||
          chatAccount.pollVoteCount.gt(new anchor.BN(0)) ||
          chatAccount.hasGoodEnding ||
          connectedWallet.lendingUserLookUpTableAccount ||
          //These can be initialized before the user has a chat account (plus M4AProtocol is a different program), so need extra checks
          (anchorPrograms.m4aProtocolInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.chatProtocolInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.m4aChatInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.pliChatInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.aboutChatInitiatorAddress == connectedWallet.addressString) 
      }
      else
      {
        connectedWallet.isChatAccountReady = false
        connectedWallet.hasHadCustomName = false
        connectedWallet.hasGoodEnding = 
          connectedWallet.lendingUserLookUpTableAccount ||
          //These can be initialized before the user has a chat account (plus M4AProtocol is a different program), so need extra checks
          (anchorPrograms.m4aProtocolInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.chatProtocolInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.m4aChatInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.pliChatInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.aboutChatInitiatorAddress == connectedWallet.addressString) 
      }
      
      connectedWallet.isSubmitterAccountReady = isSubmitterAccountInitialized(publicKey.value.toBase58())

      const processorAccount = getProcessorAccount(publicKey.value)
      if(processorAccount)
      {
        connectedWallet.isProcessorAccountReady = true
        connectedWallet.isProcessorAccountActive = processorAccount.isActive
        connectedWallet.isProcessorAccountSuperAdmin = processorAccount.isSuperAdmin
        connectedWallet.isProcessorWorkingAClaim = processorAccount.isProcessingClaim
        connectedWallet.submitterAddressOfClaimBeingProcessed = processorAccount.submitterAddressOfClaimBeingProcessed.toBase58()
      }
      else
      {
        connectedWallet.isProcessorAccountReady = false
        connectedWallet.isProcessorAccountActive = false
        connectedWallet.isProcessorAccountSuperAdmin = false
        connectedWallet.isProcessorWorkingAClaim = false
        connectedWallet.submitterAddressOfClaimBeingProcessed = SYSTEM_PROGRAM_ADDRESS_STRING
      }
    }

    connectedWallet.lendingUserLUTAccountReady = true
  })

  onUnmounted(() =>
  {
    if(lendingUserLookUpTableWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(lendingUserLookUpTableWatcherId)
      lendingUserLookUpTableWatcherId = undefined
    }
    if(lendingUserTempPriceAccountWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(lendingUserTempPriceAccountWatcherId)
      lendingUserTempPriceAccountWatcherId = undefined
    }
  })

  watch(publicKey, async() =>
  {
    //Price accounts are by Wallet public keys, not by account indexes
    if(lendingUserTempPriceAccountWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(lendingUserTempPriceAccountWatcherId)
      lendingUserTempPriceAccountWatcherId = undefined
    }

    if(publicKey.value == null || publicKey.value.toBase58() == SYSTEM_PROGRAM_ADDRESS_STRING)
    {
      connectedWallet.isChatAccountReady = false
      connectedWallet.hasHadCustomName = false
      connectedWallet.hasGoodEnding = false
      connectedWallet.isSubmitterAccountReady = false
      connectedWallet.isProcessorAccountReady = false
      connectedWallet.isProcessorAccountActive = false
      connectedWallet.isProcessorAccountSuperAdmin = false
      connectedWallet.submitterAddressOfClaimBeingProcessed = SYSTEM_PROGRAM_ADDRESS_STRING
      connectedWallet.addressString = SYSTEM_PROGRAM_ADDRESS_STRING
      connectedWallet.isConnected = false,
      connectedWallet.selectedLendingUserAccountIndex = 0
      connectedWallet.lendingUserLookUpTableAddress = undefined
      connectedWallet.lendingUserLookUpTableAccount = undefined
      connectedWallet.missingLUTAddresses = []
      connectedWallet.missingLUTAddressDescriptions = []
      connectedWallet.isTempPriceAccountAlive = false
    }
    else
    {
      connectedWallet.publicKey = publicKey.value
      connectedWallet.addressString = publicKey.value.toBase58()
      connectedWallet.selectedLendingUserAccountIndex = Number(localStorage.getItem("selectedLendingAccountIndex" + connectedWallet.addressString)) || 0
      connectedWallet.isConnected = true

      connectedWallet.isTempPriceAccountAlive = await isTempPriceAccountAlive(connectedWallet.publicKey)
      await listenForLendingUserTempPriceAccountChanges()

      const chatAccount = getChatAccount(connectedWallet.addressString)
      if(chatAccount)
      {
        connectedWallet.isChatAccountReady = true
        connectedWallet.hasHadCustomName = chatAccount.hasHadCustomName
        connectedWallet.hasGoodEnding = chatAccount.commentAndReplyCount.gt(new anchor.BN(0)) ||
          chatAccount.postVoteCastedCount.gt(new anchor.BN(0)) ||
          chatAccount.pollVoteCount.gt(new anchor.BN(0)) ||
          chatAccount.hasGoodEnding ||
          connectedWallet.lendingUserLookUpTableAccount ||
          //These can be initialized before the user has a chat account (plus M4AProtocol is a different program), so need extra checks
          (anchorPrograms.m4aProtocolInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.chatProtocolInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.m4aChatInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.pliChatInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.aboutChatInitiatorAddress == connectedWallet.addressString) 
      }
      else
      {
        connectedWallet.isChatAccountReady = false
        connectedWallet.hasHadCustomName = false
        connectedWallet.hasGoodEnding =
          connectedWallet.lendingUserLookUpTableAccount ||
          //These can be initialized before the user has a chat account (plus M4AProtocol is a different program), so need extra checks
          (anchorPrograms.m4aProtocolInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.chatProtocolInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.m4aChatInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.pliChatInitiatorAddress == connectedWallet.addressString) ||
          (anchorPrograms.aboutChatInitiatorAddress == connectedWallet.addressString) 
      }

      connectedWallet.isSubmitterAccountReady = isSubmitterAccountInitialized(publicKey.value.toBase58())

      const processorAccount = getProcessorAccount(publicKey.value)
      if(processorAccount)
      {
        connectedWallet.isProcessorAccountReady = true
        connectedWallet.isProcessorAccountActive = processorAccount.isActive
        connectedWallet.isProcessorAccountSuperAdmin = processorAccount.isSuperAdmin
        connectedWallet.isProcessorWorkingAClaim = processorAccount.isProcessingClaim
        connectedWallet.submitterAddressOfClaimBeingProcessed = processorAccount.submitterAddressOfClaimBeingProcessed.toBase58()
      }
      else
      {
        connectedWallet.isProcessorAccountReady = false
        connectedWallet.isProcessorAccountActive = false
        connectedWallet.isProcessorAccountSuperAdmin = false
        connectedWallet.isProcessorWorkingAClaim = false
        connectedWallet.submitterAddressOfClaimBeingProcessed = SYSTEM_PROGRAM_ADDRESS_STRING
      }
    }

    connectedWallet.lendingUserLUTAccountReady = true
  })

  watch(submitterHashMap, () =>
  {
    if(publicKey.value == null || publicKey.value.toBase58() == SYSTEM_PROGRAM_ADDRESS_STRING)
      connectedWallet.isSubmitterAccountReady = false
    else
      connectedWallet.isSubmitterAccountReady = isSubmitterAccountInitialized(publicKey.value.toBase58())
  })

  watch(processorHashMap, () =>
  {
    if(publicKey.value == null || publicKey.value.toBase58() == SYSTEM_PROGRAM_ADDRESS_STRING)
    {
      connectedWallet.isProcessorAccountReady = false
      connectedWallet.isProcessorAccountActive = false
      connectedWallet.isProcessorAccountSuperAdmin = false
      connectedWallet.isProcessorWorkingAClaim = false
      connectedWallet.submitterAddressOfClaimBeingProcessed = SYSTEM_PROGRAM_ADDRESS_STRING
    }
    else
    {
      const processorAccount = getProcessorAccount(publicKey.value)

      if(processorAccount)
      {
        connectedWallet.isProcessorAccountReady = true
        connectedWallet.isProcessorAccountActive = processorAccount.isActive
        connectedWallet.isProcessorAccountSuperAdmin = processorAccount.isSuperAdmin
        connectedWallet.isProcessorWorkingAClaim = processorAccount.isProcessingClaim
        connectedWallet.submitterAddressOfClaimBeingProcessed = processorAccount.submitterAddressOfClaimBeingProcessed
      }
      else
      {
        connectedWallet.isProcessorAccountReady = false
        connectedWallet.isProcessorAccountActive = false
        connectedWallet.isProcessorAccountSuperAdmin = false
        connectedWallet.isProcessorWorkingAClaim = false
        connectedWallet.submitterAddressOfClaimBeingProcessed = SYSTEM_PROGRAM_ADDRESS_STRING
      }
    }
  })
  
  watch(chatAccountHashMap, () =>
  {
    const chatAccount = getChatAccount(connectedWallet.addressString)
    if(chatAccount)
    {
      connectedWallet.isChatAccountReady = true
      connectedWallet.hasHadCustomName = chatAccount.hasHadCustomName
      connectedWallet.hasGoodEnding = chatAccount.commentAndReplyCount.gt(new anchor.BN(0)) ||
        chatAccount.postVoteCastedCount.gt(new anchor.BN(0)) ||
        chatAccount.pollVoteCount.gt(new anchor.BN(0)) ||
        chatAccount.hasGoodEnding ||
        connectedWallet.lendingUserLookUpTableAccount ||
        //These can be initialized before the user has a chat account (plus M4AProtocol is a different program), so need extra checks
        (anchorPrograms.m4aProtocolInitiatorAddress == connectedWallet.addressString) ||
        (anchorPrograms.chatProtocolInitiatorAddress == connectedWallet.addressString) ||
        (anchorPrograms.m4aChatInitiatorAddress == connectedWallet.addressString) ||
        (anchorPrograms.pliChatInitiatorAddress == connectedWallet.addressString) ||
        (anchorPrograms.aboutChatInitiatorAddress == connectedWallet.addressString) 
    }
    else
    {
      connectedWallet.isChatAccountReady = false
      connectedWallet.hasHadCustomName = false
      connectedWallet.hasGoodEnding =
        connectedWallet.lendingUserLookUpTableAccount ||
        //These can be initialized before the user has a chat account (plus M4AProtocol is a different program), so need extra checks
        (anchorPrograms.m4aProtocolInitiatorAddress == connectedWallet.addressString) ||
        (anchorPrograms.chatProtocolInitiatorAddress == connectedWallet.addressString) ||
        (anchorPrograms.m4aChatInitiatorAddress == connectedWallet.addressString) ||
        (anchorPrograms.pliChatInitiatorAddress == connectedWallet.addressString) ||
        (anchorPrograms.aboutChatInitiatorAddress == connectedWallet.addressString) 
    }
  })

  watch(anchorPrograms, () =>
  {
    //M4A Protocol
    if(anchorPrograms.isM4AProtocolReady)
    {
      if(anchorPrograms.m4aProtocolInitiatorAddress == connectedWallet.addressString)
        connectedWallet.hasGoodEnding = true 
    }

    //Chat Protocol
    if(anchorPrograms.isChatProtocolReady)
    {
      if(anchorPrograms.chatProtocolInitiatorAddress == connectedWallet.addressString)
        connectedWallet.hasGoodEnding = true 
    }

    //M4A Chat
    if(anchorPrograms.isM4AChatReady)
    {
      if(anchorPrograms.m4aChatInitiatorAddress == connectedWallet.addressString)
        connectedWallet.hasGoodEnding = true 
    }

    //PLI Chat
    if(anchorPrograms.isPLIChatReady)
    {
      if(anchorPrograms.pliChatInitiatorAddress == connectedWallet.addressString)
        connectedWallet.hasGoodEnding = true 
    }

    //About Chat
    if(anchorPrograms.isAboutChatReady)
    {
      if(anchorPrograms.aboutChatInitiatorAddress == connectedWallet.addressString)
        connectedWallet.hasGoodEnding = true 
    }
  })

  watch(commentSections, () =>
  {
    const chatAccount = getChatAccount(connectedWallet.addressString)
    if(chatAccount)
    {
      if(!connectedWallet.hasGoodEnding)
      {
        for(var i=0; i<commentSections.data.length; i++)
          if(commentSections.data[i].commentSectionInitiatorAddress.toBase58() == connectedWallet.addressString)
            connectedWallet.hasGoodEnding = true
      }
    }
  })

  watch([lendingUserHashMap, lendingUserRemainingTabAccountListHashMap], async() =>
  {
    if(connectedWallet.lendingUserLookUpTableAddress == undefined || connectedWallet.lendingUserLookUpTableAccount == undefined)
    {
      const lendingUserAccount = lendingUserHashMap.map.get(connectedWallet.addressString + connectedWallet.selectedLendingUserAccountIndex.toString())
      if(lendingUserAccount)
      {
        connectedWallet.lendingUserLookUpTableAddress = lendingUserAccount.lookUpTableAddress
        connectedWallet.lendingUserLookUpTableAccount = await getAddressLookUpTableProgramAccountWrapper(connectedWallet.lendingUserLookUpTableAddress);
        [connectedWallet.missingLUTAddresses, connectedWallet.missingLUTAddressDescriptions] = determineMissingLUTAddresses(connectedWallet.lendingUserLookUpTableAccount,
          connectedWallet.publicKey,
          connectedWallet.selectedLendingUserAccountIndex)
        connectedWallet.hasGoodEnding = true
        if(lendingUserLookUpTableWatcherId == undefined)
          await listenForLendingUserLookUpTableChanges()
      }
      else
      {
        connectedWallet.lendingUserLookUpTableAddress = undefined
        connectedWallet.lendingUserLookUpTableAccount = undefined
        connectedWallet.missingLUTAddresses = []
        connectedWallet.missingLUTAddressDescriptions = []
      }
    }
    else
      [connectedWallet.missingLUTAddresses, connectedWallet.missingLUTAddressDescriptions] = determineMissingLUTAddresses(connectedWallet.lendingUserLookUpTableAccount,
        connectedWallet.publicKey,
        connectedWallet.selectedLendingUserAccountIndex)
  })

  //Json string of wallet to detect object property changes
  const walletWatch = computed(() =>
  {
    return JSON.stringify(
    {
      addressString: connectedWallet.addressString,
      selectedLendingUserAccountIndex: connectedWallet.selectedLendingUserAccountIndex
    })
  })

  watch(walletWatch, async (newJSONObjectString, oldJSONObjectString) =>
  {
    let newWallet = JSON.parse(newJSONObjectString)
    let oldWallet = JSON.parse(oldJSONObjectString)

    //Only want this running if the connected Wallet Address String is changing
    if(newWallet.addressString == oldWallet.addressString && newWallet.selectedLendingUserAccountIndex == oldWallet.selectedLendingUserAccountIndex)
      return

    connectedWallet.lendingUserLUTAccountReady = false
    if(lendingUserLookUpTableWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(lendingUserLookUpTableWatcherId)
      lendingUserLookUpTableWatcherId = undefined
    }

    if(!lendingUserHashMap.map)
      return

    const lendingUserAccount = lendingUserHashMap.map.get(connectedWallet.addressString + connectedWallet.selectedLendingUserAccountIndex.toString())
    if(lendingUserAccount)
    {
      connectedWallet.lendingUserLookUpTableAddress = lendingUserAccount.lookUpTableAddress
      connectedWallet.lendingUserLookUpTableAccount = await getAddressLookUpTableProgramAccountWrapper(connectedWallet.lendingUserLookUpTableAddress);
      [connectedWallet.missingLUTAddresses, connectedWallet.missingLUTAddressDescriptions] = determineMissingLUTAddresses(connectedWallet.lendingUserLookUpTableAccount,
        connectedWallet.publicKey,
        connectedWallet.selectedLendingUserAccountIndex)
      connectedWallet.hasGoodEnding = true
      await listenForLendingUserLookUpTableChanges()
    }
    else
    {
      connectedWallet.lendingUserLookUpTableAddress = undefined
      connectedWallet.lendingUserLookUpTableAccount = undefined
      connectedWallet.missingLUTAddresses = []
      connectedWallet.missingLUTAddressDescriptions = []
    }

    connectedWallet.lendingUserLUTAccountReady = true
  })

  async function listenForLendingUserLookUpTableChanges()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        lendingUserLookUpTableWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(connectedWallet.lendingUserLookUpTableAddress, (accountInfo: AccountInfo<Buffer>) => 
        {
          //Handle account change..
          const lookupTableState = anchor.web3.AddressLookupTableAccount.deserialize(accountInfo.data);
          const lookupTableAccountInstance = new anchor.web3.AddressLookupTableAccount({
            key: connectedWallet.lendingUserLookUpTableAddress,
            state: lookupTableState
          })

          connectedWallet.lendingUserLookUpTableAccount = lookupTableAccountInstance;
          [connectedWallet.missingLUTAddresses, connectedWallet.missingLUTAddressDescriptions] = determineMissingLUTAddresses(connectedWallet.lendingUserLookUpTableAccount,
            connectedWallet.publicKey,
            connectedWallet.selectedLendingUserAccountIndex)
        })

        break
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
          console.error(error)
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  async function listenForLendingUserTempPriceAccountChanges()
  {
    //Remove previous listener before starting another one if it exists
    if(lendingUserTempPriceAccountWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(lendingUserTempPriceAccountWatcherId)
      lendingUserTempPriceAccountWatcherId = undefined
    }

    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        lendingUserTempPriceAccountWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(getPriceAccountPDA(connectedWallet.publicKey),
        (accountInfo: AccountInfo<Buffer>) => 
        {
          //Handle account change..
          if(accountInfo.lamports == 0)
            connectedWallet.isTempPriceAccountAlive = false
          else
            connectedWallet.isTempPriceAccountAlive = true
        })

        break
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
          console.error(error)
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  function openPopOver(e: Event) 
  {
    event.value = e
    popoverOpen.value = true
  }

  function closePopOver(e: Event) 
  {
    event.value = e
    popoverOpen.value = false
  }

  const openDropdown = () => 
  {
    dropdownOpened.value = true
  }

  const closeDropdown = () => 
  {
    dropdownOpened.value = false
  }

  onClickOutside(dropdownPanel, closeDropdown)

  const publicKeyBase58 = computed(() => publicKey.value?.toBase58())
  const publicKeyTrimmed = computed(() => 
  {
    if(!wallet.value || !publicKeyBase58.value) return null
    return(
      publicKeyBase58.value.slice(0, 4) +
      "..." +
      publicKeyBase58.value.slice(-4)
    )
  })

  function handleDisconnect()
  {
    connectedWallet.publicKey = new PublicKey(SYSTEM_PROGRAM_ADDRESS_STRING)
    connectedWallet.addressString = SYSTEM_PROGRAM_ADDRESS_STRING
    connectedWallet.isConnected = false
    disconnect()
  }
  
  const 
  {
    copy,
    copied: addressCopied,
    isSupported: canCopy,
  } = useClipboard()
  const copyAddress = () =>
    publicKeyBase58.value && copy(publicKeyBase58.value)

  // Define the bindings given to scoped slots.
  const scope = {
    featured,
    container,
    logo,
    dark,
    wallet,
    publicKey,
    publicKeyTrimmed,
    publicKeyBase58,
    canCopy,
    addressCopied,
    dropdownPanel,
    dropdownOpened,
    openDropdown,
    closeDropdown,
    copyAddress,
    disconnect,
  }
</script>

<style scoped>
  /*Styling for Library button */
  ion-text
  {
    font-size: 17px
  }
  
  .swv-button-trigger 
  {
    background-color: v-bind(colorHexValue) !important;
    color: var(--ion-color-dark) !important;
    width: 230px !important
  }

  .swv-button-trigger:hover
  {
    background: v-bind(colorHexValue) !important;
    background-color: v-bind(colorHexValue) !important;
    text-decoration: underline;
    text-decoration-color: var(--ion-color-light);
    text-decoration-thickness: 2px
  }

  .connectButton:hover
  {
    text-decoration: underline;
    text-decoration-color: var(--ion-color-light);
    text-decoration-thickness: 2px;
    opacity: 1
  }
</style>