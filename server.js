const express = require('express')
const cors = require('cors')
const mysqlConnection = require('./db/db') 
const userRoutes = require('./routes/userRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const subcategoryRoutes = require('./routes/subcategoryRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')
const redis = require("redis");
const { promisify } = require("util");

const app = express()
app.use(cors())
app.use(express.json())

// const client = redis.createClient(process.env.REDIS_PORT || 6379);

// client.on("connect", () => {
//   console.log("connected to redis server");
// })
// client.on("error", function(error) {
//   console.error(error);
// });

// const getAsync = promisify(client.hgetall).bind(client);
// const setAsync = promisify(client.hmset).bind(client);
// const del = promisify(client.del).bind(client);

// (async() => {
//   try {
//     await setAsync('key', {
//       'name':'nikhil'
//     });
//     const data = await getAsync('key')
//     console.log(data);
//     await del('key');
//     const newData = await getAsync('key')
//     console.log(newData);


//   }
//   catch(err) {
//     console.log(err);
//   }
// })();




// routes
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/subcategory', subcategoryRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes)


const port = process.env.PORT
app.listen(port , () => {
    console.log("server running at", port);
})

