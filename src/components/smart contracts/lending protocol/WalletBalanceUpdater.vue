<template></template>
<script setup lang="ts">
  import { onMounted, onUnmounted, watch, computed } from 'vue'
  import { tokenAddressStrings, tokenAddressKeys, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { hodlTreasuryWalletATAHashMap, hodlTreasuryWalletBalancesHashMap } from '/src/assets/globalStates/AdminAccounts.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { anchorPrograms, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { LAMPORTS_PER_SOL } from "@solana/web3.js"
  import { Token, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token"
  //import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'

  //These are for the Chat and M4A fees
  const hodlTreasuryDAIWalletATA = hodlTreasuryWalletATAHashMap.get(tokenAddressStrings.daiTokenMintAddress)
  const hodlTreasuryUSDCWalletATA = hodlTreasuryWalletATAHashMap.get(tokenAddressStrings.usdcTokenMintAddress)
  
  //The ATA addresses can be harded coded in once you know the addresses
  //var hodlTreasuryDAIWalletATA: any
  //var hodlTreasuryUSDCWalletATA: any
  
  var hodlDAIWAlletATAWatcherId: any
  var hodlUSDCWAlletATAWatcherId: any


  var userDAIWAlletATAWatcherId: any
  var userUSDCWalletATAWatcherId: any
  var userSOLWAlletATAWatcherId: any
  var userWETHWalletATAWatcherId: any
  var userWBTCWalletATAWatcherId: any

  onMounted(async() =>
  {
    //The ATA address can be harded coded in once you know the address
    //Hodl DAI Wallet Account
    /*hodlTreasuryDAIWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.daiTokenMintAddress, //Token Mint Address
      adminAccounts.hodlTreasuryAddress //Wallet Public Key
    )*/
    try
    {
      //Get HODL DAI Balance
      const hodlDAIAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(hodlTreasuryDAIWalletATA)
      const decimalAmount = tokenDecimalHashMap.get(tokenAddressStrings.daiTokenMintAddress)
      hodlTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.daiTokenMintAddress, hodlDAIAccount.value.uiAmount.toFixed(decimalAmount))
      await listenForHODLTreasuryDAIWAlletChanges()
    }
    catch
    {
      console.log("HODL DAI WAllet ATA Not Found")
    }

    //The ATA address can be harded coded in once you know the address
    //Hodl USDC Wallet Account
    /*hodlTreasuryUSDCWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdcTokenMintAddress, //Token Mint Address
      adminAccounts.hodlTreasuryAddress //Wallet Public Key
    )*/
    try
    {
      //Get HODL USDC Balance
      const hodlUDSCAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(hodlTreasuryUSDCWalletATA)
      const decimalAmount = tokenDecimalHashMap.get(tokenAddressStrings.usdcTokenMintAddress)
      hodlTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.usdcTokenMintAddress, hodlUDSCAccount.value.uiAmount.toFixed(decimalAmount))
      await listenForHODLTreasuryUSDCWAlletChanges()
    }
    catch
    {
      console.log("HODL USDC WAllet ATA Not Found")
    }
     
    if(connectedWallet.addressString != SYSTEM_PROGRAM_ADDRESS_STRING)
      await getUserWalletBalancesAndWatchForChanges()
  })

  onUnmounted(() => 
  {
    if(hodlDAIWAlletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(hodlDAIWAlletATAWatcherId)
      hodlDAIWAlletATAWatcherId = undefined
    }
    if(hodlUSDCWAlletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(hodlUSDCWAlletATAWatcherId)
      hodlUSDCWAlletATAWatcherId = undefined
    }
    if(userDAIWAlletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userDAIWAlletATAWatcherId)
      userDAIWAlletATAWatcherId = undefined
    }
    if(userUSDCWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userUSDCWalletATAWatcherId)
      userUSDCWalletATAWatcherId = undefined
    }
    if(userSOLWAlletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userSOLWAlletATAWatcherId)
      userSOLWAlletATAWatcherId = undefined
    }
    if(userWETHWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userWETHWalletATAWatcherId)
      userWETHWalletATAWatcherId = undefined
    }
    if(userWBTCWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userWBTCWalletATAWatcherId)
      userWBTCWalletATAWatcherId = undefined
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
    {
      connectedWallet.tokenBalanceMap = new Map<string, string>()
      return
    }

    if(userDAIWAlletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userDAIWAlletATAWatcherId)
      userDAIWAlletATAWatcherId = undefined
    }
    if(userUSDCWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userUSDCWalletATAWatcherId)
      userUSDCWalletATAWatcherId = undefined
    }
    if(userSOLWAlletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userSOLWAlletATAWatcherId)
      userSOLWAlletATAWatcherId = undefined
    }
    if(userWETHWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userWETHWalletATAWatcherId)
      userWETHWalletATAWatcherId = undefined
    }
    if(userWBTCWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userWBTCWalletATAWatcherId)
      userWBTCWalletATAWatcherId = undefined
    }

    await getUserWalletBalancesAndWatchForChanges()
  })

  async function getUserWalletBalancesAndWatchForChanges()
  {
    //User DAI Wallet Account
    const userDaiWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.daiTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Get User DAI Wallet Balance
      const userDaiWalletAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userDaiWalletATA)
      connectedWallet.tokenBalanceMap.set(tokenAddressStrings.daiTokenMintAddress, userDaiWalletAccount.value.uiAmount)
      await listenForUserDAIWalletChanges()
    }
    catch
    {
      console.log("User DAI Wallet ATA Not Found")
    }

    //User USDC Wallet Account
    const userUsdcWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdcTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Get User USDC Wallet Balance
      const userUsdcWalletAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userUsdcWalletATA)
      connectedWallet.tokenBalanceMap.set(tokenAddressStrings.usdcTokenMintAddress, userUsdcWalletAccount.value.uiAmount)
      await listenForUserUSDCWalletChanges()
    }
    catch
    {
      console.log("User USDC Wallet ATA Not Found")
    }

    try
    {
      //Get User SOL Wallet Balance
      const userSolWalletBalance = await anchorPrograms.lending.lendingProgram.provider.connection.getBalance(connectedWallet.publicKey)
      connectedWallet.tokenBalanceMap.set(tokenAddressStrings.solTokenMintAddress, userSolWalletBalance / LAMPORTS_PER_SOL)
      await listenForUserSOLWalletChanges()
    }
    catch(error)
    {
      console.log(error)
    }

    //User WETH Wallet Account
    const userWEthWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wethTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Get User WETH Wallet Balance
      const userWEthWalletAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userWEthWalletATA)
      connectedWallet.tokenBalanceMap.set(tokenAddressStrings.wethTokenMintAddress, userWEthWalletAccount.value.uiAmount)
      await listenForUserWETHWalletChanges()
    }
    catch
    {
      console.log("User WETH Wallet ATA Not Found")
    }

    //User WBTC Wallet Account
    const userWBtcWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wbtcTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Get User WBTC Balance
      const userWBtcWalletAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userWBtcWalletATA)
      connectedWallet.tokenBalanceMap.set(tokenAddressStrings.wbtcTokenMintAddress, userWBtcWalletAccount.value.uiAmount)
      await listenForUserWBTCWalletChanges()
    }
    catch
    {
      console.log("User WBTC Wallet ATA Not Found")
    }
  }
  
  async function listenForHODLTreasuryUSDCWAlletChanges()
  {
    try
    {
      //Subscribe to account changes
      hodlUSDCWAlletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(hodlTreasuryUSDCWalletATA, async() => 
      {
        //Handle account change...
        const hodlUDSCAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(hodlTreasuryUSDCWalletATA)
        hodlTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.usdcTokenMintAddress, hodlUDSCAccount.value.uiAmount.toFixed(2))
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForHODLTreasuryDAIWAlletChanges()
  {
    try
    {
      //Subscribe to account changes
      hodlUSDCWAlletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(hodlTreasuryDAIWalletATA, async() => 
      {
        //Handle account change...
        const hodlDAIAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(hodlTreasuryDAIWalletATA)
        hodlTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.usdcTokenMintAddress, hodlDAIAccount.value.uiAmount.toFixed(2))
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForUserDAIWalletChanges()
  {
    const userDaiATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.daiTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Subscribe to account changes
      userDAIWAlletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userDaiATA, async() => 
      {
        //Handle account change...
        const userDaiAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userDaiATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStrings.daiTokenMintAddress, userDaiAccount.value.uiAmount)
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForUserUSDCWalletChanges()
  {
    const userUsdcWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdcTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Subscribe to account changes
      userUSDCWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userUsdcWalletATA, async() => 
      {
        //Handle account change...
        const userUsdcWalletAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userUsdcWalletATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStrings.usdcTokenMintAddress, userUsdcWalletAccount.value.uiAmount)
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForUserSOLWalletChanges()
  {
    try
    {
      //Subscribe to account changes
      userSOLWAlletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(connectedWallet.publicKey, async() => 
      {
        //Handle account change...
        const userSolWalletBalance = await anchorPrograms.lending.lendingProgram.provider.connection.getBalance(connectedWallet.publicKey)
        connectedWallet.tokenBalanceMap.set(tokenAddressStrings.solTokenMintAddress, userSolWalletBalance / LAMPORTS_PER_SOL)
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForUserWETHWalletChanges()
  {
    const userWEthWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wethTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Subscribe to account changes
      userWETHWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userWEthWalletATA, async() => 
      {
        //Handle account change...
        const userWEthWalletAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userWEthWalletATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStrings.wethTokenMintAddress, userWEthWalletAccount.value.uiAmount)
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForUserWBTCWalletChanges()
  {
    const userWBtcWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wbtcTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Subscribe to account changes
      userWBTCWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userWBtcWalletATA, async() => 
      {
        //Handle account change...
        const userWBtcWalletAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userWBtcWalletATA)
        connectedWallet.tokenBalanceMap.set(tokenAddressStrings.wbtcTokenMintAddress, userWBtcWalletAccount.value.uiAmount)
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }
</script>
