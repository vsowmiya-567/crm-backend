import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    streetAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    }, 
    zipcode: {
        type: String,
        required: true
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    phone:{
        type: Number,
        required: true
    }

})

const address = mongoose.model("address",addressSchema)
export default address;
