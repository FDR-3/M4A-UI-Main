<template></template>
<script setup lang="ts">
  import { onMounted, onUnmounted, watch, computed } from 'vue'
  import { tokenAddressKeysMainNet,
    tokenAddressStringsDevNet,
    tokenAddressKeysDevNet,
    tokenAddressStringsMainNet } from '/src/assets/constants/Addresses.ts'
  import { tokenReserveDevNetMap, tokenReserveBalancesMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { hodlTreasuryBalancesDevNetHashMap,
    singlePayerTreasuryBalancesDevNetHashMap,
    hodlTreasuryATADevNetHashMap,
    singlePayerTreasuryATADevNetHashMap } from '/src/assets/globalStates/AdminAccounts.vue'
  import { getTokenReservePDA } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { anchorPrograms, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  //import { PublicKey } from "@solana/web3.js"
  import { Token, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token"

  const hodlTreasuryUSDCATA = hodlTreasuryATADevNetHashMap.get(tokenAddressStringsDevNet.usdcTokenMintAddress)
  const singlePayerTreasuryUSDCATA = singlePayerTreasuryATADevNetHashMap.get(tokenAddressStringsDevNet.usdcTokenMintAddress)
  const tokenReserveUSDCATA = tokenReserveDevNetMap.get(tokenAddressStringsDevNet.usdcTokenMintAddress).ata

  var hodlUSDCATAWatcherId: any
  var singlePayerUSDCATAWatcherId: any
  var tokenReserveUSDCATAWatcherId: any
  var userDAIATAWatcherId: any
  var userUSDCATAWatcherId: any
  var userUSDCDevATAWatcherId: any
  var userSOLATAWatcherId: any
  var userWETHATAWatcherId: any
  var userWBTCATAWatcherId: any

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
    catch
    {
      console.log("HODL USDC ATA Not Found")
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
    catch
    {
      console.log("Single Payer USDC ATA Not Found")
    }

    //Token Reserve Account
    /*const tokenReservePDA = getTokenReservePDA(tokenAddressKeysDevNet.usdcTokenMintAddress)
    const test = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeysDevNet.usdcTokenMintAddress, //Token Mint Address
      tokenReservePDA, //Wallet Public Key
      true //allowOwnerOffCurve for getting PDA ATAs
    )*/
    try
    {
      //Get Token Reserve USDC Balance
      const tokenReserveUSDCAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(tokenReserveUSDCATA)
      tokenReserveBalancesMap.map.set(tokenAddressStringsDevNet.usdcTokenMintAddress, tokenReserveUSDCAccount.value.uiAmount.toFixed(2))
      await listenForTokenReserveUSDCChanges()
    }
    catch
    {
      console.log("Token Reserve USDC ATA Not Found")
    }

    if(connectedWallet.addressString != SYSTEM_PROGRAM_ADDRESS_STRING)
    {
      //User DAI Account
      const userDaiATA = await Token.getAssociatedTokenAddress
      (
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        tokenAddressKeysMainNet.daiTokenMintAddress, //Token Mint Address
        connectedWallet.publicKey //Wallet Public Key
      )
      try
      {
        //Get User DAI Balance
        const userDaiAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userDaiATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStringsMainNet.daiTokenMintAddress, userDaiAccount.value.uiAmount.toFixed(2))
        await listenForUserDAIChanges()
      }
      catch
      {
        console.log("User DAI ATA Not Found")
      }

      //User USDC Account
      const userUsdcATA = await Token.getAssociatedTokenAddress
      (
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        tokenAddressKeysMainNet.usdcTokenMintAddress, //Token Mint Address
        connectedWallet.publicKey //Wallet Public Key
      )
      try
      {
        //Get User USDC Balance
        const userUsdcAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userUsdcATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStringsMainNet.usdcTokenMintAddress, userUsdcAccount.value.uiAmount.toFixed(2))
        await listenForUserUSDCChanges()
      }
      catch
      {
        console.log("User USDC ATA Not Found")
      }

      //User USDC Dev Account
      const userUsdcDevATA = await Token.getAssociatedTokenAddress
      (
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        tokenAddressKeysDevNet.usdcTokenMintAddress, //Token Mint Address
        connectedWallet.publicKey //Wallet Public Key
      )
      try
      {
        //Get User USDC Dev Balance
        const userUsdcDevAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userUsdcDevATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStringsDevNet.usdcTokenMintAddress, userUsdcDevAccount.value.uiAmount.toFixed(2))
        await listenForUserUSDCDevChanges()
      }
      catch
      {
        console.log("User USDC DevATA Not Found")
      }

      //User SOL Account
      const userSolATA = await Token.getAssociatedTokenAddress
      (
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        tokenAddressKeysMainNet.solTokenMintAddress, //Token Mint Address
        connectedWallet.publicKey //Wallet Public Key
      )
      try
      {
        //Get User SOL Balance
        const userSolAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userSolATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStringsMainNet.solTokenMintAddress, userSolAccount.value.uiAmount.toFixed(2))
        await listenForUserSOLChanges()
      }
      catch
      {
        console.log("User SOL ATA Not Found")
      }

      //User WETH Account
      const userWEthATA = await Token.getAssociatedTokenAddress
      (
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        tokenAddressKeysMainNet.wethTokenMintAddress, //Token Mint Address
        connectedWallet.publicKey //Wallet Public Key
      )
      try
      {
        //Get User WETH Balance
        const userWEthAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userWEthATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStringsMainNet.wethTokenMintAddress, userWEthAccount.value.uiAmount.toFixed(2))
        await listenForUserWETHChanges()
      }
      catch
      {
        console.log("User WETH ATA Not Found")
      }

      //User WBTC Account
      const userWBtcATA = await Token.getAssociatedTokenAddress
      (
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        tokenAddressKeysMainNet.wbtcTokenMintAddress, //Token Mint Address
        connectedWallet.publicKey //Wallet Public Key
      )
      try
      {
        //Get User WBTC Balance
        const userWBtcAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userWBtcATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStringsMainNet.wbtcTokenMintAddress, userWBtcAccount.value.uiAmount.toFixed(2))
        await listenForUserWBTCChanges()
      }
      catch
      {
        console.log("User WBTC ATA Not Found")
      }
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
    if(userDAIATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userDAIATAWatcherId)
      userDAIATAWatcherId = undefined
    }
    if(userUSDCATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userUSDCATAWatcherId)
      userUSDCATAWatcherId = undefined
    }
    if(userUSDCDevATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userUSDCDevATAWatcherId)
      userUSDCDevATAWatcherId = undefined
    }
    if(userSOLATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userSOLATAWatcherId)
      userSOLATAWatcherId = undefined
    }
    if(userWETHATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userWETHATAWatcherId)
      userWETHATAWatcherId = undefined
    }
    if(userWBTCATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userWBTCATAWatcherId)
      userWBTCATAWatcherId = undefined
    }
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

    if(newWallet.addressString == oldWallet.addressString)
      return

    if(newWallet.addressString == SYSTEM_PROGRAM_ADDRESS_STRING)
      return

    if(userDAIATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userDAIATAWatcherId)
      userDAIATAWatcherId = undefined
    }
    if(userUSDCATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userUSDCATAWatcherId)
      userUSDCATAWatcherId = undefined
    }
    if(userUSDCDevATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userUSDCDevATAWatcherId)
      userUSDCDevATAWatcherId = undefined
    }
    if(userSOLATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userSOLATAWatcherId)
      userSOLATAWatcherId = undefined
    }
    if(userWETHATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userWETHATAWatcherId)
      userWETHATAWatcherId = undefined
    }
    if(userWBTCATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userWBTCATAWatcherId)
      userWBTCATAWatcherId = undefined
    }

    await listenForUserDAIChanges()
    await listenForUserUSDCChanges()
    await listenForUserUSDCDevChanges()
    await listenForUserSOLChanges()
    await listenForUserWETHChanges()
    await listenForUserWBTCChanges()
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
    catch
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
    catch
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
    catch
    {
      console.log(error)
    }
  }

  async function listenForUserDAIChanges()
  {
    const userDaiATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeysMainNet.daiTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Subscribe to account changes
      userDAIATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userDaiATA, async() => 
      {
        //Handle account change...
        const userDaiAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userDaiATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStringsMainNet.daiTokenMintAddress, userDaiAccount.value.uiAmount.toFixed(2))
      })
    }
    catch
    {
      console.log(error)
    }
  }

  async function listenForUserUSDCChanges()
  {
    const userUsdcATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeysMainNet.usdcTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Subscribe to account changes
      userUSDCATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userUsdcATA, async() => 
      {
        //Handle account change...
        const userUsdcAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userUsdcATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStringsMainNet.usdcTokenMintAddress, userUsdcAccount.value.uiAmount.toFixed(2))
      })
    }
    catch
    {
      console.log(error)
    }
  }

  async function listenForUserUSDCDevChanges()
  {
    const userUsdcDevATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeysDevNet.usdcTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Subscribe to account changes
      userUSDCDevATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userUsdcDevATA, async() => 
      {
        //Handle account change...
        const userUsdcDevAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userUsdcDevATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStringsDevNet.usdcTokenMintAddress, userUsdcDevAccount.value.uiAmount.toFixed(2))
      })
    }
    catch
    {
      console.log(error)
    }
  }

  async function listenForUserSOLChanges()
  {
    const useSolATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeysMainNet.solTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Subscribe to account changes
      userSOLATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(useSolATA, async() => 
      {
        //Handle account change...
        const userSolAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(useSolATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStringsMainNet.solTokenMintAddress, userSolAccount.value.uiAmount.toFixed(2))
      })
    }
    catch
    {
      console.log(error)
    }
  }

  async function listenForUserWETHChanges()
  {
    const userWEthATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeysMainNet.wethTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Subscribe to account changes
      userWETHATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userWEthATA, async() => 
      {
        //Handle account change...
        const userWEthAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userWEthATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStringsMainNet.wethTokenMintAddress, userWEthAccount.value.uiAmount.toFixed(2))
      })
    }
    catch
    {
      console.log(error)
    }
  }

  async function listenForUserWBTCChanges()
  {
    const userWBtcATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeysMainNet.wbtcTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Subscribe to account changes
      userWBTCATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userWBtcATA, async() => 
      {
        //Handle account change...
        const userWBtcAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userWBtcATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStringsMainNet.wbtcTokenMintAddress, userWBtcAccount.value.uiAmount.toFixed(2))
      })
    }
    catch
    {
      console.log(error)
    }
  }
</script>
