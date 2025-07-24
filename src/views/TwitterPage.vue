<template>
  <ion-page>
    <ion-content>
      <div class="largeMarginTop flexCenterColumn">
        <div>
          <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazN10tWoEI527AkmeVxopsR6nYgKDZFazU8GXHu" style="max-width: 80vw"/>
        </div>
        <p>Lololololol M4A Protocol does not have a Twitter account</p>
        <p>Don't get scammed by anyone suggesting otherwise :X</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { IonContent, IonPage } from '@ionic/vue'

  if(localStorage.getItem("userTheme") === "lightTheme") 
  {
    document.documentElement.classList.toggle('ion-palette-dark', false)
  }
  else
  {
    document.documentElement.classList.toggle('ion-palette-dark', true)
  }
</script>