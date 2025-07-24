<template>
  <div>
    <h1>Chat Contract Walk Through 30/30</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/33_2SneakPeak/Season 2 Sneak Peak.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
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
        <a href="https://www.youtube.com/watch?v=qCAVxvlzrrw" target="_blank">Solandy [solandy.sol]: Verified Solana Programs [Solana Tutorial] - Dec 13th '24</a><br>
        <a href="https://solana.com/developers/guides/advanced/verified-builds" target="_blank">Solana Verified Builds Guide</a><br>
        <a href="https://docs.docker.com/engine/install/ubuntu/" target="_blank">Docker Install</a><br>
        <a href="https://www.comparenodes.com/library/public-endpoints/solana/" target="_blank">Public Solana RPC Endpoints</a><br>
        <a href="https://github.com/extrnode/rpc-solana-endpoints/blob/main/rpc_list.csv" target="_blank">80 Other Public Solana RPC Endpoints</a><br>
        <a href="https://solana.stackexchange.com/questions/4027/after-deployment-of-a-program-can-the-program-ids-private-key-be-made-public" target="_blank">target/deploy/{program_name}-keypair.json discussion</a><br>
        <a href="https://www.youtube.com/watch?v=RT-1Zywrse8" target="_blank">What Make Art: Configure your "user.name" and "user.email" in git</a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'
  import Uploading from '/src/components/pages/Uploading.vue'
</script>