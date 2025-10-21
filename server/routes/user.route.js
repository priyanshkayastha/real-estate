import express, { Router } from 'express'
import { deleteUser, test, updatedUser } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router=express.Router()

router.get('/test',test)
router.put('/update/:id',verifyToken,updatedUser)
router.delete('/delete/:id',verifyToken,deleteUser)

export default router