<template>
  <div>
    <h1>💚 A Message to President Trump 💚</h1>
    <div class="flexCenterRow">
      <PrevPageButton/>
      <Uploading/>
      <!--<media-player class="videoContainer" src="src\assets\video\M4A\110\10_2TrumpMessage/Trump Lolipop.mp4">
        <media-provider><track src="" kind="subtitles" label="English" lang="en-US" default/></media-provider>
        <media-plyr-layout thumbnails=""></media-plyr-layout>
      </media-player>-->
      <NextPageButton/>
    </div>
    <VideoVoter/>
    <div class="sources">
      <h1>Sources</h1>

      <p align="left">Links<br>
        <a href="https://www.youtube.com/watch?v=kwQWQMZlG18" target="_blank">Life</a><br>
        <a href="https://www.pngfind.com/pngs/m/668-6688597_united-healthcare-united-health-group-hd-png-download.png" target="_blank">United Against Your Health Care Logo</a><br>
        <a href="https://www.walmart.com/ip/Trump-2024-Hat-Donald-Trump-Hat-2024-MAGA-Keep-America-Great-Hat-Camo-USA-Embroidered-Adjustable-Baseball-Cap/5250049570?wmlspartner=wlpa&selectedSellerId=101695589&adid=222222222275250049570_101695589_175014471049_22002471071&wl0=&wl1=g&wl2=c&wl3=725758765197&wl4=pla-2386853269438&wl5=9017315&wl6=&wl7=&wl8=&wl9=pla&wl10=5372608256&wl11=online&wl12=5250049570_101695589&veh=sem&gad_source=1&gclid=EAIaIQobChMI38rqucDcigMVdzjUAR0i8hexEAQYASABEgIh1_D_BwE" target="_blank">United Health Hugger Hat</a><br>
        <a href="https://www.youtube.com/watch?v=0bNjTyel7Ek" target="_blank">Kyle Kulinski Show 1</a><br>
        <a href="https://www.youtube.com/watch?v=JzLYSYvzMTg" target="_blank">Daily Mail</a><br>
        <a href="https://www.wco.tv/family-guy-episode-43-ready-willing-and-disabled-10" target="_blank">Family Guy</a><br>
        <a href="https://www.youtube.com/watch?v=7sTMpJlLln0" target="_blank">Kyle Kulinski Show 2</a><br>
        <a href="https://www.youtube.com/watch?v=Ncb2uBBhtBU" target="_blank">Rational National</a><br>
        <a href="https://www.youtube.com/watch?v=-twm7ldMOtI" target="_blank">Stephen Colbert</a><br>
        <a href="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGhvZzFyamxqM3c3dzg4eWQ3MTE0NGU4czRteXllejJkbmhjdnEycyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S3Ot3hZ5bcy8o/giphy.gif" target="_blank">Jack Nicholson Yes Gif</a><br>
      </p>

      <p align="left">Extra Links<br>
        <a href="https://www.youtube.com/watch?v=Gbf6C5XWK7w&rco=1" target="_blank">voidzilla: the story keeps changing(epstein)</a><br>
        <a href="https://www.youtube.com/watch?v=JZUg5E8ctaM" target="_blank">voidzilla: "raw" epstein footage was modified</a><br>
        <a href="https://youtu.be/YeHprJpqxoI?t=750" target="_blank">Kyle Kulinski Show: Israel blackmails US politicians with child sex trafficking ring(Time Stamp)-Epstein</a><br>
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