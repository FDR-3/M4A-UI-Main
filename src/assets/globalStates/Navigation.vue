<script lang="ts">
  import { reactive } from 'vue'

  export enum MenuIndex
  {
    Jesus = 0,
    M4A = 1,
    PLI = 2,
    About = 3
  }

  export const navigation = reactive(
  {
    menuIndex: parseInt(localStorage.getItem("navigationMenuIndex") || "0"),
    navBarIndex: parseInt(localStorage.getItem("navigationNavbarIndex") || "0"),
    pageIndex: parseInt(localStorage.getItem("navigationPageIndex") || "0"),
    operatingSystemIndex: parseInt(localStorage.getItem("navigationOperatingSystemIndex") || "0"),
    frameWorkIndex: parseInt(localStorage.getItem("navigationFrameWorkIndex") || "0"),
    languageIndex: parseInt(localStorage.getItem("navigationLanguageIndex") || "0")
  })

  //Set localStorage navigation values if they don't exist yet
  localStorage.setItem("navigationMenuIndex", navigation.menuIndex.toString())
  localStorage.setItem("navigationNavbarIndex", navigation.navBarIndex.toString())
  localStorage.setItem("navigationPageIndex", navigation.pageIndex.toString())
  localStorage.setItem("navigationOperatingSystemIndex", navigation.operatingSystemIndex.toString())
  localStorage.setItem("navigationFrameWorkIndex", navigation.frameWorkIndex.toString())
  localStorage.setItem("navigationLanguageIndex", navigation.languageIndex.toString())

  export default navigation
</script>