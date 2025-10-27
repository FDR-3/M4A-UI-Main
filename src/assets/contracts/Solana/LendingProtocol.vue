<script lang="ts">
  import * as anchor from "@coral-xyz/anchor"
  import { tokenReserves, tokenReserveDevNetMap, tokenReservesHashMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarkets,
    subMarketsHashMap,
    subMarketOwnerHashMap,
    subMarketOwnerByTokenMintAddressHashMap,
    tokenReserveSubMarketListHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import type { SubMarketOwner } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingerUserHashMap,
    lendingerUserAccountsHashMap,
    lendingerUserDepositBalanceHashMap,
    lendingerUserTabsHashMap,
    lendingerUserAvailableTokenMintAddressesHashMap,
    lendingerUserAvailableYearsByTokenMintAddressHashMap,
    lendingerUserMonthlyStatementsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { anchorPrograms, DEFAULT_3_PERCENT_FEE_SUBMARKET_INDEX } from '/src/assets/globalStates/AnchorPrograms.vue'
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
      hashmap.set(tokenReserves.data[i].tokenMintAddress.toBase58(), tokenReserves.data[i])

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

      //Convert Deposit Amount To Decimal from Fixed Point
      const decimalAmount = tokenDecimalHashMap.get(subMarket.tokenMintAddress.toBase58())
      subMarket.depositedAmount = (Number(subMarket.depositedAmount) / Math.pow(10, decimalAmount)).toFixed(decimalAmount)

      //Convert Fee Percentage To Decimal from Fixed Point
      subMarket.feeOnInterestEarnedRate = (subMarket.feeOnInterestEarnedRate / 100)

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

      const tokenFrontEndProperties = tokenReserveDevNetMap.get(subMarketOwner.ownerSubMarketList[newIndex].tokenMintAddress.toBase58())

      subMarketOwner.ownerSubMarketList[newIndex].feeCollectorAddress = subMarketOwner.ownerSubMarketList[newIndex].feeCollectorAddress.toBase58()
      //subMarketOwner.ownerSubMarketList[newIndex].tokenSVG = tokenFrontEndProperties.svg//This has to be marked raw in the Owners Table since it is cloned at the end of this fuction. The cloning is for allowing users to edit the table without updating the original hashmap. It was originally marked Raw in the TokenReserves.vue file
      subMarketOwner.ownerSubMarketList[newIndex].tokenName = tokenFrontEndProperties.name
      subMarketOwner.ownerSubMarketList[newIndex].svgSource = tokenFrontEndProperties.source
      subMarketOwner.subMarketCount = subMarketOwner.ownerSubMarketList.length

      subMarketOwnerMap.set(subMarket.owner.toBase58(), subMarketOwner)

      //Populate SubMarket Owner by TokenMintAddress hash map
      var list = []

      const previousSubMarketOwnerByTokenMintAddressData = subMarketOwnerByTokenMintAddressMap.get(subMarket.owner.toBase58() + subMarket.tokenMintAddress.toBase58())
      if(previousSubMarketOwnerByTokenMintAddressData)
        list = previousSubMarketOwnerByTokenMintAddressData
  
      list.push(subMarket)
      subMarketOwnerByTokenMintAddressMap.set(subMarket.owner.toBase58() + subMarket.tokenMintAddress.toBase58(), list)

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
    subMarketOwnerByTokenMintAddressHashMap.map = cloneDeep(subMarketOwnerByTokenMintAddressMap) 

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

  export function getUserNextSubMarketIndex(owner: string, tokenMintAddress: string)
  {
    const userSubMarketListByTokenMintAddress = subMarketOwnerByTokenMintAddressHashMap.map.get(owner + tokenMintAddress)

    if(userSubMarketListByTokenMintAddress)
      return userSubMarketListByTokenMintAddress.length
    else
      return 0
  }

  export async function setLendingUserAccountHashMap()
  {
    console.log("Setting Lending User Hashmap")

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

    lendingerUserHashMap.map = lendingUserAccountHashMap
    lendingerUserAccountsHashMap.map = lendingUserAccountListHashMap
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

    var userTabListHashMap = new Map<string, any>()
    var depositBalanceHashMap = new Map<string, any>()
    const lendingUserTabs = await getLendingUserTabsWrapper()
    
    for(var i=0; i<lendingUserTabs.length; i++)
    {
      const lendingUserTabAccount = lendingUserTabs[i].account
      const lendingUserTabAccountPDA = lendingUserTabs[i].publicKey

      //Set user tab list hash map
      var list = []
      const previousLendingUserTabList = userTabListHashMap.get(lendingUserTabAccount.owner.toBase58() + lendingUserTabAccount.userAccountIndex.toString())

      if(previousLendingUserTabList)
        list = previousLendingUserTabList

      const lendingUserTabRemainingAccount = 
      {
        pubkey: lendingUserTabAccountPDA,
        userTabAccountIndex: lendingUserTabAccount.userTabAccountIndex,
        isSigner: false,
        isWritable: true
      }

      list.push(lendingUserTabRemainingAccount)
      list = list.sort((a: any, b: any) => a.userTabAccountIndex - b.userTabAccountIndex) 

      userTabListHashMap.set(lendingUserTabAccount.owner.toBase58() + lendingUserTabAccount.userAccountIndex.toString(), list)

      //Set has deposited balance hash map
      if(lendingUserTabAccount.subMarketOwnerAddress.toString() == adminAccounts.lendingCEOAddressString &&
      lendingUserTabAccount.subMarketIndex == DEFAULT_3_PERCENT_FEE_SUBMARKET_INDEX &&
      lendingUserTabAccount.depositedAmount.gt(new anchor.BN(0)))
      {
        const decimalAmount = tokenDecimalHashMap.get(lendingUserTabAccount.tokenMintAddress.toBase58())

        depositBalanceHashMap.set(lendingUserTabAccount.owner.toBase58() +
        lendingUserTabAccount.userAccountIndex.toString() +
        lendingUserTabAccount.tokenMintAddress.toBase58(), Number(lendingUserTabAccount.depositedAmount  / Math.pow(10, decimalAmount)))//Convert from fixed point notation to decimal
      }
    }

    lendingerUserTabsHashMap.map = userTabListHashMap
    lendingerUserDepositBalanceHashMap.map = depositBalanceHashMap
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

  export async function setLendingUserMonthlyStatementHashMaps()
  {
    console.log("Setting Lending User Monthly Statement Hashmaps")

    var monthlyStatementsHashMap = new Map<string, any>()
    var availableTokenMintAddressesHashMap = new Map<string, any>()
    var availableYearsByTokenMintAddressHashMap = new Map<string, any>()

    const lendingUserMonthlyStatementAccounts = await getLendingUserMonthlyStatementsWrapper()

    for(var i=0; i<lendingUserMonthlyStatementAccounts.length; i++)
    {
      const lendingUserMonthlyStatementAccount = lendingUserMonthlyStatementAccounts[i].account

      const owner = lendingUserMonthlyStatementAccount.owner.toString()
      const tokenMintAddress = lendingUserMonthlyStatementAccount.tokenMintAddress.toString()
      const userAccountIndex = lendingUserMonthlyStatementAccount.userAccountIndex.toString()
      const statementYear = lendingUserMonthlyStatementAccount.statementYear.toString()
      const statementMonth = lendingUserMonthlyStatementAccount.statementMonth.toString()

      //Set User Monthly Statements hash map
      monthlyStatementsHashMap.set(owner + userAccountIndex + tokenMintAddress + statementYear + statementMonth, lendingUserMonthlyStatementAccount)

      //Set User available TokenMintAddress hash map
      var list = []
      const previousLendingUserAvailableTokenMintAddressList = availableTokenMintAddressesHashMap.get(owner + userAccountIndex)

      if(previousLendingUserAvailableTokenMintAddressList)
      {
        list = previousLendingUserAvailableTokenMintAddressList
        if(!list.includes(tokenMintAddress))
        {
          list.push(tokenMintAddress)
          availableTokenMintAddressesHashMap.set(owner + userAccountIndex, list) 
        }
      }
      else
        availableTokenMintAddressesHashMap.set(owner + userAccountIndex, [tokenMintAddress]) 

      //Set User available Statement Year by Token Mint Address hash map
      var list = []
      const previousLendingUserAvailableYearByTokenMintAddressList = availableYearsByTokenMintAddressHashMap.get(owner + userAccountIndex + tokenMintAddress)
      const availableYearByTokenMintAddressObject =
      {
        yearAvailable: lendingUserMonthlyStatementAccount.statementYear
      }

      if(previousLendingUserAvailableYearByTokenMintAddressList)
      {
        list = previousLendingUserAvailableYearByTokenMintAddressList
        if(!list.some((obj: { yearAvailable: any }) => obj.yearAvailable == lendingUserMonthlyStatementAccount.statementYear))
        {
          list.push(availableYearByTokenMintAddressObject)
          list = list.sort((a: any, b: any) => a.yearAvailable - b.yearAvailable) 
          availableYearsByTokenMintAddressHashMap.set(owner + lendingUserMonthlyStatementAccount.userAccountIndex.toString() + tokenMintAddress, list) 
        }
      }
      else
        availableYearsByTokenMintAddressHashMap.set(owner + lendingUserMonthlyStatementAccount.userAccountIndex.toString() + tokenMintAddress, [availableYearByTokenMintAddressObject])
    }

    lendingerUserAvailableTokenMintAddressesHashMap.map = availableTokenMintAddressesHashMap
    lendingerUserAvailableYearsByTokenMintAddressHashMap.map = availableYearsByTokenMintAddressHashMap
    lendingerUserMonthlyStatementsHashMap.map = monthlyStatementsHashMap
  }

  async function getLendingUserMonthlyStatementsWrapper()
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

  export default getLendingProtocolCEOAccount
</script>