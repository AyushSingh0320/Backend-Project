import { Router } from "express";
import {Changecurrentpassword, Getcurrentuser, loginuser, Logoutuser, refreshaccessToken, RegisterUser, updateavatar, updatecoverimage, Updatecredentials} from "../Controllers.js/register.controller.js";
import { upload } from "../middleware/multer.MW.js";
import Auth from "../middleware/Auth.MW.js";
const route = Router();

// register route
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
// Login route
route.route("/login").post(loginuser);

// Secured route 

// Logout route

route.route("/logout").post(Auth , Logoutuser);

// Refresh-token route

route.route("/refresh-token").post(refreshaccessToken); 

// change-password route

route.route("/change-password").post(Auth , Changecurrentpassword)

// getting-user route 

route.route("/getuser").get(Auth , Getcurrentuser);

// update-user route

route.route("/update-user").put(Auth , Updatecredentials )

// Update-avatar route

route.route("/update-avatar").post(upload.single("avatar"), Auth , updateavatar
)

// update-coverimage route 

route.route("/update-avatar").post(upload.single("coverimage"), Auth , updatecoverimage
)


export default route ;
