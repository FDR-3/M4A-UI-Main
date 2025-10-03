<template>
  <div class="tableFlipContainer" :class="[flipped, notConnected]">
    <div class="tableCard" :class="flipped">
      <div class="frontTable" :style="{display: display1stTable}">
        <h2>Under Construction On Devnet<br>Monopoly Money</h2>
        <h1>Markets</h1>
    
        <ion-button @click="flipTable()" color="dark" :disabled="flipping">Toggle Portfolios</ion-button>
        <MarketsTable @openDepositModal="(tokenMingAddress: PublicKey, decimalAmount: number, tokenSVG: Component, tokenName: string) =>
        depositModal.openDepositModal(tokenMingAddress, decimalAmount, tokenSVG, tokenName)"/>
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
  <KingobamaMobileM1 :style="{display: display1stTable}"/>
  <KingobamaMobileM2 :style="{display: display2ndTable}"/>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch, Component } from 'vue'
  import { IonButton } from '@ionic/vue'
  import MarketsTable from '/src/components/tables/lending/MarketsTable.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { PublicKey } from "@solana/web3.js"
  import PortfolioTable from '/src/components/tables/lending/PortfolioTable.vue'
  import DepositModal from '/src/components/smart contracts/lending protocol/DepositModal.vue'
  import KingobamaMobileM1 from '/src/components/fancy/poly/KingobamaMobileM1.vue'
  import KingobamaMobileM2 from '/src/components/fancy/poly/KingobamaMobileM2.vue'

  defineProps(['colorName', 'colorHexValue'])//This just keeps a warning from going off since all pages get feed these props

  var flipping = ref(false)
  var flipped = ""
  var display1stTable = ref("")
  var display2ndTable = ref("none")
  var searchAddress = ref("")

  var depositModal = ref()

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

  .tableFlipContainer.flipped
  {
    height: 646px
  }
  @-moz-document url-prefix()
  {
    .tableFlipContainer.flipped
    {
      height: 647px
    }
  }

  .tableFlipContainer.flipped.notConnected
  {
    height: 692px
  }
  @-moz-document url-prefix()
  {
    .tableFlipContainer.flipped.notConnected
    {
      height: 695px
    }
  }

  @media screen and (min-width: 1769.1px)
  { 
    .tableFlipContainer
    {
      height: 1106px
    } 
  }
  @media screen and (min-width: 1300.1px) and (max-width: 1769px)
  { 
    .tableFlipContainer
    {
      height: 1142px
    } 
  }
  @media screen and (min-width: 1191.1px) and (max-width: 1300px)
  { 
    .tableFlipContainer
    {
      height: 1157px
    }
  }
  @media screen and (min-width: 1051.1px) and (max-width: 1191px)
  { 
    .tableFlipContainer
    {
      height: 1194px
    }
  }
  @media screen and (min-width: 1028.1px) and (max-width: 1051px)
  { 
    .tableFlipContainer
    {
      height: 1208px
    }
  }
  @media screen and (min-width: 988.1px) and (max-width: 1028px)
  { 
    .tableFlipContainer
    {
      height: 1222px
    }
  }
  @media screen and (min-width: 923.1px) and (max-width: 988px)
  { 
    .tableFlipContainer
    {
      height: 1236px
    }
  }
  @media screen and (min-width: 916.1px)  and (max-width: 923px)
  { 
    .tableFlipContainer
    {
      height: 1272px
    }
  }
  @media screen and (max-width: 916px)
  { 
    .tableFlipContainer
    {
      height: 1288px
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