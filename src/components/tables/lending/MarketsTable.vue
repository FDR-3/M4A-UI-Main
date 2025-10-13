<template>
  <div class="tableContainer">
    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines 
      sortField="apy" 
      :sortOrder="-1" 
      size="small" 
      scrollable
      :value="StableCoins"
      rowGroupMode="subheader" 
      groupRowsBy="asset.type"
      :globalFilterFields="['tokenMintAddress', 'asset.name', 'priceString', 'percentChange24h', 'apy', 'chain.name']"
    >
      <template #header>
        <div>
          <h2>Earn interest on deposits while helping to push the USA to universal health care like every other fucking first world country not named the United States of America</h2>
          <p>A 3% fee on interest earned is collected for the <span color="green">M4A</span> Treasury</p>
          <p>IE: If you have $100 of USDC deposited for a year, and the apy remains at exactly 10% for the whole year (Not likely at all)</p>
          <p>After a year, you would have your $100(deposit) + $10(interest earned) - $0.30(fee) = $109.70</p>
          <!--<a href="https://www.youtube.com/@fdr-3" target="_blank">Where does the money come from that users are earning on their deposits?</a>-->
          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="Market Search     ">
            <ion-icon class="tableSearchIcon" slot="start" :icon="search"></ion-icon>
          </ion-input>

          <div v-if="hasAtleast1Account" class="nMediumSmallMarginBottom">
            <div class="flexCenterRow">
              <ion-button fill="clear" @click="openUserLendingAccountInfo($event)">
                <ion-icon :src="informationCircle" color="dark"></ion-icon>
              </ion-button>
              <ion-popover
              :is-open="userLendingInfo" 
              :event="event" 
              @didDismiss="userLendingInfo=false"
              side="top" 
              alignment="center">
                <ion-text align="center">Create new accounts while making a deposit</ion-text>
              </ion-popover>

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
              @change="updateStoredSelectedAccount()">
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
                <ion-label color="dark">{{ copyTokenMintAddressButtonText }}</ion-label>
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
      <Column field="apy" header="APY%" style="width: 0%" sortable></Column>
      <Column header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterRow">
            <ion-button
            class="tableDepositButton"
            color="dark"
            @click="$emit('openDepositModal',
            slotProps.data.tokenMintAddress,
            slotProps.data.decimalAmount,
            slotProps.data.asset.svg,
            slotProps.data.asset.name)"
            >
             Deposit
            </ion-button>
            <ion-button
            v-if="slotProps.data.depositBalance"
            class="tableWithdrawButton"
            color="dark"
            @click="$emit('openWithdrawModal',
            slotProps.data.tokenMintAddress,
            slotProps.data.decimalAmount,
            slotProps.data.asset.svg,
            slotProps.data.asset.name)"
            >
             Withdraw
            </ion-button>
          </div>
        </template>
      </Column>
    </DataTable>

    <DataTable 
      class="tableMinWidth"
      v-model:filters="filters" 
      show-gridlines size="small" 
      :value="CryptoCurrency"
      scrollable
      rowGroupMode="subheader" 
      groupRowsBy="asset.type"
      :globalFilterFields="['tokenMintAddress', 'asset.name', 'priceString', 'percentChange24h', 'apy', 'chain.name']"
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
                <component v-if="slotProps.data.asset.name=='Sol'" :is="slotProps.data.asset.svg" style="width: 40px; margin-left: -8px; margin-right: -4px"/>
                <component v-else :is="slotProps.data.asset.svg" style="width: 24px; height: 24px; margin-right: 5px"/>
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
      <Column field="apy" header="APY%" style="width: 0%" sortable></Column>
      <Column header="Actions" style="width: 0%">
        <template #body="slotProps">
          <div class="flexCenterColumn">
            <ion-button
            class="tableDepositButton"
            color="dark"
            @click="$emit('openDepositModal',
            slotProps.data.tokenMintAddress,
            slotProps.data.decimalAmount,
            slotProps.data.asset.svg,
            slotProps.data.asset.name)"
            >
             Deposit
            </ion-button>
            <ion-button
            v-if="slotProps.data.depositBalance"
            class="tableWithdrawButton"
            color="dark"
            @click="$emit('openWithdrawModal',
            slotProps.data.tokenMintAddress,
            slotProps.data.decimalAmount,
            slotProps.data.asset.svg,
            slotProps.data.asset.name)"
            >
             Withdraw
            </ion-button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, inject } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonPopover, IonText } from '@ionic/vue'
  import { pencil, informationCircle, close } from 'ionicons/icons'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Select from 'primevue/select'
  import EmojiButton from '/src/components/comments/emojis/EmojiButton.vue'
  import { FilterMatchMode } from '@primevue/core/api'
  import { anchorPrograms, MAX_ACCOUNT_NAME_LENGTH } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { search } from 'ionicons/icons'
  import { copyTokenMintAddress,
    confirmLendingTransaction,
    toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { StableCoins, CryptoCurrency  } from '/src/components/tables/lending/Assets.vue'
  import { lendingerUserAccountsHashMap, lendingerUserDepositBalanceHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'

  const toast = inject('toast')
  const colorHexValue = inject('colorHexValue')

  const emits = defineEmits(['openDepositModal', 'openWithdrawModal', 'marketTableHeightChange'])

  var tokenPopoverOpen = ref(false)
  var event = ref()
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")

  var userLendingInfo = ref(false)
  var accountSelect = ref(0)
  var accountList = ref()
  var hasAtleast1Account = ref()
  var editingAccountName = ref(false)
  var accountName = ref()
  var accountList = ref()
  var hasAtleast1Account = ref()
  var accountNameEditInputRef = ref()
  var savedEmojiCursorPosition: any
  var overCommentByteSizeLimit = ref()

  onMounted(() =>
  {
    setLendingUserAccountList()
    checkForLendingUserDeposits()

    accountSelect.value = Number(localStorage.getItem(connectedWallet.addressString + "selectedLendingAccountIndex")) || 0
    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
  })
  
  watch([lendingerUserAccountsHashMap, connectedWallet],() =>
  {
    setLendingUserAccountList()

    accountSelect.value = Number(localStorage.getItem(connectedWallet.addressString + "selectedLendingAccountIndex")) || 0
    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
  })

  watch([lendingerUserDepositBalanceHashMap, connectedWallet],() =>
  {
    checkForLendingUserDeposits()
  })
  
  function setLendingUserAccountList()
  {
    if(lendingerUserAccountsHashMap.map)
    {
      const userAccountList = lendingerUserAccountsHashMap.map.get(connectedWallet.addressString)
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
    }
  }

  function checkForLendingUserDeposits()
  {
    for(var i=0; i<StableCoins.length; i++)
    {
      if(lendingerUserDepositBalanceHashMap.map)
      {
        const depositBalance = lendingerUserDepositBalanceHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString() + StableCoins[i].tokenMintAddress)
        if(depositBalance)
          StableCoins[i].depositBalance = depositBalance
        else
          StableCoins[i].depositBalance = undefined
      }
      else
        StableCoins[i].depositBalance = undefined
    }

    for(var i=0; i<CryptoCurrency.length; i++)
    {
      if(lendingerUserDepositBalanceHashMap.map)
      {
        const depositBalance = lendingerUserDepositBalanceHashMap.map.get(connectedWallet.addressString + accountSelect.value.toString() + CryptoCurrency[i].tokenMintAddress)
        if(depositBalance)
          CryptoCurrency[i].depositBalance = depositBalance
        else
          CryptoCurrency[i].depositBalance = undefined
      }
      else
        CryptoCurrency[i].depositBalance = undefined
    }
  }

  function updateStoredSelectedAccount()
  {
    connectedWallet.selectedLendingUserAccountIndex = accountSelect.value
    localStorage.setItem(connectedWallet.addressString + "selectedLendingAccountIndex", accountSelect.value.toString())
    checkForLendingUserDeposits()
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
    event.value.tokenMintAddress = rowData.tokenMintAddress

    tokenPopoverOpen.value = true
  }

  function closeTokenPopover(e: Event) 
  {
    event.value = e
    tokenPopoverOpen.value = false
  }

  function openUserLendingAccountInfo(e: Event) 
  {
    event.value = e
    userLendingInfo.value = true
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
    copyTokenMintAddress(copyTokenMintAddressButtonText, event.value.tokenMintAddress)
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
    min-width: 795px
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