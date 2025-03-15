import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`MongoDb connected ! DB HOST : ${connectionInstance.connection.host}`)
    } catch (err) {
        console.log("MONGO DB CONNECTION ERROR:", err)
        process.exit(1)
    }
}

export default connectDB