<template>
  <div v-if="isBrowsingAllUsers">
    <ion-button color="lightOffDark" class="" style="margin-bottom: -2px" @click="setIsBrowsingAllLendingUsers(false)">
      <ion-label color="green">Charts</ion-label>
    </ion-button>
    <LendingLeaderBoardTable
    @viewPortfolio="viewPortfolio"
    @openLiquidationModal="emitOpenLiquidationModal"/>
  </div>

  <div v-if="!isBrowsingAllUsers" class="tableContainer">
    <h1 class="yellow displayLongName">{{ displayName }}</h1>
    <h1 class="yellow displayShortName">{{ possiblyTrimmedDisplayName }}</h1>

    <p v-if="connectedWallet.addressString==SYSTEM_PROGRAM_ADDRESS_STRING && !isValidPublicKey">Connect Wallet or Search for a Different Public Key</p>
    <p v-else-if="!isValidPublicKey">Search for a Valid Different Public Key</p>

    <ion-input
    v-model="addressToCheck"
    placeholder="Check New Address"
    fill="outline"
    class="nSmallMarginTop"
    :class="{ 'invalid': !isValidPublicKey }"
    @keydown.enter="isValidPublicKey=isValidSolanaPublicKey(addressToCheck); checkNewAddress()"
    ></ion-input>

    <div class="smallMarginTop">
      <ion-button
      id="checkNewAddressButton"
      @click="isValidPublicKey=isValidSolanaPublicKey(addressToCheck); checkNewAddress()"
      color="lightOffDark" 
      >
        <ion-label color="green">Check New Address</ion-label>
      </ion-button>

      <ion-button color="lightOffDark" @click="setIsBrowsingAllLendingUsers(true)">
        <ion-label color="green">Browse All Users</ion-label>
      </ion-button>
    </div>
  </div>
 
  <div v-if="(userMonthlyStatementStableCoinList?.length > 0 || userMonthlyStatementCryptoCurrencyList?.length > 0) && !isBrowsingAllUsers" class="thickBorder smallMarginTop">
    <div class="topHHeaderDisplay thinBorderBottom">
  
      <div class="flexCenterRow" style="justify-content:space-around !important">
        <div>
          <h2 class="underLine yellow">7 Day Projection Rate</h2>
          <h3 class="nMediumMarginTop">Value:
            $<span class="rainbowText">{{ total7DayProjectionRateValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 }) }}
            </span> A Week
          </h3>
        </div>

        <div style="display: flex; flex-direction: column">
          <div>
            <ion-label>Account Name</ion-label>
          </div>
          <Select
          v-if="!editingAccountName"
          class="accountSelect"
          v-model="accountSelect" 
          :options="accountList" 
          optionLabel="accountName" 
          optionValue="userAccountIndex" 
          placeholder="Select Account"
          appendTo="self"
          @change="updateStoredSelectedAccount()">
          </Select>

          <div v-if="connectedWallet.addressString==searchAddress">
            <div v-if="!connectedWallet.isTempPriceAccountAlive" class="flexCenterRow">
              <div class="nMediumMarginLeft">
                <InfoButton :infoMessage="refreshAccountMSG"/>
              </div>
              <ion-button  color="lightOffDark" @click="refreshUser()">
                <ion-label color="green">Refresh Account</ion-label>
              </ion-button>
            </div>

            <div v-else class="flexCenterColumn">
              <br>
              <ion-text style="margin: 10px">{{ TEMP_PRICE_ACCOUNT_ALIVE_MSG }}</ion-text>
              <ion-button :color="colorName" @click="closeTempOraclePriceData(toast)">
                Close Temp Price Account
              </ion-button>
            </div>
          </div>

        </div>

        <div>
          <h2 class="underLine yellow">Life Time Interest Earned</h2>
          <h3 class="nMediumMarginTop">Value:
            $<span class="rainbowText">{{ totalLifeTimeInterestEarnedValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 }) }}
            </span>
          </h3>
        </div>
      </div>

      <HealthFactorBig :accountOwnerAddress="searchAddress" :accountIndex="accountSelect"/>
    </div>

    <div class="topVHeaderDisplay thinBorderBottom" style="justify-content:space-around !important">
      <div class="mediumMarginTop">
        <ion-label>Account Name</ion-label>
      </div>
      <Select
      v-if="!editingAccountName"
      class="accountSelect "
      v-model="accountSelect" 
      :options="accountList" 
      optionLabel="accountName" 
      optionValue="userAccountIndex" 
      placeholder="Select Account"
      appendTo="self"
      @change="updateStoredSelectedAccount()">
      </Select>

      <div v-if="connectedWallet.addressString==searchAddress">
        <div v-if="!connectedWallet.isTempPriceAccountAlive" class="flexCenterRow">
          <div class="nMediumMarginLeft">
            <InfoButton :infoMessage="refreshAccountMSG"/>
          </div>
          <ion-button color="lightOffDark" @click="refreshUser()">
            <ion-label color="green">Refresh Account</ion-label>
          </ion-button>
        </div>

        <div v-else class="flexCenterColumn">
          <br>
          <ion-text style="margin: 10px">{{ TEMP_PRICE_ACCOUNT_ALIVE_MSG }}</ion-text>
          <ion-button :color="colorName" @click="closeTempOraclePriceData(toast)">
            Close Temp Price Account
          </ion-button>
        </div>
      </div>

      <div>
        <h2 class="underLine yellow">7 Day Projection Rate</h2>
        <h3 class="nMediumMarginTop">Value:
          $<span class="rainbowText">{{ total7DayProjectionRateValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}
          </span> A Week
        </h3>
      </div>

      <div>
        <h2 class="underLine nSmallMarginTop yellow">Life Time Interest Earned</h2>
        <h3 class="nMediumMarginTop">Value:
          $<span class="rainbowText">{{ totalLifeTimeInterestEarnedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}
          </span>
        </h3>
      </div>   

      <div class="nTinyMarginTop">
        <HealthFactorBig :accountOwnerAddress="searchAddress" :accountIndex="accountSelect"/>
      </div>
    </div>

    <!--Stable Coin Charts-->
    <div v-if="userMonthlyStatementStableCoinList?.length > 0" class="smallMarginTop nLargeMarginBottom hHeaderDisplay">
      <div>
        <h4 class="underLine green" style="line-height: 27px">Stable Coin<br>7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value:
          $<span class="rainbowText">{{ stableCoin7DayProjectionRateValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}
          </span> A Week
        </h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ stableCoin7DayProjectionRateAmount }}</span> A Week</h5>
      </div>

      <div>
        <h4 class="underLine green" style="line-height: 27px">Stable Coin<br>Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value:
          $<span class="rainbowText">{{ stableCoinLifeTimeInterestEarnedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}
          </span>
        </h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ stableCoinLifeTimeInterestEarnedAmount }}</span></h5>
      </div>  
    </div>

    <div v-if="userMonthlyStatementStableCoinList?.length > 0" class="smallMarginTop vHeaderDisplay">
      <div>
        <h4 class="underLine green" style="line-height: 27px">Stable Coin<br>7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value:
          $<span class="rainbowText">{{ stableCoin7DayProjectionRateValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}
          </span> A Week
        </h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ stableCoin7DayProjectionRateAmount }}</span> A Week</h5>
      </div>

      <div class="nMediumMarginTop">
        <h4 class="underLine green" style="line-height: 27px">Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value:
          $<span class="rainbowText">{{ stableCoinLifeTimeInterestEarnedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}
          </span>
        </h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ stableCoinLifeTimeInterestEarnedAmount }}</span></h5>
      </div>
    </div>

    <div v-if="userMonthlyStatementStableCoinList?.length > 0" class="nMediumMarginTop mediumSmallMarginBottom">
      <div v-for="(monthlyStatement, userTabIndex) in enrichedStableCoinMonthlyStatementList">
        <PortfolioChart
        :isStableCoin="true"
        :hasDeposits="hasDeposits"
        :tokenId="monthlyStatement.tokenId"
        :subMarketOwnerAddress="monthlyStatement.subMarketOwnerAddress"
        :subMarketOwnerAddressTrimmed="monthlyStatement.subMarketOwnerAddressTrimmed"
        :subMarketIndex="monthlyStatement.subMarketIndex"
        :ownerAddress="searchAddress"
        :accountIndex="accountSelect"
        :subMarketFee="monthlyStatement.subMarketFee"
        :userTabIndex="userTabIndex"
        :chartData="monthlyStatement.chartData"
        :selectedChart="monthlyStatement.selectedChart"
        @changeYear="updateSelectedChartNameHashMap"
        @openDepositModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openDepositModal', tokenId, tokenMintAddress, subMarketOption)"
        @openWithdrawalModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openWithdrawalModal', tokenId, tokenMintAddress, subMarketOption)"
        @openBorrowModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openBorrowModal', tokenId, tokenMintAddress, subMarketOption)"
        @openRepayModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openRepayModal', tokenId, tokenMintAddress, subMarketOption)"
        @interestEarned="updateStableCoinRealTimeValues"/>
      </div>
    </div>

    <!--Crypto Charts-->
    <div v-if="userMonthlyStatementCryptoCurrencyList?.length > 0" class="smallMarginTop nLargeMarginBottom hHeaderDisplay" :class="userMonthlyStatementStableCoinList?.length > 0 ? 'thinBorderTop' : ''"
      :style="{paddingTop: userMonthlyStatementStableCoinList?.length > 0 ? '14px' : '0px'}">
      <div>
        <h4 class="underLine green" style="line-height: 27px">Crypto Currency<br>7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value:
          $<span class="rainbowText">{{ crypto7DayProjectionRateValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}
          </span> A Week
        </h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ crypto7DayProjectionRateAmount }}</span> A Week</h5>
      </div>

      <div>
        <h4 class="underLine green" style="line-height: 27px">Crypto Currency<br>Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value:
          $<span class="rainbowText">{{ cryptoLifeTimeInterestEarnedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}
          </span>
        </h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ cryptoLifeTimeInterestEarnedAmount }}</span></h5>
      </div>
    </div>

    <div v-if="userMonthlyStatementCryptoCurrencyList?.length > 0" class="smallMarginTop vHeaderDisplay" :class="userMonthlyStatementStableCoinList?.length > 0 ? 'thinBorderTop' : ''"
      :style="{paddingTop: userMonthlyStatementStableCoinList?.length > 0 ? '4px' : '0px'}">
      
      <div>
        <h4 class="underLine green" style="line-height: 27px">Crypto Currency<br>7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value:
          $<span class="rainbowText">{{ crypto7DayProjectionRateValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}
          </span> A Week
        </h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ crypto7DayProjectionRateAmount }}</span> A Week</h5>
      </div>

      <div class="nMediumMarginTop">
        <h4 class="underLine green" style="line-height: 27px">Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value:
          $<span class="rainbowText">{{ cryptoLifeTimeInterestEarnedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 }) }}
          </span>
        </h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ cryptoLifeTimeInterestEarnedAmount }}</span></h5>
      </div>

    </div>

    <div v-if="userMonthlyStatementCryptoCurrencyList?.length > 0" class="nMediumMarginTop mediumSmallMarginBottom">
      <div v-for="(monthlyStatement, userTabIndex) in enrichedCryptoMonthlyStatementList">
        <PortfolioChart
        :isStableCoin="false"
        :hasDeposits="hasDeposits"
        :tokenId="monthlyStatement.tokenId"
        :subMarketOwnerAddress="monthlyStatement.subMarketOwnerAddress"
        :subMarketOwnerAddressTrimmed="monthlyStatement.subMarketOwnerAddressTrimmed"
        :subMarketIndex="monthlyStatement.subMarketIndex"
        :ownerAddress="searchAddress"
        :accountIndex="accountSelect"
        :subMarketFee="monthlyStatement.subMarketFee"
        :userTabIndex="userTabIndex"
        :chartData="monthlyStatement.chartData"
        :selectedChart="monthlyStatement.selectedChart"
        @changeYear="updateSelectedChartNameHashMap"
        @openDepositModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openDepositModal', tokenId, tokenMintAddress, subMarketOption)"
        @openWithdrawalModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openWithdrawalModal', tokenId, tokenMintAddress, subMarketOption)"
        @openBorrowModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openBorrowModal', tokenId, tokenMintAddress, subMarketOption)"
        @openRepayModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openRepayModal', tokenId, tokenMintAddress, subMarketOption)"
        @interestEarned="updateCryptoRealTimeValues"/>
      </div>
    </div>
  </div>

  <div v-else-if="!isBrowsingAllUsers" class="smallMarginTop">{{ anchorPrograms.isLendingProtocolReady ? 'No Lending User Found At That PublicKey' : 'Loading' }}</div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onUnmounted, computed, inject } from 'vue'
  import { IonInput, IonButton, IonLabel, IonText } from '@ionic/vue'
  import Select from 'primevue/select'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { getUserDisplayName, getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { lendingUserAccountsHashMap,
    lendingUserAvailableStableCoinStatementsBySubMarketsHashMap,
    lendingUserAvailableStableCoinYearsBySubMarketHashMap,
    lendingUserAvailableCryptoCurrencyStatementsBySubMarketsHashMap,
    lendingUserAvailableCryptoCurrencyYearsBySubMarketHashMap,
    lendingUserMonthlyStatementsHashMap,
    lendingUserTabAccountListHashMap,
    lendingUserRemainingTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { trimAddress,
    isValidSolanaPublicKey,
    confirmLendingTransaction,
    parseProgramErrorCode,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { userSignsLendingTransactions,
    bundleProtocolPriceTransactions,
    getNeccessaryRefreshInstructionData,
    getTokenReserveRemainingAccounts,
    getTempRemainingPriceAccount,
    closeTempOraclePriceData,
    TEMP_PRICE_ACCOUNT_ALIVE_MSG,
    getLendingStatsPDA } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import LendingLeaderBoardTable from '/src/components/tables/lending/LendingLeaderBoardTable.vue'
  import PortfolioChart from '/src/components/charts/lending/PortfolioChart.vue'
  import { anchorPrograms, monthList } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import HealthFactorBig from '/src/components/smart contracts/lending protocol/HealthFactorBig.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import InfoButton from '/src/components/help/InfoButton.vue'
  import cloneDeep from 'lodash/cloneDeep'
  import { setRainbowLineAnimatedGradient,
    setRainbowBarAnimatedGradient,
    setPoopLineAnimatedGradient,
    setPoopBarAnimatedGradient,
    setPurpleBlueBarAnimatedGradient } from '/src/components/charts/lending/ChartHelper.ts'
  import * as bs58 from 'bs58'
  
  const toast = inject('toast')
  const colorName = inject('colorName') as string

  const props = defineProps(['portfolioURLHelper'])
  const emits = defineEmits(
  [
    'openDepositModal',
    'openWithdrawalModal',
    'openBorrowModal',
    'openRepayModal',
    'openLiquidationModal',
    'isBrowsingUsers'
  ])

  var displayName = ref()
  var possiblyTrimmedDisplayName = ref()
  var searchAddress = ref()
  var addressToCheck = ref()
  var isValidPublicKey = ref(false)

  var userMonthlyStatementStableCoinList = ref()
  var userStableCoinInterestHelper: string | any[]
  var userMonthlyStatementCryptoCurrencyList = ref()
  var userCryptoCurrencyInterestHelper: string | any[]

  var intervalId: any

  var chartReRenderKey = ref(0)
  var editingAccountName = ref(false)
  var hasAtleast1Account = ref()
  var accountNameEditInputRef = ref()
  var accountName = ref()
  var accountSelect = ref(0)
  var accountList = ref()
  var isBrowsingAllUsers = ref()

  var selectedChartNameHashMap = new Map<string, any>()
  var selectedChartDataHashMap = new Map<string, any>()
  var hasDeposits = ref(false)

  var stableCoin7DayProjectionRateAmount = ref("0")
  var stableCoin7DayProjectionRateValue = ref(0)
  var stableCoin7DayProjectionRateValueUnRounded = ref(0)
  var stableCoinLifeTimeInterestEarnedAmount = ref("0")
  var stableCoinLifeTimeInterestEarnedValue = ref(0)
  var stableCoinLifeTimeInterestEarnedValueUnRounded = ref(0)

  var crypto7DayProjectionRateAmount = ref("0")
  var crypto7DayProjectionRateValue = ref(0)
  var crypto7DayProjectionRateValueUnRounded = ref(0)
  var cryptoLifeTimeInterestEarnedAmount = ref("0")
  var cryptoLifeTimeInterestEarnedValue = ref(0)
  var cryptoLifeTimeInterestEarnedValueUnRounded = ref(0)

  var gradientOffset = ref(0)

  const refreshAccountMSG = "This will create new monthly statements if they need to be created and update user Balance/Debt and Interest Earned/Accrued.\n\nFor tax purposes, interest is not considered Earned/Accrued until it appears in your monthly statement."

  const total7DayProjectionRateValue = computed (() =>
  {
    return Math.floor((stableCoin7DayProjectionRateValueUnRounded.value + crypto7DayProjectionRateValueUnRounded.value) * 100) / 100
  })

  const totalLifeTimeInterestEarnedValue = computed (() =>
  {
    return Math.floor((stableCoinLifeTimeInterestEarnedValueUnRounded.value + cryptoLifeTimeInterestEarnedValueUnRounded.value) * 100) / 100
  })

  const enrichedStableCoinMonthlyStatementList = computed(() =>
  {
    if(!userMonthlyStatementStableCoinList.value)
      return []

    //Force Vue to track this dependency. 
    //Whenever chartReRenderKey increments, this computed property WILL re-run.
    const forceUpdate = chartReRenderKey.value

    return userMonthlyStatementStableCoinList.value.map((monthlyStatement: { tokenId: number; subMarketOwnerAddress: string; subMarketIndex: number }) =>
    {
      return{
        //Keep all the existing properties (tokenId, address, etc.)
        ...monthlyStatement,
        
        //Calculate these ONCE per reactivity cycle, not on every template render
        chartData: getChartData
        (
          monthlyStatement.tokenId, 
          monthlyStatement.subMarketOwnerAddress, 
          monthlyStatement.subMarketIndex
        ),
        selectedChart: getSelectedChartName
        (
          monthlyStatement.tokenId, 
          monthlyStatement.subMarketOwnerAddress, 
          monthlyStatement.subMarketIndex
        )
      }
    })
  })

  const enrichedCryptoMonthlyStatementList = computed(() =>
  {
    if (!userMonthlyStatementCryptoCurrencyList.value) return []

    //Force Vue to track this dependency. 
    //Whenever chartReRenderKey increments, this computed property WILL re-run.
    const forceUpdate = chartReRenderKey.value

    return userMonthlyStatementCryptoCurrencyList.value.map((monthlyStatement: { tokenId: number; subMarketOwnerAddress: string; subMarketIndex: number }) =>
    {
      return{
        // Keep all the existing properties (tokenId, address, etc.)
        ...monthlyStatement,
        
        // Calculate these ONCE per reactivity cycle, not on every template render
        chartData: getChartData
        (
          monthlyStatement.tokenId, 
          monthlyStatement.subMarketOwnerAddress, 
          monthlyStatement.subMarketIndex
        ),
        selectedChart: getSelectedChartName
        (
          monthlyStatement.tokenId, 
          monthlyStatement.subMarketOwnerAddress, 
          monthlyStatement.subMarketIndex
        )
      }
    })
  })

  const baseChartData =
  {
    lastActionType: 0,
    lastActionAmount: 0,
    lastActionTimeStamp: 0,
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets:
    [
      {
        type: 'bar',
        label: 'Fees Generated',
        backgroundColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setPurpleBlueBarAnimatedGradient(ctx, chartArea, gradientOffset.value)
        },
        maxBarThickness: 44,
        data: [] as any[]
      },
      {
        type: 'line',
        label: 'Balance',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setRainbowLineAnimatedGradient(ctx, chartArea, gradientOffset.value)
        },
        borderWidth: 4,
        fill: false,
        tension: 0.4,
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Interest Earned',
        backgroundColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setRainbowBarAnimatedGradient(ctx, chartArea, gradientOffset.value)
        },
        maxBarThickness: 44,
        data: [] as any[]
      },
      {
        type: 'line',
        label: 'Debt',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setPoopLineAnimatedGradient(ctx, chartArea, gradientOffset.value)
        },
        borderWidth: 4,
        fill: false,
        tension: 0.4,
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Interest Accrued',
        backgroundColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setPoopBarAnimatedGradient(ctx, chartArea, gradientOffset.value)
        },
        maxBarThickness: 44,
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Deposits',
        backgroundColor: "#39bd39",
        maxBarThickness: 44,
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Withdrawals',
        backgroundColor: "#b5bbca",
        maxBarThickness: 44,
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Borrows',
        backgroundColor: "#557fcc",
        maxBarThickness: 44,
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Repays',
        backgroundColor: "#ffd700",
        maxBarThickness: 44,
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Liquidator',
        backgroundColor: "#8a2be2",
        maxBarThickness: 44,
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Liquidated',
        backgroundColor: "#ff0000",
        maxBarThickness: 44,
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Collect Liq Fee',
        backgroundColor: "#ff00ff",
        maxBarThickness: 44,
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Collect SB Fee',
        backgroundColor: "#ff8800",
        maxBarThickness: 44,
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Collect Sol Fee',
        backgroundColor: "#006400",
        maxBarThickness: 44,
        data: [] as any[]
      }
    ]
  }

  enum ChartIndex
  {
    FeesGenerated = 0,
    Balances = 1,
    InterestEarned = 2,
    Debts = 3,
    InterestAccrued = 4,
    Deposits = 5,
    Withdrawals = 6,
    Borrows = 7,
    Repays = 8,
    Liquidator = 9,
    Liquidated = 10,
    CollectedLiquidationFees = 11,
    CollectedSubMarketFees = 12,
    CollectedSolvencyFees = 13
  }

  onMounted(async() =>
  {
    searchAddress.value = connectedWallet.addressString
    addressToCheck.value = searchAddress.value

    const pathname = window.location.pathname
    const portfolioMatch = pathname.match(/^\/M4A\/Markets-Portfolios-([a-zA-Z0-9]+)-(\d+)$/)

    if(pathname == "/M4A/Markets")
    {
      const flipped = localStorage.getItem("marketTableSelect") || ""
      isBrowsingAllUsers.value = localStorage.getItem("isBrowsingAllLendingUsers") == "true" || false

      if(flipped == "flipped")
        if(!isBrowsingAllUsers.value)
          setTimeout(()=>
          {
            window.history.pushState({}, '', "/M4A/Markets-Portfolios-" + addressToCheck.value + '-' + connectedWallet.selectedLendingUserAccountIndex)
          }, 100)
    }
    else if(pathname == "/M4A/Markets-Portfolios")
    {
      isBrowsingAllUsers.value = false
      localStorage.setItem("isBrowsingAllLendingUsers", isBrowsingAllUsers.value.toString())
      setTimeout(()=>
      {
        window.history.pushState({}, '', "/M4A/Markets-Portfolios-" + addressToCheck.value + '-' + connectedWallet.selectedLendingUserAccountIndex)
      }, 100)
    }
    else if(portfolioMatch)
    {
      addressToCheck.value = portfolioMatch[1]
      accountSelect.value = parseInt(portfolioMatch[2], 10)
      checkNewAddress(accountSelect.value)

      isBrowsingAllUsers.value = false
      localStorage.setItem("isBrowsingAllLendingUsers", isBrowsingAllUsers.value.toString())
    }
    else if(pathname == "/M4A/Markets-LendingLeaderBoard")
    {
      isBrowsingAllUsers.value = true
      localStorage.setItem("isBrowsingAllLendingUsers", isBrowsingAllUsers.value.toString())
    }

    emits('isBrowsingUsers', isBrowsingAllUsers.value)

    isValidPublicKey.value = isValidSolanaPublicKey(addressToCheck.value)
    if(!portfolioMatch)
      accountSelect.value = connectedWallet.selectedLendingUserAccountIndex

    setLendingUserAccountList()
    checkForLendingUserAssets()

    if(connectedWallet.isChatAccountReady)
    {
      displayName.value = getUserDisplayName(searchAddress.value)
      possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(searchAddress.value)
    }
    else
    {
      displayName.value = searchAddress.value
      possiblyTrimmedDisplayName.value = trimAddress(searchAddress.value)
    }

    if(lendingUserMonthlyStatementsHashMap.map)
    {
      userMonthlyStatementStableCoinList.value = lendingUserAvailableStableCoinStatementsBySubMarketsHashMap.map.get(connectedWallet.addressString + connectedWallet.selectedLendingUserAccountIndex.toString())
      userStableCoinInterestHelper = cloneDeep(userMonthlyStatementStableCoinList.value)
      if(userMonthlyStatementStableCoinList.value?.length)
        resetSelectedChartNameHashMap(userMonthlyStatementStableCoinList.value)

      userMonthlyStatementCryptoCurrencyList.value = lendingUserAvailableCryptoCurrencyStatementsBySubMarketsHashMap.map.get(connectedWallet.addressString + connectedWallet.selectedLendingUserAccountIndex.toString())
      userCryptoCurrencyInterestHelper = cloneDeep(userMonthlyStatementCryptoCurrencyList.value)
      if(userMonthlyStatementCryptoCurrencyList.value?.length)
        resetSelectedChartNameHashMap(userMonthlyStatementCryptoCurrencyList.value)

      setChartData()
      startGradientAnimation()
    }
  })

  onUnmounted(() =>
  {
    stopGradientAnimation()
  })

  //Json string of wallet to detect object property changes
  const walletWatch = computed(() =>
  {
    return JSON.stringify(
    {
      addressString: connectedWallet.addressString,
      selectedLendingUserAccountIndex: connectedWallet.selectedLendingUserAccountIndex
    })
  })

  watch(walletWatch, async (newJSONObjectString, oldJSONObjectString) =>
  {
    let newWallet = JSON.parse(newJSONObjectString)
    let oldWallet = JSON.parse(oldJSONObjectString)
    var accountExists = false

    //This is here because of the "watch(lendingUserMonthlyStatementsHashMap, () =>" line. Don't want to the chart being updated twice unnecessarily.
    //The isBrowisngAllUsers check keeps the leaderboard height from being messed up when changing the selected account index when the leader board isn't visible.
    if((newWallet.addressString == oldWallet.addressString && newWallet.selectedLendingUserAccountIndex == oldWallet.selectedLendingUserAccountIndex) || isBrowsingAllUsers.value)
      return

    if(connectedWallet.addressString != SYSTEM_PROGRAM_ADDRESS_STRING)
    {
      searchAddress.value = connectedWallet.addressString
      accountSelect.value = connectedWallet.selectedLendingUserAccountIndex

      addressToCheck.value = searchAddress.value
      const flipped = localStorage.getItem("marketTableSelect") || "" //This flipped checked is needed when a wallet is already connected on the Market page, and you hit the refresh button
      if(flipped == "flipped")
        if(!isBrowsingAllUsers.value)
          setTimeout(()=>
          {
            window.history.pushState({}, '', "/M4A/Markets-Portfolios-" + addressToCheck.value + '-' + connectedWallet.selectedLendingUserAccountIndex)
          }, 100)
      isValidPublicKey.value = isValidSolanaPublicKey(addressToCheck.value)

      displayName.value = getUserDisplayName(searchAddress.value)
      possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(searchAddress.value)

      setLendingUserAccountList()
      checkForLendingUserAssets()

      if(lendingUserMonthlyStatementsHashMap.map)
      {
        userMonthlyStatementStableCoinList.value = lendingUserAvailableStableCoinStatementsBySubMarketsHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())
        userStableCoinInterestHelper = cloneDeep(userMonthlyStatementStableCoinList.value)
        if(userMonthlyStatementStableCoinList.value?.length)
          resetSelectedChartNameHashMap(userMonthlyStatementStableCoinList.value)

        userMonthlyStatementCryptoCurrencyList.value = lendingUserAvailableCryptoCurrencyStatementsBySubMarketsHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())
        userCryptoCurrencyInterestHelper = cloneDeep(userMonthlyStatementCryptoCurrencyList.value)
        if(userMonthlyStatementCryptoCurrencyList.value?.length)
          resetSelectedChartNameHashMap(userMonthlyStatementCryptoCurrencyList.value)

        setChartData()
      }
    }
  })

  watch(lendingUserAccountsHashMap, () =>
  {
    setLendingUserAccountList()
  })

  watch(lendingUserTabAccountListHashMap,() =>
  {
    checkForLendingUserAssets()
  })

  watch(lendingUserMonthlyStatementsHashMap, async() =>
  {
    userMonthlyStatementStableCoinList.value = lendingUserAvailableStableCoinStatementsBySubMarketsHashMap.map.get(searchAddress.value + accountSelect.value.toString())
    userStableCoinInterestHelper = cloneDeep(userMonthlyStatementStableCoinList.value)
    if(userMonthlyStatementStableCoinList.value?.length)
      resetSelectedChartNameHashMap(userMonthlyStatementStableCoinList.value)

    userMonthlyStatementCryptoCurrencyList.value = lendingUserAvailableCryptoCurrencyStatementsBySubMarketsHashMap.map.get(searchAddress.value + accountSelect.value.toString())
    userCryptoCurrencyInterestHelper = cloneDeep(userMonthlyStatementCryptoCurrencyList.value)
    if(userMonthlyStatementCryptoCurrencyList.value?.length)
      resetSelectedChartNameHashMap(userMonthlyStatementCryptoCurrencyList.value)

    setChartData()

    startGradientAnimation()
  })

  watch(customUserNameHashMap,() =>
  {
    displayName.value = getUserDisplayName(searchAddress.value)
    possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(searchAddress.value)
  })

  watch(() => props.portfolioURLHelper, (() => 
  {
    if(!isBrowsingAllUsers.value)
      setTimeout(()=>
      {
        window.history.pushState({}, '', "/M4A/Markets-Portfolios-" + addressToCheck.value + '-' + accountSelect.value)
      }, 100)
  }))

  function resetSelectedChartNameHashMap(subMarketArray: any[])
  {
    if(subMarketArray)
    {
      for(var i=0; i<subMarketArray.length; i++)
      {
        const key = subMarketArray[i].tokenId.toString() + subMarketArray[i].subMarketOwnerAddress + subMarketArray[i].subMarketIndex.toString()
        selectedChartNameHashMap.set(key, "All")
      }
    }
  }

  function updateSelectedChartNameHashMap(tokenId: number, subMarketOwnerAddress: string, subMarketIndex: number, selectedChart: string)
  {
    selectedChartNameHashMap.set(tokenId.toString() + subMarketOwnerAddress + subMarketIndex.toString(), selectedChart)
    chartReRenderKey.value++
  }

  function setChartData()
  {
    const newDate = new Date()
    const currentYear = newDate.getFullYear()
    const currentMonth = newDate.getMonth() + 1
    var tempHashMap = new Map<string, any>()

    const isTreasuryAddress = searchAddress.value == adminAccounts.singlePayerTreasuryAddress.toString() ||
      searchAddress.value == adminAccounts.hodlTreasuryAddress.toString() ||
      searchAddress.value == adminAccounts.solvencyTreasuryAddress.toString()

    function processStatementList(statementList: any, availableYearsHashMap: any)
    {
      if(statementList.value)
        for(var i=0; i<statementList.value.length; i++)
        {
          const tokenId = statementList.value[i].tokenId
          const subMarketOwnerAddress = statementList.value[i].subMarketOwnerAddress
          const subMarketIndex = statementList.value[i].subMarketIndex

          var lastKnownActionType = 0
          var lastKnownActionAmount = 0
          var lastKnownActionTimeStamp = 0
          var previousBalance = 0
          var previousDebt = 0

          const userAvailableYearsByTokenMintAddressList = availableYearsHashMap.map.get(tokenId.toString() +
          subMarketOwnerAddress +
          subMarketIndex.toString() +
          searchAddress.value +
          accountSelect.value.toString())

          if(!userAvailableYearsByTokenMintAddressList || userAvailableYearsByTokenMintAddressList.length === 0)
            continue

          var allLabels: string[] = []
          var allFeesGenerated = []
          var allBalances = []
          var allEarnedInterests = []
          var allDebts = []
          var allAccruedInterests = []
          var allDeposits = []
          var allWithdrawals = []
          var allBorrows = []
          var allRepays = []
          var allLiquidator = []
          var allLiquidated = []
          var allCollectedLiquidationFees = []
          var allCollectedSubMarketFees = []
          var allCollectedSolvencyFees = []

          var allChartData = cloneDeep(baseChartData)
          
          //Track the first index where actual user data appears
          var firstValidDataIndex = -1 

          for(var year=userAvailableYearsByTokenMintAddressList[0].yearAvailable; year<=currentYear; year++)
          {
            var labels = []
            var feesGenerated = []
            var balances = []
            var earnedInterests = []
            var debts = []
            var accruedInterests = []
            var deposits = []
            var withdrawals = []
            var borrows = []
            var repays = []
            var liquidator = []
            var liquidated = []
            var collectedLiquidationFees = []
            var collectedSubMarketFees = []
            var collectedSolvencyFees = []

            var yearlyChartData = cloneDeep(baseChartData)
            
            //If current year, go up until the current month, otherwise cover the whole year
            const maxMonth = (year == currentYear) ? currentMonth : 12

            for(var month=1; month<=maxMonth; month++)
            {
              const monthName = monthList[month-1].monthName
              labels.push(monthName)
              allLabels.push(monthName + ' ' + year.toString())

              const userMonthlyStatement = lendingUserMonthlyStatementsHashMap.map.get(month.toString() +
              year.toString() +
              tokenId.toString() +
              subMarketOwnerAddress +
              subMarketIndex.toString() +
              searchAddress.value +
              accountSelect.value.toString())

              if(userMonthlyStatement)
              {
                //If this is the first statement we've found, record its index in the "All" array
                if(firstValidDataIndex === -1)
                  firstValidDataIndex = allLabels.length - 1

                const decimalAmount = tokenDecimalHashMap.get(tokenId)
                const divisor = Math.pow(10, decimalAmount)

                lastKnownActionType = userMonthlyStatement.lastLendingActivityType
                lastKnownActionAmount = Number(userMonthlyStatement.lastLendingActivityAmount) / divisor
                lastKnownActionTimeStamp = Number(userMonthlyStatement.lastLendingActivityTimeStamp)
                previousBalance = Number(userMonthlyStatement.snapShotBalanceAmount) / divisor
                previousDebt = Number(userMonthlyStatement.snapShotDebtAmount) / divisor
              
                if(lastKnownActionTimeStamp != 0)
                {
                  allChartData.lastActionType = lastKnownActionType
                  allChartData.lastActionAmount = lastKnownActionAmount
                  allChartData.lastActionTimeStamp = lastKnownActionTimeStamp

                  yearlyChartData.lastActionType = lastKnownActionType
                  yearlyChartData.lastActionAmount = lastKnownActionAmount
                  yearlyChartData.lastActionTimeStamp = lastKnownActionTimeStamp
                }

                allFeesGenerated.push(Number(userMonthlyStatement.feesGeneratedAmount) / divisor)
                allBalances.push(previousBalance)
                allDebts.push(previousDebt)
                allEarnedInterests.push(Number(userMonthlyStatement.monthlyInterestEarnedAmount) / divisor)
                allAccruedInterests.push(Number(userMonthlyStatement.monthlyInterestAccruedAmount) / divisor)
                allDeposits.push(Number(userMonthlyStatement.monthlyDepositedAmount) / divisor)
                allWithdrawals.push(Number(userMonthlyStatement.monthlyWithdrawalAmount) / divisor)
                allBorrows.push(Number(userMonthlyStatement.monthlyBorrowedAmount) / divisor)
                allRepays.push(Number(userMonthlyStatement.monthlyRepaidDebtAmount) / divisor)
                allLiquidator.push(Number(userMonthlyStatement.monthlyLiquidatorAmount) / divisor)
                allLiquidated.push(Number(userMonthlyStatement.monthlyLiquidatedAmount) / divisor)
                allCollectedLiquidationFees.push(Number(userMonthlyStatement.monthlyLiquidationFeesCollectedAmount) / divisor)
                allCollectedSubMarketFees.push(Number(userMonthlyStatement.monthlySubMarketFeesCollectedAmount) / divisor)
                allCollectedSolvencyFees.push(Number(userMonthlyStatement.monthlySolvencyInsuranceFeesCollectedAmount) / divisor)

                feesGenerated.push(Number(userMonthlyStatement.feesGeneratedAmount) / divisor)
                balances.push(previousBalance)
                debts.push(previousDebt)
                earnedInterests.push(Number(userMonthlyStatement.monthlyInterestEarnedAmount) / divisor)
                accruedInterests.push(Number(userMonthlyStatement.monthlyInterestAccruedAmount) / divisor)
                deposits.push(Number(userMonthlyStatement.monthlyDepositedAmount) / divisor)
                withdrawals.push(Number(userMonthlyStatement.monthlyWithdrawalAmount) / divisor)
                borrows.push(Number(userMonthlyStatement.monthlyBorrowedAmount) / divisor)
                repays.push(Number(userMonthlyStatement.monthlyRepaidDebtAmount) / divisor)
                liquidator.push(Number(userMonthlyStatement.monthlyLiquidatorAmount) / divisor)
                liquidated.push(Number(userMonthlyStatement.monthlyLiquidatedAmount) / divisor)
                collectedLiquidationFees.push(Number(userMonthlyStatement.monthlyLiquidationFeesCollectedAmount) / divisor)
                collectedSubMarketFees.push(Number(userMonthlyStatement.monthlySubMarketFeesCollectedAmount) / divisor)
                collectedSolvencyFees.push(Number(userMonthlyStatement.monthlySolvencyInsuranceFeesCollectedAmount) / divisor)
              }
              else
              {
                if(lastKnownActionTimeStamp != 0)
                {
                  allChartData.lastActionType = lastKnownActionType
                  allChartData.lastActionAmount = lastKnownActionAmount
                  allChartData.lastActionTimeStamp = lastKnownActionTimeStamp

                  yearlyChartData.lastActionType = lastKnownActionType
                  yearlyChartData.lastActionAmount = lastKnownActionAmount
                  yearlyChartData.lastActionTimeStamp = lastKnownActionTimeStamp
                }

                allFeesGenerated.push(0)
                allBalances.push(previousBalance)
                allDebts.push(previousDebt)
                allEarnedInterests.push(0)
                allAccruedInterests.push(0)
                allDeposits.push(0)
                allWithdrawals.push(0)
                allBorrows.push(0)
                allRepays.push(0)
                allLiquidator.push(0)
                allLiquidated.push(0)
                allCollectedLiquidationFees.push(0)
                allCollectedSubMarketFees.push(0)
                allCollectedSolvencyFees.push(0)

                feesGenerated.push(0)
                balances.push(previousBalance)
                debts.push(previousDebt)
                earnedInterests.push(0)
                accruedInterests.push(0)
                deposits.push(0)
                withdrawals.push(0)
                borrows.push(0)
                repays.push(0)
                liquidator.push(0)
                liquidated.push(0)
                collectedLiquidationFees.push(0)
                collectedSubMarketFees.push(0)
                collectedSolvencyFees.push(0)
              }
            }

            yearlyChartData.labels = labels
            yearlyChartData.datasets[ChartIndex.FeesGenerated].data = feesGenerated
            yearlyChartData.datasets[ChartIndex.Balances].data = balances
            yearlyChartData.datasets[ChartIndex.InterestEarned].data = earnedInterests
            yearlyChartData.datasets[ChartIndex.Debts].data = debts
            yearlyChartData.datasets[ChartIndex.InterestAccrued].data = accruedInterests
            yearlyChartData.datasets[ChartIndex.Deposits].data = deposits
            yearlyChartData.datasets[ChartIndex.Withdrawals].data = withdrawals
            yearlyChartData.datasets[ChartIndex.Borrows].data = borrows
            yearlyChartData.datasets[ChartIndex.Repays].data = repays
            yearlyChartData.datasets[ChartIndex.Liquidator].data = liquidator
            yearlyChartData.datasets[ChartIndex.Liquidated].data = liquidated
            yearlyChartData.datasets[ChartIndex.CollectedLiquidationFees].data = collectedLiquidationFees 
            yearlyChartData.datasets[ChartIndex.CollectedSubMarketFees].data = collectedSubMarketFees
            yearlyChartData.datasets[ChartIndex.CollectedSolvencyFees].data = collectedSolvencyFees
            
            if(!isTreasuryAddress)
            {
              yearlyChartData.datasets[ChartIndex.CollectedLiquidationFees].hidden = true
              yearlyChartData.datasets[ChartIndex.CollectedSubMarketFees].hidden = true
              yearlyChartData.datasets[ChartIndex.CollectedSolvencyFees].hidden = true
            }

            tempHashMap.set(tokenId.toString() + subMarketOwnerAddress + subMarketIndex.toString() + year.toString(), yearlyChartData)
          }

          //Slice the "All" arrays to start 1 month before the first valid entry
          if(firstValidDataIndex !== -1)
          {
            //Math.max ensures we don't try to use a negative index if their first statement is the very first month
            const startIndex = Math.max(0, firstValidDataIndex - 1)
            
            allLabels = allLabels.slice(startIndex)
            allFeesGenerated = allFeesGenerated.slice(startIndex)
            allBalances = allBalances.slice(startIndex)
            allEarnedInterests = allEarnedInterests.slice(startIndex)
            allDebts = allDebts.slice(startIndex)
            allAccruedInterests = allAccruedInterests.slice(startIndex)
            allDeposits = allDeposits.slice(startIndex)
            allWithdrawals = allWithdrawals.slice(startIndex)
            allBorrows = allBorrows.slice(startIndex)
            allRepays = allRepays.slice(startIndex)
            allLiquidator = allLiquidator.slice(startIndex)
            allLiquidated = allLiquidated.slice(startIndex)
            allCollectedLiquidationFees = allCollectedLiquidationFees.slice(startIndex)
            allCollectedSubMarketFees = allCollectedSubMarketFees.slice(startIndex)
            allCollectedSolvencyFees = allCollectedSolvencyFees.slice(startIndex)
          }

          allChartData.labels = allLabels
          allChartData.datasets[ChartIndex.FeesGenerated].data = allFeesGenerated
          allChartData.datasets[ChartIndex.Balances].data = allBalances
          allChartData.datasets[ChartIndex.InterestEarned].data = allEarnedInterests
          allChartData.datasets[ChartIndex.Debts].data = allDebts
          allChartData.datasets[ChartIndex.InterestAccrued].data = allAccruedInterests
          allChartData.datasets[ChartIndex.Deposits].data = allDeposits
          allChartData.datasets[ChartIndex.Withdrawals].data = allWithdrawals
          allChartData.datasets[ChartIndex.Borrows].data = allBorrows
          allChartData.datasets[ChartIndex.Repays].data = allRepays
          allChartData.datasets[ChartIndex.Liquidator].data = allLiquidator
          allChartData.datasets[ChartIndex.Liquidated].data = allLiquidated
          allChartData.datasets[ChartIndex.CollectedLiquidationFees].data = allCollectedLiquidationFees 
          allChartData.datasets[ChartIndex.CollectedSubMarketFees].data = allCollectedSubMarketFees
          allChartData.datasets[ChartIndex.CollectedSolvencyFees].data = allCollectedSolvencyFees
          
          if(!isTreasuryAddress)
          {
            allChartData.datasets[ChartIndex.CollectedLiquidationFees].hidden = true
            allChartData.datasets[ChartIndex.CollectedSubMarketFees].hidden = true
            allChartData.datasets[ChartIndex.CollectedSolvencyFees].hidden = true
          }

          tempHashMap.set(tokenId.toString() + subMarketOwnerAddress + subMarketIndex.toString() + "All", allChartData)
        }
    }

    //Process Stable Coin Yearly Chart Data
    processStatementList(userMonthlyStatementStableCoinList, lendingUserAvailableStableCoinYearsBySubMarketHashMap)

    //Process Crypto Currency Yearly Chart Data
    processStatementList(userMonthlyStatementCryptoCurrencyList, lendingUserAvailableCryptoCurrencyYearsBySubMarketHashMap)

    selectedChartDataHashMap = tempHashMap
  }

  function getChartData(tokenId: number, subMarketOwnerAddress: string, subMarketIndex: number)
  {
    return selectedChartDataHashMap.get(tokenId.toString() + subMarketOwnerAddress + subMarketIndex.toString() + selectedChartNameHashMap.get(tokenId.toString()  + subMarketOwnerAddress + subMarketIndex.toString()))
  }

  function getSelectedChartName(tokenId: number, subMarketOwnerAddress: string, subMarketIndex: number)
  {
    return selectedChartNameHashMap.get(tokenId.toString() + subMarketOwnerAddress + subMarketIndex.toString())
  }

  function startGradientAnimation()
  {
    stopGradientAnimation()

    intervalId = setInterval(() =>
    {
      //Increment the offset slightly.
      gradientOffset.value += 0.07
      
      //Ensure the offset wraps around (e.g., from 1.0 back to 0.0)
      if(gradientOffset.value >= 1)
        gradientOffset.value = 0

    }, 55)
  }

  function stopGradientAnimation()
  {
    if(intervalId != undefined)
    {
      clearInterval(intervalId)
      intervalId = undefined
    }
  }

  function checkNewAddress(accountSelected = 0)
  {
    if(addressToCheck.value == searchAddress.value)
      return

    searchAddress.value = addressToCheck.value
    setTimeout(()=>
    {
      window.history.pushState({}, '', "/M4A/Markets-Portfolios-" + addressToCheck.value + '-' + accountSelected)
    }, 100)
    displayName.value = getUserDisplayName(searchAddress.value)
    possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(searchAddress.value)

    if(lendingUserMonthlyStatementsHashMap.map)
    {
      userMonthlyStatementStableCoinList.value = lendingUserAvailableStableCoinStatementsBySubMarketsHashMap.map.get(searchAddress.value + accountSelected.toString())
      userStableCoinInterestHelper = cloneDeep(userMonthlyStatementStableCoinList.value)
      userMonthlyStatementCryptoCurrencyList.value = lendingUserAvailableCryptoCurrencyStatementsBySubMarketsHashMap.map.get(searchAddress.value + accountSelected.toString())
      userCryptoCurrencyInterestHelper = cloneDeep(userMonthlyStatementCryptoCurrencyList.value)
      accountSelect.value = accountSelected

      if(searchAddress.value == connectedWallet.addressString)
      {
        connectedWallet.selectedLendingUserAccountIndex = accountSelected
        localStorage.setItem("selectedLendingAccountIndex" + connectedWallet.addressString, accountSelected.toString())
      }

      resetSelectedChartNameHashMap(userMonthlyStatementStableCoinList.value)
      resetSelectedChartNameHashMap(userMonthlyStatementCryptoCurrencyList.value)
      setLendingUserAccountList()
      checkForLendingUserAssets()
      setChartData()
    }
  }

  function updateStoredSelectedAccount()
  {
    if(addressToCheck.value == connectedWallet.addressString)
    {
      connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
      localStorage.setItem("selectedLendingAccountIndex" + connectedWallet.addressString, accountSelect.value.toString())
    }

    setTimeout(()=>
    {
      window.history.pushState({}, '', "/M4A/Markets-Portfolios-" + addressToCheck.value + '-' + accountSelect.value)
    }, 100)

    stableCoin7DayProjectionRateValueUnRounded.value = 0
    stableCoin7DayProjectionRateAmount.value = "0"
    stableCoin7DayProjectionRateValue.value = 0
    stableCoinLifeTimeInterestEarnedValueUnRounded.value = 0
    stableCoinLifeTimeInterestEarnedAmount.value = "0"
    stableCoinLifeTimeInterestEarnedValue.value = 0
    
    crypto7DayProjectionRateValueUnRounded.value = 0
    crypto7DayProjectionRateAmount.value = "0"
    crypto7DayProjectionRateValue.value = 0
    cryptoLifeTimeInterestEarnedValueUnRounded.value = 0
    cryptoLifeTimeInterestEarnedAmount.value = "0"
    cryptoLifeTimeInterestEarnedValue.value = 0
    
    userMonthlyStatementStableCoinList.value = lendingUserAvailableStableCoinStatementsBySubMarketsHashMap.map.get(searchAddress.value + accountSelect.value.toString())
    userStableCoinInterestHelper = cloneDeep(userMonthlyStatementStableCoinList.value)
    userMonthlyStatementCryptoCurrencyList.value = lendingUserAvailableCryptoCurrencyStatementsBySubMarketsHashMap.map.get(searchAddress.value + accountSelect.value.toString())
    userCryptoCurrencyInterestHelper = cloneDeep(userMonthlyStatementCryptoCurrencyList.value)

    resetSelectedChartNameHashMap(userMonthlyStatementStableCoinList.value)
    resetSelectedChartNameHashMap(userMonthlyStatementCryptoCurrencyList.value)
    checkForLendingUserAssets()
    setChartData()
  }

  function setLendingUserAccountList()
  {
    if(lendingUserAccountsHashMap.map)
    {
      const userAccountList = lendingUserAccountsHashMap.map.get(searchAddress.value)
      if(userAccountList)
      {
        accountList.value = userAccountList
        hasAtleast1Account.value = true
      }
      else
      {
        hasAtleast1Account.value = false
      }
    }
  }

  function viewPortfolio(owner: string, accountIndex: number)
  {
    addressToCheck.value = owner
    searchAddress.value = undefined
    accountSelect.value = accountIndex
    setLendingUserAccountList()
    checkForLendingUserAssets()
    setIsBrowsingAllLendingUsers(false)
    checkNewAddress(accountIndex)
    isValidPublicKey.value = isValidSolanaPublicKey(owner)

    stableCoin7DayProjectionRateAmount.value = "0"
    stableCoin7DayProjectionRateValue.value = 0
    stableCoinLifeTimeInterestEarnedAmount.value = "0"
    stableCoinLifeTimeInterestEarnedValue.value = 0

    crypto7DayProjectionRateAmount.value = "0"
    crypto7DayProjectionRateValue.value = 0
    cryptoLifeTimeInterestEarnedAmount.value = "0"
    cryptoLifeTimeInterestEarnedValue.value = 0

    document.getElementById("portfolioHeader")?.scrollIntoView()
  }

  function emitOpenLiquidationModal(accountOwner: string, accountIndex: number)
  {
    emits('openLiquidationModal', accountOwner, accountIndex)
  }

  function setIsBrowsingAllLendingUsers(flag: boolean)
  {
    isBrowsingAllUsers.value = flag

    emits('isBrowsingUsers', isBrowsingAllUsers.value)

    if(!isBrowsingAllUsers.value)
      setTimeout(()=>
      {
        window.history.pushState({}, '', "/M4A/Markets-Portfolios-" + addressToCheck.value + '-' + accountSelect.value)
      }, 100)

    localStorage.setItem("isBrowsingAllLendingUsers", flag.toString())
    if(flag)
      window.history.pushState({}, '', "/M4A/Markets-LendingLeaderBoard")
    else
      window.history.pushState({}, '', "/M4A/Markets-Portfolios")
  }

  function checkForLendingUserAssets()
  {
    if(!lendingUserTabAccountListHashMap.map)
      return

    //Check for any assets to allow borrowing
    var assetAmount = false
    const userTabAccounts = lendingUserTabAccountListHashMap.map.get(addressToCheck.value + accountSelect.value)
    
    if(userTabAccounts)
      for(var i=0; i<userTabAccounts.length; i++)
      {
        const depositedAmount = Number(userTabAccounts[i].depositedAmount)
        if(depositedAmount != 0)
        {
          assetAmount = true
          break
        }
      }

    hasDeposits.value = assetAmount
  }

  function updateStableCoinRealTimeValues(userTabIndex: number,
  sevenDayCalculatedUserInterestEarned: number,
  sevenDayInterestEarnedValue: number,
  calculatedUserInterestEarned: number,
  interestEarnedValue: number)
  {
    userStableCoinInterestHelper[userTabIndex].sevenDayCalculatedUserInterestEarned = sevenDayCalculatedUserInterestEarned
    userStableCoinInterestHelper[userTabIndex].sevenDayInterestEarnedValue = sevenDayInterestEarnedValue
    userStableCoinInterestHelper[userTabIndex].calculatedUserInterestEarned = calculatedUserInterestEarned
    userStableCoinInterestHelper[userTabIndex].interestEarnedValue = interestEarnedValue

    var highestTokenDecimalAmount = 0
    var sevenDayCalculatedUserInterestEarned = 0
    var sevenDayInterestEarnedValue = 0
    var calculatedUserInterestEarned = 0
    var interestEarnedValue = 0

    for(var i=0; i<userStableCoinInterestHelper.length; i++)
    {
      const decimalAmount = tokenDecimalHashMap.get(userStableCoinInterestHelper[i].tokenId)
      if(decimalAmount>highestTokenDecimalAmount)
        highestTokenDecimalAmount = decimalAmount

      sevenDayCalculatedUserInterestEarned += userStableCoinInterestHelper[i].sevenDayCalculatedUserInterestEarned
      sevenDayInterestEarnedValue += userStableCoinInterestHelper[i].sevenDayInterestEarnedValue
      calculatedUserInterestEarned += userStableCoinInterestHelper[i].calculatedUserInterestEarned
      interestEarnedValue += userStableCoinInterestHelper[i].interestEarnedValue
    }

    stableCoin7DayProjectionRateAmount.value = sevenDayCalculatedUserInterestEarned.toLocaleString('en-US', {
          minimumFractionDigits: highestTokenDecimalAmount,
          maximumFractionDigits: highestTokenDecimalAmount })
    var flooredValue = Math.floor(sevenDayInterestEarnedValue * 100) / 100
    stableCoin7DayProjectionRateValue.value = flooredValue
    stableCoin7DayProjectionRateValueUnRounded.value = sevenDayInterestEarnedValue
    stableCoinLifeTimeInterestEarnedAmount.value = calculatedUserInterestEarned.toLocaleString('en-US', {
          minimumFractionDigits: highestTokenDecimalAmount,
          maximumFractionDigits: highestTokenDecimalAmount })
    flooredValue = Math.floor(interestEarnedValue * 100) / 100
    stableCoinLifeTimeInterestEarnedValue.value = flooredValue
    stableCoinLifeTimeInterestEarnedValueUnRounded.value = interestEarnedValue
  }

  function updateCryptoRealTimeValues(userTabIndex: number,
  sevenDayCalculatedUserInterestEarned: number,
  sevenDayInterestEarnedValue: number,
  calculatedUserInterestEarned: number,
  interestEarnedValue: number)
  {
    userCryptoCurrencyInterestHelper[userTabIndex].sevenDayCalculatedUserInterestEarned = sevenDayCalculatedUserInterestEarned
    userCryptoCurrencyInterestHelper[userTabIndex].sevenDayInterestEarnedValue = sevenDayInterestEarnedValue
    userCryptoCurrencyInterestHelper[userTabIndex].calculatedUserInterestEarned = calculatedUserInterestEarned
    userCryptoCurrencyInterestHelper[userTabIndex].interestEarnedValue = interestEarnedValue

    var highestTokenDecimalAmount = 0
    var sevenDayCalculatedUserInterestEarned = 0
    var sevenDayInterestEarnedValue = 0
    var calculatedUserInterestEarned = 0
    var interestEarnedValue = 0

    for(var i=0; i<userCryptoCurrencyInterestHelper.length; i++)
    {
      const decimalAmount = tokenDecimalHashMap.get(userCryptoCurrencyInterestHelper[i].tokenId)
      if(decimalAmount>highestTokenDecimalAmount)
        highestTokenDecimalAmount = decimalAmount

      sevenDayCalculatedUserInterestEarned += userCryptoCurrencyInterestHelper[i].sevenDayCalculatedUserInterestEarned
      sevenDayInterestEarnedValue += userCryptoCurrencyInterestHelper[i].sevenDayInterestEarnedValue
      calculatedUserInterestEarned += userCryptoCurrencyInterestHelper[i].calculatedUserInterestEarned
      interestEarnedValue += userCryptoCurrencyInterestHelper[i].interestEarnedValue
    }

    crypto7DayProjectionRateAmount.value = sevenDayCalculatedUserInterestEarned.toLocaleString('en-US', {
          minimumFractionDigits: highestTokenDecimalAmount,
          maximumFractionDigits: highestTokenDecimalAmount })
    var flooredValue = Math.floor(sevenDayInterestEarnedValue * 100) / 100
    crypto7DayProjectionRateValue.value = flooredValue
    crypto7DayProjectionRateValueUnRounded.value = sevenDayInterestEarnedValue
    cryptoLifeTimeInterestEarnedAmount.value = calculatedUserInterestEarned.toLocaleString('en-US', {
          minimumFractionDigits: highestTokenDecimalAmount,
          maximumFractionDigits: highestTokenDecimalAmount })
    flooredValue = Math.floor(interestEarnedValue * 100) / 100
    cryptoLifeTimeInterestEarnedValue.value = flooredValue
    cryptoLifeTimeInterestEarnedValueUnRounded.value = interestEarnedValue
  }

  /*async function editLendingUserAccountName()
  {
    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.editLendingUserAccountName
      (
        accountSelect.value,
        accountName.value
      ).accounts({ signer: connectedWallet.publicKey }).rpc()

      await confirmLendingTransaction(tx, toast, "edit_lending_user_account_name")
      editingAccountName.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "edit_lending_user_account_name")
    }
  }*/

 async function refreshUser()
 {
    try
    {
      const remainingTabAccounts = lendingUserRemainingTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString())
      var instructionsToSend = []
      var lookUpTableAccounts = []
      var refreshingUserRemainingAccounts = []
      
      //Get Lending Protocol Look Up Table Account
      lookUpTableAccounts.push(anchorPrograms.lendingProtocolLookUpTableAccount)

      //Get Lending User Look Up Table Account
      lookUpTableAccounts.push(connectedWallet.lendingUserLookUpTableAccount)
    
      const [uniqueTokenIds, createMonthlyStatementInstructions, lendingTabSubMarketAndMonthlyStatementRemainingAccounts, subMarketOwnerArray] =
      await getNeccessaryRefreshInstructionData(remainingTabAccounts, connectedWallet.publicKey, accountSelect.value)

      const uniqueTokenReserveRemainingAccounts = getTokenReserveRemainingAccounts(uniqueTokenIds)
      const tempPriceRemainingAccount = getTempRemainingPriceAccount()
      const lendingStatsPDA = getLendingStatsPDA()
      const lendingStatsRemainingAccount = 
      {
        pubkey: lendingStatsPDA,
        isSigner: false,
        isWritable: true
      }

      refreshingUserRemainingAccounts.push(tempPriceRemainingAccount)
      refreshingUserRemainingAccounts.push(...uniqueTokenReserveRemainingAccounts)
      refreshingUserRemainingAccounts.push(...lendingTabSubMarketAndMonthlyStatementRemainingAccounts)
      refreshingUserRemainingAccounts.push(adminAccounts.priceOracleRemainingAccount)
      refreshingUserRemainingAccounts.push(lendingStatsRemainingAccount)

      const refreshUserHealthAndTokenReservesInstruction = await anchorPrograms.lending.lendingProgram.methods.refreshUserHealthChunkAndTokenReserves(accountSelect.value,
        uniqueTokenReserveRemainingAccounts.length,
        lendingTabSubMarketAndMonthlyStatementRemainingAccounts.length / 3,
        true
      )
      .accounts({ lendingUserOwner: connectedWallet.publicKey })
      .remainingAccounts(refreshingUserRemainingAccounts)
      .instruction()

      instructionsToSend.push(...createMonthlyStatementInstructions)
      instructionsToSend.push(refreshUserHealthAndTokenReservesInstruction)

      const signedTransactions = await userSignsLendingTransactions(instructionsToSend, lookUpTableAccounts)

      for(var i=0; i<signedTransactions.length; i++)
      {
        const size = signedTransactions[i].serialize().length
        console.log(`Signed Transaction Size: ${size} bytes`)
      }

      await bundleProtocolPriceTransactions([...uniqueTokenIds], signedTransactions)

      var userTxs = []
  
      for(var i=0; i<signedTransactions.length; i++)
        userTxs.push(bs58.default.encode(signedTransactions[i].signatures[0]))

      if(userTxs.length)
        for(var i=0; i<userTxs.length; i++)
          await confirmLendingTransaction(userTxs[i], toast, "refresh_user_health_chunk")
      else
        await confirmLendingTransaction(userTxs, toast, "refresh_user_health_chunk")
       }
    catch(error: any)
    {
      var errorMessage = parseProgramErrorCode(error, anchorPrograms.lending.lendingProgram)
      toastPreTransactionError(errorMessage, toast, "refresh_user_health_chunk")
    }
 }
</script>

<style scoped>
  ion-button
  {
    --padding-start: 10px;
    --padding-end: 10px;
    border-radius: 4px;
   
    border: thin solid var(--ion-color-dark);
  }

  h2
  {
    font-size: min(6vw, 30px)
  }

  h3
  {
    font-size: min(5vw, 27px)
  }

  h4
  {
    font-size: min(4.5vw, 26px)
  }

  h5
  {
    font-size: min(4vw, 25px)
  }

  .custom-chart-legend
  {
    display: flex;
    justify-content: center;
    gap: 20px
  }

  .accountSelect
  {
    height: 38px; 
    width: min(270px, 80vw);
    max-width: 270px;
    padding-left: 15px;
    align-self: center
  }

  .legend-item
  {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px
  }

  .swatch
  {
    width: 27px; /* Standard swatch width */
    height: 12px; /* Standard swatch height */
    margin-right: 8px;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center
  }

  .rainbowGradient
  {
    background: linear-gradient(to right, #14ffe9 0%, #ffc800 25%, #ff00e0 50%, #14ffe9 100%);
    background-size: 150% auto
  }

  .animatedRainbow
  {
    background: repeating-linear-gradient(90deg, #14ffe9 0%, #ffc800 16%, #ff00e0 33%, #14ffe9 50.0%);
    background-size: 150% auto;
    animation: rainbowAnimation 1.8s linear infinite
  }

  @keyframes rainbowAnimation
  {
    to
    {
      background-position: 150% center
    }
  }

  .hiddenLabel
  {
    text-decoration: line-through
  }

  ion-input
  {
    --highlight-color: var(--ion-color-green)
  }

  @media screen and (min-width: 1311.1px)
  { 
    .displayLongName
    {
      display: block
    }
    .displayShortName
    {
      display: none
    }
  }
  @media screen and (max-width: 1311px) 
  { 
    .displayLongName
    {
      display: none
    }
    .displayShortName
    {
      display: block
    }
  }

  @media screen and (min-width: 1111.1px)
  { 
    .topHHeaderDisplay
    {
      display: flex;
      flex-direction: column;
    }
    .hHeaderDisplay
    {
      display: flex;
      justify-content: space-around;
    }

    .topVHeaderDisplay
    {
      display: none
    }
    .vHeaderDisplay
    {
      display: none
    }
  }
  @media screen and (max-width: 1111px)
  { 
    .topHHeaderDisplay
    {
      display: none
    }
    .hHeaderDisplay
    {
      display: none
    }
    .vHeaderDisplay
    {
      display: flex;
      flex-direction: column
    }
  }
</style>