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

app.get("/" , (req , res) => {
     res.status(200).send("Hiee welcome to my site");
})



export default app ;