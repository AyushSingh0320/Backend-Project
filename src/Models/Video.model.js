import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const Videoschema =  new mongoose.Schema(
    {
       videofile : [{
        type : string , // cloudinary (Same as AWS)
        required : true
       }],
       Thumbnail : 
       {
        type : string ,  // cloudinary (Same as AWS)
       required : true
       },
        Description : 
       {
        type : string , 
       required : true
       },
        Keywords : 
       {
        type : string , 
        required : true
       },
        title : 
       {
        type : string , 
        required : true
       },
       duration : {
        type : Number ,
        required : true
       },
       views : {
        type : Number ,
        default : 0
       },
       isPublished : {
        type : Boolean ,
        default : true
       },
       Owner : {
        type : Schema.Types.ObjectId,
        ref :   "User"
       }
    }
,
    {
        timestamps : true
    }
);



Videoschema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video" , Videoschema)