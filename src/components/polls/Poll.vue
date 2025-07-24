<template>
  <div>
    <h2 class="marginZero">{{ pollName }}</h2>
    <div>
      <ion-label>Total Spent: </ion-label>
      <ion-text>
        $<span class="rainbowText">
          {{ pollTotalSpentString }}
        </span>
      </ion-text>
    </div>
    <div>
      <ion-label>Spent On Up Votes: </ion-label>
      <ion-text>
        $<span class="rainbowText">
          {{ pollUpVoteSpentString }}
        </span>
      </ion-text>
    </div>
    <div>
      <ion-label>Spent On Down Votes: </ion-label>
      <ion-text>
        $<span class="poopText">
          {{ pollDownVoteSpentString }}
        </span>
      </ion-text>
    </div>
    <div>
      <ion-label>Up Vote Count: </ion-label>
      <ion-text>{{ pollUpVoteCount }}</ion-text>
    </div>
    <div>
      <ion-label>Down Vote Count: </ion-label>
      <ion-text>{{ pollDownVoteCount }}</ion-text>
    </div>
    <div>
      <ion-label>Vote Score: </ion-label>
      <ion-text>{{ pollNetVoteScore }}</ion-text>
    </div>

    <div class="">
    <div v-for="option in pollOptions" class="largeMarginTop">
      <div class="pollOptionAndVoteContainer">
        <div class="voteComponent thinBorder wideScreenUpVoteComponent">
          <PollUpVote
            :pollIndex="option.pollIndex"
            :pollOptionIndex="option.pollOptionIndex"
            :colorName="colorName"
            :colorHexValue="colorHexValue"
          />
        </div>
        <div class="pollOptionContainer">
          <h3 class="newLineText marginZero">{{ !option.pollOptionName.includes(':') ? option.pollOptionName : 
          option.pollOptionName.split(":")[0] + ':\n' + option.pollOptionName.split(":")[1] }}</h3>
          <div>
            <ion-label>Total Spent: </ion-label>
            <ion-text>
              $<span class="rainbowText">
                {{ parseVoteDollarAmountNoDollarSign(option.upVoteScore.add(option.downVoteScore)) }}
              </span>
            </ion-text>
          </div>
          <div>
            <ion-label>Spent On Up Votes: </ion-label>
            <ion-text>
              $<span class="rainbowText">
                {{ parseVoteDollarAmountNoDollarSign(option.upVoteScore) }}
              </span>
            </ion-text>
          </div>
          <div>
            <ion-label>Spent On Down Votes: </ion-label>
            <ion-text>
              $<span class="poopText">
                {{ parseVoteDollarAmountNoDollarSign(option.downVoteScore) }}
              </span>
            </ion-text>
          </div>
          <div>
            <ion-label>Up Vote Count: </ion-label>
            <ion-text>{{ option.upVoteCount }}</ion-text>
          </div>
          <div>
            <ion-label>Down Vote Count: </ion-label>
            <ion-text>{{ option.downVoteCount }}</ion-text>
          </div>
          <div>
            <ion-label>Vote Score: </ion-label>
            <ion-text>{{ option.upVoteScore.sub(option.downVoteScore) }}</ion-text>
          </div>
        </div>
    
        <div class="voteContainer">
          <div class="voteComponent thinBorder smallScreenUpVoteComponent">
            <PollUpVote
              :pollIndex="option.pollIndex"
              :pollOptionIndex="option.pollOptionIndex"
              :colorName="colorName"
              :colorHexValue="colorHexValue"
            />
          </div>
          <div class="voteComponent thinBorder">
            <PollDownVote
              :pollIndex="option.pollIndex"
              :pollOptionIndex="option.pollOptionIndex"
              :colorName="colorName"
              :colorHexValue="colorHexValue"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
    <PollRecords
    :uniqueVoterHashMap="uniqueVoterHashMap"
    :pollRecordsTableData="pollRecordsTableData"
    :uniquePollRecordsTableData="uniquePollRecordsTableData"
    :isPollRecordsTableLoading="isPollRecordsTableLoading"
    :isUniquePollRecordsTableLoading="isUniquePollRecordsTableLoading"/>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { IonText, IonLabel } from '@ionic/vue'
  import PollUpVote from '/src/components/polls/PollUpVote.vue'
  import PollDownVote from '/src/components/polls/PollDownVote.vue'
  import PollRecords from '/src/components/polls/PollRecords.vue'
  import { polls, pollVoteRecords } from '/src/assets/globalStates/chat/Polls.vue'
  import { getCustomOrTrimmedUserDisplayName,
    getUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { parseVoteDollarAmountNoDollarSign, parseVoteDollarAmountString } from '/src/assets/contracts/WalletHelper.vue'
  import { convertUnixTimeToLocalDate, convertUnixTimeToLocalTime } from '/src/assets/helperFunctions/UnixTimeStampHelper.ts'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { trimAddress } from '/src/assets/contracts/WalletHelper.vue'
  import * as anchor from "@coral-xyz/anchor"

  const props = defineProps(['pollIndex', 'colorName', 'colorHexValue'])

  var uniqueVoterHashMap = ref()

  var pollName = ref("")
  var pollTotalSpentString = ref()
  var pollUpVoteSpentString = ref()
  var pollDownVoteSpentString = ref()
  var pollUpVoteCount = ref()
  var pollDownVoteCount = ref()
  var pollNetVoteScore = ref()

  var pollOptions = ref()

  var pollRecordsTableData = ref()
  var uniquePollRecordsTableData = ref()
  var isPollRecordsTableLoading = ref(true)
  var isUniquePollRecordsTableLoading = ref(true)

  onMounted(() => 
  { 
    var poll

    if(polls.data)
      poll = polls.data[props.pollIndex]

    if(poll)
    {
      pollName.value = poll.pollName
      pollTotalSpentString.value = parseVoteDollarAmountNoDollarSign(poll.upVoteScore.add(poll.downVoteScore))
      pollUpVoteSpentString.value = parseVoteDollarAmountNoDollarSign(poll.upVoteScore)
      pollDownVoteSpentString.value = parseVoteDollarAmountNoDollarSign(poll.downVoteScore)
      pollUpVoteCount.value = poll.upVoteCount
      pollDownVoteCount.value = poll.downVoteCount
      pollNetVoteScore.value = poll.upVoteScore.sub(poll.downVoteScore)

      pollOptions.value = poll.pollOptions
    }
    else
    {
      pollName.value = "No Poll Found"
      pollTotalSpentString.value = "0.00"
      pollUpVoteSpentString.value = "0.00"
      pollDownVoteSpentString.value = "0.00"
      pollUpVoteCount.value = 0
      pollDownVoteCount.value = 0
      pollNetVoteScore.value = 0

      pollOptions.value = []
    }

    sortPollVoteRecords(props.pollIndex)
    isPollRecordsTableLoading.value = false
    isUniquePollRecordsTableLoading.value =false
  })

  watch(polls, () =>
  {
    const poll = polls.data[props.pollIndex]
    if(poll)
    {
      pollName.value = poll.pollName
      pollTotalSpentString.value = parseVoteDollarAmountNoDollarSign(poll.upVoteScore.add(poll.downVoteScore))
      pollUpVoteSpentString.value = parseVoteDollarAmountNoDollarSign(poll.upVoteScore)
      pollDownVoteSpentString.value = parseVoteDollarAmountNoDollarSign(poll.downVoteScore)
      pollUpVoteCount.value = poll.upVoteCount
      pollDownVoteCount.value = poll.downVoteCount
      pollNetVoteScore.value = poll.upVoteScore.sub(poll.downVoteScore)

      pollOptions.value = poll.pollOptions
    }
    else
    {
      pollName.value = "No Poll Found"
      pollTotalSpentString.value = "0.00"
      pollUpVoteSpentString.value = "0.00"
      pollDownVoteSpentString.value = "0.00"
      pollUpVoteCount.value = 0
      pollDownVoteCount.value = 0
      pollNetVoteScore.value = 0

      pollOptions.value = []
    }
  })

  watch(pollVoteRecords, () =>
  {
    sortPollVoteRecords(props.pollIndex)
  })

  watch(customUserNameHashMap, () =>
  {
    if(!pollRecordsTableData.value)
      return

    for(var i=0; i<pollRecordsTableData.value.length; i++)
    {
      const chatAccount = customUserNameHashMap.map.get(pollRecordsTableData.value[i].voterAddress.toBase58())

      if(chatAccount.useCustomName)
      {
        pollRecordsTableData.value[i].displayName = chatAccount.userName
        pollRecordsTableData.value[i].displayNamePossiblyTrimmed = chatAccount.userName
      }
      else
      {
        pollRecordsTableData.value[i].displayName = pollRecordsTableData.value[i].voterAddress
        pollRecordsTableData.value[i].displayNamePossiblyTrimmed = trimAddress(pollRecordsTableData.value[i].voterAddress)
      }
    }

    for(var i=0; i<uniquePollRecordsTableData.value.length; i++)
    {
      const chatAccount = customUserNameHashMap.map.get(uniquePollRecordsTableData.value[i].voterAddress.toBase58())

      if(chatAccount.useCustomName)
      {
        uniquePollRecordsTableData.value[i].displayName = chatAccount.userName
        uniquePollRecordsTableData.value[i].displayNamePossiblyTrimmed = chatAccount.userName
      }
      else
      {
        uniquePollRecordsTableData.value[i].displayName = uniquePollRecordsTableData.value[i].voterAddress
        uniquePollRecordsTableData.value[i].displayNamePossiblyTrimmed = trimAddress(uniquePollRecordsTableData.value[i].voterAddress)
      }
    }
  })

  function sortPollVoteRecords(pollIndex: number)
  {
    if(!pollVoteRecords.data || !polls.data)
      return

    type ContributionTotalMap = 
    {
      voterMapIndex: number,
      netVoteScoreContribution: number,
      netVoteScoreContributionString: string,
      absoluteVoteAmountString: string,
      amountSpentString: string
    }

    var uniqueVoterPollOptionMap: Map<string, ContributionTotalMap> = new Map() //key-string: user address+poll option, value-[number: index for user in the unique table, number: user contribution total]

    type UniqueVoterPollOption = 
    {
      displayName: string,
      displayNamePossiblyTrimmed: string,
      voterAddress: string,
      pollOptionName: string,
      netVoteScoreContribution: anchor.BN,
      netVoteScoreContributionString: string,
      absoluteVoteAmount: number,
      absoluteVoteAmountString: string,
      amountSpentString: string
    }

    var pollRecords: any[] = []
    var uniqueVoterPollOptionData: UniqueVoterPollOption[] = []

    for(var i=0; i<pollVoteRecords.data.length; i++)
    {
      if(pollVoteRecords.data[i].account.pollIndex.eq(new anchor.BN(pollIndex)))
      {
        var pollVoteRecord = pollVoteRecords.data[i].account
        const pollOption = polls.data[props.pollIndex].pollOptions[pollVoteRecord.pollOptionIndex]

        //Needed to be able to sort properly with Anchor BN numbers, only some id's have that problem for some reason
        //if(typeof pollVoteRecord.pollRecordId != "number")
          //pollVoteRecord.pollRecordId = pollVoteRecord.pollRecordId.toNumber()

        pollVoteRecord.voterAddress = pollVoteRecord.voterAddress
        pollVoteRecord.displayName = getUserDisplayName(pollVoteRecord.voterAddress)
        pollVoteRecord.displayNamePossiblyTrimmed = getCustomOrTrimmedUserDisplayName(pollVoteRecord.voterAddress)
        pollVoteRecord.pollOptionName = pollOption.pollOptionName
        pollVoteRecord.creationTimeString = convertUnixTimeToLocalTime(pollVoteRecord.unixCreationTimeStamp)
        pollVoteRecord.creationDateString = convertUnixTimeToLocalDate(pollVoteRecord.unixCreationTimeStamp)
        pollVoteRecord.absoluteVoteAmount = Math.abs(pollVoteRecord.voteAmount)
        pollVoteRecord.absoluteVoteAmountString = Math.abs(pollVoteRecord.voteAmount).toLocaleString()
        pollVoteRecord.amountSpentString = parseVoteDollarAmountString(pollVoteRecord.absoluteVoteAmount)
        //pollVoteRecord.voteAmount = pollVoteRecord.voteAmount.toNumber()//anchor BN's don't sort properly

        //Set vote score string
        if(pollVoteRecord.voteAmount > 0)
          pollVoteRecord.voteAmountString = "+" + pollVoteRecord.voteAmount.toLocaleString()
        else
          pollVoteRecord.voteAmountString = pollVoteRecord.voteAmount.toLocaleString()
        
        pollRecords.push(pollVoteRecord)

        //Update unique poll voter option hash map
        const existingVoterMapEntry = uniqueVoterPollOptionMap.get(pollRecords[i].voterAddress + pollOption.pollOptionName)

        //If voter has already appeared in records, set display name and increment or decrement unique vote values
        if(existingVoterMapEntry)
        {
          pollRecords[i].displayName = getUserDisplayName(pollRecords[i].voterAddress)
          pollRecords[i].displayNamePossiblyTrimmed = getCustomOrTrimmedUserDisplayName(pollRecords[i].voterAddress)

          const newVoteTotal = uniqueVoterPollOptionData[existingVoterMapEntry.voterMapIndex].netVoteScoreContribution + pollRecords[i].voteAmount
          uniqueVoterPollOptionData[existingVoterMapEntry.voterMapIndex].netVoteScoreContribution = newVoteTotal
          const newAbsoluteVoteTotal = uniqueVoterPollOptionData[existingVoterMapEntry.voterMapIndex].absoluteVoteAmount + Math.abs(pollRecords[i].voteAmount)
          uniqueVoterPollOptionData[existingVoterMapEntry.voterMapIndex].absoluteVoteAmount = newAbsoluteVoteTotal
          uniqueVoterPollOptionData[existingVoterMapEntry.voterMapIndex].absoluteVoteAmountString = newAbsoluteVoteTotal.toLocaleString()
          uniqueVoterPollOptionData[existingVoterMapEntry.voterMapIndex].amountSpentString = parseVoteDollarAmountString(uniqueVoterPollOptionData[existingVoterMapEntry.voterMapIndex].absoluteVoteAmount)

          //Set net vote score contribution string
          if(newVoteTotal > 0)
            uniqueVoterPollOptionData[existingVoterMapEntry.voterMapIndex].netVoteScoreContributionString = "+" + newVoteTotal.toLocaleString()
          else if(newVoteTotal < 0)
            uniqueVoterPollOptionData[existingVoterMapEntry.voterMapIndex].netVoteScoreContributionString = newVoteTotal.toLocaleString()

          //Update hashmap with totals so non unique tables can access that data
          existingVoterMapEntry.netVoteScoreContribution = newVoteTotal
          existingVoterMapEntry.netVoteScoreContributionString = uniqueVoterPollOptionData[existingVoterMapEntry.voterMapIndex].netVoteScoreContributionString
          existingVoterMapEntry.absoluteVoteAmountString = newAbsoluteVoteTotal.toLocaleString()
          existingVoterMapEntry.amountSpentString = parseVoteDollarAmountString(newAbsoluteVoteTotal)
          uniqueVoterPollOptionMap.set(pollRecords[i].voterAddress + pollOption.pollOptionName, existingVoterMapEntry)
        }
        //If voter has not appeared in records yet, add the unique voter, set display name, and increment or decrement the unique vote value
        else
        {
          var newVoter: UniqueVoterPollOption =
          {
            displayName: "",
            displayNamePossiblyTrimmed: "",
            voterAddress: pollRecords[i].voterAddress,
            pollOptionName: pollOption.pollOptionName,
            netVoteScoreContribution: pollRecords[i].voteAmount,
            netVoteScoreContributionString: "",
            absoluteVoteAmount: Math.abs(pollRecords[i].voteAmount),
            absoluteVoteAmountString: Math.abs(pollRecords[i].voteAmount).toLocaleString(),
            amountSpentString: parseVoteDollarAmountString(Math.abs(pollRecords[i].voteAmount))
          }

          uniqueVoterPollOptionData.push(newVoter)

          const displayName = getUserDisplayName(pollRecords[i].voterAddress)
          const displayNamePossiblyTrimmed = getCustomOrTrimmedUserDisplayName(pollRecords[i].voterAddress)

          pollRecords[i].displayName = displayName
          pollRecords[i].displayNamePossiblyTrimmed = displayNamePossiblyTrimmed
          uniqueVoterPollOptionData[uniqueVoterPollOptionData.length-1].displayName = displayName
          uniqueVoterPollOptionData[uniqueVoterPollOptionData.length-1].displayNamePossiblyTrimmed = displayNamePossiblyTrimmed

          //Set positive net vote score contribution string
          if(uniqueVoterPollOptionData[uniqueVoterPollOptionData.length-1].netVoteScoreContribution > 0)
            uniqueVoterPollOptionData[uniqueVoterPollOptionData.length-1].netVoteScoreContributionString = "+" + uniqueVoterPollOptionData[uniqueVoterPollOptionData.length-1].netVoteScoreContribution.toLocaleString()
          else if(uniqueVoterPollOptionData[uniqueVoterPollOptionData.length-1].netVoteScoreContribution < 0)
            uniqueVoterPollOptionData[uniqueVoterPollOptionData.length-1].netVoteScoreContributionString = uniqueVoterPollOptionData[uniqueVoterPollOptionData.length-1].netVoteScoreContribution.toLocaleString()

          var newVoterMapObject: ContributionTotalMap = 
          {
            voterMapIndex: uniqueVoterPollOptionData.length-1,
            netVoteScoreContribution: pollRecords[i].voteAmount,
            netVoteScoreContributionString: uniqueVoterPollOptionData[uniqueVoterPollOptionData.length-1].netVoteScoreContributionString,
            absoluteVoteAmountString: Math.abs(pollRecords[i].voteAmount).toLocaleString(),
            amountSpentString: parseVoteDollarAmountString(Math.abs(pollRecords[i].voteAmount))
          }

          uniqueVoterPollOptionMap.set(pollRecords[i].voterAddress + pollOption.pollOptionName, newVoterMapObject)
        }
      }
    }

    uniqueVoterHashMap.value = uniqueVoterPollOptionMap

    pollRecordsTableData.value = pollRecords.sort((a: any, b: any) => b.id - a.id)
    uniquePollRecordsTableData.value = uniqueVoterPollOptionData
  }
</script>

<style scoped>
  ion-input
  {
    --highlight-color: v-bind(colorHexValue)
  }

  h2
  {
    font-size: min(7vw, 30px)
  }

  h3
  {
    font-size: min(6vw, 25px)
  }

  ion-text
  {
    font-size: min(7vw, 20px)
  }

  .newLineText
  {
    white-space: pre-line;
  }

  .voteComponent
  {
    padding: 5px
  }

  @media screen and (min-width: 1021px) 
  { 
    .pollContainer
    {
      display: flex;
      flex-direction: row
    }

    .pollOptionAndVoteContainer
    {
      /*width: 357px;*/
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center
    }

    .pollOptionContainer
    {
      width: 370px
    }

    .voteContainer
    {
      display: flex;
      flex-direction: row;
      gap: 10px
    }

    .smallScreenUpVoteComponent
    {
      display: none
    }

    .wideScreenUpVoteComponent
    {
      display: flex
    }
  }

  @media screen and (min-width: 601px)  and (max-width: 1020px) 
  { 
    .pollContainer
    {
      display: flex;
      flex-direction: column
    }

    .pollOptionAndVoteContainer
    {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center
    }

    .voteContainer
    {
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 10px
    }

    .smallScreenUpVoteComponent
    {
      display: flex
    }

    .wideScreenUpVoteComponent
    {
      display: none
    }
  }

  @media screen and (max-width: 600px) 
  { 
    .pollContainer
    {
      display: flex;
      flex-direction: column;
      align-items: center
    }

    .voteContainer
    {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px
    }

    .pollDownVoteContainer
    {
      margin-top: 20px
    }

    .smallScreenUpVoteComponent
    {
      display: flex
    }

    .wideScreenUpVoteComponent
    {
      display: none
    }
  } 
</style>