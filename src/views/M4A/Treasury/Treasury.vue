<template>
  <h2>Under Construction On Devnet<br>Monopoly Money</h2>
  <div class="flexCenterColumn">
    <TVLLongSVG id="tvlLongSVG" class="nLargeMarginTop" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
    <TVLShortSVG id="tvlShortSVG" class="nLargeMarginTop" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
  </div>
  <!--<M4AProtocolTVLLongHTMLText/>-->
  <!--<M4AProtocolTVLShortHTMLText/>-->
  <h1 class="nMediumLargeMarginTop">$<span class="rainbowText">{{ (tvl.hodlTVL + tvl.singlePayerTVL + tvl.tokenReserveTVL).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 }) }}</span></h1>
      
  <div class="tableFlipContainer" :class="flipped">
    <div class="tableCard" :class="flipped">
      <div class="frontTable" :style="{display: display1stTable}">
        <h1>Treasuries</h1>
        <ion-button @click="flipTable()" color="dark" :disabled="flipping">Toggle Reserves</ion-button>
        <HODLTreasuryTable/>
        <SinglePayerTreasuryTable/>
      </div>

      <div class="backTable" :style="{display: display2ndTable}">
        <h1>Reserves</h1>
        <ion-button @click="flipTable()" color="dark" :disabled="flipping">Toggle Treasuries</ion-button>
        <ReservesTable/>
        <OwnersTable/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { IonButton } from '@ionic/vue'
  import HODLTreasuryTable from '/src/components/tables/lending/HODLTreasuryTable.vue'
  import SinglePayerTreasuryTable from '/src/components/tables/lending/SinglePayerTreasuryTable.vue'
  import ReservesTable from '/src/components/tables/lending/TokenReservesTable.vue'
  import OwnersTable from '/src/components/tables/lending/OwnersTable.vue'
  import TVLLongSVG from '/src/assets/svg/tvl-long-svg.vue'
  import TVLShortSVG from '/src/assets/svg/tvl-short-svg.vue'
  import { tvl } from '/src/assets/globalStates/AdminAccounts.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import M4AProtocolTVLLongHTMLText from './M4AProtocolTVLLongHTMLText.vue'
  import M4AProtocolTVLShortHTMLText from './M4AProtocolTVLShortHTMLText.vue'

  defineProps(['colorName', 'colorHexValue'])//This just keeps a warning from going off since all pages get feed these props

  var flipping = ref(false)
  var flipped = ""
  var display1stTable = ref("")
  var display2ndTable = ref("none")

  onMounted(() => 
  {
    flipped = localStorage.getItem("treasuryTableSelect") || ""
    if(flipped == "")
    {
      display1stTable.value = ""
      display2ndTable.value = "none"
    }
    else
    {
      display1stTable.value = "none"
      display2ndTable.value = ""
    }
  })

  function flipTable()
  {
    document.getElementById("topOfPage")?.scrollIntoView()

    flipping.value = true

    if(flipped == "")
    {
      flipped = "flipped"
      display2ndTable.value = "block"

      localStorage.setItem("treasuryTableSelect", flipped)

      setTimeout(() => 
      {
        display1stTable.value = "none"
        flipping.value = false
      }, 500) // 1000 milliseconds == 1 seconds
    }
    else
    {
      flipped = ""
      display1stTable.value = "block"

      localStorage.setItem("treasuryTableSelect", flipped)

      setTimeout(() => 
      {
        display2ndTable.value = "none"
        flipping.value = false
      }, 500) // 1000 milliseconds == 1 seconds
    }   
  }
</script>

<style scoped>
  h1
  {
    text-decoration: none
  }

  #tvlLongSVG
  {
    width: 888px
  }

  .tableFlipContainer
  {
    position: relative;
    transition: height 0.5s ease
  }

  .tableCard
  {
    position: absolute;
    width: 90vw;
    display: flex;
    flex-grow: 1;
    transform-style: preserve-3d;
    transition: all 0.5s ease
  }

  .tableCard.flipped
  {
    transform: rotateY(180deg)
  }

  .frontTable
  {
    width: 90vw;
    position: absolute;
    backface-visibility: hidden;
    transform: rotateX(0deg) /*Needed Just for fire fox ignoring backface-visibilty*/
  }

  .backTable
  {
    width: 90vw;
    position: absolute;
    backface-visibility: hidden;
    transform: rotateX(0deg); /*Needed Just for fire fox ignoring backface-visibilty*/
    transform: rotateY(180deg)
  }

  /*TVL SVGs*/
  @media screen and (min-width: 977.1px)
  { 
    #tvlLongSVG
    {
      display: block
    }
    #tvlShortSVG
    {
      display: none
    }
  }
  @media screen and (max-width: 977px)
  { 
    #tvlLongSVG
    {
      display: none
    }
    #tvlShortSVG
    {
      display: block
    }
  }

  /*TVL Short SVG*/
  @media screen and (min-width: 320.1px)
  { 
    #tvlShortSVG
    {
      width: min(80vw, 444px);
      height: min(60vw, 344px)
    }
  }
  @media screen and (min-width: 210.1px) and (max-width: 320px)
  { 
    #tvlShortSVG
    {
      width: min(80vw, 444px);
      height: min(70vw, 200px)
    }
  }
  @media screen and (max-width: 210px)
  { 
    #tvlShortSVG
    {
      width: min(80vw, 444px);
      height: min(77vw, 150px)
    }
  }
  
  /*Table Flip Container*/
  @media screen and (min-width: 1442.1px)
  { 
    .tableFlipContainer
    {
      height: 1678px
    }
    .tableFlipContainer.flipped
    {
      height: 1400px
    }
  }
  @media screen and (min-width: 1419.1px) and (max-width: 1442px) 
  { 
    .tableFlipContainer
    {
      height: 1706px
    }
    .tableFlipContainer.flipped
    {
      height: 1413px
    }
  }
  @media screen  and (min-width: 1111.1px) and (max-width: 1419px) 
  { 
    .tableFlipContainer
    {
      height: 1734px
    }
    .tableFlipContainer.flipped
    {
      height: 1413px
    }
  }
  @media screen and (max-width: 1111px) 
  { 
    .tableFlipContainer
    {
      height: 1764px
    }
    .tableFlipContainer.flipped
    {
      height: 1413px
    }
  }
</style>