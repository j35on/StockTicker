const express = require('express')
const app = express()
const cors = require('cors')
const stockRoutes = require('./routes/stockRoutes')

app.use(cors())
app.use(express.json())

app.use('/api/stocks', stockRoutes)

app.listen(5000, () => {console.log('Server listening')})