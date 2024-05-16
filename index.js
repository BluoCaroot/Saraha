import express from "express"
import { config } from "dotenv"
import { db_connection } from "./DB/connection.js"
import { globalResponse } from "./src/middlewares/GlobalResponse.js"
import MessageRouter from "./src/modules/messages/message.router.js"
import UserRouter from "./src/modules/users/user.router.js"
import cors from 'cors'
import { scheduleJob } from 'node-schedule'
import axios from 'axios'

config({path: "./config/dev.config.env"})
const port = parseInt(process.env.port)
const app = express()


app.use(express.json())
app.use(cors());
app.use('/user', UserRouter)
app.use('/message', MessageRouter)
app.use('/keep-alive', (req, res) => res.json({message: "server is alive"}))

app.use(globalResponse)
db_connection()
app.listen(port, console.log(`server connected on port ${port}`))


scheduleJob('*/14 * * * *', async () =>
{
    axios.get(`${process.env.BASE_URL}/keep-alive`)
    .then(res => console.log(res.data))
    .error(err => console.log(err)) 
})