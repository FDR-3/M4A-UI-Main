<template>
  <div class="flexCenterRow mobileSpaceFiller">
    <div class="overlayContainer">
      <img src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNVkjd19EhW7MqHDNnjQlr4SsC0pORAEcIoe2B" class="KingobamasCrown"/>
      <StarWolf class="starWolfButton" fill="#ffd700"/>
    </div>
  </div>
</template>
  
<script setup lang="ts">
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'

</script>

<style scoped>
  .overlayContainer
  {
    position: relative
  }

  .KingobamasCrown
  {
    pointer-events: none;
    min-width: 50px;
    height: 24px;

    position: absolute;
    top: -9px;
    left: -17px;
    z-index: 1
  }
</style>