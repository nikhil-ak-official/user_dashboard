const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient(process.env.REDIS_PORT || 6379);

client.on("connect", () => {
    console.log("connected to redis server");
});
client.on("error", function(error) {
    console.error(error);
});
  
  const setAsync = promisify(client.set).bind(client);
  const getAsync = promisify(client.get).bind(client);
  const del = promisify(client.del).bind(client);
  
  module.exports = {setAsync, getAsync, del}