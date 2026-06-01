<template>
  <div v-if="connectedWallet.addressString==adminAccounts.lendingCEOAddressString" class="thickBorder smallMarginTop">
    <div class="smallMarginTop">
      <h2>Current Statement Month And Year:</h2>
      <div class="flexCenterRow preserveWhiteSpace nMediumMarginTop">
        <div v-if="anchorPrograms.isLendingProtocolInitialized">
          <h2>{{ anchorPrograms.currentStatementMonthName + ", " + anchorPrograms.currentStatementYear }}</h2>
        </div>
        <div v-else>
          <h2>Loading</h2>
        </div>
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
        <ion-button class="smallMarginBottom" color="dark" @click="updateCurrentStatementMonthAndYear()" style="width:77px" :disabled="statementYearInput == '' || noChangeDetected">
          Update
        </ion-button>
      </div>
    </div>
  </div>

  <div v-if="connectedWallet.addressString==adminAccounts.lendingCEOAddressString && anchorPrograms.isLendingProtocolInitialized" class="thickBorder smallMarginTop">
    <div class="smallMarginTop">
      <h2>Add Lending Token Reserve Account</h2>
      <div class="nMediumMarginTop smallMarginBottom">
        <ion-button color="dark" style="width: 280px; height: 45px" @click="addTokenReserveQuick(tokenAddressStrings.daiTokenMintAddress)">
          <component :is="tokenReserveFontEndInfoHashMap.get(tokenAddressStrings.daiTokenMintAddress).svg"> </component>
          <ion-label> </ion-label>Init DAI Token Reserve
        </ion-button>
        <ion-button color="dark" style="width: 280px; height: 45px" @click="addTokenReserveQuick(tokenAddressStrings.usdcTokenMintAddress)">
          <component :is="tokenReserveFontEndInfoHashMap.get(tokenAddressStrings.usdcTokenMintAddress).svg"> </component>
          <ion-label> </ion-label>Init USDC Token Reserve
        </ion-button>
        <ion-button color="dark" style="width: 280px; height: 45px" @click="addTokenReserveQuick(tokenAddressStrings.solTokenMintAddress)">
          <component :is="tokenReserveFontEndInfoHashMap.get(tokenAddressStrings.solTokenMintAddress).svg" style="width: 48px; margin-left: -20px; margin-right: -8px"> </component>
          <ion-label> </ion-label>Init SOL Token Reserve
        </ion-button>
        <ion-button color="dark" style="width: 240px; height: 45px" @click="addTokenReserveQuick(tokenAddressStrings.wethTokenMintAddress)">
          <component :is="tokenReserveFontEndInfoHashMap.get(tokenAddressStrings.wethTokenMintAddress).svg" style="width: 48px; margin-left: 0px; margin-right: -8px"> </component>
          <ion-label> </ion-label>Init WETH Token Reserve
        </ion-button>
        <ion-button color="dark" style="width: 240px; height: 45px" @click="addTokenReserveQuick(tokenAddressStrings.wbtcTokenMintAddress)">
          <component :is="tokenReserveFontEndInfoHashMap.get(tokenAddressStrings.wbtcTokenMintAddress).svg" style="width: 48px; margin-left: 0px; margin-right: -8px"> </component>
          <ion-label> </ion-label>Init WBTC Token Reserve
        </ion-button>
      </div>
    </div>
    <div class=" flexCenterRow">
      <div style="width: 90%">
        <ion-input v-model="tokenMintAddressInput" class="mediumMarginBottom" fill="outline" placeholder="Enter The Mint Address"></ion-input>
        <ion-input v-model="pythPriceFeedID" class="mediumMarginBottom" fill="outline" placeholder="Enter The Pyth Price Feed ID"></ion-input>
        <ion-input v-model="tokenDecimalCountInput" class="mediumMarginBottom" fill="outline" type="number" min="0" max="10" step="1" placeholder="Enter The Token Decimal"></ion-input>

        <div class="spaceRowEvenly" style="width: 100%">
          <div>
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
          </div>

          <div>
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
          </div>
        </div>

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
  <div v-if="connectedWallet.addressString==adminAccounts.lendingCEOAddressString && anchorPrograms.isLendingProtocolInitialized">
    <MintDevNetTestToken/>
  </div>

  <CreateSubMarketModal ref="createSubMarketModal"/>
  <EditTokenReserveModal ref="editTokenReserveModal"/>
  
</template>

<script setup lang="ts">
  import { ref, inject, type Component, onMounted, computed} from 'vue'
  import { IonButton, IonInput, IonText, IonLabel } from '@ionic/vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { confirmLendingTransaction, doesKeyExistInLookUpTable, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms, monthList } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { tokenAddressStrings, LegacyTokenProgramID, TokenProgram2022ID } from '/src/assets/constants/Addresses.ts'
  import { tokenReserveFontEndInfoHashMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import Select from 'primevue/select'
  import InputNumber from 'primevue/inputnumber'
  import TokenReservesTable from '/src/components/tables/lending/TokenReservesTable.vue'
  import AdminTokenReservesTable from '/src/components/tables/lending/admin/AdminTokenReservesTable.vue'
  import MintDevNetTestToken from '/src/components/smart contracts/lending protocol/admin/MintDevNetTestToken.vue'
  import CreateSubMarketModal from '/src/components/smart contracts/lending protocol/CreateSubMarketModal.vue'
  import EditTokenReserveModal from '/src/components/smart contracts/lending protocol/EditTokenReserveModal.vue'
  import { PublicKey, Transaction, AddressLookupTableProgram } from "@solana/web3.js"
  import { getTokenReservePDA } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import * as anchor from "@coral-xyz/anchor"

  const toast = inject('toast')

  var tokenMintAddressInput = ref()
  var pythPriceFeedID = ref()
  var tokenDecimalCountInput = ref()
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

  const noChangeDetected = computed(() =>
  {
    if((anchorPrograms.currentStatementMonthNumber == monthSelect.value) &&
    (anchorPrograms.currentStatementYear.toString() == statementYearInput.value))
      return true
    else
      return false
  })

  onMounted(() =>
  {
    const currentDate = new Date()

    statementYearInput.value = currentDate.getFullYear().toString()
    monthSelect.value = currentDate.getMonth() + 1
  })

  async function addTokenReserveQuick(tokenAddress: String)
  {
    const tokenInfo = tokenReserveFontEndInfoHashMap.get(tokenAddress)
    
    tokenMintAddressInput.value = tokenAddress
    pythPriceFeedID.value = tokenInfo.pythFeedId.slice(2)
    tokenDecimalCountInput.value = tokenInfo.decimalAmount
    tokenProgramSelect.value = tokenInfo.tokenProgram

    await addTokenReserve()
  }

  async function addTokenReserve()
  {
    try
    {
      const transaction = new Transaction()
      const mintAddressKey = new PublicKey(tokenMintAddressInput.value)
      const tokenReservePDA = getTokenReservePDA(mintAddressKey)

      if(!doesKeyExistInLookUpTable(anchorPrograms.lendingProtocolLookUpTableAccount, tokenReservePDA))
      {
        const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
        {
          authority: connectedWallet.publicKey,
          payer: connectedWallet.publicKey,
          lookupTable: anchorPrograms.lendingProtocolLookUpTableAddress,
          addresses: [tokenReservePDA]
        })
        transaction.add(extendLookUpTableInstruction)
      }

      const addTokenReserveInstruction = await anchorPrograms.lending.lendingProgram.methods.addTokenReserve(
        tokenDecimalCountInput.value,
        Array.from(Buffer.from(pythPriceFeedID.value, "hex")),
        borrowAPY.value * 100,//convert to fixedpoint notation
        trueFalseSelect.value,
        new anchor.BN(globalLimitInput.value * Math.pow(10, tokenDecimalCountInput.value)),//convert to fixedpoint notation
        solvencyInsurance.value * 100)//convert to fixedpoint notation
      .accounts({ tokenMint: mintAddressKey, tokenProgram: tokenProgramSelect.value })
      .instruction()
      transaction.add(addTokenReserveInstruction)

      const tx = await anchorPrograms.lending.lendingProgram.provider.sendAndConfirm(transaction, [])

      await confirmLendingTransaction(tx, toast, "add_token_reserve")

      tokenMintAddressInput.value = ""
      pythPriceFeedID.value = []
      tokenDecimalCountInput.value = ""
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