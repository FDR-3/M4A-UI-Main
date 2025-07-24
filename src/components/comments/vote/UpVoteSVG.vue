<template>
  <ion-button
    fill="clear"
    style="margin-left: -5px; height: 50px"
  >
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="50" height="50" viewBox="280 234.12 2000 2000" xml:space="preserve">
      <desc>Created with Fabric.js 5.2.4</desc>
      <defs>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="transparent"></rect>
      <g transform="matrix(0 0 0 0 0 0)" id="91499aa4-209c-4a43-af33-0f6195d10120"></g>
      <g transform="matrix(1 0 0 1 1000 1000)" id="435e748e-e772-47c3-bbcb-b225d0e8d0c3">
      <rect style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: #FFFFFF; fill-rule: nonzero; opacity: 1; visibility: hidden;" vector-effect="non-scaling-stroke"  x="-1000" y="-1000" rx="0" ry="0" width="2000" height="2000" />
      </g>
      <g transform="matrix(13.49 0 0 13.32 1263.79 1198.73)" id="a06a7ac6-fd60-47ac-aa5f-7eb1a92c7c91">
      <circle :style="{fill: themeColor1}" style="stroke: #000000; stroke-opacity: 0; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  cx="0" cy="0" r="35" />
      </g>
      <g transform="matrix(11.04 0 0 10.91 1263.52 1198.84)">
      <path :style="{stroke: themeColor2}" style="stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: #FFFFFF; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(-50, -50)" d="M 50 92.875 C 26.358 92.875 7.125 73.642 7.125 50 C 7.125 26.358000000000004 26.358 7.125 50 7.125 C 73.642 7.125 92.875 26.358 92.875 50 C 92.875 73.642 73.642 92.875 50 92.875 z M 50 9.125 C 27.461 9.125 9.125 27.461 9.125 50 C 9.125 72.538 27.461 90.875 50 90.875 C 72.538 90.875 90.875 72.538 90.875 50 C 90.875 27.461 72.538 9.125 50 9.125 z" stroke-linecap="round" />
      </g>
      <g transform="matrix(6.93 0 0 5.41 1265.16 1157.66)" id="ccccbaa8-b88a-4310-be2b-c8f0a75a73ec">
      <polygon :style="{fill: menuColor}" style="stroke: #000000; stroke-opacity: 0; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  points="-37.43,32.41 0,-32.41 37.43,32.41 " />
      </g>
    </svg>
  </ion-button>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { IonButton } from '@ionic/vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'

  defineProps(['menuColor'])

  var themeColor1 = ref()
  var themeColor2 = ref()

  onMounted(() =>
  {
    if(localStorage.getItem("userTheme") === "darkTheme")
    {
      themeColor1.value = "#000000"
      themeColor2.value = "#FFFFFF"
    }
    else
    {
      themeColor1.value = "#FFFFFF"
      themeColor2.value = "#000000"
    }
  })

  watch(darkTheme, async() => 
  {
    if(darkTheme.value)
    {
      themeColor1.value = "#000000"
      themeColor2.value = "#FFFFFF"
    }
    else
    {
      themeColor1.value = "#FFFFFF"
      themeColor2.value = "#000000"
    }
  })
</script>