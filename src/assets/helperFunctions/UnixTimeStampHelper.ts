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