import ConnectingDB from "./DB/PracticeDB.js";
import dotenv from 'dotenv'
import app from "./app.js";


dotenv.config({path : "./.env"})
const port = process.env.PORT || 4000





console.log("helloo")

ConnectingDB()
           .then(()=>{
              console.log("Mongodb succesfull Connected")
              app.listen(port , () => {
              console.log(`Server running on port : ${port}`)
              })
           })
           .catch((err) => {
            console.log("MongoDB Error" , err)
           })

