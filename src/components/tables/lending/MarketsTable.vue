<template>
  <div class="tableContainer">
    <!--Stable Coins-->
    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines 
      sortField="supplyAPY" 
      :sortOrder="-1" 
      size="small"
      :value="StableCoins"
      :globalFilterFields="
      [
        'tokenMintAddress',
        'asset.name',
        'chain.name',
        'priceString',
        'percentChange24h',
        'supplyAPYString',
        'borrowAPYString',
        'utilizationRateString',
        'depositsString',
        'borrowsString',
        'globalLimitString'
      ]"
    >
      <template #header>
        <div>
          <h2>Earn interest on deposits while helping to push the USA to universal health care like every other fucking first world country not named the United States of America</h2>
          <p>A 3% fee on interest earned is collected for the <span color="green">M4A</span> Treasury</p>
          <p>IE: If you have $100 of USDC deposited for a year, and the supply APY remains at exactly 10% for the whole year (Not likely at all)</p>
          <p>After a year, you would have your $100(deposit) + $10(interest earned) - $0.30(fee) = $109.70</p>
          <!--<a href="https://www.youtube.com/@fdr-3" target="_blank">Where does the money come from that users are earning on their deposits?</a>-->
          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="Market Search     ">
            <ion-icon class="tableSearchIcon" slot="start" :icon="search"></ion-icon>
          </ion-input>

          <div v-if="hasAtleast1Account" class="nMediumSmallMarginBottom">
            <div class="flexCenterRow">
              <div style="margin-right: -3px">
                <InfoButton :infoMessage="userLendingInfoMSG"/>
              </div>

              <Select
              v-if="!editingAccountName"
              id="accountSelect"
              class="standardFontSize mediumMarginTop"
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
              class="mediumMarginTop mediumMarginBottom"
              :class="{ 'invalid': overCommentByteSizeLimit }"
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

              <ion-button v-if="editingAccountName" fill="clear" @click="editingAccountName=false; $emit('marketTableHeightChange', true, editingAccountName)">
                <ion-icon :src="close" color="dark"></ion-icon>
              </ion-button>
              <ion-button v-else fill="clear" @click="setInputFocus(); editingAccountName=true; $emit('marketTableHeightChange', true, editingAccountName)">
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
            <ion-popover 
            :is-open="tokenPopoverOpen" 
            :event="event" 
            @didDismiss="tokenPopoverOpen=false"
            side="top" 
            alignment="center"
            >
              <ion-button class="copyAddressButton" color="green" @click="passByRefWrapperCopyAddress()" @mouseleave="closeTokenPopover($event)">
                <ion-label color="light">{{ copyTokenMintAddressButtonText }}</ion-label>
              </ion-button>
            </ion-popover>
          </div>
        </template>
      </Column>
      <Column field="chain.name" header="Chain" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="slotProps.data.chain.source()">
              <component :is="slotProps.data.chain.svg" style="width: 35px; margin-left: -15px; margin-right: -11px"></component>
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
      <Column field="percentChange24h" header="24h% Change" style="width: 0%" sortable>
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
      <Column field="utilizationRate" header="Utilization Rate%" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.utilizationRateString }}
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
      <Column field="globalLimit" header="Global Limit" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.globalLimitString }}
        </template>
      </Column>
      <Column header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterRow">
            <ion-text v-if="!slotProps.data?.subMarketList?.length" class="noWrapText">No fdr-3 Submarkets</ion-text>
            <div v-else>
              <ion-button
              v-if="depositedAssetAmount==0"
              class="tableDepositButton"
              color="dark"
              @click="$emit('openDepositModal', slotProps.data.tokenMintAddressString, slotProps.data.subMarketList)">
              Deposit
              </ion-button>
              
              <ion-button
              v-else
              class="tableWithdrawButton"
              color="dark"
              @click="openActionsPopover($event, slotProps.data)">
              Actions
              </ion-button>
              <ion-popover
              :is-open="actionsPopoverOpen" 
              :event="event" 
              @didDismiss="actionsPopoverOpen=false"
              side="top" 
              alignment="center"
              >
                <ion-button class="copyAddressButton" fill="clear" @click="$emit('openDepositModal', event.tokenMintAddressString, event.subMarketList); actionsPopoverOpen=false">
                  <ion-label color="dark">Deposit</ion-label>
                </ion-button>
                <ion-button v-if="event.depositBalance" class="copyAddressButton" fill="clear" @click="$emit('openWithdrawalModal', event.tokenMintAddressString, event.subMarketList); actionsPopoverOpen=false">
                  <ion-label color="dark">Withdraw</ion-label>
                </ion-button>
                <ion-button class="copyAddressButton" fill="clear" @click="$emit('openBorrowModal', event.tokenMintAddressString, event.subMarketList); actionsPopoverOpen=false">
                  <ion-label color="dark">Borrow</ion-label>
                </ion-button>
                <ion-button v-if="event.borrowBalance" class="copyAddressButton" fill="clear" @click="$emit('openRepayModal', event.tokenMintAddressString, event.subMarketList); actionsPopoverOpen=false">
                  <ion-label color="dark">Repay</ion-label>
                </ion-button>
              </ion-popover>
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
      :globalFilterFields="
      [
        'tokenMintAddress',
        'asset.name',
        'chain.name',
        'priceString',
        'percentChange24h',
        'supplyAPYString',
        'borrowAPYString',
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
                <component v-if="slotProps.data.asset.name=='Sol'" :is="slotProps.data.asset.svg" style="width: 40px; margin-left: -8px; height: 32px; margin-right: -4px"/>
                <component v-else :is="slotProps.data.asset.svg" style="width: 24px; height: 32px; margin-right: 5px"/>
              <ion-label color="dark">{{ slotProps.data.asset.name }}</ion-label>
            </ion-button>
          </div>
        </template>
      </Column>
      <Column field="chain.name" header="Chain" style="width: 0%" sortable>
        <template #body="slotProps">
          <div class="flexCenterRowHeight">
            <ion-button fill="clear" @click="slotProps.data.chain.source()">
              <component :is="slotProps.data.chain.svg" style="width: 35px; margin-left: -15px; margin-right: -11px"></component>
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
      <Column field="percentChange24h" header="24h% Change" style="width: 0%" sortable>
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
      <Column field="utilizationRate" header="Utilization Rate%" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.utilizationRateString }}
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
      <Column field="globalLimit" header="Global Limit" style="width: 0%" sortable>
        <template #body="slotProps">
          {{slotProps.data.globalLimitString }}
        </template>
      </Column>
      <Column header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterRow">
            <ion-text v-if="!slotProps.data?.subMarketList?.length" class="noWrapText">No fdr-3 Submarkets</ion-text>
            <div v-else>
              <ion-button
              v-if="depositedAssetAmount==0"
              class="tableDepositButton"
              color="dark"
              @click="$emit('openDepositModal', slotProps.data.tokenMintAddressString, slotProps.data.subMarketList)">
              Deposit
              </ion-button>
              
              <ion-button
              v-else
              class="tableWithdrawButton"
              color="dark"
              @click="openActionsPopover($event, slotProps.data)">
              Actions
              </ion-button>
              <ion-popover
              :is-open="actionsPopoverOpen" 
              :event="event" 
              @didDismiss="actionsPopoverOpen=false"
              side="top" 
              alignment="center"
              >
                <ion-button class="copyAddressButton" fill="clear" @click="$emit('openDepositModal', event.tokenMintAddressString, event.subMarketList); actionsPopoverOpen=false">
                  <ion-label color="dark">Deposit</ion-label>
                </ion-button>
                <ion-button v-if="event.depositBalance" class="copyAddressButton" fill="clear" @click="$emit('openWithdrawalModal', event.tokenMintAddressString, event.subMarketList); actionsPopoverOpen=false">
                  <ion-label color="dark">Withdraw</ion-label>
                </ion-button>
                <ion-button class="copyAddressButton" fill="clear" @click="$emit('openBorrowModal', event.tokenMintAddressString, event.subMarketList); actionsPopoverOpen=false">
                  <ion-label color="dark">Borrow</ion-label>
                </ion-button>
                <ion-button v-if="event.borrowBalance" class="copyAddressButton" fill="clear" @click="$emit('openRepayModal', event.tokenMintAddressString, event.subMarketList); actionsPopoverOpen=false">
                  <ion-label color="dark">Repay</ion-label>
                </ion-button>
              </ion-popover>
            </div>
          </div>
        </template>
      </Column>
    </DataTable>
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
  import { copyTokenMintAddress,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { StableCoins, CryptoCurrency } from '/src/components/tables/lending/Assets.vue'
  import { tokenReservesHashMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketByTokenMintAddressAndOwnerHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { lendingUserAccountsHashMap, lendingUserTabAccountsHashMap, lendingUserTabAccountListHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import InfoButton from '/src/components/help/InfoButton.vue'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue')

  const emits = defineEmits(['openDepositModal', 'openWithdrawalModal', 'openBorrowModal', 'openRepayModal', 'marketTableHeightChange'])

  var tokenPopoverOpen = ref(false)
  var actionsPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")
  const userLendingInfoMSG = "Create new accounts while\nmaking a deposit"
  var accountSelect = ref(0)
  var accountList = ref()
  var hasAtleast1Account = ref()
  var editingAccountName = ref(false)
  var accountName = ref()
  var accountNameEditInputRef = ref()
  var savedEmojiCursorPosition: any
  var overCommentByteSizeLimit = ref()
  var depositedAssetAmount = ref()

  onMounted(() =>
  {
    checkForMainSubMarkets()
    setLendingUserAccountList()
    checkForLendingUserAssets()
    updateTokenReserveRelatedMarketData()
    
    accountSelect.value = Number(localStorage.getItem("selectedLendingAccountIndex")) || 0
    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value 
  })

  watch(subMarketByTokenMintAddressAndOwnerHashMap,() =>
  {
    checkForMainSubMarkets()
  })

  watch(lendingUserAccountsHashMap,() =>
  {
    setLendingUserAccountList()
    accountSelect.value = Number(localStorage.getItem("selectedLendingAccountIndex")) || 0
    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
  })

  watch(lendingUserTabAccountListHashMap,() =>
  {
    checkForLendingUserAssets()
  })

  watch(tokenReservesHashMap, () =>
  {
    updateTokenReserveRelatedMarketData()
  })

  //Json string of wallet to detect object property changes
  const walletWatch = computed(() =>
  {
    return JSON.stringify(connectedWallet)
  })

  watch(walletWatch, async (newJSONObjectString, oldJSONObjectString) =>
  {
    let newWallet = JSON.parse(newJSONObjectString)
    let oldWallet= JSON.parse(oldJSONObjectString)

    //This is here because of the "watch(lendingUserMonthlyStatementsHashMap, () =>" line. Don't want to the chart being updated twice unnecessarily
    if(newWallet.addressString == oldWallet.addressString && newWallet.selectedLendingUserAccountIndex == oldWallet.selectedLendingUserAccountIndex )
      return

    if(newWallet.addressString != SYSTEM_PROGRAM_ADDRESS_STRING)
    {
      setLendingUserAccountList()
      accountSelect.value = Number(localStorage.getItem("selectedLendingAccountIndex")) || 0
      connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
      checkForLendingUserAssets()
    }
    else
      setLendingUserAccountList()
  })

  function setLendingUserAccountList()
  {
    if(lendingUserAccountsHashMap.map)
    {
      const userAccountList = lendingUserAccountsHashMap.map.get(connectedWallet.addressString)
      if(userAccountList)
      {
        accountList.value = userAccountList
        hasAtleast1Account.value = true
        emits("marketTableHeightChange", true, editingAccountName.value)
      }
      else
      {
        hasAtleast1Account.value = false
        emits("marketTableHeightChange", false, editingAccountName.value)
      }

      //Prevents starting on the wrong index when starting new contract deployments due to saved local storage values.
      if(!hasAtleast1Account.value)
      {
        accountSelect.value = 0
        connectedWallet.selectedLendingUserAccountIndex = 0
        localStorage.setItem("selectedLendingAccountIndex", '0')
      }
    }
  }

  function updateTokenReserveRelatedMarketData()
  {
    for(var i=0; i<StableCoins.length; i++)
    {
      if(tokenReservesHashMap.map)
      {
        const tokenReserve = tokenReservesHashMap.map.get(StableCoins[i].tokenMintAddressString)
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
          StableCoins[i].utilizationRate = tokenReserve.utilizationRate / 100 //Convert to decimal from fixed point notation 
          StableCoins[i].utilizationRateString = StableCoins[i].utilizationRate.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 }) + '%'
          StableCoins[i].deposits = tokenReserve.depositedAmount //Math.pow(10, StableCoins[i].decimalAmount) //Convert to decimal from fixed point notation
          StableCoins[i].depositsString = StableCoins[i].deposits.toLocaleString('en-US', {
          minimumFractionDigits: StableCoins[i].decimalAmount,
          maximumFractionDigits: StableCoins[i].decimalAmount })
          StableCoins[i].borrows = tokenReserve.borrowedAmount //Math.pow(10, StableCoins[i].decimalAmount) //Convert to decimal from fixed point notation
          StableCoins[i].borrowsString = StableCoins[i].borrows.toLocaleString('en-US', {
          minimumFractionDigits: StableCoins[i].decimalAmount,
          maximumFractionDigits: StableCoins[i].decimalAmount })
          StableCoins[i].globalLimit = Number(tokenReserve.globalLimit) / Math.pow(10, StableCoins[i].decimalAmount) //Convert to decimal from fixed point notation
          StableCoins[i].globalLimitString = StableCoins[i].globalLimit.toLocaleString()
        }
        else
        {
          StableCoins[i].supplyAPYString = "N/A"
          StableCoins[i].borrowAPYString = "N/A"
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
        const tokenReserve = tokenReservesHashMap.map.get(CryptoCurrency[i].tokenMintAddressString)
        if(tokenReserve)
        {
          /*console.log(tokenReserve)
          console.log(Number(tokenReserve.utilizationRate))
          console.log(Number(tokenReserve.feesGeneratedAmount))
          console.log(Number(tokenReserve.interestAccruedAmount))
          console.log(Number(tokenReserve.supplyInterestChangeIndex))
          console.log(Number(tokenReserve.borrowInterestChangeIndex))
          console.log(Number(tokenReserve.interestEarnedAmount))*/

          CryptoCurrency[i].supplyAPY  = tokenReserve.supplyApy / 100 //Convert to decimal from fixed point notation
          CryptoCurrency[i].supplyAPYString = CryptoCurrency[i].supplyAPY.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 }) + '%'
          CryptoCurrency[i].borrowAPY = tokenReserve.borrowApy / 100 //Convert to decimal from fixed point notation
          CryptoCurrency[i].borrowAPYString = CryptoCurrency[i].borrowAPY.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 }) + '%'
          CryptoCurrency[i].utilizationRate = tokenReserve.utilizationRate / 100
          CryptoCurrency[i].utilizationRateString = CryptoCurrency[i].utilizationRate.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 }) + '%'
          CryptoCurrency[i].deposits = tokenReserve.depositedAmount //Math.pow(10, CryptoCurrency[i].decimalAmount) //Convert to decimal from fixed point notation
          CryptoCurrency[i].depositsString = CryptoCurrency[i].deposits.toLocaleString('en-US', {
          minimumFractionDigits: CryptoCurrency[i].decimalAmount,
          maximumFractionDigits: CryptoCurrency[i].decimalAmount })
          CryptoCurrency[i].borrows = tokenReserve.borrowedAmount //Math.pow(10, CryptoCurrency[i].decimalAmount) //Convert to decimal from fixed point notation
          CryptoCurrency[i].borrowsString = CryptoCurrency[i].borrows.toLocaleString('en-US', {
          minimumFractionDigits: CryptoCurrency[i].decimalAmount,
          maximumFractionDigits: CryptoCurrency[i].decimalAmount })
          CryptoCurrency[i].globalLimit = Number(tokenReserve.globalLimit) / Math.pow(10, CryptoCurrency[i].decimalAmount) //Convert to decimal from fixed point notation
          CryptoCurrency[i].globalLimitString = CryptoCurrency[i].globalLimit.toLocaleString()
        }
        else
        {
          CryptoCurrency[i].supplyAPYString = "N/A"
          CryptoCurrency[i].borrowAPYString = "N/A"
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

      if(subMarketByTokenMintAddressAndOwnerHashMap.map)
      {
        //Only M4A Protocol Submarkets can be use in the M4A UI (Developers have to make their own UI for their own SubMarkets)
        const subMarketEntries = subMarketByTokenMintAddressAndOwnerHashMap.map.get(StableCoins[i].tokenMintAddressString +
        adminAccounts.lendingCEOAddressKey)

        if(subMarketEntries)
        {
          for(var j=0; j<subMarketEntries.length; j++)
          {
            const option = 
            {
              subMarketFeeName: (subMarketEntries[j].feeOnInterestEarnedRate).toString() + "% Fee Market",
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

      if(subMarketByTokenMintAddressAndOwnerHashMap.map)
      {
        const subMarketEntries = subMarketByTokenMintAddressAndOwnerHashMap.map.get(CryptoCurrency[i].tokenMintAddressString +
        adminAccounts.lendingCEOAddressKey)

        if(subMarketEntries)
        {
          for(var j=0; j<subMarketEntries.length; j++)
          {
            const option = 
            {
              subMarketFeeName: (subMarketEntries[j].feeOnInterestEarnedRate).toString() + "% Fee Market",
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
    var assetAmount = 0
    const userTabAccounts = lendingUserTabAccountListHashMap.map.get(connectedWallet.addressString + accountSelect.value)
    
    if(userTabAccounts)
      for(var i=0; i<userTabAccounts.length; i++)
      {
        const depositedAmount = Number(userTabAccounts[i].depositedAmount)
        if(depositedAmount != 0)
        {
          assetAmount = depositedAmount
          break
        }
      }

    depositedAssetAmount.value = assetAmount
    
    if(!subMarketByTokenMintAddressAndOwnerHashMap.map || subMarketByTokenMintAddressAndOwnerHashMap?.map.size == 0)
      return

    //Check for deposited amounts for Withdrawals and borrowed amounts for Repayments
    for(var i=0; i<StableCoins.length; i++)
    {
      StableCoins[i].depositBalance = 0

      if(StableCoins[i].subMarketList)
      {
        for(var j=0; j<StableCoins[i].subMarketList.length; j++)
        {
          const decimalAmount = tokenDecimalHashMap.get(StableCoins[i].tokenMintAddressString)
          const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(StableCoins[i].tokenMintAddressString +
          adminAccounts.lendingCEOAddressKey +
          StableCoins[i].subMarketList[j].subMarketIndex.toString() +
          connectedWallet.addressString +
          accountSelect.value.toString())

          if(lendingUserTabAccount)
          {
            const depositBalance = Number(lendingUserTabAccount.depositedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
            if(depositBalance)
              StableCoins[i].depositBalance = depositBalance

            const borrowBalance = Number(lendingUserTabAccount.borrowedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
            if(depositBalance)
              StableCoins[i].borrowBalance = borrowBalance
          }
        }
      }
    }

    for(var i=0; i<CryptoCurrency.length; i++)
    {
      CryptoCurrency[i].depositBalance = 0

      if(CryptoCurrency[i].subMarketList)
      {
        for(var j=0; j<CryptoCurrency[i].subMarketList.length; j++)
        {
          const decimalAmount = tokenDecimalHashMap.get(CryptoCurrency[i].tokenMintAddressString)
          const lendingUserTabAccount = lendingUserTabAccountsHashMap.map.get(CryptoCurrency[i].tokenMintAddressString +
          adminAccounts.lendingCEOAddressKey +
          CryptoCurrency[i].subMarketList[j].subMarketIndex.toString() +
          connectedWallet.addressString +
          accountSelect.value.toString())

          if(lendingUserTabAccount)
          {
            const depositBalance = Number(lendingUserTabAccount.depositedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
            if(depositBalance)
              CryptoCurrency[i].depositBalance = depositBalance

            const borrowBalance = Number(lendingUserTabAccount.borrowedAmount / Math.pow(10, decimalAmount))//Convert from fixed point notation to decimal
            if(depositBalance)
              CryptoCurrency[i].borrowBalance = borrowBalance
          }
        }
      }
    }
  }

  function updateStoredSelectedUserAccountIndex()
  {
    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
    localStorage.setItem("selectedLendingAccountIndex", accountSelect.value.toString())
    checkForLendingUserAssets()
  }

  const customFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([accountName.value])
    const sizeInBytes = blob.size

    inputLength = sizeInBytes

    if(inputLength > maxLength)
    {
      overCommentByteSizeLimit.value = true
    }
    else
      overCommentByteSizeLimit.value = false

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
    event.value.tokenMintAddressString = rowData.tokenMintAddressString
    event.value.subMarketList = rowData.subMarketList
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

  function passByRefWrapperCopyAddress()
  {
    copyTokenMintAddress(copyTokenMintAddressButtonText, event.value.tokenMintAddressString)
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
  .container
  {
    margin-bottom: 77px
  }

  #tableTitle
  {
    margin: 20px
  }

  .tableMinWidth
  {
    min-width: 1375px
  }
  @-moz-document url-prefix()
  {
    .tableMinWidth
    {
      min-width: 1500px
    }
  }

  #accountSelect
  {
    height: 35px;
    padding-left: 16px
  }

  #accountNameEditInput
  {
    width: 300px;
    height: 32px;
    min-height: 22px;
    --highlight-color: v-bind(colorHexValue) !important
  }

  ion-input
  {
    --highlight-color: var(--ion-color-green)
  }

  ion-icon
  {
    width: 25px;
    height: 25px
  }
</style>