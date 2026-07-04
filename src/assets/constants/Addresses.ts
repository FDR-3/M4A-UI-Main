import { PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
import { DEV_MODE } from '/src/assets/globalStates/EnvironmentSettings.ts'

export const solvencyTreasuryWalletPublicKeyString = "2TnxW9qAgPjHmHUXde6zgxNa8F4nY3kfDpdRJsT8HdPU"

const USDS_MAINNET_TOKEN_MINT_ADDRESS = "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA"
const USDC_MAINNET_TOKEN_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
const WETH_MAINNET_TOKEN_MINT_ADDRESS = "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs"
const WBTC_MAINNET_TOKEN_MINT_ADDRESS = "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh"

var USDS_TOKEN_MINT_ADDRESS = ""
var USDC_TOKEN_MINT_ADDRESS = ""
const SOL_TOKEN_MINT_ADDRESS = "So11111111111111111111111111111111111111112"
var WETH_TOKEN_MINT_ADDRESS = ""
var WBTC_TOKEN_MINT_ADDRESS = ""

//These are for the Chat and M4A fees
var HODL_USDS_WALLET_ATA = "EE33UzMMHRQDfaB9QAYCYptLB34tBt2tFrg6StPVHM2b"
var HODL_USDC_WALLET_ATA = ""

var SOLVENCY_USDS_WALLET_ATA = "9ZEPoZeXdETx3WGy1naq5BTGxrd3foEjaygw3wRGgU4W"
var SOLVENCY_USDC_WALLET_ATA = ""
var SOLVENCY_SOL_WALLET_ATA = solvencyTreasuryWalletPublicKeyString
var SOLVENCY_WETH_WALLET_ATA = "HA5eCkqQvnbDyM6PCjEo5fug4aptenq69si8CRb6eekv"
var SOLVENCY_WBTC_WALLET_ATA = "J9PNT1aetsD16rjkthSL3v2KvyD6rSZQCYE52zrENXbg"

var TOKEN_RESERVE_USDS_ATA = ""
var TOKEN_RESERVE_USDC_ATA = ""
var TOKEN_RESERVE_SOL_ATA = ""
var TOKEN_RESERVE_WETH_ATA = ""
var TOKEN_RESERVE_WBTC_ATA = ""

if(DEV_MODE)
{
  //Devnet
  /*USDS_TOKEN_MINT_ADDRESS = "5V413iK9J5wcLVrgj4TN93zTuNczGcsMbDVWewWWHpvA"
  USDC_TOKEN_MINT_ADDRESS = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
  WETH_TOKEN_MINT_ADDRESS = "49omHmMjcWSy6b2yFb1RTaAN5zraDLpvx2LNCWX2opkZ"
  WBTC_TOKEN_MINT_ADDRESS = "EcNB579EvvgaGkqhZ6RHhryuivgJWUvqvYzr1c5KT9cV"*/

  //Testnet
  /*USDS_TOKEN_MINT_ADDRESS = "GpyhfheYRVQZvTfvVCsauVmdqdmmU5bevzK4tvUNpemW"
  USDC_TOKEN_MINT_ADDRESS = "697R9ZMVXEh6VrARqoT2B8FfKxmpKZepZ3J9stmY9sBL"
  WETH_TOKEN_MINT_ADDRESS = "6GZJFr35zi7B7U8H1iZaSqkpbvL2ppTogKmyVnAdd6kT"
  WBTC_TOKEN_MINT_ADDRESS = "EWgJfcAMsn9ksvDiLVPugZgxNnGrCqzHzTTCdF7B5H5G"*/

  //Localnet
  USDS_TOKEN_MINT_ADDRESS = "7wMjkEyme2EuGkSdFumVukjuVwjSxMVccpB3RXk377KB"
  USDC_TOKEN_MINT_ADDRESS = "29MMbiNUjnhFAGDzHVmkpcndscf8yBCJJ89hAJTRgst7"
  WETH_TOKEN_MINT_ADDRESS = "95wsQVkHNwGC13FeQTR2Yr4tfQJRWmfc2gUjjsitFnKL"
  WBTC_TOKEN_MINT_ADDRESS = "3FcWf2NzxmrMk2ekg3gaHZ882Kt8tMBbLhMC9tTUeire"

  HODL_USDC_WALLET_ATA = "CNJ2Jb4dMWF8TsMEKsqdaJUkCMnY8AKz5gr9GDjN9cQB"

  SOLVENCY_USDC_WALLET_ATA = "EJJ7RgXg6hJgYawaDkybjBxQbXC1KDZWAj9wrpSw6Q3z"

  TOKEN_RESERVE_USDS_ATA = "6eYgDBktxp2iooetaX8RiFWnuiddbRyN8KoKB9nYMBq1"
  TOKEN_RESERVE_USDC_ATA = "3d2Ua8ZhfDfMqpgHjAKUW34Wj4v1NtsUkeBndzHyBfCZ"
  TOKEN_RESERVE_SOL_ATA = "Dz1Pvgbuo5k2Xup8F2Hz2SBA6tL7JzEuA2fqgtiKziq4"
  TOKEN_RESERVE_WETH_ATA = "81SknHELHcRA4EN8cogCCRtijoXVS2y4QihjesWgVokY"
  TOKEN_RESERVE_WBTC_ATA = "eMuwzeXGtAVxsqxEUF4QttxtJHVCQfdpADcHihwDyju"
}
else
{
  USDS_TOKEN_MINT_ADDRESS = "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA"
  USDC_TOKEN_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  WETH_TOKEN_MINT_ADDRESS = "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs"
  WBTC_TOKEN_MINT_ADDRESS = "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh"

  HODL_USDC_WALLET_ATA = "9JxyN8T2apS2GRE9d6sVYAZWC6CHjd6H9qsy748ydaNF"

  SOLVENCY_USDC_WALLET_ATA = "3ty3xdwiFjQTTfJsCPAjTETqLVZH8fxNJPKRLcNBD6EU"

  TOKEN_RESERVE_USDS_ATA = SYSTEM_PROGRAM_ADDRESS_STRING
  TOKEN_RESERVE_USDC_ATA = SYSTEM_PROGRAM_ADDRESS_STRING
  TOKEN_RESERVE_SOL_ATA = SYSTEM_PROGRAM_ADDRESS_STRING
  TOKEN_RESERVE_WETH_ATA = SYSTEM_PROGRAM_ADDRESS_STRING
  TOKEN_RESERVE_WBTC_ATA = SYSTEM_PROGRAM_ADDRESS_STRING
}

//Currently on @solana/spl-token version 1.8 as updating introduces npm vunlerabilities
//The official Token-2022 Program ID
export const TokenProgram2022ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
export const LegacyTokenProgramID = TOKEN_PROGRAM_ID //TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA

export const jupiterPriceUpdateMainnetTokenAddressStrings = 
{
  usdsTokenMintAddress: USDS_MAINNET_TOKEN_MINT_ADDRESS,
  usdcTokenMintAddress: USDC_MAINNET_TOKEN_MINT_ADDRESS,
  solTokenMintAddress: SOL_TOKEN_MINT_ADDRESS,
  wethTokenMintAddress: WETH_MAINNET_TOKEN_MINT_ADDRESS,
  wbtcTokenMintAddress: WBTC_MAINNET_TOKEN_MINT_ADDRESS
}

export const tokenAddressStrings = 
{
  usdsTokenMintAddress: USDS_TOKEN_MINT_ADDRESS,
  usdcTokenMintAddress: USDC_TOKEN_MINT_ADDRESS,
  solTokenMintAddress: SOL_TOKEN_MINT_ADDRESS,
  wethTokenMintAddress: WETH_TOKEN_MINT_ADDRESS,
  wbtcTokenMintAddress: WBTC_TOKEN_MINT_ADDRESS
}

export const tokenAddressKeys = 
{
  usdsTokenMintAddress: new PublicKey(USDS_TOKEN_MINT_ADDRESS),
  usdcTokenMintAddress: new PublicKey(USDC_TOKEN_MINT_ADDRESS),
  solTokenMintAddress: new PublicKey(SOL_TOKEN_MINT_ADDRESS),
  wethTokenMintAddress: new PublicKey(WETH_TOKEN_MINT_ADDRESS),
  wbtcTokenMintAddress: new PublicKey(WBTC_TOKEN_MINT_ADDRESS)
}

//These are for the Chat and M4A fees
export const hodlWalletATAStrings = 
{
  usdsATA: HODL_USDS_WALLET_ATA,
  usdcATA: HODL_USDC_WALLET_ATA
}
export const hodlWalletATAKeys = 
{
  usdsATA: new PublicKey(HODL_USDS_WALLET_ATA),
  usdcATA: new PublicKey(HODL_USDC_WALLET_ATA)
}

export const solvencyWalletATAStrings = 
{
  usdsATA: SOLVENCY_USDS_WALLET_ATA,
  usdcATA: SOLVENCY_USDC_WALLET_ATA,
  solATA: SOLVENCY_SOL_WALLET_ATA,
  wethATA: SOLVENCY_WETH_WALLET_ATA,
  wbtcATA: SOLVENCY_WBTC_WALLET_ATA
}
export const solvencyWalletATAKeys = 
{
  usdsATA: new PublicKey(SOLVENCY_USDS_WALLET_ATA),
  usdcATA: new PublicKey(SOLVENCY_USDC_WALLET_ATA),
  solATA: new PublicKey(SOLVENCY_SOL_WALLET_ATA),
  wethATA: new PublicKey(SOLVENCY_WETH_WALLET_ATA),
  wbtcATA: new PublicKey(SOLVENCY_WBTC_WALLET_ATA)
}
 
export const tokenReserveATAStrings = 
{
  usdsATA: TOKEN_RESERVE_USDS_ATA,
  usdcATA: TOKEN_RESERVE_USDC_ATA,
  solATA: TOKEN_RESERVE_SOL_ATA,
  wethATA: TOKEN_RESERVE_WETH_ATA,
  wbtcATA: TOKEN_RESERVE_WBTC_ATA
}
export const tokenReserveATAKeys = 
{
  usdsATA: new PublicKey(TOKEN_RESERVE_USDS_ATA),
  usdcATA: new PublicKey(TOKEN_RESERVE_USDC_ATA),
  solATA: new PublicKey(TOKEN_RESERVE_SOL_ATA),
  wethATA: new PublicKey(TOKEN_RESERVE_WETH_ATA),
  wbtcATA: new PublicKey(TOKEN_RESERVE_WBTC_ATA)
}

export const tokenIds = 
{
  solTokenId: 1,
  usdcTokenId: 2,
  usdsTokenId: 3,
  wethTokenId: 4,
  wbtcTokenId: 5
}

export const tokenDecimalHashMap: Map<number, number> = new Map(
[
  //Key: Token Mint Address, Value: Token Decimal Amount
  [tokenIds.usdsTokenId, 6],
  [tokenIds.usdcTokenId,6],
  [tokenIds.solTokenId, 9],
  [tokenIds.wethTokenId,8],
  [tokenIds.wbtcTokenId,8]
])

export function getMainnetTokenAddresses(devnetTokenAddresses: string[])
{
  var mainnetTokenAddress = []

  for(var i=0; i<devnetTokenAddresses.length; i++)
  {
    //Check for Dev USDS Address
    if(devnetTokenAddresses[i] == "5V413iK9J5wcLVrgj4TN93zTuNczGcsMbDVWewWWHpvA")
      mainnetTokenAddress.push(jupiterPriceUpdateMainnetTokenAddressStrings.usdsTokenMintAddress)
    //Check for Dev USDC Address
    else if(devnetTokenAddresses[i] == "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU")
      mainnetTokenAddress.push(jupiterPriceUpdateMainnetTokenAddressStrings.usdcTokenMintAddress)
    //Check for Dev WEth Address
    else if(devnetTokenAddresses[i] == "49omHmMjcWSy6b2yFb1RTaAN5zraDLpvx2LNCWX2opkZ")
      mainnetTokenAddress.push(jupiterPriceUpdateMainnetTokenAddressStrings.wethTokenMintAddress)
    //Check for Dev WBtc Address
    else if(devnetTokenAddresses[i] == "EcNB579EvvgaGkqhZ6RHhryuivgJWUvqvYzr1c5KT9cV")
      mainnetTokenAddress.push(jupiterPriceUpdateMainnetTokenAddressStrings.wbtcTokenMintAddress)
    //SOL Address is same on Dev and Mainnet
    else
      mainnetTokenAddress.push(devnetTokenAddresses[i])
  }

  return mainnetTokenAddress
}

//Mainnet
/*export const JITO_TIP_ACCOUNTS =
[
  "96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5",
  "HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe",
  "Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY",
  "ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49",
  "DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh",
  "ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt",
  "DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL",
  "3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT"
]*/

//Testnet
export const JITO_TIP_ACCOUNTS =
[
  "F7ThiQUBYiEcyaxpmMuUeACdoiSLKg4SZZ8JSfpFNwAf",
  "AzfhMPcx3qjbvCK3UUy868qmc5L451W341cpFqdL3EBe",
  "4uRnem4BfVpZBv7kShVxUYtcipscgZMSHi3B9CSL6gAA",
  "CwWZzvRgmxj9WLLhdoWUVrHZ1J8db3w2iptKuAitHqoC",
  "84DrGKhycCUGfLzw8hXsUYX9SnWdh2wW3ozsTPrC5xyg",
  "BkMx5bRzQeP6tUZgzEs3xeDWJfQiLYvNDqSgmGZKYJDq",
  "7aewvu8fMf1DK4fKoMXKfs3h3wpAQ7r7D8T1C71LmMF",
  "G2d63CEgKBdgtpYT2BuheYQ9HFuFCenuHLNyKVpqAuSD"
]