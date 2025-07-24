<script lang="ts">
  import { navigation } from '/src/assets/globalStates/Navigation.vue'

  export function playHoverSFX()
  {
    const audio = document.getElementById("hoverSFX") as HTMLMediaElement
    audio.pause()
    audio.currentTime = 0
    audio.play()
  }

  export function playHoverSFXIfNotOnAPhone()
  {
    if(window.innerWidth > 1280) //Nest Hub Max width in dev tools
    {
      const audio = document.getElementById("hoverSFX") as HTMLMediaElement
      audio.pause()
      audio.currentTime = 0
      audio.play()
    }
  }

  export function playSelection1SFXThenNextPage()
  {
    const audio = document.getElementById("selection1SFX") as HTMLMediaElement

    audio.pause()
    audio.currentTime = 0
    audio.play()

    audio.addEventListener('ended', () => 
    {
      nextPage()
    }, {once: true})
  }

  export function playSelection2SFXThenNextPage()
  {
    const audio = document.getElementById("selection2SFX") as HTMLMediaElement
    audio.pause()
    audio.currentTime = 0
    audio.play()

    audio.addEventListener('ended', () => 
    {
      nextPage()
    }, {once: true}) 
  }

  function nextPage()
  {
    navigation.pageIndex++
    localStorage.setItem("navigationPageIndex", navigation.pageIndex)
  }

  export default playHoverSFX
</script>