import { navigation, MenuIndex } from '/src/assets/globalStates/Navigation.vue'
import { getM4ACommentPDA, getPLICommentPDA, getAboutCommentPDA } from '/src/assets/contracts/Solana/ChatProtocol.vue'
import { getM4AReplyPDA, getPLIReplyPDA, getAboutReplyPDA } from '/src/assets/contracts/Solana/ChatProtocol.vue'
import { getM4ALv3ReplyPDA, getPLILv3ReplyPDA, getAboutLv3ReplyPDA } from '/src/assets/contracts/Solana/ChatProtocol.vue'
import { getM4ALv4ReplyPDA, getPLILv4ReplyPDA, getAboutLv4ReplyPDA } from '/src/assets/contracts/Solana/ChatProtocol.vue'
import { PublicKey } from "@solana/web3.js"
import { DEV_MODE } from '/src/assets/globalStates/EnvironmentSettings.ts'

export function isProduction()
{
  if(window.location.hostname === "m4a.io")
    return true
  else
    return false
}

export function isBrowserFireFox()
{
  // Check if we are in a browser environment (important for SSR/Node.js)
  if (typeof window === 'undefined' || !window.navigator)
      return false
  
  // Convert to lowercase and check for the "firefox" string
  return window.navigator.userAgent.toLowerCase().includes('firefox')
}

var explorerString = ""

//if(DEV_MODE)
  explorerString = "devnet"
//else
  //explorerString = "mainnet"

export function openCommentInSolanaExplorer(
commentSectionNamePrefix: string,
commentSectionName: string,
chatAccountPostCountIndex: number,
postOwnerAddress: PublicKey)
{
  if(navigation.menuIndex == MenuIndex.M4A)
  {
    const postPDA = getM4ACommentPDA(commentSectionNamePrefix, commentSectionName, chatAccountPostCountIndex, postOwnerAddress).toBase58()
    window.open(`https://explorer.solana.com/address/${postPDA}?cluster=${explorerString}`, "_blank")
  }
  else if(navigation.menuIndex == MenuIndex.PLI)
  {
    const postPDA = getPLICommentPDA(commentSectionNamePrefix, commentSectionName, chatAccountPostCountIndex, postOwnerAddress).toBase58()
    window.open(`https://explorer.solana.com/address/${postPDA}?cluster=${explorerString}`, "_blank")
  }
  else if(navigation.menuIndex == MenuIndex.About)
  {
    const postPDA = getAboutCommentPDA(commentSectionNamePrefix, commentSectionName, chatAccountPostCountIndex, postOwnerAddress).toBase58()
    window.open(`https://explorer.solana.com/address/${postPDA}?cluster=${explorerString}`, "_blank")
  }
}

export function openReplyInSolanaExplorer(
commentSectionNamePrefix: string,
commentSectionName: string,
chatAccountPostCountIndex: number,
postOwnerAddress: PublicKey)
{
  if(navigation.menuIndex == MenuIndex.M4A)
  {
    const postPDA = getM4AReplyPDA(commentSectionNamePrefix, commentSectionName, chatAccountPostCountIndex, postOwnerAddress).toBase58()
    window.open(`https://explorer.solana.com/address/${postPDA}?cluster=${explorerString}`, "_blank")
  }
  else if(navigation.menuIndex == MenuIndex.PLI)
  {
    const postPDA = getPLIReplyPDA(commentSectionNamePrefix, commentSectionName, chatAccountPostCountIndex, postOwnerAddress).toBase58()
    window.open(`https://explorer.solana.com/address/${postPDA}?cluster=${explorerString}`, "_blank")
  }
  else if(navigation.menuIndex == MenuIndex.About)
  {
    const postPDA = getAboutReplyPDA(commentSectionNamePrefix, commentSectionName, chatAccountPostCountIndex, postOwnerAddress).toBase58()
    window.open(`https://explorer.solana.com/address/${postPDA}?cluster=${explorerString}`, "_blank")
  }
}

export function openReplyLv3InSolanaExplorer(
commentSectionNamePrefix: string,
commentSectionName: string,
chatAccountPostCountIndex: number,
postOwnerAddress: PublicKey)
{
  if(navigation.menuIndex == MenuIndex.M4A)
  {
    const postPDA = getM4ALv3ReplyPDA(commentSectionNamePrefix, commentSectionName, chatAccountPostCountIndex, postOwnerAddress).toBase58()
    window.open(`https://explorer.solana.com/address/${postPDA}?cluster=${explorerString}`, "_blank")
  }
  else if(navigation.menuIndex == MenuIndex.PLI)
  {
    const postPDA = getPLILv3ReplyPDA(commentSectionNamePrefix, commentSectionName, chatAccountPostCountIndex, postOwnerAddress).toBase58()
    window.open(`https://explorer.solana.com/address/${postPDA}?cluster=${explorerString}`, "_blank")
  }
  else if(navigation.menuIndex == MenuIndex.About)
  {
    const postPDA = getAboutLv3ReplyPDA(commentSectionNamePrefix, commentSectionName, chatAccountPostCountIndex, postOwnerAddress).toBase58()
    window.open(`https://explorer.solana.com/address/${postPDA}?cluster=${explorerString}`, "_blank")
  }
}

export function openReplyLv4InSolanaExplorer(
commentSectionNamePrefix: string,
commentSectionName: string,
chatAccountPostCountIndex: number,
postOwnerAddress: PublicKey)
{
  if(navigation.menuIndex == MenuIndex.M4A)
  {
    const postPDA = getM4ALv4ReplyPDA(commentSectionNamePrefix, commentSectionName, chatAccountPostCountIndex, postOwnerAddress).toBase58()
    window.open(`https://explorer.solana.com/address/${postPDA}?cluster=${explorerString}`, "_blank")
  }
  else if(navigation.menuIndex == MenuIndex.PLI)
  {
    const postPDA = getPLILv4ReplyPDA(commentSectionNamePrefix, commentSectionName, chatAccountPostCountIndex, postOwnerAddress).toBase58()
    window.open(`https://explorer.solana.com/address/${postPDA}?cluster=${explorerString}`, "_blank")
  }
  else if(navigation.menuIndex == MenuIndex.About)
  {
    const postPDA = getAboutLv4ReplyPDA(commentSectionNamePrefix, commentSectionName, chatAccountPostCountIndex, postOwnerAddress).toBase58()
    window.open(`https://explorer.solana.com/address/${postPDA}?cluster=${explorerString}`, "_blank")
  }
}