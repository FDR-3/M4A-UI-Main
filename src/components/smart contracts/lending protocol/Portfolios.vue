<template>

  <div v-if="isBrowsingAllUsers" class="tableContainer">
    <ion-button color="green" @click="isBrowsingAllUsers=false; emitPortfolioRelatedTableHeight()"> Return</ion-button>
    <LeaderBoardTable/>
  </div>

  <div v-if="!isBrowsingAllUsers" class="tableContainer">
    <h1 class="yellow displayLongName">{{ displayName }}</h1>
    <h1 class="yellow displayShortName">{{ possiblyTrimmedDisplayName }}</h1>

    <p v-if="searchAddress==SYSTEM_PROGRAM_ADDRESS_STRING">Connect Wallet or Search for a Different Public Key</p>

    <ion-input
    v-model="addressToCheck"
    placeholder="Check New Address"
    fill="outline"
    class="nSmallMarginTop"
    :class="{ 'invalid': !isValidPublicKey }"
    @ion-input="isValidPublicKey = isValidSolanaPublicKey(addressToCheck)"
    @keydown.enter="checkNewAddress()"
    ></ion-input>

    <div class="smallMarginTop">
      <ion-button
      id="checkNewAddressButton"
      @click="checkNewAddress()"
      color="green"
      :disabled="!isValidPublicKey"
      >
        Check New Address
      </ion-button>

      <ion-button color="green" @click="isBrowsingAllUsers=true; emitPortfolioRelatedTableHeight()">Browse All Users</ion-button>
    </div>
  </div>

  <div v-if="(userStableCoinTabCount  > 0 || userCryptoCurrencyTabCount  > 0) && !isBrowsingAllUsers" class="thickBorder smallMarginTop">
    <div class="hHeaderDisplay thinBorderBottom" style="justify-content:space-around !important">
      <div>
        <h2 class="underLine">7 Day Projection Rate</h2>
        <h3 class="nMediumMarginTop">Value: $<span class="rainbowText">0.30</span> A Week</h3>
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
        <h2 class="underLine">Life Time Interest Earned</h2>
        <h3 class="nMediumMarginTop">Value: $<span class="rainbowText">30.00</span></h3>
      </div>   
    </div>

    <div class="vHeaderDisplay thinBorderBottom" style="justify-content:space-around !important">
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
        <h2 class="underLine">Life Time Interest Earned</h2>
        <h3 class="nMediumMarginTop">Value: $<span class="rainbowText">30.00</span></h3>
      </div>   

      <div>
        <h2 class="underLine nSmallMarginTop">7 Day Projection Rate</h2>
        <h3 class="nMediumMarginTop">Value: $<span class="rainbowText">0.30</span> A Week</h3>
      </div>
    </div>

    <!--Stable Coin Charts-->
    <div v-if="userStableCoinTabCount > 0" class="smallMarginTop nLargeMarginBottom hHeaderDisplay">
      <div>
        <h4 class="underLine" style="line-height: 27px">Stable Coin<br>7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">0.15</span> A Week</h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">0.15</span> A Week</h5>
      </div>

      <div>
        <h4 class="underLine" style="line-height: 27px">Stable Coin<br>Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">15.00</span></h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">15.00</span></h5>
      </div>  
    </div>

    <div v-if="userStableCoinTabCount > 0" class="smallMarginTop vHeaderDisplay">
      <div>
        <h4 class="underLine" style="line-height: 27px">Stable Coin<br>Life Time Interest Earned</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">15.00</span></h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">15.00</span></h5>
      </div>

      <div style="margin-top: -47px">
        <h4 class="underLine" style="line-height: 27px">7 Day Projection Rate</h4>
        <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">0.15</span> A Week</h5>
        <h5 class="nLargeMarginTop">Amount: <span class="rainbowText">0.15</span> A Week</h5>
      </div>
    </div>

    <div class="nMediumMarginTop mediumSmallMarginBottom">
      <div v-for="token in StableCoins" :key="lendingerUserMonthlyStatementsHashMap.map">
        <PortfolioChart v-if="userTabTokenMintAddressList?.includes(token.tokenMintAddressString)"
        :tokenMintAddress="token.tokenMintAddressString"
        :tokenSVG="token.asset.svg"
        :tokenName="token.asset.name"
        :ownerAddress="searchAddress"
        :accountIndex="accountSelect"
        :chartData="getChartData(token.tokenMintAddressString)"
        @changeYear="(tokenMintAddress: string, yearSelect: number) => updateSelectedYearForTokenMintAddressHashMap(tokenMintAddress, yearSelect)"
        @openDepositModal="(tokenMintAddress: string) => $emit('openDepositModal', tokenMintAddress)"
        @openWithdrawalModal="(tokenMintAddress: string) => $emit('openWithdrawalModal', tokenMintAddress)"/>
      </div>
    </div>

    <!--Crypto Charts-->
    <div  v-if="userCryptoCurrencyTabCount" class=" largeMarginTop" :class="userStableCoinTabCount > 0 ? 'thinBorderTop' : ''">
      <div class="hHeaderDisplay smallMarginTop">
        <div>
          <h4 class="underLine" style="line-height: 27px">Crypto Currency<br>7 Day Projection Rate</h4>
          <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">0.15</span> A Week</h5>
        </div>

        <div>
          <h4 class="underLine" style="line-height: 27px">Crypto Currency<br>Life Time Interest Earned</h4>
          <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">15.00</span></h5>
        </div>
      </div>
    </div>

    <div  v-if="userCryptoCurrencyTabCount" class="mediumSmallMarginTop nMediumMarginBottom" >
      <div class="vHeaderDisplay smallMarginTop">
        <div>
          <h4 class="underLine" style="line-height: 27px">Crypto Currency<br>7 Day Projection Rate</h4>
          <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">0.15</span> A Week</h5>
        </div>

        <div style="margin-top: -47px">
          <h4 class="underLine" style="line-height: 27px">Life Time Interest Earned</h4>
          <h5 class="nMediumLargeMarginTop">Value: $<span class="rainbowText">15.00</span></h5>
        </div>
      </div>
    </div>

    <div v-for="token in CryptoCurrency" :key="lendingerUserMonthlyStatementsHashMap.map">
      <PortfolioChart v-if="userTabTokenMintAddressList?.includes(token.tokenMintAddressString)"
      :tokenMintAddress="token.tokenMintAddressString"
      :tokenSVG="token.asset.svg"
      :tokenName="token.asset.name"
      :ownerAddress="searchAddress"
      :accountIndex="accountSelect"
      :chartData="getChartData(token.tokenMintAddressString)"
      @changeYear="(tokenMintAddress: string, yearSelect: number) => updateSelectedYearForTokenMintAddressHashMap(tokenMintAddress, yearSelect)"
      @openDepositModal="(tokenMintAddress: string) => $emit('openDepositModal', tokenMintAddress)"
      @openWithdrawalModal="(tokenMintAddress: string) => $emit('openWithdrawalModal', tokenMintAddress)"/>
    </div>
  </div>

  <div v-else-if="!isBrowsingAllUsers" class="mediumMarginTop">No User Found At That PublicKey</div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
  import { IonInput, IonButton } from '@ionic/vue'
  import Select from 'primevue/select'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { getUserDisplayName, getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { lendingerUserAccountsHashMap,
    lendingerUserAvailableYearsByTokenMintAddressHashMap,
    lendingerUserAvailableTokenMintAddressesHashMap,
    lendingerUserMonthlyStatementsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
  import { trimAddress, isValidSolanaPublicKey } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import LeaderBoardTable from '/src/components/tables/lending/LeaderBoardTable.vue'
  import PortfolioChart from '/src/components/charts/lending/PortfolioChart.vue'
  import { monthList } from '/src/assets/globalStates/AnchorPrograms.vue'
  import cloneDeep from 'lodash/cloneDeep'

  const emits = defineEmits(['openDepositModal', 'openWithdrawalModal', 'portfolioHeightChange'])

  var displayName = ref()
  var possiblyTrimmedDisplayName = ref()
  var searchAddress = ref()
  var addressToCheck = ref()
  var isValidPublicKey = ref(false)

  var userTabTokenMintAddressList = ref()
  var userStableCoinTabCount = ref(0)
  var userCryptoCurrencyTabCount = ref(0)

  var intervalId: any

  var editingAccountName = ref(false)
  var hasAtleast1Account = ref()
  var accountNameEditInputRef = ref()
  var accountName = ref()
  var accountSelect = ref(0)
  var accountList = ref()
  var isBrowsingAllUsers = ref(false)

  var selectedYearHashMap = new Map<string, any>()
  var selectedUserChartDataHashMap =  ref()

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
          return getGradient(ctx, chartArea)
        },
        borderWidth: 4,
        fill: false,
        tension: 0.4,
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
      }
    ]
  }

  enum ChartIndex
  {
    Balances = 0,
    Deposits = 1,
    Withdrawals = 2
  }

  onMounted(() =>
  {
    searchAddress.value = connectedWallet.addressString
    addressToCheck.value = searchAddress.value
    isValidPublicKey.value = isValidSolanaPublicKey(addressToCheck.value)
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex

    setLendingUserAccountList()

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

    if(lendingerUserMonthlyStatementsHashMap.map)
    {
      userTabTokenMintAddressList.value = lendingerUserAvailableTokenMintAddressesHashMap.map.get(connectedWallet.addressString + connectedWallet.selectedLendingUserAccountIndex.toString())
      if(userTabTokenMintAddressList.value)
        if(userTabTokenMintAddressList.value.length)
          setSelectedYearForTokenMintAddressHashMap(connectedWallet.addressString, connectedWallet.selectedLendingUserAccountIndex.toString(), userTabTokenMintAddressList.value)

      countUserStableCoinAndCryptoCurrencyTabs()
      setChartData()
    }

    emitPortfolioRelatedTableHeight()
    startGradientAnimation()//This has to be called here and inside of the PortfolioChart.vue file for some reason
  })

  onUnmounted(() =>
  {
    stopGradientAnimation()
  })


  //Json string of wallet to detect object property changes
  const walletWatch = computed(() =>
  {
    return JSON.stringify(connectedWallet)
  })

  watch(walletWatch, async (newJSONObjectString, oldJSONObjectString) =>
  {
    let newWallet = JSON.parse(newJSONObjectString)
    let oldWallet= JSON.parse(oldJSONObjectString)

    //This is here because of the "watch(lendingerUserMonthlyStatementsHashMap, () =>" line. Don't want to the chart being updated twice unnecessarily
    if(newWallet.addressString == oldWallet.addressString && newWallet.selectedLendingUserAccountIndex == oldWallet.selectedLendingUserAccountIndex )
      return

    if(newWallet.addressString != SYSTEM_PROGRAM_ADDRESS_STRING)
    {
      searchAddress.value = connectedWallet.addressString
      accountSelect.value = Number(localStorage.getItem("selectedLendingAccountIndex")) || 0
    }

    addressToCheck.value = searchAddress.value
    isValidPublicKey.value = isValidSolanaPublicKey(addressToCheck.value)

    displayName.value = getUserDisplayName(searchAddress.value)
    possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(searchAddress.value)

    setLendingUserAccountList()

    if(connectedWallet.addressString != SYSTEM_PROGRAM_ADDRESS_STRING)
    {
      if(lendingerUserMonthlyStatementsHashMap.map)
      {
        userTabTokenMintAddressList.value = lendingerUserAvailableTokenMintAddressesHashMap.map.get(connectedWallet.addressString + connectedWallet.selectedLendingUserAccountIndex.toString())
        if(userTabTokenMintAddressList.value)
          if(userTabTokenMintAddressList.value.length)
            setSelectedYearForTokenMintAddressHashMap(connectedWallet.addressString, connectedWallet.selectedLendingUserAccountIndex.toString(), userTabTokenMintAddressList.value)

        countUserStableCoinAndCryptoCurrencyTabs()
        emitPortfolioRelatedTableHeight()
        setChartData()
      }
    }
  })

  watch(lendingerUserAccountsHashMap, () =>
  {
    setLendingUserAccountList()
  })

  watch(lendingerUserMonthlyStatementsHashMap, () =>
  {
    userTabTokenMintAddressList.value = lendingerUserAvailableTokenMintAddressesHashMap.map.get(searchAddress.value + accountSelect.value.toString())
    if(selectedYearHashMap.size == 0 && userTabTokenMintAddressList.value?.length)
      setSelectedYearForTokenMintAddressHashMap(searchAddress.value, accountSelect.value.toString(), userTabTokenMintAddressList.value)

    countUserStableCoinAndCryptoCurrencyTabs()
    emitPortfolioRelatedTableHeight()
    setChartData()
  })

  function getGradient (ctx: any, chartArea:any)
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

  function setSelectedYearForTokenMintAddressHashMap(ownerAddress: string, accountIndex: string, tokenMintAddress: string[])
  {
    var tempHashMap = new Map<string, any>()

    for(var i=0; i<tokenMintAddress.length; i++)
    {
      const userAvailableYearsByTokenMintAddressList = lendingerUserAvailableYearsByTokenMintAddressHashMap.map.get(ownerAddress + accountIndex + tokenMintAddress[i])
      tempHashMap.set(tokenMintAddress[i], userAvailableYearsByTokenMintAddressList[userAvailableYearsByTokenMintAddressList.length - 1].yearAvailable)
    }

    selectedYearHashMap = tempHashMap
  }

  function updateSelectedYearForTokenMintAddressHashMap(tokenMintAddress: string, selectedYear: number)
  {
    selectedYearHashMap.set(tokenMintAddress, selectedYear)
    setChartData()
  }

  function setChartData()
  {
    const newDate = new Date()
    const currentYear = newDate.getFullYear()
    const currentMonth = newDate.getMonth() + 1
    var tempHashMap = new Map<string, any>()

    //Get Stable Coin Yearly Chart Data
    for(var i=0; i<StableCoins.length; i++)
    {
      if(!userTabTokenMintAddressList.value)
        return

      //Skip Token if User has no Tabs of it
      if(!userTabTokenMintAddressList.value.includes(StableCoins[i].tokenMintAddressString))
        continue

      var lastKnownActionType = 0
      var lastKnownActionAmount = 0
      var lastKnownActionTimeStamp = 0
      var previousBalance = 0
      const userAvailableYearsByTokenMintAddressList = lendingerUserAvailableYearsByTokenMintAddressHashMap.map.get(searchAddress.value +
      accountSelect.value.toString() +
      StableCoins[i].tokenMintAddressString)

      for(var year=userAvailableYearsByTokenMintAddressList[0].yearAvailable; year<=currentYear; year++)
      {
        var labels = []
        var balances = []
        var deposits = []
        var withdrawals = []
        var tempChartData = cloneDeep(baseChartData)
      
        //If current year, go up until the current month, otherwise cover the whole year
        if(year == currentYear)
        {
          for(var month=1; month<=currentMonth; month++)
          {
            labels.push(monthList[month-1].monthName)

            const userMontlyStatement = lendingerUserMonthlyStatementsHashMap.map.get(searchAddress.value +
            accountSelect.value.toString() +
            StableCoins[i].tokenMintAddressString +
            year.toString() +
            month.toString())

            if(userMontlyStatement)
            {
              const decimalAmount = tokenDecimalHashMap.get(StableCoins[i].tokenMintAddressString)
              lastKnownActionType = userMontlyStatement.lastLendingActivityType
              lastKnownActionAmount = Number(userMontlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
              lastKnownActionTimeStamp = Number(userMontlyStatement.lastLendingActivityTimeStamp)
              previousBalance = Number(userMontlyStatement.lifeTimeBalanceAmount) / Math.pow(10, decimalAmount)

              tempChartData.lastActionType = userMontlyStatement.lastLendingActivityType
              tempChartData.lastActionAmount = Number(userMontlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
              tempChartData.lastActionTimeStamp = Number(userMontlyStatement.lastLendingActivityTimeStamp)
              balances.push(previousBalance)
              deposits.push(Number(userMontlyStatement.monthlyDepositedAmount) / Math.pow(10, decimalAmount))
              withdrawals.push(Number(userMontlyStatement.monthlyWithdrawalAmount) / Math.pow(10, decimalAmount))
            }
            else
            {
              tempChartData.lastActionType = lastKnownActionType
              tempChartData.lastActionAmount = lastKnownActionAmount
              tempChartData.lastActionTimeStamp = lastKnownActionTimeStamp
              balances.push(previousBalance)
              deposits.push(0)
              withdrawals.push(0)
            }
          }

          tempChartData.labels = labels
          tempChartData.datasets[ChartIndex.Balances].data = balances
          tempChartData.datasets[ChartIndex.Deposits].data = deposits
          tempChartData.datasets[ChartIndex.Withdrawals].data = withdrawals

          tempHashMap.set(StableCoins[i].tokenMintAddressString + year.toString(), tempChartData)
        }
        else
        {
          for(var month=1; month<=12; month++)
          {
            labels.push(monthList[month-1].monthName)

            const userMontlyStatement = lendingerUserMonthlyStatementsHashMap.map.get(searchAddress.value +
            accountSelect.value.toString() +
            StableCoins[i].tokenMintAddressString +
            year.toString() +
            month.toString())

            if(userMontlyStatement)
            {
              const decimalAmount = tokenDecimalHashMap.get(StableCoins[i].tokenMintAddressString)
              lastKnownActionType = userMontlyStatement.lastLendingActivityType
              lastKnownActionAmount = Number(userMontlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
              lastKnownActionTimeStamp = Number(userMontlyStatement.lastLendingActivityTimeStamp)
              previousBalance = Number(userMontlyStatement.lifeTimeBalanceAmount) / Math.pow(10, decimalAmount)

              tempChartData.lastActionType = userMontlyStatement.lastLendingActivityType
              tempChartData.lastActionAmount = Number(userMontlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
              tempChartData.lastActionTimeStamp = Number(userMontlyStatement.lastLendingActivityTimeStamp)
              balances.push(previousBalance)
              deposits.push(Number(userMontlyStatement.monthlyDepositedAmount) / Math.pow(10, decimalAmount))
              withdrawals.push(Number(userMontlyStatement.monthlyWithdrawalAmount) / Math.pow(10, decimalAmount))
            }
            else
            {
              tempChartData.lastActionType = lastKnownActionType
              tempChartData.lastActionAmount = lastKnownActionAmount
              tempChartData.lastActionTimeStamp = lastKnownActionTimeStamp
              balances.push(previousBalance)
              deposits.push(0)
              withdrawals.push(0)
            }
          }

          tempChartData.labels = labels
          tempChartData.datasets[ChartIndex.Balances].data = balances
          tempChartData.datasets[ChartIndex.Deposits].data = deposits
          tempChartData.datasets[ChartIndex.Withdrawals].data = withdrawals

          tempHashMap.set(StableCoins[i].tokenMintAddressString + year.toString(), cloneDeep(tempChartData))
        }
      }
    }
    
    //Get CryptoCurrency Yearly Chart Data
    for(var i=0; i<CryptoCurrency.length; i++)
    {
      //Skip Token if User has no Tabs of it
      if(!userTabTokenMintAddressList.value.includes(CryptoCurrency[i].tokenMintAddressString) || !userTabTokenMintAddressList.value)
        continue

      var lastKnownActionType = 0
      var lastKnownActionAmount = 0
      var lastKnownActionTimeStamp = 0
      var previousBalance = 0
      const userAvailableYearsByTokenMintAddressList = lendingerUserAvailableYearsByTokenMintAddressHashMap.map.get(searchAddress.value +
      accountSelect.value.toString() +
      CryptoCurrency[i].tokenMintAddressString)

      for(var year=userAvailableYearsByTokenMintAddressList[0].yearAvailable; year<=currentYear; year++)
      {
        var labels = []
        var balances = []
        var deposits = []
        var withdrawals = []
        var tempChartData = baseChartData

        //If current year, go up until the current month, otherwise cover the whole year
        if(year == currentYear)
        {
          for(var month=1; month<=currentMonth; month++)
          {
            labels.push(monthList[month-1].monthName)

            const userMontlyStatement = lendingerUserMonthlyStatementsHashMap.map.get(searchAddress.value +
            accountSelect.value.toString() +
            CryptoCurrency[i].tokenMintAddressString +
            year.toString() +
            month.toString())

            if(userMontlyStatement)
            {
              const decimalAmount = tokenDecimalHashMap.get(CryptoCurrency[i].tokenMintAddressString)
              lastKnownActionType = userMontlyStatement.lastLendingActivityType
              lastKnownActionAmount = Number(userMontlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
              lastKnownActionTimeStamp = Number(userMontlyStatement.lastLendingActivityTimeStamp)
              previousBalance = Number(userMontlyStatement.lifeTimeBalanceAmount) / Math.pow(10, decimalAmount)

              tempChartData.lastActionType = userMontlyStatement.lastLendingActivityType
              tempChartData.lastActionAmount = Number(userMontlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
              tempChartData.lastActionTimeStamp = Number(userMontlyStatement.lastLendingActivityTimeStamp)
              balances.push(previousBalance)
              deposits.push(Number(userMontlyStatement.monthlyDepositedAmount) / Math.pow(10, decimalAmount))
              withdrawals.push(Number(userMontlyStatement.monthlyWithdrawalAmount) / Math.pow(10, decimalAmount))
            }
            else
            {
              tempChartData.lastActionType = lastKnownActionType
              tempChartData.lastActionAmount = lastKnownActionAmount
              tempChartData.lastActionTimeStamp = lastKnownActionTimeStamp
              balances.push(previousBalance)
              deposits.push(0)
              withdrawals.push(0)
            }
          }

          tempChartData.labels = labels
          tempChartData.datasets[ChartIndex.Balances].data = balances
          tempChartData.datasets[ChartIndex.Deposits].data = deposits
          tempChartData.datasets[ChartIndex.Withdrawals].data = withdrawals

          tempHashMap.set(CryptoCurrency[i].tokenMintAddressString + year.toString(), tempChartData)
        }
        else
        {
          for(var month=1; month<=12; month++)
          {
            labels.push(monthList[month-1].monthName)

            const userMontlyStatement = lendingerUserMonthlyStatementsHashMap.map.get(searchAddress.value +
            accountSelect.value.toString() +
            CryptoCurrency[i].tokenMintAddressString +
            year.toString() +
            month.toString())

            if(userMontlyStatement)
            {
              const decimalAmount = tokenDecimalHashMap.get(CryptoCurrency[i].tokenMintAddressString)
              lastKnownActionType = userMontlyStatement.lastLendingActivityType
              lastKnownActionAmount = Number(userMontlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
              lastKnownActionTimeStamp = Number(userMontlyStatement.lastLendingActivityTimeStamp)
              previousBalance = Number(userMontlyStatement.lifeTimeBalanceAmount) / Math.pow(10, decimalAmount)

              tempChartData.lastActionType = userMontlyStatement.lastLendingActivityType
              tempChartData.lastActionAmount = Number(userMontlyStatement.lastLendingActivityAmount) / Math.pow(10, decimalAmount)
              tempChartData.lastActionTimeStamp = Number(userMontlyStatement.lastLendingActivityTimeStamp)
              balances.push(previousBalance)
              deposits.push(Number(userMontlyStatement.monthlyDepositedAmount) / Math.pow(10, decimalAmount))
              withdrawals.push(Number(userMontlyStatement.monthlyWithdrawalAmount) / Math.pow(10, decimalAmount))
            }
            else
            {
              tempChartData.lastActionType = lastKnownActionType
              tempChartData.lastActionAmount = lastKnownActionAmount
              tempChartData.lastActionTimeStamp = lastKnownActionTimeStamp
              balances.push(previousBalance)
              deposits.push(0)
              withdrawals.push(0)
            }
          }

          tempChartData.labels = labels
          tempChartData.datasets[ChartIndex.Balances].data = balances
          tempChartData.datasets[ChartIndex.Deposits].data = deposits
          tempChartData.datasets[ChartIndex.Withdrawals].data = withdrawals

          tempHashMap.set(CryptoCurrency[i].tokenMintAddressString + year.toString(), cloneDeep(tempChartData))
        }
      }
    }

    selectedUserChartDataHashMap.value = tempHashMap
  }

  function getChartData(tokenMintAddress: string)
  {
    return selectedUserChartDataHashMap.value.get(tokenMintAddress + selectedYearHashMap.get(tokenMintAddress))
  }

  const gradientOffset = ref(0)
  function startGradientAnimation()
  {
    intervalId = setInterval(() => {
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

  function checkNewAddress()
  {
    if(addressToCheck.value == searchAddress.value)
      return

    searchAddress.value = addressToCheck.value

    displayName.value = getUserDisplayName(searchAddress.value)
    possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(searchAddress.value)

    if(lendingerUserMonthlyStatementsHashMap.map)
    {
      userTabTokenMintAddressList.value = lendingerUserAvailableTokenMintAddressesHashMap.map.get(searchAddress.value + '0')

      accountSelect.value = 0

      setSelectedYearForTokenMintAddressHashMap(searchAddress.value, '0', userTabTokenMintAddressList.value)
      countUserStableCoinAndCryptoCurrencyTabs()
      emitPortfolioRelatedTableHeight()
      setLendingUserAccountList()
      setChartData()
    } 
  }

  function countUserStableCoinAndCryptoCurrencyTabs()
  {
    userStableCoinTabCount.value = 0
    userCryptoCurrencyTabCount.value = 0

    for(var i=0; i<StableCoins.length; i++)
      if(userTabTokenMintAddressList.value?.includes(StableCoins[i].tokenMintAddressString))
        userStableCoinTabCount.value += 1

    for(var i=0; i<CryptoCurrency.length; i++)
      if(userTabTokenMintAddressList.value?.includes(CryptoCurrency[i].tokenMintAddressString))
        userCryptoCurrencyTabCount.value += 1
  }

  function updateStoredSelectedAccount()
  {
    if(addressToCheck.value == connectedWallet.addressString)
    {
      connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
      localStorage.setItem("selectedLendingAccountIndex", accountSelect.value.toString())
    }

    userTabTokenMintAddressList.value = lendingerUserAvailableTokenMintAddressesHashMap.map.get(searchAddress.value + accountSelect.value.toString())
    countUserStableCoinAndCryptoCurrencyTabs()
    emitPortfolioRelatedTableHeight()
    setChartData()
  }

  function setLendingUserAccountList()
  {
    if(lendingerUserAccountsHashMap.map)
    {
      const userAccountList = lendingerUserAccountsHashMap.map.get(searchAddress.value)
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

  function emitPortfolioRelatedTableHeight()
  {
    emits("portfolioHeightChange", searchAddress.value, userStableCoinTabCount.value, userCryptoCurrencyTabCount.value, isBrowsingAllUsers.value)
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

  @media screen and (min-width: 1285.1px)
  { 
    .hHeaderDisplay
    {
      display: flex;
      justify-content: space-around;
    }
    .vHeaderDisplay
    {
      display: none
    }
  }
  @media screen and (max-width: 1285px)
  { 
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