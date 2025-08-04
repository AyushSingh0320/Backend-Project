import jwt from "jsonwebtoken";
import DBhandler from "../Utility/DBhandler,js"
import Apierror from "../Utility/Error";
import { User } from "../Models/user.model";




const Auth = DBhandler(async (req , _ , next) => 
    {
       try {
         const token = req.cookies?.accessToken ||
         req.header("Authorization")?.replace("Bearer " , "");
 
         if(!token){
             throw new Apierror(401 , "Unauthorized Request")
         }
           
         const decodedtoken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);

         const user = await User.findById  (decodedtoken?._id).select("-Password -RefreshToken")

         if(!user){
            throw new Apierror(401 , "Invalod Access token" )
         }

         req.user = user;
         next()
         } catch (error) {
         throw new Apierror(401 , error?.message || "Invalid access Token")
         }
})

export default Auth;