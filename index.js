//require
require('dotenv').config()
require('express-async-errors')

//security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const eRateLimit = require('express-rate-limit')

//others
const connectDB = require('./db/connect')
const auth_R = require('./routes/auth_R')
const auth = require('./middleware/authentication')
const express = require('express');
const app = express();

const port = process.env.PORT||4000

//app

app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

connectDB()

app.get('/', (req, res)=>{
    res.send('CongratsBro API')
})

app.use('/api/v1/auth', auth_R)

app.listen(port ,()=>{
    console.log(`listening on port ${port}`)
})