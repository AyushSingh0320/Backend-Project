import { Router } from "express";
import {loginuser, Logoutuser, refreshaccessToken, RegisterUser} from "../Controllers.js/register.controller.js";
import { upload } from "../middleware/multer.MW.js";
import Auth from "../middleware/Auth.MW.js";
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

route.route("/login").post(loginuser);

// Secured route 

route.route("/logout").post(Auth , Logoutuser);

route.route("/refresh-token").post(refreshaccessToken);



export default route ;
