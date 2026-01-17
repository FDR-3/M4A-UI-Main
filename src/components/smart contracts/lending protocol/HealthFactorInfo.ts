import { SECONDS_IN_A_YEAR } from '/src/assets/constants/TimeLengths.ts'

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

  const newSupplyInterestChangeIndex = Number(tokenReserve.supplyInterestChangeIndex) * (1 + supplyApy * changeInTime / SECONDS_IN_A_YEAR)

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

  const newBorrowInterestChangeIndex = Number(tokenReserve.borrowInterestChangeIndex) * (1 + borrowApy * changeInTime / SECONDS_IN_A_YEAR)

  //For tab accounts initialized with no deposits, keeps from dividing by zero
  //For example, can happen to when claiming submarket fees in different destination submarket on new initial tab account
  if(userBorrowInterestChangeIndex == 0)
    userBorrowInterestChangeIndex = newBorrowInterestChangeIndex

  //User New Debt = Old Debt * Token Reserve Accrued Interest Index / User Accrued Interest Index
  //Calculate interest accrued
  return originalBorrowedAmount * newBorrowInterestChangeIndex / userBorrowInterestChangeIndex
}

export const healthFactorInfo = "\nHealth Factor equals\n\n(Assets * 0.8 - Debt)\n-----------------\n(Assets * 0.8)\n\nWhen Debt is equal or more \nthan 80% of Assets, IE:\nHealth Factor is 0% or\nnegative, the Account is\nexposed to Liquidation.\n\nA User can borrow up to 70%\nof the value of their\nassets initially\n"
export default  healthFactorInfo