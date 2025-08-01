import DBhandler from "../Utility/DBhandler.js";



const RegisterUser = DBhandler( (req , res) => {
    console.log("routeee")
    const { username, Password , email , Fullname } =   req.body
     console.log(username)
     res.status(200).send("heyy")
   })


export default RegisterUser;