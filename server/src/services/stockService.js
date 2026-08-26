const axios = require('axios')

async function fetchAndAggregateStockData(symbol) {
  const ticker = symbol.toUpperCase()
  const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=1mo&interval=15m`

  const response = await axios.get(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    timeout: 8000
  })

  const result = response.data?.chart?.result?.[0]
  if (!result || !result.timestamp || !result.indicators?.quote?.[0]) {
    throw { status: 404, message: `No trading data found for symbol "${ticker}".` }
  }

  const timestamps = result.timestamp
  const quotes = result.indicators.quote[0]
  const groupedData = {}

  timestamps.forEach((ts, idx) => {
    const low = quotes.low[idx]
    const high = quotes.high[idx]
    const volume = quotes.volume[idx] ?? 0

    if (low === null || high === null || low === undefined || high === undefined) {
      return
    }

    const dateStr = new Date(ts * 1000).toISOString().split('T')[0]

    if (!groupedData[dateStr]) {
      groupedData[dateStr] = { lows: [], highs: [], totalVolume: 0 }
    }

    groupedData[dateStr].lows.push(low)
    groupedData[dateStr].highs.push(high)
    groupedData[dateStr].totalVolume += volume
  })

  const payload = Object.entries(groupedData).map(([day, data]) => {
    const lowAvg = data.lows.reduce((sum, val) => sum + val, 0) / data.lows.length
    const highAvg = data.highs.reduce((sum, val) => sum + val, 0) / data.highs.length

    return {
      day,
      lowAverage: Number(lowAvg.toFixed(4)),
      highAverage: Number(highAvg.toFixed(4)),
      volume: Math.round(data.totalVolume)
    }
  })

  return payload.sort((a, b) => a.day.localeCompare(b.day))
}

module.exports = { fetchAndAggregateStockData }