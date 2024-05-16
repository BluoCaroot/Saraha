import mongoose from "mongoose"


export const db_connection = async () =>
{
    await mongoose.connect(process.env.connection_url_host)
    .then((res)=> console.log('DB connected successfully'))
    .catch((err)=> console.log('DB connection failed', err))
}