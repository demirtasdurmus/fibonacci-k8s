type Config = 'redisHost' | 'redisPort'

const config = new Map<Config, string>()

config.set('redisHost', process.env.REDIS_HOST!)
config.set('redisPort', process.env.REDIS_PORT!)

export { config }