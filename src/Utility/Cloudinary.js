import {v2 as cloudinary} from "cloudinary";
import fs from "fs"; 

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key:  process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRE
    });


   const fileupload = async (Filepath) => { try {
    if(!Filepath) return Error;

   const response = await cloudinary.uploader.upload(Filepath , {
        resource_type : "auto"
    })
    console.log("File uploaded successfully" , response.url)
    fs.unlinkSync(Filepath);
    console.log(response);
    return response;
  
   } catch (error) {
   fs.unlinkSync(Filepath)
   return null;
   }
   }  
 

   export default fileupload;