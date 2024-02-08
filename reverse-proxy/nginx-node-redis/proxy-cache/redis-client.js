import redis from 'redis'

const redisClient = await redis.createClient({
    socket: {
        host: 'redis',
        port: 6379
    }
})
    .on('error', err => console.error('Redis error: ', err))
    .connect();

const cacheSet = async function(key, value, expires) {
    await redisClient.set(key, value);
    await redisClient.expire(key, expires)
}

const cacheGet = async function(key) {
    return await redisClient.get(key);
}

export {redisClient, cacheSet, cacheGet};