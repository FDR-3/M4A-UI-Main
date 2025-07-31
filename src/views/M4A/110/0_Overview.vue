<template>
  <div>
    <h1>Overview 1/31</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <!--<media-player class="videoContainer" src="src/assets/video/M4A/110/0_Overview/M4A Overview.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <iframe class="videoContainer"
        src="https://www.youtube.com/embed/wfwfSHvQJNU?cc_load_policy=1&cc_lang_pref=en"
        allowfullscreen
      ></iframe>
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>
      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=B7h1MGdfuHA" target="_blank">DrakeKaizoku: All Kaito Bad Rolls [Hunter X Hunter][CRAZY SLOTS]</a><br>
        <a href="https://www.pngfind.com/mpng/ibRhbho_memes-para-stickers-png-png-download-surprised-pikachu/" target="_blank">pngfind: suprised pikachu</a><br>
        <a href="https://hianime.to/watch/hunter-x-hunter-2?ep=146" target="_blank">Hunter x Hunter(popups are worse on this site on the phone, it's better on the computer)</a><br>
        <a href="https://www.youtube.com/watch?v=4To-F6W1NT0" target="_blank">Louis Rossmann 1</a><br>
        <a href="https://www.youtube.com/watch?v=GQhNwlibeP8" target="_blank">Green Screen: Shia Labeouf</a><br>
        <a href="https://www.youtube.com/watch?v=QH5tDLHsgiI" target="_blank">Kevin Hart</a><br>
        <a href="https://www.youtube.com/watch?v=TFfa8pcv--k" target="_blank">Team Four Star: Attack on Titan Abridged</a><br>
        <a href="https://www.youtube.com/watch?v=87XKFGaNk2w" target="_blank">MrFanBoy</a><br>
        <a href="https://www.youtube.com/watch?v=ct9MxZHakBQ" target="_blank">RDCworld1</a><br>
        <a href="https://www.youtube.com/watch?v=syzRO9KDQpk" target="_blank">Jet Jet Theh Jet plalq</a><br>
        <a href="https://www.youtube.com/watch?v=4ugz2iViV2E" target="_blank">Kyle Kulinski Show1</a><br>
        <a href="https://www.youtube.com/watch?v=BYwQW23vnmM" target="_blank">The Kyle Kulinski Show 2</a><br>
        <a href="https://www.youtube.com/watch?v=8WYsrYslG20" target="_blank">Rational National</a><br>
        <a href="https://www.youtube.com/watch?v=2CNbOpOMdak" target="_blank">Majority Report</a><br>
        <a href="https://www.myinstants.com/en/instant/metal-gear-solid-alert/" target="_blank">Myinstants: Metal Gear Sound Alert</a><br>
        <a href="https://www.youtube.com/watch?v=THRx1F_D-Kw" target="_blank">Hasan Piker 1</a><br>
        <a href="https://www.youtube.com/watch?v=BR7CHH0LjUs" target="_blank">Hasan Piker 2</a><br>
        <a href="https://www.youtube.com/watch?v=fiVr34QCF_c" target="_blank">Spaghetti</a><br>
        <a href="https://www.youtube.com/watch?v=aV6NoNkDGsU" target="_blank">South Park</a><br>
        <a href="https://www.youtube.com/watch?v=xMTSH6UGVH8" target="_blank">Green Screen: Steam</a><br>
        <a href="https://myglutenfreecucina.com/2023/10/26/easy-marinara-sauce/" target="_blank">Marinara</a><br>
        <a href="https://pwhomeimprovement.com/outdoor-fireplace-vs-a-fire-pit/" target="_blank">Fire Pit</a><br>
        <a href="https://www.youtube.com/watch?v=uTg0i6j7k34" target="_blank">Ting SFX</a><br>
        <a href="https://www.youtube.com/watch?v=j0resz19wUk" target="_blank">Sugar</a><br>
        <a href="https://tenor.com/view/wow-surprised-oh-my-gif-12557782" target="_blank">Suprised Gif</a><br>
        <a href="https://www.youtube.com/watch?v=HNcmo-K5Xsg" target="_blank">John Stewart</a><br>
        <a href="https://www.youtube.com/watch?v=8PDxvIxeH3Q" target="_blank">Louis Rossmann 2</a><br>
      </p>

      <p align="left">Extra Links<br>
        <a href="https://www.youtube.com/watch?v=QvaHDxdxQFg" target="_blank">Primate Economics: Credit Cards Explained with Bananas</a><br>
        <a href="https://www.youtube.com/shorts/ktfog3MhqJY" target="_blank">Primate Economics: Crypto Scam Explained with Bananas (here for informational purposes, M4A Protocol has no tokens)</a><br>
        <a href="https://www.youtube.com/watch?v=zLDMOAlWLfc" target="_blank">MonkeyExplains: Stop Killing Games Explained Using Bananas</a><br>
      </p>
      
    </div>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import VideoVoter from '/src/components/pages/VideoVoter.vue'
</script>