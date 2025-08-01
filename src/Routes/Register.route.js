import { Router } from "express";
import RegisterUser from "../Controllers.js/register.controller.js";

const route = Router();


route.route("/register").post(RegisterUser);



export default route ;
