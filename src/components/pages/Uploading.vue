<template>
  <div>
    <h2>Videos currently being uploaded, refresh the page and check back later if it's still not up after the refresh</h2>
    <h2>Lots of Videos to Upload</h2>
    <!--<h2>Hit the youtube daily upload limit for new channels, and ID takes up to 24 hours to verify 
      <ion-button fill="clear" @click="giveSadSadPepeFeelsBadManCredit()">
        <FeelsBadSVG style="width: min(10vw, 50px); height: min(10vw, 55px)"/>
      </ion-button>
    </h2>-->
  </div>
</template>

<script setup lang="ts">
  import { IonButton } from '@ionic/vue'
  import { giveSadSadPepeFeelsBadManCredit } from '/src/assets/helperFunctions/credits.ts'
  import FeelsBadSVG from '/src/assets/svg/feels-bad-svg.vue'
</script>