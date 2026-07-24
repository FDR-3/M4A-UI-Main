<template>
  <svg 
    version="1.0" 
    id="sol-icon" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="150 50 500 500" 
  >
    <defs>
      <linearGradient 
        :id="uniqueId" 
        gradientUnits="userSpaceOnUse" 
        x1="300.549" 
        y1="184.6306" 
        x2="547.9839" 
        y2="425.5287" 
        gradientTransform="matrix(1 0 0 -1 -20.9449 604.3622)"
      >
        <stop offset="0" stop-color="#CF41E8"/>
        <stop offset="1" stop-color="#10F2B0"/>
      </linearGradient>
    </defs>

    <!-- Perfect Circle Background (Replaced the odd path) -->
    <circle cx="400" cy="300" r="250" fill="#232323" />

    <!-- Solana Bars with Dynamic Gradient -->
    <path 
      :fill="`url(#${uniqueId})`" 
      d="M504.3,237.5c-0.8,0.9-1.8,1.6-2.9,2c-1.1,0.5-2.3,0.7-3.5,0.7H271.4c-8,0-12.1-10-6.5-16l37.2-39.5 c0.8-0.9,1.8-1.6,3-2.1c1.1-0.5,2.3-0.7,3.5-0.7h227.4c8.1,0,12.1,10.1,6.4,16.1L504.3,237.5z M504.3,414.1c-1.7,1.7-4,2.7-6.4,2.7 H271.4c-8,0-12.1-9.8-6.5-15.6l37.2-38.6c0.8-0.9,1.9-1.6,3-2c1.1-0.5,2.3-0.7,3.5-0.7h227.4c8.1,0,12.1,9.9,6.4,15.7L504.3,414.1z M504.3,273.6c-1.7-1.7-4-2.7-6.4-2.7H271.4c-8,0-12.1,9.8-6.5,15.6l37.2,38.6c0.8,0.9,1.9,1.6,3,2c1.1-0.5,2.3-0.7,3.5-0.7h227.4 c8.1,0,12.1-9.9,6.4-15.7L504.3,273.6z"
    />
  </svg>
</template>

<script setup lang="ts">
  // Generate a unique ID for every instance rendered in the DOM
  const uniqueId = `sol-grad-${Math.random().toString(36).substring(2, 9)}`;
</script>