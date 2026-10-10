<template>
  <svg 
    id="Layer_1" 
    data-name="Layer 1" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 508.07 398.17"
  >
    <defs>
      <linearGradient 
        :id="grad1Id" 
        x1="463" 
        y1="205.16" 
        x2="182.39" 
        y2="742.62" 
        gradientTransform="translate(0 -198)" 
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#00ffa3"/>
        <stop offset="1" stop-color="#dc1fff"/>
      </linearGradient>

      <linearGradient 
        :id="grad2Id" 
        x1="340.31" 
        y1="141.1" 
        x2="59.71" 
        y2="678.57" 
        gradientTransform="translate(0 -198)" 
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#00ffa3"/>
        <stop offset="1" stop-color="#dc1fff"/>
      </linearGradient>

      <linearGradient 
        :id="grad3Id" 
        x1="401.26" 
        y1="172.92" 
        x2="120.66" 
        y2="710.39" 
        gradientTransform="translate(0 -198)" 
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#00ffa3"/>
        <stop offset="1" stop-color="#dc1fff"/>
      </linearGradient>
    </defs>

    <path 
      :style="{ fill: `url(#${grad1Id})` }" 
      d="M84.53,358.89A16.63,16.63,0,0,1,96.28,354H501.73a8.3,8.3,0,0,1,5.87,14.18l-80.09,80.09a16.61,16.61,0,0,1-11.75,4.86H10.31A8.31,8.31,0,0,1,4.43,439Z" 
      transform="translate(-1.98 -55)"
    />
    <path 
      :style="{ fill: `url(#${grad2Id})` }" 
      d="M84.53,59.85A17.08,17.08,0,0,1,96.28,55H501.73a8.3,8.3,0,0,1,5.87,14.18l-80.09,80.09a16.61,16.61,0,0,1-11.75,4.86H10.31A8.31,8.31,0,0,1,4.43,140Z" 
      transform="translate(-1.98 -55)"
    />
    <path 
      :style="{ fill: `url(#${grad3Id})` }" 
      d="M427.51,208.42a16.61,16.61,0,0,0-11.75-4.86H10.31a8.31,8.31,0,0,0-5.88,14.18l80.1,80.09a16.6,16.6,0,0,0,11.75,4.86H501.73a8.3,8.3,0,0,0,5.87-14.18Z" 
      transform="translate(-1.98 -55)"
    />
  </svg>
</template>

<script setup lang="ts">
// Generate a unique suffix for every instance mounted on the page
const uniqueSuffix = Math.random().toString(36).substring(2, 9);
const grad1Id = `sol-grad-1-${uniqueSuffix}`;
const grad2Id = `sol-grad-2-${uniqueSuffix}`;
const grad3Id = `sol-grad-3-${uniqueSuffix}`;
</script>