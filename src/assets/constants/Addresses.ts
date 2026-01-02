import { PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
import { DEV_MODE } from '/src/assets/globalStates/EnvironmentSettings.ts'

export const solvencyTreasuryWalletPublicKeyString = "2TnxW9qAgPjHmHUXde6zgxNa8F4nY3kfDpdRJsT8HdPU"

var DAI_TOKEN_MINT_ADDRESS = "EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o"
var USDC_TOKEN_MINT_ADDRESS = ""
var SOL_TOKEN_MINT_ADDRESS = "So11111111111111111111111111111111111111112"
var WETH_TOKEN_MINT_ADDRESS = "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs"
var WBTC_TOKEN_MINT_ADDRESS = "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh"

//These are for the Chat and M4A fees
var HODL_DAI_WALLET_ATA = "EE33UzMMHRQDfaB9QAYCYptLB34tBt2tFrg6StPVHM2b"
var HODL_USDC_WALLET_ATA = ""

var SOLVENCY_DAI_WALLET_ATA = "9ZEPoZeXdETx3WGy1naq5BTGxrd3foEjaygw3wRGgU4W"
var SOLVENCY_USDC_WALLET_ATA = ""
var SOLVENCY_SOL_WALLET_ATA = solvencyTreasuryWalletPublicKeyString
var SOLVENCY_WETH_WALLET_ATA = "HA5eCkqQvnbDyM6PCjEo5fug4aptenq69si8CRb6eekv"
var SOLVENCY_WBTC_WALLET_ATA = "J9PNT1aetsD16rjkthSL3v2KvyD6rSZQCYE52zrENXbg"

var TOKEN_RESERVE_DAI_ATA = ""
var TOKEN_RESERVE_USDC_ATA = ""
var TOKEN_RESERVE_SOL_ATA = ""
var TOKEN_RESERVE_WETH_ATA = ""
var TOKEN_RESERVE_WBTC_ATA = ""

if(DEV_MODE)
{
  USDC_TOKEN_MINT_ADDRESS = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"

  HODL_USDC_WALLET_ATA = "CNJ2Jb4dMWF8TsMEKsqdaJUkCMnY8AKz5gr9GDjN9cQB"

  SOLVENCY_USDC_WALLET_ATA = "EJJ7RgXg6hJgYawaDkybjBxQbXC1KDZWAj9wrpSw6Q3z"

  TOKEN_RESERVE_DAI_ATA = "6eYgDBktxp2iooetaX8RiFWnuiddbRyN8KoKB9nYMBq1"
  TOKEN_RESERVE_USDC_ATA = "3d2Ua8ZhfDfMqpgHjAKUW34Wj4v1NtsUkeBndzHyBfCZ"
  TOKEN_RESERVE_SOL_ATA = "Dz1Pvgbuo5k2Xup8F2Hz2SBA6tL7JzEuA2fqgtiKziq4"
  TOKEN_RESERVE_WETH_ATA = "81SknHELHcRA4EN8cogCCRtijoXVS2y4QihjesWgVokY"
  TOKEN_RESERVE_WBTC_ATA = "eMuwzeXGtAVxsqxEUF4QttxtJHVCQfdpADcHihwDyju"
}
else
{
  USDC_TOKEN_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"

  HODL_USDC_WALLET_ATA = "9JxyN8T2apS2GRE9d6sVYAZWC6CHjd6H9qsy748ydaNF"

  SOLVENCY_USDC_WALLET_ATA = "3ty3xdwiFjQTTfJsCPAjTETqLVZH8fxNJPKRLcNBD6EU"

  TOKEN_RESERVE_DAI_ATA = SYSTEM_PROGRAM_ADDRESS_STRING
  TOKEN_RESERVE_USDC_ATA = SYSTEM_PROGRAM_ADDRESS_STRING
  TOKEN_RESERVE_SOL_ATA = SYSTEM_PROGRAM_ADDRESS_STRING
  TOKEN_RESERVE_WETH_ATA = SYSTEM_PROGRAM_ADDRESS_STRING
  TOKEN_RESERVE_WBTC_ATA = SYSTEM_PROGRAM_ADDRESS_STRING
}

const PYTH_PRICE_UPDATE_KEY_DAI = new PublicKey("FmfrxJ7YH8yVxoYpJ9ZDMeb8gUceYXYaSrQiBJ1uSZjN")
const PYTH_PRICE_UPDATE_KEY_USDC = new PublicKey("Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX")
const PYTH_PRICE_UPDATE_KEY_SOL = new PublicKey("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE")
const PYTH_PRICE_UPDATE_KEY_WETH = new PublicKey("4TQ1VVWkrYUvyQ6hMmjepwr7swvqsyvLi75BiJi13Tf3")
const PYTH_PRICE_UPDATE_KEY_WBTC = new PublicKey("9gNX5vguzarZZPjTnE1hWze3s6UsZ7dsU3UnAmKPnMHG")

const PYTH_HEX_ID_DAI = "0xb0948a5e5313200c632b51bb5ca32f6de0d36e9950a942d19751e833f70dabfd"
const PYTH_HEX_ID_USDC= "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a"
const PYTH_HEX_ID_SOL = "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d"
const PYTH_HEX_ID_WETH = "0x9d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f6"
const PYTH_HEX_ID_WBTC = "0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33"


//Currently on @solana/spl-token version 1.8 as updating introduces npm vunlerabilities
//The official Token-2022 Program ID
export const TokenProgram2022ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
export const LegacyTokenProgramID = TOKEN_PROGRAM_ID

export const tokenAddressStrings = 
{
    daiTokenMintAddress: DAI_TOKEN_MINT_ADDRESS,
    usdcTokenMintAddress: USDC_TOKEN_MINT_ADDRESS,
    solTokenMintAddress: SOL_TOKEN_MINT_ADDRESS,
    wethTokenMintAddress: WETH_TOKEN_MINT_ADDRESS,
    wbtcTokenMintAddress: WBTC_TOKEN_MINT_ADDRESS
}
export const tokenAddressKeys = 
{
    daiTokenMintAddress: new PublicKey(DAI_TOKEN_MINT_ADDRESS),
    usdcTokenMintAddress: new PublicKey(USDC_TOKEN_MINT_ADDRESS),
    solTokenMintAddress: new PublicKey(SOL_TOKEN_MINT_ADDRESS),
    wethTokenMintAddress: new PublicKey(WETH_TOKEN_MINT_ADDRESS),
    wbtcTokenMintAddress: new PublicKey(WBTC_TOKEN_MINT_ADDRESS)
}

//These are for the Chat and M4A fees
export const hodlWalletATAStrings = 
{
    daiATA: HODL_DAI_WALLET_ATA,
    usdcATA: HODL_USDC_WALLET_ATA
}
export const hodlWalletATAKeys = 
{
    daiATA: new PublicKey(HODL_DAI_WALLET_ATA),
    usdcATA: new PublicKey(HODL_USDC_WALLET_ATA)
}

export const solvencyWalletATAStrings = 
{
    daiATA: SOLVENCY_DAI_WALLET_ATA,
    usdcATA: SOLVENCY_USDC_WALLET_ATA,
    solATA: SOLVENCY_SOL_WALLET_ATA,
    wethATA: SOLVENCY_WETH_WALLET_ATA,
    wbtcATA: SOLVENCY_WBTC_WALLET_ATA
}
export const solvencyWalletATAKeys = 
{
    daiATA: new PublicKey(SOLVENCY_DAI_WALLET_ATA),
    usdcATA: new PublicKey(SOLVENCY_USDC_WALLET_ATA),
    solATA: new PublicKey(SOLVENCY_SOL_WALLET_ATA),
    wethATA: new PublicKey(SOLVENCY_WETH_WALLET_ATA),
    wbtcATA: new PublicKey(SOLVENCY_WBTC_WALLET_ATA)
}
 
export const tokenReserveATAStrings = 
{
    daiATA: TOKEN_RESERVE_DAI_ATA,
    usdcATA: TOKEN_RESERVE_USDC_ATA,
    solATA: TOKEN_RESERVE_SOL_ATA,
    wethATA: TOKEN_RESERVE_WETH_ATA,
    wbtcATA: TOKEN_RESERVE_WBTC_ATA
}
export const tokenReserveATAKeys = 
{
    daiATA: new PublicKey(TOKEN_RESERVE_DAI_ATA),
    usdcATA: new PublicKey(TOKEN_RESERVE_USDC_ATA),
    solATA: new PublicKey(TOKEN_RESERVE_SOL_ATA),
    wethATA: new PublicKey(TOKEN_RESERVE_WETH_ATA),
    wbtcATA: new PublicKey(TOKEN_RESERVE_WBTC_ATA)
}

export const tokenDecimalHashMap: Map<string, number> = new Map(
[
    //Key: Token Mint Address, Value: Token Decimal Amount
    [tokenAddressStrings.daiTokenMintAddress, 8],
    [tokenAddressStrings.usdcTokenMintAddress,6],
    [tokenAddressStrings.solTokenMintAddress, 9],
    [tokenAddressStrings.wethTokenMintAddress,8],
    [tokenAddressStrings.wbtcTokenMintAddress,8]
])

export const pythPriceUpdateKeys =
{
    daiPythId: PYTH_PRICE_UPDATE_KEY_DAI,
    usdcPythId: PYTH_PRICE_UPDATE_KEY_USDC,
    solPythId: PYTH_PRICE_UPDATE_KEY_SOL,
    wethPythId: PYTH_PRICE_UPDATE_KEY_WETH,
    wbtcPythId: PYTH_PRICE_UPDATE_KEY_WBTC
}

export const pythIds =
{
    daiPythId: PYTH_HEX_ID_DAI,
    usdcPythId: PYTH_HEX_ID_USDC,
    solPythId: PYTH_HEX_ID_SOL,
    wethPythId: PYTH_HEX_ID_WETH,
    wbtcPythId: PYTH_HEX_ID_WBTC
}