<script lang="ts">
  import Overview_0 from "/src/views/Jesus/110/0_Overview.vue"
  import OpSys_1 from "/src/views/Jesus/110/1_OpSys.vue"
  import { Jesus110WindowsPages } from '/src/views/Jesus/110/0_Windows/110WindowsPages.vue'

  export const Jesus110PathSelectionPages = 
  [
    Overview_0, 
    OpSys_1 
  ]

  const Jesus110ApplePages: never[] = 
  [

  ]

  const Jesus110LinuxPages: never[] = 
  [

  ]

  export const Jesus110PagesAfterPathSelection = 
  [
    Jesus110WindowsPages,
    Jesus110ApplePages,
    Jesus110LinuxPages
  ]

  export default Jesus110PathSelectionPages
</script>