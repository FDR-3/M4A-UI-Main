<script lang="ts">
  import { reactive } from 'vue'

  export const subMarkets = reactive(
  {
    data: undefined,
    ownerCount: 0
  })

  //Key: Token Mint Address + Owner Address + SubMarket Index, Value: Specific SubMarket
  export const subMarketsHashMap = reactive(
  {
    map: undefined
  })

  //Key: SubMarket Owner PublicKey, Value: List of SubMarket Accounts that the owner has
  export const subMarketOwnerHashMap = reactive(
  {
    map: undefined
  })

  //Key: SubMarket Owner PublicKey + TokenMintAddress, Value: List of SubMarket Accounts that the owner has for a specific TokenMintAddress
  export const subMarketOwnerByTokenMintAddressHashMap = reactive(
  {
    map: undefined
  })

  //Key: Token Mint Address, Value: List of SubMarket Accounts for a specific Token Reserve
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