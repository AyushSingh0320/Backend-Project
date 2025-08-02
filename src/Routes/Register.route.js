import { Router } from "express";
import RegisterUser from "../Controllers.js/register.controller.js";
import { upload } from "../middleware/multer.MW.js";
const route = Router();


route.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        } , 
        {
            name : "coverimage",
            maxCount : 5
        }
    ]),
    RegisterUser
);



export default route ;
