//require
require('dotenv').config()
require('express-async-errors')

//security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const eRateLimit = require('express-rate-limit')

//swagger ui for documentation
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')

var path = require('path')
var swaggerPath = path.resolve(__dirname, './swagger.yaml')
const swaggerDoc = YAML.load(swaggerPath)

const swaggerCss = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";

//others
const connectDB = require('./db/connect') //db

const auth_R = require('./routes/auth_R') //routes
const posts_R = require('./routes/posts_R') 
const friends_R = require('./routes/friends_R') 

const auth = require('./middleware/authentication') //middleware
const errorHandler = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')

const express = require('express');
const app = express();

const port = process.env.PORT||4000



//app

app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

connectDB()

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc,{customCssUrl:swaggerCss}))
app.get('/', (req, res)=>{
    res.send('<center>\
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"\
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"crossorigin="anonymous" />\
    <h1>CongratsBro API</h1><p>This is a Backend API for making posts relating to your achievements, connecting with friends and also viewing their posts </p>\
    <p>There is no front-end currently for the app, its a purely a backend app</p>\
    <p></p>\
    <p>At the end of this websites URL attach:</p>\
    <li>/api/v1/auth for auth routes</li>\
    <li>/api/v1/posts for posts routes</li>\
    <li>/api/v1/friends for friends routes</li>\
    <p></p>\
    <p><i><u><a href="/api-docs">for more detailed documentation click here</a></i></u></p>\
    <h3><p><b>Made by <i><a href="https://github.com/MOA-CODES">MOA-CODES</a></i></b></P></h3>\
    </center>')
})

app.use('/api/v1/auth', auth_R)
app.use('/api/v1/posts', auth, posts_R)
app.use('/api/v1/friends', auth, friends_R)

app.use(notFound)
app.use(errorHandler)


app.listen(port ,()=>{
    console.log(`listening on port ${port}`)
})