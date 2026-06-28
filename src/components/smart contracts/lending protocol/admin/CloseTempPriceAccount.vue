<template>
  <div class="thickBorder smallMarginTop widthOverFlow">
    <div class="minWidth">
      <h2 class="smallMarginTop">Close Temp Price Account</h2>
      <div class="spaceRowEvenly mediumMarginBottom" style="width: 100%">
        <div class="smallMarginTop flexCenterColumn">
          
          <ion-input
            v-model="userAddress"
            fill="outline"
            placeholder="Enter User Address">
          </ion-input>
          <ion-button :color="colorName" @click="closePriceAccount()">Close Price Account</ion-button>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject } from 'vue'
  import { IonButton, IonInput } from '@ionic/vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { LegacyTokenProgramID } from '/src/assets/constants/Addresses.ts'
  import { copyAddress, copyTokenMintAddressText, confirmLendingTransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { Token, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'
  import { PublicKey, Transaction, Keypair, SystemProgram } from '@solana/web3.js'

  const toast = inject('toast')
  const colorName = inject('colorName') as string

  var userAddress = ref("")

  async function closePriceAccount()
  {
    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.closeTempOraclePriceData()
      .accounts({ lendingUserAddress: new PublicKey(userAddress.value) })
      .remainingAccounts([adminAccounts.priceOracleRemainingAccount])
      .rpc()
    
      await confirmLendingTransaction(tx, toast, "close_temp_oracle_price_data")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "close_temp_oracle_price_data")
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