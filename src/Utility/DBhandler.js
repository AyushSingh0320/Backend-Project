const DBhandler = (Func) => {
    return  (req , res , next) => {
         Promise.resolve(Func(req , res , next)).catch((err) => next(err))
    }
}


export default DBhandler;


