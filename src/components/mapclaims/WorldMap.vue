<template>
  <div class="flexCenterColumn">
    <div id="map"></div>
  </div>
</template>

<script setup lang="ts">
  import 'maplibre-gl/dist/maplibre-gl.css'
  import { watch, onMounted, onUnmounted, defineEmits } from 'vue'
  import { mapSelection } from '/src/assets/globalStates/MapSelection.vue'
  import maplibregl from 'maplibre-gl'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { HospitalTypes } from '/src/types/HospitalTypes.ts'

  const props = defineProps(['zoomLat', 'zoomLong', 'stateHospitalList'])
  const emits = defineEmits(['hospitalSelect'])

  var map: maplibregl.Map 
  var style: string
  var currentMarkers: any[] = []
  var currentDirectionsListners: any[] = []
  var currentSubmitListners: any[] = []
  var handleGetDirectionsEventFunction: void
  var handleSubmitClaimEventFunction: void

  onMounted(async() => 
  {
    if(localStorage.getItem("userTheme") === "darkTheme")
      style = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"  
    else
      style = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"

    await setupMap(style)
  })

  onUnmounted(() =>
  {
    // remove get directions event listners
    if (currentDirectionsListners.length != 0)
      for (var i=0; i<currentDirectionsListners.length; i++)
      currentDirectionsListners[i].removeEventListener('click', handleGetDirectionsEventFunction);

    // remove submit claim event listners
    if (currentSubmitListners.length != 0)
      for (var i=0; i<currentSubmitListners.length; i++)
        currentSubmitListners[i].removeEventListener('click', handleSubmitClaimEventFunction); 
  })

  watch(darkTheme, async() => 
  {
    if(darkTheme.value) 
      map.setStyle("https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json") 
    else
      map.setStyle("https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json")
  })

  watch(() => props.stateHospitalList, async() =>
  {
    await updateMarkersOnMap()
  })
  
  async function setupMap(style:string)
  {
    map = new maplibregl.Map(
    {
      container: "map", // container id
      style: style, // style URL
      center: [mapSelection.zoomLong, mapSelection.zoomLat], // starting position [lng, lat]
      zoom: 6, // starting zoom
    })

    // Add the navigation control
    map.addControl(new maplibregl.NavigationControl())

    map.on('idle',function()
    {
      map.resize()
    })
  }

  async function updateMarkersOnMap()
  {
    // remove old markers 
    if (currentMarkers.length != 0)
      for (var i=0; i<currentMarkers.length; i++)
        currentMarkers[i].remove();

    for(var hospitalIndex=0; hospitalIndex<props.stateHospitalList.length; hospitalIndex++)
    {
      const latitude = props.stateHospitalList[hospitalIndex].hospitalLatitude
      const longitude = props.stateHospitalList[hospitalIndex].hospitalLongitude
      const hospitalType = props.stateHospitalList[hospitalIndex].hospitalType
      const hospitalName = props.stateHospitalList[hospitalIndex].hospitalName
      const hospitalAddress = props.stateHospitalList[hospitalIndex].hospitalAddress
      const hospitalCity = props.stateHospitalList[hospitalIndex].hospitalCity
      const hospitalPhoneNumber = props.stateHospitalList[hospitalIndex].hospitalPhoneNumber
      const hospitalNote = props.stateHospitalList[hospitalIndex].note

      const hospitalIcon = document.createElement('div')
      hospitalIcon.id = "hospitalMarker" + hospitalIndex.toString()
      hospitalIcon.style.width = '34px'
      hospitalIcon.style.height = '30px'
      hospitalIcon.style.backgroundSize = "cover"
      hospitalIcon.style.cursor = "pointer"
      hospitalIcon.style.borderRadius = '0'
      
      if(hospitalType == HospitalTypes.General)
        hospitalIcon.style.backgroundImage = 'url(https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazN1BiMybI527AkmeVxopsR6nYgKDZFazU8GXHu)'
      else if(hospitalType == HospitalTypes.Dental)
        hospitalIcon.style.backgroundImage = 'url(https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNWtAaGHwuNPjCJgbOYz4DrkMvpEVGBFh1X6s5)'
      else if(hospitalType == HospitalTypes.Vision)
        hospitalIcon.style.backgroundImage = 'url(https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNrYFyAr2cvyILZuPHpomK5CU6N2bAltaz03cT)'
      else if(hospitalType == HospitalTypes.Mental)
        hospitalIcon.style.backgroundImage = 'url(https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNCnJgmUjrdlPMfOjk8zL1aoRbyDWUGc9mQ0ew)'

      //Create div popup and button containers
      const popUpContainer = document.createElement("div")
      const getDirectionsButtonContainer = document.createElement("div")
      const submitClaimButtonContainer = document.createElement("div")

      //Add HTML content
      popUpContainer.innerHTML = 
      `<div class="thinBorder" style="height: auto">
        <div style="line-height: 10px">
            <p class="underLine" "><b>Name</b></p>
            <p style="margin-top: -10px">${hospitalName}</p>
        </div>
        <div style="line-height: 10px">
          <p class="underLine"><b>Address</b></p> 
          <p style="margin-top: -10px">${hospitalAddress}</p>
        </div>
        <div style="line-height: 10px">
          <p class="underLine"><b>Phone Number</b></p>
          <p style="margin-top: -10px">${hospitalPhoneNumber}</p>
        </div>
        <div style="line-height: 10px">
          <p class="underLine "><b>City</b></p>
          <p style="margin-top: -10px">${hospitalCity}</p>
        </div>
        <div style="line-height: 10px">
          <p class="underLine "><b>Info</b></p>
          <p style="margin-top: -10px margin-left: 5px margin-right: 5px">${hospitalNote}</p> 
        </div>
      </div>`

      getDirectionsButtonContainer.innerHTML = 
      `<ion-button color="green" class="smallMarginTop">
        Get Directions
      </ion-button>`

      submitClaimButtonContainer.innerHTML = `<ion-button style="color: var(--ion-color-black) height: 20px margin-bottom: -2px" color="green">Submit Claim</ion-button>`
      submitClaimButtonContainer.id = hospitalIndex.toString()

      popUpContainer.appendChild(getDirectionsButtonContainer)
      popUpContainer.appendChild(submitClaimButtonContainer)

      const hospitalClickPopup = new maplibregl.Popup(
      {
        closeButton: false,
        anchor: 'bottom',
        offset: [0, -5] // x,y
      })
      .setLngLat([longitude, latitude])
      .setDOMContent(popUpContainer)

      const newMarker = new maplibregl.Marker({element: hospitalIcon})
      .setLngLat([longitude, latitude])
      .setPopup(hospitalClickPopup)
      .addTo(map)

      currentMarkers.push(newMarker)

      handleGetDirectionsEventFunction = getDirectionsButtonContainer.addEventListener('click', () => 
      {
        window.open(`https://www.google.com/maps/search/?api=1&query=${latitude}%2C${longitude}`, '_blank');
        hospitalClickPopup.remove()
      })

      handleSubmitClaimEventFunction = submitClaimButtonContainer.addEventListener('click', () => 
      {
        document.getElementById("submitClaimsHeader")?.scrollIntoView()
        emits('hospitalSelect', submitClaimButtonContainer.id)
        hospitalClickPopup.remove()
      })
   
      currentDirectionsListners.push(getDirectionsButtonContainer)
      currentSubmitListners.push(submitClaimButtonContainer)
    }
  }
</script>

<style scoped>
  #map 
  { 
    display: flex;
    /*justify-self: center !important; Doesn't cut it for fire fox, have to do align-self center... dumb browser*/
    align-self: center;
    height: 700px;
    width: 90%;
    color: black
  }
</style>
