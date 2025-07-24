<template>
  <br id="topOfCountDown">
  <div>
    <h1>Dead Man's Break</h1>
    <br>
    <ion-text class="countDownLine3">
      Days {{ daysLeft }}<br> Hours {{ hoursLeft }}<br> Minutes {{ minutesLeft }}<br> Seconds {{ secondsLeft }}<br> Miliseconds {{ milisecondsLeft }}
    </ion-text>
    <br>
    <br>
    <ion-button v-if="connectedWallet.addressString==adminAccounts.chatCEOAddress && !anchorPrograms.areChatQOLAccountsReady" color="dark" :disabled="true">Quality Of Life Accounts Not Initialized</ion-button>
    <ion-button color="dark" v-else-if="connectedWallet.addressString==adminAccounts.chatCEOAddress" @click="clockInDeadMansBreak()">
      Clock In
    </ion-button>

    <br>
    <br>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, inject, watch } from 'vue'
  import { IonText, IonButton } from '@ionic/vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { confirmChatTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import * as anchor from "@coral-xyz/anchor"

  const toast = inject('toast')

  var daysLeft = ref(0)
  var hoursLeft = ref(0)
  var minutesLeft = ref(0)
  var secondsLeft = ref(0)
  var milisecondsLeft = ref("000")
  var countDownComplete = ref(false)

  var intervalId: any;

  var currentDeadMansBreakTimeStamp: any

  onMounted(() =>
  {
    currentDeadMansBreakTimeStamp = anchorPrograms.deadMansBreakTimeStamp

    if(currentDeadMansBreakTimeStamp == 0)
      return

    runDeadMansBreakCountDown()
  })

  onUnmounted(() =>
  {
    if(intervalId != undefined)
    {
      clearInterval(intervalId);
      intervalId = undefined
    }
  })

  watch(anchorPrograms, () =>
  {
    if(anchorPrograms.deadMansBreakTimeStamp == 0 ||
    anchorPrograms.deadMansBreakTimeStamp.eq(new anchor.BN(0)) ||
    anchorPrograms.deadMansBreakTimeStamp.eq(currentDeadMansBreakTimeStamp))
      return

    currentDeadMansBreakTimeStamp = anchorPrograms.deadMansBreakTimeStamp

    if(intervalId != undefined)
    {
      clearInterval(intervalId);
      intervalId = undefined
    }

    runDeadMansBreakCountDown()
  })

  function runDeadMansBreakCountDown()
  {
    intervalId = setInterval(() => 
    {
      const newDate = new Date()/1000 //divide by 1000 since typescript/javascript time stamp is in mili seconds, but Solana time stamp is in seconds

      // Subtract the known epoch from the current timestamp to get the difference in milliseconds
      const differenceSeconds = anchorPrograms.deadMansBreakTimeStamp.toNumber() + anchorPrograms.deadMan45DaysUnixNum - newDate

      //Convert seconds to minutes, hours, and days
      //Convert from seconds to days
      const remainingDays = Math.floor(differenceSeconds / (60 * 60 * 24))
      const remainderAfterDays = differenceSeconds / (60 * 60 * 24) - remainingDays

      //Convert from days to hours
      const remainingHours = Math.floor(remainderAfterDays * 24)
      const remainderAfterHours = remainderAfterDays * 24 - remainingHours

      //Convert from hours to minutes
      const remainingMinutes = Math.floor(remainderAfterHours * 60)
      const remainderAfterMinutes = remainderAfterHours * 60 - remainingMinutes

      //Convert from minutes to seconds
      const remainingSeconds = Math.floor(remainderAfterMinutes * 60)
      const remainderAfterSeconds = remainderAfterMinutes * 60 - remainingSeconds

      //Convert from minutes to seconds
      const remainingMilliseconds = Math.floor(remainderAfterSeconds * 1000)

      daysLeft.value = remainingDays
      hoursLeft.value = remainingHours
      minutesLeft.value = remainingMinutes
      secondsLeft.value = remainingSeconds
      milisecondsLeft.value = String(remainingMilliseconds).padStart(3, '0')

      if(daysLeft.value < 0)
      {
        daysLeft.value = 0
        hoursLeft.value = 0
        minutesLeft.value = 0
        secondsLeft.value = 0
        milisecondsLeft.value = "000"

        clearInterval(intervalId);
        intervalId = undefined

        countDownComplete.value = true
      }
    }, 50)
  }

  async function clockInDeadMansBreak()
  {
    try
    {
      const tx = await anchorPrograms.chat.chatProgram.methods.clockInDeadMansBreak().rpc()
      await confirmChatTransaction(tx, toast, "clock_in_dead_mans_break")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "clock_in_dead_mans_break")
    }
  }
</script>

<style scoped>
  #countDownSVG
  {
    margin-bottom: 12px;
    margin-left: -4px;
    width: min(80vw, 750px);
    height: min(21vw, 200px)
  }

  .countDownLine1
  {
    font-size: min(6vw, 50px)
  }

  .countDownLine2
  {
    font-size: min(8.7vw, 80px)
  }

  .letterSpace0px
  {
    letter-spacing: -1px
  }

  .letterSpace1px
  {
    letter-spacing: 1px
  }

  #betaStartText
  {
    font-size: min(5vw, 30px)

  }

  @media screen and (min-width: 1000px) 
  { 
    .letterSpace2px
    {
      letter-spacing: 2px
    }

    .letterSpace3px
    {
      letter-spacing: 3px
    }

    .letterSpace4px
    {
      letter-spacing: 4px
    }

    .letterSpace7px
    {
      letter-spacing: 7px
    }

    .letterSpace8px
    {
      letter-spacing: 8px
    }

    .letterSpace11px
    {
      letter-spacing: 11px
    }

    .letterSpace12px
    {
      letter-spacing: 12px
    }
  }

  @media screen and (min-width: 751px) and (max-width: 999px) 
  { 
    .letterSpace2px
    {
      letter-spacing: 2px
    }

    .letterSpace3px
    {
      letter-spacing: 3px
    }

    .letterSpace4px
    {
      letter-spacing: 4px
    }

    .letterSpace7px
    {
      letter-spacing: 7px
    }

    .letterSpace8px
    {
      letter-spacing: 8px
    }

    .letterSpace11px
    {
      letter-spacing: 10px
    }

    .letterSpace12px
    {
      letter-spacing: 10px
    }
  }

  @media screen and (min-width: 625px) and (max-width: 750px) 
  { 
    .letterSpace2px
    {
      letter-spacing: 2px
    }

    .letterSpace3px
    {
      letter-spacing: 2px
    }

    .letterSpace4px
    {
      letter-spacing: 3px
    }

    .letterSpace7px
    {
      letter-spacing: 7px
    }

    .letterSpace8px
    {
      letter-spacing: 7px
    }

    .letterSpace11px
    {
      letter-spacing: 7px
    }

    .letterSpace12px
    {
      letter-spacing: 7px
    }
  }

  @media screen and (min-width: 501px) and (max-width: 624px) 
  { 
    .letterSpace2px
    {
      letter-spacing: 1px
    }

    .letterSpace3px
    {
      letter-spacing: 1px
    }

    .letterSpace4px
    {
      letter-spacing: 3px
    }

    .letterSpace7px
    {
      letter-spacing: 4px
    }

    .letterSpace8px
    {
      letter-spacing: 4px
    }

    .letterSpace11px
    {
      letter-spacing: 4px
    }

    .letterSpace12px
    {
      letter-spacing: 4px
    }
  }

  @media screen and (max-width: 500px) 
  { 
    .letterSpace2px
    {
      letter-spacing: 1px
    }

    .letterSpace3px
    {
      letter-spacing: 1px
    }

    .letterSpace4px
    {
      letter-spacing: 2px
    }

    .letterSpace7px
    {
      letter-spacing: 3px
    }

    .letterSpace8px
    {
      letter-spacing: 4px
    }

    .letterSpace11px
    {
      letter-spacing: 3px
    }

    .letterSpace12px
    {
      letter-spacing: 3px
    }
  }
</style>