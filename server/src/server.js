const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')



app.get('/api/stocks/:symbol', (req,res) =>{
    const { symbol } = req.params
})


app.listen(5000, () => {console.log('Server listening')})