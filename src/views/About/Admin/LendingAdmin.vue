<template>
  <div v-if="connectedWallet.addressString==adminAccounts.lendingCEOAddressString" class="thickBorder smallMarginTop flexCenterRow" style="gap: 44px">
    <div>
      <div class="smallMarginTop">
        <h2>Current Statement Month And Year</h2>
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
          <ion-button class="smallMarginBottom" color="dark" @click="updateCurrentStatementMonthAndYear()" style="width:77px" :disabled="statementYearInput == '' || noDateChangeDetected">
            Update
          </ion-button>
        </div>
      </div>
    </div>
    <div class="mediumMarginRight">
      <h2>Max Tabs</h2>
      <ion-input
      v-model="maxTabsPerLendingAccount"
      fill="outline"
      placeholder="Enter Max Tab Amount"
      type="number"
      step="1"
      min="10">
      </ion-input>
      <ion-button color="dark" @click="updateMaxTabAmount()" :disabled="anchorPrograms.maxTabsPerLendingAccount==maxTabsPerLendingAccount">Update</ion-button>
    </div>
  </div>

  <div v-if="connectedWallet.addressString==adminAccounts.lendingCEOAddressString && anchorPrograms.isLendingProtocolInitialized" class="thickBorder smallMarginTop">
    <div class="smallMarginTop">
      <h2>Add Lending Token Reserve Account</h2>
      <div class="nMediumMarginTop smallMarginBottom">
        <ion-button color="dark" style="width: 280px; height: 45px" @click="addTokenReserveQuick(tokenIds.usdsTokenId)">
          <component :is="tokenReserveFontEndInfoHashMap.get(tokenIds.usdsTokenId).svg"></component>
          Init USDS Token Reserve
        </ion-button>
        <ion-button color="dark" style="width: 280px; height: 45px" @click="addTokenReserveQuick(tokenIds.usdcTokenId)">
          <component :is="tokenReserveFontEndInfoHashMap.get(tokenIds.usdcTokenId).svg"></component>
          Init USDC Token Reserve
        </ion-button>
        <ion-button color="dark" style="width: 280px; height: 45px" @click="addTokenReserveQuick(tokenIds.solTokenId)">
          <component :is="tokenReserveFontEndInfoHashMap.get(tokenIds.solTokenId).svg" style="width: 34px; margin-left: -10px"></component>
          Init SOL Token Reserve
        </ion-button>
        <ion-button color="dark" style="width: 240px; height: 45px" @click="addTokenReserveQuick(tokenIds.wethTokenId)">
          <component :is="tokenReserveFontEndInfoHashMap.get(tokenIds.wethTokenId).svg" style="width: 48px; margin-left: 0px; margin-right: -8px"></component>
          Init WETH Token Reserve
        </ion-button>
        <ion-button color="dark" style="width: 240px; height: 45px" @click="addTokenReserveQuick(tokenIds.wbtcTokenId)">
          <component :is="tokenReserveFontEndInfoHashMap.get(tokenIds.wbtcTokenId).svg" style="width: 48px; margin-left: 0px; margin-right: -8px"></component>
          Init WBTC Token Reserve
        </ion-button>
      </div>
    </div>
    <div class=" flexCenterRow">
      <div style="width: 90%">
        <ion-input v-model="tokenMintAddressInput" class="mediumMarginBottom" fill="outline" placeholder="Enter The Mint Address"></ion-input>
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
            v-model="useFixedAPYSelect" 
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
        :min="0" :max="5"
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
        :min="0" :max="4"
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

  

  <TokenReservesTable @createSubMarketModal="(tokenId: number, tokenMintAddress: PublicKey, tokenSVG: Component, tokenName:string) =>
  createSubMarketModal.openCreateSubMarketModal(tokenId, tokenMintAddress, tokenSVG, tokenName)"
  @collectSubMarketFeesModal="(rowData: any) => collectSubMarketFeesModal.openCollectSubMarketFeesModal(rowData)"/>
  <AdminTokenReservesTable @editTokenReserveModal="(tokenId: number,
  tokenMintAddress: PublicKey,
  tokenSVG: Component,
  tokenName:string,
  solvencyInsuranceFeeRate: number,
  baseBorrowAPY: number,
  useFixedBorrowApy: boolean,
  globalLimit: number) =>
  editTokenReserveModal.openEditTokenReserveModal(tokenId, tokenMintAddress, tokenSVG, tokenName, solvencyInsuranceFeeRate, baseBorrowAPY, useFixedBorrowApy, globalLimit)"/>
  <div v-if="connectedWallet.addressString==adminAccounts.lendingCEOAddressString && anchorPrograms.isLendingProtocolInitialized">
    <MintTestToken/>
    <CloseTempPriceAccount/>
  </div>

  <EditTokenReserveModal ref="editTokenReserveModal"/>
  <CreateSubMarketModal ref="createSubMarketModal"/>
  <CollectSubMarketFeesModal ref="collectSubMarketFeesModal"/>
  
</template>

<script setup lang="ts">
  import { ref, inject, type Component, onMounted, computed, watch } from 'vue'
  import { IonButton, IonInput, IonText, IonLabel } from '@ionic/vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { confirmLendingTransaction, doesKeyExistInLookUpTable, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { anchorPrograms, monthList } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { tokenIds, LegacyTokenProgramID, TokenProgram2022ID } from '/src/assets/constants/Addresses.ts'
  import { tokenReserveFontEndInfoHashMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import Select from 'primevue/select'
  import InputNumber from 'primevue/inputnumber'
  import TokenReservesTable from '/src/components/tables/lending/TokenReservesTable.vue'
  import AdminTokenReservesTable from '/src/components/tables/lending/admin/AdminTokenReservesTable.vue'
  import MintTestToken from '/src/components/smart contracts/lending protocol/admin/MintTestToken.vue'
  import CloseTempPriceAccount from '/src/components/smart contracts/lending protocol/admin/CloseTempPriceAccount.vue'
  import EditTokenReserveModal from '/src/components/smart contracts/lending protocol/EditTokenReserveModal.vue'
  import CreateSubMarketModal from '/src/components/smart contracts/lending protocol/CreateSubMarketModal.vue'
  import CollectSubMarketFeesModal from '/src/components/smart contracts/lending protocol/CollectSubMarketFeesModal.vue'
  import { PublicKey, AddressLookupTableProgram } from "@solana/web3.js"
  import { getTokenReservePDA, sendVersionedLendingProtocolTransaction } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import * as anchor from "@coral-xyz/anchor"

  const toast = inject('toast')

  var tokenMintAddressInput = ref()
  var tokenDecimalCountInput = ref()
  
  var editTokenReserveModal = ref()
  var createSubMarketModal = ref()
  var collectSubMarketFeesModal = ref()
  
  var monthSelect = ref()
  var statementYearInput = ref("")
  var maxTabsPerLendingAccount = ref(anchorPrograms.maxTabsPerLendingAccount)

  var borrowAPY = ref(5)
  var solvencyInsurance = ref(1)
  var globalLimitInput = ref(100_000)

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

  var useFixedAPYSelect = ref(true)
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

  const noDateChangeDetected = computed(() =>
  {
    if((anchorPrograms.currentStatementMonthNumber == monthSelect.value) &&
    (anchorPrograms.currentStatementYear.toString() == statementYearInput.value))
      return true
    else
      return false
  })

  //Json string of wallet to detect object property changes
  const anchorProgramsWatch = computed(() =>
  {
    return JSON.stringify(
    {
      maxTabsPerLendingAccount: anchorPrograms.maxTabsPerLendingAccount
    })
  })

  watch(anchorProgramsWatch, async (newJSONObjectString, oldJSONObjectString) =>
  {
      let newAnchorProgram = JSON.parse(newJSONObjectString)
      let oldAnchorProgram = JSON.parse(oldJSONObjectString)

      //Only want this running if the connected Wallet Address String is changing
      if(newAnchorProgram.maxTabsPerLendingAccount == oldAnchorProgram.maxTabsPerLendingAccount)
        return

    maxTabsPerLendingAccount.value = anchorPrograms.maxTabsPerLendingAccount
  })

  onMounted(() =>
  {
    const currentDate = new Date()

    statementYearInput.value = currentDate.getFullYear().toString()
    monthSelect.value = currentDate.getMonth() + 1
  })

  async function addTokenReserveQuick(tokenId: number)
  {
    const tokenInfo = tokenReserveFontEndInfoHashMap.get(tokenId)

    tokenMintAddressInput.value = tokenInfo.publicKey
    tokenDecimalCountInput.value = tokenInfo.decimalAmount
    tokenProgramSelect.value = tokenInfo.tokenProgram
    globalLimitInput.value = tokenInfo.initialGlobalLimit

    await addTokenReserve()
  }

  async function addTokenReserve()
  {
    try
    {
      var instructionsToSend = []
      var lookUpTableAccounts = []
      const tokenReservePDA = getTokenReservePDA(tokenMintAddressInput.value)

      if(!doesKeyExistInLookUpTable(anchorPrograms.lendingProtocolLookUpTableAccount, tokenReservePDA))
      {
        const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
        {
          authority: connectedWallet.publicKey,
          payer: connectedWallet.publicKey,
          lookupTable: anchorPrograms.lendingProtocolLookUpTableAddress,
          addresses: [tokenReservePDA]
        })
        instructionsToSend.push(extendLookUpTableInstruction)
      }

      const addTokenReserveInstruction = await anchorPrograms.lending.lendingProgram.methods.addTokenReserve(
        tokenDecimalCountInput.value,
        borrowAPY.value * 100,//convert to fixedpoint notation
        useFixedAPYSelect.value,
        new anchor.BN(globalLimitInput.value * Math.pow(10, tokenDecimalCountInput.value)),//convert to fixedpoint notation
        solvencyInsurance.value * 100)//convert to fixedpoint notation
      .accounts({ tokenMint: tokenMintAddressInput.value, tokenProgram: tokenProgramSelect.value })
      .instruction()
      instructionsToSend.push(addTokenReserveInstruction)

      //Get Lending Protocol Look Up Table Account
      lookUpTableAccounts.push(anchorPrograms.lendingProtocolLookUpTableAccount)

      const tx = await sendVersionedLendingProtocolTransaction(instructionsToSend, lookUpTableAccounts)

      await confirmLendingTransaction(tx, toast, "add_token_reserve")

      tokenMintAddressInput.value = ""
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
      var instructionsToSend = []
      var lookUpTableAccounts = []

      instructionsToSend.push(await anchorPrograms.lending.lendingProgram.methods.updateCurrentStatementMonthAndYear(
        monthSelect.value, Number(statementYearInput.value)).instruction())

      //Get Lending Protocol Look Up Table Account
      lookUpTableAccounts.push(anchorPrograms.lendingProtocolLookUpTableAccount)

      const tx = await sendVersionedLendingProtocolTransaction(instructionsToSend, lookUpTableAccounts)

      await confirmLendingTransaction(tx, toast, "update_current_statement_month_and_year")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "update_current_statement_month_and_year")
    }
  }

  async function updateMaxTabAmount()
  {

    try
    {
      var instructionsToSend = []
      var lookUpTableAccounts = []

      instructionsToSend.push(await anchorPrograms.lending.lendingProgram.methods.updateMaxTabAmount(maxTabsPerLendingAccount.value).instruction())

      //Get Lending Protocol Look Up Table Account
      lookUpTableAccounts.push(anchorPrograms.lendingProtocolLookUpTableAccount)

      const tx = await sendVersionedLendingProtocolTransaction(instructionsToSend, lookUpTableAccounts)

      await confirmLendingTransaction(tx, toast, "update_max_tab_amount")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "update_max_tab_amount")
    }
  }
</script>

<style scoped>
  ion-input
  {
    --highlight-color: var(--ion-color-gray)
  }
</style>