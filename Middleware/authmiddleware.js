import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import user from '../Models/userSchema.js'
dotenv.config()

// const authMiddleware = async(req,res,next)=>{

//     const token = req.header('Authorization')
    
//     if(!token){
//         res.status(401).json({message:'Token is Missing'})
//     }
    
//     try {
//         // console.log(token);

//         const decoded= jwt.verify(token, process.env.JWT_SECRETKEY)

//         req.user= decoded
//         // console.log("req.user", req.user._id);
//         next()
//     } catch (error) {
//         res.status(401).json({message:'Invalid Token'})
        
//     }
// }

const authMiddleware =(role) => {
    return async (req, res, next) => {
            try {
                const token = req.header('Authorization')
 
                if (!token) {
                    res.status(401).json({ message: 'Token is Missing' })
                }
 
                const decoded = jwt.verify(token, process.env.JWT_SECRETKEY)

                // console.log("decoded",decoded); //here we get id only
 
                req.user = decoded
 
                // user logics
                // let user={
                //     role:"CUSTOMER"
                // }
                const isOldUser = await user.findById({_id:decoded._id})

                if(role != isOldUser.role){
                    res.status(401).json({ message: 'unauthorized' })
                }
                else{
                    next()
                }
 
            } catch (error) {
                    // console.log('Error:[validate token] ' + error)
                    res.status(400).json({ error: true, status: "error", message: "access denied to access this resource" })
            }
    }
}


export default authMiddleware;
