<script lang="ts">
  import { reactive } from 'vue'

  export const subMarkets = reactive(
  {
    data: undefined,
    ownerCount: 0
  })

  //Key: TokenId + Owner Address + SubMarket Index, Value: Specific SubMarket
  export const subMarketsHashMap = reactive(
  {
    map: undefined
  })

  //Key: SubMarket Owner PublicKey, Value: List of SubMarket Accounts that the owner has
  export const subMarketOwnerHashMap = reactive(
  {
    map: undefined
  })

  //Key: SubMarket Owner PublicKey, Value: SubMarket Look Up Table Account of owner (All Submarkets that the owner creates should be added to their Look Up Table when the createSubMarket instruction is called)
  export const subMarketLookUpTableByOwnerHashMap = reactive(
  {
    map: undefined
  })

  //Key: TokenId+ SubMarket Owner PublicKey, Value: List of SubMarket Accounts that the owner has for a specific TokenMintAddress
  export const subMarketByTokenIdAndOwnerHashMap = reactive(
  {
    map: undefined
  })

  //Key: TokenId, Value: List of SubMarket Accounts for a specific Token Reserve
  export const tokenReserveSubMarketListHashMap = reactive(
  {
    map: undefined
  })

  export type SubMarketOwner = 
  {
    subMarketCount: number,
    ownerSubMarketList: Array<any>
  }

  export default subMarkets
</script>