<template></template>
<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { tokenIds, tokenAddressKeys, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { tokenReserveFontEndInfoHashMap, tokenReserveBalancesHashMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { LAMPORTS_PER_SOL } from "@solana/web3.js"
  import { Token, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token"
  import { getTokenReservePDA } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'

  /*const tokenReserveUSDSATA = tokenReserveFontEndInfoHashMap.get(tokenIds.usdsTokenId)
  const tokenReserveUSDCATA = tokenReserveFontEndInfoHashMap.get(tokenIds.usdcTokenMintAddress)
  const tokenReserveSOLATA = tokenReserveFontEndInfoHashMap.get(tokenIds.solTokenMintAddress)
  const tokenReserveWEthATA = tokenReserveFontEndInfoHashMap.get(tokenIds.wethTokenMintAddress)
  const tokenReserveWBtcATA = tokenReserveFontEndInfoHashMap.get(tokenIds.wbtcTokenMintAddress)*/

  //The ATA addresses can be harded coded in once you know the addresses
  var tokenReserveUSDSATA: any
  var tokenReserveUSDCATA: any
  var tokenReserveSOLATA: any
  var tokenReserveWEthATA: any
  var tokenReserveWBtcATA: any
  
  var tokenReserveUSDSATAWatcherId: any
  var tokenReserveUSDCATAWatcherId: any
  var tokenReserveSOLWatcherId: any
  var tokenReserveWEthATAWatcherId: any
  var tokenReserveWBtcATAWatcherId: any

  onMounted(async() =>
  {
    //The ATA address can be harded coded in once you know the address
    //Token Reserve USDS ATA
    let tokenReserveUSDSPDA = getTokenReservePDA(tokenAddressKeys.usdsTokenMintAddress)
    //console.log(tokenReserveUSDSPDA.toString())
    tokenReserveUSDSATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdsTokenMintAddress, //Token Mint Address
      tokenReserveUSDSPDA, //Token Reserve PDA
      true
    )
    console.log(tokenReserveUSDSATA.toString())
    try
    {
      //Get Token Reserve USDS Balance
      const tokenReserveUSDSAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(tokenReserveUSDSATA)
      tokenReserveBalancesHashMap.map.set(tokenIds.usdsTokenId, Number(tokenReserveUSDSAccount.value.uiAmountString))
      await listenForTokenReserveUSDSChanges()
    }
    catch
    {
      console.log("Token Reserve USDS ATA Not Found")
    }

    //Token Reserve USDC ATA
    let tokenReserveUSDCPDA = getTokenReservePDA(tokenAddressKeys.usdcTokenMintAddress)
    //console.log(tokenReserveUSDCPDA.toString())
    tokenReserveUSDCATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdcTokenMintAddress, //Token Mint Address
      tokenReserveUSDCPDA, //Token Reserve PDA
      true
    )
    console.log(tokenReserveUSDCATA.toString())
    try
    {
      //Get Token Reserve USDC Balance
      const tokenReserveUSDCAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(tokenReserveUSDCATA)
      tokenReserveBalancesHashMap.map.set(tokenIds.usdcTokenId, Number(tokenReserveUSDCAccount.value.uiAmountString))
      await listenForTokenReserveUSDCChanges()
    }
    catch
    {
      console.log("Token Reserve USDC ATA Not Found")
    }

    //Token Reserve SOL ATA
    let tokenReserveSOLPDA = getTokenReservePDA(tokenAddressKeys.solTokenMintAddress)
    //console.log(tokenReserveSOLPDA.toString())
    tokenReserveSOLATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.solTokenMintAddress, //Token Mint Address
      tokenReserveSOLPDA, //Token Reserve PDA
      true
    )
    console.log(tokenReserveSOLATA.toString())
    try
    {
      //Get Token Reserve SOL Balance
      const tokenReserveSOLAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(tokenReserveSOLATA)
      tokenReserveBalancesHashMap.map.set(tokenIds.solTokenId, Number(tokenReserveSOLAccount.value.uiAmountString))
      await listenForTokenReserveSOLChanges()
    }
    catch
    {
      console.log("Token Reserve SOL ATA Not Found")
    }

    //Token Reserve WEth ATA
    let tokenReserveWEthPDA = getTokenReservePDA(tokenAddressKeys.wethTokenMintAddress)
    //console.log(tokenReserveWEthPDA.toString())
    tokenReserveWEthATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wethTokenMintAddress, //Token Mint Address
      tokenReserveWEthPDA, //Token Reserve PDA
      true
    )
    console.log(tokenReserveWEthATA.toString())
    try
    {
      //Get Token Reserve WEth Balance
      const tokenReserveWEthAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(tokenReserveWEthATA)
      tokenReserveBalancesHashMap.map.set(tokenIds.wethTokenId, Number(tokenReserveWEthAccount.value.uiAmountString))
      await listenForTokenReserveWEthChanges()
    }
    catch
    {
      console.log("Token Reserve WEth ATA Not Found")
    }

    //The ATA address can be harded coded in once you know the address
    //Token Reserve WBtc ATA
    let tokenReserveWBtcPDA = getTokenReservePDA(tokenAddressKeys.wbtcTokenMintAddress)
    //console.log(tokenReserveWBtcPDA.toString())
    tokenReserveWBtcATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wbtcTokenMintAddress, //Token Mint Address
      tokenReserveWBtcPDA, //Token Reserve PDA
      true
    )
    console.log(tokenReserveWBtcATA.toString())
    try
    {
      //Get Token Reserve WBtc Balance
      const tokenReserveWBtcAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(tokenReserveWBtcATA)
      tokenReserveBalancesHashMap.map.set(tokenIds.wbtcTokenId, Number(tokenReserveWBtcAccount.value.uiAmountString))
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
    try
    {
      //Subscribe to account changes
      tokenReserveUSDSATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(tokenReserveUSDSATA, async() => 
      {
        //Handle account change...
        const tokenReserveUSDSAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(tokenReserveUSDSATA)
        tokenReserveBalancesHashMap.map.set(tokenIds.usdsTokenId, tokenReserveUSDSAccount.value.uiAmount.toFixed(2))
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }
  
  async function listenForTokenReserveUSDCChanges()
  {
    try
    {
      //Subscribe to account changes
      tokenReserveUSDCATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(tokenReserveUSDCATA, async() => 
      {
        //Handle account change...
        const tokenReserveUDSCAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(tokenReserveUSDCATA)
        tokenReserveBalancesHashMap.map.set(tokenIds.usdcTokenId, tokenReserveUDSCAccount.value.uiAmount.toFixed(2))
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForTokenReserveSOLChanges()
  {
    try
    {
      //Subscribe to account changes
      tokenReserveSOLWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(adminAccounts.tokenReserveAddress, async() => 
      {
        //Handle account change...
        const tokenReserveSOLBalance = await anchorPrograms.lending.lendingProgram.provider.connection.getBalance(adminAccounts.tokenReserveAddress)
        const decimalAmount = tokenDecimalHashMap.get(tokenIds.solTokenId)
        tokenReserveBalancesHashMap.map.set(tokenIds.solTokenId, (tokenReserveSOLBalance / LAMPORTS_PER_SOL).toFixed(decimalAmount))
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForTokenReserveWEthChanges()
  {
    try
    {
      //Subscribe to account changes
      tokenReserveWEthATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(tokenReserveWEthATA, async() => 
      {
        //Handle account change...
        const tokenReserveWEthAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(tokenReserveWEthATA)
        tokenReserveBalancesHashMap.map.set(tokenIds.wethTokenId, tokenReserveWEthAccount.value.uiAmount.toFixed(2))
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForTokenReserveWBtcChanges()
  {
    try
    {
      //Subscribe to account changes
      tokenReserveWBtcATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(tokenReserveWBtcATA, async() => 
      {
        //Handle account change...
        const tokenReserveWBtcAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(tokenReserveWBtcATA)
        tokenReserveBalancesHashMap.map.set(tokenIds.wbtcTokenId, tokenReserveWBtcAccount.value.uiAmount.toFixed(2))
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }
</script>