// import { response } from "express";
import address from "../Models/addressSchema.js";
// import user from "../Models/userSchema.js";

//Function to Register New Address
export const addAddress = async(req,res)=>{

    const {
        fname,
        lname,
        streetAddress,
        city,
        state,
        zipcode,
        user_id,
        phone
    } = req.body

    try {

        if(!(fname || lname || streetAddress || city || state || zipcode || user_id ||phone)){
            return res.status(400).json({message:'Missing required fields'})
        }

        const addNewAddress = new address({
            fname,
            lname,
            streetAddress,
            city,
            state,
            zipcode,
            user_id,
            phone
        })
        
        await addNewAddress.save()
        res.status(200).json({message:"Address created",data:addNewAddress})
     
    } catch (error) {
        res.status(500).json(error.message)
    }
       
}