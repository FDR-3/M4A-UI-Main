<template>
    <M4AChatUpdater/>
    <PLIChatUpdater/>
    <AboutChatUpdater/>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, watch } from 'vue'
  import { getChatProtocol,
  getChatFeeTokenAccounts,
  getChatAccountStats,
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
  refreshIdeadsData,
  refreshFEDsData,
  getChatProtocolCEOAccountPDA,
  getChatProtocolTreasurerAccountPDA,
  getChatProtocolPDA,
  getChatTokenFeePDA,
  getChatAccountStatsPDA,
  getM4AChatPDA,
  getPLIChatPDA,
  getAboutChatPDA,
  getCommentSectionStatsPDA,
  getIdeaStatsPDA,
  getFEDStatsPDA,
  getPostVoteStatsPDA,
  getPollStatsPDA,
  getPollVoteStatsPDA } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { m4aChat, pliChat, aboutChat } from '/src/assets/globalStates/chat/Chats.vue'
  import { customUserNameHashMap } from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { ideas, feds } from '/src/assets/globalStates/chat/QOL.vue'
  import { commentSections } from '/src/assets/globalStates/chat/CommentSections.vue'
  import { postVoteRecords } from '/src/assets/globalStates/chat/PostVoteRecords.vue'
  import { polls, pollVoteRecords } from '/src/assets/globalStates/chat/Polls.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import M4AChatUpdater from './M4AChatUpdater.vue'
  import PLIChatUpdater from './PLIChatUpdater.vue'
  import AboutChatUpdater from './AboutChatUpdater.vue'

  var isChatProtocolReadyWatchId: any
  var m4aChatWatchId: any
  var pliChatWatchId: any
  var aboutChatWatchId: any
  var chatAccountStatsWatchId: any
  var commentSectionStatsWatchId: any

  var chatProtocolCEOAccountWatcherId: any
  var chatProtocolTreasurerAccountWatcherId: any

  var isChatFeeTokenAccountReadyWatchId: any
  var areChatQualityOfLifeAccountsReadyWatchId: any
  var ideaStatsWatcherId: any
  var fedStatsWatcherId: any
  var postVoteStatsWatcherId: any
  var pollStatsWatcherId: any
  var pollVoteStatsWatcherId: any

  onMounted(async() =>
  {
    //console.log(await anchorPrograms.chat.chatProgram.account.videoVoteRecord.all())
    
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
      await listenForChatCEOAccountInitialization()
    }

    //Chat Protocol Treasurer Account
    const chatTreasurerAccount = await getChatProtocolTreasurerAccount()
    if(chatTreasurerAccount)
      adminAccounts.chatTreasurerAddress = chatTreasurerAccount.address.toBase58()
    else
      await listenForChatTreasurerAccountInitialization()

    //Chat Accounts
    //Chat Protocol Quality Of Life Accounts
    await setChatAccountAndUserNameHashMap()
    await listenForChatAccountStatChanges()

    const chatAccountStats = await getChatAccountStats() 
    if(chatAccountStats)
      anchorPrograms.areChatQOLAccountsReady = true
    else
      anchorPrograms.areChatQOLAccountsReady = false

    //Chat Post Vote Records
    postVoteRecords.data = await getPostVoteRecords()
    await listenForPostVoteStatChanges()

    //ChatFeeTokenAccount
    const chatFeeTokenAccounts = await getChatFeeTokenAccounts()
    if(chatFeeTokenAccounts.length > 0)
      anchorPrograms.isChatFeeTokenAccountReady = true
    else
      listenForChatFeeTokenAccount()

    //Chat Protocol Account
    const chatProtocol = await getChatProtocol()
    await listenForChatProtocolChanges()
    if(chatProtocol)
    {
      anchorPrograms.chatProtocolInitiatorAddress = chatProtocol.chatProtocolInitiatorAddress.toBase58()
      anchorPrograms.isChatProtocolReady = true
    }
    else
      anchorPrograms.isChatProtocolReady = false

    //M4A Chat
    m4aChat.data = await getM4AChat()
    await listenForM4AChatChanges()
    if(m4aChat.data)
    {
    anchorPrograms.m4aChatInitiatorAddress = m4aChat.data.chatInitiatorAddress.toBase58()
    anchorPrograms.isM4AChatReady = true
    }
    else
      anchorPrograms.isM4AChatReady = false

    //PLI Chat
    pliChat.data = await getPLIChat()
    await listenForPLIChatChanges()
    if(pliChat.data)
    {
      anchorPrograms.pliChatInitiatorAddress = pliChat.data.chatInitiatorAddress.toBase58()
      anchorPrograms.isPLIChatReady = true
    }
    else
      anchorPrograms.isPLIChatReady = false

    //About Chat
    aboutChat.data = await getAboutChat()
    await listenForAboutChatChanges()
    if(aboutChat.data)
    {
      anchorPrograms.aboutChatInitiatorAddress = aboutChat.data.chatInitiatorAddress.toBase58()
      anchorPrograms.isAboutChatReady = true
    }
    else
      anchorPrograms.isAboutChatReady = false

    //Comment Sections
    commentSections.data = await getCommentSections()
    await listenForCommentSectionStatChanges()

    //Ideas
    ideas.data = await getIdeas()
    await listenForIdeaStatChanges()

    //Feds
    feds.data = await getFEDRecords()
    await listenForFEDStatChanges()

    //Chat Polls
    polls.data = await getAllPolls()
    await listenForPollStatChanges()

    //Chat Poll Vote Records
    pollVoteRecords.data = await getPollVoteRecords()
    await listenForPollVoteStatChanges()
  })

  onUnmounted(() => 
  {
    if(isChatProtocolReadyWatchId != undefined)
    {
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(isChatProtocolReadyWatchId)
      isChatProtocolReadyWatchId = undefined
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
  })

  //Have to refresh new custom names outside of hospital and insurance company records tables
  watch(customUserNameHashMap, () =>
  {
    refreshIdeadsData()
    refreshFEDsData()
  })

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

  async function listenForChatAccountStatChanges()
  {
    try
    {
      //Subscribe to account changes
      chatAccountStatsWatchId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getChatAccountStatsPDA(), async() => 
      {
        //Handle account change...
        anchorPrograms.areChatQOLAccountsReady = true
        await setChatAccountAndUserNameHashMap()
      })
    }
    catch(error)
    {
      console.log(error)
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

  async function listenForIdeaStatChanges()
  {
    //Subscribe to account changes
    ideaStatsWatcherId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getIdeaStatsPDA(), async() => 
    {
      //Handle account change..
      ideas.data = await getIdeas()
    })
  }

  async function listenForFEDStatChanges()
  {
    //Subscribe to account changes
    fedStatsWatcherId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getFEDStatsPDA(), async() => 
    {
      //Handle account change..
      feds.data = await getFEDRecords()
    })
  }

  async function listenForPostVoteStatChanges()
  {
    //Subscribe to account changes
    postVoteStatsWatcherId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getPostVoteStatsPDA(), async() => 
    {
      //Handle account change..
      postVoteRecords.data = await getPostVoteRecords()
    })
  }

  async function listenForPollStatChanges()
  {
    //Subscribe to account changes
    pollStatsWatcherId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getPollStatsPDA(), async() => 
    {
      //Handle account change..
      polls.data = await getAllPolls()
    })
  }

  async function listenForPollVoteStatChanges()
  {
    //Subscribe to account changes
    pollVoteStatsWatcherId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getPollVoteStatsPDA(), async() => 
    {
      //Handle account change..
      pollVoteRecords.data = await getPollVoteRecords()
    })
  }

  async function listenForChatCEOAccountInitialization()
  {
    //Subscribe to account changes
    chatProtocolCEOAccountWatcherId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getChatProtocolCEOAccountPDA(), async() => 
    {
      //Handle account change..
      const chatCEOAccount = await getChatProtocolCEOAccount()
      adminAccounts.isChatCEOAccountReady = true
      adminAccounts.chatCEOAddress = chatCEOAccount.address.toBase58()
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(chatProtocolCEOAccountWatcherId)
      chatProtocolCEOAccountWatcherId = undefined
    })
  }

  async function listenForChatTreasurerAccountInitialization()
  {
    //Subscribe to account changes
    chatProtocolTreasurerAccountWatcherId = anchorPrograms.chat.chatProgram.provider.connection.onAccountChange(getChatProtocolTreasurerAccountPDA(), async() => 
    {
      //Handle account change..
      const chatTreasurerAccount = await getChatProtocolTreasurerAccount()
      adminAccounts.chatTreasurerAddress = chatTreasurerAccount.address.toBase58()
      anchorPrograms.chat.chatProgram.provider.connection.removeAccountChangeListener(chatProtocolTreasurerAccountWatcherId)
      chatProtocolTreasurerAccountWatcherId = undefined
    })
  }
</script>