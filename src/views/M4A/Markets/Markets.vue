<template>
  <div class="tableFlipContainer" :class="[flipped, notConnected]">
    <div class="tableCard" :class="flipped">
      <div class="frontTable" :style="{display: display1stTable}">
        <h2>Under Construction On Devnet<br>Monopoly Money</h2>
        <h1>Markets</h1>
    
        <ion-button @click="flipTable()" color="dark" :disabled="flipping">Toggle Portfolios</ion-button>
        <MarketsTable/>
      </div>

      <div class="backTable" :style="{display: display2ndTable}">
        <h2>Under Construction On Devnet<br>Monopoly Money</h2>
        <h1>Portfolios</h1>
    
        <ion-button @click="flipTable()" color="dark" :disabled="flipping">Toggle Markets</ion-button>
        <PortfolioTable @checkNewAddress="(addressToCheck: string) => searchAddress = addressToCheck"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue'
  import { IonButton } from '@ionic/vue'
  import MarketsTable from '/src/components/tables/lending/MarketsTable.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import PortfolioTable from '/src/components/tables/lending/PortfolioTable.vue'

  defineProps(['colorName', 'colorHexValue'])//This just keeps a warning from going off since all pages get feed these props

  var flipping = ref(false)
  var flipped = ""
  var display1stTable = ref("")
  var display2ndTable = ref("none")
  var searchAddress = ref("")

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
      }, 500) // 1000 milliseconds == 1 seconds
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
      }, 500) // 1000 milliseconds == 1 seconds
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

  .tableFlipContainer.flipped.notConnected
  {
    height: 692px
  }

  @media screen and (min-width: 1769.1px)
  { 
    .tableFlipContainer
    {
      height: 1108px
    } 
  }
  @media screen and (min-width: 1432.1px) and (max-width: 1769px)
  { 
    .tableFlipContainer
    {
      height: 1144px
    } 
  }
  @media screen and (min-width: 1411.1px) and (max-width: 1432px)
  { 
    .tableFlipContainer
    {
      height: 1157px
    } 
  }
  @media screen and (min-width: 1301.1px) and (max-width: 1411px)
  { 
    .tableFlipContainer
    {
      height: 1171px
    } 
  }
  @media screen and (min-width: 1191.1px) and (max-width: 1301px)
  { 
    .tableFlipContainer
    {
      height: 1186px
    }
  }
  @media screen and (min-width: 999.1px) and (max-width: 1191px)
  { 
    .tableFlipContainer
    {
      height: 1222px
    }
  }
  @media screen and (min-width: 989.1px) and (max-width: 999px)
  { 
    .tableFlipContainer
    {
      height: 1237px
    }
  }
  @media screen and (min-width: 976.1px) and (max-width: 989px)
  { 
    .tableFlipContainer
    {
      height: 1252px
    }
  }
  @media screen and (min-width: 929.1px) and (max-width: 976px)
  { 
    .tableFlipContainer
    {
      height: 1267px
    }
  }
  @media screen and (max-width: 929px)
  { 
    .tableFlipContainer
    {
      height: 1282px
    }
  }
</style>