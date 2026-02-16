<template>
  <div v-if="navigation.menuIndex!=MenuIndex.Jesus">
    <ion-button id="settingsButton" fill="clear" @click="openSettingsModal()"
    >
      <ion-icon id="settingsIcon" color="dark" :src="settingsSharp"></ion-icon>
    </ion-button>

    <ion-modal :is-open="isSettingsModalOpen" @didDismiss="isSettingsModalOpen=false">
      <ion-content class="ion-padding">
        <div class="flexCenterColumn">
          <h2 style="margin-top: 0">Settings</h2>
          <p>Place Holder</p>
          <p>Your settings options go here...</p>
          
          <ion-button @click="isSettingsModalOpen=false">Save & Close</ion-button>
        </div>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { navigation, MenuIndex } from '/src/assets/globalStates/Navigation.vue'
  import { IonButton, IonIcon, IonModal, IonContent, modalController } from '@ionic/vue'
  import { settingsSharp } from 'ionicons/icons'

  var isSettingsModalOpen = ref(false)

  function openSettingsModal()
  {
    isSettingsModalOpen.value = true
  }
</script>

<style scoped>
  #settingsButton
  {
    margin-left: -11px;
    margin-right: -17px;
    padding: 0px
  }

  #settingsIcon
  {
    width: min(30px, 9vw);
    margin: 0px;
    height: 27px
  }

  ion-modal
  {
    --width: 90%;      /* How wide the box is */
    --max-width: 400px; /* Prevents it from being too huge on desktop */
    --height: 50%; /* Adjusts height to your settings content */
    --border-radius: 16px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4)
  }

  /* Optional: Adjust the inner content background */
  ion-modal::part(content)
  {
    border-radius: 16px;
  }

  ion-modal::part(backdrop)
  {
    background-color: rgb(0, 0, 0);
    opacity: 0.5 /* Higher number = darker background */
  }
</style>