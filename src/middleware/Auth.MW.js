import DBhandler from "../Utility/DBhandler,js"
import Apierror from "../Utility/Error";




const Auth = DBhandler(async (req , res , next) => 
    {
        const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer " , "");

        if(!token){
            throw new Apierror()
        }

})





export default Auth