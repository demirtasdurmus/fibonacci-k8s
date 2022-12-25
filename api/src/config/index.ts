type Config = 'redisHost' | 'redisPort' | 'pgUser' | 'pgHost' | 'pgDatabase' | 'pgPassword' | 'pgPort'

const config = new Map<Config, string>()

config.set('redisHost', process.env.REDIS_HOST!)
config.set('redisPort', process.env.REDIS_PORT!)
config.set('pgUser', process.env.PGUSER!)
config.set('pgHost', process.env.PGHOST!)
config.set('pgDatabase', process.env.PGDATABASE!)
config.set('pgPassword', process.env.PGPASSWORD!)
config.set('pgPort', process.env.PGPORT!)

export { config }