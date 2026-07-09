<template>
  <div class="tableFlipContainer" :class="[flipped]" :style="{ height: activeContainerHeight }">
    <div class="tableCard" :class="flipped">
      
      <div class="frontTable" ref="frontTableRef" :style="{display: display1stTable}">
        <h2>Lending Protocol Running On<br>Testnet</h2>
        <h1>Markets</h1>
    
        <ion-button @click="flipTable(); portfolioReRenderHelper+=1" color="dark" :disabled="flipping">Toggle Portfolios</ion-button>
        <MarketsTable @openDepositModal="openDepositModal"
          @openWithdrawalModal="openWithdrawModal"
          @openBorrowModal="openBorrowModal"
          @openRepayModal="openRepayModal"/>
      </div>

      <div class="backTable" ref="backTableRef" :style="{display: display2ndTable}">
        <h2>Lending Protocol Running On<br>Testnet</h2>

        <div class="flexCenterRow nTinyMarginTop">
          <InfoButton :infoMessage="portfolioChartInfoMSG"/>
          <h1 id="protfolioHeader">Portfolios</h1>
        </div>
    
        <ion-button @click="flipTable()" color="dark" :disabled="flipping">Toggle Markets</ion-button>
        <Portfolios :portfolioReRenderHelper="portfolioReRenderHelper"
          @openDepositModal="openDepositModal"
          @openWithdrawalModal="openWithdrawModal"
          @openBorrowModal="openBorrowModal"
          @openRepayModal="openRepayModal"
          @openLiquidationModal="openLiquidationModal"/>
      </div>
    </div>
  </div>

  <DepositModal ref="depositModal"/>
  <WithdrawalModal ref="withdrawalModal"/>
  <BorrowModal ref="borrowModal"/>
  <RepayModal ref="repayModal"/>
  <LiquidationModal ref="liquidationModal"/>

  <KingobamaMobile class="Kingobama"/>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { IonButton } from '@ionic/vue'
  import MarketsTable from '/src/components/tables/lending/MarketsTable.vue'
  import Portfolios from '/src/components/smart contracts/lending protocol/Portfolios.vue'
  import DepositModal from '/src/components/smart contracts/lending protocol/DepositModal.vue'
  import WithdrawalModal from '/src/components/smart contracts/lending protocol/WithdrawalModal.vue'
  import BorrowModal from '/src/components/smart contracts/lending protocol/BorrowModal.vue'
  import RepayModal from '/src/components/smart contracts/lending protocol/RepayModal.vue'
  import LiquidationModal from '/src/components/smart contracts/lending protocol/LiquidationModal.vue'
  import KingobamaMobile from '/src/components/fancy/poly/KingobamaMobile.vue'
  import InfoButton from '/src/components/help/InfoButton.vue'
  import { startBlockChainTimeStampRefresh, startBlockChainTimeStampEstimation, stopBlockChainTimeStampRefresh } from '/src/assets/helperFunctions/UnixTimeStampHelper.ts'
  
  defineProps(['colorName', 'colorHexValue'])//This just keeps a warning from going off since all pages get feed these props

  var flipping = ref(false)
  var flipped = ""
  var display1stTable = ref("")
  var display2ndTable = ref("none")

  var depositModal = ref()
  var withdrawalModal = ref()
  var borrowModal = ref()
  var repayModal = ref()
  var liquidationModal = ref()

  var portfolioReRenderHelper = ref(0)

  const portfolioChartInfoMSG = "\nInterest earned and accrued is updated\nin the charts after a user does any\nlending activity, IE: depositing,\nrepaying, etc."
  
  const activeContainerHeight = ref('auto')
  const frontTableRef = ref<HTMLElement | null>(null)
  const backTableRef = ref<HTMLElement | null>(null)

  let frontObserver: ResizeObserver | null = null
  let backObserver: ResizeObserver | null = null

  //Core handler that maps real DOM heights straight to your CSS transition
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

  onMounted(async () =>
  {
    flipped = localStorage.getItem("marketTableSelect") || ""
    if (flipped === "") {
      display1stTable.value = ""
      display2ndTable.value = "none"
    } else {
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

    if(flipped === "")
    {
      flipped = "flipped"
      display2ndTable.value = "block"
      localStorage.setItem("marketTableSelect", flipped)
      
      // Recalculate heights mid-flip animation sequence
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
      localStorage.setItem("marketTableSelect", flipped)
      
      handleHeightUpdate()

      setTimeout(() =>
      {
        display2ndTable.value = "none"
        flipping.value = false
      }, 500) //500 milliseconds == 0.5 seconds
    }
  }

  function openDepositModal(tokenId: number, tokenMintAddressString: String, subMarkets: any[])
  {
    depositModal.value.openDepositModal(tokenId, tokenMintAddressString, subMarkets)
  }

  function openWithdrawModal(tokenId: number, tokenMintAddressString: String, subMarkets: any[])
  {
    withdrawalModal.value.openWithdrawalModal(tokenId, tokenMintAddressString, subMarkets)
  }

  function openBorrowModal(tokenId: number, tokenMintAddressString: String, subMarkets: any[])
  {
    borrowModal.value.openBorrowModal(tokenId, tokenMintAddressString, subMarkets)
  }

  function openRepayModal(tokenId: number, tokenMintAddressString: String, subMarkets: any[])
  {
    repayModal.value.openRepayModal(tokenId, tokenMintAddressString, subMarkets)
  }

  function openLiquidationModal(tokenId: number, ownerAddressString: String, accountIndex: number)
  {
    liquidationModal.value.openLiquidationModal(tokenId, ownerAddressString, accountIndex)
  }
</script>

<style scoped>
  .tableFlipContainer
  {
    position: relative;
    width: 100%;
    /* The v-bind height rules are removed. The inline style attribute now controls this */
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
</style>