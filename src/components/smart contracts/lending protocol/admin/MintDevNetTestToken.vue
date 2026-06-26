<template>
  <div class="thickBorder smallMarginTop widthOverFlow">
    <div class="minWidth">
      <h2 class="smallMarginTop">Mint DevNet Test Token</h2>
      <div class="spaceRowEvenly mediumMarginBottom" style="width: 100%">
        <div class="smallMarginTop flexCenterColumn">
          
          <ion-input
          v-model="newTokenDecimalAmount"
          fill="outline"
          type="number"
          step="1"
          min="1"
          max="9"
          placeholder="Enter Token Decimal">
        </ion-input>
          <ion-button :color="colorName" @click="createTestToken()">Create Test Token</ion-button>

          <div v-if="newTokenMintAddress != ''" class="largeMarginTop flexCenterColumn">
            <ion-text>New Token Address:</ion-text>
            <ion-text>{{ newTokenMintAddress }}</ion-text>
            <ion-button :color="colorName" @click="passByRefWrapperCopyAddress()">
              <ion-label color="light">{{ copyTokenMintAddressButtonText }}</ion-label>
            </ion-button>
          </div>
        </div>
        <div class="smallMarginTop flexCenterColumn">
          <div class="spaceRowEvenly  mediumMarginBottom" style="width: 100%">
              <ion-input
                v-model="destinationWalletAddress"
                fill="outline"
                type="text"
                placeholder="Destination Address">
            </ion-input>
            <ion-input
              v-model="tokenMintAddressToMintTo"
              fill="outline"
              type="text"
              placeholder="Mint Address">
            </ion-input>
            
            <ion-input
              v-model="tokenToMintDecimalAmount"
              fill="outline"
              type="number"
              step="1"
              min="1"
              max="9"
              placeholder="Enter Token Decimal">
            </ion-input>
            <ion-input
              v-model="tokenToMintAmount"
              fill="outline"
              type="number"
              min="0"
              placeholder="Amount To Mint">
            </ion-input>
          </div>
          <ion-button :color="colorName" @click="mintTokenToWallet()">Mint Tokens To Wallet</ion-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject } from 'vue'
  import { IonButton, IonText, IonInput } from '@ionic/vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { LegacyTokenProgramID } from '/src/assets/constants/Addresses.ts'
  import { copyAddress, copyTokenMintAddressText, confirmLendingTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { Token, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'
  import { PublicKey, Transaction, Keypair, SystemProgram } from '@solana/web3.js'

  const toast = inject('toast')
  const colorName = inject('colorName') as string
  var newTokenDecimalAmount = ref(8)
  var newTokenMintAddress = ref("")
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)

  var destinationWalletAddress = ref("")
  var tokenMintAddressToMintTo = ref("")
  var tokenToMintDecimalAmount = ref()
  var tokenToMintAmount = ref()


  //1. Create a brand new Mint account using the static instruction builders
  async function createTestToken()
  {
    //You still need a fresh keypair *only* to generate the identity/address of the new mint
    const mintKeypair = Keypair.generate()

    try
    {
      const provider = anchorPrograms.lending.lendingProgram.provider
      const connection = provider.connection
      const payer = connectedWallet.publicKey

      const MINT_SIZE_BYTES = 82; 

      // 1. Get the minimum balance required for 82 bytes
      const rentExemptBalance = await connection.getMinimumBalanceForRentExemption(MINT_SIZE_BYTES);
  
      const transaction = new Transaction().add(
          SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: mintKeypair.publicKey,
            lamports: rentExemptBalance, // Now using the correct calculated amount
            space: MINT_SIZE_BYTES,      // Allocation matches rent calculation
            programId: LegacyTokenProgramID, 
          }),
        //Initialize the mint state using your library's static instruction helper
        Token.createInitMintInstruction(
          LegacyTokenProgramID,
          mintKeypair.publicKey,
          newTokenDecimalAmount.value as number,          //Decimals
          payer,      //Mint Authority (your connected wallet)
          payer       //Freeze Authority (optional, using your wallet)
        )
      )

      //Send transaction. Anchor signs for the 'payer' via browser wallet popup.
      //We pass the mintKeypair explicitly since a new account must sign its own creation.
      const tx = await provider.sendAndConfirm(transaction, [mintKeypair])
      
      console.log("Successfully created new mint:", mintKeypair.publicKey.toBase58())

      newTokenMintAddress.value = mintKeypair.publicKey.toBase58()
      tokenMintAddressToMintTo.value = mintKeypair.publicKey.toBase58()
      tokenToMintDecimalAmount.value = newTokenDecimalAmount.value

      await confirmLendingTransaction(tx, toast, "create_dev_net_token_mint")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "create_dev_net_token_mint")
    }
  }

  //2. Mint tokens to a wallet's Associated Token Account (ATA)
  async function mintTokenToWallet()
  {
    try
    {
      const tokenMintAddress = new PublicKey(tokenMintAddressToMintTo.value)
      const destinationWalletPubKey = new PublicKey(destinationWalletAddress.value)

      const provider = anchorPrograms.lending.lendingProgram.provider
      const connection = provider.connection
      const payer = connectedWallet.publicKey

      //Derive the ATA address using your library's async helper
      const walletATA = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        LegacyTokenProgramID,
        tokenMintAddress,
        destinationWalletPubKey
      )

      const transaction = new Transaction()

      //Optional: Add ATA creation instruction if it doesn't exist yet
      const accountInfo = await connection.getAccountInfo(walletATA)
      if(!accountInfo)
      {
        transaction.add(
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            LegacyTokenProgramID,
            tokenMintAddress,
            walletATA,
            destinationWalletPubKey,
            payer
          )
        )
      }

      //Convert fixed-point integer math safely into the u64 type exported by your library
      const fixedPointAmount = tokenToMintAmount.value as number * Math.pow(10, tokenToMintDecimalAmount.value as number)

      //Add the mintTo instruction using the static constructor
      transaction.add(
        Token.createMintToInstruction(
          LegacyTokenProgramID,
          tokenMintAddress,
          walletATA,
          payer, //Mint Authority (the connected browser wallet)
          [],    //multiSigners (empty array since it's a single key wallet, not a multisig)
          //tokenToMintAmount.value as number // You don't need to do fixed point math for the TokenProgram2022ID
          fixedPointAmount //Needed for LegacyTokenProgramID
        )
      )

      //Send it off!
      const tx = await provider.sendAndConfirm(transaction)

      await confirmLendingTransaction(tx, toast, "create_dev_net_token_mint")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "mint_dev_net_test_token_to_wallet")
    }
  }

  function passByRefWrapperCopyAddress()
  {
    copyAddress(copyTokenMintAddressButtonText, newTokenMintAddress.value)
  }
</script>

<style scoped>
  ion-input
  {
    --highlight-color: var(--ion-color-gray);
    min-width: 222px
  }

  .rowContainer
  {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
  }

  .minWidth
  {
    min-width: 1200px
  }
</style>