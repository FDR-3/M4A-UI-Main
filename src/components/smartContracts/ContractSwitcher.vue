<template>
  <h4 class="underLine noWrapText" style="font-size: 25px">Contract Switcher</h4>
  <h5 class="nMediumMarginTop">M4A Protocol</h5>
  <ion-button @click="openM4AContractSelectPopover($event)" slot="start" class="contractPickerButton" :color="colorName">
      <div class="contractPickerTextContainer noClickEvent flexCenterColumn">
        <ion-label color="dark">{{ m4aContractText }}</ion-label>
        <div>
          <ion-icon :src=chevronDown color="black"></ion-icon>
        </div>
      </div>
    </ion-button>
    <ion-popover :is-open="m4aContractSelectPopoverOpen" :event="event" @didDismiss="m4aContractSelectPopoverOpen = false" side="bottom" size="cover">
      <div v-for="(contactVersion, index) in m4aContracts">
        <ion-button class="popOverButton" :color="colorName" @click="setSelectedM4AContract(index)" >
          <ion-label color="dark">{{ contactVersion }}</ion-label>
        </ion-button>
      </div>
    </ion-popover>
  <h5>Chat Protocol</h5>
  <ion-button @click="openChatContractSelectPopover($event)" slot="start" class="contractPickerButton" :color="colorName">
    <div class="contractPickerTextContainer noClickEvent flexCenterColumn">
      <ion-label color="dark">{{ chatContractText }}</ion-label>
      <div>
        <ion-icon :src=chevronDown color="black"></ion-icon>
      </div>
    </div>
  </ion-button>
  <ion-popover :is-open="chatContractSelectPopoverOpen" :event="event" @didDismiss="chatContractSelectPopoverOpen = false" side="bottom" size="cover">
    <div v-for="(contactVersion, index) in chatContracts">
      <ion-button class="popOverButton" :color="colorName" @click="setSelectedChatContract(index)" >
        <ion-label color="dark">{{ contactVersion }}</ion-label>
      </ion-button>
    </div>
  </ion-popover>
  <M4AChatUpdater/>
  <PLIChatUpdater/>
  <AboutChatUpdater/>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { IonButton, IonPopover, IonLabel, IonIcon } from '@ionic/vue'
  import { chevronDown } from 'ionicons/icons'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { claimQueue, claims, processedClaims } from '/src/assets/globalStates/m4a/Claims.vue'
  import { hospitalStats, hospitals } from '/src/assets/globalStates/m4a/Hospitals.vue'
  import { insuranceCompanyStats, insuranceCompanies } from '/src/assets/globalStates/m4a/InsuranceCompanies.vue'
  import { processorStats, processors } from '/src/assets/globalStates/m4a/Processors.vue'
  import { m4aChat, pliChat, aboutChat } from '/src/assets/globalStates/chat/Chats.vue'
  import { ideas, feds } from '/src/assets/globalStates/chat/QOL.vue'
  import M4AChatUpdater from './M4AChatUpdater.vue'
  import PLIChatUpdater from './PLIChatUpdater.vue'
  import AboutChatUpdater from './AboutChatUpdater.vue'
  import { commentSections } from '/src/assets/globalStates/chat/CommentSections.vue'
  import { postVoteRecords } from '/src/assets/globalStates/chat/PostVoteRecords.vue'
  import { polls, pollVoteRecords } from '/src/assets/globalStates/chat/Polls.vue'
  import { getM4AProtocol,
    getM4AFeeTokenAccounts,
    areM4AProtocolStatsInitialized,
    getClaimQueue,
    getQueueClaims,
    getProcessedClaims,
    getHospitalStats,
    getAllHospitals,
    getInsuranceCompanyStats,
    getAllInsuranceCompanies,
    getProcessorStats,
    getProcessors,
    getM4AProtocolPDA,
    getM4ATokenFeePDA,
    getClaimQueuePDA,
    getHospitalStatsPDA,
    getInsuranceCompanyStatsPDA,
    getProcessorStatsPDA,
    getM4AProtocolCEOAccount,
    getM4AProtocolTreasurerAccount,
    getM4AProtocolCEOAccountPDA,
    getM4AProtocolTreasurerAccountPDA } from '/src/assets/contracts/Solana/M4AProtocol.vue'
  import { getChatProtocol,
    getChatFeeTokenAccounts,
    getDeadMansBreak,
    getM4AChat,
    getPLIChat,
    getAboutChat,
    setChatAccountHashMap,
    setChatAccountAndUserNameHashMap,
    getCommentSections,
    getChatProtocolCEOAccount,
    getChatProtocolTreasurerAccount,
    getPostVoteRecords,
    getAllPolls,
    getPollVoteRecords,
    getFEDRecords,
    getIdeas,
    getChatProtocolCEOAccountPDA,
    getChatProtocolTreasurerAccountPDA,
    getChatProtocolPDA,
    getChatTokenFeePDA,
    getM4AChatPDA,
    getPLIChatPDA,
    getAboutChatPDA,
    getChatAccountStatsPDA,
    getCommentSectionStatsPDA,
    getIdeaStatsPDA,
    getFEDStatsPDA,
    getPostVoteStatsPDA,
    getPollStatsPDA,
    getPollVoteStatsPDA,
    getDeadMansBreakPDA } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

  defineProps(['colorName', 'colorHexValue', 'buttonShadow'])

  var m4aContractSelectPopoverOpen = ref()
  var chatContractSelectPopoverOpen = ref()
  var event = ref()

  var m4aContractText = ref("")
  var chatContractText = ref("") 

  const m4aContracts = ["Version 1 (SC BETA)"/*, "Version 2"*/]
  const chatContracts = ["Version 1 (BETA)"/*, "Version 2"*/]

  var selectedM4AContractIndex: number
  var selectedChatContractIndex: number

  var protocolTreasurerATAWatcherId: any
  var protocolSinglePayerATAWatcherId: any
  var claimQueueWatchId: any
  var hospitalStatsWatchId: any
  var insuranceCompanyStatsWatchId: any
  var processorStatsWatchId: any
  var isM4AProtocolReadyWatchId: any
  var isChatProtocolReadyWatchId: any
  var m4aChatWatchId: any
  var pliChatWatchId: any
  var aboutChatWatchId: any
  var chatAccountStatsWatchId: any
  var commentSectionStatsWatchId: any
  var m4aProtocolCEOAccountWatcherId: any
  var m4aProtocolTreasurerAccountWatcherId: any
  var chatProtocolCEOAccountWatcherId: any
  var chatProtocolTreasurerAccountWatcherId: any
  var areM4AProtocolStatsReadyWatchId: any
  var isM4AFeeTokenAccountReadyWatchId: any
  var isChatFeeTokenAccountReadyWatchId: any
  var areChatQualityOfLifeAccountsReadyWatchId: any
  var ideaStatsWatcherId: any
  var fedStatsWatcherId: any
  var postVoteStatsWatcherId: any
  var pollStatsWatcherId: any
  var pollVoteStatsWatcherId: any

  var currentStateAccountTotal = 0
  var currentClaimQueueCount = 0

  /*Might refine the processorStats listner later
  var setOrUnsetProcessorOnClaimCount = 0
  var createdPatientRecordCount = 0
  var createdHospitalAndInsuranceCompanyRecordsCount = 0 */
  
  onMounted(async() =>
  {
    selectedM4AContractIndex = parseInt(localStorage.getItem("ContractSelectM4A") || "0")
    localStorage.setItem("ContractSelectM4A", selectedM4AContractIndex.toString())//Set value in local storage incase it isn't already

    selectedChatContractIndex = parseInt(localStorage.getItem("ContractSelectChat") || "0")
    localStorage.setItem("ContractSelectChat", selectedChatContractIndex.toString())//Set value in local storage incase it isn't already

    m4aContractText.value = m4aContracts[selectedM4AContractIndex]
    chatContractText.value = chatContracts[selectedChatContractIndex]

    //console.log(await anchorPrograms.chat.chatProgram.account.videoVoteRecord.all())

    //Treasury Account
    try
    {
      const treasurerUDSCAccount = await anchorPrograms.chat.chatProgram.provider.connection.getTokenAccountBalance(adminAccounts.treasurerUSDCATA)
      adminAccounts.treasuryBalance = treasurerUDSCAccount.value.uiAmount.toFixed(2)
      await listenForTreasurerATAChanges()
    }
    catch(error)
    {
      console.log(error)
    }

    //Single Payer Account
    try
    {
      const singlePayerUSDCAccount = await anchorPrograms.chat.chatProgram.provider.connection.getTokenAccountBalance(adminAccounts.singlePayerUSDCATA)
      adminAccounts.singlePayerBalance = singlePayerUSDCAccount.value.uiAmount.toFixed(2)
      await listenForSinglePayerAccountChanges()
    }
    catch(error)
    {
      console.log(error)
    }

    /*//M4AFeeTokenAccount
    const m4aFeeTokenAccounts = await getM4AFeeTokenAccounts()
    if(m4aFeeTokenAccounts.length > 0)
      anchorPrograms.isM4AFeeTokenAccountReady = true
    else
      listenForM4AFeeTokenAccount()*/

    //ChatFeeTokenAccount
    const chatFeeTokenAccounts = await getChatFeeTokenAccounts()
    if(chatFeeTokenAccounts.length > 0)
      anchorPrograms.isChatFeeTokenAccountReady = true
    else
      listenForChatFeeTokenAccount()

    /*
    //M4A Protocol Account
    const m4aProtocol = await getM4AProtocol()
    await listenForM4AProtocolChanges()
    if(m4aProtocol)
    {
      anchorPrograms.m4aProtocolInitiatorAddress = m4aProtocol.m4AProtocolInitiatorAddress.toBase58()  //note the .m4A weird anchor capitialization
      anchorPrograms.stateAccountTotal = m4aProtocol.stateAccountTotal
      anchorPrograms.isM4AProtocolReady = true
    }
    else
      anchorPrograms.isM4AProtocolReady = false

    //M4A Protocol Stats Account
    if(await areM4AProtocolStatsInitialized())
      anchorPrograms.areM4AProtocolStatsReady = true
    else
      anchorPrograms.areM4AProtocolStatsReady = false

    //M4A Hospitals
    hospitalStats.data = await getHospitalStats()
    hospitals.data = await getAllHospitals() 
    await listenForHospitalStatChanges()

    //M4A Insurance Company Stats
    insuranceCompanyStats.data = await getInsuranceCompanyStats()
    insuranceCompanies.data = await getAllInsuranceCompanies()
    await listenForInsuranceCompanyStatChanges()

    //Used so all processors can listen to when a new state is initialized
    currentStateAccountTotal = anchorPrograms.stateAccountTotal

    //Claims and Processed Claims have hospital and insurance companies on them, so best to fetch them first above, just making a note of it
    //M4A Claim Queue
    claimQueue.data = await getClaimQueue()
    if(claimQueue.data)
      currentClaimQueueCount = claimQueue.data.currentClaimQueueCount
    claims.data = await getQueueClaims(),
    processedClaims.data = await getProcessedClaims(),
    await listenForClaimQueueChanges()

    //M4A Processor Stats
    processorStats.data = await getProcessorStats()
    processors.data = await getProcessors()
    await listenForProcessorStatChanges() */

    //Chat Protocol Account
    const chatProtocol = await getChatProtocol()
    await listenForChatProtocolChanges()
    if(chatProtocol)
    {
      anchorPrograms.chatProtocolInitiatorAddress = chatProtocol.chatProtocolInitiatorAddress.toBase58()
      anchorPrograms.isChatProtocolReady = true
    }
    else
    {
      anchorPrograms.isChatProtocolReady = false
    }

    //Chat Protocol Quality Of Life Accounts
    const deadMansBreak = await getDeadMansBreak()
    await listenForChatQualityOfLifeAccountsChanges()
    if(deadMansBreak)
    {
      anchorPrograms.areChatQOLAccountsReady = true
      anchorPrograms.deadMansBreakTimeStamp = deadMansBreak.unixClockInTimeStamp
      anchorPrograms.isDeadMansBreakTripped = isDeadMansBreakTripped()
    }
    else
    {
      anchorPrograms.areChatQOLAccountsReady = false
    }

    //M4A Chat
    m4aChat.data = await getM4AChat()
    await listenForM4AChatChanges()
    if(m4aChat.data)
    {
      anchorPrograms.m4aChatInitiatorAddress = m4aChat.data.chatInitiatorAddress.toBase58()
      anchorPrograms.isM4AChatReady = true
    }
    else
    {
      anchorPrograms.isM4AChatReady = false
    }

    //PLI Chat
    pliChat.data = await getPLIChat()
    await listenForPLIChatChanges()
    if(pliChat.data)
    {
      anchorPrograms.pliChatInitiatorAddress = pliChat.data.chatInitiatorAddress.toBase58()
      anchorPrograms.isPLIChatReady = true
    }
    else
    {
      anchorPrograms.isPLIChatReady = false
    }

    //About Chat
    aboutChat.data = await getAboutChat()
    await listenForAboutChatChanges()
    if(aboutChat.data)
    {
      anchorPrograms.aboutChatInitiatorAddress = aboutChat.data.chatInitiatorAddress.toBase58()
      anchorPrograms.isAboutChatReady = true
    }
    else
    {
      anchorPrograms.isAboutChatReady = false
    }

    //Chat Accounts
    await setChatAccountAndUserNameHashMap()
    await listenForChatAccountStatChanges()

    //Comment Sections
    commentSections.data = await getCommentSections()
    await listenForCommentSectionStatChanges()
/*
    //M4A Protocol CEO Account
    const m4aCEOAccount = await getM4AProtocolCEOAccount()
    if(m4aCEOAccount)
    {
      adminAccounts.isM4ACEOAccountReady = true
      adminAccounts.m4aCEOAddress = m4aCEOAccount.address.toBase58()
    }
    else
    {
      adminAccounts.isM4ACEOAccountReady = false
      await listenForM4ACEOAccountChanges()
    }

    //M4A Protocol Treasurer Account
    const m4aTreasurerAccount = await getM4AProtocolTreasurerAccount()
    if(m4aTreasurerAccount)
      adminAccounts.m4aTreasurerAddress = m4aTreasurerAccount.address.toBase58()
    else
      await listenForM4ATreasurerAccountChanges()*/

    //Chat Protocol CEO Account
    const chatCEOAccount = await getChatProtocolCEOAccount()
    if(chatCEOAccount)
    {
      adminAccounts.isChatCEOAccountReady = true
      adminAccounts.chatCEOAddress = chatCEOAccount.address.toBase58()
    }
    else
    {
      adminAccounts.isChatCEOAccountReady = false
      await listenForChatCEOAccountChanges()
    }

    //Chat Protocol Treasurer Account
    const chatTreasurerAccount = await getChatProtocolTreasurerAccount()
    if(chatTreasurerAccount)
      adminAccounts.chatTreasurerAddress = chatTreasurerAccount.address.toBase58()
    else
      await listenForChatTreasurerAccountChanges()

    //Ideas
    ideas.data = await getIdeas()
    await listenForIdeaStatChanges()

    //Feds
    feds.data = await getFEDRecords()
    await listenForFEDStatChanges()

    //Chat Post Vote Records
    postVoteRecords.data = await getPostVoteRecords()
    await listenForPostVoteStatChanges()

    //Chat Polls
    polls.data = await getAllPolls()
    await listenForPollStatChanges()

    //Chat Poll Vote Records
    pollVoteRecords.data = await getPollVoteRecords()
    await listenForPollVoteStatChanges()
  })

  onUnmounted(() => 
  {
    if(protocolTreasurerATAWatcherId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(protocolTreasurerATAWatcherId)
      protocolTreasurerATAWatcherId = undefined
    }
    if(protocolSinglePayerATAWatcherId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(protocolSinglePayerATAWatcherId)
      protocolSinglePayerATAWatcherId = undefined
    }
    if(isM4AProtocolReadyWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(isM4AProtocolReadyWatchId)
      isM4AProtocolReadyWatchId = undefined
    }
    if(areM4AProtocolStatsReadyWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(areM4AProtocolStatsReadyWatchId)
      areM4AProtocolStatsReadyWatchId = undefined
    }
    if(claimQueueWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(claimQueueWatchId)
      claimQueueWatchId = undefined
    }
    if(hospitalStatsWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(hospitalStatsWatchId)
      hospitalStatsWatchId = undefined
    }
    if(insuranceCompanyStatsWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(insuranceCompanyStatsWatchId)
      insuranceCompanyStatsWatchId = undefined
    }
    if(processorStatsWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(processorStatsWatchId)
      processorStatsWatchId = undefined
    }
    if(isChatProtocolReadyWatchId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(isChatProtocolReadyWatchId)
      isChatProtocolReadyWatchId = undefined
    }
    if(isM4AFeeTokenAccountReadyWatchId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(isM4AFeeTokenAccountReadyWatchId)
      isM4AFeeTokenAccountReadyWatchId = undefined
    } 
    if(isChatFeeTokenAccountReadyWatchId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(isChatFeeTokenAccountReadyWatchId)
      isChatFeeTokenAccountReadyWatchId = undefined
    } 
    if(areChatQualityOfLifeAccountsReadyWatchId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(areChatQualityOfLifeAccountsReadyWatchId)
      areChatQualityOfLifeAccountsReadyWatchId = undefined
    } 
    if(m4aChatWatchId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(m4aChatWatchId)
      m4aChatWatchId = undefined
    }
    if(pliChatWatchId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(pliChatWatchId)
      pliChatWatchId = undefined
    }
    if(aboutChatWatchId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(aboutChatWatchId)
      aboutChatWatchId = undefined
    }
    if(chatAccountStatsWatchId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(chatAccountStatsWatchId)
      chatAccountStatsWatchId = undefined
    }
    if(commentSectionStatsWatchId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(commentSectionStatsWatchId)
      commentSectionStatsWatchId = undefined
    }
    if(m4aProtocolCEOAccountWatcherId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(m4aProtocolCEOAccountWatcherId)
      m4aProtocolCEOAccountWatcherId = undefined
    } 
    if(m4aProtocolTreasurerAccountWatcherId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(m4aProtocolTreasurerAccountWatcherId)
      m4aProtocolTreasurerAccountWatcherId = undefined
    }
    if(chatProtocolCEOAccountWatcherId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(chatProtocolCEOAccountWatcherId)
      chatProtocolCEOAccountWatcherId = undefined
    }
    if(chatProtocolTreasurerAccountWatcherId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(chatProtocolTreasurerAccountWatcherId)
      chatProtocolTreasurerAccountWatcherId = undefined
    }
    if(ideaStatsWatcherId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(ideaStatsWatcherId)
      ideaStatsWatcherId = undefined
    }
    if(fedStatsWatcherId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(fedStatsWatcherId)
      fedStatsWatcherId = undefined
    }
    if(postVoteStatsWatcherId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(postVoteStatsWatcherId)
      postVoteStatsWatcherId = undefined
    }
    if(pollStatsWatcherId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(pollStatsWatcherId)
      pollStatsWatcherId = undefined
    }
    if(pollVoteStatsWatcherId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(pollVoteStatsWatcherId)
      pollVoteStatsWatcherId = undefined
    }
  })

  async function setSelectedM4AContract(index: number)
  {
    if(index == selectedM4AContractIndex)
    {
      m4aContractSelectPopoverOpen.value = false
      return
    }

    localStorage.setItem("ContractSelectM4A", index.toString())
    m4aContractSelectPopoverOpen.value = false
    m4aContractText.value = m4aContracts[index]
    window.location.reload()
  }

  async function setSelectedChatContract(index: number)
  {
    if(index == selectedChatContractIndex)
    {
      chatContractSelectPopoverOpen.value = false
      return
    }

    localStorage.setItem("ContractSelectChat", index.toString())
    chatContractSelectPopoverOpen.value = false
    chatContractText.value = chatContracts[index]
    window.location.reload()
  }

  function openM4AContractSelectPopover(e: Event) 
  {
    event.value = e
    m4aContractSelectPopoverOpen.value = true
  }

  function openChatContractSelectPopover(e: Event) 
  {
    event.value = e
    chatContractSelectPopoverOpen.value = true
  }

  function isDeadMansBreakTripped()
  {
    const currentUnixTimeStamp = new Date()/1000 //divide by 1000 since typescript/javascript time stamp is in mili seconds, but Solana time stamp is in seconds
    return currentUnixTimeStamp - anchorPrograms.deadMansBreakTimeStamp.toNumber() > anchorPrograms.deadMan45DaysUnixNum
  }

  async function listenForTreasurerATAChanges()
  {
    try
    {
      //Subscribe to account changes
      protocolTreasurerATAWatcherId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(adminAccounts.treasurerUSDCATA, async() => 
      {
        //Handle account change...
        const treasurerUDSCAccount = await anchorPrograms.m4a.m4aProgram.provider.connection.getTokenAccountBalance(adminAccounts.treasurerUSDCATA)
        adminAccounts.treasuryBalance = treasurerUDSCAccount.value.uiAmount.toFixed(2)
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForSinglePayerAccountChanges()
  {
    try
    {
      //Subscribe to account changes
      protocolSinglePayerATAWatcherId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(adminAccounts.singlePayerUSDCATA, async() => 
      {
        //Handle account change...
        const singlePayerUDSCAccount = await anchorPrograms.m4a.m4aProgram.provider.connection.getTokenAccountBalance(adminAccounts.singlePayerUSDCATA)
        adminAccounts.singlePayerBalance = singlePayerUDSCAccount.value.uiAmount.toFixed(2)
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForM4AFeeTokenAccount()
  {
    try
    {
      //Subscribe to account changes
      isM4AFeeTokenAccountReadyWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getM4ATokenFeePDA(anchorPrograms.usdcFeeTokenAddress), async() => 
      {
        //Handle account change...
        anchorPrograms.isM4AFeeTokenAccountReady = true
        anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(isM4AFeeTokenAccountReadyWatchId)
        isM4AFeeTokenAccountReadyWatchId = undefined
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForChatFeeTokenAccount()
  {
    try
    {
      //Subscribe to account changes
      isChatFeeTokenAccountReadyWatchId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getChatTokenFeePDA(anchorPrograms.usdcFeeTokenAddress), async() => 
      {
        //Handle account change...
        anchorPrograms.isChatFeeTokenAccountReady = true
        anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(isChatFeeTokenAccountReadyWatchId)
        isChatFeeTokenAccountReadyWatchId = undefined
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }
  
  async function listenForChatQualityOfLifeAccountsChanges()
  {
    try
    {
      const deadMansBreakPDA = getDeadMansBreakPDA()

      //Subscribe to account changes
      areChatQualityOfLifeAccountsReadyWatchId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(deadMansBreakPDA, async() => 
      {
        //Handle account change...
        anchorPrograms.areChatQOLAccountsReady = true

        const deadMansBreak = await getDeadMansBreak()
        anchorPrograms.deadMansBreakTimeStamp = deadMansBreak.unixClockInTimeStamp
        anchorPrograms.isDeadMansBreakTripped = isDeadMansBreakTripped()
      })
    }
    catch(error)
    {
      console.log(error)
      anchorPrograms.areChatQOLAccountsReady = false
    }
  }

  async function listenForM4AProtocolChanges()
  {
    try
    {
      //Subscribe to account changes
      isM4AProtocolReadyWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getM4AProtocolPDA(), async() => 
      {
        //Handle account change...
        const m4aProtocol = await getM4AProtocol()
        anchorPrograms.m4aProtocolInitiatorAddress = m4aProtocol.m4AProtocolInitiatorAddress.toBase58() //note the .m4A weird anchor capitialization
        anchorPrograms.isM4AProtocolReady = true

        anchorPrograms.stateAccountTotal = m4aProtocol.stateAccountTotal

        //Get claim que table data if there is a new state
        if(anchorPrograms.stateAccountTotal > currentStateAccountTotal)
        {
          claims.data = await getQueueClaims()
          currentStateAccountTotal = anchorPrograms.stateAccountTotal
        }
      })
    }
    catch(error)
    {
      console.log(error)
      anchorPrograms.isM4AProtocolReady = false
    }
  }

  async function listenForClaimQueueChanges()
  {
    try
    {
      //Subscribe to account changes
      claimQueueWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getClaimQueuePDA(), async() => 
      {
        //Handle account change...
        claimQueue.data = await getClaimQueue()

        if(claimQueue.data.currentClaimQueueCount != currentClaimQueueCount)
        {
          claims.data = await getQueueClaims()
          currentClaimQueueCount = claimQueue.data.currentClaimQueueCount
        }
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForHospitalStatChanges()
  {
    try
    {
      //Subscribe to account changes
      hospitalStatsWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getHospitalStatsPDA(), async() => 
      {
        //Handle account change...
        hospitalStats.data = await getHospitalStats()
        hospitals.data = await getAllHospitals()

        //Get claim que table data with updated hospitals
        claims.data = await getQueueClaims()

        //Get insurance company record table data with updated hospitals
        insuranceCompanies.data = await getAllInsuranceCompanies()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }
    
  async function listenForInsuranceCompanyStatChanges()
  {
    try
    {
      //Subscribe to account changes
      insuranceCompanyStatsWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getInsuranceCompanyStatsPDA(), async() => 
      {
        //Handle account change...
        insuranceCompanyStats.data = await getInsuranceCompanyStats()
        insuranceCompanies.data = await getAllInsuranceCompanies()

        //Get claim que table data with updated insurance companies
        claims.data = await getQueueClaims()

        //Get insurance company record table data with updated hospitals
        hospitals.data = await getAllHospitals()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForProcessorStatChanges()
  {
    try
    {
      //Subscribe to account changes
      processorStatsWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getProcessorStatsPDA(), async() => 
      {
        //Handle account change...
        anchorPrograms.areM4AProtocolStatsReady = true
        hospitals.data = await getAllHospitals()
        insuranceCompanies.data = await getAllInsuranceCompanies()
        claims.data = await getQueueClaims()
        processorStats.data = await getProcessorStats()
        processedClaims.data = await getProcessedClaims()
        processors.data = await getProcessors()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForChatProtocolChanges()
  {
    try
    {
      //Subscribe to account changes
      isChatProtocolReadyWatchId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getChatProtocolPDA(), async() => 
      {
        //Handle account change...
        const chatProtocol = await getChatProtocol()
        anchorPrograms.chatProtocolInitiatorAddress = chatProtocol.chatProtocolInitiatorAddress.toBase58()
        anchorPrograms.isChatProtocolReady = true

        anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(isChatProtocolReadyWatchId)
        isChatProtocolReadyWatchId = undefined
      })
    }
    catch(error)
    {
      console.log(error)
      anchorPrograms.isChatProtocolReady = false
    }
  }

  async function listenForM4AChatChanges()
  {
    try
    {
      //Subscribe to account changes
      m4aChatWatchId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getM4AChatPDA(), async() => 
      {
        //Handle account change...
        m4aChat.data = await getM4AChat()
        anchorPrograms.m4aChatInitiatorAddress = m4aChat.data.chatInitiatorAddress.toBase58()
        anchorPrograms.isM4AChatReady = true

        await setChatAccountHashMap()
      })
    }
    catch(error)
    {
      console.log(error)
      anchorPrograms.isM4AChatReady = false
    }
  }

  async function listenForPLIChatChanges()
  {
    try
    {
      //Subscribe to account changes
      pliChatWatchId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getPLIChatPDA(), async() => 
      {
        //Handle account change...
        pliChat.data = await getPLIChat()
        anchorPrograms.pliChatInitiatorAddress = pliChat.data.chatInitiatorAddress.toBase58()
        anchorPrograms.isPLIChatReady = true

        await setChatAccountHashMap()
      })
    }
    catch(error)
    {
      console.log(error)
      anchorPrograms.isPLIChatReady = false
    }
  }

  async function listenForAboutChatChanges()
  {
    try
    {
      //Subscribe to account changes
      aboutChatWatchId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getAboutChatPDA(), async() => 
      {
        //Handle account change...
        aboutChat.data = await getAboutChat()
        anchorPrograms.aboutChatInitiatorAddress = aboutChat.data.chatInitiatorAddress.toBase58()
        anchorPrograms.isAboutChatReady = true

        await setChatAccountHashMap()
      })
    }
    catch(error)
    {
      console.log(error)
      anchorPrograms.isAboutChatReady = false
    }
  }

  async function listenForChatAccountStatChanges()
  {
    try
    {
      //Subscribe to account changes
      chatAccountStatsWatchId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getChatAccountStatsPDA(), async() => 
      {
        //Handle account change...
        await setChatAccountAndUserNameHashMap()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForCommentSectionStatChanges()
  {
    try
    {
      //Subscribe to account changes
      commentSectionStatsWatchId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getCommentSectionStatsPDA(), async() => 
      {
        //Handle account change...
        commentSections.data = await getCommentSections()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForM4ACEOAccountChanges()
  {
    //Subscribe to account changes
    m4aProtocolCEOAccountWatcherId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getM4AProtocolCEOAccountPDA(), async () => 
    {
      //Handle account change..
      const m4aCEOAccount = await getM4AProtocolCEOAccount()
      adminAccounts.isM4ACEOAccountReady = true
      adminAccounts.m4aCEOAddress = m4aCEOAccount.address.toBase58()
    })
  }

  async function listenForM4ATreasurerAccountChanges()
  {
    //Subscribe to account changes
    m4aProtocolTreasurerAccountWatcherId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getM4AProtocolTreasurerAccountPDA(), async () => 
    {
      //Handle account change..
      const m4aTreasurerAccount = await getM4AProtocolTreasurerAccount()
      adminAccounts.m4aTreasurerAddress = m4aTreasurerAccount.address.toBase58()
    })
  }

  async function listenForChatCEOAccountChanges()
  {
    //Subscribe to account changes
    chatProtocolCEOAccountWatcherId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getChatProtocolCEOAccountPDA(), async () => 
    {
      //Handle account change..
      const chatCEOAccount = await getChatProtocolCEOAccount()
      adminAccounts.isChatCEOAccountReady = true
      adminAccounts.chatCEOAddress = chatCEOAccount.address.toBase58()
    })
  }

  async function listenForChatTreasurerAccountChanges()
  {
    //Subscribe to account changes
    chatProtocolTreasurerAccountWatcherId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getChatProtocolTreasurerAccountPDA(), async () => 
    {
      //Handle account change..
      const chatTreasurerAccount = await getChatProtocolTreasurerAccount()
      adminAccounts.chatTreasurerAddress = chatTreasurerAccount.address.toBase58()
    })
  }
    
  async function listenForIdeaStatChanges()
  {
    //Subscribe to account changes
    ideaStatsWatcherId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getIdeaStatsPDA(), async () => 
    {
      //Handle account change..
      ideas.data = await getIdeas()
    })
  }

  async function listenForFEDStatChanges()
  {
    //Subscribe to account changes
    fedStatsWatcherId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getFEDStatsPDA(), async () => 
    {
      //Handle account change..
      feds.data = await getFEDRecords()
    })
  }

  async function listenForPostVoteStatChanges()
  {
    //Subscribe to account changes
    postVoteStatsWatcherId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getPostVoteStatsPDA(), async () => 
    {
      //Handle account change..
      postVoteRecords.data = await getPostVoteRecords()
    })
  }

  async function listenForPollStatChanges()
  {
    //Subscribe to account changes
    pollStatsWatcherId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getPollStatsPDA(), async () => 
    {
      //Handle account change..
      polls.data = await getAllPolls()
    })
  }

  async function listenForPollVoteStatChanges()
  {
    //Subscribe to account changes
    pollVoteStatsWatcherId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getPollVoteStatsPDA(), async () => 
    {
      //Handle account change..
      pollVoteRecords.data = await getPollVoteRecords()
    })
  }
</script>

<style scoped>
  ion-label
  {
    font-size: 15px /*Don't want the side menu text to shrink for smaller screens*/
  }

  .contractPickerButton
  {
    font-weight: bold;
    margin-top: -5px;
    border-radius: 7px;
    box-shadow: 0px 0px 5px 8px v-bind(buttonShadow)
  }

  .contractPickerButton:hover
  {
    opacity: 1;
    text-decoration: underline;
    text-decoration-thickness: 2px;
  }
  
  .contractPickerTextContainer
  {
    margin-bottom: -10px;
  }
</style>