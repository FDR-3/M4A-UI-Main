<template></template>
<script setup lang="ts">
  import { onMounted, onUnmounted, watch, computed } from 'vue'
  import { tokenIds, tokenAddressStrings, tokenAddressKeys, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { hodlTreasuryWalletATAHashMap,
    hodlTreasuryWalletBalancesHashMap,
    solvencyInsuranceTreasuryWalletATAHashMap,
    solvencyInsuranceTreasuryWalletBalancesHashMap } from '/src/assets/globalStates/AdminAccounts.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { anchorPrograms, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { LAMPORTS_PER_SOL, AccountInfo } from "@solana/web3.js"
  import { Token, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, AccountLayout } from '@solana/spl-token'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { getSOLBalanceWrapper, getTokenAccountBalanceWrapper } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { sleep, MAX_RETRY_FETCH, RETRY_TIME_OUT, RETRY_MESSAGE, ERROR_429 } from '/src/assets/helperFunctions/sleep.ts'

  //These are for the Chat and M4A fees
  const hodlTreasuryUSDSWalletATA = hodlTreasuryWalletATAHashMap.get(tokenAddressStrings.usdsTokenMintAddress)
  const hodlTreasuryUSDCWalletATA = hodlTreasuryWalletATAHashMap.get(tokenAddressStrings.usdcTokenMintAddress)

  //These are for Lending Protocol Solvency fees
  const solvencyTreasuryUSDSWalletATA = solvencyInsuranceTreasuryWalletATAHashMap.get(tokenAddressStrings.usdsTokenMintAddress)
  const solvencyTreasuryUSDCWalletATA = solvencyInsuranceTreasuryWalletATAHashMap.get(tokenAddressStrings.usdcTokenMintAddress)
  const solvencyTreasuryWEthWalletATA = solvencyInsuranceTreasuryWalletATAHashMap.get(tokenAddressStrings.wethTokenMintAddress)
  const solvencyTreasuryWBtcWalletATA = solvencyInsuranceTreasuryWalletATAHashMap.get(tokenAddressStrings.wbtcTokenMintAddress)
  
  //The ATA addresses can be harded coded in once you know the addresses
  /*var hodlTreasuryUSDSWalletATA: any
  var hodlTreasuryUSDCWalletATA: any
  var solvencyTreasuryUSDSWalletATA: any
  var solvencyTreasuryUSDCWalletATA: any
  var solvencyTreasuryWEthWalletATA: any
  var solvencyTreasuryWBtcWalletATA: any*/
  
  var hodlUSDSWalletATAWatcherId: any
  var hodlUSDCWalletATAWatcherId: any
  var solvencyUSDSWalletATAWatcherId: any
  var solvencyUSDCWalletATAWatcherId: any
  var solvencySOLWalletWatcherId: any
  var solvencyWEthWalletATAWatcherId: any
  var solvencyWBtcWalletATAWatcherId: any

  var userUSDSWalletATAWatcherId: any
  var userUSDCWalletATAWatcherId: any
  var userSOLWalletATAWatcherId: any
  var userWEthWalletATAWatcherId: any
  var userWBtcWalletATAWatcherId: any

  onMounted(async() =>
  {
    //The ATA address can be harded coded in once you know the address
    //Hodl USDS Wallet Account
    /*let hodlTreasuryUSDSWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdsTokenMintAddress, //Token Mint Address
      adminAccounts.hodlTreasuryAddress //Wallet Public Key
    )
    console.log("HODL USDS ATA: ", hodlTreasuryUSDSWalletATA.toString())*/
    try
    {
      //Get HODL USDS Balance
      const hodlUSDSAccount = await getTokenAccountBalanceWrapper(hodlTreasuryUSDSWalletATA)
      const decimalAmount = tokenDecimalHashMap.get(tokenIds.usdsTokenId)
      hodlTreasuryWalletBalancesHashMap.map.set(tokenIds.usdsTokenId, hodlUSDSAccount.value.uiAmount.toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount }))
      await listenForHODLTreasuryUSDSWalletChanges()
    }
    catch
    {
      console.log("HODL USDS Wallet ATA Not Found")
    }

    //Solvency USDS Wallet Account
    /*let solvencyTreasuryUSDSWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdsTokenMintAddress, //Token Mint Address
      adminAccounts.solvencyTreasuryAddress //Wallet Public Key
    )
    console.log("Solvency USDS ATA: ", solvencyTreasuryUSDSWalletATA.toString())*/
    try
    {
      //Get Solvency USDS Balance
      const solvencyUSDSAccount = await getTokenAccountBalanceWrapper(solvencyTreasuryUSDSWalletATA)
      const decimalAmount = tokenDecimalHashMap.get(tokenIds.usdsTokenId)
      solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenIds.usdsTokenId, solvencyUSDSAccount.value.uiAmount.toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount }))
      await listenForSolvencyTreasuryUSDSWalletChanges()
    }
    catch
    {
      console.log("Solvency USDS Wallet ATA Not Found")
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
    console.log("HODL USDC ATA: ", hodlTreasuryUSDCWalletATA.toString())*/
    try
    {
      //Get HODL USDC Balance
      const hodlUDSCAccount = await getTokenAccountBalanceWrapper(hodlTreasuryUSDCWalletATA)
      const decimalAmount = tokenDecimalHashMap.get(tokenIds.usdcTokenId)
      hodlTreasuryWalletBalancesHashMap.map.set(tokenIds.usdcTokenId, hodlUDSCAccount.value.uiAmount.toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount }))
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
    console.log("Solvency USDC ATA: ", solvencyTreasuryUSDCWalletATA.toString())*/
    try
    {
      //Get Solvency USDC Balance
      const solvencyUDSCAccount = await getTokenAccountBalanceWrapper(solvencyTreasuryUSDCWalletATA)
      const decimalAmount = tokenDecimalHashMap.get(tokenIds.usdcTokenId)
      solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenIds.usdcTokenId, solvencyUDSCAccount.value.uiAmount.toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount }))
      await listenForSolvencyTreasuryUSDCWalletChanges()
    }
    catch
    {
      console.log("Solvency USDC Wallet ATA Not Found")
    }

    //The ATA address can be harded coded in once you know the address
    //Solvency SOL Wallet Account
    try
    {
      //Get Solvency SOL Balance
      const solvencySOLBalance = await getSOLBalanceWrapper(adminAccounts.solvencyTreasuryAddress)
      const decimalAmount = tokenDecimalHashMap.get(tokenIds.solTokenId)
      solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenIds.solTokenId, (solvencySOLBalance / LAMPORTS_PER_SOL).toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount }))
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
    console.log("Solvency WEth ATA: ", solvencyTreasuryWEthWalletATA.toString())*/
    try
    {
      //Get Solvency WEth Balance
      const solvencyWEthAccount = await getTokenAccountBalanceWrapper(solvencyTreasuryWEthWalletATA)
      const decimalAmount = tokenDecimalHashMap.get(tokenIds.wethTokenId)
      solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenIds.wethTokenId, solvencyWEthAccount.value.uiAmount.toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount }))
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
    console.log("Solvency WBtc ATA: ", solvencyTreasuryWBtcWalletATA.toString())*/
    try
    {
      //Get Solvency WBtc Balance
      const solvencyWBtcAccount = await getTokenAccountBalanceWrapper(solvencyTreasuryWBtcWalletATA)
      const decimalAmount = tokenDecimalHashMap.get(tokenIds.wbtcTokenId)
      solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenIds.wbtcTokenId, solvencyWBtcAccount.value.uiAmount.toLocaleString('en-US', {
        minimumFractionDigits: decimalAmount,
        maximumFractionDigits: decimalAmount }))
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
    if(hodlUSDSWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(hodlUSDSWalletATAWatcherId)
      hodlUSDSWalletATAWatcherId = undefined
    }
    if(hodlUSDCWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(hodlUSDCWalletATAWatcherId)
      hodlUSDCWalletATAWatcherId = undefined
    }
    if(solvencyUSDSWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(solvencyUSDSWalletATAWatcherId)
      solvencyUSDSWalletATAWatcherId = undefined
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
    if(userUSDSWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userUSDSWalletATAWatcherId)
      userUSDSWalletATAWatcherId = undefined
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
    return JSON.stringify({addressString: connectedWallet.addressString})
  })

  watch(walletWatch, async (newJSONObjectString, oldJSONObjectString) =>
  { 
    let newWallet = JSON.parse(newJSONObjectString)
    let oldWallet = JSON.parse(oldJSONObjectString)

    if(newWallet.addressString == oldWallet.addressString)
      return

    if(newWallet.addressString == SYSTEM_PROGRAM_ADDRESS_STRING)
    {
      connectedWallet.tokenBalanceMap = new Map<number, string>()
      return
    }

    if(userUSDSWalletATAWatcherId != undefined)
    {
      anchorPrograms.lending.lendingProgram.provider.connection.removeAccountChangeListener(userUSDSWalletATAWatcherId)
      userUSDSWalletATAWatcherId = undefined
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
    //User USDS Wallet Account
    const userUSDSWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdsTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )
    try
    {
      //Get User USDS Wallet Balance
      const userUSDSWalletAccount = await getTokenAccountBalanceWrapper(userUSDSWalletATA)
      connectedWallet.tokenBalanceMap.set(tokenIds.usdsTokenId, userUSDSWalletAccount.value.uiAmount)
      await listenForUserUSDSWalletChanges()
    }
    catch
    {
      console.log("User USDS Wallet ATA Not Found")
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
      const userUSDCWalletAccount = await getTokenAccountBalanceWrapper(userUSDCWalletATA)
      connectedWallet.tokenBalanceMap.set(tokenIds.usdcTokenId, userUSDCWalletAccount.value.uiAmount)
      await listenForUserUSDCWalletChanges()
    }
    catch
    {
      console.log("User USDC Wallet ATA Not Found")
    }

    try
    {
      //Get User SOL Wallet Balance
      const userSolWalletBalance = await getSOLBalanceWrapper(connectedWallet.publicKey)
      connectedWallet.tokenBalanceMap.set(tokenIds.solTokenId, userSolWalletBalance / LAMPORTS_PER_SOL)
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
      const userWEthWalletAccount = await getTokenAccountBalanceWrapper(userWEthWalletATA)
      connectedWallet.tokenBalanceMap.set(tokenIds.wethTokenId, userWEthWalletAccount.value.uiAmount)
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
      const userWBtcWalletAccount = await getTokenAccountBalanceWrapper(userWBtcWalletATA)
      connectedWallet.tokenBalanceMap.set(tokenIds.wbtcTokenId, userWBtcWalletAccount.value.uiAmount)
      await listenForUserWBtcWalletChanges()
    }
    catch
    {
      console.log("User WBtc Wallet ATA Not Found")
    }
  }

  async function listenForHODLTreasuryUSDSWalletChanges()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        hodlUSDSWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(hodlTreasuryUSDSWalletATA,
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
          
          hodlTreasuryWalletBalancesHashMap.map.set(tokenIds.usdsTokenId, uiAmount.toLocaleString('en-US', {
            minimumFractionDigits: decimalAmount,
            maximumFractionDigits: decimalAmount }))
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
  
  async function listenForHODLTreasuryUSDCWalletChanges()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        hodlUSDCWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(hodlTreasuryUSDCWalletATA,
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
          
          hodlTreasuryWalletBalancesHashMap.map.set(tokenIds.usdcTokenId, uiAmount.toLocaleString('en-US', {
            minimumFractionDigits: decimalAmount,
            maximumFractionDigits: decimalAmount }))
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

  async function listenForSolvencyTreasuryUSDSWalletChanges()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        solvencyUSDSWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(solvencyTreasuryUSDSWalletATA,
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
          
          solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenIds.usdsTokenId, uiAmount.toLocaleString('en-US', {
            minimumFractionDigits: decimalAmount,
            maximumFractionDigits: decimalAmount }))
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
  
  async function listenForSolvencyTreasuryUSDCWalletChanges()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        solvencyUSDCWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(solvencyTreasuryUSDCWalletATA,
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
          
          solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenIds.usdcTokenId, uiAmount.toLocaleString('en-US', {
            minimumFractionDigits: decimalAmount,
            maximumFractionDigits: decimalAmount }))
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

  async function listenForSolvencyTreasurySOLWalletChanges()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        solvencySOLWalletWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(adminAccounts.solvencyTreasuryAddress,
        (accountInfo: AccountInfo<Buffer>) =>
        {
          //Handle account change...
          const decimalAmount = tokenDecimalHashMap.get(tokenIds.solTokenId)
          if(accountInfo.lamports)
            solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenIds.solTokenId, (accountInfo.lamports / LAMPORTS_PER_SOL).toLocaleString('en-US', {
              minimumFractionDigits: decimalAmount,
              maximumFractionDigits: decimalAmount }))
          else
            solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenIds.solTokenId, (0).toLocaleString('en-US', {
              minimumFractionDigits: decimalAmount,
              maximumFractionDigits: decimalAmount }))
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

  async function listenForSolvencyTreasuryWEthWalletChanges()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        solvencyWEthWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(solvencyTreasuryWEthWalletATA,
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
          
          solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenIds.wethTokenId, uiAmount.toLocaleString('en-US', {
            minimumFractionDigits: decimalAmount,
            maximumFractionDigits: decimalAmount }))
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

  async function listenForSolvencyTreasuryWBtcWalletChanges()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        solvencyWBtcWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(solvencyTreasuryWBtcWalletATA,
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
          
          solvencyInsuranceTreasuryWalletBalancesHashMap.map.set(tokenIds.wbtcTokenId, uiAmount.toLocaleString('en-US', {
            minimumFractionDigits: decimalAmount,
            maximumFractionDigits: decimalAmount }))
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

  async function listenForUserUSDSWalletChanges()
  {
    const userUSDSATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdsTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )

    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        userUSDSWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userUSDSATA,
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

          connectedWallet.tokenBalanceMap.set(tokenIds.usdsTokenId, uiAmount)
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

  async function listenForUserUSDCWalletChanges()
  {
    const userUsdcWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.usdcTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )

    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        userUSDCWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userUsdcWalletATA,
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
          
          connectedWallet.tokenBalanceMap.set(tokenIds.usdcTokenId, uiAmount)
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

  async function listenForUserSOLWalletChanges()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        userSOLWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(connectedWallet.publicKey,
        (accountInfo: AccountInfo<Buffer>) =>
        {
          //Handle account change...
          const decimalAmount = tokenDecimalHashMap.get(tokenIds.solTokenId)
          if(accountInfo.lamports)
            connectedWallet.tokenBalanceMap.set(tokenIds.solTokenId, (accountInfo.lamports / LAMPORTS_PER_SOL).toFixed(decimalAmount))
          else
            connectedWallet.tokenBalanceMap.set(tokenIds.solTokenId, (0).toFixed(decimalAmount))
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

  async function listenForUserWEthWalletChanges()
  {
    const userWEthWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wethTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )

    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        userWEthWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userWEthWalletATA,
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
          
          connectedWallet.tokenBalanceMap.set(tokenIds.wethTokenId, uiAmount)
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

  async function listenForUserWBtcWalletChanges()
  {
    const userWBtcWalletATA = await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenAddressKeys.wbtcTokenMintAddress, //Token Mint Address
      connectedWallet.publicKey //Wallet Public Key
    )

    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        //Subscribe to account changes
        userWBtcWalletATAWatcherId = anchorPrograms.lending.lendingProgram.provider.connection.onAccountChange(userWBtcWalletATA,
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
          
          connectedWallet.tokenBalanceMap.set(tokenIds.wbtcTokenId, uiAmount)
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