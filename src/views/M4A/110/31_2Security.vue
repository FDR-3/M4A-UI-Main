<template>
  <div>
    <h1>M4A Protocol</h1>
    <h2 class="multiLineHeaderLineHeight">Security! Explained</h2>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/30_2Security/Security.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/O9yIdsmaLdo?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/shorts/AXAcy-Y-TdY" target="_blank">DankBasilLeaf: FBI open up meme</a><br>
        <a href="https://www.wco.tv/family-guy-episode-43-ready-willing-and-disabled-10" target="_blank">Family Guy</a><br>
        <a href="https://www.youtube.com/shorts/hbM83EcGeSY" target="_blank">thebreakingbreak: Smashing a radio with a hammer</a><br>
        <a href="https://www.youtube.com/shorts/zB_2fuiwBPk" target="_blank">fearsomespore8681: Paper burning</a><br>
        <a href="https://www.blockplate.com/pages/bip-39-wordlist" target="_blank">blockplate: bip39 word list</a><br>
        <a href="https://www.youtube.com/watch?v=SRHFHHViGI4" target="_blank">Milk: Hunter x Hunter</a><br>
        <a href="https://www.lords-prayer-words.com/lord_traditional_king_james.html" target="_blank">Lords-Prayer-Words: The Lord's Prayer</a><br>
        <a href="https://imgflip.com/memetemplate/96149579/Smart-black-guy" target="_blank">imgflip: Roll Safe thinking meme</a><br>
        <a href="https://www.youtube.com/watch?v=Pb-7Dpp-LPk" target="_blank">brainchopper: FDR mocks Republican promises</a><br>
        <a href="https://www.youtube.com/watch?v=me64yhlSAGc" target="_blank">Donald Bulley: King obama Green Screen</a><br>
        <a href="https://dn720304.ca.archive.org/0/items/head-of-state-2003/head%20of%20state%202003%20380dpi.mp4" target="_blank">Archive.org: Head of State</a><br>
        <a href="https://uppbeat.io/sfx/category/vehicle/car/tire-screech" target="_blank">Uppbeat: Tire Screech</a><br>
        <a href="https://www.youtube.com/watch?v=6RNSeS1PAtw" target="_blank">Drop Site/Counter Points/Breaking Points</a><br>
        <a href="https://www.youtube.com/watch?v=QbYzEnYmATM" target="_blank">Jesus.net: Matthew</a><br>
        <a href="https://www.youtube.com/watch?v=TBYW3A0Z5HI" target="_blank">Carl Johnson</a><br>
        <a href="https://www.pngfind.com/pngs/m/668-6688597_united-healthcare-united-health-group-hd-png-download.png" target="_blank">United Against Your Health Care Logo</a><br>
        <a href="https://www.youtube.com/watch?v=dvQPJdrXkWI" target="_blank">After Effects Tips & Treats - by Julien Schickel</a><br>
        <a href="https://www.youtube.com/watch?v=4SgIqWK7Ye8" target="_blank">Killer Mike</a><br>
        <a href="https://www.youtube.com/watch?v=8FpigqfcvlM" target="_blank">Egoraptor</a><br>
      </p>
      <p align="left">Help<br>
        <a href="https://www.reddit.com/r/TREZOR/comments/bt98lm/manual_24_word_seed_checksum_question/" target="_blank">Checksum help: You can go up or down from the original final word you select if it fails,
          and you're guaranteed to find one that works within 256 tries (for 24 words) or 16 tries (for 12 words). Or calculate the checksum to find it.
        </a><br>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'
</script>