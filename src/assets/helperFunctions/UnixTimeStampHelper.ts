import { anchorPrograms, blockChainData } from '/src/assets/globalStates/AnchorPrograms.vue'

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

var blockChainTimeStampRefreshIntervalId: any
var blockChainTimeStampEstimationIntervalId: any

export async function updateBlockChainTimeStamp()
{
  const slot = await anchorPrograms.lending.lendingProgram.provider.connection.getSlot()
  blockChainData.timeStamp = await anchorPrograms.lending.lendingProgram.provider.connection.getBlockTime(slot)
}

export async function startBlockChainTimeStampRefresh()
{
  const slot = await anchorPrograms.lending.lendingProgram.provider.connection.getSlot()
  blockChainData.timeStamp = await anchorPrograms.lending.lendingProgram.provider.connection.getBlockTime(slot)

  blockChainTimeStampRefreshIntervalId = setInterval(async() =>
  {
    console.log("Refreshing Block Chain Time Stamp")
    const slot = await anchorPrograms.lending.lendingProgram.provider.connection.getSlot()
    blockChainData.timeStamp = await anchorPrograms.lending.lendingProgram.provider.connection.getBlockTime(slot)
  }, 60000) 
}

export function startBlockChainTimeStampEstimation()
{
  blockChainTimeStampEstimationIntervalId = setInterval(async() =>
  {
    blockChainData.timeStamp += 55/1000//convert milliseconds into seconds
  }, 55) 
}

export function stopBlockChainTimeStampRefresh()
{
  if(blockChainTimeStampRefreshIntervalId != undefined)
  {
    clearInterval(blockChainTimeStampRefreshIntervalId)
    blockChainTimeStampRefreshIntervalId = undefined
  }
  if(blockChainTimeStampEstimationIntervalId != undefined)
  {
    clearInterval(blockChainTimeStampEstimationIntervalId)
    blockChainTimeStampEstimationIntervalId = undefined
  }
}