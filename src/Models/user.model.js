import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config({path : "./.env"})


const UserSchema = new mongoose.Schema(
    {
   username : {
    type : String ,
    required : true ,
    unique : true ,
    lowercase : true , 
    trim : true , 
    index : true ,
    },
    Password : {
        type : String, 
        required : true ,
        unique : true , 
        trim : true ,
    },
       email : {
        type : String, 
        required : true ,
        unique : true , 
        trim : true ,
    },
       Fullname : {
        type : String, 
        required : true ,
        trim : true ,
    }, 
    avatar : {
        type : String , // here we are going to use cloudinary that is similar to Aws 
        required : true ,
    },
      coverimage : {
        type : String , // here we are going to use cloudinary that is similar to Aws 
        required : true ,
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
    if(!this.isModified("Password")) return next();
        this.Password = await bcrypt.hash(this.Password, 8) 
        next()
})
UserSchema.methods.ispasswordcorect = async function (password) {
  const passresult = await bcrypt.compare(password , this.Password)
  return passresult ;
  }

  UserSchema.methods.generateaccessToken = function (){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username :  this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn : process.env.ACCESS_TOKEN_EXP
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