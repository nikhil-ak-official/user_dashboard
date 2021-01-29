const express = require('express')
const cors = require('cors')
const mysqlConnection = require('./db/db') 
const redisCache = require('./db/redisCache')
const userRoutes = require('./routes/userRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const subcategoryRoutes = require('./routes/subcategoryRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')

const app = express()
app.use(cors())
app.use(express.json())


// routes
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/subcategory', subcategoryRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes)


const port = process.env.PORT
app.listen(port , () => {
    console.log("server running at", port);
});

