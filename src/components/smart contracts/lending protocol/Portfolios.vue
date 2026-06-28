<template>
  <div v-if="isBrowsingAllUsers">
    <ion-button fill="clear" class="thinBorder" style="border-radius: 4px; margin-bottom: -2px" @click="setIsBrowsingAllLendingUsers(false)">
      <ion-label color="green">Return</ion-label>
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
      color="green"
      >
        Check New Address
      </ion-button>

      <ion-button color="green" @click="setIsBrowsingAllLendingUsers(true)">
        Browse All Users
      </ion-button>
    </div>
  </div>
 
  <div v-if="(userTabStableCoinSubMarketList?.length > 0 || userTabCryptoCurrencySubMarketList?.length > 0) && !isBrowsingAllUsers" class="thickBorder smallMarginTop">
    <div class="topHHeaderDisplay thinBorderBottom">
  
      <div class="flexCenterRow" style="justify-content:space-around !important">
        <div>
          <h2 class="underLine yellow">7 Day Projection Rate</h2>
          <h3 class="nMediumMarginTop">Value: $<span class="rainbowText">{{ (stableCoin7DayProjectionRateValue + crypto7DayProjectionRateValue).toFixed(2) }}</span> A Week</h3>
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

        <div>
          <h2 class="underLine yellow">Life Time Interest Earned</h2>
          <h3 class="nMediumMarginTop">Value: $<span class="rainbowText">{{ (stableCoinLifeTimeInterestEarnedValue + cryptoLifeTimeInterestEarnedValue).toFixed(2) }}</span></h3>
        </div>
      </div>

      <HealthFactorBig :accountOwnerAddress="addressToCheck" :accountIndex="accountSelect"/>
    </div>

    <div class="topVHeaderDisplay thinBorderBottom" style="justify-content:space-around !important">
      <Select
      v-if="!editingAccountName"
      class="accountSelect mediumMarginTop"
      v-model="accountSelect" 
      :options="accountList" 
      optionLabel="accountName" 
      optionValue="userAccountIndex" 
      placeholder="Select Account"
      appendTo="self"
      @change="updateStoredSelectedAccount()">
      </Select>

      <div>
        <h2 class="underLine yellow">7 Day Projection Rate</h2>
        <h3 class="nMediumMarginTop">Value: $<span class="rainbowText">{{ (stableCoin7DayProjectionRateValue + crypto7DayProjectionRateValue).toFixed(2) }}</span> A Week</h3>
      </div>

      <div>
        <h2 class="underLine nSmallMarginTop yellow">Life Time Interest Earned</h2>
        <h3 class="nMediumMarginTop">Value: $<span class="rainbowText">{{ (stableCoinLifeTimeInterestEarnedValue + cryptoLifeTimeInterestEarnedValue).toFixed(2) }}</span></h3>
      </div>   

      <div class="nTinyMarginTop">
        <HealthFactorBig :accountOwnerAddress="addressToCheck" :accountIndex="accountSelect"/>
      </div>
    </div>

    <!--Stable Coin Charts-->
    <div v-if="userTabStableCoinSubMarketList?.length > 0" class="smallMarginTop nLargeMarginBottom hHeaderDisplay">
      <div>
        <h4 class="underLine green" style="line-height: 27px">Stable Coin<br>7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">{{ stableCoin7DayProjectionRateValue.toFixed(2) }}</span> A Week</h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ stableCoin7DayProjectionRateAmount }}</span> A Week</h5>
      </div>

      <div>
        <h4 class="underLine green" style="line-height: 27px">Stable Coin<br>Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">{{ stableCoinLifeTimeInterestEarnedValue.toFixed(2) }}</span></h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ stableCoinLifeTimeInterestEarnedAmount }}</span></h5>
      </div>  
    </div>

    <div v-if="userTabStableCoinSubMarketList?.length > 0" class="smallMarginTop vHeaderDisplay">
      <div>
        <h4 class="underLine green" style="line-height: 27px">Stable Coin<br>7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">{{ stableCoin7DayProjectionRateValue.toFixed(2) }}</span> A Week</h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ stableCoin7DayProjectionRateAmount }}</span> A Week</h5>
      </div>

      <div class="nMediumMarginTop">
        <h4 class="underLine green" style="line-height: 27px">Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">{{ stableCoinLifeTimeInterestEarnedValue.toFixed(2) }}</span></h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ stableCoinLifeTimeInterestEarnedAmount }}</span></h5>
      </div>
    </div>

    <div v-if="userTabStableCoinSubMarketList?.length > 0" class="nMediumMarginTop mediumSmallMarginBottom">
      <div v-for="(subMarketTab, userTabIndex) in userTabStableCoinSubMarketList">
        <PortfolioChart
        :key="chartReRenderKey"
        :isStableCoin="true"
        :depositedAssetAmount="depositedAssetAmount"
        :tokenId="subMarketTab.tokenId"
        :subMarketOwnerAddress="subMarketTab.subMarketOwnerAddress"
        :subMarketOwnerAddressTrimmed="subMarketTab.subMarketOwnerAddressTrimmed"
        :subMarketIndex="subMarketTab.subMarketIndex"
        :ownerAddress="searchAddress"
        :accountIndex="accountSelect"
        :subMarketFee="subMarketTab.subMarketFee"
        :userTabIndex="userTabIndex"
        :chartData="getChartData(subMarketTab.tokenId, subMarketTab.subMarketOwnerAddress, subMarketTab.subMarketIndex)"
        :selectedYear="getSelectedYearForOnMounted(subMarketTab.tokenId, subMarketTab.subMarketOwnerAddress, subMarketTab.subMarketIndex)"
        @changeYear="updateSelectedYearForTokenMintAddressHashMap"
        @openDepositModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openDepositModal', tokenId, tokenMintAddress, subMarketOption)"
        @openWithdrawalModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openWithdrawalModal', tokenId, tokenMintAddress, subMarketOption)"
        @openBorrowModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openBorrowModal', tokenId, tokenMintAddress, subMarketOption)"
        @openRepayModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openRepayModal', tokenId, tokenMintAddress, subMarketOption)"
        @interestEarned="updateStableCoinRealTimeValues"/>
      </div>
    </div>

    <!--Crypto Charts-->
    <div v-if="userTabCryptoCurrencySubMarketList?.length > 0" class="smallMarginTop nLargeMarginBottom hHeaderDisplay" :class="userTabStableCoinSubMarketList?.length > 0 ? 'thinBorderTop' : ''"
      :style="{paddingTop: userTabStableCoinSubMarketList?.length > 0 ? '14px' : '0px'}">
      <div>
        <h4 class="underLine green" style="line-height: 27px">Crypto Currency<br>7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">{{ crypto7DayProjectionRateValue.toFixed(2) }}</span> A Week</h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ crypto7DayProjectionRateAmount }}</span> A Week</h5>
      </div>

      <div>
        <h4 class="underLine green" style="line-height: 27px">Crypto Currency<br>Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">{{ cryptoLifeTimeInterestEarnedValue.toFixed(2) }}</span></h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ cryptoLifeTimeInterestEarnedAmount }}</span></h5>
      </div>
    </div>

    <div v-if="userTabCryptoCurrencySubMarketList?.length > 0" class="smallMarginTop vHeaderDisplay" :class="userTabStableCoinSubMarketList?.length > 0 ? 'thinBorderTop' : ''"
      :style="{paddingTop: userTabStableCoinSubMarketList?.length > 0 ? '4px' : '0px'}">
      
      <div>
        <h4 class="underLine green" style="line-height: 27px">Crypto Currency<br>7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">{{ crypto7DayProjectionRateValue.toFixed(2) }}</span> A Week</h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ crypto7DayProjectionRateAmount }}</span> A Week</h5>
      </div>

      <div class="nMediumMarginTop">
        <h4 class="underLine green" style="line-height: 27px">Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">{{ cryptoLifeTimeInterestEarnedValue.toFixed(2) }}</span></h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">{{ cryptoLifeTimeInterestEarnedAmount }}</span></h5>
      </div>

    </div>

    <div v-if="userTabCryptoCurrencySubMarketList?.length > 0" class="nMediumMarginTop mediumSmallMarginBottom">
      <div v-for="(subMarketTab, userTabIndex) in userTabCryptoCurrencySubMarketList">
        <PortfolioChart
        :key="chartReRenderKey"
        :isStableCoin="false"
        :depositedAssetAmount="depositedAssetAmount"
        :tokenId="subMarketTab.tokenId"
        :subMarketOwnerAddress="subMarketTab.subMarketOwnerAddress"
        :subMarketOwnerAddressTrimmed="subMarketTab.subMarketOwnerAddressTrimmed"
        :subMarketIndex="subMarketTab.subMarketIndex"
        :ownerAddress="searchAddress"
        :accountIndex="accountSelect"
        :subMarketFee="subMarketTab.subMarketFee"
        :userTabIndex="userTabIndex"
        :chartData="getChartData(subMarketTab.tokenId, subMarketTab.subMarketOwnerAddress, subMarketTab.subMarketIndex)"
        :selectedYear="getSelectedYearForOnMounted(subMarketTab.tokenId, subMarketTab.subMarketOwnerAddress, subMarketTab.subMarketIndex)"
        @changeYear="updateSelectedYearForTokenMintAddressHashMap"
        @openDepositModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openDepositModal', tokenId, tokenMintAddress, subMarketOption)"
        @openWithdrawalModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openWithdrawalModal', tokenId, tokenMintAddress, subMarketOption)"
        @openBorrowModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openBorrowModal', tokenId, tokenMintAddress, subMarketOption)"
        @openRepayModal="(tokenId: number, tokenMintAddress: string, subMarketOption: any[]) => $emit('openRepayModal', tokenId, tokenMintAddress, subMarketOption)"
        @interestEarned="updateCryptoRealTimeValues"/>
      </div>
    </div>
  </div>

  <div v-else-if="!isBrowsingAllUsers" class="mediumMarginTop">{{ anchorPrograms.isLendingProtocolReady ? 'No Lending User Found At That PublicKey' : 'Loading' }}</div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
  import { IonInput, IonButton, IonLabel } from '@ionic/vue'
  import Select from 'primevue/select'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { getUserDisplayName, getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { lendingUserAccountsHashMap,
    lendingUserAvailableStableCoinStatementsBySubMarketsHashMap,
    lendingUserAvailableStableCoinYearsBySubMarketHashMap,
    lendingUserAvailableCryptoCurrencyStatementsBySubMarketsHashMap,
    lendingUserAvailableCryptoCurrencyYearsBySubMarketHashMap,
    lendingUserMonthlyStatementsHashMap,
    lendingUserTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { trimAddress, isValidSolanaPublicKey } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import LendingLeaderBoardTable from '/src/components/tables/lending/LendingLeaderBoardTable.vue'
  import PortfolioChart from '/src/components/charts/lending/PortfolioChart.vue'
  import { anchorPrograms, monthList } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import HealthFactorBig from '/src/components/smart contracts/lending protocol/HealthFactorBig.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import cloneDeep from 'lodash/cloneDeep'
  
  const props = defineProps(['portfolioReRenderHelper'])
  const emits = defineEmits(
  [
    'openDepositModal',
    'openWithdrawalModal',
    'openBorrowModal',
    'openRepayModal',
    'openLiquidationModal'
  ])

  var displayName = ref()
  var possiblyTrimmedDisplayName = ref()
  var searchAddress = ref()
  var addressToCheck = ref()
  var isValidPublicKey = ref(false)

  var userTabStableCoinSubMarketList = ref()
  var userTabCryptoCurrencySubMarketList = ref()

  var intervalId: any

  var chartReRenderKey = ref(0)
  var editingAccountName = ref(false)
  var hasAtleast1Account = ref()
  var accountNameEditInputRef = ref()
  var accountName = ref()
  var accountSelect = ref(0)
  var accountList = ref()
  var isBrowsingAllUsers = ref()

  var selectedYearHashMap = new Map<string, any>()
  var selectedUserChartDataHashMap = ref()
  var initialStableCoinSelectedYearSet = false
  var initialCryptoCurrencySelectedYearSet = false
  var depositedAssetAmount = ref()

  var stableCoin7DayProjectionRateAmount = ref("0")
  var stableCoin7DayProjectionRateValue = ref(0)
  var stableCoinLifeTimeInterestEarnedAmount = ref("0")
  var stableCoinLifeTimeInterestEarnedValue = ref(0)

  var crypto7DayProjectionRateAmount = ref("0")
  var crypto7DayProjectionRateValue = ref(0)
  var cryptoLifeTimeInterestEarnedAmount = ref("0")
  var cryptoLifeTimeInterestEarnedValue = ref(0)

  const baseChartData =
  {
    lastActionType: 0,
    lastActionAmount: 0,
    lastActionTimeStamp: 0,
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets:
    [
      {
        type: 'line',
        label: 'Balance',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setRainbowAnimatedGradient(ctx, chartArea)
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
          return setRainbowGradient(ctx, chartArea)
        },
        data: [] as any[]
      },
      {
        type: 'line',
        label: 'Debt',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setPoopAnimatedGradient(ctx, chartArea)
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
          return setPoopGradient(ctx, chartArea)
        },
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Deposits',
        backgroundColor: "#39bd39",
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Withdrawals',
        backgroundColor: "#b5bbca",
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Borrows',
        backgroundColor: "#557fcc",
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Repays',
        backgroundColor: "#ffd700",
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Liquidator',
        backgroundColor: "#8a2be2",
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Liquidated',
        backgroundColor: "#ff0000",
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Collect Liq Fee',
        backgroundColor: "#ff00ff",
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Collect SB Fee',
        backgroundColor: "#ff8800",
        data: [] as any[]
      },
      {
        type: 'bar',
        label: 'Collect Sol Fee',
        backgroundColor: "#006400",
        data: [] as any[]
      }
    ]
  }

  enum ChartIndex
  {
    Balances = 0,
    InterestEarned = 1,
    Debts = 2,
    InterestAccrued = 3,
    Deposits = 4,
    Withdrawals = 5,
    Borrows = 6,
    Repays = 7,
    Liquidator = 8,
    Liquidated = 9,
    CollectedLiquidationFees = 10,
    CollectedSubMarketFees = 11,
    CollectedSolvencyFees = 12
  }

  onMounted(async() =>
  {
    isBrowsingAllUsers.value = localStorage.getItem("isBrowsingAllLendingUsers") == "true" || false

    searchAddress.value = connectedWallet.addressString
    addressToCheck.value = searchAddress.value
    isValidPublicKey.value = isValidSolanaPublicKey(addressToCheck.value)
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
    selectedUserChartDataHashMap.value = new Map<string, any>()

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
      userTabStableCoinSubMarketList.value = lendingUserAvailableStableCoinStatementsBySubMarketsHashMap.map.get(connectedWallet.addressString + connectedWallet.selectedLendingUserAccountIndex.toString())
      if(userTabStableCoinSubMarketList.value)
        if(userTabStableCoinSubMarketList.value.length)
        {
          resetSelectedYearForTokenMintAddressHashMap(userTabStableCoinSubMarketList.value)
          initialStableCoinSelectedYearSet = true
        }

      userTabCryptoCurrencySubMarketList.value = lendingUserAvailableCryptoCurrencyStatementsBySubMarketsHashMap.map.get(connectedWallet.addressString + connectedWallet.selectedLendingUserAccountIndex.toString())
      if(userTabCryptoCurrencySubMarketList.value)
        if(userTabCryptoCurrencySubMarketList.value.length)
        {
          resetSelectedYearForTokenMintAddressHashMap(userTabCryptoCurrencySubMarketList.value)
          initialCryptoCurrencySelectedYearSet = true
        }

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
    let oldWallet= JSON.parse(oldJSONObjectString)

    //This is here because of the "watch(lendingUserMonthlyStatementsHashMap, () =>" line. Don't want to the chart being updated twice unnecessarily.
    //The isBrowisngAllUsers check keeps the leaderboard height from being messed up when changing the selected account index when the leader board isn't visible.
    if((newWallet.addressString == oldWallet.addressString && newWallet.selectedLendingUserAccountIndex == oldWallet.selectedLendingUserAccountIndex) || isBrowsingAllUsers.value)
      return

    if(connectedWallet.addressString != SYSTEM_PROGRAM_ADDRESS_STRING)
    {
      searchAddress.value = connectedWallet.addressString
      accountSelect.value = Number(localStorage.getItem("selectedLendingAccountIndex")) || 0

      if(lendingUserMonthlyStatementsHashMap.map)
      {
        userTabStableCoinSubMarketList.value = lendingUserAvailableStableCoinStatementsBySubMarketsHashMap.map.get(connectedWallet.addressString + connectedWallet.selectedLendingUserAccountIndex.toString())
        if(userTabStableCoinSubMarketList.value)
          if(userTabStableCoinSubMarketList.value.length)
            resetSelectedYearForTokenMintAddressHashMap(userTabStableCoinSubMarketList.value)

        userTabCryptoCurrencySubMarketList.value = lendingUserAvailableCryptoCurrencyStatementsBySubMarketsHashMap.map.get(connectedWallet.addressString + connectedWallet.selectedLendingUserAccountIndex.toString())
        if(userTabCryptoCurrencySubMarketList.value)
          if(userTabCryptoCurrencySubMarketList.value.length)
            resetSelectedYearForTokenMintAddressHashMap(userTabCryptoCurrencySubMarketList.value)

        setChartData()
      }
    }

    addressToCheck.value = searchAddress.value
    isValidPublicKey.value = isValidSolanaPublicKey(addressToCheck.value)

    displayName.value = getUserDisplayName(searchAddress.value)
    possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(searchAddress.value)

    setLendingUserAccountList()
    checkForLendingUserAssets()

    chartReRenderKey.value += 1
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
    userTabStableCoinSubMarketList.value = lendingUserAvailableStableCoinStatementsBySubMarketsHashMap.map.get(searchAddress.value + accountSelect.value.toString())
    if(!initialStableCoinSelectedYearSet && userTabStableCoinSubMarketList.value?.length)
    {
      resetSelectedYearForTokenMintAddressHashMap(userTabStableCoinSubMarketList.value)
      initialStableCoinSelectedYearSet = true
    }

    userTabCryptoCurrencySubMarketList.value = lendingUserAvailableCryptoCurrencyStatementsBySubMarketsHashMap.map.get(searchAddress.value + accountSelect.value.toString())
    if(!initialCryptoCurrencySelectedYearSet && userTabCryptoCurrencySubMarketList.value?.length)
    {
      resetSelectedYearForTokenMintAddressHashMap(userTabCryptoCurrencySubMarketList.value)
      initialCryptoCurrencySelectedYearSet = true
    }

    setChartData()

    stopGradientAnimation()
    startGradientAnimation()
  })

  watch(customUserNameHashMap,() =>
  {
    displayName.value = getUserDisplayName(searchAddress.value)
    possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(searchAddress.value)
  })

  watch(() => props.portfolioReRenderHelper, (() => 
  {
    chartReRenderKey.value += 1
  }))

  function setRainbowAnimatedGradient(ctx: any, chartArea:any)
  {
    if(!chartArea)
      return

    const offset = gradientOffset.value
    const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0)

    gradient.addColorStop((0 - offset + 1) % 1, '#14ffe9')
    gradient.addColorStop((0.10 - offset + 1) % 1, '#ffc800')
    gradient.addColorStop((0.50 - offset + 1) % 1, '#ff00e0')
    gradient.addColorStop((0.95 - offset + 1) % 1, '#14ffe9')

    /*gradient.addColorStop((0 - offset + 1) % 1, '#14ffe9')
    gradient.addColorStop((0.25 - offset + 1) % 1, '#ffc800')
    gradient.addColorStop((0.50 - offset + 1) % 1, '#ff00e0')
    gradient.addColorStop((0.75 - offset + 1) % 1, '#14ffe9')*/

    return gradient
  }

  function setRainbowGradient(ctx: any, chartArea:any)
  {
    if(!chartArea)
      return

    const gradient = ctx.createLinearGradient(0, 0, 0, 170)

    gradient.addColorStop((0), '#14ffe9')
    gradient.addColorStop((0.25), '#ffc800')
    gradient.addColorStop((0.50), '#ff00e0')
    gradient.addColorStop((0.75) , '#14ffe9')

    return gradient
  }

  function setPoopAnimatedGradient(ctx: any, chartArea:any)
  {
    if(!chartArea)
      return

    const offset = gradientOffset.value
    const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0)

    gradient.addColorStop((0 - offset + 1) % 1, '#851717')
    gradient.addColorStop((0.50 - offset + 1) % 1, '#0f8332')
    gradient.addColorStop((0.95 - offset + 1) % 1, '#851717')

    return gradient
  }

  function setPoopGradient(ctx: any, chartArea:any)
  {
    if(!chartArea)
      return

    const gradient = ctx.createLinearGradient(0, 0, 0, 170)

    gradient.addColorStop((0), '#851717')
    gradient.addColorStop((0.50), '#0f8332')
    gradient.addColorStop((0.75) , '#851717')

    return gradient
  }

  function resetSelectedYearForTokenMintAddressHashMap(subMarketArray: any[])
  {
    const newDate = new Date()
    const currentYear = newDate.getFullYear()

    if(subMarketArray)
    {
      for(var i=0; i<subMarketArray.length; i++)
      {
        selectedYearHashMap.set(subMarketArray[i].tokenId.toString() + subMarketArray[i].subMarketOwnerAddress + subMarketArray[i].subMarketIndex, currentYear)
      }
    }
  }

  function updateSelectedYearForTokenMintAddressHashMap(tokenMintAddress: string, subMarketOwnerAddress: string, subMarketIndex: number, selectedYear: number)
  {
    selectedYearHashMap.set(tokenMintAddress + subMarketOwnerAddress + subMarketIndex.toString(), selectedYear)
    chartReRenderKey.value += 1
  }

  function setChartData()
  {
    const newDate = new Date()
    const currentYear = newDate.getFullYear()
    const currentMonth = newDate.getMonth() + 1
    var tempHashMap = new Map<string, any>()

    //Get Stable Coin Yearly Chart Data
    if(userTabStableCoinSubMarketList.value)
      for(var i=0; i<userTabStableCoinSubMarketList.value.length; i++)
      {
        const tokenId = userTabStableCoinSubMarketList.value[i].tokenId
        const subMarketOwnerAddress = userTabStableCoinSubMarketList.value[i].subMarketOwnerAddress
        const subMarketIndex = userTabStableCoinSubMarketList.value[i].subMarketIndex

        var lastKnownActionType = 0
        var lastKnownActionAmount = 0
        var lastKnownActionTimeStamp = 0
        var previousBalance = 0
        var previousDebt = 0

        const userAvailableYearsByTokenMintAddressList = lendingUserAvailableStableCoinYearsBySubMarketHashMap.map.get(tokenId.toString() +
        subMarketOwnerAddress +
        subMarketIndex.toString() +
        searchAddress.value +
        accountSelect.value.toString())

        for(var year=userAvailableYearsByTokenMintAddressList[0].yearAvailable; year<=currentYear; year++)
        {
          var labels = []
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

          var tempChartData = cloneDeep(baseChartData)
        
          //If current year, go up until the current month, otherwise cover the whole year
          if(year == currentYear)
          {
            for(var month=1; month<=currentMonth; month++)
            {
              labels.push(monthList[month-1].monthName)

              const userMonthlyStatement = lendingUserMonthlyStatementsHashMap.map.get(month.toString() +
              year.toString() +
              tokenId.toString() +
              subMarketOwnerAddress +
              subMarketIndex.toString() +
              searchAddress.value +
              accountSelect.value.toString())

              if(userMonthlyStatement)
              {
                const decimalAmount = tokenDecimalHashMap.get(tokenId)
                lastKnownActionType = userMonthlyStatement.lastLendingActivityType
                lastKnownActionAmount = Number(userMonthlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
                lastKnownActionTimeStamp = Number(userMonthlyStatement.lastLendingActivityTimeStamp)
                previousBalance = Number(userMonthlyStatement.snapShotBalanceAmount) / Math.pow(10, decimalAmount)
                previousDebt = Number(userMonthlyStatement.snapShotDebtAmount) / Math.pow(10, decimalAmount)

                tempChartData.lastActionType = userMonthlyStatement.lastLendingActivityType
                tempChartData.lastActionAmount = Number(userMonthlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
                tempChartData.lastActionTimeStamp = Number(userMonthlyStatement.lastLendingActivityTimeStamp)

                balances.push(previousBalance)
                debts.push(previousDebt)
                earnedInterests.push(Number(userMonthlyStatement.monthlyInterestEarnedAmount) / Math.pow(10, decimalAmount))
                accruedInterests.push(Number(userMonthlyStatement.monthlyInterestAccruedAmount) / Math.pow(10, decimalAmount))
                deposits.push(Number(userMonthlyStatement.monthlyDepositedAmount) / Math.pow(10, decimalAmount))
                withdrawals.push(Number(userMonthlyStatement.monthlyWithdrawalAmount) / Math.pow(10, decimalAmount))
                borrows.push(Number(userMonthlyStatement.monthlyBorrowedAmount) / Math.pow(10, decimalAmount))
                repays.push(Number(userMonthlyStatement.monthlyRepaidDebtAmount) / Math.pow(10, decimalAmount))
                liquidator.push(Number(userMonthlyStatement.monthlyLiquidatorAmount) / Math.pow(10, decimalAmount))
                liquidated.push(Number(userMonthlyStatement.monthlyLiquidatedAmount) / Math.pow(10, decimalAmount))
                collectedLiquidationFees.push(Number(userMonthlyStatement.monthlyLiquidationFeesCollectedAmount) / Math.pow(10, decimalAmount))
                collectedSubMarketFees.push(Number(userMonthlyStatement.monthlySubMarketFeesCollectedAmount) / Math.pow(10, decimalAmount))
                collectedSolvencyFees.push(Number(userMonthlyStatement.monthlySolvencyInsuranceFeesCollectedAmount) / Math.pow(10, decimalAmount))
              }
              else
              {
                tempChartData.lastActionType = lastKnownActionType
                tempChartData.lastActionAmount = lastKnownActionAmount
                tempChartData.lastActionTimeStamp = lastKnownActionTimeStamp

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

            tempChartData.labels = labels
            tempChartData.datasets[ChartIndex.Balances].data = balances
            tempChartData.datasets[ChartIndex.InterestEarned].data = earnedInterests
            tempChartData.datasets[ChartIndex.Debts].data = debts
            tempChartData.datasets[ChartIndex.InterestAccrued].data = accruedInterests
            tempChartData.datasets[ChartIndex.Deposits].data = deposits
            tempChartData.datasets[ChartIndex.Withdrawals].data = withdrawals
            tempChartData.datasets[ChartIndex.Borrows].data = borrows
            tempChartData.datasets[ChartIndex.Repays].data = repays
            tempChartData.datasets[ChartIndex.Liquidator].data = liquidator
            tempChartData.datasets[ChartIndex.Liquidated].data = liquidated
            tempChartData.datasets[ChartIndex.CollectedLiquidationFees].data = collectedLiquidationFees 
            tempChartData.datasets[ChartIndex.CollectedSubMarketFees].data = collectedSubMarketFees
            tempChartData.datasets[ChartIndex.CollectedSolvencyFees].data = collectedSolvencyFees
            if(searchAddress.value != adminAccounts.singlePayerTreasuryAddress.toString() &&
            searchAddress.value != adminAccounts.hodlTreasuryAddress.toString() &&
            searchAddress.value != adminAccounts.solvencyTreasuryAddress.toString())
            {
              tempChartData.datasets[ChartIndex.CollectedLiquidationFees].hidden = true
              tempChartData.datasets[ChartIndex.CollectedSubMarketFees].hidden = true
              tempChartData.datasets[ChartIndex.CollectedSolvencyFees].hidden = true
            }

            tempHashMap.set(tokenId.toString() + subMarketOwnerAddress + subMarketIndex.toString() + year.toString(), tempChartData)
          }
          else
          {
            for(var month=1; month<=12; month++)
            {
              labels.push(monthList[month-1].monthName)

              const userMonthlyStatement = lendingUserMonthlyStatementsHashMap.map.get(month.toString() +
              year.toString() +
              tokenId.toString() +
              subMarketOwnerAddress +
              subMarketIndex.toString() +
              searchAddress.value +
              accountSelect.value.toString())

              if(userMonthlyStatement)
              {
                const decimalAmount = tokenDecimalHashMap.get(tokenId)
                lastKnownActionType = userMonthlyStatement.lastLendingActivityType
                lastKnownActionAmount = Number(userMonthlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
                lastKnownActionTimeStamp = Number(userMonthlyStatement.lastLendingActivityTimeStamp)
                previousBalance = Number(userMonthlyStatement.snapShotBalanceAmount) / Math.pow(10, decimalAmount)
                previousDebt = Number(userMonthlyStatement.snapShotDebtAmount) / Math.pow(10, decimalAmount)

                tempChartData.lastActionType = userMonthlyStatement.lastLendingActivityType
                tempChartData.lastActionAmount = Number(userMonthlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
                tempChartData.lastActionTimeStamp = Number(userMonthlyStatement.lastLendingActivityTimeStamp)

                balances.push(previousBalance)
                debts.push(previousDebt)
                earnedInterests.push(Number(userMonthlyStatement.monthlyInterestEarnedAmount) / Math.pow(10, decimalAmount))
                accruedInterests.push(Number(userMonthlyStatement.monthlyInterestAccruedAmount) / Math.pow(10, decimalAmount))
                deposits.push(Number(userMonthlyStatement.monthlyDepositedAmount) / Math.pow(10, decimalAmount))
                withdrawals.push(Number(userMonthlyStatement.monthlyWithdrawalAmount) / Math.pow(10, decimalAmount))
                borrows.push(Number(userMonthlyStatement.monthlyBorrowedAmount) / Math.pow(10, decimalAmount))
                repays.push(Number(userMonthlyStatement.monthlyRepaidDebtAmount) / Math.pow(10, decimalAmount))
                liquidator.push(Number(userMonthlyStatement.monthlyLiquidatorAmount) / Math.pow(10, decimalAmount))
                liquidated.push(Number(userMonthlyStatement.monthlyLiquidatedAmount) / Math.pow(10, decimalAmount))
                collectedLiquidationFees.push(Number(userMonthlyStatement.monthlyLiquidationFeesCollectedAmount) / Math.pow(10, decimalAmount))
                collectedSubMarketFees.push(Number(userMonthlyStatement.monthlySubMarketFeesCollectedAmount) / Math.pow(10, decimalAmount))
                collectedSolvencyFees.push(Number(userMonthlyStatement.monthlySolvencyInsuranceFeesCollectedAmount) / Math.pow(10, decimalAmount))
              }
              else
              {
                tempChartData.lastActionType = lastKnownActionType
                tempChartData.lastActionAmount = lastKnownActionAmount
                tempChartData.lastActionTimeStamp = lastKnownActionTimeStamp

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

            tempChartData.labels = labels
            tempChartData.datasets[ChartIndex.Balances].data = balances
            tempChartData.datasets[ChartIndex.InterestEarned].data = earnedInterests
            tempChartData.datasets[ChartIndex.Debts].data = debts
            tempChartData.datasets[ChartIndex.InterestAccrued].data = accruedInterests
            tempChartData.datasets[ChartIndex.Deposits].data = deposits
            tempChartData.datasets[ChartIndex.Withdrawals].data = withdrawals
            tempChartData.datasets[ChartIndex.Borrows].data = borrows
            tempChartData.datasets[ChartIndex.Repays].data = repays
            tempChartData.datasets[ChartIndex.Liquidator].data = liquidator
            tempChartData.datasets[ChartIndex.Liquidated].data = liquidated
            tempChartData.datasets[ChartIndex.CollectedLiquidationFees].data = collectedLiquidationFees
            tempChartData.datasets[ChartIndex.CollectedSubMarketFees].data = collectedSubMarketFees
            tempChartData.datasets[ChartIndex.CollectedSolvencyFees].data = collectedSolvencyFees
            if(searchAddress.value != adminAccounts.singlePayerTreasuryAddress.toString() &&
            searchAddress.value != adminAccounts.hodlTreasuryAddress.toString() &&
            searchAddress.value != adminAccounts.solvencyTreasuryAddress.toString())
            {
              tempChartData.datasets[ChartIndex.CollectedLiquidationFees].hidden = true
              tempChartData.datasets[ChartIndex.CollectedSubMarketFees].hidden = true
              tempChartData.datasets[ChartIndex.CollectedSolvencyFees].hidden = true
            }

            tempHashMap.set(tokenId.toString() + subMarketOwnerAddress + subMarketIndex.toString() + year.toString(), tempChartData)
          }
        }
      }

    //Get Crypto Currency Yearly Chart Data
    if(userTabCryptoCurrencySubMarketList.value)
      for(var i=0; i<userTabCryptoCurrencySubMarketList.value.length; i++)
      {
        const tokenId = userTabCryptoCurrencySubMarketList.value[i].tokenId
        const subMarketOwnerAddress = userTabCryptoCurrencySubMarketList.value[i].subMarketOwnerAddress
        const subMarketIndex = userTabCryptoCurrencySubMarketList.value[i].subMarketIndex

        var lastKnownActionType = 0
        var lastKnownActionAmount = 0
        var lastKnownActionTimeStamp = 0
        var previousBalance = 0
        var previousDebt = 0

        const userAvailableYearsByTokenMintAddressList = lendingUserAvailableCryptoCurrencyYearsBySubMarketHashMap.map.get(tokenId.toString() +
        subMarketOwnerAddress +
        subMarketIndex.toString() +
        searchAddress.value +
        accountSelect.value.toString())

        for(var year=userAvailableYearsByTokenMintAddressList[0].yearAvailable; year<=currentYear; year++)
        {
          var labels = []
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
          var tempChartData = cloneDeep(baseChartData)
        
          //If current year, go up until the current month, otherwise cover the whole year
          if(year == currentYear)
          {
            for(var month=1; month<=currentMonth; month++)
            {
              labels.push(monthList[month-1].monthName)

              const userMonthlyStatement = lendingUserMonthlyStatementsHashMap.map.get(month.toString() +
              year.toString() +
              tokenId.toString() +
              subMarketOwnerAddress +
              subMarketIndex.toString() +
              searchAddress.value +
              accountSelect.value.toString())

              if(userMonthlyStatement)
              {
                const decimalAmount = tokenDecimalHashMap.get(tokenId)
                lastKnownActionType = userMonthlyStatement.lastLendingActivityType
                lastKnownActionAmount = Number(userMonthlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
                lastKnownActionTimeStamp = Number(userMonthlyStatement.lastLendingActivityTimeStamp)
                previousBalance = Number(userMonthlyStatement.snapShotBalanceAmount) / Math.pow(10, decimalAmount)
                previousDebt = Number(userMonthlyStatement.snapShotDebtAmount) / Math.pow(10, decimalAmount)

                tempChartData.lastActionType = userMonthlyStatement.lastLendingActivityType
                tempChartData.lastActionAmount = Number(userMonthlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
                tempChartData.lastActionTimeStamp = Number(userMonthlyStatement.lastLendingActivityTimeStamp)

                balances.push(previousBalance)
                debts.push(previousDebt)
                earnedInterests.push(Number(userMonthlyStatement.monthlyInterestEarnedAmount) / Math.pow(10, decimalAmount))
                accruedInterests.push(Number(userMonthlyStatement.monthlyInterestAccruedAmount) / Math.pow(10, decimalAmount))
                deposits.push(Number(userMonthlyStatement.monthlyDepositedAmount) / Math.pow(10, decimalAmount))
                withdrawals.push(Number(userMonthlyStatement.monthlyWithdrawalAmount) / Math.pow(10, decimalAmount))
                borrows.push(Number(userMonthlyStatement.monthlyBorrowedAmount) / Math.pow(10, decimalAmount))
                repays.push(Number(userMonthlyStatement.monthlyRepaidDebtAmount) / Math.pow(10, decimalAmount))
                liquidator.push(Number(userMonthlyStatement.monthlyLiquidatorAmount) / Math.pow(10, decimalAmount))
                liquidated.push(Number(userMonthlyStatement.monthlyLiquidatedAmount) / Math.pow(10, decimalAmount))
                collectedLiquidationFees.push(Number(userMonthlyStatement.monthlyLiquidationFeesCollectedAmount) / Math.pow(10, decimalAmount))
                collectedSubMarketFees.push(Number(userMonthlyStatement.monthlySubMarketFeesCollectedAmount) / Math.pow(10, decimalAmount))
                collectedSolvencyFees.push(Number(userMonthlyStatement.monthlySolvencyInsuranceFeesCollectedAmount) / Math.pow(10, decimalAmount))
              }
              else
              {
                tempChartData.lastActionType = lastKnownActionType
                tempChartData.lastActionAmount = lastKnownActionAmount
                tempChartData.lastActionTimeStamp = lastKnownActionTimeStamp

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

            tempChartData.labels = labels
            tempChartData.datasets[ChartIndex.Balances].data = balances
            tempChartData.datasets[ChartIndex.InterestEarned].data = earnedInterests
            tempChartData.datasets[ChartIndex.Debts].data = debts
            tempChartData.datasets[ChartIndex.InterestAccrued].data = accruedInterests
            tempChartData.datasets[ChartIndex.Deposits].data = deposits
            tempChartData.datasets[ChartIndex.Withdrawals].data = withdrawals
            tempChartData.datasets[ChartIndex.Borrows].data = borrows
            tempChartData.datasets[ChartIndex.Repays].data = repays
            tempChartData.datasets[ChartIndex.Liquidator].data = liquidator
            tempChartData.datasets[ChartIndex.Liquidated].data = liquidated
            tempChartData.datasets[ChartIndex.CollectedLiquidationFees].data = collectedLiquidationFees
            tempChartData.datasets[ChartIndex.CollectedSubMarketFees].data = collectedSubMarketFees
            tempChartData.datasets[ChartIndex.CollectedSolvencyFees].data = collectedSolvencyFees
            if(searchAddress.value != adminAccounts.singlePayerTreasuryAddress.toString() &&
            searchAddress.value != adminAccounts.hodlTreasuryAddress.toString() &&
            searchAddress.value != adminAccounts.solvencyTreasuryAddress.toString())
            {
              tempChartData.datasets[ChartIndex.CollectedLiquidationFees].hidden = true
              tempChartData.datasets[ChartIndex.CollectedSubMarketFees].hidden = true
              tempChartData.datasets[ChartIndex.CollectedSolvencyFees].hidden = true
            }

            tempHashMap.set(tokenId.toString() + subMarketOwnerAddress + subMarketIndex.toString() + year.toString(), tempChartData)
          }
          else
          {
            for(var month=1; month<=12; month++)
            {
              labels.push(monthList[month-1].monthName)

              const userMonthlyStatement = lendingUserMonthlyStatementsHashMap.map.get(month.toString() +
              year.toString() +
              tokenId.toString() +
              subMarketOwnerAddress +
              subMarketIndex.toString() +
              searchAddress.value +
              accountSelect.value.toString())

              if(userMonthlyStatement)
              {
                const decimalAmount = tokenDecimalHashMap.get(tokenId)
                lastKnownActionType = userMonthlyStatement.lastLendingActivityType
                lastKnownActionAmount = Number(userMonthlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
                lastKnownActionTimeStamp = Number(userMonthlyStatement.lastLendingActivityTimeStamp)
                previousBalance = Number(userMonthlyStatement.snapShotBalanceAmount) / Math.pow(10, decimalAmount)
                previousDebt = Number(userMonthlyStatement.snapShotDebtAmount) / Math.pow(10, decimalAmount)

                tempChartData.lastActionType = userMonthlyStatement.lastLendingActivityType
                tempChartData.lastActionAmount = Number(userMonthlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
                tempChartData.lastActionTimeStamp = Number(userMonthlyStatement.lastLendingActivityTimeStamp)

                balances.push(previousBalance)
                debts.push(previousDebt)
                earnedInterests.push(Number(userMonthlyStatement.monthlyInterestEarnedAmount) / Math.pow(10, decimalAmount))
                accruedInterests.push(Number(userMonthlyStatement.monthlyInterestAccruedAmount) / Math.pow(10, decimalAmount))
                deposits.push(Number(userMonthlyStatement.monthlyDepositedAmount) / Math.pow(10, decimalAmount))
                withdrawals.push(Number(userMonthlyStatement.monthlyWithdrawalAmount) / Math.pow(10, decimalAmount))
                borrows.push(Number(userMonthlyStatement.monthlyBorrowedAmount) / Math.pow(10, decimalAmount))
                repays.push(Number(userMonthlyStatement.monthlyRepaidDebtAmount) / Math.pow(10, decimalAmount))
                liquidator.push(Number(userMonthlyStatement.monthlyLiquidatorAmount) / Math.pow(10, decimalAmount))
                liquidated.push(Number(userMonthlyStatement.monthlyLiquidatedAmount) / Math.pow(10, decimalAmount))
                collectedLiquidationFees.push(Number(userMonthlyStatement.monthlyLiquidationFeesCollectedAmount) / Math.pow(10, decimalAmount))
                collectedSubMarketFees.push(Number(userMonthlyStatement.monthlySubMarketFeesCollectedAmount) / Math.pow(10, decimalAmount))
                collectedSolvencyFees.push(Number(userMonthlyStatement.monthlySolvencyInsuranceFeesCollectedAmount) / Math.pow(10, decimalAmount))
              }
              else
              {
                tempChartData.lastActionType = lastKnownActionType
                tempChartData.lastActionAmount = lastKnownActionAmount
                tempChartData.lastActionTimeStamp = lastKnownActionTimeStamp

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

            tempChartData.labels = labels
            tempChartData.datasets[ChartIndex.Balances].data = balances
            tempChartData.datasets[ChartIndex.InterestEarned].data = earnedInterests
            tempChartData.datasets[ChartIndex.Debts].data = debts
            tempChartData.datasets[ChartIndex.InterestAccrued].data = accruedInterests
            tempChartData.datasets[ChartIndex.Deposits].data = deposits
            tempChartData.datasets[ChartIndex.Withdrawals].data = withdrawals
            tempChartData.datasets[ChartIndex.Borrows].data = borrows
            tempChartData.datasets[ChartIndex.Repays].data = repays
            tempChartData.datasets[ChartIndex.Liquidator].data = liquidator
            tempChartData.datasets[ChartIndex.Liquidated].data = liquidated
            tempChartData.datasets[ChartIndex.CollectedLiquidationFees].data = collectedLiquidationFees
            tempChartData.datasets[ChartIndex.CollectedSubMarketFees].data = collectedSubMarketFees
            tempChartData.datasets[ChartIndex.CollectedSolvencyFees].data = collectedSolvencyFees
            if(searchAddress.value != adminAccounts.singlePayerTreasuryAddress.toString() &&
            searchAddress.value != adminAccounts.hodlTreasuryAddress.toString() &&
            searchAddress.value != adminAccounts.solvencyTreasuryAddress.toString())
            {
              tempChartData.datasets[ChartIndex.CollectedLiquidationFees].hidden = true
              tempChartData.datasets[ChartIndex.CollectedSubMarketFees].hidden = true
              tempChartData.datasets[ChartIndex.CollectedSolvencyFees].hidden = true
            }
            
            tempHashMap.set(tokenId.toString() + subMarketOwnerAddress + subMarketIndex.toString() + year.toString(), tempChartData)
          }
        }
      }

      selectedUserChartDataHashMap.value = tempHashMap
  }

  function getChartData(tokenId: number, subMarketOwnerAddress: string, subMarketIndex: number)
  {
    return selectedUserChartDataHashMap.value.get(tokenId.toString() + subMarketOwnerAddress + subMarketIndex.toString() + selectedYearHashMap.get(tokenId + subMarketOwnerAddress + subMarketIndex.toString()))
  }

  function getSelectedYearForOnMounted(tokenId: string, subMarketOwnerAddress: string, subMarketIndex: number)
  {
    return selectedYearHashMap.get(tokenId.toString() + subMarketOwnerAddress + subMarketIndex.toString())
  }

  const gradientOffset = ref(0)

  function startGradientAnimation()
  {
    intervalId = setInterval(() =>
    {
      //Increment the offset slightly.
      gradientOffset.value += 0.07
      
      //Ensure the offset wraps around (e.g., from 1.0 back to 0.0)
      if (gradientOffset.value >= 1)
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
    displayName.value = getUserDisplayName(searchAddress.value)
    possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(searchAddress.value)

    if(lendingUserMonthlyStatementsHashMap.map)
    {
      userTabStableCoinSubMarketList.value = lendingUserAvailableStableCoinStatementsBySubMarketsHashMap.map.get(searchAddress.value + accountSelected.toString())
      userTabCryptoCurrencySubMarketList.value = lendingUserAvailableCryptoCurrencyStatementsBySubMarketsHashMap.map.get(searchAddress.value + accountSelected.toString())
      accountSelect.value = accountSelected

      resetSelectedYearForTokenMintAddressHashMap(userTabStableCoinSubMarketList.value)
      resetSelectedYearForTokenMintAddressHashMap(userTabCryptoCurrencySubMarketList.value)
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
      localStorage.setItem("selectedLendingAccountIndex", accountSelect.value.toString())
    }

    stableCoin7DayProjectionRateAmount.value = "0"
    stableCoin7DayProjectionRateValue.value = 0
    stableCoinLifeTimeInterestEarnedAmount.value = "0"
    stableCoinLifeTimeInterestEarnedValue.value = 0

    crypto7DayProjectionRateAmount.value = "0"
    crypto7DayProjectionRateValue.value = 0
    cryptoLifeTimeInterestEarnedAmount.value = "0"
    cryptoLifeTimeInterestEarnedValue.value = 0

    userTabStableCoinSubMarketList.value = lendingUserAvailableStableCoinStatementsBySubMarketsHashMap.map.get(searchAddress.value + accountSelect.value.toString())
    userTabCryptoCurrencySubMarketList.value = lendingUserAvailableCryptoCurrencyStatementsBySubMarketsHashMap.map.get(searchAddress.value + accountSelect.value.toString())

    resetSelectedYearForTokenMintAddressHashMap(userTabStableCoinSubMarketList.value)
    resetSelectedYearForTokenMintAddressHashMap(userTabCryptoCurrencySubMarketList.value)
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

    document.getElementById("protfolioHeader")?.scrollIntoView() 
  }

  function emitOpenLiquidationModal(accountOwner: string, accountIndex: number)
  {
    emits('openLiquidationModal', accountOwner, accountIndex)
  }

  function setIsBrowsingAllLendingUsers(flag: boolean)
  {
    isBrowsingAllUsers.value = flag
    localStorage.setItem("isBrowsingAllLendingUsers", flag.toString())
  }

  function setInputFocus()
  {
    accountName.value = accountList.value[accountSelect.value].accountName

    setTimeout(() =>
    {
      const inputElement = accountNameEditInputRef.value?.$el.querySelector(".native-input")
      if(inputElement)
        inputElement.focus()
    }, 10) 
  }

  function checkForLendingUserAssets()
  {
    if(!lendingUserTabAccountListHashMap.map)
      return

    //Check for any assets to allow borrowing
    var assetAmount = 0
    const userTabAccounts = lendingUserTabAccountListHashMap.map.get(addressToCheck.value + accountSelect.value)
    
    if(userTabAccounts)
      for(var i=0; i<userTabAccounts.length; i++)
      {
        const depositedAmount = Number(userTabAccounts[i].depositedAmount)
        if(depositedAmount != 0)
        {
          assetAmount = depositedAmount
          break
        }
      }

    depositedAssetAmount.value = assetAmount
  }

  function updateStableCoinRealTimeValues(userTabIndex: number,
  sevenDayCalculatedUserInterestEarned: number,
  sevenDayInterestEarnedValue: number,
  calculatedUserInterestEarned: number,
  interestEarnedValue: number)
  {
    userTabStableCoinSubMarketList.value[userTabIndex].sevenDayCalculatedUserInterestEarned = sevenDayCalculatedUserInterestEarned
    userTabStableCoinSubMarketList.value[userTabIndex].sevenDayInterestEarnedValue = sevenDayInterestEarnedValue
    userTabStableCoinSubMarketList.value[userTabIndex].calculatedUserInterestEarned = calculatedUserInterestEarned
    userTabStableCoinSubMarketList.value[userTabIndex].interestEarnedValue = interestEarnedValue

    var highestTokenDecimalAmount = 0
    var sevenDayCalculatedUserInterestEarned = 0
    var sevenDayInterestEarnedValue = 0
    var calculatedUserInterestEarned = 0
    var interestEarnedValue = 0

    for(var i=0; i<userTabStableCoinSubMarketList.value.length; i++)
    {
      const decimalAmount = tokenDecimalHashMap.get(userTabStableCoinSubMarketList.value[i].tokenId)
      if(decimalAmount>highestTokenDecimalAmount)
        highestTokenDecimalAmount = decimalAmount

      sevenDayCalculatedUserInterestEarned += userTabStableCoinSubMarketList.value[i].sevenDayCalculatedUserInterestEarned
      sevenDayInterestEarnedValue += userTabStableCoinSubMarketList.value[i].sevenDayInterestEarnedValue
      calculatedUserInterestEarned += userTabStableCoinSubMarketList.value[i].calculatedUserInterestEarned
      interestEarnedValue += userTabStableCoinSubMarketList.value[i].interestEarnedValue
    }

    stableCoin7DayProjectionRateAmount.value = sevenDayCalculatedUserInterestEarned.toLocaleString('en-US', {
          minimumFractionDigits: highestTokenDecimalAmount,
          maximumFractionDigits: highestTokenDecimalAmount })
    stableCoin7DayProjectionRateValue.value = sevenDayInterestEarnedValue
    stableCoinLifeTimeInterestEarnedAmount.value = calculatedUserInterestEarned.toLocaleString('en-US', {
          minimumFractionDigits: highestTokenDecimalAmount,
          maximumFractionDigits: highestTokenDecimalAmount })
    stableCoinLifeTimeInterestEarnedValue.value = interestEarnedValue
  }

  function updateCryptoRealTimeValues(userTabIndex: number,
  sevenDayCalculatedUserInterestEarned: number,
  sevenDayInterestEarnedValue: number,
  calculatedUserInterestEarned: number,
  interestEarnedValue: number)
  {
    //userTabCryptoCurrencySubMarketList.value = undefined

    userTabCryptoCurrencySubMarketList.value[userTabIndex].sevenDayCalculatedUserInterestEarned = 0
    userTabCryptoCurrencySubMarketList.value[userTabIndex].sevenDayInterestEarnedValue = 0
    userTabCryptoCurrencySubMarketList.value[userTabIndex].calculatedUserInterestEarned = 0
    userTabCryptoCurrencySubMarketList.value[userTabIndex].interestEarnedValue = 0

    userTabCryptoCurrencySubMarketList.value[userTabIndex].sevenDayCalculatedUserInterestEarned = sevenDayCalculatedUserInterestEarned
    userTabCryptoCurrencySubMarketList.value[userTabIndex].sevenDayInterestEarnedValue = sevenDayInterestEarnedValue
    userTabCryptoCurrencySubMarketList.value[userTabIndex].calculatedUserInterestEarned = calculatedUserInterestEarned
    userTabCryptoCurrencySubMarketList.value[userTabIndex].interestEarnedValue = interestEarnedValue

    var highestTokenDecimalAmount = 0
    var sevenDayCalculatedUserInterestEarned = 0
    var sevenDayInterestEarnedValue = 0
    var calculatedUserInterestEarned = 0
    var interestEarnedValue = 0

    for(var i=0; i<userTabCryptoCurrencySubMarketList.value.length; i++)
    {
      const decimalAmount = tokenDecimalHashMap.get(userTabCryptoCurrencySubMarketList.value[i].tokenId)
      if(decimalAmount>highestTokenDecimalAmount)
        highestTokenDecimalAmount = decimalAmount

      sevenDayCalculatedUserInterestEarned += userTabCryptoCurrencySubMarketList.value[i].sevenDayCalculatedUserInterestEarned
      sevenDayInterestEarnedValue += userTabCryptoCurrencySubMarketList.value[i].sevenDayInterestEarnedValue
      calculatedUserInterestEarned += userTabCryptoCurrencySubMarketList.value[i].calculatedUserInterestEarned
      interestEarnedValue += userTabCryptoCurrencySubMarketList.value[i].interestEarnedValue
    }

    crypto7DayProjectionRateAmount.value = sevenDayCalculatedUserInterestEarned.toLocaleString('en-US', {
          minimumFractionDigits: highestTokenDecimalAmount,
          maximumFractionDigits: highestTokenDecimalAmount })
    crypto7DayProjectionRateValue.value = sevenDayInterestEarnedValue
    cryptoLifeTimeInterestEarnedAmount.value = calculatedUserInterestEarned.toLocaleString('en-US', {
          minimumFractionDigits: highestTokenDecimalAmount,
          maximumFractionDigits: highestTokenDecimalAmount })
    cryptoLifeTimeInterestEarnedValue.value = interestEarnedValue
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
</script>

<style scoped>
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
    width: min(250px, 80vw);
    max-width: 250px;
    padding-left: 30px;
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

    .topVHeaderDisplay
    {

    }
    .vHeaderDisplay
    {
      display: flex;
      flex-direction: column
    }
  }
</style>