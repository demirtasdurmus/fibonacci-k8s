
import { createClient, RedisClientType } from 'redis'
import { config } from './config'
const PORT = 8000


// setup redis client
const url = `redis://default:test@redis:6379`
const redisClient = createClient({
    url,
    // TODO: this is a legacy conf, search for the new equivalent
    // retry_strategy: () => 1000,
})

// duplicate redis connection and create a subscriber
const redisSubscriber = redisClient.duplicate()

function fib(index: any): any {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

redisSubscriber.on('message', (channel, message) => {
    redisClient.hSet('values', message, fib(parseInt(message)))
})


redisSubscriber.subscribe('insert', (message) => {
    console.log(message); // 'message')
})


