<template>
  <h2>Under Construction On Devnet<br>Monopoly Money</h2>
  <div class="flexCenterColumn">
    <TVLLongSVG id="tvlLongSVG" class="nLargeMarginTop" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
    <TVLShortSVG id="tvlShortSVG" class="nLargeMarginTop" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
  </div>
  <!--<M4AProtocolTVLLongHTMLText/>-->
  <!--<M4AProtocolTVLShortHTMLText/>-->
  <h1 class="nMediumLargeMarginTop">$<span class="rainbowText">{{ (tvl.singlePayerTVL + tvl.hodlTVL + tvl.solvencyTVL + tvl.tokenReserveTVL).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 }) }}</span></h1>
      
  <div class="tableFlipContainer" :class="flipped" :style="{ height: activeContainerHeight }">
    <div class="tableCard" :class="flipped">
      
      <div class="frontTable" ref="frontTableRef" :style="{display: display1stTable}">
        <h1>Treasuries</h1>
        <ion-button @click="flipTable()" color="dark" :disabled="flipping">Toggle Reserves</ion-button>
        <SinglePayerTreasuryTable/>
        <HODLTreasuryTable/>
        <SolvencyInsuranceTreasuryTable/>
      </div>

      <div class="backTable" ref="backTableRef" :style="{display: display2ndTable}">
        <h1>Reserves</h1>
        <ion-button @click="flipTable()" color="dark" :disabled="flipping">Toggle Treasuries</ion-button>
        <TokenReservesTable @createSubMarketModal="(tokenMintAddress: PublicKey, tokenSVG: Component, tokenName:string) =>
          createSubMarketModal.openCreateSubMarketModal(tokenMintAddress, tokenSVG, tokenName)"
          @collectSubMarketFeesModal="(rowData: any) => collectSubMarketFeesModal.openCollectSubMarketFeesModal(rowData)"/>
        <OwnersTable @collectSubMarketFeesModal="(rowData: any) => collectSubMarketFeesModal.openCollectSubMarketFeesModal(rowData)"/>
      </div>
    </div>
  </div>

  <CreateSubMarketModal ref="createSubMarketModal"/>
  <CollectSubMarketFeesModal ref="collectSubMarketFeesModal"/>

  <!--<KingobamaMobileT1 :style="{display: display1stTable}"/>
  <KingobamaMobileT2 :style="{display: display2ndTable}"/>-->
</template>


  
<script setup lang="ts">
  import { ref, onMounted, onUnmounted, Component } from 'vue'
  import { IonButton } from '@ionic/vue'
  import SinglePayerTreasuryTable from '/src/components/tables/lending/SinglePayerTreasuryTable.vue'
  import HODLTreasuryTable from '/src/components/tables/lending/HODLTreasuryTable.vue'
  import SolvencyInsuranceTreasuryTable from '/src/components/tables/lending/SolvencyInsuranceTreasuryTable.vue'
  import TokenReservesTable from '/src/components/tables/lending/TokenReservesTable.vue'
  import OwnersTable from '/src/components/tables/lending/OwnersTable.vue'
  import TVLLongSVG from '/src/assets/svg/tvl-long-svg.vue'
  import TVLShortSVG from '/src/assets/svg/tvl-short-svg.vue'
  import { tvl } from '/src/assets/globalStates/AdminAccounts.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { PublicKey } from "@solana/web3.js"
  import { startBlockChainTimeStampRefresh, startBlockChainTimeStampEstimation, stopBlockChainTimeStampRefresh } from '/src/assets/helperFunctions/UnixTimeStampHelper.ts'
  import CreateSubMarketModal from '/src/components/smart contracts/lending protocol/CreateSubMarketModal.vue'
  import CollectSubMarketFeesModal from '/src/components/smart contracts/lending protocol/CollectSubMarketFeesModal.vue'
  import KingobamaMobileT1 from '/src/components/fancy/poly/KingobamaMobileT1.vue'
  import KingobamaMobileT2 from '/src/components/fancy/poly/KingobamaMobileT2.vue'
  import M4AProtocolTVLLongHTMLText from './M4AProtocolTVLLongHTMLText.vue'
  import M4AProtocolTVLShortHTMLText from './M4AProtocolTVLShortHTMLText.vue'

  defineProps(['colorName', 'colorHexValue'])

  var flipping = ref(false)
  var flipped = ""
  var display1stTable = ref("")
  var display2ndTable = ref("none")

  var createSubMarketModal = ref()
  var collectSubMarketFeesModal = ref()

  //New Reactive DOM Observers
  const activeContainerHeight = ref('auto')
  const frontTableRef = ref<HTMLElement | null>(null)
  const backTableRef = ref<HTMLElement | null>(null)

  let frontObserver: ResizeObserver | null = null
  let backObserver: ResizeObserver | null = null

  function handleHeightUpdate()
  {
    if(flipped === "")
    {
      if(frontTableRef.value)
        activeContainerHeight.value = `${frontTableRef.value.offsetHeight}px`
    }
    else
    {
      if(backTableRef.value)
        activeContainerHeight.value = `${backTableRef.value.offsetHeight}px`
    }
  }

  onMounted(async() => 
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

    //Initialize Observers to watch for inner component size modifications dynamically
    frontObserver = new ResizeObserver(() => handleHeightUpdate())
    backObserver = new ResizeObserver(() => handleHeightUpdate())

    if(frontTableRef.value)
      frontObserver.observe(frontTableRef.value)
    if(backTableRef.value)
      backObserver.observe(backTableRef.value)

    await startBlockChainTimeStampRefresh()
    startBlockChainTimeStampEstimation()
  })

  onUnmounted(() =>
  {
    stopBlockChainTimeStampRefresh()
    if(frontObserver)
      frontObserver.disconnect()
    if(backObserver)
      backObserver.disconnect()
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

      handleHeightUpdate()

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

      handleHeightUpdate()

      setTimeout(() => 
      {
        display2ndTable.value = "none"
        flipping.value = false
      }, 500) //500 milliseconds == 0.5 seconds
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
    width: 100%;
    transition: height 0.5s ease;
    overflow: hidden
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

  .frontTable, .backTable
  {
    width: 90vw;
    position: absolute;
    backface-visibility: hidden;
    transform: rotateX(0deg) /*Needed Just for fire fox ignoring backface-visibilty*/
  }

  .backTable
  {
    transform: rotateY(180deg)
  }

  /* Presentation layout logic for TVL SVGs remains unchanged */
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
</style>