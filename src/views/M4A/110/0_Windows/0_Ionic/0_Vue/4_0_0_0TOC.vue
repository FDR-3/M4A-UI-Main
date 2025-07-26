<template>
  <div class="flexCenterRow">
    <PrevPageButton/>
    <div style="margin-top: -50px">
      <p>Windows > Ionic > Vue</p>
      <h4>Table of Contents</h4>
      <p>Excellent Path Choice BTW (✿◠‿◠)</p>
    </div>
    <NextPageButton/>
  </div>
  <div class="flexCenterColumnWidth">
    <ion-button color="dark" @click="pageSelect(0)">1-Overview</ion-button>
    <ion-button color="dark" @click="nextPage()">2-Getting Started</ion-button>
    <ion-button color="dark" @click="pageSelect(7)">3-Menu And Theming</ion-button>
    <ion-button color="dark" @click="pageSelect(9)">4-Footer</ion-button>
    <ion-button color="dark" @click="pageSelect(11)">5-NavBar</ion-button>
    <ion-button color="dark" @click="pageSelect(13)">6-LilNavBar</ion-button>
    <ion-button color="dark" @click="pageSelect(15)">7-Paging System</ion-button>
    <ion-button color="dark" @click="pageSelect(17)">8-Video Flipper</ion-button>
    <ion-button color="dark" @click="pageSelect(19)">9-Embedded Videos</ion-button>
    <ion-button color="dark" @click="pageSelect(21)">10-SVG Animation</ion-button>
    <ion-button color="dark" @click="pageSelect(23)">11-Audio, Flashing SVGs, And TOC</ion-button>
    <ion-button color="dark" @click="pageSelect(25)">12-Local CommentSection Part1</ion-button>
    <ion-button color="dark" @click="pageSelect(27)">13-Local CommentSection Part2</ion-button>
    <ion-button color="dark" @click="pageSelect(29)">14-Local CommentSection Part3</ion-button>
    <ion-button color="dark" @click="pageSelect(31)">15-Wallet Button</ion-button>
    <ion-button color="dark" @click="pageSelect(33)">16-Local Storage End</ion-button>
    <ion-button color="green" @click="pageSelect(35)">Back End - Smart Contract Chain/Framework Select</ion-button>
    <ion-button color="dark" @click="pageSelect(36)">17-Solana CLI & Anchor</ion-button>
    <ion-button color="dark" @click="pageSelect(38)">18-Bad Contract Example Part1</ion-button>
    <ion-button color="dark" @click="pageSelect(40)">19-Bad Contract Example Part2</ion-button>
    <ion-button color="dark" @click="pageSelect(42)">20-Contract CommentSection</ion-button>
    <ion-button color="dark" @click="pageSelect(44)">21-Progress Bar & Toast</ion-button>
    <ion-button color="dark" @click="pageSelect(46)">22-Better Contract Example Part1</ion-button>
    <ion-button color="dark" @click="pageSelect(48)">23-Better Contract Example Part2</ion-button>
    <ion-button color="dark" @click="pageSelect(50)">24-Better Contract Example Part3</ion-button>
    <ion-button color="dark" @click="pageSelect(52)">25-Better Contract Example Part4</ion-button>
    <ion-button color="dark" @click="pageSelect(54)">26-End to End Testing</ion-button>
    <ion-button color="dark" @click="pageSelect(57)">27-Production</ion-button>
    <ion-button color="dark" @click="pageSelect(59)">28-Devnet & Fees</ion-button>
    <ion-button color="dark" @click="pageSelect(61)">29-Clean Up & MarginFi</ion-button>
    <ion-button color="dark" @click="pageSelect(63)">30-M4A Contract Walk Through</ion-button>
    <ion-button color="dark" @click="pageSelect(65)">31-Chat Contract Walk Through</ion-button>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import { IonButton } from '@ionic/vue'
  import { navigation } from '/src/assets/globalStates/Navigation.vue'

  function nextPage()
  {
    navigation.pageIndex++

    localStorage.setItem("navigationPageIndex", navigation.pageIndex)
  }

  function pageSelect(pageNumber:number)
  {
    navigation.pageIndex = pageNumber

    localStorage.setItem("navigationPageIndex", navigation.pageIndex)
  }

</script>

<style scoped>
  .flexCenterRow
  {
    margin-top: 50px
  }
</style>