<script lang="ts">
  import { inject } from 'vue'
  import * as anchor from "@coral-xyz/anchor"
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { tokenReserves, tokenReserveFontEndInfoHashMap, tokenReservesHashMap, tokenIdHashMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarkets,
    subMarketsHashMap,
    subMarketOwnerHashMap,
    subMarketLookUpTableByOwnerHashMap,
    subMarketByTokenIdAndOwnerHashMap,
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
  import { trimAddress,
    doesKeyExistInLookUpTable,
    parseProgramErrorCode,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { tokenDecimalHashMap, JITO_TIP_ACCOUNTS } from '/src/assets/constants/Addresses.ts'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { sleep, MAX_RETRY_FETCH, RETRY_TIME_OUT, RETRY_MESSAGE, ERROR_429 } from '/src/assets/helperFunctions/sleep.ts'
  import { PublicKey,
    AddressLookupTableProgram,
    AddressLookupTableAccount,
    VersionedTransaction,
    TransactionMessage,
    SystemProgram } from "@solana/web3.js"
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { LOCAL_PRICE_ORACLE } from '/src/assets/globalStates/EnvironmentSettings.ts'
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
      tokenReserve.pda = tokenReserves[i].publicKey

      //Convert Deposit Amount To Decimal from Fixed Point
      const decimalAmount = tokenDecimalHashMap.get(tokenReserve.tokenId)
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

  export function setTokenReserveFontEndInfoHashMap()
  {
    console.log("Updating Token Reserve Hash Map")
    
    var tokenReserveTempHashmap = new Map<string, any>()
    var tokenIdTempHashMap = new Map<string, number>()

    for(var i=0; i<tokenReserves.data.length; i++)
    {
      const tokenReserve = tokenReserves.data[i]
      const decimalAmount = tokenDecimalHashMap.get(tokenReserve.tokenId)

      //Convert Uncollected Solvency Fee Amounts To Decimal from Fixed Point
      tokenReserve.uncollectedSolvencyInsuranceFeesAmount = (Number(tokenReserve.uncollectedSolvencyInsuranceFeesAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount)

      //Convert Uncollected Solvency Fee Amounts To Decimal from Fixed Point
      tokenReserve.uncollectedLiquidationFeesAmount = (Number(tokenReserve.uncollectedLiquidationFeesAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount)

      //Convert Fee Rate To Decimal from Fixed Point
      tokenReserve.solvencyInsuranceFeeRate = (tokenReserve.solvencyInsuranceFeeRate / 100)

      tokenReserveTempHashmap.set(tokenReserve.tokenId, tokenReserve)
      tokenIdTempHashMap.set(tokenReserve.tokenId, tokenReserve.tokenMintAddress.toBase58())
    }

    tokenReservesHashMap.map = tokenReserveTempHashmap
    tokenIdHashMap.map = tokenIdTempHashMap
  }

  export async function getSubMarkets()
  {
    console.log("Getting SubMarkets")
    
    var subMarketsList: any = []
    var subMarketsMap = new Map<string, any>()
    var subMarketOwnerMap = new Map<string, any>()
    var subMarketOwnerByTokenIdMap = new Map<string, any>()
    var tokenReserveMap = new Map<string, any>()

    const allSubMarkets = await getSubMarketsWrapper()

    //Create TokenReserve/SubMarket hash map and SubMarket list for tables
    for(var i=0; i<allSubMarkets.length; i++)
    {
      const subMarket = allSubMarkets[i].account
      subMarket.pda = allSubMarkets[i].publicKey

      //Populate Token Reserve hash map
      var ownerTokenReserveList: any = []

      //Convert Deposit, Fees Generated, and Uncollected Fee Amounts To Decimal from Fixed Point
      const decimalAmount = tokenDecimalHashMap.get(subMarket.tokenId)
      subMarket.tokenMintAddress = tokenIdHashMap.map.get(subMarket.tokenId)
      subMarket.depositedAmount = (Number(subMarket.depositedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount)
      subMarket.subMarketFeesGeneratedAmount = (Number(subMarket.subMarketFeesGeneratedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount)
      subMarket.uncollectedSubMarketFeesAmount = (Number(subMarket.uncollectedSubMarketFeesAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount)

      //Convert Fee Rate To Decimal from Fixed Point
      subMarket.feeOnInterestEarnedRate = (subMarket.feeOnInterestEarnedRate / 100)

      const previousTokenReserveList = tokenReserveMap.get(subMarket.tokenId)
      if(previousTokenReserveList)
        ownerTokenReserveList = previousTokenReserveList

      ownerTokenReserveList.push(subMarket)

      tokenReserveMap.set(subMarket.tokenId, ownerTokenReserveList)

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

      const tokenFrontEndProperties = tokenReserveFontEndInfoHashMap.get(subMarketOwner.ownerSubMarketList[newIndex].tokenId)

      subMarketOwner.ownerSubMarketList[newIndex].feeCollectorAddress = subMarketOwner.ownerSubMarketList[newIndex].feeCollectorAddress.toBase58()
      //subMarketOwner.ownerSubMarketList[newIndex].tokenSVG = tokenFrontEndProperties.svg//This has to be marked raw in the Owners Table since it is cloned at the end of this fuction. The cloning is for allowing users to edit the table without updating the original hashmap. It was originally marked Raw in the TokenReserves.vue file
      subMarketOwner.ownerSubMarketList[newIndex].tokenName = tokenFrontEndProperties.name
      subMarketOwner.ownerSubMarketList[newIndex].svgSource = tokenFrontEndProperties.source
      subMarketOwner.subMarketCount = subMarketOwner.ownerSubMarketList.length

      subMarketOwnerMap.set(subMarket.owner.toBase58(), subMarketOwner)

      //Populate SubMarket Owner by TokenMintAddress hash map
      var list = []

      const previousSubMarketOwnerByTokenMintAddressData = subMarketOwnerByTokenIdMap.get(subMarket.tokenId.toString() + subMarket.owner.toBase58())
      if(previousSubMarketOwnerByTokenMintAddressData)
        list = previousSubMarketOwnerByTokenMintAddressData
      
      list.push(subMarket)
      list = list.sort((a: any, b: any) => a.subMarketIndex - b.subMarketIndex) 
      subMarketOwnerByTokenIdMap.set(subMarket.tokenId.toString() + subMarket.owner.toBase58(), list)

      //Populate SubMarket hash map
      subMarketsMap.set
      (
        subMarket.tokenId.toString() +
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
    subMarketByTokenIdAndOwnerHashMap.map = cloneDeep(subMarketOwnerByTokenIdMap) 
    
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

  export async function setSubMarketLookUpTableHashMap()
  {
    console.log("Setting SubMarket Look Up By Owner Table Hash Map")
    
    var subMarketLookUpTableMap = new Map<string, any>()

    const allSubMarketOwnerLookUpTables = await getSubMarketLookUpTablesWrapper()

    //Create TokenReserve/SubMarket hash map and SubMarket list for tables
    for(var i=0; i<allSubMarketOwnerLookUpTables.length; i++)
    {
      const nativeProgramSubMarketOwnerLookUpTableAccount = allSubMarketOwnerLookUpTables[i].account

      const addressLookupTableProgramSubMarketOwnerLookUpTableAccount = await getAddressLookUpTableProgramAccountWrapper(nativeProgramSubMarketOwnerLookUpTableAccount.lookUpTableAddress)

      subMarketLookUpTableMap.set(nativeProgramSubMarketOwnerLookUpTableAccount.owner.toString(), addressLookupTableProgramSubMarketOwnerLookUpTableAccount)  
    }
   
    subMarketLookUpTableByOwnerHashMap.map = cloneDeep(subMarketLookUpTableMap)
  }


  async function getSubMarketLookUpTablesWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.lending.lendingProgram.account.subMarketOwnerLookUpTable.all()
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

  export async function getAddressLookUpTableProgramAccountWrapper(lookUpTableAddress: PublicKey)
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return (await anchorPrograms.lending.lendingProgram.provider.connection.getAddressLookupTable(lookUpTableAddress)).value
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
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

  export function getUserNextSubMarketIndex(tokenId: number, subMarketOwnerAddress: string)
  {
    const userSubMarketListByTokenMintAddress = subMarketByTokenIdAndOwnerHashMap.map.get(tokenId.toString() + subMarketOwnerAddress)

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

    if(lendingUserAccounts)
    {
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
    }
    else
      lendingUserHashMap.map = undefined //We don't want to accidently create another Address Look Up Table if we aren't able to fetch the Lending User Accounts for some weird error

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

  export async function setLendingUserTabHashMapsAndLendingLeaderBoard()
  {
    console.log("Setting Lending User Tab Hashmaps and Lending Leader Board Data")

    var userTabAccountsHashMap = new Map<string, any>()
    var userTabListHashMap = new Map<string, any>()
    var userRemainingAccountsTabListHashMap = new Map<string, any>()
    var leaderBoardData: any[] = []
    
    const lendingUserTabs = await getLendingUserTabsWrapper()
    
    if(lendingUserTabs)
    {
      for(var i=0; i<lendingUserTabs.length; i++)
      {
        const lendingUserTabAccount = lendingUserTabs[i].account
        const lendingUserTabAccountPDA = lendingUserTabs[i].publicKey
        const tokenId = lendingUserTabAccount.tokenId
        const subMarketOwnerAddress = lendingUserTabAccount.subMarketOwnerAddress.toBase58()
        const subMarketIndex = lendingUserTabAccount.subMarketIndex
        const lendingUserOwnerAddress = lendingUserTabAccount.owner.toBase58()
        const lendingUserAccountIndex = lendingUserTabAccount.userAccountIndex

        //Set user tab hash map
        userTabAccountsHashMap.set(tokenId.toString() +
        subMarketOwnerAddress +
        subMarketIndex.toString() +
        lendingUserOwnerAddress +
        lendingUserAccountIndex.toString(), lendingUserTabAccount)

        //Set user tab account list hash map
        var list = []
        const previousLendingUserTabList = userTabListHashMap.get(lendingUserOwnerAddress + lendingUserAccountIndex.toString())

        if(previousLendingUserTabList)
          list = previousLendingUserTabList

        list.push(lendingUserTabAccount)
        list = list.sort((a: any, b: any) => a.userTabAccountIndex - b.userTabAccountIndex) 

        userTabListHashMap.set(lendingUserOwnerAddress + lendingUserAccountIndex.toString(), list)

        //Set user remaining tab account list hash map
        var list = []
        const previousLendingUserRemainingTabList = userRemainingAccountsTabListHashMap.get(lendingUserOwnerAddress + lendingUserAccountIndex.toString())

        if(previousLendingUserRemainingTabList)
          list = previousLendingUserRemainingTabList

        const lendingUserTabRemainingAccount = 
        {
          pubkey: lendingUserTabAccountPDA,
          userTabAccountIndex: lendingUserTabAccount.userTabAccountIndex,
          tokenId: tokenId,
          subMarketOwnerAddress: subMarketOwnerAddress,
          subMarketIndex: subMarketIndex,
          isSigner: false,
          isWritable: true
        }

        list.push(lendingUserTabRemainingAccount)
        list = list.sort((a: any, b: any) => a.userTabAccountIndex - b.userTabAccountIndex) 

        userRemainingAccountsTabListHashMap.set(lendingUserOwnerAddress + lendingUserAccountIndex.toString(), list)

        //Populate Lending Leader Board

        //Set leader board data
        var existingOwner = undefined
        var existingOwnerIndex = 0

        //Check if there is an existing monthly statement for the current account index being checked and save the entry for year and month comparison
        for(var j=0; j<leaderBoardData.length; j++)
        {
          if(leaderBoardData[j].owner == lendingUserOwnerAddress)
          {
            existingOwner = leaderBoardData[j].owner
            existingOwnerIndex = j
          }
        }

        if(existingOwner)
        {
          //Add New Sub Account for Existing User to Lending Leader Board
          const lendingUserAccount = lendingUserHashMap.map.get(lendingUserOwnerAddress + lendingUserAccountIndex.toString())
          const decimalAmount = tokenDecimalHashMap.get(tokenId)
          const tokenFrontEndProperties = tokenReserveFontEndInfoHashMap.get(tokenId)

          var newAccountEntry =
          {
            owner: lendingUserOwnerAddress,
            accountIndex: lendingUserAccountIndex,
            accountName: lendingUserAccount.accountName,
            tokenId: tokenId,
            subMarketOwnerAddress: subMarketOwnerAddress,
            subMarketIndex: subMarketIndex,
            trimmedSubMarketOwnerAddress: trimAddress(subMarketOwnerAddress),
            tokenSVG: tokenFrontEndProperties.svg,
            tokenName: tokenFrontEndProperties.name,
            interestEarnedAmount: Number(lendingUserTabAccount.interestEarnedAmount) / Math.pow(10, decimalAmount),
            interestEarnedAmountString: (Number(lendingUserTabAccount.interestEarnedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            interestEarnedValue: 0,
            interestEarnedValueString: "$0.00",
            interestAccruedAmount: Number(lendingUserTabAccount.interestAccruedAmount) / Math.pow(10, decimalAmount),
            interestAccruedAmountString: (Number(lendingUserTabAccount.interestAccruedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            interestAccruedValue: 0,
            interestAccruedValueString: "$0.00",
            depositedAmount: Number(lendingUserTabAccount.depositedAmount) / Math.pow(10, decimalAmount),
            depositedAmountString: (Number(lendingUserTabAccount.depositedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            depositedValue: 0,
            depositedValueString: "$0.00",
            borrowedAmount: Number(lendingUserTabAccount.borrowedAmount) / Math.pow(10, decimalAmount),
            borrowedAmountString: (Number(lendingUserTabAccount.borrowedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            borrowedValue: 0,
            borrowedValueString: "$0.00",
            repaidAmount: Number(lendingUserTabAccount.repaidDebtAmount) / Math.pow(10, decimalAmount),
            repaidAmountString: (Number(lendingUserTabAccount.repaidDebtAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            repaidValue: 0,
            repaidValueString: "$0.00",
            liquidatorAmount: Number(lendingUserTabAccount.liquidatorAmount) / Math.pow(10, decimalAmount),
            liquidatorAmountString: (Number(lendingUserTabAccount.liquidatorAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            liquidatorValue: 0,
            liquidatorValueString: "$0.00",
            liquidatedAmount: Number(lendingUserTabAccount.liquidatedAmount) / Math.pow(10, decimalAmount),
            liquidatedAmountString: (Number(lendingUserTabAccount.liquidatedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            liquidatedValue: 0,
            liquidatedValueString: "$0.00"
          }

          leaderBoardData[existingOwnerIndex].accountList.push(newAccountEntry)
          leaderBoardData[existingOwnerIndex].accountList = leaderBoardData[existingOwnerIndex].accountList.sort((a: any, b: any) => a.accountIndex - b.accountIndex)
        }
        else
        {
          //Add New User and their Sub Account to Lending Leader Board
          const lendingUserAccount = lendingUserHashMap.map.get(lendingUserOwnerAddress + lendingUserAccountIndex.toString())
          const decimalAmount = tokenDecimalHashMap.get(tokenId)
          const tokenFrontEndProperties = tokenReserveFontEndInfoHashMap.get(tokenId)

          var newAccountEntry =
          {
            owner: lendingUserOwnerAddress,
            accountIndex: lendingUserAccountIndex,
            accountName: lendingUserAccount.accountName,
            tokenId: tokenId,
            subMarketOwnerAddress: subMarketOwnerAddress,
            subMarketIndex: lendingUserTabAccount.subMarketIndex,
            trimmedSubMarketOwnerAddress: trimAddress(subMarketOwnerAddress),
            tokenSVG: tokenFrontEndProperties.svg,
            tokenName: tokenFrontEndProperties.name,
            interestEarnedAmount: Number(lendingUserTabAccount.interestEarnedAmount) / Math.pow(10, decimalAmount),
            interestEarnedAmountString: (Number(lendingUserTabAccount.interestEarnedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            interestEarnedValue: 0,
            interestEarnedValueString: "$0.00",
            interestAccruedAmount: Number(lendingUserTabAccount.interestAccruedAmount) / Math.pow(10, decimalAmount),
            interestAccruedAmountString: (Number(lendingUserTabAccount.interestAccruedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            interestAccruedValue: 0,
            interestAccruedValueString: "$0.00",
            depositedAmount: Number(lendingUserTabAccount.depositedAmount) / Math.pow(10, decimalAmount),
            depositedAmountString: (Number(lendingUserTabAccount.depositedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            depositedValue: 0,
            depositedValueString: "$0.00",
            borrowedAmount: Number(lendingUserTabAccount.borrowedAmount) / Math.pow(10, decimalAmount),
            borrowedAmountString: (Number(lendingUserTabAccount.borrowedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            borrowedValue: 0,
            borrowedValueString: "$0.00",
            repaidAmount: Number(lendingUserTabAccount.repaidDebtAmount) / Math.pow(10, decimalAmount),
            repaidAmountString: (Number(lendingUserTabAccount.repaidDebtAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            repaidValue: 0,
            repaidValueString: "$0.00",
            liquidatorAmount: Number(lendingUserTabAccount.liquidatorAmount) / Math.pow(10, decimalAmount),
            liquidatorAmountString: (Number(lendingUserTabAccount.liquidatorAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            liquidatorValue: 0,
            liquidatorValueString: "$0.00",
            liquidatedAmount: Number(lendingUserTabAccount.liquidatedAmount) / Math.pow(10, decimalAmount),
            liquidatedAmountString: (Number(lendingUserTabAccount.liquidatedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount),
            liquidatedValue: 0,
            liquidatedValueString: "$0.00"
          }

          var displayName = getCustomOrTrimmedUserDisplayName(lendingUserOwnerAddress)

          var newOwnerEntry = 
          {
            id: leaderBoardData.length + 1,
            owner: lendingUserOwnerAddress,
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
            liquidatable: false,
            accountList: [newAccountEntry]
          }

          leaderBoardData.push(newOwnerEntry)
        }
      }

      lendingUserTabAccountsHashMap.map = userTabAccountsHashMap
    }
    else
      lendingUserTabAccountsHashMap.map = undefined //We don't want to accidently create another Address Look Up Table if we aren't able to fetch the Lending User Tab Accounts for some weird error

    lendingUserTabAccountListHashMap.map = userTabListHashMap
    lendingUserRemainingTabAccountListHashMap.map = userRemainingAccountsTabListHashMap
    lendingLeaderBoardTable.data = leaderBoardData
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

  export async function isTempPriceAccountAlive(userCallingPriceFunctions: PublicKey)
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        await anchorPrograms.lending.lendingProgram.account.tempOraclePriceAccount.fetch(getPriceAccountPDA(userCallingPriceFunctions))
        return true
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          return false
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

    //Stable Coins
    //These loops are done this way to keep the portfolio charts in a certain order
    //Stable Coins listed, Than Crypto Currency listed
    for(var i=0; i<StableCoins.length; i++)
    {
      for(var j=0; j<lendingUserMonthlyStatements.data.length; j++)
      {
        const lendingUserMonthlyStatementAccount = lendingUserMonthlyStatements.data[j].account
        const tokenId = lendingUserMonthlyStatementAccount.tokenId

        if(StableCoins[i].tokenId != tokenId)
          continue

        const subMarketOwnerAddress = lendingUserMonthlyStatementAccount.subMarketOwnerAddress.toString()
        const subMarketIndex = lendingUserMonthlyStatementAccount.subMarketIndex
        const owner = lendingUserMonthlyStatementAccount.owner.toString()
        const userAccountIndex = lendingUserMonthlyStatementAccount.userAccountIndex.toString()
        const subMarket= subMarketsHashMap.map.get(tokenId + subMarketOwnerAddress + subMarketIndex.toString())

        //Set User Available SubMarket Hash Map
        var availableStatementsBySubMarketData = 
        {
          tokenId: tokenId,
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
            if(previousLendingUserAvailableSubMarketList[k].tokenId == availableStatementsBySubMarketData.tokenId &&
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
        const previousLendingUserAvailableYearByTokenMintAddressList = availableStableCoinYearStatementsBySubMarketHashMap.get(tokenId +
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
            availableStableCoinYearStatementsBySubMarketHashMap.set(tokenId +
            subMarketOwnerAddress +
            subMarketIndex +
            owner +
            lendingUserMonthlyStatementAccount.userAccountIndex.toString(), list) 
          }
        }
        else
          availableStableCoinYearStatementsBySubMarketHashMap.set(tokenId +
          subMarketOwnerAddress +
          subMarketIndex +
          owner +
          lendingUserMonthlyStatementAccount.userAccountIndex.toString(), [availableYearBySubMarketObject])
      }
    }

    //Crypto Currencies
    //These loops are done this way to keep the portfolio charts in a certain order
    //Stable Coins listed, Than Crypto Currency listed
    for(var i=0; i<CryptoCurrency.length; i++)
    {
      for(var j=0; j<lendingUserMonthlyStatements.data.length; j++)
      {
        const lendingUserMonthlyStatementAccount = lendingUserMonthlyStatements.data[j].account
        const tokenId = lendingUserMonthlyStatementAccount.tokenId

        if(CryptoCurrency[i].tokenId != tokenId)
          continue

        const subMarketOwnerAddress = lendingUserMonthlyStatementAccount.subMarketOwnerAddress.toString()
        const subMarketIndex = lendingUserMonthlyStatementAccount.subMarketIndex
        const owner = lendingUserMonthlyStatementAccount.owner.toString()
        const userAccountIndex = lendingUserMonthlyStatementAccount.userAccountIndex.toString()
        const subMarket= subMarketsHashMap.map.get(tokenId + subMarketOwnerAddress + subMarketIndex.toString())

        //Set User Available SubMarket Hash Map
        var availableStatementsBySubMarketData = 
        {
          tokenId: tokenId,
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
            if(previousLendingUserAvailableSubMarketList[k].tokenId == availableStatementsBySubMarketData.tokenId &&
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
        const previousLendingUserAvailableYearByTokenMintAddressList = availableCryptoCurrencyYearStatementsBySubMarketHashMap.get(tokenId +
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
            availableCryptoCurrencyYearStatementsBySubMarketHashMap.set(tokenId +
            subMarketOwnerAddress +
            subMarketIndex +
            owner +
            lendingUserMonthlyStatementAccount.userAccountIndex.toString(), list) 
          }
        }
        else
          availableCryptoCurrencyYearStatementsBySubMarketHashMap.set(tokenId +
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

  export async function setMonthlyStatementHashMap()
  {
    if(!lendingUserMonthlyStatements.data) //We don't want to accidently create another Address Look Up Table if we aren't able to fetch the Monthly Statement Accounts for some weird error.
      return

    console.log("Setting Monthly Statement HashMap")

    var monthlyStatementsHashMap = new Map<string, any>()

    for(var i=0; i<lendingUserMonthlyStatements.data.length; i++)
    {
      const lendingUserMonthlyStatementAccount = lendingUserMonthlyStatements.data[i].account
      lendingUserMonthlyStatementAccount.pda = lendingUserMonthlyStatements.data[i].publicKey

      const tokenId = lendingUserMonthlyStatementAccount.tokenId.toString()
      const subMarketOwnerAddress = lendingUserMonthlyStatementAccount.subMarketOwnerAddress.toString()
      const subMarketIndex = lendingUserMonthlyStatementAccount.subMarketIndex.toString()
      const owner = lendingUserMonthlyStatementAccount.owner.toString()
      const userAccountIndex = lendingUserMonthlyStatementAccount.userAccountIndex.toString()
      const statementYear = lendingUserMonthlyStatementAccount.statementYear.toString()
      const statementMonth = lendingUserMonthlyStatementAccount.statementMonth.toString()

      //Set User Monthly Statements hash map
      monthlyStatementsHashMap.set(statementMonth +
      statementYear +
      tokenId +
      subMarketOwnerAddress +
      subMarketIndex +
      owner +
      userAccountIndex, lendingUserMonthlyStatementAccount)
    }

    lendingUserMonthlyStatementsHashMap.map = monthlyStatementsHashMap
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

  export function getSolvencyTreasurerPDA()
  {
    const [solvencyTreasurerPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("solvencyTreasurer")
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return solvencyTreasurerPDA
  }

  export function getLiquidationTreasurerPDA()
  {
    const [liquidationTreasurerPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("liquidationTreasurer")
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return liquidationTreasurerPDA
  }

  export function getOraclePriceValidatorPDA()
  {
    const [oraclePriceValidatorPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("oraclePriceValidator")
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return oraclePriceValidatorPDA
  }

  export function getPriceAccountPDA(userCallingPriceFunctions: PublicKey)
  {
    const [oraclePriceAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("oraclePriceData"),
        userCallingPriceFunctions.toBuffer()
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return oraclePriceAccountPDA
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

  export function getSubMarketPDA(tokenId: number, subMarketOwner: PublicKey, subMarketIndex: number)
  {
    const [subMarketPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("subMarket"),
        new anchor.BN(tokenId).toArrayLike(Uint8Array, "le", 1),
        subMarketOwner.toBuffer(),
        new anchor.BN(subMarketIndex).toArrayLike(Uint8Array, "le", 2)
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return subMarketPDA
  }

  export function getSubMarketOwnerLookUpTablePDA(ownerAddress: PublicKey)
  {
    const [subMarketOwnerLookUpTablePDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("subMarketOwnerLookUpTable"),
        ownerAddress.toBuffer()
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return subMarketOwnerLookUpTablePDA
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

  export function getLendingUserAccountPDA(lendingUserAddress: PublicKey, lendingUserAccountIndex: number)
  {
    const [lendingUserAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("lendingUserAccount"),
        lendingUserAddress.toBuffer(),
        new anchor.BN(lendingUserAccountIndex).toArrayLike(Uint8Array, "le", 1)
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return lendingUserAccountPDA
  }

  export function getLendingUserTabAccountPDA(
    tokenId: number,
    subMarketOwnerAddress: PublicKey,
    subMarketIndex: number,
    lendingUserAddress: PublicKey,
    lendingUserAccountIndex: number)
  {
    const [lendingUserTabAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("lendingUserTabAccount"),
        new anchor.BN(tokenId).toArrayLike(Uint8Array, "le", 1),
        subMarketOwnerAddress.toBuffer(),
        new anchor.BN(subMarketIndex).toArrayLike(Uint8Array, "le", 2),
        lendingUserAddress.toBuffer(),
        new anchor.BN(lendingUserAccountIndex).toArrayLike(Uint8Array, "le", 1)
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return lendingUserTabAccountPDA
  }

  export function getLendingUserMonthlyStatementAccountPDA(
    currentStatementMonth: number,
    currentStatementYear: number,
    tokenId: number,
    subMarketOwnerAddress: PublicKey,
    subMarketIndex: number,
    lendingUserAddress: PublicKey,
    lendingUserAccountIndex: number)
  {
    const [lendingUserTabAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("userMonthlyStatementAccount"),
        new anchor.BN(currentStatementMonth).toArrayLike(Uint8Array, "le", 1),
        new anchor.BN(currentStatementYear).toArrayLike(Uint8Array, "le", 2),
        new anchor.BN(tokenId).toArrayLike(Uint8Array, "le", 1),
        subMarketOwnerAddress.toBuffer(),
        new anchor.BN(subMarketIndex).toArrayLike(Uint8Array, "le", 2),
        lendingUserAddress.toBuffer(),
        new anchor.BN(lendingUserAccountIndex).toArrayLike(Uint8Array, "le", 1)
      ],
      anchorPrograms.lending.lendingProgram.programId
    )
    return lendingUserTabAccountPDA
  }

  //This is identical for the Deposit, Collect, and Claim functions since user Lending Accounts get created when those are called. Liquidation does as well, but it is slightly different since it has 2 tokens to worry about.
  export async function getLendingUserLookUpTableAddressAndInstructions(lendingUserAddress: PublicKey,
  lendingUserAccountIndex: number,
  lendingUserLookUpTableAccount: AddressLookupTableAccount,
  selectedTokenId: number,
  destinationSubMarketOwnerAddress: PublicKey,
  destinationSubMarketSelect: number,
  initialSubMarketOwnerAddress: PublicKey | undefined = undefined,
  initialSubMarketSelect: number | undefined = undefined)
  {
    var creatingNewLookUpTable = false
    var lendingUserLookUpTableInstructionsToSend = []
    var lendingUserLookUpTableAddress = null
    var createLookUpTableInstruction: anchor.web3.TransactionInstruction

    //We don't want to accidently create another Address Look Up Table if we aren't able to fetch the Lending User Accounts for some weird error
    if(lendingUserHashMap.map == undefined)
      throw new Error("Lending User hash map is undefined. Cannot proceed.")

    //We don't want to accidently create another Address Look Up Table if we aren't able to fetch the Lending User Tab Accounts for some weird error
    if(lendingUserTabAccountsHashMap.map == undefined)
      throw new Error("Lending User Tab hash map is undefined. Cannot proceed.")

    //We don't want to accidently create another Address Look Up Table if we aren't able to fetch the Monthly Statement Accounts for some weird error
    if(lendingUserMonthlyStatementsHashMap.map == undefined)
      throw new Error("Monthly Statement hash map is undefined. Cannot proceed.")

    //Check if Lending User Account has been initialized
    const lendingUserAccount = lendingUserHashMap.map.get(lendingUserAddress.toString() + lendingUserAccountIndex.toString())

    if(!lendingUserAccount)
    {
      const slot = await anchorPrograms.lending.lendingProgram.provider.connection.getSlot(); //Need a semi colon before a tuple reassignment.

      [createLookUpTableInstruction, lendingUserLookUpTableAddress] = 
      AddressLookupTableProgram.createLookupTable({
        authority: lendingUserAddress,
        payer: lendingUserAddress,
        recentSlot: slot
      })

      lendingUserLookUpTableInstructionsToSend.push(createLookUpTableInstruction)
      creatingNewLookUpTable = true

      //Determine PDA for new Lending User Account that will be created
      const lendingUserAccountPDA = getLendingUserAccountPDA(lendingUserAddress, lendingUserAccountIndex)

      if(!doesKeyExistInLookUpTable(lendingUserLookUpTableAccount, lendingUserAccountPDA))
      {
        const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
        {
          authority: lendingUserAddress,
          payer: lendingUserAddress,
          lookupTable: lendingUserLookUpTableAddress,
          addresses: [lendingUserAccountPDA]
        })

        lendingUserLookUpTableInstructionsToSend.push(extendLookUpTableInstruction)
      }
    }
    else
      lendingUserLookUpTableAddress = lendingUserAccount.lookUpTableAddress

    //Check if Lending User Tab Account has been initialized
    const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(selectedTokenId.toString() +
    destinationSubMarketOwnerAddress.toString() +
    destinationSubMarketSelect.toString() +
    lendingUserAddress.toString() +
    lendingUserAccountIndex.toString())

    //Add Lending User Tab Account to Lending User Look Up Table if it doesn't exist
    if(!lendingUserTabAccount)
    {
      //Determine PDA for new LendingUserTabAccount that will be created
      const lendingUserTabAccountPDA = getLendingUserTabAccountPDA(selectedTokenId,
      destinationSubMarketOwnerAddress,
      destinationSubMarketSelect,
      lendingUserAddress,
      lendingUserAccountIndex)

      if(!doesKeyExistInLookUpTable(lendingUserLookUpTableAccount, lendingUserTabAccountPDA))
      {
        const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
        {
          authority: lendingUserAddress,
          payer: lendingUserAddress,
          lookupTable: lendingUserLookUpTableAddress,
          addresses: [lendingUserTabAccountPDA]
        })

        lendingUserLookUpTableInstructionsToSend.push(extendLookUpTableInstruction)
      }
    }

    //Check if Monthly Statement Account has been initialized
    const monthlyStatement = lendingUserMonthlyStatementsHashMap.map.get(anchorPrograms.currentStatementMonthNumber.toString() +
    anchorPrograms.currentStatementYear.toString() +
    selectedTokenId.toString() +
    destinationSubMarketOwnerAddress.toString() +
    destinationSubMarketSelect.toString() +
    lendingUserAddress.toString() +
    lendingUserAccountIndex.toString())

    //Going to try not adding the monthly statement accounts to the lookuptables since there will always be more monthly statements
    //Add Monthly Statement Account to Lending User Look Up Table if it doesn't exist
    /*if(!monthlyStatement)
    {
      //Determine PDA for new MonthlyStatementAccount that will be created
      const monthlyStatementPDA = getLendingUserMonthlyStatementAccountPDA(anchorPrograms.currentStatementMonthNumber,
      anchorPrograms.currentStatementYear,
      selectedTokenId,
      destinationSubMarketOwnerAddress,
      destinationSubMarketSelect,
      lendingUserAddress,
      lendingUserAccountIndex)

      if(!doesKeyExistInLookUpTable(lendingUserLookUpTableAccount, monthlyStatementPDA))
      {
        const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
        {
          authority: lendingUserAddress,
          payer: lendingUserAddress,
          lookupTable: lendingUserLookUpTableAddress,
          addresses: [monthlyStatementPDA]
        })

        lendingUserLookUpTableInstructionsToSend.push(extendLookUpTableInstruction)
      }
    }*/

    //This is for the claimSubMarketFeesAndDepositInDifferentSubMarket function
    if((initialSubMarketOwnerAddress && initialSubMarketSelect) &&
    (destinationSubMarketOwnerAddress.toString() != initialSubMarketOwnerAddress.toString() ||
    destinationSubMarketSelect != initialSubMarketSelect))
    {
      //Check if Lending User Tab Account has been initialized
      const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(selectedTokenId.toString() +
      initialSubMarketOwnerAddress.toString() +
      initialSubMarketSelect.toString() +
      lendingUserAddress.toString() +
      lendingUserAccountIndex.toString())

      //Add Lending User Tab Account to Lending User Look Up Table if it doesn't exist
      if(!lendingUserTabAccount)
      {
        //Determine PDA for new LendingUserTabAccount that will be created
        const lendingUserTabAccountPDA = getLendingUserTabAccountPDA(selectedTokenId,
        initialSubMarketOwnerAddress,
        initialSubMarketSelect,
        lendingUserAddress,
        lendingUserAccountIndex)

        if(!doesKeyExistInLookUpTable(lendingUserLookUpTableAccount, lendingUserTabAccountPDA))
        {
          const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
          {
            authority: lendingUserAddress,
            payer: lendingUserAddress,
            lookupTable: lendingUserLookUpTableAddress,
            addresses: [lendingUserTabAccountPDA]
          })

          lendingUserLookUpTableInstructionsToSend.push(extendLookUpTableInstruction)
        }
      }

      //Check if Monthly Statement Account has been initialized
      const monthlyStatement = lendingUserMonthlyStatementsHashMap.map.get(anchorPrograms.currentStatementMonthNumber.toString() +
      anchorPrograms.currentStatementYear.toString() +
      selectedTokenId.toString() +
      initialSubMarketOwnerAddress.toString() +
      initialSubMarketSelect.toString() +
      lendingUserAddress.toString() +
      lendingUserAccountIndex.toString())

      //Going to try not adding the monthly statement accounts to the lookuptables since there will always be more monthly statements
      //Add Monthly Statement Account to Lending User Look Up Table if it doesn't exist
      /*if(!monthlyStatement)
      {
        //Determine PDA for new MonthlyStatementAccount that will be created
        const monthlyStatementPDA = getLendingUserMonthlyStatementAccountPDA(anchorPrograms.currentStatementMonthNumber,
        anchorPrograms.currentStatementYear,
        selectedTokenMintAddress,
        initialSubMarketOwnerAddress,
        initialSubMarketSelect,
        lendingUserAddress,
        lendingUserAccountIndex)

        if(!doesKeyExistInLookUpTable(lendingUserLookUpTableAccount, monthlyStatementPDA))
        {
          const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
          {
            authority: lendingUserAddress,
            payer: lendingUserAddress,
            lookupTable: lendingUserLookUpTableAddress,
            addresses: [monthlyStatementPDA]
          })

          lendingUserLookUpTableInstructionsToSend.push(extendLookUpTableInstruction)
        }
      }*/
    }
    //console.log("Lending User Look Up Table Address: " + lendingUserLookUpTableAddress?.toString())
    //console.log("Lending User Look Up Table Instructions to Send: " + lendingUserLookUpTableInstructionsToSend.length)
    return[lendingUserLookUpTableAddress, lendingUserLookUpTableInstructionsToSend, creatingNewLookUpTable]
  }

  export async function sendVersionedLendingProtocolTransaction(instructionsToSend: anchor.web3.TransactionInstruction[], lookUpTableAccounts: AddressLookupTableAccount[])
  {
    try
    {
      const { blockhash } = await anchorPrograms.lending.lendingProgram.provider.connection.getLatestBlockhash()

      const messageV0 = new TransactionMessage({
        payerKey: connectedWallet.publicKey,
        recentBlockhash: blockhash,
        instructions: instructionsToSend
      }).compileToV0Message(lookUpTableAccounts)

      const transaction = new VersionedTransaction(messageV0)

      const size = transaction.serialize().length
      console.log(`Transaction Size: ${size} bytes`)

      return await anchorPrograms.lending.lendingProgram.provider.sendAndConfirm(transaction)
    }
    catch(error)
    {
      throw error
    }
  }

  export async function userSignsLendingTransactions(
  instructionsToSend: anchor.web3.TransactionInstruction[], 
  lookUpTableAccounts: AddressLookupTableAccount[]
  ): Promise<VersionedTransaction[]>
  {
    try
    {
      const unsignedTransactions: VersionedTransaction[] = []
      const connection = anchorPrograms.lending.lendingProgram.provider.connection
      const { blockhash } = await connection.getLatestBlockhash()
      const payerKey = connectedWallet.publicKey;

      //Hard Solana MTU limit is 1232 bytes.
      //We reserve a 64-byte buffer for the user's signature applied later
      const MAX_UNSIGNED_SIZE = 1232 - 64

      var currentBatch: anchor.web3.TransactionInstruction[] = []

      for(var i=0; i<instructionsToSend.length; i++)
      {
        const nextInstruction = instructionsToSend[i]
        var itFits

        try
        {
          //Test compilation adding the next instruction to our active batch
          const testInstructions = [...currentBatch, nextInstruction]
          const testMessage = new TransactionMessage(
          {
            payerKey,
            recentBlockhash: blockhash,
            instructions: testInstructions
          }).compileToV0Message(lookUpTableAccounts)

          const testTx = new VersionedTransaction(testMessage)
          const testSize = testTx.serialize().length
          console.log("testSize: ", testSize)

          if(testSize <= MAX_UNSIGNED_SIZE)
            itFits = true
          else
            itFits = false
        }
        catch(error)
        {
          itFits = false
        }

        if(itFits)
          //It fits! Append the instruction to the current transaction batch
          currentBatch.push(nextInstruction)
        else
        {
          //It doesn't fit. If we have a pending batch, serialize it first
          if(currentBatch.length > 0)
          {
            const finalMessage = new TransactionMessage(
            {
              payerKey,
              recentBlockhash: blockhash,
              instructions: currentBatch
            }).compileToV0Message(lookUpTableAccounts)
            
            unsignedTransactions.push(new VersionedTransaction(finalMessage))
          }
          
          //Start a brand new transaction batch with the instruction that overflowed
          currentBatch = [nextInstruction]
          
          //Safety check: verify a single instruction doesn't break the bank on its own
          const singleTxMessage = new TransactionMessage(
          {
            payerKey,
            recentBlockhash: blockhash,
            instructions: currentBatch
          }).compileToV0Message(lookUpTableAccounts)
          
          if(new VersionedTransaction(singleTxMessage).serialize().length > MAX_UNSIGNED_SIZE)
            throw new Error(`Instruction at index ${i} is too large to fit in a single transaction on its own!`)
        }
      }

      //Don't leave the trailing final batch behind
      if(currentBatch.length > 0)
      {
        const finalMessage = new TransactionMessage({
          payerKey,
          recentBlockhash: blockhash,
          instructions: currentBatch
        }).compileToV0Message(lookUpTableAccounts)
        
        unsignedTransactions.push(new VersionedTransaction(finalMessage))
      }

      console.log(`User Instructions Packed into ${unsignedTransactions.length} transaction(s).`)

      for(var i=0; i<unsignedTransactions.length; i++)
      {
        const unsignedTransactionSize = unsignedTransactions[i].serialize().length
        console.log(`Usigned Transaction size: ${unsignedTransactionSize}`)
      }

      //Send the optimized transactions to the wallet for a single-prompt batch sign
      const signedTransactions = await anchorPrograms.lending.lendingProgram.provider.wallet.signAllTransactions(unsignedTransactions)

      return signedTransactions
    }
    catch(error)
    {
      throw error
    }
  }

  /*export async function userSignsLendingTransactions(
    instructionsToSend: anchor.web3.TransactionInstruction[], 
    lookUpTableAccounts: AddressLookupTableAccount[]
  ): Promise<VersionedTransaction[]>
  {
    try
    {
      const unsignedTransactions: VersionedTransaction[] = []
      const connection = anchorPrograms.lending.lendingProgram.provider.connection
      const { blockhash } = await connection.getLatestBlockhash()
      const payerKey = connectedWallet.publicKey

      //Hard Solana MTU limit is 1232 bytes minus a 64-byte signature buffer.
      const MAX_UNSIGNED_SIZE = 1232 - 64

      //Max cap placeholder used strictly for accurate serialization size testing
      const placeholderLimitIx = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 })

      
      //Helper function to simulate a complete batch, extract real CU data,
      //and conditionally add the compute budget instruction only if it exceeds the default.
      async function finalizeBatch(batch: anchor.web3.TransactionInstruction[]): Promise<VersionedTransaction>
      {
        //Always simulate with a high placeholder so it doesn't fail the simulation phase
        const simMessage = new TransactionMessage(
        {
          payerKey,
          recentBlockhash: blockhash,
          instructions: [placeholderLimitIx, ...batch]
        }).compileToV0Message(lookUpTableAccounts)

        const simTx = new VersionedTransaction(simMessage)
        const simulation = await connection.simulateTransaction(simTx)

        if(simulation.value.err)
        {
          throw new Error(`Transaction simulation failed: ${JSON.stringify(simulation.value.logs)}`)
        }

        const unitsConsumed = simulation.value.unitsConsumed
        if(unitsConsumed === undefined || unitsConsumed === null)
          throw new Error("Simulation succeeded but failed to return unitsConsumed.")

        //Add a 15% safety buffer
        const optimalLimit = Math.ceil(unitsConsumed * 1.15)
        
        let finalInstructions: anchor.web3.TransactionInstruction[] = []

        //Solana default transaction limit is 200,000 CUs. 
        //Only inject the instruction if our optimal budget exceeds this threshold.
        if(optimalLimit > 200_000)
        {
          console.log(`Compute budget (${optimalLimit}) exceeds default. Injecting custom limit instruction.`)
          const optimizedLimitIx = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({ units: optimalLimit })
          finalInstructions = [optimizedLimitIx, ...batch]
        }
        else
        {
          console.log(`Compute budget (${optimalLimit}) is within standard limits. Omitting budget instruction.`)
          finalInstructions = [...batch]
        }

        const finalMessage = new TransactionMessage({
          payerKey,
          recentBlockhash: blockhash,
          instructions: finalInstructions
        }).compileToV0Message(lookUpTableAccounts)

        return new VersionedTransaction(finalMessage)
      }

      let currentBatch: anchor.web3.TransactionInstruction[] = []

      for(let i=0; i<instructionsToSend.length; i++)
      {
        const nextInstruction = instructionsToSend[i]
        var itFits

        try
        {
          const testInstructions = [placeholderLimitIx, ...currentBatch, nextInstruction]
          const testMessage = new TransactionMessage(
          {
            payerKey,
            recentBlockhash: blockhash,
            instructions: testInstructions
          }).compileToV0Message(lookUpTableAccounts)

          const testTx = new VersionedTransaction(testMessage)
          const testSize = testTx.serialize().length

          if(testSize <= MAX_UNSIGNED_SIZE)
            itFits = true
        }
        catch(error)
        {
          var itFits = false
        }

        if(itFits)
          currentBatch.push(nextInstruction)
        else
        {
          if(currentBatch.length > 0)
          {
            const finalizedTx = await finalizeBatch(currentBatch)
            unsignedTransactions.push(finalizedTx)
          }
          
          currentBatch = [nextInstruction]
          
          //Safety check for an oversized single instruction
          const singleTxMessage = new TransactionMessage(
          {
            payerKey,
            recentBlockhash: blockhash,
            instructions: [placeholderLimitIx, ...currentBatch]
          }).compileToV0Message(lookUpTableAccounts)
          
          if(new VersionedTransaction(singleTxMessage).serialize().length > MAX_UNSIGNED_SIZE)
            throw new Error(`Instruction at index ${i} is too large to fit in an isolated transaction chunk!`)
        }
      }

      //Finalize the trailing batch, if any
      if(currentBatch.length > 0)
      {
        const finalizedTx = await finalizeBatch(currentBatch)
        unsignedTransactions.push(finalizedTx)
      }

      console.log(`Simulated and Packed ${unsignedTransactions.length} transaction(s).`)

      const signedTransactions = await anchorPrograms.lending.lendingProgram.provider.wallet.signAllTransactions(unsignedTransactions)
      return signedTransactions
    }
    catch(error)
    {
      throw error
    }
  }*/

  export async function bundleProtocolPriceTransactions(tokenIds: number[], txs: VersionedTransaction[])
  {
    //1. Serialize all transactions to raw Uint8Arrays
    const serializedTxs = txs.map(tx => tx.serialize())

    //2. Calculate the exact total byte size needed for the buffer
    let totalSize = 4 //4 bytes to store the number of token IDs
    totalSize += tokenIds.length * 1 //1 bytes per Token ID u8
    
    totalSize += 4 //4 bytes to store the number of transactions
    for(const txBytes of serializedTxs)
    {
      totalSize += 4 //4 bytes for the transaction length prefix
      totalSize += txBytes.length //The transaction bytes themselves
    }

    //3. Allocate the precise buffer
    const buffer = new ArrayBuffer(totalSize)
    const view = new DataView(buffer)
    const uint8Array = new Uint8Array(buffer)

    let offset = 0

    //4. Write Token IDs
    view.setUint32(offset, tokenIds.length, true) //Little-endian
    offset += 4
    for(const id of tokenIds)
    {
      view.setUint8(offset, id) //u8
      offset += 1
    }

    //5. Write Transactions
    view.setUint32(offset, serializedTxs.length, true)
    offset += 4
    for(const txBytes of serializedTxs)
    {
      view.setUint32(offset, txBytes.length, true) //Prefix with tx length
      offset += 4
      uint8Array.set(txBytes, offset) //Copy raw transaction bytes
      offset += txBytes.length
    }
    console.log("FRONTEND: totalSize allocated =", totalSize)
    console.log("FRONTEND: actual uint8Array byteLength =", uint8Array.byteLength)

    var baseURL = ""

    if(LOCAL_PRICE_ORACLE)
      baseURL = "http://127.0.0.1:8787"
    else
      baseURL = "https://m4a.io"

    //6. Send the raw binary stream directly over the wire
    const oracleResponse = await fetch(`${baseURL}/Api/bundleProtocolPriceTransactions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: uint8Array //Completely skips JSON.stringify stringification overhead!
    })

    if(!oracleResponse.ok)
    {
      const { error } = await oracleResponse.json()
      throw new Error(error)
    }

    const data = await oracleResponse.json()
    return data
  }

  export async function getNeccessaryRefreshInstructionData(userRemainingTabAccounts: any[], userAddress: PublicKey, userAccountIndex: number)
  {
    var uniqueTokenIds = new Set<number>()
    var lendingTabSubMarketAndMonthlyStatementRemainingAccounts = []
    var createMonthlyStatementInstructions: anchor.web3.TransactionInstruction[] = []
    var subMarketOwnerHashMap = new Map<string, number>()

    for(var i=0; i<userRemainingTabAccounts.length; i++)
    {
      //Get unique Token Ids
      uniqueTokenIds.add(userRemainingTabAccounts[i].tokenId)

      //Push Remaining Tab Account
      lendingTabSubMarketAndMonthlyStatementRemainingAccounts.push(userRemainingTabAccounts[i])

      //Push Remaining SubMarket Account
      const subMarket = subMarketsHashMap.map.get(userRemainingTabAccounts[i].tokenId.toString() +
      userRemainingTabAccounts[i].subMarketOwnerAddress +
      userRemainingTabAccounts[i].subMarketIndex.toString())
      const subMarketRemainingAccount =
      {
        pubkey: subMarket.pda,
        isSigner: false,
        isWritable: true
      }
      lendingTabSubMarketAndMonthlyStatementRemainingAccounts.push(subMarketRemainingAccount)

      //Update SubMarketOwner Hash Map
      const previousEntry = subMarketOwnerHashMap.get(userRemainingTabAccounts[i].subMarketOwnerAddress)
      if(previousEntry)
        subMarketOwnerHashMap.set(userRemainingTabAccounts[i].subMarketOwnerAddress, previousEntry + 1)
      else
        subMarketOwnerHashMap.set(userRemainingTabAccounts[i].subMarketOwnerAddress, 1)

      console.log(anchorPrograms.currentStatementMonthNumber.toString())
      console.log(anchorPrograms.currentStatementYear.toString())
      console.log(userRemainingTabAccounts[i].tokenId.toString())
      console.log(userRemainingTabAccounts[i].subMarketOwnerAddress)
      console.log(userRemainingTabAccounts[i].subMarketIndex.toString())
      console.log(userAddress.toString())
      console.log(userAccountIndex.toString())
      

      //Push Remaining Monthly Statement Account
      const monthlyStatement = lendingUserMonthlyStatementsHashMap.map.get(anchorPrograms.currentStatementMonthNumber.toString() +
      anchorPrograms.currentStatementYear.toString() +
      userRemainingTabAccounts[i].tokenId.toString() +
      userRemainingTabAccounts[i].subMarketOwnerAddress +
      userRemainingTabAccounts[i].subMarketIndex.toString() +
      userAddress.toString() +
      userAccountIndex.toString())

      var monthlyStatementPDA: PublicKey
      console.log(monthlyStatement)
      //Create monthly statement for the new month if it doesn't exist
      if(!monthlyStatement)
      {
        const createNewMonthlyStatementInstruction = await anchorPrograms.lending.lendingProgram.methods.createNewMonthlyStatement
        (
          userRemainingTabAccounts[i].tokenId,
          userRemainingTabAccounts[i].subMarketIndex,
          userAccountIndex
        )
        .accounts({ subMarketOwner: new PublicKey(userRemainingTabAccounts[i].subMarketOwnerAddress), lendingUserOwner: userAddress })
        .instruction()

        createMonthlyStatementInstructions.push(createNewMonthlyStatementInstruction)

        //Determine PDA for new MonthlyStatementAccount that will be created
        monthlyStatementPDA = getLendingUserMonthlyStatementAccountPDA(anchorPrograms.currentStatementMonthNumber,
        anchorPrograms.currentStatementYear,
        userRemainingTabAccounts[i].tokenId,
        new PublicKey(userRemainingTabAccounts[i].subMarketOwnerAddress),
        userRemainingTabAccounts[i].subMarketIndex,
        userAddress,
        userAccountIndex)

        //Going to try not adding the monthly statement accounts to the lookuptables since there will always be more monthly statements
        //This would need to be reconsidered for the liquidate function, can't used connectedWallet, has to be Liquidati
        /*if(!doesKeyExistInLookUpTable(connectedWallet.lendingUserLookUpTableAccount, monthlyStatementPDA))
        {
          const extendLookUpTableInstruction = AddressLookupTableProgram.extendLookupTable(
          {
            authority: connectedWallet.publicKey,
            payer: connectedWallet.publicKey,
            lookupTable: connectedWallet.lendingUserLookUpTableAddress,
            addresses: [monthlyStatementPDA]
          })

          createMonthlyStatementInstructions.push(extendLookUpTableInstruction)
        }*/
      }
      else
        monthlyStatementPDA = monthlyStatement.pda

      const monthlyStatementRemainingAccount =
      {
        pubkey: monthlyStatementPDA,
        isSigner: false,
        isWritable: true
      }
      lendingTabSubMarketAndMonthlyStatementRemainingAccounts.push(monthlyStatementRemainingAccount)
    }

    const subMarketOwnerArray = Array.from(subMarketOwnerHashMap, ([subMarketOwnerAddress, count]) => ({ subMarketOwnerAddress, count }))

    return [uniqueTokenIds, createMonthlyStatementInstructions, lendingTabSubMarketAndMonthlyStatementRemainingAccounts, subMarketOwnerArray]
  }

  export function getTokenReserveRemainingAccounts(tokenIds: number[])
  {
    var tokenReserveRemainingAccounts = []

    for(const tokenId of tokenIds)
    {
      //Push Remaining Token Reserve Account
      const tokenReserve = tokenReservesHashMap.map.get(tokenId)
      const tokenReserveRemainingAccount =
      {
        pubkey: tokenReserve.pda,
        isSigner: false,
        isWritable: true
      }
      tokenReserveRemainingAccounts.push(tokenReserveRemainingAccount)
    }

    return tokenReserveRemainingAccounts
  }

  export function getTempRemainingPriceAccount()
  {
    const tempPriceAccountPDA = getPriceAccountPDA(connectedWallet.publicKey)
    return {
      pubkey: tempPriceAccountPDA,
      isSigner: false,
      isWritable: true
    }
  }

  export  function createJitoTipInstruction()
  {
    const randomTipAccount = new PublicKey(JITO_TIP_ACCOUNTS[Math.floor(Math.random() * JITO_TIP_ACCOUNTS.length)])

    const tipAmount = 10000 //10,000 lamports is the minimum Jito Tip
    const jitoTipInstruction = SystemProgram.transfer(
    {
      fromPubkey: connectedWallet.publicKey,
      toPubkey: randomTipAccount,
      lamports: tipAmount,
    })

    return jitoTipInstruction
  }

  export async function closeTempOraclePriceData(toast: any)
  {
    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.closeTempOraclePriceData()
        .remainingAccounts([adminAccounts.priceOracleRemainingAccount])
        .rpc()

      await confirmLendingTransaction(tx, toast, "close_temp_oracle_price_data")
    }
    catch(error)
    {
      var errorMessage = parseProgramErrorCode(error, anchorPrograms.lending.lendingProgram)
      toastPreTransactionError(errorMessage, toast, "close_temp_oracle_price_data")  
    }
  }

  export default getLendingProtocolCEOAccount
</script>