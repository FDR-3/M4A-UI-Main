<script lang="ts">
  import * as anchor from "@coral-xyz/anchor"
  import { tokenReserveDevNetMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarkets, subMarketsHashMap, subMarketOwnerHashMap, tokenReserveHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import type { SubMarketOwner } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { sleep, MAX_RETRY_FETCH, RETRY_TIME_OUT, RETRY_MESSAGE, ERROR_429 } from '/src/assets/helperFunctions/sleep.ts'
  import cloneDeep from 'lodash/cloneDeep'

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

  export async function getSubMarkets()
  {
    console.log("Getting SubMarkets")
    
    var subMarketsList: any = []
    var subMarketsMap = new Map<string, any>()
    var subMarketOwnerMap = new Map<string, any>()
    var tokenReserveMap = new Map<string, any>()

    const allSubMarkets = await getSubMarketsWrapper()

    //Create TokenReserve/SubMarket hash map and SubMarket list for tables
    for(var i=0; i<allSubMarkets.length; i++)
    {
      //Populate Token Reserve hash map
      var ownerTokenReserveList: any = []

      const previousTokenReserveList = tokenReserveMap.get(allSubMarkets[i].account.tokenMintAddress.toBase58())
      if(previousTokenReserveList)
        ownerTokenReserveList = previousTokenReserveList

      ownerTokenReserveList.push(allSubMarkets[i].account)

      tokenReserveMap.set(allSubMarkets[i].account.tokenMintAddress.toBase58(), ownerTokenReserveList)

      //Populate SubMarket Owner hash map
      var subMarketOwner: SubMarketOwner = 
      {
        subMarketCount: 0,
        ownerSubMarketList: []
      }

      const previousSubMarketOwnerData = subMarketOwnerMap.get(allSubMarkets[i].account.owner.toBase58())
      if(previousSubMarketOwnerData)
        subMarketOwner = previousSubMarketOwnerData
  
      subMarketOwner.ownerSubMarketList.push(allSubMarkets[i].account)

      const newIndex = subMarketOwner.ownerSubMarketList.length - 1

      const tokenFrontEndProperties = tokenReserveDevNetMap.get(subMarketOwner.ownerSubMarketList[newIndex].tokenMintAddress.toBase58())

      subMarketOwner.ownerSubMarketList[newIndex].feeCollectorAddress = subMarketOwner.ownerSubMarketList[newIndex].feeCollectorAddress.toBase58()
      //subMarketOwner.ownerSubMarketList[newIndex].tokenSVG = tokenFrontEndProperties.svg//This has to be marked raw in the Owners Table since it is cloned at the end of this fuction. The cloning is for allowing users to edit the table without updating the original hashmap. It was originally marked Raw in the TokenReserves.vue file
      subMarketOwner.ownerSubMarketList[newIndex].tokenName = tokenFrontEndProperties.name
      subMarketOwner.ownerSubMarketList[newIndex].svgSource = tokenFrontEndProperties.source

      subMarketOwner.subMarketCount = subMarketOwner.ownerSubMarketList.length

      subMarketOwnerMap.set(allSubMarkets[i].account.owner.toBase58(), subMarketOwner)

      //Populate SubMarket hash map
      subMarketsMap.set
      (
        allSubMarkets[i].account.tokenMintAddress.toBase58() +
        allSubMarkets[i].account.owner.toBase58() +
        allSubMarkets[i].account.subMarketIndex.toString(), 
        allSubMarkets[i].account
      )

      //Add SubMarket to overall list
      subMarketsList.push(allSubMarkets[i].account)
    }

    console.log("Setting SubMarket Hash Maps")

    tokenReserveHashMap.map = cloneDeep(tokenReserveMap)
    subMarketsHashMap.map = cloneDeep(subMarketsMap)
    subMarketOwnerHashMap.map = cloneDeep(subMarketOwnerMap)

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

  export function getUserNextSubMarketIndex(owner: string)
  {
    const userSubMarketList = subMarketOwnerHashMap.map.get(owner)

    if(userSubMarketList)
      return userSubMarketList.ownerSubMarketList.length
    else
      return 0
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

  export default getLendingProtocolCEOAccount
</script>