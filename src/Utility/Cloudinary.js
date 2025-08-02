import {v2 as cloudinary} from "cloudinary";
import fs from "fs"; 
import Apierror from "./Error.js";
import dotenv from "dotenv";
dotenv.config({path : "./.env"})




cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key:  process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


   const fileupload = async (Filepath) => { try {
    if(!Filepath) return  new Apierror(401 , "Filepath required");

   const response = await cloudinary.uploader.upload(Filepath , {
        resource_type : "auto"
    })
     fs.unlinkSync(Filepath)
    // console.log("File uploaded successfully" , response.url)
    
    // console.log(response);
    return response;
  
   } catch (error) {
   fs.unlinkSync(Filepath)
   return null;
   }
   }  
 

   export default fileupload;