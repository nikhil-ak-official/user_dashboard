const express = require('express')
const cors = require('cors')
const mysqlConnection = require('./db/db') 
const userRoutes = require('./routes/userRoutes')

const app = express()
app.use(cors())
app.use(express.json())

// routes
app.use('/user', userRoutes)

const port = process.env.PORT
app.listen(port , () => {
    console.log("server running at", port);
})