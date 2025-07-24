<script lang="ts">
  import { Ref } from 'vue'
  import { metaMaskWalletConnected } from '/src/assets/globalStates/MetaMaskWalletConnected.vue'
  import { PublicKey } from "@solana/web3.js"
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

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

  export function toastPreTransactionError(error: string, toast: any, contractFunctionName: string)
  {
    toast.add({ severity: 'error', summary: `"${contractFunctionName}" Smart Contract Transaction Failed`,
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
        toast.add({ severity: 'error', summary: `"${contractFunctionName}" Smart Contract Transaction Failed`,
        detail: `${confirmation.value.err}`, life: TOAST_TIME_LEN_MILLISECONDS })
      }
      else
      {
        toast.add({ severity: 'success', summary: `"${contractFunctionName}" Smart Contract Transaction Successful!`,
        detail: `The UI will update after enough block confirmations, please wait for that before attempting to call the "${contractFunctionName}" contract function again. Feel free to call a different function in the mean time`,
        life: TOAST_TIME_LEN_MILLISECONDS })
      }
    }
    catch(error)
    {
      toast.add({ severity: 'error', summary: `"${contractFunctionName}" Smart Contract Transaction Failed`,
      detail: `${error}`, life: TOAST_TIME_LEN_MILLISECONDS })
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
        toast.add({ severity: 'error', summary: `"${contractFunctionName}" Smart Contract Transaction Failed`,
        detail: `${confirmation.value.err}`, life: TOAST_TIME_LEN_MILLISECONDS })
      }
      else
      {
        toast.add({ severity: 'success', summary: `"${contractFunctionName}" Smart Contract Transaction Successful!`,
        detail: `The UI will update after enough block confirmations, please wait for that before attempting to call the "${contractFunctionName}" contract function again. Feel free to call a different function in the mean time`,
        life: TOAST_TIME_LEN_MILLISECONDS })
      }
    }
    catch(error)
    {
      toast.add({ severity: 'error', summary: `"${contractFunctionName}" Smart Contract Transaction Failed`,
      detail: `${error}`, life: TOAST_TIME_LEN_MILLISECONDS })
    }
  }

  export function copyFullAddress(buttonText: Ref, addressString: string)
  {
    //Copy address to clipboard
    navigator.clipboard.writeText(addressString)
    buttonText.value = "Copied!"

    setTimeout(() =>
    {
      buttonText.value = "Copy Full Address" // Revert to the initial value
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

  export default toastPreTransactionError
</script>