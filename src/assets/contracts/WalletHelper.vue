<script lang="ts">
  import { Ref } from 'vue'
  import { metaMaskWalletConnected } from '/src/assets/globalStates/MetaMaskWalletConnected.vue'
  import { Connection, PublicKey } from "@solana/web3.js"
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { Token, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token"

  export const VOTE_COST = 0.04
  export const TOAST_TIME_LEN_SECONDS = 11
  export const TOAST_TIME_LEN_MILLISECONDS = 11000

  export async function askToConnect() 
  {
    if(window.ethereum) 
    {
      connectWallet()
      handleAccountsChanged()   
    }
  }

  export async function connectWallet() 
  {
    window.ethereum.request({method: "eth_requestAccounts"})
  }

  export async function disconnectWallet() 
  {
    delete window.web3
  }

  export async function handleAccountsChanged() 
  {
    var address
    const accounts = await window.ethereum.request({method: 'eth_accounts'})       

    if(accounts.length) 
    {
      address = accounts[0]
      //connectedWallet.addressString =  address
      address =  "0x" + address.substring(2,4) + "..." + address.substring(address.length - 4)

      metaMaskWalletConnected.connected = true
    }
    else
    {
      metaMaskWalletConnected.connected = false
    }
  }

  export async function validateRpcEndpoint(url: string)
  {
    const connection = new Connection(url);

    try
    {
      await connection.getVersion()
      return true
    }
    catch(error)
    {
      return false
    }
  }

  export async function getDynamicPriorityFeePrice(connection: Connection, accountKeys: PublicKey[])
  {
    //Returns an array of fees for the last 150 blocks
    const recentFees = await connection.getRecentPrioritizationFees({lockedWritableAccounts: accountKeys})

    if(recentFees.length === 0)
      return 5000

    const recentRecent = recentFees.slice(-20)
    const medianFee = recentRecent.sort((a: { prioritizationFee: number }, b: { prioritizationFee: number }) =>
    a.prioritizationFee - b.prioritizationFee)[Math.floor(recentRecent.length / 2)].prioritizationFee

    return Math.max(medianFee, 5000)
  }

  export function toastPreTransactionError(error: string, toast: any, contractFunctionName: string)
  {
    toast.add({ severity: 'error',
    summary: `"${contractFunctionName}" Smart Contract Transaction Failed`,
    detail: `${error}`, life: TOAST_TIME_LEN_MILLISECONDS })
  }

  export async function confirmM4ATransaction(transaction: any, toast: any, contractFunctionName: string)
  {
    try
    {
      const confirmation = await anchorPrograms.m4a.m4aProgram.provider.connection.confirmTransaction(transaction, 'processed')//'confirmed' for higher confirmation level, but seems to sometimes give error that transaction already was processed
      
      // Check if the transaction was successful
      if(confirmation.value.err)
      {
        var tempErrorMessage
        if(confirmation.value.err.InstructionError)
          tempErrorMessage = confirmation.value.err.InstructionError[1].Custom
        else
          tempErrorMessage = confirmation.value.err

        var errorMessage = parseProgramErrorCode(tempErrorMessage, anchorPrograms.m4a.m4aProgram)
        console.log("confirmation error: ", errorMessage)
        toast.add({ severity: 'error',
        summary: `"${contractFunctionName}" Smart Contract Transaction Failed`,
        detail: `TX_ID: ${transaction}\n\n${confirmation.value.err}`, life: TOAST_TIME_LEN_MILLISECONDS })
      }
      else
      {
        console.log(`TX_ID: ${transaction}\n\nThe "${contractFunctionName}" contract function has been executed`)
        toast.add({ severity: 'success',
        summary: `"${contractFunctionName}" Smart Contract Transaction Successful!`,
        detail: `TX_ID: ${transaction}\n\nThe "${contractFunctionName}" contract function has been executed`,
        life: TOAST_TIME_LEN_MILLISECONDS })
      }
    }
    catch(error: any)
    {
      var tempErrorMessage
      if(error.InstructionError)
        tempErrorMessage = error.InstructionError[1].Custom
      else
        tempErrorMessage = error

      var errorMessage = parseProgramErrorCode(tempErrorMessage, anchorPrograms.m4a.m4aProgram)
      console.log("confirmation error: ", errorMessage)
      toast.add({ severity: 'error',
      summary: `"${contractFunctionName}" Smart Contract Transaction Failed`,
      detail: `TX_ID: ${transaction}\n\n${error}`, life: TOAST_TIME_LEN_MILLISECONDS })
    }
  }

  export async function confirmChatTransaction(transaction: any, toast: any, contractFunctionName: string)
  {
    try
    {
      const confirmation = await anchorPrograms.chat.chatProgram.provider.connection.confirmTransaction(transaction, 'processed')//'confirmed' for higher confirmation level, but seems to sometimes give error that transaction already was processed
  
      // Check if the transaction was successful
      if(confirmation.value.err)
      {
        var tempErrorMessage
        if(confirmation.value.err.InstructionError)
          tempErrorMessage = confirmation.value.err.InstructionError[1].Custom
        else
          tempErrorMessage = confirmation.value.err

        var errorMessage = parseProgramErrorCode(tempErrorMessage, anchorPrograms.chat.chatProgram)
        console.log("confirmation error: ", errorMessage)
        toast.add({ severity: 'error',
        summary: `"${contractFunctionName}" Smart Contract Transaction Failed`,
        detail: `TX_ID: ${transaction}\n\n${errorMessage}`, life: TOAST_TIME_LEN_MILLISECONDS })
      }
      else
      {
        console.log(`TX_ID: ${transaction}\n\nThe "${contractFunctionName}" contract function has been executed`)
        toast.add({ severity: 'success',
        summary: `"${contractFunctionName}" Smart Contract Transaction Successful!`,
        detail: `TX_ID: ${transaction}\n\nThe "${contractFunctionName}" contract function has been executed`,
        life: TOAST_TIME_LEN_MILLISECONDS })
      }
    }
    catch(error: any)
    {
      var tempErrorMessage
      if(error.InstructionError)
        tempErrorMessage = error.InstructionError[1].Custom
      else
        tempErrorMessage = error

      var errorMessage = parseProgramErrorCode(tempErrorMessage, anchorPrograms.chat.chatProgram)
      console.log("confirmation error: ", errorMessage)
      toast.add({ severity: 'error',
      summary: `"${contractFunctionName}" Smart Contract Transaction Failed`,
      detail: `TX_ID: ${transaction}\n\n${error}`, life: TOAST_TIME_LEN_MILLISECONDS })
    }
  }

  export async function confirmLendingTransaction(transaction: any, toast: any, contractFunctionName: string)
  {
    try
    {
      const confirmation = await anchorPrograms.lending.lendingProgram.provider.connection.confirmTransaction(transaction, 'processed')//'confirmed' for higher confirmation level, but seems to sometimes give error that transaction already was processed

      // Check if the transaction was successful
      if(confirmation.value.err)
      {
        var tempErrorMessage
        if(confirmation.value.err.InstructionError)
          tempErrorMessage = confirmation.value.err.InstructionError[1].Custom
        else
          tempErrorMessage = confirmation.value.err

        var errorMessage = parseProgramErrorCode(tempErrorMessage, anchorPrograms.lending.lendingProgram)
        console.log("confirmation error: ", errorMessage)
        toast.add({ severity: 'error',
        summary: `"${contractFunctionName}" Smart Contract Transaction Failed`,
        detail: `TX_ID: ${transaction}\n\n${errorMessage}`, life: TOAST_TIME_LEN_MILLISECONDS })
      }
      else
      {
        console.log(`TX_ID: ${transaction}\n\nThe "${contractFunctionName}" contract function has been executed`)
        toast.add({ severity: 'success',
        summary: `"${contractFunctionName}" Smart Contract Transaction Successful!`,
        detail: `TX_ID: ${transaction}\n\nThe "${contractFunctionName}" contract function has been executed`,
        life: TOAST_TIME_LEN_MILLISECONDS })
      }
    }
    catch(error: any)
    {
      var tempErrorMessage
      if(error.InstructionError)
        tempErrorMessage = error.InstructionError[1].Custom
      else
        tempErrorMessage = error

      var errorMessage = parseProgramErrorCode(tempErrorMessage, anchorPrograms.lending.lendingProgram)
      console.log("confirmation error: ", errorMessage)
      toast.add({ severity: 'error',
      summary: `"${contractFunctionName}" Smart Contract Transaction Failed`,
      detail: `TX_ID: ${transaction}\n\n${errorMessage}`, life: TOAST_TIME_LEN_MILLISECONDS })
    }
  }

  export async function confirmAlertTransaction(transaction: any, toast: any, contractFunctionName: string)
  {
    try
    {
      const confirmation = await anchorPrograms.alert.alertProgram.provider.connection.confirmTransaction(transaction, 'processed')//'confirmed' for higher confirmation level, but seems to sometimes give error that transaction already was processed
  
      // Check if the transaction was successful
      if(confirmation.value.err)
      {
        var tempErrorMessage
        if(confirmation.value.err.InstructionError)
          tempErrorMessage = confirmation.value.err.InstructionError[1].Custom
        else
          tempErrorMessage = confirmation.value.err

        var errorMessage = parseProgramErrorCode(tempErrorMessage, anchorPrograms.alert.alertProgram)
        console.log("confirmation error: ", errorMessage)
        toast.add({ severity: 'error',
        summary: `"${contractFunctionName}" Smart Contract Transaction Failed`,
        detail: `TX_ID: ${transaction}\n\n${confirmation.value.err}`, life: TOAST_TIME_LEN_MILLISECONDS })
      }
      else
      {
        console.log(`TX_ID: ${transaction}\n\nThe "${contractFunctionName}" contract function has been executed`)
        toast.add({ severity: 'success',
        summary: `"${contractFunctionName}" Smart Contract Transaction Successful!`,
        detail: `TX_ID: ${transaction}\n\nThe "${contractFunctionName}" contract function has been executed`,
        life: TOAST_TIME_LEN_MILLISECONDS })
      }
    }
    catch(error: any)
    {
      var tempErrorMessage
      if(error.InstructionError)
        tempErrorMessage = error.InstructionError[1].Custom
      else
        tempErrorMessage = error

      var errorMessage = parseProgramErrorCode(tempErrorMessage, anchorPrograms.alert.alertProgram)
      console.log("confirmation error: ", errorMessage)
      toast.add({ severity: 'error',
      summary: `"${contractFunctionName}" Smart Contract Transaction Failed`,
      detail: `TX_ID: ${transaction}\n\n${error}`, life: TOAST_TIME_LEN_MILLISECONDS })
    }
  }

  export function toastRPCChangeSuccess(toast: any, rpcURL: string)
  {
    toast.add({ severity: 'success',
    summary: "RPC URL Updated Successfully!",
    detail: `RPC URL was updated to \n\n${rpcURL}`,
    group: 'bottom-left-group',
    life: TOAST_TIME_LEN_MILLISECONDS })
  }

  export function toastRPCChangeFailure(toast: any, rpcURL: string)
  {
    toast.add({ severity: 'error',
    summary: "RPC URL Updated Successfully!",
    detail: `Failed to update RPC URL to \n\n${rpcURL}\n\nEnd Point not valid or unavailable`,
    life: TOAST_TIME_LEN_MILLISECONDS })
  }

  export const copyFullAddressText = "Copy Full Address"
  export const copyTokenMintAddressText = "Copy Token Mint Address"
  export const copyTreasuryATAText = "Copy Treasury ATA"

  export function copyAddress(buttonText: Ref, addressString: string)
  {
    const originalText = buttonText.value

    //Copy address to clipboard
    navigator.clipboard.writeText(addressString)
    buttonText.value = "Copied!"

    setTimeout(() =>
    {
      buttonText.value = originalText // Revert to the initial value
    }, 2000) // 2000 milliseconds = 2 seconds
  }

  export function trimAddress(userAddress: string | PublicKey)
  {
    
    if (typeof userAddress === "string") 
    {
      return (
        userAddress.slice(0, 4) +
        "..." +
        userAddress.slice(-4)
      )
    }
    else
    {
      return (
        userAddress?.toBase58().slice(0, 4) +
        "..." +
        userAddress?.toBase58().slice(-4)
      )
    }
  }

  export function parsePhoneNumberString(phoneNumber: number)
  {
    return '(' + phoneNumber?.toString().slice(0, 3) + ") " + phoneNumber?.toString().slice(3, 6) + '-' + phoneNumber?.toString().slice(6, 10)
  }

  export function parseVoteDollarAmountString(amount: number)
  {
    return '$' + Math.abs(amount * VOTE_COST).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  export function parseVoteDollarAmountNoDollarSign(amount: number)
  {
    return Math.abs(amount * VOTE_COST).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  export function parseDollarAmountStringFromDecimal(amount: number)
  {
    return '$' + (amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  export function parseDollarAmountStringFromDecimalNoDollarSign(amount: number)
  {
    return (amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  export function parseDollarAmountStringFromFixed2PointNotation(amount: number)
  {
    return '$' + (amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) // Divide by 100 to convert from fixed 2 point notation to decimal
  }

  export function parseDollarAmountStringFromFixed2PointNotationNoDollarSign(amount: number)
  {
    return (amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) // Divide by 100 to convert from fixed 2 point notation to decimal
  }

  export function convertFromFixed2PointNotationToDecimal(amount: number)
  {
    return (amount / 100) // Divide by 100 to convert from fixed 2 point notation to decimal
  }

  export function isValidSolanaPublicKey(address: string)
  {
    try 
    {
        new PublicKey(address)

        if(address == SYSTEM_PROGRAM_ADDRESS_STRING)
          return false
        else
          return true
    } catch (error)
    {
        return false
    }
  }

  export function parseProgramErrorCode(error: any, program: any)
  {
    const errorCode = Number(error)
    var errorMessage = ""
    var idlError = null

    if(error.message)
    {
      errorMessage = error.message
      const errorMatch1 = error.message.match(/Error Number: (\d+)/)
      const errorMatch2 = error.message.match(/"Custom":(\d+)/)
      
      if(errorMatch1)
      {
        if(errorMatch1[1])
          idlError = program.idl.errors.find((error: { code: number }) => error.code === parseInt(errorMatch1[1]))
      }
      else if(errorMatch2)
      {
        if(errorMatch2[1])
          idlError = program.idl.errors.find((error: { code: number }) => error.code === parseInt(errorMatch2[1]))
      }
    }
    else if(typeof errorCode === 'number')
    {
      idlError = program.idl.errors.find((error: { code: number }) => error.code === errorCode)
    }

    if(idlError)
      errorMessage = idlError.msg

    console.log(errorMessage)
    return errorMessage
  }

  export function doesKeyExistInLookUpTable(lookUpTableAccount: any, key: PublicKey | string)
  {
    var searchKey = typeof key === "string" ? key : key.toString()
    let addressesAlreadyExists = false

    if(!lookUpTableAccount)
      return addressesAlreadyExists

    for(var i=0; i<lookUpTableAccount.state.addresses.length; i++)
    {
      if(lookUpTableAccount.state.addresses[i].toString() == searchKey)
      {
        addressesAlreadyExists = true
        break
      }
    }

    return addressesAlreadyExists
  }

  export async function deriveATA(walletPublicKey: PublicKey, tokenMintAddress: PublicKey, tokenProgram: PublicKey,  pdaAccount: boolean = false)
  {
    return await Token.getAssociatedTokenAddress
    (
      ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram,
      tokenMintAddress,
      walletPublicKey,
      pdaAccount
    )
  }

  export default toastPreTransactionError
</script>