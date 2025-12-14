<template>
  <div class="tableFlipContainer" :class="[flipped, onLeaderBoard]">
    <div class="tableCard" :class="flipped">
      <div class="frontTable" :style="{display: display1stTable}">
        <h2>Under Construction On Devnet<br>Monopoly Money</h2>
        <h1>Markets</h1>
    
        <ion-button @click="flipTable(); portfolioChartReRenderHelper+=1" color="dark" :disabled="flipping">Toggle Portfolios</ion-button>
        <MarketsTable @openDepositModal="openDepositAndCloseOthers"
        @openWithdrawalModal="openWithdrawAndCloseOthers"
        @openBorrowModal="openBorrowAndCloseOthers"
        @openRepayModal="openRepayAndCloseOthers"
        @marketTableHeightChange="updateUserNameRelatedMarketTableHeight"/>
      </div>

      <div class="backTable" :style="{display: display2ndTable}">
        <h2>Under Construction On Devnet<br>Monopoly Money</h2>

        <div class="flexCenterRow nTinyMarginTop">
          <InfoButton :infoMessage="portfolioChartInfoMSG"/>
          <h1 id="protfolioHeader">Portfolios</h1>
        </div>
    
        <ion-button @click="flipTable()" color="dark" :disabled="flipping">Toggle Markets</ion-button>
        <Portfolios :portfolioChartReRenderHelper="portfolioChartReRenderHelper"
        @openDepositModal="openDepositAndCloseOthers"
        @openWithdrawalModal="openWithdrawAndCloseOthers"
        @openBorrowModal="openBorrowAndCloseOthers"
        @openRepayModal="openRepayAndCloseOthers"
        @portfolioHeightChange="updatePortfolioRelatedHeight"
        @totalLeaderBoardLendingUsers="setTotalLeaderBoardLendingUsers"
        @leaderBoardSubTableAndSubRowAdjust="adjustLeaderBoardSubTableAndRowCount"
        @leaderBoardSubTableAndSubRowSet="setLeaderBoardSubTableAndRowCount"/>
      </div>
    </div>
  </div>

  <DepositModal ref="depositModal"/>
  <WithdrawalModal ref="withdrawalModal"/>
  <BorrowModal ref="borrowModal"/>
  <RepayModal ref="repayModal"/>

  <KingobamaMobileM1Market :style="{display: display1stTable}"/>
  <div :style="{display: display2ndTable}">
    <KingobamaMobileM4LeaderBoard v-if="onLeaderBoard=='onLeaderBoard'"/>
    <KingobamaMobileM2NoRecords v-else-if="stableCoinRowCount==0 && cryptoCurrencyRowCount==0"/>
    <KingobamaMobileM3Portfolio v-else/>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { IonButton } from '@ionic/vue'
  import MarketsTable from '/src/components/tables/lending/MarketsTable.vue'
  import Portfolios from '/src/components/smart contracts/lending protocol/Portfolios.vue'
  import DepositModal from '/src/components/smart contracts/lending protocol/DepositModal.vue'
  import WithdrawalModal from '/src/components/smart contracts/lending protocol/WithdrawalModal.vue'
  import BorrowModal from '/src/components/smart contracts/lending protocol/BorrowModal.vue'
  import RepayModal from '/src/components/smart contracts/lending protocol/repayModal.vue'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
  import { isBrowserFireFox } from '/src/assets/helperFunctions/browserHelper.ts'
  import { isValidSolanaPublicKey } from '/src/assets/contracts/WalletHelper.vue'
  import KingobamaMobileM1Market from '/src/components/fancy/poly/KingobamaMobileM1Market.vue'
  import KingobamaMobileM2NoRecords from '/src/components/fancy/poly/KingobamaMobileM2NoRecords.vue'
  import KingobamaMobileM3Portfolio from '/src/components/fancy/poly/KingobamaMobileM3Portfolio.vue'
  import KingobamaMobileM4LeaderBoard from '/src/components/fancy/poly/KingobamaMobileM4LeaderBoard.vue'
  import InfoButton from '/src/components/help/InfoButton.vue'

  defineProps(['colorName', 'colorHexValue'])//This just keeps a warning from going off since all pages get feed these props

  var flipping = ref(false)
  var flipped = ""
  var onLeaderBoard = ref("")
  var display1stTable = ref("")
  var display2ndTable = ref("none")

  var depositModal = ref()
  var withdrawalModal = ref()
  var borrowModal = ref()
  var repayModal = ref()
  var tokenRelatedDynamicTableHeight = ref(0)
  var userNameRelatedDynamicTableHeight = ref(0)
  var portfolioRelatedDynamicTableHeight = ref(0)
  var stableCoinRowCount = ref(0)
  var cryptoCurrencyRowCount = ref(0)

  var portfolioChartReRenderHelper = ref(0)
  var lendingLeaderBoardTopRowCount = ref(0)
  var lendingLeaderBoardSubRowCount = ref(0)
  var lendingLeaderBoardSubTableCount = ref(0)

  const portfolioChartInfoMSG = "\nInterest earned and\naccrued is updated in the\ncharts after a user updates\ntheir snap shots or does\nany lending activity, IE:\ndepositing, repaying, etc."
  
  onMounted(() => 
  {
    updateTokenRelatedMarketTableHeight()

    flipped = localStorage.getItem("marketTableSelect") || ""
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

      localStorage.setItem("marketTableSelect", flipped)

      setTimeout(() => 
      {
        display1stTable.value = "none"
        flipping.value = false
      }, 500) //1000 milliseconds == 1 seconds
    }
    else
    {
      flipped = ""
      display1stTable.value = "block"

      localStorage.setItem("marketTableSelect", flipped)

      setTimeout(() => 
      {
        display2ndTable.value = "none"
        flipping.value = false
      }, 500) //1000 milliseconds == 1 seconds
    }   
  }

  function openDepositAndCloseOthers(tokenMintAddressString: String, fdr3SubMarkets: any[])
  {
    withdrawalModal.value.closeWithdrawalModal()
    borrowModal.value.closeBorrowModal()
    repayModal.value.closeRepayModal()
    
    depositModal.value.openDepositModal(tokenMintAddressString, fdr3SubMarkets)
  }

  function openWithdrawAndCloseOthers(tokenMintAddressString: String, fdr3SubMarkets: any[])
  {
    depositModal.value.closeDepositModal()
    borrowModal.value.closeBorrowModal()
    repayModal.value.closeRepayModal()

    withdrawalModal.value.openWithdrawalModal(tokenMintAddressString, fdr3SubMarkets)
  }

  function openBorrowAndCloseOthers(tokenMintAddressString: String, fdr3SubMarkets: any[])
  {
    depositModal.value.closeDepositModal()
    withdrawalModal.value.closeWithdrawalModal()
    repayModal.value.closeRepayModal()

    borrowModal.value.openBorrowModal(tokenMintAddressString, fdr3SubMarkets)
  }

  function openRepayAndCloseOthers(tokenMintAddressString: String, fdr3SubMarkets: any[])
  {
    depositModal.value.closeDepositModal()
    withdrawalModal.value.closeWithdrawalModal()
    borrowModal.value.closeBorrowModal()

    repayModal.value.openRepayModal(tokenMintAddressString, fdr3SubMarkets)
  }

  function updateTokenRelatedMarketTableHeight()
  {
    var baseTableHeight
    var tokenRelatedHeight = 0

    if(!isBrowserFireFox())
      baseTableHeight = 728
    else
      baseTableHeight = 727
    
    if(StableCoins.length == 0)
      tokenRelatedHeight += 14
    else
      tokenRelatedHeight += StableCoins.length * 70

    if(CryptoCurrency.length == 0)
      tokenRelatedHeight += 14
    else
      tokenRelatedHeight += CryptoCurrency.length * 70

    tokenRelatedDynamicTableHeight.value = baseTableHeight + tokenRelatedHeight
  }

  function updateUserNameRelatedMarketTableHeight(hasAtleast1Account: boolean, editingAccountName: boolean)
  {
    var accountStateRelatedHeight

    if(editingAccountName)
      accountStateRelatedHeight = 118
    else if(hasAtleast1Account)
      accountStateRelatedHeight = 58
    else
      accountStateRelatedHeight = 0

    userNameRelatedDynamicTableHeight.value = accountStateRelatedHeight
  }

  function setTotalLeaderBoardLendingUsers(userRowCount: number)
  {
    if(userRowCount == 0)
      lendingLeaderBoardTopRowCount.value = 1
    else
      lendingLeaderBoardTopRowCount.value = userRowCount

    updatePortfolioRelatedHeight("", 0, 0, true)
  }

  function adjustLeaderBoardSubTableAndRowCount(subTableCountAdjustment: number, subRowCountAdjustment: number)
  {
    lendingLeaderBoardSubTableCount.value += subTableCountAdjustment
    lendingLeaderBoardSubRowCount.value += subRowCountAdjustment

    updatePortfolioRelatedHeight("", 0, 0, true)
  }
  
  function setLeaderBoardSubTableAndRowCount(subTableCount: number, subRowCount: number)
  {
    lendingLeaderBoardSubTableCount.value = subTableCount
    lendingLeaderBoardSubRowCount.value = subRowCount

    updatePortfolioRelatedHeight("", 0, 0, true)
  }

  function updatePortfolioRelatedHeight(searchAddress: string, userStableCoinTabCount: number, userCryptoCurrencyTabCount: number, isBrowsingAllUsers: boolean)
  { 
    var dynamicHeight = 0

    if(isBrowsingAllUsers)
      onLeaderBoard.value = "onLeaderBoard"
    else
      onLeaderBoard.value = ""

    stableCoinRowCount.value = userStableCoinTabCount
    cryptoCurrencyRowCount.value = userCryptoCurrencyTabCount

    if(!isBrowsingAllUsers)
    {
      if(!isValidSolanaPublicKey(searchAddress))
        if(!isBrowserFireFox())
          dynamicHeight += 500//Base height
        else
          dynamicHeight += 505//Base height
      else if(userStableCoinTabCount == 0 && userCryptoCurrencyTabCount == 0)
        dynamicHeight += 455//Base height
      else
        dynamicHeight += 425//Base height
    }
    else
    {
      if(!isBrowserFireFox())
      {
        dynamicHeight = 600
        dynamicHeight += 56 * lendingLeaderBoardSubTableCount.value //SubTable Header Row
      }
      else
      {
        dynamicHeight = 588
        dynamicHeight += 64.4 * lendingLeaderBoardSubTableCount.value //SubTable Header Row
      }

      dynamicHeight += 75 * lendingLeaderBoardTopRowCount.value //User Row
      dynamicHeight += 64 * lendingLeaderBoardSubRowCount.value //User SubAccount Row
      dynamicHeight += 26 * lendingLeaderBoardSubTableCount.value //Space above and below subtable
    }

    portfolioRelatedDynamicTableHeight.value = dynamicHeight
  }
</script>

<style scoped>
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

  /*Set Market Table height*/
  @media screen and (min-width: 1769.1px)
  { 
    .tableFlipContainer
    {
      height: v-bind('(0 + tokenRelatedDynamicTableHeight + userNameRelatedDynamicTableHeight) + "px"')
    } 
  }
  @media screen and (min-width: 1560.1px) and (max-width: 1769px)
  { 
    .tableFlipContainer
    {
      height: v-bind('(35 + tokenRelatedDynamicTableHeight + userNameRelatedDynamicTableHeight) + "px"')
    } 
  }
  @media screen and (max-width: 1560px)
  { 
    .tableFlipContainer
    {
      height: v-bind('(51 + tokenRelatedDynamicTableHeight + userNameRelatedDynamicTableHeight) + "px"')
    }
  }
  /*Set table height for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 1769.1px)
    { 
      .tableFlipContainer
      {
        height: v-bind('(0 + tokenRelatedDynamicTableHeight + userNameRelatedDynamicTableHeight) + "px"')
      } 
    }
    @media screen and (min-width: 1757.1px) and (max-width: 1769px)
    { 
      .tableFlipContainer
      {
        height: v-bind('(35 + tokenRelatedDynamicTableHeight + userNameRelatedDynamicTableHeight) + "px"')
      } 
    }
    @media screen and (min-width: 1737.1px) and (max-width: 1757px)
    { 
      .tableFlipContainer
      {
        height: v-bind('(53 + tokenRelatedDynamicTableHeight + userNameRelatedDynamicTableHeight) + "px"')
      } 
    }
    @media screen and (min-width: 1698.1px) and (max-width: 1737px)
    { 
      .tableFlipContainer
      {
        height: v-bind('(72 + tokenRelatedDynamicTableHeight + userNameRelatedDynamicTableHeight) + "px"')
      } 
    }
    @media screen and (max-width: 1698px)
    { 
      .tableFlipContainer
      {
        height: v-bind('(89 + tokenRelatedDynamicTableHeight + userNameRelatedDynamicTableHeight) + "px"')
      }
    }
  }

  /*Set Portfolio Table Height flipped*/
  @media screen and (min-width: 1285.1px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 199.78 : 0) + (stableCoinRowCount > 0 ? 150 : 0) + (cryptoCurrencyRowCount > 0 ? 150 : 0)  + ((216 + 15 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*199.78(PortfolioHeader) + 150(StableCoinHeader) + 150(CryptoCurrencyHeader) + 216(Specific Token Row) + 15(Legend) + 160(Chart)*/
    } 
  }
  @media screen and (min-width: 1160.1px) and (max-width: 1285px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(10 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 336.17 : 0) + (stableCoinRowCount > 0 ? 226 : 0) + (cryptoCurrencyRowCount > 0 ? 226 : 0) + ((450.38 + 15 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*336.17(PortfolioHeader) + 226(StableCoinHeader) + 226(CryptoCurrencyHeader) + 450.38(Specific Token Row) + 15(Legend) + 160(Chart)*/
    }
  }
  @media screen and (min-width: 620.1px) and (max-width: 1160px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(10 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 336.17 : 0) + (stableCoinRowCount > 0 ? 226 : 0) + (cryptoCurrencyRowCount > 0 ? 226 : 0) + ((450.38 + 35 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*336.17(PortfolioHeader) + 226(StableCoinHeader) + 226(CryptoCurrencyHeader) + 450.38(Specific Token Row) + 35(Legend) + 160(Chart)*/
    }
  }
  @media screen and (min-width: 527.1px) and (max-width: 620px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(11 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 336.17 : 0) + (stableCoinRowCount > 0 ? 225 : 0) + (cryptoCurrencyRowCount > 0 ? 225 : 0) + ((449 + 135 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*336.17(PortfolioHeader) + 225(StableCoinHeader) + 225(CryptoCurrencyHeader) + 450(Specific Token Row) + 135(Legend) + 160(Chart)*/
    }
  }
  @media screen and (min-width: 450.1px) and (max-width: 527px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(13 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 363.5 : 0) + (stableCoinRowCount > 0 ? 207 : 0) + (cryptoCurrencyRowCount > 0 ? 207 : 0) + ((426 + 135 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*363.5(PortfolioHeader) + 207(StableCoinHeader) + 207(CryptoCurrencyHeader) + 426(Specific Token Row) + 135(Legend) + 160(Chart)*/
    }
  }
  @media screen and (min-width: 400.1px) and (max-width: 450px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(92 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 355.77 : 0) + (stableCoinRowCount > 0 ? 192.38 : 0) + (cryptoCurrencyRowCount > 0 ? 192.38 : 0) + ((403 + 135 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*355.77(PortfolioHeader) + 192.38(StableCoinHeader) + 192.38(CryptoCurrencyHeader) + 403(Specific Token Row) + 135(Legend) + 160(Chart)*/
    }
  }
  @media screen and (min-width: 364.1px) and (max-width: 400px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(119 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 336.58 : 0) + (stableCoinRowCount > 0 ? 182.75 : 0) + (cryptoCurrencyRowCount > 0 ? 182.75 : 0) + ((387.94 + 135 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*336.58(PortfolioHeader) + 182.75(StableCoinHeader) + 182.75(CryptoCurrencyHeader) + 387.94(Specific Token Row) + 135(Legend) + 160(Chart)*/
    }
  }
  @media screen and (min-width: 300.1px) and (max-width: 364px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(144 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 322.77 : 0) + (stableCoinRowCount > 0 ? 175.88 : 0) + (cryptoCurrencyRowCount > 0 ? 175.88 : 0) + ((377.16 + 126 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*322.77(PortfolioHeader) + 175.88(StableCoinHeader) + 175.88(CryptoCurrencyHeader) + 377.16(Specific Token Row) + 126(Legend) + 160(Chart)*/
    }
  }
  @media screen and (max-width: 300px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(258 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 298.17 : 0) + (stableCoinRowCount > 0 ? 163.56 : 0) + (cryptoCurrencyRowCount > 0 ? 163.56 : 0) + ((357.94 + 126 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*298.17(PortfolioHeader) + 163.56(StableCoinHeader) + 163.56(CryptoCurrencyHeader) + 357.94(Specific Token Row) + 126(Legend) + 160(Chart)*/
    }
  }
  /*Set table height for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 1285.1px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 203 : 0) + (stableCoinRowCount > 0 ? 150 : 0) + (cryptoCurrencyRowCount > 0 ? 150 : 0)  + ((236.6 + 18 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*203(PortfolioHeader) + 150(StableCoinHeader) + 150(CryptoCurrencyHeader) + 236.6(Specific Token Row) + 18(Legend) + 160(Chart)*/
      } 
    }
    @media screen and (min-width: 1160.1px) and (max-width: 1285px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(10 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 339.4 : 0) + (stableCoinRowCount > 0 ? 226 : 0) + (cryptoCurrencyRowCount > 0 ? 226 : 0) + ((482.4 + 18 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*339.4(PortfolioHeader) + 226(StableCoinHeader) + 226(CryptoCurrencyHeader) + 482.4(Specific Token Row) + 18(Legend) + 160(Chart)*/
      }
    }
    @media screen and (min-width: 620.1px) and (max-width: 1160px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(10 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 339.4 : 0) + (stableCoinRowCount > 0 ? 226 : 0) + (cryptoCurrencyRowCount > 0 ? 226 : 0) + ((482.4 + 41 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*339.4(PortfolioHeader) + 226(StableCoinHeader) + 226(CryptoCurrencyHeader) + 482.4(Specific Token Row) + 41(Legend) + 160(Chart)*/
      }
    }
    @media screen and (min-width: 527.1px) and (max-width: 620px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(11 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 339.4 : 0) + (stableCoinRowCount > 0 ? 225.067 : 0) + (cryptoCurrencyRowCount > 0 ? 225.067 : 0) + ((481.467 + 162 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*339.4(PortfolioHeader) + 225.067(StableCoinHeader) + 225.067(CryptoCurrencyHeader) + 481.467(Specific Token Row) + 162(Legend) + 160(Chart)*/
      }
    }
    @media screen and (min-width: 450.1px) and (max-width: 527px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(13 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 366.717 : 0) + (stableCoinRowCount > 0 ? 207.133 : 0) + (cryptoCurrencyRowCount > 0 ? 207.133 : 0) + ((458 + 162 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*366.717(PortfolioHeader) + 207.133(StableCoinHeader) + 207.133(CryptoCurrencyHeader) + 458(Specific Token Row) + 162(Legend) + 160(Chart)*/
      }
    }
    @media screen and (min-width: 400.1px) and (max-width: 450px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(92 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 362.2 : 0) + (stableCoinRowCount > 0 ? 192.4 : 0) + (cryptoCurrencyRowCount > 0 ? 192.4 : 0) + ((435 + 162 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*362.2(PortfolioHeader) + 192.4(StableCoinHeader) + 192.4(CryptoCurrencyHeader) + 435(Specific Token Row) + 162(Legend) + 160(Chart)*/
      }
    }
    @media screen and (min-width: 364.1px) and (max-width: 400px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(119 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 343 : 0) + (stableCoinRowCount > 0 ? 182.8  : 0) + (cryptoCurrencyRowCount > 0 ? 182.8 : 0) + ((420 + 162 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*343(PortfolioHeader) + 182.8(StableCoinHeader) + 182.8(CryptoCurrencyHeader) + 420(Specific Token Row) + 162(Legend) + 160(Chart)*/
      }
    }
    @media screen and (min-width: 300.1px) and (max-width: 364px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(144 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 329.4 : 0) + (stableCoinRowCount > 0 ? 175.867 : 0) + (cryptoCurrencyRowCount > 0 ? 175.867 : 0) + ((410.2 + 157.2 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*329.4(PortfolioHeader) + 175.867(StableCoinHeader) + 175.867(CryptoCurrencyHeader) + 410.2(Specific Token Row) + 157.2(Legend) + 160(Chart)*/
      }
    }
    @media screen and (max-width: 300px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(258 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 304.6 : 0) + (stableCoinRowCount > 0 ? 163.6 : 0) + (cryptoCurrencyRowCount > 0 ? 163.6 : 0) + ((390 + 151.2 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*304.6(PortfolioHeader) + 163.56(StableCoinHeader) + 163.56(CryptoCurrencyHeader) + 390(Specific Token Row) + 151.2(Legend) + 160(Chart)*/
      }
    }
  }

  /*Set Portfolio Table Height flipped onLeaderBoard*/
  @media screen and (min-width: 1881.1px)
  { 
    .tableFlipContainer.flipped.onLeaderBoard
    {
      height: v-bind('(portfolioRelatedDynamicTableHeight) + "px"')
    } 
  }
  @media screen and (max-width: 1881px)
  { 
    .tableFlipContainer.flipped.onLeaderBoard
    {
      height: v-bind('(15 + portfolioRelatedDynamicTableHeight) + "px"') /*15(scrollbar)*/
    }
  }
  /*Set table height for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 1881.1px)
    { 
      .tableFlipContainer.flipped.onLeaderBoard
      {
        height: v-bind('(portfolioRelatedDynamicTableHeight) + "px"')
      } 
    }
    @media screen and (max-width: 1881px)
    { 
      .tableFlipContainer.flipped.onLeaderBoard
      {
        height: v-bind('(17 + portfolioRelatedDynamicTableHeight) + "px"') /*17(scrollbar)*/
      }
    }
  }
</style>