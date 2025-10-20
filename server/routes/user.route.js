import express, { Router } from 'express'
import { test, updatedUser } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router=express.Router()

router.get('/test',test)
router.put('/update/:id',verifyToken,updatedUser)

export default router