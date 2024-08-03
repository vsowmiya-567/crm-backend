import user from "../Models/userSchema.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mail from "../Services/nodemailer.js";
import dotenv from 'dotenv'
import mongoose from "mongoose";
dotenv.config()


// Function to register New user
export const register_NewUser = async(req,res)=>{
    try {
        const { fname,email,password,phone,role,address} = req.body;

        if(!(fname ||email || password || phone || role ||address)){
            return res.status(400).json({message:"firstname,Semail and password,phone,role are required"})
        }

        const isExistingUser = await user.findOne({email})

        if(isExistingUser){
            return res.status(401).json({message:'User already exist!'})
        }

        const hashPassword = await bcrypt.hash(password,10)

        const newUser = new user({
            fname,
            email,
            password:hashPassword,
            phone,
            role,
            address

        })
        await newUser.save()
        return res.status(200).json({
            status: 'true',
            message:`New User ${newUser.fname} 
                     Registered Successfully`,
            data:newUser
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

//Function to login for registered user
export const login_User = async(req,res)=>{
    try {
        const {email,password} = req.body
        
        const oldUsers = await user.findOne({email:email})


        if(!oldUsers){
            // console.log("email",email);
            // console.log(password);
            return res
            .status(401)
            .json({status:'false',message:"user not exist"})
        }

        const isPasswordMatch = await bcrypt.compare(password,oldUsers.password)

        // console.log("pass",isPasswordMatch);

        if(!isPasswordMatch){
            return res.status(401).json({message:"invalid user password"})
        }

        const token = jwt.sign({_id:oldUsers._id},process.env.JWT_SECRETKEY)

        // console.log(token);

        res.status(200).json({status:'true', message:"Login Successfully",token:token})

    } catch (error) {
        res.status(500).json(error.message)
    }
}

//Function to user forgetPassword
export const forget_Password = async(req,res)=>{
    try {
        const {email} = req.body

        const oldUser = await user.findOne({email})

        // console.log(oldUser,email);

        if(!oldUser){
            return res.status(401).json({message:"User Not Exist!!"})
        }

        const token = await jwt.sign({email:oldUser.email,_id:oldUser._id},
                      process.env.JWT_SECRETKEY,{expiresIn:'30m'})

        const link = `http://localhost:3000/confirmpsw/${oldUser._id}/${token}`

        await mail(email,link)

        return res.status(200).json({status:'true',message:"Reset link is sent to your Mail,Please check it",token:token,id:oldUser._id})
        // console.log("link----",link);

    } catch (error) {
        res.status(500).json(error.message) 
    }
}

//Function to user reset the password 
export const reset_Passwords = async(req,res)=>{

    try {
        const {id,token} = req.params

        // console.log("req",req.params);
        // console.log('id',id,'token',token);

        const newPassword = req.body.newPassword

        // console.log("newPassword",newPassword);

        const oldUser = await user.findOne({_id:id})

        // console.log("oldUser",oldUser);

        if(!oldUser){
            return res.status(401).json({message:"User Not Exist!!"})
        }

        try {
            
            const decode = jwt.verify(token,process.env.JWT_SECRETKEY)
            
            // console.log("decode",decode);

            if(!decode){
                return res.status(401).json({message:'token is missing'})
            }

            const hashPassword = await bcrypt.hash(newPassword,10)

            // console.log('hash',hashPassword);
    
            await user.findByIdAndUpdate({_id:id},{$set:{password:hashPassword}})

            return res.status(200).json({status:'true',message:"password updated"})

        } catch (error) {
            res.status(500).json(error)
            // console.log(error);

        }

    } catch (error) {
        res.status(500).json(error.message)
    }
}

//Function to get all  userData by admin
export const allUser_Datas = async(req,res)=>{
    try {
        // const UserId = req.user._id

        // const users = await user.findOne({_id:UserId})

        const users = await user.find()

        if(users){
            return res.status(200).json({status:'SUCCESS',message:"user Details",data:users})
        }else{
            return res.status(401).json({message:"user not found"})
        }

    } catch (error) {
        res.status(500).json({message:"Error in get user Data"})
  
    }
}

//Function to get particular userData by authentication
export const userDatas = async(req,res)=>{
    try {
        const UserId = req.user._id

        const users = await user.findOne({_id:UserId})

        if(users){
            return res.status(200).json({status:'SUCCESS',message:"user Details",data:users})
        }else{
            return res.status(401).json({message:"user not found"})
        }

    } catch (error) {
        res.status(500).json({message:"Error in get user Data"})
  
    }
}

//Function to aggregate the user and address collections by authentication
export const joinTheCollection = async(req,res)=>{

    try {
        const userId = req.user._id

        // console.log('userId',userId);

        const isOldUser = await user.findById({_id:userId})

        // console.log('olduser',isOldUser);

        if(!isOldUser){
            return res.status(200).json({message:"User not Exist"})
        }

        const result = await user.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(isOldUser._id)
                }
            
            },
            {
                $lookup:{
                    from:"addresses",
                    localField:'_id',
                    foreignField:'user_id',
                    as:'Address Details'
                }
            }
        ])
        res.status(200).json({status:'SUCCESS',message:'Details',data:result})
        // console.log(result);
    } catch (error) {
        res.status(500).json(error.message)
    }
}

//Function for add customer data to db by admin
export const addUserData = async(req,res)=>{

    try {
        const {fname,email,phone,address } = req.body

        const existingUser = await user.find({email})

        // console.log("existinguser",existingUser);

        if(existingUser.length != 0){
            return res.status(200).json({message:"user already Added"})
        }

        const newUser = new user({
            fname,
            email,
            phone,
            address
        })

        await newUser.save()
        
        let totalUser = await user.find({}) 


        console.log("total",totalUser);

        return res.status(200).json({status:'true',message:'User Added successfully',total:totalUser.length,data:newUser})
        
    } catch (error) {
        res.status(500).json(error.message)
    }
}

//Function for update added user data from db by admin
export const updateUserData = async(req,res)=>{
    try {
        const {fname,phone,email,address} = req.body
        const id = req.params.id

        console.log(id);

        const existingUser = await user.findById(id)
        // console.log("existinguser",existingUser);
        // console.log(existingUser._id);

        if(!existingUser){
            return res.status(200).json({message:'user not exist!'})
        }
             
         const updateData = await user.findByIdAndUpdate(
            (existingUser._id),
            {
                $set: {
                    fname: fname,
                    email: email,
                    phone: phone,
                    address: address
                }
            },
        );
        
        // if(updateData){
        //     return console.log("success");
        // }

        await updateData.save()

        return res.status(200).json({
            status:'true',message:'User Detail updated successfully'
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}
//Function to get user data by id from db
export const getById = async(req,res)=>{
    const id = req.params.id
    const userData = await user.findById({_id:id})
    // console.log(userData);
    return res.status(200).json({status:'true', data:userData})
}

//Function to read all data from db
export const getAllUserData = async(req,res)=>{
    try {
        const allDatas = await user.find()

        return res.status(200).json({status:'true',message:'All user Datas',data:allDatas})

    } catch (error) {
        res.status(400).json({status:'FAILED',error:error})
    }
}

//Function to delete data from db
export const deleteUserData = async(req,res)=>{
    try {
        const id = req.params.id
        // console.log("id",id);
        const isOldUser = await user.findById(id)        
        // console.log(isOldUser._id);
        const deleteData = await user.findByIdAndDelete({_id:isOldUser._id})      
        
        return res.status(200).json({
            status:'true',message:'User Data Deleted successfully'
        })

    } catch (error) {
        res.status(400).json({status:'false',error:error.message})
    }
}