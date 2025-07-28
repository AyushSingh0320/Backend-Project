import mongoose from "mongoose"
import { DB_name } from "../constant.js";

const ConnectingDB = async () => {
    try {
      const DBresult =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`)
      console.log("succesfully connected to MongoDB")
    //   console.log(DBresult)
    } catch (error) {
        console.log("Error occured while connecting to the Database" , error)
        throw error;
    }
}

export default ConnectingDB;