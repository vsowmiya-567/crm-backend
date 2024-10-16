import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './DBConnection/dbConfig.js'
import userRouter from './Routers/userRouter.js'
import addressRouter from './Routers/addressRouter.js'

const app = express()
const port = process.env.PORT
// app.use(cors({origin:"https://crms-clients.netlify.app"}))
// Enable CORS for all routes
app.use(cors({
    origin: "https://crms-clients.netlify.app", // Specify allowed origin(s) or use "*" for all
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Specify allowed HTTP methods
    preflightContinue: false, // Pass the CORS preflight request to the next handler
    optionsSuccessStatus: 204, // Some legacy browsers choke on 204
  }));
app.use(express.json())
app.use('/api',userRouter)
app.use('/api/address',addressRouter)
app.get('/',(req,res)=>{
    res.status(200).json({message:"Hello"})
})
connectDB()
app.listen(port,()=>{
    console.log("server started with port",port);
})