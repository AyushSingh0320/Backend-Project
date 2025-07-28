import ConnectingDB from "./DB/PracticeDB.js";
import dotenv from 'dotenv'
import app from "./app.js";
dotenv.config({  })
const port = process.env.Port || 8000







ConnectingDB()
           .then(()=>{
              console.log("Mongodb succesfull Connected")
           })
           .then(()=>{
            app.listen(port , ()=>{
                console.log(`Server is running on ${port}`)
            })
           })
           .catch((err) => {
            console.log("MongoDB Error" , err)
           })

