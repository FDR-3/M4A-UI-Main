<template>
  <div class="progress-bar-container">
    <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    <ion-label class="timer" color="dark">{{ formattedTime }}</ion-label>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import { IonLabel } from "@ionic/vue"
  
  const props = defineProps(['secondsToCount', 'colorHexValue'])

  var remainingTime = ref(props.secondsToCount)
  const progress = ref(100)
  let timerInterval

  onMounted(() => 
  {
    startTimer()
  })

  onUnmounted(() =>
  {
    stopTimer()
  })

  const startTimer = () => 
  {
    timerInterval = setInterval(() => 
    {
      if (remainingTime.value > 0) 
      {
        remainingTime.value--
        progress.value = (remainingTime.value / props.secondsToCount) * 100
      } 
      else 
        stopTimer()
    }, 1000) //Update every second
  }

  const stopTimer = () => 
  {
    clearInterval(timerInterval)
  }

  const formattedTime = computed(() => 
  {
      const minutes = Math.floor(remainingTime.value / 60)
      const seconds = remainingTime.value % 60
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  })
</script>

<style scoped>
  .progress-bar-container 
  {
    width: 100%;
    border: 1px solid light-dark(#000000,#ffffff);
    position: relative;
    border-radius: 5px;
    overflow: hidden
  }

  .progress-bar 
  {
    height: 20px;
    background-color: v-bind(colorHexValue) !important;
    border-radius: 5px;
    width: 100%; /* Initial full width */
    transition: width 1s linear /* Smooth transition */
  }

  .timer
  {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: bold
  }
</style>