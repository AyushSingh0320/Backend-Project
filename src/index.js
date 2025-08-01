import ConnectingDB from "./DB/PracticeDB.js";
import dotenv from 'dotenv'
import app from "./app.js";
dotenv.config({})
const port = process.env.PORT || 8000







ConnectingDB()
           .then(()=>{
              console.log("Mongodb succesfull Connected")
              app.listen(port , () => {
              console.log(`Server running on ${port}`)
              })
           })
           .catch((err) => {
            console.log("MongoDB Error" , err)
           })


