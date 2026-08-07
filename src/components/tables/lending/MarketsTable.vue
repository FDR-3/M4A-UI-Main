<template>
  <div class="tableContainer">
    <!--Stable Coins-->
    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines 
      size="small"
      :value="StableCoins"
      :loading="!anchorPrograms.isLendingProtocolReady"
      :globalFilterFields="
      [
        'tokenId',
        'tokenMintAddressString',
        'asset.name',
        'chain.name',
        'priceString',
        'percentChange24h',
        'supplyAPYString',
        'borrowAPYString',
        'baseBorrowAPYString',
        'useFixedBorrowAPYString',
        'utilizationRateString',
        'depositsString',
        'borrowsString',
        'globalLimitString'
      ]"
    >
      <template #header>
        <div>
          <h2>Earn interest on deposits while helping to push the USA to universal health care like every other fucking first world country not named the United States of America</h2>
          <div class="horizontalLine"></div>
          <p>A 3% SubMarket and 1% Solvency fee on interest earned is collected for the <span color="green">M4A</span> Treasury</p>
          <p>IE: If you have $100 of USDC deposited for a year, and the supply APY remains at exactly 10% for the whole year (Not likely at all)</p>
          <p>After a year, you would have your $100(deposit) + $10(interest earned) - $0.30(fee) - $0.10(fee) = $109.60</p>
          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="Market Search     ">
            <ion-icon class="tableSearchIcon" slot="start" :icon="search"></ion-icon>
          </ion-input>

          <div v-if="accountList?.length > 0" class="nMediumSmallMarginBottom">
            <div class="flexCenterRow">
              <div style="margin-top: 7px">
                <InfoButton :infoMessage="userLendingInfoMSG"/>
              </div>

              <div style="display: flex; flex-direction: column">
                <div class="smallMarginTop">
                  <ion-label>Account Name</ion-label>
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
                style="margin-bottom: 22px"
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

              <ion-button v-if="editingAccountName" class="nMediumSmallMarginLeft" fill="clear" @click="editingAccountName=false">
                <ion-icon :src="close" color="dark"></ion-icon>
              </ion-button>
              <ion-button v-else class="nSmallMarginLeft smallMarginTop" fill="clear" @click="setInputFocus(); editingAccountName=true">
                <ion-icon :src="pencil" color="dark"></ion-icon>
              </ion-button>
            </div>
            
            <ion-button v-if="editingAccountName" color="dark" class="mediumMarginBottom" @click="editLendingUserAccountName()">Update Name</ion-button>
          </div>

          <br><ion-label id="tableTitle">Stable Coins</ion-label>
        </div>
      </template>
      <template #loading> Loading Stable Coins. Please Wait. </template>
      <Column field="asset.name" header="Asset" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="openTokenPopover($event, slotProps.data)">
              <component :is="slotProps.data.asset.svg" style="width: 24px; margin-left: -11px; margin-right: 5px"></component>
              <ion-label color="dark">{{ slotProps.data.asset.name }}</ion-label>
            </ion-button>
          </div>
        </template>
      </Column>
      <Column field="chain.name" header="Chain" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="slotProps.data.chain.source()">
              <component :is="slotProps.data.chain.svg" style="margin-left: -15px; margin-right: -11px"></component>
            </ion-button>
            <span class="nTinyMarginLeft">{{ slotProps.data.chain.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="price" header="Price" style="width: 0%" sortable>
        <template #body="slotProps">
           {{ slotProps.data.priceString }}
        </template>
      </Column>
      <Column field="percentChange24h" header="24h %Price Change" style="width: 0%" sortable>
        <template #body="slotProps">
           <ion-text :color="slotProps.data.percentChange24h<0 ? 'red' : 'green'">{{ slotProps.data.percentChange24h }}%</ion-text>
        </template>
      </Column>
      <Column field="supplyAPY" header="Supply APY%" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.supplyAPYString }}
        </template>
      </Column>
      <Column field="borrowAPY" header="Borrow APY%" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.borrowAPYString }}
        </template>
      </Column>
      <Column field="baseBorrowAPY" header="Base Borrow APY%" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.baseBorrowAPYString }}
        </template>
      </Column>
      <Column field="useFixedBorrowApy" header="Fixed Borrow APY" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-text :color="slotProps.data.useFixedBorrowApy ? 'green' : 'red'">{{slotProps.data.useFixedBorrowAPYString }}</ion-text>
        </template>
      </Column>
      <Column field="globalLimit" header="Global Deposit Limit" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.globalLimitString }}
        </template>
      </Column>
      <Column field="deposits" header="Deposits" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.depositsString }}
        </template>
      </Column>
      <Column field="borrows" header="Borrows" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.borrowsString }}
        </template>
      </Column>
      <Column field="utilizationRate" header="Utilization Rate%" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.utilizationRateString }}
        </template>
      </Column>
      <Column header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterRow">
            <ion-text v-if="!slotProps.data?.subMarketList?.length" class="noWrapText">No fdr-3 Submarkets</ion-text>
            <ion-text v-else-if="!anchorPrograms.isLendingProtocolReady" class="noWrapText">Loading</ion-text>
            <div v-else>
              <ion-button
              v-if="!hasDeposits"
              class="lendingActionButton"
              color="dark"
              @click="$emit('openDepositModal', slotProps.data.tokenId, slotProps.data.tokenMintAddressString, slotProps.data.subMarketList)">
                Deposit
              </ion-button>
              
              <ion-button
              v-else
              class="actionsPopoverButton"
              color="dark"
              @click="openActionsPopover($event, slotProps.data)">
                Actions
              </ion-button>
            </div>
          </div>
        </template>
      </Column>
    </DataTable>

    <!--Crypto Currency-->
    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines size="small" 
      :value="CryptoCurrency"
      :loading="!anchorPrograms.isLendingProtocolReady"
      :globalFilterFields="
      [
        'tokenId',
        'tokenMintAddressString',
        'asset.name',
        'chain.name',
        'priceString',
        'percentChange24h',
        'supplyAPYString',
        'borrowAPYString',
        'baseBorrowAPYString',
        'useFixedBorrowAPYString',
        'utilizationRateString',
        'depositsString',
        'borrowsString',
        'globalLimitString'
      ]"
    >
      <template #header>
        <div>
          <br><ion-label id="tableTitle">Crypto Currency</ion-label>
        </div>
      </template>
      <template #loading> Loading Cryto Currencies. Please wait. </template>
      <Column field="asset.name" header="Asset" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="openTokenPopover($event, slotProps.data)" style="margin-left: -8px">
                <component :is="slotProps.data.asset.svg" style="width: 28px; height: 32px; margin-right: 5px"/>
              <ion-label color="dark">{{ slotProps.data.asset.name }}</ion-label>
            </ion-button>
          </div>
        </template>
      </Column>
      <Column field="chain.name" header="Chain" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="slotProps.data.chain.source()">
              <component :is="slotProps.data.chain.svg" style="margin-left: -15px; margin-right: -11px"></component>
            </ion-button>
            <span class="nTinyMarginLeft">{{ slotProps.data.chain.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="price" header="Price" style="width: 0%" sortable>
        <template #body="slotProps">
           {{ slotProps.data.priceString }}
        </template>
      </Column>
      <Column field="percentChange24h" header="24h %Price Change" style="width: 0%" sortable>
        <template #body="slotProps">
           <ion-text :color="slotProps.data.percentChange24h<0 ? 'red' : 'green'">{{ slotProps.data.percentChange24h }}%</ion-text>
        </template>
      </Column>
      <Column field="supplyAPY" header="Supply APY%" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.supplyAPYString }}
        </template>
      </Column>
      <Column field="borrowAPY" header="Borrow APY%" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.borrowAPYString }}
        </template>
      </Column>
      <Column field="baseBorrowAPY" header="Base Borrow APY%" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.baseBorrowAPYString }}
        </template>
      </Column>
      <Column field="useFixedBorrowApy" header="Fixed Borrow APY" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-text :color="slotProps.data.useFixedBorrowApy ? 'green' : 'red'">{{slotProps.data.useFixedBorrowAPYString }}</ion-text>
        </template>
      </Column>
      <Column field="globalLimit" header="Global Deposit Limit" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.globalLimitString }}
        </template>
      </Column>
      <Column field="deposits" header="Deposits" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.depositsString }}
        </template>
      </Column>
      <Column field="borrows" header="Borrows" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.borrowsString }}
        </template>
      </Column>
      <Column field="utilizationRate" header="Utilization Rate%" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.utilizationRateString }}
        </template>
      </Column>
      <Column header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterRow">
            <ion-text v-if="!slotProps.data?.subMarketList?.length" class="noWrapText">No fdr-3 Submarkets</ion-text>
            <ion-text v-else-if="!anchorPrograms.isLendingProtocolReady" class="noWrapText">Loading</ion-text>
            <div v-else>
              <ion-button
              v-if="!hasDeposits"
              class="lendingActionButton"
              color="dark"
              @click="$emit('openDepositModal', slotProps.data.tokenId, slotProps.data.tokenMintAddressString, slotProps.data.subMarketList)">
                Deposit
              </ion-button>
              
              <ion-button
              v-else
              class="actionsPopoverButton"
              color="dark"
              @click="openActionsPopover($event, slotProps.data)">
                Actions
              </ion-button>
              
            </div>
          </div>
        </template>
      </Column>
    </DataTable>

    <ion-popover 
    :is-open="tokenPopoverOpen" 
    :event="event" 
    @didDismiss="tokenPopoverOpen=false"
    side="top" 
    alignment="center"
    >
      <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyTokenMintAddress()" @mouseleave="closeTokenPopover($event)">
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
      <div class="flexCenterColumn lendingActionPopoverContainer">
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

  <div class="mobileContainer">
    <MobileMarkets
    :mobileMarketData="mobileMarketData"
    :userLendingInfoMSG="userLendingInfoMSG"
    :accountList="accountList"
    :hasDeposits="hasDeposits"
    @openDepositModal="(tokenId, tokenMintAddressString, subMarketList) => $emit('openDepositModal', tokenId, tokenMintAddressString, subMarketList)"
    @openWithdrawalModal="(tokenId, tokenMintAddressString, userSpecificSubMarketList) => $emit('openWithdrawalModal', tokenId, tokenMintAddressString, userSpecificSubMarketList)"
    @openBorrowModal="(tokenId, tokenMintAddressString, userSpecificSubMarketList) => $emit('openBorrowModal', tokenId, tokenMintAddressString, userSpecificSubMarketList)"
    @openRepayModal="(tokenId, tokenMintAddressString, userSpecificSubMarketList) => $emit('openRepayModal', tokenId, tokenMintAddressString, userSpecificSubMarketList)"/>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, inject, computed } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonPopover, IonText } from '@ionic/vue'
  import { pencil, close } from 'ionicons/icons'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Select from 'primevue/select'
  import EmojiButton from '/src/components/comments/emojis/EmojiButton.vue'
  import { FilterMatchMode } from '@primevue/core/api'
  import { anchorPrograms, MAX_ACCOUNT_NAME_LENGTH, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { search } from 'ionicons/icons'
  import { copyAddress,
    copyTokenMintAddressText,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { StableCoins, CryptoCurrency } from '/src/components/tables/lending/Assets.vue'
  import { tokenReservesHashMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketByTokenIdAndOwnerHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserAccountsHashMap, lendingUserTabAccountsHashMap, lendingUserTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { getUserPriorInteractedWithSubMarkets } from '/src/assets/contracts/Solana/LendingProtocol.vue'
  import { tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import InfoButton from '/src/components/help/InfoButton.vue'
  import MobileMarkets from './MobileMarkets.vue'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue')

  const emits = defineEmits(['openDepositModal', 'openWithdrawalModal', 'openBorrowModal', 'openRepayModal'])

  var tokenPopoverOpen = ref(false)
  var actionsPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)

  var accountSelect = ref(0)
  var accountList = ref()
  var editingAccountName = ref(false)
  var accountName = ref()
  var accountNameEditInputRef = ref()
  var savedEmojiCursorPosition: any
  var overByteSizeLimit = ref()
  var hasDeposits = ref(false)

  const userLendingInfoMSG = "Create new accounts while making a deposit."

  var mobileMarketData = computed(() =>
  {
    return [...StableCoins, ...CryptoCurrency]
  })

  onMounted(() =>
  {
    checkForMainSubMarkets()
    setLendingUserAccountList()
    checkForLendingUserAssets()
    updateTokenReserveRelatedMarketData()
    
    accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
  })

  watch(subMarketByTokenIdAndOwnerHashMap,() =>
  {
    checkForMainSubMarkets()
  })

  watch(lendingUserAccountsHashMap,() =>
  {
    setLendingUserAccountList()
  })

  watch(lendingUserTabAccountListHashMap,() =>
  {
    checkForLendingUserAssets()
  })

  watch(tokenReservesHashMap, () =>
  {
    updateTokenReserveRelatedMarketData()
  })

  //Watch only the properties that matter to avoid BigInt serialization issues
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
    {
      setLendingUserAccountList()
      accountSelect.value = connectedWallet.selectedLendingUserAccountIndex
      checkForLendingUserAssets()
    }
    else
    {
      setLendingUserAccountList()
      hasDeposits.value = false
    }

    checkForMainSubMarkets()
  })

  function setLendingUserAccountList()
  {
    if(lendingUserAccountsHashMap.map)
    {
      const userAccountList = lendingUserAccountsHashMap.map.get(connectedWallet.addressString)
      if(userAccountList)
        accountList.value = userAccountList

      //Prevents starting on the wrong index when starting new contract deployments due to saved local storage values.
      if(!userAccountList)
      {
        accountSelect.value = 0
        connectedWallet.selectedLendingUserAccountIndex = 0
        localStorage.setItem("selectedLendingAccountIndex" + connectedWallet.addressString, '0')
      }
    }

    if(accountList.value?.length)
    {
      const exists = accountList.value.some((account: { userAccountIndex: number }) => account.userAccountIndex === accountSelect.value)

      if(!exists)
      {
        accountSelect.value = accountList.value[0].userAccountIndex
        connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
        localStorage.setItem("selectedLendingAccountIndex" + connectedWallet.addressString, accountSelect.value.toString())
      }
    }
  }

  function updateTokenReserveRelatedMarketData()
  {
    for(var i=0; i<StableCoins.length; i++)
    {
      if(tokenReservesHashMap.map)
      {
        const tokenReserve = tokenReservesHashMap.map.get(StableCoins[i].tokenId)
        if(tokenReserve)
        {
          StableCoins[i].supplyAPY = tokenReserve.supplyApy / 100 //Convert to decimal from fixed point notation
          StableCoins[i].supplyAPYString = StableCoins[i].supplyAPY.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 }) + '%'
          StableCoins[i].borrowAPY = tokenReserve.borrowApy / 100 //Convert to decimal from fixed point notation
          StableCoins[i].borrowAPYString = StableCoins[i].borrowAPY.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 }) + '%'
          StableCoins[i].baseBorrowAPY = tokenReserve.baseBorrowApy / 100 //Convert to decimal from fixed point notation
          StableCoins[i].baseBorrowAPYString = StableCoins[i].baseBorrowAPY.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 }) + '%'
          StableCoins[i].useFixedBorrowApy = tokenReserve.useFixedBorrowApy
          StableCoins[i].useFixedBorrowAPYString = tokenReserve.useFixedBorrowApy.toString()
          StableCoins[i].utilizationRate = tokenReserve.utilizationRate / 100 //Convert to decimal from fixed point notation 
          StableCoins[i].utilizationRateString = StableCoins[i].utilizationRate.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 }) + '%'
          StableCoins[i].deposits = tokenReserve.depositedAmount //Math.pow(10, StableCoins[i].decimalAmount) //Convert to decimal from fixed point notation
          StableCoins[i].depositsString = Number(StableCoins[i].deposits).toLocaleString('en-US', {
          minimumFractionDigits: StableCoins[i].decimalAmount,
          maximumFractionDigits: StableCoins[i].decimalAmount })
          StableCoins[i].borrows = tokenReserve.borrowedAmount //Math.pow(10, StableCoins[i].decimalAmount) //Convert to decimal from fixed point notation
          StableCoins[i].borrowsString = Number(StableCoins[i].borrows).toLocaleString('en-US', {
          minimumFractionDigits: StableCoins[i].decimalAmount,
          maximumFractionDigits: StableCoins[i].decimalAmount })
          StableCoins[i].globalLimit = Number(tokenReserve.globalLimit) / Math.pow(10, StableCoins[i].decimalAmount) //Convert to decimal from fixed point notation
          StableCoins[i].globalLimitString = StableCoins[i].globalLimit.toLocaleString()
        }
        else
        {
          StableCoins[i].supplyAPYString = "N/A"
          StableCoins[i].borrowAPYString = "N/A"
          StableCoins[i].baseBorrowAPYString = "N/A"
          StableCoins[i].utilizationRateString = "N/A"
          StableCoins[i].depositsString = "N/A"
          StableCoins[i].borrowsString = "N/A"
          StableCoins[i].globalLimitString = "N/A"
        }
      }
      else
      {
        StableCoins[i].supplyAPYString = "N/A"
        StableCoins[i].borrowAPYString = "N/A"
        StableCoins[i].baseBorrowAPYString = "N/A"
        StableCoins[i].utilizationRateString = "N/A"
        StableCoins[i].depositsString = "N/A"
        StableCoins[i].borrowsString = "N/A"
        StableCoins[i].globalLimitString = "N/A"
      }
    }

    for(var i=0; i<CryptoCurrency.length; i++)
    {
      if(tokenReservesHashMap.map)
      {
        const tokenReserve = tokenReservesHashMap.map.get(CryptoCurrency[i].tokenId)
        if(tokenReserve)
        {
          CryptoCurrency[i].supplyAPY  = tokenReserve.supplyApy / 100 //Convert to decimal from fixed point notation
          CryptoCurrency[i].supplyAPYString = CryptoCurrency[i].supplyAPY.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 }) + '%'
          CryptoCurrency[i].borrowAPY = tokenReserve.borrowApy / 100 //Convert to decimal from fixed point notation
          CryptoCurrency[i].borrowAPYString = CryptoCurrency[i].borrowAPY.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 }) + '%'
          CryptoCurrency[i].baseBorrowAPY = tokenReserve.baseBorrowApy / 100 //Convert to decimal from fixed point notation
          CryptoCurrency[i].baseBorrowAPYString = CryptoCurrency[i].baseBorrowAPY.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 }) + '%'
          CryptoCurrency[i].useFixedBorrowApy = tokenReserve.useFixedBorrowApy
          CryptoCurrency[i].useFixedBorrowAPYString = tokenReserve.useFixedBorrowApy.toString()
          CryptoCurrency[i].utilizationRate = tokenReserve.utilizationRate / 100
          CryptoCurrency[i].utilizationRateString = CryptoCurrency[i].utilizationRate.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 }) + '%'
          CryptoCurrency[i].deposits = tokenReserve.depositedAmount //Math.pow(10, CryptoCurrency[i].decimalAmount) //Convert to decimal from fixed point notation
          CryptoCurrency[i].depositsString = Number(CryptoCurrency[i].deposits).toLocaleString('en-US', {
          minimumFractionDigits: CryptoCurrency[i].decimalAmount,
          maximumFractionDigits: CryptoCurrency[i].decimalAmount })
          CryptoCurrency[i].borrows = tokenReserve.borrowedAmount //Math.pow(10, CryptoCurrency[i].decimalAmount) //Convert to decimal from fixed point notation
          CryptoCurrency[i].borrowsString = Number(CryptoCurrency[i].borrows).toLocaleString('en-US', {
          minimumFractionDigits: CryptoCurrency[i].decimalAmount,
          maximumFractionDigits: CryptoCurrency[i].decimalAmount })
          CryptoCurrency[i].globalLimit = Number(tokenReserve.globalLimit) / Math.pow(10, CryptoCurrency[i].decimalAmount) //Convert to decimal from fixed point notation
          CryptoCurrency[i].globalLimitString = CryptoCurrency[i].globalLimit.toLocaleString()
        }
        else
        {
          CryptoCurrency[i].supplyAPYString = "N/A"
          CryptoCurrency[i].borrowAPYString = "N/A"
          CryptoCurrency[i].baseBorrowAPYString = "N/A"
          CryptoCurrency[i].utilizationRateString = "N/A"
          CryptoCurrency[i].depositsString = "N/A"
          CryptoCurrency[i].borrowsString = "N/A"
          CryptoCurrency[i].globalLimitString = "N/A"
        }
      }
      else
      {
        CryptoCurrency[i].supplyAPYString = "N/A"
        CryptoCurrency[i].borrowAPYString = "N/A"
        CryptoCurrency[i].baseBorrowAPYString = "N/A"
        CryptoCurrency[i].utilizationRateString = "N/A"
        CryptoCurrency[i].depositsString = "N/A"
        CryptoCurrency[i].borrowsString = "N/A"
        CryptoCurrency[i].globalLimitString = "N/A"
      }
    }
  }

  function checkForMainSubMarkets()
  {
    for(var i=0; i<StableCoins.length; i++)
    {
      StableCoins[i].subMarketList = []

      if(subMarketByTokenIdAndOwnerHashMap.map)
      {
        //Only M4A Protocol Submarkets can be use in the M4A UI (Developers have to make their own UI for their own SubMarkets)
        const subMarketEntries = subMarketByTokenIdAndOwnerHashMap.map.get(StableCoins[i].tokenId.toString() +
        adminAccounts.lendingCEOAddressKey)

        if(subMarketEntries)
        {
          for(var j=0; j<subMarketEntries.length; j++)
          { 
            //The HODL Treasurer and the Singler Payer should only ever deposit into the %100 Fee Sub Market
            if((connectedWallet.addressString == adminAccounts.hodlTreasuryAddress.toString() ||
            connectedWallet.addressString == adminAccounts.singlePayerTreasuryAddress.toString()) &&
            subMarketEntries[j].subMarketIndex == 0)
              continue

            const option = 
            {
              subMarketFeeName: (subMarketEntries[j].feeOnInterestEarnedRate).toString() + "% Fee Market",
              tokenId: StableCoins[i].tokenId,
              subMarketOwnerAddress: adminAccounts.lendingCEOAddressKey,
              subMarketIndex: subMarketEntries[j].subMarketIndex
            }
            StableCoins[i].subMarketList.push(option)
          }
        }
      }
    }


    for(var i=0; i<CryptoCurrency.length; i++)
    {
      CryptoCurrency[i].subMarketList = []

      if(subMarketByTokenIdAndOwnerHashMap.map)
      {
        const subMarketEntries = subMarketByTokenIdAndOwnerHashMap.map.get(CryptoCurrency[i].tokenId.toString() +
        adminAccounts.lendingCEOAddressKey)

        if(subMarketEntries)
        {
          for(var j=0; j<subMarketEntries.length; j++)
          {
            //The HODL Treasurer and the Singler Payer should only ever deposit into the %100 Fee Sub Market
            if((connectedWallet.addressString == adminAccounts.hodlTreasuryAddress.toString() ||
            connectedWallet.addressString == adminAccounts.singlePayerTreasuryAddress.toString()) &&
            subMarketEntries[j].subMarketIndex == 0)
              continue
              
            const option = 
            {
              subMarketFeeName: (subMarketEntries[j].feeOnInterestEarnedRate).toString() + "% Fee Market",
              tokenId: CryptoCurrency[i].tokenId,
              subMarketOwnerAddress: adminAccounts.lendingCEOAddressKey,
              subMarketIndex: subMarketEntries[j].subMarketIndex
            }
            CryptoCurrency[i].subMarketList.push(option)
          }
        }
      }
    }
  }

  function checkForLendingUserAssets()
  {
    if(!lendingUserTabAccountListHashMap.map)
      return

    //Check for any assets to allow borrowing
    var hasAssets = false
    const userTabAccounts = lendingUserTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value)
    
    if(userTabAccounts)
      for(var i=0; i<userTabAccounts.length; i++)
      {
        const depositedAmount = Number(userTabAccounts[i].depositedAmount)
        if(depositedAmount != 0)
        {
          hasAssets = true
          break
        }
      }

    hasDeposits.value = hasAssets
    
    if(!subMarketByTokenIdAndOwnerHashMap.map || subMarketByTokenIdAndOwnerHashMap?.map.size == 0)
      return

    //Check for deposited amounts for Withdrawals and borrowed amounts for Repayments
    for(var i=0; i<StableCoins.length; i++)
    {
      StableCoins[i].depositBalance = 0
      StableCoins[i].borrowBalance = 0

      if(StableCoins[i].subMarketList)
      {
        for(var j=0; j<StableCoins[i].subMarketList.length; j++)
        {
          const decimalAmount = tokenDecimalHashMap.get(StableCoins[i].tokenId)
          const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(StableCoins[i].tokenId.toString() +
          adminAccounts.lendingCEOAddressKey +
          StableCoins[i].subMarketList[j].subMarketIndex.toString() +
          connectedWallet.addressString +
          accountSelect.value.toString())

          if(lendingUserTabAccount)
          {
            const depositBalance = Number(lendingUserTabAccount.depositedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
            if(depositBalance)
              StableCoins[i].depositBalance += depositBalance

            const borrowBalance = Number(lendingUserTabAccount.borrowedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
            if(borrowBalance)
              StableCoins[i].borrowBalance += borrowBalance
          }
        }
      }
    }

    for(var i=0; i<CryptoCurrency.length; i++)
    {
      CryptoCurrency[i].depositBalance = 0
      CryptoCurrency[i].borrowBalance = 0

      if(CryptoCurrency[i].subMarketList)
      {
        for(var j=0; j<CryptoCurrency[i].subMarketList.length; j++)
        {
          const decimalAmount = tokenDecimalHashMap.get(CryptoCurrency[i].tokenId)
          const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(CryptoCurrency[i].tokenId.toString() +
          adminAccounts.lendingCEOAddressKey +
          CryptoCurrency[i].subMarketList[j].subMarketIndex.toString() +
          connectedWallet.addressString +
          accountSelect.value.toString())

          if(lendingUserTabAccount)
          {
            const depositBalance = Number(lendingUserTabAccount.depositedAmount) / Math.pow(10, decimalAmount)//Convert from fixed point notation to decimal
            if(depositBalance)
              CryptoCurrency[i].depositBalance += depositBalance

            const borrowBalance = Number(lendingUserTabAccount.borrowedAmount) / Math.pow(10, decimalAmount)//Convert from fixed point notation to decimal
            if(borrowBalance)
              CryptoCurrency[i].borrowBalance += borrowBalance
          }
        }
      }
    }
  }

  function updateStoredSelectedUserAccountIndex()
  {
    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
    localStorage.setItem("selectedLendingAccountIndex" + connectedWallet.addressString, accountSelect.value.toString())
    checkForLendingUserAssets()
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

  function openTokenPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.tokenMintAddressString = rowData.tokenMintAddressString

    tokenPopoverOpen.value = true
  }

  function closeTokenPopover(e: Event) 
  {
    event.value = e
    tokenPopoverOpen.value = false
  }

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

  function setInputFocus()
  {
    accountName.value = accountList.value[accountSelect.value].accountName

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

  ion-popover 
  {
    --width: min(94vw, 144px)
  }

  #tableTitle
  {
    margin: 20px
  }

  .tableMinWidth
  {
    min-width: 1395px
  }

  #accountSelect
  {
    height: 35px;
    padding-left: 16px
  }

  .horizontalLine
  {
    width: auto;
    margin-left: -10px;
    margin-right: -10px
  }

  #accountNameEditInput
  {
    width: 300px;
    height: 32px;
    min-height: 22px;
    --highlight-color: v-bind(colorHexValue) !important
  }

  @media screen and (min-width: 1580.1px) 
  { 
    .tableContainer
    {
      display: block
    }
    .mobileContainer
    {
      display: none
    }
  }
  @media screen and (max-width: 1580px) 
  { 
    .tableContainer
    {
      display: none
    }
    .mobileContainer
    {
      display: block
    }
  }
</style>