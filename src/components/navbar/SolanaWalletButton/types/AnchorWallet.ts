import type { SignerWalletAdapterProps } from "@solana/wallet-adapter-base"
import type { PublicKey } from "@solana/web3.js"
import { Ref } from "vue"
export interface Wallet 
{
    publicKey: PublicKey
    signTransaction: SignerWalletAdapterProps["signTransaction"]
    signAllTransactions: SignerWalletAdapterProps["signAllTransactions"]
}
export declare function useAnchorWallet(): Ref<Wallet | undefined>