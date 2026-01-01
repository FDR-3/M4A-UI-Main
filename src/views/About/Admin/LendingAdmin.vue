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
      <div class="nMediumMarginTop smallMarginBottom">
        <ion-button color="dark" style="width: 280px; height: 45px" @click="addTokenReserveQuick(tokenAddressStrings.usdcTokenMintAddress)">
          <component :is="tokenReserveHashMap.get(tokenAddressStrings.usdcTokenMintAddress).svg"> </component>
          <ion-label> </ion-label>Init USDC Token Reserve
        </ion-button>
        <ion-button color="dark" style="width: 280px; height: 45px" @click="addTokenReserveQuick(tokenAddressStrings.solTokenMintAddress)">
          <component :is="tokenReserveHashMap.get(tokenAddressStrings.solTokenMintAddress).svg" style="width: 48px; margin-left: -20px; margin-right: -8px"> </component>
          <ion-label> </ion-label>Init SOL Token Reserve
        </ion-button>
      </div>
    </div>
    <div class=" flexCenterRow">
      <div style="width: 90%">
        <ion-input v-model="tokenMintAddressInput" class="mediumMarginBottom" fill="outline" placeholder="Enter The Mint Address"></ion-input>
        <ion-input v-model="pythPriceFeedID" class="mediumMarginBottom" fill="outline" placeholder="Enter The Pyth Price Update Key"></ion-input>
        <ion-input v-model="tokenDecmialCountInput" class="mediumMarginBottom" fill="outline" type="number" min="0" max="10" step="1" placeholder="Enter The Token Decimal"></ion-input>

        <ion-label>Token Program</ion-label><br>
        <Select
        class="tinyMarginTop tinyMarginBottom"
        v-model="tokenProgramSelect" 
        :options="tokenProgramList" 
        optionLabel="programName" 
        optionValue="programPublicKey" 
        placeholder="Select Program"
        appendTo="self">
        </Select><br><br>

        <ion-label>Use Fixed Borrow APY</ion-label><br>
        <Select
        class="tinyMarginTop tinyMarginBottom"
        v-model="trueFalseSelect" 
        :options="trueFalseList" 
        optionLabel="booleanName" 
        optionValue="booleanValue" 
        placeholder="Select Boolean"
        appendTo="self">
        </Select><br><br>

        <ion-label>Fixed Borrow APY:</ion-label>
        <InputNumber
        v-model="borrowAPY"
        class="mediumMarginBottom"
        :inputStyle="{'text-align': 'center'}"
        suffix="%"
        inputId="percent"
        :minFractionDigits="2" :maxFractionDigits="2"
        :min="0" :max="100"
        :step="0.01"
        showButtons
        fluid
        />

        <ion-label>Solvency Insurance Rate:</ion-label>
        <InputNumber
        v-model="solvencyInsurance"
        class="mediumMarginBottom"
        :inputStyle="{'text-align': 'center'}"
        suffix="%"
        inputId="percent"
        :minFractionDigits="2" :maxFractionDigits="2"
        :min="0" :max="100"
        :step="0.01"
        showButtons
        fluid
        />

        <ion-label >Global Limit:</ion-label>
        <InputNumber v-model="globalLimitInput" class="smallMarginBottom" :inputStyle="{'text-align': 'center'}" :min="0" :step="1" showButtons fluid/>

        <ion-button class="smallMarginBottom" color="dark" @click="addTokenReserve()" style="width:77px">Add</ion-button>
      </div>
    </div>
  </div>

  <TokenReservesTable @createSubMarketModal="(tokenMintAddress: PublicKey, tokenSVG: Component, tokenName:string) =>
  createSubMarketModal.openCreateSubMarketModal(tokenMintAddress, tokenSVG, tokenName)"/>
  <AdminTokenReservesTable @editTokenReserveModal="(tokenMintAddress: PublicKey,
  tokenSVG: Component,
  tokenName:string,
  solvencyInsuranceFeeRate: number,
  fixedBorrowAPY: number,
  useFixedBorrowApy: boolean,
  globalLimit: number) =>
  editTokenReserveModal.openEditTokenReserveModal(tokenMintAddress, tokenSVG, tokenName, solvencyInsuranceFeeRate, fixedBorrowAPY, useFixedBorrowApy, globalLimit)"/>

  <CreateSubMarketModal ref="createSubMarketModal"/>
  <EditTokenReserveModal ref="editTokenReserveModal"/>
  
</template>

<script setup lang="ts">
  import { ref, inject, type Component, onMounted } from 'vue'
  import { IonButton, IonInput, IonText, IonLabel } from '@ionic/vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { confirmLendingTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms, monthList } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { tokenAddressStrings, LegacyTokenProgramID, TokenProgram2022ID } from '/src/assets/constants/Addresses.ts'
  import { tokenReserveHashMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import Select from 'primevue/select'
  import InputNumber from 'primevue/inputnumber'
  import TokenReservesTable from '/src/components/tables/lending/TokenReservesTable.vue'
  import AdminTokenReservesTable from '/src/components/tables/lending/admin/AdminTokenReservesTable.vue'
  import CreateSubMarketModal from '/src/components/smart contracts/lending protocol/CreateSubMarketModal.vue'
  import EditTokenReserveModal from '/src/components/smart contracts/lending protocol/EditTokenReserveModal.vue'
  import { PublicKey } from "@solana/web3.js"
  import * as anchor from "@coral-xyz/anchor"

  const toast = inject('toast')

  var tokenProgram: PublicKey
  var tokenMintAddressInput = ref()
  var pythPriceFeedID = ref()
  var tokenDecmialCountInput = ref()
  var createSubMarketModal = ref()
  var editTokenReserveModal = ref()
  var monthSelect = ref()

  var statementYearInput = ref("")

  var borrowAPY = ref(5)
  var solvencyInsurance = ref(1)
  var globalLimitInput = ref(1_000_000)

   
  var tokenProgramSelect = ref(LegacyTokenProgramID)
  var tokenProgramList = 
  [
    {
      programName: "Legacy",
      programPublicKey: LegacyTokenProgramID
    },
    {
      programName: "2022",
      programPublicKey: TokenProgram2022ID
    }
  ]

  var trueFalseSelect = ref(true)
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

  onMounted(() =>
  {
    const currentDate = new Date()

    statementYearInput.value = currentDate.getFullYear().toString()
    monthSelect.value = currentDate.getMonth() + 1
  })

  async function addTokenReserveQuick(tokenAddress: String)
  {
    const tokenInfo = tokenReserveHashMap.get(tokenAddress)
    
    tokenMintAddressInput.value = tokenAddress
    pythPriceFeedID.value = tokenInfo.pythId.slice(2)
    tokenDecmialCountInput.value = tokenInfo.decimalAmount
    tokenProgramSelect.value = tokenInfo.tokenProgram

    await addTokenReserve()
  }

  async function addTokenReserve()
  {
    try
    {
      const mintAddressKey = new PublicKey(tokenMintAddressInput.value)

      const tx = await anchorPrograms.lending.lendingProgram.methods.addTokenReserve(
        mintAddressKey,
        tokenDecmialCountInput.value,
        Array.from(Buffer.from(pythPriceFeedID.value, "hex")),
        borrowAPY.value * 100,//convert to fixedpoint notation
        trueFalseSelect.value,
        new anchor.BN(globalLimitInput.value * Math.pow(10, tokenDecmialCountInput.value)),//convert to fixedpoint notation
        solvencyInsurance.value * 100)//convert to fixedpoint notation
      .accounts({ mint: mintAddressKey, tokenProgram: tokenProgramSelect.value })
      .rpc()

      tokenMintAddressInput.value = ""
      pythPriceFeedID.value = []
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