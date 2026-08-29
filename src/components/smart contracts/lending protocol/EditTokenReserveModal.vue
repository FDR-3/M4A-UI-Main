<template>
  <div v-if="editingTokenReserve"
    id="editTokenReserveModal"
    class="thickBorder"
    ref="modalRef"
    slot="fixed"
  >
    <div class="nMediumSmallMarginTop tinyMarginBottom flexCenterRow">
      <ion-button fill="clear" @click="openTokenPopover($event)">
        <component :is="editTokenReserveSVG" style="width: 44px"></component>
        <ion-text color="dark">{{ tokenReserveTokenName }}</ion-text><br>
      </ion-button>
      <ion-popover
      :is-open="tokenPopoverOpen" 
      :event="event" 
      @didDismiss="tokenPopoverOpen=false"
      side="top" 
      alignment="center"
      >
        <ion-button class="copyTokenMintAddressButton" color="green" @click="passByRefWrapperCopyTokenMintAddress()" @mouseleave="closeTokenPopover($event)">
          <ion-label class="noClickEvent" color="dark">{{ copyTokenMintAddressButtonText }}</ion-label>
        </ion-button>
      </ion-popover>
    </div>

    <InputNumber
      id="editTokenReserveInput"
      v-model="solvencyInsuranceFeeRatePercentage"
      :inputStyle="{'text-align': 'center'}"
      suffix="%"
      inputId="percent"
      :minFractionDigits="2" :maxFractionDigits="2"
      :min="0" :max="4"
      :step="0.01"
      showButtons
      fluid
    />
    <ion-text style="font-size: 11px">Enter Solvency Insurance Rate%</ion-text><br><br>

    <InputNumber
      id="editTokenReserveInput"
      v-model="baseBorrowAPYPercentage"
      :inputStyle="{'text-align': 'center'}"
      suffix="%"
      inputId="percent"
      :minFractionDigits="2" :maxFractionDigits="2"
      :min="0" :max="useFixedBorrowAPYSelect ? 44 : 5"
      :step="0.01"
      showButtons
      fluid
    />
    <ion-text style="font-size: 11px">Enter fixed Borrow APY%</ion-text><br><br>

    <Select
    v-model="useFixedBorrowAPYSelect" 
    :options="trueFalseList" 
    optionLabel="booleanName" 
    optionValue="booleanValue" 
    placeholder="Select Boolean"
    appendTo="self">
    </Select><br>
    <ion-text style="font-size: 11px" class="nTinyMarginTop">Use Fixed Borrow APY</ion-text><br><br>

    <InputNumber
      id="editTokenReserveInput"
      v-model="globalLimitInput"
      :inputStyle="{'text-align': 'center'}"
      :min="0"
      :step="0.001"
      :minFractionDigits="3"
      :maxFractionDigits="3"
      showButtons
      fluid
    />
    <ion-text style="font-size: 11px">Enter Global Limit</ion-text><br>

    <ion-button
      color="dark"
      @click="editTokenReserve()"
      class="mediumMarginTop"
    >
      Edit TokenReserve
    </ion-button>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, onUnmounted } from 'vue'
  import type { Component } from 'vue'
  import { IonButton, IonText, IonPopover, IonLabel } from '@ionic/vue'
  import Select from 'primevue/select'
  import InputNumber from 'primevue/inputnumber'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { PublicKey } from "@solana/web3.js"
  import { copyAddress,
    copyTokenMintAddressText,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenAddressStrings, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { sendVersionedLendingProtocolTransaction } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import * as anchor from "@coral-xyz/anchor"

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue') as string

  var solvencyInsuranceFeeRatePercentage = ref()
  var baseBorrowAPYPercentage = ref()
  var editingTokenReserve = ref(false)
  var editTokenReserveSVG = ref()
  var tokenReserveTokenName = ref()

  var globalLimitInput = ref()

  var useFixedBorrowAPYSelect = ref()
  var trueFalseList = 
  [
    {
      booleanName: "True",
      booleanValue: true
    },
    {
      booleanName: "False",
      booleanValue: false
    }
  ]

  var selectedTokenId: number
  var selectedTokenMintAddress: PublicKey
  var selectedTokenMintAddressString: string

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)
  var modalRef = ref()

  onUnmounted(() =>
  {
    window.removeEventListener('click', handleClickOutside)
  })

  //When the user clicks anywhere outside of the edit token reserve modal, close it, not when closing toast alert though
  const handleClickOutside = (event: any) =>
  {
    if(editingTokenReserve.value && modalRef.value)
    {
      const dataPcSectionValue = event?.target?.getAttribute('data-pc-section')

      if(!modalRef.value.contains(event?.target) &&
      (event?.target?.id != "openEditTokenReserveModalButton") &&
      !event?.target?.classList.contains("ion-page") &&
      !event?.target?.classList.contains("copyTokenMintAddressButton") &&
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast text from closing modal
      !event?.target?.classList.contains("p-toast-close-icon") && //Keep transaction toast close button from closing modal
      !event?.target?.classList.contains("p-toast-close-button") && //Keep transaction toast close button from closing modal
      !dataPcSectionValue?.includes('button container') && //Keep transaction toast near close button from closing modal
      !event?.target?.closest('path')) //Keep transaction toast close button from sometimes closing modal
        editingTokenReserve.value = false
    }
  }

  function openEditTokenReserveModal(tokenId: number,
  tokenMintAddress: PublicKey,
  tokenSVG: Component,
  tokenName:string,
  solvencyInsuranceFeeRate: number,
  baseBorrowAPY: number,
  useFixedBorrowApy: boolean,
  globalLimit: number)
  {
    window.addEventListener('click', handleClickOutside)
    selectedTokenId = tokenId
    selectedTokenMintAddress = tokenMintAddress
    selectedTokenMintAddressString = tokenMintAddress.toString()
    editTokenReserveSVG.value = tokenSVG
    tokenReserveTokenName.value = tokenName
    solvencyInsuranceFeeRatePercentage.value = solvencyInsuranceFeeRate
    baseBorrowAPYPercentage.value = baseBorrowAPY
    useFixedBorrowAPYSelect.value = useFixedBorrowApy
    globalLimitInput.value = globalLimit
    editingTokenReserve.value = true
  }

  function openTokenPopover(e: Event) 
  {
    event.value = e
    tokenPopoverOpen.value = true
  }

  function closeTokenPopover(e: Event) 
  {
    event.value = e
    tokenPopoverOpen.value = false
  }

  function passByRefWrapperCopyTokenMintAddress()
  {
    copyAddress(copyTokenMintAddressButtonText, selectedTokenMintAddress)
  }

  async function editTokenReserve()
  {
    try
    {
      var instructionsToSend = []
      var lookUpTableAccounts = []
      const decimalAmount = tokenDecimalHashMap.get(selectedTokenId)

      const updateTokenReserveInstruction = await anchorPrograms.lending.lendingProgram.methods.updateTokenReserve
      (
        baseBorrowAPYPercentage.value * 100,//convert to fixedpoint notation
        useFixedBorrowAPYSelect.value,
        new anchor.BN(globalLimitInput.value * Math.pow(10, decimalAmount)),//convert to fixedpoint notation
        solvencyInsuranceFeeRatePercentage.value * 100,//convert to fixedpoint notation
      )
      .accounts({ tokenMintAddress: selectedTokenMintAddress })
      .instruction()
      instructionsToSend.push(updateTokenReserveInstruction)

      //Get Lending Protocol Look Up Table Account
      lookUpTableAccounts.push(anchorPrograms.lendingProtocolLookUpTableAccount)

      const tx = await sendVersionedLendingProtocolTransaction(instructionsToSend, lookUpTableAccounts)
      await confirmLendingTransaction(tx, toast, "update_token_reserve")
      editingTokenReserve.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "update_token_reserve")
    }
  }

  defineExpose(
  {
    openEditTokenReserveModal
  })
</script>

<style scoped>
  #editTokenReserveModal
  {
    position: fixed; /* Makes sure the modal is fixed in place on the screen */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4000; /* Makes sure the modal is on top */
    padding: 20px;
    background-color: var(--ion-background-color)
  }

  #editTokenReserveInput
  {
    --highlight-color: v-bind(colorHexValue) !important
  }

  :deep(.p-inputnumber .p-inputnumber-input:focus)
  {
    border-color: v-bind(colorHexValue) !important
  }
</style>