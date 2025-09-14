<script lang="ts">
  import { reactive } from 'vue'
  import { PublicKey } from "@solana/web3.js"

  export const anchorPrograms = reactive(
  {
    m4a: undefined,
    chat: undefined,
    lending: undefined,
    secondsUntilDeadMansBreakTrips: 3888000, //86,400 seconds/day * 45 days = 3,888,000 seconds.
    deadMansBreakTimeStamp: 0,
    isDeadMansBreakTripped: false,
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
    isChatFeeTokenAccountReady: false
  })

  export const SYSTEM_PROGRAM_ADDRESS_STRING = "11111111111111111111111111111111"

  export default anchorPrograms
</script>