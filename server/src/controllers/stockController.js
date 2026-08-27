const stockService = require('../services/stockService')

async function getStockData(req,res) {
    const { symbol } = req.params

    if (!symbol || !/^[a-zA-Z0-9.-]+$/.test(symbol)) {
        return res.status(400).json({ error: 'Invalid stock symbol'})
    }

    try{
        const data = await stockService.fetchAndAggregateStockData(symbol)
        return res.json(data)
    }
    catch(error){
        if(error.status === 404){
            return res.status(404).json({ error: error.message})
        }
        return res.status(500).json({ error: 'Failed to retrieve stock data', details: error.message})
    }
}

module.exports = { getStockData }