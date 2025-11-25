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
      
  <div class="tableFlipContainer" :class="[flipped, noData, viewingTokenMarkets, viewingOwnerMarkets, viewingBothMarkets]">
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
  <KingobamaMobileT1 :style="{display: display1stTable}"/>
  <KingobamaMobileT2 :style="{display: display2ndTable}"/>
</template>

<script setup lang="ts">
  import { ref, onMounted, Component, computed } from 'vue'
  import { IonButton } from '@ionic/vue'
  import HODLTreasuryTable from '/src/components/tables/lending/HODLTreasuryTable.vue'
  import SinglePayerTreasuryTable from '/src/components/tables/lending/SinglePayerTreasuryTable.vue'
  import TokenReservesTable from '/src/components/tables/lending/TokenReservesTable.vue'
  import OwnersTable from '/src/components/tables/lending/OwnersTable.vue'
  import TVLLongSVG from '/src/assets/svg/tvl-long-svg.vue'
  import TVLShortSVG from '/src/assets/svg/tvl-short-svg.vue'
  import { tvl } from '/src/assets/globalStates/AdminAccounts.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { PublicKey } from "@solana/web3.js"
  import { isBrowserFireFox } from '/src/assets/helperFunctions/browserHelper.ts'
  import CreateSubMarketModal from '/src/components/smart contracts/lending protocol/CreateSubMarketModal.vue'
  import KingobamaMobileT1 from '/src/components/fancy/poly/KingobamaMobileT1.vue'
  import KingobamaMobileT2 from '/src/components/fancy/poly/KingobamaMobileT2.vue'
  import M4AProtocolTVLLongHTMLText from './M4AProtocolTVLLongHTMLText.vue'
  import M4AProtocolTVLShortHTMLText from './M4AProtocolTVLShortHTMLText.vue'

  defineProps(['colorName', 'colorHexValue'])//This just keeps a warning from going off since all pages get feed these props

  var flipping = ref(false)
  var flipped = ""
  var noData = ref("")
  var viewingTokenMarkets = ref("viewingTokenMarkets")
  var viewingOwnerMarkets = ref("")
  var viewingBothMarkets = computed (() =>
  {
    if(viewingTokenMarkets.value == "viewingTokenMarkets" && viewingOwnerMarkets.value == "viewingOwnerMarkets")
      return "viewingBothMarkets"
    else
      return ""
  })
  var display1stTable = ref("")
  var display2ndTable = ref("none")

  var createSubMarketModal = ref()

  var dynamicTableHeight = ref()
  if(!isBrowserFireFox())
    dynamicTableHeight.value = 743
  else
    dynamicTableHeight.value = 747

  var tokenReserveTableSizing = 0
  var ownerTableSizing = 0
  const numberToSubTractForBothTables = 110
  const numberToSubTractForBothTablesFireFox = 93

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
      }, 500) //500 milliseconds == 0.5 seconds
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
      }, 500) //500 milliseconds == 0.5 seconds
    }   
  }

  function updateTokenTableSizing(tokenReserveCount: number, tokenSubMarketCount: number, showTokenSubMarkets: boolean)
  {
    if(!isBrowserFireFox())
    {
      if(showTokenSubMarkets)
      {
        tokenReserveTableSizing = 485 + tokenSubMarketCount * 104
        viewingTokenMarkets.value = "viewingTokenMarkets"
      }
      else
      {
        if(tokenReserveCount == 0)
        {
          tokenReserveTableSizing = 355 + 14
          noData.value = "noData"
        }
        else
        {
          tokenReserveTableSizing = 355 + tokenReserveCount * 70
          noData.value = ""
        }

        viewingTokenMarkets.value = ""
      }

      dynamicTableHeight.value = tokenReserveTableSizing + ownerTableSizing - numberToSubTractForBothTables
    }
    else
    {
      if(showTokenSubMarkets)
      {
        tokenReserveTableSizing = 444 + tokenSubMarketCount * 104
        viewingTokenMarkets.value = "viewingTokenMarkets"
      }
      else
      {
        if(tokenReserveCount == 0)
        {
          tokenReserveTableSizing = 342 + 14
          noData.value = "noData"
        }
        else
        {
          tokenReserveTableSizing = 342 + tokenReserveCount * 70
          noData.value = ""
        }

        viewingTokenMarkets.value = ""
      }
      
      dynamicTableHeight.value = tokenReserveTableSizing + ownerTableSizing - numberToSubTractForBothTablesFireFox
    } 
  }

  function updateOwnerTableSizing(subMarketOwnerCount: number, ownerSubMarketCount: number, showOwnerSubMarkets: boolean)
  {
    if(!isBrowserFireFox())
    {
      if(showOwnerSubMarkets)
      {
        ownerTableSizing = 505 + ownerSubMarketCount * 90
        viewingOwnerMarkets.value = "viewingOwnerMarkets"
      }
      else
      {
        if(subMarketOwnerCount == 0)
          ownerTableSizing = 414 + 84
        else
          ownerTableSizing = 414 + subMarketOwnerCount * 84
        viewingOwnerMarkets.value = ""
      }

      dynamicTableHeight.value = tokenReserveTableSizing + ownerTableSizing - numberToSubTractForBothTables
    }
    else
    {
      if(showOwnerSubMarkets)
      {
        ownerTableSizing = 496 + ownerSubMarketCount * 90
        viewingOwnerMarkets.value = "viewingOwnerMarkets"
      }
      else
      {
        if(subMarketOwnerCount == 0)
          ownerTableSizing = 419 + 84
        else
          ownerTableSizing = 419 + subMarketOwnerCount * 84
        viewingOwnerMarkets.value = ""
      }
      
      dynamicTableHeight.value = tokenReserveTableSizing + ownerTableSizing - numberToSubTractForBothTablesFireFox
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
  
  /*Table Flip Container Front*/
  @media screen and (min-width: 1059.1px)
  { 
    .tableFlipContainer
    {
      height: 1705px
    }
  }
  @media screen and (min-width: 1037.1px) and (max-width: 1059px) 
  { 
    .tableFlipContainer
    {
      height: 1735px
    }
  }
  @media screen and (min-width: 965.1px) and (max-width: 1037px) 
  { 
    .tableFlipContainer
    {
      height: 1762px
    }
  }
  @media screen and (min-width: 926.1px) and (max-width: 965px) 
  { 
    .tableFlipContainer
    {
      height: 1798px
    }
  }
  @media screen and (max-width: 926px) 
  { 
    .tableFlipContainer
    {
      height: 1828px
    }
  }
  /*Set table height for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 965.1px)
    { 
      .tableFlipContainer
      {
        height: 1739px
      }
    }
    @media screen and (min-width: 925.1px) and (max-width: 965px) 
    { 
      .tableFlipContainer
      {
        height: 1776px
      }
    }
    @media screen and (max-width: 925px) 
    { 
      .tableFlipContainer
      {
        height: 1809px
      }
    }
  }

  /*Table Flip Container Back No Data*/
  @media screen and (min-width: 1283.1px)
  { 
    .tableFlipContainer.flipped.noData
    {
      height: v-bind('(dynamicTableHeight) + "px"')
    }
  }
  @media screen and (min-width: 1277.1px) and (max-width: 1283px) 
  { 
    .tableFlipContainer.flipped.noData
    {
      height: v-bind('(dynamicTableHeight + 14) + "px"')
    }
  }
  @media screen and (min-width: 1227.1px) and (max-width: 1277px) 
  { 
    .tableFlipContainer.flipped.noData
    {
      height: v-bind('(dynamicTableHeight + 29) + "px"')
    }
  }
  @media screen and (max-width: 1227px) 
  { 
    .tableFlipContainer.flipped.noData
    {
      height: v-bind('(dynamicTableHeight + 45) + "px"')
    }
  }
  /*Set table height for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 1476.1px)
    { 
      .tableFlipContainer.flipped.noData
      {
        height: v-bind('(dynamicTableHeight) + "px"')
      }
    }
    @media screen and (min-width: 1226.1px) and (max-width: 1476px) 
    { 
      .tableFlipContainer.flipped.noData
      {
        height: v-bind('(dynamicTableHeight + 18) + "px"')
      }
    }
    @media screen and (max-width: 1226px) 
    { 
      .tableFlipContainer.flipped.noData
      {
        height: v-bind('(dynamicTableHeight + 36) + "px"')
      }
    }
  }

  /*Table Flip Container Back NOT ViewingTokenMarkets*/
  @media screen and (min-width: 1693.1px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('dynamicTableHeight + "px"')
    }
  }
  @media screen and (min-width: 1521.1px) and (max-width: 1693px) 
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(dynamicTableHeight + 15) + "px"')
    }
  }
  @media screen and (max-width: 1521px) 
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(dynamicTableHeight + 30) + "px"')
    }
  }
  /*Set table height for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 1693.1px) 
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('dynamicTableHeight + "px"')/*1353px*/
      }
    }
    @media screen and (min-width: 1521.1px) and (max-width: 1693px) 
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(dynamicTableHeight + 18) + "px"')
      }
    }
    @media screen and (max-width: 1521px) 
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(dynamicTableHeight + 35) + "px"')/*1353px*/
      }
    }
  }

  /*Table Flip Container Back ViewingTokenMarkets*/
  @media screen and (min-width: 1762.1px)
  { 
    .tableFlipContainer.flipped.viewingTokenMarkets
    {
      height: v-bind('dynamicTableHeight + "px"')
    }
  }
  @media screen and (min-width: 1693.1px) and (max-width: 1762px) 
  { 
    .tableFlipContainer.flipped.viewingTokenMarkets
    {
      height: v-bind('(dynamicTableHeight + 15) + "px"')
    }
  }
  @media screen and (min-width: 1521.1px) and (max-width: 1693px) 
  { 
    .tableFlipContainer.flipped.viewingTokenMarkets
    {
      height: v-bind('(dynamicTableHeight + 29) + "px"')
    }
  }
  @media screen and (max-width: 1521px) 
  { 
    .tableFlipContainer.flipped.viewingTokenMarkets
    {
      height: v-bind('(dynamicTableHeight + 45) + "px"')
    }
  }
  /*Set table height for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 1864.1px)
    { 
      .tableFlipContainer.flipped.viewingTokenMarkets
      {
        height: v-bind('dynamicTableHeight + "px"')
      }
    }
    @media screen and (min-width: 1693.1px) and (max-width: 1864px) 
    { 
      .tableFlipContainer.flipped.viewingTokenMarkets
      {
        height: v-bind('(dynamicTableHeight + 18) + "px"')
      }
    }
    @media screen and (min-width: 1612.1px) and (max-width: 1693px) 
    { 
      .tableFlipContainer.flipped.viewingTokenMarkets
      {
        height: v-bind('(dynamicTableHeight + 36) + "px"')
      }
    }
    @media screen and (min-width: 1528.1px) and (max-width: 1612px) 
    { 
      .tableFlipContainer.flipped.viewingTokenMarkets
      {
        height: v-bind('(dynamicTableHeight + 53) + "px"')
      }
    }
    @media screen and (min-width: 1521.1px) and (max-width: 1528px) 
    { 
      .tableFlipContainer.flipped.viewingTokenMarkets
      {
        height: v-bind('(dynamicTableHeight + 71) + "px"')
      }
    }
    @media screen and (max-width: 1521px) 
    { 
      .tableFlipContainer.flipped.viewingTokenMarkets
      {
        height: v-bind('(dynamicTableHeight + 88) + "px"')
      }
    }
  }

  /*Table Flip Container Back ViewingOwnerMarkets*/
  @media screen and (min-width: 1746.1px)
  { 
    .tableFlipContainer.flipped.viewingOwnerMarkets
    {
      height: v-bind('dynamicTableHeight + "px"')
    }
  }
  @media screen and (min-width: 1693.1px) and (max-width: 1746px)
  { 
    .tableFlipContainer.flipped.viewingOwnerMarkets
    {
      height: v-bind('(dynamicTableHeight + 14) + "px"')
    }
  }
  @media screen and (min-width: 1521.1px) and (max-width: 1693px)
  { 
    .tableFlipContainer.flipped.viewingOwnerMarkets
    {
      height: v-bind('(dynamicTableHeight + 30) + "px"')
    }
  }
  @media screen and (max-width: 1521px)
  { 
    .tableFlipContainer.flipped.viewingOwnerMarkets
    {
      height: v-bind('(dynamicTableHeight + 45) + "px"')
    }
  }
  /*Set table height for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 1693.1px)
    { 
      .tableFlipContainer.flipped.viewingOwnerMarkets
      {
        height: v-bind('(dynamicTableHeight) + "px"')
      }
    }
    @media screen and (min-width: 1521.1px) and (max-width: 1693px)
    { 
      .tableFlipContainer.flipped.viewingOwnerMarkets
      {
        height: v-bind('(dynamicTableHeight + 18) + "px"')
      }
    }
    @media screen and (max-width: 1521px)
    { 
      .tableFlipContainer.flipped.viewingOwnerMarkets
      {
        height: v-bind('(dynamicTableHeight + 36) + "px"')
      }
    }
  }

  /*Table Flip Container Back ViewingTokenMarkets and ViewingOwnerMarkets*/
  @media screen and (min-width: 1762.1px)
  { 
    .tableFlipContainer.flipped.viewingBothMarkets
    {
      height: v-bind('dynamicTableHeight + "px"')
    }
  }
  @media screen and (min-width: 1746.1px) and (max-width: 1762px)
  { 
    .tableFlipContainer.flipped.viewingBothMarkets
    {
      height: v-bind('(dynamicTableHeight + 15) + "px"')
    }
  }
  @media screen and (min-width: 1693.1px) and (max-width: 1746px)
  { 
    .tableFlipContainer.flipped.viewingBothMarkets
    {
      height: v-bind('(dynamicTableHeight + 29) + "px"')
    }
  }
  @media screen and (min-width: 1521.1px) and (max-width: 1693px)
  { 
    .tableFlipContainer.flipped.viewingBothMarkets
    {
      height: v-bind('(dynamicTableHeight + 45) + "px"')
    }
  }
  @media screen and (max-width: 1521px)
  { 
    .tableFlipContainer.flipped.viewingBothMarkets
    {
      height: v-bind('(dynamicTableHeight + 60) + "px"')
    }
  }
  /*Set table height for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 1864.1px)
    { 
      .tableFlipContainer.flipped.viewingTokenMarkets
      {
        height: v-bind('dynamicTableHeight + "px"')
      }
    }
    @media screen and (min-width: 1693.1px) and (max-width: 1864px) 
    { 
      .tableFlipContainer.flipped.viewingTokenMarkets
      {
        height: v-bind('(dynamicTableHeight + 18) + "px"')
      }
    }
    @media screen and (min-width: 1612.1px) and (max-width: 1693px)
    { 
      .tableFlipContainer.flipped.viewingBothMarkets
      {
        height: v-bind('(dynamicTableHeight + 36) + "px"')
      }
    }
    @media screen and (min-width: 1528.1px) and (max-width: 1612px) 
    { 
      .tableFlipContainer.flipped.viewingBothMarkets
      {
        height: v-bind('(dynamicTableHeight + 52) + "px"')
      }
    }
    @media screen and (min-width: 1521.1px) and (max-width: 1528px) 
    { 
      .tableFlipContainer.flipped.viewingBothMarkets
      {
        height: v-bind('(dynamicTableHeight + 72) + "px"')
      }
    }
    @media screen and (max-width: 1521px)
    { 
      .tableFlipContainer.flipped.viewingBothMarkets
      {
        height: v-bind('(dynamicTableHeight + 89) + "px"')
      }
    }
  }
</style>