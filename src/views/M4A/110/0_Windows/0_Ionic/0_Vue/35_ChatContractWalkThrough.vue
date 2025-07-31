<template>
  <div>
    <h1>Chat Contract Walk Through 31/31</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <VideoFlipper
        ref="videoFlipper"
        frontVideo="https://www.youtube.com/embed/m_ZWiSUjym4?cc_load_policy=1&cc_lang_pref=en"
        backVideo="https://www.youtube.com/embed/gVvLOn_yHjY?cc_load_policy=1&cc_lang_pref=en"
      />
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=ct9MxZHakBQ" target="_blank">RDCworld1: How Fast Anime Characters be Building Friendships</a><br>
        <a href="https://www.youtube.com/watch?v=6sohD5JfKaE" target="_blank">Glucky7: That guy disappearing meme</a><br>
        <a href="https://www.youtube.com/watch?v=jn0AejpWkOU" target="_blank">GameSoundEffects: Final Fantasy VII Sound Effects - Enemy Death</a><br>
        <a href="https://www.youtube.com/watch?v=Cr_zgHfkMbI" target="_blank">Reganous The Grey: Brady Show</a><br>
        <a href="https://dn720807.ca.archive.org/0/items/TheBoondocks-4K-Season1-Complete-Singecku/The%20Boondocks%20E05%20%5B4K%5D%20A%20Date%20with%20the%20Health%20Inspector.ia.mp4" target="_blank">Boon Docks</a>
        <a href="https://www.youtube.com/watch?v=qCAVxvlzrrw" target="_blank">Solandy [solandy.sol]: Verified Solana Programs [Solana Tutorial] - Dec 13th '24</a><br>
        <a href="https://solana.com/developers/guides/advanced/verified-builds" target="_blank">Solana Verified Builds Guide</a><br>
        <a href="https://docs.docker.com/engine/install/ubuntu/" target="_blank">Docker Install</a><br>
        <a href="https://www.comparenodes.com/library/public-endpoints/solana/" target="_blank">Public Solana RPC Endpoints</a><br>
        <a href="https://github.com/extrnode/rpc-solana-endpoints/blob/main/rpc_list.csv" target="_blank">80 Other Public Solana RPC Endpoints</a><br>
        <a href="https://solana.stackexchange.com/questions/4027/after-deployment-of-a-program-can-the-program-ids-private-key-be-made-public" target="_blank">target/deploy/{program_name}-keypair.json discussion</a><br>
        <a href="https://www.youtube.com/watch?v=RT-1Zywrse8" target="_blank">What Make Art: Configure your "user.name" and "user.email" in git</a><br>
      </p>
      <div align="left">
        <strong>Extra Video/SFX Lessons 6/6</strong><br>
        <button id="videoFlipButton" @click="videoFlipper.flipVideo()" :disabled=videoFlipper?.flipping>
          <span class="rainbowText">Editing Fonts</span>
        </button>
        <br>
        <a href="https://www.dafont.com/metal-gear-solid.font" target="_blank">Dafont Metal Gear</a><br>
        <a href="https://fontforge.org/en-US/" target="_blank">Font Forge</a>
      </div>
      <br>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoFlipper from '/src/components/fancy/VideoFlipper.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'

  var videoFlipper = ref()
</script>