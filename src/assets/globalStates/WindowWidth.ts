import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowResize()
{
  const windowWidth = ref(window.innerWidth) //Reactive reference for window width
  //const windowHeight = ref(window.innerHeight); //Reactive reference for window height

  function handler() {
    windowWidth.value = window.innerWidth //Update width on resize
    //windowHeight.value = window.innerHeight; //Update height on resize
  }

  onMounted(() => window.addEventListener('resize', handler)) //Add listener on mount
  onUnmounted(() => window.removeEventListener('resize', handler)) //Remove listener on unmount

  return { windowWidth/*, windowHeight*/ } //Return reactive properties
}