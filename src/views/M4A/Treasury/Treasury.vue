<template>
  <h2 class="nMediumLargeMarginBottom">Lending Protocol Testing On<br>🥳Mainnet🥳</h2>
  <div class="flexCenterColumn">
    <div class="flexCenterRow">
      
      <TVLLongSVG id="tvlLongSVG" :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
      <TVLShortSVG id="tvlShortSVG"  :fill="darkTheme.value ? '#FFFFFF' : '#000000'"/>
      <span id="infoButton" class=" infoButtonContainer nSmallMarginRight">
        <InfoButton :infoMessage="tvlInfoMSG"/>
      </span>
    </div>
  </div>
  <!--<M4AProtocolTVLLongHTMLText/>-->
  <!--<M4AProtocolTVLShortHTMLText/>-->
  <h1 class="nSmallMarginTop nTinyMarginBottom">$<span class="rainbowText">{{ totalTVL }}</span></h1>
  <ion-button color="lightOffDark" class="thinBorder mediumMarginBottom" style="border-radius: 4px" @click="handleShowTVLHistory()">
    <ion-label v-if="!showTVLHistory" color="green">Show History</ion-label>
    <ion-label v-else color="green">Hide History</ion-label>
  </ion-button>

  <transition name="chartSlide">
    <div v-if="showTVLHistory" class="chartindow">
      <div class="chartContent">
        <div class="beamOverlay"></div>
        <TVLChart :currentTVL="totalTVL"/>
      </div>
    </div>
  </transition>
      
  <div class="tableFlipContainer" :class="flipped" :style="{ height: activeContainerHeight }">
    <div class="tableCard" :class="flipped">
      
      <div class="frontTable" ref="frontTableRef" :style="{display: display1stTable}">
        <h1 class="nSmallMarginBottom">Treasuries</h1>
        <ion-button @click="flipTable()" color="dark" :disabled="flipping">Toggle Reserves</ion-button>
        <SinglePayerTreasuryTable/>
        <HODLTreasuryTable/>
        <SolvencyInsuranceTreasuryTable/>
      </div>

      <div class="backTable" ref="backTableRef" :style="{display: display2ndTable}">
        <h1 class="nSmallMarginBottom">Reserves</h1>
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

  <KingobamaMobile class="Kingobama"/>
</template>


  
<script setup lang="ts">
  import { ref, onMounted, onUnmounted, Component, computed } from 'vue'
  import { IonButton, IonLabel } from '@ionic/vue'
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
  import { startUnixTimeStampRefresh, startUnixChainTimeStampEstimation, stopUnixTimeStampRefresh } from '/src/assets/helperFunctions/UnixTimeStampHelper.ts'
  import CreateSubMarketModal from '/src/components/smart contracts/lending protocol/CreateSubMarketModal.vue'
  import CollectSubMarketFeesModal from '/src/components/smart contracts/lending protocol/CollectSubMarketFeesModal.vue'
  import KingobamaMobile from '/src/components/fancy/poly/KingobamaMobile.vue'
  import InfoButton from '/src/components/help/InfoButton.vue'
  import TVLChart from '/src/components/charts/lending/TVLChart.vue'
  import { playOpenChartSFX, playCloseChartSFX } from '/src/components/audio/AudioFunctions.vue'
  import M4AProtocolTVLLongHTMLText from './M4AProtocolTVLLongHTMLText.vue'
  import M4AProtocolTVLShortHTMLText from './M4AProtocolTVLShortHTMLText.vue'

  defineProps(['colorName', 'colorHexValue'])

  var flipping = ref(false)
  var flipped = ""
  var display1stTable = ref("")
  var display2ndTable = ref("none")
  var showTVLHistory = ref(false)

  var createSubMarketModal = ref()
  var collectSubMarketFeesModal = ref()

  //New Reactive DOM Observers
  const activeContainerHeight = ref('auto')
  const frontTableRef = ref<HTMLElement | null>(null)
  const backTableRef = ref<HTMLElement | null>(null)

  let frontObserver: ResizeObserver | null = null
  let backObserver: ResizeObserver | null = null

  const tvlInfoMSG = "M4A Protocol Total Value Locked is calculated by adding the deposit value of all of the Token Reserves, the wallet balances of the Solvency Treasury, and the Stable Coin wallet balances of the HODL Treasury."

  const totalTVL = computed(() =>
  {
    return(Math.floor((tvl.hodlTVLContribution + tvl.solvencyTVLContribution + tvl.tokenReserveTVL) * 100) / 100).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 })
  })
  
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

    await startUnixTimeStampRefresh()
    startUnixChainTimeStampEstimation()
  })

  onUnmounted(() =>
  {
    stopUnixTimeStampRefresh()
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

  function handleShowTVLHistory()
  {
    if(!showTVLHistory.value)
      playOpenChartSFX()
    else
      playCloseChartSFX()

    showTVLHistory.value = !showTVLHistory.value
  }
</script>

<style scoped>
  ion-button
  {
    --border-radius: 4px;
    --border-width: 1px;
    --border-style: solid;
    --border-color: currentColor /*Or your custom border color*/

    /*width: min(400px, 58vw)*/
  }

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

  .infoButtonContainer
  {
    width: min(40px, 15vw)
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
    #infoButton
    {
      margin-bottom: -10px;
      margin-left: -5px
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
    #infoButton
    {
      margin: 0px
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

/*=========================================
   1. The Slide Down/Up Transition (Grid Method)
   =========================================*/
.chartSlide-enter-active, .chartSlide-leave-active
{
  /*Grid row interpolation handles smooth height reveal without squishing chart content*/
  transition: grid-template-rows 0.6s cubic-bezier(0.33, 1, 0.68, 1),
              opacity 0.5s ease-out;
  display: grid
}

/*State BEFORE entering and AFTER leaving (Hidden)*/
.chartSlide-enter-from, .chartSlide-leave-to
{
  grid-template-rows: 0fr;
  opacity: 0
}

/*State AFTER entering and BEFORE leaving (Visible)*/
.chartSlide-enter-to, .chartSlide-leave-from
{
  grid-template-rows: 1fr;
  opacity: 1
}

.chartWindow
{
  width: 100%;
  overflow: hidden
}

.chartContent
{
  min-height: 0;
  overflow: hidden;
  position: relative
}

/*=========================================
   2. Focused Light Beam & Particle Trail
   =========================================*/
.beamOverlay
{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  overflow: hidden
}

/*The Horizontal Glowing Light Beam*/
.beamOverlay::before
{
  content: "";
  position: absolute;
  left: 0;
  width: 100%;
  height: 10px;
  opacity: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(57, 189, 57, 0.9) 50%, transparent 100%);
  box-shadow: 0 0 15px rgba(57, 189, 57, 0.8)
}

/*Particles following near the beam*/
.beamOverlay::after
{
  content: "";
  position: absolute;
  left: 0;
  width: 100%;
  height: 35px;
  opacity: 0;
  background-image: radial-gradient(circle, rgba(57, 189, 57, 0.9) 1.5px, transparent 2px);
  background-size: 24px 24px
}

/*Sweeping Down on Show*/
.chartSlide-enter-active .beamOverlay::before
{
  animation: beamSweepDown 0.65s ease-in-out forwards
}

.chartSlide-enter-active .beamOverlay::after
{
  animation: particleSweepDown 0.65s ease-in-out forwards
}

/*Sweeping Up on Hide*/
.chartSlide-leave-active .beamOverlay::before
{
  animation: beamSweepUp 0.65s ease-in-out forwards
}

.chartSlide-leave-active .beamOverlay::after
{
  animation: particleSweepUp 0.65s ease-in-out forwards
}

@keyframes beamSweepDown
{
  0%
  {
    top: -15px;
    opacity: 0
  }
  20%
  {
    opacity: 1
  }
  80%
  {
    opacity: 1
  }
  100%
  {
    top: 100%;
    opacity: 0
  }
}

@keyframes beamSweepUp
{
  0%
  {
    top: 100%;
    opacity: 0
  }
  20%
  {
    opacity: 1
  }
  80%
  {
    opacity: 1
  }
  100%
  {
    top: -15px;
    opacity: 0
  }
}

@keyframes particleSweepDown
{
  0%
  {
    top: -35px;
    opacity: 0
  }
  30%
  {
    opacity: 0.85
  }
  100%
  {
    top: 100%;
    opacity: 0
  }
}

@keyframes particleSweepUp
{
  0%
  {
    top: 100%;
    opacity: 0
  }
  30%
  {
    opacity: 0.85
  }
  100%
  {
    top: -35px;
    opacity: 0
  }
}
</style>