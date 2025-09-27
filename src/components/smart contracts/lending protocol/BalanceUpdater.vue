<template></template>
<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { tokenAddressKeysMainNet,
    tokenAddressStringsDevNet,
    tokenAddressKeysDevNet,
    tokenReserveAssociatedTokenAddressKeysDevNet } from '/src/assets/constants/Addresses.ts'
  import { tokenReserveDevNetMap, tokenReserveBalancesMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { hodlTreasuryBalancesDevNetHashMap,
    singlePayerTreasuryBalancesDevNetHashMap,
    hodlTreasuryATADevNetHashMap,
    singlePayerTreasuryATADevNetHashMap } from '/src/assets/globalStates/AdminAccounts.vue'
  import { getTokenReservePDA } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  //import { PublicKey } from "@solana/web3.js"
  import { Token, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token"

  var hodlUSDCATAWatcherId: any
  var singlePayerUSDCATAWatcherId: any
  var tokenReserveUSDCATAWatcherId: any

  const hodlTreasuryUSDCATA = hodlTreasuryATADevNetHashMap.get(tokenAddressStringsDevNet.usdcTokenMintAddress)
  const singlePayerTreasuryUSDCATA = singlePayerTreasuryATADevNetHashMap.get(tokenAddressStringsDevNet.usdcTokenMintAddress)
  const tokenReserveUSDCATA = tokenReserveDevNetMap.get(tokenAddressStringsDevNet.usdcTokenMintAddress).ata

  onMounted(async() =>
  {
    //Hodl Account
    /*hodlTreasuryUSDCATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeysDevNet.usdcTokenMintAddress, //Token Mint Address
      adminAccounts.hodlTreasuryAddress //Wallet Public Key
    )*/
    try
    {
      //Get HODL USDC Balance
      const hodlUDSCAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(hodlTreasuryUSDCATA)
      hodlTreasuryBalancesDevNetHashMap.map.set(tokenAddressStringsDevNet.usdcTokenMintAddress, hodlUDSCAccount.value.uiAmount.toFixed(2))
      await listenForHODLTreasuryUSDCChanges()
    }
    catch(error)
    {
      console.log(error)
    }
     
    //Single Payer Account
    /*singlePayerTreasuryUSDCATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeysDevNet.usdcTokenMintAddress, //Token Mint Address
      adminAccounts.singlePayerTreasuryAddress //Wallet Public Key
    )*/
    try
    {
      //Get Single Payer USDC Balance
      const singlePayerUSDCAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(singlePayerTreasuryUSDCATA)
      singlePayerTreasuryBalancesDevNetHashMap.map.set(tokenAddressStringsDevNet.usdcTokenMintAddress, singlePayerUSDCAccount.value.uiAmount.toFixed(2))
      await listenForSinglePayerTreasuryUSDCChanges()
    }
    catch(error)
    {
      console.log(error)
    }

    const tokenReservePDA = getTokenReservePDA(tokenAddressKeysDevNet.usdcTokenMintAddress)
    //Token Reserve Account
    const test = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeysDevNet.usdcTokenMintAddress, //Token Mint Address
      tokenReservePDA, //Wallet Public Key
      true //allowOwnerOffCurve for getting PDA ATAs
    )

    try
    {
      //Get Token Reserve USDC Balance
      const tokenReserveUSDCAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(tokenReserveUSDCATA)
      tokenReserveBalancesMap.map.set(tokenAddressStringsDevNet.usdcTokenMintAddress, tokenReserveUSDCAccount.value.uiAmount.toFixed(2))
      await listenForTokenReserveUSDCChanges()
    }
    catch(error)
    {
      console.log(error)
    }
  })

  onUnmounted(() => 
  {
    if(hodlUSDCATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(hodlUSDCATAWatcherId)
      hodlUSDCATAWatcherId = undefined
    }
    if(singlePayerUSDCATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(singlePayerUSDCATAWatcherId)
      singlePayerUSDCATAWatcherId = undefined
    }
    if(tokenReserveUSDCATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(tokenReserveUSDCATAWatcherId)
      tokenReserveUSDCATAWatcherId = undefined
    }
  })
  
  async function listenForHODLTreasuryUSDCChanges()
  {
    try
    {
      //Subscribe to account changes
      hodlUSDCATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(hodlTreasuryUSDCATA, async() => 
      {
        //Handle account change...
        const hodlUDSCAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(hodlTreasuryUSDCATA)
        hodlTreasuryBalancesDevNetHashMap.map.set(tokenAddressStringsDevNet.usdcTokenMintAddress, hodlUDSCAccount.value.uiAmount.toFixed(2))
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForSinglePayerTreasuryUSDCChanges()
  {
    try
    {
      //Subscribe to account changes
      singlePayerUSDCATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(singlePayerTreasuryUSDCATA, async() => 
      {
        //Handle account change...
        const singlePayerUSDCAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(singlePayerTreasuryUSDCATA)
        singlePayerTreasuryBalancesDevNetHashMap.map.set(tokenAddressStringsDevNet.usdcTokenMintAddress, singlePayerUSDCAccount.value.uiAmount.toFixed(2))
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
      singlePayerUSDCATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(singlePayerTreasuryUSDCATA, async() => 
      {
        //Handle account change...
        const singlePayerUSDCAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(singlePayerTreasuryUSDCATA)
        singlePayerTreasuryBalancesDevNetHashMap.map.set(tokenAddressStringsDevNet.usdcTokenMintAddress, singlePayerUSDCAccount.value.uiAmount.toFixed(2))
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }
</script>
