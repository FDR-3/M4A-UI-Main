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
        <TokenReservesTable @createSubMarketModal="(tokenMintAddress: PublicKey, tokenSVG: Component, tokenName:string) =>
        createSubMarketModal.openCreateSubMarketModal(tokenMintAddress, tokenSVG, tokenName)"
        @updateReserveTableSizing="(tokenReserveCount: number, tokenSubMarketCount: number, showTokenSubMarkets: boolean) =>
        updateTokenTableSizing(tokenReserveCount, tokenSubMarketCount, showTokenSubMarkets)"/>
        <OwnersTable @updateOwnerTableSizing="(subMarketOwnerCount: number, ownerSubMarketCount: number, showOwnerSubMarkets: boolean) =>
        updateOwnerTableSizing(subMarketOwnerCount, ownerSubMarketCount, showOwnerSubMarkets)"/>
      </div>
    </div>
  </div>
  <CreateSubMarketModal ref="createSubMarketModal"/>
</template>

<script setup lang="ts">
  import { ref, onMounted, Component } from 'vue'
  import { IonButton } from '@ionic/vue'
  import HODLTreasuryTable from '/src/components/tables/lending/HODLTreasuryTable.vue'
  import SinglePayerTreasuryTable from '/src/components/tables/lending/SinglePayerTreasuryTable.vue'
  import TokenReservesTable from '/src/components/tables/lending/TokenReservesTable.vue'
  import OwnersTable from '/src/components/tables/lending/OwnersTable.vue'
  import TVLLongSVG from '/src/assets/svg/tvl-long-svg.vue'
  import TVLShortSVG from '/src/assets/svg/tvl-short-svg.vue'
  import CreateSubMarketModal from '/src/components/tables/lending/CreateSubMarketModal.vue'
  import { tvl } from '/src/assets/globalStates/AdminAccounts.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { PublicKey } from "@solana/web3.js"
  import M4AProtocolTVLLongHTMLText from './M4AProtocolTVLLongHTMLText.vue'
  import M4AProtocolTVLShortHTMLText from './M4AProtocolTVLShortHTMLText.vue'

  defineProps(['colorName', 'colorHexValue'])//This just keeps a warning from going off since all pages get feed these props

  var flipping = ref(false)
  var flipped = ""
  var display1stTable = ref("")
  var display2ndTable = ref("none")

  var createSubMarketModal = ref()
  var dynamicTableHeight = ref("1353px")
  var tokenReserveTableSizing = 0
  var ownerTableSizing = 0
  const numberToSubTractForBothTables = 99

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

  function updateTokenTableSizing(tokenReserveCount: number, tokenSubMarketCount: number, showTokenSubMarkets: boolean)
  {
    if(showTokenSubMarkets)
      tokenReserveTableSizing = (396 + tokenSubMarketCount * 81.04//TokenReserve table and rows
    )
    else
      tokenReserveTableSizing = (350 + tokenReserveCount * 69.05//TokenReserve Owner table and rows
    )

    dynamicTableHeight.value = (tokenReserveTableSizing + ownerTableSizing - numberToSubTractForBothTables).toString() + "px"
  }

  function updateOwnerTableSizing(subMarketOwnerCount: number, ownerSubMarketCount: number, showOwnerSubMarkets: boolean)
  {
    if(showOwnerSubMarkets)
      ownerTableSizing = (440 + ownerSubMarketCount * 69.05)
    else
      ownerTableSizing = (344 + subMarketOwnerCount * 81.04)

    dynamicTableHeight.value = (tokenReserveTableSizing + ownerTableSizing - numberToSubTractForBothTables).toString() + "px"
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
  
  /*Table Flip Container Front*/
  @media screen and (min-width: 1059.1px)
  { 
    .tableFlipContainer
    {
      height: 1678px
    }

  }
  @media screen and (min-width: 1037.1px) and (max-width: 1059px) 
  { 
    .tableFlipContainer
    {
      height: 1707px
    }
  }
  @media screen and (min-width: 965.1px) and (max-width: 1037px) 
  { 
    .tableFlipContainer
    {
      height: 1734px
    }
  }
  @media screen and (min-width: 926.1px) and (max-width: 965px) 
  { 
    .tableFlipContainer
    {
      height: 1771px
    }
  }
  @media screen and (max-width: 926px) 
  { 
    .tableFlipContainer
    {
      height: 1800px
    }
  }

  /*Table Flip Container Back*/
  /*@media screen and (min-width: 1909.1px)
  { 
    .tableFlipContainer.flipped
    {
      height: 1339px
    } 
  }*/
  @media screen and (min-width: 1338.1px)/* and (max-width: 1909px)*/
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind(dynamicTableHeight) /*1353px*/
    }
  }
  @media screen and (min-width: 1290.1px) and (max-width: 1338px) 
  { 
    .tableFlipContainer.flipped
    {
      height: 1368px
    }
  }
  @media screen and (min-width: 1221.1px) and (max-width: 1290px) 
  { 
    .tableFlipContainer.flipped
    {
      height: 1383px
    }
  }
  @media screen and (min-width: 1143.1px) and (max-width: 1221px) 
  { 
    .tableFlipContainer.flipped
    {
      height: 1398px
    }
  }
  @media screen and (max-width: 1143px) 
  { 
    .tableFlipContainer.flipped
    {
      height: 1413px
    }
  }
</style>