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
    <ion-button color="dark" @click="nextPage()">1-Getting Started</ion-button>
    <ion-button color="dark" @click="pageSelect(7)">2-Menu And Theming</ion-button>
    <ion-button color="dark" @click="pageSelect(9)">3-Footer</ion-button>
    <ion-button color="dark" @click="pageSelect(11)">4-NavBar</ion-button>
    <ion-button color="dark" @click="pageSelect(13)">5-LilNavBar</ion-button>
    <ion-button color="dark" @click="pageSelect(15)">6-Paging System</ion-button>
    <ion-button color="dark" @click="pageSelect(17)">7-Video Flipper</ion-button>
    <ion-button color="dark" @click="pageSelect(19)">8-Embedded Videos</ion-button>
    <ion-button color="dark" @click="pageSelect(21)">9-SVG Animation</ion-button>
    <ion-button color="dark" @click="pageSelect(23)">10-Audio, Flashing SVGs, And TOC</ion-button>
    <ion-button color="dark" @click="pageSelect(25)">11-Local CommentSection Part1</ion-button>
    <ion-button color="dark" @click="pageSelect(27)">12-Local CommentSection Part2</ion-button>
    <ion-button color="dark" @click="pageSelect(29)">13-Local CommentSection Part3</ion-button>
    <ion-button color="dark" @click="pageSelect(31)">14-Wallet Button</ion-button>
    <ion-button color="dark" @click="pageSelect(33)">15-Local Storage End</ion-button>
    <ion-button color="green" @click="pageSelect(35)">Back End - Smart Contract Chain/Framework Select</ion-button>
    <ion-button color="dark" @click="pageSelect(36)">16-Solana CLI & Anchor</ion-button>
    <ion-button color="dark" @click="pageSelect(38)">17-Bad Contract Example Part1</ion-button>
    <ion-button color="dark" @click="pageSelect(40)">18-Bad Contract Example Part2</ion-button>
    <ion-button color="dark" @click="pageSelect(42)">19-Contract CommentSection</ion-button>
    <ion-button color="dark" @click="pageSelect(44)">20-Progress Bar & Toast</ion-button>
    <ion-button color="dark" @click="pageSelect(46)">21-Better Contract Example Part1</ion-button>
    <ion-button color="dark" @click="pageSelect(48)">22-Better Contract Example Part2</ion-button>
    <ion-button color="dark" @click="pageSelect(50)">23-Better Contract Example Part3</ion-button>
    <ion-button color="dark" @click="pageSelect(52)">24-Better Contract Example Part4</ion-button>
    <ion-button color="dark" @click="pageSelect(54)">25-End to End Testing</ion-button>
    <ion-button color="dark" @click="pageSelect(57)">26-Production</ion-button>
    <ion-button color="dark" @click="pageSelect(59)">27-Devnet & Fees</ion-button>
    <ion-button color="dark" @click="pageSelect(61)">28-Clean Up & MarginFi</ion-button>
    <ion-button color="dark" @click="pageSelect(63)">29-M4A Contract Walk Through</ion-button>
    <ion-button color="dark" @click="pageSelect(65)">30-Chat Contract Walk Through</ion-button>
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