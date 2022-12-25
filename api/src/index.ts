import express from 'express'
import cors from 'cors'
import { Pool } from 'pg'
import { createClient } from 'redis'
import { config } from './config'
const PORT = 8000

// initiate express and add middlewares
const app = express()
app.use(cors())
app.use(express.json())

// setup pg client
const pgClient = new Pool({
    user: config.get('pgUser'),
    host: config.get('pgHost'),
    database: config.get('pgDatabase'),
    password: config.get('pgPassword'),
    port: +config.get('pgPort')!
})

pgClient.connect()
    .then(client => {
        console.log("Successfully connected postgres")
        client.query("CREATE TABLE IF NOT EXISTS values (number INT)")
            .catch(err => console.log("POSTGRES_ERROR", err))
    })
    .catch(err => console.log("error connecting postgres", err.message))

// setup redis client
const url = `redis://default:test@redis:6379`
const redisClient = createClient({
    url,
    // TODO: this is a legacy conf, search for the new equivalent
    // retry_strategy: () => 1000,
})

redisClient.connect()
    .then(client => {
        console.log("Connected Redis successfully", client)
    })
    .catch(err => console.log("Unable to connect Redis"))

// duplicate redis connection and create a publisher
const redisPublisher = redisClient.duplicate()
redisPublisher.connect()
    .then(res => {
        console.log("Connected Pub successfully")
    })
    .catch(err => console.log("Unable to connect Pub"))

app.get("/api", (req, res) => {
    res.send("Hi");
})

app.get("/api/values/all", async (req, res) => {
    try {
        const values = await pgClient.query("SELECT * from values");
        res.send(values.rows);
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

app.get("/api/values/current", async (req, res) => {
    try {
        const values = await redisClient.hGetAll('values')
        res.send(values);
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

app.post("/api/values", async (req, res) => {
    try {
        const index = req.body.index;
        if (parseInt(index) > 40) {
            return res.status(422).send("Index too high");
        }
        await redisClient.hSet("values", index, "Nothing yet!");
        await redisPublisher.publish("insert", index);
        await pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

        res.send({ working: true });
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

app.all('*', (req, res) => {
    res.status(404).send({ message: "Böyle bir route yok" })
})

app.listen(PORT, () => {
    console.log("Listening on port:", PORT);
})