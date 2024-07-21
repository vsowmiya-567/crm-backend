import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()


const connectDB = async()=>{
    const mongoURL = process.env.MONGODBCONNECTIONSTRING
    try {
        const connection = await mongoose.connect(mongoURL)
        console.log("MongoDB connected");
        return connection
    } catch (error) {
        console.log(error);
    }
}
export default connectDB;