import DBhandler from "../Utility/DBhandler.js";
import Apierror from "../Utility/Error.js";
import { User } from "../Models/user.model.js";
import fileupload from "../Utility/Cloudinary.js";
import ApiResponse from "../Utility/Response.js";


const RegisterUser = DBhandler( async (req , res) => {
    console.log("routeee")
    const { username, Password , email , Fullname } =   req.body
     console.log(username)
     if(username == "" || Password == "" || email == "" || Fullname == "" 
     ){
        throw new Apierror (400 , "All Information is Required ")
     }

     const existeduser = await User.findOne({
      $or : [{username} , {email}]
     })
     if(existeduser){
      throw new Apierror(409 , "User with this email or username already exist")
     }
    const avatarpath =  req.files?.avatar[0]?.path;
    const coverimagepath = req.files?.coverimage[0]?.path;
    if(!avatarpath || !coverimagepath){
   throw new Apierror(402 , "Avatar and coverimage is required")
   }
  const avatar = await fileupload(avatarpath);
  const coverimage = await fileupload(coverimagepath);

  if(!avatar || !coverimage){
    throw new Apierror(402 , "Avatar and coverimage is required")
  }
  
  const userData = await User.create({
     Fullname,
     avatar : avatar.url,
     coverimage : coverimage.url,
     email,
     Password,
     username : username.toLowerCase()
  })
  
const userexistance = User.findById(userData._id).select("-Password -RefreshToken");

if(!userexistance){
   throw new Apierror(500 , "Something went wrong while registering the user")
}

return res.status(200).json(
   new ApiResponse(200 , userexistance , "User Register successfully")
)
})
export default RegisterUser;