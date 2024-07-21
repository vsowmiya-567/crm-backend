import express from 'express'
import { addAddress } from '../Controllers/addressController.js'

const router = express.Router()

router.post('/createaddress',addAddress)

export default router;