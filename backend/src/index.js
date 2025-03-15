import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js"

dotenv.config({
    path: "./.env"
})

connectDB().then(() => {
    app.on("error", (error) => {
        console.log("ERROR ON EXPRESS SERVER : ", error)
    })
    app.listen(process.env.PORT || 8080, () => console.log(`server running on ${process.env.PORT}`))
})
    .catch(err => console.log("MONGO DB CONNECTION FAILED : ", err))