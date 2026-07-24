<template>
  <div class="thickBorder">
    <h2>Earn interest on deposits while helping to push the USA to universal health care like every other fucking first world country not named the United States of America</h2>
    <p>A 3% SubMarket and 1% Solvency fee on interest earned is collected for the <span color="green">M4A</span> Treasury</p>
    <p>IE: If you have $100 of USDC deposited for a year, and the supply APY remains at exactly 10% for the whole year (Not likely at all)</p>
    <p>After a year, you would have your $100(deposit) + $10(interest earned) - $0.30(fee) - $0.10(fee) = $109.60</p>

    <div class="mobileTopControlsContainer">
      <div v-if="accountList?.length > 0">
        <div class="flexCenterRow">
          <div>
            <InfoButton :infoMessage="userLendingInfoMSG"/>
          </div>

          <div style="display: flex; flex-direction: column">
            <div align="left">
              <ion-label>Account Name:</ion-label>
            </div>
            <Select
            v-if="!editingAccountName"
            id="accountSelect"
            class="standardFontSize"
            style="margin-bottom: 17px"
            v-model="accountSelect" 
            :options="accountList" 
            optionLabel="accountName" 
            optionValue="userAccountIndex" 
            placeholder="Select Account"
            appendTo="self"
            @change="updateStoredSelectedUserAccountIndex()">
            </Select>
            
            <ion-input
            v-else
            v-model="accountName"
            ref="accountNameEditInputRef"
            id="accountNameEditInput"
            :class="{ 'invalid': overByteSizeLimit }"
            fill="outline"
            :counter="true"
            :counter-formatter="customFormatter"
            :maxlength=MAX_ACCOUNT_NAME_LENGTH>
              <EmojiButton
              :marginTop="'4px'"
              :colorHexValue="colorHexValue"
              :openSide="'right'"
              @emojiSelected="(emoji: String) => insertEmoji(emoji)"/>
            </ion-input>

            
          </div>

          <ion-button v-if="editingAccountName" fill="clear" @click="editingAccountName=false">
            <ion-icon :src="close" color="dark"></ion-icon>
          </ion-button>
          <ion-button v-else fill="clear" @click="setInputFocus(); editingAccountName=true">
            <ion-icon :src="pencil" color="dark"></ion-icon>
          </ion-button>
        </div>

        <ion-button v-if="editingAccountName"
          color="dark"
          class="nSmallMarginLeft mediumMarginBottom"
          style="width: 110px"
          @click="editLendingUserAccountName()"
        >
          Update Name
        </ion-button>
      </div>
    
      <div style="display: flex; flex-direction: column; align-items: center; margin-left:-16px">
        <ion-label style="margin-left:-74px">Market:</ion-label>
        <Select
        id="tokenSelect"
        class="standardFontSize "
        style="margin-bottom: 17px; "
        v-model="tokenSelect" 
        :options="mobileMarketData" 
        optionLabel="asset.name" 
        optionValue="tokenId" 
        placeholder="Select Token">
          <!-- 1. Customize the selected value display -->
          <template #value="slotProps">
            <!-- If an item is selected, find it via our computed property -->
            <div v-if="selectedTokenData" style="display: flex; align-items: center; gap: 8px;">
              <component :is="selectedTokenData.asset.svg" style="width: 24px; height: 24px;" />
              <span>{{ selectedTokenData.asset.name }}</span>
            </div>
            <!-- Otherwise show the placeholder -->
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>

          <!-- 2. Customize the dropdown options list -->
          <template #option="slotProps">
            <div style="display: flex; align-items: center; gap: 8px;">
              <component :is="slotProps.option.asset.svg" style="width: 24px; height: 24px;" />
              <span>{{ slotProps.option.asset.name }}</span>
            </div>
          </template>
        </Select>
      </div>
    </div>
    
    <div class="flexCenterColumn">
      <div class="thinBorder tinyMarginTop mediumMarginBottom" style="width: 95%; border-radius: 1px">

        <div class="tokenChainContainer">
          <h4 class="flexCenterRow ">
            Token:
            <ion-button fill="clear" @click="openTokenPopover($event, mobileMarketData[tokenSelect-1])">
              <component :is="mobileMarketData[tokenSelect-1]?.asset.svg" class="bigMobileTokenSVG"/> 
              <ion-text color="dark" class="tokenNameText">{{ mobileMarketData[tokenSelect-1]?.asset.name }}</ion-text>
            </ion-button>
          </h4>
          <h4 class="flexCenterRow svgVerticalMargin">
            Chain:
            <component :is="mobileMarketData[tokenSelect-1]?.chain.svg" class="bigMobileTokenSVG"/> 
            {{ mobileMarketData[tokenSelect-1]?.chain.name }}
          </h4>
        </div>

        <div class="nMediumMarginTop tokenAddress">
          <ion-label class="nSmallMarginTop">Token Address: {{ mobileMarketData[tokenSelect-1]?.tokenMintAddressString }}</ion-label>
        </div>

        <div class="nMediumMarginTop trimmedTokenAddress">
          <ion-label class="nSmallMarginTop">Token Address: {{ trimmedTokenAddress }}</ion-label>
        </div>

        <div class="horizontalLine"></div>

        <div class="market-stats-box">
          <div>
            <ion-text>Price: ${{ mobileMarketData[tokenSelect-1].price.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 }) }}
            </ion-text>
          </div>
          
          <div>
            24h %Price Change:
            <ion-text :color="mobileMarketData[tokenSelect-1]?.percentChange24h<0 ? 'red' : 'green'">
              {{ mobileMarketData[tokenSelect-1]?.percentChange24h }}%
            </ion-text>
          </div>

          <div>
            <ion-text>Supply APY%: {{ mobileMarketData[tokenSelect-1]?.supplyAPYString }}</ion-text>
          </div>

          <div>
            <ion-text>Borrow APY%: {{ mobileMarketData[tokenSelect-1]?.borrowAPYString }}</ion-text>
          </div>

          <div>
            <ion-text>Base Borrow APY%: {{ mobileMarketData[tokenSelect-1]?.baseBorrowAPYString }}</ion-text>
          </div>

          <div>
            Fixed Borrow APY:
            <ion-text :color="mobileMarketData[tokenSelect-1]?.useFixedBorrowApy ? 'green' : 'red'">{{mobileMarketData[tokenSelect-1]?.useFixedBorrowAPYString }}</ion-text>
          </div>

          <div>
            <ion-text>Global Deposit Limit: {{ mobileMarketData[tokenSelect-1]?.globalLimitString }}</ion-text>
          </div>

          <div>
            <ion-text>Deposits: {{ mobileMarketData[tokenSelect-1]?.depositsString }}</ion-text>
          </div>

          <div>
            <ion-text>Borrows: {{ mobileMarketData[tokenSelect-1]?.borrowsString }}</ion-text>
          </div>

          <div>
            <ion-text>Utilization Rate%: {{ mobileMarketData[tokenSelect-1]?.utilizationRateString }}</ion-text>
          </div>
        </div>

        <div class="horizontalLine"></div>

        <div class="flexCenterRow">
          <ion-text v-if="!mobileMarketData[tokenSelect-1]?.subMarketList?.length" class="noWrapText">No fdr-3 Submarkets</ion-text>
          <ion-text v-else-if="!anchorPrograms.isLendingProtocolReady" class="noWrapText">Loading</ion-text>
          <div v-else>
            <ion-button
            v-if="!hasDeposits"
            class="lendingActionButton"
            color="dark"
            style="width: 110px"
            @click="$emit('openDepositModal', mobileMarketData[tokenSelect-1].tokenId, mobileMarketData[tokenSelect-1].tokenMintAddressString, mobileMarketData[tokenSelect-1].subMarketList)">
              Deposit
            </ion-button>
            
            <ion-button
            v-else
            class="actionsPopoverButton"
            color="dark"
            style="width: 110px"
            @click="openActionsPopover($event, mobileMarketData[tokenSelect-1])">
              Actions
            </ion-button>
          </div>
        </div>
      </div>
    </div>

    <ion-popover
    :is-open="tokenPopoverOpen" 
    :event="event" 
    @didDismiss="tokenPopoverOpen=false"
    side="top" 
    alignment="center"
    >
      <ion-button class="copyTokenAddressButton" color="green" @click="passByRefWrapperCopyTokenMintAddress()" @mouseleave="closeTokenPopover($event)">
        <ion-label color="light">{{ copyTokenMintAddressButtonText }}</ion-label>
      </ion-button>
    </ion-popover>
    
    <ion-popover
    :is-open="actionsPopoverOpen" 
    :event="event" 
    @didDismiss="actionsPopoverOpen=false"
    side="top" 
    alignment="center"
    >
      <div class=" flexCenterColumn lendingActionPopoverContainer">
        <ion-button class="lendingActionButton" fill="clear" @click="$emit('openDepositModal', event.tokenId, event.tokenMintAddressString, event.subMarketList); actionsPopoverOpen=false">
          <ion-label class="noClickEvent" color="dark">Deposit</ion-label>
        </ion-button>
        <ion-button v-if="event.depositBalance" class="lendingActionButton" fill="clear" @click="$emit('openWithdrawalModal', event.tokenId, event.tokenMintAddressString, event.userSpecificSubMarketList); actionsPopoverOpen=false">
          <ion-label class="noClickEvent" color="dark">Withdraw</ion-label>
        </ion-button>
        <ion-button v-if="(connectedWallet.addressString!=adminAccounts.hodlTreasuryAddress.toString() &&
        connectedWallet.addressString!=adminAccounts.singlePayerTreasuryAddress.toString())"
        class="lendingActionButton"
        fill="clear"
        @click="$emit('openBorrowModal', event.tokenId, event.tokenMintAddressString, event.userSpecificSubMarketList); actionsPopoverOpen=false">
          <ion-label class="noClickEvent" color="dark">Borrow</ion-label>
        </ion-button>
        <ion-button v-if="event.borrowBalance" class="lendingActionButton" fill="clear" @click="$emit('openRepayModal', event.tokenId, event.tokenMintAddressString, event.userSpecificSubMarketList); actionsPopoverOpen=false">
          <ion-label class="noClickEvent" color="dark">Repay</ion-label>
        </ion-button>
      </div>
    </ion-popover>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, watch, inject, computed } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonPopover, IonText } from '@ionic/vue'
  import { pencil, close } from 'ionicons/icons'
  import Select from 'primevue/select'
  import EmojiButton from '/src/components/comments/emojis/EmojiButton.vue'
  import { FilterMatchMode } from '@primevue/core/api'
  import { anchorPrograms, MAX_ACCOUNT_NAME_LENGTH, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { copyAddress,
    trimAddress,
    copyTokenMintAddressText,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { getUserPriorInteractedWithSubMarkets } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import InfoButton from '/src/components/help/InfoButton.vue'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue')

  var tokenPopoverOpen = ref(false)
  var actionsPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)

  var accountSelect = ref(0)
  var tokenSelect = ref(1)
  var editingAccountName = ref(false)
  var accountName = ref()
  var accountNameEditInputRef = ref()
  var savedEmojiCursorPosition: any
  var overByteSizeLimit = ref()

  const props = defineProps(['userLendingInfoMSG', 'accountList', 'mobileMarketData', 'hasDeposits'])
  const emits = defineEmits(['checkForLendingUserAssets', 'openDepositModal', 'openWithdrawalModal', 'openBorrowModal', 'openRepayModal'])

  const selectedTokenData = computed(() =>
  {
    if(!props.mobileMarketData)
      return null
    
    return props.mobileMarketData.find((item: any) => item.tokenId === tokenSelect.value)
  })

  const trimmedTokenAddress = computed(() =>
  {
    return trimAddress(props.mobileMarketData[tokenSelect.value-1].tokenMintAddressString)
  })

  const walletWatch = computed(() =>
  {
    return JSON.stringify(
    {
      addressString: connectedWallet.addressString,
      selectedLendingUserAccountIndex: connectedWallet.selectedLendingUserAccountIndex
    })
  })

  watch(walletWatch, async (newJSONObjectString, oldJSONObjectString) =>
  {
    let newWallet = JSON.parse(newJSONObjectString)
    let oldWallet = JSON.parse(oldJSONObjectString)

    //This is here because of the "watch(lendingUserMonthlyStatementsHashMap, () =>" line. Don't want to the chart being updated twice unnecessarily
    if(newWallet.addressString == oldWallet.addressString && newWallet.selectedLendingUserAccountIndex == oldWallet.selectedLendingUserAccountIndex)
      return

    if(newWallet.addressString != SYSTEM_PROGRAM_ADDRESS_STRING)
      accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
  })

  function openActionsPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.tokenId = rowData.tokenId
    event.value.tokenMintAddressString = rowData.tokenMintAddressString
    event.value.subMarketList = rowData.subMarketList
    event.value.userSpecificSubMarketList = getUserPriorInteractedWithSubMarkets(rowData.subMarketList, accountSelect.value)
    event.value.depositBalance = rowData.depositBalance
    event.value.borrowBalance = rowData.borrowBalance

    actionsPopoverOpen.value = true
  }

  function openTokenPopover(e: Event, marketData: any) 
  {
    event.value = e
    event.value.tokenMintAddressString = marketData.tokenMintAddressString

    tokenPopoverOpen.value = true
  }

  function closeTokenPopover(e: Event) 
  {
    event.value = e
    tokenPopoverOpen.value = false
  }

  function updateStoredSelectedUserAccountIndex()
  {
    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
    localStorage.setItem("selectedLendingAccountIndex" + connectedWallet.addressString, accountSelect.value.toString())
    emits('checkForLendingUserAssets', 'checkForMainSubMarkets')
  }

  const customFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([accountName.value])
    const sizeInBytes = blob.size

    inputLength = sizeInBytes

    if(inputLength > maxLength)
    {
      overByteSizeLimit.value = true
    }
    else
      overByteSizeLimit.value = false

    return `${inputLength}/${maxLength} `
  }

  function insertEmoji(emoji: String)
  {
    const inputElement = accountNameEditInputRef.value?.$el.querySelector(".native-input")
    if(inputElement) 
    {
      const start = inputElement.selectionStart
      const end = inputElement.selectionEnd
      const newValue =
      accountName.value.substring(0, start) + 
      emoji + 
      accountName.value.substring(end)

      accountName.value = newValue

      savedEmojiCursorPosition = inputElement.selectionStart + emoji.length
    }
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  function setInputFocus()
  {
    accountName.value = props.accountList[accountSelect.value].accountName

    setTimeout(() =>
    {
      const inputElement = accountNameEditInputRef.value?.$el.querySelector(".native-input")
      if(inputElement)
        inputElement.focus()
    }, 10) 
  }

  function passByRefWrapperCopyTokenMintAddress()
  {
    copyAddress(copyTokenMintAddressButtonText, event.value.tokenMintAddressString)
  }

  async function editLendingUserAccountName()
  {
    try
    {
      const tx = await anchorPrograms.lending.lendingProgram.methods.editLendingUserAccountName
      (
        accountSelect.value,
        accountName.value
      ).accounts({ signer: connectedWallet.publicKey }).rpc()

      await confirmLendingTransaction(tx, toast, "edit_lending_user_account_name")
      editingAccountName.value = false
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "edit_lending_user_account_name")
    }
  }
</script>

<style scoped>
  ion-input
  {
    --highlight-color: var(--ion-color-green)
  }

  ion-icon
  {
    width: 25px;
    height: 25px
  }

  ion-button
  {
    --padding-top: 0;
    --padding-bottom: 0;
    --padding-start: 0;
    --padding-end: 0
  }

  ion-popover 
  {
    --width: min(94vw, 144px)
  }

  .tokenNameText
  {
    font-size: min(4vw, 25px);
    font-weight: bold
  }

  .bigMobileTokenSVG
  {
    width: min(11vw, 54px);
    height: min(11vw, 54px);
    margin-right: 5px
  }

  .market-stats-box
  {
    display: grid;
    /* Smoothly scales columns between 140px minimum and equal fractions */
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    box-sizing: border-box
  }

  .market-stats-box > div
  {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px;
    background: light-dark(#7e7e7e, #25222288);
    border: thin solid var(--ion-color-dark);
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.4;
    word-break: break-word
  }

  @media screen and (min-width: 720.1px) 
  { 
    .tokenChainContainer
    {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 111px
    }
  }
  @media screen and (max-width: 720px) 
  { 
    .tokenChainContainer
    {
      display: flex;
      flex-direction: column
    }

    .svgVerticalMargin
    {
      margin-top: -22px
    }
  }

  @media screen and (min-width: 595.1px) 
  { 
    .mobileTopControlsContainer
    {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center !important;
      gap: 50px
    }
  }
  @media screen and (max-width: 595px) 
  { 
    .mobileTopControlsContainer
    {
      display: flex;
      flex-direction: column !important;
      justify-content: center !important;
      align-items: center;
      text-align: center
    }
  }

  @media screen and (min-width: 500.1px) 
  { 
    .tokenAddress
    {
      display: block
    }
    .trimmedTokenAddress
    {
      display: none
    }
  }
  @media screen and (max-width: 500px) 
  { 
    .tokenAddress
    {
      display: none
    }
    .trimmedTokenAddress
    {
      display: block
    }
  }
</style>