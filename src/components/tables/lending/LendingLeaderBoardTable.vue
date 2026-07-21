<template>
  <div class="tableContainer">
    <DataTable
      ref="tableRef"
      id="lendingLeaderBoardTable"
      class="tableMinWidth"
      paginator 
      :rows="10" 
      :rowsPerPageOptions="[10, 20, 50, 100]" 
      dataKey="ranking" 
      v-model:filters="filters" 
      show-gridlines 
      size="small"
      :value="tableData"
      v-model:expandedRows="subTableData"
      v-model:sortField="sortField"
      v-model:sortOrder="sortOrder"
      :loading="isLoading"
      @sort="handleSort($event)"
      :globalFilterFields="
      [
        'ranking',
        'id',
        'displayName',
        'owner',
        'depositedValueString',
        'interestEarnedValueString',
        'interestAccruedValueString',
        'borrowedValueString',
        'repaidValueString',
        'liquidatorValueString',
        'liquidatedValueString',
        'accountList.accountName'
      ]"
    >
      <template #header>
        <div>
          <div class="flexCenterRow">
            <div style="margin-bottom: 4px">
              <InfoButton :infoMessage="lendingLeaderBoardInfoMSG"/>
            </div>
            <h2>Lending Leader Board</h2>
          </div>

          <ion-input color="dark" v-model="filters['global'].value" fill="outline" placeholder="Lending Leader Board Search     ">
            <ion-icon class="tableSearchIcon" slot="start" :icon="search"></ion-icon>
          </ion-input>

          <ion-button fill="clear" @click="expandSubTables()">
            <ion-label  color="dark">Expand Users</ion-label>
          </ion-button>

          <ion-button fill="clear" @click="exportCSV($event)">
            <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
          </ion-button>

          <ion-button fill="clear" @click="subTableData={}">
            <ion-label  color="dark">Collapse Users</ion-label>
          </ion-button>
        </div>
      </template>
      <template #empty> No records found. </template>
      <template #loading> Loading Lending Leader Board. Please Wait. </template>
      
      <Column expander style="width: 0%"/>
      <Column field="ranking" header="Ranking" style="width: 0%"></Column>
      <Column field="displayName" header="User" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-button fill="clear" style="margin: 0px; margin-left: -15px" @click="openOwnerPopover($event, slotProps.data)">
            <div class="flexCenterRowHeight">
              <div class="smallMarginLeft" >
                <div v-if=" slotProps.data.owner==adminAccounts.lendingCEOAddressString">
                  <RIPKingStarWolf v-if="adminAccounts.ceoIsDead && slotProps.data.ranking==1" class="kingStarWolfButton" style="margin-left: -7px; margin-right: -5px"/>
                  <RIPStarWolf v-else-if="adminAccounts.ceoIsDead" class="starWolfButton" :fill="slotProps.data.ranking==1 ? '#ffd700' :
                  slotProps.data.ranking == 2 ? '#b5bbcad3' :
                  slotProps.data.ranking == 3 ? '#a77822' : colorHexValue"/>
                  <KingStarWolf v-else-if="slotProps.data.ranking==1" class="kingStarWolfButton" style="margin-left: -7px; margin-right: -5px"/>
                  <StarWolf v-else class="starWolfButton" :fill="slotProps.data.ranking == 2 ? '#b5bbcad3' :
                  slotProps.data.ranking == 3 ? '#a77822' : colorHexValue"/>
                </div>
                <div v-else>
                  <KingStarWolf v-if="slotProps.data.ranking==1" class="kingStarWolfButton" style="margin-left: -7px; margin-right: -5px"/>
                  <StarWolf v-else class="starWolfButton" :fill="slotProps.data.ranking == 2 ? '#b5bbcad3' :
                  slotProps.data.ranking == 3 ? '#a77822' :
                  darkTheme.value ? '#FFFFFF' : '#000000'"/>
                </div>
              </div>

              <ion-label v-if="slotProps.data.owner!=adminAccounts.lendingCEOAddressString" color="dark" class="noWrapText">{{ slotProps.data.displayName }}</ion-label>
              <ion-label v-else color="green" class="noWrapText">{{ slotProps.data.displayName }}</ion-label>
            </div>
          </ion-button>
          <ion-popover 
          :is-open="ownerPopoverOpen" 
          :event="event" 
          @didDismiss="ownerPopoverOpen=false"
          side="top" 
          alignment="center"
          >
            <ion-button class="copyAddressButton thinBorder" color="light" @click="passByRefWrapperCopyAddress()" @mouseleave="closeOwnerPopover($event)">
              <ion-label color="green">{{ copyFullAddressButtonText }}</ion-label>
            </ion-button>
          </ion-popover>
        </template>
      </Column>
      <Column field="interestEarnedValue" style="width: 0%" class="rainbowText" sortable>
        <template #header>
          <span class="rainbowText">Interest Earned Value</span>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.interestEarnedValueString }}
        </template>
      </Column>
      <Column field="interestAccruedValue" style="width: 0%" class="poopText" sortable>
        <template #header>
          <span class="poopText">Interest Accrued Value</span>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.interestAccruedValueString }}
        </template>
      </Column>
      <Column field="depositedValue" header="Deposited Value" style="width: 0%" :style="{color: colorHexValue}" sortable>
        <template #body="slotProps">
          {{ slotProps.data.depositedValueString }}
        </template>
      </Column>
      <Column field="borrowedValue" header="Borrowed Value" style="width: 0%; color: #557fcc" sortable>
        <template #body="slotProps">
          {{ slotProps.data.borrowedValueString }}
        </template>
      </Column>
      <Column field="repaidValue" header="Repaid Value" style="width: 0%; color: #ffd700" sortable>
        <template #body="slotProps">
          {{ slotProps.data.repaidValueString }}
        </template>
      </Column>
      <Column field="liquidatorValue" header="Liquidator Value" style="width: 0%; color: #8a2be2" sortable>
        <template #body="slotProps">
          {{ slotProps.data.liquidatorValueString }}
        </template>
      </Column>
      <Column field="liquidatedValue" header="Liquidated Value" style="width: 0%; color: red" sortable>
        <template #body="slotProps">
          {{ slotProps.data.liquidatedValueString }}
        </template>
      </Column>
      <Column field="liquidatableColorStep" header="Liquidatable" style="width: 0%; color: red" sortable>
        <template #body="slotProps">
          <ion-text :color="slotProps.data.liquidatable ? 'red' : slotProps.data.healthFactorCaution ? 'yellow' : 'green'">
            {{ slotProps.data.liquidatable }}
          </ion-text>
        </template>
      </Column>
      <template #expansion="slotProps">
        <DataTable id="lendingLeaderBoardInnerTable" :value="slotProps.data.accountList" style="font-size: 5px">
          <Column field="accountName" header="Account" style="width: 0%" sortable>
            <template #body="slotProps">
              <ion-button fill="clear" @click="openViewPortfolioPopover($event, slotProps.data)">
                <ion-label :color="slotProps.data.healthFactor>=70 ? 'green' : slotProps.data.healthFactor>=30 ? 'yellow' : 'red'"
                class="noWrapText nMediumSmallMarginLeft" style="font-size: 11px">{{ slotProps.data.accountName }}</ion-label>
              </ion-button>
              <ion-popover
              class="popoverWidth"
              :is-open="viewPortfolioPopoverOpen" 
              :event="event" 
              @didDismiss="viewPortfolioPopoverOpen=false"
              side="top" 
              alignment="center"
              >
                <div class="flexCenterColumn" style="margin: 20px">
                  <HealthFactorSmall :assetValue="healthFactorPopUpDepositedValue" :debtValue="healthFactorPopUpBorrowedValue"/>
                  <ion-button class="fullWidthButton thinBorder" fill="clear" @click="openSelectedPortfolio()">
                    <ion-label color="green">View</ion-label>
                  </ion-button>
                  <ion-button class="fullWidthButton thinBorder lendingActionButton" fill="clear"
                  @click="$emit('openLiquidationModal', event.owner, event.accountIndex); viewPortfolioPopoverOpen = false"
                  :disabled="event.healthFactor > 0">
                    <ion-label color="red" class="noClickEvent">Liquidate</ion-label>
                  </ion-button>
                </div>
              </ion-popover>
            </template>
          </Column>
          <Column field="tokenName" header="Market" style="width: 0%" sortable>
            <template #body="slotProps">
              <div class="">
                <ion-button fill="clear" class="marginZero" @click="openTokenPopover($event, slotProps.data)">
                  <img v-if="slotProps.data.tokenId==tokenIds.solTokenId" style="width: 40px; height: 32px; margin-left: -17px; margin-right: -5px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
                  <Component v-else style="width: 32px; height: 28px; margin-left: -17px" :is="slotProps.data.tokenSVG"></Component>
                  <ion-label class="noWrapText" color="dark" style="font-size: 9px">{{ slotProps.data.tokenName }}</ion-label>
                </ion-button>
                <ion-popover 
                :is-open="tokenPopoverOpen" 
                :event="event" 
                @didDismiss="tokenPopoverOpen=false"
                side="top" 
                alignment="center"
                >
                  <div class="flexCenterColumn" style="margin: 5px" @mouseleave="closeTokenPopover($event)"> 
                    <ion-text class="wrapText">SubMarket Owner: {{ event.trimmedSubMarketOwnerAddress }}</ion-text><br>
                    <ion-text>SubMarket Index: {{ event.subMarketIndex }}</ion-text>
                    <ion-button class="copyAddressButton thinBorder" color="light" @click="passByRefWrapperCopyTokenMintAddress()">
                      <ion-label color="green">{{ copyTokenMintAddressButtonText }}</ion-label>
                    </ion-button>
                  </div>
                </ion-popover>
              </div>
            </template>
          </Column>
          <Column field="newInterestEarnedAmount" style="width: 0%" class="rainbowText" sortable>
            <template #header>
              <span class="rainbowText">Interest Earned Amount</span>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.newInterestEarnedAmountString }}
            </template>
          </Column>
          <Column field="interestEarnedValue" style="width: 0%" class="rainbowText" sortable>
            <template #header>
              <span class="rainbowText">Interest Earned Value</span>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.interestEarnedValueString }}
            </template>
          </Column>
          <Column field="newInterestAccruedAmount" style="width: 0%" class="poopText" sortable>
            <template #header>
              <span class="poopText">Interest Accrued Amount</span>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.newInterestAccruedAmountString }}
            </template>
          </Column>
          <Column field="interestAccruedValue" style="width: 0%" class="poopText" sortable>
            <template #header>
              <span class="poopText">Interest Accrued Value</span>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.interestAccruedValueString }}
            </template>
          </Column>
          <Column field="newDepositedAmount" header="Deposited Amount" style="width: 0%" :style="{color: colorHexValue}" sortable>
            <template #body="slotProps">
              {{ slotProps.data.newDepositedAmountString }}
            </template>
          </Column>
          <Column field="depositedValue" header="Deposited Value" style="width: 0%" :style="{color: colorHexValue}" sortable>
            <template #body="slotProps">
              {{ slotProps.data.depositedValueString }}
            </template>
          </Column>
          <Column field="newBorrowedAmount" header="Borrowed Amount" style="width: 0%; color: #557fcc" sortable>
          <template #body="slotProps">
            {{ slotProps.data.newBorrowedAmountString }}
          </template>
          </Column>
          <Column field="borrowedValue" header="Borrowed Value" style="width: 0%; color: #557fcc" sortable>
            <template #body="slotProps">
              {{ slotProps.data.borrowedValueString }}
            </template>
          </Column>
          <Column field="repaidAmount" header="Repaid Amount" style="width: 0%; color: #ffd700" sortable>
            <template #body="slotProps">
              {{ slotProps.data.repaidAmountString }}
            </template>
          </Column>
          <Column field="repaidValue" header="Repaid Value" style="width: 0%; color: #ffd700" sortable>
            <template #body="slotProps">
              {{ slotProps.data.repaidValueString }}
            </template>
          </Column>
          <Column field="liquidatorAmount" header="Liquidator Amount" style="width: 0%; color: #8a2be2" sortable>
            <template #body="slotProps">
              {{ slotProps.data.liquidatorAmountString }}
            </template>
          </Column>
          <Column field="liquidatorValue" header="Liquidator Value" style="width: 0%; color: #8a2be2" sortable>
            <template #body="slotProps">
              {{ slotProps.data.liquidatorValueString }}
            </template>
          </Column>
          <Column field="liquidatedAmount" header="Liquidated Amount" style="width: 0%; color: red" sortable>
            <template #body="slotProps">
              {{ slotProps.data.liquidatedAmountString }}
            </template>
          </Column>
          <Column field="liquidatedValue" header="Liquidated Value" style="width: 0%; color: red" sortable>
            <template #body="slotProps">
              {{ slotProps.data.liquidatedValueString }}
            </template>
          </Column>
        </DataTable>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, inject, type Component, markRaw } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonPopover, IonText } from '@ionic/vue'
  import { search, download } from 'ionicons/icons'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import RIPStarWolf from '/src/assets/svg/rip-star-wolf-svg.vue'
  import KingStarWolf from '/src/components/fancy/KingStarWolf.vue'
  import RIPKingStarWolf from '/src/components/fancy/rip/RIPKingStarWolf.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { FilterMatchMode } from '@primevue/core/api'
  import { lendingLeaderBoardTable, lendingUserHashMap, lendingUserTabAccountsHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { priceObjectMap, tokenReservesHashMap, tokenIdHashMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { subMarketsHashMap } from '/src/assets/globalStates/lending/SubMarkets.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { copyAddress, copyFullAddressText, copyTokenMintAddressText } from '/src/assets/contracts/WalletHelper.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { tokenIds, tokenDecimalHashMap } from '/src/assets/constants/Addresses.ts'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { unixData } from '/src/assets/globalStates/AnchorPrograms.vue'
  import HealthFactorSmall from '/src/components/smart contracts/lending protocol/HealthFactorSmall.vue'
  import { getCompoundingFactor } from '/src/components/smart contracts/lending protocol/InterestCalcHelpers.ts'
  import InfoButton from '/src/components/help/InfoButton.vue'
  import cloneDeep from 'lodash/cloneDeep'

  const emits = defineEmits(
  [
    'viewPortfolio',
    'openLiquidationModal'
  ])

  const colorHexValue = inject('colorHexValue') as string
  
  type HealthFactor = 
  {
    depositValue: number,
    borrowValue: number,
    healthFactor: number
  }

  var tableRef = ref()
  var tableData = ref()
  var subTableData = ref()
  var isLoading = ref(true)
  var previousSortField = "depositedValue"
  var sortField = ref("depositedValue")
  var sortOrder = ref(-1)
  var totalNumberOfTopRows = 0
  var totalNumberOfSubRows = 0
  var healthFactorHashMap: Map<string, HealthFactor>
  var tokenReservesHashMapCopy: Map<string, any>
  var timeStampIntervalId: any

  const lendingLeaderBoardInfoMSG = "You can copy a User's address by clicking on them. You can view or liquidate an Account by clicking on them."

  var event = ref()
  var healthFactorPopUpDepositedValue = ref(0)
  var healthFactorPopUpBorrowedValue = ref(0)
  var viewPortfolioPopoverOpen = ref(false)
  var ownerPopoverOpen = ref(false)
  var copyFullAddressButtonText = ref(copyFullAddressText)
  var tokenPopoverOpen = ref(false)
  var copyTokenMintAddressButtonText = ref(copyTokenMintAddressText)

  onMounted(() =>
  {
    subTableData.value = {}

    if(lendingLeaderBoardTable.data)
    {
      if(tokenReservesHashMap.map)
        tokenReservesHashMapCopy = cloneDeep(tokenReservesHashMap.map)

      updateLeaderBoardValues(true)
      updateLeaderBoardDisplayNames()

      if(lendingUserHashMap.map)
        updateLeaderBoardAccountNames()

      sortTable()
    }
  })

  onUnmounted(() =>
  {
    stopTimeStampInterval()
  })

  watch(lendingLeaderBoardTable,() =>
  {
    updateLeaderBoardValues(true)
    sortTable()
  })

  watch(tokenReservesHashMap,() =>
  {
    tokenReservesHashMapCopy = cloneDeep(tokenReservesHashMap.map)
  })

  watch(priceObjectMap,() =>
  {
    updateLeaderBoardValues(false)
    sortTable()//Sort again incase price changes cause a change in the rankings
  })

  watch(customUserNameHashMap,() =>
  {
    updateLeaderBoardDisplayNames()
    sortTable()//Sort again incase name change caused a change the rankings
  })

  watch(lendingUserHashMap,() =>
  {
    updateLeaderBoardAccountNames()
  })

  function updateLeaderBoardValues(newTableData: boolean)
  {
    var tempData

    if(!newTableData)
    {
      if(!tableData.value)
        return

      tempData = tableData.value //Copy existing table when updating prices with no new data. Clone deep alone causes flickering on the rainbowtext when a row is opened
    }
    else
    {
      if(!lendingLeaderBoardTable.data)
        return

      tempData = cloneDeep(lendingLeaderBoardTable.data)//Clone deep to avoid setting off watcher and running multiple times
    }

    if(priceObjectMap.data)
    {
      var topRowCount = 0
      var subRowCount = 0
      var tempHealthFactorHashMap = new Map<string, HealthFactor>()

      calculateTokenReserveInterestChangeIndex(unixData.timeStamp)

      for(var i=0; i<tempData.length; i++)
      {
        var ownerOverallAccountInterestEarnedTotalValue = 0
        var ownerOverallAccountInterestAccruedTotalValue = 0
        var ownerOverallAccountDepositedTotalValue = 0
        var ownerOverallAccountBorrowedTotalValue = 0
        var ownerOverallAccountRepaidTotalValue = 0
        var ownerOverallAccountLiquidatorTotalValue = 0
        var ownerOverallAccountLiquidatedTotalValue = 0
        tempData[i].healthFactorCaution = false
        tempData[i].liquidatable = false
        tempData[i].liquidatableColorStep = 0
        topRowCount += 1

        for(var j=0; j<tempData[i].accountList.length; j++)
        {
          const decimalAmount = tokenDecimalHashMap.get(tempData[i].accountList[j].tokenId)
          var calculatedValue = 0
          subRowCount += 1

          const tokenMintAddressString = tokenIdHashMap.map.get(tempData[i].accountList[j].tokenId)
          const priceData = priceObjectMap.data[tokenMintAddressString]
          if(priceData)
          {
            //Remarking SVG Raw to prevent overhead and warnings in console
            tempData[i].accountList[j].tokenSVG = markRaw(tempData[i].accountList[j].tokenSVG)

            const newInterestEarnedAmount = calculateUserNewInterestEarnedAmount(tempData[i].accountList[j])
            tempData[i].accountList[j].newInterestEarnedAmount = Number((tempData[i].accountList[j].interestEarnedAmount +
            newInterestEarnedAmount).toFixed(decimalAmount))
            tempData[i].accountList[j].newInterestEarnedAmountString = tempData[i].accountList[j].newInterestEarnedAmount.toFixed(decimalAmount)
            //Calculate Interest Earned Value
            calculatedValue = tempData[i].accountList[j].newInterestEarnedAmount * priceData.usdPrice
            tempData[i].accountList[j].interestEarnedValue = calculatedValue
            tempData[i].accountList[j].interestEarnedValueString = '$' + calculatedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })
            ownerOverallAccountInterestEarnedTotalValue += calculatedValue

            const newInterestAccruedAmount = calculateUserNewInterestAccruedAmount(tempData[i].accountList[j])
            tempData[i].accountList[j].newInterestAccruedAmount = Number((tempData[i].accountList[j].interestAccruedAmount +
            newInterestAccruedAmount).toFixed(decimalAmount))
            tempData[i].accountList[j].newInterestAccruedAmountString = tempData[i].accountList[j].newInterestAccruedAmount.toFixed(decimalAmount)
            //Calculate Interest Accrued Value
            calculatedValue = tempData[i].accountList[j].newInterestAccruedAmount * priceData.usdPrice
            tempData[i].accountList[j].interestAccruedValue = calculatedValue
            tempData[i].accountList[j].interestAccruedValueString = '$' + calculatedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })
            ownerOverallAccountInterestAccruedTotalValue += calculatedValue

            tempData[i].accountList[j].newDepositedAmount = Number((tempData[i].accountList[j].depositedAmount +
            newInterestEarnedAmount).toFixed(decimalAmount))
            tempData[i].accountList[j].newDepositedAmountString = tempData[i].accountList[j].newDepositedAmount.toFixed(decimalAmount)
            //Calculate Deposited Value
            calculatedValue = tempData[i].accountList[j].newDepositedAmount * priceData.usdPrice
            tempData[i].accountList[j].depositedValue = calculatedValue
            tempData[i].accountList[j].depositedValueString = '$' + calculatedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })
            ownerOverallAccountDepositedTotalValue += calculatedValue

            tempData[i].accountList[j].newBorrowedAmount = Number((tempData[i].accountList[j].borrowedAmount +
            newInterestAccruedAmount).toFixed(decimalAmount))
            tempData[i].accountList[j].newBorrowedAmountString = tempData[i].accountList[j].newBorrowedAmount.toFixed(decimalAmount)
            //Calculate Borrowed Value
            calculatedValue = tempData[i].accountList[j].newBorrowedAmount * priceData.usdPrice
            tempData[i].accountList[j].borrowedValue = calculatedValue
            tempData[i].accountList[j].borrowedValueString = '$' + calculatedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })
            ownerOverallAccountBorrowedTotalValue += calculatedValue

            //Calculate Repaid Value
            calculatedValue = tempData[i].accountList[j].repaidAmount * priceData.usdPrice
            tempData[i].accountList[j].repaidValue = calculatedValue
            tempData[i].accountList[j].repaidValueString = '$' + calculatedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })
            ownerOverallAccountRepaidTotalValue += calculatedValue

            //Calculate Liquidator Value
            calculatedValue = tempData[i].accountList[j].liquidatorAmount * priceData.usdPrice
            tempData[i].accountList[j].liquidatorValue = calculatedValue
            tempData[i].accountList[j].liquidatorValueString = '$' + calculatedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })
            ownerOverallAccountLiquidatorTotalValue += calculatedValue

            //Calculate Liquidated Value
            calculatedValue = tempData[i].accountList[j].liquidatedAmount * priceData.usdPrice
            tempData[i].accountList[j].liquidatedValue = calculatedValue
            tempData[i].accountList[j].liquidatedValueString = '$' + calculatedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })
            ownerOverallAccountLiquidatedTotalValue += calculatedValue

            //Calculate Health Factor
            const ownerAddressString = tempData[i].owner
            const ownerAccountIndexString = tempData[i].accountList[j].accountIndex.toString()
            const depositedValue = tempData[i].accountList[j].depositedValue
            const borrowedValue = tempData[i].accountList[j].borrowedValue
            var healthFactor

            if(depositedValue != 0)
            {
              healthFactor = ((depositedValue * 0.8 - borrowedValue)/(depositedValue * 0.8)) * 100
              if(healthFactor < 0)
                healthFactor = 0
            }
            else if(borrowedValue == 0)
              healthFactor = 100
            else
              healthFactor = 0

            const currentAccountHealthFactor = tempHealthFactorHashMap.get(ownerAddressString + ownerAccountIndexString)
            if(currentAccountHealthFactor)
            {
              const newDepositedValue = depositedValue + currentAccountHealthFactor.depositValue
              const newBorrowedValue = borrowedValue + currentAccountHealthFactor.borrowValue
              currentAccountHealthFactor.depositValue = newDepositedValue
              currentAccountHealthFactor.borrowValue = newBorrowedValue

              if(newDepositedValue != 0)
              {
                currentAccountHealthFactor.healthFactor = ((newDepositedValue * 0.8 - newBorrowedValue)/(newDepositedValue * 0.8)) * 100
                if(currentAccountHealthFactor.healthFactor < 0)
                  currentAccountHealthFactor.healthFactor = 0
              }
              else if(newBorrowedValue == 0)
                currentAccountHealthFactor.healthFactor = 100
              else
                currentAccountHealthFactor.healthFactor = 0

              tempHealthFactorHashMap.set(ownerAddressString + ownerAccountIndexString, currentAccountHealthFactor)
            }
            else
            {
              const newHealthFactor: HealthFactor = {depositValue: depositedValue, borrowValue: borrowedValue, healthFactor: healthFactor}
              tempHealthFactorHashMap.set(ownerAddressString + ownerAccountIndexString, newHealthFactor)
            }
          }
        }

        //Run through owner's accounts again to set Liquidatable State
        for(var j=0; j<tempData[i].accountList.length; j++)
        {
          const ownerAddressString = tempData[i].owner
          const ownerAccountIndexString = tempData[i].accountList[j].accountIndex.toString()
          const healthFactor = tempHealthFactorHashMap.get(ownerAddressString + ownerAccountIndexString)

          if(healthFactor)
          {
            tempData[i].accountList[j].healthFactor = healthFactor.healthFactor

            if(healthFactor.healthFactor <= 70)
            {
              tempData[i].healthFactorCaution = true

              //Used for sorting liquidatable Column
              if(tempData[i].liquidatableColorStep < 1) //This is checking all of the accounts under one public key
                tempData[i].liquidatableColorStep = 1
            }

            if(healthFactor.healthFactor == 0)
            {
              tempData[i].liquidatable = true

              //Used for sorting liquidatable Column
              if(tempData[i].liquidatableColorStep < 2) //This is checking all of the accounts under one public key
                tempData[i].liquidatableColorStep = 2
            }
          }
        }

        //Set Total Interest Earned Value
        tempData[i].interestEarnedValue = ownerOverallAccountInterestEarnedTotalValue
        tempData[i].interestEarnedValueString = '$' + ownerOverallAccountInterestEarnedTotalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

        //Set Total Interest Accrued Value
        tempData[i].interestAccruedValue = ownerOverallAccountInterestAccruedTotalValue
        tempData[i].interestAccruedValueString = '$' + ownerOverallAccountInterestAccruedTotalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

        //Set Total Deposited Value
        tempData[i].depositedValue = ownerOverallAccountDepositedTotalValue
        tempData[i].depositedValueString = '$' + ownerOverallAccountDepositedTotalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

        //Set Total Borrowed Value
        tempData[i].borrowedValue = ownerOverallAccountBorrowedTotalValue
        tempData[i].borrowedValueString = '$' + ownerOverallAccountBorrowedTotalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

        //Set Total Repaid Value
        tempData[i].repaidValue = ownerOverallAccountRepaidTotalValue
        tempData[i].repaidValueString = '$' + ownerOverallAccountRepaidTotalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

        //Set Total Liquidator Value
        tempData[i].liquidatorValue = ownerOverallAccountLiquidatorTotalValue
        tempData[i].liquidatorValueString = '$' + ownerOverallAccountLiquidatorTotalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

        //Set Total Liquidated Value
        tempData[i].liquidatedValue = ownerOverallAccountLiquidatedTotalValue
        tempData[i].liquidatedValueString = '$' + ownerOverallAccountLiquidatedTotalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })
      }

      healthFactorHashMap = tempHealthFactorHashMap

      //Update HealthFactor Popover if it's open
      if(viewPortfolioPopoverOpen.value)
      {
        const healthFactor = healthFactorHashMap.get(event.value.owner + event.value.accountIndex)
        if(healthFactor)
        {
          healthFactorPopUpDepositedValue.value = healthFactor.depositValue
          healthFactorPopUpBorrowedValue.value = healthFactor.borrowValue
        }
      }

      totalNumberOfTopRows = topRowCount
      totalNumberOfSubRows = subRowCount
      tableData.value = tempData

      if(isLoading.value)
        isLoading.value = false
    }
  }

  function updateLeaderBoardDisplayNames()
  {
    if(tableData.value == undefined)
      return

    for(var i=0; i<tableData.value.length; i++)
      tableData.value[i].displayName = getCustomOrTrimmedUserDisplayName(tableData.value[i].owner)
  }

  function updateLeaderBoardAccountNames()
  {
    if(tableData.value == undefined)
      return

    for(var i=0; i<tableData.value.length; i++)
      for(var j=0; j<tableData.value[i].accountList.length; j++)
      {
        const lendingUserAccount = lendingUserHashMap.map.get(tableData.value[i].owner + tableData.value[i].accountList[j].accountIndex.toString())
        tableData.value[i].accountList[j].accountName = lendingUserAccount.accountName
      }
  }

  function sortTable()
  {
    if(tableData.value == undefined)
      return

    // Grab the current direction from PrimeVue (1 for Ascending, -1 for Descending)
    const order = sortOrder.value === 1 ? 1 : -1

    const tieBreaker = (a: any, b: any) =>
    {
      const idA = a.owner
      const idB = b.owner
      
      // Multiplying by 'order' ensures the tied rows also flip completely backwards
      return idA.localeCompare(idB) * order
    }

    switch(sortField.value)
    {
      case"displayName":
      {
        tableData.value = tableData.value.sort((a: any, b: any) =>
        {
          return a.displayName.localeCompare(b.displayName) * order
        })
        setRankingColumn(true)
        break
      }
      case "depositedValue":
      {
        tableData.value = tableData.value.sort((a: any, b: any) =>
        {
          if(a.depositedValue === b.depositedValue)
            return tieBreaker(a, b)
            
          return (a.depositedValue - b.depositedValue) * order
        })
        setRankingColumn()
        break
      }
      case "interestEarnedValue":
      {
        tableData.value = tableData.value.sort((a: any, b: any) =>
        {
          if(a.interestEarnedValue === b.interestEarnedValue)
            return tieBreaker(a, b)
            
          return (a.interestEarnedValue - b.interestEarnedValue) * order
        })
        setRankingColumn()
        break
      }
      case "interestAccruedValue":
      {
        tableData.value = tableData.value.sort((a: any, b: any) =>
        {
          if(a.interestAccruedValue === b.interestAccruedValue)
            return tieBreaker(a, b)
            
          return (a.interestAccruedValue - b.interestAccruedValue) * order
        })
        setRankingColumn()
        break
      }
      case "borrowedValue":
      {
        tableData.value = tableData.value.sort((a: any, b: any) =>
        {
          if(a.borrowedValue === b.borrowedValue)
            return tieBreaker(a, b)
            
          return (a.borrowedValue - b.borrowedValue) * order
        })
        setRankingColumn()
        break
      }
      case "repaidValue":
      {
        tableData.value = tableData.value.sort((a: any, b: any) =>
        {
          if(a.repaidValue === b.repaidValue)
            return tieBreaker(a, b)
            
          return (a.repaidValue - b.repaidValue) * order
        })
        setRankingColumn()
        break
      }
      case "liquidatorValue":
      {
        tableData.value = tableData.value.sort((a: any, b: any) =>
        {
          if(a.liquidatorValue === b.liquidatorValue)
            return tieBreaker(a, b)
            
          return (a.liquidatorValue - b.liquidatorValue) * order
        })
        setRankingColumn()
        break
      }
      case "liquidatedValue":
      {
        tableData.value = tableData.value.sort((a: any, b: any) =>
        {
          if(a.liquidatedValue === b.liquidatedValue)
            return tieBreaker(a, b)
            
          return (a.liquidatedValue - b.liquidatedValue) * order
        })
        setRankingColumn()
        break
      }
      case "liquidatableColorStep":
      {
        tableData.value = tableData.value.sort((a: any, b: any) =>
        {
          if(a.liquidatableColorStep === b.liquidatableColorStep)
            return tieBreaker(a, b)
            
          return (a.liquidatableColorStep - b.liquidatableColorStep) * order
        })
        setRankingColumn()
        break
      }
      default:
      {
        tableData.value = tableData.value.sort((a: any, b: any) =>
        {
          if(a.depositedValue === b.depositedValue)
            return tieBreaker(a, b)
            
          return (a.depositedValue - b.depositedValue) * order
        })
        setRankingColumn()
        break
      }
    }
  }

  function handleSort(event: any)
  {
    if(previousSortField != sortField.value)
      setTimeout(() =>
      {
        sortOrder.value = event.sortField == "displayName" ? 1 : -1
        previousSortField = event.sortField
      }, 0)

    setTimeout(() =>
    {
      sortTable()
    }, 0)
  }

  function setRankingColumn(reverse = false)
  {
    if(tableData.value == undefined)
      return

    const total = tableData.value.length
    var tempTable = cloneDeep(tableData.value)

    for(var i=0; i<total; i++)
    {
      //If the table is Ascending (reversed from default), count backwards
      const isAscending = sortOrder.value === 1
      tempTable[i].ranking = (isAscending === reverse) ? i + 1 : total - i
    }

    tableData.value = tempTable
  }

  function calculateTokenReserveInterestChangeIndex(timeStamp: number)
  {
    if(!tokenReservesHashMapCopy)
      return

    for (const tokenReserve of tokenReservesHashMapCopy.values())
    {
      if(timeStamp == 0)
      {
        tokenReserve.newSupplyInterestChangeIndex = Number(tokenReserve.supplyInterestChangeIndex)
        tokenReserve.newBorrowInterestChangeIndex = Number(tokenReserve.borrowInterestChangeIndex)
      }
      else
      {
        //Token Reserve Supply Interest Index = Old Supply Interest Index * Taylor Series 4th Order Interest Calculation: e^x = 1 + x + (x^2 / 2!) + (x^3 / 3!) + (x^4 / 4!)
        const oldTime = Number(tokenReserve.lastLendingActivityTimeStamp)
        const changeInTime = timeStamp - oldTime
        const supplyApy = tokenReserve.supplyApy / 10000 //convert from fixed point to decimal
        const borrowApy = tokenReserve.borrowApy / 10000 //convert from fixed point to decimal
        const supplyCompoundingFactor = getCompoundingFactor(supplyApy, changeInTime)
        const borrowCompoundingFactor = getCompoundingFactor(borrowApy, changeInTime)

        tokenReserve.newSupplyInterestChangeIndex = Number(tokenReserve.supplyInterestChangeIndex) * supplyCompoundingFactor
        tokenReserve.newBorrowInterestChangeIndex = Number(tokenReserve.borrowInterestChangeIndex) * borrowCompoundingFactor
      }
    }
  }

  function calculateUserNewInterestEarnedAmount(leaderBoardAccountDataRow: any)
  {
    if(!tokenReservesHashMapCopy)
      return

    const tokenReserve = tokenReservesHashMapCopy.get(leaderBoardAccountDataRow.tokenId)
    const subMarket = subMarketsHashMap.map.get(leaderBoardAccountDataRow.tokenId.toString() +
    leaderBoardAccountDataRow.subMarketOwnerAddress +
    leaderBoardAccountDataRow.subMarketIndex)
    const userBalance = leaderBoardAccountDataRow.depositedAmount
    const lendingUserTabAccount = cloneDeep(lendingUserTabAccountsHashMap.map.get(leaderBoardAccountDataRow.tokenId.toString() +
    leaderBoardAccountDataRow.subMarketOwnerAddress +
    leaderBoardAccountDataRow.subMarketIndex +
    leaderBoardAccountDataRow.owner +
    leaderBoardAccountDataRow.accountIndex))

    if(Number(lendingUserTabAccount.supplyInterestChangeIndex) == 0)
      lendingUserTabAccount.supplyInterestChangeIndex = tokenReserve.newSupplyInterestChangeIndex

    //User New Balance Before Fee = Old Balance * Token Reserve Earned Interest Index / User Earned Interest Index
    //Interest Earned Before Fee = New Balance Before Fee - Old Balance
    //Interest Earned After Fee = Interest Earned Before Fee - (Interest Earned Before Fee * SubMarket Fee Rate)
    //User New Balance After Fee = Old Balance + Interest Earned After Fee
    //Calculate interest earned
    var subMarketFee
    var solvencyInsuranceFee
    if(subMarket.feeOnInterestEarnedRate + tokenReserve.solvencyInsuranceFeeRate <= 100)
    {
      subMarketFee = subMarket.feeOnInterestEarnedRate
      solvencyInsuranceFee = tokenReserve.solvencyInsuranceFeeRate
    }
    else
    {
      solvencyInsuranceFee = tokenReserve.solvencyInsuranceFeeRate
      subMarketFee = 100 - tokenReserve.solvencyInsuranceFeeRate
    }

    const newBalanceBeforeFee = (userBalance * tokenReserve.newSupplyInterestChangeIndex / Number(lendingUserTabAccount.supplyInterestChangeIndex))
    const interestEarnedBeforeFees = newBalanceBeforeFee - userBalance
    var interestEarnedAfterFees = interestEarnedBeforeFees - (interestEarnedBeforeFees * subMarketFee / 100) - (interestEarnedBeforeFees * solvencyInsuranceFee / 100)
    
    const decimalAmount = tokenDecimalHashMap.get(leaderBoardAccountDataRow.tokenId)
    interestEarnedAfterFees = Number(interestEarnedAfterFees.toFixed(decimalAmount))
    
    return interestEarnedAfterFees
  }

  function calculateUserNewInterestAccruedAmount(leaderBoardAccountDataRow: any)
  {
    if(!tokenReservesHashMapCopy)
      return

    const tokenReserve = tokenReservesHashMapCopy.get(leaderBoardAccountDataRow.tokenId)
    const userDebt = leaderBoardAccountDataRow.borrowedAmount
    const lendingUserTabAccount = cloneDeep(lendingUserTabAccountsHashMap.map.get(leaderBoardAccountDataRow.tokenId.toString() +
    leaderBoardAccountDataRow.subMarketOwnerAddress +
    leaderBoardAccountDataRow.subMarketIndex +
    leaderBoardAccountDataRow.owner +
    leaderBoardAccountDataRow.accountIndex))

    if(Number(lendingUserTabAccount.borrowInterestChangeIndex) == 0)
      lendingUserTabAccount.borrowInterestChangeIndex = tokenReserve.newBorrowInterestChangeIndex
    //User New Balance Before Fee = Old Balance * Token Reserve Earned Interest Index / User Earned Interest Index
    //Interest Earned Before Fee = New Balance Before Fee - Old Balance
    //Interest Earned After Fee = Interest Earned Before Fee - (Interest Earned Before Fee * SubMarket Fee Rate)
    //User New Balance After Fee = Old Balance + Interest Earned After Fee
    //Calculate interest earned
    const newDebt = (userDebt * tokenReserve.newBorrowInterestChangeIndex / Number(lendingUserTabAccount.borrowInterestChangeIndex))
    const interestAccrued = newDebt - userDebt

    return interestAccrued
  }

  function stopTimeStampInterval()
  {
    if(timeStampIntervalId != undefined)
    {
      clearInterval(timeStampIntervalId)
      timeStampIntervalId = undefined
    }
  }

  

  function openOwnerPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.owner = rowData.owner

    ownerPopoverOpen.value = true
  }

  function closeOwnerPopover(e: Event) 
  {
    event.value = e
    ownerPopoverOpen.value = false
  }

  function passByRefWrapperCopyAddress()
  {
    copyAddress(copyFullAddressButtonText, event.value.owner)
  }

  function openTokenPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.tokenMintAddressString = tokenIdHashMap.map.get(rowData.tokenId)
    event.value.trimmedSubMarketOwnerAddress = rowData.trimmedSubMarketOwnerAddress
    event.value.subMarketIndex = rowData.subMarketIndex

    tokenPopoverOpen.value = true
  }

  function closeTokenPopover(e: Event) 
  {
    event.value = e
    tokenPopoverOpen.value = false
  }

  function passByRefWrapperCopyTokenMintAddress()
  {
    copyAddress(copyTokenMintAddressButtonText, event.value.tokenMintAddressString)
  }

  function openViewPortfolioPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.owner = rowData.owner
    event.value.accountIndex = rowData.accountIndex
    event.value.healthFactor = rowData.healthFactor

    const healthFactor = healthFactorHashMap.get(rowData.owner + rowData.accountIndex)
    if(healthFactor)
    {
      healthFactorPopUpDepositedValue.value = healthFactor.depositValue
      healthFactorPopUpBorrowedValue.value = healthFactor.borrowValue
    }

    viewPortfolioPopoverOpen.value = true
  }

  function openSelectedPortfolio()
  {
    if(event.value.owner == connectedWallet.addressString)
    {
      connectedWallet.selectedLendingUserAccountIndex = event.value.accountIndex
      localStorage.setItem("selectedLendingAccountIndex" + connectedWallet.addressString, event.value.accountIndex.toString())
    }

    //Closes popover
    viewPortfolioPopoverOpen.value = false

    //Need this delay so that the popover has time to close before emitting
    setTimeout(() =>
    {
      emits("viewPortfolio", event.value.owner, event.value.accountIndex)
    }, 100) 
  }

  const filters = ref(
  {
    global: { value: undefined, matchMode: FilterMatchMode.CONTAINS }
  })

  function exportCSV(e: Event) 
  {
    tableRef.value.exportCSV()
  }

  const expandSubTables = () => 
  {
    subTableData.value = tableData.value.reduce((acc: { [x: string]: boolean }, p: { ranking: string | number }) => (acc[p.ranking] = true) && acc, {})
  }
</script>

<style scoped>
  ion-input
  {
    --highlight-color: var(--ion-color-green)
  }
  
  #lendingLeaderBoardTable :deep(th)
  {
    font-size: min(4vw, 12.5px)
  }
  
  #lendingLeaderBoardTable :deep(.p-datatable-tbody > tr)
  {
    height: 75px
  }

  /*Set row height to higest possible value*/
  #lendingLeaderBoardInnerTable :deep(.p-datatable-tbody > tr)
  {
    height: 64px;
  }

  #lendingLeaderBoardInnerTable :deep(th)
  {
    font-size: min(4vw, 10px)
  }

  #lendingLeaderBoardInnerTable :deep(td)
  {
    font-size: min(4vw, 11px)
  }

  .popoverWidth::part(content)
  {
    width: 280px
  }

  .tableMinWidth
  {
    min-width:1684px
  }
</style>