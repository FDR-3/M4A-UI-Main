<script lang="ts">
  import { reactive } from 'vue'

  export const subMarkets = reactive(
  {
    data: undefined,
    ownerCount: 0
  })

  //Key: SubMarket Owner PublicKey, Value: List of SubMarket Accounts that the owner has
  export const subMarketOwnerHashMap = reactive(
  {
    map: new Map<string, any>()
  })

  //Key: Token Mint Address, Value: List of SubMarket Accounts for a specific Token Mint Address
  export const tokenReserveHashMap = reactive(
  {
    map: new Map<string, any>()
  })

  export type SubMarketOwner = 
  {
    subMarketCount: number,
    ownerSubMarketList: Array<any>
  }

  export default subMarkets
</script>