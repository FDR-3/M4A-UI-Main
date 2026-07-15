<template></template>
<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { tokenIds, tokenAddressKeys, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { tokenReserveFontEndInfoHashMap, tokenReserveBalancesHashMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { LAMPORTS_PER_SOL, AccountInfo } from "@solana/web3.js"
  import { Token, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token"
  import { getTokenReservePDA } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { getSOLBalanceWrapper, getTokenAccountBalanceWrapper } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { sleep, MAX_RETRY_FETCH, RETRY_TIME_OUT, RETRY_MESSAGE, ERROR_429 } from '/src/assets/helperFunctions/sleep.ts'

  const tokenReserveUSDSATA = tokenReserveFontEndInfoHashMap.get(tokenIds.usdsTokenId).ata
  const tokenReserveUSDCATA = tokenReserveFontEndInfoHashMap.get(tokenIds.usdcTokenId).ata
  const tokenReserveSOLATA = tokenReserveFontEndInfoHashMap.get(tokenIds.solTokenId).ata
  const tokenReserveWEthATA = tokenReserveFontEndInfoHashMap.get(tokenIds.wethTokenId).ata
  const tokenReserveWBtcATA = tokenReserveFontEndInfoHashMap.get(tokenIds.wbtcTokenId).ata

  //The ATA addresses can be harded coded in once you know the addresses
  /*var tokenReserveUSDSATA: any
  var tokenReserveUSDCATA: any
  var tokenReserveSOLATA: any
  var tokenReserveWEthATA: any
  var tokenReserveWBtcATA: any*/
  
  var tokenReserveUSDSATAWatcherId: any
  var tokenReserveUSDCATAWatcherId: any
  var tokenReserveSOLWatcherId: any
  var tokenReserveWEthATAWatcherId: any
  var tokenReserveWBtcATAWatcherId: any

  onMounted(async() =>
  {
    //The ATA address can be harded coded in once you know the address
    //Token Reserve USDS ATA
    /*let tokenReserveUSDSPDA = getTokenReservePDA(tokenAddressKeys.usdsTokenMintAddress)
    //console.log(tokenReserveUSDSPDA.toString())
    tokenReserveUSDSATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdsTokenMintAddress, //Token Mint Address
      tokenReserveUSDSPDA, //Token Reserve PDA
      true
    )
    console.log(tokenReserveUSDSATA.toString())*/
    try
    {
      //Get Token Reserve USDS Balance
      const tokenReserveUSDSAccount = await getTokenAccountBalanceWrapper(tokenReserveUSDSATA)
      tokenReserveBalancesHashMap.map.set(tokenIds.usdsTokenId, Number(tokenReserveUSDSAccount.value.uiAmount))
      await listenForTokenReserveUSDSChanges()
    }
    catch
    {
      console.log("Token Reserve USDS ATA Not Found")
    }

    //Token Reserve USDC ATA
    /*let tokenReserveUSDCPDA = getTokenReservePDA(tokenAddressKeys.usdcTokenMintAddress)
    //console.log(tokenReserveUSDCPDA.toString())
    tokenReserveUSDCATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdcTokenMintAddress, //Token Mint Address
      tokenReserveUSDCPDA, //Token Reserve PDA
      true
    )
    console.log(tokenReserveUSDCATA.toString())*/
    try
    {
      //Get Token Reserve USDC Balance
      const tokenReserveUSDCAccount = await getTokenAccountBalanceWrapper(tokenReserveUSDCATA)
      tokenReserveBalancesHashMap.map.set(tokenIds.usdcTokenId, Number(tokenReserveUSDCAccount.value.uiAmount))
      await listenForTokenReserveUSDCChanges()
    }
    catch
    {
      console.log("Token Reserve USDC ATA Not Found")
    }

    //Token Reserve SOL ATA
    /*let tokenReserveSOLPDA = getTokenReservePDA(tokenAddressKeys.solTokenMintAddress)
    //console.log(tokenReserveSOLPDA.toString())
    tokenReserveSOLATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.solTokenMintAddress, //Token Mint Address
      tokenReserveSOLPDA, //Token Reserve PDA
      true
    )
    console.log(tokenReserveSOLATA.toString())*/
    try
    {
      //Get Token Reserve SOL Balance
      const tokenReserveSOLAccount = await getTokenAccountBalanceWrapper(tokenReserveSOLATA)
      tokenReserveBalancesHashMap.map.set(tokenIds.solTokenId, Number(tokenReserveSOLAccount.value.uiAmount))
      await listenForTokenReserveSOLChanges()
    }
    catch
    {
      console.log("Token Reserve SOL ATA Not Found")
    }

    //Token Reserve WEth ATA
    /*let tokenReserveWEthPDA = getTokenReservePDA(tokenAddressKeys.wethTokenMintAddress)
    //console.log(tokenReserveWEthPDA.toString())
    tokenReserveWEthATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wethTokenMintAddress, //Token Mint Address
      tokenReserveWEthPDA, //Token Reserve PDA
      true
    )
    console.log(tokenReserveWEthATA.toString())*/
    try
    {
      //Get Token Reserve WEth Balance
      const tokenReserveWEthAccount = await getTokenAccountBalanceWrapper(tokenReserveWEthATA)
      tokenReserveBalancesHashMap.map.set(tokenIds.wethTokenId, Number(tokenReserveWEthAccount.value.uiAmount))
      await listenForTokenReserveWEthChanges()
    }
    catch
    {
      console.log("Token Reserve WEth ATA Not Found")
    }

    //The ATA address can be harded coded in once you know the address
    //Token Reserve WBtc ATA
    /*let tokenReserveWBtcPDA = getTokenReservePDA(tokenAddressKeys.wbtcTokenMintAddress)
    //console.log(tokenReserveWBtcPDA.toString())
    tokenReserveWBtcATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wbtcTokenMintAddress, //Token Mint Address
      tokenReserveWBtcPDA, //Token Reserve PDA
      true
    )
    console.log(tokenReserveWBtcATA.toString())*/
    try
    {
      //Get Token Reserve WBtc Balance
      const tokenReserveWBtcAccount = await getTokenAccountBalanceWrapper(tokenReserveWBtcATA)
      tokenReserveBalancesHashMap.map.set(tokenIds.wbtcTokenId, Number(tokenReserveWBtcAccount.value.uiAmount))
      await listenForTokenReserveWBtcChanges()
    }
    catch
    {
      console.log("Token Reserve WBtc ATA Not Found")
    }
  })

  onUnmounted(() => 
  {
    if(tokenReserveUSDSATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(tokenReserveUSDSATAWatcherId)
      tokenReserveUSDSATAWatcherId = undefined
    }
    if(tokenReserveUSDCATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(tokenReserveUSDCATAWatcherId)
      tokenReserveUSDCATAWatcherId = undefined
    }
    if(tokenReserveSOLWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(tokenReserveSOLWatcherId)
      tokenReserveSOLWatcherId = undefined
    }
    if(tokenReserveWEthATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(tokenReserveWEthATAWatcherId)
      tokenReserveWEthATAWatcherId = undefined
    }
    if(tokenReserveWBtcATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(tokenReserveWBtcATAWatcherId)
      tokenReserveWBtcATAWatcherId = undefined
    }
  })

  async function listenForTokenReserveUSDSChanges()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        tokenReserveUSDSATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(tokenReserveUSDSATA,
        (accountInfo: AccountInfo<Buffer>) =>
        {
          //Handle account change...
          const tokenAccount = AccountLayout.decode(accountInfo.data)
          const view = new DataView
          (
            tokenAccount.amount.buffer, 
            tokenAccount.amount.byteOffset, 
            tokenAccount.amount.byteLength
          )
          const decimalAmount = tokenDecimalHashMap.get(tokenIds.usdsTokenId)
          const uiAmount = Number(view.getBigUint64(0, true)) / Math.pow(10, decimalAmount)
          
          tokenReserveBalancesHashMap.map.set(tokenIds.usdsTokenId, uiAmount)
        })

        break
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
          console.error(error)
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }
  
  async function listenForTokenReserveUSDCChanges()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        tokenReserveUSDCATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(tokenReserveUSDCATA,
        (accountInfo: AccountInfo<Buffer>) =>
        {
          //Handle account change...
          const tokenAccount = AccountLayout.decode(accountInfo.data)
          const view = new DataView
          (
            tokenAccount.amount.buffer, 
            tokenAccount.amount.byteOffset, 
            tokenAccount.amount.byteLength
          )
          const decimalAmount = tokenDecimalHashMap.get(tokenIds.usdcTokenId)
          const uiAmount = Number(view.getBigUint64(0, true)) / Math.pow(10, decimalAmount)
          
          tokenReserveBalancesHashMap.map.set(tokenIds.usdcTokenId, uiAmount)
        })

        break
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
          console.error(error)
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  async function listenForTokenReserveSOLChanges()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        tokenReserveSOLWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(tokenReserveSOLATA,
        (accountInfo: AccountInfo<Buffer>) =>
        {
          //Handle account change...
          const decimalAmount = tokenDecimalHashMap.get(tokenIds.solTokenId)
          if(accountInfo.lamports)
            tokenReserveBalancesHashMap.map.set(tokenIds.solTokenId, (accountInfo.lamports / LAMPORTS_PER_SOL).toFixed(decimalAmount))
          else
            tokenReserveBalancesHashMap.map.set(tokenIds.solTokenId, (0).toFixed(decimalAmount))
        })

        break
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
          console.error(error)
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  async function listenForTokenReserveWEthChanges()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        tokenReserveWEthATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(tokenReserveWEthATA,
        (accountInfo: AccountInfo<Buffer>) =>
        {
          //Handle account change...
          const tokenAccount = AccountLayout.decode(accountInfo.data)
          const view = new DataView
          (
            tokenAccount.amount.buffer, 
            tokenAccount.amount.byteOffset, 
            tokenAccount.amount.byteLength
          )
          const decimalAmount = tokenDecimalHashMap.get(tokenIds.wethTokenId)
          const uiAmount = Number(view.getBigUint64(0, true)) / Math.pow(10, decimalAmount)
          
          tokenReserveBalancesHashMap.map.set(tokenIds.wethTokenId, uiAmount)
        })

        break
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
          console.error(error)
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  async function listenForTokenReserveWBtcChanges()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        tokenReserveWBtcATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(tokenReserveWBtcATA,
        (accountInfo: AccountInfo<Buffer>) =>
        {
          //Handle account change...
          const tokenAccount = AccountLayout.decode(accountInfo.data)
          const view = new DataView
          (
            tokenAccount.amount.buffer, 
            tokenAccount.amount.byteOffset, 
            tokenAccount.amount.byteLength
          )
          const decimalAmount = tokenDecimalHashMap.get(tokenIds.wbtcTokenId)
          const uiAmount = Number(view.getBigUint64(0, true)) / Math.pow(10, decimalAmount)
          
          tokenReserveBalancesHashMap.map.set(tokenIds.wbtcTokenId, uiAmount)
        })

        break
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
          console.error(error)
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }
</script>