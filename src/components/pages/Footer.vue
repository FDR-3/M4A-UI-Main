<template>
  <ion-footer>
    <div id="footerContainer" >
      
      <div id="copyLeftContainer" class="wideFormat">
        <ion-button class="copyLeftButton" color="dark" @click="openCopyLeftInfo(); memeReady = true">
          CopyLeft Info 
        </ion-button>
        <div v-if="memeReady" class="noWrapText">
          <ion-button id="memeButton" class="copyLeftButton" color="dark" @click="openCopyLeftMeme()">
            CopyLeft Meme
          </ion-button>
          <ion-button fill="clear" color="dark" @click="memeReady=false" class="nSmallMarginLeft nMediumSmallMarginRight marginZero">
            <ion-icon class="footerIcon":src="closeCircle"></ion-icon>
          </ion-button>
        </div>
      </div>

      <SelectionAudio/>
      
      <div class="mediumFormatButtonContainer">
        <div class="mediumFormat">
          <div class="flexCenterRow">
            <ion-button class="copyLeftButton" color="dark" @click="openCopyLeftInfo(); memeReady = true">
              CopyLeft Info 
            </ion-button>
            <div v-if="memeReady" class="noWrapText">
              <ion-button id="memeButton" class="copyLeftButton" color="dark" @click="openCopyLeftMeme()">
                CopyLeft Meme
              </ion-button>
              <ion-button fill="clear" color="dark" @click="memeReady=false" class="nSmallMarginLeft nMediumSmallMarginRight marginZero">
                <ion-icon class="footerIcon":src="closeCircle"></ion-icon>
              </ion-button>
            </div>
          </div>
        </div>
        <div id="mediaButtonsContainer">
          <ion-button title="Twitter" fill="clear" @click="openTwitter()">
            <Twitter class="footerIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
          </ion-button>
          <ion-button title="Github" fill="clear" @click="openGithub()">
            <Github id="githhubIcon" class="footerIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
          </ion-button>
          <ion-button title="Youtube" fill="clear" @click="openYoutube()">
            <Youtube id="youtubeIcon" class="footerIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
          </ion-button>
          <!--<ion-button title="TikTok" fill="clear" @click="openTikTok()" class="nMediumSmallMarginLeft">
            <TikTok id="tikTokIcon" class="footerIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
          </ion-button>-->
          <ion-button title="Facebook" fill="clear" @click="openFacebook()" class="nMediumSmallMarginLeft">
            <Facebook id="facebookIcon" class="footerIcon" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
          </ion-button>
        </div>
      </div>

    </div>
  </ion-footer>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { IonButton, IonFooter, IonIcon } from '@ionic/vue'
  import { closeCircle } from 'ionicons/icons'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import SelectionAudio from '/src/components/audio/SelectionAudio.vue'
  import Twitter from '/src/assets/svg/twitter-svg.vue'
  import Github from '/src/assets/svg/github-svg.vue'
  import Youtube from '/src/assets/svg/youtube-link-svg.vue'
  import TikTok from '/src/assets/svg/tiktok-svg.vue'
  import Facebook from '/src/assets/svg/facebook-svg.vue'
  
  var memeReady = ref(false)

  function openCopyLeftInfo()
  {
    window.open("https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNEwQkjSrKustIf5Q7FrS3ZqMDd6eahcUy8ni0", "_blank")
  }

  function openCopyLeftMeme()
  {
    window.open("https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNcRYGNYBeG7KCJSLN0BH1upErbVeQaWMq2oId", "_blank")
  }

  function openTwitter()
  {
    window.open("/Twitter", "_blank")
  }

  function openGithub()
  {
    window.open("https://github.com/FDR-3?tab=repositories", "_blank")
  }

  function openYoutube()
  {
    window.open("https://www.youtube.com/@fdr-3", "_blank")
  }

  function openTikTok()
  {
    window.open("https://www.tiktok.com/@franklin40727", "_blank")
  }

  function openFacebook()
  {
    window.open("https://www.facebook.com/profile.php?id=61578948853626", "_blank")
  }
</script>

<style scoped>
  #footerContainer
  {
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: light-dark(lightgray,#1f1f1f);
    border-radius: 0px
  }

  .copyLeftButton
  {
    width: 144px;
    height: 25px;
    letter-spacing: 0.1px
  }
  
  .footerIcon
  {
    width: 24px;
    height: 24px
  }

  #mediaButtonsContainer
  {
    width: 206px;
    margin-right: -35px
  }

  #githhubIcon
  {
    margin-left: -15px
  }

  #youtubeIcon
  {
    margin-left: -15px
  }

  #githhubIcon
  {
    margin-left: -15px
  }

  #facebookIcon
  {
    width: 30px;
    height: 30px
  }


  @media screen and (min-width: 816px) 
  { 
    #footerContainer, #copyLeftContainer
    {
      display: flex;
      flex-direction: row;
      align-items: center
    }

    .wideFormat
    {
      display: block
    }

    .mediumFormat
    {
      display: none
    }
  }

  @media screen and (min-width: 512px) and (max-width: 815.9px)
  { 
    #footerContainer
    {
      display: flex;
      flex-direction: column
    }

    #memeButton
    {
      margin-left: 19px;
      width: 114px
    }

    .wideFormat
    {
      display: none
    }

    .mediumFormatButtonContainer
    {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-grow: 2
    }

    .mediaButtonsContainer
    {
      align-self: right;
      justify-content: right;
    }
    
  }

  @media screen and (max-width: 511.9px) 
  { 
    #footerContainer
    {
      display: flex;
      flex-direction: column
    }

    .mediumFormat
    {
      display: none
    }

    #copyLeftContainer
    {
      margin-left: 0px
    }

    #mediaButtonsContainer
    {
      margin-left: -10px
    }
  }
</style>
