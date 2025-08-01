import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express();



app.use(cors({
    origin : process.env.CORS_ACCESS
}))

app.use(express.json({limit : "20kb"})) 
app.use(express.urlencoded())
app.use(express.static("Public"))
app.use(cookieParser())

// route import 
import route from "./Routes/Register.route.js";
// Usage of route 

app.use("/api/v1/users" , route);
app.get("/" , (req , res) => {
    res.send("helloo")
})

export default app ;