<script lang="ts">
  import * as anchor from "@coral-xyz/anchor"
  import { tokenReserves, tokenReserveHashMap, tokenReservesHashMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarkets,
    subMarketsHashMap,
    subMarketOwnerHashMap,
    subMarketByTokenMintAddressAndOwnerHashMap,
    tokenReserveSubMarketListHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import type { SubMarketOwner } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserHashMap,
    lendingUserAccountsHashMap,
    lendingUserTabAccountsHashMap,
    lendingUserTabAccountListHashMap,
    lendingUserRemainingTabAccountListHashMap,
    lendingUserMonthlyStatements,
    lendingUserAvailableStableCoinStatementsBySubMarketsHashMap,
    lendingUserAvailableStableCoinYearsBySubMarketHashMap,
    lendingUserAvailableCryptoCurrencyStatementsBySubMarketsHashMap,
    lendingUserAvailableCryptoCurrencyYearsBySubMarketHashMap,
    lendingUserMonthlyStatementsHashMap,
    lendingLeaderBoardTable } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
  import { getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { trimAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { sleep, MAX_RETRY_FETCH, RETRY_TIME_OUT, RETRY_MESSAGE, ERROR_429 } from '/src/assets/helperFunctions/sleep.ts'
  import { PublicKey } from "@solana/web3.js"
  import cloneDeep from 'lodash/cloneDeep'

  export async function getLendingProtocol()
  {
    console.log("Getting Lending Protocol")

    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.lending.lendingProgram.account.lendingProtocol.fetch(getLendingProtocolPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Lending Protocol Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getLendingProtocolCEOAccount()
  {
    console.log("Getting Lending Protocol CEO Account")

    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.lending.lendingProgram.account.lendingProtocolCeo.fetch(getLendingProtocolCEOAccountPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Lending CEO Account Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getTokenReserves()
  {
    console.log("Getting Token Reserves")

    var list = []
    const tokenReserves = await getTokenReservesWrapper()

    for(var i=0; i<tokenReserves.length; i++)
    {
      const tokenReserve = tokenReserves[i].account

      //Convert Deposit Amount To Decimal from Fixed Point
      const decimalAmount = tokenDecimalHashMap.get(tokenReserve.tokenMintAddress.toBase58())
      tokenReserve.depositedAmount = (Number(tokenReserve.depositedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount)
      tokenReserve.borrowedAmount = (Number(tokenReserve.borrowedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount)

      list.push(tokenReserve)
    }

    return list
  }

  async function getTokenReservesWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.lending.lendingProgram.account.tokenReserve.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export function setTokenReserveHashMap()
  {
    console.log("Updating Token Reserve Hash Map")
    
    var hashmap = new Map<string, any>()

    for(var i=0; i<tokenReserves.data.length; i++)
    {
      const tokenReserve = tokenReserves.data[i]
      const decimalAmount = tokenDecimalHashMap.get(tokenReserve.tokenMintAddress.toBase58())

      //Convert Uncollected Solvency Fee Amounts To Decimal from Fixed Point
      tokenReserve.uncollectedSolvencyInsuranceFeesAmount = (Number(tokenReserve.uncollectedSolvencyInsuranceFeesAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount)

      //Convert Fee Rate To Decimal from Fixed Point
      tokenReserve.solvencyInsuranceFeeRate = (tokenReserve.solvencyInsuranceFeeRate / 100)

      hashmap.set(tokenReserves.data[i].tokenMintAddress.toBase58(), tokenReserve)
    }

    tokenReservesHashMap.map = hashmap
  }

  export async function getSubMarkets()
  {
    console.log("Getting SubMarkets")
    
    var subMarketsList: any = []
    var subMarketsMap = new Map<string, any>()
    var subMarketOwnerMap = new Map<string, any>()
    var subMarketOwnerByTokenMintAddressMap = new Map<string, any>()
    var tokenReserveMap = new Map<string, any>()

    const allSubMarkets = await getSubMarketsWrapper()

    //Create TokenReserve/SubMarket hash map and SubMarket list for tables
    for(var i=0; i<allSubMarkets.length; i++)
    {
      const subMarket = allSubMarkets[i].account

      //Populate Token Reserve hash map
      var ownerTokenReserveList: any = []

      //Convert Deposit, Fees Generated, and Uncollected Fee Amounts To Decimal from Fixed Point
      const decimalAmount = tokenDecimalHashMap.get(subMarket.tokenMintAddress.toBase58())
      subMarket.depositedAmount = (Number(subMarket.depositedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount)
      subMarket.subMarketFeesGeneratedAmount = (Number(subMarket.subMarketFeesGeneratedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount)
      subMarket.uncollectedSubMarketFeesAmount = (Number(subMarket.uncollectedSubMarketFeesAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount)

      //Convert Fee Rate To Decimal from Fixed Point
      subMarket.feeOnInterestEarnedRate = (subMarket.feeOnInterestEarnedRate / 100)

      //Add ceo name for filtering
      if(subMarket.owner.toBase58() == adminAccounts.lendingCEOAddressString)
        subMarket.ceoName = "fdr-3"

      const previousTokenReserveList = tokenReserveMap.get(subMarket.tokenMintAddress.toBase58())
      if(previousTokenReserveList)
        ownerTokenReserveList = previousTokenReserveList

      ownerTokenReserveList.push(subMarket)

      tokenReserveMap.set(subMarket.tokenMintAddress.toBase58(), ownerTokenReserveList)

      //Populate SubMarket Owner hash map
      var subMarketOwner: SubMarketOwner = 
      {
        subMarketCount: 0,
        ownerSubMarketList: []
      }

      const previousSubMarketOwnerData = subMarketOwnerMap.get(subMarket.owner.toBase58())
      if(previousSubMarketOwnerData)
        subMarketOwner = previousSubMarketOwnerData
  
      subMarketOwner.ownerSubMarketList.push(subMarket)

      let newIndex = subMarketOwner.ownerSubMarketList.length - 1

      const tokenFrontEndProperties = tokenReserveHashMap.get(subMarketOwner.ownerSubMarketList[newIndex].tokenMintAddress.toBase58())

      subMarketOwner.ownerSubMarketList[newIndex].feeCollectorAddress = subMarketOwner.ownerSubMarketList[newIndex].feeCollectorAddress.toBase58()
      //subMarketOwner.ownerSubMarketList[newIndex].tokenSVG = tokenFrontEndProperties.svg//This has to be marked raw in the Owners Table since it is cloned at the end of this fuction. The cloning is for allowing users to edit the table without updating the original hashmap. It was originally marked Raw in the TokenReserves.vue file
      subMarketOwner.ownerSubMarketList[newIndex].tokenName = tokenFrontEndProperties.name
      subMarketOwner.ownerSubMarketList[newIndex].svgSource = tokenFrontEndProperties.source
      subMarketOwner.subMarketCount = subMarketOwner.ownerSubMarketList.length

      subMarketOwnerMap.set(subMarket.owner.toBase58(), subMarketOwner)

      //Populate SubMarket Owner by TokenMintAddress hash map
      var list = []

      const previousSubMarketOwnerByTokenMintAddressData = subMarketOwnerByTokenMintAddressMap.get(subMarket.tokenMintAddress.toBase58() + subMarket.owner.toBase58())
      if(previousSubMarketOwnerByTokenMintAddressData)
        list = previousSubMarketOwnerByTokenMintAddressData
      
      list.push(subMarket)
      list = list.sort((a: any, b: any) => a.subMarketIndex - b.subMarketIndex) 
      subMarketOwnerByTokenMintAddressMap.set(subMarket.tokenMintAddress.toBase58() + subMarket.owner.toBase58(), list)

      //Populate SubMarket hash map
      subMarketsMap.set
      (
        subMarket.tokenMintAddress.toBase58() +
        subMarket.owner.toBase58() +
        subMarket.subMarketIndex.toString(), 
        subMarket
      )

      //Add SubMarket to overall list
      subMarketsList.push(subMarket)
    }

    console.log("Setting SubMarket Hash Maps")

    tokenReserveSubMarketListHashMap.map = cloneDeep(tokenReserveMap)
    subMarketsHashMap.map = cloneDeep(subMarketsMap)
    subMarketOwnerHashMap.map = cloneDeep(subMarketOwnerMap)
    subMarketByTokenMintAddressAndOwnerHashMap.map = cloneDeep(subMarketOwnerByTokenMintAddressMap) 

    subMarkets.ownerCount = subMarketOwnerHashMap.map.size

    return subMarketsList
  }


  async function getSubMarketsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.lending.lendingProgram.account.subMarket.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export function getUserNextSubMarketIndex(tokenMintAddress: string, subMarketOwner: string)
  {
    const userSubMarketListByTokenMintAddress = subMarketByTokenMintAddressAndOwnerHashMap.map.get(tokenMintAddress + subMarketOwner)

    if(userSubMarketListByTokenMintAddress)
      return userSubMarketListByTokenMintAddress.length
    else
      return 0
  }

  export async function setLendingUserAccountHashMap()
  {
    console.log("Setting Lending User Account Hashmap")

    var lendingUserAccountHashMap = new Map<string, any>()
    var lendingUserAccountListHashMap = new Map<string, any>()
    const lendingUserAccounts = await getLendingUserAccountsWrapper()

    for(var i=0; i<lendingUserAccounts.length; i++)
    {
      var list = []
      const previousLendingUserList = lendingUserAccountListHashMap.get(lendingUserAccounts[i].account.owner.toBase58())

      if(previousLendingUserList)
        list = previousLendingUserList

      list.push(lendingUserAccounts[i].account)
      list = list.sort((a: any, b: any) => a.userAccountIndex - b.userAccountIndex) 

      lendingUserAccountHashMap.set(lendingUserAccounts[i].account.owner.toBase58() + lendingUserAccounts[i].account.userAccountIndex.toString(), lendingUserAccounts[i].account)
      lendingUserAccountListHashMap.set(lendingUserAccounts[i].account.owner.toBase58(), list)
    }

    lendingUserHashMap.map = lendingUserAccountHashMap
    lendingUserAccountsHashMap.map = lendingUserAccountListHashMap
  }

  async function getLendingUserAccountsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.lending.lendingProgram.account.lendingUserAccount.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function setLendingUserTabHashMaps()
  {
    console.log("Setting Lending User Tab Hashmaps")

    var userTabAccountsHashMap = new Map<string, any>()
    var userTabListHashMap = new Map<string, any>()
    var userRemainingAccountsTabListHashMap = new Map<string, any>()
    
    const lendingUserTabs = await getLendingUserTabsWrapper()
    
    for(var i=0; i<lendingUserTabs.length; i++)
    {
      const lendingUserTabAccount = lendingUserTabs[i].account
      const lendingUserTabAccountPDA = lendingUserTabs[i].publicKey

      //Set user tab hash map
      userTabAccountsHashMap.set(lendingUserTabAccount.tokenMintAddress.toBase58() +
      lendingUserTabAccount.subMarketOwnerAddress.toBase58() +
      lendingUserTabAccount.subMarketIndex.toString() +
      lendingUserTabAccount.owner.toBase58() +
      lendingUserTabAccount.userAccountIndex.toString(), lendingUserTabAccount)

      //Set user  tab account list hash map
      var list = []
      const previousLendingUserTabList = userTabListHashMap.get(lendingUserTabAccount.owner.toBase58() + lendingUserTabAccount.userAccountIndex.toString())

      if(previousLendingUserTabList)
        list = previousLendingUserTabList

      list.push(lendingUserTabAccount)
      list = list.sort((a: any, b: any) => a.userTabAccountIndex - b.userTabAccountIndex) 

      userTabListHashMap.set(lendingUserTabAccount.owner.toBase58() + lendingUserTabAccount.userAccountIndex.toString(), list)

      //Set user remaining tab acout list hash map
      var list = []
      const previousLendingUserRemainingTabList = userRemainingAccountsTabListHashMap.get(lendingUserTabAccount.owner.toBase58() + lendingUserTabAccount.userAccountIndex.toString())

      if(previousLendingUserRemainingTabList)
        list = previousLendingUserRemainingTabList

      const lendingUserTabRemainingAccount = 
      {
        pubkey: lendingUserTabAccountPDA,
        pythPriceUpdateKey: lendingUserTabAccount.pythPriceUpdateKey,
        userTabAccountIndex: lendingUserTabAccount.userTabAccountIndex,
        tokenMintAddress: lendingUserTabAccount.tokenMintAddress.toString(),
        isSigner: false,
        isWritable: true
      }

      list.push(lendingUserTabRemainingAccount)
      list = list.sort((a: any, b: any) => a.userTabAccountIndex - b.userTabAccountIndex) 

      userRemainingAccountsTabListHashMap.set(lendingUserTabAccount.owner.toBase58() + lendingUserTabAccount.userAccountIndex.toString(), list)
    }

    lendingUserTabAccountsHashMap.map = userTabAccountsHashMap
    lendingUserTabAccountListHashMap.map = userTabListHashMap
    lendingUserRemainingTabAccountListHashMap.map = userRemainingAccountsTabListHashMap
  }

  async function getLendingUserTabsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.lending.lendingProgram.account.lendingUserTabAccount.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function setLendingUserPortfolioHashMaps()
  {
    if(!lendingUserMonthlyStatements.data)
      return

    console.log("Setting Lending User Portfolio Hashmaps")

    var availableStableCoinStatementsBySubMarketsHashMap = new Map<string, any>()
    var availableStableCoinYearStatementsBySubMarketHashMap = new Map<string, any>()
    var availableCryptoCurrencyStatementsBySubMarketsHashMap = new Map<string, any>()
    var availableCryptoCurrencyYearStatementsBySubMarketHashMap = new Map<string, any>()

    //stable Coins
    //These loops are done this way to keep the portfolio charts in a certain order
    for(var i=0; i<StableCoins.length; i++)
    {
      for(var j=0; j<lendingUserMonthlyStatements.data.length; j++)
      {
        const lendingUserMonthlyStatementAccount = lendingUserMonthlyStatements.data[j].account
        const tokenMintAddress = lendingUserMonthlyStatementAccount.tokenMintAddress.toString()

        if(StableCoins[i].tokenMintAddressString != tokenMintAddress)
          continue

        const subMarketOwnerAddress = lendingUserMonthlyStatementAccount.subMarketOwnerAddress.toString()
        const subMarketIndex = lendingUserMonthlyStatementAccount.subMarketIndex
        const owner = lendingUserMonthlyStatementAccount.owner.toString()
        const userAccountIndex = lendingUserMonthlyStatementAccount.userAccountIndex.toString()
        const subMarket= subMarketsHashMap.map.get(tokenMintAddress + subMarketOwnerAddress + subMarketIndex.toString())

        //Set User Available SubMarket Hash Map
        var availableStatementsBySubMarketData = 
        {
          tokenMintAddress: tokenMintAddress,
          subMarketOwnerAddress: subMarketOwnerAddress,
          subMarketOwnerAddressTrimmed: trimAddress(subMarketOwnerAddress),
          subMarketIndex: subMarketIndex,
          subMarketFee: subMarket.feeOnInterestEarnedRate,
          sevenDayCalculatedUserInterestEarned: 0,
          sevenDayInterestEarnedValue: 0,
          calculatedUserInterestEarned: 0,
          interestEarnedValue: 0
        }
        var list = []
        const previousLendingUserAvailableSubMarketList = availableStableCoinStatementsBySubMarketsHashMap.get(owner + userAccountIndex)

        if(previousLendingUserAvailableSubMarketList)
        {
          var previousEntryFound = false

          for(var k=0; k<previousLendingUserAvailableSubMarketList.length; k++)
            if(previousLendingUserAvailableSubMarketList[k].tokenMintAddress == availableStatementsBySubMarketData.tokenMintAddress &&
            previousLendingUserAvailableSubMarketList[k].subMarketOwnerAddress == availableStatementsBySubMarketData.subMarketOwnerAddress &&
            previousLendingUserAvailableSubMarketList[k].subMarketIndex == availableStatementsBySubMarketData.subMarketIndex)
              previousEntryFound = true

          list = previousLendingUserAvailableSubMarketList

          if(!previousEntryFound)
          {
            list.push(availableStatementsBySubMarketData)
            availableStableCoinStatementsBySubMarketsHashMap.set(owner + userAccountIndex, list) 
          }
        }
        else
          availableStableCoinStatementsBySubMarketsHashMap.set(owner + userAccountIndex, [availableStatementsBySubMarketData]) 

        //Set User Available Statement Year by Sub Market Hash Map
        var list = []
        const previousLendingUserAvailableYearByTokenMintAddressList = availableStableCoinYearStatementsBySubMarketHashMap.get(tokenMintAddress +
        subMarketOwnerAddress +
        subMarketIndex +
        owner +
        userAccountIndex)
        const availableYearBySubMarketObject =
        {
          yearAvailable: lendingUserMonthlyStatementAccount.statementYear
        }

        if(previousLendingUserAvailableYearByTokenMintAddressList)
        {
          list = previousLendingUserAvailableYearByTokenMintAddressList
          var previousEntryFound = false
          for(var k=0; k<previousLendingUserAvailableYearByTokenMintAddressList.length; k++)
            if(previousLendingUserAvailableYearByTokenMintAddressList[k].statementYear == lendingUserMonthlyStatementAccount.statementYear)
              previousEntryFound = true
            
          if(!previousEntryFound)
          {
            list.push(availableYearBySubMarketObject)
            list = list.sort((a: any, b: any) => a.yearAvailable - b.yearAvailable)
            availableStableCoinYearStatementsBySubMarketHashMap.set(tokenMintAddress +
            subMarketOwnerAddress +
            subMarketIndex +
            owner +
            lendingUserMonthlyStatementAccount.userAccountIndex.toString(), list) 
          }
        }
        else
          availableStableCoinYearStatementsBySubMarketHashMap.set(tokenMintAddress +
          subMarketOwnerAddress +
          subMarketIndex +
          owner +
          lendingUserMonthlyStatementAccount.userAccountIndex.toString(), [availableYearBySubMarketObject])
      }
    }

    //Crypto Currencies
    //These loops are done this way to keep the portfolio charts in a certain order
    for(var i=0; i<CryptoCurrency.length; i++)
    {
      for(var j=0; j<lendingUserMonthlyStatements.data.length; j++)
      {
        const lendingUserMonthlyStatementAccount = lendingUserMonthlyStatements.data[j].account
        const tokenMintAddress = lendingUserMonthlyStatementAccount.tokenMintAddress.toString()

        if(CryptoCurrency[i].tokenMintAddressString != tokenMintAddress)
          continue

        const subMarketOwnerAddress = lendingUserMonthlyStatementAccount.subMarketOwnerAddress.toString()
        const subMarketIndex = lendingUserMonthlyStatementAccount.subMarketIndex
        const owner = lendingUserMonthlyStatementAccount.owner.toString()
        const userAccountIndex = lendingUserMonthlyStatementAccount.userAccountIndex.toString()
        const subMarket= subMarketsHashMap.map.get(tokenMintAddress + subMarketOwnerAddress + subMarketIndex.toString())

        //Set User Available SubMarket Hash Map
        var availableStatementsBySubMarketData = 
        {
          tokenMintAddress: tokenMintAddress,
          subMarketOwnerAddress: subMarketOwnerAddress,
          subMarketOwnerAddressTrimmed: trimAddress(subMarketOwnerAddress),
          subMarketIndex: subMarketIndex,
          subMarketFee: subMarket.feeOnInterestEarnedRate,
          sevenDayCalculatedUserInterestEarned: 0,
          sevenDayInterestEarnedValue: 0,
          calculatedUserInterestEarned: 0,
          interestEarnedValue: 0
        }
        var list = []
        const previousLendingUserAvailableSubMarketList = availableCryptoCurrencyStatementsBySubMarketsHashMap.get(owner + userAccountIndex)

        if(previousLendingUserAvailableSubMarketList)
        {
          var previousEntryFound = false

          for(var k=0; k<previousLendingUserAvailableSubMarketList.length; k++)
            if(previousLendingUserAvailableSubMarketList[k].tokenMintAddress == availableStatementsBySubMarketData.tokenMintAddress &&
            previousLendingUserAvailableSubMarketList[k].subMarketOwnerAddress == availableStatementsBySubMarketData.subMarketOwnerAddress &&
            previousLendingUserAvailableSubMarketList[k].subMarketIndex == availableStatementsBySubMarketData.subMarketIndex)
              previousEntryFound = true

          list = previousLendingUserAvailableSubMarketList

          if(!previousEntryFound)
          {
            list.push(availableStatementsBySubMarketData)
            availableCryptoCurrencyStatementsBySubMarketsHashMap.set(owner + userAccountIndex, list) 
          }
        }
        else
          availableCryptoCurrencyStatementsBySubMarketsHashMap.set(owner + userAccountIndex, [availableStatementsBySubMarketData]) 

        //Set User Available Statement Year by Sub Market Hash Map
        var list = []
        const previousLendingUserAvailableYearByTokenMintAddressList = availableCryptoCurrencyYearStatementsBySubMarketHashMap.get(tokenMintAddress +
        subMarketOwnerAddress +
        subMarketIndex +
        owner +
        userAccountIndex)
        const availableYearBySubMarketObject =
        {
          yearAvailable: lendingUserMonthlyStatementAccount.statementYear
        }

        if(previousLendingUserAvailableYearByTokenMintAddressList)
        {
          list = previousLendingUserAvailableYearByTokenMintAddressList
          var previousEntryFound = false
          for(var k=0; k<previousLendingUserAvailableYearByTokenMintAddressList.length; k++)
            if(previousLendingUserAvailableYearByTokenMintAddressList[k].statementYear == lendingUserMonthlyStatementAccount.statementYear)
              previousEntryFound = true
            
          if(!previousEntryFound)
          {
            list.push(availableYearBySubMarketObject)
            list = list.sort((a: any, b: any) => a.yearAvailable - b.yearAvailable)
            availableCryptoCurrencyYearStatementsBySubMarketHashMap.set(tokenMintAddress +
            subMarketOwnerAddress +
            subMarketIndex +
            owner +
            lendingUserMonthlyStatementAccount.userAccountIndex.toString(), list) 
          }
        }
        else
          availableCryptoCurrencyYearStatementsBySubMarketHashMap.set(tokenMintAddress +
          subMarketOwnerAddress +
          subMarketIndex +
          owner +
          lendingUserMonthlyStatementAccount.userAccountIndex.toString(), [availableYearBySubMarketObject])
      }
    }

    lendingUserAvailableStableCoinStatementsBySubMarketsHashMap.map = availableStableCoinStatementsBySubMarketsHashMap
    lendingUserAvailableStableCoinYearsBySubMarketHashMap.map = availableStableCoinYearStatementsBySubMarketHashMap
    lendingUserAvailableCryptoCurrencyStatementsBySubMarketsHashMap.map = availableCryptoCurrencyStatementsBySubMarketsHashMap
    lendingUserAvailableCryptoCurrencyYearsBySubMarketHashMap.map = availableCryptoCurrencyYearStatementsBySubMarketHashMap
  }

  export async function setMonthlyStementHashMapAndLendingLeaderBoard()
  {
    if(!lendingUserMonthlyStatements.data)
      return

    console.log("Setting Monthly Statement HashMap and Lending Leader Board Data")

    var monthlyStatementsHashMap = new Map<string, any>()
    var leaderBoardData: any[] = []

    for(var i=0; i<lendingUserMonthlyStatements.data.length; i++)
    {
      const lendingUserMonthlyStatementAccount = lendingUserMonthlyStatements.data[i].account

      const tokenMintAddress = lendingUserMonthlyStatementAccount.tokenMintAddress.toString()
      const subMarketOwnerAddress = lendingUserMonthlyStatementAccount.subMarketOwnerAddress.toString()
      const subMarketIndex = lendingUserMonthlyStatementAccount.subMarketIndex.toString()
      const owner = lendingUserMonthlyStatementAccount.owner.toString()
      const userAccountIndex = lendingUserMonthlyStatementAccount.userAccountIndex.toString()
      const statementYear = lendingUserMonthlyStatementAccount.statementYear.toString()
      const statementMonth = lendingUserMonthlyStatementAccount.statementMonth.toString()

      //Set User Monthly Statements hash map
      monthlyStatementsHashMap.set(tokenMintAddress +
      subMarketOwnerAddress +
      subMarketIndex +
      owner +
      userAccountIndex +
      statementYear +
      statementMonth, lendingUserMonthlyStatementAccount)

      //Set leader board data
      var existingOwner = undefined
      var existingOwnerIndex = 0
      var existingAccountEntry = undefined
      var existingAccountEntryIndex = 0

      //Check if there is an existing monthly statement for the current account index being checked and save the entry for year and month comparison
      for(var j=0; j<leaderBoardData.length; j++)
      {
        if(leaderBoardData[j].owner == lendingUserMonthlyStatementAccount.owner.toString())
        {
          existingOwner = leaderBoardData[j].owner
          existingOwnerIndex = j
          
          for(var k=0; k<leaderBoardData[j].accountListWithLastestMonthlyStatement.length; k++)
          {
            if(leaderBoardData[j].accountListWithLastestMonthlyStatement[k].tokenMintAddress == tokenMintAddress &&
            leaderBoardData[j].accountListWithLastestMonthlyStatement[k].subMarketOwnerAddress == subMarketOwnerAddress &&
            leaderBoardData[j].accountListWithLastestMonthlyStatement[k].subMarketIndex == subMarketIndex &&
            leaderBoardData[j].accountListWithLastestMonthlyStatement[k].accountIndex == lendingUserMonthlyStatementAccount.userAccountIndex)
            {
              existingAccountEntry = leaderBoardData[j].accountListWithLastestMonthlyStatement[k]
              existingAccountEntryIndex = k
            } 
          }
        }
      }

      if(existingOwner)
      {
        if(existingAccountEntry)
        {
          //Replace Sub Account TokenMintAddres Monthly Statement with more recent one if found
          if(lendingUserMonthlyStatementAccount.statementYear > existingAccountEntry.statementYear ||
          (lendingUserMonthlyStatementAccount.statementYear == existingAccountEntry.statementYear && lendingUserMonthlyStatementAccount.statementMonth > existingAccountEntry.statementMonth))
          {
            const lendingUserAccount = lendingUserHashMap.map.get(lendingUserMonthlyStatementAccount.owner.toString() + lendingUserMonthlyStatementAccount.userAccountIndex.toString())
            const decimalAmount = tokenDecimalHashMap.get(tokenMintAddress)
            const tokenFrontEndProperties = tokenReserveHashMap.get(tokenMintAddress)
      
            var moreRecentAccountEntry =
            {
              owner: lendingUserMonthlyStatementAccount.owner.toString(),
              accountIndex: lendingUserMonthlyStatementAccount.userAccountIndex,
              accountName: lendingUserAccount.accountName,
              tokenMintAddress: tokenMintAddress,
              subMarketOwnerAddress: subMarketOwnerAddress,
              subMarketIndex: subMarketIndex,
              trimmedSubMarketOwnerAddress: trimAddress(subMarketOwnerAddress),
              tokenSVG: tokenFrontEndProperties.svg,
              tokenName: tokenFrontEndProperties.name,
              statementMonth: lendingUserMonthlyStatementAccount.statementMonth,
              statementYear: lendingUserMonthlyStatementAccount.statementYear,
              interestEarnedAmount: (Number(lendingUserMonthlyStatementAccount.snapShotInterestEarnedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
              interestEarnedValue: 0,
              interestEarnedValueString: "$0.00",
              interestAccruedAmount: (Number(lendingUserMonthlyStatementAccount.snapShotInterestAccruedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
              interestAccruedValue: 0,
              interestAccruedValueString: "$0.00",
              depositedAmount: (Number(lendingUserMonthlyStatementAccount.snapShotBalanceAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
              depositedValue: 0,
              depositedValueString: "$0.00",
              borrowedAmount: (Number(lendingUserMonthlyStatementAccount.snapShotDebtAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
              borrowedValue: 0,
              borrowedValueString: "$0.00",
              repaidAmount: (Number(lendingUserMonthlyStatementAccount.snapShotRepaidDebtAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
              repaidValue: 0,
              repaidValueString: "$0.00",
              liquidatorAmount: (Number(lendingUserMonthlyStatementAccount.snapShotLiquidatorAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
              liquidatorValue: 0,
              liquidatorValueString: "$0.00",
              liquidatedAmount: (Number(lendingUserMonthlyStatementAccount.snapShotLiquidatedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
              liquidatedValue: 0,
              liquidatedValueString: "$0.00",
            }

            leaderBoardData[existingOwnerIndex].accountListWithLastestMonthlyStatement[existingAccountEntryIndex] = moreRecentAccountEntry
          }
        }
        else
        {
          //Add New Sub Account for Existing User to Lending Leader Board
          const lendingUserAccount = lendingUserHashMap.map.get(lendingUserMonthlyStatementAccount.owner.toString() + lendingUserMonthlyStatementAccount.userAccountIndex.toString())
          const decimalAmount = tokenDecimalHashMap.get(tokenMintAddress)
          const tokenFrontEndProperties = tokenReserveHashMap.get(tokenMintAddress)

          var newAccountEntry =
          {
            owner: lendingUserMonthlyStatementAccount.owner.toString(),
            accountIndex: lendingUserMonthlyStatementAccount.userAccountIndex,
            accountName: lendingUserAccount.accountName,
            tokenMintAddress: tokenMintAddress,
            subMarketOwnerAddress: subMarketOwnerAddress,
            subMarketIndex: subMarketIndex,
            trimmedSubMarketOwnerAddress: trimAddress(subMarketOwnerAddress),
            tokenSVG: tokenFrontEndProperties.svg,
            tokenName: tokenFrontEndProperties.name,
            statementMonth: lendingUserMonthlyStatementAccount.statementMonth,
            statementYear: lendingUserMonthlyStatementAccount.statementYear,
            interestEarnedAmount: (Number(lendingUserMonthlyStatementAccount.snapShotInterestEarnedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            interestEarnedValue: 0,
            interestEarnedValueString: "$0.00",
            interestAccruedAmount: (Number(lendingUserMonthlyStatementAccount.snapShotInterestAccruedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            interestAccruedValue: 0,
            interestAccruedValueString: "$0.00",
            depositedAmount: (Number(lendingUserMonthlyStatementAccount.snapShotBalanceAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            depositedValue: 0,
            depositedValueString: "$0.00",
            borrowedAmount: (Number(lendingUserMonthlyStatementAccount.snapShotDebtAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            borrowedValue: 0,
            borrowedValueString: "$0.00",
            repaidAmount: (Number(lendingUserMonthlyStatementAccount.snapShotRepaidDebtAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            repaidValue: 0,
            repaidValueString: "$0.00",
            liquidatorAmount: (Number(lendingUserMonthlyStatementAccount.snapShotLiquidatorAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            liquidatorValue: 0,
            liquidatorValueString: "$0.00",
            liquidatedAmount: (Number(lendingUserMonthlyStatementAccount.snapShotLiquidatedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            liquidatedValue: 0,
            liquidatedValueString: "$0.00",
          }

          leaderBoardData[existingOwnerIndex].accountListWithLastestMonthlyStatement.push(newAccountEntry)
          leaderBoardData[existingOwnerIndex].accountListWithLastestMonthlyStatement =  leaderBoardData[existingOwnerIndex].accountListWithLastestMonthlyStatement.sort((a: any, b: any) => a.accountIndex - b.accountIndex)
        }
      }
      else
      {
        //Add New User and their Sub Account to Lending Leader Board
        const lendingUserAccount = lendingUserHashMap.map.get(lendingUserMonthlyStatementAccount.owner.toString() + lendingUserMonthlyStatementAccount.userAccountIndex.toString())
        const decimalAmount = tokenDecimalHashMap.get(tokenMintAddress)
        const tokenFrontEndProperties = tokenReserveHashMap.get(tokenMintAddress)

        var newAccountEntry =
        {
          owner: lendingUserMonthlyStatementAccount.owner.toString(),
          accountIndex: lendingUserMonthlyStatementAccount.userAccountIndex,
          accountName: lendingUserAccount.accountName,
          tokenMintAddress: tokenMintAddress,
          subMarketOwnerAddress: subMarketOwnerAddress,
          subMarketIndex: subMarketIndex,
          trimmedSubMarketOwnerAddress: trimAddress(subMarketOwnerAddress),
          tokenSVG: tokenFrontEndProperties.svg,
          tokenName: tokenFrontEndProperties.name,
          statementMonth: lendingUserMonthlyStatementAccount.statementMonth,
          statementYear: lendingUserMonthlyStatementAccount.statementYear,
          interestEarnedAmount: (Number(lendingUserMonthlyStatementAccount.snapShotInterestEarnedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
          interestEarnedValue: 0,
          interestEarnedValueString: "$0.00",
          interestAccruedAmount: (Number(lendingUserMonthlyStatementAccount.snapShotInterestAccruedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
          interestAccruedValue: 0,
          interestAccruedValueString: "$0.00",
          depositedAmount: (Number(lendingUserMonthlyStatementAccount.snapShotBalanceAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
          depositedValue: 0,
          depositedValueString: "$0.00",
          borrowedAmount: (Number(lendingUserMonthlyStatementAccount.snapShotDebtAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
          borrowedValue: 0,
          borrowedValueString: "$0.00",
          repaidAmount: (Number(lendingUserMonthlyStatementAccount.snapShotRepaidDebtAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
          repaidValue: 0,
          repaidValueString: "$0.00",
          liquidatorAmount: (Number(lendingUserMonthlyStatementAccount.snapShotLiquidatorAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
          liquidatorValue: 0,
          liquidatorValueString: "$0.00",
          liquidatedAmount: (Number(lendingUserMonthlyStatementAccount.snapShotLiquidatedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
          liquidatedValue: 0,
          liquidatedValueString: "$0.00",
        }

        var displayName = getCustomOrTrimmedUserDisplayName(lendingUserMonthlyStatementAccount.owner.toString())

        var newOwnerEntry = 
        {
          id: leaderBoardData.length + 1,
          owner: lendingUserMonthlyStatementAccount.owner.toString(),
          displayName: displayName,
          interestEarnedValue: 0,
          interestEarnedValueString: "$0.00",
          interestAccruedValue: 0,
          interestAccruedValueString: "$0.00",
          depositedValue: 0,
          depositedValueString: "$0.00",
          borrowedValue: 0,
          borrowedValueString: "$0.00",
          repaidValue: 0,
          repaidValueString: "$0.00",
          liquidatedValue: 0,
          liquidatedValueString: "$0.00",
          accountListWithLastestMonthlyStatement: [newAccountEntry]
        }

        leaderBoardData.push(newOwnerEntry)
      }
    }

    lendingUserMonthlyStatementsHashMap.map = monthlyStatementsHashMap
    lendingLeaderBoardTable.data = leaderBoardData
  }

  export async function getLendingUserMonthlyStatementsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.lending.lendingProgram.account.lendingUserMonthlyStatementAccount.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export function getLendingProtocolCEOAccountPDA()
  {
    const [lendingProtocolCEOPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("lendingProtocolCEO")
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return lendingProtocolCEOPDA
  }

  export function getLendingProtocolPDA()
  {
    const [lendingProtocolPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("lendingProtocol")
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return lendingProtocolPDA
  }

  export function getTokenReserveStatsPDA()
  {
    const [tokenReserveStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("tokenReserveStats")
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return tokenReserveStatsPDA
  }

  export function getTokenReservePDA(tokenMintAddress: PublicKey)
  {
    const [tokenReservePDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("tokenReserve"),
        tokenMintAddress.toBuffer()
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return tokenReservePDA
  }

  export function getSubMarketStatsPDA()
  {
    const [submarketStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("subMarketStats")
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return submarketStatsPDA
  }

  export function getLendingStatsPDA()
  {
    const [lendingStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("lendingStats")
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return lendingStatsPDA
  }

  export function getUserLendingStatsPDA()
  {
    const [lendingUserStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("lendingUserStats")
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return lendingUserStatsPDA
  }

  export function getLendingUserTabAccountPDA(
    tokenMintAddress: PublicKey,
    subMarketOwner: PublicKey,
    subMarketIndex: number,
    lendingUserAddress: PublicKey,
    lendingUserAccountIndex: number)
  {
    const [lendingUserTabAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("lendingUserTabAccount"),
        tokenMintAddress.toBuffer(),
        subMarketOwner.toBuffer(),
        new anchor.BN(subMarketIndex).toArrayLike(Uint8Array, "le", 2),
        lendingUserAddress.toBuffer(),
        new anchor.BN(lendingUserAccountIndex).toArrayLike(Uint8Array, "le", 1)
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return lendingUserTabAccountPDA
  }

  export default getLendingProtocolCEOAccount
</script>