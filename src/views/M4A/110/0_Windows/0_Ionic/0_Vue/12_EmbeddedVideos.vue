<template>
  <div>
    <h1>Embedded Videos 9/31</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/12_1EmbeddedVideos/Embedded Videos.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/rfR4wt0J7q0?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources & Formats</h1>
      <p align="left"><br>
        <p>Links<br>
          <a href="https://dn720807.ca.archive.org/0/items/TheBoondocks-4K-Season1-Complete-Singecku/The%20Boondocks%20E05%20%5B4K%5D%20A%20Date%20with%20the%20Health%20Inspector.ia.mp4" target="_blank">Boon Docks</a>
        </p>
        
        <strong>Youtube Embedded</strong><br>
        <ion-text>Format: src="https://www.youtube.com/embed/{VIDEO-ID}"</ion-text><br>
        <ion-text>Example: src="https://www.youtube.com/embed/e-rSc7lAvXE"</ion-text><br><br>

        <strong>Tiktok Embedded</strong><br>
        <ion-text>Format: src="https://www.tiktok.com/player/v1/{VIDEO-ID}"</ion-text><br>
        <ion-text>Example: src="https://www.tiktok.com/player/v1/7438674146080328991"</ion-text><br><br>

        <strong>Twitch Embedded</strong><br>
        <ion-text>Format: src="https://player.twitch.tv/?video=v{VIDEO-ID}&parent={WEBSITE-DOMAIN}"</ion-text><br>
        <ion-text>Example: src="https://player.twitch.tv/?video=v2453697468&parent=localhost"</ion-text><br>
        <ion-text>Example: src="https://player.twitch.tv/?video=v2453697468&parent=m4a.io"</ion-text><br>
        <ion-text>Example: src="https://player.twitch.tv/?video=v2453697468&parent=m4a.io&autoplay=false"</ion-text><br><br>

        <strong>Facebook Embedded</strong><br>
        <ion-text>Format: src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F{VIDEO-ID}"</ion-text><br>
        <ion-text>Example: src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1290269885955395"</ion-text><br><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IonText } from '@ionic/vue'
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'
</script>