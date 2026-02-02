<template>
  <ion-button fill="clear" @click="openInfoPopover($event)">
    <ion-icon :src="informationCircle" color="dark"></ion-icon>
  </ion-button>
  <ion-popover
  class="infoButtonPopover popoverWidth"
  :is-open="infoPopoverOpen" 
  :event="event" 
  @didDismiss="infoPopoverOpen=false"
  :side="openSide"
  alignment="center">
    <ion-text align="center" class="preserveWhiteSpace infoButtonText">{{ infoMessage }}</ion-text>
  </ion-popover>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { IonIcon, IonButton, IonPopover, IonText } from '@ionic/vue'
  import { informationCircle } from 'ionicons/icons'

  defineProps(
  {
    infoMessage:
    {
      type: String
    },
    openSide:
    {
      type: String,
      default: 'top'
    }
  })

  var infoPopoverOpen = ref()
  var event = ref()

  function openInfoPopover(e: Event) 
  {
    event.value = e
    infoPopoverOpen.value = true
  }
</script>

<style scoped>
  ion-icon
  {
    width: 25px;
    height: 25px
  }

  .popoverWidth::part(content)
  {
    width: 355px
  }
</style>