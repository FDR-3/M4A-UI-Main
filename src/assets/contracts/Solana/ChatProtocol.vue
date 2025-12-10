<script lang="ts">
  import * as anchor from "@coral-xyz/anchor"
  import { Account, PublicKey } from "@solana/web3.js"
  import { countryNameArray, 
    countryStateNameArray,
    countryStateCoordinatesArray } from '/src/components/mapclaims/arrays/CountryStateArrays.ts'
  import { trimAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { chatAccounts, chatAccountHashMap, customUserNameHashMap, chatLeaderBoard } from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { commentSectionHashMap } from '/src/assets/globalStates/chat/CommentSections.vue'
  import { ideas, feds } from '/src/assets/globalStates/chat/QOL.vue'
  import { convertUnixTimeToLocalDate, convertUnixTimeToLocalTime } from '/src/assets/helperFunctions/UnixTimeStampHelper.ts'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { sleep, MAX_RETRY_FETCH, RETRY_TIME_OUT, RETRY_MESSAGE, ERROR_429 } from '/src/assets/helperFunctions/sleep.ts'

  const PROCESSED_SECTION_NAME_INDEX = 0
  const STATE_NAME_INDEX = 1
  const ZOOM_LAT_INDEX = 2
  const ZOOM_LONG_INDEX = 3

  export async function getChatProtocol()
  {
    console.log("Getting Chat Protocol")

    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.chatProtocol.fetch(getChatProtocolPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Chat Protocol Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getChatFeeTokenAccounts()
  {
    console.log("Getting Chat Protocol Fee Token Accounts")

    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.feeTokenEntry.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getChatProtocolCEOAccount()
  {
    console.log("Getting Chat Protocol CEO Account")

    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.chatProtocolCeo.fetch(getChatProtocolCEOAccountPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Chat CEO Account Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getChatProtocolTreasurerAccount()
  {
    console.log("Getting Chat Protocol Treasurer Account")

    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.chatProtocolTreasurer.fetch(getChatProtocolTreasurerAccountPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Chat Treasurer Account Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getChatAccountStats()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.chatAccountStats.fetch(getChatAccountStatsPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Chat Protocol Quality of Life Accounts Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getM4AChat()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.m4AChat.fetch(getM4AChatPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("M4A Chat Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getPLIChat()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.pliChat.fetch(getPLIChatPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("PLI Chat Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getAboutChat()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.aboutChat.fetch(getAboutChatPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("About Chat Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getLOChat()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.loChat.fetch(getLOChatPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("LO Chat Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export function getUserCustomNameFlag(userAddress: string | PublicKey)
  {
    if (typeof userAddress === "string") 
    {
      try
      { 
        const chatAccount = customUserNameHashMap.map.get(userAddress)

        if(chatAccount)
          return chatAccount.useCustomName
        else
          return false
      }
      catch
      {
        console.log("Chat Account Not Initialized")
        return false
      }
    }
    else
    {
      const userAddressString = userAddress.toBase58()

      try
      { 
        const chatAccount = customUserNameHashMap.map.get(userAddressString)

        if(chatAccount)
          return chatAccount.useCustomName
        else
          return false
      }
      catch
      {
        console.log("Chat Account Not Initialized")
        return false
      }
    }
  }

  export function getUserDisplayName(userAddress: string | PublicKey)
  {
    if (typeof userAddress === "string") 
    {
      try
      { 
        const chatAccount = customUserNameHashMap.map.get(userAddress)

        if(chatAccount)
        {
          if(chatAccount.useCustomName)
            return chatAccount.userName
          else
            return userAddress
        }
        else
          return userAddress
      }
      catch
      {
        console.log("Chat Account Not Initialized")
        return userAddress
      }
    }
    else
    {
      const userAddressString = userAddress.toBase58()

      try
      { 
        const chatAccount = customUserNameHashMap.map.get(userAddressString)

        if(chatAccount)
        {
          if(chatAccount.useCustomName)
            return chatAccount.userName
          else
            return userAddressString
        }
        else
          return userAddressString
      }
      catch
      {
        console.log("Chat Account Not Initialized")
        return userAddressString
      }
    }
  }

  export function getCustomOrTrimmedUserDisplayName(userAddress: string | PublicKey)
  {
    if (typeof userAddress === "string") 
    {
      if(customUserNameHashMap.map)
      {
        const chatAccount = customUserNameHashMap.map.get(userAddress)

        if(chatAccount)
        {
          if(chatAccount.useCustomName)
            return chatAccount.userName
          else
            return trimAddress(userAddress)
        }
        else
          return trimAddress(userAddress)
      }
      else
        return trimAddress(userAddress)
    }
    else
    {
      const userAddressString = userAddress.toBase58()

      if(customUserNameHashMap.map)
      {
        const chatAccount = customUserNameHashMap.map.get(userAddressString)

        if(chatAccount)
        {
          if(chatAccount.useCustomName)
            return chatAccount.userName
          else
            return trimAddress(userAddressString)
        }
        else
          return trimAddress(userAddressString)
      }
      else
        return trimAddress(userAddressString)
    }
  }

  //This function doesn't run initially, only runs on listening to changes to the M4A, PLI, or About Chat
  export async function setChatAccountHashMap()
  {
    console.log("Get Chat Account Hash Map")

    var userAccountHashMap = new Map<string, any>()

    const tempChatAccounts = await getChatAccountsWrapper()

    for(var i=0; i<tempChatAccounts.length; i++)
      userAccountHashMap.set(tempChatAccounts[i].account.userAddress.toBase58(), tempChatAccounts[i].account)

    chatAccounts.data = tempChatAccounts
    chatAccountHashMap.map = userAccountHashMap
  }

  export function getChatAccount(userAddress: string)
  {
    if(chatAccountHashMap.map)
      return chatAccountHashMap.map.get(userAddress)
    else
      return undefined 
  }

  //This function runs initially and on changes to the ChatStatsAccount
  export async function setChatAccountAndUserNameHashMap()
  {
    console.log("Get Chat Account And User Name Hash Map")

    var userAccountHashMap = new Map<string, any>()
    var userNameHashMap = new Map<string, any>()

    const tempChatAccounts = await getChatAccountsWrapper()

    for(var i=0; i<tempChatAccounts.length; i++)
    {
      var ChatAccountDisplayName: any =
      {
        useCustomName: tempChatAccounts[i].account.useCustomName,
        userName: tempChatAccounts[i].account.userName
      }

      userAccountHashMap.set(tempChatAccounts[i].account.userAddress.toBase58(), tempChatAccounts[i].account)
      userNameHashMap.set(tempChatAccounts[i].account.userAddress.toBase58(), ChatAccountDisplayName)
    }

    chatAccounts.data = tempChatAccounts
    chatAccountHashMap.map = userAccountHashMap
    customUserNameHashMap.map = userNameHashMap
  }

  export function setChatProtocolLeaderBoard()
  {
    console.log("Set Chat Protocol Leader Board")

    var tempLeaderBoardData: any[] = []

    for(var i=0; i<chatAccounts.data.length; i++)
    {
      const voteMoneyEarned = Number(chatAccounts.data[i].account.receivedUpVoteScore) * .01
      const tempData = 
      {
        displayName: getCustomOrTrimmedUserDisplayName(chatAccounts.data[i].account.userAddress.toBase58()),
        userAddress: chatAccounts.data[i].account.userAddress.toBase58(),
        voteMoneyEarned: voteMoneyEarned,
        voteMoneyEarnedString: '$' + voteMoneyEarned.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 }),
        netReceivedVoteScore: Number(chatAccounts.data[i].account.receivedUpVoteScore.sub(chatAccounts.data[i].account.receivedDownVoteScore)),
        netCastedVoteScore: Number(chatAccounts.data[i].account.castedUpVoteScore.sub(chatAccounts.data[i].account.castedDownVoteScore)),
        votesReceivedCount: Number(chatAccounts.data[i].account.upVoteReceivedCount.add(chatAccounts.data[i].account.downVoteReceivedCount)),
        upVoteReceivedCount: Number(chatAccounts.data[i].account.upVoteReceivedCount),
        downVoteReceivedCount: Number(chatAccounts.data[i].account.downVoteReceivedCount),
        votesCastedCount: Number(chatAccounts.data[i].account.upVoteCastedCount.add(chatAccounts.data[i].account.downVoteCastedCount)),
        upVoteCastedCount: Number(chatAccounts.data[i].account.upVoteCastedCount),
        downVoteCastedCount: Number(chatAccounts.data[i].account.downVoteCastedCount),
        commentAndReplyCount: Number(chatAccounts.data[i].account.commentAndReplyCount),
        editedCommentAndReplyCount: Number(chatAccounts.data[i].account.editedCommentAndReplyCount),
        deletedCommentAndReplyCount: Number(chatAccounts.data[i].account.deletedCommentAndReplyCount),
        ceoStarredCommentAndReplyCount: Number(chatAccounts.data[i].account.ceoStarredCommentAndReplyCount),
        ceoMarkedFEDCommentAndReplyCount: Number(chatAccounts.data[i].account.ceoMarkedFedCommentAndReplyCount)
      }

      tempLeaderBoardData.push(tempData)
    }

    chatLeaderBoard.data = tempLeaderBoardData
  }


  async function getChatAccountsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.chatAccount.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }
  
  export async function getCommentSections()
  {
    console.log("Getting Comment Sections")

    var commentSectionList: any = []
    var hashMap = new Map<string, any>()

    const commentSections = await getCommentSectionsWrapper()

    for(var i=0; i<commentSections.length; i++)
    {
      var commentSection = commentSections[i].account
      
      const processedNames = processCommentSectionName(commentSection.commentSectionName)

      if(processedNames)
      {
        commentSection.processedCommentSectionName = processedNames[PROCESSED_SECTION_NAME_INDEX]

        if(commentSection.commentSectionName.includes("Country: "))
        {
          commentSection.stateName = processedNames[STATE_NAME_INDEX]
          commentSection.zoomLong = processedNames[ZOOM_LONG_INDEX]
          commentSection.zoomLat = processedNames[ZOOM_LAT_INDEX]
        }
      }

      const chatAccount = customUserNameHashMap.map.get(commentSection.commentSectionInitiatorAddress.toBase58())

      if(chatAccount)
      {
        commentSection.displayName = getCustomOrTrimmedUserDisplayName(commentSection.commentSectionInitiatorAddress)   
        commentSection.useCustomName = chatAccount.useCustomName
      }
      else
      {
        commentSection.displayName = getCustomOrTrimmedUserDisplayName(commentSection.commentSectionInitiatorAddress)   
        commentSection.useCustomName = false
      }

      //Needed to be able to sort properly with Anchor BN numbers, only some id's have that problem for some reason, but using .toNumber() fixes this when the Anchor BN numbers won't sort
      if(typeof commentSection.id != "number")
        commentSection.id = commentSection.id.toNumber()

      commentSection.commentAndReplyCount = commentSection.commentAndReplyCount.toNumber()

      commentSection.editedCommentAndReplyCount =
      commentSection.editedCommentCount.add(
      commentSection.editedReplyCount.add(
      commentSection.editedLv3ReplyCount.add(
      commentSection.editedLv4ReplyCount))).toNumber()

      commentSection.deletedCommentAndReplyCount =
      commentSection.deletedCommentCount.add(
      commentSection.deletedReplyCount.add(
      commentSection.deletedLv3ReplyCount.add(
      commentSection.deletedLv4ReplyCount))).toNumber()

      commentSection.ceoStarredCommentAndReplyCount =
      commentSection.ceoStarredCommentCount.add(
      commentSection.ceoStarredReplyCount.add(
      commentSection.ceoStarredLv3ReplyCount.add(
      commentSection.ceoStarredLv4ReplyCount))).toNumber()

      commentSection.ceoMarkedFedCommentAndReplyCount =
      commentSection.ceoMarkedFedCommentCount.add(
      commentSection.ceoMarkedFedReplyCount.add(
      commentSection.ceoMarkedFedLv3ReplyCount.add(
      commentSection.ceoMarkedFedLv4ReplyCount))).toNumber()

      commentSection.postUpVoteCount = commentSection.postUpVoteCount.toNumber()
      commentSection.postDownVoteCount = commentSection.postDownVoteCount.toNumber()
      commentSection.postVoteCount = commentSection.postUpVoteCount + commentSection.postDownVoteCount

      commentSection.postUpVoteScore = commentSection.postUpVoteScore.toNumber()
      commentSection.postDownVoteScore = commentSection.postDownVoteScore.toNumber()
      commentSection.postVoteScore = commentSection.postUpVoteScore - commentSection.postDownVoteScore

      commentSection.commentVotesCastedCount = commentSection.commentUpVoteCount.add(commentSection.commentDownVoteCount)
      commentSection.replyVotesCastedCount = commentSection.replyUpVoteCount.add(commentSection.replyDownVoteCount)
      commentSection.replyToReplyVotesCastedCount = commentSection.replyLv3UpVoteCount.add(commentSection.replyLv3DownVoteCount)
      commentSection.replyToLv3ReplyVotesCastedCount = commentSection.replyLv4UpVoteCount.add(commentSection.replyLv4DownVoteCount)

      commentSection.commentNetVoteScore = commentSection.commentUpVoteScore.sub(commentSection.commentDownVoteScore)
      commentSection.replyNetVoteScore = commentSection.replyUpVoteScore.sub(commentSection.replyDownVoteScore)
      commentSection.replyToReplyNetVoteScore = commentSection.replyToReplyUpVoteScore.sub(commentSection.replyToReplyDownVoteScore)
      commentSection.replyToLv3ReplyNetVoteScore = commentSection.replyToLv3ReplyUpVoteScore.sub(commentSection.replyToLv3ReplyDownVoteScore)
      
      commentSection.netVideoVoteScore = commentSection.videoUpVoteScore.toNumber() - commentSection.videoDownVoteScore.toNumber()

      hashMap.set(commentSection.commentSectionNamePrefix+commentSection.commentSectionName, commentSection)

      commentSectionList.push(commentSection)
    }

    commentSectionHashMap.map = hashMap
    return commentSectionList
  }

  export function getCommentSection(commentSectionNamePrefix: string, commentSectionName: string)
  {
    if(commentSectionHashMap.map)
      return commentSectionHashMap.map.get(commentSectionNamePrefix + commentSectionName)
    else
      return undefined 
  }

  async function getCommentSectionsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.commentSection.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export function sortCommentSectionPostsAndProcessUserNames(posts: any[], commentSectionName: string)
  {
    if(!posts)
      return

    var postList: any[] = []

    for(var i=0; i<posts.length; i++)
    {
      if(posts[i].account.commentSectionName == commentSectionName)
      {
        //Set display name
        posts[i].account.displayName = getCustomOrTrimmedUserDisplayName(posts[i].account.postOwnerAddress)
        postList.push(posts[i])
      }
    }

    return postList.sort((a: any, b: any) => a.account.id.sub(b.account.id)) 
  }

  export async function getIdeas()
  {
    console.log("Getting Ideas")

    var ideasList: any = []

    try
    {
      const ideas = await getIdeasWrapper()

      for(var i=0; i<ideas.length; i++)
      {
        const processedNames = processCommentSectionName(ideas[i].account.commentSectionName)

        if(processedNames)
        {
          ideas[i].account.processedCommentSectionName = processedNames[PROCESSED_SECTION_NAME_INDEX]

          if(ideas[i].account.commentSectionName.includes("Country: "))
          {
            ideas[i].account.stateName = processedNames[STATE_NAME_INDEX]
            ideas[i].account.zoomLong = processedNames[ZOOM_LONG_INDEX]
            ideas[i].account.zoomLat = processedNames[ZOOM_LAT_INDEX]
          }
        }

        ideas[i].account.postOwnerAddress = ideas[i].account.postOwnerAddress
        ideas[i].account.displayName = getCustomOrTrimmedUserDisplayName(ideas[i].account.postOwnerAddress)

        ideas[i].account.creationTimeString = convertUnixTimeToLocalTime(ideas[i].account.unixCreationTimeStamp)
        ideas[i].account.creationDateString = convertUnixTimeToLocalDate(ideas[i].account.unixCreationTimeStamp)
        ideas[i].account.implementationTimeString = convertUnixTimeToLocalTime(ideas[i].account.implementationTime)
        ideas[i].account.implementationDateString = convertUnixTimeToLocalDate(ideas[i].account.implementationTime)

        ideasList.push(ideas[i].account)
      }

      return ideasList
    }
    catch(error)
    {
      console.log(error)
      return []
    }
  }

  async function getIdeasWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.idea.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getFEDRecords()
  {
    console.log("Getting FEDs")

    var fedRecordsList: any = []

    try
    {
      const fedRecords = await getFEDRecordsWrapper()

      for(var i=0; i<fedRecords.length; i++)
      {
        const processedNames = processCommentSectionName(fedRecords[i].account.commentSectionName)

        if(processedNames)
        {
          fedRecords[i].account.processedCommentSectionName = processedNames[PROCESSED_SECTION_NAME_INDEX]

          if(fedRecords[i].account.commentSectionName.includes("Country: "))
          {
            fedRecords[i].account.stateName = processedNames[STATE_NAME_INDEX]
            fedRecords[i].account.zoomLong = processedNames[ZOOM_LONG_INDEX]
            fedRecords[i].account.zoomLat = processedNames[ZOOM_LAT_INDEX]
          }
        }

        fedRecords[i].account.postOwnerAddress = fedRecords[i].account.postOwnerAddress
        fedRecords[i].account.displayName = getCustomOrTrimmedUserDisplayName(fedRecords[i].account.postOwnerAddress)

        fedRecords[i].account.markTimeString = convertUnixTimeToLocalTime(fedRecords[i].account.markTime)
        fedRecords[i].account.markDateString = convertUnixTimeToLocalDate(fedRecords[i].account.markTime)

        fedRecordsList.push(fedRecords[i].account)
      }

      return fedRecordsList
    }
    catch(error)
    {
      console.log(error)
      return []
    }
  }

  async function getFEDRecordsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.fedRecord.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getPostVoteRecords()
  {
    console.log("Get Post Vote Records")
    
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.postVoteRecord.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getAllPolls()
  {
    console.log("Getting Polls")

    var pollList: any = []

    const polls = await getAllPollsWrapper()

    for(var i=0; i<polls.length; i++)
    {
      pollList.push(polls[i].account)

      pollList[i].pollIndex = pollList[i].pollIndex.toNumber()
      pollList[i].creationTimeString = convertUnixTimeToLocalTime(pollList[i].unixCreationTimeStamp)
      pollList[i].creationDateString = convertUnixTimeToLocalDate(pollList[i].unixCreationTimeStamp)
      pollList[i].votesCastedCount = pollList[i].upVoteCount.add(pollList[i].downVoteCount)
      pollList[i].netVoteScore = pollList[i].upVoteScore.sub(pollList[i].downVoteScore)

      pollList[i].pollOptions = []

      for(var j=0; j<pollList[i].optionCount; j++)
      {
        const pollOption = await getPollOptionWrapper(pollList[i].pollIndex, j)

        pollOption.pollIndex = pollList[i].pollIndex
        pollOption.creationTimeString = convertUnixTimeToLocalTime(pollOption.unixCreationTimeStamp)
        pollOption.creationDateString = convertUnixTimeToLocalDate(pollOption.unixCreationTimeStamp)

        pollOption.votesCastedCount = pollOption.upVoteCount.add(pollOption.downVoteCount)
        pollOption.netVoteScore = pollOption.upVoteScore.sub(pollOption.downVoteScore)

        pollList[i].pollOptions.push(pollOption)
      }
    }

    pollList.sort((a: any, b: any) => a.pollIndex - b.pollIndex)
    return pollList
  }

  async function getAllPollsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.poll.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  async function getPollOptionWrapper(pollIndex: number, pollOptionIndex: number)
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.pollOption.fetch(getPollOptionPDA(pollIndex, pollOptionIndex))
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getPollVoteRecords()
  {
    console.log("Getting Poll Vote Records")
    
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.chat.chatProgram.account.pollVoteRecord.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export function refreshIdeadsData()
  {
    var refreshedData: any = []

    const tableData = ideas.data

    if(!tableData)
      return
    else
      for(var i=0; i<tableData.length; i++)
      {
        tableData[i].displayName = getCustomOrTrimmedUserDisplayName(tableData[i].postOwnerAddress)
        refreshedData.push(tableData[i])
      }

    ideas.data = refreshedData
  }

  export function refreshFEDsData()
  {
    var refreshedData: any = []

    const tableData = feds.data

    if(!tableData)
      return
    else
      for(var i=0; i<tableData.length; i++)
      {
        tableData[i].displayName = getCustomOrTrimmedUserDisplayName(tableData[i].postOwnerAddress)
        refreshedData.push(tableData[i])
      }

    feds.data = refreshedData
  }

  export function getChatProtocolCEOAccountPDA()
  {
    const [chatProtocolCEOPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("chatProtocolCEO")
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return chatProtocolCEOPDA
  }

  export function getChatProtocolTreasurerAccountPDA()
  {
    const [chatProtocolTreasurerPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("chatProtocolTreasurer")
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return chatProtocolTreasurerPDA
  }

  export function getChatProtocolPDA()
  {
    const [chatProtocolPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("chatProtocol")
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return chatProtocolPDA
  }

  export function getChatTokenFeePDA(tokenMintAddress: PublicKey)
  {
    const [chatTokenFeePDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("feeTokenEntry"),
        tokenMintAddress.toBuffer()
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return chatTokenFeePDA
  }

  export function getM4AChatPDA()
  {
    const [m4aChatPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("m4aChat")
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return m4aChatPDA
  }

  export function getPLIChatPDA()
  {
    const [pliChatPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("pliChat")
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return pliChatPDA
  }

  export function getAboutChatPDA()
  {
    const [aboutChatPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("aboutChat")
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return aboutChatPDA
  }

  export function getLOChatPDA()
  {
    const [loChatPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("loChat")
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return loChatPDA
  }
  
  export function getChatAccountStatsPDA()
  {
    const [chatAccountStatsPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("chatAccountStats")
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return chatAccountStatsPDA
  }

  export function getCommentSectionStatsPDA()
  {
    const [commentSectionStatsPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("commentSectionStats")
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return commentSectionStatsPDA
  }

  export function getPostVoteStatsPDA()
  {
    const [postVoteStatsPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("postVoteStats")
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return postVoteStatsPDA
  }

  export function getChatAccountPDA(userAddress: PublicKey | string)
  {
    if(typeof(userAddress) === "string")
    {
      const publicKey = new PublicKey(userAddress)
      const [chatAccountPDA] = PublicKey.findProgramAddressSync(
        [
          new TextEncoder().encode("chatAccount"),
          publicKey.toBuffer()
        ],
        anchorPrograms.chat.chatProgram.programId
      )
      return chatAccountPDA
    }
    else
    {
      const [chatAccountPDA] = PublicKey.findProgramAddressSync(
        [
          new TextEncoder().encode("chatAccount"),
          userAddress.toBuffer()
        ],
        anchorPrograms.chat.chatProgram.programId
      )
      return chatAccountPDA
    }
  }

  export function getCustomUserNameStatsPDA()
  {
    const [customUserNameStatsPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("customUserNameStats")
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return customUserNameStatsPDA
  }

  export function getPollStatsPDA()
  {
    const [pollStatsPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("pollStats")
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return pollStatsPDA
  }

  export function getPollVoteStatsPDA()
  {
    const [pollVoteStatsPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("pollVoteStats")
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return pollVoteStatsPDA
  }

  export function getPollPDA(pollIndex: number)
  {
    const [pollPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("poll"),
        //new TextEncoder().encode("poll"),
        new anchor.BN(pollIndex).toArrayLike(Uint8Array, "le", 16)
        //new anchor.BN(pollIndex).toArrayLike(Uint8Array, "le", 16)
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return pollPDA
  }

  export function getPollOptionPDA(pollIndex: number, pollOptionIndex: number)
  {
    const [pollOptionPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("pollOption"),
        new anchor.BN(pollIndex).toArrayLike(Uint8Array, "le", 16),
        new anchor.BN(pollOptionIndex).toArrayLike(Uint8Array, "le", 1),
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return pollOptionPDA
  }

  export function getM4ACommentPDA(commentSectionNamePrefix: string, commentSectionName: string, chatAccountPostCountIndex: number, postOwnerAddress: PublicKey)
  {
    const [m4aCommentPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("m4aComment"),
        new TextEncoder().encode(commentSectionNamePrefix),
        new TextEncoder().encode(commentSectionName),
        new anchor.BN(chatAccountPostCountIndex).toArrayLike(Uint8Array, "le", 16),
        postOwnerAddress.toBuffer()
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return m4aCommentPDA
  }

  export function getM4AReplyPDA(commentSectionNamePrefix: string, commentSectionName: string, chatAccountPostCountIndex: number, postOwnerAddress: PublicKey)
  {
    const [m4aReplyPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("m4aReply"),
        new TextEncoder().encode(commentSectionNamePrefix),
        new TextEncoder().encode(commentSectionName),
        new anchor.BN(chatAccountPostCountIndex).toArrayLike(Uint8Array, "le", 16),
        postOwnerAddress.toBuffer()
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return m4aReplyPDA
  }

  export function getM4ALv3ReplyPDA(commentSectionNamePrefix: string, commentSectionName: string, chatAccountPostCountIndex: number, postOwnerAddress: PublicKey)
  {
    const [m4aLv3ReplyPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("m4aLv3Reply"),
        new TextEncoder().encode(commentSectionNamePrefix),
        new TextEncoder().encode(commentSectionName),
        new anchor.BN(chatAccountPostCountIndex).toArrayLike(Uint8Array, "le", 16),
        postOwnerAddress.toBuffer()
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return m4aLv3ReplyPDA
  }

  export function getM4ALv4ReplyPDA(commentSectionNamePrefix: string, commentSectionName: string, chatAccountPostCountIndex: number, postOwnerAddress: PublicKey)
  {
    const [m4aLv4ReplyPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("m4aLv4Reply"),
        new TextEncoder().encode(commentSectionNamePrefix),
        new TextEncoder().encode(commentSectionName),
        new anchor.BN(chatAccountPostCountIndex).toArrayLike(Uint8Array, "le", 16),
        postOwnerAddress.toBuffer()
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return m4aLv4ReplyPDA
  }

  export function getPLICommentPDA(commentSectionNamePrefix: string, commentSectionName: string, chatAccountPostCountIndex: number, postOwnerAddress: PublicKey)
  {
    const [pliCommentPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("pliComment"),
        new TextEncoder().encode(commentSectionNamePrefix),
        new TextEncoder().encode(commentSectionName),
        new anchor.BN(chatAccountPostCountIndex).toArrayLike(Uint8Array, "le", 16),
        postOwnerAddress.toBuffer()
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return pliCommentPDA
  }

  export function getPLIReplyPDA(commentSectionNamePrefix: string, commentSectionName: string, chatAccountPostCountIndex: number, postOwnerAddress: PublicKey)
  {
    const [pliReplyPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("pliReply"),
        new TextEncoder().encode(commentSectionNamePrefix),
        new TextEncoder().encode(commentSectionName),
        new anchor.BN(chatAccountPostCountIndex).toArrayLike(Uint8Array, "le", 16),
        postOwnerAddress.toBuffer()
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return pliReplyPDA
  }

  export function getPLILv3ReplyPDA(commentSectionNamePrefix: string, commentSectionName: string, chatAccountPostCountIndex: number, postOwnerAddress: PublicKey)
  {
    const [pliLv3ReplyPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("pliLv3Reply"),
        new TextEncoder().encode(commentSectionNamePrefix),
        new TextEncoder().encode(commentSectionName),
        new anchor.BN(chatAccountPostCountIndex).toArrayLike(Uint8Array, "le", 16),
        postOwnerAddress.toBuffer()
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return pliLv3ReplyPDA
  }

  export function getPLILv4ReplyPDA(commentSectionNamePrefix: string, commentSectionName: string, chatAccountPostCountIndex: number, postOwnerAddress: PublicKey)
  {
    const [pliLv4ReplyPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("pliLv4Reply"),
        new TextEncoder().encode(commentSectionNamePrefix),
        new TextEncoder().encode(commentSectionName),
        new anchor.BN(chatAccountPostCountIndex).toArrayLike(Uint8Array, "le", 16),
        postOwnerAddress.toBuffer()
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return pliLv4ReplyPDA
  }

  export function getAboutCommentPDA(commentSectionNamePrefix: string, commentSectionName: string, chatAccountPostCountIndex: number, postOwnerAddress: PublicKey)
  {
    const [aboutCommentPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("aboutComment"),
        new TextEncoder().encode(commentSectionNamePrefix),
        new TextEncoder().encode(commentSectionName),
        new anchor.BN(chatAccountPostCountIndex).toArrayLike(Uint8Array, "le", 16),
        postOwnerAddress.toBuffer()
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return aboutCommentPDA
  }

  export function getAboutReplyPDA(commentSectionNamePrefix: string, commentSectionName: string, chatAccountPostCountIndex: number, postOwnerAddress: PublicKey)
  {
    const [aboutReplyPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("aboutReply"),
        new TextEncoder().encode(commentSectionNamePrefix),
        new TextEncoder().encode(commentSectionName),
        new anchor.BN(chatAccountPostCountIndex).toArrayLike(Uint8Array, "le", 16),
        postOwnerAddress.toBuffer()
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return aboutReplyPDA
  }

  export function getAboutLv3ReplyPDA(commentSectionNamePrefix: string, commentSectionName: string, chatAccountPostCountIndex: number, postOwnerAddress: PublicKey)
  {
    const [aboutLv3ReplyPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("aboutLv3Reply"),
        new TextEncoder().encode(commentSectionNamePrefix),
        new TextEncoder().encode(commentSectionName),
        new anchor.BN(chatAccountPostCountIndex).toArrayLike(Uint8Array, "le", 16),
        postOwnerAddress.toBuffer()
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return aboutLv3ReplyPDA
  }

  export function getAboutLv4ReplyPDA(commentSectionNamePrefix: string, commentSectionName: string, chatAccountPostCountIndex: number, postOwnerAddress: PublicKey)
  {
    const [aboutLv4ReplyPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("aboutLv4Reply"),
        new TextEncoder().encode(commentSectionNamePrefix),
        new TextEncoder().encode(commentSectionName),
        new anchor.BN(chatAccountPostCountIndex).toArrayLike(Uint8Array, "le", 16),
        postOwnerAddress.toBuffer()
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return aboutLv4ReplyPDA
  }

  export function getIdeaStatsPDA()
  {
    const [ideaStatsPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("ideaStats")
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return ideaStatsPDA
  }

  export function getFEDStatsPDA()
  {
    const [fedStatsPDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("fedStats")
      ],
      anchorPrograms.chat.chatProgram.programId
    )
    return fedStatsPDA
  }

  function processCommentSectionName(commentSectionName: string)
  {
    if(commentSectionName.includes("Country: "))
    {
      const ZOOM_LONG_INDEX = 0
      const ZOOM_LAT_INDEX = 1

      const indexMatches = commentSectionName.match(/\d+/g)//Regex to match all numbers

      if(indexMatches)
        return [`Country: ${countryNameArray[indexMatches[0]]} State: ${countryStateNameArray[indexMatches[0]][indexMatches[1]]}`,
        countryStateNameArray[indexMatches[0]][indexMatches[1]],
        countryStateCoordinatesArray[indexMatches[0]][indexMatches[1]][ZOOM_LONG_INDEX],
        countryStateCoordinatesArray[indexMatches[0]][indexMatches[1]][ZOOM_LAT_INDEX]]
    }
    else
    {
      var newString

      newString = commentSectionName.replace(/(?<=[a-z])(?=[A-Z])/g, " ")//Regex to add space between strings like this -> BigFirstLetter
      return [newString.replace(/_/g, " ")]//Regex to replace all underscores
    }  
  }

  export default getChatProtocolCEOAccount
</script>