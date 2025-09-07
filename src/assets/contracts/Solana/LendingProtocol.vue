<script lang="ts">
  import * as anchor from "@coral-xyz/anchor"
  import { PublicKey } from "@solana/web3.js"
  import { countryNameArray, 
    countryStateNameArray,
    countryStateCoordinatesArray } from '/src/components/mapclaims/arrays/CountryStateArrays.ts'
  import { trimAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { chatAccountHashMap, customUserNameHashMap } from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { commentSectionHashMap } from '/src/assets/globalStates/chat/CommentSections.vue'
  import { convertUnixTimeToLocalDate, convertUnixTimeToLocalTime } from '/src/assets/helperFunctions/UnixTimeStampHelper.ts'
  import { subMarkets, subMarketOwnerHashMap, tokenReserveHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import type { SubMarketOwner } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { sleep, MAX_RETRY_FETCH, RETRY_TIME_OUT, RETRY_MESSAGE, ERROR_429 } from '/src/assets/helperFunctions/sleep.ts'

  const PROCESSED_SECTION_NAME_INDEX = 0
  const STATE_NAME_INDEX = 1
  const ZOOM_LAT_INDEX = 2
  const ZOOM_LONG_INDEX = 3

  export async function getLendingProtocolCEOAccount()
  {console.log("Getting Lending CEO Account")
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
  {console.log("Getting Token Reserves")
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
  {console.log("Getting SubMarkets")
    var subMarketsList: any = []
    var subMarketOwnerMap = new Map<string, any>()
    var tokenReserveMap = new Map<string, any>()

    const allSubMarkets = await getSubMarketsWrapper()

    //Create TokenReserve/SubMarket hash map and SubMarket list for tables
    for(var i=0; i<allSubMarkets.length; i++)
    {
      //Populate Token Reserve hash map
      var ownerTokenReserveList: any = []

      const previousTokenReserveList = tokenReserveMap.get(allSubMarkets[i].account.tokenMintAddress.toString())
      if(previousTokenReserveList)
        ownerTokenReserveList = previousTokenReserveList

      ownerTokenReserveList.push(allSubMarkets[i].account)

      tokenReserveMap.set(allSubMarkets[i].account.tokenMintAddress.toString(), ownerTokenReserveList)

      //Populate SubMarket Owner hash map
      var subMarketOwner: SubMarketOwner = 
      {
        subMarketCount: 0,
        ownerSubMarketList: []
      }

      const previousSubMarketOwnerData = subMarketOwnerMap.get(allSubMarkets[i].account.owner.toString())
      if(previousSubMarketOwnerData)
        subMarketOwner = previousSubMarketOwnerData
  
      subMarketOwner.ownerSubMarketList.push(allSubMarkets[i].account)
      subMarketOwner.subMarketCount = subMarketOwner.ownerSubMarketList.length

      subMarketOwnerMap.set(allSubMarkets[i].account.owner.toString(), subMarketOwner)

      //Add SubMarket to overall list
      subMarketsList.push(allSubMarkets[i].account)
    }

    subMarketOwnerHashMap.map = subMarketOwnerMap
    tokenReserveHashMap.map = tokenReserveMap

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
    console.log(userSubMarketList.ownerSubMarketList)
    if(userSubMarketList.ownerSubMarketList)
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