import DBhandler from "../Utility/DBhandler.js";
import Apierror from "../Utility/Error.js";
import { User } from "../Models/user.model.js";
import fileupload from "../Utility/Cloudinary.js";
import ApiResponse from "../Utility/Response.js";
import jwt from "jsonwebtoken";


// Method for access token 

   const generateaccessTokenMethod = async (userID) => {
      try {
         const user = await User.findById(userID);
         const accessToken  = user.generateaccessToken();
         return accessToken;
   } catch (error) {
         throw new Apierror (500 , "something went wrong while generating access token")
      }
   };

//Method for refresh Token

   const generaterefreshTokenMethod = async(userID) => {
   try {
   const user = await User.findById(userID);
   const RefreshToken = user.generaterefreshToken();
   user.RefreshToken =  RefreshToken;
   await user.save({validateBeforeSave: false})
   return RefreshToken;
   } catch (error) {
    throw new Apierror (500 , "something went wrong while generating refresh token") 
   }
   };


// Method for Registering the user 

const RegisterUser = DBhandler( async (req , res) =>{
   //  console.log("routeee")
    const { username, Password , email , Fullname } =   req.body
   //   console.log(username)
   //   console.log(req.body)
     if(!username || !Password || !email || !Fullname){
      throw new Apierror (405 , "All data is required ")
     }
     if(username.trim() === "" || Password.trim() === "" || email.trim() === "" || Fullname.trim() === "" 
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
   //  console.log(req.files);
    if(!avatarpath || !coverimagepath){
    throw new Apierror(402 , "Avatar and coverimage is required")
    }
   //  console.log(avatarpath);
   //  console.log(coverimagepath);
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
  
    const userexistance = await User.findById(userData._id).select("-Password -RefreshToken").lean();

    if(!userexistance){
    throw new Apierror(500 , "Something went wrong while registering the user")
    }

    return res.status(200).json(
    new ApiResponse(200 , userexistance , "User Register successfully")
    )
   });

//Method for Login

const loginuser = DBhandler(async (req , res) => {
    // take a data from req.body 
    // check that you got username or email
    // check user exist
    // password check  
    // if exist give access token to user 
    // send response 
   
   const { email , username , Password} = req.body
   
   if (!email && !username) {
      throw new Apierror(404 , "Email or username is required")
   };
   if (!Password) {
      throw new Apierror (404 , "Password is required")
   };
 const existanceofuser = await User.findOne({
   $or : [{username} , {email}]
 })
 
if(!existanceofuser){
   throw new Apierror(406 , "User doesn't exist")
}

const isPasswordvalid = await existanceofuser.ispasswordcorect(Password)

if(!isPasswordvalid) {
   throw new Apierror (401 , "Password incorrect")
}

const accessToken = await generateaccessTokenMethod(existanceofuser._id);
const RefreshToken = await generaterefreshTokenMethod(existanceofuser._id);

const LoggedInUser = await User.findById(existanceofuser._id).select("-Password -RefreshToken")

const options = {
   HTMLonly : true,
   Secure : true
}
return res
       .status(200)
       .cookie("accessToken" , accessToken , options)
       .cookie("RefreshToken" , RefreshToken , options)
       .json(
         new ApiResponse(
            200 , 
            {
              user : LoggedInUser , accessToken ,RefreshToken
            },
            "User logged In seccessfully"
        )
      )
});
 
// Method for logout 

const Logoutuser = DBhandler(async (req , res) => {
   await User.findByIdAndUpdate(req.user._id ,
      {
         $set : {
             RefreshToken : undefined
         }

      },
      {
         new : true
      }
   );

   const options = {
   HTMLonly : true,
   Secure : true
  }

  return res
  .status(200)
  .clearCookie("accessToken" , options)
  .clearCookie("RefreshToken" , options)
  .json(new ApiResponse(200 , {} , "User logged out"))
});

// Method for providing access token to user

const refreshaccessToken = DBhandler(async (req ,res ) => {
   const TakingRefreshTokenforGeneratingAccessToken = req.cookies.RefreshToken || req.body.RefreshToken

   if(!TakingRefreshTokenforGeneratingAccessToken){ throw new Apierror(401 , "unauthorized request")};

   const decodetoken = jwt.verify(TakingRefreshTokenforGeneratingAccessToken , process.env.REFRESH_TOKEN_SECRET)

   if(!decodetoken){
      throw new Apierror(403 , "Invalid Refresh Token")
   }

   const ID = decodetoken?._id 

   const user = await User.findById(ID);

   if(!user) {
      throw new Apierror (402 , "Refresh token is not valid")
   }

   if(TakingRefreshTokenforGeneratingAccessToken !== user.RefreshToken){
      throw new Apierror(402 , "Refresh token is expired or used")
   }

  const accessToken = generateaccessTokenMethod(user._id)
  const RefreshToken = generaterefreshTokenMethod(user._id)

  const options = {
   httpOnly : true,
   Secure : true
}

return res.status(200)
          .cookie("accessToken" , accessToken , options)
          .cookie("RefreshToken" , RefreshToken , options)
          .json(
            new ApiResponse(202 , 
               {
                  accessToken,
                  RefreshToken
               },
               "Access token refreshed"
            )
          )






})
// Method for changing Password 

const Changecurrentpassword = DBhandler(async (req , res) => {
   const {oldpassword , newPassword} = req.body
   if(oldpassword == newPassword){
      throw new Apierror(408 , "your previous password and current is same")
   }
   if(!newPassword){
      throw new Apierror(408 , "new password required")
   }
   const user = await User.findById(req.user._id)
   console.log(user);
   
   if(!user){
      throw new Apierror(404 , "Unauthorized request")
   }
 
   const ispasswordcorect = await user.ispasswordcorect(oldpassword)
   if(!ispasswordcorect){
      throw new Apierror(404 , "Invalid Old Password")
   }

 user.Password = newPassword
  await user.save({validateBeforeSave : false})

  return res.status(200)
            .json(new ApiResponse(200 , {} , "Your Password change Successfully"))

});

// Method for getting current user

const Getcurrentuser = DBhandler( async (req, res)=> {
return  res.status(200)
           .json(new ApiResponse(200 , req.user, "User fetches successfully"))
})
 

// Method for updating user 

const Updatecredentials = DBhandler (async (req , res) => {
   const {Fullname , email} = req.body

   if(!Fullname || !email){
      throw new Apierror(200 , "Fullname or username is requiredd")
   }
  const user = await User.findByIdAndUpdate(req.user?._id ,
   {
      $set : {
         Fullname,
         email
      }
   },
   {new : true}
  )
    const userdata = await User.findById(user._id).select("-Password")

    return res.status(200)
             .json(new ApiResponse(200 , userdata , "updated seccessfully"))
})

// Method for updating Avatar 

const updateavatar = DBhandler (async (req ,res ) => {
  const avatarlocalpath = req.file?.path
  if(!avatarlocalpath){
   throw new Apierror(404 , "Avatar is missing")
  }
  const avatar = await fileupload(avatarlocalpath)
 console.log(avatar);

 const user = User.findByIdAndUpdate(req.user._id ,
   {
      $set : {
         avatar : avatar.url
      }
   } , 
   {new : true}.select("-Password")
 )

return res.status(200)
           .json(new ApiResponse(200 , user , "Avatar changes seccessfully"))





})






export  {
   RegisterUser,
   loginuser,
   Logoutuser,
   refreshaccessToken,
   Changecurrentpassword,
   Getcurrentuser,
   Updatecredentials,
    updateavatar
};
