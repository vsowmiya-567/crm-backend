import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import user from '../Models/userSchema.js'
dotenv.config()

const authMiddleware = (role)=>{
   return async (req, res, next) => {
            try {
                const token = req.headers.authorization.split(" ")[1]
                // console.log(req.headers);
                // const token = req.headers.token
                console.log('-------token-------',token);
 
                if (!token) {
                    res.status(401).json({ message: 'Token is Missing' })
                }
 
                const decoded = jwt.verify(token, process.env.JWT_SECRETKEY)

                // console.log("decoded",decoded); //here we get id only
 
                req.user = decoded
 
                const isOldUser = await user.findById({_id:decoded._id})
                // console.log('isOldUser',isOldUser);
                if(role != isOldUser.role){
                    res.status(401).json({ message: 'Unauthorized' })
                }
                else{
                    next()
                }
 
            } catch (error) {
                    res.status(400).json({ error: true, status: "error", message: "access denied to access this resource" })
            }
    }
}



export default authMiddleware;
