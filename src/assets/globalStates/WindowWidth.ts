import { ref, onMounted, onUnmounted } from 'vue'; //

export function useWindowResize()
{
  const width = ref(window.innerWidth) // Reactive reference for window width
  //const height = ref(window.innerHeight); // Reactive reference for window height

  function handler() {
    width.value = window.innerWidth // Update width on resize
    //height.value = window.innerHeight; // Update height on resize
  }

  onMounted(() => window.addEventListener('resize', handler)) // Add listener on mount
  onUnmounted(() => window.removeEventListener('resize', handler)) // Remove listener on unmount

  return { width/*, height*/ } // Return reactive properties
}