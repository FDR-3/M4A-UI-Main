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
var HODL_USDS_WALLET_ATA = ""
var HODL_USDC_WALLET_ATA = ""

var SOLVENCY_USDS_WALLET_ATA = ""
var SOLVENCY_USDC_WALLET_ATA = ""
const SOLVENCY_SOL_WALLET_ATA = solvencyTreasuryWalletPublicKeyString
var SOLVENCY_WETH_WALLET_ATA = ""
var SOLVENCY_WBTC_WALLET_ATA = ""

var TOKEN_RESERVE_USDS_ATA = ""
var TOKEN_RESERVE_USDC_ATA = ""
var TOKEN_RESERVE_SOL_ATA = ""
var TOKEN_RESERVE_WETH_ATA = ""
var TOKEN_RESERVE_WBTC_ATA = ""

var JITO_TIP_ADDRESSES = []

if(DEV_MODE)
{
  //Devnet
  /*USDS_TOKEN_MINT_ADDRESS = "5V413iK9J5wcLVrgj4TN93zTuNczGcsMbDVWewWWHpvA"
  USDC_TOKEN_MINT_ADDRESS = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
  WETH_TOKEN_MINT_ADDRESS = "49omHmMjcWSy6b2yFb1RTaAN5zraDLpvx2LNCWX2opkZ"
  WBTC_TOKEN_MINT_ADDRESS = "EcNB579EvvgaGkqhZ6RHhryuivgJWUvqvYzr1c5KT9cV"*/

  //Testnet
  USDS_TOKEN_MINT_ADDRESS = "GpyhfheYRVQZvTfvVCsauVmdqdmmU5bevzK4tvUNpemW"
  USDC_TOKEN_MINT_ADDRESS = "697R9ZMVXEh6VrARqoT2B8FfKxmpKZepZ3J9stmY9sBL"
  WETH_TOKEN_MINT_ADDRESS = "6GZJFr35zi7B7U8H1iZaSqkpbvL2ppTogKmyVnAdd6kT"
  WBTC_TOKEN_MINT_ADDRESS = "EWgJfcAMsn9ksvDiLVPugZgxNnGrCqzHzTTCdF7B5H5G"

  //Localnet
  /*USDS_TOKEN_MINT_ADDRESS = "95kFTe5Dmb5HTDf97qCxTjfAKkvhSwZXc75ARYRrga1a"
  USDC_TOKEN_MINT_ADDRESS = "4tFUiFGJQfQTYtCZPhweufNRbMKft1WRsvPcRkihmvKB"
  WETH_TOKEN_MINT_ADDRESS = "GjmYbuoreDSvhppgtxzpB1ibQ1nsFQHzoB1bHVsZZX3k"
  WBTC_TOKEN_MINT_ADDRESS = "4ND6Kfstcu4FZtLvC3pUWEU9gavrt4moa2y83GsYHkkF"*/

  //Testnet
  HODL_USDS_WALLET_ATA = "AEmEt4t7SiJxhfvkPxCoXVrJw6vx4taoLduYdckMJ9p"
  HODL_USDC_WALLET_ATA = "2T8eTxipenv2JF4ebVBPyBvhyuqdzBg83hDzCkxNq4LN"

  //Testnet
  SOLVENCY_USDS_WALLET_ATA = "D7n5hTB22DBQbBmEveBL9WCgJ6vsvyskqWT1GZD2sUCG"
  SOLVENCY_USDC_WALLET_ATA = "EqhJxWgQ1UoficsB5b96yr3XFMqmy3aEFyjcthB4jpk5"
  SOLVENCY_WETH_WALLET_ATA = "DkKwvsK9DczJkBJzRZmYTkH9fycZz8ePGdSNbSbrFhBQ"
  SOLVENCY_WBTC_WALLET_ATA = "BA5mJDPnbQhgZi1F7ZZbm3PxipLKQEoeiDTB1tfjeSL4"

  //Testnet
  TOKEN_RESERVE_USDS_ATA = "HGe16iPaWq3pZoaHF1e2z2vJw9LwR77im11nDoTk3uLs"
  TOKEN_RESERVE_USDC_ATA = "9Mrj2qrusBoasAfqzKBcycno24nvXu67N9TK2zpFEsLA"
  TOKEN_RESERVE_SOL_ATA = "8GDXDhjHk5W8aCUe9UNckG3gX9YayFUVtesuSVPohKk5"
  TOKEN_RESERVE_WETH_ATA = "3Wpc2eKWkbGQF8GNDqQyitcq3cG4FCnkRVdQFHsVBeJM"
  TOKEN_RESERVE_WBTC_ATA = "7myje6BMwzonfQxVA1sJybcQ2HDbK9uCkP6d4KcdUbRe"

  JITO_TIP_ADDRESSES =
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
}
else
{
  USDS_TOKEN_MINT_ADDRESS = "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA"
  USDC_TOKEN_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  WETH_TOKEN_MINT_ADDRESS = "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs"
  WBTC_TOKEN_MINT_ADDRESS = "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh"

  HODL_USDS_WALLET_ATA = "AEmEt4t7SiJxhfvkPxCoXVrJw6vx4taoLduYdckMJ9p"
  HODL_USDC_WALLET_ATA = "9JxyN8T2apS2GRE9d6sVYAZWC6CHjd6H9qsy748ydaNF"

  SOLVENCY_USDS_WALLET_ATA = "9ZEPoZeXdETx3WGy1naq5BTGxrd3foEjaygw3wRGgU4W"
  SOLVENCY_USDC_WALLET_ATA = "3ty3xdwiFjQTTfJsCPAjTETqLVZH8fxNJPKRLcNBD6EU"
  SOLVENCY_WETH_WALLET_ATA = "HA5eCkqQvnbDyM6PCjEo5fug4aptenq69si8CRb6eekv"
  SOLVENCY_WBTC_WALLET_ATA = "J9PNT1aetsD16rjkthSL3v2KvyD6rSZQCYE52zrENXbg"

  TOKEN_RESERVE_USDS_ATA = SYSTEM_PROGRAM_ADDRESS_STRING
  TOKEN_RESERVE_USDC_ATA = SYSTEM_PROGRAM_ADDRESS_STRING
  TOKEN_RESERVE_SOL_ATA = SYSTEM_PROGRAM_ADDRESS_STRING
  TOKEN_RESERVE_WETH_ATA = SYSTEM_PROGRAM_ADDRESS_STRING
  TOKEN_RESERVE_WBTC_ATA = SYSTEM_PROGRAM_ADDRESS_STRING

  JITO_TIP_ADDRESSES =
  [
    "ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt",
    "HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe",
    "DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL",
    "3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT",
    "ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49",
    "96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5",
    "Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY",
    "DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh"
  ]
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
  usdsTokenId: 1,
  usdcTokenId: 2,
  solTokenId: 3,
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

export function getMainnetTokenAddresses(nonMainnetTokenAddresses: string[])
{
  var mainnetTokenAddress = []

  for(var i=0; i<nonMainnetTokenAddresses.length; i++)
  {
    //Check for Dev USDS Address
    if(nonMainnetTokenAddresses[i] == "5V413iK9J5wcLVrgj4TN93zTuNczGcsMbDVWewWWHpvA")
      mainnetTokenAddress.push(jupiterPriceUpdateMainnetTokenAddressStrings.usdsTokenMintAddress)
    //Check for Dev USDC Address
    else if(nonMainnetTokenAddresses[i] == "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU")
      mainnetTokenAddress.push(jupiterPriceUpdateMainnetTokenAddressStrings.usdcTokenMintAddress)
    //Check for Dev WEth Address
    else if(nonMainnetTokenAddresses[i] == "49omHmMjcWSy6b2yFb1RTaAN5zraDLpvx2LNCWX2opkZ")
      mainnetTokenAddress.push(jupiterPriceUpdateMainnetTokenAddressStrings.wethTokenMintAddress)
    //Check for Dev WBtc Address
    else if(nonMainnetTokenAddresses[i] == "EcNB579EvvgaGkqhZ6RHhryuivgJWUvqvYzr1c5KT9cV")
      mainnetTokenAddress.push(jupiterPriceUpdateMainnetTokenAddressStrings.wbtcTokenMintAddress)
    //SOL Address is same on Dev and Mainnet
    else
      mainnetTokenAddress.push(nonMainnetTokenAddresses[i])
  }

  return mainnetTokenAddress
}

export const JITO_TIP_ACCOUNTS = JITO_TIP_ADDRESSES