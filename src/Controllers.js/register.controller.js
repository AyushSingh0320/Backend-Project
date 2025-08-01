import DBhandler from "../Utility/DBhandler.js";
import Apierror from "../Utility/Error.js";



const RegisterUser = DBhandler( (req , res) => {
    console.log("routeee")
    const { username, Password , email , Fullname } =   req.body
     console.log(username)
     if(username == "" || Password == "" || email == "" || Fullname == "" 
     ){
        throw new Apierror (400 , "All Information is Required ")
     }
   })


export default RegisterUser;