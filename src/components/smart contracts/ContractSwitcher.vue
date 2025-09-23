<template>
  <h4 class="underLine noWrapText" style="font-size: 25px">Contract Switcher</h4>
  <h5 class="nMediumMarginTop">M4A Protocol</h5>
  <ion-button @click="openM4AContractSelectPopover($event)" slot="start" class="contractPickerButton" :color="colorName">
      <div class="contractPickerTextContainer noClickEvent flexCenterColumn">
        <ion-label color="dark">{{ m4aContractText }}</ion-label>
        <div>
          <ion-icon :src=chevronDown color="black"></ion-icon>
        </div>
      </div>
    </ion-button>
    <ion-popover :is-open="m4aContractSelectPopoverOpen" :event="event" @didDismiss="m4aContractSelectPopoverOpen = false" side="bottom" size="cover">
      <div v-for="(contactVersion, index) in m4aContracts">
        <ion-button class="popOverButton" :color="colorName" @click="setSelectedM4AContract(index)" >
          <ion-label color="dark">{{ contactVersion }}</ion-label>
        </ion-button>
      </div>
    </ion-popover>
  <h5>Chat Protocol</h5>
  <ion-button @click="openChatContractSelectPopover($event)" slot="start" class="contractPickerButton" :color="colorName">
    <div class="contractPickerTextContainer noClickEvent flexCenterColumn">
      <ion-label color="dark">{{ chatContractText }}</ion-label>
      <div>
        <ion-icon :src=chevronDown color="black"></ion-icon>
      </div>
    </div>
  </ion-button>
  <ion-popover :is-open="chatContractSelectPopoverOpen" :event="event" @didDismiss="chatContractSelectPopoverOpen = false" side="bottom" size="cover">
    <div v-for="(contactVersion, index) in chatContracts">
      <ion-button class="popOverButton" :color="colorName" @click="setSelectedChatContract(index)" >
        <ion-label color="dark">{{ contactVersion }}</ion-label>
      </ion-button>
    </div>
  </ion-popover>
  <h5>Lending Protocol</h5>
  <ion-button @click="openLendingContractSelectPopover($event)" slot="start" class="contractPickerButton" :color="colorName">
    <div class="contractPickerTextContainer noClickEvent flexCenterColumn">
      <ion-label color="dark">{{ lendingContractText }}</ion-label>
      <div>
        <ion-icon :src=chevronDown color="black"></ion-icon>
      </div>
    </div>
  </ion-button>
  <ion-popover :is-open="lendingContractSelectPopoverOpen" :event="event" @didDismiss="lendingContractSelectPopoverOpen=false" side="bottom" size="cover">
    <div v-for="(contactVersion, index) in lendingContracts">
      <ion-button class="popOverButton" :color="colorName" @click="setSelectedLendingContract(index)" >
        <ion-label color="dark">{{ contactVersion }}</ion-label>
      </ion-button>
    </div>
  </ion-popover>
  
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { IonButton, IonPopover, IonLabel, IonIcon } from '@ionic/vue'
  import { chevronDown } from 'ionicons/icons'

  defineProps(['colorName', 'colorHexValue', 'buttonShadow'])

  var m4aContractSelectPopoverOpen = ref()
  var chatContractSelectPopoverOpen = ref()
  var lendingContractSelectPopoverOpen = ref()
  var event = ref()

  var m4aContractText = ref("")
  var chatContractText = ref("")
  var lendingContractText = ref("") 

  const m4aContracts = ["Version 1 (SC BETA)"/*, "Version 2"*/]
  const chatContracts = ["Version 1 (BETA)"/*, "Version 2"*/]
  const lendingContracts = ["Version 1 (BETA)"/*, "Version 2"*/]

  var selectedM4AContractIndex: number
  var selectedChatContractIndex: number
  var selectedLendingContractIndex: number
  
  onMounted(async() =>
  {
    selectedM4AContractIndex = parseInt(localStorage.getItem("ContractSelectM4A") || "0")
    localStorage.setItem("ContractSelectM4A", selectedM4AContractIndex.toString())//Set value in local storage incase it isn't already

    selectedChatContractIndex = parseInt(localStorage.getItem("ContractSelectChat") || "0")
    localStorage.setItem("ContractSelectChat", selectedChatContractIndex.toString())//Set value in local storage incase it isn't already

    selectedLendingContractIndex = parseInt(localStorage.getItem("ContractSelectLending") || "0")
    localStorage.setItem("ContractSelectLending", selectedLendingContractIndex.toString())//Set value in local storage incase it isn't already

    m4aContractText.value = m4aContracts[selectedM4AContractIndex]
    chatContractText.value = chatContracts[selectedChatContractIndex]
    lendingContractText.value = lendingContracts[selectedLendingContractIndex]
  })

  async function setSelectedM4AContract(index: number)
  {
    if(index == selectedM4AContractIndex)
    {
      m4aContractSelectPopoverOpen.value = false
      return
    }

    localStorage.setItem("ContractSelectM4A", index.toString())
    m4aContractSelectPopoverOpen.value = false
    m4aContractText.value = m4aContracts[index]
    window.location.reload()
  }

  async function setSelectedChatContract(index: number)
  {
    if(index == selectedChatContractIndex)
    {
      chatContractSelectPopoverOpen.value = false
      return
    }

    localStorage.setItem("ContractSelectChat", index.toString())
    chatContractSelectPopoverOpen.value = false
    chatContractText.value = chatContracts[index]
    window.location.reload()
  }

  async function setSelectedLendingContract(index: number)
  {
    if(index == selectedLendingContractIndex)
    {
      lendingContractSelectPopoverOpen.value = false
      return
    }

    localStorage.setItem("ContractSelectLending", index.toString())
    lendingContractSelectPopoverOpen.value = false
    lendingContractText.value = lendingContracts[index]
    window.location.reload()
  }

  function openM4AContractSelectPopover(e: Event) 
  {
    event.value = e
    m4aContractSelectPopoverOpen.value = true
  }

  function openChatContractSelectPopover(e: Event) 
  {
    event.value = e
    chatContractSelectPopoverOpen.value = true
  }

  function openLendingContractSelectPopover(e: Event) 
  {
    event.value = e
    lendingContractSelectPopoverOpen.value = true
  }
</script>

<style scoped>
  ion-label
  {
    font-size: 15px /*Don't want the side menu text to shrink for smaller screens*/
  }

  .contractPickerButton
  {
    font-weight: bold;
    margin-top: -5px;
    border-radius: 7px;
    box-shadow: 0px 0px 5px 8px v-bind(buttonShadow)
  }

  .contractPickerButton:hover
  {
    opacity: 1;
    text-decoration: underline;
    text-decoration-thickness: 2px;
  }
  
  .contractPickerTextContainer
  {
    margin-bottom: -10px;
  }
</style>