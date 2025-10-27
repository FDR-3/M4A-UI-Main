<template>
  <div class="tableFlipContainer" :class="flipped">
    <div class="tableCard" :class="flipped">
      <div class="frontTable" :style="{display: display1stTable}">
        <h2>Under Construction On Devnet<br>Monopoly Money</h2>
        <h1>Markets</h1>
    
        <ion-button @click="flipTable()" color="dark" :disabled="flipping">Toggle Portfolios</ion-button>
        <MarketsTable @openDepositModal="openDepositAndCloseWithdraw" @openWithdrawalModal="openWithdrawAndCloseDeposit" @marketTableHeightChange="updateUserNameRelatedTableHeight"/>
      </div>

      <div class="backTable" :style="{display: display2ndTable}">
        <h2>Under Construction On Devnet<br>Monopoly Money</h2>
        <h1>Portfolios</h1>
    
        <ion-button @click="flipTable()" color="dark" :disabled="flipping">Toggle Markets</ion-button>
        <Portfolios @openDepositModal="openDepositAndCloseWithdraw" @openWithdrawalModal="openWithdrawAndCloseDeposit" @portfolioHeightChange="updatePortfolioRelatedHeight"/>
      </div>
    </div>
  </div>
  <DepositModal ref="depositModal"/>
  <WithdrawalModal ref="withdrawalModal"/>
  <KingobamaMobileM1 :style="{display: display1stTable}"/>
  <div :style="{display: display2ndTable}">
    <KingobamaMobileM2 v-if="stableCoinRowCount==0 && cryptoCurrencyRowCount==0"/>
    <KingobamaMobileM3 v-else/>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch, Component } from 'vue'
  import { IonButton } from '@ionic/vue'
  import MarketsTable from '/src/components/tables/lending/MarketsTable.vue'
  import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import Portfolios from '/src/components/smart contracts/lending protocol/Portfolios.vue'
  import DepositModal from '/src/components/smart contracts/lending protocol/DepositModal.vue'
  import WithdrawalModal from '/src/components/smart contracts/lending protocol/WithdrawalModal.vue'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
  import { isBrowserFireFox } from '/src/assets/helperFunctions/browserHelper.ts'
  import KingobamaMobileM1 from '/src/components/fancy/poly/KingobamaMobileM1.vue'
  import KingobamaMobileM2 from '/src/components/fancy/poly/KingobamaMobileM2.vue'
  import KingobamaMobileM3 from '/src/components/fancy/poly/KingobamaMobileM3.vue'

  defineProps(['colorName', 'colorHexValue'])//This just keeps a warning from going off since all pages get feed these props

  var flipping = ref(false)
  var flipped = ""
  var display1stTable = ref("")
  var display2ndTable = ref("none")

  var depositModal = ref()
  var withdrawalModal = ref()
  var tokenRelatedDynamicTableHeight = ref(0)
  var userNameRelatedDynamicTableHeight = ref(0)
  var portfolioRelatedDynamicTableHeight = ref(0)
  var stableCoinRowCount = ref(0)
  var cryptoCurrencyRowCount = ref(0)

  onMounted(() => 
  {
    updateTokenRelatedTableHeight()

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

  function openDepositAndCloseWithdraw(tokenMintAddressString: String)
  {
    depositModal.value.openDepositModal(tokenMintAddressString)
    withdrawalModal.value.closeWithdrawalModal()
  }

  function openWithdrawAndCloseDeposit(tokenMintAddressString: String)
  {
    withdrawalModal.value.openWithdrawalModal(tokenMintAddressString)
    depositModal.value.closeDepositModal()
  }

  function updateTokenRelatedTableHeight()
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

  function updateUserNameRelatedTableHeight(hasAtleast1Account: boolean, editingAccountName: boolean)
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

  function updatePortfolioRelatedHeight(searchAddress: string, userStableCoinTabCount: number, userCryptoCurrencyTabCount: number, isBrowsingAllUsers: boolean)
  { 
    var portfolioStateRelatedHeight = 0

    stableCoinRowCount.value = userStableCoinTabCount
    cryptoCurrencyRowCount.value = userCryptoCurrencyTabCount

    if(!isBrowsingAllUsers)
    {
      if(searchAddress == SYSTEM_PROGRAM_ADDRESS_STRING)
        if(!isBrowserFireFox())
          portfolioStateRelatedHeight += 500//Base height
        else
          portfolioStateRelatedHeight += 505//Base height
      else 
      {
        if(!isBrowserFireFox())
          portfolioStateRelatedHeight += 455//Base height
        else
          portfolioStateRelatedHeight += 455//Base height
      }
    }
    else
    {
      portfolioStateRelatedHeight = 532
      stableCoinRowCount.value = 0
      cryptoCurrencyRowCount.value = 0
    }

    portfolioRelatedDynamicTableHeight.value = portfolioStateRelatedHeight
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

  /*Set Market Table height */
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
    @media screen and (min-width: 1698.1px) and (max-width: 1769px)
    { 
      .tableFlipContainer
      {
        height: v-bind('(35 + tokenRelatedDynamicTableHeight + userNameRelatedDynamicTableHeight) + "px"')
      } 
    }
    @media screen and (max-width: 1698px)
    { 
      .tableFlipContainer
      {
        height: v-bind('(53 + tokenRelatedDynamicTableHeight + userNameRelatedDynamicTableHeight) + "px"')
      }
    }
  }

  /*Set Portfolio Table Height */
  @media screen and (min-width: 1285.1px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 112.39 : 0) + (stableCoinRowCount > 0 ? 127.594 : 0) + ((cryptoCurrencyRowCount > 0 && stableCoinRowCount > 0) ? 145: cryptoCurrencyRowCount > 0 ? 105 : 0)  + ((168 + 15 + 150) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*112.39(PortfolioHeader) + 127.594(StableCoinHeader) + 145(CryptoCurrencyHeader) + 168(Specific Token Row) + 15(Legend) + 150(Chart)*/
    } 
  }
  @media screen and (max-width: 1285px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 253.78 : 0) + (stableCoinRowCount > 0 ? 211 : 0) + ((cryptoCurrencyRowCount > 0 && stableCoinRowCount > 0) ? 194 : cryptoCurrencyRowCount > 0 ? 148 : 0) + ((420+ 15 + 150) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*253.78(PortfolioHeader) + 221(StableCoinHeader) + 173(CryptoCurrencyHeader) + 420(Specific Token Row) + 15(Legend) + 150(Chart)*/
    }
  }

  /*Set table height for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 1285.1px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 112.39 : 0) + (stableCoinRowCount > 0 ? 127.6 : 0) + ((cryptoCurrencyRowCount > 0 && stableCoinRowCount > 0) ? 145 : cryptoCurrencyRowCount > 0 ? 103 : 0)  + ((180.2 + 18 + 150) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*112.39(PortfolioHeader) + 167.6(StableCoinHeader) + 133.8(CryptoCurrencyHeader) + 180.2(Specific Token Row) + 18(Legend) + 150(Chart)*/
      } 
    }
    @media screen and (max-width: 1285px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(portfolioRelatedDynamicTableHeight + (stableCoinRowCount > 0 || cryptoCurrencyRowCount > 0 ? 253.78 : 0) + (stableCoinRowCount > 0 ? 211 : 0) + ((cryptoCurrencyRowCount > 0 && stableCoinRowCount > 0) ? 194 : cryptoCurrencyRowCount > 0 ? 148 : 0) + ((420+ 18 + 150) * (stableCoinRowCount + cryptoCurrencyRowCount))) + "px"') /*253.78(PortfolioHeader) + 221(StableCoinHeader) + 173(CryptoCurrencyHeader) + 420(Specific Token Row) + 18(Legend) + 150(Chart)*/
      }
    }
  }
</style>