const redis = require("redis");
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);

const client = redis.createClient(process.env.REDIS_PORT || 6379);

client.on("connect", () => {
    console.log("connected to redis server");
});
client.on("error", function(error) {
    console.error(error);
});

  
module.exports = client