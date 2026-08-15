export function getAmountBaseChart(gradientOffset: number) :any
{
  return{
    labels: [],
    datasets:
    [
      {
        type: 'line',
        label: 'USDS',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setUSDSLineAnimatedGradient(ctx, chartArea, gradientOffset)
        },
        borderWidth: 4,
        fill: false,
        tension: 0.4,
        data: [] as any[]
      },
      {
        type: 'line',
        label: 'USDC',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setUSDCLineAnimatedGradient(ctx, chartArea, gradientOffset)
        },
        borderWidth: 4,
        fill: false,
        tension: 0.4,
        data: [] as any[]
      },
      {
        type: 'line',
        label: 'SOL',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setSOLLineAnimatedGradient(ctx, chartArea, gradientOffset)
        },
        borderWidth: 4,
        fill: false,
        tension: 0.4,
        data: [] as any[]
      },
      {
        type: 'line',
        label: 'WEth',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setWEthLineAnimatedGradient(ctx, chartArea, gradientOffset)
        },
        borderWidth: 4,
        fill: false,
        tension: 0.4,
        data: [] as any[]
      },
      {
        type: 'line',
        label: 'WBtc',
        borderColor: function(context: any)
        { 
          const chart = context.chart
          const { ctx, chartArea } = chart
          return setWBtcLineAnimatedGradient(ctx, chartArea, gradientOffset)
        },
        borderWidth: 4,
        fill: false,
        tension: 0.4,
        data: [] as any[]
      }
    ]
  }
}

export function setChartOptions(responsive: boolean, chartTextColor: string, dollarSign = false)
{
  return{
    responsive: responsive,
    maintainAspectRatio: false,
    aspectRatio: 0.7,
    transitions:
    {
      hide:
      {
        animation:
        {
          duration: 0
        }
      }
    },
    plugins:
    {
      legend:
      {
        display: false
      },
      //Fixes the hover popup truncation
      tooltip:
      {
        callbacks:
        {
          label: function(context: any)
          {
            let label = context.dataset.label || ''
            if(label)
              if(dollarSign)
                label += ': $'
              else
                label += ': '

            if(context.parsed.y !== null)
            {
              const value = context.parsed.y
              label += value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 9 })
            }
            return label;
          }
        }
      }
    },
    scales:
    {
      x:
      {
        ticks:
        {
          color: chartTextColor
        },
        grid:
        {
          color: chartTextColor
        }
      },
      y:
      {
        ticks:
        {
          color: chartTextColor,
          callback: function(value: any)
          {
            if(dollarSign)
              return '$' + Number(value).toLocaleString('en-US', {
                minimumFractionDigits: 0, 
                maximumFractionDigits: 2
              })
            else
              return value
          }
        },
        grid:
        {
          color: chartTextColor
        }
      }
    }
  }
}

export function toggleDataset(index: number, chartInstance: any, legenHiddenArray: boolean[])
{
  if(!chartInstance)
    return

  const chart = chartInstance.chart
  if(chart)
  {
    if(chart.isDatasetVisible(index))
    {
      legenHiddenArray[index] = true
      chart.hide(index)
    }
    else
    {
      legenHiddenArray[index] = false
      chart.show(index)
      chart.update()
    }
  }
}

function createWidthGradient(ctx: any, chartArea:any, gradientOffset: number)
{
  const width = chartArea.right - chartArea.left
  const offset = gradientOffset
  const shift = offset * width

  return ctx.createLinearGradient(
    chartArea.left - shift, 0, 
    chartArea.left - shift + (width * 2), 0
  )
}

function createHeightGradient(ctx: any, chartArea:any, gradientOffset: number)
{
  const height = chartArea.bottom - chartArea.top
  const offset = gradientOffset
  //Shift goes from 0 to the height of the chart
  const shift = offset * height

  //Create a gradient twice as tall as the chart, and slide it up
  return ctx.createLinearGradient(
    0, chartArea.top - shift, 
    0, chartArea.top - shift + (height * 2)
  )
}

export function setRainbowLineAnimatedGradient(ctx: any, chartArea:any, gradientOffset: number)
{
  if(!chartArea)
    return

  const gradient = createWidthGradient(ctx, chartArea, gradientOffset)

  gradient.addColorStop(0.000, '#14ffe9')
  gradient.addColorStop(0.166, '#ffc800')
  gradient.addColorStop(0.333, '#ff00e0')
  gradient.addColorStop(0.500, '#14ffe9')
  gradient.addColorStop(0.666, '#ffc800')
  gradient.addColorStop(0.833, '#ff00e0')
  gradient.addColorStop(1.000, '#14ffe9')

  return gradient
}

export function setRainbowBarAnimatedGradient(ctx: any, chartArea:any, gradientOffset: number)
{
  if(!chartArea)
    return

  const gradient = createHeightGradient(ctx, chartArea, gradientOffset)

  //Two full cycles of the rainbow
  gradient.addColorStop(0.000, '#14ffe9')
  gradient.addColorStop(0.166, '#ffc800')
  gradient.addColorStop(0.333, '#ff00e0')
  gradient.addColorStop(0.500, '#14ffe9')
  gradient.addColorStop(0.666, '#ffc800')
  gradient.addColorStop(0.833, '#ff00e0')
  gradient.addColorStop(1.000, '#14ffe9')

  return gradient
}

export function setPoopLineAnimatedGradient(ctx: any, chartArea:any, gradientOffset: number)
{
  if(!chartArea)
    return

  const gradient = createWidthGradient(ctx, chartArea, gradientOffset)

  //Two full cycles of the poop colors
  gradient.addColorStop(0.00, '#851717')
  gradient.addColorStop(0.25, '#0f8332')
  gradient.addColorStop(0.50, '#851717')
  gradient.addColorStop(0.75, '#0f8332')
  gradient.addColorStop(1.00, '#851717')

  return gradient
}

export function setPoopBarAnimatedGradient(ctx: any, chartArea:any, gradientOffset: number)
{
  if(!chartArea)
    return

  const gradient = createHeightGradient(ctx, chartArea, gradientOffset)

  //Two full cycles of the poop colors
  gradient.addColorStop(0.00, '#851717')
  gradient.addColorStop(0.25, '#0f8332')
  gradient.addColorStop(0.50, '#851717')
  gradient.addColorStop(0.75, '#0f8332')
  gradient.addColorStop(1.00, '#851717')

  return gradient
}

export function setPurpleBlueBarAnimatedGradient(ctx: any, chartArea:any, gradientOffset: number)
{
  if(!chartArea)
    return

  const gradient = createHeightGradient(ctx, chartArea, gradientOffset)

  //Two full cycles of the purple blue colors
  gradient.addColorStop(0.00, '#8a2be2')
  gradient.addColorStop(0.25, '#557fcc')
  gradient.addColorStop(0.50, '#8a2be2')
  gradient.addColorStop(0.75, '#557fcc')
  gradient.addColorStop(1.00, '#8a2be2')

  return gradient
}

export function setUSDSLineAnimatedGradient(ctx: any, chartArea:any, gradientOffset: number)
{
  if(!chartArea)
    return

  const gradient = createWidthGradient(ctx, chartArea, gradientOffset)

  //Two full cycles of the USDS colors
  gradient.addColorStop(0.00, '#ff6d6d')
  gradient.addColorStop(0.25, '#ffd232')
  gradient.addColorStop(0.50, '#ff6d6d')
  gradient.addColorStop(0.75, '#ffd232')
  gradient.addColorStop(1.00, '#ff6d6d')

  return gradient
}

export function setUSDCLineAnimatedGradient(ctx: any, chartArea:any, gradientOffset: number)
{
  if(!chartArea)
    return

  const gradient = createWidthGradient(ctx, chartArea, gradientOffset)

  //Two full cycles of the USDC colors
  gradient.addColorStop(0.00, '#3e73c4')
  gradient.addColorStop(0.20, '#3e73c4')
  gradient.addColorStop(0.25, '#fff')
  gradient.addColorStop(0.30, '#3e73c4')
  gradient.addColorStop(0.70, '#3e73c4')
  gradient.addColorStop(0.75, '#fff')
  gradient.addColorStop(0.80, '#3e73c4')
  gradient.addColorStop(1.00, '#3e73c4')

  return gradient
}

export function setSOLLineAnimatedGradient(ctx: any, chartArea:any, gradientOffset: number)
{
  if(!chartArea)
    return

  const gradient = createWidthGradient(ctx, chartArea, gradientOffset)

  //Two full cycles of the SOL colors
  gradient.addColorStop(0.00, '#cf41e8')
  gradient.addColorStop(0.25, '#10f2b0')
  gradient.addColorStop(0.50, '#cf41e8')
  gradient.addColorStop(0.75, '#10f2b0')
  gradient.addColorStop(1.00, '#cf41e8')

  return gradient
}

export function setWEthLineAnimatedGradient(ctx: any, chartArea:any, gradientOffset: number)
{
  if(!chartArea)
    return

  const gradient = createWidthGradient(ctx, chartArea, gradientOffset)

  //Two full cycles of the WEth colors
  gradient.addColorStop(0.00, '#627eea')
  gradient.addColorStop(0.20, '#627eea')
  gradient.addColorStop(0.25, '#fff')
  gradient.addColorStop(0.30, '#627eea')
  gradient.addColorStop(0.70, '#627eea')
  gradient.addColorStop(0.75, '#fff')
  gradient.addColorStop(0.80, '#627eea')
  gradient.addColorStop(1.00, '#627eea')

  return gradient
}

export function setWBtcLineAnimatedGradient(ctx: any, chartArea:any, gradientOffset: number)
{
  if(!chartArea)
    return

  const gradient = createWidthGradient(ctx, chartArea, gradientOffset)

  //Two full cycles of the WBtc colors
  gradient.addColorStop(0.00, '#f09242')
  gradient.addColorStop(0.25, '#282138')
  gradient.addColorStop(0.50, '#f09242')
  gradient.addColorStop(0.75, '#282138')
  gradient.addColorStop(1.00, '#f09242')

  return gradient
}