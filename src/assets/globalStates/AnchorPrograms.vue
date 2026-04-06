<script lang="ts">
  import { reactive } from 'vue'
  import { PublicKey } from "@solana/web3.js"

  const newDate = new Date()

  export const monthList = 
  [
    {
      monthName: "January",
      monthNumber: 1
    },
    {
      monthName: "February",
      monthNumber: 2
    },
    {
      monthName: "March",
      monthNumber: 3
    },
    {
      monthName: "April",
      monthNumber: 4
    },
    {
      monthName: "May",
      monthNumber: 5
    },
    {
      monthName: "June",
      monthNumber: 6
    },
    {
      monthName: "July",
      monthNumber: 7
    },
    {
      monthName: "August",
      monthNumber: 8
    },
    {
      monthName: "September",
      monthNumber: 9
    },
    {
      monthName: "October",
      monthNumber: 10
    },
    {
      monthName: "November",
      monthNumber: 11
    },
    {
      monthName: "December",
      monthNumber: 12
    },
  ]

  export const anchorPrograms = reactive(
  {
    m4a: undefined,
    chat: undefined,
    lending: undefined,
    alert: undefined,
    secondsUntilDeadMansBreakTrips: 3_888_000, //86,400 seconds/day * 45 days = 3,888,000 seconds.
    deadMansBreakTimeStamp: 0,
    isDeadMansBreakTripped: false,
    hasWebSiteBeenUpdated: false,
    areM4AProtocolStatsReady: false,
    areChatQOLAccountsReady: false,
    isM4AProtocolReady: false,
    m4aProtocolInitiatorAddress: "",
    isChatProtocolReady: false,
    chatProtocolInitiatorAddress: "",
    isM4AChatReady: false,
    m4aChatInitiatorAddress: "",
    isPLIChatReady: false,
    pliChatInitiatorAddress: "",
    isAboutChatReady: false,
    aboutChatInitiatorAddress: "",
    //The Fee Token Mint Address has to be the correct value for mainnet or dev net for functions that require fees
    //usdcFeeTokenAddress: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),//Mainnet-beta USDC_MINT_ADDRESS
    usdcFeeTokenAddress: new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"),//Devnet USDC_MINT_ADDRESS
    isM4AFeeTokenAccountReady: false,
    isChatFeeTokenAccountReady: false,
    currentStatementMonthName: undefined, //monthList[newDate.getMonth()].monthName,
    currentStatementMonthNumber: undefined, //newDate.getMonth() + 1,
    currentStatementYear: undefined, //newDate.getFullYear(),
    blockChainTimeStamp: 0
  })

  export const blockChainData = reactive(
  { 
    timeStamp: 0
  })

  export const SYSTEM_PROGRAM_ADDRESS_STRING = "11111111111111111111111111111111"
  export const MAX_ACCOUNT_NAME_LENGTH = 25
  export const DEFAULT_3_PERCENT_FEE_SUBMARKET_INDEX = 0

  export default anchorPrograms
</script>