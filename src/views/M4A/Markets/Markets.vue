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
        <PortfolioTable/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
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

  var notConnected = computed (() =>
  {
    if(connectedWallet.addressString==SYSTEM_PROGRAM_ADDRESS_STRING)
      return "notConnected"
    else
      return ""
  })

  onMounted(() => 
  {
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
  }

  .backTable
  {
    width: 90vw;
    position: absolute;
    backface-visibility: hidden;
    transform: rotateY(180deg)
  }

  .tableFlipContainer.flipped
  {
    height: 391px
  }

  .tableFlipContainer.flipped.notConnected
  {
    height: 436px
  }

  @media screen and (min-width: 1769.1px)
  { 
    .tableFlipContainer
    {
      height: 1108px
    } 
  }
  @media screen and (min-width: 1656.1px) and (max-width: 1769px)
  { 
    .tableFlipContainer
    {
      height: 1144px
    } 
  }
  @media screen and (min-width: 1301.1px) and (max-width: 1656px)
  { 
    .tableFlipContainer
    {
      height: 1144px
    } 
  }
  @media screen and (min-width: 1192.1px) and (max-width: 1301px)
  { 
    .tableFlipContainer
    {
      height: 1158px
    }
  }
  @media screen and (min-width: 990.1px) and (max-width: 1192px)
  { 
    .tableFlipContainer
    {
      height: 1194px
    }
  }
  @media screen and (min-width: 924.1px) and (max-width: 990px)
  { 
    .tableFlipContainer
    {
      height: 1210px
    }
  }
  @media screen and (min-width: 799px) and (max-width: 924px)
  { 
    .tableFlipContainer
    {
      height: 1245px
    }
  }
  @media screen and (min-width: 744.1px) and (max-width: 799px)
  { 
    .tableFlipContainer
    {
      height: 1281px
    }
  }
  @media screen and (max-width: 744px)
  { 
    .tableFlipContainer
    {
      height: 1297px
    }
  }
</style>