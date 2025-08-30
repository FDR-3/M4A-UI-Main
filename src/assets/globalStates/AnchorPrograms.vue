<script lang="ts">
  import { reactive } from 'vue'
  import { PublicKey } from "@solana/web3.js"

  export const anchorPrograms = reactive(
  {
    m4a: undefined,
    chat: undefined,
    secondsUntilDeadMansBreakTrips: 3888000, //86,400 seconds/day * 45 days = 3,888,000 seconds.
    deadMansBreakTimeStamp: 0,
    isDeadMansBreakTripped: false,
    areM4AProtocolStatsReady: false,
    areChatQOLAccountsReady: false,
    isM4AProtocolReady: false,
    stateAccountTotal: 0,
    m4aProtocolInitiatorAddress: "",
    isChatProtocolReady: false,
    chatProtocolInitiatorAddress: "",
    isM4AChatReady: false,
    m4aChatInitiatorAddress: "",
    isPLIChatReady: false,
    pliChatInitiatorAddress: "",
    isAboutChatReady: false,
    aboutChatInitiatorAddress: "",
    usdcFeeTokenAddress: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    isM4AFeeTokenAccountReady: false,
    isChatFeeTokenAccountReady: false
  })

  //USDC_MINT_ADDRESS on Mainnet-beta "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  //USDC_MINT_ADDRESS on Devnet "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"

  export const SYSTEM_PROGRAM_ADDRESS_STRING = "11111111111111111111111111111111"

  export default anchorPrograms
</script>