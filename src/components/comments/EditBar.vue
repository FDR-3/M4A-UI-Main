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
  @media screen and (min-width: 1115px)  
  {
    .editButtons
    {
      
      margin-bottom: -15px;
      display: flex;
      justify-content: right;
      margin-right: -10px
    } 
  }

  @media screen and (max-width: 1114.9px) 
  {
    .editButtons
    {
      margin-bottom: -15px;
      display: flex;    
    } 
  }
</style>
