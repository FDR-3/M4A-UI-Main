<template>
  <div class="tableFlipContainer" :class="[flipped, notConnected]">
    <div class="tableCard" :class="flipped">
      <div class="frontTable" :style="{display: display1stTable}">
        <h2>Under Construction On Devnet<br>Monopoly Money</h2>
        <h1>Markets</h1>
    
        <ion-button @click="flipTable()" color="dark" :disabled="flipping">Toggle Portfolios</ion-button>
        <MarketsTable @openDepositModal="openDepositAndCloseWithdraw"
        @openWithdrawalModal="openWithdrawAndCloseDeposit"
        @marketTableHeightChange="(hasAtleast1Account: boolean, editingAccountName: boolean) =>
        updateMarketTableHeight(hasAtleast1Account, editingAccountName)"/>
      </div>

      <div class="backTable" :style="{display: display2ndTable}">
        <h2>Under Construction On Devnet<br>Monopoly Money</h2>
        <h1>Portfolios</h1>
    
        <ion-button @click="flipTable()" color="dark" :disabled="flipping">Toggle Markets</ion-button>
        <PortfolioTable @checkNewAddress="(addressToCheck: string) => searchAddress = addressToCheck"/>
      </div>
    </div>
  </div>
  <DepositModal ref="depositModal"/>
  <WithdrawalModal ref="withdrawalModal"/>
  <KingobamaMobileM1 :style="{display: display1stTable}"/>
  <KingobamaMobileM2 :style="{display: display2ndTable}"/>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch, Component } from 'vue'
  import { IonButton } from '@ionic/vue'
  import MarketsTable from '/src/components/tables/lending/MarketsTable.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import PortfolioTable from '/src/components/tables/lending/PortfolioTable.vue'
  import DepositModal from '/src/components/smart contracts/lending protocol/DepositModal.vue'
  import WithdrawalModal from '/src/components/smart contracts/lending protocol/WithdrawalModal.vue'
  import KingobamaMobileM1 from '/src/components/fancy/poly/KingobamaMobileM1.vue'
  import KingobamaMobileM2 from '/src/components/fancy/poly/KingobamaMobileM2.vue'

  defineProps(['colorName', 'colorHexValue'])//This just keeps a warning from going off since all pages get feed these props

  var flipping = ref(false)
  var flipped = ""
  var display1stTable = ref("")
  var display2ndTable = ref("none")
  var searchAddress = ref("")

  var depositModal = ref()
  var withdrawalModal = ref()
  var dynamicTableHeight = ref(0)

  var notConnected = computed (() =>
  {
    if(searchAddress.value == SYSTEM_PROGRAM_ADDRESS_STRING)
      return "notConnected"
    else
      return ""
  })

  onMounted(() => 
  {
    searchAddress.value = connectedWallet.addressString

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

  watch(connectedWallet, () =>
  {
    searchAddress.value = connectedWallet.addressString
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

  function openDepositAndCloseWithdraw(
  tokenMintAddressString: String, 
  decimalAmount: number, 
  tokenSVG: Component, 
  tokenName: string)
  {
    depositModal.value.openDepositModal(tokenMintAddressString, decimalAmount, tokenSVG, tokenName)
    withdrawalModal.value.closeWithdrawalModal()
  }

  function openWithdrawAndCloseDeposit(
  tokenMintAddressString: String, 
  decimalAmount: number, 
  tokenSVG: Component, 
  tokenName: string)
  {
    withdrawalModal.value.openWithdrawalModal(tokenMintAddressString, decimalAmount, tokenSVG, tokenName)
    depositModal.value.closeDepositModal()
  }

  function updateMarketTableHeight(hasAtleast1Account: boolean, editingAccountName: boolean)
  {
    if(editingAccountName)
      dynamicTableHeight.value = 118
    else if(hasAtleast1Account)
      dynamicTableHeight.value = 58
    else
      dynamicTableHeight.value = 0
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

  /*Set Portfolio Table Height */
  @media screen and (min-width: 1285.1px)
  { 
    .tableFlipContainer.flipped
    {
      height: 2405px
    }
  }
  @media screen and (min-width: 444.1px) and (max-width: 1285px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(3231 + 0) + "px"')
    } 
  }
  @media screen and (max-width: 444px)
  { 
    .tableFlipContainer.flipped
    {
      height: v-bind('(3559 + 0) + "px"')
    } 
  }
  /*Set table height for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 1285.1px)
    { 
      .tableFlipContainer.flipped
      {
        height: 2422px
      }
    }
    @media screen and (min-width: 444.1px) and (max-width: 1285px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(3249 + 0) + "px"')
      } 
    }
    @media screen and (max-width: 444px)
    { 
      .tableFlipContainer.flipped
      {
        height: v-bind('(3477 + 0) + "px"')
      } 
    }
  }

  /*Set Portfolio Table Height Wallet Not Connected*/
  @media screen and (min-width: 1285.1px)
  {
    .tableFlipContainer.flipped.notConnected
    {
      height: 2450px
    }
  }
  @media screen and (min-width: 444.1px) and (max-width: 1285px)
  { 
    .tableFlipContainer.flipped.notConnected
    {
      height: v-bind('(3277 + 0) + "px"')
    } 
  }
  @media screen and (max-width: 444px)
  { 
    .tableFlipContainer.flipped.notConnected
    {
      height: v-bind('(3640 + 0) + "px"')
    } 
  }
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 1285.1px)
    {
      .tableFlipContainer.flipped.notConnected
      {
        height: 2470px
      }
    }
    @media screen and (min-width: 444.1px) and (max-width: 1285px)
    { 
      .tableFlipContainer.flipped.notConnected
      {
        height: v-bind('(3297 + 0) + "px"')
      } 
    }
    @media screen and (max-width: 444px)
    { 
      .tableFlipContainer.flipped.notConnected
      {
        height: v-bind('(3544 + 0) + "px"')
      } 
    }
  }

  /*Set Market Table height */
  @media screen and (min-width: 1769.1px)
  { 
    .tableFlipContainer
    {
      height: v-bind('(1135 + dynamicTableHeight) + "px"')
    } 
  }
  @media screen and (min-width: 1560.1px) and (max-width: 1769px)
  { 
    .tableFlipContainer
    {
      height: v-bind('(1171 + dynamicTableHeight) + "px"')
    } 
  }
  @media screen and (max-width: 1560px)
  { 
    .tableFlipContainer
    {
      height: v-bind('(1186 + dynamicTableHeight) + "px"')
    }
  }
  /*Set table height for Fire Fox*/
  @-moz-document url-prefix()
  {
    @media screen and (min-width: 1769.1px)
    { 
      .tableFlipContainer
      {
        height: 1133px
      } 
    }
    @media screen and (min-width: 1300.1px) and (max-width: 1769px)
    { 
      .tableFlipContainer
      {
        height: 1169px
      } 
    }
    @media screen and (min-width: 1191.1px) and (max-width: 1300px)
    { 
      .tableFlipContainer
      {
        height: 1187px
      }
    }
    @media screen and (min-width: 988.1px) and (max-width: 1191px)
    { 
      .tableFlipContainer
      {
        height: 1224px
      }
    }
    @media screen and (min-width: 923.1px) and (max-width: 988px)
    { 
      .tableFlipContainer
      {
        height: 1241px
      }
    }
    @media screen and (min-width: 915.1px)  and (max-width: 923px)
    { 
      .tableFlipContainer
      {
        height: 1277px
      }
    }
    @media screen and (max-width: 915px)
    { 
      .tableFlipContainer
      {
        height: 1295px
      }
    }
  }
</style>