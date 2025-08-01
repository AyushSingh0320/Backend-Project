import DBhandler from "../Utility/DBhandler.js";



const RegisterUser = DBhandler((req , res) => {
    res.status(200).json({
       message : "ok",
})
})


export default RegisterUser;