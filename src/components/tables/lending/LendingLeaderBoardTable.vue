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
      @row-expand="handleRowExpand($event)"
      @row-collapse="handleRowCollapse($event)"
      :globalFilterFields="
      [
        'ranking',
        'id',
        'displayName',
        'owner',
        'depositedValueString',
        'interestEarnedValueString',
        'borrowedValueString',
        'repaidValueString',
        'liquidatorValueString',
        'liquidatedValueString',
        'accountListWithLastestMonthlyStatement.accountName'
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

          <ion-button fill="clear" @click="expandSubTables(); $emit('setLeaderBoardSubTableAndSubRowCount', totalNumberOfTopRows, totalNumberOfSubRows)">
            <ion-label  color="dark">Expand Users</ion-label>
          </ion-button>

          <ion-button fill="clear" @click="exportCSV($event)">
            <ion-label color="dark">Export</ion-label><ion-icon :src="download" color="dark"></ion-icon>
          </ion-button>

          <ion-button fill="clear" @click="subTableData={}; $emit('setLeaderBoardSubTableAndSubRowCount', 0, 0)">
            <ion-label  color="dark">Collapse Users</ion-label>
          </ion-button>
        </div>
      </template>
      <template #loading> Loading Lending Leader Board. Please Wait. </template>
      <Column expander style="width: 0%"/>
      <Column field="ranking" header="Ranking" style="width: 0%"></Column>
      <Column field="displayName" header="User" style="width: 0%" sortable>
        <template #body="slotProps">
          <ion-button fill="clear" style="margin: 0px; margin-left: -15px" @click="openOwnerPopover($event, slotProps.data)">
            <div class="flexCenterRowHeight">
              <div class="smallMarginLeft" >
                <div v-if=" slotProps.data.owner==adminAccounts.lendingCEOAddressString">
                  <RIPKingStarWolf v-if="adminAccounts.ceoIsDead && slotProps.data.ranking==1" class="starWolfButton" style="margin-left: -7px; margin-right: -5px"/>
                  <RIPStarWolf v-else-if="adminAccounts.ceoIsDead" class="starWolfButton" :fill="slotProps.data.ranking==1 ? '#ffd700' :
                  slotProps.data.ranking == 2 ? '#b5bbcad3' :
                  slotProps.data.ranking == 3 ? '#a77822' : colorHexValue"/>
                  <KingStarWolf v-else-if="slotProps.data.ranking==1" class="starWolfButton" style="margin-left: -7px; margin-right: -5px"/>
                  <StarWolf v-else class="starWolfButton" :fill="slotProps.data.ranking == 2 ? '#b5bbcad3' :
                  slotProps.data.ranking == 3 ? '#a77822' : colorHexValue"/>
                </div>
                <div v-else>
                  <KingStarWolf v-if="slotProps.data.ranking==1" class="starWolfButton" style="margin-left: -7px; margin-right: -5px"/>
                  <StarWolf v-else class="starWolfButton" :fill="slotProps.data.ranking == 2 ? '#b5bbcad3' :
                  slotProps.data.ranking == 3 ? '#a77822' :
                  darkTheme.value ? '#FFFFFF' : '#000000'"/>
                </div>
              </div>

              <ion-label v-if="slotProps.data.owner!=adminAccounts.lendingCEOAddressString" color="dark" class="noWrapText">{{ slotProps.data.displayName }}</ion-label>
              <ion-label v-else color="green" class="noWrapText">fdr-3</ion-label>
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
      <template #expansion="slotProps">
        <DataTable id="lendingLeaderBoardInnerTable" :value="slotProps.data.accountListWithLastestMonthlyStatement" style="font-size: 5px">
          <Column field="accountName" header="Account" style="width: 0%" sortable>
            <template #body="slotProps">
              <ion-button fill="clear" @click="openViewPortfolioPopover($event, slotProps.data)">
                <ion-label color="dark" class="noWrapText nMediumSmallMarginLeft" style="font-size: 11px">{{ slotProps.data.accountName }}</ion-label>
              </ion-button>
              <ion-popover
              :is-open="viewPortfolioPopoverOpen" 
              :event="event" 
              @didDismiss="viewPortfolioPopoverOpen=false"
              side="top" 
              size="cover"
              alignment="center"
              >
                <ion-button class="copyAddressButton thinBorder" fill="clear" @click="openSelectedPortfolio()" @mouseleave="closeViewPortfolioPopover($event)">
                  <ion-label color="green">View</ion-label>
                </ion-button>
              </ion-popover>
            </template>
          </Column>
          <Column field="tokenName" header="Market" style="width: 0%" sortable>
            <template #body="slotProps">
              <div class="">
                <ion-button fill="clear" class="marginZero" @click="openTokenPopover($event, slotProps.data)">
                  <img v-if="slotProps.data.tokenMintAddress==tokenAddressStrings.solTokenMintAddress" style="width: 40px; height: 32px; margin-left: -17px; margin-right: -5px" src="https://2yhveg6ijh.ufs.sh/f/ePibqLYvGazNK556N4bl1PJwYXusWpUSNEyfCRGd6HjzKB48"/>
                  <Component v-else style="width: 32px; height: 28px; margin-left: -17px" :is="slotProps.data.tokenSVG"></Component>
                  <ion-label class="noWrapText" color="dark" style="font-size: 10px">{{ slotProps.data.tokenName }}</ion-label>
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
          <Column field="interestEarnedAmount" style="width: 0%" class="rainbowText" sortable>
            <template #header>
              <span class="rainbowText">Interest Earned Amount</span>
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
          <Column field="interestAccruedAmount" style="width: 0%" class="poopText" sortable>
            <template #header>
              <span class="poopText">Interest Accrued Amount</span>
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
          <Column field="depositedAmount" header="Deposited Amount" style="width: 0%" :style="{color: colorHexValue}" sortable></Column>
          <Column field="depositedValue" header="Deposited Value" style="width: 0%" :style="{color: colorHexValue}" sortable>
            <template #body="slotProps">
              {{ slotProps.data.depositedValueString }}
            </template>
          </Column>
          <Column field="borrowedAmount" header="Borrowed Amount" style="width: 0%; color: #557fcc" sortable></Column>
          <Column field="borrowedValue" header="Borrowed Value" style="width: 0%; color: #557fcc" sortable>
            <template #body="slotProps">
              {{ slotProps.data.borrowedValueString }}
            </template>
          </Column>
          <Column field="repaidAmount" header="Repaid Amount" style="width: 0%; color: #ffd700" sortable></Column>
          <Column field="repaidValue" header="Repaid Value" style="width: 0%; color: #ffd700" sortable>
            <template #body="slotProps">
              {{ slotProps.data.repaidValueString }}
            </template>
          </Column>
          <Column field="liquidatorAmount" header="Liquidator Amount" style="width: 0%; color: #8a2be2" sortable></Column>
          <Column field="liquidatorValue" header="Liquidator Value" style="width: 0%; color: #8a2be2" sortable>
            <template #body="slotProps">
              {{ slotProps.data.liquidatorValueString }}
            </template>
          </Column>
          <Column field="liquidatedAmount" header="Liquidated Amount" style="width: 0%; color: red" sortable></Column>
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
  import { ref, onMounted, watch, inject, type Component, markRaw } from 'vue'
  import { IonLabel, IonIcon, IonInput, IonButton, IonPopover, IonText } from '@ionic/vue'
  import { search, download } from 'ionicons/icons'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import StarWolf from '/src/assets/svg/star-wolf-svg.vue'
  import RIPStarWolf from '/src/assets/svg/rip-star-wolf-svg.vue'
  import KingStarWolf from '/src/components/fancy/KingStarWolf.vue'
  import RIPKingStarWolf from '/src/components/fancy/rip/RIPKingStarWolf.vue' 
  import { FilterMatchMode } from '@primevue/core/api'
  import { lendingLeaderBoardTable, lendingUserHashMap } from '/src/assets/globalStates/lending/LendingUsers.vue'
  import { priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { copyFullAddress, copyTokenMintAddress } from '/src/assets/contracts/WalletHelper.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
  import { tokenAddressStrings } from '/src/assets/constants/Addresses.ts'
  import { customUserNameHashMap }  from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import InfoButton from '/src/components/help/InfoButton.vue'
  import cloneDeep from 'lodash/cloneDeep'

  const emits = defineEmits(['viewPortfolio', 'totalLeaderBoardLendingUsers', 'setLeaderBoardSubTableAndSubRowCount', 'adjustLeaderBoardSubTableAndSubRowCount'])

  const colorHexValue = inject('colorHexValue') as string
  
  var tableRef = ref()
  var tableData = ref()
  var subTableData = ref()
  var isLoading = ref(true)
  var previousSortField = "depositedValue"
  var sortField = ref("depositedValue")
  var sortOrder = ref(-1)
  var totalNumberOfTopRows = 0
  var totalNumberOfSubRows = 0

  const lendingLeaderBoardInfoMSG = "You can copy a User's\naddress by clicking on\nthem.\nYou can view an Account by\nclicking on them.\n\nInterest earned and\naccrued is updated in the\ntable after a user updates\ntheir snap shots or does\nany lending activity, IE:\ndepositing, repaying, etc."

  var event = ref()
  var viewPortfolioPopoverOpen = ref(false)
  var ownerPopoverOpen = ref(false)
  var copyFullAddressButtonText = ref("Copy Full Address")
  var tokenPopoverOpen = ref(false)
  var copyTokenMintAddressButtonText = ref("Copy Token Mint Address")

  onMounted(() =>
  {
    subTableData.value = {}

    if(lendingLeaderBoardTable.data)
    {
      updateLeaderBoardValues()
      updateLeaderBoardDisplayNames()

      if(lendingUserHashMap.map)
        updateLeaderBoardAccountNames()

      sortTable()
      emits('totalLeaderBoardLendingUsers', totalNumberOfTopRows)
    }
    else
      emits('totalLeaderBoardLendingUsers', 0)
  })

  watch(lendingLeaderBoardTable,() =>
  {
    updateLeaderBoardValues()
    sortTable()

    emits('totalLeaderBoardLendingUsers', totalNumberOfTopRows)
    const openedSubTables = Object.keys(subTableData.value).length
    const visibleSubRowCount = getVisibleSubRowCount()
    emits('setLeaderBoardSubTableAndSubRowCount', openedSubTables, visibleSubRowCount)
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

  function updateLeaderBoardValues(newTableData = true)
  {
    var tempData

    if(!newTableData)
    {
      if(!tableData.value)
        return

      tempData = tableData.value //Copy existing table when updating prices with no new data
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

      for(var i=0; i<tempData.length; i++)
      {
        var userAccountInterestEarnedTotalValue = 0
        var userAccountInterestAccruedTotalValue = 0
        var userAccountDepositedTotalValue = 0
        var userAccountBorrowedTotalValue = 0
        var userAccountRepaidTotalValue = 0
        var userAccountLiquidatorTotalValue = 0
        var userAccountLiquidatedTotalValue = 0
        topRowCount += 1

        for(var j=0; j<tempData[i].accountListWithLastestMonthlyStatement.length; j++)
        {
          var calculatedValue = 0
          subRowCount += 1

          const priceData = priceObjectMap.data[tempData[i].accountListWithLastestMonthlyStatement[j].tokenMintAddress]
          if(priceData)
          {
            //Remarking SVG Raw to preview overhead and warnings
            tempData[i].accountListWithLastestMonthlyStatement[j].tokenSVG = markRaw(tempData[i].accountListWithLastestMonthlyStatement[j].tokenSVG)

            //Calculate Interest Earned Value
            calculatedValue = (tempData[i].accountListWithLastestMonthlyStatement[j].interestEarnedAmount * priceData.usdPrice)
            tempData[i].accountListWithLastestMonthlyStatement[j].interestEarnedValue = calculatedValue
            tempData[i].accountListWithLastestMonthlyStatement[j].interestEarnedValueString = '$' + calculatedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })
            userAccountInterestEarnedTotalValue += calculatedValue

            //Calculate Interest Accrued Value
            calculatedValue = (tempData[i].accountListWithLastestMonthlyStatement[j].interestAccruedAmount * priceData.usdPrice)
            tempData[i].accountListWithLastestMonthlyStatement[j].interestAccruedValue = calculatedValue
            tempData[i].accountListWithLastestMonthlyStatement[j].interestAccruedValueString = '$' + calculatedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })
            userAccountInterestAccruedTotalValue += calculatedValue

            //Calculate Deposited Value
            calculatedValue = (tempData[i].accountListWithLastestMonthlyStatement[j].depositedAmount * priceData.usdPrice)
            tempData[i].accountListWithLastestMonthlyStatement[j].depositedValue = calculatedValue
            tempData[i].accountListWithLastestMonthlyStatement[j].depositedValueString = '$' + calculatedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })
            userAccountDepositedTotalValue += calculatedValue

            //Calculate Borrowed Value
            calculatedValue = (tempData[i].accountListWithLastestMonthlyStatement[j].borrowedAmount * priceData.usdPrice)
            tempData[i].accountListWithLastestMonthlyStatement[j].borrowedValue = calculatedValue
            tempData[i].accountListWithLastestMonthlyStatement[j].borrowedValueString = '$' + calculatedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })
            userAccountBorrowedTotalValue += calculatedValue

            //Calculate Repaid Value
            calculatedValue = (tempData[i].accountListWithLastestMonthlyStatement[j].repaidAmount * priceData.usdPrice)
            tempData[i].accountListWithLastestMonthlyStatement[j].repaidValue = calculatedValue
            tempData[i].accountListWithLastestMonthlyStatement[j].repaidValueString = '$' + calculatedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })
            userAccountRepaidTotalValue += calculatedValue

            //Calculate Liquidator Value
            calculatedValue = (tempData[i].accountListWithLastestMonthlyStatement[j].liquidatorAmount * priceData.usdPrice)
            tempData[i].accountListWithLastestMonthlyStatement[j].liquidatorValue = calculatedValue
            tempData[i].accountListWithLastestMonthlyStatement[j].liquidatorValueString = '$' + calculatedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })
            userAccountLiquidatorTotalValue += calculatedValue

            //Calculate Liquidated Value
            calculatedValue = (tempData[i].accountListWithLastestMonthlyStatement[j].liquidatedAmount * priceData.usdPrice)
            tempData[i].accountListWithLastestMonthlyStatement[j].liquidatedValue = calculatedValue
            tempData[i].accountListWithLastestMonthlyStatement[j].liquidatedValueString = '$' + calculatedValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 })
            userAccountLiquidatedTotalValue += calculatedValue
          }
        }

        //Set Total Interest Earned Value
        tempData[i].interestEarnedValue = userAccountInterestEarnedTotalValue
        tempData[i].interestEarnedValueString = '$' + userAccountInterestEarnedTotalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

        //Set Total Interest Accrued Value
        tempData[i].interestAccruedValue = userAccountInterestAccruedTotalValue
        tempData[i].interestAccruedValueString = '$' + userAccountInterestAccruedTotalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

        //Set Total Deposited Value
        tempData[i].depositedValue = userAccountDepositedTotalValue
        tempData[i].depositedValueString = '$' + userAccountDepositedTotalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

        //Set Total Borrowed Value
        tempData[i].borrowedValue = userAccountBorrowedTotalValue
        tempData[i].borrowedValueString = '$' + userAccountBorrowedTotalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

        //Set Total Repaid Value
        tempData[i].repaidValue = userAccountRepaidTotalValue
        tempData[i].repaidValueString = '$' + userAccountRepaidTotalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

        //Set Total Liquidator Value
        tempData[i].liquidatorValue = userAccountLiquidatorTotalValue
        tempData[i].liquidatorValueString = '$' + userAccountLiquidatorTotalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })

        //Set Total Liquidated Value
        tempData[i].liquidatedValue = userAccountLiquidatedTotalValue
        tempData[i].liquidatedValueString = '$' + userAccountLiquidatedTotalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })
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
      for(var j=0; j<tableData.value[i].accountListWithLastestMonthlyStatement.length; j++)
      {
        const lendingUserAccount = lendingUserHashMap.map.get(tableData.value[i].owner + tableData.value[i].accountListWithLastestMonthlyStatement[j].accountIndex.toString())
        tableData.value[i].accountListWithLastestMonthlyStatement[j].accountName = lendingUserAccount.accountName
      }
  }

  function sortTable()
  {
    if(tableData.value == undefined)
      return

    switch (sortField.value)
    {
      case"displayName":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => a.displayName.localeCompare(b.displayName))
        setRankingColumn(true)
        break
      }
      case "depositedValue":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.depositedValue - a.depositedValue)
        setRankingColumn()
        break
      }
      case "interestEarnedValue":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.interestEarnedValue - a.interestEarnedValue)
        setRankingColumn()
        break
      }
      case "borrowedValue":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.borrowedValue - a.borrowedValue)
        setRankingColumn()
        break
      }
      case "repaidValue":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.repaidValue - a.repaidValue)
        setRankingColumn()
        break
      }
      case "liquidatedValue":
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.liquidatedValue - a.liquidatedValue)
        setRankingColumn()
        break
      }
      default:
      {
        tableData.value = tableData.value.sort((a: any, b: any) => b.depositedValue - a.depositedValue)
        setRankingColumn()
        break
      }
    }
  }

  function setRankingColumn(reverse = false)
  {
    for(var i=0; i<tableData.value.length; i++)
      tableData.value[i].ranking = i + 1

    if(reverse)
      sortOrder.value = -1
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
    copyFullAddress(copyFullAddressButtonText, event.value.owner)
  }

  function openTokenPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.tokenMintAddress = rowData.tokenMintAddress
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
    copyTokenMintAddress(copyTokenMintAddressButtonText, event.value.tokenMintAddress)
  }

  function openViewPortfolioPopover(e: Event, rowData: any) 
  {
    event.value = e
    event.value.owner = rowData.owner
    event.value.accountIndex = rowData.accountIndex

    viewPortfolioPopoverOpen.value = true
  }

  //Used to close popover once user hovers over it and then moves away
  function closeViewPortfolioPopover(e: Event) 
  {
    //Need this delay so that emits("viewPortfolio") data doesn't get over ruled
    setTimeout(() =>
    {
      event.value = e
      viewPortfolioPopoverOpen.value = false
    }, 100)
  }

  function openSelectedPortfolio()
  {
    //Closes popover
    viewPortfolioPopoverOpen.value = false

    //Need this delay so that the popover has time to close before emitting
    setTimeout(() =>
    {
      emits("viewPortfolio", event.value.owner, event.value.accountIndex)
    }, 100) 
  }

  function handleSort(event: any)
  {
    if(previousSortField != sortField.value)
      setTimeout(() =>
      {
        sortOrder.value = event.sortOrder * -1
      }, 0)

    previousSortField = sortField.value

    sortTable()
  }

  function handleRowExpand(event: any)
  {
    emits("adjustLeaderBoardSubTableAndSubRowCount", 1, event.data.accountListWithLastestMonthlyStatement.length)
  }

  function handleRowCollapse(event: any)
  {
    emits("adjustLeaderBoardSubTableAndSubRowCount", -1, -event.data.accountListWithLastestMonthlyStatement.length)
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

  function getVisibleSubRowCount()
  {
    return tableData.value.reduce((total: number, row: any) =>
    {
      if(subTableData.value[row.ranking])
        return total + (row.accountListWithLastestMonthlyStatement?.length || 0)
    
      return total
    }, 0)
  }
</script>

<style scoped>
  ion-input
  {
    --highlight-color: var(--ion-color-green)
  }
  
  #lendingLeaderBoardTable :deep(th)
  {
    font-size: min(4vw, 13px)
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
    font-size: min(4vw, 13px)
  }

  .tableMinWidth
  {
    min-width:1664px
  }
</style>