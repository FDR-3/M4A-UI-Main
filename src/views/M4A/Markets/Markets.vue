<template>
  <div class="tableFlipContainer" :class="[flipped, onLeaderBoard]">
    <div class="tableCard" :class="flipped">
      <div class="frontTable" :style="{display: display1stTable}">
        <h2>Under Construction On Devnet<br>Monopoly Money</h2>
        <h1>Markets</h1>
    
        <ion-button @click="flipTable(); portfolioReRenderHelper+=1" color="dark" :disabled="flipping">Toggle Portfolios</ion-button>
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
        <Portfolios :portfolioReRenderHelper="portfolioReRenderHelper"
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

  var portfolioReRenderHelper = ref(0)
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

    //On Portfolio Charts
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
    //On Lending Leader Board
    else
    {
      dynamicHeight = 557

      if(!isBrowserFireFox())
      {
        dynamicHeight += 40 //MainTable Header Row
        dynamicHeight += 44 * lendingLeaderBoardSubTableCount.value //SubTable Header Row
      }
      else
      {
        dynamicHeight += 30 //MainTable Header Row
        dynamicHeight += 50 * lendingLeaderBoardSubTableCount.value //SubTable Header Row
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
  @media screen and (min-width: 1420.1px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 215.78 : 0) + (stableCoinRowCount > 0 ? 150 : 0) + (cryptoCurrencyRowCount > 0 ? 150 : 0)  + ((231 + 15 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*215.78(PortfolioHeader) + 150(StableCoinHeader) + 150(CryptoCurrencyHeader) + 231(Specific Token Row) + 15(Legend) + 160(Chart)*/
    } 
  }
  @media screen and (min-width: 1285.1px) and (max-width: 1420px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 215.78 : 0) + (stableCoinRowCount > 0 ? 150 : 0) + (cryptoCurrencyRowCount > 0 ? 150 : 0) + ((466.38 + 15 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*215.78(PortfolioHeader) + 150(StableCoinHeader) + 150(CryptoCurrencyHeader) + 466.38(Specific Token Row) + 15(Legend) + 160(Chart)*/
    }
  }

  @media screen and (min-width: 1239.1px) and (max-width: 1285px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 215.78 : 0) + (stableCoinRowCount > 0 ? 150 : 0) + (cryptoCurrencyRowCount > 0 ? 150 : 0) + ((466.38 + 35 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*215.78(PortfolioHeader) + 150(StableCoinHeader) + 150(CryptoCurrencyHeader) + 466.38(Specific Token Row) + 35(Legend) + 160(Chart)*/
    }
  }
  @media screen and (min-width: 1111.1px) and (max-width: 1239px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 251.78 : 0) + (stableCoinRowCount > 0 ? 150 : 0) + (cryptoCurrencyRowCount > 0 ? 150 : 0) + ((466.38 + 35 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*251.78(PortfolioHeader) + 150(StableCoinHeader) + 150(CryptoCurrencyHeader) + 466.38(Specific Token Row) + 35(Legend) + 160(Chart)*/
    }
  }
  @media screen and (min-width: 730.1px) and (max-width: 1111px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(10 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 352.17 : 0) + (stableCoinRowCount > 0 ? 253 : 0) + (cryptoCurrencyRowCount > 0 ? 253 : 0) + ((466.38 + 35 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*352.17(PortfolioHeader) + 253(StableCoinHeader) + 253(CryptoCurrencyHeader) + 466.38(Specific Token Row) + 35(Legend) + 160(Chart)*/
    }
  }
  @media screen and (min-width: 527.1px) and (max-width: 730px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(11 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 352.17 : 0) + (stableCoinRowCount > 0 ? 252 : 0) + (cryptoCurrencyRowCount > 0 ? 252 : 0) + ((465.38 + 150 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*352.17(PortfolioHeader) + 252(StableCoinHeader) + 252(CryptoCurrencyHeader) + 465.38(Specific Token Row) + 150(Legend) + 160(Chart)*/
    }
  }
  @media screen and (min-width: 500.1px) and (max-width: 527px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(13 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 385.83 : 0) + (stableCoinRowCount > 0 ? 234.13 : 0) + (cryptoCurrencyRowCount > 0 ? 234.13 : 0) + ((442.03 + 150 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*385.83(PortfolioHeader) + 234.13(StableCoinHeader) + 234.13(CryptoCurrencyHeader) + 442.03(Specific Token Row) + 150(Legend) + 160(Chart)*/
    }
  }
  @media screen and (min-width: 450.1px) and (max-width: 500px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(13 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 397 : 0) + (stableCoinRowCount > 0 ? 229 : 0) + (cryptoCurrencyRowCount > 0 ? 229 : 0) + ((482 + 150 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*397(PortfolioHeader) + 229(StableCoinHeader) + 229(CryptoCurrencyHeader) + 482(Specific Token Row) + 150(Legend) + 160(Chart)*/
    }
  }
  @media screen and (min-width: 400.1px) and (max-width: 450px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(92 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 377.17 : 0) + (stableCoinRowCount > 0 ? 219.38 : 0) + (cryptoCurrencyRowCount > 0 ? 219.38 : 0) + ((466.97 + 150 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*377.17(PortfolioHeader) + 219.38(StableCoinHeader) + 219.38(CryptoCurrencyHeader) + 466.97(Specific Token Row) + 150(Legend) + 160(Chart)*/
    }
  }
  @media screen and (min-width: 364.1px) and (max-width: 400px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(119 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 357.39 : 0) + (stableCoinRowCount > 0 ? 209.75 : 0) + (cryptoCurrencyRowCount > 0 ? 209.75 : 0) + ((451.94 + 150 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*357.39(PortfolioHeader) + 209.75(StableCoinHeader) + 209.75(CryptoCurrencyHeader) + 451.94(Specific Token Row) + 150(Legend) + 160(Chart)*/
    }
  }
  @media screen and (min-width: 300.1px) and (max-width: 364px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(164 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 343.13 : 0) + (stableCoinRowCount > 0 ? 202.88 : 0) + (cryptoCurrencyRowCount > 0 ? 202.88 : 0) + ((441.16 + 140 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*343.13(PortfolioHeader) + 202.88(StableCoinHeader) + 202.88(CryptoCurrencyHeader) + 441.16(Specific Token Row) + 140(Legend) + 160(Chart)*/
    }
  }
  @media screen and (max-width: 300px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(278 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 317.78 : 0) + (stableCoinRowCount > 0 ? 190.56 : 0) + (cryptoCurrencyRowCount > 0 ? 190.56 : 0) + ((421.94 + 140 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*317.78(PortfolioHeader) + 190.56(StableCoinHeader) + 190.56(CryptoCurrencyHeader) + 421.94(Specific Token Row) + 140(Legend) + 160(Chart)*/
    }
  }
  /*Set table height for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 1420.1px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 222.2 : 0) + (stableCoinRowCount > 0 ? 150 : 0) + (cryptoCurrencyRowCount > 0 ? 150 : 0)  + ((254.6 + 18 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*222.2(PortfolioHeader) + 150(StableCoinHeader) + 150(CryptoCurrencyHeader) + 254.6(Specific Token Row) + 18(Legend) + 160(Chart)*/
      } 
    }
    @media screen and (min-width: 1285.1px) and (max-width: 1420px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 222.2 : 0) + (stableCoinRowCount > 0 ? 150 : 0) + (cryptoCurrencyRowCount > 0 ? 150 : 0) + ((501.6 + 18 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*222.2(PortfolioHeader) + 150(StableCoinHeader) + 150(CryptoCurrencyHeader) + 501.6(Specific Token Row) + 18(Legend) + 160(Chart)*/
      }
    }
    @media screen and (min-width: 1239.1px) and (max-width: 1285px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 222.2 : 0) + (stableCoinRowCount > 0 ? 150 : 0) + (cryptoCurrencyRowCount > 0 ? 150 : 0) + ((501.6 + 41 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*222.2(PortfolioHeader) + 150(StableCoinHeader) + 150(CryptoCurrencyHeader) + 501.6(Specific Token Row) + 41(Legend) + 160(Chart)*/
      }
    }
    @media screen and (min-width: 1111.1px) and (max-width: 1239px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 258.2 : 0) + (stableCoinRowCount > 0 ? 150 : 0) + (cryptoCurrencyRowCount > 0 ? 150 : 0) + ((501.6 + 41 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*258.2(PortfolioHeader) + 150(StableCoinHeader) + 150(CryptoCurrencyHeader) + 501.6(Specific Token Row) + 41(Legend) + 160(Chart)*/
      }
    }
    @media screen and (min-width: 730.1px) and (max-width: 1111px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(10 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 358.6 : 0) + (stableCoinRowCount > 0 ? 253 : 0) + (cryptoCurrencyRowCount > 0 ? 253 : 0) + ((501.6 + 41 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*358.6(PortfolioHeader) + 253(StableCoinHeader) + 253(CryptoCurrencyHeader) + 501.6(Specific Token Row) + 41(Legend) + 160(Chart)*/
      }
    }
    @media screen and (min-width: 527.1px) and (max-width: 730px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(11 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 358.6 : 0) + (stableCoinRowCount > 0 ? 252.067 : 0) + (cryptoCurrencyRowCount > 0 ? 252.067 : 0) + ((500.667 + 180 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*358.6(PortfolioHeader) + 252.067(StableCoinHeader) + 252.067(CryptoCurrencyHeader) + 500.667(Specific Token Row) + 180(Legend) + 160(Chart)*/
      }
    }
    @media screen and (min-width: 500.1px) and (max-width: 527px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(13 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 392.25 : 0) + (stableCoinRowCount > 0 ? 234.133 : 0) + (cryptoCurrencyRowCount > 0 ? 234.133 : 0) + ((477.2 + 180 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*392.25(PortfolioHeader) + 234.133(StableCoinHeader) + 234.133(CryptoCurrencyHeader) + 477.2(Specific Token Row) + 180(Legend) + 160(Chart)*/
      }
    }
    @media screen and (min-width: 450.1px) and (max-width: 500px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(13 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 392.25 : 0) + (stableCoinRowCount > 0 ? 234.133 : 0) + (cryptoCurrencyRowCount > 0 ? 234.133 : 0) + ((526.8 + 180 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*392.25(PortfolioHeader) + 234.133(StableCoinHeader) + 234.133(CryptoCurrencyHeader) + 526.8(Specific Token Row) + 180(Legend) + 160(Chart)*/
      }
    }
    @media screen and (min-width: 400.1px) and (max-width: 450px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(92 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 386.8 : 0) + (stableCoinRowCount > 0 ? 219.4 : 0) + (cryptoCurrencyRowCount > 0 ? 219.4 : 0) + ((511.8 + 180 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*386.8(PortfolioHeader) + 219.4(StableCoinHeader) + 219.4(CryptoCurrencyHeader) + 511.8(Specific Token Row) + 180(Legend) + 160(Chart)*/
      }
    }
    @media screen and (min-width: 364.1px) and (max-width: 400px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(119 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 367 : 0) + (stableCoinRowCount > 0 ? 209.8  : 0) + (cryptoCurrencyRowCount > 0 ? 209.8 : 0) + ((496.8 + 180 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*367(PortfolioHeader) + 209.8(StableCoinHeader) + 209.8(CryptoCurrencyHeader) + 496.8(Specific Token Row) + 180(Legend) + 160(Chart)*/
      }
    }
    @media screen and (min-width: 300.1px) and (max-width: 364px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(144 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 353.1 : 0) + (stableCoinRowCount > 0 ? 202.867 : 0) + (cryptoCurrencyRowCount > 0 ? 202.867 : 0) + ((487.4 + 174.667 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*353.1(PortfolioHeader) + 202.867(StableCoinHeader) + 202.867(CryptoCurrencyHeader) + 487.4(Specific Token Row) + 174.667(Legend) + 160(Chart)*/
      }
    }
    @media screen and (max-width: 300px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(258 + portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 327.4 : 0) + (stableCoinRowCount > 0 ? 190.6 : 0) + (cryptoCurrencyRowCount > 0 ? 190.6 : 0) + ((466.8 + 168 + 160) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*327.4(PortfolioHeader) + 190.6(StableCoinHeader) + 190.6(CryptoCurrencyHeader) + 466.8(Specific Token Row) + 168(Legend) + 160(Chart)*/
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