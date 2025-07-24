<template>
  <div>
    <h1>Clean Up & NOT MarginFi D: 28/30</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/33_1CleanUpAndMarginFi.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.pngtosvg.com/" target="_blank">Png to SVG</a><br>
        <a href="https://removal.ai/upload/" target="_blank">removal.ai: background remover</a><br>
        <a href="https://youtu.be/jsuNjCAngnQ?t=64" target="_blank">Theo - t3.gg: (timestamp) public folder</a><br>
        <a href="https://favicon.io/favicon-converter/" target="_blank">favicon.io: favicon-converter</a><br>
        <a href="https://ionic.io/ionicons" target="_blank">ionicons</a><br>
        <a href="https://www.freeconvert.com/mp3-to-wav" target="_blank">FreeConvert: MP3 to WAV</a><br>
      </p>

      <strong>Set different key pairs in Linux Solana Client. Commands after "cmd: " below</strong><br>
      <ion-text>ledger hardware wallet-cmd: solana config set --keypair usb://ledger</ion-text><br>
      <ion-text>normal keypair stored in file-cmd: solana config set --keypair ~/.config/solana/id.json</ion-text><br><br>

      <strong>Install usbipd so that windows linux subsystem can detect windows USB (ledger wallet)</strong><br>
      <ion-text>winget install --interactive --exact dorssel.usbipd-win</ion-text><br>

      <strong>Bind ledger usb</strong><br>
      <ion-text>usbipd list</ion-text><br>
      <ion-text>usbipd bind --busid [busid]</ion-text>
      <ion-text>usbipd attach --wsl --busid [busid]</ion-text>

    </div>
  </div>
</template>

<script setup lang="ts">
  import { IonText } from '@ionic/vue'
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'
  import Uploading from '/src/components/pages/Uploading.vue'
</script>