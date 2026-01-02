<template></template>
<script setup lang="ts">
  import { onMounted, onUnmounted, watch, computed } from 'vue'
  import { tokenAddressStrings, tokenAddressKeys, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { hodlTreasuryWalletATAHashMap,
    hodlTreasuryWalletBalancesHashMap,
    solvencyInsuranceTreasuryWalletATAHashMap,
    solvencyInsuranceTreasuryWalletBalancesHashMap } from '/src/assets/globalStates/AdminAccounts.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { anchorPrograms, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { LAMPORTS_PER_SOL } from "@solana/web3.js"
  import { Token, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token"
  //import { getTokenReservePDA } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'

  //These are for the Chat and M4A fees
  const hodlTreasuryDAIWalletATA = hodlTreasuryWalletATAHashMap.get(tokenAddressStrings.daiTokenMintAddress)
  const hodlTreasuryUSDCWalletATA = hodlTreasuryWalletATAHashMap.get(tokenAddressStrings.usdcTokenMintAddress)

  //These are for Lending Protocol Solvency fees
  const solvencyTreasuryDAIWalletATA = solvencyInsuranceTreasuryWalletATAHashMap.get(tokenAddressStrings.daiTokenMintAddress)
  const solvencyTreasuryUSDCWalletATA = solvencyInsuranceTreasuryWalletATAHashMap.get(tokenAddressStrings.usdcTokenMintAddress)
  const solvencyTreasurySOLWalletATA = solvencyInsuranceTreasuryWalletATAHashMap.get(tokenAddressStrings.solTokenMintAddress)
  const solvencyTreasuryWEthWalletATA = solvencyInsuranceTreasuryWalletATAHashMap.get(tokenAddressStrings.wethTokenMintAddress)
  const solvencyTreasuryWBtcWalletATA = solvencyInsuranceTreasuryWalletATAHashMap.get(tokenAddressStrings.wbtcTokenMintAddress)
  
  //The ATA addresses can be harded coded in once you know the addresses
  /*var hodlTreasuryDAIWalletATA: any
  var hodlTreasuryUSDCWalletATA: any
  var solvencyTreasuryDAIWalletATA: any
  var solvencyTreasuryUSDCWalletATA: any
  var solvencyTreasurySOLWalletATA: any
  var solvencyTreasuryWEthWalletATA: any
  var solvencyTreasuryWBtcWalletATA: any*/
  
  var hodlDAIWalletATAWatcherId: any
  var hodlUSDCWalletATAWatcherId: any
  var solvencyDAIWalletATAWatcherId: any
  var solvencyUSDCWalletATAWatcherId: any
  var solvencySOLWalletWatcherId: any
  var solvencyWEthWalletATAWatcherId: any
  var solvencyWBtcWalletATAWatcherId: any

  var userDAIWalletATAWatcherId: any
  var userUSDCWalletATAWatcherId: any
  var userSOLWalletATAWatcherId: any
  var userWEthWalletATAWatcherId: any
  var userWBtcWalletATAWatcherId: any

  onMounted(async() =>
  {
    /*//The ATA address can be harded coded in once you know the address
    //Token Reserve DAI ATA
    let tokenReserveDAIPDA = getTokenReservePDA(tokenAddressKeys.daiTokenMintAddress)
    //console.log(tokenReserveDAIPDA.toString())
    let tokenReserveDAIWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.daiTokenMintAddress, //Token Mint Address
      tokenReserveDAIPDA, //Token Reserve PDA
      true
    )
    console.log(tokenReserveDAIWalletATA.toString())
    
    //Token Reserve USDC ATA
    let tokenReserveUSDCPDA = getTokenReservePDA(tokenAddressKeys.usdcTokenMintAddress)
    //console.log(tokenReserveUSDCPDA.toString())
    let tokenReserveUSDCWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdcTokenMintAddress, //Token Mint Address
      tokenReserveUSDCPDA, //Token Reserve PDA
      true
    )
    console.log(tokenReserveUSDCWalletATA.toString())

    //Token Reserve SOL ATA
    let tokenReserveSOLPDA = getTokenReservePDA(tokenAddressKeys.solTokenMintAddress)
    //console.log(tokenReserveSOLPDA.toString())
    let tokenReserveSOLWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.solTokenMintAddress, //Token Mint Address
      tokenReserveSOLPDA, //Token Reserve PDA
      true
    )
    console.log(tokenReserveSOLWalletATA.toString())

    //Token Reserve WEth ATA
    let tokenReserveWEthPDA = getTokenReservePDA(tokenAddressKeys.wethTokenMintAddress)
    //console.log(tokenReserveWEthPDA.toString())
    let tokenReserveWEthATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wethTokenMintAddress, //Token Mint Address
      tokenReserveWEthPDA, //Token Reserve PDA
      true
    )
    console.log(tokenReserveWEthATA.toString())


    //The ATA address can be harded coded in once you know the address
    //Token Reserve WBtc ATA
    let tokenReserveWBtcPDA = getTokenReservePDA(tokenAddressKeys.wbtcTokenMintAddress)
    //console.log(tokenReserveWBtcPDA.toString())
    let tokenReserveWBtcATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wbtcTokenMintAddress, //Token Mint Address
      tokenReserveWBtcPDA, //Token Reserve PDA
      true
    )
    console.log(tokenReserveWBtcATA.toString())*/

    //The ATA address can be harded coded in once you know the address
    //Hodl DAI Wallet Account
    /*let hodlTreasuryDAIWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.daiTokenMintAddress, //Token Mint Address
      adminAccounts.hodlTreasuryAddress //Wallet Public Key
    )
    console.log(hodlTreasuryDAIWalletATA.toString())*/
    try
    {
      //Get HODL DAI Balance
      const hodlDAIAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(hodlTreasuryDAIWalletATA)
      const decimalAmount = tokenDecimalHashMap.get(tokenAddressStrings.daiTokenMintAddress)
      hodlTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.daiTokenMintAddress, hodlDAIAccount.value.uiAmount.toFixed(decimalAmount))
      await listenForHODLTreasuryDAIWalletChanges()
    }
    catch
    {
      console.log("HODL DAI Wallet ATA Not Found")
    }
    //Solvency DAI Wallet Account
    /*let solvencyTreasuryDAIWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.daiTokenMintAddress, //Token Mint Address
      adminAccounts.solvencyTreasuryAddress //Wallet Public Key
    )
    console.log(solvencyTreasuryDAIWalletATA.toString())*/
    try
    {
      //Get Solvency DAI Balance
      const solvencyDAIAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(solvencyTreasuryDAIWalletATA)
      const decimalAmount = tokenDecimalHashMap.get(tokenAddressStrings.daiTokenMintAddress)
      solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.daiTokenMintAddress, solvencyDAIAccount.value.uiAmount.toFixed(decimalAmount))
      await listenForSolvencyTreasuryDAIWalletChanges()
    }
    catch
    {
      console.log("Solvency DAI Wallet ATA Not Found")
    }

    //The ATA address can be harded coded in once you know the address
    //Hodl USDC Wallet Account
    /*let hodlTreasuryUSDCWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdcTokenMintAddress, //Token Mint Address
      adminAccounts.hodlTreasuryAddress //Wallet Public Key
    )
    console.log(hodlTreasuryUSDCWalletATA.toString())*/
    try
    {
      //Get HODL USDC Balance
      const hodlUDSCAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(hodlTreasuryUSDCWalletATA)
      const decimalAmount = tokenDecimalHashMap.get(tokenAddressStrings.usdcTokenMintAddress)
      hodlTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.usdcTokenMintAddress, hodlUDSCAccount.value.uiAmount.toFixed(decimalAmount))
      await listenForHODLTreasuryUSDCWalletChanges()
    }
    catch
    {
      console.log("HODL USDC Wallet ATA Not Found")
    }
    //Solvency USDC Wallet Account
    /*let solvencyTreasuryUSDCWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdcTokenMintAddress, //Token Mint Address
      adminAccounts.solvencyTreasuryAddress //Wallet Public Key
    )
    console.log(solvencyTreasuryUSDCWalletATA.toString())*/
    try
    {
      //Get Solvency USDC Balance
      const solvencyUDSCAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(solvencyTreasuryUSDCWalletATA)
      const decimalAmount = tokenDecimalHashMap.get(tokenAddressStrings.usdcTokenMintAddress)
      solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.usdcTokenMintAddress, solvencyUDSCAccount.value.uiAmount.toFixed(decimalAmount))
      await listenForSolvencyTreasuryUSDCWalletChanges()
    }
    catch
    {
      console.log("Solvency USDC Wallet ATA Not Found")
    }

    //The ATA address can be harded coded in once you know the address
    //Solvency SOL Wallet Account
    /*let solvencyTreasurySOLWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.solTokenMintAddress, //Token Mint Address
      adminAccounts.solvencyTreasuryAddress //Wallet Public Key
    )
    console.log(solvencyTreasurySOLWalletATA.toString())*/
    try
    {
      //Get Solvency SOL Balance
      const solvencySOLBalance = await anchorPrograms.lending.lendingProgram.provider.connection.getBalance(adminAccounts.solvencyTreasuryAddress)
      const decimalAmount = tokenDecimalHashMap.get(tokenAddressStrings.solTokenMintAddress)
      solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.solTokenMintAddress, (solvencySOLBalance / LAMPORTS_PER_SOL).toFixed(decimalAmount))
      await listenForSolvencyTreasurySOLWalletChanges()
    }
    catch
    {
      console.log("Solvency SOL Wallet ATA Not Found")
    }

    //The ATA address can be harded coded in once you know the address
    //Solvency WEth Wallet Account
    /*let solvencyTreasuryWEthWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wethTokenMintAddress, //Token Mint Address
      adminAccounts.solvencyTreasuryAddress //Wallet Public Key
    )
    console.log(solvencyTreasuryWEthWalletATA.toString())*/
    try
    {
      //Get Solvency WEth Balance
      const solvencyWEthAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(solvencyTreasuryWEthWalletATA)
      const decimalAmount = tokenDecimalHashMap.get(tokenAddressStrings.wethTokenMintAddress)
      solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.wethTokenMintAddress, solvencyWEthAccount.value.uiAmount.toFixed(decimalAmount))
      await listenForSolvencyTreasuryWEthWalletChanges()
    }
    catch
    {
      console.log("Solvency WEth Wallet ATA Not Found")
    }

    //The ATA address can be harded coded in once you know the address
    //Solvency WBtc Wallet Account
    /*let solvencyTreasuryWBtcWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wbtcTokenMintAddress, //Token Mint Address
      adminAccounts.solvencyTreasuryAddress //Wallet Public Key
    )
    console.log(solvencyTreasuryWBtcWalletATA.toString())*/
    try
    {
      //Get Solvency WBtc Balance
      const solvencyWBtcAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(solvencyTreasuryWBtcWalletATA)
      const decimalAmount = tokenDecimalHashMap.get(tokenAddressStrings.wbtcTokenMintAddress)
      solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.wbtcTokenMintAddress, solvencyWBtcAccount.value.uiAmount.toFixed(decimalAmount))
      await listenForSolvencyTreasuryWBtcWalletChanges()
    }
    catch
    {
      console.log("Solvency WBtc Wallet ATA Not Found")
    }
     
    if(connectedWallet.addressString != SYSTEM_PROGRAM_ADDRESS_STRING)
      await getUserWalletBalancesAndWatchForChanges()
  })

  onUnmounted(() => 
  {
    if(hodlDAIWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(hodlDAIWalletATAWatcherId)
      hodlDAIWalletATAWatcherId = undefined
    }
    if(hodlUSDCWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(hodlUSDCWalletATAWatcherId)
      hodlUSDCWalletATAWatcherId = undefined
    }
    if(solvencyDAIWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(solvencyDAIWalletATAWatcherId)
      solvencyDAIWalletATAWatcherId = undefined
    }
    if(solvencyUSDCWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(solvencyUSDCWalletATAWatcherId)
      solvencyUSDCWalletATAWatcherId = undefined
    }
    if(solvencySOLWalletWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(solvencySOLWalletWatcherId)
      solvencySOLWalletWatcherId = undefined
    }
    if(solvencyWEthWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(solvencyWEthWalletATAWatcherId)
      solvencyWEthWalletATAWatcherId = undefined
    }
    if(solvencyWBtcWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(solvencyWBtcWalletATAWatcherId)
      solvencyWBtcWalletATAWatcherId = undefined
    }
    if(userDAIWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userDAIWalletATAWatcherId)
      userDAIWalletATAWatcherId = undefined
    }
    if(userUSDCWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userUSDCWalletATAWatcherId)
      userUSDCWalletATAWatcherId = undefined
    }
    if(userSOLWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userSOLWalletATAWatcherId)
      userSOLWalletATAWatcherId = undefined
    }
    if(userWEthWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userWEthWalletATAWatcherId)
      userWEthWalletATAWatcherId = undefined
    }
    if(userWBtcWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userWBtcWalletATAWatcherId)
      userWBtcWalletATAWatcherId = undefined
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

    if(userDAIWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userDAIWalletATAWatcherId)
      userDAIWalletATAWatcherId = undefined
    }
    if(userUSDCWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userUSDCWalletATAWatcherId)
      userUSDCWalletATAWatcherId = undefined
    }
    if(userSOLWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userSOLWalletATAWatcherId)
      userSOLWalletATAWatcherId = undefined
    }
    if(userWEthWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userWEthWalletATAWatcherId)
      userWEthWalletATAWatcherId = undefined
    }
    if(userWBtcWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userWBtcWalletATAWatcherId)
      userWBtcWalletATAWatcherId = undefined
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
    const userUSDCWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdcTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Get User USDC Wallet Balance
      const userUSDCWalletAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userUSDCWalletATA)
      connectedWallet.tokenBalanceMap.set(tokenAddressStrings.usdcTokenMintAddress, userUSDCWalletAccount.value.uiAmount)
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

    //User WEth Wallet Account
    const userWEthWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wethTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Get User WEth Wallet Balance
      const userWEthWalletAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userWEthWalletATA)
      connectedWallet.tokenBalanceMap.set(tokenAddressStrings.wethTokenMintAddress, userWEthWalletAccount.value.uiAmount)
      await listenForUserWEthWalletChanges()
    }
    catch
    {
      console.log("User WEth Wallet ATA Not Found")
    }

    //User WBtc Wallet Account
    const userWBtcWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wbtcTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Get User WBtc Balance
      const userWBtcWalletAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(userWBtcWalletATA)
      connectedWallet.tokenBalanceMap.set(tokenAddressStrings.wbtcTokenMintAddress, userWBtcWalletAccount.value.uiAmount)
      await listenForUserWBtcWalletChanges()
    }
    catch
    {
      console.log("User WBtc Wallet ATA Not Found")
    }
  }

  async function listenForHODLTreasuryDAIWalletChanges()
  {
    try
    {
      //Subscribe to account changes
      hodlDAIWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(hodlTreasuryDAIWalletATA, async() => 
      {
        //Handle account change...
        const hodlDAIAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(hodlTreasuryDAIWalletATA)
        hodlTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.daiTokenMintAddress, hodlDAIAccount.value.uiAmount.toFixed(2))
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }
  
  async function listenForHODLTreasuryUSDCWalletChanges()
  {
    try
    {
      //Subscribe to account changes
      hodlUSDCWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(hodlTreasuryUSDCWalletATA, async() => 
      {
        //Handle account change...
        const hodlUSDCAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(hodlTreasuryUSDCWalletATA)
        hodlTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.usdcTokenMintAddress, hodlUSDCAccount.value.uiAmount.toFixed(2))
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForSolvencyTreasuryDAIWalletChanges()
  {
    try
    {
      //Subscribe to account changes
      solvencyDAIWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(solvencyTreasuryDAIWalletATA, async() => 
      {
        //Handle account change...
        const solvencyDAIAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(solvencyTreasuryDAIWalletATA)
        solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.daiTokenMintAddress, solvencyDAIAccount.value.uiAmount.toFixed(2))
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }
  
  async function listenForSolvencyTreasuryUSDCWalletChanges()
  {
    try
    {
      //Subscribe to account changes
      solvencyUSDCWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(solvencyTreasuryUSDCWalletATA, async() => 
      {
        //Handle account change...
        const solvencyUDSCAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(solvencyTreasuryUSDCWalletATA)
        solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.usdcTokenMintAddress, solvencyUDSCAccount.value.uiAmount.toFixed(2))
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForSolvencyTreasurySOLWalletChanges()
  {
    try
    {
      //Subscribe to account changes
      solvencySOLWalletWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(adminAccounts.solvencyTreasuryAddress, async() => 
      {
        //Handle account change...
        const solvencySOLBalance = await anchorPrograms.lending.lendingProgram.provider.connection.getBalance(adminAccounts.solvencyTreasuryAddress)
        const decimalAmount = tokenDecimalHashMap.get(tokenAddressStrings.solTokenMintAddress)
        solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.solTokenMintAddress, (solvencySOLBalance / LAMPORTS_PER_SOL).toFixed(decimalAmount))
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForSolvencyTreasuryWEthWalletChanges()
  {
    try
    {
      //Subscribe to account changes
      solvencyWEthWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(solvencyTreasuryWEthWalletATA, async() => 
      {
        //Handle account change...
        const solvencyWEthAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(solvencyTreasuryWEthWalletATA)
        solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.wethTokenMintAddress, solvencyWEthAccount.value.uiAmount.toFixed(2))
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForSolvencyTreasuryWBtcWalletChanges()
  {
    try
    {
      //Subscribe to account changes
      solvencyWBtcWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(solvencyTreasuryWBtcWalletATA, async() => 
      {
        //Handle account change...
        const solvencyWBtcAccount = await anchorPrograms.lending.lendingProgram.provider.connection.getTokenAccountBalance(solvencyTreasuryWBtcWalletATA)
        solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenAddressStrings.wbtcTokenMintAddress, solvencyWBtcAccount.value.uiAmount.toFixed(2))
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
      userDAIWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userDaiATA, async() => 
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
      userSOLWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(connectedWallet.publicKey, async() => 
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

  async function listenForUserWEthWalletChanges()
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
      userWEthWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userWEthWalletATA, async() => 
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

  async function listenForUserWBtcWalletChanges()
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
      userWBtcWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userWBtcWalletATA, async() => 
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