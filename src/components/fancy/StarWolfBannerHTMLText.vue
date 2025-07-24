<template>
  <div class="largeMarginTop flexCenterRowHeight">
    <StarWolf id="starWolf" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>

    <ion-text class="logoText"><span id="m4a" class="logoText">M<span id="foura" class="logoText">4A</span></span><br>
      PRo<span id="to" class="logoText">to</span><span id="col" class="logoText">col</span></ion-text>
  </div>
</template>

<script setup lang="ts">
  import { IonText } from '@ionic/vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
</script>

<style scoped>
  #starWolf
  {
    width: min(70vw, 800px);
    height: min(90vw, 800px)
  }

  .logoText
  {
    font-family: MetalGear;
    font-size: 207px
  }

  #m4a
  {
    /*margin-left: 109.4px*/
    margin-left: 109.7px
  }

  #foura 
  {
    letter-spacing: 40px
  }

  #to
  {
    letter-spacing: 4px
  } 

  #col
  {
    margin-left: 17px
  }  
</style>
