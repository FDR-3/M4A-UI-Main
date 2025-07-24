<template>
  <br id="topOfCountDown">
  <div>
    <CountDownSVG id="countDownSVG" :fill="darkTheme.value ? '#FFFFFF' : '#000000'" slot="icon-only"/>
    <!--<ion-text  class="metal countDownLine1">
      <span class="metal countDownLine1 letterSpace2px">F</span>i<span class="metal countDownLine1 letterSpace7px">n</span><span class="metal countDownLine1 letterSpace2px">a</span>l 
      Co<span class="metal countDownLine1 letterSpace1px">u</span>nt
      <span class="metal countDownLine1 letterSpace7px">D</span><span class="metal countDownLine1 letterSpace8px">o</span><span class="metal countDownLine1 letterSpace1px">w</span>n
    </ion-text><br>
    <ion-text class="metal countDownLine2">
      <span class="metal countDownLine2 letterSpace3px">S</span><span class="metal countDownLine2 letterSpace1px">o</span><span class="metal countDownLine2 letterSpace2px">u</span>th
      <span class="metal countDownLine2 letterSpace11px">C</span><span class="metal countDownLine2 letterSpace2px">a</span>r<span class="metal countDownLine2 letterSpace0px">o</span>li<span class="metal countDownLine2 letterSpace12px">n</span>a
      <br><span class="metal countDownLine2 letterSpace1px">B</span><span class="metal countDownLine2 letterSpace1px">E</span>TA
    </ion-text>-->
    <br>
    <ion-text class="countDownLine3">
      Days {{ daysLeft }}<br> Hours {{ hoursLeft }}<br> Minutes {{ minutesLeft }}<br> Seconds {{ secondsLeft }}<br> Miliseconds {{ milisecondsLeft }}
    </ion-text>
    <br>
    <br>
    <div v-if="countDownComplete">
      <ion-text class="rainbowText" id="betaStartText">M4A Protocol<br>South Carolina Beta<br></ion-text>
      <span class="emojiText">🥳</span><ion-text class="rainbowText" id="betaStartText">Has Begun</ion-text><span class="emojiText">🥳</span>
    </div>
    <br>
    <br>
  </div>

  <audio id="betaSFX">
    <source src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNqXwWoJsaJf4DGuPFXQHSIMnUleZK8wYzxCok" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { IonText } from '@ionic/vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import CountDownSVG from '/src/assets/svg/count-down-svg.vue'

  var daysLeft = ref()
  var hoursLeft = ref()
  var minutesLeft = ref()
  var secondsLeft = ref()
  var milisecondsLeft = ref()
  var countDownComplete = ref(false)

  let intervalId: any;

  //Get unix time stamp, July 04, 2025
  //console.log(new Date(2025, 8, 9).getTime())// Month is 0 index
  const BETA_LAUNCH_DATE = 1757401200000;//typescript/javascript unix time stamps are in milli seconds. Solana is in seconds, have to multiple Solana time stamp by 1000 to make them match and divide/vice versa going backwards.

  onMounted(() =>
  {
    intervalId = setInterval(() => 
    {
      const newDate = new Date()

      // Subtract the known epoch from the current timestamp to get the difference in milliseconds
      const differenceMillis = BETA_LAUNCH_DATE - newDate

      //Convert milliseconds to seconds, minutes, hours, and days
      //Convert from milliseconds to days
      const remainingDays = Math.floor(differenceMillis / (1000 * 60 * 60 * 24))
      const remainderAfterDays = differenceMillis / (1000 * 60 * 60 * 24) - remainingDays

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
        milisecondsLeft.value = 0

        clearInterval(intervalId);
        intervalId = undefined

        countDownComplete.value = true
        const audio = document.getElementById("betaSFX") as HTMLMediaElement
        audio.play()
      }

    }, 50)

    setTimeout(() => 
      {
        document.getElementById("topOfCountDown")?.scrollIntoView() //Scroll Count Down into view 
      }, 20)
  })

  onUnmounted(() =>
  {
    if(intervalId != undefined)
    {
      clearInterval(intervalId);
      intervalId = undefined
    }
  })
  

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