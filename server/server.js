const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const connect_DB = require('./config/db')
const errorHandler = require('./middleware/errorMiddleware')


connect_DB()
const app = express()
app.use(express.json())  // allows us to get data from body


app.use('/api/auth', require('./routes/auth'))
app.use('/api/news', require('./routes/news'))


app.use(errorHandler)  //Error Handler 


// Running on Port 5000
app.listen(port, ()=>{
    console.log(`Server Running on ${port}`)
})