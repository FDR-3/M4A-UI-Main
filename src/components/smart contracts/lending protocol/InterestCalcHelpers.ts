import { tokenReservesHashMap, tokenIdHashMap, priceObjectMap } from '/src/assets/globalStates/lending/TokenReserves.vue'
import { SECONDS_IN_A_YEAR, SECONDS_IN_A_WEEK } from '/src/assets/constants/TimeLengths.ts'

export function calculateNewBalance(
tokenReserve:any,
subMarket: any,
originalDepositedAmount: number,
userSupplyInterestChangeIndex: number,
timeStamp: number)
{
  //Token Reserve Supply Interest Index = Old Supply Interest Index * (1 + Supply APY * Δt/Seconds in a Year)
  const oldTime = Number(tokenReserve.lastLendingActivityTimeStamp)
  const changeInTime = timeStamp - oldTime
  const supplyApy = tokenReserve.supplyApy / 10000 //convert from fixed point to decimal

  const supplyCompoundingFactor = getCompoundingFactor(supplyApy, changeInTime)
  //const newSupplyInterestChangeIndex = Number(tokenReserve.supplyInterestChangeIndex) * (1 + supplyApy * changeInTime / SECONDS_IN_A_YEAR)
  const newSupplyInterestChangeIndex = Number(tokenReserve.supplyInterestChangeIndex) * supplyCompoundingFactor

  //For tab accounts initialized with no deposits, keeps from dividing by zero
  //For example, can happen to when claiming submarket fees in different destination submarket on new initial tab account
  //Or the Solvency Treasury might have zeros for supply and borrow change index if they aren't doing deposits or borrows
  if(userSupplyInterestChangeIndex == 0)
    userSupplyInterestChangeIndex = newSupplyInterestChangeIndex

  //User New Balance Before Fee = Old Balance * Token Reserve Earned Interest Index / User Earned Interest Index
  //Interest Earned Before Fee = New Balance Before Fee - Old Balance
  //Interest Earned After Fee = Interest Earned Before Fee - (Interest Earned Before Fee * SubMarket Fee Rate)
  //User New Balance After Fee = Old Balance + Interest Earned After Fee
  //Calculate interest earned
  const newBalanceBeforeFee = (originalDepositedAmount * newSupplyInterestChangeIndex / Number(userSupplyInterestChangeIndex))
  const interestEarnedBeforeFees = newBalanceBeforeFee - originalDepositedAmount

  var formulaSubMarketFee
  var solvencyInsuranceFee
  if(subMarket.feeOnInterestEarnedRate + tokenReserve.solvencyInsuranceFeeRate <= 100)
  {
    formulaSubMarketFee = subMarket.feeOnInterestEarnedRate
    solvencyInsuranceFee = tokenReserve.solvencyInsuranceFeeRate
  }
  else
  {
    solvencyInsuranceFee = tokenReserve.solvencyInsuranceFeeRate
    formulaSubMarketFee = 100 - tokenReserve.solvencyInsuranceFeeRate
  }

  var interestEarnedAfterFees = interestEarnedBeforeFees - (interestEarnedBeforeFees * formulaSubMarketFee / 100) - (interestEarnedBeforeFees * solvencyInsuranceFee / 100)
  //interestEarnedAfterFees = Number(interestEarnedAfterFees.toFixed(tokenDecimalAmount))

  return originalDepositedAmount + interestEarnedAfterFees
}

export function calculateNewDebtBalance(
tokenReserve:any,
originalBorrowedAmount: number,
userBorrowInterestChangeIndex: number,
timeStamp: number)
{
  //Token Reserve Borrow Interest Index = Old Borrow Interest Index * (1 + Borrow APY * Δt/Seconds in a Year)
  const oldTime = Number(tokenReserve.lastLendingActivityTimeStamp)
  const changeInTime = timeStamp - oldTime
  const borrowApy = tokenReserve.borrowApy / 10000 //convert from fixed point to decimal

  const borrowCompoundingFactor = getCompoundingFactor(borrowApy, changeInTime)
  //const newBorrowInterestChangeIndex = Number(tokenReserve.borrowInterestChangeIndex) * (1 + borrowApy * changeInTime / SECONDS_IN_A_YEAR)
  const newBorrowInterestChangeIndex = Number(tokenReserve.borrowInterestChangeIndex) * borrowCompoundingFactor

  //For tab accounts initialized with no deposits, keeps from dividing by zero
  //For example, can happen to when claiming submarket fees in different destination submarket on new initial tab account
  //Or the Solvency Treasury might have zeros for supply and borrow change index if they aren't doing deposits or borrows
  if(userBorrowInterestChangeIndex == 0)
    userBorrowInterestChangeIndex = newBorrowInterestChangeIndex

  //User New Debt = Old Debt * Token Reserve Accrued Interest Index / User Accrued Interest Index
  //Calculate interest accrued
  return originalBorrowedAmount * newBorrowInterestChangeIndex / userBorrowInterestChangeIndex
}

export function calculateTokenReserveSevenDaySupplyInterestFactor(timeStamp: number, tokenId: number)
  {
    const tokenReserve = tokenReservesHashMap.map.get(tokenId)

    if(!tokenReserve)
      return

    //Token Reserve Supply Interest Index = Old Supply Interest Index * (1 + Supply APY * Δt/Seconds in a Year)
    const oldTime = Number(tokenReserve.lastLendingActivityTimeStamp)
    const timeSinceLastAction = timeStamp - oldTime
    const supplyApy = tokenReserve.supplyApy / 10000 //convert from fixed point to decimal
    const supplyCompoundingFactor = getCompoundingFactor(supplyApy, timeSinceLastAction)

    //1. First, calculate what the index is *right now* based on stale chain data
    const currentAccruedIndex = Number(tokenReserve.supplyInterestChangeIndex) * supplyCompoundingFactor

    //2. Next, project *only* 7 days into the future from the current accrued index
    const sevenDayCompoundingFactor = getCompoundingFactor(supplyApy, SECONDS_IN_A_WEEK)
    const projectedSevenDayIndex = currentAccruedIndex * sevenDayCompoundingFactor

    return [currentAccruedIndex, projectedSevenDayIndex]
  }

//Taylor Series 4th Order Interest Calculation: e^x = 1 + x + (x^2 / 2!) + (x^3 / 3!) + (x^4 / 4!)
export function getCompoundingFactor(apy: number, deltaTime: number) 
{
  
  const x = (apy * deltaTime) / SECONDS_IN_A_YEAR
  const term1 = x
  const term2 = (term1 * x) / 2
  const term3 = (term2 * x) / 3
  const term4 = (term3 * x) / 4
  
  return 1 + term1 + term2 + term3 + term4
}

/*Old Linear Compounding Way
function calculateTokenReserveInterestChangeIndex(timeStamp: number)
  {
    tokenReserve = cloneDeep(tokenReservesHashMap.map.get(props.tokenId))//cloneDeep to keep changes to tokenReserve variable from setting off tokenReservesHashMap watchers

    //Token Reserve Supply Interest Index = Old Supply Interest Index * (1 + Supply APY * Δt/Seconds in a Year)
    const oldTime = Number(tokenReserve.lastLendingActivityTimeStamp)
    const changeInTime = timeStamp - oldTime
    const supplyApy = tokenReserve.supplyApy / 10000 //convert from fixed point to decimal
    const borrowApy = tokenReserve.borrowApy / 10000 //convert from fixed point to decimal

    tokenReserve.newSupplyInterestChangeIndex = Number(tokenReserve.supplyInterestChangeIndex) * (1 + supplyApy * changeInTime / SECONDS_IN_A_YEAR)
    tokenReserve.newBorrowInterestChangeIndex = Number(tokenReserve.borrowInterestChangeIndex) * (1 + borrowApy * changeInTime / SECONDS_IN_A_YEAR)

    tokenReserve.sevenDaySupplyInterestChangeIndex = tokenReserve.newSupplyInterestChangeIndex * (1 + supplyApy * SECONDS_IN_A_WEEK / SECONDS_IN_A_YEAR)
  }*/

export const healthFactorInfo = "Health Factor equals\n\n(Assets * 0.8 - Debt)\n-----------------\n(Assets * 0.8)\n\nWhen Debt is equal or more than 80% of Assets, IE: Health Factor is 0%, the Account is exposed to Liquidation.\n\nThe Account is insolvent when Debt Value is 100% or more of Asset Value.\n\nA User can borrow up to 70% of the value of their assets initially."
export default  healthFactorInfo