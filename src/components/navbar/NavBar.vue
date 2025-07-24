<template>
  <ion-header>
    <ion-toolbar class="toolbarContainer" collapse="condense">
      
      <div class="buttonContainer">
        <HomeButton/>
        <NavButtons 
          :navButtons = "navButtons"
          :colorName = "colorName"
          :buttonShadow = "buttonShadow"
        />
    
        <div v-if="width >= breakpoint" class="solanaWalletButtonContainer">
          <WalletButton 
            :colorName="colorName"
            :colorHexValue="colorHexValue"
            :featured="2"
            container="body"
          />
        </div>
        <ThemeButton/>
        <MenuButton id="menuButton"/>
      </div>
   
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
  import { IonHeader, IonToolbar } from '@ionic/vue'
  import HomeButton from '/src/components/navbar/HomeButton.vue'
  import NavButtons from '/src/components/navbar/NavButtons.vue'
  import ThemeButton from '/src/components/navbar/ThemeButton.vue'
  import MenuButton from '/src/components/navbar/MenuButton.vue'
  import WalletButton from '/src/components/navbar/SolanaWalletButton/WalletButton.vue'
  import { useWindowResize } from '/src/assets/globalStates/WindowWidth.ts';

  defineProps(['navButtons', 'colorName', 'buttonShadow', 'colorHexValue'])

  const { width } = useWindowResize(); // Use the composable to get the reactive width
  const breakpoint = 629; // Define your breakpoint

</script>

<style scoped>
  .toolbarContainer
  {
    display: flex;
    height: 88px;
  }

  .buttonContainer
  {
    display: flex;
    align-items: center;
  }

  .solanaWalletButtonContainer
  {
    text-align: end !important;
    display: block
  }

  @media screen and (min-width: 629px) 
  { 
    .solanaWalletButtonContainer
    {
      display: flex;
      justify-content: end;
      flex-grow: 1
    } 
  }
  @media screen and (max-width: 628.9px) 
  { 
    .buttonContainer
    {
      justify-content: space-between
    }
  }
</style>
