import { anchorPrograms, unixData } from '/src/assets/globalStates/AnchorPrograms.vue'

export function getNewTime() 
{
  const newDate = new Date()
  return newDate.toLocaleTimeString('en-US', 
  { timeZone: 'America/Los_Angeles', //America/Los_Angeles America/New_York
    timeZoneName: "short"
  })
}

export function getNewDate() 
{
  const newDate = new Date()
  return newDate.toLocaleDateString('en-US', 
  { 
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function convertUnixTimeToLocalTime(timeStamp: number)
{
  const time = new Date(timeStamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
  const localTimeString = time.toLocaleString('en-US',
  {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    timeZoneName: "short"
  })

  return localTimeString;
}

export function convertUnixTimeToLocalDate(timeStamp: number)
{
  const date = new Date(timeStamp * 1000) // Multiply by 1000 to convert seconds to milliseconds
  const localDateString = date.toLocaleString('en-US',
  {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return localDateString;
}

var unixTimeStampRefreshIntervalId: any
var unixTimeStampEstimationIntervalId: any

export async function startUnixTimeStampRefresh()
{
  unixData.timeStamp = Date.now() / 1000
  

  unixTimeStampRefreshIntervalId = setInterval(async() =>
  {
    unixData.timeStamp = Date.now() / 1000
    //const slot = await anchorPrograms.lending.lendingProgram.provider.connection.getSlot()
    //const blockChainTimeStamp = await anchorPrograms.lending.lendingProgram.provider.connection.getBlockTime(slot)

    //console.log("unixData.timeStamp: ", unixData.timeStamp)
    //console.log("blockChainTimeStamp: ", blockChainTimeStamp)
  }, 7000) 
}

export function startUnixChainTimeStampEstimation()
{
  unixTimeStampEstimationIntervalId = setInterval(async() =>
  {
    unixData.timeStamp += 55/1000//convert milliseconds into seconds
  }, 55) 
}

export function stopUnixTimeStampRefresh()
{
  if(unixTimeStampRefreshIntervalId != undefined)
  {
    clearInterval(unixTimeStampRefreshIntervalId)
    unixTimeStampRefreshIntervalId = undefined
  }
  if(unixTimeStampEstimationIntervalId != undefined)
  {
    clearInterval(unixTimeStampEstimationIntervalId)
    unixTimeStampEstimationIntervalId = undefined
  }
}