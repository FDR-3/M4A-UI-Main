<template>
  <div v-if="connectedWallet.addressString==adminAccounts.lendingCEOAddressString" class="thickBorder smallMarginTop">
    <div class="smallMarginTop">
      <h2>Current Statement Month And Year:</h2>
      <div class="flexCenterRow preserveWhiteSpace nMediumMarginTop">
        <h2>{{ anchorPrograms.currentStatementMonth + ", " }}</h2>
        <h2>{{ anchorPrograms.currentStatementYear }}</h2>
      </div>
      <ion-text>Change Current Statement Month And Year</ion-text>
    </div>
    <div class=" flexCenterColumn">
      <div style="width: 90%">
        <Select
        class="tinyMarginTop tinyMarginBottom"
        v-model="monthSelect" 
        :options="monthList" 
        optionLabel="monthName" 
        optionValue="monthNumber" 
        placeholder="Select Month"
        appendTo="self">
        </Select>
        <ion-input
        v-model="statementYearInput"
       
        fill="outline"
        placeholder="Enter Statement Year"
        type="number"
        step="1"
        min="2022">
        </ion-input>
        <ion-button class="smallMarginBottom" color="dark" @click="updateCurrentStatementMonthAndYear()" style="width:77px" :disabled="statementYearInput == ''">
          Update
        </ion-button>
      </div>
    </div>
  </div>

  <div v-if="connectedWallet.addressString==adminAccounts.lendingCEOAddressString" class="thickBorder smallMarginTop">
    <div class="smallMarginTop">
      <h2>Add Lending Token Reserve Account</h2>
    </div>
    <div class=" flexCenterRow">
      <div style="width: 90%">
        <ion-input v-model="tokenMintAddressInput" class="mediumMarginBottom" fill="outline" placeholder="Enter The Mint Address"></ion-input>
        <ion-input v-model="tokenDecmialCountInput" class="mediumMarginBottom" fill="outline" type="number" min="0" max="10" step="1" placeholder="Enter The Token Decimal"></ion-input>
        
        <ion-label >Borrow APY:</ion-label>
        <InputNumber
        id="borrowAPYInput"
        v-model="borrowAPY"
        ref="borrowAPYRef"
        class="mediumMarginBottom"
        :inputStyle="{'text-align': 'center'}"
        suffix="%"
        inputId="percent"
        :minFractionDigits="2" :maxFractionDigits="2"
        :min="0" :max="100"
        :step="0.01"
        showButtons
        fluid
        @keydown.enter="checkIfCursorBehindPercentSign()"
        />

        <ion-label >Global Limit:</ion-label>
        <InputNumber v-model="globalLimitInput" class="smallMarginBottom" :inputStyle="{'text-align': 'center'}" :min="0" :step="1" showButtons fluid/>

        <ion-button class="smallMarginBottom" color="dark" @click="addTokenReserve()" style="width:77px">Add</ion-button>
      </div>
    </div>
  </div>

  <TokenReservesTable @createSubMarketModal="(tokenMintAddress: PublicKey, tokenSVG: Component, tokenName:string) =>
  createSubMarketModal.openCreateSubMarketModal(tokenMintAddress, tokenSVG, tokenName)"/>
  <CreateSubMarketModal ref="createSubMarketModal"/>
</template>

<script setup lang="ts">
  import { ref, inject, Component, onMounted } from 'vue'
  import { IonButton, IonInput, IonText, IonLabel } from '@ionic/vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { confirmLendingTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms, monthList } from '/src/assets/globalStates/AnchorPrograms.vue'
  import Select from 'primevue/select'
  import InputNumber from 'primevue/inputnumber'
  import TokenReservesTable from '/src/components/tables/lending/TokenReservesTable.vue'
  import CreateSubMarketModal from '/src/components/smart contracts/lending protocol/CreateSubMarketModal.vue'
  import {  PublicKey } from "@solana/web3.js"
  import * as anchor from "@coral-xyz/anchor"

  const toast = inject('toast')

  var tokenMintAddressInput = ref()
  var tokenDecmialCountInput = ref()
  var createSubMarketModal = ref()
  var monthSelect = ref()

  var statementYearInput = ref("")

  var borrowAPY = ref(5)
  var borrowAPRef = ref()
  var globalLimitInput = ref(1_000_000)

  onMounted(() =>
  {
    const currentDate = new Date()

    statementYearInput.value = currentDate.getFullYear().toString()
    monthSelect.value = currentDate.getMonth() + 1
  })

  function checkIfCursorBehindPercentSign()
  {
    var inputElement = borrowAPRef.value?.$el.querySelector(".p-inputtext")

    if(inputElement)
    {
      if(inputElement.value.length == inputElement.selectionEnd)
      {
        const beforePercentSign = inputElement.selectionEnd - 1
        inputElement.setSelectionRange(beforePercentSign, beforePercentSign)
      }
    }
  }

  async function addTokenReserve()
  {
    try
    {
      const mintAddressKey = new PublicKey(tokenMintAddressInput.value)
      const tx = await anchorPrograms.lending.lendingProgram.methods.addTokenReserve(
        mintAddressKey,
        tokenDecmialCountInput.value,
        borrowAPY.value * 100,//convert to fixedpoint notation
        new anchor.BN(globalLimitInput.value * Math.pow(10, tokenDecmialCountInput.value)))//convert to fixedpoint notation
      .accounts({mint: mintAddressKey})
      .rpc()

      tokenMintAddressInput.value = ""
      tokenDecmialCountInput.value = ""
      await confirmLendingTransaction(tx, toast, "add_token_reserve")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "add_token_reserve")
    }
  }

  async function updateCurrentStatementMonthAndYear()
  {
    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.updateCurrentStatementMonthAndYear(monthSelect.value, Number(statementYearInput.value)).rpc()
      await confirmLendingTransaction(tx, toast, "update_current_statement_month_and_year")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "update_current_statement_month_and_year")
    }
  }
</script>

<style scoped>
  ion-input
  {
    --highlight-color: var(--ion-color-gray)
  }
</style>