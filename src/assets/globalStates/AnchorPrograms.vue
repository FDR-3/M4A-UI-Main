<script lang="ts">
  import { reactive } from 'vue'
  import { PublicKey } from "@solana/web3.js"

  export const anchorPrograms = reactive(
  {
    m4a: undefined,
    chat: undefined,
    deadMan45DaysUnixNum: 3888000, //86,400 seconds/day * 45 days = 3,888,000 seconds.
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

  //#[cfg(feature = "mainnet")]
  //pub const USDC_MINT: Pubkey = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"); // USDC on Mainnet-beta

  //#[cfg(feature = "devnet")]
  //pub const USDC_MINT: Pubkey = pubkey!("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"); // USDC on Devnet

  //#[cfg(feature = "localhost")]
  //pub const USDC_MINT: Pubkey = pubkey!("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"); // USDC on Localhost

  export const SYSTEM_PROGRAM_ADDRESS_STRING = "11111111111111111111111111111111"

  export default anchorPrograms
</script>