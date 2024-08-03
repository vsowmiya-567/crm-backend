import express from 'express'

import { register_NewUser,login_User ,forget_Password,reset_Passwords, 
     addUserData, updateUserData,
     getAllUserData,
     deleteUserData,
     getById} from '../Controllers/userController.js';

import authMiddleware from '../Middleware/authmiddleware.js';

const router = express.Router()

router.post('/register',register_NewUser)
router.post('/login',login_User)
router.post('/forget-password',forget_Password)
router.post('/reset-passwords/:id/:token',reset_Passwords)
// router.get('/getalluserdatas',authMiddleware("admin"),allUser_Datas)
// router.get('/getdatas',authMiddleware("customer"),userDatas)
// router.get('/getaddress',authMiddleware("customer"),joinTheCollection)
router.post('/adduserdata',authMiddleware("Admin"),addUserData)
router.put('/update/:id',authMiddleware("Admin"),updateUserData)
router.get('/getall',authMiddleware("Admin"),getAllUserData)
router.get('/getby/:id',authMiddleware("Admin"),getById)
router.delete('/deletedata/:id',authMiddleware("Admin"),deleteUserData)

export default router;