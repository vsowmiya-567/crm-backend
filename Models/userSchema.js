import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fname:{
        
            type:  String,
            require: true,
    },
    email:{
        type:  String,
        require: true,
        unique: true
        
    },
    phone:{
        type: Number,
        require: true
    },
    address:{
        type:String,
        require: true
    },
    password:{
        
            type:  String,
            require: true,
        },
    role:{
            type: String,
            default: "Employee"
        }
   })
    
        


const user = mongoose.model('users',userSchema)
export default user;