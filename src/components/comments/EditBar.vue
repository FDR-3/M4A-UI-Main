<template>
  <div class="editButtons">
    <ion-button @click="$emit('saveEdit')" :color="colorName" fill="clear">
      <ion-label>Save</ion-label>
    </ion-button>
    <ion-button @click="$emit('cancelEdit')" :color="colorName" fill="clear">
      <ion-label>Cancel</ion-label>
    </ion-button>
  </div>
</template>

<script setup lang="ts">
  import { IonButton, IonLabel } from '@ionic/vue'

  defineProps(['colorName'])
</script>

<style scoped>
  ion-button
  {
    --padding-top: 0;
    --padding-bottom: 0;
    --padding-start: 0;
    --padding-end: 0;
  }

  .editButtons
  {
    margin-bottom: -15px;
    display: flex;
    gap: 20px
  } 

  @media screen and (min-width: 1115px)  
  {
    .editButtons
    {
      justify-content: right
    } 
  }
</style>
