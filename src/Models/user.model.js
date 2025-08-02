import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
    {
   username : {
    type : String ,
    require : true ,
    unique : true ,
    lowercase : true , 
    trim : true , 
    index : true ,
    },
    Password : {
        type : string, 
        require : true ,
        unique : true , 
        trim : true ,
    },
       email : {
        type : string, 
        require : true ,
        unique : true , 
        trim : true ,
    },
       Fullname : {
        type : string, 
        require : true ,
        trim : true ,
    }, 
    avatar : {
        type : String , // here we are going to use cloudinary that is similar to Aws 
        require : true ,
    },
      coverimage : {
        type : String , // here we are going to use cloudinary that is similar to Aws 
        require : true ,
    },
     watchHistory : [{
       type : Schema.Types.ObjectId,
       ref : "Video"
     }] ,
     RefreshToken : {
      type : String ,
      
     }
    },
    {
        timestamps : true
    }
)

UserSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return next();
        this.Password = await bcrypt.hash(this.Password , 8) ;
        next()
})
UserSchema.methods.ispasswordcorect = async function (password) {
  const passresult = await bcrypt.compare(password , this.password)
  return passresult ;
  }

  UserSchema.methods.generateaccessToken = function (){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username :  this.username
        },
        process.env.ACCESS_TOKEN_SECRET ,
        {
          expiresIn : process.env.REFRESH_TOKEN_EXP
        }

     )
  }
  UserSchema.methods.generaterefreshToken = function () {
  return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET ,
        {
          expiresIn : process.env.REFRESH_TOKEN_EXP
        }

     )
  }

export const User = mongoose.model("User" , UserSchema)