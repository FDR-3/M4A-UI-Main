<template>
  <div class="flexCenterColumn" v-if="playSelectionMusic() == true"  style="margin-top: 8px">
    <audio
      id="musicPlayer"
      loop 
      controls 
      controlsList="nodownload"
      autoplay
    >
      <source src="/Super Street Fighter 2 Player Select.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
    <p style="line-height: 0px">MP3 by: <a class="rainbowText" href="https://www.youtube.com/watch?v=oqhIgAjB9oE" target="_blank">8-Beats VGM</a></p>

    <audio id="hoverSFX">
      <source src="/Hover SFX.wav" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>

    <audio id="selection1SFX">
      <source src="/selection1.wav" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>

    <audio id="selection2SFX">
      <source src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazN99Xk1xVXumqHjxl3ZTVCfnbAcapLKNd70kBY" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script setup lang="ts">
  import { watch, nextTick } from 'vue'
  import { MenuIndex } from '/src/assets/globalStates/Navigation.vue'
  import { navigation } from '/src/assets/globalStates/Navigation.vue'

  function playSelectionMusic()
  {
    return navigation.menuIndex == MenuIndex.M4A && 
      navigation.navBarIndex == 0 &&
      (navigation.pageIndex == 1 || 
      navigation.pageIndex == 2 ||
      navigation.pageIndex == 3 ||
      navigation.pageIndex == 35)
  }
  
  watch(navigation, async() =>
  {
    await nextTick()

    var audio = document.getElementById("musicPlayer") as HTMLMediaElement
    if(audio)
      audio.volume = 0.25
  })
</script>

<style scoped>
  #musicPlayer
  {
    width: min(300px, 70vw)
  }
</style>
