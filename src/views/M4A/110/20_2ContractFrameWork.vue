<template>
  <div>
    <h1>Smart Contract FrameWork Select</h1>
    <div class="patchSelectionContainer flexCenterColumn">
      <ion-button color="dark" @click="prevPage()" @mouseenter="playHoverSFX()">Return</ion-button>
      <div class="flexCenterColumn">
        <ion-button 
          v-if="!isAnchorFlashing" 
          fill="clear" 
          @click="playSelection2SFXThenNextPage(); isAnchorFlashing = true" 
          @mouseenter="playHoverSFXIfNotOnAPhone()"
        >
          <AnchorSVG
            class="pathSelectionIcon"
            :fill="darkTheme.value ? '#FFFFFF' : '#000000'"
            slot="icon-only"
          />
        </ion-button>
        <AnchorFlashing v-if="isAnchorFlashing"/>
        <div class="flexCenterRow">
          <ion-button fill="clear" @click="giveUXWingSolanaCredit()">
            <SolanaSVG class="chainIcon" slot="icon-only"/>
          </ion-button>
          <ion-text style="margin-top: 3px">Solana with Anchor</ion-text>
        </div>
      </div>
      <div class="flexCenterColumn">
        <HardhatDarkModeSVG v-if="darkTheme.value" class="pathSelectionIcon" slot="icon-only" @click="giveSVGRepoHardHatCredit()"/>
        <HardhatSVG v-else class="pathSelectionIcon" slot="icon-only" @click="giveSVGRepoHardHatCredit()"/>
        <div class="flexCenterRow nMediumMarginTop">
          <ion-button fill="clear" @click="giveCryptoLogosArbitrumCredit()">
            <ArbitrumSVG class="chainIcon" slot="icon-only"/>
          </ion-button>
          <ion-text style="margin-top: 3px">Arbitrum with Hardhat</ion-text>
        </div>
      </div>
      <ion-text>Arbitrum with Hardhat walkthrough currently unavailable</ion-text>
      <div>
        <a href="https://www.youtube.com/watch?v=AT5nb-TDm28" target="_blank">SFX</a><br>
        <a href="https://www.svgrepo.com/svg/478969/anchor-4" target="_blank">SVG Repo: anchor svg</a><br>

        <ion-text>
          Arbitrum svg download requires browser extension such as
          <a href="https://chromewebstore.google.com/detail/svg-gobbler/mpbmflcodadhgafbbakjeahpandgcbch" target="_blank">SVG Gobbler</a>
          in order to download it.<br>
          Not sure why they made it so hard<br>
          (Maybe to save resources from having to serve up a download maybe),<br>
          but the tool was a nice find.
        </ion-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { IonText, IonButton } from '@ionic/vue'
  import { navigation } from '/src/assets/globalStates/Navigation.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { playHoverSFX, playHoverSFXIfNotOnAPhone, playSelection2SFXThenNextPage }  from '/src/components/audio/SelectionAudioFunctions.vue'
  import AnchorSVG from '/src/assets/svg/anchor-svg.vue'
  import AnchorFlashing from '/src/components/fancy/flashing/AnchorFlashing.vue'
  import HardhatSVG from '/src/assets/svg/hardhat-svg.vue'
  import HardhatDarkModeSVG from '/src/assets/svg/hardhat-darkmode-svg.vue'
  import SolanaSVG from '/src/assets/svg/solana-svg.vue'
  import ArbitrumSVG from '/src/assets/svg/arbitrum-svg.vue'
  import { giveSVGRepoHardHatCredit, giveUXWingSolanaCredit, giveCryptoLogosArbitrumCredit } from '/src/assets/helperFunctions/credits.ts'

  var isAnchorFlashing = ref(false)

  function prevPage()
  {
    navigation.pageIndex--

    localStorage.setItem("navigationPageIndex", navigation.pageIndex)
  }
</script>