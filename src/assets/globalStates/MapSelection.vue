<script lang="ts">
  import { reactive } from 'vue'

  export const mapSelection = reactive(
  {
    preSelectedHospitalIndex: -1,
    countryIndex: parseInt(localStorage.getItem("mapCountryIndex") || "-1"),
    stateIndex: parseInt(localStorage.getItem("mapStateIndex") || "-1"),
    isStateSelected: localStorage.getItem("mapIsStateSelected") == "true",
    selectedStateName: localStorage.getItem("mapSelectedStateName") || "",
    zoomLat: localStorage.getItem("mapDefaultLatitude") || "",
    zoomLong: localStorage.getItem("mapDefaultLongitude") || ""
  })

  //Set mapSelection values if they don't exist yet
  localStorage.setItem("mapCountryIndex", mapSelection.countryIndex.toString())
  localStorage.setItem("mapStateIndex", mapSelection.stateIndex.toString())
  localStorage.setItem("mapIsStateSelected", mapSelection.isStateSelected.toString())
  localStorage.setItem("mapSelectedStateName", mapSelection.selectedStateName)
  localStorage.setItem("mapDefaultLatitude", mapSelection.zoomLat)
  localStorage.setItem("mapDefaultLongitude", mapSelection.zoomLong)

  export default mapSelection
</script>